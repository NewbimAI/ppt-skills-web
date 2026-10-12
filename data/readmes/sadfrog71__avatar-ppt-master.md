#BRANCH:main
# Avatar PPT Master

面向内部同事使用的 PPT 生成 Skill。项目基于 `dashi-ppt` 进行二次开发，重点优化内容规划、页面信息组织、主题选择和水务环境场景的视觉呈现。

项目支持将 Markdown、方案文稿、调研材料和结构化需求转换为可离线打开的 HTML 演示，并可导出 PDF 或可编辑 PPTX。

## 项目定位

- 服务内部汇报、方案提案、项目复盘、培训材料和研究报告。
- 优先保证内容结构完整、结论清晰、页面角色明确，再匹配视觉模板。
- 支持本地素材暂存和离线成品，便于处理企业内部材料。
- 使用前仍需遵循所在组织与所用 AI 模型的数据安全要求。

## 主要优化

- 在生成前创建 `composition-plan.json`，明确每页任务、结论标题、视觉结构和读图结论。
- 页面标题优先表达结论，减少只写章节名或泛化标题的情况。
- 每页只保留一个主要信息角色，避免流程、数据、结论同时堆叠。
- 图表、矩阵、风险和决策页补充 `insight`，让页面能够直接支持汇报表达。
- 新增 `theme13`「水务环境风」，适配水务运营、环境管理、项目提案和数据复盘。
- 支持 HTML 预览、浏览器内编辑、PDF 导出和可编辑 PPTX 导出。

## 安装

### Codex

```bash
git clone https://github.com/sadfrog71/avatar-ppt-master.git
mkdir -p ~/.codex/skills/avatar-ppt-master
cp -R avatar-ppt-master/skills/avatar-ppt-master/. ~/.codex/skills/avatar-ppt-master/
```

### Claude Code

```bash
git clone https://github.com/sadfrog71/avatar-ppt-master.git
mkdir -p ~/.claude/skills/avatar-ppt-master
cp -R avatar-ppt-master/skills/avatar-ppt-master/. ~/.claude/skills/avatar-ppt-master/
```

安装完成后重新打开会话。Skill 名称为 `avatar-ppt-master`。

如果已安装旧版本，先在仓库目录运行 `git pull`，再重复对应的复制命令覆盖原安装目录。

## 使用方式

在 Codex、Claude Code 或兼容 Skill 的 Agent 中说明要使用 `avatar-ppt-master`，并提供以下信息：

- 汇报主题和目标；
- 受众与使用场景；
- 期望页数；
- 需要突出的结论、数据或行动项；
- 指定主题，或允许 Skill 推荐主题；
- 最终需要 HTML、PDF 还是 PPTX。

示例：

```text
使用 avatar-ppt-master，把这份项目方案整理成 10 页内部汇报。
受众是管理层，使用 theme13 水务环境风，重点突出风险、交付路线和决策事项，输出可编辑 PPTX。
```

## 主题说明

项目当前包含 13 套主题：

| 主题 | 名称 | 适用场景 |
|---|---|---|
| `theme01` | 轻拟态风 | 产品介绍、企业汇报、方案说明 |
| `theme02` | 炫光紫绿风 | 科技发布、AI 与创新项目 |
| `theme03` | 深浅代码风 | 技术方案、系统架构、开发者内容 |
| `theme04` | 玻璃糖果风 | 年轻化品牌、消费产品、创意提案 |
| `theme05` | 色谱图表风 | 数据报告、市场分析、KPI 复盘 |
| `theme06` | 深色图谱风 | 战略分析、高密度数据展示 |
| `theme07` | 冷白调研风 | 调研报告、白皮书、政策分析 |
| `theme08` | 黑金实验风 | 高端发布、品牌提案、概念表达 |
| `theme09` | 深蓝杂志风 | 品牌故事、人物访谈、专题内容 |
| `theme10` | 金色指数风 | 金融数据、投资报告、商业指数 |
| `theme11` | 高能增长风 | 增长复盘、商业计划、市场扩张 |
| `theme12` | 声波霓虹风 | 音乐娱乐、潮流活动、年轻化发布 |
| `theme13` | 水务环境风 | 水务运营、环境管理、项目提案、数据复盘 |

### `theme13` 水务环境风

`theme13` 使用青蓝色水务视觉体系，强调清洁、秩序、可信和运营感。当前提供 55 个页面组件，覆盖 5 种企业级封面、目录、章节过渡、指标看板、风险矩阵、路线图、架构图、运营分析、11 个媒体叙事版式和结束页。

内容呈现遵循以下规则：

- 用结论式标题代替泛化章节名；
- 数据页先给关键数字，再给变化原因和读图结论；
- 风险页使用分级语义和处置动作，不只做卡片罗列；
- 路线图按阶段目标、交付物、责任和决策点组织；
- 架构图优先表达层级、数据流和边界关系；
- 图片仅在能提供证据或场景信息时使用。

## 输出格式

- HTML：本地横向翻页演示，可在浏览器中编辑和预览。
- PDF：适合归档、评审和固定版式传阅。
- PPTX：按页面节点重建，文字和主要图形保持可编辑。

## 环境要求

- Node.js 20 或更高版本；
- npm；
- 用于预览和导出的 Chromium、Chrome 或兼容浏览器。

首次运行时，Skill 会在自身 `project/` 目录准备依赖。

## 目录结构

```text
avatar-ppt-master/
├── README.md
├── README.en.md
├── LICENSE
├── .claude-plugin/
└── skills/
    └── avatar-ppt-master/
        ├── SKILL.md
        ├── README.md
        ├── agents/
        ├── assets/
        ├── references/
        ├── scripts/
        └── project/
```

## 内部使用注意事项

- 不在 `goal.json` 中引用远程 URL、临时目录或本机绝对素材路径。
- 内部图片和视频先复制到本次输出目录，再由生成器引用相对路径。
- 分享成品前检查客户名称、人员姓名、系统地址、账号信息、合同数据和未公开经营数据。
- 本项目负责本地生成与导出流程，不代表所接入的 AI 模型自动满足企业数据合规要求。

## 上游来源与许可

本项目基于 [chuspeeism/dashiAI-ppt-skill](https://github.com/chuspeeism/dashiAI-ppt-skill) 二次开发，并保留上游来源说明。项目主体遵循 [AGPL-3.0](LICENSE) 许可。

子包 [`html-deck-to-pptx`](skills/avatar-ppt-master/project/packages/html-deck-to-pptx) 保持其独立 MIT 许可。原始版权和第三方依赖许可仍归各自权利人所有。
