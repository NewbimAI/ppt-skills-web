#BRANCH:main
# SJTUBeamer PPT

[Claude Code](https://claude.ai/code) skill — 基于 [SJTUBeamer](https://github.com/sjtug/SJTUBeamer) 模板，生成上海交通大学风格的 LaTeX Beamer 学术幻灯片。

## 功能

- 生成高质量学术幻灯片（PDF），完美支持中文和数学公式
- 4 套预设模板：学术报告、通用讲座、毕业答辩、组会汇报
- PDF → PPTX 转换（PyMuPDF 图片模式，通用兜底）
- 可选**演讲备注生成**（python-pptx 写入 notes）
- 支持中英文双语版本同步生成

## 安装

skill 目录位于 `~/.claude/skills/sjtu-beamer-ppt/`，Claude Code 自动加载。

### 前置依赖

1. **MiKTeX**（含 XeLaTeX）：
   ```powershell
   winget install MiKTeX.MiKTeX
   ```

2. 运行环境配置：
   ```powershell
   pwsh -File scripts/setup_env.ps1
   ```

3. **Python 依赖**（PPTX 转换 + 备注）：
   ```bash
   pip install PyMuPDF python-pptx Pillow
   ```

## 使用

在 Claude Code 中说"帮我制作 Beamer 幻灯片"或"用 LaTeX 做一个学术报告 PPT"即可触发。

### 典型流程

1. Claude 理解内容 → 选择主题预设
2. 生成 `.tex` 文件
3. 编译 PDF
4. 转 PPTX + 可选添加讲稿备注

## 模板

| 模板 | 文件 | 主题预设 |
|------|------|----------|
| 学术报告 | `templates/academic-report.tex` | `maxplus,red,light,shadow` |
| 通用讲座 | `templates/basic-lecture.tex` | `maxplus,red,light,shadow` |
| 毕业答辩 | `templates/thesis-defense.tex` | `max,red,dark,shadow` |
| 组会汇报 | `templates/group-meeting.tex` | `min,blue,light,shadow` |

## 文件结构

```
sjtu-beamer-ppt/
├── SKILL.md              # skill 入口
├── README.md             # 本文件
├── templates/            # 4 套 .tex 模板
├── references/           # 编写/编译/主题/讲稿指南
├── scripts/              # 编译/转换/预览脚本
└── assets/SJTUBeamer/    # SJTUBeamer 模板文件 (.sty + vi/)
```

## 参考资料

- [Beamer 主题选项](references/beamer-theme-options.md)
- [.tex 编写指南](references/tex-generation-guide.md)
- [编译指南](references/compilation-guide.md)
- [讲稿备注指南](references/speaker-notes-guide.md)
- [PDF→PPTX 转换](references/pdf-to-pptx-conversion.md)

## 许可

SJTUBeamer 模板使用 Apache-2.0 许可。校徽资源由上海交通大学持有版权。
