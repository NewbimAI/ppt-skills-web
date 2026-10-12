/* PPT Skills 图鉴 — app.js （数据来自 window.REG，由 build_data.py 生成） */
(function () {
"use strict";

/* ═══════════════ 常量 ═══════════════ */
const REG = window.REG;
if (!REG) { document.body.innerHTML = "<p style='padding:40px;font-family:sans-serif'>data.js 未加载 —— 先运行 python build_data.py</p>"; return; }

const ROUTE = {
  html:     { name: "HTML 路线", color: "#6e7ae8" },
  pptx:     { name: "PPTX 路线", color: "#f97a3d" },
  hybrid:   { name: "双路线",    color: "#2bc5a3" },
  framework:{ name: "框架",      color: "#9c6ade" },
  image:    { name: "图片型",    color: "#ec5f9c" },
  suite:    { name: "套件",      color: "#38b6e6" },
  templates:{ name: "模板库",    color: "#9ac83a" },
  list:     { name: "列表",      color: "#8a93a2" },
};
const TIER_COLOR = { S: "#8b8ff0", A: "#4ca1f0", B: "#7c8494" };
const PRINCIPLES = [
  ["Show, don't tell", "永远不要问审美。生成选项让人指。"],
  ["反 slop 靠禁用清单", "「做好看点」没用，「禁用 Inter」有用。"],
  ["幻灯片是印刷品", "固定 1920×1080，等比缩放，加黑边。放弃响应式。"],
  ["约束胜过自由", "锁死配色。Agent 会更稳定，而不是更无能。"],
  ["SKILL.md 是目录", "Zara 把 1,625 行砍到 183 行，功能不变，context 省 89%。"],
  ["单文件比框架活得久", "依赖就是债。全部内联。"],
  ["渲染出来，然后看一眼", "视觉产物需要视觉验收。截图，让模型自己看。"],
  ["蒸馏，而非设计", "先手工做三十遍，再写 skill。"],
];
const SCORE_MAX = { stars: 45, activity: 15, license: 15, verified: 10, caps: 15 };
const SCORE_LABEL = { stars: "star 热度", activity: "近期活跃", license: "许可友好", verified: "人工核读", caps: "能力覆盖" };
const CAP_CN = {};
(REG.capMeta || []).forEach(c => CAP_CN[c.key] = c.label_zh);

const TABS = ["home", "skills", "gallery"];
let BADGE_STATE = "init";

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = t => String(t == null ? "" : t).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const num = n => (n || 0).toLocaleString("en-US");
const rc = s => (ROUTE[s.route] || ROUTE.list).color;
const routeName = s => s.routeLabel || (ROUTE[s.route] || {}).name || s.route;
const scoreColor = t => t >= 78 ? "#3fb950" : t >= 60 ? "#8b8ff0" : "#7c8494";

/* ═══════════════ 全局状态 ═══════════════ */
const ST = {
  q: "", gq: "",
  route: new Set(), tier: new Set(), lic: new Set(), flag: new Set(), cap: new Set(),
  sort: "score", shown: 60, gShown: 80,
};

/* ═══════════════ 工具：复制 / toast / 主题 ═══════════════ */
let toastTimer = null;
function toast(msg, ok) {
  const t = $("#toast");
  t.innerHTML = (ok !== false ? '<span class="ok">✓</span>' : "") + esc(msg);
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 1900);
}
function copy(text, msg) {
  const done = () => toast(msg || "已复制到剪贴板");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
  } else fallbackCopy(text, done);
}
function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); done(); } catch (e) { toast("复制失败，请手动选择", false); }
  ta.remove();
}
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem("pptskills-theme", t); } catch (e) {}
}
function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(next); toast(next === "dark" ? "已切换深色主题" : "已切换浅色主题");
}

/* ═══════════════ 图片（本地优先，origin 兜底） ═══════════════ */
window.IMG_ERR = function (el) {
  const o = el.dataset.origin;
  if (o && el.dataset.tried !== "1") { el.dataset.tried = "1"; el.src = o; return; }
  const p = el.closest(".thumb, .gi-img, .dw-cover");
  if (p) {
    const host = p.classList.contains("gi-img") ? p.parentElement : p;
    host.classList.add("noimg");
  }
  el.remove();
};
function imgTag(img, extra) {
  if (!img) return "";
  const src = img.local || img.remote || img.origin || "";
  if (!src) return "";
  return '<img loading="lazy" decoding="async" src="' + esc(src) + '"' +
    (img.origin && img.local ? ' data-origin="' + esc(img.origin) + '"' : "") +
    ' alt="' + esc(img.label || "样图") + '" onerror="IMG_ERR(this)"' + (extra || "") + ">";
}

/* ═══════════════ Hero ═══════════════ */
function counts() {
  const c = REG.meta.counts || {};
  const skills = REG.skills;
  const total = c.total || skills.length;
  const hand = c.hand_read || skills.filter(s => s.handRead).length;
  let stars = c.stars;
  if (!stars) {
    const seen = new Set(); stars = 0;
    skills.forEach(s => { if (!seen.has(s.repo)) { seen.add(s.repo); stars += s.stars; } });
  }
  return { total, hand, stars, refreshed: c.refreshed || "—",
    html: c.html || REG.meta.routes.html || 0,
    pptx: c.pptx || REG.meta.routes.pptx || 0,
    hybrid: c.hybrid || REG.meta.routes.hybrid || 0 };
}
function renderHero() {
  const c = counts();
  setBadge(BADGE_STATE, c.refreshed);
  $("#heroTotal").textContent = c.total;
  $("#heroLede").textContent =
    "收录 " + c.total + " 个 AI 幻灯片 skill，其中 " + c.hand +
    " 个人工读过 SKILL.md；按真正决定选择的点对比 —— 输出路线、能力、许可、风格样图，全部是可核对的事实。";
  $("#footBuilt").textContent = REG.meta.builtAt +
    (REG.meta.syncedAt ? " · 同步于 " + REG.meta.syncedAt : "");

  const stats = [
    [num(c.total), "收录 skill"],
    [num(c.stars), "合计 star（登记册）"],
    [num(c.hand), "人工核读 SKILL.md"],
    [num(REG.meta.imgCount), "张样图 · " + REG.meta.imgSkills + " 个 skill"],
    [num(REG.meta.tiers.S), "Tier S 头部项目"],
  ];
  $("#heroStats").innerHTML = stats.map(([v, k]) =>
    '<div class="stat"><div class="v">' + v + '</div><div class="k">' + esc(k) + "</div></div>").join("");

  const routes = Object.entries(REG.meta.routes).sort((a, b) => b[1] - a[1]);
  $("#heroRoutes").innerHTML = routes.map(([k, n]) => {
    const meta = ROUTE[k] || { name: k, color: "#8a93a2" };
    return '<button class="rpill" data-route="' + k + '" style="--rc:' + meta.color + '">' +
      "<i></i>" + esc(meta.name) + " <b>" + n + "</b></button>";
  }).join("");
}

/* ═══════════════ 路线区块 ═══════════════ */
function mdInline(t) {
  return esc(t)
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}
function renderRoute() {
  const rows = REG.routeTable || [];
  const mk = (side, title, sub, color) => {
    const r = rows.map(x => {
      const label = x.label.replace(/\*/g, "");
      const val = side === "html" ? x.html : x.pptx;
      if (label.includes("从这个开始"))
        return '<div class="starter"><b>' + esc(label) + "：</b>" + mdInline(val) + "</div>";
      return '<div class="rr"><span class="l">' + esc(label) + '</span><span class="v">' + mdInline(val) + "</span></div>";
    }).join("");
    return '<div class="route-card" style="--rc:' + color + '">' +
      "<h3><i></i>" + esc(title) + '</h3><div class="sub">' + esc(sub) + "</div>" +
      '<div class="route-rows">' + r + "</div></div>";
  };
  $("#routeCmp").innerHTML =
    mk("html", "HTML 路线", "产出单个 .html，浏览器放映", ROUTE.html.color) +
    mk("pptx", "原生 PPTX 路线", "产出真正的 .pptx", ROUTE.pptx.color);

  const tree = (REG.decisionTree || []).map(l =>
    esc(l)
      .replace(/^(交付物.*[？?])$/, "<b>$1</b>")
      .replace(/──▶/g, "──▶")
  ).join("\n");
  $("#decisionTree").innerHTML = tree || "（决策树解析为空）";
}

/* ═══════════════ 筛选 chips ═══════════════ */
function chip(group, val, label, opts) {
  const on = ST[group].has(val);
  const c = opts && opts.color;
  return '<button class="chip' + (on ? " on" : "") + '" data-group="' + group + '" data-val="' + esc(val) + '">' +
    (c ? '<span class="cdot" style="--cc:' + c + '"></span>' : "") +
    esc(label) +
    (opts && opts.count != null ? "<b>" + opts.count + "</b>" : "") +
    '<span class="cx">✕</span></button>';
}
function renderChips() {
  const sk = REG.skills;
  $("#chipsRoute").innerHTML = Object.entries(REG.meta.routes)
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => chip("route", k, (ROUTE[k] || {}).name || k, { count: n, color: (ROUTE[k] || {}).color }))
    .join("");
  $("#chipsTier").innerHTML = ["S", "A", "B"].map(t =>
    chip("tier", t, "Tier " + t, { count: REG.meta.tiers[t], color: TIER_COLOR[t] })).join("");
  const lc = { permissive: 0, copyleft: 0, unknown: 0 };
  sk.forEach(s => lc[s.licenseClass]++);
  $("#chipsLic").innerHTML =
    chip("lic", "permissive", "宽松许可", { count: lc.permissive, color: "#3fb950" }) +
    chip("lic", "copyleft", "Copyleft", { count: lc.copyleft, color: "#d9a13c" }) +
    chip("lic", "unknown", "未标注", { count: lc.unknown, color: "#8a93a2" });
  $("#chipsFlag").innerHTML =
    chip("flag", "read", "人工核读", { count: sk.filter(s => s.handRead).length }) +
    chip("flag", "img", "有样图", { count: sk.filter(s => s.images.length).length }) +
    chip("flag", "style", "有风格 ID", { count: sk.filter(s => s.styleIds.length).length });
  $("#chipsCap").innerHTML = (REG.capMeta || []).map(c => {
    const n = sk.filter(s => s.caps[c.key] === "yes").length;
    return chip("cap", c.key, c.label_zh, { count: n });
  }).join("");
}
function setChipCounts() {} // chips 的计数是全量口径，保持不变

/* ═══════════════ 过滤 + 排序 ═══════════════ */
function matchQ(s, q) {
  if (!q) return true;
  const hay = (s.name + " " + s.id + " " + s.repo + " " + s.author + " " + s.tagline + " " +
    s.taglineEn + " " + s.bestFor + " " + routeName(s) + " " + s.license + " " +
    s.styleIds.join(" ") + " " + s.highlights.join(" ")).toLowerCase();
  return hay.includes(q);
}
function filtered() {
  const q = ST.q.trim().toLowerCase();
  let list = REG.skills.filter(s => {
    if (ST.route.size && !ST.route.has(s.route)) return false;
    if (ST.tier.size && !ST.tier.has(s.tier)) return false;
    if (ST.lic.size && !ST.lic.has(s.licenseClass)) return false;
    if (ST.flag.has("read") && !s.handRead) return false;
    if (ST.flag.has("img") && !s.images.length) return false;
    if (ST.flag.has("style") && !s.styleIds.length) return false;
    for (const k of ST.cap) if (s.caps[k] !== "yes") return false;
    return matchQ(s, q);
  });
  const cmp = {
    score: (a, b) => b.score.total - a.score.total || b.stars - a.stars,
    stars: (a, b) => b.stars - a.stars,
    active: (a, b) => (b.pushedAt || "").localeCompare(a.pushedAt || ""),
    name: (a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"),
  }[ST.sort];
  return list.sort(cmp);
}
function anyFilter() {
  return !!(ST.q || ST.route.size || ST.tier.size || ST.lic.size || ST.flag.size || ST.cap.size);
}
function resetAll() {
  ST.q = ""; ST.route.clear(); ST.tier.clear(); ST.lic.clear(); ST.flag.clear(); ST.cap.clear();
  $("#q").value = "";
  ST.shown = 60; ST.gShown = 80;
  renderChips(); renderGrid(); renderGallery();
}

/* ═══════════════ 技能卡片 ═══════════════ */
function scoreRing(t, size) {
  const r = (size - 4) / 2, c = 2 * Math.PI * r, off = c * (1 - t / 100);
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '">' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="rgba(0,0,0,.42)" stroke="rgba(255,255,255,.24)" stroke-width="2.5"/>' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + scoreColor(t) +
    '" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) +
    '" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')"/></svg>';
}
function capDots(s) {
  const meta = REG.capMeta || [];
  return meta.map(m => {
    const v = s.caps[m.key];
    const cls = v === "yes" ? "yes" : v === "no" ? "no" : "";
    return '<span class="cd ' + cls + '" title="' + esc(m.label_zh) + "：" +
      (v === "yes" ? "文档声明支持" : v === "no" ? "文档明确说不支持" : "文档未提及（≠不支持）") + '"></span>';
  }).join("");
}
function cardHTML(s) {
  const cover = s.cover;
  const letter = esc((s.name || "?").trim()[0] || "?");
  const styleChips =
    s.styleIds.slice(0, 2).map(x => '<span class="mchip style">' + esc(x) + "</span>").join("") +
    (s.styleIds.length > 2 ? '<span class="mchip more">+' + (s.styleIds.length - 2) + "</span>" : "");
  return '<article class="card" data-id="' + esc(s.id) + '" tabindex="0" role="button" aria-label="' + esc(s.name) + ' 详情">' +
    '<div class="thumb' + (cover ? "" : " noimg") + '" style="--rc:' + rc(s) + '" data-letter="' + letter + '">' +
      imgTag(cover) +
      '<div class="ovl">' +
        '<span class="t-tier" style="--tc:' + TIER_COLOR[s.tier] + '" title="Tier ' + s.tier + '（' + ({ S: "5k+ star 规模验证", A: "100–5k 实用候选", B: "新 / 小众" }[s.tier] || "") + '）">' + s.tier + "</span>" +
        '<span class="t-route" style="--rc:' + rc(s) + '">' + esc(routeName(s)) + "</span>" +
        (s.images.length ? '<span class="t-count">🖼 ' + s.images.length + "</span>" : "") +
        '<div class="t-score" title="综合分 ' + s.score.total + '">' + scoreRing(s.score.total, 30) +
          '<span class="num">' + s.score.total + "</span></div>" +
      "</div>" +
    "</div>" +
    '<div class="cbody">' +
      '<div class="c-title"><h3>' + esc(s.name) + "</h3>" +
        '<span class="c-stars">★ ' + esc(s.starsText) + "</span></div>" +
      '<p class="c-tag">' + esc(s.tagline) + "</p>" +
      '<div class="c-meta">' +
        '<span class="mchip lic-' + s.licenseClass + '" title="' + esc(s.licenseHint) + '">' + esc(s.license) + "</span>" +
        (s.handRead ? '<span class="mchip verified" title="登记册人工读过它的 SKILL.md">✓ 核读</span>' : "") +
        styleChips +
      "</div>" +
      '<div class="c-caps">' + capDots(s) + '<span class="cl">' + s.capsYes + "/10 能力声明</span></div>" +
    "</div>" +
    '<div class="c-foot"><span class="open">查看详情 →</span><span class="spacer"></span>' +
      (s.install ? '<button class="mini-btn" data-copy="' + esc(s.install.command) + '" title="复制安装命令">⧉ 安装</button>' : "") +
      '<a class="mini-btn" href="' + esc(s.url) + '" target="_blank" rel="noopener" title="打开 GitHub">GitHub ↗</a>' +
    "</div></article>";
}
function renderGrid() {
  const list = filtered();
  const slice = list.slice(0, ST.shown);
  $("#grid").innerHTML = slice.map(cardHTML).join("");
  $("#empty").hidden = list.length > 0;
  $("#moreBtn").hidden = list.length <= ST.shown;
  const total = REG.skills.length;
  const imgs = list.reduce((n, s) => n + s.images.length, 0);
  $("#resultCount").innerHTML = anyFilter()
    ? "命中 <b>" + list.length + "</b> / " + total + " · 样图 " + imgs + " 张"
    : total + " 个 skill · " + REG.meta.imgCount + " 张样图";
}

/* ═══════════════ 风格图库 ═══════════════ */
let FLAT = [];
function renderGallery() {
  const q = ST.gq.trim().toLowerCase();
  FLAT = [];
  const parts = [];
  filtered().forEach(s => {
    s.images.forEach(img => {
      const hay = ((img.style || "") + " " + (img.label || "") + " " + s.name + " " + s.id).toLowerCase();
      if (q && !hay.includes(q)) return;
      const idx = FLAT.push({ s, img }) - 1;
      parts.push(
        '<article class="gi' + (img.local || img.remote || img.origin ? "" : " noimg") + '" data-flat="' + idx + '" style="--rc:' + rc(s) + '">' +
          '<div class="gi-img">' + imgTag(img) + "</div>" +
          '<div class="gi-cap"><div class="l1">' + esc(img.label || "样图") + "</div>" +
          '<div class="l2"><span class="sid">' + esc(img.style || "—") + "</span>" +
          '<span class="sk"><b>' + esc(s.name) + "</b> · " + esc(routeName(s)) + "</span>" +
          '<button class="mini-btn" data-prompt="1" data-sid="' + esc(s.id) + '"' + (img.style ? ' data-style="' + esc(img.style) + '"' : "") + ' data-label="' + esc(img.label || "") + '" title="复制完整提示词">⧉ 提示词</button>' +
          "</div></div></article>");
    });
  });
  $("#giGrid").innerHTML = parts.slice(0, ST.gShown).join("") ||
    '<div class="pal-empty">当前筛选下没有样图。</div>';
  $("#giMore").hidden = parts.length <= ST.gShown;
}

/* ═══════════════ 精选 & 提示词 ═══════════════ */
function renderFeatured() {
  const el = $("#featuredGrid");
  if (!el) return;
  const top = REG.skills.slice()
    .sort((a, b) => b.score.total - a.score.total || b.stars - a.stars)
    .slice(0, 6);
  el.innerHTML = top.map(cardHTML).join("");
}
/* 每个风格的个性化要点（按风格 ID / 样图标题命中，未命中给兜底） */
const STYLE_HINTS = [
  [["editorial"], "杂志编辑风：大标题压图、栏式图文混排、精致小字注释"],
  [["swiss", "瑞士"], "瑞士国际主义：强栅格对齐、无衬线大标题、留白克制、单一强调色"],
  [["forest"], "森林编辑色系：深绿打底、米白正文、粉黄小面积点缀"],
  [["glass"], "毛玻璃质感：半透明卡片层叠、背景模糊、柔和渐变光晕"],
  [["memphis"], "孟菲斯几何：高饱和撞色、波点与曲线装饰、俏皮排版"],
  [["watercolor", "水彩"], "手绘水彩：纸纹底、晕染色块、轻松亲和的手写感"],
  [["journal", "数据新闻"], "数据新闻风：深色底、图表优先、注释密集、信息密度高"],
  [["lemon", "柠檬"], "荧光柠檬绿 + 瑞士排版：黑白底、高亮色块标题"],
  [["brutal"], "粗野主义：黑白高对比、超大字号、硬边框原始排版"],
  [["neon"], "霓虹科技：暗底、荧光高亮、发光描边与网格背景"],
  [["launch", "发布会"], "发布会式：深底大图特写、单句卖点、节奏留白"],
  [["academic", "medical", "医学"], "学术 / 医学规范：白底蓝灰主色、衬线标题、规整图表、脚注齐全"],
  [["nature", "wildlife", "自然"], "自然纪实：大幅照片主导、大地色系、安静排版"],
  [["zine", "bookstore", "书店", "拼贴"], "独立 zine / 书店拼贴：纸质感、剪贴标题、手写标注"],
  [["garden", "magazine"], "花园杂志风：植物点缀、柔和色块、优雅衬线"],
  [["pentagram"], "品牌工作室式排版：模块网格、强字体层级、黑白为主"],
  [["grid"], "模块化网格系统：严格对齐、版式可扩展、几何分栏"],
  [["global-ai-capital", "ai-capital"], "AI 资本数据报告：暗底图表、指标卡片、编辑感叙事"],
  [["sugar", "candy"], "糖果撞色：高饱和粉紫黄、圆角与趣味图形"],
  [["corporate", "business", "consulting", "咨询"], "商务咨询风：蓝灰主色、结论先行、克制图表"],
  [["minimal"], "极简：大量留白、单一主色、几乎无装饰"],
  [["retro", "vintage"], "复古印刷：暖旧色调、衬线大标题、颗粒质感"],
  [["tech", "claude"], "科技感：深底渐变、代码与网格元素、干净信息卡片"],
  [["dark", "暗"], "高级暗色：深底细线分隔、低饱和点缀、光感强调"],
];
function styleHint(s, style, label) {
  const base = ((style || "") + " " + (label || "")).toLowerCase();
  const ext = (s ? " " + s.id + " " + s.name : "").toLowerCase();
  for (const [keys, hint] of STYLE_HINTS)
    if (keys.some(k => base.indexOf(k) >= 0)) return hint;
  for (const [keys, hint] of STYLE_HINTS)
    if (keys.some(k => ext.indexOf(k) >= 0)) return hint;
  return style ? "沿用该风格 ID 的既有配色与版式，尽量贴近其样图"
    : "贴合该 skill 样图的配色与版式，尽量贴近参考图";
}
/* 个性化提示词：Skill 来源 → 检查安装（征得同意再装）→ 按风格出活（无风格 ID 时按默认风格） */
function buildPrompt(s, style, label) {
  if (label && label.indexOf("GitHub 仓库卡片") >= 0) label = ""; // OG 兜底封面是仓库来源标注、不是样图，不写进提示词
  const ROUTE_SPEC = { html: "产出单个 .html，浏览器放映", pptx: "产出可编辑的 .pptx", hybrid: "HTML 和 .pptx 各出一份" };
  let install;
  if (s.install && s.install.command)
    install = "用这条命令自动装（方式：" + s.install.method + "）：`" + s.install.command + "`";
  else if (s.galleryInstall)
    install = "试试这条命令（登记册抓取，以仓库 SKILL.md 为准）：`" + s.galleryInstall + "`";
  else
    install = "按仓库 SKILL.md 操作：" + s.url;
  const out = ROUTE_SPEC[s.route] ? "，" + ROUTE_SPEC[s.route] : "";
  const src = style
    ? "【风格来源】风格 ID `" + style + "` 来自 skill「" + s.name + "」（" + s.repo + "）"
    : "【风格来源】下面这条走 skill「" + s.name + "」（" + s.repo + "）的默认风格 —— 样图没标注风格 ID，按这个 skill 自己的样图与 SKILL.md 来";
  const use = style ? "用 `" + style + "` 风格" : "照这个 skill 样图的风格";
  return [
    src + (s.tagline ? " —— " + s.tagline.replace(/[。.．]+$/, "") : "") + "。" +
      (label ? "参考样图：《" + label + "》。" : "") + "",
    "【第一步 · 确认安装】先检查我这边有没有装「" + s.name + "」这个 skill；" +
      "没装的话先向我说明并征得我同意，我点头后立刻装好 —— " + install + "；装不上就停下来告诉我，不要硬来。",
    "【第二步 · 按风格出活】装好后，" + use + "把【你的主题或文档】做成一份 12 页的 deck，" +
      "面向【受众】" + out + "；这个风格的要点是：" + styleHint(s, style, label) +
      (label ? "，版式参考《" + label + "》" : "") + "。每页字少一点；先给我 3 个预览我来指，指完再展开。"
  ].join("\n");
}
function setBadge(state, refreshed) {
  BADGE_STATE = state;
  const dot = $("#badgeDot"), txt = $("#badgeText");
  if (!dot || !txt) return;
  const rf = refreshed || (REG.meta.counts || {}).refreshed || "—";
  dot.className = "dot" + (state === "fail" ? " off" : state === "syncing" ? " busy" : "");
  txt.innerHTML = state === "syncing" ? "正在同步 GitHub 最新数据…"
    : state === "ok" ? '已同步 GitHub 最新数据 · 刷新于 <b>' + esc(rf) + "</b>"
    : state === "fail" ? '离线 · 使用内嵌数据（点击重试）<b> · ' + esc(rf) + "</b>"
    : '数据源 many-ppt-skills 登记册 · 刷新于 <b id="badgeRefresh">' + esc(rf) + "</b>";
}

/* ═══════════════ 详情抽屉 ═══════════════ */
let DRAWER_SKILL = null;
function drawerHTML(s) {
  const cover = s.cover;
  const chips = [
    '<span class="mchip" style="--cc:' + TIER_COLOR[s.tier] + '"><span class="cdot" style="--cc:' + TIER_COLOR[s.tier] + '"></span>Tier ' + s.tier + "</span>",
    '<span class="mchip" style="color:' + rc(s) + '">' + esc(routeName(s)) + "</span>",
    '<span class="mchip lic-' + s.licenseClass + '" title="' + esc(s.licenseHint) + '">' + esc(s.license) + "</span>",
    s.handRead ? '<span class="mchip verified">✓ 人工核读</span>' : '<span class="mchip">未人工核读</span>',
    s.licenseWarning ? '<span class="mchip lic-copyleft">⚠ ' + esc(s.licenseWarning) + "</span>" : "",
    s.lang ? '<span class="mchip">' + esc({ zh: "中文", en: "英文", bilingual: "中英双语" }[s.lang] || s.lang) + "</span>" : "",
    s.archived ? '<span class="mchip lic-copyleft">已归档</span>' : "",
    s.stale ? '<span class="mchip lic-unknown">star 数据陈旧</span>' : "",
  ].join("");

  const parts = Object.keys(SCORE_MAX).map(k => {
    const v = s.score.parts[k] || 0, max = SCORE_MAX[k];
    return '<div class="sp"><span class="n">' + SCORE_LABEL[k] + '</span><span class="bar"><i style="width:' +
      ((v / max) * 100).toFixed(0) + '%"></i></span><span class="v">' + v + "/" + max + "</span></div>";
  }).join("");

  const capsRows = (REG.capMeta || []).map(m => {
    const v = s.caps[m.key], q = s.quotes[m.key];
    const cls = v === "yes" ? "yes" : v === "no" ? "no" : "unclear";
    const txt = v === "yes" ? "支持" : v === "no" ? "不支持" : "未提及";
    return '<div class="cr"><span class="cn">' + esc(m.label_zh) + "</span>" +
      '<span class="vp ' + cls + '">' + txt + "</span>" +
      '<span class="vq">' + (q ? "“" + esc(q) + "”" : "文档未提及 —— 不等于不支持") + "</span></div>";
  }).join("");

  const strip = s.images.map((img, i) =>
    '<div class="gi" data-dwflat="' + i + '" style="--rc:' + rc(s) + '">' +
      '<div class="gi-img">' + imgTag(img) + "</div>" +
      '<div class="gi-cap"><div class="l1">' + esc(img.label || "样图") + "</div>" +
      '<div class="l2"><span class="sid">' + esc(img.style || "—") + "</span></div></div></div>").join("");

  const install = s.install
    ? '<div class="cmd-box"><span class="meth">' + esc(s.install.method) + "</span><code>" +
      esc(s.install.command) + '</code><button class="copy-btn" data-copy="' + esc(s.install.command) + '">复制</button></div>'
    : '<div class="no-install">登记册<b>没有给这个 skill 人工核读过安装命令</b> —— 打开仓库，看它自己的 <code>SKILL.md</code> / README 为准。' +
      (s.galleryInstall ? "<br><br>图库区块抓到的命令：<br><code>" + esc(s.galleryInstall) + "</code>" : "") + "</div>";

  return '<div class="dw-head">' +
    '<div class="dw-cover' + (cover ? "" : " noimg") + '" style="--rc:' + rc(s) + '">' + imgTag(cover) +
      (cover ? '<div class="ovl"></div>' : "") + "</div>" +
    '<button class="dw-close" id="dwClose" aria-label="关闭">✕</button></div>' +
    '<div class="dw-body">' +
      '<div class="dw-title"><div><h2>' + esc(s.name) + "</h2>" +
        '<div class="sub">' + esc(s.repo) + (s.path ? "/" + esc(s.path.split("/").slice(3).join("/")) : "") + "</div></div></div>" +
      '<div class="dw-chips">' + chips + "</div>" +

      '<div class="score-box"><div class="score-big"><div class="sv" style="color:' + scoreColor(s.score.total) + '">' +
        s.score.total + '</div><div class="sl">综合分 / 100</div></div><div class="score-parts">' + parts + "</div></div>" +
      '<div class="score-note">按登记册公开数据计算（star · 活跃 · 许可 · 核读 · 能力），<b>不是实测质量排名</b>。</div>' +

      '<div class="dw-sec"><h4>一句话</h4><p class="dw-tag">' + esc(s.tagline) + "</p>" +
        (s.bestFor ? '<div class="dw-best"><b>适合：</b>' + esc(s.bestFor) + "</div>" : "") + "</div>" +

      (s.highlights.length ? '<div class="dw-sec"><h4>亮点（人工核读）</h4><ul class="hl-list">' +
        s.highlights.map(h => "<li>" + esc(h) + "</li>").join("") + "</ul></div>" : "") +

      (s.motion ? '<div class="dw-sec"><h4>动效</h4><p class="dw-tag" style="font-size:13.5px;color:var(--text-2)">' +
        esc(s.motion) + "</p></div>" : "") +

      '<div class="dw-sec"><h4>能力矩阵（读自文档）</h4><div class="caps-tbl">' + capsRows + "</div></div>" +

      '<div class="dw-sec"><h4>风格 ID' + (s.styleIds.length ? "（点击复制提示词）" : "") + "</h4>" +
        (s.styleIds.length
          ? '<div class="style-chips">' + s.styleIds.map(x => '<button class="schip" data-prompt="1" data-sid="' + esc(s.id) + '" data-style="' + esc(x) + '" title="点击复制完整提示词">' + esc(x) + "</button>").join("") +
            (s.styleMore ? '<span class="schip dim">还有 ' + s.styleMore + " 个</span>" : "") + "</div>"
          : '<p class="gnote">样图文件名里没提取到风格 ID —— 装好后以该项目 SKILL.md 为准。</p>' +
            '<button class="btn sm ghost" data-prompt="1" data-sid="' + esc(s.id) + '"' +
            (s.cover && s.cover.label ? ' data-label="' + esc(s.cover.label) + '"' : "") +
            ' title="复制完整提示词（按默认风格）" style="margin-top:8px">⧉ 复制提示词（默认风格）</button>') + "</div>" +

      (s.images.length ? '<div class="dw-sec"><h4>样图 ' + s.images.length + " 张（点击放大）</h4>" +
        '<div class="dw-strip">' + strip + "</div></div>" : "") +

      '<div class="dw-sec"><h4>安装</h4>' + install +
        (s.requires.length ? '<div class="dw-chips" style="margin-top:10px">' +
          s.requires.map(r => '<span class="mchip">依赖 ' + esc(r) + "</span>").join("") + "</div>" : "") + "</div>" +

      '<div class="dw-sec"><h4>仓库数据</h4><div class="dw-stats">' +
        "<span>★ <b>" + esc(s.starsText) + "</b></span><span>fork <b>" + num(s.forks) + "</b></span>" +
        "<span>最近活跃 <b>" + esc(s.pushedAt || "—") + "</b></span>" +
        '<span title="' + esc(s.licenseHint) + '">协议 <b>' + esc(s.license) + "</b></span></div>" +
        '<div class="dw-links"><a class="btn sm" href="' + esc(s.url) + '" target="_blank" rel="noopener">GitHub ↗</a>' +
        (s.homepage ? '<a class="btn sm ghost" href="' + esc(s.homepage) + '" target="_blank" rel="noopener">主页 ↗</a>' : "") +
        '<a class="btn sm ghost" href="' + esc(s.url) + '#readme" target="_blank" rel="noopener">SKILL.md / README ↗</a></div>' +
      "</div>" +
    "</div>";
}
function openDrawer(id) {
  const s = REG.skills.find(x => x.id === id);
  if (!s) return;
  DRAWER_SKILL = s;
  $("#drawerInner").innerHTML = drawerHTML(s);
  $("#drawerInner").scrollTop = 0;
  $("#drawerScrim").hidden = false;
  requestAnimationFrame(() => {
    $("#drawerScrim").classList.add("show");
    $("#drawer").classList.add("open");
  });
  $("#drawer").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  $("#drawer").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
  $("#drawerScrim").classList.remove("show");
  setTimeout(() => { $("#drawerScrim").hidden = true; }, 300);
  document.body.style.overflow = "";
  DRAWER_SKILL = null;
}
const drawerOpen = () => $("#drawer").classList.contains("open");

/* ═══════════════ 灯箱 ═══════════════ */
let LB = { list: [], i: 0 };
function openLightbox(list, i) {
  if (!list.length) return;
  LB = { list, i };
  $("#lightbox").hidden = false;
  showLB();
}
function showLB() {
  const { img, s } = LB.list[LB.i];
  $("#lbImg").src = img.local || img.remote || img.origin || "";
  $("#lbImg").onerror = function () {
    if (img.origin && this.dataset.t !== "1") { this.dataset.t = "1"; this.src = img.origin; }
  };
  $("#lbCap").innerHTML =
    '<b style="color:#fff">' + esc(img.label || "样图") + "</b>" +
    (img.style ? '<span class="sid">' + esc(img.style) + "</span>" : "") +
    '<span>' + esc(s.name) + " · " + esc(routeName(s)) + "</span>" +
    '<a href="' + esc(img.origin || s.url) + '" target="_blank" rel="noopener">出处 ↗</a>' +
    '<button class="mini-btn" data-prompt="1" data-sid="' + esc(s.id) + '"' + (img.style ? ' data-style="' + esc(img.style) + '"' : "") + ' data-label="' + esc(img.label || "") + '">复制提示词</button>' +
    "<span style='opacity:.6'>" + (LB.i + 1) + " / " + LB.list.length + "</span>";
  $("#lbPrev").style.visibility = LB.list.length > 1 ? "visible" : "hidden";
  $("#lbNext").style.visibility = LB.list.length > 1 ? "visible" : "hidden";
}
function stepLB(d) { LB.i = (LB.i + d + LB.list.length) % LB.list.length; showLB(); }
const lbOpen = () => !$("#lightbox").hidden;

/* ═══════════════ 命令面板 ═══════════════ */
let PAL = { items: [], sel: 0 };
function palActions() {
  return [
    { t: "action", label: "切换深色 / 浅色主题", hint: "快捷键 T", run: toggleTheme },
    { t: "action", label: "打开 · 首页图鉴", hint: "页签", run: () => showTab("home") },
    { t: "action", label: "打开 · 技能列表", hint: "页签", run: () => showTab("skills") },
    { t: "action", label: "打开 · 风格图库", hint: "页签", run: () => showTab("gallery") },
    { t: "action", label: "跳转 · 路线问题", hint: "首页", run: () => jump("#route") },
    { t: "action", label: "跳转 · 怎么筛 / 装 / 用", hint: "首页", run: () => jump("#guide") },
    { t: "action", label: "清除所有筛选", hint: "reset", run: resetAll },
    { t: "action", label: "按综合分排序", hint: "sort", run: () => { ST.sort = "score"; $("#sortSel").value = "score"; renderGrid(); jump("#skills"); } },
    { t: "action", label: "按 star 数排序", hint: "sort", run: () => { ST.sort = "stars"; $("#sortSel").value = "stars"; renderGrid(); jump("#skills"); } },
    { t: "action", label: "打开数据源仓库", hint: "GitHub ↗", run: () => window.open(REG.meta.repoUrl, "_blank") },
  ];
}
const ACTIONS = palActions();
function showTab(name, opts) {
  if (TABS.indexOf(name) < 0) name = "home";
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.dataset.page === name));
  document.querySelectorAll("#mainNav a").forEach(a => a.classList.toggle("on", a.dataset.tab === name));
  try { history.replaceState(null, "", "#" + name); } catch (e) {}
  if (!(opts && opts.keepScroll)) window.scrollTo(0, 0);
}
function jump(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  const page = el.closest(".page");
  if (page && !page.classList.contains("active")) showTab(page.dataset.page, { keepScroll: true });
  requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
}
function palBuild(q) {
  q = q.trim().toLowerCase();
  const out = [];
  const add = (arr, n) => { for (let i = 0; i < arr.length && i < n; i++) out.push(arr[i]); };

  const sk = REG.skills.filter(s => !q ||
    (s.name + " " + s.id + " " + s.repo + " " + s.tagline + " " + s.author).toLowerCase().includes(q))
    .sort((a, b) => {
      if (q) {
        const as = a.name.toLowerCase().startsWith(q) ? 0 : 1, bs = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        if (as !== bs) return as - bs;
      }
      return b.score.total - a.score.total;
    });
  add(sk.map(s => ({ t: "skill", s })), 7);

  if (q) {
    const seen = new Set(), st = [];
    REG.skills.forEach(s => s.styleIds.forEach(id => {
      if (id.toLowerCase().includes(q) && !seen.has(id)) { seen.add(id); st.push({ t: "style", id, s }); }
    }));
    add(st, 6);
    add(ACTIONS.filter(a => a.label.toLowerCase().includes(q)), 5);
  } else {
    add(ACTIONS, 6);
  }
  PAL.items = out; PAL.sel = 0;
  return out;
}
function palRender() {
  const items = PAL.items;
  if (!items.length) {
    $("#palList").innerHTML = '<div class="pal-empty">没有匹配结果。试试 skill 名、repo 或风格 ID。</div>';
    return;
  }
  let html = "", last = "";
  items.forEach((it, i) => {
    const g = it.t === "skill" ? "Skill" : it.t === "style" ? "风格 ID" : "操作";
    if (g !== last) { html += '<div class="pal-group">' + g + "</div>"; last = g; }
    if (it.t === "skill") {
      const s = it.s;
      html += '<div class="pal-item' + (i === PAL.sel ? " sel" : "") + '" data-i="' + i + '">' +
        '<span class="ic" style="background:' + rc(s) + '22;color:' + rc(s) + '">' + esc((s.name[0] || "?").toUpperCase()) + "</span>" +
        '<span class="tx"><b>' + esc(s.name) + "</b><small>" + esc(s.tagline) + "</small></span>" +
        '<span class="tagx">' + esc(routeName(s)) + " · ★" + esc(s.starsText) + "</span></div>";
    } else if (it.t === "style") {
      html += '<div class="pal-item' + (i === PAL.sel ? " sel" : "") + '" data-i="' + i + '">' +
        '<span class="ic">✦</span><span class="tx"><b style="font-family:var(--mono);font-size:12.5px">' + esc(it.id) +
        "</b><small>来自 " + esc(it.s.name) + " — 回车定位到图库</small></span>" +
        '<span class="tagx">style</span></div>';
    } else {
      html += '<div class="pal-item' + (i === PAL.sel ? " sel" : "") + '" data-i="' + i + '">' +
        '<span class="ic">⌘</span><span class="tx"><b>' + esc(it.label) + "</b><small>" + esc(it.hint || "") + "</small></span></div>";
    }
  });
  $("#palList").innerHTML = html;
  const sel = $("#palList .sel");
  if (sel) sel.scrollIntoView({ block: "nearest" });
}
function palRun(it) {
  closePalette();
  if (!it) return;
  if (it.t === "skill") openDrawer(it.s.id);
  else if (it.t === "style") {
    $("#gq").value = it.id; ST.gq = it.id; ST.gShown = 80;
    renderGallery();
    const k = FLAT.findIndex(x => x.img.style === it.id);
    jump("#gallery");
    if (k >= 0) setTimeout(() => openLightbox(FLAT, k), 350);
    toast("图库已过滤到风格 " + it.id);
  } else it.run();
}
function openPalette() {
  $("#palette").hidden = false;
  $("#palInput").value = "";
  palBuild(""); palRender();
  setTimeout(() => $("#palInput").focus(), 20);
}
function closePalette() { $("#palette").hidden = true; }
const palOpen = () => !$("#palette").hidden;

/* ═══════════════ 指南区渲染 ═══════════════ */
function renderGuide() {
  $("#principles").innerHTML = PRINCIPLES.map(([t, d], i) =>
    '<div class="pcard"><div class="pn">' + (i + 1) + "</div><h5>" + esc(t) + "</h5><p>" + esc(d) + "</p></div>").join("");
}

/* ═══════════════ 事件 ═══════════════ */
function bind() {
  // 主题
  $("#themeToggle").addEventListener("click", toggleTheme);
  $("#ctaSearch").addEventListener("click", openPalette);
  $("#searchTrigger").addEventListener("click", openPalette);

  // Hero 路线 pill → 直接筛选
  $("#heroRoutes").addEventListener("click", e => {
    const b = e.target.closest(".rpill"); if (!b) return;
    ST.route.clear(); ST.route.add(b.dataset.route); ST.shown = 60;
    renderChips(); renderGrid(); renderGallery();
    jump("#skills");
  });

  // chips / 复制 / 提示词 / 页签 / 站内锚点（事件委托）
  document.addEventListener("click", e => {
    const c = e.target.closest(".chip[data-group]");
    if (c) {
      const g = c.dataset.group, v = c.dataset.val;
      ST[g].has(v) ? ST[g].delete(v) : ST[g].add(v);
      ST.shown = 60; ST.gShown = 80;
      renderChips(); renderGrid(); renderGallery();
      return;
    }
    const pp = e.target.closest("[data-prompt]");
    if (pp) {
      const sk = REG.skills.find(x => x.id === pp.dataset.sid);
      if (sk) {
        const st = pp.dataset.style || "";
        let label = pp.dataset.label || "";
        if (!label && st && sk.images.length) {
          const im = sk.images.find(i => i.style === st);
          if (im) label = im.label || "";
        }
        copy(buildPrompt(sk, st, label), "已复制个性化提示词 · 【】里替换成你的内容");
      }
      return;
    }
    const cp = e.target.closest("[data-copy]");
    if (cp) { copy(cp.dataset.copy); return; }
    const go = e.target.closest("[data-goto]");
    if (go) { showTab(go.dataset.goto); return; }
    const tb = e.target.closest("[data-tab]");
    if (tb) { e.preventDefault(); showTab(tb.dataset.tab); return; }
    const av = e.target.closest('a[href^="#"]');
    if (av) { e.preventDefault(); jump(av.getAttribute("href")); return; }
  });

  // 搜索
  let qTimer = null;
  $("#q").addEventListener("input", e => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => {
      ST.q = e.target.value; ST.shown = 60; ST.gShown = 80;
      renderGrid(); renderGallery();
    }, 130);
  });
  $("#gq").addEventListener("input", e => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => { ST.gq = e.target.value; ST.gShown = 80; renderGallery(); }, 130);
  });
  $("#sortSel").addEventListener("change", e => { ST.sort = e.target.value; renderGrid(); });
  $("#resetBtn").addEventListener("click", resetAll);
  $("#emptyReset").addEventListener("click", resetAll);
  $("#moreBtn").addEventListener("click", () => { ST.shown += 60; renderGrid(); });
  $("#giMore").addEventListener("click", () => { ST.gShown += 80; renderGallery(); });

  // 卡片点击（事件委托，技能列表 + 首页精选共用）
  const bindCardGrid = el => {
    if (!el) return;
    el.addEventListener("click", e => {
      if (e.target.closest("[data-copy], [data-prompt]")) return; // 按钮由全局委托处理
      const card = e.target.closest(".card");
      if (card) openDrawer(card.dataset.id);
    });
    el.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        const card = e.target.closest(".card");
        if (card) { openDrawer(card.dataset.id); e.preventDefault(); }
      }
    });
  };
  bindCardGrid($("#grid"));
  bindCardGrid($("#featuredGrid"));

  // 图库点击 → 灯箱（风格提示词按钮由全局委托处理）
  $("#giGrid").addEventListener("click", e => {
    if (e.target.closest("[data-prompt]")) return;
    const gi = e.target.closest(".gi[data-flat]");
    if (gi) openLightbox(FLAT, +gi.dataset.flat);
  });

  // 抽屉
  $("#drawerScrim").addEventListener("click", closeDrawer);
  $("#drawer").addEventListener("click", e => {
    if (e.target.closest("#dwClose")) { closeDrawer(); return; }
    const strip = e.target.closest(".gi[data-dwflat]");
    if (strip && DRAWER_SKILL) {
      openLightbox(DRAWER_SKILL.images.map((img, i) => ({ img, s: DRAWER_SKILL })), +strip.dataset.dwflat);
    }
  });

  // 灯箱
  $("#lbClose").addEventListener("click", () => ($("#lightbox").hidden = true));
  $("#lbPrev").addEventListener("click", () => stepLB(-1));
  $("#lbNext").addEventListener("click", () => stepLB(1));
  $("#lightbox").addEventListener("click", e => { if (e.target.id === "lightbox") $("#lightbox").hidden = true; });

  // 面板
  $("#palette").addEventListener("click", e => {
    if (e.target.hasAttribute("data-close")) closePalette();
    const it = e.target.closest(".pal-item");
    if (it) palRun(PAL.items[+it.dataset.i]);
  });
  $("#palInput").addEventListener("input", e => { palBuild(e.target.value); palRender(); });
  $("#palInput").addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { PAL.sel = (PAL.sel + 1) % PAL.items.length; palRender(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { PAL.sel = (PAL.sel - 1 + PAL.items.length) % PAL.items.length; palRender(); e.preventDefault(); }
    else if (e.key === "Enter") { palRun(PAL.items[PAL.sel]); e.preventDefault(); }
  });

  // 全局键盘
  document.addEventListener("keydown", e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); palOpen() ? closePalette() : openPalette(); return;
    }
    if (e.key === "Escape") {
      if (lbOpen()) { $("#lightbox").hidden = true; return; }
      if (palOpen()) { closePalette(); return; }
      if (drawerOpen()) { closeDrawer(); return; }
      return;
    }
    if (lbOpen()) {
      if (e.key === "ArrowLeft") stepLB(-1);
      if (e.key === "ArrowRight") stepLB(1);
      return;
    }
    if (typing) return;
    if (e.key === "/") { e.preventDefault(); $("#q").focus(); $("#q").scrollIntoView({ block: "center" }); }
    if (e.key === "t" || e.key === "T") toggleTheme();
  });
}

/* ═══════════════ 运行时数据同步（GitHub → 页面，失败静默回退内嵌数据） ═══════════════ */
const SYNC_ROOTS = [
  "https://raw.githubusercontent.com/brycewang-stanford/many-ppt-skills/main/",
  "https://cdn.jsdelivr.net/gh/brycewang-stanford/many-ppt-skills@main/",
  "https://gh-proxy.com/https://raw.githubusercontent.com/brycewang-stanford/many-ppt-skills/main/",
  "https://ghfast.top/https://raw.githubusercontent.com/brycewang-stanford/many-ppt-skills/main/",
];
const LIVE = { running: false };

function jget(root, path, ms) {
  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), ms || 7000) : null;
  return fetch(root + path, ctrl ? { signal: ctrl.signal, cache: "no-store" } : { cache: "no-store" })
    .then(r => { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
    .finally(() => { if (timer) clearTimeout(timer); });
}

/* 与 build_data.py calc_score 完全一致的评分逻辑 */
function calcLive(stars, pushedAt, lic, hand, capsYes) {
  const P = {};
  P.stars = +(45 * Math.min(1, Math.log10(stars + 1) / Math.log10(60000))).toFixed(1);
  let act = 4;
  if (pushedAt) {
    try {
      let p = String(pushedAt).trim().replace("Z", "+00:00");
      if (p.indexOf("T") < 0 && p.indexOf(" ") < 0) p += "T00:00:00+00:00";
      const dt = new Date(p);
      const days = Math.floor((Date.now() - dt.getTime()) / 864e5);
      act = days <= 90 ? 15 : days <= 180 ? 12 : days <= 365 ? 8 : 4;
    } catch (e) {}
  }
  P.activity = act;
  const PERM = ["MIT", "Apache-2.0", "Unlicense", "ISC", "BSD-2-Clause", "BSD-3-Clause"];
  P.license = PERM.indexOf(lic) >= 0 ? 15 : String(lic || "").toUpperCase().indexOf("GPL") >= 0 ? 4 : 8;
  P.verified = hand ? 10 : 0;
  P.caps = +(15 * Math.min(1, capsYes / 10)).toFixed(1);
  return { total: Math.round(P.stars + P.activity + P.license + P.verified + P.caps), parts: P };
}

/* 用线上 4 份 JSON 重做 build_data.py 的合并（README 派生字段沿用内嵌值） */
function remerge(sd, st, ca, sm) {
  const gal = {}, originMap = {};
  REG.skills.forEach(s => {
    if (s.anchor || (s.styleIds && s.styleIds.length) || s.galleryInstall)
      gal[s.repo] = { styleIds: s.styleIds || [], more: s.styleMore || 0, install: s.galleryInstall || "", anchor: s.anchor || "" };
    (s.images || []).forEach(im => { if (im.origin) originMap[im.origin] = im; });
  });
  const repoUse = {};
  (sd.skills || []).forEach(s => { repoUse[s.repo] = (repoUse[s.repo] || 0) + 1; });
  const oldById = {};
  REG.skills.forEach(x => { oldById[x.id] = x; });
  const repos = st.repos || {}, failed = st.failed || [];
  const capsSkills = (ca && ca.skills) || {};
  const RL = { html: "HTML", pptx: "PPTX", hybrid: "双路线", framework: "框架",
    templates: "模板库", list: "列表", image: "图片", suite: "套件" };
  const PERM = ["MIT", "Apache-2.0", "Unlicense", "ISC", "BSD-2-Clause", "BSD-3-Clause"];
  let maxStars = 1;
  const merged = (sd.skills || []).map(s => {
    const sr = repos[s.repo] || {};
    const stars = +sr.stars || 0;
    maxStars = Math.max(maxStars, stars);
    const capr = capsSkills[s.id] || {};
    const caps = {}, quotes = {};
    Object.keys(capr.caps || {}).forEach(k => {
      caps[k] = (capr.caps[k] || {}).verdict;
      quotes[k] = (capr.caps[k] || {}).quote || "";
    });
    const capsYes = Object.values(caps).filter(v => v === "yes").length;
    const capsNo = Object.values(caps).filter(v => v === "no").length;
    const hand = !!s.install;
    const lic = s.license_note || sr.license || "Unspecified";
    const mono = !!s.path || repoUse[s.repo] > 1;
    const stale = failed.indexOf(s.repo) >= 0;
    let tier = s.pin_tier;
    if (!tier) tier = stars >= 5000 ? "S" : stars >= 100 ? "A" : "B";
    const g = gal[s.repo] || {};
    // 图片：线上 samples 有的按 URL 复用本地缓存 / 新 URL 直连远程（最多 10 张，去重）；
    // 线上没有的（含 harvest_covers.py 人工补采的 README 封面）沿用内嵌图片
    const srcList = ((sm.skills || {})[s.id] || {}).samples || [];
    const oldRec = oldById[s.id];
    let imgs;
    if (srcList.length) {
      imgs = [];
      const seen = {};
      for (let i = 0; i < srcList.length && imgs.length < 10; i++) {
        const u = srcList[i] && srcList[i].url;
        if (!u || seen[u]) continue;
        seen[u] = 1;
        imgs.push(originMap[u] || { local: null, remote: u, origin: u,
          label: srcList[i].label || "", style: srcList[i].style || null, w: 0, h: 0 });
      }
    } else {
      imgs = (oldRec && oldRec.images) ? oldRec.images : [];
    }
    const styleIds = Array.from(new Set((g.styleIds || []).concat(imgs.map(i => i.style).filter(Boolean))));
    const score = calcLive(stars, sr.pushed_at, lic, hand, capsYes);
    const up = String(lic || "").toUpperCase();
    const licClass = PERM.indexOf(lic) >= 0 ? "permissive" : up.indexOf("GPL") >= 0 ? "copyleft" : "unknown";
    const licHint = licClass === "permissive" ? "宽松许可，可放心商用"
      : licClass === "copyleft" ? "Copyleft 协议，商用 / 闭源前请自行确认"
      : "协议未标注 / 见仓库，请自行确认";
    let cover = null;
    for (let i = 0; i < imgs.length; i++) { if (imgs[i].w && imgs[i].w >= (imgs[i].h || 0)) { cover = imgs[i]; break; } }
    cover = cover || imgs[0] || null;
    let starsText = stars.toLocaleString("en-US") + (mono ? "*" : "");
    if (stale) starsText += "~";
    return {
      id: s.id, name: s.name, author: s.author || "",
      repo: s.repo, url: "https://github.com/" + s.repo,
      path: s.path || "", homepage: s.homepage || "",
      route: s.route, routeLabel: RL[s.route] || s.route,
      license: lic, licenseClass: licClass, licenseHint: licHint,
      licenseWarning: s.license_warning || "", lang: s.lang || "",
      tier, stars, starsText, mono, stale,
      forks: +sr.forks || 0, pushedAt: sr.pushed_at || "", archived: !!sr.archived,
      tagline: s.tagline_zh || "", taglineEn: s.tagline_en || "",
      highlights: s.highlights_zh || [], bestFor: s.best_for_zh || "",
      motion: ((s.motion || {}).note_zh) || "", motionKind: ((s.motion || {}).kind) || "",
      requires: s.requires || [], source: s.source || "",
      install: s.install || null, handRead: hand,
      caps, quotes, capsYes, capsNo, hasCapData: Object.keys(caps).length > 0,
      score, styleIds, styleMore: g.more || 0,
      cover, images: imgs,
      galleryInstall: g.install || "", anchor: g.anchor || ""
    };
  });
  merged.sort((a, b) => b.stars - a.stars);
  const routes = {};
  merged.forEach(s => { routes[s.route] = (routes[s.route] || 0) + 1; });
  const seenR = {}; let starsSum = 0;
  merged.forEach(s => { if (!seenR[s.repo]) { seenR[s.repo] = 1; starsSum += s.stars; } });
  const tiers = { S: 0, A: 0, B: 0 };
  merged.forEach(s => { tiers[s.tier] = (tiers[s.tier] || 0) + 1; });
  const oldCounts = REG.meta.counts || {};
  REG.meta = Object.assign({}, REG.meta, {
    counts: {
      total: merged.length,
      hand_read: merged.filter(s => s.handRead).length,
      stars: starsSum,
      html: routes.html || 0, pptx: routes.pptx || 0, hybrid: routes.hybrid || 0,
      refreshed: st.refreshed_at || oldCounts.refreshed || "—"
    },
    imgCount: merged.reduce((n, s) => n + s.images.length, 0),
    imgSkills: merged.filter(s => s.images.length).length,
    styledSkills: merged.filter(s => s.styleIds.length).length,
    tiers, routes, maxStars,
    syncedAt: new Date().toLocaleString("zh-CN", { hour12: false })
  });
  REG.skills = merged;
}

async function liveSync(manual) {
  if (LIVE.running) return;
  LIVE.running = true;
  setBadge("syncing");
  let root = null, stats = null;
  for (let i = 0; i < SYNC_ROOTS.length && !root; i++) {
    try { stats = await jget(SYNC_ROOTS[i], "data/stats.json", 6000); root = SYNC_ROOTS[i]; } catch (e) {}
  }
  if (!root) {
    LIVE.running = false; setBadge("fail", REG.meta.counts.refreshed);
    if (manual) toast("网络无法访问 GitHub，继续使用内嵌数据", false);
    return;
  }
  try {
    const [sd, capDoc, sm] = await Promise.all([
      jget(root, "data/skills.json", 9000),
      jget(root, "data/capabilities.json", 9000),
      jget(root, "data/samples.json", 12000)
    ]);
    remerge(sd, stats, capDoc, sm);
    LIVE.running = false;
    setBadge("ok", REG.meta.counts.refreshed);
    renderHero(); renderChips(); renderGrid(); renderGallery(); renderFeatured();
    if (manual) toast("已同步 GitHub 最新数据");
  } catch (e) {
    LIVE.running = false; setBadge("fail", REG.meta.counts.refreshed);
    if (manual) toast("同步失败，继续使用内嵌数据", false);
  }
}

/* ═══════════════ 入场动画 ═══════════════ */
function reveal() {
  if (!("IntersectionObserver" in window)) return;
  const targets = $$(".sec-head, .route-card, .tree-box, .gcard, .callout, .stat");
  const io = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.06 });
  targets.forEach(t => {
    if (t.getBoundingClientRect().top > window.innerHeight * 0.92) {
      t.classList.add("reveal"); io.observe(t);
    }
  });
}

/* ═══════════════ 初始化 ═══════════════ */
renderHero();
renderRoute();
renderChips();
renderGrid();
renderGallery();
renderGuide();
renderFeatured();
bind();
reveal();

/* 页签路由（支持 #home / #skills / #gallery 与旧的段内锚点） */
const h0 = location.hash.slice(1);
if (h0 && TABS.indexOf(h0) >= 0) showTab(h0, { keepScroll: true });
else if (h0 && document.getElementById(h0)) { showTab("home", { keepScroll: true }); jump("#" + h0); }
else showTab("home", { keepScroll: true });
window.addEventListener("hashchange", () => {
  const h = location.hash.slice(1);
  if (TABS.indexOf(h) >= 0) showTab(h, { keepScroll: true });
});

/* 运行时同步 GitHub 最新数据；失败静默回退内嵌数据，徽章可点击重试 */
setTimeout(() => liveSync(false), 1500);
const dataBadge = $("#dataBadge");
if (dataBadge) dataBadge.addEventListener("click", () => liveSync(true));

})();
