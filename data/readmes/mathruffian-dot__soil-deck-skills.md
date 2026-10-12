#BRANCH:master
# SOIL 簡報技能集（SOIL Deck Skills）

以李俊儀教授 SOIL Teaching Deck Workflow 六顆引擎為核心，把教材與主題轉成有教學力的簡報。

## Skills

| Skill | 輸出 | 適用情境 |
|---|---|---|
| [`soil-image-deck`](skills/soil-image-deck/SKILL.md) | 全圖片或底圖＋可編輯文字 `.pptx` | NotebookLM 式圖片教學簡報、社群、研習開場 |
| [`soil-teaching-deck`](skills/soil-teaching-deck/SKILL.md) | 可編輯 `.pptx` | 正式上課、公式、圖表與後續修改 |
| [`soil-html-deck`](skills/soil-html-deck/SKILL.md) | 單一互動 `.html` | 線上研習、直播與互動教材 |

## soil-image-deck v2

新版流程已加入：

- SOIL 前四顆引擎完成後才建立 YAML。
- 固定骨架＋受控版型＋逐頁資料。
- 黃金樣張鎖定整份簡報風格。
- 可選 Subagent 分批生圖。
- `baked` 與 `plate` 兩種模式。
- 預設使用粗圓、飽滿、低稜角的繁體中文字體語言。
- Codex 預設使用訂閱內建 Imagegen，不要求 API Key。

## soil-html-deck v2

新版 HTML 流程已升級為 Image Deck 的互動式上位輸出：

- 共用 SOIL 教學流程、YAML Core、設計系統與受控版型。
- 先寫 `soil_interactive_deck_v1` 規格，再產生 HTML。
- 依資訊關係路由比較切換、Stepper、分類篩選、頁籤與決策互動。
- 封面可使用 baked 圖；正文採真實 HTML 文字與原生 DOM／SVG／Canvas。
- 支援鍵盤、觸控、窄螢幕、reduced motion 與靜態 fallback。
- 可驗證為無外部依賴的單一離線 HTML。

## 安裝到 Codex

安裝單一 Skill：

```powershell
python "$HOME\.codex\skills\.system\skill-installer\scripts\install-skill-from-github.py" `
  --repo mathruffian-dot/soil-deck-skills `
  --path skills/soil-image-deck
```

安裝完整技能集：

```powershell
python "$HOME\.codex\skills\.system\skill-installer\scripts\install-skill-from-github.py" `
  --repo mathruffian-dot/soil-deck-skills `
  --path skills/soil-image-deck skills/soil-teaching-deck skills/soil-html-deck
```

## 生圖路徑

- Codex：預設使用內建 Imagegen 與訂閱額度。
- 其他 Agent：使用其可用的圖片生成工具。
- 只有使用者明確指定 API／CLI 時，才切換到 API Key 路徑。

## 字型政策

- `baked`：每次提示詞都要求繁體中文粗圓字，禁止尖角、窄長、機械感字型。
- `plate`：優先使用 `jf open 粉圓 2.1`、`GenSenRounded TW`、`GenJyuuGothic`。
- 系統沒有繁中粗圓字型時，停止並提示安裝，不默默替換成稜角黑體。

MIT License，詳見 [LICENSE](LICENSE)。
