#BRANCH:main
# ppt-creator-skills

**[中文](#中文)** · **[English](#english)**

兩個 Claude skill：**`ppt-creator-skill`**（凌亂文件 → 設計感簡報）與 **`chart-integrity`**（圖表與統計值驗算，可獨立使用）。

---

## 中文

把凌亂的文件（會議逐字稿、多場會議混檔、實驗／數據報告、論文、財報）變成**可直接上台的設計感簡報**。

它跟一般「一鍵生成簡報」工具不同——它**一層一層地**把內容想清楚、把數據驗算對，最後才交給視覺生產：

0. **配置** — 只問 3 件事（給誰看、演講型還是閱讀型、有沒有品牌資產），其餘全給預設。想完整設定就說「我要完整設定」；趕時間就說「我趕時間」走快速通道。
1. **提煉＋清點** — 回報文件範圍、每個區塊標記去向、**把敏感資料攔進備援區**，然後**停下來等你確認**；若你帶著自己的大綱來，切換為**診斷模式**：找漏洞、查邏輯、不直接生產。
2. **模板選擇** — 根據你的內容與場合，從 **34 種風格模板庫**篩出 3–5 個候選，⛔ 等你挑選後再進配色。
3. **風格規格** — 把「有設計感」翻成具體色碼、字體、版型；套入選定模板；若有品牌資產則先擷取品牌色；並依**設計品味準則**（設計判讀＋三旋鈕＋字體／配色紀律）節制每個設計決策。
4. **生成** — 單一 HTML、對應 Canvas 格式（16:9 / 4:3 / 9:16 / A4）、不准加料；可選 **Morph Transition**（Keynote Magic Move 式轉場，零依賴 FLIP 實作，說「我要 Magic Move 效果」即可）。
5. **圖表驗算** — 交給 `chart-integrity` skill：所有圖用原始數據實際計算，**畫圖前先重算文件聲稱的統計值**，抓出原文錯誤，標註待核。
6. **視覺驗收** — 預期 vs 實際、截圖逐頁核對、只改指定頁；並加掃 **AI 味禁用清單**（破折號、章節編號眉標、裝飾圓點、假精確數字…）。
7. **複盤封裝** — 把整套流程存成 `deck-sop-*.md`，下次說「接上次」把它給我就能續跑。

設計哲學：**AI 量產，人把關**；也可以**人做判斷，AI 找問題**。不要外包大腦給 AI——你整理大綱、AI 診斷缺口，比讓 AI 猜你要說什麼有效得多。三個裁決權永遠在人：備援區去留、模板選擇、圖表數字不一致。

### 另一個 skill：`chart-integrity`

**可以單獨用，不必做簡報。** 丟一份報告、論文或試算表說「幫我驗算這張圖的數字」「這份報告的 R² 對嗎」，它會：

- 用原始數據重算文件聲稱的每一個統計值（斜率、R²、CAGR、平均、誤差、百分比變化…）
- 對照一份 **必重算清單**（迴歸／成長率／分佈／誤差傳遞／加總比例／圖表誠信六大類）逐項檢查
- 不一致的**如實標註待核**，不擅自改數字、不捏造誤差、不指控原作者
- 重大差異 ⛔ 停下來交給你裁決

紀律來自一次真實的跨平台驗證，三個具體崩壞案例記在 `chart-integrity/references/failure-cases.md`。

### 安裝

兩個 skill 一起裝。**重複執行任一方法 = 更新**。

**方法 A — 終端一步安裝（最快，不需要 Git）**

```bash
curl -L https://github.com/Yu-0312/ppt-creator-skills/archive/refs/heads/main.zip -o /tmp/ppt-creator-skills.zip \
  && rm -rf /tmp/ppt-creator-skills-main \
  && unzip -q -o /tmp/ppt-creator-skills.zip -d /tmp \
  && mkdir -p ~/.claude/skills \
  && rm -rf ~/.claude/skills/ppt-creator-skill ~/.claude/skills/chart-integrity \
  && cp -R /tmp/ppt-creator-skills-main/ppt-creator-skill /tmp/ppt-creator-skills-main/chart-integrity ~/.claude/skills/ \
  && cp /tmp/ppt-creator-skills-main/LICENSE /tmp/ppt-creator-skills-main/CREDITS.md ~/.claude/skills/ppt-creator-skill/ \
  && rm -rf /tmp/ppt-creator-skills.zip /tmp/ppt-creator-skills-main \
  && echo "✅ 安裝完成（ppt-creator-skill + chart-integrity）"
```

> ⚠️ 舊版 README 用的是 `mv 來源 ~/.claude/skills/技能名`。`mv` 在目標目錄已存在時**不會覆蓋**，而是把來源搬進去變成 `技能名/來源名/SKILL.md`，Claude 就掃不到了。上面的指令用 `rm -rf` 先清舊版再 `cp -R`，重跑幾次都安全。

**方法 B — 下載 ZIP 後跑安裝腳本**

**👉 [點這裡下載最新版 ZIP](https://github.com/Yu-0312/ppt-creator-skills/archive/refs/heads/main.zip)**

```bash
unzip -o ~/Downloads/ppt-creator-skills-main.zip -d ~/Downloads \
  && bash ~/Downloads/ppt-creator-skills-main/install.sh
```

**方法 C — Git Clone（想追蹤更新）**

```bash
git clone https://github.com/Yu-0312/ppt-creator-skills.git ~/ppt-creator-skills \
  && bash ~/ppt-creator-skills/install.sh
```

> 日後更新：`cd ~/ppt-creator-skills && git pull && bash install.sh`

**確認安裝**

```bash
ls ~/.claude/skills/ppt-creator-skill/SKILL.md ~/.claude/skills/chart-integrity/SKILL.md
```

兩個路徑都存在就對了（若看到 `ppt-creator-skill/ppt-creator-skills-main/SKILL.md` 這種多一層的結構，就是踩到上面那個 `mv` 問題，砍掉重裝即可）。重新啟動 Claude Desktop，丟入任意文件說「幫我做成簡報」。

### 在其他 AI 使用（ChatGPT／Claude.ai 網頁版／Gemini 等）

這套 skill 的本體，就是 `SKILL.md` 的工作流程 ＋ `references/` 的紀律規則 ＋ `bold-template-pack/` 的模板規格。除了 Claude Code／Desktop 會**依描述自動觸發**外，任何 AI 只要能「讀到這些檔案 ＋ 照著 `SKILL.md` 跑」就能用。差別只在**怎麼把檔案餵進去**，以及**哪些步驟能原汁原味執行**。

**先解決一個共同問題：檔案數量。** 本 repo 有 2 個 `SKILL.md` ＋ 7 個 references ＋ 約 34 個模板檔，總數超過多數平台的知識庫上限。所以在 Claude.ai 以外的平台，建議先**打包精簡**：把 `SKILL.md` 和 references 合併成一份，模板只放你這次真正要用的那 1–2 個。

#### 1. Claude.ai 網頁版／App（最接近原生，推薦）

1. **Settings → Capabilities**，開啟 **Code execution and file creation**（Skills 依賴程式執行，關掉就無法使用）。
2. 把 `ppt-creator-skill` 資料夾壓成 **.zip**（注意：zip 內要包含**資料夾本身**、`SKILL.md` 在資料夾裡，不能只壓一個 `SKILL.md`）。`chart-integrity` 同理，分開上傳。
3. **Customize → Skills → 上傳** 你的 .zip。
4. 之後在對話裡丟入文件說「幫我做成簡報」，Claude 會自動載入。

- 適用方案：Free／Pro／Max／Team／Enterprise（組織統一佈署需 Team／Enterprise）。
- 保真度：**高**——可跑圖表驗算、產出 HTML artifact。唯一較弱的是 Step 6 逐頁截圖比對，改為人眼看 artifact 預覽。

#### 2. ChatGPT（Custom GPT 或 Projects）

ChatGPT 沒有 skill 機制，用「知識庫 ＋ 指令」模擬：

- **做法 A — Custom GPT（可分享、較穩定，需 Plus 以上）**：建立 GPT → **Configure → Knowledge** 上傳檔案（最多 20 個、單檔 512MB）→ 把 `SKILL.md` 全文貼進 **Instructions**，並加一句「嚴格照這份工作流程執行，需要時查閱知識庫檔案」。
- **做法 B — Projects（免費也能用）**：建立 Project → **Sources → Add Sources** 上傳檔案（Free 5 個、Plus/Go 25、Pro 40）→ 在 Project 的 **custom instructions** 貼上 `SKILL.md`。
- Step 5 圖表驗算交給 **Code Interpreter（進階資料分析）**；輸出的 HTML 用 Canvas 或直接複製程式碼存檔、用瀏覽器開。
- 限制：不會自動觸發，要自己開這個 GPT／Project；逐頁截圖 QA 無法原生執行。

#### 3. Google Gemini（Gems）

1. 建立 **Gem → Instructions** 貼上 `SKILL.md`。
2. **Knowledge → Add files** 上傳參考檔（**上限 10 個**，所以務必先合併精簡）。

- 免費、綁 Google 帳號，與 Workspace 整合。
- 限制：知識檔上限低、程式執行與 HTML 預覽較弱，**圖表驗算與視覺 QA 保真度最低**；較適合「內容大綱 ＋ 模板規格」這種偏文字的步驟。

#### 4. 其他 AI（Grok、Copilot、DeepSeek 等）通用做法

1. 開新對話，第一則訊息貼上 `SKILL.md` 全文（若平台可附檔，順便附上 `references/*.md` 和要用的模板）。
2. 加一句：「以上是你要嚴格遵守的工作流程，現在等我提供素材。」
3. 再丟你的文件。

#### 平台對照

| 平台 | 載入方式 | 自動觸發 | 圖表驗算（需程式） | 視覺 QA 截圖 | 檔案上限 |
| --- | --- | :---: | :---: | :---: | :---: |
| Claude Code／Desktop | `~/.claude/skills/` | ✅ | ✅ | ✅ | 無上限 |
| Claude.ai 網頁／App | 上傳 skill zip | ✅ | ✅ | ⚠️ 人眼 | 高 |
| ChatGPT Custom GPT | Knowledge ＋ Instructions | ❌ 手動開 | ✅ Code Interpreter | ⚠️ | 20 |
| ChatGPT Projects | Sources ＋ 指令 | ❌ 手動開 | ✅ Code Interpreter | ⚠️ | 5–40 |
| Gemini Gem | Knowledge ＋ Instructions | ❌ 手動開 | ⚠️ 弱 | ❌ | 10 |
| Grok／Copilot 等 | 貼上 `SKILL.md` | ❌ 手動開 | 視平台而定 | ❌ | 以附件為主 |

> **誠實聲明（不誇大）：** 除了 Claude，其他平台有兩個先天限制：**無法自動觸發**（都得手動開對應的 GPT／Gem／Project），以及**做不到 Step 6 逐頁截圖比對**（只有 Claude Code／Desktop 有無頭瀏覽器能做像素級核對）。

### 流程總覽

| 步 | 做什麼 | 人工裁決 |
|---|---|---|
| **0** | 配置：3 題必問＋預設值；依素材路徑分流 | ✅ 功能開關 |
| **1** | 提煉＋清點 → ⛔ 停下確認範圍與備援區 | ✅ 備援區去留 |
| **2** | 模板選擇：從 34 種風格篩出 3–5 候選 → ⛔ 等你選 | ✅ 使用者挑模板 |
| **3** | 風格規格（套入模板；品牌色擷取；Refine Spec opt-in）| ✅ Refine Spec（opt-in）|
| **4** | 生成（單一 HTML，Canvas 格式對應 Step 0 設定）| — |
| **5** | 圖表驗算（交給 `chart-integrity`）| ✅ 重大數字差異 |
| **6** | 視覺驗收（預期 vs 實際、截圖逐頁核對、品味清單）| ✅ |
| **7** | 複盤封裝（存成 `deck-sop-*.md`）| — |

### 檔案結構

```
ppt-creator-skills/
├── ppt-creator-skill/            # skill 1：簡報工作流
│   ├── SKILL.md                  #   主流程（Step 0–7）
│   ├── references/
│   │   ├── intake.md             #   完整問卷、主題研究、跨 session 銜接、品牌擷取
│   │   ├── prompts.md            #   各步 prompt 模板
│   │   ├── visual-craft.md       #   版面工藝（不崩版）
│   │   ├── design-taste.md       #   設計品味準則（不像 AI 生的）
│   │   └── morph-transition.md   #   Morph Transition（Magic Move 式轉場）
│   └── bold-template-pack/       #   34 種風格設計規格
├── chart-integrity/              # skill 2：圖表與統計驗算（可獨立使用）
│   ├── SKILL.md
│   └── references/
│       ├── recompute-checklist.md  # 一定要重算的統計值清單
│       └── failure-cases.md        # 三個真實失誤案例
├── scripts/check-index.py        # 模板 metadata 三方一致性檢查
├── install.sh                    # 安裝／更新兩個 skill
├── CREDITS.md                    # 第三方授權
├── LICENSE                       # MIT License
└── README.md
```

### 開發

改動模板清單後跑一次一致性檢查（比對 `SKILL.md` 內嵌清單、`selection-index.json`、`templates/` 目錄）：

```bash
python3 scripts/check-index.py
```

### 與其他 Deck Skill 接力（可選）

本 skill 是「內容＋數據的大腦」，生成這一步可交棒給專做視覺生產的 skill：

- **guizang-ppt-skill** — 深度型，2 種精裝風格（電子雜誌風／瑞士國際主義風）＋驗版腳本。
- **frontend-slides** — 廣度型，30+ 種風格＋16:9 舞台＋PPTX 匯入＋部署 URL／PDF 匯出。
- **[open-slide](https://open-slide.dev)** — 框架型，React/MDX 簡報專案＋原生 `MorphElement`＋主題系統＋export。適合要長期維護、或重度使用 Morph 轉場的簡報（`npx @open-slide/cli init` 建專案）。

### 致謝與授權

- 本專案**原創部分**採 **MIT License**，見 [`LICENSE`](LICENSE)。
- `ppt-creator-skill/bold-template-pack/` 來自 **[frontend-slides](https://github.com/zarazhangrui/frontend-slides)**，作者 **Zara Zhang**，MIT License，見 [`ppt-creator-skill/bold-template-pack/LICENSE`](ppt-creator-skill/bold-template-pack/LICENSE)。上游為 **[`zarazhangrui/beautiful-html-templates`](https://github.com/zarazhangrui/beautiful-html-templates)**。
- 部分工作流設計概念（主題研究前置、執行紀律標記、品牌擷取）參考並改寫自 **[hugohe3/ppt-master](https://github.com/hugohe3/ppt-master)**（MIT License，Copyright © 2025–2026 Hugo He）。
- `ppt-creator-skill/references/design-taste.md` 的設計品味準則改寫自 **[Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)**（MIT License，Copyright © 2026 Leonxlnx），原作針對網頁前端，本專案改寫為簡報版。
- `ppt-creator-skill/references/morph-transition.md` 的「同 id 配對契約」概念參考 **[open-slide](https://open-slide.dev/docs/primitive/morph-element)** 的 `MorphElement` primitive（作者 1weiho），本專案以 FLIP 技術移植為單一 HTML 版本。
- 完整說明見 [`CREDITS.md`](CREDITS.md)。

---

## English

Two Claude skills: **`ppt-creator-skill`** (messy documents → presentation-ready slides) and **`chart-integrity`** (chart and statistics verification, usable on its own).

Unlike typical "one-click slide generators," `ppt-creator-skill` works layer by layer: content first, then design spec, then generation.

0. **Config** — Asks only 3 things (audience, talk-style vs. read-style, brand assets); everything else gets a sensible default. Say "give me the full settings" to expand, or "I'm in a hurry" for the fast path.
1. **Distill + Inventory** — Reports scope, tags every section, intercepts sensitive data into a reserve area, then **stops and waits for your confirmation**. If you bring your own outline, switches to **critique mode**: finds gaps and logic issues instead of producing.
2. **Template Selection** — Shortlists 3–5 templates from a **34-style library**; ⛔ waits for your pick.
3. **Style Specification** — Translates "make it look designed" into hex codes, fonts, and layouts, with brand color extraction and **design-taste rules** governing every decision.
4. **Generate** — Single HTML file, matching canvas format (16:9 / 4:3 / 9:16 / A4), no improvising; optional **Morph Transition** (Keynote Magic Move-style, zero-dependency FLIP).
5. **Chart Verification** — Handed to the `chart-integrity` skill: every chart drawn from raw data, every claimed statistic re-computed before drawing, discrepancies flagged rather than guessed.
6. **Visual QA** — Expected vs. actual, screenshot-by-screenshot, only the specified pages get touched, plus an **anti-AI-slop checklist sweep**.
7. **Retrospective Packaging** — Saves the workflow as `deck-sop-*.md` so the next session can resume from it.

Design philosophy: **AI produces, humans decide**, or flip it: **you lead the thinking, AI finds the gaps**. Three decisions always stay with you: reserve area, template pick, chart discrepancies.

### The second skill: `chart-integrity`

**Works standalone — no deck required.** Hand it a report, paper, or spreadsheet and ask "are these numbers right?" and it will:

- Re-compute every claimed statistic from the raw data (slope, R², CAGR, means, error, percent change…)
- Walk a **must-recompute checklist** covering regression, growth rates, distributions, error propagation, totals/proportions, and chart-honesty checks
- Flag discrepancies **for human review** — never silently changing numbers, inventing errors, or accusing the original author
- ⛔ Stop and hand major discrepancies back to you

### Installation

Both skills install together. **Re-running any method = updating.**

**Option A — One-line Terminal Install (fastest, no Git)**

```bash
curl -L https://github.com/Yu-0312/ppt-creator-skills/archive/refs/heads/main.zip -o /tmp/ppt-creator-skills.zip \
  && rm -rf /tmp/ppt-creator-skills-main \
  && unzip -q -o /tmp/ppt-creator-skills.zip -d /tmp \
  && mkdir -p ~/.claude/skills \
  && rm -rf ~/.claude/skills/ppt-creator-skill ~/.claude/skills/chart-integrity \
  && cp -R /tmp/ppt-creator-skills-main/ppt-creator-skill /tmp/ppt-creator-skills-main/chart-integrity ~/.claude/skills/ \
  && cp /tmp/ppt-creator-skills-main/LICENSE /tmp/ppt-creator-skills-main/CREDITS.md ~/.claude/skills/ppt-creator-skill/ \
  && rm -rf /tmp/ppt-creator-skills.zip /tmp/ppt-creator-skills-main \
  && echo "✅ Installed (ppt-creator-skill + chart-integrity)"
```

> ⚠️ Earlier versions of this README used `mv source ~/.claude/skills/skill-name`. When the target directory already exists, `mv` does **not** overwrite it — it moves the source *inside*, producing `skill-name/source-name/SKILL.md`, which Claude cannot discover. The commands above remove the old copy first, so they are safe to re-run.

**Option B — Download ZIP, then run the installer**

**👉 [Download the latest ZIP](https://github.com/Yu-0312/ppt-creator-skills/archive/refs/heads/main.zip)**

```bash
unzip -o ~/Downloads/ppt-creator-skills-main.zip -d ~/Downloads \
  && bash ~/Downloads/ppt-creator-skills-main/install.sh
```

**Option C — Git Clone (stay in sync)**

```bash
git clone https://github.com/Yu-0312/ppt-creator-skills.git ~/ppt-creator-skills \
  && bash ~/ppt-creator-skills/install.sh
```

> To update later: `cd ~/ppt-creator-skills && git pull && bash install.sh`

**Verify installation**

```bash
ls ~/.claude/skills/ppt-creator-skill/SKILL.md ~/.claude/skills/chart-integrity/SKILL.md
```

Both paths should exist. Restart Claude Desktop, drop in a document and say "Turn this into slides."

### Using in Other AIs (ChatGPT / Claude.ai web / Gemini, etc.)

This skill *is* the workflow in `SKILL.md` + the discipline rules in `references/` + the template specs in `bold-template-pack/`. Only Claude Code / Desktop **auto-triggers by description** — but any AI can use it as long as it can read these files and follow `SKILL.md`.

**Solve one shared problem first: file count.** This repo has 2 `SKILL.md` files + 7 references + ~34 template files — more than most platforms' knowledge-base limits. Outside Claude.ai, **bundle and trim first**.

#### 1. Claude.ai web / App (closest to native — recommended)

1. **Settings → Capabilities**, turn on **Code execution and file creation**.
2. Zip the `ppt-creator-skill` folder (the zip must contain the **folder itself** with `SKILL.md` inside). Do the same separately for `chart-integrity`.
3. **Customize → Skills → upload** your .zip.
4. Drop in a document and say "Turn this into slides."

- Plans: Free / Pro / Max / Team / Enterprise (org-wide provisioning needs Team / Enterprise).
- Fidelity: **high** — the only weak spot is Step 6's per-page screenshot diff, which becomes eyeballing the artifact preview.

#### 2. ChatGPT (Custom GPT or Projects)

- **Option A — Custom GPT (shareable; needs Plus+):** Create a GPT → **Configure → Knowledge** to upload files (up to 20 files) → paste `SKILL.md` into **Instructions** with "Follow this workflow strictly; consult the knowledge files when needed."
- **Option B — Projects (works on Free):** Create a Project → **Sources → Add Sources** (Free 5, Plus/Go 25, Pro 40) → paste `SKILL.md` into the Project's **custom instructions**.
- Step 5 runs on **Code Interpreter**; take the output HTML from Canvas or copy the code and open it in a browser.
- Limits: no auto-trigger; per-page screenshot QA can't run natively.

#### 3. Google Gemini (Gems)

1. Create a **Gem → Instructions** and paste `SKILL.md`.
2. **Knowledge → Add files** to upload references (**10-file cap**, so bundle/trim first).

- Limits: low knowledge cap, weaker code execution and HTML preview — **lowest fidelity** for chart verification and visual QA.

#### 4. Other AIs (Grok, Copilot, DeepSeek, etc.)

1. Paste the full `SKILL.md` as your first message (attach `references/*.md` and the template you'll use if the platform allows).
2. Add: "That's the workflow you must follow strictly. Now wait for my source material."
3. Then drop in your document.

#### Platform comparison

| Platform | How to load | Auto-trigger | Chart verify (needs code) | Visual-QA screenshots | File cap |
| --- | --- | :---: | :---: | :---: | :---: |
| Claude Code / Desktop | `~/.claude/skills/` | ✅ | ✅ | ✅ | none |
| Claude.ai web / App | Upload skill zip | ✅ | ✅ | ⚠️ by eye | high |
| ChatGPT Custom GPT | Knowledge + Instructions | ❌ open manually | ✅ Code Interpreter | ⚠️ | 20 |
| ChatGPT Projects | Sources + instructions | ❌ open manually | ✅ Code Interpreter | ⚠️ | 5–40 |
| Gemini Gem | Knowledge + Instructions | ❌ open manually | ⚠️ weak | ❌ | 10 |
| Grok / Copilot, etc. | Paste `SKILL.md` | ❌ open manually | depends | ❌ | attachments |

> **Honest caveat (no overselling):** Outside Claude, two inherent limits lower fidelity — **no auto-trigger** (you open the GPT/Gem/Project yourself) and **no Step 6 per-page screenshot diff** (only Claude Code / Desktop has a headless browser for pixel-level checks).

### Workflow Overview

| Step | What | Human Decision |
|---|---|---|
| **0** | Config: 3 required questions + defaults; route by source material | ✅ All toggles |
| **1** | Distill + inventory → ⛔ confirm scope and reserve area | ✅ Reserve area |
| **2** | Template selection: 3–5 candidates from 34 styles → ⛔ your pick | ✅ Template pick |
| **3** | Style spec (template applied; brand extraction; Refine Spec opt-in) | ✅ Refine Spec (opt-in) |
| **4** | Generate (single HTML, canvas format from Step 0) | — |
| **5** | Chart verification (handed to `chart-integrity`) | ✅ Major discrepancies |
| **6** | Visual QA (expected vs. actual, per-page screenshots, taste checklist) | ✅ |
| **7** | Retrospective packaging (`deck-sop-*.md`) | — |

### File Structure

```
ppt-creator-skills/
├── ppt-creator-skill/            # skill 1: the deck workflow
│   ├── SKILL.md                  #   Main workflow (Step 0–7)
│   ├── references/
│   │   ├── intake.md             #   Full questionnaire, topic research, resume, brand extraction
│   │   ├── prompts.md            #   Ready-to-paste prompt templates
│   │   ├── visual-craft.md       #   Visual craft (no broken layouts)
│   │   ├── design-taste.md       #   Design taste (anti-AI-slop)
│   │   └── morph-transition.md   #   Morph Transition (Magic Move-style)
│   └── bold-template-pack/       #   34 style design specs
├── chart-integrity/              # skill 2: chart & statistics verification (standalone)
│   ├── SKILL.md
│   └── references/
│       ├── recompute-checklist.md  # Statistics that must be re-computed
│       └── failure-cases.md        # Three real-world failure cases
├── scripts/check-index.py        # Template metadata consistency check
├── install.sh                    # Install / update both skills
├── CREDITS.md                    # Third-party attribution
├── LICENSE                       # MIT License
└── README.md
```

### Development

After changing the template list, run the consistency check (compares the embedded list in `SKILL.md`, `selection-index.json`, and the `templates/` directory):

```bash
python3 scripts/check-index.py
```

### Chaining with Other Deck Skills (Optional)

This skill is the **content + data brain**. The generation step can hand off to a visual production skill:

- **guizang-ppt-skill** — Depth-focused: 2 refined styles + verification script.
- **frontend-slides** — Breadth-focused: 30+ styles + fixed 16:9 stage + PPTX import + deploy URL / PDF export.
- **[open-slide](https://open-slide.dev)** — Framework-based: React/MDX slide projects + native `MorphElement` + theme system + export.

### Acknowledgements

- The **original work** is released under the **MIT License**; see [`LICENSE`](LICENSE).
- `ppt-creator-skill/bold-template-pack/` comes from **[frontend-slides](https://github.com/zarazhangrui/frontend-slides)** by **Zara Zhang**, MIT License; see [`ppt-creator-skill/bold-template-pack/LICENSE`](ppt-creator-skill/bold-template-pack/LICENSE). Upstream: **[`zarazhangrui/beautiful-html-templates`](https://github.com/zarazhangrui/beautiful-html-templates)**.
- Some workflow concepts (topic research pre-step, execution discipline markers, brand extraction) are adapted from **[hugohe3/ppt-master](https://github.com/hugohe3/ppt-master)** (MIT License, Copyright © 2025–2026 Hugo He).
- The design-taste rules in `ppt-creator-skill/references/design-taste.md` are adapted from **[Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)** (MIT License, Copyright © 2026 Leonxlnx).
- The same-id matching contract in `ppt-creator-skill/references/morph-transition.md` is inspired by the `MorphElement` primitive of **[open-slide](https://open-slide.dev/docs/primitive/morph-element)** (by 1weiho), ported here to single-file HTML via the FLIP technique.
- Full third-party attribution: [`CREDITS.md`](CREDITS.md).
