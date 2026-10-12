#BRANCH:main
# html-ppt-academic-skill

> Academic HTML PPT Skill for Claude Code / Codex-style agents. It helps an AI coding agent create thesis defense, proposal defense, midterm review, research group meeting, and academic presentation decks as static HTML/CSS/JS.

`html-ppt-academic-skill` 是一个面向 Agent 的 Skill 工具，用于让 Claude Code、Codex CLI 或其他支持 AgentSkills 的编程代理生成学术场景 HTML 幻灯片。它提供答辩模板、学术主题、页面布局、演讲者备注和键盘导航能力，适合作为 AI Agent 的能力扩展使用。

## 重要定位

这是一个 **Claude / Codex AgentSkill 工具**。

推荐用法是把它安装到支持 Skill 的 Agent 环境中，然后通过自然语言让 Agent 调用本 Skill 生成或修改学术 PPT。手动运行脚本只适合调试模板、预览示例或二次开发。

## 适用场景

- 本科毕业设计答辩
- 硕士论文答辩
- 博士论文答辩
- 开题报告
- 中期答辩
- 预答辩
- 研究生组会
- 学术会议汇报
- 科研项目结题汇报

## 核心能力

| 能力 | 位置 |
| --- | --- |
| AgentSkill 入口 | `SKILL.md` |
| 论文答辩完整模板 | `templates/full-decks/thesis-defense/` |
| 学术主题 | `assets/themes/*.css` |
| 单页学术布局 | `templates/single-page/*.html` |
| 风格配置 | `templates/style-presets/thesis-defense.json` |
| 创建 deck 脚本 | `scripts/new-deck.sh` |
| 参考文档 | `references/*.md` |
| 示例 deck | `examples/thesis-defense-demo/` |

## 安装到 Agent

在支持 AgentSkills 的环境中安装：

```bash
npx skills add https://github.com/w1ndys/html-ppt-academic-skill
```

如果你是本地开发或私有仓库使用，也可以把本仓库放到 Agent 的 skills 目录中，让 Agent 能读取 `SKILL.md`。

安装后，Agent 会在用户提出论文答辩、开题报告、中期答辩、学术汇报等需求时调用本 Skill。

## 推荐使用方法

安装完成后，直接向 Claude Code、Codex CLI 或支持 Skill 的 Agent 描述你要生成的学术 PPT。

示例提示词：

```text
帮我生成一份硕士论文答辩 HTML PPT，主题是“基于深度学习的遥感图像变化检测”，12 页，蓝色学术风，需要包含演讲者备注。
```

```text
做一份开题报告 slides，研究方向是教育大数据，10 页，风格正式克制，包含研究背景、问题定义、研究方法、计划进度和预期成果。
```

```text
把我的论文摘要和实验结果整理成博士预答辩 PPT，要求突出创新点、技术路线和可答辩性，每页保留讲稿提示。
```

```text
基于 examples/thesis-defense-demo 修改一版本科毕业答辩 PPT，把主题切换成红色校徽风，补充 Q&A 备份页。
```

Agent 通常会完成这些动作：

1. 读取 `SKILL.md` 判断适用场景。
2. 根据学段、答辩类型、学科和页数选择模板与主题。
3. 使用 `templates/full-decks/thesis-defense/` 或 `templates/single-page/` 生成页面。
4. 将可见内容写入 slide，将讲稿提示写入 `<aside class="notes">`。
5. 输出生成的 deck 路径、主题、页数和仍需补充的信息。

## Agent 应收集的信息

为了生成质量稳定的答辩 PPT，建议在提示词中提供：

- 学段：本科、硕士、博士、课程项目、组会汇报
- 类型：开题、中期、预答辩、最终答辩、学术汇报
- 学科：计算机、工科、医学、经管、教育、人文社科、艺术设计
- 标题：论文或汇报题目
- 时长和页数：例如 8 分钟 10 页、15 分钟 12 页、30 分钟 20 页
- 身份信息：学校、学院、专业、学生、导师、日期、logo
- 视觉偏好：蓝色学术、红色校徽、极简白底、衬线论文风
- 原始内容：摘要、目录、研究方法、实验结果、创新点、结论

信息缺失时，Agent 会按 `SKILL.md` 中的默认规则选择合理配置。

## 默认页面结构

最终论文答辩默认使用 12 页结构：

1. 封面
2. 目录
3. 研究背景与意义
4. 国内外研究现状与问题
5. 研究目标与研究问题
6. 技术路线或研究框架
7. 方法、模型或系统设计
8. 实验设计或案例设置
9. 结果分析
10. 创新点与贡献
11. 总结与展望
12. 致谢与 Q&A

开题报告会强化研究计划、可行性分析、进度安排和预期成果。中期答辩会强化已完成工作、当前进度、问题风险和下一阶段计划。

## 手动调试

手动命令用于模板开发、示例预览和本地调试。

```bash
# 生成一个新的论文答辩 deck
./scripts/new-deck.sh my-defense thesis-defense

# 打开生成结果
open examples/my-defense/index.html

# 打开内置示例
open examples/thesis-defense-demo/index.html
```

## 键盘快捷键

```text
← → Space PgUp PgDn    翻页
F                      全屏
S                      打开演讲者备注窗口
O                      打开缩略总览
T                      切换已配置主题
```

## 示例图片

答辩封面页示例：

![论文答辩封面页示例](assets/example-thesis-cover.svg)

技术路线页示例：

![技术路线页示例](assets/example-method-roadmap.svg)

## 仓库结构

```text
html-ppt-academic-skill/
├── SKILL.md
├── README.md
├── assets/
│   ├── base.css
│   ├── runtime.js
│   └── themes/
│       ├── thesis-defense-blue.css
│       ├── thesis-defense-red.css
│       ├── thesis-defense-minimal.css
│       └── thesis-defense-serif.css
├── templates/
│   ├── full-decks/thesis-defense/
│   ├── single-page/
│   └── style-presets/
├── references/
│   ├── thesis-defense.md
│   ├── themes.md
│   ├── layouts.md
│   └── customization.md
├── scripts/
│   └── new-deck.sh
└── examples/
    └── thesis-defense-demo/
```

## 设计原则

- 学术答辩重在逻辑链条和证据表达。
- 每页只承载一个核心观点。
- 图表、流程图和表格优先于长段文字。
- 可见页面保持正式、清晰、克制。
- 演讲者备注用于提示表达逻辑、过渡句和答辩提醒。
- 动画只用于辅助转场和重点强调。

## License

MIT
