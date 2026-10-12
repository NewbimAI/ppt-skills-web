#BRANCH:main
# High-Quality Slides

> A Claude Code skill that produces decks worth sending — not "AI-looking" slide soup.

Inspired by reverse-engineering [Genspark AI Slides](https://www.genspark.ai/ai_slides) and similar high-quality AI presentation tools, this skill teaches Claude to behave like a **slide art director**: research first, narrative second, system third, slides last.

The goal is simple: when someone says "make me a deck," the output should look designed, not generated.

---

## What this skill does

When triggered, Claude follows a **5-phase workflow** with mandatory gates between phases. The phases are deliberately frontloaded — most low-quality AI decks fail by skipping straight to "make pretty slides" without doing research or narrative work first.

| Phase | Output | Gate |
|------|--------|------|
| 1. **Strategy** | Audience, action, format, slide count | Asks the user if anything is unclear |
| 2. **Substance** | `research-notes.md` — every fact with a source | No invented stats |
| 3. **Structure** | Numbered outline: headline + supporting fact + visual per slide | User approves outline |
| 4. **Design system** | `design-tokens.css`, style preset choice, sample slide | User approves sample |
| 5. **Build** | `deck.html`, self-contained, viewport-locked, keyboard-navigable | Self-check passes |

The deliverable is an HTML deck by default. Optionally exports to `.pptx` by composing with Claude's `pptx` skill.

---

## Why HTML

- Pixel-perfect rendering, no PowerPoint version drift
- Keyboard navigation + deep linking via URL hash
- Self-contained single file — no build step, no dependencies
- Trivial to convert to PDF or screenshots for sharing
- HTML/CSS is what Claude is best at writing

If you need editable `.pptx` for a colleague who lives in PowerPoint, the skill can hand off to the `pptx` skill using the HTML as the design spec.

---

## Installation

### As a personal skill (recommended)

```bash
git clone https://github.com/andyqiu847-ai/high-quality-slides.git ~/.claude/skills/high-quality-slides
```

Restart your Claude Code session. The skill will be auto-discovered.

### As a project-level skill (team sharing)

```bash
cd your-project
mkdir -p .claude/skills
git clone https://github.com/andyqiu847-ai/high-quality-slides.git .claude/skills/high-quality-slides
git add .claude/skills/high-quality-slides
git commit -m "Add high-quality-slides skill"
```

Everyone on the team gets the skill on next `git pull`.

### Verify

```bash
ls ~/.claude/skills/high-quality-slides/
# SKILL.md  layouts.md  html-template.md  README.md  LICENSE
```

In Claude Code, open a new session and ask: *"What skills do you have available for making slides?"* — it should list this one.

---

## Usage

Just describe what you want naturally. The skill auto-triggers on prompts like:

- "做一份关于 X 的高质量 PPT"
- "Make me a Genspark-style pitch deck for our Q4 review"
- "Turn this report into a 10-slide presentation" (with a PDF/docx attached)
- "I need an investor deck for tomorrow"

Claude will then walk you through Phase 1 questions (audience, action, length), do its research, propose a narrative arc, ask you to pick a visual style from a few previews, and only then start building slides.

You can also short-circuit if you know what you want:

> "Make a 12-slide HTML deck in the `swiss-modern` preset about our user research findings. Audience is the design team. Sources are in `~/Documents/research-notes/`."

---

## What's in the skill

```
high-quality-slides/
├── SKILL.md            # Workflow + gates + anti-patterns (loaded on trigger)
├── layouts.md          # 14 layout patterns + 12 style presets (Phase 4–5)
├── html-template.md    # HTML scaffold, chart rendering, export paths (Phase 5)
├── README.md           # This file
└── LICENSE
```

The skill uses **progressive disclosure** — `SKILL.md` is a ~180-line map, and the larger reference files load only when their phase begins. This keeps Claude's context window lean and the routing predictable.

### Layout patterns (14)

`cover`, `section-divider`, `headline-only`, `three-stat-strip`, `quote-hero`, `two-column-compare`, `timeline`, `process-flow`, `2x2-matrix`, `chart-focus`, `image-with-caption`, `data-table-clean`, `kpi-grid`, `closing-cta`.

Each pattern is a recipe with a clear "when to use this" rule. Claude picks per slide based on the content's semantic shape — comparisons get `two-column-compare`, processes get `process-flow`, single decisive numbers get `headline-only`.

### Style presets (12)

Dark: `bold-signal`, `electric-studio`, `creative-voltage`, `dark-botanical`.
Light: `notebook-tabs`, `pastel-geometry`, `split-pastel`, `vintage-editorial`.
Specialty: `neon-cyber`, `terminal-green`, `swiss-modern`, `paper-and-ink`.

Each preset encodes color palette, type pairing, grid system, and motion. They're real design systems, not vague style labels.

---

## Design philosophy

Three rules that override everything else:

1. **One idea per slide.** If a slide has more than one assertion, split it.
2. **Visual relationship > text list.** Whenever bullets show up, ask: can this be a 2×2, timeline, comparison, stat strip, diagram? Default answer: yes.
3. **Pixel-perfect, viewport-locked.** Every slide fits in 1920×1080. No overflow, no internal scroll.

Plus an opinionated list of **anti-patterns** (see SKILL.md), including the canonical AI-slop signals:

- Purple-to-blue gradients on white
- Stock photos of diverse people pointing at laptops
- 7+ bullet points per slide
- "Title Case Every Word" headlines that don't assert anything
- Default Chart.js color palettes
- "Thank You / Questions?" closing slides

---

## Composability

This skill cooperates with other Claude skills:

- **`pptx`** — for editable PowerPoint export. The HTML deck serves as the design spec.
- **`pdf`** — for reading source documents in Phase 2.
- **`xlsx`** — for pulling numbers out of spreadsheets in Phase 2.
- **`docx`** — for ingesting Word reports.

A parent agent in the Claude Agent SDK can also spawn a subagent with this skill enabled to delegate "make a deck" as a unit of work and get back a deck path.

---

## Roadmap ideas

Pull requests welcome on any of these:

- `scripts/generate_deck.py` — programmatic entry point for non-chat usage
- `examples/` — a few decks produced with public-topic prompts, to serve as visual references
- More layout patterns: split-screen video stills, before/after with sliders, animated chart reveal
- More presets: brand-aware preset that ingests a logo + 2 colors and adapts the system
- MCP server wrapper, so non-Claude agents can call it as a tool

---

## Acknowledgments

The progressive-disclosure architecture and "show, don't tell" style discovery idea are borrowed from [`frontend-slides`](https://github.com/zarazhangrui/frontend-slides) — read that repo, it's excellent.

The 5-phase Guide Mode workflow is reverse-engineered from [Genspark AI Slides](https://www.genspark.ai/ai_slides) Guide Mode.

The smart-visualization rules (content semantics → visual form) come from observing how Genspark, [Gamma](https://gamma.app), and human designers actually make per-slide layout decisions on real decks.

---

## License

MIT. See [LICENSE](./LICENSE).
