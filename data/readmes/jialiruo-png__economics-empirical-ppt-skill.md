#BRANCH:main
# economics-empirical-ppt-skill

> **经管 / 金融 / 实证类学术论文 PPT 生成 Skill** —— 一个 Claude Code Skill，把一篇实证论文（或一份按页写好的讲稿）一键转成专业级中文学术汇报 PPT。底层基于 [PptxGenJS](https://gitbrent.github.io/PptxGenJS/)，默认 LAYOUT_WIDE (13.33×7.50)。

## 效果速览

下方是同一篇 Food Policy 实证论文（《Information exposure and economic losses during food safety outbreaks》）跑出来的 40 页中文汇报 PPT 截图，覆盖封面、研究背景、文献综述、研究设计、实证结果、政策建议、研究局限六大板块：

![整体板块概览（封面 / 研究背景 / 文献综述）](docs/preview-1-overview.png)

![研究设计 + 实证结果（含 DID 模型、Model 1–5 表格、机制解释、州层异质性）](docs/preview-2-empirical.png)

![结论与讨论（政策建议、五大边际贡献、研究局限、对中国食品安全治理的启示）](docs/preview-3-policy.png)

## 这个 Skill 解决什么问题

经管 / 金融 / 数字经济 / 公管 等方向的实证论文汇报，通常要做到：

- **逐页对应文献结构**：研究背景 → 文献综述 → 假设/识别策略 → 数据与方法 → 结果 → 机制 → 异质性 → 结论与政策
- **支持三线表 + LaTeX 公式 + 高密度图表**：Model 表、回归结果、DID 设定、稳健性检验
- **学术风格统一**：藏蓝主色 + 虚线包色块 + 浅灰底卡片，类似国内高校组会 / 学术答辩常见样式
- **不漏字**：讲稿写了什么 PPT 上就有什么，禁止擅自合并、缩写、压缩

普通"AI 一键做 PPT"工具普遍解决不了上面任何一条。本 Skill 是为这个具体场景打磨的。

## 两条使用路径

### 路径 A — 已有讲稿，按页生成（快路径）

适合：你已经按 `p1 / p2 / p3 ...` 写好每页要讲的内容，只想要 Skill 把它精确排版成 PPT。

```
用户提供分页讲稿
  → 交互选模板风格（4–16 个候选，含浙大蓝、深蓝实证、灰色答辩等）
  → 写 design-lock.json
  → 写 generate.js
  → node generate.js
  → 输出 output/<project>_v1.pptx
  → markitdown QA 自检不漏字
```

通常一轮跑完，不需要中间确认环节。

### 路径 B — 只有 PDF 论文（完整流程）

适合：你只有一篇英文/中文实证论文 PDF，需要 Skill 帮你设计页数、分页、抽证据。

```
PDF 论文 + 你给出的字数 / 页数偏好
  → 抽证据（核心结论、Model 表、Figure、机制段）
  → slides-design.md（分页方案给用户确认）
  → design-lock.json
  → generate.js → node generate.js
  → markitdown QA
```

通常 2–3 轮交互。**Skill 会主动询问你的页数 / 字数 / 风格偏好**，不会拍脑袋。

## 交互设计

这个 Skill 设计上是**协作式**的，不是黑盒一键。Claude 在关键节点会主动 `AskUserQuestion`：

- **页数控制**：你希望多少页？10–15p 精简版？25–35p 中等？40p 完整版？
- **字数密度**：每页字号要 14pt 宽松，还是 10.5pt 高密？
- **风格挑选**：4 大风格 × 16 个细分模板（经管深蓝 / 浙大蓝 / 红色案例 / 灰色答辩 等），按你要交付的场合挑
- **是否带封底致谢页**："敬请老师批评指正" / 英文 Thank You / 不要

无论是 *论文有完整文字稿* 还是 *只有 PDF 没有讲稿*，流程都跑得通。

## 仓库结构

```
economics-empirical-ppt-skill/
├── SKILL.md                          # 主协议（两条路径、6 步流程、铁律）
├── generate.js                       # PPT 渲染主程序（PptxGenJS）
├── design-lock.json                  # 设计锁文件示例
├── formulas.json                     # LaTeX 公式注册表示例
├── package.json                      # node 依赖
├── references/
│   ├── core/                         # 4 份精确版式合同（画布/字体/版式/表格公式）
│   ├── styles/                       # 4 种风格规格
│   ├── template-specs/               # 16 个实战模板的逐项分析
│   ├── slide-types.md                # 7 种通用页面类型
│   ├── pptxgenjs.md                  # PptxGenJS API 用法
│   ├── design-lock.md
│   ├── paper-asset-extraction.md
│   └── pitfalls.md                   # 实现陷阱（颜色、shadow 对象、表格反模式）
├── templates/                        # 项目脚手架模板
│   ├── design-lock.academic.json
│   ├── slides-design.template.md
│   ├── speech-script.template.md
│   └── workflow.template.md
├── scripts/                          # 辅助脚本
│   ├── parse_template.py             # 现场解析一个 .pptx 模板的版式
│   ├── render_formulas.py            # LaTeX → 透明 PNG
│   ├── check_missing.py              # 校验 PPT 是否漏字
│   ├── check_tables.py
│   ├── detect_font.py
│   ├── slides_test.py
│   ├── validate_pptx_canvas.py
│   └── validate_slide_map.py
├── examples/
│   └── minimal-generate.js           # 最小可运行示例
├── assets/                           # 模板素材 / 提取的字体颜色
└── 示例论文与输出展示/
    ├── 食品安全爆发的信息披露和经济损失-main.pdf  # 示例输入论文
    ├── 一二部分-PPT内容.md                       # 示例讲稿（前半）
    ├── 三四部分_PPT内容.md                       # 示例讲稿（后半）
    └── food-safety-info-ppt_v6.pptx              # 最终生成产物
```

## 关键设计原则

1. **逐字契约**：讲稿写什么 PPT 上就出什么，禁止擅自缩写、合并、压缩；容量不够先缩字号、压行距、再多栏，最后才拆页，**永远不删字**
2. **三线表用原生 `addTable`**：禁止 `addShape(line) + addText` 拼接（在 PowerPoint 里那不是表格对象）
3. **公式走 LaTeX → PNG**：项目根目录的 `formulas.json` 注册公式，用 `scripts/render_formulas.py` 渲染成透明 PNG 嵌入；正文里 β / ε 等单符号可继续用 Unicode
4. **底部留白自适应**：内容不够撑满 80% 安全区时，先拉大行距 / 段距 / 表格行高，禁止用占位段落或装饰图凑满
5. **生成后必做 QA**：跑 `markitdown` 提取 PPT 全文与原讲稿对照，确保不漏字

## 快速开始

```bash
# 进入项目目录后
npm install                  # 装 pptxgenjs
node generate.js             # 生成 output/<project>_v1.pptx
```

把这个目录作为 Claude Code Skill 加载后，在 Claude 对话里说"帮我把这篇论文做成 PPT"或"按这份分页讲稿生成 PPT"，Skill 会自动接管整个流程。

## 适用范围

最适合：
- 经济学 / 金融 / 数字经济 / 公共管理 / 农林经济管理 等方向的实证论文汇报
- 浙大 / 人大 / 华农 / 中央财大 等高校的组会汇报、文献汇报、学术答辩
- 投稿前的 Seminar 演讲 / 项目中期答辩

不适合：
- 纯营销 / 商业路演 PPT（风格不匹配，去找设计模板更合适）
- 教学课件、产品演示（页面信息结构差异较大）

## License

MIT
