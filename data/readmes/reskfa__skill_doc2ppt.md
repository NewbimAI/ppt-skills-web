#BRANCH:main
# /skill_doc2ppt — Claude Code Skill

一个Skill，将 Markdown 或 Word 文档一键转为Claude风格可投屏演示文稿，支持html或pptx导出。

如果你想一看很酷，二看没用，再看废物 —— 那这个项目不适合,**油腻投行男、AI科技活儿、没词儿强堆......感**, 我这里都没有。
如果想要 **Claude 原生设计感，克制、温暖、观点密度** ，那你来的正是时候。

**设计语言**：暖奶油 × 赭红 × 深棕黑，Cormorant Garamond + Noto Serif SC，极简留白。

---
## 缘起
写了一份带有配图的笔记，丢给某个以 ppt 为强项的 AI Agent，结果是，光怪陆离的花活、逻辑通顺的废话（而且还改变了我的意思），以及自以为是的模板。Claude 说，**只要它的底层冲动还是"越多越好、越全越专业"，说再多遍"简洁"也没用——那个冲动更强。**

好了我受够了，经过锤炼，有了本 SKILL，效果风格如下：

<img width="972" height="502" alt="image" src="https://github.com/user-attachments/assets/8e9e9b78-f4ae-4bf3-b45d-e2ee874ae7fa" />
<img width="1062" height="509" alt="image" src="https://github.com/user-attachments/assets/1ae455e0-4b72-4038-837f-68a7856f4be1" />


## 安装

将 `SKILL.md` 放入 Claude Code 的 skills 目录：

```
~/.claude/skills/skill_doc2ppt/SKILL.md
```

---

## 用法

```
/skill_doc2ppt <文件路径>           输出 HTML 演示文稿（可在浏览器全屏投屏）
/skill_doc2ppt <文件路径> --pptx    输出 .pptx 文件（可用 Keynote / PowerPoint 打开）
```

输出文件与源文件**同目录**，自动替换扩展名：

```
report.md        →  report.html
report.md --pptx →  report.pptx
report.docx      →  report.html
```

---

## 支持的输入格式

| 格式 | 说明 |
|------|------|
| `.md` | 直接读取 Markdown 文本 |
| `.docx` | 自动解包提取正文与图片，图片 base64 嵌入 |

---

## 输出格式

### HTML

- **单文件**，零外部依赖，可直接发给任何人
- 浏览器全屏（F11）即可投屏
- 键盘翻页：`→` / `Space` 下一页，`←` 上一页，`Home` / `End` 首尾
- 触摸滑动支持（手机/平板）
- 顶部进度条 + 底部导航点 + 页码

### PPTX

- 兼容 macOS Keynote 和 Windows PowerPoint
- 中文通过独立东亚字体属性设置，无乱码
- 需要 `python-pptx`（首次运行自动安装）

---

## 幻灯片类型

| 类型 | 背景色 | 用途 |
|------|--------|------|
| `dark` | `#231510` 深棕黑 | 封面、核心判断、金句——一句话站满一张 |
| `terra` | `#B05A42` 赭红 | 章节分隔页，带大编号 01 / 02 / 03 |
| `cream` | `#F4EDE3` 暖奶油 | 正文、数据、列表、图表 |

典型节奏：`封面（dark）→ 章节页（terra）→ 若干内容页（cream / dark）→ 结尾页（cream）`

---

## 设计原则

这个 skill 的核心约束**不在于排版，而在于内容**：

- 只用原文里有的内容，绝不补充、解释、扩写
- 找到每个段落最重的那一句，让它单独站出来
- 保留作者的语言，包括口语、俚语、反常识的表达
- 删除一切可以用于任何行业 / 任何报告的套话
- 每张幻灯片只说一件事，说完就停

---

## 色彩与字体

```
--cream:     #F4EDE3   暖奶油（浅色页背景）
--terra:     #B05A42   赭红（章节页背景 / 分隔线）
--terra-dim: #C4795F   赭红浅版（dark 页分隔线）
--ink:       #231510   深棕黑（dark 页背景）
--ink-soft:  #5C3D30   深棕软（正文主色）
--ink-faint: #9E7B6E   深棕淡（caption / 辅助信息）
--rule:      #D4BFB0   分割线色
```

西文展示字体：**Cormorant Garamond**（HTML 从 Google Fonts 加载，PPTX 需本地安装或系统回退衬线体）
正文西文：**Georgia**（PPTX，Windows / macOS 均内置）
中文：**Noto Serif SC**（HTML）/ `Noto Serif SC` + `SimSun` 回退（PPTX）

---

## 截图预览

> dark 页（封面 / 金句）

背景 `#231510`，主标题浅奶油色，细赭红分隔线，大量留白。

> terra 页（章节）

背景 `#B05A42`，右下角 20% 透明度超大编号，章节标题居左。

> cream 页（内容）

背景 `#F4EDE3`，顶部 caption（全大写，追踪字距），赭红细线，正文行距 1.9。

---

## 常见问题

**Q：HTML 文件能直接离线使用吗？**
可以，字体通过 Google Fonts CDN 加载，离线时会回退到系统衬线体，排版仍然正常。如需完全离线，可将字体 base64 嵌入。

**Q：PPTX 中文显示方框？**
说明本地没有 Noto Serif SC，改为宋体（SimSun）即可。Claude 在生成脚本时已设置回退，但部分旧版 PowerPoint 可能需要手动替换字体。

**Q：图片是否支持？**
HTML：图片以 base64 嵌入，完全离线。PPTX：图片路径写入脚本，需要临时文件可访问。

**Q：能处理多大的文档？**
没有硬性限制，但单次 Claude 上下文窗口决定了可处理的文本量。超长文档建议先按章节拆分。

---

## 许可

MIT

## Star!
如果好看，求个 Star！！！
