#BRANCH:main
# Web PPT

<p align="center">
  <strong>Generate stunning HTML presentations — zero dependencies, open in browser, with video recording.</strong>
</p>

<p align="center">
  <strong>生成精美 HTML 演示文稿 — 零外部依赖、浏览器直接打开、支持视频录制。</strong>
</p>

---

## Features / 特性

| | Feature | 特性 |
|---|---------|------|
| 🎨 | **Anti-AI-Slop design** — distinctive visuals, not generic AI aesthetics | **反 AI 审美设计** — 独特视觉，拒绝千篇一律 |
| 📄 | **Pure HTML/CSS/JS** — no build tools, no frameworks, no PowerPoint | **纯 HTML/CSS/JS** — 无构建工具、无框架、无需 PowerPoint |
| 🎬 | **Audio-First video** — TTS narration drives slide timing (not fixed 4s) | **音频优先视频** — TTS 旁白驱动幻灯片时长（非固定 4 秒） |
| 🗣️ | **Dual TTS engines** — Edge TTS (local/fast) + CosyVoice 3.0 (GPU/voice cloning) | **双 TTS 引擎** — Edge TTS（本地/快速）+ CosyVoice 3.0（GPU/声音克隆） |
| ✅ | **Automated QA** — lint, validate, auto-fix slides with built-in scripts | **自动化质检** — 内置脚本完成 lint、验证、自动修复 |
| 🔤 | **24 bundled fonts** — curated woff2 collection, no CDN dependency | **24 款内置字体** — 精选 woff2 字体库，无需 CDN |
| 🎭 | **9 verified themes** — WCAG contrast-checked color palettes | **9 套验证主题** — 通过 WCAG 对比度检验的配色方案 |

---

## How It Works / 工作流程

```
Topic → Plan → Design → Build → Video
         ↓        ↓        ↓
      Content   Visual   HTML/CSS/JS
      Structure  Theme    Code
```

| Stage | What | 做什么 |
|-------|------|--------|
| **1. Plan** | Slide count, narration text, content structure | 页数、旁白文案、内容结构 |
| **2. Design** | Theme, color palette, font pairing, layout variety | 主题、配色、字体搭配、布局多样性 |
| **3. Build** | Generate `slides.html` + `slides.css` + `slides.js` | 生成三件套 HTML/CSS/JS |
| **4. Video** | Playwright screenshots → TTS audio → FFmpeg merge | 截图 → 配音 → 合成视频 |

---

## Quick Start / 快速开始

### As an AI Coding Skill (OpenCode / Claude)

This repo is designed as an [OpenCode skill](https://github.com/includewudi). Point your skill config at this directory:

```yaml
# In your opencode skills config
skills:
  web-ppt: /path/to/web-ppt/SKILL.md
```

Then ask your AI: *"帮我做一个 10 页的产品介绍 PPT"* and it follows the 4-stage pipeline.

### Standalone Scripts / 独立使用脚本

```bash
# Preview slides locally
python3 -m http.server 8080 --directory ./my-presentation
open http://localhost:8080/slides.html

# Quality check — Anti-AI-Slop + WCAG contrast + font sizes
python3 scripts/slide_lint.py --html slides.html --css slides.css

# Full 4-pass validation (structure, typography, contrast, layout diversity)
python3 scripts/slide_validator.py --html slides.html --css slides.css

# Auto-fix font sizes and contrast issues
python3 scripts/slide_fixer.py --html slides.html --css slides.css \
  --errors "E_FONT_SIZE_UNDERFLOW,E_CONTRAST_LOW"

# Capture screenshots (1920×1080, auto-hides record panel)
python3 ppt-video/scripts/capture.py \
  --url http://localhost:8080/slides.html --output-dir ./frames

# Batch TTS voiceover
python3 ppt-video/scripts/tts.py \
  --voice zh-CN-YunxiNeural \
  --texts '["Welcome to our product", "Let me show you how it works"]' \
  --output-dir ./voiceover

# Audio-First video rendering
python3 ppt-video/scripts/render.py --dir ./my-presentation
```

---

## Project Structure / 项目结构

```
web-ppt/
├── SKILL.md                  # Main entry — decision tree + core rules
│
├── scripts/                  # QA automation
│   ├── slide_lint.py         # Anti-AI-Slop + WCAG contrast lint
│   ├── slide_validator.py    # 4-pass quality validator
│   └── slide_fixer.py        # Auto-fix (fonts, contrast)
│
├── ppt-plan/                 # Content planning
├── ppt-design/               # Visual design
├── ppt-build/                # Code generation
├── ppt-video/                # Video recording
│   └── scripts/
│       ├── capture.py        # Playwright screenshots
│       ├── tts.py            # Edge TTS batch generation
│       └── render.py         # Audio-First video rendering
│
└── references/               # Shared assets
    ├── layouts.md            # Layout code library (Hero/Split/Grid/Timeline…)
    ├── animations.md         # Animation library + Effect-to-Feeling map
    ├── themes.md             # 9 verified theme palettes
    ├── fonts/                # 24 curated woff2 font files
    └── ...
```

---

## Design Philosophy / 设计哲学

### Anti-AI-Slop Rules / 反 AI 刻板印象规则

| ❌ Never | ✅ Instead |
|----------|-----------|
| Inter, Roboto fonts | Archivo Black, Syne, Manrope |
| `#6366f1` blue-purple gradient | Content-driven color palette |
| Pure white/black background | Gradient + radial-gradient layers |
| All-center aligned pages | ≥3 layout types alternating |
| Title + bullet list on every page | Hero, Split, Grid, Quote variety |

### Font Size Minimums / 字体大小下限

| Element | Minimum | Typical |
|---------|---------|---------|
| Cover title (h1) | `2.5rem` | 2.5–5.5rem |
| Slide title (h2) | `1.8rem` | 1.8–3.5rem |
| Section label | `1.2rem` | 1.2–1.6rem |
| Card title | `1.15rem` | 1.15–1.5rem |
| Body text | `1rem` | 1.0–1.2rem |

### Audio-First Video / 音频优先视频

Never use fixed 4s-per-slide timing. The correct flow:

1. Generate TTS audio for each slide
2. Read actual duration with `ffprobe`
3. Each slide's video stay = audio duration + 1s buffer
4. ASS subtitle timeline based on audio offsets
5. FFmpeg xfade + audio merge → `final.mp4`

---

## Requirements / 依赖

- **Python** ≥ 3.11 (for validation/video scripts)
- **FFmpeg** — video merging and rendering
- **Playwright** — slide screenshot capture (`pip install playwright && playwright install`)
- **Edge TTS** — local TTS engine (`pip install edge-tts`)
- **CosyVoice 3.0** (optional) — GPU-based voice cloning

No npm, no bundler, no build step. Just HTML + CSS + JS.

---

## Output Example / 输出示例

```
my-presentation/
├── slides.html            # HTML structure + data-narration
├── slides.css             # All styles
├── slides.js              # Navigation, TTS, subtitles, recording
├── fonts/                 # Local woff2 fonts
├── frames/                # Screenshots (slide_00.png …)
├── voiceover/             # TTS audio (slide_00.mp3 … + full_audio.mp3)
├── subtitle_synced.ass    # Audio-synced subtitles
└── final.mp4              # Final video (audio + video + subtitles)
```

---

## License

MIT
