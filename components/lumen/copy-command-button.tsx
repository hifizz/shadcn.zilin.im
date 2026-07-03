"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/lumen/tooltip"

function CopyCommandButton({
  command,
  label = "Copy install command",
  className,
}: {
  command: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={label}
            className={className}
            onClick={async () => {
              await navigator.clipboard.writeText(command)
              setCopied(true)
            }}
          />
        }
      >
        {copied ? (
          <Check className="text-primary" />
        ) : (
          <Copy />
        )}
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
    </Tooltip>
  )
}

export { CopyCommandButton }
