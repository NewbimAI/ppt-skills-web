#BRANCH:main
# Academic Report PPT（学术报告演示文稿）

一个AI智能体技能，用于生成具有 **SCQA叙事结构** 的 **学术风格演示文稿**。它提供12套主题化HTML模板（1920×1080）、一个用于将内容填入模板的Node.js管线，并将其转换为可编辑的 `.pptx` 文件。

## 功能特点

- **SCQA叙事结构** — 情境（Situation）→ 冲突（Complication）→ 问题（Question）→ 答案（Answer）
- **12套HTML模板** — 封面、目录、政策背景、章节分隔页、工作流、研究方法、对比、图片网格、核心发现、致谢、数据统计
- **基于插槽的模板机制** — 由JSDOM填充的 `data-slot` 属性，在 `manifest.json` 中定义
- **高保真PPTX输出** — Puppeteer将HTML渲染为图像，`dom-to-pptx` 组装最终PowerPoint
- **Lucide图标** — 内置支持在图片插槽中使用 `lucide:<图标名称>` 语法
- **通过CSS自定义属性实现主题化** — 轻松定制颜色、字体和背景

## 视觉风格

| 元素 | 值 |
|---------|-------|
| 背景 | 暖象牙色 `#FFF9F0`（内容页）、深海军蓝 `#003366`（分隔页） |
| 主色调 | 红色 `#CC0000` |
| 辅色调 | 翡翠绿 `#10B981` |
| 字体 | Microsoft YaHei / PingFang SC |

## 模板列表

| # | 模板 | 描述 |
|---|----------|-------------|
| 01 | `cover` | 标题幻灯片，含演讲者信息和机构品牌标识 |
| 02 | `contents` | 目录，含章节列表 |
| 03 | `intro-policy` | 背景与战略需求——双栏徽章+项目符号 |
| 04 | `section-divider` | 章节分隔页，深海军蓝背景 |
| 05 | `4-workflow` | 四阶段管线，分组步骤+摘要栏 |
| 06 | `3-workflow` | 三步线性工作流，水平布局 |
| 07 | `research-method` | 双栏研究方法，翡翠绿边框点缀 |
| 08 | `comparison` | 并排对比（蓝色vs灰色列） |
| 09 | `image-grid` | 3×2图片画廊，带标题+摘要栏 |
| 10 | `key-finding` | 全页居中的核心发现，带强调条 |
| 11 | `thank-you` | 联系信息与结束页 |
| 12 | `data-stats` | 数据卡片+图表区域+方法模块 |

## 快速开始

### 前置条件

- Node.js ≥ 18
- npm

### 安装

```bash
cd academic-report-ppt
npm install
```

### 使用方法

#### 1. 创建 `slides.json`

定义幻灯片序列。每张幻灯片引用一个 `templateId` 并填充 `slots`：

```json
[
  {
    "templateId": "cover",
    "slots": {
      "title": "Your Presentation Title",
      "subtitle": "Subtitle here",
      "presenter": "Presenter: Name",
      "date": "2026-04"
    }
  },
  {
    "templateId": "contents",
    "slots": {
      "title": "Contents",
      "chapter1": "Background",
      "chapter2": "Methods",
      "chapter3": "Results"
    }
  }
]
```

完整11页示例请参见 [`rules/slides-example.json`](rules/slides-example.json)。

#### 2. 运行管线

```bash
# 一键操作：验证 → 填充模板 → 转换为PPTX
node scripts/run-pipeline.js output/slides.json output/presentation.pptx
```

或分步执行：

```bash
# 验证
node scripts/validate-slides.js output/slides.json

# 填充HTML模板
node scripts/fill-template.js output/slides.json

# 转换为PPTX
node scripts/html-to-pptx-dom.js output/filled output/presentation.pptx
```

#### 3. 输出结果

管线会生成：

```
output/
├── slides.json          # 你的幻灯片定义文件
├── filled/              # 填充后的HTML文件（中间产物）
│   ├── slide-01-cover.html
│   ├── slide-02-contents.html
│   └── ...
├── images/              # 生成/下载的图片
└── presentation.pptx    # 最终PowerPoint文件
```

### 输出目录

管线的输出目录为 `output/`，**相对于你的当前工作目录（`cwd`）**，而非技能目录本身。你可以从任意项目目录运行管线：

```bash
# 从项目根目录运行——输出到 ./output/
node path/to/academic-report-ppt/scripts/run-pipeline.js slides.json my-talk.pptx
```

PPTX输出路径完全可配置，作为第二个参数指定。

## 项目结构

```
academic-report-ppt/
├── SKILL.md                    # AI智能体技能定义
├── package.json
├── templates/
│   ├── manifest.json           # 模板+插槽定义
│   ├── 01-cover.html
│   ├── 02-contents.html
│   ├── ...
│   └── 12-data-stats.html
├── scripts/
│   ├── run-pipeline.js         # 一键管线
│   ├── validate-slides.js      # 预验证
│   ├── fill-template.js        # 基于JSDOM的插槽填充
│   └── html-to-pptx-dom.js    # Puppeteer + dom-to-pptx 转换
└── rules/
    ├── content-rules.md        # SCQA内容生成规则
    ├── template-matching.md    # 模板匹配指南
    └── slides-example.json     # 完整示例slides.json
```

## 自定义

### 主题定制

所有模板均使用在 `:root` 中定义的CSS自定义属性。编辑任意模板的 `<style>` 代码块：

```css
:root {
    --c-primary: #003366;
    --c-accent-red: #CC0000;
    --c-accent-green: #10B981;
    --c-bg: #FFF9F0;
    --c-bg-subtle: #F8FAFC;
    --font-main: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}
```

### 添加模板

1. 在 `templates/` 中创建新的HTML文件（1920×1080视口）
2. 向可填充元素添加 `data-slot="slotName"` 属性
3. 在 `templates/manifest.json` 中注册模板

## 依赖项

| 包名 | 用途 |
|---------|---------|
| `jsdom` | 用于插槽填充的DOM操作 |
| `puppeteer` | 用于HTML渲染的无头Chrome |
| `dom-to-pptx` | 高保真HTML→PPTX转换 |
| `lucide-static` | 离线SVG图标库 |

## 许可证

MIT
