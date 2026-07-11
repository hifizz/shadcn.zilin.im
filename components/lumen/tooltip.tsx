"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

type BubbleSide = "top" | "bottom" | "left" | "right"

/**
 * Tail geometry knobs:
 * - `aw` / `ah`: half-width and height of the ideal triangle.
 * - `flare`: how far the tail's root bows outward (concave) into the panel.
 * - `tip`: radius that rounds the tail's point (convex).
 * - `radius`: the panel's corner radius.
 */
type TailGeometry = {
  aw: number
  ah: number
  flare: number
  tip: number
  radius: number
}

const DEFAULT_TAIL_GEOMETRY: TailGeometry = {
  aw: 4,
  ah: 6,
  flare: 2,
  tip: 1,
  radius: 8,
}

const TAIL_EDGE_FOR_SIDE: Record<BubbleSide, BubbleSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
}

const ALONG: Record<BubbleSide, [number, number]> = {
  top: [1, 0],
  right: [0, 1],
  bottom: [-1, 0],
  left: [0, -1],
}
const OUTWARD: Record<BubbleSide, [number, number]> = {
  top: [0, -1],
  right: [1, 0],
  bottom: [0, 1],
  left: [-1, 0],
}

type Vec = readonly [number, number]

const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]]
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1]]
const scale = (a: Vec, s: number): Vec => [a[0] * s, a[1] * s]

/**
 * Base UI writes `--transform-origin` on the positioner as the anchor's
 * projection onto the popup — exactly where the tail should point. Its format
 * is side-dependent: `"<x>px <y>"` for top/bottom, `"<x> <y>px"` for left/right
 * (the off-axis value is a `calc()`), so we read the plain px on the tail axis.
 */
function parseTailAlong(
  transformOrigin: string,
  side: string | null
): number | undefined {
  const horizontal = side === "top" || side === "bottom"
  const match = horizontal
    ? transformOrigin.match(/^\s*(-?[\d.]+)px/)
    : transformOrigin.match(/(-?[\d.]+)px\s*$/)
  return match ? parseFloat(match[1]) : undefined
}

/**
 * Draws the whole popup (rounded body + tail) as a single closed SVG path so
 * the tail blends into the body with a continuous curve instead of the hard
 * seam a separately-rotated arrow square leaves behind: a concave bezier
 * flares the tail's root into the panel, then a circular arc rounds its tip.
 */
function buildBubblePath(
  width: number,
  height: number,
  tailEdge: BubbleSide,
  geo: TailGeometry,
  tailAlong?: number
) {
  const { aw, ah, flare, tip } = geo
  const r = Math.max(
    0,
    Math.min(geo.radius, width / 2 - aw - 1, height / 2 - aw - 1)
  )

  const ox = tailEdge === "left" ? ah : 0
  const oy = tailEdge === "top" ? ah : 0

  const corners = {
    tl: [ox, oy] as Vec,
    tr: [ox + width, oy] as Vec,
    br: [ox + width, oy + height] as Vec,
    bl: [ox, oy + height] as Vec,
  }

  // Where the tail sits along its edge. Defaults to centered, but when a
  // `tailAlong` (the anchor's projection onto this edge) is supplied, the tail
  // tracks the trigger — clamped so its flared base stays off the corners.
  const isHorizontal = tailEdge === "top" || tailEdge === "bottom"
  const sideLen = isHorizontal ? width : height
  const margin = r + aw + flare
  const along =
    tailAlong == null || sideLen - 2 * margin <= 0
      ? sideLen / 2
      : Math.min(Math.max(tailAlong, margin), sideLen - margin)

  const mid: Record<BubbleSide, Vec> = {
    top: [ox + along, oy],
    right: [ox + width, oy + along],
    bottom: [ox + along, oy + height],
    left: [ox, oy + along],
  }

  const a = ALONG[tailEdge]
  const o = OUTWARD[tailEdge]
  const m = mid[tailEdge]

  const len = Math.hypot(aw, ah) || 1
  // Unit direction from each root shoulder toward the apex.
  const dirRight = scale(add(scale(a, aw), scale(o, ah)), 1 / len)
  const dirLeft = scale(add(scale(a, -aw), scale(o, ah)), 1 / len)

  const apex = add(m, scale(o, ah))
  const rootRight = sub(m, scale(a, aw))
  const rootLeft = add(m, scale(a, aw))

  const tipCut = Math.min((tip * ah) / Math.max(aw, 1e-4), len * 0.6)
  const flareRun = Math.max(0, Math.min(flare, len - tipCut - 2))

  const tRight = sub(apex, scale(dirRight, tipCut))
  const tLeft = sub(apex, scale(dirLeft, tipCut))
  const sRight = add(rootRight, scale(dirRight, flareRun))
  const sLeft = add(rootLeft, scale(dirLeft, flareRun))
  const eRight = sub(m, scale(a, aw + flare))
  const eLeft = add(m, scale(a, aw + flare))

  const c1 = flare * 0.55
  const c2 = flareRun * 0.55

  const f = (n: number) => Number(n.toFixed(2))
  const pt = (p: Vec) => `${f(p[0])} ${f(p[1])}`

  const segments: string[] = [`M ${pt([corners.tl[0] + r, corners.tl[1]])}`]

  const withTail = (edge: BubbleSide, straightEnd: Vec) => {
    if (tailEdge === edge) {
      segments.push(`L ${pt(eRight)}`)
      segments.push(
        `C ${pt(add(eRight, scale(a, c1)))} ${pt(sub(sRight, scale(dirRight, c2)))} ${pt(sRight)}`
      )
      segments.push(`L ${pt(tRight)}`)
      segments.push(`A ${f(tip)} ${f(tip)} 0 0 1 ${pt(tLeft)}`)
      segments.push(`L ${pt(sLeft)}`)
      segments.push(
        `C ${pt(sub(sLeft, scale(dirLeft, c2)))} ${pt(sub(eLeft, scale(a, c1)))} ${pt(eLeft)}`
      )
    }
    segments.push(`L ${pt(straightEnd)}`)
  }

  withTail("top", [corners.tr[0] - r, corners.tr[1]])
  segments.push(
    `Q ${pt(corners.tr)} ${pt([corners.tr[0], corners.tr[1] + r])}`
  )

  withTail("right", [corners.br[0], corners.br[1] - r])
  segments.push(
    `Q ${pt(corners.br)} ${pt([corners.br[0] - r, corners.br[1]])}`
  )

  withTail("bottom", [corners.bl[0] + r, corners.bl[1]])
  segments.push(
    `Q ${pt(corners.bl)} ${pt([corners.bl[0], corners.bl[1] - r])}`
  )

  withTail("left", [corners.tl[0], corners.tl[1] + r])
  segments.push(
    `Q ${pt(corners.tl)} ${pt([corners.tl[0] + r, corners.tl[1]])}`
  )

  segments.push("Z")

  const viewWidth = width + (tailEdge === "left" || tailEdge === "right" ? ah : 0)
  const viewHeight = height + (tailEdge === "top" || tailEdge === "bottom" ? ah : 0)

  return { d: segments.join(" "), viewWidth, viewHeight }
}

function TooltipBubble({
  side,
  size,
  geometry,
  tailAlong,
}: {
  side: BubbleSide
  size: { width: number; height: number }
  geometry: TailGeometry
  tailAlong?: number
}) {
  const { d, viewWidth, viewHeight } = React.useMemo(
    () =>
      buildBubblePath(
        size.width,
        size.height,
        TAIL_EDGE_FOR_SIDE[side],
        geometry,
        tailAlong
      ),
    [size.width, size.height, side, geometry, tailAlong]
  )

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "absolute inset-0 hidden size-full",
        side === "top" && "group-data-[side=top]:block",
        side === "bottom" && "group-data-[side=bottom]:block",
        side === "left" &&
          "group-data-[side=left]:block group-data-[side=inline-start]:block",
        side === "right" &&
          "group-data-[side=right]:block group-data-[side=inline-end]:block"
      )}
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      preserveAspectRatio="none"
    >
      <path d={d} className="fill-foreground" />
    </svg>
  )
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  tail,
  panelSize,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    /** Override the tail/panel geometry. Merged over the defaults. */
    tail?: Partial<TailGeometry>
    /** Force a fixed panel size instead of sizing to the content. */
    panelSize?: { width: number; height: number }
  }) {
  const geometry = React.useMemo(
    () => ({ ...DEFAULT_TAIL_GEOMETRY, ...tail }),
    [tail]
  )

  const [measureNode, setMeasureNode] = React.useState<HTMLDivElement | null>(
    null
  )
  const [size, setSize] = React.useState<{
    width: number
    height: number
  } | null>(null)

  React.useLayoutEffect(() => {
    if (!measureNode) return

    const updateSize = () =>
      setSize({
        width: measureNode.offsetWidth,
        height: measureNode.offsetHeight,
      })

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(measureNode)
    return () => observer.disconnect()
  }, [measureNode])

  // Track the tail to the anchor: Base UI repositions the popup (incl. collision
  // shift) and records the anchor's projection in `--transform-origin` on the
  // positioner. We read it so the tail points at the trigger rather than the
  // panel's centre. Reading the inline style attribute forces no reflow.
  const [positionerNode, setPositionerNode] =
    React.useState<HTMLDivElement | null>(null)
  const [tailAlong, setTailAlong] = React.useState<number | undefined>(undefined)

  React.useLayoutEffect(() => {
    if (!positionerNode) return

    const readTailAlong = () => {
      const origin = positionerNode.style.getPropertyValue("--transform-origin")
      if (!origin) return
      setTailAlong(parseTailAlong(origin, positionerNode.getAttribute("data-side")))
    }

    readTailAlong()

    const observer = new MutationObserver(readTailAlong)
    observer.observe(positionerNode, {
      attributes: true,
      attributeFilter: ["style", "data-side"],
    })
    return () => observer.disconnect()
  }, [positionerNode])

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        ref={setPositionerNode}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "group relative z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) text-xs text-background duration-150 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=top]:slide-in-from-bottom-1 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=inline-start]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=inline-end]:slide-in-from-left-1 data-[side=top]:data-closed:slide-out-to-bottom-1 data-[side=bottom]:data-closed:slide-out-to-top-1 data-[side=left]:data-closed:slide-out-to-right-1 data-[side=inline-start]:data-closed:slide-out-to-right-1 data-[side=right]:data-closed:slide-out-to-left-1 data-[side=inline-end]:data-closed:slide-out-to-left-1",
            className
          )}
          {...props}
        >
          {size && (
            <>
              <TooltipBubble
                side="top"
                size={size}
                geometry={geometry}
                tailAlong={tailAlong}
              />
              <TooltipBubble
                side="bottom"
                size={size}
                geometry={geometry}
                tailAlong={tailAlong}
              />
              <TooltipBubble
                side="left"
                size={size}
                geometry={geometry}
                tailAlong={tailAlong}
              />
              <TooltipBubble
                side="right"
                size={size}
                geometry={geometry}
                tailAlong={tailAlong}
              />
            </>
          )}
          <div
            style={{ "--tail-ah": `${geometry.ah}px` } as React.CSSProperties}
            className="relative group-data-[side=top]:pb-[var(--tail-ah)] group-data-[side=bottom]:pt-[var(--tail-ah)] group-data-[side=left]:pr-[var(--tail-ah)] group-data-[side=inline-start]:pr-[var(--tail-ah)] group-data-[side=right]:pl-[var(--tail-ah)] group-data-[side=inline-end]:pl-[var(--tail-ah)]"
          >
            <div
              ref={setMeasureNode}
              style={
                panelSize
                  ? { width: panelSize.width, height: panelSize.height }
                  : undefined
              }
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 has-data-[slot=kbd]:pe-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-lg",
                panelSize && "justify-center overflow-hidden"
              )}
            >
              {children}
            </div>
          </div>
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  DEFAULT_TAIL_GEOMETRY,
}
export type { TailGeometry }
