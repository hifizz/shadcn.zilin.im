"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/lumen/tooltip"

const SIDES = [
  { value: "top", label: "Top" },
  { value: "right", label: "Right" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
] as const

type Side = (typeof SIDES)[number]["value"]

function TooltipSidesDemo() {
  const [side, setSide] = React.useState<Side>("top")

  return (
    <TooltipProvider>
      <div className="mt-4 flex flex-wrap gap-2">
        {SIDES.map((s) => (
          <button
            key={s.value}
            type="button"
            aria-pressed={side === s.value}
            onClick={() => setSide(s.value)}
            className={cn(
              "rounded-[6px] border px-3 py-2 text-[13px] font-medium transition-colors",
              side === s.value
                ? "border-[#18181b] bg-[#18181b] text-white dark:border-[#f3f3f5] dark:bg-[#f3f3f5] dark:text-[#18181b]"
                : "border-[#f3f3f3] bg-[#fcfcfc] text-[#18181b] hover:border-[#e2e2e2] dark:border-[#2c2c2a] dark:bg-[#212121] dark:text-[#f3f3f5] dark:hover:border-[#3a3a3a]"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="relative mt-4 flex h-[200px] items-center justify-center overflow-hidden rounded-[6px] border border-[#f3f3f3] bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] dark:border-[#2c2c2a] dark:bg-[radial-gradient(#2c2c2a_1px,transparent_1px)]">
        <Tooltip open onOpenChange={() => {}}>
          <TooltipTrigger
            render={
              <button className="rounded-[6px] border border-[#ededed] bg-white px-4 py-2 text-[13px] font-medium text-[#18181b] shadow-sm dark:border-[#2e2e2d] dark:bg-[#212121] dark:text-[#f3f3f5]" />
            }
          >
            Trigger
          </TooltipTrigger>
          <TooltipContent side={side}>side=&quot;{side}&quot;</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export { TooltipSidesDemo }
