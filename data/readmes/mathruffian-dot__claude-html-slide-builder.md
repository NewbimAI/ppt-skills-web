#BRANCH:master
# 🎨 html-slide-builder — Claude Code Skill

> 給定教材，自動生成完整的 **Reveal.js HTML 互動簡報** 並部署至 GitHub Pages。

[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-orange?logo=anthropic)](https://claude.ai/code)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## ✨ 功能

| 功能 | 說明 |
|------|------|
| 🖼 **AI 背景底圖** | 自動判斷哪些頁面需要底圖，呼叫 draw skill 生成霓虹暗色風格底圖 |
| 🎯 **扁平化圖標** | 生成圖標總表 → PIL 裁切 → 亮度去背，取代 emoji |
| 💬 **即時互動元件** | Firebase Firestore 串接的文字雲（wordcloud2.js）與單選投票 |
| 🔀 **視覺化演示** | clip-path 滑桿揭露效果，適合「前後對比」「格式轉換」內容 |
| 🚀 **一鍵部署** | 自動 git init → GitHub 公開 repo → GitHub Pages |

## 📺 效果展示

- **範例簡報**：[https://mathruffian-dot.github.io/html-vs-markdown/](https://mathruffian-dot.github.io/html-vs-markdown/)
- 包含：文字雲互動、Markdown→HTML 滑桿演示、AI 生成底圖與圖標

---

## 🔧 安裝

### 必要元件

| 元件 | 用途 | 必要？ |
|------|------|--------|
| Python 3.8+ | 安裝腳本、去背 | ✅ 必要 |
| git | 版本控制 | ✅ 必要 |
| [Pillow](https://pillow.readthedocs.io/) | 圖標裁切與去背 | ⚠️ 圖標功能需要 |
| Draw Skill（gpt-image-2 生圖技能）| AI 生圖 | ⚠️ 底圖/圖標需要，需自行安裝並設定 OpenAI 金鑰 |
| OpenAI API Key | gpt-image-2 生圖 | ⚠️ 底圖/圖標需要 |
| [GitHub CLI (gh)](https://cli.github.com/) | GitHub Pages 部署 | ⚠️ 自動部署需要 |
| Firebase 專案 | 互動元件資料庫 | ⚠️ 互動功能需要（可用共用示範） |

### 一鍵安裝

```bash
# 1. Clone 此 repo
git clone https://github.com/mathruffian-dot/claude-html-slide-builder.git
cd claude-html-slide-builder

# 2. 執行安裝腳本（會自動檢查元件並引導設定）
python install.py
```

安裝腳本會：
- ✅ 逐項檢查必要元件，列出缺少的項目
- ✅ 詢問是否自動安裝 Pillow
- ✅ 引導設定 Firebase（可選用共用示範專案或自訂）
- ✅ 將 Skill 複製到 `~/.claude/skills/html-slide-builder/`
- ✅ 自動偵測 draw skill 路徑並注入設定

### 手動安裝

```bash
# 複製 skill 目錄到 Claude skills 資料夾
cp -r skill/ ~/.claude/skills/html-slide-builder/
```

---

## 🚀 使用方式

安裝後，在 Claude Code 對話中說：

```
幫我把這份教材做成 HTML 互動簡報

# 或

把以下課程大綱轉成 Reveal.js 互動簡報：
[貼上你的教材內容]
```

Claude 會自動：
1. 分析教材，列出投影片大綱（含功能標記 `[BG][ICON][INTERACT][VIZ]`）
2. **等你確認大綱後**才開始生成
3. 平行執行底圖生成、圖標製作、互動元件嵌入
4. 部署至 GitHub Pages 並回傳網址

---

## 📁 Skill 結構

```
html-slide-builder/
├── SKILL.md                    # 主要指令（Claude 讀取）
├── scripts/
│   └── remove_bg.py            # PIL 圖標去背腳本
└── references/
    ├── reveal-template.md      # Reveal.js HTML 模板 + CSS 元件庫
    └── firebase-config.md      # Firebase 互動元件程式碼（文字雲/投票）
```

---

## ⚙️ Firebase 設定說明

### 選項 A：共用示範專案（快速試用）
安裝時選 A，使用 `teacherstudy-109ef` 示範專案。
- 優點：不需申請，立即可用
- 注意：資料為公開共用，**請勿在正式課程中使用**

### 選項 B：自訂 Firebase 專案（正式使用，推薦）
1. 至 [Firebase Console](https://console.firebase.google.com/) 建立專案
2. 建立 Firestore 資料庫（測試模式）
3. 在「專案設定 → 一般」取得 `firebaseConfig`
4. 安裝時選 B 並輸入設定值

---

## 🛠 功能詳細說明

### 底圖生成 [BG]
- 使用 `draw.py`（gpt-image-2 模型）生成 1536×1024 橫式底圖
- 設計風格：深暗色系、霓虹發光效果、無文字
- 透明度：封面 30–40%，一般頁 12–18%

### 圖標系統 [ICON]
- 一次生成「圖標總表」（多個圖標橫排在同一張圖）
- PIL 等分裁切 → 亮度閾值去背（< 45 全透明，45–80 漸變）
- 嵌入 HTML，取代 emoji，搭配 `drop-shadow` 發光效果

### 即時文字雲 [INTERACT:wordcloud]
- `wordcloud2.js` 渲染，字級隨頻率縮放，微旋轉 30%
- Firebase `onSnapshot` 即時更新，毫秒級同步

### 滑桿視覺化 [VIZ]
- CSS `clip-path: inset(0 X% 0 0)` 控制揭露
- 青色霓虹發光分隔線隨滑桿移動

---

## 📋 系統需求

| 環境 | 版本 |
|------|------|
| Claude Code | 最新版 |
| Python | 3.8+ |
| OS | Windows / macOS / Linux |

---

## 🤝 貢獻

歡迎 PR 改進 SKILL.md 的指令品質、新增互動元件、或分享你用此 Skill 做出的簡報！

---

## 📄 授權

MIT License — 自由使用、修改、分享。

---

*由 [mathruffian-dot](https://github.com/mathruffian-dot) 製作*
*展示簡報：[html-vs-markdown](https://mathruffian-dot.github.io/html-vs-markdown/)*
