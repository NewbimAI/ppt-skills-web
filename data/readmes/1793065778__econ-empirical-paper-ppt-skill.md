#BRANCH:main
# 经管类实证论文汇报 PPT Skill

这是一个用于 Codex / ChatGPT 编码工作流的本地 skill，目标是把一篇经管类实证论文整理成一套可继续制作 PPT 的中文学术汇报蓝图。

它适合课堂汇报、组会汇报、文献分享、开题或答辩预演等场景，尤其适合“论文很长、表格很多、但需要快速整理成 20 页左右汇报结构”的任务。

## 它能做什么

本 skill 不是简单摘要工具，而是按经管类实证论文的汇报逻辑拆解材料：

- 判断论文是否属于经管类实证论文
- 提取用户要求、页数、时长、是否需要文献扩展等约束
- 从参考 PPT 中学习汇报风格，例如标题层级、表格密度、结论位置、强调方式
- 拆解目标论文的研究问题、数据、变量、模型、结果、稳健性、异质性、机制和结论
- 转写全文表格清单与进入 PPT 的核心表格
- 生成逐页 PPT 蓝图，每页包含页面功能、核心文字说明、图表/证据设计和本页结论
- 输出质量检查报告，提示表格、公式、证据锚定和页数结构是否存在风险

## 重要说明：这里输出的是文档，不是最终 PPT

本 skill 的核心产物是 Markdown 文档，尤其是 `final_ppt_blueprint.md`。它会告诉你每一页 PPT 应该放什么文字、什么表格、什么公式、什么结论。

但它默认不直接生成精美 PPTX，也不直接生成逐页图片。原因是高质量 PPT 页面不仅需要内容，还需要版式、留白、字体层级、表格压缩、颜色风格和视觉平衡。对于“模仿已有 PPT 风格生成新页面”这一环节，目前更推荐使用网页版 ChatGPT 的文生图模型完成。

推荐工作流是：

```text
论文 + 参考 PPT
        ↓
本 skill 生成 final_ppt_blueprint.md
        ↓
把参考 PPT 页面截图 + 单页蓝图文字交给 ChatGPT 网页版文生图模型
        ↓
生成 16:9 单页 PPT 风格图片
        ↓
人工微调 / 放入 PowerPoint / 继续迭代
```

## 目录结构

```text
econ_empirical_paper_ppt_skill/
├─ SKILL.md
├─ README.md
├─ config/
│  ├─ default.yaml
│  └─ user.yaml
├─ prompts/
│  ├─ 00_collect_requirements.md
│  ├─ 01_style_extraction.md
│  ├─ 02_empirical_paper_check.md
│  ├─ 03_paper_analysis.md
│  ├─ 04_table_extraction.md
│  ├─ 05_ppt_blueprint.md
│  ├─ 06_literature_expansion.md
│  ├─ 07_final_merge.md
│  └─ 08_quality_report.md
├─ templates/
├─ checklists/
├─ examples/
├─ inputs/
└─ outputs/
```

## 默认输入

将材料放入 `inputs/`，或在和 Codex 对话时直接提供文件路径。

```text
inputs/
├─ target_paper.pdf / target_paper.docx     # 必需：目标论文
├─ standard_ppt.pptx                        # 推荐：参考汇报 PPT
├─ requirements.png                         # 可选：课程或老师要求截图
├─ user_notes.md                            # 可选：页数、时长、侧重点等补充说明
├─ old_blueprint.md                         # 可选：旧版汇报蓝图
└─ reference_papers/                        # 可选：参考论文
```

如果你不想放入 `inputs/`，也可以直接在 Codex 中这样说：

```text
严格按照 C:\Users\...\econ_empirical_paper_ppt_skill 这个 skill 的工作流，
基于这篇论文：C:\...\target_paper.docx，
参考 PPT：C:\...\standard_ppt.pptx，
生成 25 分钟、20 页左右的经管类实证论文汇报蓝图。
不需要文献拓展。
```

## 默认输出

所有结果默认输出到 `outputs/`：

```text
outputs/
├─ user_requirements.md          # 用户要求与任务约束
├─ empirical_paper_check.md      # 经管类实证论文识别
├─ style_profile.md              # 参考 PPT 风格提取
├─ paper_analysis.md             # 论文内容深度拆解
├─ table_inventory.md            # 全文表格清单
├─ core_tables.md                # 进入 PPT 的核心表格
├─ ppt_blueprint_paper.md        # 论文主体汇报蓝图
├─ final_ppt_blueprint.md        # 最终汇报蓝图
└─ final_quality_report.md       # 质量检查报告
```

如启用外部文献扩展，还会生成：

```text
outputs/
├─ literature_request.md
├─ literature_results.md
├─ topic_expansion.md
└─ ppt_blueprint_extension.md
```

## 单页蓝图格式

每一页默认使用固定模块，方便继续交给人或 AI 生成 PPT 页面。

```markdown
## 第X页｜页面标题

【页面功能】
说明这一页在整场汇报中的作用。

【核心文字说明】
用一段 80-160 字左右的中文学术汇报文字解释本页内容。

【图表/证据设计】
直接写出本页要展示的表格、公式、模型式、机制框架或证据材料。

【本页结论】
用 20-60 字写出可以放在页底的结论。
```

## 使用方式

### 方式一：作为 Codex skill 使用

把本目录放到 Codex 的 skills 目录下，例如：

```text
C:\Users\<你的用户名>\.codex\skills\econ_empirical_paper_ppt_skill
```

然后在 Codex 中明确引用它：

```text
严格按照 econ_empirical_paper_ppt_skill 的工作流，
帮我把这篇经管类实证论文整理成 20 页左右、25 分钟汇报用的 PPT 蓝图。
论文路径是：...
参考 PPT 路径是：...
不需要文献拓展。
```

### 方式二：手动使用 prompt

如果你不使用 Codex skill，也可以按 `prompts/` 中的顺序，把每一步 prompt 复制给 ChatGPT 或其他模型执行：

1. `00_collect_requirements.md`
2. `02_empirical_paper_check.md`
3. `01_style_extraction.md`
4. `03_paper_analysis.md`
5. `04_table_extraction.md`
6. `05_ppt_blueprint.md`
7. `07_final_merge.md`
8. `08_quality_report.md`

如果需要补充文献，再使用 `06_literature_expansion.md`。

## 如何用网页版 ChatGPT 生成 PPT 页面图片

`final_ppt_blueprint.md` 生成后，建议逐页生成图片，而不是一次性要求生成整套 PPT。每次给模型三类信息：

- 参考 PPT 页面截图：最好给 2-4 张同一模板下的页面
- 当前页蓝图文字：从 `final_ppt_blueprint.md` 中复制一页
- 风格生成指令：要求模型学习风格并自主设计，而不是机械复刻

### 第一步：让模型先学习参考 PPT 风格

可以先对网页版 ChatGPT 这样说：

```text
你现在是一位拥有顶尖 AI 文生图使用经验的专业人员。
我想把经管论文汇报的内容整理成 PPT 页面文案，然后让 AI 模仿已有风格，把这些文案转化为和已有风格类似的 PPT 图片。

请你先阅读我提供的参考 PPT 页面截图，总结一套可复用的文生图提示词。
要求：
1. 不要把所有细节机械写死；
2. 要引导 AI 学习参考图的版式语言、标题层级、颜色、字体气质、表格风格和留白；
3. 要让 AI 根据新内容自主决定表格列宽、字号层级、重点高亮和模块排列；
4. 最终提示词要适合生成 16:9 的经管类论文汇报单页 PPT 图片。
```

### 第二步：用总结出的 prompt 生成单页 PPT 图片

下面是一版可以直接使用的通用提示词。把其中的“本页内容”替换为 `final_ppt_blueprint.md` 中的某一页即可。

```text
请参考我提供的 PPT 页面图片，学习其整体学术汇报风格，但不要机械复制。
你需要生成一张新的单页 PPT 风格图片，用于经管类论文汇报。

你的任务不是简单排字，而是：
1. 先学习参考图的版式语言，包括：
- 顶部导航栏结构
- 校名/校徽区域的摆放方式
- 标题层级与学术感
- 整体对齐、字体气质、颜色风格

2. 在保留上述风格特征的基础上，根据我提供的新内容，自主完成这一页的版式设计。
要求“像同一套 PPT 模板中的新一页”，而不是照搬原图。

3. 这页必须包含以下信息模块：
- 学校标识区
- 顶部导航栏
- 页面主标题
- 正文内容区
- 页底结论区

4. 请你自主决定：
- 表格列宽、字号层级、加粗方式
- 哪些结果需要高亮
- 页面留白与整体平衡
- 标题、表格、说明文字之间的间距
- 是否使用细线、浅色块、虚线框等方式强化重点

5. 风格要求：
- 学术汇报型 PPT 风格
- 正式、简洁、规范、清晰
- 接近高校经管类论文答辩/组会展示页
- 配色以红色、黑色、灰色为主，稳重克制
- 画面干净，不花哨，不要海报感
- 所有文字应规整清晰，像真实 PPT 截图

6. 输出要求：
- 生成一张完整的单页 PPT 图片
- 比例接近 16:9
- 文字可读性强
- 不要额外添加无关图标、装饰插画或复杂背景

本页内容如下：
【在这里粘贴 final_ppt_blueprint.md 中的一页内容】
```

### 生成效果不理想时的追问

如果页面太像海报：

```text
请降低海报感，改成高校经管类论文组会汇报 PPT。减少装饰元素，增强标题、表格和结论区的规整感。
```

如果文字太小或不可读：

```text
请重新生成，优先保证所有文字清晰可读。适当减少文字密度，压缩为真实 PPT 可展示的字号层级。
```

如果模型机械复刻参考图：

```text
请保留参考图的学术汇报风格，但不要复制其具体布局。根据本页内容重新组织模块，使其像同一模板下的新页面。
```

如果表格拥挤：

```text
请重新设计表格区，减少列宽浪费，突出核心系数和显著性，允许使用浅灰底、红色强调和分组线，但保持学术克制。
```

## 关键约束

- 只支持经管类实证论文
- 默认不生成讲稿
- 默认不启用外部文献扩展
- 风格学习只服务于页面组织，不改变目标论文主线
- 表格必须转写或标注失败，不得编造数据
- 最终蓝图必须自包含：表格、公式、模型式和机制框架要直接写入 `【图表/证据设计】`
- 最终蓝图的可见页面模块不得写“来源：第X页/表X/章节X”这类证据锚定句
- 外部文献必须有题名、作者、期刊、年份、链接或 DOI
- 评价部分采用审稿型批判，而不是泛泛写“研究不足”

## 适用与不适用

适用：

- 有数据、变量、模型和回归结果的经管类实证论文
- 需要快速整理成课堂、组会、文献分享或答辩预演材料
- 有参考 PPT，希望沿用已有学术汇报风格

不适用：

- 纯理论论文
- 综述论文
- 案例研究但没有实证模型
- 政策评论或普通研究报告
- 只有描述性统计、没有模型检验的材料

## 推荐实践

- 先让 skill 生成完整蓝图，不要急着逐页做图
- 先检查 `core_tables.md`，确认核心表格是否转写正确
- 再检查 `final_ppt_blueprint.md`，逐页补充或删减内容
- 最后再用网页版 ChatGPT 文生图模型逐页生成 PPT 图片
- 重要汇报前，建议人工检查所有数字、显著性星号、变量含义和模型式
