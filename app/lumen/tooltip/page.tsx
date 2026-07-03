import { Button } from "@/components/ui/button"
import { CopyCommandButton } from "@/components/lumen/copy-command-button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/lumen/tooltip"

const INSTALL_COMMAND = "npx shadcn@latest add @lumen/tooltip"

export default function LumenTooltipPage() {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          lumen / tooltip
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Tooltip</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          一个圆角尾巴与面板无缝衔接的 tooltip：整个气泡（含尾巴）由一条连续的
          SVG 路径绘制，而不是一个旋转后拼接上去的小方块，四个方向都是平滑的。
        </p>
      </div>

      <TooltipProvider>
        <section className="overflow-hidden rounded-3xl border">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="text-sm font-medium">Preview</span>
            <CopyCommandButton command={INSTALL_COMMAND} />
          </div>

          <div className="grid place-items-center gap-8 px-6 py-16">
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>
                Hover me (top)
              </TooltipTrigger>
              <TooltipContent side="top">
                平滑衔接的 tooltip panel
              </TooltipContent>
            </Tooltip>

            <div className="flex flex-wrap items-center justify-center gap-8">
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" />}>
                  Left
                </TooltipTrigger>
                <TooltipContent side="left">向左展开</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" />}>
                  Right
                </TooltipTrigger>
                <TooltipContent side="right">向右展开</TooltipContent>
              </Tooltip>
            </div>

            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>
                Hover me (bottom)
              </TooltipTrigger>
              <TooltipContent side="bottom">尾巴指向上方触发器</TooltipContent>
            </Tooltip>
          </div>

          <div className="border-t bg-muted/40 px-4 py-3">
            <code className="font-mono text-xs text-muted-foreground">
              {INSTALL_COMMAND}
            </code>
          </div>
        </section>
      </TooltipProvider>
    </div>
  )
}
