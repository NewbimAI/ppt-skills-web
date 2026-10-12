#BRANCH:main
# Beamer Skill

[English](README.md) | [简体中文](README.zh-CN.md)

An AI coding assistant skill for creating, compiling, syncing, reviewing, and polishing academic **Beamer LaTeX** presentations for USTC LaTeX and other Overleaf-compatible platforms.

Maintained by **USTC_Jaxon-JP(最闲的下饭菜)**.

This repository is a concise derivative of [Noi1r/beamer-skill](https://github.com/Noi1r/beamer-skill), with substantive extensions in workflow design, PDF/Python tooling choices, multi-environment packaging, compilation branching, and platform integration.

Supports **Claude Code**, **OpenAI Codex CLI**, **Google Antigravity**, and **VS Code** AI extensions (Copilot, Cline, Cursor).

Full lifecycle: **create → sync/compile → review → polish → verify.**

## Recommended Usage

This derivative is primarily recommended for **OpenCode**. For best results, use an advanced multimodal model such as a GPT-class model; among Chinese domestic model options, **Kimi** is currently recommended for this workflow.

The suggested setup is to clone this repository locally and install the `beamer/` directory as an OpenCode global skill. This setup step can be delegated to an AI coding assistant.

Typical global skill target:

```text
~/.config/opencode/skills/beamer
```

### Example Prompt

The skill is often used with Chinese paper-reading prompts. Example:

```text
使用 beamer-skill 对 "C:\Users\server02\Desktop\2502.15260v2.pdf" 做一个论文讲解性质的 beamer，要求把架构和技术细节讲清楚（幻灯片页数不限制，适当加入论文关键图片，讲解要图文并茂，不过要注意图片比例不要有过界的情况，文字不要过于精简，不是面向汇报的那种幻灯片），观看对象是一个业内有一点知识储备的研究生。
```
## Features

| Action | Description |
|--------|-------------|
| `create [topic]` | Collaborative, iterative lecture creation with phase gates (material analysis → needs interview → structure plan → draft → quality loop) |
| `compile [file]` | Prefer local XeLaTeX compilation when available; otherwise ask whether to install local TeX dependencies or sync to USTC LaTeX (default `https://latex.ustc.edu.cn`) for remote compile diagnostics |
| `review [file]` | Read-only proofreading report (grammar, typos, overflow, consistency, academic quality) |
| `audit [file]` | Visual layout audit (overflow, fonts, boxes, spacing) |
| `pedagogy [file]` | Holistic pedagogical review with 13 validation patterns |
| `tikz [file]` | TikZ diagram review and SVG extraction |
| `excellence [file]` | Comprehensive multi-dimensional quality review |
| `devils-advocate [file]` | Challenge slide design with pedagogical questions |
| `visual-check [file]` | PDF-based visual verification of compiled slides |
| `validate [file]` | Structural validation against skill constraints |
| `extract-figures [pdf]` | Extract figures from paper PDFs for direct inclusion in slides |

### Highlights

- **Quality scoring system** — automated rubric (start at 100, deduct per issue) with Excellent/Good/Needs Work/Poor thresholds
- **No overlays** — no `\pause`, `\onslide`, `\only`. Uses multiple slides and color emphasis instead
- **Content density guards** — upper bounds (7 bullets, 2 equations, 5 symbols per slide) and lower bounds (every slide earns its place)
- **Box overflow detection** — Beamer suppresses overflow warnings inside blocks; the skill catches them via visual audit
- **Motivation before formalism** — every concept starts with "Why?" before "What?"
- **TikZ precision** — mathematical accuracy enforced via `\pgfmathsetmacro` (no hardcoded approximations)
- **Semantic color system** — colorblind-safe palette (`\pos{}`, `\con{}`, `\HL{}`) with WCAG AA contrast (≥ 4.5:1)
- **Figure extraction** — pull figures directly from paper PDFs via `pdf-mcp`, ready for `\includegraphics`
- **Timing allocation** — built-in slide-count heuristics for 5min lightning talks through 90min lectures
- **Columns & layout rules** — enforced `columns[T]` patterns with gap/width constraints
- **Backup slides** — automatic appendix section for anticipated Q&A
- **Algorithm & code support** — `algorithm2e`, `listings`, `pgfplots` integration with per-slide line limits
- **Dual-path compilation** — compile locally when a working TeX environment exists; otherwise fall back to USTC LaTeX remote compilation
- **XeLaTeX on platform** — after push, remind the user to enable **XeLaTeX** (sometimes shown as `xelatex` / `xlatex` mode)

## Prerequisites

### Core workflow

This skill is designed for:

- local Beamer authoring
- local PDF analysis (papers, figures, tables, structure)
- local XeLaTeX compilation when a working TeX environment is available
- remote XeLaTeX compilation on USTC LaTeX or another Overleaf-compatible platform

A local TeX distribution is optional but preferred for fast feedback. If it is unavailable, the assistant should ask whether to install local TeX dependencies or go straight to the remote platform.

### Assumed local environment

The skill assumes common local helper tools are already available when needed.
It does **not** proactively install dependencies before running.

If a local helper tool is missing, the skill should:

1. continue with the best available fallback when possible
2. otherwise report the missing dependency clearly
3. suggest an installation command only after the failure is observed

### Git workflow

Recommended setup:

- keep your main development repository as the primary Git remote (`origin`)
- add the LaTeX platform project as a second remote, e.g. `ustc-latex`
- push to the platform remote when you want remote compilation

You only need:

- `git`
- A USTC LaTeX project with Git enabled
- The project Git address copied from the platform, commonly shown as:
  `git clone https://git@latex.ustc.edu.cn/git/****************`
- A Git token supplied by the user

Recommended remote setup (replace placeholders with the Git URL copied from the platform):

```bash
git remote add ustc-latex https://git@latex.ustc.edu.cn/git/****************
git push ustc-latex HEAD
```

If the user provides the full `git clone ...` command copied from USTC LaTeX, extract the URL part before running `git remote add`.

> GitHub is optional, not required. Any primary Git remote is acceptable. Keep the platform as a separate remote. Avoid `git push --force` / `git pull --force`; if the remote repository gets out of sync, re-clone instead.

### Dependency policy

This skill keeps lazy dependency handling for most helper tools, but compilation has a dedicated branch:

- first check whether a working local TeX environment is available (`latexmk`, `xelatex`, or equivalent)
- if local compilation works, use it for fast feedback
- if local compilation tools are missing, ask the user whether to install the missing dependencies or go directly to USTC LaTeX remote compilation
- for non-compilation helper tools, continue using lazy dependency handling and only suggest installation after an actual missing-tool failure

This keeps the workflow lightweight while still preferring local compile feedback when the environment already supports it.

### pdf-mcp (Recommended)

Install [pdf-mcp](https://github.com/Noi1r/pdf-mcp) (fork with file-based image extraction — avoids base64 token bloat) so Claude Code can read large PDFs (papers, references) and extract figures directly:

```bash
pip install git+https://github.com/Noi1r/pdf-mcp.git
claude mcp add pdf-mcp --scope user pdf-mcp
```

If you use a SOCKS proxy, also install `socksio` (required by `httpx` for SOCKS support):

```bash
pip install socksio
```

This enables the `create` action to analyze research papers and `extract-figures` to pull figures for slide inclusion.

## Installation

Clone the repo first:

```bash
git clone https://github.com/JaxonJP/beamer-skill.git
```

### Claude Code

Copy the skill directory into your Claude Code skills folder:

```bash
mkdir -p ~/.claude/skills
cp -r beamer-skill/beamer ~/.claude/skills/
```

Restart Claude Code. The skill will be automatically detected and triggered when you mention beamer, slides, lecture, tikz, or related keywords.

### OpenAI Codex CLI

Copy `AGENTS.md` and `references/` into your project root:

```bash
cp beamer-skill/beamer/AGENTS.md your-project/AGENTS.md
cp -r beamer-skill/beamer/references your-project/references
```

Codex CLI automatically reads `AGENTS.md` from the working directory. The main file contains core rules and action summaries; detailed workflows are in `references/` and referenced as needed.

### Google Antigravity

Antigravity is compatible with the `SKILL.md` format. Copy the skill directory:

```bash
mkdir -p ~/.claude/skills
cp -r beamer-skill/beamer ~/.claude/skills/
```

The same `SKILL.md` used by Claude Code works with Antigravity without modification.

### VS Code — GitHub Copilot

Copy the Copilot instructions file into your project:

```bash
mkdir -p your-project/.github
cp beamer-skill/.github/copilot-instructions.md your-project/.github/
```

Copilot Chat automatically reads `.github/copilot-instructions.md` and applies the rules during conversations.

### VS Code — Cline

Copy the Cline rules file into your project:

```bash
mkdir -p your-project/.clinerules
cp beamer-skill/.clinerules/beamer.md your-project/.clinerules/
```

Cline automatically loads all files in `.clinerules/` as custom instructions.

### VS Code — Cursor

Copy the Cursor rules file into your project:

```bash
mkdir -p your-project/.cursor/rules
cp beamer-skill/.cursor/rules/beamer.mdc your-project/.cursor/rules/
```

Cursor automatically loads `.mdc` files from `.cursor/rules/`. The `globs` field in the frontmatter ensures the rules activate for `.tex`, `.bib`, and `.sty` files.

## Platform Comparison

| Platform | Instruction file | Content level | Auto-trigger |
|----------|-----------------|---------------|-------------|
| Claude Code | `SKILL.md` | Full (~55KB) | Yes (keyword matching) |
| Antigravity | `SKILL.md` | Full (~55KB) | Yes (keyword matching) |
| Codex CLI | `AGENTS.md` + `references/` | Medium (~30KB total) | Yes (auto-reads AGENTS.md) |
| VS Code Copilot | `.github/copilot-instructions.md` | Compact (~5KB) | Yes (auto-reads) |
| VS Code Cline | `.clinerules/beamer.md` | Compact (~5KB) | Yes (auto-reads) |
| VS Code Cursor | `.cursor/rules/beamer.mdc` | Compact (~5KB) | Yes (glob-triggered on .tex) |

## Usage

Once installed, the skill is triggered automatically when you mention beamer, slides, lecture, tikz, or related keywords.

### Default Authoring Workflow

1. Draft slides locally with your AI assistant.
2. Keep figures, bibliography, and sources in the same Git repo.
3. Check whether local TeX compilation is available; if yes, compile locally first.
4. If local TeX is unavailable, ask whether to install local dependencies or use USTC LaTeX remote compilation directly.
5. After the current local Beamer version is written, immediately add `ustc-latex` as a second remote and push the latest deck to the platform.
6. Provide the platform project Git address when needed, commonly copied as `git clone https://git@latex.ustc.edu.cn/git/****************`.
7. Open `https://latex.ustc.edu.cn` to inspect the remote PDF and compile log, and enable **XeLaTeX** if the platform is not already in `xelatex` / `xlatex` mode.


**Create a lecture from a paper:**
```
Help me create a beamer presentation based on this paper: /path/to/paper.pdf
```

**Extract figures from a paper:**
```
Extract figures from /path/to/paper.pdf for my slides
```

**Local-first or USTC compile:**
```
Compile my slides: /path/to/slides.tex
# first try local XeLaTeX if available
# otherwise use the USTC LaTeX project address copied from the platform
# e.g. git clone https://git@latex.ustc.edu.cn/git/****************
# after push, enable XeLaTeX / xelatex / xlatex mode on the platform
```

**Full quality check:**
```
Run excellence review on /path/to/slides.tex
```

**Proofread only:**
```
Proofread /path/to/slides.tex
```

## Customization

### Default Presenter

The skill defaults to:
```latex
\author{USTC_Jaxon-JP(最闲的下饭菜)}
\institute{University of Science and Technology of China}
```

To change this, either:
- Tell the AI assistant your name/affiliation when creating slides, or
- Edit the preamble section in the corresponding instruction file (`SKILL.md`, `AGENTS.md`, or the VS Code config)

### Custom Templates

If you have a custom beamer preamble, header file, or theme, simply provide it. The skill will use yours instead of the built-in default.

## Examples

The `example/` directory contains real-world examples generated entirely by this skill:

| Example | Topic | Type |
|---------|-------|------|
| `zkagent_slides` | zkAgent — zero-knowledge proof agents | Theoretical CS / cryptography |
| `slides` | TWIST1⁺ FAP⁺ fibroblasts in Crohn's disease | Basic research (with extracted figures) |
| `slides_EP` | Endoscopic papillectomy outcomes | Clinical retrospective study |

Each example includes the source paper (PDF), the generated `.tex`, and a compiled `.pdf` artifact. In the default workflow, new decks are authored locally and compiled remotely on USTC LaTeX after Git sync. The `figures/` directory contains images extracted from the source papers via `extract-figures`.

## Benchmark: With Skill vs. Without Skill

Automated evaluation comparing Claude Code **with** the beamer skill against a **baseline** (no skill). Each test was run by an independent subagent; assertions check objective, verifiable properties of the output.

### Test 1 — `create`: 10-min talk from a cryptography paper

| Assertion | With Skill | Baseline |
|-----------|:----------:|:--------:|
| .tex file generated | Pass | Pass |
| `aspectratio=169`, `10pt` | Pass | Pass |
| No overlay commands | Pass | Pass |
| Slide count in 8–12 range | Pass (11) | Pass (12) |
| References slide (`thebibliography`) | Pass | **Fail** |
| Backup slides after `\appendix` | Pass | **Fail** |
| Semantic colors (`\pos`, `\con`, `\HL`) | Pass | **Fail** |
| **Pass rate** | **7/7 (100%)** | **4/7 (57%)** |

### Test 2 — `review` + `validate`: proofread an existing slide deck

| Assertion | With Skill | Baseline |
|-----------|:----------:|:--------:|
| Review report generated | Pass | Pass |
| 5-category classification | Pass | **Fail** |
| Standard issue format (Location / Current / Proposed / Severity) | Pass | **Fail** |
| Separate validation report | Pass | **Fail** |
| Structured validation table (slide count, aspect ratio, hard rules) | Pass | **Fail** |
| Original `.tex` unmodified (read-only) | Pass | Pass |
| **Pass rate** | **6/6 (100%)** | **2/6 (33%)** |

### Summary

| Metric | With Skill | Baseline | Delta |
|--------|:----------:|:--------:|:-----:|
| Overall pass rate | 13/13 (100%) | 6/13 (46%) | **+54 pp** |
| Mean tokens | ~65k | ~50k | +30% |
| Mean wall time | ~230s | ~130s | +73% |

> The skill guarantees structural compliance (references, backups, semantic colors, formatted reports) that the baseline consistently misses. Token/time overhead is moderate (~30%/~73%) relative to the quality gain.

## File Structure

```
beamer-skill/
├── beamer/
│   ├── SKILL.md                    # Full skill (Claude Code / Antigravity)
│   ├── AGENTS.md                   # Codex CLI main file
│   └── references/                 # Codex CLI detailed rules
│       ├── create-workflow.md      #   Phase 0-5 creation workflow
│       ├── tikz-standards.md       #   TikZ quality standards & patterns
│       └── review-actions.md       #   review/audit/pedagogy/excellence/validate
├── .github/
│   └── copilot-instructions.md     # VS Code Copilot
├── .clinerules/
│   └── beamer.md                   # VS Code Cline
├── .cursor/
│   └── rules/
│       └── beamer.mdc              # VS Code Cursor
├── example/                        # Real-world examples
│   ├── 199.pdf                     # Source paper (zkAgent)
│   ├── zkagent_slides.*            # Generated slides
│   ├── slides.*                    # Crohn's disease fibrosis
│   ├── slides_EP.*                 # Endoscopic papillectomy
│   └── figures/                    # Extracted paper figures
├── README.md
└── LICENSE
```

## License

MIT
