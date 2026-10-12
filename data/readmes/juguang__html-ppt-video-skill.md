#BRANCH:master
# html-ppt-video-skill

**[English](README_EN.md)** | 中文

将文档转为带中文配音和字幕的 HTML 演示视频。配合 [html-ppt-skill](https://github.com/lewislulu/html-ppt-skill) 使用。

## 功能

- 文档 → HTML PPT → 带配音字幕的讲解视频，全自动
- 支持 10-16 页 PPT，生成 3-5 分钟视频
- 中文 TTS 语音合成（edge-tts，4 种语音可选）
- 用户确认流程：PPT 视觉确认 + 解说词/跳过页确认
- ffmpeg `-t` 精确时长控制，字幕零漂移

## 安装

```bash
# 前置依赖
pip install edge-tts
brew install ffmpeg
brew install font-noto-sans-sc

# 安装 html-ppt skill
npx skills add https://github.com/lewislulu/html-ppt-skill -y -g

# 安装本 skill（Claude Code）
# 将本仓库克隆到 ~/.claude/skills/html-ppt-video/
```

## 使用

在 Claude Code 中：

```
/html-ppt-video path/to/your-document.md 把文档转为视频
```

或直接让 Claude 使用本 skill，触发词：`PPT转视频`、`文档转视频`、`生成讲解视频` 等。

## 工作流程

```
Phase 1    文档 → HTML PPT（调用 html-ppt skill）
Phase 1.5  浏览器视觉确认 ← 用户确认 PPT 效果
Phase 2    生成 review.md（图片 + 解说词 + checkbox）
Phase 3    用户确认 ← 编辑解说词、勾选跳过页
Phase 4    build → 语音 + 字幕 + 视频片段 → 最终视频
```

## 单独使用 build_video.py

```bash
# 复制 build_video.py 到项目目录，修改顶部常量后：

python build_video.py check             # 检查依赖
python build_video.py review            # 渲染幻灯片 + 生成确认文档
python build_video.py build             # 解析确认文档 + 生成视频
python build_video.py build --step 3    # 仅重跑某个步骤
```

## 配置

在 `review.md` 中修改：

```yaml
voice: zh-CN-YunxiNeural   # 语音（见下方选项）
rate: "+5%"                 # 语速调整
style: 口语化               # 语言风格
skip: []                    # 全局跳过的页码
```

每页的解说词在 code block 中，可直接编辑。用 `- [x]` 勾选跳过不需要的页面。

## 语音选项

| 语音 ID | 性别 | 风格 |
|---------|------|------|
| zh-CN-YunxiNeural | 男 | 沉稳（推荐技术分享） |
| zh-CN-XiaoxiaoNeural | 女 | 亲切自然 |
| zh-CN-YunjianNeural | 男 | 磁性浑厚 |
| zh-CN-XiaoyiNeural | 女 | 活泼明快 |

## 输出结构

```
project/
├── build_video.py
└── video-output/
    ├── slides/           # PNG 幻灯片
    ├── review.md         # 用户确认文档
    ├── narrations/       # 解说词 txt
    ├── audio/            # mp3 + srt
    ├── segments/         # mp4 片段
    ├── subtitles/        # combined.srt + combined.ass
    └── final-video.mp4   # 最终视频
```

## 依赖

| 依赖 | 用途 |
|------|------|
| edge-tts | TTS 语音合成 |
| ffmpeg + ffprobe | 视频处理 |
| Google Chrome | headless 渲染幻灯片 PNG |
| Noto Sans SC | 中文字幕字体 |
| html-ppt skill | HTML PPT 制作 |

## License

MIT
