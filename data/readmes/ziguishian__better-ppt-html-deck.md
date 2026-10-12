#BRANCH:main
# better-ppt-html-deck

一个 Codex Skill，用于生成更好看、更专业、可编辑、可预览、可播放、可导出的 HTML 版 PPT。

## 一些风格的展示
<img width="3840" height="2029" alt="image" src="https://github.com/user-attachments/assets/be5adbd3-6870-403e-8dde-c0b33e5c6477" />
<img width="3840" height="2029" alt="image" src="https://github.com/user-attachments/assets/63b74bb7-b36e-4548-ba39-a74709d039cc" />
<img width="3840" height="2029" alt="image" src="https://github.com/user-attachments/assets/4a760b0f-a13f-4c03-b825-e49aa714ba85" />
<img width="3840" height="2029" alt="image" src="https://github.com/user-attachments/assets/7c93ad02-c0e5-4a1d-a53d-dac196a970e6" />




核心流程：

1. 分析主题、资料、受众和页数。
2. 规划 `outline.md` 和 `visual-direction.md`。
3. 先生成 `style-preview.png` 审美预览图。
4. 用户确认后再生成最终 `deck-project/`。
5. 最终 PPT 由 HTML/CSS/JS 渲染，支持编辑、替换图片、播放和导出。

## Skill 重点

- 不做通用 PPT 工作台。
- 不做在线 SaaS 或完整设计软件。
- 不把整页 PPT 直接生成为图片。
- HTML 是源文件，PDF / PNG / PPTX 是导出物。
- 必须支持浏览器内一键导出 PPTX。
- 每个可见文字字段都应可编辑。
- 每个最终 deck 都应包含可替换的视觉资产或图片槽位。

## 目录

```txt
better-ppt-html-deck/
├─ SKILL.md
├─ scripts/
├─ references/
├─ assets/
└─ agents/
```

## 使用

把本目录放入 Codex 可发现的 skills 目录，或在任务中明确要求使用：

```txt
使用 better-ppt-html-deck，帮我做一个更好看的 Codex 入门 PPT，10 页，新野兽派风格。
```

## 示例

示例项目位于：

```txt
assets/examples/codex-intro-tech-launch/
```

其中 `deck-project/` 是一次完整测试产物，包含可运行的 HTML PPT 项目。生成物如 `node_modules/`、`dist/`、`exports/` 不纳入仓库。
