#BRANCH:main
# ppt-agent

> 一个 Claude Code 技能:把“人类顶级 PPT 团队”的工作流固化成流水线——需求调研 → 大纲 → 资料检索 → 策划稿 → 整页 SVG 设计 → 出片,自动产出**可逐元素编辑**的 `.pptx` + 网页预览。

**核心信条:PPT 的灵魂是内容,不是皮囊。** 先想清楚为谁做、做什么,再谈设计。

## 特性

- **六阶段流水线**:需求调研 → 大纲 → 资料检索 → 策划稿 → 逐页 SVG 设计 → 预览 + 出片。
- **两道人审关口**:只在「需求」「大纲」两处停下等你确认,其余自动跑完。
- **原生可改的 .pptx**:每页 SVG 逐元素翻译成真正的 PowerPoint 形状 / 文本框（矩形、圆、连接线、文本框、渐变），**打开即可改字、改色、挪位置**,无需“转换为形状”;只有复杂图标 / 装饰路径合成一张透明 PNG 叠在最上层。
- **1280×720 整页 SVG**:矢量、可无限放大、可拖进 PowerPoint,也可直接看网页预览。

## 安装

### 方式一:通过 Claude Code 插件市场（推荐）

在 Claude Code 里依次运行:

```
/plugin marketplace add joker-sxj/ppt-agent
/plugin install ppt-agent@joker-sxj
```

装好后直接对话触发即可（见下方「用法」)。之后如需更新,在 `/plugin` 菜单里管理已添加的市场。

### 方式二:手动作为个人技能安装

技能本体在仓库的 `skills/ppt-agent/` 子目录(仓库根是插件市场清单),把它放到 Claude Code 的技能目录下(用户级 `~/.claude/skills/`,或项目级 `.claude/skills/`):

```bash
git clone https://github.com/joker-sxj/ppt-agent.git /tmp/ppt-agent
cp -r /tmp/ppt-agent/skills/ppt-agent ~/.claude/skills/ppt-agent
```

> 注意:别直接把整个仓库 clone 成 `~/.claude/skills/ppt-agent`——那样 `SKILL.md` 会多一层目录,Claude Code 识别不到。

### 出片依赖

出片阶段需要 Python 依赖与任一 SVG 渲染器:

```bash
pip install python-pptx lxml
```

渲染器(图标叠层用,脚本自动探测,装了任一即可):Chrome / Edge(多数机器已有)、rsvg-convert、Inkscape、CairoSVG、LibreOffice。

## 用法

在 Claude Code 里直接说,例如:

- 「帮我做一套关于 XX 的 PPT」
- 「用 ppt-agent 把这个主题做成幻灯片」

技能会先联网调研主题、向你提几个关键问题(关口 1),再给出可增删调序的大纲(关口 2);确认后自动完成检索、策划、逐页设计,最终在 `ppt-decks/<日期>-<主题>/` 下产出 `.pptx`、`preview.html` 与各阶段过程稿。

> Windows 跑脚本请加 `PYTHONUTF8=1`(默认 GBK 控制台遇中文 / emoji 会报错)。

## 目录结构

```
ppt-agent/                          # 仓库根 = 插件市场 + 插件
├── .claude-plugin/
│   ├── marketplace.json            # 插件市场清单(可被 /plugin marketplace add)
│   └── plugin.json                 # 插件元数据
├── skills/
│   └── ppt-agent/                  # 技能本体
│       ├── SKILL.md                # 技能入口(瘦路由:流程总览 + 各阶段指引)
│       ├── prompts/                # 各阶段提示词
│       │   ├── 01-requirement-interview.md
│       │   ├── 02-outline-architect.md
│       │   ├── 03-planning.md
│       │   └── 04-design-svg.md
│       ├── references/             # 设计参考
│       │   ├── bento-grid.md       # Bento Grid 版面规范
│       │   └── svg-to-powerpoint.md# SVG → PowerPoint 落地说明
│       └── scripts/
│           ├── build_preview.py    # 生成网页预览
│           └── build_pptx.py       # SVG → 原生可编辑 .pptx
├── README.md
└── LICENSE
```

## 致谢与来源

本技能的「大纲架构师 / Bento Grid 版面 / SVG 生成」三段提示词改编自 linux.do 社区的一篇文章(<https://linux.do/t/topic/1782304>)的思路。其余提示词、脚本与整条流水线为作者原创。

## License

[MIT](LICENSE)
