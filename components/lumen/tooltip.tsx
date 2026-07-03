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

const BUBBLE_RADIUS = 10
const TAIL_LENGTH = 8
const TAIL_HALF_BASE = 6
const TAIL_TIP_ROUND = 3
const CIRCLE_K = 0.5522847498

const TAIL_EDGE_FOR_SIDE: Record<BubbleSide, BubbleSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
}

/**
 * Draws the whole popup (rounded body + tail) as a single closed SVG path so
 * the tail blends into the body with a continuous curve instead of the
 * hard seam a separately-rotated arrow square leaves behind.
 */
function buildBubblePath(width: number, height: number, tailEdge: BubbleSide) {
  const r = Math.max(
    2,
    Math.min(
      BUBBLE_RADIUS,
      width / 2 - TAIL_HALF_BASE - 2,
      height / 2 - TAIL_HALF_BASE - 2
    )
  )
  const halfBase = Math.max(
    2,
    Math.min(TAIL_HALF_BASE, width / 2 - r - 1, height / 2 - r - 1)
  )
  const k = r * CIRCLE_K

  const ox = tailEdge === "left" ? TAIL_LENGTH : 0
  const oy = tailEdge === "top" ? TAIL_LENGTH : 0

  const corners = {
    tl: [ox, oy] as const,
    tr: [ox + width, oy] as const,
    br: [ox + width, oy + height] as const,
    bl: [ox, oy + height] as const,
  }

  const along: Record<BubbleSide, [number, number]> = {
    top: [1, 0],
    right: [0, 1],
    bottom: [-1, 0],
    left: [0, -1],
  }
  const outward: Record<BubbleSide, [number, number]> = {
    top: [0, -1],
    right: [1, 0],
    bottom: [0, 1],
    left: [-1, 0],
  }
  const mid: Record<BubbleSide, [number, number]> = {
    top: [ox + width / 2, oy],
    right: [ox + width, oy + height / 2],
    bottom: [ox + width / 2, oy + height],
    left: [ox, oy + height / 2],
  }

  const a = along[tailEdge]
  const o = outward[tailEdge]
  const m = mid[tailEdge]

  const s1: [number, number] = [
    m[0] - a[0] * halfBase,
    m[1] - a[1] * halfBase,
  ]
  const s2: [number, number] = [
    m[0] + a[0] * halfBase,
    m[1] + a[1] * halfBase,
  ]
  const tip: [number, number] = [
    m[0] + o[0] * TAIL_LENGTH,
    m[1] + o[1] * TAIL_LENGTH,
  ]

  const c1: [number, number] = [
    s1[0] + a[0] * halfBase * 0.6,
    s1[1] + a[1] * halfBase * 0.6,
  ]
  const c2: [number, number] = [
    tip[0] - a[0] * TAIL_TIP_ROUND - o[0] * TAIL_TIP_ROUND,
    tip[1] - a[1] * TAIL_TIP_ROUND - o[1] * TAIL_TIP_ROUND,
  ]
  const c3: [number, number] = [
    tip[0] + a[0] * TAIL_TIP_ROUND - o[0] * TAIL_TIP_ROUND,
    tip[1] + a[1] * TAIL_TIP_ROUND - o[1] * TAIL_TIP_ROUND,
  ]
  const c4: [number, number] = [
    s2[0] - a[0] * halfBase * 0.6,
    s2[1] - a[1] * halfBase * 0.6,
  ]

  const pt = (p: readonly [number, number]) => `${p[0]},${p[1]}`

  const segments: string[] = [`M ${pt([corners.tl[0] + r, corners.tl[1]])}`]

  const withTail = (edge: BubbleSide, straightEnd: readonly [number, number]) => {
    if (tailEdge === edge) {
      segments.push(`L ${pt(s1)}`)
      segments.push(`C ${pt(c1)} ${pt(c2)} ${pt(tip)}`)
      segments.push(`C ${pt(c3)} ${pt(c4)} ${pt(s2)}`)
    }
    segments.push(`L ${pt(straightEnd)}`)
  }

  withTail("top", [corners.tr[0] - r, corners.tr[1]])
  segments.push(
    `C ${pt([corners.tr[0] - r + k, corners.tr[1]])} ${pt([corners.tr[0], corners.tr[1] + r - k])} ${pt([corners.tr[0], corners.tr[1] + r])}`
  )

  withTail("right", [corners.br[0], corners.br[1] - r])
  segments.push(
    `C ${pt([corners.br[0], corners.br[1] - r + k])} ${pt([corners.br[0] - r + k, corners.br[1]])} ${pt([corners.br[0] - r, corners.br[1]])}`
  )

  withTail("bottom", [corners.bl[0] + r, corners.bl[1]])
  segments.push(
    `C ${pt([corners.bl[0] + r - k, corners.bl[1]])} ${pt([corners.bl[0], corners.bl[1] - r + k])} ${pt([corners.bl[0], corners.bl[1] - r])}`
  )

  withTail("left", [corners.tl[0], corners.tl[1] + r])
  segments.push(
    `C ${pt([corners.tl[0], corners.tl[1] + r - k])} ${pt([corners.tl[0] + r - k, corners.tl[1]])} ${pt([corners.tl[0] + r, corners.tl[1]])}`
  )

  segments.push("Z")

  const viewWidth = width + (tailEdge === "left" || tailEdge === "right" ? TAIL_LENGTH : 0)
  const viewHeight = height + (tailEdge === "top" || tailEdge === "bottom" ? TAIL_LENGTH : 0)

  return { d: segments.join(" "), viewWidth, viewHeight }
}

function TooltipBubble({
  side,
  size,
}: {
  side: BubbleSide
  size: { width: number; height: number }
}) {
  const { d, viewWidth, viewHeight } = React.useMemo(
    () => buildBubblePath(size.width, size.height, TAIL_EDGE_FOR_SIDE[side]),
    [size.width, size.height, side]
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
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
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

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "group relative z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) text-xs text-background data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {size && (
            <>
              <TooltipBubble side="top" size={size} />
              <TooltipBubble side="bottom" size={size} />
              <TooltipBubble side="left" size={size} />
              <TooltipBubble side="right" size={size} />
            </>
          )}
          <div className="relative group-data-[side=top]:pb-2 group-data-[side=bottom]:pt-2 group-data-[side=left]:pr-2 group-data-[side=inline-start]:pr-2 group-data-[side=right]:pl-2 group-data-[side=inline-end]:pl-2">
            <div
              ref={setMeasureNode}
              className="flex items-center gap-1.5 px-3 py-1.5 has-data-[slot=kbd]:pe-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-lg"
            >
              {children}
            </div>
          </div>
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
