#BRANCH:main
# Consulting Diagnosis PPT Workflow

管理咨询现状诊断阶段的**单域章节标准化产出工作流**。一个业务域跑一次，六阶段闭环，产出结构化分析素材 + PPT 章节大纲。

## 这是什么

咨询项目做现状诊断时，每个业务域（采购、物流、生产……）都要出一份诊断章节。这个工作流把"从原始访谈素材到可交付的 PPT 大纲"的过程标准化为 6 个阶段，每个阶段配齐方法论、模板、自检清单和真实示例。

```
Stage 1 输入梳理 → Stage 2 业务分析 → Stage 3 流程&KPI →
Stage 4 系统分析 → Stage 5 协同问题 → Stage 6 PPT 大纲
```

## 目录结构

```
├── SKILL.md                  # Claude Code skill 定义（触发规则 + 工作流总览）
├── methodology/              # 6 阶段方法论
│   ├── stage-1-input.md
│   ├── stage-2-business.md
│   ├── stage-3-process-kpi.md
│   ├── stage-4-system.md
│   ├── stage-5-collaboration.md
│   └── stage-6-ppt-output.md
├── templates/                # 6 阶段输出模板
│   ├── 01-input-completeness-matrix.md
│   ├── 02-core-issues.md
│   ├── 03-process-kpi.md
│   ├── 04-system-analysis.md
│   ├── 05-collaboration.md
│   └── 06-chapter-outline.md
├── checklists/               # 6 阶段自检清单
│   ├── stage-1.md ~ stage-6.md
└── examples/                 # 真实示例（物流仓储域）
    └── 项目-物流域/
        ├── 01-input-completeness.md
        ├── 02-core-issues.md
        ├── 03-process-kpi.md
        ├── 04-system-analysis.md
        ├── 05-collaboration.md
        └── 06-chapter-outline.md
```

## 每个域跑完后的产出

- **6 份 markdown 分析素材**（每个 Stage 一份）
- **1 份 PPT 章节大纲**（每页含结论 + 证据 + 视觉描述 + 数据来源，直接交给 PPT 制作者）
- **1 份协同议题卡集合**（送跨域汇总）

## 使用方式

### Claude Code 用户

把整个文件夹放到你项目的 `.claude/skills/` 下：

```bash
# 在你的项目根目录
mkdir -p .claude/skills
cd .claude/skills
git clone https://github.com/Carl-Marks/consulting-diagnosis-ppt.git
```

然后在 Claude Code 里直接说"做 XX 域的诊断章节"或 `/consulting-diagnosis-ppt` 即可触发。

### claude.ai 网页版用户

两种用法：

**方式 A：Projects（推荐）**

1. 在 claude.ai 创建一个 Project
2. 把 `SKILL.md` 的内容粘贴到 Project Instructions
3. 把 `methodology/`、`templates/`、`checklists/` 下的文件上传为 Project Knowledge
4. 新对话里说"做 XX 域的诊断章节"即可

**方式 B：对话开头粘贴**

把需要的阶段方法论 + 模板复制到对话开头，让 Claude 按流程走。适合临时用一下。

### 不用 AI 的同事

`methodology/` 里的方法论本身就是完整的工作指引，`templates/` 是标准模板，`examples/` 是填好的示例。当作文档手册用也完全成立。

## 设计原则

- **项目无关**：所有项目特定信息（甲方名称、业务域、访谈数据）通过外部注入，skill 本身不硬编码
- **阶段独立**：可以只跑某一阶段（如"只跑 Stage 5"），不强制走全流程
- **缺数据不阻塞**：标注"待补充"继续往下跑，后续补到数据再回头修正
- **抓大放小**：每阶段都有优先级筛选，不穷举

## 适用场景

- 管理咨询现状诊断阶段的业务域分析
- 数字化蓝图 / IT 规划项目的现状调研
- 任何需要"从访谈素材到结构化诊断报告"的场景
