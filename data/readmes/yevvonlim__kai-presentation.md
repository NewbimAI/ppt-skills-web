#BRANCH:main
# kai-presentation

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that generates polished single-file HTML presentations with a warm earth-tone design system.

Tell Claude to "create a presentation" and it will ask for your content, propose a slide layout, then generate a complete `.html` file you can open in any browser.

## What you get

- **1920x1080 canvas** that scales to any screen
- **5 slide variants** — title, content, dark, accent, image
- **Section nav** at the top with click-to-jump
- **Keyboard/touch/click** navigation (arrows, space, swipe)
- **Staggered animations** on every slide entrance
- **Editable diagrams** — press `e` to drag/resize elements, `d` to copy CSS positions
- **Multi-step reveals** for progressive content disclosure
- **Zero dependencies** — vanilla HTML/CSS/JS, single file output

## Design system

| | |
|---|---|
| **Palette** | Cream, ink, terracotta, sage, blush, lavender, gold |
| **Fonts** | Cormorant Garamond (headings), DM Sans (body), JetBrains Mono (code/labels) |
| **Components** | Cards, pills, tables, code blocks, terminals, flow diagrams, feature lists |

## Install

### macOS / Linux / Git Bash

```bash
git clone https://github.com/yevvonlim/kai-presentation.git
cd kai-presentation
bash install.sh
```

### Windows (PowerShell)

```powershell
git clone https://github.com/yevvonlim/kai-presentation.git
cd kai-presentation
.\install.ps1
```

### Manual

Copy the `kai-presentation/` folder to `~/.claude/skills/`:

```bash
# macOS / Linux
cp -r kai-presentation ~/.claude/skills/

# Windows (PowerShell)
Copy-Item -Recurse kai-presentation $env:USERPROFILE\.claude\skills\
```

Then restart Claude Code.

## Usage

In Claude Code, just say:

> "Create a presentation about microservice architecture"

Claude will:
1. Ask for your content and talking points
2. Propose a slide-by-slide layout for your approval
3. Generate a single `.html` file

Open the file in any browser. Navigate with arrow keys, space, or click/tap.

## Skill structure

```
kai-presentation/
  SKILL.md                        Main skill definition + workflow
  references/
    design-system.md              Color tokens, typography, spacing
    css-template.md               Complete base CSS (~350 lines)
    js-template.md                Navigation engine + viewport scaling
    slide-variants.md             HTML templates for all slide types
    component-library.md          Cards, pills, tables, terminals, etc.
    diagram-editor.md             Drag/resize editor (e/d keys)
    animation-patterns.md         Rail draw, runner dots, swimlanes
```

## License

MIT
