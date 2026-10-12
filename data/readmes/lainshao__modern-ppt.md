#BRANCH:main
# Modern PPT — HTML Presentation Agent Skill / 现代投屏网页 PPT

[English](#english) · [中文说明](#这是什么--不是什么) · [Live demo](https://lainshao.github.io/modern-ppt/)

> **Modern PPT is an open-source Agent Skill for generating polished, single-file HTML presentations from a prompt, outline, or document.** It includes 12 reusable slide layouts, 3 switchable color themes, interactive charts, count-up numbers, keyboard navigation, and presentation-ready motion. Works with Claude Code, OpenAI Codex CLI, Gemini CLI, Cursor, Copilot CLI, OpenCode, and other agents that support Agent Skills.
>
> **Keywords:** AI presentation generator · HTML slideshow · web presentation · presentation Agent Skill · Claude Code skill · Codex skill · single-file HTML deck

> 一个 **Agent Skill**：用一句话生成现代分享/投屏风格的单文件网页 PPT ——
> 专业极简风、干净克制的排版，横向翻页、可直接投屏放映。
> 内置一套"实战磨出来的"排版硬规范，让 AI 产出**一致**（而不是每次重猜风格、重踩坑）。
>
> **内置 12 个版式 + 3 套配色 + 交互动效**：封面 / 目录 / 数据(数字 count-up) / 对比矩阵 / 图表(Chart.js 柱状·折线) / 三栏卡 / 战略房子图 / 流程时间线 / 代码 / 金句 / 章节页 / 收束；放映时按 `1/2/3` 一键换配色（黑橙 / 明亮蓝 / 柔和粉）。

![演示 · 按 1/2/3 一键换配色，12 个版式整体秒变色](assets/demo.gif)

## 效果预览

**几个代表版式**（完整 12 个见模板 · 数字会 count-up 滚动、图表可 hover）：

| Stat grid 数据 | Chart 图表 | Comparison 对比矩阵 |
|:--:|:--:|:--:|
| ![stat](assets/fmt-stat.png) | ![chart](assets/fmt-chart.png) | ![compare](assets/fmt-compare.png) |
| **Three-column 三栏卡** | **Strategy house 战略房子图** | **Quote 金句** |
| ![triad](assets/fmt-triad.png) | ![house](assets/fmt-house.png) | ![quote](assets/fmt-quote.png) |

**3 套配色**（放映按 `1/2/3` 一键切换，整份 deck 秒变色；蓝 / 粉自动把深色页翻成浅底）：

| 黑 + 橙（默认） | 明亮蓝 | 柔和三文鱼粉 |
|:--:|:--:|:--:|
| ![orange](assets/preview-orange.png) | ![blue](assets/preview-blue.png) | ![salmon](assets/preview-salmon.png) |

> 产出是**单个 HTML 文件**，浏览器打开即放映。

## English

Modern PPT turns a topic, outline, or source document into a clean, projection-ready web presentation. The output is one portable HTML file—no build step or presentation software required.

### Highlights

- **12 practical layouts:** cover, agenda, section divider, statistics, comparison matrix, charts, three-column cards, strategy house, timeline, code, quote, and closing.
- **3 live themes:** black/orange, bright blue, and soft salmon; press `1`, `2`, or `3` while presenting.
- **Built-in interaction:** keyboard, wheel, and touch navigation; animated numbers and charts; overview wall; low-power static mode.
- **Consistent AI output:** a detailed typography and spacing specification prevents each generated deck from inventing a different visual system.
- **Agent-compatible:** designed for Claude Code, OpenAI Codex CLI, Gemini CLI, Cursor, Copilot CLI, OpenCode, and similar coding agents.

### Install

```bash
git clone https://github.com/lainshao/modern-ppt.git ~/.claude/skills/modern-ppt
```

For another agent, clone or copy the repository into its skills directory. Then ask:

> Use modern-ppt to turn this outline into a presentation-ready HTML deck.

Open `assets/template.html` to preview all layouts without an AI agent. See the [live project page](https://lainshao.github.io/modern-ppt/) for screenshots and usage details.

## 这是什么 / 不是什么

- **是一个 skill**（菜谱+模板），不是一份做好的 PPT。装上后说「按 modern-ppt 做个 X 主题的分享 deck」，它按这套风格+规范帮你生成。
- 产出是**单个 HTML 文件**，浏览器打开即放映；别人拿到也能 fork 改自己的。

## 前提

需要一个**支持 Agent Skills 的 coding agent** —— Claude Code / Codex CLI / Gemini CLI / Cursor / Copilot CLI / OpenCode 等都行（**不限 Claude Code**）。
实在没有，把 `SKILL.md` + `assets/template.html` 直接喂给任何能干活的 agent 也能跑。

## 快速开始

### 1 · 安装（以 Claude Code 为例）

```bash
git clone https://github.com/lainshao/modern-ppt.git ~/.claude/skills/modern-ppt
```

装好后**重开一个会话**即自动识别；`ls ~/.claude/skills/modern-ppt/SKILL.md` 能看到文件就是装好了。

> 其它 agent（Cursor / Codex CLI / Gemini CLI / Copilot CLI…）：把仓库放进各自的 skills 目录即可。完全没有 skills 机制的，直接把 `SKILL.md` + `assets/template.html` 两个文件喂给 agent 也能跑。

### 2 · 先看效果（不用 AI，30 秒）

```bash
open ~/.claude/skills/modern-ppt/assets/template.html   # macOS；Windows 用 start，Linux 用 xdg-open
```

浏览器里 `← →` 翻过 12 个版式，按 `1/2/3` 当场换配色，`ESC` 出缩略图墙。**这一步最能看出它长什么样。**

### 3 · 让 AI 生成你自己的 deck

在 agent 里贴上你的大纲 / 文档，说一句：

> 「用 modern-ppt 把这段做成投屏分享 deck」　或　「用 modern-ppt 做个关于《XXX》的分享 PPT」

它会：读排版规范 → `cp assets/template.html` 起步 → 跟你对大纲 → **先做封面 + 2-3 张样页给你看** → 你拍板后再批量生成剩余页。完成后 `open index.html` 预览。

### 放映快捷键

| 键 | 作用 |
|---|---|
| `← →` / 滚轮 / 滑动 | 翻页 |
| `1` `2` `3` | 换配色（黑橙 / 明亮蓝 / 三文鱼粉）|
| `B` | 静态模式（关动效，投屏 / 老机器防卡顿）|
| `ESC` | 缩略图索引，点任意页跳转 |

## 文件清单

| 文件 | 作用 |
|---|---|
| `SKILL.md` | 菜谱：怎么生成、什么顺序、硬规则 |
| `assets/template.html` | 底盘模板（cp 它起步） |
| `references/排版规范.md` | 排版硬约束（核心卖点） |
| `assets/motion.min.js` | 翻页/入场动效引擎 |

## 设计规范（核心卖点）

`references/排版规范.md` —— 单一 body 字号 token、**标题靠分隔线不靠加大字号**、正文不上色、内容连排不锚底、底部安全区、编号列对齐、5 格方块刻度… 都是从一份 27 页 deck、30+ 轮批注里磨出来的硬约束。

## 命名说明

本机 skill 名为 **`lain-ppt`**（lain 的个人定制）；公开仓库名 **`modern-ppt`**。同一份东西，私有名 vs 公开名。

## 许可与署名（重要）

本 skill **衍生自 [规藏 guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)（© op7418）**，复用其 Swiss 模板底盘、WebGL/ASCII 背景与翻页/动效引擎；在其上做了安全橙主题（现扩为 3 套可切配色）、整套投屏排版规范、12 版式 + 交互动效、版式裁剪与 bug 修复。

> 据此本 skill 整体采用 [AGPL-3.0](./LICENSE)（继承自上游）。再分发须：保留 `LICENSE` + 本署名段 + 注明你的改动；并继续以 AGPL-3.0 开源。**放入公司内部仓库前请先过开源合规**（AGPL 常因网络条款被企业政策限制）。用本 skill 生成的**最终 deck 不必署名**。

定制与规范：lain · 2026-07。
