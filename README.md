# PPT Skills 图鉴 — many-ppt-skills 可视化前端

基于登记册仓库 [brycewang-stanford/many-ppt-skills](https://github.com/brycewang-stanford/many-ppt-skills)
的**真实数据**构建的纯静态网页：227 个 AI 幻灯片 Skill 的清单、透明综合分、风格样图图库、
多维筛选 / 搜索，以及「怎么获取、怎么在 Workbuddy 等 Agent 里用」的指南。

- **纯静态**：HTML / CSS / JS，无构建步骤、无框架、无依赖，数据以 `window.REG` 内嵌（`file://` 双击也能开）。
- **三页签结构**：顶栏「首页 / 技能 / 风格图库」——首页只放图鉴（Hero + 路线问题 + 精选 Top 6 + 怎么用），技能列表与样图图库各自独立成页，页面不再一屏滚到底；支持 `#home` / `#skills` / `#gallery` 直达。
- **一键复制个性化提示词**：图库卡片、详情抽屉的风格标签、灯箱按钮，点击不再是干巴巴的风格 ID，而是**按风格 ID 区分**的完整提示词：写明 Skill 来源（repo）、自动检查安装、未安装先征得你同意再装（附安装命令）、给出该风格的专属要点与样图参考；主题 / 受众用【】占位，粘贴后替换即可。
  没有风格 ID 的样图 / skill（登记册未标注）也照样可复制 —— 提示词自动改为**按该 skill 默认风格**措辞，照其样图与 SKILL.md 出活；GitHub 仓库卡片兜底封面只是来源标注、并非样图，**不会**写进提示词的「参考样图」。
- **运行时自动同步**：页面加载后自动从 GitHub 拉取登记册最新数据（四源回退），成功则徽章变「已同步 GitHub 最新数据」，失败静默回退内嵌数据、徽章可点击重试。
- **Linear 风格，深浅双主题**：顶栏 / `T` 键 / 命令面板可切换，选择写入 `localStorage`，默认跟随系统。
- **每个 skill 都有配图**：登记册本身只给 43 个 skill 提供样图，其余 184 个由 `harvest_covers.py`
  从各仓库 README 自动补采首图、再以 GitHub opengraph 仓库卡片兜底——227 个 skill 全部有封面。
  551 张样图中 534 张本地化到 `assets/img/`（900px 宽 JPEG）；
  少数下载失败的保留原始 URL 兜底，浏览器加载失败时自动回退到 `origin` 原文件链接，
  彻底失效才降级为字母占位（当前仅 1 例，系登记册上游死链）。

## 直接打开

```powershell
# 方式一：任意静态服务器
python -m http.server 8642 --directory F:\OpenCode\ppt-skills-web
# 浏览器访问 http://localhost:8642

# 方式二：直接双击 index.html（数据内嵌，file:// 也能运行）
```

## 功能一览

| 区块 | 内容 |
|---|---|
| 首页 · Hero | 收录数 / 合计 star / 人工核读数 / 样图数 / Tier S 数，路线胶囊直达筛选；数据同步徽章（点按重试） |
| 首页 · 路线问题 | HTML vs 原生 PPTX 对比表 + 完整决策树（读自登记册 README） |
| 首页 · 精选 | 综合分 Top 6 卡片预览，一键跳到完整列表 |
| 技能页签 | 路线 / Tier / 许可 / 能力 / 标记多维筛选，文本搜索（名称、简介、repo、**风格 ID**），四种排序，卡片含评分环、能力点阵、安装命令复制 |
| 详情抽屉 | 综合分拆解条、亮点、动效说明、能力矩阵（含文档原文引用）、**风格 ID 一键复制个性化提示词**（来源 + 安装检查 + 风格要点）、样图画廊、安装命令、仓库数据 |
| 风格图库页签 | 全部样图瀑布流，按风格 ID 过滤，灯箱支持 ←/→、出处回链，卡片与灯箱均可**一键复制个性化提示词**（每个风格不同） |
| 命令面板 | `Ctrl/⌘ K`：搜 skill、搜风格 ID、打开页签、跳转、切主题、重置筛选 |
| 首页 · 指南 | 四步筛选法、60 秒做出同款（含个性化提示词说明）、Workbuddy 等 Agent 使用方法、八条原则、诚实的局限 |

## 综合分口径（非官方、非实测）

登记册明确拒绝编造分数，本页改为**按公开数据透明计算**，总分 100，抽屉里逐项展开：

| 分项 | 满分 | 依据 |
|---|---:|---|
| star 热度 | 45 | `log10(stars+1)` 对数归一（60k 封顶） |
| 近期活跃 | 15 | `pushed_at`：≤90 天 15 / ≤180 天 12 / ≤1 年 8 / 更久 4 |
| 许可友好 | 15 | MIT/Apache/BSD/Unlicense 15 · 未标注 8 · GPL/AGPL 4 |
| 人工核读 | 10 | 登记册人工读过其 SKILL.md（227 中的 39 个） |
| 能力覆盖 | 15 | 文档声明「支持」的能力数 / 10（未核读记 0，卡片标注） |

> star 衡量关注度，不是质量；样图是各项目自己挑的宣传帧，不是同题横评。
> Tier 口径与登记册一致：S = 5k+ star，A = 100–5k，B = <100（`pin_tier` 字段优先）。

### 运行时自动同步（many-ppt-skills 更新怎么办）

页面**不需要重新部署**也能跟上登记册更新：

1. 加载约 1.5 秒后，后台自动 `fetch` 登记册最新 `data/*.json`，源依次回退
   `raw.githubusercontent.com` → `cdn.jsdelivr.net` → `gh-proxy.com` → `ghfast.top`（各带超时）。
2. 成功：在浏览器内按与 `build_data.py` **完全相同**的合并与评分逻辑重算
   （star / 活跃 / 许可 / 核读 / 能力五项），刷新列表、计数与徽章
   「已同步 GitHub 最新数据 · 刷新于 …」，页脚记录同步时间。
   已有 URL 复用本地缓存图，新出现的样图 URL 直连远程加载。
3. 失败（网络不通 / GitHub 镜像不可达）：**静默回退内嵌数据**，页面照常可用；
   徽章变为「离线 · 使用内嵌数据（点击重试）」，点徽章可手动重试。

仍需重跑 `build_data.py` 的场景：要把新样图**下载到本地**、补采封面有更新
（`harvest.json` 变更后）、README 派生内容更新
（五种安装方式 / 决策树 / 图库风格 ID 区块）、以及离线打包部署。

## 数据与构建

```powershell
python F:\OpenCode\ppt-skills-web\harvest_covers.py       # 补采封面：无样图 skill -> 其仓库 README 首图（生成 data/harvest.json）
python F:\OpenCode\ppt-skills-web\build_data.py           # 合并数据 + 下载样图（断点续传）
python F:\OpenCode\ppt-skills-web\build_data.py --skip-images
```

补采封面三级策略（`harvest_covers.py`，断点续传，可重复执行）：

1. 抓该 skill 自己仓库的 `README.md`（main → master，代理 / 镜像 / 直连回退，缓存于 `data/readmes/`），
   解析其中的图片链接（相对路径转 raw 直链），过滤徽章与非图片附件，按「截图/预览」关键词打分取前 2 张；
2. README 里没有可用图（或仓库无 README）→ 用 GitHub 官方 opengraph 仓库卡片
   `https://opengraph.githubassets.com/1/<owner>/<repo>` 兜底；
3. 运行时同步后，线上 `samples.json` 仍无该 skill 样图的，页面沿用内嵌（含补采）图片。

输入（`data/`，从登记册 raw 拉取的原始文件）：

- `skills.json` — 227 个 skill 的 id / repo / 路线 / 许可 / 简介 / 亮点 / 安装命令（人工核读 39 条）
- `stats.json` — 各仓库 star / fork / 许可 / pushed_at（刷新于 2026-09-04）
- `capabilities.json` — 10 项能力的逐 skill 判定（yes / no / unclear）+ 文档原文引用
- `samples.json` — 每个 skill 的样图 URL（钉死到 commit SHA）+ 风格 slug
- `harvest.json` — 人工补采封面（`harvest_covers.py` 生成）：无样图 skill 的仓库 README 首图 / OG 卡片
- `registry_README.md` — 解析计数行、Tier 表、五种安装方式、路线对比表、决策树、图库风格 ID

输出：`assets/js/data.js`（`window.REG = {...}`，约 490KB）。

### 网络说明（大陆环境下构建）

- 下载候选源：本机代理 `127.0.0.1:7897`（如可用）→ 直连 → `gh-proxy.com` → `ghfast.top`（各带超时）；
  `opengraph` / `github.com` 等非 raw 域名同样有直连兜底，URL 含中文等非 ASCII 路径会先百分号编码。
- 下载支持断点续传（已存在的 jpg 直接跳过）；并发被限流失败的图，收尾再做一轮**串行慢速重试**；
  彻底失败的以 `origin` 字段保留原链，前端运行时再兜底一次。

## 目录结构

```
ppt-skills-web/
├── index.html              # 单页结构
├── build_data.py           # 数据合并 + 图片下载 + 生成 data.js
├── harvest_covers.py       # 补采封面：缺图 skill -> 仓库 README 首图 / OG 卡片
├── README.md
├── data/                   # 原始 JSON / README / 补采封面（构建输入）
├── assets/
│   ├── css/app.css         # 双主题 tokens + 全部样式
│   ├── js/data.js          # 构建生成（勿手改）
│   ├── js/app.js           # 渲染 / 筛选 / 抽屉 / 命令面板 / 灯箱
│   └── img/<skill-id>/*.jpg# 本地化样图（534 张，共 ~20MB，227 个 skill 全覆盖）
```

## 素材与署名

- 数据与文案源自 `many-ppt-skills` 登记册（CC BY 4.0），样图版权归各项目所有，
  页面内均以「出处」链接回 GitHub 原文件；本站只做压缩与缓存。
- 本页与登记册均未实跑过各 skill，具体触发词与参数以各自 `SKILL.md` 为准。
