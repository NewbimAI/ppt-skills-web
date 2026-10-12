#BRANCH:master
# slideweaver

程序化生成学术 PPT 的 Claude / Codex agent skill。适合论文汇报、答辩、组会、开题与中期检查、学术报告、基金与项目申报、poster。

不依赖任何第三方模板。每一页都用 `python-pptx` + 布局求解 + 形状库程序化生成，图标用自带的开源 SVG 库。这样离线也能跑，产物可复现、可审计，不引入版权或来源不明的素材。

## 特点

- **结论式排版**：标题写结论而非主题词，一页一个发现。
- **原生可编辑对象**：表格、图表、形状、SVG 图标都是 PowerPoint 原生对象，不贴截图。
- **布局求解**：`smart_layout.py` 自动选网格或堆叠，检查边界、重叠、容量和连线避让。
- **形状库**：`shape_cookbook.py` 提供流程、层级、关系、矩阵、时序等十余种可编辑示意图。
- **排版底线**：正文不低于 14pt，导出 PDF/PNG 逐页 QA。
- **损坏防护**：`verify_opens_com` / `verify_charts_com` 用 PowerPoint 读写打开验证文件不损坏、图表不丢失。

## 安装

克隆到 Claude Code 的 skills 目录，并拉取图标库 submodule：

```bash
git clone --recurse-submodules https://github.com/RFYoung/slideweaver.git ~/.claude/skills/slideweaver
```

已经克隆但没拉 submodule 的，在 skill 根目录补一次：

```bash
git submodule update --init --recursive
```

## 依赖

- Python：`python-pptx`、PyMuPDF、Pillow；Windows 上的 COM 渲染需要 pywin32 和本机 PowerPoint。
- 图标库（git submodule，均为开源协议）：[bootstrap-icons](https://github.com/twbs/icons)、[heroicons](https://github.com/tailwindlabs/heroicons)、[tabler-icons](https://github.com/tabler/tabler-icons)、[simple-icons](https://github.com/simple-icons/simple-icons)。

## 用法

把本目录作为 skill 交给 Claude Code 或 Codex，按 `SKILL.md` 的工作流新建或打磨 `.pptx`。详细规则见 [SKILL.md](SKILL.md)。

## 许可

代码以 MIT 协议发布，见 [LICENSE](LICENSE)。图标库各自遵循其上游协议。
