# ClearIndex — starter site

Plain HTML/CSS/JS. No backend, no build step, no database.
Free hosting via GitHub Pages or Cloudflare Pages.

## Local preview
Run in your terminal:
```powershell
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## Before you launch — find & replace these placeholders

| Placeholder | Where | Replace with |
|---|---|---|
| `ClearIndex` | every page, css comment | your actual chosen name |
| `https://www.example.com` | canonical tags, sitemap.xml, robots.txt | your real domain |
| `payhip.com/b/REPLACE-ME` | store/index.html | your real Payhip product link |
| `REPLACE-ME.gumroad.com/l/REPLACE-ME` | store/index.html | your real Gumroad product link |
| `amazon.com/dp/REPLACE-ME` | store/index.html | your real Amazon listing (if/when live) |
| `hello@REPLACE-ME.com` | contact/index.html | your real contact email |
| `/images/favicon.ico` | index.html | add a real favicon file |

## File structure

```
/
├── index.html              ← homepage
├── robots.txt
├── sitemap.xml              ← add a <url> line every time you publish a page
├── css/style.css
├── js/main.js
├── guides/
│   ├── index.html            ← guides listing (add a <a class="ledger-row"> per new article)
│   └── 2027-social-security-cola.html   ← template: copy this file for every new article
├── store/index.html
├── about/index.html
├── contact/index.html
└── privacy/index.html
```

## Adding a new article

1. Copy `guides/2027-social-security-cola.html` → `guides/your-new-slug.html`
2. Update: `<title>`, meta description, canonical URL, the JSON-LD block, the kicker/category, `<h1>`, and the body content
3. Add a matching `<a class="ledger-row">` entry to `guides/index.html` and to `index.html`'s "Latest guides" section
4. Add the new URL to `sitemap.xml`
5. If it's a new topic category, add a new `<div class="category-label">Your Category</div>` above its rows in `guides/index.html`

## Adding a new niche/category later

The site isn't locked to Social Security. `guides/index.html` already groups articles under `.category-label` headers — just add a new label and its rows when you branch into a new niche. Consider giving a big new niche its own URL folder (e.g. `/guides/some-other-niche/`) to keep it visually and structurally distinct, same pattern as `/guides/` itself.

## Deploying (free)

**Cloudflare Pages** (recommended):
1. Push this folder to a GitHub repo
2. Cloudflare dashboard → Pages → Connect to Git → select the repo
3. Build command: none. Output directory: `/` (repo root)
4. Add your custom domain in the Pages project settings — Cloudflare gives free SSL automatically

**GitHub Pages** (alternative): repo → Settings → Pages → deploy from the `main` branch, root folder. Slightly more manual for custom domains but also free.

## After deploying

1. Set up a free **Google Search Console** account, verify the domain, submit `sitemap.xml`
2. Use "Request Indexing" on your homepage and first article to speed up the first crawl
3. Consider a free privacy-respecting analytics tool (Plausible has a free trial; a self-hosted option is Umami) — `main.js` already has a hook ready for Plausible, delete/adjust if you use something else
