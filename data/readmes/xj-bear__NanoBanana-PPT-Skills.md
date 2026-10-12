#BRANCH:main
# NanoBanana PPT Skills

> 基于 AI 自动生成高质量 PPT 图片和视频的强大工具，支持智能转场和交互式播放

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-green.svg)

**创作者**: [xj-bear](https://github.com/xj-bear) (Fork 自 [歸藏](https://github.com/op7418/NanoBanana-PPT-Skills))

[效果演示](#-效果演示) • [功能特性](#-功能特性) • [一键安装](#-一键安装) • [作为 Skill 使用](#-作为-claude-code-skill-使用) • [使用指南](#-使用指南) • [视频功能](#-视频功能) • [架构文档](ARCHITECTURE.md) • [常见问题](#-常见问题)

</div>

---

## 🎬 效果演示

<div align="center">

https://github.com/user-attachments/assets/b394de21-2848-489a-8d33-a8e262e60f60

*AI 自动生成 PPT 并添加流畅转场动画 - 从文档分析到视频合成一键完成*

</div>

---

## 📖 简介

NanoBanana PPT Skills 是一个强大的 AI 驱动的 PPT 生成工具，能够：

- 📄 **智能分析文档**，自动提取核心要点并规划 PPT 结构
- 🎨 **生成高质量图片**，使用云雾 AI（yunwu.ai，Gemini 3 Pro Image Preview 兼容）
- 🎬 **自动生成转场视频**，使用 Veo 模型创建流畅的页面过渡动画
- 🎮 **交互式视频播放器**，支持键盘控制、循环预览、智能转场
- 🎥 **完整视频导出**，一键合成包含所有转场的完整 PPT 视频


## 💰 成本与试用

本项目默认使用 **veo-3.1** 模型，成本低廉：
- **视频生成 (veo-3.1)**: 约 0.09 元/次
- **图片生成 (nano-banana)**: 约 0.16 元/张

**仅需 1 元即可试水制作一个完整的演示 PPT！**

[👉 点击这里注册 Yunwu AI (邀请链接)](https://yunwu.ai/register?aff=sBlH) 获取 API 密钥。

## ✨ 本版本优化

本项目为 fork 优化版本，主要改进包括：

1.  **🚀 输出目录去重与断点续传**
    - 实现 `TaskRegistry` 和 `--resume` 参数
    - 支持复用已有目录，避免重复生成，节省成本

2.  **📂 模板路径自动解析**
    - 智能解析模板路径（绝对路径/相对路径/脚本路径）
    - 解决不同目录下运行时的路径依赖问题

3.  **🔢 转场命名标准化**
    - 统一使用两位数页码格式（如 `01-02`）
    - 修复视频合成时的文件名匹配错误

4.  **🛡️ 视频去重验证**
    - 集成 `ffprobe` 验证视频有效性
    - 自动跳过已存在的有效视频，避免重复调用 API

5.  **💻 Windows 兼容性优化**
    - 移除控制台输出中的 Emoji 字符
    - 解决 Windows 环境下的编码导致乱码问题

### 🎨 视觉风格

**渐变毛玻璃卡片风格**
- 高端科技感，Apple Keynote 极简主义
- 3D 玻璃物体 + 霓虹渐变
- 电影级光照效果
- 适合：科技产品、商务演示、数据报告

**矢量插画风格**
- 温暖扁平化设计，复古配色
- 黑色轮廓线 + 几何化处理
- 玩具模型般的可爱感
- 适合：教育培训、创意提案、品牌故事

**3D 粘土拟人风格**（新增）
- Notion 3D 插画风格，软粘土材质
- 多巴胺清新配色（薄荷绿、柠檬黄、泡泡糖粉）
- 可爱的 3D 粘土角色（圆润四肢、豆豆眼）
- 适合：创意分享会、产品发布（ToC）、教育课件、团队建设

**黑金奢华·颁奖盛典风格**（新增）
- 奥斯卡级别舞美视觉
- 曜石黑 + 香槟金高级配色
- 黑大理石、拉丝金属材质、金色粒子光效
- 适合：年度总结表彰、颁奖典礼、奢侈品发布、VIP 晚宴

**东方美学·蛇年限定风格**（新增）
- 新中式美学（Neo-Chinese Style）
- 朱砂红丝绒 + 流光金
- 抽象灵蛇曲线、玉质感、书法字体
- 适合：春节、元宵、中秋节日、企业年会、国潮品牌

**硅谷创投风格**（新增）
- 瑞士平面设计风格（Swiss Style）
- 极致留白、高对比度单色
- 超级数字（Super Numbers）、真实感摄影
- 适合：A轮/B轮融资路演、CEO 演讲、商业计划书

**极致科技发布会风格**（新增）
- Apple Keynote / Tesla 发布会风格
- 深邃虚空黑 + 电影级布光
- 航空级钛金属、全息投影（HUD）数据可视化
- 适合：旗舰新品发布、战略规划会、高端技术路演

---

## ✨ 功能特性

### 🎯 核心能力

- 🤖 **智能文档分析** - 自动提取核心要点，规划 PPT 内容结构
- 🎨 **多风格支持** - 内置 2 种专业风格，可无限扩展
- 🖼️ **高质量图片** - 16:9 比例，2K/4K 分辨率可选
- 🎬 **AI 转场视频** - Veo 模型生成流畅的页面过渡动画
- 🎮 **交互式播放器** - 视频+图片混合播放，支持键盘导航
- 🎥 **完整视频导出** - FFmpeg 合成包含转场的完整 PPT 视频
- 📊 **智能布局** - 封面页、内容页、数据页自动识别
- ⚡ **快速生成** - 2K 约 30 秒/页

### 🆕 视频功能（v2.0）

- 🎬 **首页循环预览** - 自动生成吸引眼球的循环动画
- 🎞️ **智能转场** - 自动生成页面间的过渡视频
- 🎮 **交互式播放** - 按键翻页时播放转场视频，结束后显示静态图片
- 🎥 **完整视频导出** - 合成包含所有转场和静态页的完整视频
- 🔧 **参数统一** - 自动统一所有视频分辨率和帧率，确保流畅播放

### 🛠️ 技术亮点

- ✅ Google Nano Banana Pro（Gemini 3 Pro Image Preview）图像生成
- ✅ Veo 视频生成集成
- ✅ FFmpeg 视频合成与参数统一
- ✅ 完整的提示词工程和风格管理系统
- ✅ 安全的 .env 环境变量管理
- ✅ 模块化设计，易于扩展

---

## 🚀 一键安装

### 方法一：Claude Code 自动安装（推荐）

**只需复制以下提示词，发送给 Claude Code，它会自动完成全部安装！**

```
请帮我安装 NanoBanana PPT Skills：

1. 克隆项目并进入目录：
   git clone https://github.com/xj-bear/NanoBanana-PPT-Skills.git
   cd NanoBanana-PPT-Skills

2. 创建 Python 虚拟环境：
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate

3. 安装依赖：
   pip install google-genai pillow python-dotenv

4. 配置 API 密钥 - 创建 .env 文件：
   cp .env.example .env

5. 编辑 .env 文件，填入我的 API 密钥：

   YUNWU_API_KEY=YOUR_YUNWU_API_KEY

   注意：
   - YUNWU_API_KEY: 云雾 AI API 密钥（必需，用于生成 PPT 图片）

   当前版本仅支持 yunwu.ai 代理服务，不支持 Google 官方直连。

6. 验证安装：
   python3 generate_ppt.py --help

完成后，告诉我安装结果和如何使用。

我的 API 密钥：
- YUNWU_API_KEY: YOUR_YUNWU_API_KEY_HERE
- KLING_ACCESS_KEY: YOUR_KLING_ACCESS_KEY_HERE (可选)
- KLING_SECRET_KEY: YOUR_KLING_SECRET_KEY_HERE (可选)
```

**使用说明**：
1. 先获取 API 密钥：
   - **必需**: [云雾 AI API 密钥](https://yunwu.ai)（yunwu.ai 代理服务，Gemini 3 Pro 兼容）
2. 复制上面的提示词
3. 将 `YOUR_YUNWU_API_KEY_HERE` 等替换为你的真实 API 密钥
4. 发送给 Claude Code
5. Claude Code 会自动执行所有安装步骤并告知结果

### 方法二：手动安装

如果你想手动安装，按照以下步骤操作：

#### 1. 克隆项目

```bash
git clone https://github.com/xj-bear/NanoBanana-PPT-Skills.git
cd NanoBanana-PPT-Skills
```

#### 2. 创建虚拟环境

```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

#### 3. 安装依赖

```bash
pip install google-genai pillow
```

如果需要视频功能，还需要安装 FFmpeg：

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# 下载 FFmpeg 并添加到系统 PATH
```

#### 4. 配置 API 密钥

**推荐方式：.env 文件（已内置支持）**

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件
nano .env  # 或使用你喜欢的编辑器
```

在 `.env` 文件中填入你的 API 密钥：

```bash
# 云雾 AI API 密钥（必需，yunwu.ai 代理服务）
# 当前版本仅支持 yunwu.ai，不支持 Google 官方直连
YUNWU_API_KEY=your_yunwu_api_key_here
```

**替代方式：系统环境变量**

```bash
# zsh 用户 (macOS 默认)
echo 'export YUNWU_API_KEY="your-api-key-here"' >> ~/.zshrc
source ~/.zshrc

# bash 用户
echo 'export YUNWU_API_KEY="your-api-key-here"' >> ~/.bashrc
source ~/.bashrc
```

#### 5. 验证安装

```bash
python3 generate_ppt.py --help
```

应该显示帮助信息，表示安装成功。

---

## 🎯 作为 Claude Code Skill 使用

NanoBanana PPT Skills 完全支持 Claude Code Skill 标准，可以直接通过 Claude Code 调用。

### 快速安装为 Skill

**方法一：Claude Code 自动安装为 Skill（最简单）**

**只需复制以下提示词，发送给 Claude Code，它会自动完成 Skill 安装！**

```
请帮我将 NanoBanana PPT Skills 安装为 Claude Code Skill：

1. 创建 Skill 目录：
   mkdir -p ~/.claude/skills/ppt-generator

2. 克隆项目到 Skill 目录：
   git clone https://github.com/xj-bear/NanoBanana-PPT-Skills.git ~/.claude/skills/ppt-generator

3. 进入目录并安装依赖：
   cd ~/.claude/skills/ppt-generator
   python3 -m venv venv
   source venv/bin/activate
   pip install google-genai pillow python-dotenv

4. 配置 API 密钥：
   cp .env.example .env

   然后编辑 .env 文件，填入我的 API 密钥：
   YUNWU_API_KEY=YOUR_YUNWU_API_KEY

   当前版本仅支持 yunwu.ai 代理服务。

5. 验证安装：
   python3 generate_ppt.py --help

完成后，告诉我如何在 Claude Code 中使用这个 Skill。

我的 API 密钥：
- YUNWU_API_KEY: YOUR_YUNWU_API_KEY_HERE
```

**方法二：使用安装脚本**

```bash
# 克隆项目
git clone https://github.com/xj-bear/NanoBanana-PPT-Skills.git
cd NanoBanana-PPT-Skills

# 运行安装脚本
bash install_as_skill.sh
```

安装脚本会自动：
1. 创建 `~/.claude/skills/ppt-generator/` 目录
2. 复制所有必要文件
3. 安装 Python 依赖
4. 引导配置 API 密钥

**方法三：手动安装**

```bash
# 1. 创建 Skill 目录
mkdir -p ~/.claude/skills/ppt-generator

# 2. 克隆项目到 Skill 目录
git clone https://github.com/xj-bear/NanoBanana-PPT-Skills.git ~/.claude/skills/ppt-generator

# 3. 安装依赖
cd ~/.claude/skills/ppt-generator
pip install google-genai pillow python-dotenv

# 4. 配置 API 密钥
cp .env.example .env
nano .env  # 填入你的 API 密钥
```

### 环境变量配置

Skill 会智能查找 `.env` 文件，按以下优先级：

1. **脚本所在目录** - `~/.claude/skills/ppt-generator/.env`
2. **向上查找项目根目录** - 直到找到包含 `.git` 或 `.env` 的目录
3. **用户主目录** - `~/.env`
4. **系统环境变量** - 作为最后的备选方案

**推荐配置方式：**

```bash
# 在 Skill 目录下创建 .env 文件
cat > ~/.claude/skills/ppt-generator/.env << EOF
# 云雾 AI API 密钥（必需，yunwu.ai 代理服务）
# 当前版本仅支持 yunwu.ai，不支持 Google 官方直连
YUNWU_API_KEY=your_yunwu_api_key_here
EOF
```

### 在 Claude Code 中使用

安装完成后，直接在 Claude Code 中调用：

```bash
/ppt-generator-pro
```

或者告诉 Claude：

```
我想基于以下文档生成一个 5 页的 PPT，使用渐变毛玻璃风格。

[文档内容...]
```

Claude 会自动：
1. 分析文档内容
2. 询问风格、页数、分辨率等选项
3. 生成 slides_plan.json
4. 调用 generate_ppt.py 生成图片
5. （可选）生成转场视频
6. 返回结果路径

### Skill 模式 vs 独立模式

| 特性 | Skill 模式 | 独立模式 |
|------|-----------|---------|
| 安装位置 | `~/.claude/skills/ppt-generator/` | 任意目录 |
| 调用方式 | `/ppt-generator-pro` 或自然语言 | 手动执行 Python 脚本 |
| 文档分析 | Claude 自动分析 | 需手动准备 JSON |
| 交互体验 | 对话式，自动询问选项 | 命令行参数 |
| .env 位置 | Skill 目录或项目根目录 | 脚本所在目录 |
| 适用场景 | 日常使用，快速生成 | 批量生成，自动化脚本 |

### 详细使用文档

完整的 Skill 使用文档请参考 [SKILL.md](SKILL.md)，包含：
- 完整的执行流程
- 用户输入收集策略
- 内容规划方法
- 错误处理指南
- 最佳实践建议

---

## 💡 使用指南

### 基础使用：生成 PPT 图片

#### 1. 准备内容规划文件

创建 `my_slides_plan.json`：

```json
{
  "title": "AI 产品设计指南",
  "total_slides": 5,
  "slides": [
    {
      "slide_number": 1,
      "page_type": "cover",
      "content": "标题：AI 产品设计指南\n副标题：构建以用户为中心的智能体验"
    },
    {
      "slide_number": 2,
      "page_type": "content",
      "content": "核心原则\n- 简单直观\n- 快速响应\n- 透明可控"
    },
    {
      "slide_number": 3,
      "page_type": "content",
      "content": "设计流程\n1. 用户研究\n2. 原型设计\n3. 测试迭代"
    },
    {
      "slide_number": 4,
      "page_type": "data",
      "content": "用户满意度\n使用前：65%\n使用后：92%\n提升：+27%"
    },
    {
      "slide_number": 5,
      "page_type": "content",
      "content": "总结\n- 以用户为中心\n- 持续优化迭代\n- 数据驱动决策"
    }
  ]
}
```

#### 2. 生成 PPT 图片

```bash
python3 generate_ppt.py \
  --plan my_slides_plan.json \
  --style styles/gradient-glass.md \
  --resolution 2K
```

#### 3. 查看结果

```bash
# 在浏览器中打开图片播放器
open outputs/TIMESTAMP/index.html
```

### 高级使用：生成带转场视频的 PPT

#### 1. 生成 PPT 图片

```bash
python3 generate_ppt.py \
  --plan my_slides_plan.json \
  --style styles/gradient-glass.md \
  --resolution 2K
```

#### 2. 使用 Claude Code 生成转场提示词（必需）

在 Claude Code 中执行：

```
我刚生成了 5 页 PPT 图片在 outputs/TIMESTAMP/images 目录下。
请帮我分析这些图片，为每个页面转场生成视频提示词，
保存为 outputs/TIMESTAMP/transition_prompts.json
```

Claude Code 会：
1. 读取所有 PPT 图片
2. 分析每两页之间的视觉差异
3. 生成精准的转场描述
4. 保存为 JSON 文件

#### 3. 生成转场视频

```bash
python3 generate_ppt_video.py \
  --slides-dir outputs/TIMESTAMP/images \
  --output-dir outputs/TIMESTAMP_video \
  --prompts-file outputs/TIMESTAMP/transition_prompts.json
```

这会生成：
- 首页循环预览视频
- 每个页面间的转场视频
- 交互式视频播放器 HTML
- 完整视频 (full_ppt_video.mp4)

#### 4. 播放交互式视频 PPT

```bash
open outputs/TIMESTAMP_video/video_index.html
```

**播放逻辑**：
1. 首页：播放循环预览视频
2. 按右键：播放转场视频 → 显示目标页图片（停留 2 秒）
3. 再按右键：播放下一个转场视频 → 显示下一页图片
4. 依此类推...

#### 4. 导出完整视频（可选）

交互式播放器会自动生成完整视频：

```bash
# 视频文件
outputs/TIMESTAMP_video/full_ppt_video.mp4
```

完整视频包含：
- 首页预览（如果有）
- 转场视频 01→02
- 第 2 页静态（2 秒）
- 转场视频 02→03
- 第 3 页静态（2 秒）
- ...

---

## 🎬 视频功能

### 转场视频生成

使用 Veo 模型自动生成页面间的转场视频：

```bash
python3 generate_ppt_video.py \
  --slides-dir outputs/20260111_160221/images \
  --output-dir outputs/20260111_video \
  --mode professional \
  --duration 5
```

**参数说明**：
- `--slides-dir`: PPT 图片目录
- `--output-dir`: 输出目录
- `--mode`: 转场模式（`professional` 或 `creative`）
- `--duration`: 转场视频时长（秒，默认 5）

### 交互式播放器

生成的 `video_index.html` 支持：

| 功能 | 快捷键 | 说明 |
|------|--------|------|
| 下一页 | `→` `↓` | 播放转场视频，然后显示下一页 |
| 上一页 | `←` `↑` | 返回上一页（直接显示） |
| 首页 | `Home` | 返回首页预览 |
| 末页 | `End` | 跳到最后一页 |
| 播放/暂停 | `空格` | 暂停/继续当前视频 |
| 全屏 | `ESC` | 切换全屏模式 |
| 隐藏控件 | `H` | 隐藏/显示控制提示 |

### 完整视频合成

使用 FFmpeg 自动合成完整视频：

```python
from video_composer import VideoComposer

composer = VideoComposer()
composer.compose_full_ppt_video(
    slides_paths=[...],
    transitions_dict={...},
    output_path='output.mp4',
    slide_duration=2,  # 每页停留 2 秒
    include_preview=True,
    preview_video_path='preview.mp4',
    resolution='1920x1080',
    fps=24
)
```

**特性**：
- 自动统一所有视频的分辨率和帧率
- 保持宽高比，添加黑边
- 支持预览视频循环
- 高质量 H.264 编码

---

## 🎨 风格库

### 已内置风格

#### 1. 渐变毛玻璃卡片风格 (`gradient-glass.md`)

**视觉特点**：
- Apple Keynote 极简主义
- 玻璃拟态效果
- 霓虹紫/电光蓝/珊瑚橙渐变
- 3D 玻璃物体 + 电影级光照

**适用场景**：
- 🚀 科技产品发布
- 💼 商务演示
- 📊 数据报告
- 🏢 企业品牌展示

#### 2. 矢量插画风格 (`vector-illustration.md`)

**视觉特点**：
- 扁平化矢量设计
- 统一黑色轮廓线
- 复古柔和配色
- 几何化简化

**适用场景**：
- 📚 教育培训
- 🎨 创意提案
- 👶 儿童相关
- 💖 温暖品牌故事

### 添加自定义风格

1. 在 `styles/` 目录创建新的 `.md` 文件
2. 按照模板编写风格定义（参考现有风格）
3. 直接使用新风格生成 PPT

---

## 📚 项目结构

```
ppt-generator/
├── README.md                      # 本文件
├── API_MANAGEMENT.md              # API 密钥管理指南
├── ENV_SETUP.md                   # 环境变量配置指南
├── SECURITY.md                    # 安全最佳实践
├── .env.example                   # 环境变量模板
├── .env                          # 实际环境变量（不提交到 Git）
├── .gitignore                    # Git 忽略规则
│
├── generate_ppt.py               # PPT 图片生成脚本
├── generate_ppt_video.py         # 视频生成主脚本
├── kling_api.py                  # 可灵 AI API 封装
├── video_composer.py             # FFmpeg 视频合成
├── video_materials.py            # 视频素材管理
├── transition_prompt_generator.py # 转场提示词生成器
│
├── styles/                       # 风格库
│   ├── gradient-glass.md         # 渐变毛玻璃卡片风格
│   └── vector-illustration.md    # 矢量插画风格
│
├── templates/                    # HTML 模板
│   ├── viewer.html              # 图片播放器
│   └── video_viewer.html        # 视频播放器
│
├── prompts/                      # 提示词模板
│   └── transition_base.md       # 转场提示词基础模板
│
└── outputs/                      # 生成结果（自动创建）
    ├── TIMESTAMP/               # 图片版本
    │   ├── images/             # PPT 图片
    │   ├── index.html          # 图片播放器
    │   └── prompts.json        # 生成提示词记录
    └── TIMESTAMP_video/         # 视频版本
        ├── videos/             # 转场视频
        ├── video_index.html    # 视频播放器
        └── full_ppt_video.mp4  # 完整视频
```

---

## 🔧 配置选项

### 分辨率选择

| 分辨率 | 尺寸 | 文件大小 | 生成速度 | 推荐场景 |
|--------|------|----------|----------|----------|
| 2K | 2752x1536 | ~2.5MB/页 | ~30秒/页 | 日常演示、在线分享 ✅ |
| 4K | 5504x3072 | ~8MB/页 | ~60秒/页 | 打印输出、大屏展示 |

### 视频参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| 分辨率 | 1920x1080 | 统一为 1080p，兼容 Veo 视频 |
| 帧率 | 24fps | 统一帧率，确保流畅拼接 |
| 静态图片时长 | 2秒 | 每页停留时间 |
| 转场视频时长 | 5秒 | Veo 生成的转场时长 |

### 页数建议

| 页数范围 | 演讲时长 | 适用场景 |
|----------|----------|----------|
| 5 页 | 5 分钟 | 电梯演讲、快速介绍 |
| 5-10 页 | 10-15 分钟 | 标准演示、产品介绍 |
| 10-15 页 | 20-30 分钟 | 深入讲解、培训课程 |
| 20-25 页 | 45-60 分钟 | 完整培训、研讨会 |

---

## ❓ 常见问题

### Q: 如何获取 API 密钥？

**A**:
- **云雾 AI API**: 访问 [云雾 AI](https://yunwu.ai)，注册并获取 API 密钥（yunwu.ai 代理服务，Gemini 3 Pro 兼容）

### Q: 是否必须配置视频生成？

**A**: 不是必须的。
- **只生成 PPT 图片**：只需要 YUNWU_API_KEY（云雾 AI）
- **生成转场视频**：目前集成在脚本中，使用 Veo 模型

### Q: 视频合成失败怎么办？

**A**: 检查以下几点：
1. FFmpeg 是否已安装（`ffmpeg -version`）
2. 视频文件是否存在且完整
3. 磁盘空间是否充足
4. 查看详细错误信息

### Q: 如何修改静态图片展示时间？

**A**: 在 `video_composer.py` 中修改 `slide_duration` 参数（默认 2 秒）

### Q: 转场视频生成很慢怎么办？

**A**: 视频生成需要一定时间（通常 30-60 秒/段）。可以：
- 减少转场数量
- 使用较短的转场时长
- 分批生成

### Q: 可以导出为 PDF 吗？

**A**: 可以。
1. 在浏览器中打开 `index.html`
2. 按 `Cmd+P` (Mac) 或 `Ctrl+P` (Windows)
3. 选择"另存为 PDF"

### Q: 生成的内容可以商用吗？

**A**: 请查阅相关服务条款：
- [云雾 AI 使用条款](https://yunwu.ai)

一般情况下，你拥有生成内容的使用权。

---

## 🛡️ 安全说明

### API 密钥安全

本项目采用 `.env` 文件管理 API 密钥，确保安全：

- ✅ `.env` 文件已在 `.gitignore` 中，不会提交到 Git
- ✅ 代码中无硬编码密钥
- ✅ 支持系统环境变量作为备用方案
- ✅ `.env.example` 提供配置模板

**最佳实践**：

```bash
# ✅ 正确：使用 .env 文件
cp .env.example .env
# 编辑 .env 填入真实密钥

# ❌ 错误：直接在代码中写密钥
YUNWU_API_KEY = "your-key..." # 永远不要这样做！
```

### 提交前检查

```bash
# 验证没有密钥泄露
grep -r "AIzaSy\|ak-" --exclude-dir=.git --exclude-dir=venv .
# 应该无输出

# 检查 .env 文件是否被排除
git status
# 确认 .env 不在待提交列表中
```

详细说明请查看：
- **API_MANAGEMENT.md** - API 密钥管理完整指南
- **ENV_SETUP.md** - 环境变量配置指南
- **SECURITY.md** - 安全最佳实践

---

## 📝 更新日志

### v2.0.0 (2026-01-11)

- 🎬 **新增视频功能**
  - Veo 模型转场视频生成
  - 交互式视频播放器（视频+图片混合）
  - FFmpeg 完整视频合成
  - 首页循环预览视频
- 🔧 **优化视频合成**
  - 自动统一分辨率和帧率
  - 修复视频拼接兼容性问题
  - 静态图片展示时间改为 2 秒
- 🐛 **Bug 修复**
  - 修复预览模式状态管理问题
  - 修复 FFmpeg 滤镜参数格式错误
- 📚 **文档更新**
  - 全面改写 README
  - 新增视频功能使用指南
  - 更新 API 密钥配置说明

### v1.0.0 (2026-01-09)

- ✨ 首次发布
- 🎨 内置 2 种专业风格
- 🖼️ 支持 2K/4K 分辨率
- 🎬 HTML5 图片播放器
- 📊 智能文档分析
- 🔐 安全的环境变量管理

---

## 🤝 贡献指南

欢迎贡献！你可以：

### 添加新风格

1. Fork 本项目
2. 在 `styles/` 创建新风格文件
3. 参考现有风格编写提示词
4. 测试生成效果
5. 提交 Pull Request

### 报告问题

在 [GitHub Issues](https://github.com/xj-bear/NanoBanana-PPT-Skills/issues) 提交问题，请包含：
- 错误信息
- 操作步骤
- 系统环境
- 日志文件（如有）

---

## 📄 许可证

MIT License

Copyright (c) 2026 xj-bear

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🙏 致谢

- **Google Gemini Team** - 提供强大的 Nano Banana Pro 图像生成模型
- **Veo Team** - 提供高质量的视频生成服务
- **FFmpeg 项目** - 提供强大的视频处理工具
- **开源社区** - 提供的各种工具和灵感

---

## 📞 联系方式

- **创作者**: xj-bear
- **GitHub**: [@xj-bear](https://github.com/xj-bear)
- **Issues**: [GitHub Issues](https://github.com/xj-bear/NanoBanana-PPT-Skills/issues)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

Made with ❤️ by xj-bear | Powered by Google Gemini & Veo & FFmpeg

</div>
