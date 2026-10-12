# -*- coding: utf-8 -*-
"""
harvest_covers.py — 给没有样图的 skill 从其仓库 README 抓封面图。

背景：登记册 samples.json 只覆盖 43/227 个 skill；其余 skill 页面上没有配图。
本脚本逐个抓取这些 skill 自己仓库的 README，解析其中的图片链接（绝对/相对路径
都转成 raw.githubusercontent.com 直链），按关键词打分挑出最像「演示截图」的
前 MAX_PER_SKILL 张，写入 data/harvest.json。

- 断点续传：README 缓存在 data/readmes/<repo>.md；harvest.json 已有的 skill 跳过。
- 网络回退：本机代理 127.0.0.1:7897 → gh-proxy.com → ghfast.top → 直连。
- 下载图片不在这里做 —— build_data.py 合并 harvest.json 后走原有下载管线
  （压缩、断点续传、失败兜底 origin 链）。

用法：python harvest_covers.py
"""
import json
import os
import posixpath
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
READMES = os.path.join(DATA, "readmes")
HARVEST = os.path.join(DATA, "harvest.json")

MAX_PER_SKILL = 2          # 每个缺图 skill 最多补几张
PROXY = "http://127.0.0.1:7897"
TIMEOUT = 12

BAD_URL = ("shields.io", "img.shields", "badge", "travis", "circleci", "badge.fury",
           "coveralls", "codecov", "favicon", "apple-touch-icon")
WEAK_WORDS = ("logo", "icon", "avatar", "brand")
GOOD_WORDS = ("screenshot", "demo", "preview", "cover", "example", "output", "result",
              "showcase", "slide", "presentation", "deck", "theme", "template", "dark", "light")
IMG_EXT = (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg")  # 无扩展名（user-attachments 等）也算


def opener(proxy_on):
    if proxy_on:
        return urllib.request.build_opener(urllib.request.ProxyHandler(
            {"http": PROXY, "https": PROXY}))
    return urllib.request.build_opener(urllib.request.ProxyHandler({}))


def fetch_text(url, timeout=TIMEOUT):
    """代理优先 → 镜像 → 直连。返回 str 或 None。"""
    cands = [(url, opener(True))]
    if url.startswith("https://raw.githubusercontent.com/"):
        cands += [(url, opener(False)),
                  ("https://gh-proxy.com/" + url, opener(False)),
                  ("https://ghfast.top/" + url, opener(False))]
    for u, op in cands:
        try:
            req = urllib.request.Request(u, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with op.open(req, timeout=timeout) as r:
                blob = r.read()
            if blob:
                return blob.decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None          # 这个分支没有 README，换分支
        except Exception:
            continue
    return None


def get_readme(repo):
    """抓 README.md（main → master），缓存到 data/readmes/<repo>.md。返回 (text, branch) 或 (None, None)。"""
    safe = repo.replace("/", "__")
    path = os.path.join(READMES, safe + ".md")
    if os.path.exists(path) and os.path.getsize(path) > 64:
        with open(path, encoding="utf-8", errors="replace") as f:
            txt = f.read()
        # 缓存里第一行标记分支：#BRANCH:<branch>
        m = re.match(r"#BRANCH:(\S+)\n", txt)
        return (txt, m.group(1) if m else "main") if m else (None, None)
    for branch in ("main", "master"):
        raw = "https://raw.githubusercontent.com/%s/%s/README.md" % (repo, branch)
        txt = fetch_text(raw)
        if txt and len(txt) > 64:
            os.makedirs(READMES, exist_ok=True)
            tmp = path + ".tmp"
            with open(tmp, "w", encoding="utf-8") as f:
                f.write("#BRANCH:%s\n" % branch + txt)
            os.replace(tmp, path)
            return txt, branch
    return None, None


MD_IMG = re.compile(r"!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+['\"][^'\"]*['\"])?\s*\)")
HTML_IMG = re.compile(r"<img[^>]*?src\s*=\s*[\"']([^\"']+)[\"'][^>]*>", re.I)


def extract_candidates(md, repo, branch):
    """README -> [(score, url, label), ...] 按分数升序（越小越好）"""
    out, seen = [], set()

    def resolve(u):
        u = u.strip().strip("<>")
        if not u or u.startswith("#") or u.startswith("data:"):
            return None
        if u.startswith("//"):
            u = "https:" + u
        if u.startswith("http://"):
            u = "https://" + u[7:]
        # 有扩展名但不是图片（.zip/.pdf/.mp4...，README 常把附件也写成 ![x](y.zip)）→ 丢弃
        _path = u.split("?", 1)[0].split("#", 1)[0]
        _base = posixpath.basename(_path)
        _ext = posixpath.splitext(_base)[1].lower()
        if _ext and _ext not in IMG_EXT:
            return None
        if u.startswith("https://"):
            low = u.lower()
            if any(b in low for b in BAD_URL):
                return None
            return u
        # 相对路径 / 根路径 → raw 直链（用 README 所在分支）
        p = _path
        if not p or "." not in posixpath.basename(p):
            return None                     # 指向目录/无扩展名，放弃
        p = posixpath.normpath(p.lstrip("/"))
        if p.startswith(".."):
            return None
        return "https://raw.githubusercontent.com/%s/%s/%s" % (repo, branch, p)

    def score(u, label):
        hay = (u + " " + label).lower()
        base = posixpath.basename(u.split("?")[0]).lower()
        s = 1
        if any(w in hay for w in WEAK_WORDS):
            s += 10
        if any(w in hay for w in GOOD_WORDS):
            s -= 2
        if base.endswith(IMG_EXT):
            s -= 1
        return s

    for alt, url in MD_IMG.findall(md):
        u = resolve(url)
        if u and u not in seen:
            seen.add(u)
            out.append((score(u, alt), u, (alt or "").strip()[:80]))
    for m in HTML_IMG.finditer(md):
        u = resolve(m.group(1))
        if u and u not in seen:
            seen.add(u)
            # <img alt=...> 尽量取 alt
            am = re.search(r"alt\s*=\s*[\"']([^\"']*)[\"']", m.group(0), re.I)
            alt = (am.group(1) if am else "").strip()[:80]
            out.append((score(u, alt), u, alt))

    out.sort(key=lambda x: x[0])
    return out


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def main():
    skills = load_json(os.path.join(DATA, "skills.json"), None)
    samples = load_json(os.path.join(DATA, "samples.json"), None)
    if not skills or not samples:
        print("缺少 skills.json / samples.json")
        return
    harvest = load_json(HARVEST, {"skills": {}})
    harvest.setdefault("skills", {})

    missing = [s for s in skills["skills"]
               if not ((samples["skills"].get(s["id"]) or {}).get("samples"))
               and s["id"] not in harvest["skills"]]
    # 按 repo 去重抓取（monorepo 多个 id 共用 README）
    repos = sorted({s["repo"] for s in missing})
    print("缺图 skill: %d（其中待处理 %d），涉及 repo: %d"
          % (sum(1 for s in skills["skills"]
                 if not ((samples["skills"].get(s["id"]) or {}).get("samples"))),
             len(missing), len(repos)), flush=True)

    def work(repo):
        txt, branch = get_readme(repo)
        if not txt:
            return repo, None
        cands = extract_candidates(txt, repo, branch)
        return repo, cands

    repo_cands = {}
    with ThreadPoolExecutor(max_workers=8) as ex:
        for repo, cands in ex.map(work, repos):
            if cands:
                repo_cands[repo] = cands

    ok = skip = 0
    for s in missing:
        cands = repo_cands.get(s["repo"]) or []
        if not cands:
            skip += 1
            continue
        picked = [{"url": u, "label": lb or "README 首图"} for _, u, lb in cands[:MAX_PER_SKILL]]
        harvest["skills"][s["id"]] = {"samples": picked}
        ok += 1
        # monorepo 同仓其它缺图 id 一并补上
        for s2 in missing:
            if s2["id"] != s["id"] and s2["repo"] == s["repo"] \
               and s2["id"] not in harvest["skills"]:
                harvest["skills"][s2["id"]] = {"samples": picked}
                ok += 1

    # 三级兜底：README 里没有可用图（或没抓到 README）的，用 GitHub 官方
    # opengraph 仓库卡片做封面 —— 每个公开仓库都有，不依赖 README 内容。
    og = 0
    for s in missing:
        if s["id"] in harvest["skills"]:
            continue
        harvest["skills"][s["id"]] = {"samples": [{
            "url": "https://opengraph.githubassets.com/1/" + s["repo"],
            "label": "GitHub 仓库卡片（README 未提供样图）"}]}
        og += 1

    harvest["generated"] = __import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M")
    tmp = HARVEST + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(harvest, f, ensure_ascii=False, indent=1)
    os.replace(tmp, HARVEST)

    print("补采写入 %d 个 skill（README 图），%d 个 skill 用 GitHub 仓库卡片兜底 -> data/harvest.json"
          % (ok, og), flush=True)


if __name__ == "__main__":
    main()
