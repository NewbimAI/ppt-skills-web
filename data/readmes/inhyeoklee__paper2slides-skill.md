#BRANCH:main
<div align="center">

# paper2slides

**Turn a scientific paper PDF into a presentation slide deck.**

An [Antigravity](https://github.com/google-deepmind/antigravity) / [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) skill.

[![Antigravity Skill](https://img.shields.io/badge/Antigravity-Skill-blueviolet?style=flat-square)](https://github.com/topics/antigravity-skill)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Compatible-orange?style=flat-square)](https://github.com/topics/claude-code-skill)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Overview

`paper2slides` is an agent skill that reads a scientific paper, extracts its figures, and produces a ready-to-present [Reveal.js](https://revealjs.com/) slide deck with speaker notes.

It works in two layers:

| Layer | Role | Implementation |
|-------|------|----------------|
| **Extraction** | Pull figures from the PDF, segment into panels | Python library (`paper2slides`) |
| **Curation** | Read the paper, select key figures, write slide content and speaker notes | The agent |

The extraction step is mechanical — it gives you all the raw material. The agent then does what a human presenter would: reads the paper, decides what matters, and builds a coherent narrative.

## Installation

### 1. Add the skill to your workspace

```bash
git clone https://github.com/inhyeoklee/paper2slides-skill.git

# Copy into your workspace
cp -r paper2slides-skill/skill/ YOUR_WORKSPACE/.agent/skills/paper2slides/
cp paper2slides-skill/workflow/paper2slides.md YOUR_WORKSPACE/.agent/workflows/
```

### 2. Install the Python library

```bash
cd paper2slides-skill/library
pip install -e .
```

Requires Python 3.9+ and installs PyMuPDF, Pillow, NumPy, Jinja2, and Click.

## How It Works

```mermaid
graph LR
    A[Paper PDF] --> B[paper2slides CLI]
    B --> C[Panel Images]
    A --> D[Agent reads text]
    C --> E[Agent curates slides]
    D --> E
    E --> F[Slide Deck + Speaker Notes]
```

### Workflow

1. **Extract** — `paper2slides paper.pdf -o output/` pulls figures at 4× DPI and segments them into individual panels
2. **Read** — The agent extracts and reads the paper text to understand the structure, results, and narrative
3. **Curate** — The agent selects the most important panels, writes slide titles and captions, and composes speaker notes
4. **Verify** — The agent opens the deck in a browser to check rendering

## Usage

Tell the agent:

```
/paper2slides

Create a presentation from: path/to/paper.pdf
```

Or use the CLI directly for just the extraction step:

```bash
paper2slides paper.pdf -o ./output --serve
```

## What You Get

- **16:9 Reveal.js deck** with light/dark themes
- **Speaker notes** embedded in each slide (press `S` to view)
- **Interactive figures** — toolbar zoom/pan/reset plus single-click centered lightbox; click outside the enlarged figure or press `Escape` to return to the slide
- **Standalone speaker notes** as a separate HTML page with top nav, sidebar, talk script, slide cards, backup notes, quick reference, and Q&A
- **Presenter view** with current notes plus next-click/next-slide preview
- **Overview mode** with main slides and hidden backup slides separated
- **Editable deck and notes** with browser autosave, reset, and downloadable edited HTML
- **MathJax support** for display and inline equations in deck, notes, and presenter view
- **Settings panel** for theme, font, font scale, figure scale, transitions, progress, and controls
- **Presentation font options** — Montserrat, Source Sans 3, Inter, Fira Sans, Lato, Open Sans, Roboto, Nunito Sans, Work Sans, IBM Plex Sans, Noto Sans, Crimson Pro, and system UI fonts
- **Reusable color components** — per-aim accents, wrapped pipeline badges, feature-family colors, colored expected-outcomes rows, and aim-section gradient treatments

## Deck Template Features

The shared `template_shell.html` and `slides.css` resources include:

- A richer but still academic color system: blue/fuchsia/emerald aim accents, feature-family badges, gradient aim breaks, and colored outcome-summary rows via `expected-outcomes-table`.
- Pipeline badge wrapping for long labels such as `Intentional measurements/interventions`; use `.feature-family-step` on the pipeline step that contains feature-family badges.
- Figure lightbox behavior in both shells: single-click any figure to open a centered enlarged view; click the backdrop, close button, or press `Escape` to close it.
- Font switching from the settings panel across the full supported font set listed above.

## Project Structure

```
paper2slides-skill/
├── skill/                       # → .agent/skills/paper2slides/
│   ├── SKILL.md                 #   Agent instructions
│   └── resources/
│       ├── template_shell.html  #   Reveal.js template
│       ├── slides.css           #   Presentation styles
│       ├── speaker_notes_template.html
│       └── speaker_notes_template.md  # legacy markdown reference
├── workflow/                    # → .agent/workflows/
│   └── paper2slides.md         #   /paper2slides command
├── library/                     # → pip install -e .
│   ├── pyproject.toml
│   └── src/paper2slides/
│       ├── cli.py               #   CLI entry point
│       ├── extractor.py         #   PDF figure extraction
│       ├── segmenter.py         #   Panel segmentation
│       ├── generator.py         #   HTML generation
│       └── templates/
├── LICENSE
└── README.md
```

## Contributing

PRs welcome. Some directions:

- PPTX / Google Slides export
- OCR-based panel label detection
- Multi-paper decks

## License

MIT
