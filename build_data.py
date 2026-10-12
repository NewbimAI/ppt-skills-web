# -*- coding: utf-8 -*-
"""
many-ppt-skills 可视化前端 —— 数据构建脚本
1. 合并 data/ 下四个 JSON（skills / stats / capabilities / samples）
2. 从登记册 README 解析风格 ID、安装命令、合计数字
3. 下载并压缩样例图到 assets/img/<skill>/，失败则保留远程 URL 兜底
4. 生成 assets/js/data.js（window.REG），供纯静态页面直接 <script> 加载（file:// 可用）
用法：python build_data.py [--skip-images]
"""
import json, os, re, sys, io, math, urllib.request, urllib.error, concurrent.futures
from datetime import datetime, timezone

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
IMG = os.path.join(ROOT, "assets", "img")
JS = os.path.join(ROOT, "assets", "js")
SKIP_IMAGES = "--skip-images" in sys.argv

MAX_IMAGES_PER_SKILL = 10     # 每个 skill 最多下载几张
IMG_WIDTH = 900               # 统一压到 900px 宽
IMG_QUALITY = 72

ROUTE_ZH = {
    "html": "HTML", "pptx": "PPTX", "hybrid": "双路线", "framework": "框架",
    "templates": "模板库", "list": "列表", "image": "图片", "suite": "套件",
}
PERMISSIVE = ("MIT", "Apache-2.0", "Unlicense", "ISC", "BSD-2-Clause", "BSD-3-Clause")
FREE_ASSET_HINT = "宽松许可，可放心商用"
COPYLEFT_HINT = "Copyleft 协议，商用 / 闭源前请自行确认"


def jload(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as f:
        return json.load(f)


# ---------------------------------------------------------------- 1. 解析 README
def parse_readme(text):
    out = {"counts": {}, "install_methods": [], "gallery": {}, "route_table": [], "decisions": []}

    m = re.search(
        r"\*\*收录 (\d+) 个 skill\*\*，其中 \*\*(\d+) 个人工读过\*\* · \*\*合计 ([\d,]+) star\*\* · "
        r"HTML 路线 (\d+) 个 · PPTX 路线 (\d+) 个 · 双路线 (\d+) 个 · 数据刷新于 \*\*([\d-]+)\*\*",
        text)
    if m:
        out["counts"] = {
            "total": int(m.group(1)), "hand_read": int(m.group(2)),
            "stars": int(m.group(3).replace(",", "")),
            "html": int(m.group(4)), "pptx": int(m.group(5)), "hybrid": int(m.group(6)),
            "refreshed": m.group(7),
        }

    block = re.search(r"<!-- BEGIN:INSTALLMETHODS -->(.*?)<!-- END:INSTALLMETHODS -->", text, re.S)
    if block:
        for row in re.findall(r"^\| `([^`]+)` \| (.+?) \| (\d+) \|$", block.group(1), re.M):
            out["install_methods"].append({"method": row[0], "what": row[1].strip(), "count": int(row[2])})

    # 图库分区：提取每个 skill 的风格 id 与安装命令
    for sec in re.split(r"<a id=\"gallery-", text)[1:]:
        head = re.match(r"([^\"]+)\"></a>\s*\n+#### \[([^\]]+)\]\((https://github\.com/[^)]+)\)", sec)
        if not head:
            continue
        anchor, name, url = head.group(1), head.group(2), head.group(3)
        repo = re.sub(r"^https://github\.com/", "", url).split("/tree/")[0].rstrip("/")
        rec = {"anchor": anchor, "name": name, "repo": repo, "style_ids": [], "style_more": 0, "install": None}

        sid = re.search(r"<sub><b>风格 id</b>(.*?)</sub>", sec, re.S)
        if sid:
            rec["style_ids"] = re.findall(r"`([^`]+)`", sid.group(1))
            more = re.search(r"还有 (\d+) 个", sid.group(1))
            if more:
                rec["style_more"] = int(more.group(1))
        cmd = re.search(r"```(?:bash|text)\n(.*?)```", sec, re.S)
        if cmd:
            rec["install"] = cmd.group(1).strip()
        out["gallery"][repo] = rec

    # 路线对比表（用于“路线问题”区块）
    rt = re.search(r"\| \| \*\*HTML 路线\*\* \| \*\*原生 PPTX 路线\*\* \|\n\|---\|---\|---\|\n(.*?)\n\n", text, re.S)
    if rt:
        for row in re.findall(r"^\| (.+?) \| (.+?) \| (.+?) \|$", rt.group(1), re.M):
            out["route_table"].append({"label": row[0], "html": row[1].strip(), "pptx": row[2].strip()})

    tree = re.search(r"```\n(交付物需要对方用 PowerPoint 编辑吗？.*?)\n```", text, re.S)
    if tree:
        out["decisions"] = tree.group(1).split("\n")

    return out


# ---------------------------------------------------------------- 2. 评分
def calc_score(stars, pushed_at, license_note, hand_read, caps_yes):
    """透明综合分（0-100）。登记册明确说 star 不等于质量 —— 每一档都在 UI 里展开说明。"""
    parts = {}
    # star 热度 45 分（对数归一）
    parts["stars"] = round(45 * min(1.0, math.log10(stars + 1) / math.log10(60000)), 1)
    # 近一年活跃 15 分
    act = 4
    if pushed_at:
        try:
            p = pushed_at.strip().replace("Z", "+00:00")
            if "T" not in p and " " not in p:
                p += "T00:00:00+00:00"
            dt = datetime.fromisoformat(p)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            days = (datetime.now(timezone.utc) - dt).days
            act = 15 if days <= 90 else 12 if days <= 180 else 8 if days <= 365 else 4
        except Exception:
            pass
    parts["activity"] = act
    # 许可友好 15 分
    ln = license_note or ""
    parts["license"] = 15 if ln in PERMISSIVE else 4 if ("GPL" in ln.upper()) else 8
    # 人工核读 10 分
    parts["verified"] = 10 if hand_read else 0
    # 文档能力覆盖 15 分（未核读则为 0，卡片上标“未核读”）
    parts["caps"] = round(15 * min(1.0, caps_yes / 10), 1)
    return {"total": round(sum(parts.values())), "parts": parts}


# ---------------------------------------------------------------- 3. 图片
def ensure_dirs():
    for d in (IMG, JS, os.path.join(ROOT, "assets")):
        os.makedirs(d, exist_ok=True)


def fetch_one(url, dest_base, dest_full=None):
    """下载一张图 -> 压缩为 dest_base.jpg。支持断点续传。返回 (ok, width, height)。"""
    from PIL import Image
    import tempfile
    dest_full = dest_full or (dest_base + ".jpg")

    # 断点续传：文件已存在则直接读尺寸
    if os.path.exists(dest_full) and os.path.getsize(dest_full) > 4096:
        try:
            with Image.open(dest_full) as im:
                return (True, im.width, im.height)
        except Exception:
            pass

    def opener(proxy_on):
        if proxy_on:
            return urllib.request.build_opener(urllib.request.ProxyHandler({
                "http": "http://127.0.0.1:7897", "https": "http://127.0.0.1:7897"}))
        return urllib.request.build_opener(urllib.request.ProxyHandler({}))

    # 路径含中文等非 ASCII 字符时先百分号编码（否则 urllib 直接抛 UnicodeEncodeError）
    if not url.isascii():
        from urllib.parse import urlsplit, urlunsplit, quote
        p = urlsplit(url)
        url = urlunsplit((p.scheme, p.netloc, quote(p.path), p.query, p.fragment))

    # 候选源：本机代理优先，直连其次，gh-proxy / ghfast 镜像兜底
    # （代理不可用时非 raw 域名也必须能直连，如 opengraph.githubassets.com / github.com）
    cands = [(url, opener(True)), (url, opener(False))]
    if url.startswith("https://raw.githubusercontent.com/"):
        cands += [("https://gh-proxy.com/" + url, opener(False)),
                  ("https://ghfast.top/" + url, opener(False))]

    blob = None
    for u, op in cands:
        try:
            req = urllib.request.Request(u, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with op.open(req, timeout=15) as r:
                blob = r.read()
            if blob and len(blob) > 2048:
                break
            blob = None
        except Exception:
            blob = None
    if not blob:
        return (False, 0, 0)

    tmp_path = None
    try:
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".bin")
        tmp.write(blob); tmp.close()
        tmp_path = tmp.name
        im = Image.open(tmp_path)
        im.load()
        if im.mode in ("RGBA", "P", "LA"):
            bg = Image.new("RGB", im.size, (255, 255, 255))
            im2 = im.convert("RGBA")
            bg.paste(im2, mask=im2.split()[-1])
            im = bg
        elif im.mode != "RGB":
            im = im.convert("RGB")
        if im.width > IMG_WIDTH:
            h = round(im.height * IMG_WIDTH / im.width)
            im = im.resize((IMG_WIDTH, h), Image.LANCZOS)
        im.save(dest_full, "JPEG", quality=IMG_QUALITY, optimize=True, progressive=True)
        return (True, im.width, im.height)
    except Exception:
        return (False, 0, 0)
    finally:
        try:
            if tmp_path:
                os.unlink(tmp_path)
        except Exception:
            pass


def download_images(samples_map):
    """-> {skill_id: [{local, remote, label, style, w, h}, ...]}"""
    jobs = []   # (skill_id, idx, url, label, style)
    for sid, rec in samples_map.items():
        seen, picked = set(), 0
        for s in rec["samples"]:
            u = s.get("url")
            if not u or u in seen:
                continue
            seen.add(u)
            if picked >= MAX_IMAGES_PER_SKILL:
                break
            picked += 1
            jobs.append((sid, picked - 1, u, s.get("label") or "", s.get("style")))

    os.makedirs(IMG, exist_ok=True)
    results = {}
    ok_count = fail_count = 0
    print("download jobs: %d (resume-skips existing files)" % len(jobs), flush=True)

    def run(job):
        sid, idx, url, label, style = job
        d = os.path.join(IMG, sid)
        os.makedirs(d, exist_ok=True)
        base = os.path.join(d, "%02d" % idx)
        ok, w, h = fetch_one(url, base)
        return (sid, idx, url, label, style, ok, w, h)

    failed_jobs = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        for sid, idx, url, label, style, ok, w, h in ex.map(run, jobs):
            if not ok:
                failed_jobs.append((sid, idx, url, label, style))
            results.setdefault(sid, []).append({
                "local": ("assets/img/%s/%02d.jpg" % (sid, idx)) if ok else None,
                "remote": None if ok else url,
                "origin": url,
                "label": label, "style": style, "w": w, "h": h,
            })
            ok_count += ok; fail_count += (not ok)
            if (ok_count + fail_count) % 10 == 0 or (ok_count + fail_count) == len(jobs):
                print("progress %d/%d (ok=%d fail=%d)" % (ok_count + fail_count, len(jobs), ok_count, fail_count), flush=True)

    # 慢速串行重试：并发下被限流的（opengraph.githubassets.com 等）单条重下
    if failed_jobs:
        import time
        print("slow-retry %d failed jobs (serial)" % len(failed_jobs), flush=True)
        time.sleep(2.0)
        for job in failed_jobs:
            sid, idx, url, label, style = job
            _, _, _, _, _, ok, w, h = run(job)
            if ok:
                ok_count += 1
                fail_count -= 1
                for ent in results[sid]:
                    if ent["origin"] == url:
                        ent.update(local="assets/img/%s/%02d.jpg" % (sid, idx),
                                   remote=None, w=w, h=h)
                        break
            time.sleep(0.5)

    for v in results.values():
        def _key(x):
            if not x["local"]:
                return (1, 99)
            stem = os.path.splitext(os.path.basename(x["local"]))[0]
            try:
                return (0, int(stem))
            except ValueError:
                return (1, 99)
        v.sort(key=_key)
    print("images: %d ok, %d fallback(remote)" % (ok_count, fail_count))
    return results


# ---------------------------------------------------------------- 主流程
def main():
    skills_doc = jload("skills.json")
    stats = jload("stats.json")
    caps_doc = jload("capabilities.json")
    samples = jload("samples.json")
    # 人工补采封面：samples.json 没有样图的 skill，用 harvest_covers.py 从其仓库 README 抓的图补齐
    try:
        with open(os.path.join(DATA, "harvest.json"), encoding="utf-8") as f:
            harv = json.load(f)
        filled = 0
        for sid, rec in (harv.get("skills") or {}).items():
            cur = samples["skills"].get(sid) or {}
            if not cur.get("samples") and rec.get("samples"):
                samples["skills"][sid] = rec
                filled += 1
        print("harvest covers: %d 个 skill 补到 README 封面" % filled)
    except FileNotFoundError:
        pass
    with open(os.path.join(DATA, "registry_README.md"), encoding="utf-8") as f:
        readme = parse_readme(f.read())

    print("routes meta:", len(skills_doc["meta"]["routes"]), "| caps meta:", len(caps_doc["capabilities"]),
          "| gallery:", len(readme["gallery"]), "| counts:", readme["counts"])

    img_map = {} if SKIP_IMAGES else download_images(samples["skills"])

    # repo -> 被多个 skill 共用（monorepo 附属 skill 用整仓 star，标 *）
    repo_use = {}
    for s in skills_doc["skills"]:
        repo_use[s["repo"]] = repo_use.get(s["repo"], 0) + 1

    max_stars = 1
    merged = []
    for s in skills_doc["skills"]:
        st = stats["repos"].get(s["repo"], {})
        stars = int(st.get("stars") or 0)
        max_stars = max(max_stars, stars)
        cap = caps_doc["skills"].get(s["id"], {})
        caps = {k: v.get("verdict") for k, v in (cap.get("caps") or {}).items()}
        quotes = {k: (v.get("quote") or "") for k, v in (cap.get("caps") or {}).items()}
        caps_yes = sum(1 for v in caps.values() if v == "yes")
        caps_no = sum(1 for v in caps.values() if v == "no")

        hand_read = bool(s.get("install"))           # 39 个：人工读过 SKILL.md
        lic = s.get("license_note") or st.get("license") or "Unspecified"
        mono = bool(s.get("path")) or repo_use[s["repo"]] > 1
        stale = s["repo"] in (stats.get("failed") or [])

        tier = s.get("pin_tier")
        if not tier:
            tier = "S" if stars >= 5000 else "A" if stars >= 100 else "B"

        g = readme["gallery"].get(s["repo"], {})
        imgs = img_map.get(s["id"], [])
        style_ids = list(dict.fromkeys(
            (g.get("style_ids") or []) + [i["style"] for i in imgs if i.get("style")]
        ))

        score = calc_score(stars, st.get("pushed_at"), lic, hand_read, caps_yes)

        lic_upper = (lic or "").upper()
        if lic in PERMISSIVE:
            lic_class, lic_hint = "permissive", FREE_ASSET_HINT
        elif "GPL" in lic_upper:
            lic_class, lic_hint = "copyleft", COPYLEFT_HINT
        else:
            lic_class, lic_hint = "unknown", "协议未标注 / 见仓库，请自行确认"

        # 封面：优先第一张横图
        cover = None
        for i in imgs:
            if i.get("w") and i["w"] >= i.get("h", 0):
                cover = i; break
        cover = cover or (imgs[0] if imgs else None)

        # 展示用 star 文本
        stars_text = f"{stars:,}" + ("*" if mono else "")
        if stale:
            stars_text += "~"

        merged.append({
            "id": s["id"], "name": s["name"], "author": s.get("author") or "",
            "repo": s["repo"], "url": "https://github.com/" + s["repo"],
            "path": s.get("path") or "", "homepage": s.get("homepage") or "",
            "route": s["route"], "routeLabel": ROUTE_ZH.get(s["route"], s["route"]),
            "license": lic, "licenseClass": lic_class, "licenseHint": lic_hint,
            "licenseWarning": s.get("license_warning") or "",
            "lang": s.get("lang") or "",
            "tier": tier, "stars": stars, "starsText": stars_text, "mono": mono, "stale": stale,
            "forks": int(st.get("forks") or 0), "pushedAt": st.get("pushed_at") or "",
            "archived": bool(st.get("archived")),
            "tagline": s.get("tagline_zh") or "", "taglineEn": s.get("tagline_en") or "",
            "highlights": s.get("highlights_zh") or [], "bestFor": s.get("best_for_zh") or "",
            "motion": (s.get("motion") or {}).get("note_zh") or "", "motionKind": (s.get("motion") or {}).get("kind") or "",
            "requires": s.get("requires") or [], "source": s.get("source") or "",
            "install": s.get("install"), "handRead": hand_read,
            "caps": caps, "quotes": quotes, "capsYes": caps_yes, "capsNo": caps_no,
            "hasCapData": bool(caps),
            "score": score,
            "styleIds": style_ids, "styleMore": g.get("style_more") or 0,
            "cover": cover, "images": imgs,
            "galleryInstall": g.get("install") or "",
            "anchor": g.get("anchor") or "",
        })

    merged.sort(key=lambda x: -x["stars"])

    meta = {
        "counts": readme["counts"],
        "builtAt": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "source": "brycewang-stanford/many-ppt-skills",
        "repoUrl": "https://github.com/brycewang-stanford/many-ppt-skills",
        "imgCount": sum(len(s["images"]) for s in merged),
        "imgSkills": sum(1 for s in merged if s["images"]),
        "styledSkills": sum(1 for s in merged if s["styleIds"]),
        "tiers": {t: sum(1 for s in merged if s["tier"] == t) for t in ("S", "A", "B")},
        "routes": {r: sum(1 for s in merged if s["route"] == r) for r in sorted({s["route"] for s in merged})},
        "maxStars": max_stars,
    }

    reg = {
        "meta": meta,
        "routeMeta": skills_doc["meta"]["routes"],
        "capMeta": [{"key": k, **v} for k, v in caps_doc["capabilities"].items()],
        "installMethods": readme["install_methods"],
        "routeTable": readme["route_table"],
        "decisionTree": readme["decisions"],
        "skills": merged,
    }

    os.makedirs(JS, exist_ok=True)
    with open(os.path.join(JS, "data.js"), "w", encoding="utf-8") as f:
        f.write("// 由 build_data.py 生成，勿手改。数据源：many-ppt-skills data/*.json + README\n")
        f.write("window.REG = ")
        json.dump(reg, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")

    size = os.path.getsize(os.path.join(JS, "data.js"))
    print("data.js: %.1f KB | skills=%d | imgSkills=%d | imgs=%d | styled=%d | tiers=%s" %
          (size / 1024, len(merged), meta["imgSkills"], meta["imgCount"], meta["styledSkills"], meta["tiers"]))


if __name__ == "__main__":
    main()
