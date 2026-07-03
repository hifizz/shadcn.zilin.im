import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { CopyCommandButton } from "@/components/lumen/copy-command-button"
import { TooltipSidesDemo } from "@/components/lumen/tooltip-sides-demo"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/lumen/tooltip"

const INSTALL_COMMAND = "npx shadcn@latest add @lumen/tooltip"

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

function CodeBlock({
  code,
  copyLabel,
}: {
  code: string
  copyLabel: string
}) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-900">
      <pre className="overflow-x-auto p-4 pe-12 font-mono text-[13px] leading-relaxed text-stone-700 dark:text-stone-300">
        {code}
      </pre>
      <div className="absolute end-2 top-2">
        <CopyCommandButton command={code} label={copyLabel} />
      </div>
    </div>
  )
}

export default function LumenTooltipPage() {
  return (
    <div className="min-h-svh bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-[640px] px-6 py-16">
        <nav className="mb-12 flex items-center justify-between text-sm">
          <Link
            href="/"
            className="text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            ← lumen
          </Link>
          <a
            href="https://github.com/hifizz/shadcn.zilin.im"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            GitHub
            <ExternalLink className="size-3.5" />
          </a>
        </nav>

        <h1 className="text-[40px] leading-none font-semibold tracking-tight">
          Tooltip
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-stone-500 dark:text-stone-400">
          尾巴与面板由一条连续的路径绘制而成 —— 根部平滑外扩，尖端圆润收拢,
          严丝合缝地衔接在一起，而不是拼接上去的一个小方块。
        </p>

        <TooltipProvider>
          <div className="relative mt-8 flex h-[220px] items-center justify-center overflow-hidden rounded-2xl border border-stone-200 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] [background-size:16px_16px] dark:border-stone-800 dark:bg-[radial-gradient(#292524_1px,transparent_1px)]">
            <Tooltip>
              <TooltipTrigger
                render={
                  <button className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 shadow-sm transition-transform hover:scale-[1.02] dark:bg-stone-100 dark:text-stone-900" />
                }
              >
                Hover me
              </TooltipTrigger>
              <TooltipContent>顺滑衔接的 tooltip panel</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <div className="relative mt-4 flex items-center justify-between overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 py-3 pe-2 ps-4 dark:border-stone-800 dark:bg-stone-900">
          <code className="overflow-x-auto font-mono text-[13px] text-stone-700 dark:text-stone-300">
            {INSTALL_COMMAND}
          </code>
          <CopyCommandButton command={INSTALL_COMMAND} />
        </div>

        <p className="mt-3 text-xs text-stone-400 dark:text-stone-500">
          或直接用 registry JSON 地址：
          <code className="ms-1 font-mono">
            npx shadcn@latest add https://shadcn.zilin.im/r/tooltip.json
          </code>
        </p>

        <section className="mt-16">
          <h2 className="text-lg font-semibold tracking-tight">Usage</h2>
          <CodeBlock code={USAGE_CODE} copyLabel="Copy usage example" />
        </section>

        <section className="mt-16">
          <h2 className="text-lg font-semibold tracking-tight">Sides</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-stone-500 dark:text-stone-400">
            四个方向都由同一套向量几何生成，尾巴始终平滑衔接。
          </p>
          <TooltipSidesDemo />
        </section>

        <footer className="mt-20 border-t border-stone-200 pt-6 text-xs text-stone-400 dark:border-stone-800 dark:text-stone-500">
          Part of the{" "}
          <Link
            href="/"
            className="text-stone-500 underline underline-offset-4 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            Lumen
          </Link>{" "}
          registry — shadcn.zilin.im
        </footer>
      </div>
    </div>
  )
}
