#BRANCH:main
# Fudan PPT Skill · 复旦大学学术演示文稿 Skill

![复旦大学学术PPT风格设计](examples/wittgenstein-demo/readme-hero.png)

一个用于生成复旦大学风格学术演示文稿的 Codex Skill。它支持原生 PowerPoint `.pptx`、单文件离线 HTML 幻灯片，以及可选的 AI 辅助视觉素材生成；重点保证复旦标识使用准确、PPT 与 HTML 版式一致、学术气质克制且高辨识度。

> This is an independent Codex skill for creating Fudan University–styled academic presentations. It is not an official Fudan University product.
>
> 本项目为个人整理的 Codex Skill，并非复旦大学官方产品。

## 简介

`fudan-ppt` 面向课程汇报、研究展示、论文答辩、学院报告、招生宣讲和校友活动等场景。Skill 内置复旦大学 SVG 校徽、校名视觉参考、标准色参考、HTML 模板、跨格式一致性规范和输出检查流程，可帮助 Codex 在生成演示文稿时稳定遵守品牌、安全和版式约束。

核心目标不是复刻某个模板，而是建立一个可复用的“复旦学术视觉系统”：高纯度蓝 / 红 / 绿三套主色，充足留白，清晰标题层级，严格页码位置，固定身份锚点，以及 PPTX 与 HTML 之间的同一坐标母版。

## 主要能力

- 生成复旦大学风格的学术型 `.pptx` 演示文稿。
- 生成横向 16:9、自包含、可离线播放的 HTML 幻灯片。
- 支持 AI 辅助生成非校园、非真实人物的匿名化视觉素材。
- 内置蓝色、红色、绿色三套高纯度学术色系。
- 使用原始复旦大学 SVG 校徽或由其确定性渲染的显示资产。
- 支持用户提供的透明校徽 / 校名组合图作为页眉或页脚身份锚点。
- 通过 1280 × 720 坐标母版统一 PPT 与 HTML。
- HTML 图片统一内嵌为 Base64，适合本地单文件播放。
- 内置动画状态约束，避免 HTML 翻页动画结束后回跳到第一页。
- 明确禁止 AI 生成复旦建筑、校门、具名人物或伪造校徽。

## 设计原则

1. **准确使用标识**  
   使用 skill 内置的复旦 SVG 校徽和已授权 / 已提供的校名视觉资产，不通过 AI 重绘、仿制或重新生成校徽与校名字形。

2. **学术而非装饰**  
   以内容、证据、层级和节奏驱动版式，避免玻璃拟态、复杂仪表盘、过度渐变和模板化装饰。

3. **PPT 与 HTML 同源**  
   同一页必须由同一套坐标、尺寸、颜色、文本和图片裁切关系驱动；不能把 PPT 和 HTML 当成两个不同设计。

4. **可离线交付**  
   HTML 输出必须将所有图片转为 `data:image/...;base64,`，避免远程图片和相对路径依赖。

5. **安全使用 AI 视觉**  
   可以生成抽象图、概念图、匿名年轻学生等通用视觉，但不得生成复旦建筑、真实人物、校徽或可误认为官方素材的图像。

## 输出格式

### PowerPoint

- 原生 `.pptx`，不是截图型幻灯片。
- 推荐渲染后逐页检查标题、正文、页脚、页码和校徽位置。
- 当 PowerPoint 渲染链无法正确解析 SVG 样式时，使用 skill 中的确定性显示资产。

### HTML

- 固定 1280 × 720 逻辑画布，并按视口等比缩放。
- 支持键盘翻页、页码、动画、减少动态效果模式。
- 所有 `<img>` 必须是 Base64 data URL。
- 动画不能改变最终静态版式。

### AI Visuals

- 仅在图像确实增强表达时使用。
- 不把文字、图表、校徽或密集标签放进生成图像里。
- 不生成复旦校园建筑、校门、真实或具名人物。

## 目录结构

```text
fudan-ppt/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── assets/
│   ├── fudan-university-logo.svg
│   ├── fudan-identity-lockup-blue.png
│   ├── fudan-identity-lockup-transparent-user.png
│   ├── fudan-name-treatment-reference.png
│   ├── fudan-blue-standard-reference.png
│   ├── fudan-red-standard-reference.png
│   └── fudan-web-deck.html
├── references/
│   ├── brand-system.md
│   ├── html-output.md
│   ├── pptx-output.md
│   ├── cross-format-parity.md
│   ├── layouts.md
│   ├── cover-imagery.md
│   └── ai-visuals.md
└── scripts/
    ├── inline_fudan_logo.py
    └── inline_html_images.py
```

## 使用示例

### 渲染图参考

仓库内提供了一套 20 页示例渲染图，便于快速查看 skill 的视觉效果与版式变化：

- [Wittgenstein demo renderings](examples/wittgenstein-demo/)

```text
使用 fudan-ppt skill，生成一份 20 页复旦大学研究生课程论文答辩 PPT，主题为“维特根斯坦：语言的限度与生活形式”，同时输出 .pptx 和单文件 HTML。
```

```text
用复旦蓝风格生成一个 12 页科研项目汇报，要求每页有复旦身份锚点，HTML 版本必须可离线播放。
```

```text
设计一页复旦风格论文答辩封面，使用蓝色主色，不生成校园建筑图片，可以使用低透明度抽象背景。
```

## 质量检查

交付前建议检查：

- 每页是否都有复旦身份锚点。
- 校徽是否使用 skill 中的准确资产，而非 AI 重绘。
- PPT 与 HTML 的封面和关键内页是否视觉一致。
- 页码位置是否统一。
- HTML 是否没有远程图片、相对图片路径或外部依赖。
- 键盘翻页后，动画结束不会跳回第一页。
- 是否误用了 AI 生成的复旦建筑、真实人物或官方标识。

## 版权与商标提醒

复旦大学名称、校徽和相关视觉识别属于其权利方。本 skill 仅用于辅助生成符合给定素材约束的演示文稿，不授予任何商标、校徽或官方身份使用许可。公开发布或商业使用前，请自行确认相关授权与合规要求。

## 署名与权利归属

复旦大学名称、校徽、校名视觉识别、标准色及相关设计元素之知识产权与使用权归复旦大学及相应权利方所有。本项目仅在给定素材与使用约束下进行演示文稿生成流程设计，不构成对复旦大学视觉识别系统的再授权、转授权或官方发布。

本 skill 的流程设计、版式系统与跨格式生成规范由复旦大学所孵化的 **JZ Creative Studio** 进行整理与设计，并在 Codex 工作流中复合吸收 [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) 的演示文稿生成范式及 [AnimXYZ](https://github.com/ingram-projects/animxyz) 的层级化动效组织能力而形成。

---

# Fudan PPT Skill

A Codex skill for creating Fudan University–styled academic presentations. It supports native PowerPoint `.pptx`, single-file offline HTML slide decks, and optional AI-assisted visual generation, while enforcing precise identity usage, cross-format layout parity, and a restrained academic visual tone.

## Overview

`fudan-ppt` is designed for seminar talks, research presentations, thesis defenses, institutional reports, recruitment decks, and alumni events. It bundles the Fudan SVG seal, supplied wordmark references, color references, an HTML deck template, cross-format parity rules, and validation workflows so Codex can generate presentations with consistent branding and layout discipline.

The goal is not to copy a marketplace template. The skill defines a reusable Fudan academic visual system: high-chroma blue / red / green palettes, generous whitespace, clear typographic hierarchy, fixed page-number chrome, stable identity anchors, and one shared 1280 × 720 layout master for both PPTX and HTML.

## Key Features

- Create Fudan-styled academic `.pptx` presentations.
- Create self-contained 16:9 HTML slide decks for offline playback.
- Use optional AI-assisted visuals for abstract or anonymous, non-campus imagery.
- Support blue, red, and green high-saturation academic color systems.
- Use the original Fudan SVG seal or deterministic display assets derived from it.
- Support user-supplied transparent identity lockups in headers or footers.
- Keep PPTX and HTML aligned through one coordinate-based master layout.
- Inline all HTML images as Base64 data URLs.
- Enforce animation state rules to prevent HTML slides from jumping back to the cover after transitions.
- Prohibit AI-generated Fudan buildings, gates, named people, or fake institutional marks.

## Design Principles

1. **Use identity assets precisely**  
   Use the bundled Fudan SVG seal and supplied identity assets. Do not redraw, imitate, recolor, or regenerate the seal or wordmark with AI.

2. **Academic, not decorative**  
   Let content, evidence, hierarchy, and rhythm drive the slide. Avoid glassmorphism, fake dashboards, heavy gradients, and generic template ornament.

3. **One master, two outputs**  
   Each paired PPTX / HTML slide must share the same coordinates, dimensions, colors, text, image crop, and z-order.

4. **Offline by default**  
   HTML output must use `data:image/...;base64,` for every image and avoid remote or relative image dependencies.

5. **Safe AI visual usage**  
   Use generated visuals only for generic, abstract, or anonymous imagery. Never generate Fudan buildings, real people, logos, or anything that could be mistaken for official institutional artwork.

## Output Modes

### PowerPoint

- Native `.pptx`, not a screenshot deck.
- Render and inspect each slide before delivery.
- Use deterministic display assets when the PowerPoint renderer cannot preserve SVG styling.

### HTML

- Fixed 1280 × 720 logical stage with uniform viewport scaling.
- Keyboard navigation, slide counter, animation, and reduced-motion support.
- All `<img>` elements must be Base64 data URLs.
- Motion must never change the resting layout.

### AI Visuals

- Use only when a visual materially improves the slide.
- Keep text, charts, logos, and dense labels out of generated images.
- Never generate Fudan campus buildings, gates, identifiable people, or institutional marks.

## Example Prompts

### Rendered Example

A 20-slide rendered demo is included for quick visual reference:

- [Wittgenstein demo renderings](examples/wittgenstein-demo/)

```text
Use the fudan-ppt skill to create a 20-slide Fudan University graduate seminar defense deck on “Wittgenstein: The Limits of Language and Forms of Life,” with both .pptx and single-file HTML outputs.
```

```text
Create a 12-slide research project report in the Fudan blue system. Every slide must include a Fudan identity anchor, and the HTML version must work fully offline.
```

```text
Design one Fudan-styled thesis defense cover in the blue system. Do not generate campus architecture; use a low-opacity abstract background if helpful.
```

## Validation Checklist

Before delivery, verify:

- Every slide includes a Fudan identity anchor.
- The seal comes from bundled assets, not AI recreation.
- PPTX and HTML match on the cover and representative interior slides.
- Page-number placement is consistent.
- HTML contains no remote images, relative image paths, or external dependencies.
- Keyboard navigation remains stable after animations complete.
- No AI-generated Fudan buildings, named people, or fake official marks appear.

## Trademark and Rights Notice

The Fudan University name, seal, and visual identity belong to their respective rights holders. This skill only helps generate presentations under the constraints of supplied assets; it does not grant any trademark, seal, or official-identity usage rights. Confirm authorization and compliance before public or commercial use.

## Attribution and Rights

The Fudan University name, seal, wordmark treatment, color references, and related visual identity elements remain the intellectual property of Fudan University and their respective rights holders. This project is a presentation-generation workflow built under supplied asset constraints; it does not constitute any sublicense, redistribution right, or official release of the Fudan University visual identity system.

The skill workflow, layout system, and cross-format generation rules were designed and organized by **JZ Creative Studio**, incubated by Fudan University, and composed within a Codex workflow by integrating presentation-generation ideas from [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) with layered animation concepts inspired by [AnimXYZ](https://github.com/ingram-projects/animxyz).
