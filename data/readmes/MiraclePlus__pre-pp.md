#BRANCH:main
# pre-PP — 路演 PPT 迭代助手

Pre Pitch Practice skill for Claude Code: 在正式 Pitch Practice 之前，帮助创始人从零到一制作、审阅、重写和迭代路演 deck。

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/MiraclePlus/pre-pp)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 这是什么

`pre-pp` 是一个 Claude Code Skill，定位是路演材料的“编辑器 + 顾问”。它可以帮助团队：

- 从项目资料或创始人输入生成 5 分钟/2 分钟路演 deck 大纲
- 把 Markdown 分页稿变成可用的演示文稿
- 审阅已有 PDF/PPT/截图，给出逐页修改建议
- 根据 Pitch Practice 反馈重写页面文案、结构和视觉表达
- 输出飞书 Slides、HTML、PDF 或 PPTX

它和正式评估类 skill 的区别：

| Skill | 定位 | 使用时机 |
| --- | --- | --- |
| `pre-pp` | 制作 / 迭代 | 从零做 deck、改进现有 deck、把反馈落成新版 |
| `PP` | 评估 / 诊断 | 正式 Pitch Practice 前后的系统评审 |

推荐流程：`pre-pp` 制作初稿 → `PP` 评估 → `pre-pp` 迭代下一版。

## 核心能力

### 1. 三种工作模式

| 模式 | 触发条件 | 典型输出 |
| --- | --- | --- |
| 制作模式 | “做/写/生成 deck” | 从零生成 deck 结构、逐页文案和视觉方案 |
| 审阅模式 | 提供 PDF/PPT/截图 + “帮我看看/改改/优化” | 逐页问题诊断、重写建议、优先级 |
| 规划模式 | 提供 Markdown 分页稿 | 结构评审、内容补全、生成 deck |

### 2. 多格式输出

| 格式 | 优点 | 适用场景 |
| --- | --- | --- |
| 飞书 Slides | 云端渲染、字体一致、在线协作、一键分享 | 默认推荐 |
| HTML deck | 视觉表现强、预览快、适合快速迭代 | 内部评审、视觉探索 |
| PDF + PPTX | 离线可用、便于提交或打印 | 明确需要本地文件时 |

### 3. 路演内容优化框架

内置规则覆盖：

- 第一页黄金规则：用简单类比让投资人一眼看懂
- 前三页 30 秒记忆测试：产品定位 → 痛点场景 → 核心能力
- 吸睛度检查：每页至少有一个数据、反差、demo、具体场景或反常识洞察
- 虚实结合叙事：前半段讲具体证据，后半段讲团队和愿景
- 6 维诊断：What、Why Now、How、Market、Why Us、Traction

详见：

- [`references/pitch-content-rules.md`](./references/pitch-content-rules.md)
- [`references/pp-diagnostic-handbook.md`](./references/pp-diagnostic-handbook.md)

## 安装

### 方式一：安装到全局 Claude Code skills 目录

```bash
cd ~/.claude/skills
git clone https://github.com/MiraclePlus/pre-pp.git
cd pre-pp
bash setup.sh
bash verify.sh
```

### 方式二：安装到某个项目的 `.claude/skills/`

```bash
cd /path/to/your/project/.claude/skills
git clone https://github.com/MiraclePlus/pre-pp.git
cd pre-pp
bash setup.sh
bash verify.sh
```

## 环境要求

必需：

- Claude Code
- Node.js >= 18
- Python >= 3.9
- npm

可选：

- `lark-cli`：生成飞书 Slides 时需要
- 中文字体：本地 PDF/PPTX 渲染时建议安装
- Chromium / Playwright：HTML 截图或 HTML 转 PPTX 时需要

`setup.sh` 会尝试安装 Python 和 Node 依赖；`verify.sh --fix` 可尝试修复缺失项。

## 使用示例

在 Claude Code 中直接调用：

```text
/pre-PP Meridian 帮我从零做一个5分钟路演deck
```

审阅已有材料：

```text
/pre-PP 慧化科技 帮我看看这个deck哪里需要改 [附件: deck.pdf]
```

基于 Markdown 分页稿生成：

```text
/pre-PP Meridian 基于下面的分页规划帮我做deck：
## Slide 1: 封面 ...
## Slide 2: 痛点 ...
```

指定输出格式：

```text
/pre-PP VoiceCursor --format html 生成HTML预览版
/pre-PP VoiceCursor --format pptx 生成本地PPTX文件
/pre-PP VoiceCursor --format feishu 生成飞书Slides
```

内容专项优化：

```text
/pre-PP VoiceCursor 优化讲稿内容，让它更吸引投资人
/pre-PP Meridian 检查前三页30秒内能不能讲清楚
/pre-PP 深智构DeepGigoAI 把技术页改成投资人能听懂的表达
```

## 项目结构

```text
pre-pp/
├── SKILL.md                         # Claude Code Skill 主定义
├── README.md                        # 使用说明
├── setup.sh                         # 安装依赖
├── verify.sh                        # 环境自检
├── version-check.sh                 # 版本检查
├── log-entry.sh                     # 迭代日志工具
├── requirements.txt                 # Python 依赖
├── ppt-tools/
│   ├── package.json                 # Node 依赖声明
│   ├── package-lock.json
│   ├── generate-deck.js             # PPTX 生成工具
│   ├── layouts.js                   # 页面布局工具
│   └── test-layouts.js
└── references/
    ├── pitch-content-rules.md       # 讲稿内容迭代规则
    ├── pp-diagnostic-handbook.md    # PP 诊断手册
    └── lark-slides/                 # 飞书 Slides XML/API 参考
```

> `node_modules/` 不应提交到仓库。安装后会由 `npm install` 自动生成。

## 技术栈

- PptxGenJS：生成 `.pptx`
- Sharp：图片处理和渐变预渲染
- Playwright：HTML 截图和浏览器渲染
- python-pptx：PPTX 读写解析
- markitdown：PPT/PDF 文本提取
- lark-cli：飞书 Slides 创建和编辑

## 输出位置

默认输出到当前项目下的：

```text
PP评估/decks/
```

常见文件命名：

```text
{项目名}-deck-v{n}.pptx
{项目名}-deck-v{n}.pdf
{项目名}-deck-v{n}.html
pre-pp-log.md
```

## 公开版说明

本仓库包含 skill 逻辑、工具脚本和可公开参考文档。部分内部 Pitch Practice 文档来源在公开版中以摘要/整理稿形式保留，不包含私有飞书文档权限、密钥或内部访问凭证。

## License

MIT © MiraclePlus CC Team
