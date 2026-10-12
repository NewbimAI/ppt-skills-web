#BRANCH:main
# 🎙️ Presentation Skill — 演讲脚本 + PPT 一键生成

> 输入一个主题，一键生成演讲脚本 + 品牌级 HTML 幻灯片。  
> 支持 62 种世界级品牌设计风格，基于 [awesome-design-md](https://github.com/VoltAgent/awesome-design-md)。

**[👉 在线演示：5种风格的苏格拉底《申辩篇》PPT](https://orangeviolin.github.io/presentation-skill/)**

---

## 效果预览

<table>
<tr>
<td align="center"><a href="https://orangeviolin.github.io/presentation-skill/greek-academy.html"><img src="https://img.shields.io/badge/🏛️-古希腊学院风-c5a55a?style=for-the-badge" /></a></td>
<td align="center"><a href="https://orangeviolin.github.io/presentation-skill/sunny-cards.html"><img src="https://img.shields.io/badge/☀️-阳光明媚风-e67e22?style=for-the-badge" /></a></td>
<td align="center"><a href="https://orangeviolin.github.io/presentation-skill/state-enterprise.html"><img src="https://img.shields.io/badge/🏢-国企汇报风-900000?style=for-the-badge" /></a></td>
</tr>
<tr>
<td align="center"><a href="https://orangeviolin.github.io/presentation-skill/ted-talk.html"><img src="https://img.shields.io/badge/🎤-TED演讲风-e62b1e?style=for-the-badge" /></a></td>
<td align="center"><a href="https://orangeviolin.github.io/presentation-skill/chinese-ink.html"><img src="https://img.shields.io/badge/🎨-水墨中国风-c23b22?style=for-the-badge" /></a></td>
<td align="center"><em>...共 62 种品牌风格</em></td>
</tr>
</table>

> 点击徽章即可在线播放完整幻灯片，支持键盘翻页、全屏、自动播放、演讲者备注和 PDF 导出。

---

## 特性

- 🎨 **62 种品牌级设计风格** — Apple、Stripe、Ferrari、Nike、SpaceX、Notion、Linear... 基于真实品牌设计系统
- 📝 **演讲脚本 + 幻灯片一体化** — 同时生成完整口语化演讲词和可播放的 HTML 幻灯片
- 🎮 **完整幻灯片播放器** — 键盘控制 / 点击翻页 / 触摸滑动 / 全屏演示 / 自动播放
- 📋 **演讲者备注** — 侧边栏显示完整演讲词，边看边讲
- 📥 **PDF 导出** — 浏览器打印，每页一张幻灯片，`@media print` 自动适配
- 🖼️ **SVG 插图** — 每页内联矢量插图，不依赖外部图片，放大不模糊
- 🎯 **零依赖** — 单文件 HTML，离线可用（仅 Google Fonts 走 CDN）
- 📱 **响应式** — 16:9 比例，移动端自适应

---

## 快速开始

### 在 Claude Code 中使用

将 `SKILL.md` 放入你的 Claude Code skills 目录（`~/.claude/skills/presentation/`），然后：

```
/ppt 苏格拉底的申辩
```

或者：

```
做个PPT 讲讲我们的Q2规划
```

### 指定风格

```
/ppt 产品发布会 风格:apple
```

不指定风格时，skill 会展示风格选择菜单，也可以说"帮我推荐"自动匹配。

### 触发词

| 触发词 | 说明 |
|-------|------|
| `/ppt` | 生成演讲稿 + HTML 幻灯片 |
| `做PPT` / `做个PPT` | 同上 |
| `演讲稿` | 同上 |
| `presentation` | 同上 |
| `幻灯片` / `做个演示` | 同上 |

---

## 操作指南

生成的 HTML 幻灯片支持以下操作：

| 快捷键 | 功能 |
|--------|------|
| `→` / `←` / `Space` | 翻页 |
| `F` | 全屏演示 |
| `A` | 自动播放（5-8秒/页） |
| `N` | 显示/隐藏演讲者备注 |
| `P` | 导出 PDF（浏览器打印） |
| 点击右半屏 | 下一页 |
| 点击左半屏 | 上一页 |
| 触摸左右滑动 | 翻页（移动端） |

---

## 输出文件

每次生成两个文件：

```
{主题}_演讲脚本.md    # 完整口语化演讲词（每页该说什么）
{主题}_slides.html    # 可播放的 HTML 幻灯片
```

HTML 文件可以直接：
- 浏览器打开播放
- 发微信/邮件分享
- `Ctrl+P` 导出 PDF
- 部署到任意静态托管

---

## 风格一览

### 内置差异化风格（苏格拉底《申辩篇》示例）

| 风格 | 在线预览 | 视觉特色 |
|------|----------|----------|
| 古希腊学院风 | [▶ 播放](https://orangeviolin.github.io/presentation-skill/greek-academy.html) | 大理石纹理、希腊回纹边框、月桂冠/猫头鹰/天平 SVG、Playfair Display 衬线 |
| 阳光明媚·卡片风 | [▶ 播放](https://orangeviolin.github.io/presentation-skill/sunny-cards.html) | 暖米色底、彩色圆角卡片、emoji 图标装饰、Noto Sans SC |
| 国企汇报风 | [▶ 播放](https://orangeviolin.github.io/presentation-skill/state-enterprise.html) | 深红渐变顶栏、编号红圈面板、统计大数字卡片、warning-box |
| TED 演讲风 | [▶ 播放](https://orangeviolin.github.io/presentation-skill/ted-talk.html) | 黑底聚光灯、200号字冲击数字、一页一观点、红色 accent |
| 水墨中国风 | [▶ 播放](https://orangeviolin.github.io/presentation-skill/chinese-ink.html) | 宣纸底、墨山水 SVG、朱红印章、竖排文字、半文言语气 |

### awesome-design-md 品牌风格（62种）

通过 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) 可以使用以下品牌风格：

| 类别 | 品牌 |
|------|------|
| AI 平台 | Claude, Cohere, ElevenLabs, Mistral AI, Ollama, Replicate, xAI... |
| 开发工具 | Cursor, Expo, Vercel, Warp, Raycast, Superhuman... |
| 设计工具 | Figma, Framer, Miro, Webflow, Airtable, Clay... |
| 金融科技 | Stripe, Coinbase, Revolut, Binance, Wise... |
| 消费品牌 | Apple, Nike, Spotify, Airbnb, Uber, Shopify... |
| 汽车 | Tesla, Ferrari, BMW, Lamborghini, Renault... |
| 更多 | Notion, Linear, MongoDB, Supabase, SpaceX, IBM, NVIDIA... |

安装任意品牌设计系统：

```bash
npx getdesign@latest add <brand-name>
```

---

## 技术实现

- **单文件 HTML** — 所有 CSS、JS、SVG 内联，无外部依赖
- **设计系统驱动** — 从 awesome-design-md 获取完整设计 token（配色、字体、阴影、间距）
- **内联 SVG 插图** — 根据内容生成矢量插图，不依赖外部图片
- **CSS 动画** — 轻量 fade + translateX 滑动切换
- **打印优化** — `@media print` 规则确保 PDF 导出质量，每页一张幻灯片

---

## 项目结构

```
presentation-skill/
├── README.md          # 本文件
├── SKILL.md           # Claude Code skill 定义（放入 ~/.claude/skills/presentation/）
├── examples/          # 示例 HTML 幻灯片（可下载）
│   ├── greek-academy.html
│   ├── sunny-cards.html
│   ├── state-enterprise.html
│   ├── ted-talk.html
│   └── chinese-ink.html
└── docs/              # GitHub Pages 在线演示
    ├── index.html
    └── *.html
```

---

## 安装

1. 在 Claude Code 的 skills 目录下创建文件夹：

```bash
mkdir -p ~/.claude/skills/presentation
```

2. 复制 SKILL.md：

```bash
cp SKILL.md ~/.claude/skills/presentation/
```

3. 重启 Claude Code，即可使用 `/ppt` 命令。

---

## 致谢

### [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

本项目的设计系统基于 awesome-design-md 开源项目。

awesome-design-md 收集了 62 个世界级品牌的完整设计系统文档（DESIGN.md），涵盖配色、字体、阴影、间距等全套设计 token。每一个 DESIGN.md 都是对真实品牌网站的精心逆向工程，质量极高。

**感谢 VoltAgent 团队的杰出工作，让 AI 生成品牌级 UI 成为可能。**

### 苏格拉底

感谢苏格拉底在公元前 399 年的那场演讲——2425 年后，它依然是人类历史上最伟大的法庭辩护，也是我们最好的测试用例。

> "离别的时刻已经到来。我去赴死，你们去生活。哪一个更好，只有神知道。"

---

## License

MIT

## 作者

**01fish** — AI 自媒体创作者

*01fish，陪你听故事*
