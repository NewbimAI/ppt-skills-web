#BRANCH:main
# Company SVG Skill

`company-svg` 是一个用于生成公司规范 SVG 汇报图的 Codex skill。它适合把经营分析、咨询汇报、策略拆解、流程说明、矩阵判断等内容输出为可直接插入 PPT 的 `.svg` 图片。

## 能力概览

- 使用公司品牌色：主色、辅助色、白底规范。
- 使用公司 PPT 模板版式：一级标题、分隔线、二级标题、内容区、右上角 logo。
- 内置公司 logo、PPT 模板参考和 7 个字重的思源黑体 CN。
- 按 SVG 实际文字和字重生成字体子集并内嵌，避免换机、分享或合成 PPTX 后字体替换。
- 提供当前用户级的一键字体检查与安装，方便编辑 PowerPoint 原生文本框。
- 使用麦肯锡金字塔沟通方法组织内容。
- 增强内容逻辑关系：支持金字塔支撑、因果链、优先级矩阵、流程闭环、对比权衡。
- 多页材料按顺序逐页生成：完成第 1 页并校验后，再开始第 2 页。
- 输出自包含 SVG：logo 以内嵌 PNG data URL 方式写入，便于分享和插入 PPT。
- 自动把一组已完成 SVG 合成为一个 PPTX 文件。
- 提供校验脚本，检查白底、品牌色、logo、内嵌字体、标题版式、布局重叠和内容逻辑注释。

## 目录结构

```text
.
├── README.md
├── examples/
│   └── company-svg-test.svg
└── skills/
    └── company-svg/
        ├── SKILL.md
        ├── agents/
        │   └── openai.yaml
        ├── assets/
        │   ├── fonts/
        │   │   └── source-han-sans-cn/
        │   │       ├── SourceHanSansCN-*.otf
        │   │       ├── LICENSE.txt
        │   │       └── NOTICE.txt
        │   ├── logo/
        │   │   └── company-logo.png
        │   └── ppt-template/
        │       ├── PPT模板参考.pptx
        │       └── 公司PPT模板.pptx
        ├── references/
        │   ├── brand.md
        │   ├── content-logic.md
        │   ├── layout.md
        │   ├── pyramid-communication.md
        │   └── typography.md
        └── scripts/
            ├── embed_svg_fonts.py
            ├── install_fonts.py
            ├── validate_svg.py
            └── svg_to_pptx.py
```

## 安装

把 `skills/company-svg` 复制到 Codex 的 skills 目录。

默认位置：

```bash
mkdir -p ~/.codex/skills
cp -R skills/company-svg ~/.codex/skills/
```

如果你使用了自定义 `CODEX_HOME`：

```bash
mkdir -p "$CODEX_HOME/skills"
cp -R skills/company-svg "$CODEX_HOME/skills/"
```

重启 Codex 后，skill 会以 `$company-svg` 的方式被发现和调用。

安装 Skill 本身不会静默修改系统字体。自包含 SVG 和当前 SVG-backed PPTX 流程不依赖系统已安装字体；只有需要编辑 PowerPoint 原生文本框时，才需要执行下面的可选字体安装。

## 可编辑 PPT 字体安装

先检查当前用户是否已经安装全部 7 个字重：

```bash
python3 skills/company-svg/scripts/install_fonts.py --check
```

确认需要安装后执行：

```bash
python3 skills/company-svg/scripts/install_fonts.py --install
```

脚本支持 macOS、Windows 和 Linux，默认写入当前用户字体目录，不请求管理员权限。安装完成后需要重启 PowerPoint 等已经打开的设计软件。若目标目录存在同名但内容不同的字体，脚本会停止并报告冲突，不会自动覆盖。

## 使用示例

生成一页汇报 SVG：

```text
Use $company-svg 根据这份经营分析材料生成 1 页 SVG 汇报图，要求白底、公司品牌色、右上角 logo、一级标题/二级标题遵循 PPT 模板参考，并使用金字塔结构表达结论。
```

把材料做成两页汇报：

```text
Use $company-svg 把 历史使用文件/经分会PPT/细分产品流失分析-分析.docx 做成 1-2 页 PPT 汇报材料。要求每完成一页 SVG 就先保存并校验，再继续下一页；全部 SVG 完成后自动合成一个 PPTX 文件。
```

修改已有 SVG：

```text
Use $company-svg 检查并修改 outputs/company-svg-test.svg，使它符合公司模板标题版式、品牌色、logo 和内容逻辑规则。
```

## 输出要求

生成的 SVG 默认遵循：

- 画布：`1280 x 720`
- 背景：白色 `#FFFFFF`
- 一级标题：基线约 `x=68 y=92`
- 分隔线：约 `y=113`
- 二级标题：基线约 `x=68 y=160`
- 内容区：约从 `y=193` 开始
- Logo：右上角，约 `x=1150 y=50 width=64 height=64`
- 字体：`Company Source Han Sans CN`，正文默认 400，标题和重点默认 700

每份 SVG 还应包含两类注释：

```xml
<!-- Brand colors: Brand Red #E50049, Brand Cyan #00B3ED, Brand Navy #00125D, Brand Gold #DAB866, Brand Gray #B4B4B4, White #FFFFFF -->
<!-- Logic: pattern=priority matrix | storyline=现象->判断->行动 | criteria=风险,规模,承接空间 | implication=优先聚焦重点客群 -->
```

其中 `Logic:` 注释用于记录页面内容的逻辑骨架，不会显示在图片上。

## 多页生成与 PPTX 合成

多页任务默认采用顺序工作流：

1. 生成 `01_*.svg`
2. 运行 `embed_svg_fonts.py --in-place`，按实际文字生成并内嵌字体子集
3. 立即运行 `validate_svg.py` 校验并修复
4. 生成 `02_*.svg`
5. 重复“字体内嵌 → 校验”，直到最后一页
6. 全量复检所有 SVG
7. 运行 `svg_to_pptx.py` 合成 PPTX

手动复检与合成命令：

```bash
skills/company-svg/scripts/embed_svg_fonts.py \
  <svg-output-folder>/*.svg \
  --in-place
skills/company-svg/scripts/validate_svg.py <svg-output-folder>/*.svg
skills/company-svg/scripts/svg_to_pptx.py <svg-output-folder> \
  --out <svg-output-folder>/<deck-name>.pptx \
  --validate
```

合成结果是一页 SVG 对应一页 PPT，顺序按照文件名自然排序，例如 `01_...svg`、`02_...svg`、`10_...svg`。

字体脚本默认自动识别页面中使用的字重；安装了 FontTools 时会只保留 SVG 实际用到的字符。若运行环境没有 FontTools，脚本仍可内嵌完整 OTF，但文件会明显增大。每次修改可见文字后都应重新运行字体脚本。

## 校验

可以用内置脚本校验 SVG：

```bash
skills/company-svg/scripts/validate_svg.py examples/company-svg-test.svg
```

通过时会输出：

```text
OK: SVG passes required structural checks
```

校验内容包括：

- SVG/XML 是否有效
- 是否有白底
- 是否嵌入正确 logo
- 是否包含 `company-fonts` 字体块、有效字体 data URL，以及页面实际使用的全部字重
- 是否符合 PPT 标题版式
- 是否存在独立矩形区块重叠
- 是否使用允许的品牌色
- 是否包含 `Logic:` 内容逻辑注释

## 重要提醒

本 skill 包含公司 logo 和 PPT 模板参考文件。如果这些资产属于内部资料，请把 GitHub 仓库设为 private；如果要公开发布，请先替换或移除 `skills/company-svg/assets/` 中的公司专属素材。

思源黑体 CN 字体文件的元数据声明其采用 Apache License 2.0；完整许可证与版权说明位于 `skills/company-svg/assets/fonts/source-han-sans-cn/`。
