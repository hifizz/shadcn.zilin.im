"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/lumen/tooltip"

function useCopied() {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])
  return [copied, setCopied] as const
}

// Sonner-style 26x26 boxed copy button, used in the top-right of code blocks.
function CopyCommandButton({
  command,
  label = "Copy",
  className,
}: {
  command: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useCopied()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={label}
            className={cn(
              "flex size-[26px] items-center justify-center rounded-[6px] border border-[#ededed] bg-white text-[#171717] transition-colors hover:bg-[#f8f8f8] dark:border-[#2e2e2d] dark:bg-[#212121] dark:text-[#f3f3f5] dark:hover:bg-[#363636]",
              className
            )}
            onClick={async () => {
              await navigator.clipboard.writeText(command)
              setCopied(true)
            }}
          />
        }
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-500" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : label}</TooltipContent>
    </Tooltip>
  )
}

// Sonner-style light gradient hero CTA that copies text on click.
function CopyCommandCta({
  command,
  idleLabel,
  className,
}: {
  command: string
  idleLabel: string
  className?: string
}) {
  const [copied, setCopied] = useCopied()

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(command)
        setCopied(true)
      }}
      style={{
        background: "linear-gradient(156deg, #fff, #f0f0f0)",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,.06), 0 1px 0 0 rgba(0,0,0,.08), 0 2px 2px 0 rgba(0,0,0,.04), 0 3px 3px 0 rgba(0,0,0,.02), 0 4px 4px 0 rgba(0,0,0,.01)",
      }}
      className={cn(
        "inline-flex h-10 min-w-[152px] items-center justify-center gap-2 rounded-[6px] px-[30px] text-[13px] font-semibold text-[#171717] transition-transform active:translate-y-px",
        className
      )}
    >
      {copied ? <Check className="size-4 text-emerald-600" /> : null}
      {copied ? "Copied!" : idleLabel}
    </button>
  )
}

export { CopyCommandButton, CopyCommandCta }
