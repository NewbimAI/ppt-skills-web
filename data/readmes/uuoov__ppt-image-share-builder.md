#BRANCH:main
# PPT Image Share Builder

English | [简体中文](README.zh-CN.md)

[![Release](https://img.shields.io/github/v/release/uuoov/ppt-image-share-builder?style=flat-square)](https://github.com/uuoov/ppt-image-share-builder/releases)
[![License](https://img.shields.io/github/license/uuoov/ppt-image-share-builder?style=flat-square)](LICENSE)
[![Codex Skill](https://img.shields.io/badge/Codex-Skill-2563eb?style=flat-square)](SKILL.md)
[![PowerPoint](https://img.shields.io/badge/output-PPTX_wrapper-b7472a?style=flat-square)](scripts/images_to_pptx.py)

![Demo contact sheet](assets/hero-contact-sheet.jpg)

Turn a course topic, source files, and a reference PPT style into an image2-first classroom PPT image workflow:

- sourced slide outline
- per-page image2 prompts
- high-quality PPT page images generated with image2 or another raster image model
- contact-sheet QA
- PPTX wrapper created by inserting the final images
- timed presentation script
- revision notes from user feedback

This is a Codex skill for students, teachers, researchers, and anyone who needs to make a polished lecture-style or report-style PPT from messy materials.

The core idea is simple:

```text
source files + reference PPT style
  -> image2-ready per-page prompts
  -> generated 16:9 PPT page images
  -> contact sheet QA
  -> targeted fixes only if QA fails or user asks
  -> insert final images into a full-bleed PPTX wrapper
  -> timed speaking script
```

The helper scripts do not replace image2. They help after image generation: checking the image set and inserting final PNG/JPG page images into a `.pptx` wrapper.

The skill is designed for one-pass delivery for non-expert users. Codex should deliver a complete usable version by default, then make targeted fixes only if QA fails or the user asks:

1. **Content-rich gate**: avoid thin pages by requiring claims, source-backed points, and meaningful page structures.
2. **Style-lock gate**: lock the visual system before generating the full deck so pages do not drift.
3. **Cleanup QA gate**: remove meaningless marks, random icons, fake labels, unrequested Q&A, and decorative elements that do not support the report.

Before it starts, the skill runs a bounded grill-me-style intake. It inspects provided materials first, tracks missing requirements as open decision branches, asks only 1-3 missing questions per batch, then records assumptions, open risks, and confidence before starting the one-pass build.

## Why This Skill Exists

Most AI PPT workflows stop too early:

1. They summarize the source.
2. They generate a few pretty slides.
3. They leave the user to fix structure, visual consistency, citations, and the speaking script.

`ppt-image-share-builder` packages a fuller workflow:

```mermaid
flowchart LR
  A["Topic + source files"] --> B["Extract and verify source facts"]
  B --> C["Audit reference PPT style"]
  C --> D["Build narrative spine"]
  D --> E["Create style lock + image2 prompts"]
  E --> F["Generate full PPT image set"]
  F --> G["Contact-sheet QA + targeted fixes"]
  G --> H["Insert final images into PPTX"]
  H --> I["Write timed talk script"]
```

The skill is especially useful when the user has:

- a course topic
- a textbook excerpt or `.docx`
- pasted notes
- government/regulatory source material
- a sample PPT whose style should be followed
- a target speaking duration such as 8-10 minutes

## What It Produces

Typical output:

```text
<topic>_image2逐页大纲.md
<topic>_10分钟汇报稿.md
<topic>.pptx
outputs/<topic-slug>-images/
  slide-01-cover.png
  slide-02-contents.png
  ...
  slide-13-closing.png
  contact-sheet-13-slides.jpg
```

The exact filenames can be adapted to the project language and topic.

## Demo

The repository now includes a real end-to-end demo run: **Medical Device Flight Check**. It uses public regulatory inspection cases plus a desensitized classroom source extract, turns the content into image2-ready page prompts, uses image2-generated full-page PPT images as the visual source of truth, checks the result with a contact sheet, and wraps the final image set in PPTX.

- [input notes](examples/medical-device-flight-check/input-notes.md)
- [content report plan](examples/medical-device-flight-check/report-content.md)
- [image2 outline](examples/medical-device-flight-check/image2-outline.md)
- [generated image overview](examples/medical-device-flight-check/contact-sheet-demo.jpg)
- [sample talk script](examples/medical-device-flight-check/10-minute-script.md)

The older **Campus Lab Safety Risk Inspection** example remains as a privacy-safe synthetic fallback, but it is no longer the primary preview.

![Demo animation](assets/demo.gif)

## Install

### Skill Installer

If your Codex environment includes the built-in skill installer, use:

Windows PowerShell:

```powershell
python "$env:USERPROFILE\.codex\skills\.system\skill-installer\scripts\install-skill-from-github.py" --repo uuoov/ppt-image-share-builder --path . --name ppt-image-share-builder
```

macOS / Linux:

```bash
python ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py --repo uuoov/ppt-image-share-builder --path . --name ppt-image-share-builder
```

Restart Codex so it loads the new skill metadata.

### Manual Clone

Clone this repository directly into your Codex skills directory.

Windows PowerShell:

```powershell
git clone https://github.com/uuoov/ppt-image-share-builder.git "$env:USERPROFILE\.codex\skills\ppt-image-share-builder"
```

macOS / Linux:

```bash
git clone https://github.com/uuoov/ppt-image-share-builder.git ~/.codex/skills/ppt-image-share-builder
```

### Release Download

You can also download the latest release ZIP from [GitHub Releases](https://github.com/uuoov/ppt-image-share-builder/releases).

### Development Install

If you are editing the skill locally, clone it anywhere and symlink or copy the folder into your Codex skills directory.

## Quick Start

Invoke the skill explicitly:

```text
Use $ppt-image-share-builder to turn my course topic, source files, and reference PPT style into image2 page prompts, generated PPT page images, a PPTX wrapper, and a 10-minute presentation script.
```

A strong request usually includes:

```text
Topic: <your sharing topic>
Audience: <class / teacher / meeting>
Duration: <8-10 minutes>
Reference PPT: <path to sample PPT or style example>
Sources: <docx/pdf/txt/web links>
Required keywords: <terms that must appear>
Output: image2 prompts + PPT page images + PPTX wrapper + script
```

## Example Prompt

```text
Use $ppt-image-share-builder.

I need a 10-minute classroom report about a regulation topic.
I have a reference PPT in the current folder and a textbook excerpt as a .docx file.
Please:
1. extract the source material,
2. audit the reference PPT style,
3. create a 12-14 page image2 outline,
4. create a style lock so all pages stay visually consistent,
5. generate the full PPT page image set,
6. create a contact sheet and fix only pages that fail QA,
7. insert the final images into PPTX,
8. write the final talk script.
```

## Helper Scripts

The commands below are PowerShell-safe. On Windows PowerShell 5.x, run multi-step commands on separate lines instead of joining them with `&&`.

Install optional script dependencies first:

```powershell
python -m pip install -r requirements.txt
```

After image2 has generated numbered PPT page images, create a contact sheet:

```powershell
python scripts/make_contact_sheet.py --input-dir examples/medical-device-flight-check/images -o examples/medical-device-flight-check/contact-sheet-demo.jpg
```

Regenerate the privacy-safe synthetic fallback demo and refresh README preview assets. If the medical-device demo exists, top-level preview assets are refreshed from that primary demo instead of the synthetic placeholders:

```powershell
python scripts/create_demo_assets.py
```

Insert final image2-generated PPT page images into a full-bleed PPTX wrapper:

```powershell
python scripts/images_to_pptx.py --input-dir examples/medical-device-flight-check/images -o examples/medical-device-flight-check/demo-deck.pptx
```

## User Feedback Loop

The default goal is one complete delivery, not staged approval.

When a user says the first version is too simple, the skill should add content depth before regenerating: stronger claims, cases, source-backed points, and richer diagrams.

When a user says revised pages look inconsistent, the skill should write a style lock and reuse it in every subsequent page prompt.

When a user says the final pages include meaningless marks or strange symbols, the skill should run final cleanup QA and regenerate only the affected pages.

## Workflow Details

The skill follows these stages:

1. **Run grill-me style intake**
   Inspect provided materials first, close essential decision branches, ask only the missing requirements, then summarize assumptions and proceed.

2. **Extract and normalize sources**  
   Chinese `.docx`, `.txt`, `.csv`, and government-style documents are normalized before analysis. The skill warns against Windows PowerShell path-encoding pitfalls.

3. **Audit reference PPT style**  
   It extracts slide rhythm, title style, colors, fonts, page markers, chart/table style, and image language.

4. **Build the narrative spine**  
   It creates slide claims rather than just topic labels.

5. **Write image prompts**  
   It creates one unified visual prompt plus per-page prompts with required text and composition.

6. **Generate and save PPT page images with image2**  
   It generates the full planned image set by default, then saves stable numbered files. Treat these images as the visual source of truth.

7. **QA with contact sheets**  
   It checks slide count, visible text, page numbers, duplicate variants, style consistency, and meaningless elements. It should fix failed pages before delivery when possible.

8. **Insert images into PPTX**  
   It inserts the final images as full-bleed pages, so the PPTX wrapper preserves the image2 visual design.

9. **Write the timed script**  
   It writes a report script that adds spoken bridges and supporting cases instead of just reading the slides.

## Repository Layout

```text
ppt-image-share-builder/
  SKILL.md
  README.md
  README.zh-CN.md
  agents/
    openai.yaml
  assets/
    hero-contact-sheet.jpg
    demo.gif
    social-preview.jpg
  examples/
    medical-device-flight-check/
      input-notes.md
      report-content.md
      image2-outline.md
      contact-sheet-demo.jpg
      demo-deck.pptx
      10-minute-script.md
      images/
    lab-safety-check/
      input-notes.md
      image2-outline.md
      contact-sheet-demo.jpg
      10-minute-script.md
  references/
    intake-grillme.md
    workflow-checklist.md
    iteration-playbook.md
    prompt-patterns.md
    qa-checklist.md
  scripts/
    create_demo_assets.py
    make_contact_sheet.py
    images_to_pptx.py
  requirements.txt
```

## Design Principles

- **Source-backed first**: facts, laws, dates, statistics, and cases should be tied to source notes.
- **Reference-style aware**: generated slides should match the user's existing PPT language.
- **Bounded intake before work**: inspect materials, close missing decision branches, then deliver a complete first version by default.
- **Chinese text aware**: keep generated Chinese text short enough to inspect and fix.
- **Private by default**: do not publish user textbooks, generated course files, personal names, or classroom materials unless the user explicitly asks.

## Scope

This is a focused skill for image2-first classroom and report-style presentation workflows. It is meant for:

- turning source material into image2-ready slide prompts
- generating polished 16:9 PPT page images
- checking the whole image set with a contact sheet
- inserting the final images into a PPTX wrapper
- writing a timed speaking script

## Current Features

- Real medical-device flight-check demo with image2 full-page visuals, source-backed report content, contact-sheet QA, PPTX wrapper, and talk script.
- Privacy-safe synthetic fallback demo for public examples that must avoid regulatory or classroom specifics.
- Contact sheet generator for quick QA after image2 generation.
- PPTX wrapper helper that inserts image2-generated page images without stretching them.
- README preview image, animated GIF, and social-preview asset.
- Release ZIP for manual download.
- PowerShell-safe command examples for Windows users.

## Feedback

- Use [Issues](https://github.com/uuoov/ppt-image-share-builder/issues) for bugs, install problems, or script failures.
- Use [Discussions](https://github.com/uuoov/ppt-image-share-builder/discussions/1) for demo ideas, classroom use cases, and prompt-pattern feedback.

## License

MIT. See `LICENSE`.
