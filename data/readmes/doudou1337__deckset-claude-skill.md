#BRANCH:main
# Deckset Presentation Expert

Claude Code skill for creating Deckset presentations with markdown. Includes 29 documentation files, 3 example presentations, and auto-scraper.

## Installation

### Claude Code

**Quick install:**
```bash
/plugin marketplace add doudou1337/deckset-claude-skill
/plugin install deckset-presentation-expert
```

**Or local:**
```bash
git clone https://github.com/doudou1337/deckset-claude-skill.git
cd deckset-claude-skill
/plugin marketplace add .
/plugin install deckset-presentation-expert
```

### Claude Desktop

1. Download the latest `deckset-presentation-expert.zip` from [Releases](https://github.com/doudou1337/deckset-claude-skill/releases)
2. Open Claude Desktop
3. Go to Settings → Skills
4. Click "Install from file" or drag & drop the zip file
5. Restart Claude Desktop

## Usage

Just mention "Deckset", "slides", or "presentation" and the skill activates automatically.

Examples:
- "Create a Deckset presentation about ML basics"
- "Add presenter notes to these slides"
- "How do I add background images in Deckset?"

## What's Included

- 📚 **29 docs** from official Deckset documentation (formatting, media, presenting, customization)
- 🎨 **3 examples** (simple, technical, visual presentations)
- 🔧 **Scraper script** to update docs from deckset.com

## Quick Reference

**Slide separator** (must have blank lines):
```markdown
---
```

**Headings:**
```markdown
# Title Slide
## Slide Heading
```

**Images:**
```markdown
![](background.jpg)              # Full-screen
![inline](logo.png)              # Inline
![inline fill](photo.jpg)        # Fill space
```

**Presenter notes:**
```markdown
^ This is a presenter note (starts with ^)
```

**Config** (at top of file):
```markdown
theme: Plain Jane, 1
footer: My Presentation
slidenumbers: true
```

## Structure

```
skills/deckset-presentation-expert/
├── SKILL.md                 # Main skill
├── docs/                    # 29 organized docs
│   ├── formatting/          # 13 files
│   ├── media/               # 5 files
│   ├── presenting/          # 5 files
│   ├── customization/       # 2 files
│   └── general/             # 4 files
└── examples/                # 3 complete examples
```

## Update Docs

```bash
source venv/bin/activate
python scripts/scrape-deckset-docs.py
```

## Resources

- Deckset: https://www.decksetapp.com
- Docs: https://docs.deckset.com/English.lproj/
- Issues: https://github.com/doudou1337/deckset-claude-skill/issues

## License

MIT - Alexis Lutun

Unofficial community skill. Not affiliated with Deckset or Anthropic.