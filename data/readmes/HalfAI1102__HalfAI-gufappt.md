#BRANCH:main
# 古法 PPT Skill

Author: HalfAI

古法 PPT 是一个本地 AI Skill，用来生成可在 PowerPoint / WPS 里继续编辑的传统风格 `.pptx`。它的目标不是做一份很像网页的 HTML 幻灯片，而是回到学校、职场、答辩、汇报里真正会被打开、修改、交付的那种 PPT。

Agent 负责理解资料、写大纲和选择素材；本 Skill 负责模板约束、版式节奏、文本容量控制、背景图注入和 PPTX 导出。

## 核心能力

- 生成原生 PPTX：文本框、图片、表格、形状都尽量保持可编辑。
- 29 套原创传统模板：覆盖学术、教育、政务、企业、医疗、农业、城市、旅游、文学、美食等场景。
- 模板封面背景兜底：如果 Agent 没有提供更合适的封面图，系统会自动把模板默认封面背景传入 cover slide。
- 版式差异化：每套模板有自己的封面、章节、图文页和报告页节奏，不只换一张背景图。
- 文本安全规则：限制标题、紧凑卡片、长段正文和表格单元格字数，减少文字重叠。
- 空白页防护：图片版式必须有真实图片；无图时自动回退为文本型版式，避免出现大块空白占位。
- 导出审计：检查图片数量、版式重复、相邻重复、文字过载和异常空白形状。
- 本地优先：运行期素材和输出默认留在本机，不需要上传到第三方服务。

## 目录结构

```text
skills/gufappt-generate/   # Skill 入口与 Agent 规则
src/                       # PPTX 生成内核
scripts/                   # 本地执行脚本
assets/template-assets/    # 模板内置背景图，应该提交
assets/content-assets/     # 运行期内容素材，不建议提交
docs/                      # 使用说明、模板指南和参考洞察
tests/                     # 单元测试
outputs/                   # 本地输出目录，已被 git ignore
```

## 快速开始

```bash
npm install
npm run typecheck
npm test
```

生成 PPTX：

```bash
npm run deck:compose -- --spec /tmp/gufappt-spec.json --pptx /tmp/gufappt-output.pptx
```

导出后审计：

```bash
npm run deck:audit -- --pptx /tmp/gufappt-output.pptx --min-media 4 --max-repeated-layout 3 --max-adjacent-layout 2 --min-image-page-ratio 0.25 --max-slide-text-chars 520 --max-text-run-chars 70 --max-large-blank-shapes 1 --forbid-section-page-numbers
```

## Agent 调用流程

Agent 调用 `skills/gufappt-generate` 时，应先向用户说：

```text
欢迎使用古法 PPT。我会先帮你确认资料和大纲，再直接导出 PPTX。
```

然后确认两件事：

1. 用户已有资料，还是只有主题。
2. 目标听众、页数、场景和模板倾向。

用户确认大纲后，Agent 再整理资料、搜集或生成图片、写 deck spec、运行导出脚本，并用审计脚本检查结果。

## 资料整理

```bash
npm run materials:collect -- --input /path/to/materials --output /tmp/gufappt-materials.json --context /tmp/gufappt-context.txt
```

## 模板贡献

模板位于 `src/lib/templates`。新增模板时请遵守：

- 只提交原创版式、配色和文案，不复制第三方模板素材。
- 每套模板至少覆盖封面、目录、章节页、正文、图文、图表、总结、致谢页。
- 每套模板必须有明确差异，而不是同一版式换背景。
- 模板应偏传统汇报，不做 AI 营销海报感。
- 所有模板必须输出统一 `DeckSchema`。

## 隐私与仓库卫生

- `outputs/` 是本地生成结果目录，可能包含用户资料，不提交。
- `assets/content-assets/` 是运行期素材目录，可能包含用户图片，不提交。
- `assets/template-assets/` 是模板内置素材目录，需要提交。
- 发布前请运行 typecheck、test 和 deck audit。

## 许可证

MIT
