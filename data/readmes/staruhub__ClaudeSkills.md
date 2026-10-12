#BRANCH:main
[![en](https://img.shields.io/badge/lang-English-blue.svg)](README.md) [![zh-CN](https://img.shields.io/badge/语言-简体中文-red.svg)](README.zh-CN.md)

# ClaudeSkills

ClaudeSkills is a collection of Agent Skills: 13 skill packages written in the open `SKILL.md` format. Each skill packages the complete process for getting something done — steps, templates, scripts, examples, and acceptance checks are all files — and installs into any client that supports Agent Skills.

A prompt lets a model do something once, then dies with the conversation; a skill keeps the method around, so it can be reused, inspected, and improved.

[![validate](https://github.com/staruhub/ClaudeSkills/actions/workflows/validate.yml/badge.svg)](https://github.com/staruhub/ClaudeSkills/actions/workflows/validate.yml)
[![release](https://img.shields.io/badge/release-1.0.1-2746d8)](https://github.com/staruhub/ClaudeSkills/releases/tag/1.0.1)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**Contents**: [Quick start](#quick-start) · [Skills](#skills) · [Verification](#verification) · [Install options](#install-options) · [Contributing](#contributing)

[Website](https://staruhub.github.io/ClaudeSkills/) · [Release 1.0.1 notes](https://github.com/staruhub/ClaudeSkills/releases/tag/1.0.1) · [Security](SECURITY.md)

<p align="center">
  <img src="assets/social/agent-skills-concept-hero.png" alt="Agent Skills concept: experience becomes reusable capability" width="100%">
</p>

## Quick start

Install one and try it — deck-studio, for example:

```bash
git clone --depth 1 https://github.com/staruhub/ClaudeSkills.git && cd ClaudeSkills
python3 scripts/install_skill.py deck-studio
```

Then just tell your agent:

```text
Use deck-studio to turn this quarterly review into an 8-slide consulting deck
```

Skills install to `~/.agents/skills/` by default, which most clients scan. For other ways to install, see [Install options](#install-options).

## Skills

Four flagships:

| Skill | What it does |
|---|---|
| [`deep-research`](skills/Geek-skills-deep-research/SKILL.md) | Research: scopes the question, gathers sources, registers each one, checks citations; hands back a report with references and limits |
| [`product-manager`](skills/Geek-skills-product-manager/SKILL.md) | grill-me-to-doc: reads the repo first, asks one question per round, turns a vague idea into a product document. No code before the doc is approved; interruptions resume |
| [`deck-studio`](skills/Geek-skills-deck-studio/SKILL.md) | Decks: outline, per-page briefs, registered layouts, visual checks; delivers content or per-slide visuals |
| [`wechat-article-writer`](skills/Geek-skills-wechat-article-writer/SKILL.md) | WeChat articles: copy, image prompts, layout HTML — solo or as a pipeline. Never publishes for you |

Nine professional skills:

<details>
<summary><b>Show them</b></summary>

| Skill | What it does |
|---|---|
| [`pair-programming`](skills/Geek-skills-pair-programming/SKILL.md) | Writes code with structured self-review aimed at common AI-code defects |
| [`security-audit`](skills/Geek-skills-security-audit/SKILL.md) | Reviews code and dependencies for security issues |
| [`solution-architect`](skills/Geek-skills-solution-architect/SKILL.md) | System design, tech selection, architecture review |
| [`threejs-performance`](skills/Geek-skills-threejs-performance/SKILL.md) | Diagnoses and tunes Three.js performance |
| [`mineru-pdf-parser`](skills/Geek-skills-mineru-pdf-parser/SKILL.md) | Turns PDFs into Markdown or JSON with a local MinerU install |
| [`ai-sales-champion`](skills/Geek-skills-ai-sales-champion/SKILL.md) | Explains technical capability as business value a customer understands |
| [`keqian-method`](skills/Geek-skills-keqian-method/SKILL.md) | A single-agent, SDD, quality-gated product development method |
| [`xuefeng-method`](skills/Geek-skills-xuefeng-method/SKILL.md) | An open-behavior, model-driven AI-native product method |
| [`c-drive-cleaner`](skills/Geek-skills-c-drive-cleaner/SKILL.md) | Windows C-drive cleanup, dry-run by default |

</details>

Experimental ones (exam prep, weather reports, podcast generation, and friends) live in [`lab/`](lab/). They don't count toward the curated set and skip the same checks.

## Verification

Everything checkable is a script — run them yourself:

```bash
python3 scripts/validate.py                  # structure checks for the 13 curated skills
python3 scripts/run_routing_evals.py         # 91 routing cases
python3 tests/task_b/run_contract_tests.py   # 17 contract cases across the four flagships
```

You can also inspect the artifacts directly. deck-studio keeps its generators, rendered pages, rubrics, and review notes in the repo. Four of the 17 styles:

<p align="center">
<img src="skills/Geek-skills-deck-studio/style-library/creative/bauhaus-preview.png" alt="Bauhaus deck style preview" width="24%"> <img src="skills/Geek-skills-deck-studio/style-library/creative/constructivist-preview.png" alt="Constructivist deck style preview" width="24%"> <img src="skills/Geek-skills-deck-studio/style-library/media/neubrutalism-preview.png" alt="Neubrutalism deck style preview" width="24%"> <img src="skills/Geek-skills-deck-studio/style-library/business/aicher-preview.png" alt="Aicher deck style preview" width="24%">
</p>

Examples: [Constructivist](skills/Geek-skills-deck-studio/examples/constructivist-design-constitution/) · [Moshiro consulting report](skills/Geek-skills-deck-studio/examples/moshiro-consulting-report/) · [Yinghuang bootcamp proposal](skills/Geek-skills-deck-studio/examples/yinghuang-bootcamp-proposal/) · [Polar Night AI Native](skills/Geek-skills-deck-studio/examples/polar-night-ai-native/)

Self-test scores: the Constructivist example scored **7.1/10** on the repo's own rubric; a position-swapped three-judge comparison came out **42.3** to **29.7**. The process and data are in the repo — rerun them yourself.

<details>
<summary><b>What each check proves, and what it doesn't</b></summary>

| Check | Proves | Doesn't prove |
|---|---|---|
| `run_contract_tests.py` | 17 fixed cases covering the success, resume, and failure paths of all four flagships; Deck additionally runs real Chrome rendering and PPTX assembly | Output quality on a different model, real image generation, actual WeChat publishing |
| `validate.py` | Directory structure of the 13 curated skills matches the repo contract | Real-business E2E for every skill |
| `run_routing_evals.py` | Schema, target, uniqueness, and conflict checks pass for 91 routing cases across 10 skills | Routing accuracy when a real model runs it |
| Python / Node compile checks | The repo's 13 Python files and 7 JavaScript files all parse | Network, external tools, production availability |

Full record in [`verification/2026-07-31/README.md`](verification/2026-07-31/README.md).

</details>

## Install options

<details>
<summary><b>Show them</b></summary>

```bash
python3 scripts/install_skill.py --list                  # list all short names
python3 scripts/install_skill.py deep-research           # install any skill
python3 scripts/install_skill.py deep-research --project # current project only
python3 scripts/install_skill.py deep-research --client claude-code # Claude Code's directory
cp -r skills/Geek-skills-deep-research ~/.agents/skills/deep-research # manual copy; the directory name is the skill name
```

```bash
git pull && python3 scripts/install_skill.py deck-studio --force   # update
rm -rf ~/.agents/skills/deck-studio                                # uninstall
```

FAQ:

- Installed but not found: check whether your client scans `.agents/skills/`; if not, use its native directory.
- No automatic trigger: name the skill in your request. Triggers vary by client — some match natural language, others want slash commands.
- Re-install after `git pull` — installed skills are copies.

</details>

## Contributing

Found a bug or built something with a skill? [Open an issue](https://github.com/staruhub/ClaudeSkills/issues) with redacted input, output, and repro steps. To add a skill, read [CONTRIBUTING.md](CONTRIBUTING.md): new work starts in [`lab/`](lab/) and graduates after passing the checks.

If it saved you time, leave a star. The WeChat promo image and ready-to-send copy are in [`assets/social/`](assets/social/) — take them.

## Security

What each skill reads, whether it touches the network, runs commands, or handles credentials — per skill in [`SECURITY.md`](SECURITY.md).

## License

[MIT](LICENSE)
