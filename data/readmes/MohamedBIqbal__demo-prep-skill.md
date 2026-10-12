#BRANCH:main
# Demo Prep Skill

A Claude Code skill for preparing product demos — from technical walkthroughs to C-suite presentations.

## What's New in v2

- **Proper SKILL.md format** — YAML frontmatter following Anthropic's skill conventions, in `demo-prep/SKILL.md`
- **Progressive disclosure** — Condensed SKILL.md (119 lines) with 3 reference files for deep dives
- **Reference files**: Apple-style UI design, glassmorphism slides, PowerPoint generation guide
- **Condensed frameworks** — Same content, fewer tokens, better for Claude's context window

## Features

- **Interactive HTML Presentation** — McKinsey-style slides with architecture pipelines, iceberg visualizations, and score factor panels
- **Terminal Demo Script** — Modular bash script for terminal-based demos with live API calls
- **PowerPoint Generator** — 10-slide presentations with story-based color palettes and screenshot integration
- **Dual Script Templates** — Technical and C-Suite focused presenter scripts
- **Timer Presets** — 3, 5, 7 minute presets + custom duration with visual alerts
- **Live API Support** — Execute real-time API calls during demos

---

## Quick Start

### 1. Interactive HTML Presentation

```bash
# Open in browser
open templates/interactive.html
```

**Keyboard Controls:**

| Key | Action |
|-----|--------|
| `→` or `Space` | Next slide |
| `←` | Previous slide |
| `T` | Open timer configuration |
| `S` / `P` | Pause/resume timer |
| `N` | Toggle speaker notes |
| `Escape` | Close modals |

**Timer Features:**
- Presets: 3, 5, 7 minutes (click to select)
- Custom: Enter any duration 1-30 minutes
- Pause/resume: Press `S` or `P` to toggle (pulsing indicator when paused)
- Visual alerts: Amber at 2 min remaining, Red at 1 min
- Auto-start: Timer begins when you leave slide 1

**8 Slides Included:**
1. Title — Product name, value prop, feature cards
2. Problem — Iceberg visualization (visible vs hidden costs)
3. Scale — Big numbers, metric cards
4. Solution — Architecture pipeline with hover tooltips
5. Live Demo — API integration placeholder
6. Proof — Metrics with score factors panel
7. Roadmap — Completed items vs honest gaps
8. Ask — Specific requests + thank you

### 2. Generate PowerPoint

```bash
# Install dependencies
pip install python-pptx Pillow

# Basic generation (10 slides)
python scripts/generate_pptx.py --output demo.pptx

# With screenshots (preserves aspect ratio, auto-centered)
python scripts/generate_pptx.py --output demo.pptx --screenshots ./screenshots

# With iceberg storytelling theme
python scripts/generate_pptx.py --output demo.pptx --palette iceberg

# All options
python scripts/generate_pptx.py --output demo.pptx --screenshots ./screenshots --palette iceberg
```

**Screenshot Naming:**
Place images in `screenshots/` folder with slide numbers:
- `4.png`, `5.png`, `6.png`, `7.png`, `8.png`
- Or: `Slide_04.jpg`, `slide_05.png`, etc.
- Flexible matching: `*04*`, `*4*` patterns work

**Color Palettes:**

| Palette | Use Case |
|---------|----------|
| `default` | Corporate professional (blue/gray) |
| `iceberg` | Hidden costs storytelling (sky/ocean) |

### 3. Terminal Demo

```bash
# Make executable (first time)
chmod +x templates/demo.sh

# Run full demo
./templates/demo.sh

# Run specific sections
./templates/demo.sh 3          # Just live demo
./templates/demo.sh 1 2 3      # Hook, solution, demo
./templates/demo.sh 0 6        # Title and ask only
```

**Sections:**

| # | Name | Content |
|---|------|---------|
| 0 | Title | ASCII art logo |
| 1 | Hook | Problem statement, pain points |
| 2 | Solution | Architecture, components |
| 3 | Demo | Live API calls, output |
| 4 | Results | Metrics, validation |
| 5 | Next | Challenges, roadmap |
| 6 | Ask | Specific requests, closing |

**Features:**
- Color-coded output (green, blue, yellow, red, cyan)
- Pause between sections (press Enter to continue)
- Optional server health checks
- Live API integration points

### 4. Presenter Scripts

**Technical Demo** (`templates/script.md`):
- 5-minute structure with timing markers
- Pre-demo checklist
- What to say at each transition
- Backup plan for failures

**C-Suite Demo** (`templates/script-csuite.md`):
- Ask-first opening (Pyramid Principle)
- Executive attention patterns
- P.R.E.P. framework for Q&A
- Objection handling templates

---

## Customization Guide

### HTML Template

Edit `templates/interactive.html`:

1. **Slide Content** — Update text in each `<div class="slide">` section
2. **Speaker Notes** — Modify the `speakerNotes` object in JavaScript
3. **API Integration** — Update `API_BASE` and `runDemo()` function
4. **Colors** — Change CSS variables in `:root` section

### PowerPoint Generator

Edit `scripts/generate_pptx.py`:

1. **Content** — Modify the `config` dictionary in `main()`
2. **Colors** — Add palettes to `PALETTES` dictionary
3. **Layout** — Adjust `Inches()` values in slide functions

### Terminal Demo

Edit `templates/demo.sh`:

1. **Content** — Update text in each `section_*` function
2. **API Calls** — Uncomment and modify `curl` commands
3. **Server Check** — Uncomment `check_server()` function

---

## Demo Frameworks

### Technical Demo (5 min)

| Segment | Duration | Content |
|---------|----------|---------|
| Hook + Problem | 1 min | Why this matters |
| Solution | 30 sec | Architecture overview |
| Live Demo | 2 min | Show it working |
| Results | 30 sec | Metrics, proof |
| The Ask | 30 sec | What you need |

### C-Suite Format

- **Lead with the answer** — State your ask in the first 30 seconds
- **30/70 Rule** — 30% talking, 40% showing, 30% discussion
- **Iceberg storytelling** — Visible problem → hidden damage
- **End with clear ask** — Specific, actionable request

---

## Project Structure

```
demo-prep-skill/
├── README.md                  # This file
├── SKILL.md                   # Standalone skill (detailed, all-in-one)
├── demo-prep/                 # Proper skill directory (for .claude/skills/)
│   ├── SKILL.md               # Condensed skill with YAML frontmatter
│   └── references/
│       ├── apple-style-ui.md  # Apple design tokens, typography, layout
│       ├── glassmorphism.md   # Glass effects, animated backgrounds, CSS
│       └── powerpoint-generation.md  # PPTX structure, python-pptx API
├── LICENSE                    # MIT License
├── requirements.txt           # Python dependencies
├── templates/
│   ├── interactive.html       # 8-slide HTML presentation
│   ├── script.md              # Technical presenter script
│   ├── script-csuite.md       # Executive presenter script
│   └── demo.sh                # Terminal demo (bash)
├── scripts/
│   └── generate_pptx.py       # PowerPoint generator
├── screenshots/               # Add your screenshots here
│   └── .gitkeep
└── examples/
    └── .gitkeep
```

---

## Requirements

- **Python 3.8+** (for PPTX generation)
- **python-pptx** and **Pillow** (`pip install python-pptx Pillow`)
- **Modern browser** (Chrome, Firefox, Safari for HTML presentation)
- **Bash** (for terminal demo)

---

## Installation

### Option 1: Install as Claude Code skill (recommended)
```bash
# Copy the skill directory into your project
cp -r demo-prep-skill/demo-prep/ /your-project/.claude/skills/demo-prep/

# Copy templates and scripts
cp -r demo-prep-skill/templates /your-project/demo/
cp -r demo-prep-skill/scripts /your-project/demo/

pip install -r demo-prep-skill/requirements.txt
```

### Option 2: Clone directly
```bash
git clone https://github.com/MohamedBIqbal/demo-prep-skill.git
cd demo-prep-skill
pip install -r requirements.txt
```

### Option 3: Copy standalone skill only
```bash
cp demo-prep-skill/SKILL.md /your-project/
```

---

## License

MIT License - see [LICENSE](LICENSE)

## Credits

Built with Claude Code. Inspired by McKinsey presentation methodology.
