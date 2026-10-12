#BRANCH:main
# 西电 Slides 技能包

基于西安电子科技大学视觉规范创建专业 HTML 演示文稿的 AirJelly 技能包。

## 📋 概述

本技能包参考西电 LaTeX 模板 (xduts)，将学校的视觉识别系统转化为现代化、交互式的 Web 演示体验。适用于：

- 📚 课程汇报
- 🎓 毕业答辩
- 🔬 学术会议
- 💼 项目展示

## ✨ 特性

- **西电特色**：融合西电 logo、校色、排版规范
- **零依赖**：单 HTML 文件，无需 npm 或构建工具
- **富动画**：平滑过渡、分层显示、响应式动画
- **专业品质**：代码注释详尽、支持无障碍访问、打印友好

## 🎨 西电配色

- **主蓝色**：`#003f87` - 学术专业
- **西电红**：`#c41e3a` - 传统特色
- **典雅灰**：`#2c3e50` - 现代工程

## 🚀 快速开始

### 示例文件

- `example-xidian-slides.html` - 完整的毕业答辩示例
- `SKILL.md` - 完整技能包文档

### 使用方法

在 AirJelly 中调用：

```
帮我制作一个西电风格的毕业答辩 slides
```

或

```
把我的 presentation.pptx 转成西电风格的网页版
```

## 📂 文件结构

```
xidian-slides-skill/
├── SKILL.md                      # 技能包核心文档
├── README.md                     # 本文件
├── example-xidian-slides.html    # 完整示例
└── assets/
    └── xdulogo.pdf               # 西电 logo
```

## 🎯 功能亮点

### 导航方式

- ⌨️ 键盘：方向键、空格、Home/End
- 🖱️ 鼠标：滚轮翻页
- 👆 触摸：上下滑动
- 🔘 导航点：点击跳转

### 视觉效果

- 渐变背景（西电配色）
- 网格纹理
- 分层动画入场
- 进度条指示
- 导航点提示

### 响应式设计

- 桌面端：大字号、完整导航
- 移动端：自适应布局、触摸优化
- 打印：友好的分页输出

## 🛠️ 自定义指南

### 修改配色

在 HTML 的 `:root` CSS 变量中修改：

```css
:root {
  --xdu-blue: #003f87;      /* 主色调 */
  --xdu-red: #c41e3a;       /* 强调色 */
  --accent: var(--xdu-blue);
}
```

### 修改字体

更改 Google Fonts 链接和 CSS 变量：

```css
:root {
  --font-heading: 'Your Font', sans-serif;
  --font-body: 'Your Font', serif;
}
```

### 调整动画

修改动画时长和缓动函数：

```css
:root {
  --duration: 0.5s;
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 📖 参考资料

- [xduts LaTeX 模板](https://github.com/note286/xduts) - 西电官方 LaTeX 套装
- [西安电子科技大学](https://www.xidian.edu.cn/) - 学校官网

## 📄 许可

本技能包基于西电 LaTeX 模板 (xduts) 的设计规范，遵循原始许可证。

xduts 遵循 [LaTeX Project Public License v1.3c](https://www.latex-project.org/lppl.txt)。

---

**Created for AirJelly** 🎈
