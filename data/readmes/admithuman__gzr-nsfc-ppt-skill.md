#BRANCH:main
# GZR-NSFC-PPT-Skill：国自然风格学术答辩PPT生成器

> 专为国家自然科学基金（NSFC）答辩场景打造的专业PPT自动生成技能

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Platform: Claude Code](https://img.shields.io/badge/Platform-Claude%20Code-purple)](https://claude.ai/code)

## 📖 项目简介

**GZR-NSFC-PPT-Skill** 是一套面向 Claude Code 的自定义技能包，专注于生成**国家自然科学基金（NSFC，俗称"国自然"=GZR）风格**的专业学术答辩PPT。

通过对多套专业学术PPT模板的深度分析和实战验证，封装出一套完整的 NSFC 深蓝色调PPT自动生成系统，支持：

- 🎨 **8种标准化页面模板**：封面/目录/内容/关键要点/创新点/数据图表/总结展望/致谢
- 🎯 **专业NSFC配色方案**：深蓝主色（#0052CC）+ 强调红（#E53E3E）+ 浅灰背景
- 📐 **16:9宽屏布局**：标准化边距、标题栏、内容区域
- 🤖 **智能内容提取**：从论文/项目书中自动提取关键信息
- 💬 **交互式确认流程**：在创新点、技术路线、实验结果等关键节点暂停确认
- 🖼️ **图片占位系统**：自动生成带标注的占位框，提供图片内容建议

## 📂 项目结构

```
gzr-nsfc-ppt-skill/
├── README.md                           # 本文件
├── SKILL.md                            # 技能定义文件（Claude Code加载入口）
├── .gitignore
├── templates/
│   └── nsfc_defense_style.json         # 核心：NSFC风格页面模板定义（JSON）
├── examples/
│   ├── build_nsfc_report.py            # 示例1：使用python-pptx构建NSFC结题报告PPT
│   └── generate_deep_blue.py           # 示例2：深蓝经典风格的替代实现
├── output/                             # PPTX输出目录
│   └── .gitkeep
└── .claude/
    └── settings.local.json             # Claude Code项目级权限配置
```

### 核心文件说明

| 文件 | 用途 |
|------|------|
| `SKILL.md` | 技能元数据 + 核心工作流定义，Claude Code 通过此文件加载技能 |
| `templates/nsfc_defense_style.json` | NSFC风格完整页面模板配置，包含8种页面类型、配色方案、字体、布局参数、自动生成规则 |
| `examples/build_nsfc_report.py` | 完整示例：用 `python-pptx` 生成一份20页+的国自然结题答辩PPT |
| `examples/generate_deep_blue.py` | 替代实现：深蓝经典风格，展示了不同的辅助函数封装方式 |

## 📋 先决条件

### 1. Claude Code 环境

本技能设计用于 **Claude Code**（Anthropic 官方的 CLI AI 编程助手）。

- Claude Code 安装：请参考 [官方文档](https://docs.anthropic.com/en/docs/claude-code)
- 最低版本：建议使用 Claude Code 最新版本

### 2. 依赖技能（必须安装）

| 技能名 | 用途 | 安装来源 |
|--------|------|---------|
| **`academic-ppt-generator`** | 底层PPTX生成引擎，提供配色方案管理、字体层级处理、导航栏系统 | Claude Code 技能市场 / 本地 `.claude/skills/` 安装 |

**安装方式**：

```bash
# 从技能仓库安装 academic-ppt-generator（如已安装可跳过）
mkdir -p "$HOME/.claude/skills"
cp -R academic-ppt-generator "$HOME/.claude/skills/"

# 然后安装本技能
cp -R gzr-nsfc-ppt-skill "$HOME/.claude/skills/"
```

> **注意**：`academic-ppt-generator` 提供了9种配色方案、3种导航模式、中文字体处理等底层能力。本技能（gzr-nsfc-ppt）在此基础之上，专门针对 NSFC 答辩场景进行了定制封装。

### 3. Python 环境

- **Python 3.8+**（建议 Python 3.10+）

### 4. Python 依赖包

```bash
pip install python-pptx
```

> `python-pptx` 是唯一的 Python 依赖，用于直接生成 `.pptx` 文件。

### 5. 中文字体（重要）

PPTX 文件的渲染效果取决于系统中安装的字体。为确保最佳效果，**强烈建议**安装以下字体：

| 字体名 | 用途 | 免费替代方案 |
|--------|------|-------------|
| **思源黑体** (Source Han Sans) | 中文标题 + 正文 | ✅ 免费可商用 |
| **思源宋体** (Source Han Serif) | 封面上使用 | ✅ 免费可商用 |
| **Arial** | 英文/数字 | ✅ 系统自带 |
| **微软雅黑** | 备用中文字体 | ⚠️ 仅限Windows，商用需授权 |

**字体安装建议**：
- Windows：从 [Google Fonts](https://fonts.google.com/) 或 [Adobe Fonts](https://fonts.adobe.com/) 下载思源系列字体
- macOS：`brew install font-source-han-sans` 或从 Adobe Fonts 安装
- Linux：`sudo apt install fonts-source-han-sans`（Debian/Ubuntu）

> ⚠️ **字体版权提示**：本技能生成的PPT中使用的字体仅供个人学习、研究或欣赏目的使用。如需商用，请自行向版权方购买商用版权。

### 6. 可选依赖

| 工具 | 用途 |
|------|------|
| **Tesseract OCR** | 如果从PDF提取文本内容，用于PDF的OCR识别 |
| **Poppler** | PDF页面渲染（配合Tesseract使用） |

## 🚀 快速开始

### 方式一：Claude Code 技能调用（推荐）

在 Claude Code 会话中直接调用：

```text
请使用 gzr-nsfc-ppt 技能帮我制作一份国自然结题答辩PPT。

项目信息如下：
- 项目名称：基于XXX的XXX研究
- 项目编号：XXXXXXXX
- 负责人：XXX 教授
- 依托单位：XX大学 XX学院
- 执行期：202X年1月 — 202X年12月
- 主要研究成果：[在此列出]
```

技能将自动：
1. 提取和组织内容
2. 在关键节点暂停确认
3. 生成完整的PPTX文件

### 方式二：直接运行 Python 脚本

```bash
# 参考 examples/ 目录中的脚本，修改内容后直接运行
cd gzr-nsfc-ppt-skill
python examples/build_nsfc_report.py
```

生成的 PPTX 文件默认保存在 `output/` 目录。

### 方式三：使用模板 JSON 自定义

```python
import json
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

# 加载 NSFC 风格模板
with open('templates/nsfc_defense_style.json', 'r', encoding='utf-8') as f:
    template = json.load(f)

# 读取全局样式配置
colors = template['global_style']['color_scheme']
fonts = template['global_style']['font_family']
layout = template['global_style']['layout']

# 使用 python-pptx 按模板参数生成幻灯片
# 完整示例参见 examples/build_nsfc_report.py
```

## 🎨 NSFC 风格配色参考

| 颜色名称 | 色值 | 用途 |
|---------|------|------|
| 主色深蓝 (Primary Dark Blue) | `#0052CC` | 标题栏背景、封面背景、强调色条 |
| 主色浅蓝 (Primary Light Blue) | `#4C9AFF` | 装饰线、辅助色块、次级标题 |
| 深灰 (Dark Gray) | `#333333` | 正文内容 |
| 浅灰背景 (Light Gray) | `#F5F7FA` | 卡片背景、高亮框背景 |
| 强调红 (Accent Red) | `#E53E3E` | 关键词高亮、问题标注、创新点强调 |
| 强调橙 (Accent Orange) | `#FF8C00` | 流程图箭头、连接线 |

**字体与字号层级：**

| 级别 | 字号 | 字体 | 使用位置 |
|------|------|------|---------|
| 封面主标题 | 54pt | 思源黑体 Bold | 封面页项目名 |
| 封面副标题 | 32pt | 思源黑体 Regular | 封面页项目全称 |
| 页面标题 | 32pt | 思源黑体 Bold | 每页标题栏 |
| 章节标题 | 28pt | 思源黑体 Bold | 内容区小节标题 |
| 正文 | 22pt | 思源黑体 Regular | 正文内容 |
| 图片标注 | 18pt | 微软雅黑 | 图表说明 |
| 页脚 | 14pt | Arial | 页码、来源标注 |

## 📄 页面模板详解

### 1. 封面页 (cover)
- 全幅深蓝背景 + 浅蓝装饰元素
- 项目类别 + 主标题 + 副标题 + 负责人 + 单位 + 日期
- 英文章标题可选

### 2. 目录页 (toc)
- 左侧竖排"汇报答辩"标签
- 右侧5项导航条目（圆角矩形 + 编号）
- "CONTENTS"竖排英文装饰

### 3. 通用内容页 (content_general)
- 顶部深蓝标题栏（章节编号 + 标题）
- 两栏布局：左文右图
- 底部来源标注

### 4. 关键要点页 (key_point)
- 高亮问题框（浅灰底 + 蓝色边框）
- 关键词红色高亮
- 流程图/技术路线（节点 + 箭头连接）

### 5. 创新点页 (innovation_points)
- 创新点概述条（红色强调框）
- 横向创新点流程（圆角矩形卡片）
- 图片网格区（3列）

### 6. 数据图表页 (data_chart)
- 左侧大图表区（支持折线图/柱状图）
- 右侧数据卡片网格（2×2，显示关键指标）
- 每个卡片：顶部色条 + 数值 + 标签

### 7. 总结与展望页 (conclusion)
- 左右双栏布局
- 左侧：主要成果（带编号列表）
- 右侧：未来展望

### 8. 致谢页 (acknowledgement)
- 全幅深蓝背景（同封面风格）
- 居中大字"感谢各位领导专家"
- 联系信息（邮箱 + 电话）

## 🔧 自定义与扩展

### 修改配色方案

编辑 `templates/nsfc_defense_style.json` 中的 `global_style.color_scheme` 部分：

```json
{
  "global_style": {
    "color_scheme": {
      "primary_dark_blue": "#0052CC",
      "primary_light_blue": "#4C9AFF",
      "secondary_dark_gray": "#333333",
      "secondary_light_gray": "#F5F7FA",
      "accent_red": "#E53E3E",
      "accent_orange": "#FF8C00"
    }
  }
}
```

### 添加新页面模板

在 `page_templates` 数组中添加新的页面定义对象，包含：
- `page_id`：页面唯一标识
- `page_name`：页面名称
- `background_color`：背景色
- `elements`：页面元素数组（支持 text、title_bar、container、highlight_box、flow_chart、image_grid 等类型）

### 与 academic-ppt-generator 的关系

```
┌─────────────────────────────────┐
│   gzr-nsfc-ppt-skill (本技能)   │  ← NSFC专用：页面模板、确认流程、配色定制
│   "国自然答辩PPT一键生成"        │
├─────────────────────────────────┤
│   academic-ppt-generator         │  ← 通用引擎：配色方案库、导航栏系统、字体层级
│   "9种配色 + 3种导航 + 6种场景"  │
├─────────────────────────────────┤
│   python-pptx                    │  ← 底层库：PPTX文件读写、形状绘制、文字渲染
└─────────────────────────────────┘
```

## 🧪 测试验证

本技能已在以下场景验证通过：

| 场景 | 页数 | 复杂度 | 验证状态 |
|------|------|--------|---------|
| 国自然面上项目结题汇报 | 14页 | ⭐⭐⭐⭐ | ✅ 通过 |
| 国自然面上项目成果答辩 | 17页 | ⭐⭐⭐ | ✅ 通过 |
| 重点研发计划申报 | 待验证 | ⭐⭐⭐⭐⭐ | ⏳ 计划中 |

## 📝 已知限制

1. **图片占位**：本技能生成图片**占位框**（浅蓝色矩形 + 标注文字），不自动生成实际数据图表。用户需手动替换为实际图片。
2. **数学公式**：复杂的 LaTeX 公式需要渲染为图片后插入。
3. **字体渲染**：生成的 PPTX 在未安装指定字体的系统中打开时，会自动降级为系统默认字体，可能影响排版效果。
4. **图表绘制**：`python-pptx` 的原生图表支持有限；复杂图表建议用 matplotlib 生成图片后插入。

## 🤝 贡献与反馈

欢迎提交 Issue 和 Pull Request！主要改进方向：

- [ ] 支持更多NSFC子类型（青年基金、重点项目、杰青等）
- [ ] 自动化数学公式渲染与插入
- [ ] 集成 matplotlib 实现数据图表自动生成
- [ ] 更多页面模板变体（三栏布局、时间线、对比表）
- [ ] 英文版NSFC风格（面向国际合作项目）

## 📜 致谢

本技能的配色方案和页面布局参考了以下来源：

- 国家自然科学基金公开的答辩PPT模板风格
- 多所985高校科研团队的实际答辩PPT
- `academic-ppt-generator` 技能提供的底层引擎和配色方案库

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 开源。

---

**Made with ❤️ for the Chinese research community**
