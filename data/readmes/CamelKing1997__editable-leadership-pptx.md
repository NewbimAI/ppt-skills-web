#BRANCH:main
# editable-leadership-pptx | Codex PPT Skill for Editable PowerPoint and Presentation Decks

一个面向中文用户的 Codex PPT skill、PowerPoint skill 和 presentation skill，用于生成或修订适合领导/业务汇报场景的可编辑 `16:9 .pptx`、PowerPoint 演示文稿和 presentation deck。

English version: [README.en.md](./README.en.md)

## 项目定位

`editable-leadership-pptx` 是一个社区维护的 Codex skill。它基于 Codex 内置 `slides` skill 的工作流、helper 能力和审阅脚本构建，并针对领导汇报场景做了专门化封装，包括：

- 更强的领导视角和业务叙事约束
- 更明确的证据优先与截图式 QA 要求
- 更适合项目复盘、进展汇报、模型评估和实验结果汇报的默认写法

本仓库不是 OpenAI 官方仓库、官方 skill 发布物，也不代表 OpenAI 对本项目的背书、支持或认证。

## 与 Codex `slides` skill 的关系

这个仓库不是从零实现的一套新工具链，而是在 Codex `slides` skill 的基础能力之上做了场景化封装。

- 本仓库内置并复用了 `slides` 工作流中的部分 helper 与 review 脚本
- `assets/pptxgenjs_helpers/` 和 `scripts/slides/` 下包含 vendored 或改编后的本地资源
- 若文件头部保留了上游版权声明，应继续保留，不应移除
- 相关来源与归属说明见 [NOTICE](./NOTICE) 和 [LICENSE.txt](./LICENSE.txt)

为了降低运行时依赖和分发复杂度，本仓库将相关能力本地化，因此使用本 skill 时不要求额外依赖外部 `slides` skill。

## 适用场景

- 项目阶段性进展汇报
- 领导/业务评审材料
- 模型或实验结果复盘
- 技术能力对业务结果的解释型页面
- 将现有粗糙 deck 重构为可编辑、可复用、可审阅的 PPT
- 需要生成 PowerPoint、PPT、presentation deck 或 editable pptx 的 Codex 工作流

## 核心能力

- 输出必须保持为可编辑 `16:9 .pptx`
- 默认采用白底、低饱和、少色块、少文字的领导汇报风格
- 强调图表、结构图、时间线、前后对比等证据型页面
- 要求用截图或栅格化结果做视觉 QA，而不是只看编辑器
- 提供本地 bootstrap、render、montage、overflow、font 检查等工具

## 仓库结构

```text
editable-leadership-pptx/
├─ SKILL.md
├─ README.md
├─ README.en.md
├─ NOTICE
├─ LICENSE.txt
├─ .gitignore
├─ .gitattributes
├─ agents/
│  └─ openai.yaml
├─ references/
│  ├─ executive-pptx-rules.md
│  ├─ authoring-strategy.md
│  ├─ environment-setup.md
│  ├─ pptxgenjs-helpers.md
│  └─ apple-keynote-aesthetic.md
├─ scripts/
│  ├─ review_deck.py
│  ├─ validate_deck.py
│  ├─ bootstrap_slides_tooling.py
│  └─ slides/
└─ assets/
   ├─ slides-small.svg
   ├─ slides.png
   └─ pptxgenjs_helpers/
```

## 安装到 Codex

请将当前仓库 clone 到你的本地 skill 目录，仓库地址请替换为你自己的 fork 或发布地址：

```bash
git clone <repository-url> ~/.codex/skills/editable-leadership-pptx
```

如果你希望把仓库放在别的目录，再链接到 Codex：

```bash
git clone <repository-url> ~/codex-skills/editable-leadership-pptx
ln -s ~/codex-skills/editable-leadership-pptx ~/.codex/skills/editable-leadership-pptx
```

Windows 示例：

```powershell
git clone <repository-url> $env:USERPROFILE\.codex\skills\editable-leadership-pptx
```

## 使用方式

在 Codex 中显式调用：

```text
Use $editable-leadership-pptx to build or revise this deck as an editable 16:9 .pptx.
```

中文场景下更常见的写法：

```text
Use $editable-leadership-pptx，根据当前项目代码、实验结果和模型评估数据，生成一份给领导汇报的可编辑 16:9 PPT。
```

## 本地开发与验证

环境安装说明见：

- [references/environment-setup.md](./references/environment-setup.md)

常用命令：

```bash
python scripts/bootstrap_slides_tooling.py path/to/workspace --all
python scripts/review_deck.py path/to/deck.pptx
python scripts/review_deck.py path/to/deck.pptx --deep
python scripts/validate_deck.py path/to/deck.pptx --strict
```

如果你在自己的 Codex 环境中还维护了额外的 skill 校验脚本，请按你的本地环境单独执行；本 README 不再假定任何特定用户名、磁盘路径或私有目录结构。

## 公开仓库使用建议

如果你准备把基于本 skill 的项目或模板公开：

- 不要提交真实业务汇报材料、客户数据、截图、日志或导出的评审产物
- 不要把本机路径、用户名、邮箱、令牌或临时环境目录写进文档
- 保留上游文件中的版权和许可证声明
- 如果你修改了 vendored 文件，建议在提交说明或文档中明确标注修改范围

## 开源与归属说明

- 本仓库包含原创内容，也包含基于 Codex `slides` skill 工作流整理、vendored 或改编的资源
- 若适用文件中包含 `Copyright (c) OpenAI` 等版权声明，应按原样保留
- `LICENSE.txt` 提供了仓库内相关 vendored 资源所需保留的 Apache License 2.0 文本
- `Codex`、`OpenAI`、`slides` 等名称在本仓库中仅用于描述来源、兼容性或适用场景，不表示官方从属、授权推广或商业背书

如果你计划将本仓库进一步分发、二次发布或合并到内部模板体系中，建议由你的法务或开源合规流程再做一次复核。

## 搜索关键词

如果你是通过 GitHub 或搜索引擎在找 PPT 相关 skill，可以用下面这些词找到本项目：

- PPT skill
- ppt skill
- PowerPoint skill
- presentation skill
- slides skill
- editable pptx
- PowerPoint presentation generator
- executive presentation
- leadership deck
- Codex skill for PPT
- Codex PowerPoint skill
- AI PPT workflow
