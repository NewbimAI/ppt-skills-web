#BRANCH:main
# Gorden PPT Skill

> 史上最强原生PPT Skill，更适合中国宝宝。生成的效果不让你震惊，你来打我。
>
> ⚠️ **非商业使用**：本仓库及内置模板**仅供个人学习与研究**，禁止任何商业用途。
> 
> **支持定制私有化模板**：如果你想要Agent能按你公司的PPT模板来生成PPT，可以加我微信**duge360**定制。

## 交流群

加我微信duge360，拉你进PPT Skill交流群，AI话题也可以讨论。

## 几大特色
1、能生成信息密度高、排版复杂、看起来高大上的PPT，也支持生成简约、商务风格的PPT。适合国企、互联网大厂使用。

2、兼容所有模型，DeepSeek、小米Mimo、Claude、GPT均实测过，国产模型也能完成的非常好。

3、技能自动更新机制：如果我更新了可选用的PPT模板，使用技能时会自动更新技能。技能像软件一样可以更新

## 效果展示

以下是用本 Skill 生成的实际页面（信息密度高、排版复杂、商务质感）：

<p align="center">
  <img src="./assets/showcase-1.jpg" alt="效果展示 1 - 战略定位分析" width="720" />
</p>

<p align="center">
  <img src="./assets/showcase-2.jpg" alt="效果展示 2 - 价值冰山模型" width="720" />
</p>

<p align="center">
  <img src="./assets/showcase-3.jpg" alt="效果展示 3 - 产品化闭环" width="720" />
</p>

## 使用方法
极其简单，把这段提示词发给你的Agent即可：

安装这个Skill：https://github.com/GordenSun/GordenPPTSkill
然后使用这个Skill做一个复杂、豪华的PPT，读取本地XXX文件，来介绍XXX项目

## 谁要看这个

- 想给自己用的 AI 助手装一个"做 PPT"技能的人：**请读 [SKILL.md](./SKILL.md)**
- 想看本项目目录怎么组织：继续往下看本文件
- 想理解模板分类 / 推荐：**请读 [templates/INDEX.md](./templates/INDEX.md)**

## 快速开始（命令行）

```bash
# 1. 确认依赖
python3 -c "import pptx; print(pptx.__version__)"   # python-pptx 1.0+
soffice --version    # LibreOffice (仅渲染预览时需要)
which pdftoppm       # poppler   (仅渲染预览时需要)

# 2. 选定模板 + 写 edits.json，跑构建
python3 scripts/build_pptx.py \
    templates/minimal-business-summary/template.pptx \
    edits.json \
    out/final.pptx \
    --detail templates/minimal-business-summary/detail.json

# 3. (可选) 渲染最终预览图
python3 scripts/render_slides.py out/final.pptx out/preview --dpi 144
```

## 字体环境

模板大量使用 `微软雅黑`。如果你的机器没装它，配 `~/.config/fontconfig/fonts.conf` 加一条 alias：

```xml
<alias binding="strong">
  <family>微软雅黑</family>
  <accept>
    <family>WenQuanYi Micro Hei</family>
    <family>DengXian</family>
    <family>Noto Sans SC</family>
    <family>PingFang SC</family>
  </accept>
</alias>
```

(`brew install --cask font-noto-sans-sc`，或下载 WenQuanYi Micro Hei 放进 `~/Library/Fonts/` 并 `fc-cache -f`。)

## 目录速览

```
SKILL.md         # AI 入口文档
VERSION          # 1.0.0
CHANGELOG.md     # 人读变更
updates.json     # 机读变更
manifest.json    # 每文件版本 + sha256
scripts/         # 5 个面向使用者的脚本（build / render / update / manifest）
references/      # 编辑规则、Schema、工作流参考
templates/       # 17 个模板（每个 4 文件）
```

## 致谢与版权

- 本仓库没有PPT模板的版权
- **禁止任何二次分发 / 商业使用**
- 用到的开源工具：[LibreOffice](https://www.libreoffice.org/)、[python-pptx](https://python-pptx.readthedocs.io/)、[Poppler](https://poppler.freedesktop.org/)、[WenQuanYi Micro Hei](http://wenq.org/)
- 感谢 [LinuxDO](https://linux.do) 社区的支持
