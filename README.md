# shadcn.zilin.im

我的个人定制 [shadcn/ui](https://ui.shadcn.com) 组件与 blocks 库。

这不是一份通用模板，而是一个持续生长的个人设计系统：在 shadcn/ui 的标准组件（`components/ui`）之上，沉淀我自己重新设计、打磨过细节的定制组件与页面区块（blocks），并通过 shadcn CLI 支持的 registry 机制，让任何人都可以用一行命令把这些组件下载到自己的项目里。

## 这个库想做什么

- **以 shadcn/ui 为基座**：保留 `npx shadcn add <component>` 添加官方组件的能力，作为项目的基础组件层。
- **沉淀"定制版"组件**：当官方组件不能满足审美或交互细节（比如更顺滑的动效、更精致的形状）时，在 `components/lumen` 下实现自己的版本，作为这个库的招牌内容。
- **发布为可安装的 registry**：每个定制组件都会构建成标准的 shadcn registry JSON，托管在 `shadcn.zilin.im` 上，可以直接用 CLI 下载安装，而不是复制粘贴代码。
- **持续积累 blocks**：除了单个组件，未来也会加入更完整的页面区块（营销页、表单、仪表盘局部等）。

## 代号：Lumen

`lumen` 是这个定制组件库的代号，寓意"点亮/精修"。它与官方的 `components/ui` 平级，专门存放我重新设计过的组件：

```
components/
├── ui/       # shadcn/ui 官方组件（未经修改）
└── lumen/    # 我的定制组件（这个库的核心内容）
```

`lumen` 同时也是发布出去的 registry 命名空间。项目的 `components.json` 中已经配置好：

```json
{
  "registries": {
    "@lumen": "https://shadcn.zilin.im/r/{name}.json"
  }
}
```

## 添加组件

添加官方 shadcn/ui 组件（进入 `components/ui`）：

```bash
npx shadcn@latest add button
```

添加本库的定制组件（进入 `components/lumen`），例如拥有平滑圆角尾巴、无缝衔接面板的 `tooltip`：

```bash
npx shadcn@latest add @lumen/tooltip
```

也可以直接用 registry JSON 的完整地址下载，效果相同：

```bash
npx shadcn@latest add https://shadcn.zilin.im/r/tooltip.json
```

线上预览与安装命令可以在对应的展示页查看，例如 `tooltip` 组件的展示页在 [`/lumen/tooltip`](https://shadcn.zilin.im/lumen/tooltip)，右上角有一键复制安装命令的按钮。

## 使用组件

```tsx
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/lumen/tooltip"
```

## 发布新的定制组件（开发者笔记）

1. 在 `components/lumen/xxx.tsx` 实现组件。
2. 在根目录 `registry.json` 里登记这个组件（名称、依赖、文件路径）。
3. 运行 `pnpm registry:build`，会在 `public/r/xxx.json` 生成可供 CLI 下载的 registry 文件。
4. 在 `app/lumen/xxx` 下补一个展示页，附带实时预览和一键复制的安装命令。
