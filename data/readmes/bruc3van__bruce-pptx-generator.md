#BRANCH:main
# Bruce's PPTX Generator

一个专为 AI 编程 Agent 设计的 PPT 生成 Skill，让 Claude Code 能够根据你的需求，从零开始用代码生成专业级 PowerPoint 演示文稿，或对现有 PPTX 文件进行编辑。

## 能做什么

**从零生成完整 PPT**，包含封面、目录、章节分隔页、内容页、总结页，一次性输出可直接使用的 `.pptx` 文件。

**编辑现有 PPTX 文件**，通过 XML 操作替换内容、调整结构，保留原始模板风格。

**内置 6 种专业风格预设**，开箱即用：

| 风格 | 适合场景 |
| ---- | -------- |
| 华为方案（默认） | 产品介绍、公司介绍、解决方案、政企客户提案 |
| 麦肯锡蓝 | 战略汇报、咨询报告、管理层提案 |
| 苹果极简 | 产品发布、Demo、Vision 演讲、对外路演 |
| Pitch Deck | 融资路演、Roadmap 提案、Business Case |
| 数据分析 | 用研汇报、A/B 结果、OKR Review、指标会议 |
| 暗黑科技 | 产品发布、技术演讲、AI 能力展示 |

**内容页支持多种图形布局**，根据内容逻辑自动选择：并列卡片、总分布局、流程图、KPI 数字卡、表格对比等。

**生成路径支持更高阶的 deck 骨架能力**：

- Slide Master + Placeholder：把固定 chrome 和稳定内容槽位从逐页手绘升级为母版驱动
- PPT Section：目录、章节分隔页和 PowerPoint 内部章节结构保持一致
- Appendix Table Auto-Paging：长表格自动分页并重复表头，不再强塞内容页

## 输出特点

- 所有图形、色块、形状均由代码精确绘制，无需手动调整
- 每页有独特布局，避免重复，保持视觉节奏
- 页码徽章、标题强调线等细节自动生成
- 每个风格有完整的色板、字体规范和组件函数

## 安装

向你的 AI 编程 Agent 发送以下提示词：

```
帮我安装这个skill：https://github.com/brucevanfdm/bruce-pptx-generator
```

安装完成后，只需告诉 Agent 你要做什么 PPT，它会自动接管。

## 使用

直接描述你的需求即可，例如：

- "帮我做一个介绍公司 AI 安全产品的 PPT，面向金融客户，10 页左右"
- "做一个项目汇报 PPT，包含背景、进展、风险、下一步计划，用数据分析风格"
- "用苹果极简风格，做一个新产品发布演示文稿"
- "帮我编辑这个 PPTX，把内容替换成新版本"

## 依赖

```shell
npm install -g pptxgenjs
```

基于 [MiniMax-AI/skills/pptx-generator](https://github.com/MiniMax-AI/skills/tree/main/skills/pptx-generator) 调整。
