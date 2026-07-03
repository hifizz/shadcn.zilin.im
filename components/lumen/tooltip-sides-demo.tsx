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
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {SIDES.map((s) => (
          <button
            key={s.value}
            type="button"
            aria-pressed={side === s.value}
            onClick={() => setSide(s.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              side === s.value
                ? "border-stone-900 bg-stone-900 text-stone-50 dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900"
                : "border-stone-200 bg-transparent text-stone-500 hover:border-stone-300 hover:text-stone-900 dark:border-stone-800 dark:text-stone-400 dark:hover:border-stone-700 dark:hover:text-stone-100"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="relative mt-4 flex h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] [background-size:16px_16px] dark:border-stone-800 dark:bg-[radial-gradient(#292524_1px,transparent_1px)]">
        <Tooltip open onOpenChange={() => {}}>
          <TooltipTrigger
            render={
              <button className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-900 shadow-sm dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100" />
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
