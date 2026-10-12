#BRANCH:main
# SlideSmith

> **Multi-agent AI presentation platform.** Two generation modes: a low-latency SSE streaming pipeline and a 21-agent collaborative DAG for maximum quality. Exports to PDF and PowerPoint.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Generation Modes](#generation-modes)
  - [Mode 1 — SSE Streaming Pipeline](#mode-1--sse-streaming-pipeline)
  - [Mode 2 — 21-Agent DAG Pipeline](#mode-2--21-agent-dag-pipeline)
- [Agent Roster & Model Assignments](#agent-roster--model-assignments)
- [Model Routing System](#model-routing-system)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Live Widgets](#live-widgets)
- [Export Pipeline](#export-pipeline)
- [Performance Characteristics](#performance-characteristics)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (React 19)                       │
│  DeckGenerator.tsx  ──►  SSE client  ──►  SlideCanvas.tsx       │
│                     ──►  fetch POST  ──►  SlideView.tsx          │
└──────────────────────────────┬──────────────────────────────────┘
                               │  HTTP
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js 15 App Router                       │
│                                                                  │
│  /api/generate-deck          SSE streaming pipeline             │
│  /api/multi-model-generate   21-agent DAG orchestrator          │
│  /api/regenerate-slide       Per-slide rewrite                  │
│  /api/repurpose              Deck → social/blog/email           │
│  /api/export/pdf             PDFKit renderer                    │
│  /api/export/pptx            PptxGenJS renderer                 │
│  /api/live-proxy             WebSocket proxy for live widgets   │
│  /api/process-pdf            PDF ingestion + text extraction    │
└──────────┬────────────────────────────────┬────────────────────┘
           │                                │
           ▼                                ▼
┌──────────────────────┐        ┌──────────────────────────────┐
│   deck-generator.ts  │        │  MultiModelOrchestrator      │
│   (SSE pipeline)     │        │  (21-agent DAG)              │
└──────────┬───────────┘        └──────────────┬───────────────┘
           │                                   │
           ▼                                   ▼
┌──────────────────────────────────────────────────────────────┐
│                      ModelRouter                              │
│  selectModel(agentType, context, policy)                     │
│                                                              │
│  Groq  ──► llama-3.3-70b / llama-3.1-8b  (cloud, free)     │
│  Ollama ──► phi4:latest / gemma3:4b       (local, $0)       │
└──────────────────────────────────────────────────────────────┘
```

---

## Generation Modes

### Mode 1 — SSE Streaming Pipeline

**Entry point:** `POST /api/generate-deck` → `src/lib/deck-generator.ts`

Each slide is streamed to the client as soon as it completes. The client receives three SSE event types:

```
event: outline   → { titles: string[] }
event: slide     → { index: number, slide: Slide }
event: done      → { deck: Deck }
```

**Internal flow:**

```
generateOutline()
    │  Llama 3.3 70B (or phi4 local)
    │  Prompt: topic, slide_count, audience, tone
    │  Output: { title, sections[{ name, slides[{ title, layout, section }] }] }
    │
    │  assignPremiumLayouts() ← deterministic post-process
    │     slide[0]  → "title"
    │     slide[-1] → "center_focus"
    │     section[0] (non-first) → "section_divider"
    │     remaining → rotation: split, grid_cards, data_insight,
    │                            comparison, timeline, title_bullets
    │
    ▼
generateSlides()  [parallel per section]
    │  Llama 3.1 8B (or gemma3:4b local)
    │  Per slide: layout, title, bullets, paragraph, stat blocks,
    │             speaker notes, chartSpec, imagePrompt
    │
    ▼
  SSE stream: each slide event emitted as it resolves
```

**Premium layout rotation (deterministic):**

```
Index  0        → title
Index  N-1      → center_focus
Section starts  → section_divider
Remaining slots → [split, grid_cards, data_insight, split,
                   comparison, timeline, title_bullets, split,
                   grid_cards, title_bullets]  (cycled)
```

---

### Mode 2 — 21-Agent DAG Pipeline

**Entry point:** `POST /api/multi-model-generate` → `src/lib/multi-model/orchestrator.ts`

The orchestrator executes a dependency-resolved DAG across 9 steps. Steps 1–2b are serial (each feeds the next). Step 3 fans out to all sections in parallel, with per-section agents starting immediately when their section's slides are ready (streaming within the step). Step 4 is a parallel cross-deck QA fan-out. Steps 5–9 are serial.

```
Step 1   researcher             ────────────────────────────────────►
Step 2   structurer             ◄── snippets ────────────────────────►
Step 2b  slide-layout-planner   ◄── outline ────────────────────────►
                                                                      │
Step 3   [per section, all parallel] ◄────────────────────────────── ┘
         ├── slidewriter
         ├── copy-tightener        ◄── slides ready (streaming)
         ├── readability-analyzer  ◄── slides ready (streaming)
         ├── media-finder          ◄── slides ready (streaming)
         └── data-viz-planner      ◄── slides ready (streaming)
                                                                      │
Step 3b  image-generation-dispatcher ◄── mediaEnhancements ──────── ┘
         └── Pollinations.ai (free, no key)
                                                                      │
Step 4   [cross-deck QA, all parallel] ◄───────────────────────────  ┘
         ├── fact-checker
         ├── accessibility-linter
         ├── deduplication-agent
         └── narrative-arc-auditor
                                                                      │
Step 5   speaker-notes-generator ◄── full slide list ─────────────── ┘
Step 6   assembleDeck()
Step 7   executive-summary       (gated: audience=executive OR flag)
Step 8   audience-adapter        (gated: targetAudience specified)
Step 9   content-repurposer      (optional, via /api/repurpose)
```

**Quality scores emitted per pipeline run:**

| Dimension | Source agents |
|---|---|
| `factCheck` | fact-checker |
| `accessibility` | accessibility-linter |
| `readability` | readability-analyzer (avg across sections) |
| `consistency` | copy-tightener (avg across sections) |
| `narrative` | narrative-arc-auditor |
| `coherence` | deduplication-agent |

---

## Agent Roster & Model Assignments

21 agents, each an extension of `BaseAgent` (abstract class in `src/lib/multi-model/base-agent.ts`).

| # | Agent | Default model (balanced) | Pipeline step |
|---|---|---|---|
| 1 | `live-researcher` | `groq-llama-3.3-70b` → Brave → Tavily → LLM fallback | Step 1 |
| 2 | `researcher` | `groq-llama-3.3-70b` / `phi4` | Step 1 (legacy fallback) |
| 3 | `structurer` | `groq-llama-3.3-70b` / `phi4` | Step 2 |
| 4 | `slide-layout-planner` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 2b |
| 5 | `slidewriter` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 3 |
| 6 | `copy-tightener` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 3 |
| 7 | `readability-analyzer` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 3 |
| 8 | `media-finder` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 3 |
| 9 | `data-viz-planner` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 3 |
| 10 | `chart-data-fetcher` | `groq-llama-3.3-70b` / `phi4` | Step 3 |
| 11 | `image-generation-dispatcher` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 3b |
| 12 | `fact-checker` | `groq-llama-3.3-70b` / `phi4` | Step 4 |
| 13 | `accessibility-linter` | `groq-llama-3.3-70b` / `phi4` | Step 4 |
| 14 | `deduplication-agent` | `groq-llama-3.3-70b` / `phi4` | Step 4 |
| 15 | `narrative-arc-auditor` | `groq-llama-3.3-70b` / `phi4` | Step 4 |
| 16 | `speaker-notes-generator` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 5 |
| 17 | `executive-summary` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 7 |
| 18 | `audience-adapter` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 8 |
| 19 | `live-widget-planner` | `groq-llama-3.1-8b` / `gemma3:4b` | Enhancement |
| 20 | `content-repurposer` | `groq-llama-3.1-8b` / `gemma3:4b` | Step 9 |
| 21 | `slide-regenerator` | `groq-llama-3.3-70b` / `phi4` | On-demand |

**BaseAgent contract:**

```typescript
abstract class BaseAgent {
  abstract execute(input: unknown, context?: unknown): Promise<unknown>;
  protected callLLM(prompt: string, options?: Record<string, unknown>): Promise<{ content: string; usage?: unknown }>;
  protected retry<T>(operation: () => Promise<T>, maxRetries?: number): Promise<T>;
  protected validateInput(input: unknown, schema: unknown): boolean;
  protected handleError(error: unknown): never;
}
```

Retry policy: exponential backoff with `delay = 2^attempt * 1000ms`. 429 responses respect `Retry-After` header; fallback is `2^(attempt+1) * 5000ms` (10s / 20s / 40s).

---

## Model Routing System

**Class:** `ModelRouter` (`src/lib/multi-model/router.ts`)

```
selectModel(agentType, context, policyName)
    │
    ├── 1. Try getModelForAgent(agentType, policy) from ollama-config.ts
    │       └── returns ModelConfig from BALANCED_POLICY / QUALITY_POLICY / SPEED_POLICY
    │
    ├── 2. If Ollama config fails: look up routing rule in policy.rules[]
    │
    └── 3. Fallback: selectModelByCapability(agentType, context)
            └── Scores each model by context.priority:
                  quality  → max(qualityScore)     where high=1.0, medium=0.6, low=0.3
                  speed    → max(speedScore)        where fast=1.0, medium=0.6, slow=0.3
                  cost     → min(costPerToken)
                  balanced → weighted composite:
                               quality × 0.40
                             + speed   × 0.30
                             + (1 - costPerToken×1000) × 0.30
```

**Available models:**

| Model ID | Provider | Context | Speed | Quality | Cost/tok |
|---|---|---|---|---|---|
| `phi4` | Ollama (local) | 8 000 tok | medium | high | $0.000 |
| `gemma3-4b` | Ollama (local) | 4 000 tok | fast | medium | $0.000 |
| `groq-llama-3.3-70b` | Groq | 8 000 tok | fast | high | $0.000 (free) |
| `groq-llama-3.1-8b` | Groq | 4 000 tok | fast | medium | $0.000 (free) |
| `gpt-4-turbo-fallback` | OpenAI | 8 000 tok | medium | high | $0.030/1K |
| `gpt-3.5-turbo-fallback` | OpenAI | 4 000 tok | fast | medium | $0.002/1K |

**Policy matrix (balanced — default):**

```
Reasoning-heavy agents           → groq-llama-3.3-70b  (or phi4 if no Groq key)
  researcher, structurer, fact-checker,
  deduplication, narrative-arc-auditor

Content / tool agents            → groq-llama-3.1-8b   (or gemma3:4b if no Groq key)
  slidewriter, copy-tightener, speaker-notes-generator,
  executive-summary, audience-adapter, data-viz-planner,
  media-finder, live-widget-planner, readability-analyzer,
  slide-layout-planner, accessibility-linter,
  image-generation-dispatcher
```

**isModelAvailable guard:**
- `context.localOnly = true` → rejects any `provider !== 'local'`
- Any non-local model without a populated `apiKey` → rejected

**Task lifecycle:**

```
pending → running → completed
                 ↘ failed → retry (exponential backoff, max 3)
                         ↘ failed (max exceeded) → throw
```

Task ID format: `task-{Date.now()}-{9-char base36}`

---

## Data Model

All types are derived via Zod v4 (`src/lib/schema.ts`). The parse result is the runtime type — no separate interface needed.

### Deck

```typescript
Deck {
  id:       string
  title:    string
  subtitle? string
  theme?:   "DeepSpace" | "Ultraviolet" | "Minimal" | "Corporate"
           | "NeonGrid" | "Academic" | "Conference" | "Journal"
           | "Thesis"   | "Beamer"
  slides:   Slide[]
  metadata: { createdAt, updatedAt, version, author? }
}
```

### Slide

```typescript
Slide {
  id:       string
  layout:   "title" | "title+bullets" | "two-col" | "media-left"
           | "media-right" | "quote" | "chart" | "end"
  animation?: "fadeIn" | "slideInFromTop" | "slideInFromBottom" | "hero"
  blocks:   SlideBlock[]
  notes:    string
}
```

### SlideBlock (discriminated union)

| `type` | Key fields | Animation options |
|---|---|---|
| `Heading` | `text` (max 100) | `fadeIn`, `slideInFromTop`, `bounceIn`, `scaleIn` |
| `Subheading` | `text` (max 200) | `fadeIn`, `slideInFromBottom`, `slideInFromLeft` |
| `Markdown` | `md` | `fadeIn`, `slideInFromLeft`, `slideInFromRight` |
| `Bullets` | `items[]` (max 8) | `staggerIn`, `slideInFromLeft`, `fadeIn` |
| `Image` | `src`, `alt`, `caption?` | `scaleIn`, `fadeIn`, `slideInFromLeft`, `slideInFromRight` |
| `Quote` | `text`, `author?` | `fadeIn`, `slideInFromBottom`, `scaleIn` |
| `Code` | `code`, `language?` | `slideInFromLeft`, `fadeIn` |
| `Chart` | `chartType`, `title?`, `data` | `scaleIn`, `slideInFromBottom`, `fadeIn` |
| `Live` | `widget` (LiveWidget) | `pulse`, `fadeIn` |

**Chart types:** `bar`, `line`, `pie`, `doughnut`, `radar`

**ChartData schema:**

```typescript
{
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
    borderWidth?: number
  }>
}
```

---

## Live Widgets

Live blocks (`type: "Live"`) embed real-time data widgets into slides. The widget field is a discriminated union:

| `kind` | Description | Key params |
|---|---|---|
| `LiveChart` | Polls an API endpoint and renders a live chart | `apiUrl`, `xKey`, `yKey`, `refreshMs` (min 1000) |
| `Ticker` | Live price/data ticker strip | `symbols[]`, `refreshMs` (min 1000) |
| `Countdown` | Live countdown to a target time | `targetIso` (ISO 8601) |
| `Map` | Embedded map at lat/lng | `lat` (−90→90), `lng` (−180→180), `zoom?` (1→20) |
| `Iframe` | Sandboxed iframe embed | `src`, `height?` (100→2000px) |

Live widget data is proxied server-side through `/api/live-proxy` to avoid CORS and to keep credentials off the client.

---

## API Reference

### SSE Generation

```
POST /api/generate-deck
Content-Type: application/json
```

```json
{
  "mode": "quick_prompt",
  "topic_or_prompt": "string (required)",
  "tone": "professional | casual | academic | persuasive",
  "audience": "string",
  "slide_count": 10,
  "theme": "DeepSpace | Ultraviolet | Minimal | Corporate | NeonGrid | Academic | Conference | Journal | Thesis | Beamer",
  "text_density": "low | medium | high",
  "content_format": "bullets | paragraph | mixed"
}
```

Response: `text/event-stream`

```
event: outline
data: {"titles":["Introduction","Market Overview",...]}

event: slide
data: {"index":0,"slide":{...Slide}}

event: done
data: {"deck":{...Deck}}
```

---

### 21-Agent Generation

```
POST /api/multi-model-generate
Content-Type: application/json
```

```json
{
  "topic": "string (required)",
  "tone": "string",
  "audience": "string",
  "desiredSlideCount": 12,
  "theme": "string",
  "duration": 30,
  "sources": ["string"],
  "urls": ["string"],
  "enableLive": false,
  "generateExecutiveSummary": false,
  "targetAudience": "string",
  "targetTone": "string",
  "policy": "quality | speed | balanced | local-only"
}
```

Response:

```json
{
  "deck": { "...Deck": "..." },
  "metadata": {
    "totalTokens": 14200,
    "totalCost": 0.00,
    "processingTime": 142000,
    "qualityScores": {
      "factCheck": 0.91,
      "accessibility": 0.88,
      "readability": 0.84,
      "consistency": 0.93,
      "narrative": 0.87,
      "coherence": 0.90
    }
  },
  "executiveSummary": "ExecutiveSummaryOutput | undefined",
  "audienceAdaptation": "AudienceAdapterOutput | undefined",
  "qualityChecks": ["...QualityCheck[]"],
  "speakerNotes": "SpeakerNotesOutput | undefined",
  "layoutPlan": "SlideLayoutPlannerOutput | undefined"
}
```

---

### Per-Slide Regeneration

Rewrites one slide in-place without re-running the full DAG. Uses `slide-regenerator` agent (high-quality model).

```
POST /api/regenerate-slide
Content-Type: application/json
```

```json
{
  "deck": { "...Deck": "..." },
  "slideIndex": 3,
  "feedback": "too dense, needs a chart instead",
  "content_format": "mixed"
}
```

Response:

```json
{
  "deck": { "...Deck (with target slide replaced)": "..." },
  "regeneratedSlide": { "...Slide": "..." },
  "slideIndex": 3
}
```

---

### Content Repurposing

```
POST /api/repurpose
Content-Type: application/json
```

```json
{
  "deck": { "...Deck": "..." },
  "formats": ["linkedin", "twitter_thread", "blog", "email"],
  "tone": "professional"
}
```

Response:

```json
{
  "linkedin": "150–300 word post, ≤3 hashtags",
  "twitter_thread": ["1/ hook", "2/ ...", "...7–10 tweets, ≤280 chars each"],
  "blog": "# Title\n\n600–900 words, Markdown, H2s match slide titles",
  "email": "Subject: ...\n\n200-word body + CTA"
}
```

---

### PDF Ingestion

```
POST /api/process-pdf
Content-Type: multipart/form-data

file: <PDF binary>
```

Extracts text via `pdfjs-dist`, optionally renders page thumbnails via `pdf2pic`. The extracted text is passed as `doc_summary_or_empty` in subsequent generation requests.

---

### Export

```
POST /api/export/pdf    Body: { "deck": { ...Deck } }  → application/pdf
POST /api/export/pptx   Body: { "deck": { ...Deck } }  → .pptx blob
```

---

## Export Pipeline

```
Deck (JSON)
    │
    ├── /api/export/pdf
    │     PDFKit 0.17
    │     └── per slide:
    │           background fill (theme hex)
    │           title text (Helvetica Bold, 28pt)
    │           body blocks (bullets, paragraphs)
    │           chart → canvas rasterized
    │     → landscape A4 (841.89 × 595.28 pt)
    │
    └── /api/export/pptx
          PptxGenJS 4
          └── per slide:
                background color (theme hex)
                title shape (Calibri 32pt)
                text shapes (bullets, paragraphs)
                chart objects (bar/line/pie/doughnut/radar — native PPTX XML)
                image shapes (URLs → embedded)
                speaker notes (notes slide)
          → .pptx (Office Open XML)
```

---

## Performance Characteristics

**SSE Streaming Pipeline (10 slides, Groq free tier):**

```
 0s ──────── 3–5s ──────── 8–12s ──────────────────── 60–120s
 │           │             │                           │
 request     outline       first slide visible         done event
             received      (SSE stream starts)
```

**21-Agent DAG Pipeline (12 slides, balanced policy, Groq):**

```
 Timeline (seconds)
 ├──  0 –  25s   Step 1:   Research
 ├── 25 –  50s   Step 2:   Structure + Layout Planning (serial)
 ├── 50 – 140s   Step 3:   Parallel section generation
 │               └── N sections × (slidewriter + 4 agents), all parallel
 ├──140 – 165s   Step 3b:  Image generation (Pollinations.ai)
 ├──165 – 190s   Step 4:   Cross-deck QA (4 agents, parallel)
 ├──190 – 202s   Step 5:   Speaker Notes
 ├──202 – 205s   Step 6:   Assembly
 └──205 – 215s   Steps 7–8: Exec Summary / Audience Adaptation (gated)

 Total: ~2–3 min (Groq) | ~4–6 min (Ollama, Apple M1 Pro 16 GB)
```

**Parallelism:** Step 3 spawns `Promise.all(sections.map(...))`. Within each section, `Promise.all([copyTightener, readabilityAnalyzer, mediaFinder, dataVizPlanner])` fires as soon as `slidewriter` resolves. Net: up to `N_sections × 5` concurrent LLM calls during Step 3.

**Ollama throughput on Apple Silicon (approximate):**

| Model | Throughput | Acceleration |
|---|---|---|
| phi4:14B | ~15–25 tok/s | Metal GPU |
| gemma3:4b | ~40–70 tok/s | Metal GPU |

---

## Configuration

### Environment Variables

```env
# Required for Groq (cloud inference — free tier, no credit card)
GROQ_API_KEY=gsk_...           # console.groq.com

# Optional: real web search for live-researcher + chart-data-fetcher
# Both agents fall back to LLM-simulated data when absent
BRAVE_API_KEY=BSA...           # api.search.brave.com
TAVILY_API_KEY=tvly-...        # app.tavily.com

# Optional: route all inference to any OpenAI-compatible provider
LLM_PROVIDER=ollama
LLM_BASE_URL=http://localhost:11434
LLM_MODEL=gemma3:4b

# Auth (next-auth)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

When `GROQ_API_KEY` is absent, all Groq model references resolve to their Ollama equivalents: `phi4` for high-quality agents, `gemma3:4b` for fast agents. Ollama must be running at `http://localhost:11434`.

### Themes

| Key | Background | Accent | Style |
|---|---|---|---|
| `DeepSpace` | `#0d1117` | `#58a6ff` | Dark charcoal, cyan accents |
| `Ultraviolet` | `#1a0a2e` | `#b48eff` | Deep purple, electric violet |
| `Minimal` | `#ffffff` | `#000000` | White, black ink |
| `Corporate` | `#1e2d3d` | `#4da6ff` | Slate blue, professional |
| `NeonGrid` | `#0a0a0f` | `#00ff88` | Black, neon green grid |
| `Academic` | `#1c2030` | `#d4af37` | Dark navy, gold |
| `Conference` | `#1a2535` | `#60a5fa` | Navy, sky blue |
| `Journal` | `#f8f5f0` | `#8b0000` | Cream, dark red |
| `Thesis` | `#f0f0f0` | `#2c3e50` | Light grey, dark slate |
| `Beamer` | `#003366` | `#ffffff` | LaTeX-inspired navy/white |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── ai-slides/                # AI slide generation (legacy endpoint)
│   │   ├── generate/                 # Rich slide generator
│   │   ├── generate-deck/            # SSE streaming endpoint
│   │   ├── generate-rich-slides/     # Enhanced slide generation
│   │   ├── multi-model-generate/     # 21-agent DAG endpoint
│   │   ├── regenerate-slide/         # Per-slide rewrite
│   │   ├── repurpose/                # Deck → social/blog/email
│   │   ├── live-proxy/               # WebSocket proxy for live widgets
│   │   ├── process-pdf/              # PDF ingestion + text extraction
│   │   └── export/
│   │       ├── pdf/                  # PDFKit renderer
│   │       └── pptx/                 # PptxGenJS renderer
│   ├── studio-new/                   # Main studio UI (page.tsx)
│   └── page.tsx                      # Root redirect
│
├── components/
│   ├── DeckGenerator.tsx             # Prompt form + settings panel
│   ├── SlideCanvas.tsx               # Slide renderer (blocks → DOM)
│   ├── SlideView.tsx                 # Navigator + presentation mode
│   └── blocks/                       # Block-level render primitives
│
└── lib/
    ├── deck-generator.ts             # SSE pipeline: outline + per-slide gen
    ├── schema.ts                     # Zod v4 schemas + inferred types
    ├── theming.ts                    # 10 built-in themes
    ├── llm.ts                        # LLM client factory
    └── multi-model/
        ├── orchestrator.ts           # DAG engine (9 steps)
        ├── base-agent.ts             # Abstract agent + retry logic
        ├── router.ts                 # ModelRouter (policy + capability fallback)
        ├── ollama-config.ts          # Model definitions + routing policy tables
        ├── schemas.ts                # Zod I/O contracts per agent
        ├── standalone-model.ts       # Bootstrap for standalone agent use
        └── agents/                   # 21 agent implementations
            ├── live-researcher.ts
            ├── researcher.ts
            ├── structurer.ts
            ├── slide-layout-planner.ts
            ├── slidewriter.ts
            ├── copy-tightener.ts
            ├── readability-analyzer.ts
            ├── media-finder.ts
            ├── data-viz-planner.ts
            ├── chart-data-fetcher.ts
            ├── image-generation-dispatcher.ts
            ├── fact-checker.ts
            ├── accessibility-linter.ts
            ├── deduplication-agent.ts
            ├── narrative-arc-auditor.ts
            ├── speaker-notes-generator.ts
            ├── executive-summary.ts
            ├── audience-adapter.ts
            ├── live-widget-planner.ts
            ├── content-repurposer.ts
            └── slide-regenerator.ts
```

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js | 15.5.4 |
| Runtime | React | 19.1.0 |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | 4.x |
| Animation | Framer Motion | 12.x |
| Charts (UI) | Recharts | 3.x |
| Drag & Drop | @dnd-kit | 6/10 |
| Forms | react-hook-form + @hookform/resolvers | 7.x / 5.x |
| Schema validation | Zod | 4.x |
| Server state | @tanstack/react-query | 5.x |
| Local persistence | idb-keyval (IndexedDB) | 6.x |
| PDF export | PDFKit | 0.17 |
| PPTX export | PptxGenJS | 4.x |
| PDF ingestion | pdfjs-dist + pdf2pic | 5.x / 3.x |
| Browser testing | Playwright | 1.55 |
| Auth | next-auth | 4.x |
| Notifications | Sonner | 2.x |
| Icons | Lucide React | 0.544 |
| Build | Turbopack (Next.js) | bundled |
| LLM inference (cloud) | Groq (llama-3.3-70b, llama-3.1-8b) | free tier |
| LLM inference (local) | Ollama (phi4:14B, gemma3:4b) | self-hosted |
| Images | Pollinations.ai | free, no key required |

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/aryankumawat/SlideSmith-Multi-Agent-AI-Slide-Maker-.git
cd SlideSmith-Multi-Agent-AI-Slide-Maker-
npm install

# 2. Configure
cp .env.local.example .env.local
# Add your free Groq key: GROQ_API_KEY=gsk_...
# Get one at console.groq.com — no credit card required

# 3. (Optional) Pull Ollama models for fully local inference
ollama pull phi4
ollama pull gemma3:4b

# 4. Start
npm run dev
# → http://localhost:3000/studio-new
```

**Other commands:**

```bash
npm run build        # Production build (Turbopack)
npm run type-check   # tsc --noEmit
npm run lint         # ESLint
npm run lint:fix     # ESLint --fix
npm run clean        # rm -rf .next out
```

---

## License

MIT
