#BRANCH:main
# html-to-pptx

A [Claude Code](https://claude.com/claude-code) skill for converting an existing HTML slide deck into an **editable** `.pptx` — native text boxes, shapes, and images, not rasterized screenshots.

## What this is for

You already have a finished HTML deck (typically `<section class="slide">` per slide at a fixed canvas size like 1920×1080) and you want a PowerPoint file you can hand-edit afterward — change copy, swap photos, tweak colors. This skill encodes the rules and tooling for that conversion.

It is **not** for:
- Generating decks from scratch — use the `pptx` skill instead
- Pixel-perfect output — that requires headless-browser screenshots, which are uneditable
- Editing an existing `.pptx` — use the `pptx` skill's unpack/repack workflow

## Install

Clone into your Claude Code skills directory:

```bash
git clone https://github.com/Emily27-alt/html-to-pptx.git ~/.claude/skills/html-to-pptx
```

Or, if you keep skills in a project:

```bash
git clone https://github.com/Emily27-alt/html-to-pptx.git .claude/skills/html-to-pptx
```

Runtime dependencies (installed once, system-wide):

```bash
npm install -g pptxgenjs sharp
pip install pillow pymupdf "markitdown[pptx]"
```

For PPTX → PDF export you also need either PowerPoint (Windows, via the included PowerShell script) or LibreOffice (`soffice`) on macOS/Linux.

## How to use

In a Claude Code session, give Claude an HTML deck and ask for an editable PowerPoint version. The skill activates on phrasings like:

> "Convert this HTML deck to an editable .pptx"
> "Turn slides.html into PowerPoint, keep the styling"

Claude will read [`SKILL.md`](SKILL.md), follow the 6-step workflow (analyze → bake gradient PNGs → write `build.js` → export → visual QA → fix), and produce `output.pptx`.

## What's inside

```
html-to-pptx/
├── SKILL.md           # Entry point — workflow + the 8 rules that matter
├── reference.md       # Detailed CSS↔pptxgenjs mapping, archetypes, edge cases
└── templates/
    ├── build.template.js        # pptxgenjs skeleton (cover/chapter/person archetypes)
    ├── gen_bg.template.py       # Pillow gradient-background generator
    ├── gen_fade.template.py     # Photo-transition overlay generator
    ├── to_pdf.template.ps1      # Windows PPTX → PDF via PowerPoint COM
    └── pdf2img.template.py      # PyMuPDF PDF → per-slide JPG for visual QA
```

## The rules this skill encodes

The high-density value in this skill is the failure modes it knows about. A few highlights — full list in [`SKILL.md`](SKILL.md):

- **Letter-spacing math is the #1 failure mode.** CSS `letter-spacing: .4em` at a 24pt font is **not** `charSpacing: 0.4` or `charSpacing: 20` — it's `charSpacing: 9.6` (em × fontPt, in points). Get it wrong and every Latin label wraps character-by-character.
- **Gradients must be baked as PNGs.** pptxgenjs has no gradient fill — use Pillow.
- **Photo-to-panel fades use a single gradient PNG.** Stacked translucent rectangles produce visible bands.
- **Footers floating over photos need a scrim PNG.** Photo brightness varies; without a scrim, footers vanish on bright slides.
- **Coordinate math:** for a 1920×1080 canvas on a 13.333×7.5″ slide, `1 CSS px = 1/144 in` (positions/sizes) and `1 CSS px = 0.5 pt` (font sizes).

## License

MIT — see [LICENSE](LICENSE).
