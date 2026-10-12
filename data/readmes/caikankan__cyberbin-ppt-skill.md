#BRANCH:main
# CyberBin PPT Skill · Pinboard HTML PPT

![License](https://img.shields.io/github/license/caikankan/cyberbin-ppt-skill?style=flat-square)
![Skill](https://img.shields.io/badge/Skill-Agent-111111?style=flat-square)
![HTML Deck](https://img.shields.io/badge/HTML-Deck-1E3F9D?style=flat-square)
![Codex](https://img.shields.io/badge/Codex-Supported-222222?style=flat-square)
![Claude Code](https://img.shields.io/badge/Claude%20Code-Supported-6B5B95?style=flat-square)

> English version: [README.en.md](./README.en.md)

CyberBin 是一个适配 Codex / Claude Code 等 Agent 环境的网页 PPT Skill，用来生成**单文件 HTML 横向翻页 PPT**，并可导出视觉一致的图片版 PPTX。

v1 只公开一个模板：`pinboard`。它的视觉是黄纸、蓝墨、纸卡片、回形针和手写强调，适合 AI 工具、SaaS 产品、增长复盘、课程封面、创业团队作战手册和产品发布型 PPT。

![CyberBin Pinboard preview](./assets/preview/cyberbin-pinboard-preview.png)

## 30 秒开始

### Codex

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/caikankan/cyberbin-ppt-skill.git ~/.codex/skills/cyberbin
```

然后对 Codex 说：

```text
用 CyberBin 的 pinboard 模板，做一份 20 页 PPT，主题是「AI 如何改变个人创作流程」。
```

### Claude Code

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/caikankan/cyberbin-ppt-skill.git ~/.claude/skills/cyberbin
```

然后在 Claude Code 中输入：

```text
/cyberbin make a 20-slide pinboard HTML deck about AI tools
```

## 触发方式

装好后，可以直接用自然语言触发：

```text
用 CyberBin 做一份 pinboard 风格 PPT，主题是 AI 工具交付流程。
```

```text
把这份 PDF 提炼成 10 页中文课件，不要硬塞原文。
```

```text
Use CyberBin pinboard to create a 20-slide English deck about AI delivery tools.
```

## 模板选择

CyberBin v1 只开放一个模板。Template 2-5 是后续预留，不是可用模板。

| 模板 | 状态 | 适合场景 | 视觉系统 |
|---|---|---|---|
| `pinboard` | v1 可用 | AI 工具、SaaS、增长复盘、课程、创业路演 | 黄纸、蓝墨、纸卡、回形针、手写强调 |
| Template 2-5 | Coming later | 暂未开放 | 需要单独封装和测试 |

## Pinboard 主题色

主题色只是同一个 `pinboard` 模板的颜色变量，不改变版式、回形针位置、动画、中文/英文排版规则。

| 主题 ID | 底色 | 锚点色 | 适合场景 |
|---|---|---|---|
| `pinboard-yellow` | 黄纸 | 深蓝墨 | 默认；年轻化产品策略、创业团队、AI 工具发布 |
| `ikb-blue` | 白色 | 克莱因蓝 `#002FA7` | AI 产品、商业发布、方法论 |
| `lemon-yellow` | 白色 | 柠檬黄 `#FFD500` | 年轻、运动、零售、消费品、Y2K 复古；正文主文字为 80% 黑 |
| `lemon-green` | 白色 | 柠檬绿 `#C5E803` | 生态、健康、Z 世代品牌 |
| `safety-orange` | 白色 | 安全橙 `#FF6B35` | 警示、新闻、工业、运动、活力主题 |

命令示例：

```bash
node scripts/create-deck.mjs pinboard ./demo/ppt --title "AI Delivery Tool Stack" --demo --slides 20 --language en --theme ikb-blue
```

## 使用流程

Skill 会按 Guizang 式结构化工作流执行：

1. 选择模板：v1 固定 `pinboard`
2. 选择主题色：默认 `pinboard-yellow`
3. 判断输入材料：一句话、PDF、PPTX、TXT/Markdown、截图或大纲
4. 压缩内容：先提炼页级观点，不复刻资料原文
5. 拷贝模板：从 `assets/templates/pinboard.html` 创建 `index.html`
6. 填充页面：从 `references/layouts.md` 选择页面骨架
7. 自检：按 `references/checklist.md` 检查
8. 校验：运行 `scripts/validate-deck.mjs`
9. 预览：浏览器打开 HTML，检查 ESC overview 和 `B` 静态模式
10. 导出：需要 PPTX 时导出图片版 PPTX

## 支持的输入材料

| 输入 | 处理方式 |
|---|---|
| 一句话主题 | 自动搭结构，默认 20 页 |
| PDF | 提炼结构和重点，不逐页复刻 |
| PPT/PPTX | 提取内容逻辑，按 CyberBin 版式重排 |
| TXT / Markdown | 压缩成短标题、页级观点、卡片要点 |
| 图片 / 截图 | 作为视觉参考、证据或内容来源，不直接塞密集文字 |
| 结构化大纲 | 尊重页序，但单页过量时仍需压缩或拆页 |

CyberBin 不是长文排版器。即使输入 10000 字，也必须压缩成可读的演示页，不能硬塞进 10/20 页。

## 导出 PPTX

PPTX 导出优先视觉稳定。导出的 PPTX 是**图片版**：每页是一张完整截图，和 HTML 视觉一致。

如果需要改字，请先在 HTML 中点击 `Edit` 修改，再 `Save HTML`，然后导出 PPTX。

```bash
npm install
node scripts/export-pptx.mjs ./demo/ppt/index.html ./demo.pptx
```

## 目录结构

```text
cyberbin-ppt-skill/
├── SKILL.md
├── README.md
├── README.en.md
├── LICENSE
├── NOTICE
├── CONTRIBUTING.md
├── assets/
│   ├── templates/pinboard.html
│   ├── motion.min.js
│   ├── paperclips/
│   ├── examples/
│   └── preview/
├── references/
│   ├── components.md
│   ├── layouts.md
│   ├── themes.md
│   ├── checklist.md
│   ├── image-prompts.md
│   ├── screenshot-framing.md
│   ├── template-catalog.md
│   └── template-intake.md
└── scripts/
    ├── create-deck.mjs
    ├── validate-deck.mjs
    └── export-pptx.mjs
```

## 手动测试

```bash
node scripts/create-deck.mjs pinboard ./demo-pinboard/ppt --title "Pinboard Demo" --demo --slides 5
node scripts/validate-deck.mjs ./demo-pinboard/ppt/index.html --expected-slides 5 --template pinboard --theme pinboard-yellow
```

测试白底主题：

```bash
node scripts/create-deck.mjs pinboard ./demo-blue/ppt --title "AI Delivery Tool Stack" --demo --slides 5 --language en --theme ikb-blue
node scripts/validate-deck.mjs ./demo-blue/ppt/index.html --expected-slides 5 --template pinboard --theme ikb-blue
```

## FAQ

**可以导出 PPTX 吗？**  
可以。导出的是图片版 PPTX，优先保证视觉一致，不承诺 PowerPoint 内文字可编辑。

**为什么不直接塞原文？**  
因为 CyberBin 是视觉优先的演示稿，不是文档排版器。过长内容会被压缩、合并、拆页或删减。

**可以选其他模板吗？**  
v1 只有 `pinboard`。其他模板需要先封装视觉、补 layout、跑 5 页 demo 和 20 页结构测试，确认后再开放。

**可以自定义颜色吗？**  
不建议。v1 只允许使用预设主题色，避免破坏模板视觉。

## 贡献

Bug、排版问题、新主题或新模板建议欢迎开 Issue / PR。改动请优先：

- 先补 `references/` 规则，再改模板
- 新增主题时同步更新 `themes.md`、`create-deck.mjs` 和 `validate-deck.mjs`
- 新增模板时先做 5 页 demo 和 20 页结构测试
- 把踩过的坑写进 `references/checklist.md`

## 来源与许可证

CyberBin 的 HTML PPT runtime 和 Skill 组织方式参考并派生自 [Guizang PPT Skill](https://github.com/op7418/guizang-ppt-skill)。

CyberBin 使用 AGPL-3.0 发布。详见 [LICENSE](./LICENSE) 和 [NOTICE](./NOTICE)。
