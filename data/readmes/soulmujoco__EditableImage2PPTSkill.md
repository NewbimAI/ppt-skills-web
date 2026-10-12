#BRANCH:main
# EditableImage2PPTSkill

Codex skill for reconstructing slide screenshots or exported slide images into editable PowerPoint decks.

This skill is designed for cases where the source material is an image of a slide rather than a native `.pptx` file. It helps Codex extract reusable visual assets, rebuild text and geometry as editable PowerPoint objects, and package the result as a clean `.pptx`.

## What It Does

- Converts one or more slide images into editable PowerPoint slides.
- Keeps ordinary text as editable PowerPoint text boxes.
- Rebuilds simple frames, cards, circles, separators, and rules as native shapes.
- Extracts logos, icons, photos, decorative bands, and complex visual elements as independent PNG assets.
- Supports batch reconstruction by creating one layout JSON file per page and combining them into a final deck.
- Includes QA helpers for inspecting generated PPTX files.

## Repository Layout

```text
.
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── asset-manifest.md
│   ├── layout-json.md
│   └── reconstruction-sop.md
└── scripts/
    ├── asset_cropper.py
    ├── build_pptx_from_layout.py
    ├── combine_layouts.py
    └── inspect_pptx.py
```

## Installation

Copy this repository into your Codex skills directory:

```powershell
git clone https://github.com/soulmujoco/EditableImage2PPTSkill.git "$env:USERPROFILE\.codex\skills\EditableImage2PPTSkill"
```

The skill will be available to Codex after it reloads skills.

## Requirements

Use an active Python environment with:

- `python-pptx`
- `Pillow`
- `numpy`

If needed:

```bash
python -m pip install python-pptx pillow numpy
```

## Typical Workflow

1. Place source slide images in a working folder.
2. Create an asset crop manifest for each page.
3. Run `scripts/asset_cropper.py` to extract PNG assets and generate a contact sheet.
4. Create layout JSON files using source-image pixel coordinates.
5. Run `scripts/build_pptx_from_layout.py` to generate editable slides.
6. Use `scripts/combine_layouts.py` for multi-page decks.
7. Run `scripts/inspect_pptx.py` to check the final PPTX package.

## Example Commands

Extract visual assets:

```bash
python scripts/asset_cropper.py \
  --manifest page_002.assets.json \
  --out-dir assets/page_002 \
  --contact-sheet
```

Build a PPTX from a layout:

```bash
python scripts/build_pptx_from_layout.py \
  --layout layouts/page_002.layout.json \
  --assets-root . \
  --out output/page_002_editable.pptx
```

Combine layouts:

```bash
python scripts/combine_layouts.py \
  --layouts layouts \
  --out layouts/combined.layout.json
```

Inspect a generated deck:

```bash
python scripts/inspect_pptx.py \
  --pptx output/deck_editable.pptx \
  --report scratch/quality_report.json
```

## Reconstruction Standard

A reconstruction is considered complete when:

- Meaningful visual assets are either extracted as PNGs or rebuilt as native PowerPoint shapes.
- Ordinary text remains editable.
- Extracted assets are separate picture objects.
- The final PPTX passes package inspection.
- The generated preview has been visually compared against the source images, or any remaining fidelity limits are explicitly documented.

## Notes

This skill is for image-to-PPT reconstruction. If the original native `.pptx` file is available, edit that deck directly instead of reconstructing it from screenshots.

## License

MIT License. See [LICENSE](LICENSE) for details.
