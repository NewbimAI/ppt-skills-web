#BRANCH:main
# Excalidraw Slides

AI-powered hand-drawn presentation generator. Turns text outlines into visually rich, sketch-style PPTX files with editable text.

## How It Works

```
Text / Outline / PDF
  → Phase 1: Content structuring (1 slide = 1 message)
  → Phase 2: Style preset selection (6 themes)
  → Phase 3: Visual-first layout planning (15+ layout types)
  → Phase 4: HTML/CSS + rough.js generation per slide
  → Phase 5: Playwright → PNG rendering + visual review
  → Phase 6: Dual-layer PPTX assembly
```

### Dual-Layer Architecture

Each slide has two layers:
- **Layer 1 (background)**: Hand-drawn decorations rendered as PNG via [rough.js](https://roughjs.com/) + [rough-notation](https://roughnotation.com/)
- **Layer 2 (foreground)**: Native python-pptx TextBox / Image elements — **fully editable in PowerPoint**

## Features

- **Visual-first design** — 60/40 visual-to-text ratio, max 8-word headlines, tinted image placeholders
- **15+ layout types** — split-visual, visual-hero, comparison, big-number, process-flow, icon-grid, timeline, and more
- **6 style presets** — Clean Sketch, Bold Marker, Notebook, Blackboard, Blueprint, Watercolor
- **Rough.js concept illustrations** — 10 reusable patterns (funnel, cycle, Venn, tree, growth arrow, etc.)
- **CJK support** — automatic Chinese/Japanese/Korean font switching
- **Layout variety enforcement** — no consecutive repeats, decision tree for visual-first layout selection

## Project Structure

```
├── gen_pptx.py          # PPTX assembler (dual-layer or image-only)
├── render_slides.py     # HTML → PNG renderer via Playwright
├── templates/
│   ├── base.html.j2     # Base HTML template with rough.js + fonts
│   └── dynamic.html.j2  # Per-slide dynamic template
└── docs/
    ├── SKILL.md          # AI prompt: 6-phase pipeline + JSON schema
    ├── DESIGN_SYSTEM.md  # Layout patterns, rough.js cookbook, element templates
    └── STYLE_PRESETS.md  # 6 visual theme definitions
```

## Prerequisites

```bash
pip install jinja2 playwright python-pptx lxml
playwright install chromium
```

## Usage

### 1. Create a deck JSON file

See [`docs/SKILL.md`](docs/SKILL.md) for the full JSON schema. Minimal example:

```json
{
  "style": { "bg": "#fffdf7", "text": "#1a1a2e", "roughness": 1.5, "stroke_width": 2 },
  "slides": [
    {
      "id": 1,
      "html": "<div style='display:flex;justify-content:center;align-items:center;height:100%'><h1 style='font-size:80px;color:var(--accent)'>Hello World</h1></div>",
      "shapes_js": "drawRect(30, 30, 1860, 1020, { strokeWidth: 2, roughness: 2.5 });",
      "elements": [
        { "type": "textbox", "x": 160, "y": 400, "w": 1600, "h": 200,
          "paragraphs": [{ "text": "Hello World", "font": "heading", "size": 72, "bold": true, "align": "center", "color": "#1971c2" }] }
      ]
    }
  ]
}
```

### 2. Render slides to PNG

```bash
python render_slides.py --deck deck.json --outdir slides_tmp/ --mode both
```

### 3. Assemble PPTX

```bash
python gen_pptx.py --deck deck.json --imgdir slides_tmp/ --output presentation.pptx
```

## Image Placeholders

Slides can include image placeholder elements with tinted backgrounds:

```json
{
  "type": "image", "x": 100, "y": 200, "w": 800, "h": 600,
  "src": null,
  "label": "[Insert diagram here]",
  "bg_color": "#d0ebff",
  "bg_opacity": 0.3,
  "border_color": "#1971c2",
  "icon": "📊"
}
```

When `src` is null, a styled placeholder rectangle appears with the label text — ready for the user to replace with an actual image in PowerPoint.

## Claude Code Integration

This project is designed as a [Claude Code](https://claude.ai/claude-code) skill. Place the `docs/` files in `.claude/skills/excalidraw-slides/` and the pipeline will be invoked automatically when users request presentation generation.

## License

MIT
