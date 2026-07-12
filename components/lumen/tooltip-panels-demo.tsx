"use client"

import * as React from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type TailGeometry,
} from "@/components/lumen/tooltip"

// A slightly larger, softer tail suits big content panels than the tooltip default.
const panelTail: Partial<TailGeometry> = {
  aw: 5,
  ah: 8,
  flare: 3,
  tip: 1.5,
  radius: 12,
}

const stage =
  "flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[6px] border border-[#f3f3f3] bg-[radial-gradient(#e2e2e2_1px,transparent_1px)] [background-size:16px_16px] p-8 dark:border-[#2c2c2a] dark:bg-[radial-gradient(#2c2c2a_1px,transparent_1px)]"

const caption = "mb-2 text-[13px] font-medium text-[#18181b] dark:text-[#f3f3f5]"
const hint = "text-[#8f8f8f] dark:text-[#74747b]"

function TooltipPanelsDemo() {
  return (
    <TooltipProvider delay={0}>
      {/* macOS "Look Up" dictionary card */}
      <div>
        <p className={caption}>
          查词面板 Look Up <span className={hint}>— hover 高亮的词</span>
        </p>
        <div className={stage}>
          <p className="max-w-[420px] text-center text-[15px] leading-9 text-[#18181b] dark:text-[#f3f3f5]">
            这是一个充满{" "}
            <Tooltip>
              <TooltipTrigger
                render={
                  <button className="rounded bg-primary/15 px-1 font-medium text-foreground underline decoration-dotted underline-offset-4" />
                }
              >
                serendipity
              </TooltipTrigger>
              <TooltipContent variant="panel" side="top" tail={panelTail}>
                <div className="w-[300px] p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[19px] font-semibold">
                      serendipity
                    </span>
                    <span className="text-[13px] text-muted-foreground">
                      名词
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[13px] text-muted-foreground">
                    /ˌserənˈdipədē/
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed">
                    意外发现珍奇事物的才能；机缘凑巧、无心插柳的美好巧合。
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    the occurrence of events by chance in a happy or beneficial
                    way.
                  </p>
                  <div className="mt-3 border-t border-border pt-2 text-[12px] text-muted-foreground">
                    词典 · 英汉 / 英英
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>{" "}
            的故事，等你去发现。
          </p>
        </div>
      </div>

      {/* Profile hover card */}
      <div className="mt-8">
        <p className={caption}>
          个人卡片 Profile <span className={hint}>— 尾巴在下方</span>
        </p>
        <div className={stage}>
          <Tooltip>
            <TooltipTrigger
              render={
                <button className="inline-flex items-center gap-2 rounded-full border border-[#ededed] bg-white py-1 pe-3 ps-1 text-[13px] font-medium text-[#18181b] shadow-sm dark:border-[#2e2e2d] dark:bg-[#212121] dark:text-[#f3f3f5]" />
              }
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                ZL
              </span>
              @zilin
            </TooltipTrigger>
            <TooltipContent variant="panel" side="bottom" tail={panelTail}>
              <div className="w-[264px] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary text-[15px] font-semibold text-primary-foreground">
                    ZL
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold">
                      Zilin
                    </div>
                    <div className="truncate text-[13px] text-muted-foreground">
                      @zilin
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  在做一个定制的 shadcn/ui 组件库 Lumen —— 圆角尾巴、平滑衔接。
                </p>
                <div className="mt-3 flex gap-4 text-[13px]">
                  <span>
                    <b className="font-semibold text-foreground">128</b>{" "}
                    <span className="text-muted-foreground">关注</span>
                  </span>
                  <span>
                    <b className="font-semibold text-foreground">2.4k</b>{" "}
                    <span className="text-muted-foreground">粉丝</span>
                  </span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Color swatch info card */}
      <div className="mt-8">
        <p className={caption}>
          颜色信息 Color <span className={hint}>— 富内容 + 圆角面板</span>
        </p>
        <div className={stage}>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  className="size-9 rounded-full border border-black/10 shadow-sm"
                  style={{ background: "#8b5cf6" }}
                  aria-label="Violet"
                />
              }
            />
            <TooltipContent variant="panel" side="top" tail={panelTail}>
              <div className="w-[204px] p-3">
                <div
                  className="h-16 w-full rounded-[8px]"
                  style={{ background: "#8b5cf6" }}
                />
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="font-mono text-[13px]">#8B5CF6</span>
                  <span className="text-[12px] text-muted-foreground">
                    violet-500
                  </span>
                </div>
                <div className="mt-1 font-mono text-[12px] text-muted-foreground">
                  rgb(139 92 246)
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

export { TooltipPanelsDemo }
