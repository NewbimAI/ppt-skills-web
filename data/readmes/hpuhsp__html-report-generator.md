#BRANCH:main
# HTML Report Generator

A Claude Code skill that generates professional HTML presentations on any topic using real-time web research. Produces self-contained, source-backed HTML files with selectable visual styles.

## Features

- **Topic-agnostic** — Generate reports on any subject: technology, business, science, culture, etc.
- **Real-time web research** — Multi-source search via WebSearch MCP with automatic content extraction
- **5 visual styles** — Choose from Dark Tech, Minimal Business, Editorial, Terminal, or custom via `frontend-design` skill
- **Source attribution** — Every report cites its web sources and research date

## Installation

```bash
# Clone into your Claude Code skills directory
git clone git@github.com:YOUR_USERNAME/html-report-generator.git ~/.claude/skills/html-report-generator
```

Or copy the directory manually:

```bash
cp -r html-report-generator ~/.claude/skills/
```

Restart Claude Code to auto-discover the skill.

## Usage

Trigger the skill with natural language:

```
生成一个关于气候变化的网页演示报告
做个2026年全球电动车市场报告，正式一点
整理一份WebAssembly技术趋势的HTML报告，酷炫风格
```

### Style Selection

| Style | Best For | Trigger Words |
|-------|----------|---------------|
| `dark-tech` | Tech, AI, data, internet | 默认科技风 |
| `minimal-business` | Business, finance, consulting | "正式" "商务" "给老板看" |
| `editorial` | Culture, education, deep analysis | "杂志" "阅读" "优雅" |
| `terminal` | Security, dev, geek topics | "极客" "终端" "命令行" |
| `custom` | Maximum design quality | "酷炫" "好看" "惊艳" "有设计感" |

## Requirements

- Claude Code with WebSearch MCP server configured
- `frontend-design` skill (optional, for `custom` style)

## File Structure

```
html-report-generator/
├── SKILL.md                              # Skill definition & workflow
├── README.md
├── assets/
│   ├── template-dark-tech.html           # Dark tech CSS reference
│   ├── template-minimal-business.html    # Minimal business CSS reference
│   └── template-terminal.html            # Terminal/retro CSS reference
└── references/
    └── style-guide.md                    # Style decision tree & design specs
```

## Workflow

1. **Topic & Style Selection** — Clarify scope, match or offer visual style
2. **Multi-Source Web Research** — 3+ news searches + 2+ web searches in parallel
3. **Deep Content Extraction** — Fetch 3-5 full articles, extract data points and quotes
4. **Content Synthesis** — Organize into structured outline (stats, timeline, themes, players)
5. **HTML Generation** — Generate self-contained HTML with chosen style template
6. **Summary** — Present section-by-section overview

## License

MIT
