import Link from "next/link"

import {
  CopyCommandButton,
  CopyCommandCta,
} from "@/components/lumen/copy-command-button"
import { TooltipSidesDemo } from "@/components/lumen/tooltip-sides-demo"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/lumen/tooltip"

const INSTALL_COMMAND = "npx shadcn@latest add @lumen/tooltip"
const INSTALL_URL_COMMAND =
  "npx shadcn@latest add https://shadcn.zilin.im/r/tooltip.json"

const USAGE_CODE = `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/lumen/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger render={<Button variant="outline" />}>
      Hover me
    </TooltipTrigger>
    <TooltipContent>Smooth tail, no seam.</TooltipContent>
  </Tooltip>
</TooltipProvider>`

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="group relative overflow-hidden rounded-[6px] border border-[#f3f3f3] dark:border-[#2c2c2a]">
      <pre className="overflow-x-auto bg-[linear-gradient(to_top,#f8f8f8,#fcfcfc_16px)] p-4 pe-14 font-mono text-[13px] leading-[19px] text-[#171717] dark:bg-[linear-gradient(to_top,#1a1a19,#212121_16px)] dark:text-[#f3f3f5]">
        {code}
      </pre>
      <div className="absolute end-3 top-3">
        <CopyCommandButton command={code} label={label} />
      </div>
    </div>
  )
}

export default function LumenTooltipPage() {
  return (
    <div className="min-h-svh bg-[#fafafa] font-sans text-[#18181b] antialiased dark:bg-[#171716] dark:text-[#f3f3f5]">
      <div className="mx-auto max-w-[672px] px-5">
        <nav className="flex items-center justify-between py-5 text-[14px]">
          <Link
            href="/"
            className="text-[#6f6f6f] transition-colors hover:text-[#18181b] dark:text-[#a1a1a8] dark:hover:text-[#f3f3f5]"
          >
            ← lumen
          </Link>
          <a
            href="https://github.com/hifizz/shadcn.zilin.im"
            target="_blank"
            rel="noreferrer"
            className="text-[#6f6f6f] transition-colors hover:text-[#18181b] dark:text-[#a1a1a8] dark:hover:text-[#f3f3f5]"
          >
            GitHub
          </a>
        </nav>

        {/* Hero */}
        <TooltipProvider>
          <section className="flex flex-col items-center gap-3 pt-16 pb-4 text-center">
            <div className="relative flex h-[120px] w-full items-end justify-center [mask-image:linear-gradient(0deg,transparent,#000_35%)]">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button className="mb-4 rounded-[6px] border border-[#ededed] bg-white px-4 py-2 text-[13px] font-medium text-[#18181b] shadow-sm dark:border-[#2e2e2d] dark:bg-[#212121] dark:text-[#f3f3f5]" />
                  }
                >
                  Hover me
                </TooltipTrigger>
                <TooltipContent>顺滑衔接的 tooltip panel</TooltipContent>
              </Tooltip>
            </div>

            <h1 className="text-[48px] leading-none font-bold tracking-tight">
              Tooltip
            </h1>
            <p className="max-w-[420px] text-[16px] leading-[25px] text-[#52525b] dark:text-[#c1c1c6]">
              尾巴与面板由一条连续路径绘制 —— 根部平滑外扩、尖端圆润收拢，与面板严丝合缝地衔接。
            </p>

            <div className="mt-2 flex items-center gap-3">
              <CopyCommandCta command={INSTALL_COMMAND} idleLabel="Copy install" />
              <a
                href="https://github.com/hifizz/shadcn.zilin.im"
                target="_blank"
                rel="noreferrer"
                className="text-[14px] text-[#6f6f6f] underline underline-offset-4 transition-colors hover:text-[#18181b] dark:text-[#a1a1a8] dark:hover:text-[#f3f3f5]"
              >
                GitHub
              </a>
            </div>
          </section>
        </TooltipProvider>

        {/* Content */}
        <div className="flex flex-col gap-14 pt-16">
          <section>
            <h2 className="text-[16px] font-medium text-[#18181b] dark:text-[#f3f3f5]">
              Installation
            </h2>
            <p className="mt-1 mb-4 text-[15px] leading-[25px] text-[#52525b] dark:text-[#c1c1c6]">
              通过 shadcn CLI 从 Lumen registry 安装：
            </p>
            <CodeBlock code={INSTALL_COMMAND} label="Copy install command" />
            <p className="mt-3 text-[13px] leading-[22px] text-[#8f8f8f] dark:text-[#74747b]">
              或直接用 registry JSON 地址：
              <code className="ms-1 rounded-[6px] border border-[#f3f3f3] bg-[#ededed] px-[3.6px] py-[2px] font-mono text-[12px] text-[#171717] dark:border-[#2c2c2a] dark:bg-[#212121] dark:text-[#f3f3f5]">
                {INSTALL_URL_COMMAND}
              </code>
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-[#18181b] dark:text-[#f3f3f5]">
              Usage
            </h2>
            <p className="mt-1 mb-4 text-[15px] leading-[25px] text-[#52525b] dark:text-[#c1c1c6]">
              把 provider 放在应用根部，然后像标准 tooltip 一样组合使用。
            </p>
            <CodeBlock code={USAGE_CODE} label="Copy usage example" />
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-[#18181b] dark:text-[#f3f3f5]">
              Sides
            </h2>
            <p className="mt-1 text-[15px] leading-[25px] text-[#52525b] dark:text-[#c1c1c6]">
              四个方向由同一套向量几何生成，尾巴始终平滑衔接。
            </p>
            <TooltipSidesDemo />
          </section>
        </div>

        <footer className="mt-24 border-t border-[#f3f3f3] py-6 text-[14px] text-[#8f8f8f] dark:border-[#2c2c2a] dark:text-[#74747b]">
          Part of the{" "}
          <Link
            href="/"
            className="underline underline-offset-4 transition-colors hover:text-[#18181b] dark:hover:text-[#f3f3f5]"
          >
            Lumen
          </Link>{" "}
          registry — shadcn.zilin.im
        </footer>
      </div>
    </div>
  )
}
