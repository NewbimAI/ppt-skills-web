#BRANCH:main
# HTML PPT Skill

> 一个纯 HTML/CSS/JS 的演示文稿引擎 + AI 结构化生成协议，让你用浏览器就能做出苹果发布会级别的幻灯片。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.2-green.svg)](SKILL.md)
[![Echarts](https://img.shields.io/badge/Echarts-5.5.0-orange.svg)]()

---

## 这是什么？

**HTML PPT Skill** 是一套完整的网页幻灯片系统，包含两个部分：

1. **演示引擎**：一套轻量级的 CSS + JS 核心，让任何 HTML 文件变成可翻页、可交互的演示文稿
2. **AI 生成协议**：一套结构化的两阶段生成规范，指导 AI 按照工业级标准逐页生成高质量幻灯片

**零依赖、零构建、双击浏览器即可打开。**

---

## 效果展示

**封面页** — 霓虹渐变 + 呼吸光晕动画

![封面页](screenshot_cover.png)

**数据密集页** — 进度条、指标卡片、标签，一页塞满信息量

![数据密集页](screenshot_content5.png)

**双栏对比页** — 左右分栏 + SVG 流程图 + 玻璃态卡片

![双栏对比页](screenshot_content4.png)

**鸟瞰全景模式** — 按 `O` 键，所有页面缩略平铺，点击即跳转

![鸟瞰全景模式](screenshot_overview.png)

---

## 核心特性

### 引擎层

- **固定 16:9 画布** (1280x720)，自动缩放适配任意屏幕
- **键盘全操控**：翻页、鸟瞰、激光笔、白板标注、全屏
- **演讲者视图**：按 `P` 键弹出提词器窗口
- **手机遥控**：按 `R` 键生成二维码，手机扫码即可翻页
- **暗黑模式**：按 `D` 键一键切换深色/浅色主题
- **无损 PDF 导出**：`Ctrl+P` 打印为高质量 PDF
- **Echarts 深度集成**：20+ 种预配置图表，渐变、圆角、动态数据

### 组件库 (32 种交互组件)

| 分类      | 组件                                                                                                    |
| ------- | ----------------------------------------------------------------------------------------------------- |
| 基础交互    | `tab-group` `flip-card` `hover-reveal` `progress-bar` `progress-ring` Echarts 图表                      |
| 展开/导航   | `accordion` `stepper` `carousel` `toggle-switch`                                                      |
| 数据/文字动效 | `counter-up` `morph-number` `typewriter` `marquee`                                                    |
| 视觉增强    | `spotlight-group` `zoom-hover` `glow-pulse` `gradient-border` `tilt-card` `neon-underline` `skeleton` |
| 高级交互    | `quiz` `sortable-list` `image-compare` `parallax-container` `svg-draw` `confetti-trigger`             |
| 动画/装饰   | `ripple` `stagger` `float-labels` `orbit-container`                                                   |

### AI 生成协议

- **两阶段流程**：先设计规划（页数、受众、风格、色彩、图表），再逐页生成
- **强制质量关卡**：18 条执行纪律 + 26 项质量检查清单
- **模板系统**：4 套预设设计风格，一键切换
- **Markdown 转换**：直接从 `.md` 文件生成幻灯片
- **逐页渲染审查**：交付前强制浏览器实际检查每一页

---

## 搭配 Paper Reader —— 从论文到 PPT 一键生成

结合 [Paper Reader](https://github.com/chenyangji666/paper-reader) Skill，可以实现**论文阅读 → 通俗解读 → 演示汇报**的完整闭环：

```
论文 PDF
  │
  ▼
┌─────────────┐
│ paper-reader │  用生活比喻读懂论文，输出通俗版解读.md
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ html-ppt-skill   │  将解读内容转为高信息密度的 HTML 演示文稿
└──────┬───────────┘
       │
       ▼
  浏览器打开即可汇报
```

**使用方式：**

```
# 第一步：用 paper-reader 读论文
帮我读这篇论文 /path/to/paper.pdf

# 第二步：用 html-ppt-skill 做汇报 PPT
用 html-ppt-skill 把刚才的通俗版解读做成汇报 PPT
```

从一篇陌生的论文到一份可以直接组会汇报的演示文稿，全程不超过 10 分钟。

---

## 快速开始

### 1. 最简方式：直接引用

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的演示</title>
  <link rel="stylesheet" href="./resources/core_engine.css">
  <link rel="stylesheet" href="./resources/components.css">
</head>
<body>
  <main class="deck" id="deck">
    <section class="slide active" data-chapter="封面">
      <div class="frame">
        <div class="in" style="display:flex;align-items:center;justify-content:center;height:100%">
          <h1 style="font-size:56px;font-weight:900">Hello World</h1>
        </div>
      </div>
      <aside class="notes">这是演讲者备注，按 P 键查看。</aside>
    </section>
  </main>
  <script src="./resources/core_engine.js"></script>
</body>
</html>
```

用浏览器打开这个 HTML 文件，即可开始演示。

### 2. 使用模板

从 `templates/` 目录中选择一套模板作为起点：

| 模板                | 风格         | 适用场景         |
| ----------------- | ---------- | ------------ |
| `apple_keynote`   | 白色卡片 + 极简  | 技术分享、产品发布、培训 |
| `tech_blue`       | 蓝色渐变 + 科技感 | 技术报告、商务展示    |
| `data_consulting` | 高密度 + 图表优先 | 咨询报告、数据分析    |
| `dark_premium`    | 深色 + 霓虹    | 创意展示、高端演示    |

### 3. 让 AI 帮你生成

本项目内置了完整的 AI 生成协议 (`SKILL.md`)，适用于任何支持指令的 AI 工具（Claude、ChatGPT、Gemini 等）。

只需告诉 AI：

> "请按照 html_ppt_skill 的 SKILL.md 协议，帮我生成一份关于 XXX 的 20 页演示文稿。"

AI 会按照两阶段流程自动完成设计规划、逐页生成、质量自检。

---

## 快捷键

打开演示后，使用键盘操控一切：

| 按键                     | 功能          |
| ---------------------- | ----------- |
| `→` `Space` `PageDown` | 下一页         |
| `←` `PageUp`           | 上一页         |
| `Home` / `End`         | 首页 / 末页     |
| `O` / `Esc`            | 鸟瞰全景模式      |
| `Enter`                | 全屏切换        |
| `P`                    | 演讲者视图（提词器）  |
| `D`                    | 暗黑模式切换      |
| `L`                    | 激光笔模式       |
| `A`                    | 白板标注模式      |
| `C`                    | 清除标注        |
| `R`                    | 手机遥控配对      |
| `Ctrl+P`               | 打印 / 导出 PDF |

---

## 项目结构

```
html_ppt_skill/
├── SKILL.md                          # AI 生成协议（核心文档）
├── README.md                         # 本文件
├── LICENSE                           # MIT 开源协议
├── screenshot_*.png                  # 效果展示截图
├── resources/                        # 运行时引擎
│   ├── core_engine.css               # 核心样式（布局、动画、主题）
│   ├── core_engine.js                # 核心逻辑（导航、交互、组件初始化）
│   ├── components.css                # 32 种可复用组件样式
│   └── controller.html               # 手机遥控器页面
├── templates/                        # 预设模板
│   ├── templates_index.json          # 模板注册表
│   ├── apple_keynote/                # Apple Keynote 风格
│   ├── tech_blue/                    # 科技蓝风格
│   ├── data_consulting/              # 数据咨询风格
│   └── dark_premium/                 # 暗黑高端风格
├── references/                       # 参考文档
│   ├── design_principles.md          # CRAP 设计原则
│   ├── design_spec_template.md       # 设计规范模板
│   ├── executor.md                   # 执行器参考（布局矩阵、组件选择）
│   ├── page_layouts.md               # 12 种标准页面布局模式库
│   ├── echarts_catalog.json          # 20+ 种 Echarts 图表配置
│   ├── md_conversion_guide.md        # Markdown 转幻灯片指南
│   └── quality_checklist.md          # 质量检查清单
└── examples/
    └── boilerplate.html              # 最小可运行示例
```

---

## 技术规范

- **画布**：固定 1280 x 720px（16:9），自动缩放适配屏幕
- **依赖**：纯原生 HTML/CSS/JS，无构建步骤，无 npm 依赖
- **图表**：[Echarts 5.5.0](https://echarts.apache.org/)（通过 CDN 加载，可选）
- **浏览器**：Chrome / Edge / Firefox / Safari 最新版
- **导出**：支持 `Ctrl+P` 打印为 PDF

---

## 常见问题

**Q：翻页没反应？**
A：确保焦点在页面上（点击一下页面），而非浏览器地址栏或开发者工具。

**Q：Echarts 图表不显示？**
A：需要网络连接以加载 CDN 脚本。离线使用请下载 echarts.min.js 放到本地。

**Q：如何导出为单个 HTML 文件发给别人？**
A：用记事本打开你的 HTML 文件，把 `<link rel="stylesheet" href="...core_engine.css">` 替换为 `<style>` 标签（里面粘贴 core_engine.css 的内容），对 components.css 和 core_engine.js 做同样处理。或者让 AI 帮你做这一步。

**Q：手机遥控怎么用？**
A：按 `R` 键，屏幕上会显示二维码。确保手机和电脑在同一局域网，用手机扫码即可翻页。

**Q：如何在 AI 工具中使用生成协议？**
A：将 `SKILL.md` 的内容作为系统提示词或项目指令提供给 AI，然后告诉它你的演示主题和需求。

---

## 设计原则

本项目遵循 **CRAP** 设计四原则：

- **Contrast（对比）**：标题与正文至少 1.5 倍字号差，色彩对比度 >= 4.5:1
- **Repetition（重复）**：全局统一色彩、间距、组件样式
- **Alignment（对齐）**：CSS Grid 精确对齐，统一边距 56px
- **Proximity（邻近）**：相关元素靠近，不相关元素分离

核心排版哲学：**高信息密度、No-empty-space、活体图表优先。**

---

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

## 免责声明

1. 本项目以"现状"（AS IS）提供，不附带任何明示或暗示的担保，包括但不限于对适销性、特定用途适用性和不侵权的暗示担保。

2. 作者及贡献者不对因使用本项目而产生的任何直接、间接、偶然、特殊、惩罚性或后果性损害承担责任，包括但不限于利润损失、数据丢失、业务中断等。

3. 本项目生成的演示文稿内容由使用者自行负责。使用者应确保其内容不侵犯任何第三方的知识产权、著作权或其他合法权益。

4. 本项目通过 CDN 引用了 [Apache ECharts](https://echarts.apache.org/) 图表库，该库受 Apache 2.0 许可证保护，其版权和许可归其各自所有者所有。

5. 使用本项目即表示您已阅读、理解并同意本免责声明的全部条款。如不同意，请停止使用本项目。

---

## 致谢

- [Apache ECharts](https://echarts.apache.org/) — 强大的交互式图表库
- [PeerJS](https://peerjs.com/) — WebRTC 点对点通信库（用于手机遥控功能）

---

**如果这个项目对你有帮助，请给一个 Star 支持一下！**
