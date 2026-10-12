#BRANCH:main
<p align="center">
  <img src="https://img.shields.io/badge/Skills-20-brightgreen" alt="20 Skills">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License">
  <img src="https://img.shields.io/badge/PRs-Welcome-orange" alt="PRs Welcome">
  <img src="https://img.shields.io/github/stars/yoanbernabeu/slidev-skills?style=social" alt="GitHub Stars">
</p>

<h1 align="center">Slidev Skills</h1>

<p align="center">
  <strong>20 AI Agent Skills to create stunning presentations with Slidev.</strong><br>
  Syntax, layouts, animations, code highlighting, diagrams — everything you need.
</p>

<p align="center">
  <a href="#quick-install">Install</a> •
  <a href="#all-20-skills">Skills</a> •
  <a href="#example-usage">Usage</a> •
  <a href="#contributing">Contribute</a>
</p>

---

## Quick Install

```bash
npx skills add yoanbernabeu/slidev-skills
```

**That's it.** Works with Claude Code, Cursor, Codex, OpenCode, Windsurf, and 30+ AI agents.

### One-Liners

```bash
# Install everything (20 skills)
npx skills add yoanbernabeu/slidev-skills

# Install only code-related skills
npx skills add yoanbernabeu/slidev-skills --skill slidev-code-blocks

# Install globally (available in all projects)
npx skills add yoanbernabeu/slidev-skills -g

# List all available skills
npx skills add yoanbernabeu/slidev-skills --list

# Install to specific agents
npx skills add yoanbernabeu/slidev-skills -a claude-code -a cursor

# Non-interactive (CI/CD friendly)
npx skills add yoanbernabeu/slidev-skills --all -y
```

### Other Installation Methods

<details>
<summary><strong>Claude Code Plugin</strong></summary>

```bash
/install-skill yoanbernabeu/slidev-skills
```
</details>

<details>
<summary><strong>Manual Installation</strong></summary>

Copy the `skills/` directory to:
- **Global**: `~/.claude/skills/` (or `~/.cursor/skills/`, etc.)
- **Project**: `.claude/skills/` (or `.cursor/skills/`, etc.)
</details>

---

## Why These Skills?

Creating presentations as a developer can be **tedious**. PowerPoint feels dated, Google Slides lacks code support, and starting from scratch takes forever. [Slidev](https://sli.dev) is the answer — but it has a learning curve. These skills give your AI agent **expert-level knowledge** of Slidev so you can focus on your content.

| Challenge | Skill That Helps |
|-----------|------------------|
| "How do I start a presentation?" | `slidev-quick-start` |
| "My code looks ugly" | `slidev-code-blocks` |
| "I want animated code transitions" | `slidev-magic-move` |
| "How do I add diagrams?" | `slidev-mermaid` |
| "I need click animations" | `slidev-click-animations` |
| "How do I export to PDF?" | `slidev-export` |

---

## All 20 Skills

### Getting Started
| Skill | What It Does |
|-------|--------------|
| `slidev-quick-start` | Create your first presentation in minutes |
| `slidev-project-structure` | Understand configuration and file organization |

### Content Creation
| Skill | What It Does |
|-------|--------------|
| `slidev-syntax-guide` | Master Slidev's extended Markdown syntax |
| `slidev-layouts` | Use cover, two-cols, image layouts and more |
| `slidev-components` | Add Vue components for interactivity |

### Code Presentation
| Skill | What It Does |
|-------|--------------|
| `slidev-code-blocks` | Beautiful syntax highlighting with Shiki |
| `slidev-magic-move` | Animate code transformations smoothly |
| `slidev-monaco-editor` | Live coding with Monaco Editor |

### Visual Content
| Skill | What It Does |
|-------|--------------|
| `slidev-mermaid` | Create flowcharts, sequence diagrams, etc. |
| `slidev-plantuml` | Professional UML and C4 diagrams |
| `slidev-latex` | Mathematical formulas with KaTeX |

### Animations
| Skill | What It Does |
|-------|--------------|
| `slidev-click-animations` | v-click, v-after, and motion directives |
| `slidev-transitions` | Smooth slide transitions |

### Presentation
| Skill | What It Does |
|-------|--------------|
| `slidev-presenter-mode` | Speaker notes, timer, remote control |
| `slidev-drawings` | Draw and annotate during presentations |
| `slidev-navigation` | Keyboard shortcuts and navigation |

### Customization
| Skill | What It Does |
|-------|--------------|
| `slidev-themes` | Use and customize themes |
| `slidev-styling` | Style with UnoCSS and custom CSS |

### Export & Deploy
| Skill | What It Does |
|-------|--------------|
| `slidev-export` | Export to PDF, PPTX, PNG |
| `slidev-deployment` | Deploy to GitHub Pages, Netlify, Vercel |

---

## Example Usage

### Create a Technical Presentation

```
You: Create a presentation about React hooks using Slidev

AI: [Uses slidev-quick-start to scaffold project]
    [Uses slidev-layouts for proper structure]
    [Uses slidev-code-blocks for syntax highlighting]
    [Uses slidev-magic-move for code evolution]
    [Uses slidev-click-animations for progressive reveals]
```

### Add a System Architecture Diagram

```
You: Add a diagram showing our microservices architecture

AI: [Uses slidev-mermaid to create flowchart]
    [Uses slidev-layouts for proper positioning]
```

### Export for Conference

```
You: Export this presentation as PDF for the conference

AI: [Uses slidev-export with proper options]
    [Suggests --with-clicks for handout version]
```

---

## Skill Packs

Install skills by category:

| Pack | Skills | Description |
|------|--------|-------------|
| `slidev-getting-started` | 2 | Quick start, project structure |
| `slidev-content` | 3 | Syntax guide, layouts, components |
| `slidev-code` | 3 | Code blocks, magic move, Monaco |
| `slidev-visuals` | 3 | Mermaid, PlantUML, LaTeX |
| `slidev-animations` | 2 | Click animations, transitions |
| `slidev-presentation` | 3 | Presenter mode, drawings, navigation |
| `slidev-customization` | 2 | Themes, styling |
| `slidev-export` | 2 | Export, deployment |
| **`slidev-complete`** | **20** | **All skills — complete toolkit** |

---

## Supported AI Agents

| Agent | Project Path | Global Path |
|-------|--------------|-------------|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| Codex | `.codex/skills/` | `~/.codex/skills/` |
| OpenCode | `.opencode/skill/` | `~/.config/opencode/skill/` |
| Windsurf | `.windsurf/skills/` | `~/.windsurf/skills/` |

---

## Quick Reference

### Essential Commands

```bash
# Create new presentation
npm init slidev@latest

# Start dev server
npm run dev

# Build for production
npm run build

# Export to PDF
npm run export
```

### Basic Slide Syntax

```markdown
---
theme: seriph
title: My Presentation
---

# Slide 1

Welcome to my presentation!

---

# Slide 2

- Point 1
- Point 2
- Point 3

---
layout: center
---

# Centered Content
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` / `→` | Next |
| `←` | Previous |
| `o` | Overview |
| `d` | Dark mode |
| `f` | Fullscreen |

---

## What is Slidev?

[Slidev](https://sli.dev) (slide + dev) is a presentation framework for developers:

- **Markdown-based** — Write slides in familiar Markdown
- **Vue 3 Powered** — Use Vue components for interactivity
- **Developer Friendly** — First-class code support with Shiki
- **Live Coding** — Built-in Monaco Editor
- **Diagrams** — Mermaid and PlantUML support
- **Math** — LaTeX/KaTeX for formulas
- **Animations** — Click animations and transitions
- **Export** — PDF, PPTX, PNG, or host as SPA

---

## Resources

- [Slidev Documentation](https://sli.dev/)
- [GitHub Repository](https://github.com/slidevjs/slidev)
- [Theme Gallery](https://sli.dev/resources/theme-gallery)
- [Addon Gallery](https://sli.dev/resources/addon-gallery)
- [Discord Community](https://chat.sli.dev/)
- [Skills CLI](https://github.com/vercel-labs/skills) - The open agent skills tool
- [Skills Directory](https://skills.sh) - Browse available skills

---

## Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) before submitting a pull request.

### How to Add a Skill

1. Fork the repository
2. Create `skills/[category]/[skill-id]/SKILL.md`
3. Follow the format in existing skills
4. Update `marketplace.json`
5. Submit a PR

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

<p align="center">
  <sub>Made with ❤️ for developers who present</sub>
</p>
