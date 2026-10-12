#BRANCH:main
# HFUT Presentation Studio

HFUT Presentation Studio 是一个用于制作、改版、动画化和播放合肥工业大学及宣城校区主题演示文稿的 Codex Skill。它从内置模板库中选择并融合真实 PowerPoint 页面，输出保持可编辑的 `.pptx`，同时提供结构审计、保守优化、原生动画审计和播放控制。

调用方式：

```text
$hfut-presentation-studio
```

## 核心规则

每一份新建或大幅改版的演示文稿都必须选择**恰好三套不同模板**（exactly three distinct templates），并固定承担以下角色：

- `visual_anchor`：视觉锚点，负责字体、色彩、校徽、页眉页脚和整体品牌语言，占 `60%`。
- `layout_donor`：版式供体，负责流程、对比、分栏和复杂图文结构，占 `25%`。
- `accent_donor`：强调供体，负责数据、摄影或重点页面，占 `15%`。

`60% / 25% / 15%` 表示设计所有权，不是把三种互不相关的风格机械拼接。所有供体页面都要重新映射到视觉锚点，最终形成一个统一视觉系统（one visual system）。

身份字段遵循绝对留空原则：汇报人、姓名（name）、班级（class）、专业（major）、学院（college）、学号（student ID）和日期（date），凡用户未明确提供（explicitly supplied），都必须留空或删除（blank or removed）。禁止默认使用用户姓名、`软件工程`、模板示例或推断出的个人信息（never default）。

## 环境要求

- Python 3：模板选择、模板库验证和 PPTX 结构审计。
- Windows PowerShell 5.1：运行内置 PowerShell 脚本。
- 桌面版 Microsoft PowerPoint 与 PowerPoint COM：构建融合起始稿、实际优化、生成和审计原生动画，以及实际播放。
- Codex Presentations 运行时：编辑、逐页渲染和联系表检查。

`audit_presentation.py` 和播放脚本的 `-ValidateOnly` 不需要 PowerPoint COM。融合起始稿创建必须使用 PowerPoint COM，COM 不可用时会失败。原生动画生成和动画审计同样必须使用 PowerPoint COM，COM 不可用时会失败。优化与实际播放在 COM 不可用时会明确报告跳过；必须检查标准输出，不能把“跳过”当成已完成。

## 安装

克隆到规范目录：

```powershell
git clone https://github.com/linmohan00-rgb/hfut-presentation-studio.git `
  "$env:USERPROFILE\.codex\skills\hfut-presentation-studio"
```

验证安装：

```powershell
python "$env:USERPROFILE\.codex\skills\hfut-presentation-studio\scripts\validate_template_bank.py"
```

新建 Codex 任务后可这样调用：

```text
使用 $hfut-presentation-studio 制作一份 12 页、7 分钟的合工大课堂汇报 PPT。
所有未提供的汇报人、班级、专业等身份字段保持空白。
```

## 制作流程

完整流程如下：

```text
读取需求 -> 选择恰好三套模板 -> 编写论点主线 ->
锁定角色化设计契约 -> 构建融合起始稿 -> 编辑真实模板页面 ->
结构审计 -> 按许可保守优化 -> 逐页渲染 ->
检查单页与联系表 -> 按需生成和审计原生动画 -> 交付 -> 按需播放
```

`references/layout-policy.json` 定义角色化密度：`cover`、`section`、`closing` 为低密度；`agenda`、`content`、`comparison`、`process`、`summary` 为中密度；`data` 为高密度。密度是内容预算，不是塞满页面的理由。

### 选择与构建

```powershell
python scripts/select_templates.py `
  --brief "formal HFUT project report for engineering faculty; evidence-led and modern" `
  --slides 12 `
  --sections 3 `
  --include academic-clean `
  --exclude winter-grey,autumn-orange `
  --output "work\template-selection.json"

powershell -ExecutionPolicy Bypass -File scripts/build_fusion_starter.ps1 `
  -Plan "work\template-selection.json" `
  -Output "work\fusion-starter.pptx"
```

`--include` 与 `--exclude` 是可选的逗号分隔模板 ID。选择器始终输出 `visual_anchor`、`layout_donor`、`accent_donor` 三个角色；融合脚本会拒绝任何不是恰好三套唯一模板的计划。`build_fusion_starter.ps1` 可使用 `-Force` 覆盖已有输出。

选择器会在评分前检查 14 套精选模板是否齐全。融合构建器禁止把输出写回 `assets/templates/`，通过临时文件成功生成后再替换目标，并默认把复制页面的主字体和非中性色强调元素映射到 `visual_anchor`。只有确实需要保留供体原始样式供后续分析时，才使用 `-SkipStyleNormalization`。

编辑前先写 `claim-spine.txt`，再确定安全边距、网格、字号层级、颜色、图片裁切、页眉页脚、品牌归属和各角色密度。必须在复制出的真实模板页面上编辑，并清除供体残留与占位内容。

### 结构审计

```powershell
python scripts/audit_presentation.py `
  --input "work\draft.pptx" `
  --policy "references\layout-policy.json" `
  --json "work\qa\layout-audit.json" `
  --markdown "work\qa\layout-audit.md"
```

参数包括 `--input`、`--policy`、`--json`、`--markdown`；默认报告名为 `layout-audit.json` 和 `layout-audit.md`。

- 退出码 `0`：报告已生成，没有错误级问题。
- 退出码 `2`：报告已生成，但仍有一个或多个错误级问题。
- 退出码 `1`：输入、策略、输出路径或审计执行失败。

结构审计检查页面边界、安全边距、字号、可检测重叠、相邻重复宏版式、占位文本和空身份字段；现在也会递归检查组合对象，并读取段落默认字号。无法从页面 XML 解析字号的文本会明确报告 `font_size_unresolved`。组合内部坐标只报告、不自动移动。文字真实溢出、对齐质量、对比度、图片变形、模板残留和图表标注仍必须通过渲染后人工检查。

### 保守优化

只有在用户允许自动优化时才运行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/optimize_presentation.ps1 `
  -InputPath "work\draft.pptx" `
  -OutputPath "work\draft.optimized.pptx" `
  -AuditPath "work\qa\layout-audit.json" `
  -PolicyPath "references\layout-policy.json"
```

优化器接受 `-InputPath`、`-OutputPath`、可选 `-AuditPath`、可选 `-PolicyPath` 和 `-Force`。输入与输出必须不同；`-Force` 只能替换独立输出，源文件始终保持不变。

优化器会验证外部审计的结构与源文件身份，但不会信任其问题列表；每次都先对真实输入重新审计，只执行白名单中的低风险修复：轻微越界、已确认占位文本和空身份对象。优化前报告写在输出旁，优化后报告名为 `<output-stem>.layout-audit.json` 与 `<output-stem>.layout-audit.md`。

- 退出码 `0`：优化完成且优化后无错误；或 PowerPoint COM 不可用，标准输出明确显示 `optimizer skipped`。
- 退出码 `2`：独立优化文件已经生成，但优化后仍有错误级问题。
- 退出码 `1`：路径安全、验证、审计、文件或 PowerPoint 执行失败。

COM 跳过时的退出码 `0` 不代表优化成功。必须检查标准输出、优化前后报告与独立输出。

### 渲染与检查

使用已安装的 Codex Presentations 运行时工具：

```powershell
python "<Presentations-skill>\container_tools\render_slides.py" `
  "work\draft.optimized.pptx"

python "<Presentations-skill>\container_tools\create_montage.py" `
  --input_dir "work\draft.optimized" `
  --output_file "work\preview\contact-sheet.png"
```

必须逐页渲染并以全尺寸检查每一张 PNG，确认无裁切、溢出、错误换行、非预期重叠、弱对比、图片变形、身份默认值、占位符和页脚不一致。联系表用于检查顺序、节奏、密度与视觉系统一致性，不能替代逐页检查。修改后重新审计并重新渲染。

### 动态演示

需要动态演示时，先完成静态版的结构审计和逐页视觉检查，再生成独立的动态版：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/add_presentation_animations.ps1 `
  -InputPath "work\draft.optimized.pptx" `
  -OutputPath "work\output\final.animated.pptx" `
  -AuditPath "work\qa\animation-manifest.json" `
  -ExistingAnimationMode Replace `
  -PlaybackMode Manual `
  -Force
```

动画顺序遵循固定规则：先按视觉行从上到下，再在同一行内从左到右。标题和短标签使用克制的淡入，正文使用从左侧进入的擦除效果，禁止把方向反过来。脚本不会覆盖输入文件，并通过临时文件成功保存后再替换动态输出。

`ExistingAnimationMode Preserve` 是默认值，适合修改已有动画稿，只为尚未动画的合格文本补充效果；`Replace` 会清空原序列并生成严格统一的新序列。`PlaybackMode Manual` 允许标题点击出现；`PlaybackMode Auto` 会取消生成动画中的点击触发，并按每页动画总时长加 `AutoHoldSeconds` 自动写入页面计时。

生成后必须运行动画专项审计：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/audit_presentation_animations.ps1 `
  -Path "work\output\final.animated.pptx" `
  -JsonPath "work\qa\animation-audit.json" `
  -MarkdownPath "work\qa\animation-audit.md" `
  -PlaybackMode Manual
```

审计会逐页确认每个合格文本对象恰好有一个动画、播放序列为按行从上到下且同行从左到右、效果仅使用淡入或从左侧进入的擦除，并检查淡化转场。Auto 模式还会检查没有点击触发且每页存在有效自动计时。退出码 `0` 表示通过；退出码 `2` 表示报告已生成但仍有问题；退出码 `1` 表示参数、文件、PowerPoint COM 或执行失败。两个脚本都不会调用 `Application.Quit`，不会关闭用户其他演示文稿。

### 播放

只校验参数，不启动 PowerPoint：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/play_presentation.ps1 `
  -Path "work\output\final.pptx" `
  -Mode Auto `
  -StartSlide 2 `
  -EndSlide 10 `
  -SecondsPerSlide 8 `
  -Loop `
  -CloseAfter `
  -ValidateOnly
```

手动播放：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/play_presentation.ps1 `
  -Path "work\output\final.pptx" `
  -Mode Manual `
  -StartSlide 1 `
  -EndSlide 12 `
  -CloseAfter
```

自动播放：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/play_presentation.ps1 `
  -Path "work\output\final.pptx" `
  -Mode Auto `
  -StartSlide 2 `
  -EndSlide 10 `
  -SecondsPerSlide 8 `
  -Loop `
  -CloseAfter
```

播放由 `PlaybackMode Auto` 生成的动态版时，优先使用内嵌计时：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/play_presentation.ps1 `
  -Path "work\output\final.animated.pptx" `
  -Mode Auto `
  -UseEmbeddedTimings `
  -CloseAfter
```

`Manual` 使用键盘或鼠标翻页；`Auto` 默认使用 `-SecondsPerSlide` 自动翻页，范围为 `0.5` 到 `3600` 秒，默认 `8` 秒。`-UseEmbeddedTimings` 仅适用于 `Auto`，会保留动画生成器计算的逐页时长。`-StartSlide` 与 `-EndSlide` 指定闭区间；省略 `-EndSlide` 时播放到最后一页。`-Loop` 循环指定区间。

`-CloseAfter` 会结束放映，并通过带超时的辅助进程按完整路径关闭脚本打开的演示文稿。生产脚本不会调用 `Application.Quit`，也不会关闭其他演示文稿；已有 PowerPoint 会话及其中的其他文件保持运行。若脚本启动了一个全新的 PowerPoint，关闭演示文稿后可能保留一个空的 PowerPoint 窗口，用户可自行退出。不使用 `-CloseAfter` 时，播放结束后保留演示文稿。`-ValidateOnly` 只检查文件、页数、范围和解析后的参数，不启动 COM。播放只修改当前会话中的计时设置，并验证源文件未被修改。

- 退出码 `0`：参数校验或播放完成；或 PowerPoint COM 不可用，标准输出明确显示 `playback skipped`。
- 退出码 `1`：参数、文件、PowerPoint 执行、清理或源文件完整性检查失败。

播放脚本不使用退出码 `2`。COM 跳过时的退出码 `0` 不代表实际完成播放。

## 验证

```powershell
python scripts/validate_template_bank.py
python -m unittest discover -s tests -v
```

PowerPoint COM 不可用时，依赖 PowerPoint 的行为测试会明确显示跳过。

## 从旧版本迁移

旧名称 `hfut-xuancheng-ppt-maker` 仅用于迁移识别。必须严格按以下顺序操作：

1. **安装新版本**到规范目录：

   ```powershell
   git clone https://github.com/linmohan00-rgb/hfut-presentation-studio.git `
     "$env:USERPROFILE\.codex\skills\hfut-presentation-studio"
   ```

2. **验证新版本**，在此之前不要处理旧目录：

   ```powershell
   $newSkill = "$env:USERPROFILE\.codex\skills\hfut-presentation-studio"
   python "$newSkill\scripts\validate_template_bank.py"
   python "$newSkill\scripts\select_templates.py" `
     --brief "HFUT migration validation" `
     --slides 6 `
     --sections 1 `
     --output "$env:TEMP\hfut-presentation-studio-selection.json"
   ```

   只有当两个命令都成功退出，且 `$newSkill\SKILL.md` 包含 `name: hfut-presentation-studio` 时，才能继续。

3. **删除旧版本**，且只删除精确匹配的历史目录：

   ```powershell
   $skillsRoot = (Resolve-Path "$env:USERPROFILE\.codex\skills").Path
   $newSkill = Join-Path $skillsRoot "hfut-presentation-studio"
   $oldSkill = Join-Path $skillsRoot "hfut-xuancheng-ppt-maker"
   if (-not (Test-Path -LiteralPath "$newSkill\SKILL.md")) {
     throw "The new installation is not validated."
   }
   $oldResolved = (Resolve-Path -LiteralPath $oldSkill).Path
   if ((Split-Path $oldResolved -Parent) -ne $skillsRoot -or
       (Split-Path $oldResolved -Leaf) -ne "hfut-xuancheng-ppt-maker") {
     throw "Refusing to remove an unexpected path."
   }
   Remove-Item -LiteralPath $oldResolved -Recurse -Force
   ```

后续任务统一使用 `$hfut-presentation-studio`。
