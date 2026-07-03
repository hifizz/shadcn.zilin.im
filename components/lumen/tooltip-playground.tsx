"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TailGeometry,
} from "@/components/lumen/tooltip"

type Recipe = { name: string; label: string; tail: TailGeometry }

const RECIPES: Recipe[] = [
  { name: "default", label: "Default", tail: { aw: 4, ah: 6, flare: 2, tip: 1, radius: 8 } },
  { name: "soft", label: "Soft flare", tail: { aw: 4, ah: 6, flare: 3, tip: 1, radius: 8 } },
  { name: "sharp", label: "Sharp", tail: { aw: 5, ah: 8, flare: 0, tip: 0.5, radius: 8 } },
  { name: "round", label: "Round panel", tail: { aw: 4, ah: 6, flare: 2, tip: 1, radius: 14 } },
  { name: "long", label: "Long tail", tail: { aw: 5, ah: 11, flare: 3, tip: 1.5, radius: 8 } },
]

type SizeCase = {
  key: string
  trigger: string
  content: React.ReactNode
  className?: string
}

const SIZE_CASES: SizeCase[] = [
  { key: "tiny", trigger: "Tiny", content: "?" },
  { key: "short", trigger: "Short", content: "保存" },
  { key: "medium", trigger: "Medium", content: "Save changes to draft" },
  {
    key: "tall",
    trigger: "Tall",
    content:
      "这条 tooltip 内容较长，会自动换行成多行，用来观察更高的面板下尾巴是否依然居中、与面板平滑衔接。",
  },
  {
    key: "wide",
    trigger: "Wide",
    content: (
      <span className="whitespace-nowrap">
        A single long line that never wraps — a very wide panel
      </span>
    ),
    className: "max-w-none",
  },
  { key: "emoji", trigger: "Emoji", content: "已复制到剪贴板 ✓" },
]

const chipBase =
  "rounded-[6px] border px-3 py-2 text-[13px] font-medium transition-colors"
const chipOff =
  "border-[#f3f3f3] bg-[#fcfcfc] text-[#18181b] hover:border-[#e2e2e2] dark:border-[#2c2c2a] dark:bg-[#212121] dark:text-[#f3f3f5] dark:hover:border-[#3a3a3a]"
const chipOn =
  "border-[#18181b] bg-[#18181b] text-white dark:border-[#f3f3f5] dark:bg-[#f3f3f5] dark:text-[#18181b]"

const triggerBtn =
  "rounded-[6px] border border-[#ededed] bg-white px-3.5 py-2 text-[13px] font-medium text-[#18181b] shadow-sm transition-colors hover:bg-[#f8f8f8] dark:border-[#2e2e2d] dark:bg-[#212121] dark:text-[#f3f3f5] dark:hover:bg-[#363636]"

const dotStage =
  "rounded-[6px] border border-[#f3f3f3] bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] dark:border-[#2c2c2a] dark:bg-[radial-gradient(#2c2c2a_1px,transparent_1px)]"

const caption = "mb-2 text-[13px] font-medium text-[#18181b] dark:text-[#f3f3f5]"
const hint = "text-[#8f8f8f] dark:text-[#74747b]"

function TooltipPlayground() {
  const [recipeName, setRecipeName] = React.useState("default")
  const recipe = RECIPES.find((r) => r.name === recipeName) ?? RECIPES[0]
  const tail = recipe.tail

  const directional = [
    { side: "top", label: "Top", cell: "col-start-2 row-start-1" },
    { side: "left", label: "Left", cell: "col-start-1 row-start-2" },
    { side: "right", label: "Right", cell: "col-start-3 row-start-2" },
    { side: "bottom", label: "Bottom", cell: "col-start-2 row-start-3" },
  ] as const

  return (
    <TooltipProvider delay={0}>
      {/* Recipe switcher */}
      <div className="mt-5">
        <p className={caption}>
          配方 Recipe <span className={hint}>— 切换尾巴几何</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {RECIPES.map((r) => (
            <button
              key={r.name}
              type="button"
              aria-pressed={r.name === recipeName}
              onClick={() => setRecipeName(r.name)}
              className={cn(chipBase, r.name === recipeName ? chipOn : chipOff)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="mt-2 font-mono text-[12px] text-[#8f8f8f] dark:text-[#74747b]">
          {`aw:${tail.aw}  ah:${tail.ah}  flare:${tail.flare}  tip:${tail.tip}  R:${tail.radius}`}
        </p>
      </div>

      {/* Positioning square */}
      <div className="mt-8">
        <p className={caption}>
          弹出位置 Positioning{" "}
          <span className={hint}>— hover 每个按钮测试方向</span>
        </p>
        <div
          className={cn(
            dotStage,
            "mx-auto grid aspect-square w-full max-w-[320px] grid-cols-3 grid-rows-3 place-items-center p-6"
          )}
        >
          {directional.map((d) => (
            <div key={d.side} className={d.cell}>
              <Tooltip>
                <TooltipTrigger render={<button className={triggerBtn} />}>
                  {d.label}
                </TooltipTrigger>
                <TooltipContent side={d.side} tail={tail}>
                  side=&quot;{d.side}&quot;
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
          <div
            className={cn(
              "col-start-2 row-start-2 text-[12px]",
              hint
            )}
          >
            hover
          </div>
        </div>
      </div>

      {/* Content sizes */}
      <div className="mt-8">
        <p className={caption}>
          内容尺寸 Content sizes{" "}
          <span className={hint}>— 不同宽高下的形状</span>
        </p>
        <div
          className={cn(
            dotStage,
            "flex flex-wrap items-center justify-center gap-2 p-8"
          )}
        >
          {SIZE_CASES.map((c) => (
            <Tooltip key={c.key}>
              <TooltipTrigger render={<button className={triggerBtn} />}>
                {c.trigger}
              </TooltipTrigger>
              <TooltipContent tail={tail} className={c.className}>
                {c.content}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}

export { TooltipPlayground }
