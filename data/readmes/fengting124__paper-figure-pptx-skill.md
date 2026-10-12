#BRANCH:main
# Paper Figure PPTX Skill

Reconstruct academic paper figures, screenshots, and technical diagrams into visually faithful, editable PowerPoint slides.

This is a Codex skill, not a standalone CLI. After installing the required tools and copying the skill into the Codex skills directory, users can invoke `$paper-figure-pptx` to reconstruct figures with editable text, native PowerPoint geometry, local raster crops for complex visuals, and LibreOffice-rendered validation artifacts.

![paper-figure-pptx-skill hero](docs/assets/hero.png)

## Quick Start

Use this path when you just want to install the skill and try it quickly.

### 1. Clone The Skill Into Codex

```powershell
$SkillsDir = "$env:USERPROFILE\.codex\skills"
$SkillDir = Join-Path $SkillsDir "paper-figure-pptx"
New-Item -ItemType Directory -Force $SkillsDir | Out-Null

if (Test-Path (Join-Path $SkillDir ".git")) {
  cd $SkillDir
  git pull
} elseif (Test-Path $SkillDir) {
  Write-Host "Existing non-git skill folder found at $SkillDir. Rename or remove it if you want a fresh clone."
  cd $SkillDir
} else {
  git clone https://github.com/fengting124/paper-figure-pptx-skill.git $SkillDir
  cd $SkillDir
}
```

### 2. Install Node Dependencies

```powershell
npm install
```

This installs the project-level Node packages declared in `package.json`, including PptxGenJS, `sharp`, and `pdfkit`.

### 3. Check The Environment

Run the full local environment check:

```powershell
python scripts/check_environment.py
```

If the output ends with `Result: READY`, the local environment can run the preferred workflow.

For CI-style validation without checking system tools such as LibreOffice and Poppler:

```powershell
npm run check
```

For strict local validation:

```powershell
npm run check:strict
```

### 4. Restart Codex If Needed

Restart Codex if the skill does not appear immediately in `/skills`. After restart, `$paper-figure-pptx` should be visible as an available skill.

### 5. Use The Skill

In Codex, attach or point to a reference image and ask:

```text
Use $paper-figure-pptx.

Reconstruct this academic paper figure as an editable PowerPoint slide.
Use pixel-perfect hybrid reconstruction.
Export PPTX, LibreOffice-rendered PDF/PNG, side-by-side comparison, diff image, source script, and validation_report.md.
```

### 6. Check The Outputs

A successful reconstruction should produce:

- `<name>.pptx`
- script-preview PDF/PNG when useful
- `libreoffice_render/<name>.pdf`
- `libreoffice_render/<name>_libreoffice.png`
- `side_by_side_comparison.png`
- `diff_image.png`
- `validation_report.md`
- `source_generation_script.js`

## Effect Comparison

The example below shows the source figure on the left and the LibreOffice-rendered PPTX reconstruction on the right. The skill treats the LibreOffice-rendered output as the validation target; script-export previews are debugging aids only.

![Effect comparison showing source figure and LibreOffice-rendered PPTX reconstruction](docs/assets/effect-comparison.png)

## Workflow Overview

The workflow starts from a reference figure, uses Codex skill rules to drive hybrid reconstruction, validates the generated PPTX through LibreOffice-rendered output, and exports editable deliverables with comparison artifacts.

![paper-figure-pptx-skill workflow overview](docs/assets/workflow-overview.png)

## How It Works

The skill uses a hybrid reconstruction workflow:

1. Inspect the source figure and identify text, simple geometry, and complex visual regions.
2. Rebuild readable text as editable PowerPoint text boxes.
3. Rebuild simple geometry as native PowerPoint shapes, including boxes, rounded rectangles, dividers, arrows, connectors, and panel frames.
4. Crop complex visual elements from the reference image, including custom icons, photos, video frames, dense plots, and thumbnails.
5. Generate the PPTX using PptxGenJS or a compatible PPTX library.
6. Render the generated PPTX through LibreOffice headless.
7. Convert the LibreOffice-rendered output to PNG, compare it against the reference image, and create side-by-side and diff images.
8. Run correction passes for geometry, text layout, crop bounds, spacing, colors, borders, and icon fidelity.
9. Write a `validation_report.md` that records editable elements, native shapes, raster crops, unclear text, known differences, tools used, and validation status.

## Reconstruction Modes

### Pixel-Perfect Hybrid Reconstruction

This is the default mode. Use it when the source image should be matched as closely as possible.

- Keep readable text editable.
- Keep simple boxes, borders, dividers, and arrows editable as PowerPoint shapes.
- Crop custom icons and complex visual regions from the reference image.
- Do not approximate custom icons with unrelated icon libraries.
- Optimize against the LibreOffice-rendered PNG, not against script previews.

### Semantic Icon Replacement

Use this optional mode only when exact icon replication is not required and a cleaner, more unified icon style is preferred.

Ask explicitly:

```text
Use $paper-figure-pptx.

Use semantic icon replacement mode.
Exact icon replication is not required.
Keep the original layout and text, but replace the icons with clean, unified icons.
```

This mode may install or reuse icon packages such as `lucide-static`, `@iconify-json/material-symbols`, `@iconify-json/lucide`, and `@iconify-json/heroicons`.

## Requirements

Required for normal use:

- Codex with local skills support.
- Node.js, used to run generated reconstruction scripts.
- Project Node dependencies installed with `npm install`.
- LibreOffice, used for true PPTX render validation.

Recommended for full validation:

- Poppler `pdftoppm`, used to convert LibreOffice-rendered PDFs into PNGs.

Optional for semantic icon replacement:

- `lucide-static`
- `@iconify-json/material-symbols`
- `@iconify-json/lucide`
- `@iconify-json/heroicons`

The skill does not automatically download system tools just because it is invoked. Install tools before use, or ask Codex explicitly to install/check them in your environment.

## Tooling Setup

On Windows, a minimal setup is:

```powershell
winget install -e --id TheDocumentFoundation.LibreOffice
winget install -e --id OpenJS.NodeJS.LTS
npm install
```

On Windows, the default LibreOffice path used by the skill is:

```text
C:\Program Files\LibreOffice\program\soffice.exe
```

If your path differs, copy `config.example.json` to `config.local.json` in your local skill folder and adjust the path. Keep `config.local.json` out of version control.

If `pdftoppm` is unavailable, the skill can still generate PPTX and LibreOffice PDF outputs, but it cannot complete the preferred LibreOffice-rendered PNG comparison workflow until a PDF-to-PNG renderer is available.

When a required tool is missing, Codex should report the missing dependency and the affected output step instead of claiming full LibreOffice-rendered validation. System-level software such as LibreOffice, Node.js, Poppler, or ImageMagick should not be installed automatically unless you explicitly request installation or grant permission for that task.

## Common Commands

Validate the repository structure:

```powershell
npm run validate
```

Check Node dependencies only:

```powershell
npm run check
```

Check the full local rendering environment:

```powershell
npm run check:full
```

Check the full environment and fail on optional warnings:

```powershell
npm run check:strict
```

Check optional semantic icon packages:

```powershell
python scripts/check_environment.py --semantic-icons
```

Install optional semantic icon packages:

```powershell
npm install lucide-static
npm install @iconify-json/material-symbols
npm install @iconify-json/lucide
npm install @iconify-json/heroicons
```

## Usage Prompts

### Faithful Reconstruction

```text
Use $paper-figure-pptx.

Reconstruct the attached academic paper figure as an editable PowerPoint slide.
Use pixel-perfect hybrid reconstruction.
Keep readable text editable.
Rebuild simple geometry as native PowerPoint shapes.
Crop custom icons and complex thumbnails from the reference image.
Never insert the whole reference image as a slide background.
Render the PPTX with LibreOffice.
Export PPTX, LibreOffice-rendered PDF/PNG, side-by-side comparison, diff image, source script, and validation_report.md.
Run at least two correction passes.
```

### LibreOffice-Driven Correction

```text
Use $paper-figure-pptx.

The attached comparison image shows the reference beside the LibreOffice-rendered PPTX.
Fix the PPTX using only the LibreOffice-rendered PNG as the validation target.
Do not optimize against script-preview images.
Focus on global geometry, section boxes, text line breaks, icon crop bounds, border styles, and final diff.
```

## Validation

Run the local validator:

```powershell
python scripts/validate_skill.py .
```

The validator checks that:

- `SKILL.md` exists.
- The YAML frontmatter contains `name` and `description`.
- The skill name is valid lowercase hyphen-case.
- The skill body is non-empty.
- Optional `agents/openai.yaml` has basic interface metadata.
- `package.json` declares the required Node dependencies.
- `scripts/check_environment.py` exists.

## Repository Layout

```text
.
|-- SKILL.md
|-- agents/
|   `-- openai.yaml
|-- scripts/
|   |-- check_environment.py
|   `-- validate_skill.py
|-- examples/
|   `-- prompts.md
|-- docs/
|   `-- assets/
|       `-- effect-comparison.png
|       `-- hero.png
|       `-- workflow-overview.png
|-- config.example.json
|-- package.json
|-- package-lock.json
|-- README.md
|-- LICENSE
|-- CONTRIBUTING.md
|-- CODE_OF_CONDUCT.md
|-- SECURITY.md
|-- CHANGELOG.md
`-- .github/workflows/validate.yml
```

## What Not To Commit

Do not commit generated user artifacts such as:

- reconstructed PPTX/PDF/PNG outputs;
- source reference images;
- local crop assets from private projects;
- `validation_report.md` from private figures;
- `config.local.json`;
- temporary render folders such as `libreoffice_render/`.

## License

MIT. See `LICENSE`.
