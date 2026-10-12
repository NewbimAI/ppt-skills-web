#BRANCH:main
# ppt-image-to-editable

`ppt-image-to-editable` 是一个用于制作高设计感 PPT 的 Codex skill。它的目标流程是：先用 `image2` / `gpt-image-2` 生成完整 16:9 PPT 页面 PNG，确认视觉效果后，再把 PNG 自动拆成多个可移动元素，并重建为可编辑 `.pptx`。

## 当前建议

需要说明一个现实限制：目前 Codex 里直接调用 `image2` / `gpt-image-2` 的能力和稳定性仍然有一些问题。实际使用时，更推荐先把 `ppt-image-to-editable/references/prompt-templates.md` 里的提示词复制出来，拿到 ChatGPT 网页端或其他能明确调用图片模型的入口里使用。

也可以在 Codex 里直接尝试这个 skill，但现在想要稳定得到“视觉高度一致、元素充分拆分、文字可编辑”的 PPTX 效果还不算理想。相比之下，直接使用这些提示词做图片生成、改图、逐页视觉设计，效果通常更好。

## 适合做什么

- 生成高级大气、视觉完成度高的 PPT 页面图。
- 做答辩报告、项目汇报、作品集、研究展示、方案汇报等正式场景的视觉方案。
- 先获得完整页面 PNG，再尝试拆分为可移动元素和 OCR 可编辑文本框。
- 把复杂页面保留为高保真图片切片，同时补充可编辑文字层，方便后续修改。

## 核心流程

1. 先向用户提问并确认：页数、暗底/亮底、标题、风格、受众、资料范围、语言、质量参考。
2. 使用 `image2` / `gpt-image-2` 生成完整 PPT 页面 PNG。
3. 按视觉质量门槛自检，未达到高级大气、正式汇报感和足够视觉密度时重新生成。
4. 用户确认 PNG 后，自动拆分页面元素。
5. 根据 manifest 重建可编辑 PPTX。
6. 渲染对比原 PNG，输出 QA 结果，再交给用户最终确认。

## 风格要求

当前版本不再追求堆砌式装饰。默认目标是：

- 高级大气，而不是堆砌装饰。
- 具有答辩报告、项目汇报、正式演示的专业感。
- 页面信息层级清楚，视觉元素密度足够。
- 有主视觉、结构图、图表、色块、连接线、标签、纹理和空间层次。
- 避免空洞模板、低密度卡片页、僵硬网格、普通标题加正文的低完成度页面。

## 可编辑性的边界

这里的“无损拆分”指从确认后的 PNG 中按像素裁切元素，保留原始像素、比例、坐标和层级。它不承诺恢复生成 PNG 之前的真实矢量源文件、隐藏图层、原生图表数据或原字体渲染引擎。

默认可编辑范围是：

- 较大的视觉模块可以单独选中、移动、缩放。
- OCR 检测到的文字区域会叠加可编辑文本框。
- 原始文字 PNG 切片会保留，用来保证视觉一致。

如果页面非常复杂，部分细碎纹理和微小元素可能会合并为图片模块，并在 QA 报告中说明。

## 安装

把 skill 文件夹复制到 Codex skills 目录：

```powershell
Copy-Item -Recurse -Force .\ppt-image-to-editable "$env:USERPROFILE\.codex\skills\ppt-image-to-editable"
```

然后重启或刷新 Codex，让 skill 列表重新加载。

## 依赖

PNG 拆分和 PPTX 重建需要：

- Python 包：`pillow`、`numpy`、`opencv-python`、`pytesseract`
- OCR 运行时：Tesseract 或同等 OCR 模型/运行环境
- PPTX 生成：内置 Python 脚本、`pptxgenjs` 或同等 presentation runtime
- 渲染 QA：PowerPoint、LibreOffice、artifact-tool presentation renderer 或其他能把 PPTX 渲染成 PNG 的工具
- 图片生成入口：能明确选择 `image2` / `gpt-image-2`

依赖缺失时，skill 应该停止并报告阻塞，不能假装已经完成 OCR 或可编辑 PPTX。

## 质量参考

如果需要严格对齐某种视觉水准，请在本地提供参考 deck 或参考图片。参考材料不包含在本仓库中，也不应该提交到公开仓库。

仓库的 `.gitignore` 已用于排除源 PPT、生成 PNG、拆分资产、QA 输出和凭据文件。

## 目录结构

```text
ppt-image-to-editable/
  SKILL.md
  agents/
    openai.yaml
  references/
    prompt-templates.md
    qa-checklist.md
    visual-quality-gate.md
  scripts/
    split_png_elements.py
    build_editable_pptx.py
    render_and_compare.py
```

## 验证

发布或安装前建议运行：

```powershell
$env:PYTHONUTF8 = "1"
python -m py_compile .\ppt-image-to-editable\scripts\split_png_elements.py .\ppt-image-to-editable\scripts\build_editable_pptx.py .\ppt-image-to-editable\scripts\render_and_compare.py
```

本仓库不包含用户参考文件、生成输出、本地机器路径或 API 凭据。
