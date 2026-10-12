#BRANCH:main
# iml-pptx — 文案 → 可编辑 PPTX

📖 **English**: [README_en.md](./README_en.md)

把一段文案 / 文章 / 报告，先用 **gpt-image-2** 逐页生成漂亮的整页 PPT 图，再把图**反向重建成对象级可编辑**的 PowerPoint。对应公众号文章《我做了一个能够生成可编辑PPT的SKILL》里说的 **iML-PPTX** 思路。

本目录是把上游两个 MIT 开源 skill **原样 vendor** 进来，加一层 Claude Code 适配说明。来源与版本见 [`UPSTREAM.md`](./UPSTREAM.md)。

> ### 🟣 这是用 Claude Code 复刻了 Codex 的「可编辑 PPTX」能力
> 原始两个 skill 由 [ningzimu](https://github.com/ningzimu) 为 **Codex** 编写，且作者声明*只在 Codex 验证过*。本仓库把它们移植到 **Claude Code** 跑通——尤其是最有价值的那一步：**把整页 PPT 图反向重建成「对象级可编辑」的 PowerPoint**（原生文本框 / 形状，能逐个点选改字、改数字、拖卡片），而不是把整页截图塞进 PPT。
>
> ### 🔑 必须自备 OpenAI `gpt-image-2`（Image 2）API
> 出图引擎是 OpenAI 的 **gpt-image-2**，**需要你自己去 OpenAI 申请 API 访问**并配置环境变量 `OPENAI_API_KEY`（可选 `OPENAI_BASE_URL` 走兼容中转）。没有 key 就只能拿**已有图片**走「可编辑化」那半边，跑不了「文案→出图」那半边。申请地址：<https://platform.openai.com/>。

## ✨ 效果展示（同一份「电动汽车的黄金十年」3 页 deck）

左：gpt-image-2 生成的整页设计图；右：复刻成**对象级可编辑** PowerPoint（每个标题/数字/卡片都能点开改，图表是原生形状）。

| ① gpt-image-2 生成（整页图，不可编辑） | ② 复刻成可编辑 PPTX（原生文本框 + 形状） |
|---|---|
| ![cover](assets/showcase/01-gen-cover.jpg) | ![cover-editable](assets/showcase/01-edit-cover.jpg) |
| ![data](assets/showcase/02-gen-data.jpg) | ![data-editable](assets/showcase/02-edit-data.jpg) |
| ![trends](assets/showcase/03-gen-trends.jpg) | ![trends-editable](assets/showcase/03-edit-trends.jpg) |

> 右侧数据页是 **33 个原生文本框 + 23 个原生形状、0 张图片** —— 折线图、坐标轴、38% 圆环、KPI 全是可编辑对象。保真取舍：背景压平、霓虹辉光未还原（“宁可视觉略糙也要可编辑”）。

## 两阶段流水线

```
文案/文章/PDF
   │
   ▼  ① codex-ppt/            （出图半边，稳）
大纲 → 选风格 → gpt-image-2 逐页出 16:9 图 → assemble_ppt.py 组装
   │                                            → 图片版 .pptx + speech.md
   ▼  ② image-to-editable-ppt/  （可编辑半边，慢/贵/实验性）
逐页视觉重建：文字→原生文本框、几何→形状、复杂视觉→图片资产
   │
   ▼
对象级可编辑 .pptx
```

- 只想要"漂亮的图片版 PPT"：只跑 ①。
- 要"能逐个点选改字的 PPT"：① 出图后接 ②。
- 已有现成的 slide 图 / PDF / 图片版 pptx：可直接从 ② 进入。

## 前提

```powershell
# 图像后端用 OpenAI gpt-image-2，需要 key（和你的 gpt-image skill 同一个）
$env:OPENAI_API_KEY = 'sk-...'          # 或写进 ~/.claude/settings.local.json 的 credentials.openai.api_key
# 可选：走第三方中转
$env:OPENAI_BASE_URL = 'https://your-endpoint/v1'

# 依赖（本机已装，换机器时跑）
python -m pip install -r codex-ppt/requirements.txt -r image-to-editable-ppt/requirements.txt
```

## Codex → Claude Code 适配对照

两个 skill 原文是给 Codex 写的，在 Claude Code 里这样对应（**脚本本身不用改，改的是你执行 SKILL.md 时的理解**）：

| 上游（Codex）写法 | Claude Code 里怎么做 |
|---|---|
| `$imagegen` / built-in `image_gen` | 用你已装的 **`gpt-image` skill**（`~/.claude/skills/gpt-image/generate.py`），或脚本自带的 `codex-ppt/scripts/image_gen.py`（读 `OPENAI_API_KEY`） |
| "dispatch slide / page **subagent**" | 用 **Agent 工具**（`subagent_type: general-purpose`）每页一个子 agent；并发受 `max_concurrent_pages` 约束 |
| `$skill-installer` / `npx skills add` | 不需要——本目录已 vendor，直接跑脚本 |
| `~/.codex-ppt-skill/` 运行时目录 | 同样生效，或用 `CODEX_PPT_HOME` 环境变量改位置 |
| `AGENTS.md` / `agents/*.yaml` | Codex UI 元数据，Claude Code 里忽略 |

## 怎么用（最常见：文案 → 可编辑 PPT）

1. 读 `codex-ppt/SKILL.md`，按它的 12 步工作流走：理解文案 → 定大纲（`outline.md`）→ 选风格（`codex-ppt/references/` 有 10 种）→ 确认图像后端 → 出 1 张样张让用户确认 → 逐页出图 → QA → `assemble_ppt.py` 组装。
   - 上游强约束：**正式页必须由图像后端生成**，不许用 Pillow/HTML/python-pptx 本地画图冒充。
2. 满意后读 `image-to-editable-ppt/SKILL.md`，把 ① 的 `origin_image/slide_*.png`（或 PDF）喂进去：`prepare_deck_run.py` → 每页 Agent 重建 → `finalize_deck_run.py` 出 `final/<origin>_edited.pptx`。

组装脚本的目录约定（已验证）：
```
<base_dir>/<pptx名去扩展名>/
├── origin_image/ slide_01.png slide_02.png ...   # 正式页，命名必须 slide_NN
└── speech.md                                     # 可选，## Slide N: 标题 + 备注
# 跑： python codex-ppt/scripts/assemble_ppt.py --ar 16:9 <base_dir> <名字>.pptx
```

## 状态（诚实标注，截至 2026-06-05）

- ✅ **已在本机验证**：依赖装好；5 个核心脚本 `--help` 全 exit 0；`assemble_ppt.py` 端到端跑通——2 张占位图 → 16:9 两页 pptx + 正确 speaker notes，python-pptx 回读确认。
- ⚠️ **未在本机端到端验证**：真正调 gpt-image-2 出图（需要 key + 花钱）、image-to-editable 的多 agent 重建链。上游说这半边 **token 约 2–3×、单页约 10 分钟、需强视觉模型、不保证 100% 复刻，且只在 Codex 验证过**。第一次用建议先拿 ① 出图、② 拿一两页小样跑通再放量。

## 限制 / 注意

- gpt-image-2 没有精确 16:9 尺寸，最接近横版 `1536x1024`(3:2)；codex-ppt 默认按 2K 16:9 出图（内部用提示词约束版式），可调 4K 提升文字清晰度。
- 生成的图片/中间产物请落到 `D:/tmp/...` 或项目外，别提交进仓库。
- 可编辑重建是 best-effort，复杂图表/截图会保留为图片资产而非可编辑对象——这是设计取舍（宁可视觉略糙也不拿整页 raster 冒充可编辑）。
