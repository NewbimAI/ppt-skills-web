#BRANCH:main
# 可编辑 PPTX 生成 Skill

把结构化 JSON 规格或 PNG 幻灯片参考图生成分层、可编辑的 PowerPoint 文件。目标不是把整页烘焙成一张图片，而是尽量使用 PowerPoint 原生对象：文本框、形状、表格、图表和独立图片图层。

这个仓库同时包含两部分：

- 一个可直接放入 Codex / Claude 的 skill 目录，入口是 `SKILL.md`
- 一套 Node.js 命令行工具，位于 `scripts/editable-pptx/`

## 能做什么

- 生成包含原生文本和原生形状的 `.pptx`
- 把 PNG 幻灯片截图近似重建为可编辑 slide
- 把复杂照片、截图、复杂图表主体保留为独立图片图层
- 输出 `manifest.json` 和预览图，方便检查生成结果
- 解析 `.pptx` 内部 XML，验证是否不是单图 PPT

## 安装

```bash
git clone https://github.com/Liuguanyi2125/editable-pptx-skill.git
cd editable-pptx-skill
npm install
```

环境要求：

- Node.js 20 或更新版本
- npm

## 快速演示

```bash
npm run demo
```

运行后会生成并验证：

```text
outputs/pptx/editable-pptx-demo/
  deck.pptx
  manifest.json
  preview-slide-01.png
```

## 命令行用法

从 JSON 规格生成 PPTX：

```bash
node scripts/editable-pptx/generate-editable-pptx.mjs \
  scripts/editable-pptx/examples/editable-demo.json \
  --output outputs/pptx/editable-pptx-demo
```

验证生成结果：

```bash
node scripts/editable-pptx/validate-editable-pptx.mjs \
  outputs/pptx/editable-pptx-demo/deck.pptx \
  outputs/pptx/editable-pptx-demo/manifest.json
```

从 PNG 快速生成一页粗重建版：

```bash
node scripts/editable-pptx/reconstruct-png-slide.mjs /absolute/path/to/source.png \
  --project png-rebuild-demo \
  --title "PNG 重建页"
```

## 作为 Skill 使用

如果要作为 Codex 或 Claude skill 使用，把整个仓库文件夹复制到你的本地 skills 目录。请保持目录完整，因为 `SKILL.md` 会调用内嵌脚本：

```text
scripts/editable-pptx/
```

Skill 的主说明在 `SKILL.md`。设计规则和图片重建规则在 `references/`。

## JSON 规格

当前生成器支持这些页面类型：

- `cover`
- `principle`
- `workflow`
- `custom`
- `png-rebuild`

示例文件：

```text
scripts/editable-pptx/examples/editable-demo.json
scripts/editable-pptx/examples/aesthetic-demo.json
```

## 当前限制

- PNG 重建是视觉临摹，不是恢复原始图层。
- 复杂图表主体更适合作为独立图片图层放入 PPTX，标题和注释继续用原生文本。
- 验证脚本只检查 PPTX 内部对象结构，不能替代人工视觉检查。
- 当前版本没有接入外部 AI 生图 API。

## 许可证

MIT
