#BRANCH:master
# MARP Slides

A Claude Code skill for creating beautiful presentations using [MARP](https://marp.app) — SVG charts, dashboard components, dark/light themes, and 22 curated example decks to learn from.

## What it does

Give Claude Code a topic and it builds a polished MARP deck. The skill teaches it how to compose slides using SVG charts, metric cards, gauges, sparklines, progress bars, expandable sections, and more — all in raw HTML inside Markdown.

The 22 example decks are the secret sauce. Instead of just knowing the building blocks, Claude reads real decks that look good and matches that quality bar.

## Quick start

### 1. Install the skill

```bash
git clone https://github.com/robonuggets/marp-slides
```

### 2. Add it to Claude Code

Point Claude Code at the skill folder:

```bash
claude --add-dir ./marp-slides
```

Or add it manually to your project's `.claude/skills/` directory.

### 3. Install the VS Code extension

Install **Marp for VS Code** and enable these settings:

```json
{
  "markdown.marp.enableHtml": true,
  "markdown.marp.allowLocalFiles": true
}
```

### 4. Ask for a presentation

```
Create a MARP presentation reviewing my Q1 sales data. Dark theme, include stat cards and a bar chart.
```

```
Make me a deck about my favorite coffee brewing methods. Editorial style, warm tones.
```

```
Build a fitness dashboard presentation from this CSV data.
```

## What's included

```
marp-slides/
├── SKILL.md              # The skill — rules, components, design system
└── examples/             # 22 curated reference decks
    ├── marp_facebook-ads.md    # Data dashboard with SVG charts
    ├── marp_coffee.md          # Editorial lifestyle deck
    ├── marp_fitness.md         # Health tracking dashboard
    ├── marp_wine-tasting.md    # Tasting notes with ratings
    ├── marp_travel.md          # Travel guide with maps
    ├── marp_kids-party.md      # Fun creative deck
    └── ... 16 more examples
```

## Example categories

| Category | Examples | Style |
|---|---|---|
| Data / dashboard | facebook-ads, fitness, comparison | SVG charts, stat cards, gauges |
| Lifestyle / editorial | coffee, wine-tasting, cocktail | Warm tones, photography, ratings |
| Guide / how-to | garden, houseplant, home-gym | Step-by-step, tips, checklists |
| Fun / creative | kids-party, board-game, film-director | Playful, colorful, interactive |
| Travel / location | travel, walking-tour, road-trip | Maps, itineraries, photo backgrounds |
| Showcase | hero, apartment, wardrobe | Visual-first, minimal text |

## Features

- **Dark and light themes** with tested font pairings (Outfit + Raleway, DM Serif + DM Sans, Space Grotesk + IBM Plex Mono, and more)
- **SVG charts** — line/area, donut/pie, gauges, sparklines, bar charts, radar
- **Dashboard components** — metric cards with gradient borders, status dots, verdict tags, hover rows
- **Interactive elements** — collapsible `<details>` sections, tooltips, progress bars
- **Layout components** — before/after splits, terminal mockups, chat bubbles, timelines, flowcharts
- **SVG icon library** — 16+ inline icons (dollar, heartbeat, check, arrow, lightning, etc.)

## Export

```bash
# PDF
npx @marp-team/marp-cli slides.md --pdf --allow-local-files

# PowerPoint
npx @marp-team/marp-cli slides.md --pptx --allow-local-files

# HTML (keeps animations and interactive elements)
npx @marp-team/marp-cli slides.md --html --allow-local-files
```

## How the examples help

The skill file (SKILL.md) teaches the building blocks — CSS variables, chart math, icon paths. But the examples teach **composition** — how to combine those blocks into slides that actually look good. When Claude reads the examples before generating, it matches the spacing, density, and visual rhythm of a real polished deck instead of just stacking components.

## License

MIT
