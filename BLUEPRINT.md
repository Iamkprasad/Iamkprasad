# Blueprint: Insurance Analyst Static Website

> A complete specification for building a static, JSON-driven personal website for an independent Indian insurance analyst. Paste this into any AI website generator (Lovable, Cursor, Replit, etc.) to rebuild the site.

---

## 1. Project Identity

- **Name:** Prasad Kulal — Insurance & Market Analysis
- **Author:** Prasad Chandra Kulal
- **Live URL:** https://iamkprasad.github.io
- **Purpose:** Static personal website and blog for an independent insurance analyst focused exclusively on the Indian insurance sector
- **Content Scope:** Indian insurance only — life, general, health, motor, crop, cyber. No equity, crypto, global markets, or general finance.
- **Deployment:** GitHub Pages via GitHub Actions (no build step, pure static files)

---

## 2. Tech Stack

- **HTML5** — 7 pages, semantic markup
- **CSS3** — Single `style.css` (1,484 lines), CSS custom properties, dark mode, responsive
- **JavaScript** — Single `script.js` (434 lines), vanilla ES6+, no frameworks, no modules
- **Fonts:** Google Fonts — Lora (serif, headings) + Outfit (sans-serif, body)
- **Data:** JSON files in `data/` directory, fetched at runtime
- **No build step, no bundler, no server, no backend**

---

## 3. File Structure

```
/
├── index.html              # Homepage: hero, stacking gallery, featured posts, latest news
├── blog.html               # Blog listing: search + category filters
├── news.html               # News listing: search + category filters
├── post.html               # Single post view (?id=BLG-XXX or ?slug=xxx)
├── archives.html           # Monthly grouped archive of all content
├── about.html              # Author bio, focus areas, recent writing
├── contact.html            # Contact form (mailto: backend)
├── style.css               # All styles, CSS variables, dark mode, responsive
├── script.js               # All client-side logic, data loading, rendering
├── BLUEPRINT.md            # This file
├── README.md               # GitHub profile placeholder
├── .github/
│   └── workflows/
│       └── pages.yml       # GitHub Actions auto-deploy
├── data/
│   ├── blogs.json          # 19 blog posts (BLG-001 to BLG-019)
│   ├── news.json           # 20 news items (NWS-001 to NWS-020)
│   ├── content-registry.json  # Master metadata registry (not consumed by site)
│   ├── stack-images.json   # Homepage stacking gallery items
│   └── profile.json        # Author metadata (loaded but unused)
└── assets/
    └── images/
        ├── stack-*.jpg     # Stacking gallery images (5)
        ├── blog/           # Blog post images (placeholder)
        └── news/           # News item images (placeholder)
```

---

## 4. Design System

### 4.1 Color Palette

**Light Mode:**
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#f5f3ef` | Page background (warm off-white) |
| `--bg-secondary` | `#ede9e3` | Footer, connect strip |
| `--card-bg` | `#ffffff` | Cards, surfaces |
| `--nav-bg` | `#f5f3ef` | Navbar background |
| `--text-primary` | `#1a1a1a` | Headings |
| `--text-secondary` | `#4a4a4a` | Body text |
| `--text-muted` | `#6a6a6a` | Meta, captions |
| `--accent` | `#4a6741` | Primary brand green |
| `--accent-hover` | `#3a5232` | Darker green (hover) |
| `--border` | `#d6d0c8` | Borders |
| `--alert` | `#b94040` | Breaking news red |

**Dark Mode (class `.dark` on `<html>`):**
| Token | Hex |
|-------|-----|
| `--bg-primary` | `#141410` |
| `--bg-secondary` | `#1c1c18` |
| `--card-bg` | `#1e1e1a` |
| `--nav-bg` | `#141410` |
| `--text-primary` | `#e8e4dc` |
| `--text-secondary` | `#c0bab0` |
| `--text-muted` | `#8a8680` |
| `--accent` | `#8aaa7a` |
| `--accent-hover` | `#a0be90` |
| `--border` | `#2e2e28` |

**Tag Colors (hardcoded):**
| Tag | Background | Text |
|-----|------------|------|
| Life Insurance | `#EAF0F5` | `#1A4A6E` |
| General Insurance | `#EAF5EA` | `#1A4A2A` |
| Health | `#F5EAF0` | `#6E1A4A` |
| Motor | `#FFF3E0` | `#7A4000` |
| IRDAI/Regulatory | `#F0EDF5` | `#3A1A6E` |
| Breaking | `#FDECEA` | `#b94040` |

### 4.2 Typography

**Font Families:**
- Display/Headings: `'Lora', Georgia, serif` (variable: `--font-display`)
- Body/UI: `'Outfit', system-ui, sans-serif` (variable: `--font-body`)

**Google Fonts Import:**
```
Lora: 400, 500, italic 400
Outfit: 300, 400, 500, 600
```

**Font Sizes:**
| Context | Size |
|---------|------|
| Eyebrow/label | 11px, 600 weight, uppercase, letter-spacing 0.14em |
| Nav link | 13px, 400 weight |
| Nav CTA | 11px, 600 weight, uppercase, letter-spacing 0.06em |
| Body text | 16px, 300 weight, line-height 1.85 (post content) |
| Card title | 20px, 500 weight (Lora) |
| Section title | 2rem mobile / 2.25rem desktop |
| Hero title | 2.75rem mobile / 3.5rem desktop, line-height 1.05 |
| Post hero h1 | 34px mobile / 36px desktop |

**Font Weights:**
- 300: Body text, descriptions, meta
- 400: Headings, normal text
- 500: Logo, card titles, buttons
- 600: Eyebrow labels, tags, filter buttons

### 4.3 Layout

**Max Widths:**
- Global container: `1160px`
- Article content: `680px`
- About page: `720px`
- Hero content: `768px`

**Responsive Breakpoints:**
- `max-width: 640px` — Mobile adjustments (smaller fonts, single column)
- `max-width: 768px` — Tablet (hide desktop nav, show mobile menu)
- `min-width: 768px` — Desktop (show desktop nav, multi-column grids)

**Grid System:**
- `.grid-2` — 1 column mobile, 2 columns desktop
- `.grid-3` — 1 column mobile, 3 columns desktop
- `.focus-grid` — 1 column mobile, 2 columns at 640px+

### 4.4 Components

**Navbar:** Fixed, 58px height, `var(--bg-primary)` background, bottom border. Logo (Lora 17px/500), desktop nav links (Outfit 13px), LinkedIn CTA button, dark mode toggle (sun/moon SVG), mobile hamburger menu.

**Cards:**
- `.blog-card` — 24px 28px padding, 6px radius, 1px border, 3px left accent border, hover: left-border-color + box-shadow
- `.post-card` — 1.5rem padding, 4px radius, 3px left accent border, hover: translateY(-2px)
- `.card` — Generic card with `.card-body` (1.5rem padding)

**Buttons:**
- `.btn-primary` — accent bg, white text, 0.75rem 2rem padding, 4px radius
- `.btn-outline` — transparent bg, 1px border, hover: accent
- `.filter-btn` — pill shape (20px radius), 7px 18px padding, hover: accent border
- `.filter-btn.active` — inverted (accent bg, white text)

**Footer:** `var(--bg-secondary)` background, flex row on desktop. Brand, description, nav links, LinkedIn, copyright with dynamic year, disclaimer.

### 4.5 Animations

**Single keyframe: `fadeUp`**
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
Applied to `.post-hero` (immediate) and `.post-body-wrapper` (0.15s delay, fill-mode backwards).

**Global transitions (dark mode switching):**
```css
*, *::before, *::after {
  transition: background-color 0.25s ease, border-color 0.2s ease, color 0.15s ease;
}
```

### 4.6 Dark Mode

- Toggle via `.dark` class on `<html>` element
- Defaults to light mode (no system preference detection)
- Persisted to `localStorage.theme`
- Bootstrap: IIFE runs before DOMContentLoaded to prevent flash
- Toggle button: `.theme-toggle` with `.icon-moon` (shown in light) and `.icon-sun` (shown in dark) SVGs

---

## 5. Pages

### 5.1 index.html (Homepage)

**Sections:**
1. **Navbar** — Logo, desktop nav (Home active, Blog, News, Archives, About, Contact, LinkedIn CTA), dark mode toggle, mobile hamburger
2. **Hero** — Full viewport height. Eyebrow: "Insurance & Market Analysis". H1: "Prasad Chandra Kulal". Description. Two buttons: "Explore Blog" + "About Me". LinkedIn CTA.
3. **Stacking Gallery** — `#stacking-container` (empty, populated by script.js from `stack-images.json`). Scroll-stacking card effect with images and descriptions.
4. **Featured Blog Posts** — `#featured-posts` (empty, populated by script.js, first 3 from `blogs.json`). Section title: "Latest from the Blog". "View All Posts" button.
5. **Latest News** — `#latest-news` (empty, populated by script.js, first 3 from `news.json`). Section title: "Market News & Updates". "View All News" button.
6. **About Section** — Hardcoded bio, "More About Me" button, "Connect on LinkedIn" button.
7. **Footer** — Brand, nav links, LinkedIn, copyright (`#currentYear`), disclaimer.

**DOM IDs:** `stacking-container`, `featured-posts`, `latest-news`, `currentYear`

### 5.2 blog.html (Blog Listing)

**Sections:**
1. **Page Header** — Eyebrow: "Insurance analysis". H1: "Blog". Description.
2. **Filter Section** — Search box (`#blog-search`), filter buttons (`#blog-filters`): All (active), Life Insurance, General Insurance, Health, Motor, IRDAI/Regulatory, Personal Lines
3. **Feed** — `#blog-feed-container` (empty, populated by script.js)
4. **Footer**

**DOM IDs:** `blog-search`, `blog-filters`, `blog-feed-container`, `currentYear`

### 5.3 news.html (News Listing)

**Sections:**
1. **Page Header** — Eyebrow: "Market updates". H1: "News". Description.
2. **Filter Section** — Search box (`#news-search`), filter buttons (`#news-filters`): All (active), Life Insurance, General Insurance, Health, IRDAI/Regulatory
3. **Feed** — `#news-feed-container` (empty, populated by script.js)
4. **Footer**

**DOM IDs:** `news-search`, `news-filters`, `news-feed-container`, `currentYear`

**Difference from blog.html:** No "Motor" or "Personal Lines" filter buttons.

### 5.4 post.html (Single Post View)

**Sections:**
1. **Navbar**
2. **Single Post Container** — `#single-post-container` (completely empty, all content rendered by script.js)
3. **Footer**

**Rendering (by script.js):**
- Reads `?id=BLG-XXX` or `?slug=xxx` from URL
- Searches both `blogs.json` and `news.json`
- Renders: `.post-hero` (category tag, title, byline), `.post-body-wrapper` (previous coverage banner if any, formatted content, related articles if any, share buttons for LinkedIn and X)

**DOM IDs:** `single-post-container`, `currentYear`

### 5.5 archives.html (Monthly Archive)

**Sections:**
1. **Page Header** — Eyebrow: "Complete archive". H1: "Archives". Description.
2. **Archive Container** — `#archives-container` (contains "Loading archives..." placeholder, replaced by script.js)

**Rendering (by script.js):**
- Loads both `blogs.json` and `news.json`
- Merges, sorts by date descending
- Groups by year-month (e.g., "June 2026", "May 2026")
- Renders `.archive-section-title` per month, `.archive-row` per item (ID, type, title, date)

**DOM IDs:** `archives-container`, `currentYear`

### 5.6 about.html (Author Bio)

**All content is hardcoded (no dynamic containers).**

**Sections:**
1. **Page Header** — Eyebrow: "Insurance Analysis . India". H1: "Prasad Chandra Kulal". Role: "Independent insurance analyst & researcher". Two bio paragraphs with divider.
2. **Focus Section** — 4 focus cards: IRDAI Regulatory Watch, Insurer Performance, Product & Policy Trends, Motor & Health Segments.
3. **Recent Writing** — 3 hardcoded post links:
   - `post.html?id=BLG-012` — IRDAI's New KMP Governance
   - `post.html?id=BLG-004` — Motor Insurance in India
   - `post.html?id=BLG-017` — Health Insurance Trends
4. **Connect Section** — "Connect on LinkedIn" with button to LinkedIn profile.
5. **Footer**

**DOM IDs:** `currentYear` only

### 5.7 contact.html (Contact Form)

**Sections:**
1. **Page Header** — Eyebrow: "Get in touch". H1: "Contact". Description.
2. **Contact Form** — Name (required), Email (required), Subject (optional), Message (required), Submit button. Status message.
3. **Divider** — "Or connect with me directly" + LinkedIn button.
4. **Footer**

**Form Behavior:** Opens `mailto:` link to `prasad.kulal@example.com` with encoded subject/body. No backend.

**DOM IDs:** `contact-form`, `contact-name`, `contact-email`, `contact-subject`, `contact-message`, `contact-status`, `currentYear`

### 5.8 Shared Navbar (All Pages)

```html
<nav class="navbar">
  <div class="nav-container">
    <a href="index.html" class="logo">Prasad<span class="logo-accent"> Kulal</span></a>
    <div class="desktop-nav">
      <a href="index.html" class="nav-link">Home</a>
      <a href="blog.html" class="nav-link">Blog</a>
      <a href="news.html" class="nav-link">News</a>
      <a href="archives.html" class="nav-link">Archives</a>
      <a href="about.html" class="nav-link">About</a>
      <a href="contact.html" class="nav-link">Contact</a>
      <a href="https://www.linkedin.com/in/prasadkulal/" target="_blank" class="nav-cta">LinkedIn</a>
      <button class="theme-toggle" aria-label="Toggle dark mode">
        <!-- moon SVG (shown in light mode) -->
        <!-- sun SVG (shown in dark mode) -->
      </button>
    </div>
    <button class="mobile-menu-btn" aria-label="Toggle menu">
      <!-- menu SVG -->
      <!-- close SVG (hidden by default) -->
    </button>
  </div>
  <div class="mobile-nav">
    <div class="mobile-nav-content">
      <!-- Same 6 page links + LinkedIn -->
    </div>
  </div>
</nav>
```

**Active page:** The matching `.nav-link` gets class `active`. post.html has no active link.

### 5.9 Shared Footer (All Pages)

```html
<footer class="footer py-24 px-6">
  <div class="footer-content">
    <div class="footer-brand">Prasad<span class="logo-accent"> Kulal</span></div>
    <div class="footer-desc">Independent Insurance Analysis . India</div>
    <div class="footer-links">
      <a href="index.html" class="footer-link">Home</a>
      <a href="blog.html" class="footer-link">Blog</a>
      <a href="news.html" class="footer-link">News</a>
      <a href="archives.html" class="footer-link">Archives</a>
      <a href="about.html" class="footer-link">About</a>
      <a href="contact.html" class="footer-link">Contact</a>
      <a href="https://www.linkedin.com/in/prasadkulal/" target="_blank" class="footer-social">LinkedIn</a>
    </div>
  </div>
  <div class="footer-copyright">
    &copy; <span id="currentYear"></span> Prasad Chandra Kulal
  </div>
  <div class="footer-disclaimer">
    Not investment advice. This site is for informational purposes only.
  </div>
</footer>
```

---

## 6. Content Architecture

### 6.1 Blog Post Schema (blogs.json)

```json
{
  "id": "BLG-019",
  "slug": "lic-q4-fy26-deep-dive-record-profit-surging-vnb-and-the-margin-story",
  "title": "LIC Q4 FY26 Deep Dive: Record Profit, Surging VNB, and the Margin Story",
  "category": "Life Insurance",
  "tags": ["LIC", "SBI", "HDFC", "FY26", "Q4", "PAT", "VNB", "AUM"],
  "author": "Prasad Chandra Kulal",
  "published_date": "2026-06-04",
  "read_time": "2 min read",
  "summary": "LIC reported a record Rs 57,419 crore PAT for FY26 with VNB surging 42%.",
  "content": "<p>Full HTML content...</p><h2>Section Title</h2><p>More content...</p>",
  "previous_coverage": null,
  "related_ids": []
}
```

### 6.2 News Item Schema (news.json)

Same as blog, plus:
```json
{
  "source": "Economic Times / Business Standard"
}
```

### 6.3 Content Registry Schema (content-registry.json)

```json
{
  "blogs": [
    {
      "id": "BLG-019",
      "slug": "...",
      "title": "...",
      "category": "...",
      "tags": [...],
      "published_date": "2026-06-04",
      "status": "published",
      "summary": "...",
      "file_path": "blogs/lic-q4-fy26-deep-dive.md",
      "related_ids": [],
      "superseded_by": null,
      "previous_coverage_id": null
    }
  ],
  "news": [
    {
      "id": "NWS-020",
      "slug": "...",
      "title": "...",
      "category": "...",
      "tags": [...],
      "published_date": "2026-05-26",
      "status": "published",
      "summary": "...",
      "file_path": "news/irdai-links-insurance-kmp-pay.md",
      "related_ids": [],
      "superseded_by": null,
      "previous_coverage_id": null
    }
  ],
  "last_updated": "2026-06-03"
}
```

### 6.4 ID System

- **Blogs:** `BLG-001` through `BLG-019` (oldest first: BLG-001 = Apr 28, BLG-019 = Jun 4)
- **News:** `NWS-001` through `NWS-020` (oldest first: NWS-001 = Jan 19, NWS-020 = May 26)
- **JSON arrays sorted newest-first** for display (BLG-019 first in file, rendered first on page)
- **content-registry.json** sorted newest-first

### 6.5 Categories

| Category | Used in Blog | Used in News |
|----------|:---:|:---:|
| Life Insurance | Yes | Yes |
| General Insurance | Yes | Yes |
| Health | Yes | Yes |
| Motor | Yes | No |
| IRDAI/Regulatory | Yes | Yes |
| Personal Lines | Yes | No |

### 6.6 Content Features

- **Previous Coverage:** If a post updates a prior article, `previous_coverage` contains `{ id, title }`. Renders as a yellow banner at top of post.
- **Related Articles:** `related_ids` array of post IDs. Renders as "Related Coverage" grid at bottom of post.
- **Slugs:** URL-safe slugs for SEO-friendly URLs. Posts can be accessed via `?id=BLG-019` or `?slug=lic-q4-fy26-deep-dive`.

---

## 7. JavaScript Logic (script.js)

### 7.1 Architecture

Single file, 4 execution phases:
1. **IIFE:** Dark mode bootstrap (reads localStorage, applies `.dark` class)
2. **Global functions:** `loadData()`, `handleImgError()`
3. **IIFE:** Mobile menu toggle
4. **DOMContentLoaded:** All page-specific logic (guarded by element ID checks)

### 7.2 `loadData(url)` — Data Loading

```javascript
function loadData(url) {
  return new Promise((resolve, reject) => {
    // Primary: Fetch API
    fetch(url, { mode: 'same-origin' })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(resolve)
      .catch(() => {
        // Fallback: XMLHttpRequest (works with file:// protocol)
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 0 || xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error('XHR ' + xhr.status));
            }
          }
        };
        xhr.onerror = () => reject(new Error('Network'));
        xhr.send();
      });
  });
}
```

**Key:** XHR fallback accepts `status === 0` for `file://` protocol compatibility.

### 7.3 Cache Busting

```javascript
const cacheBuster = `?t=${new Date().getTime()}`;
// Usage: loadData(`data/blogs.json${cacheBuster}`)
```

Appended to every JSON fetch URL to prevent browser caching.

### 7.4 Dark Mode

**Bootstrap (IIFE, runs before DOMContentLoaded):**
```javascript
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  if (saved === 'dark') document.documentElement.classList.add('dark');
})();
```

**Toggle (in DOMContentLoaded):**
```javascript
const toggle = document.querySelector('.theme-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}
```

### 7.5 Blog Listing (blog.html)

**State:** `allBlogPosts`, `blogFilter` (default 'all'), `blogSearch` (default '')

**Flow:**
1. Load `blogs.json` → store in `allBlogPosts` → call `renderBlogPage(data)`
2. Filter button click → update `blogFilter` → call `filterBlogPage()`
3. Search input → update `blogSearch` → call `filterBlogPage()`
4. `filterBlogPage()` → filter by category + search → call `renderBlogPage(filtered)`

**Render template per card:**
```html
<a href="post.html?id=${item.id}" class="blog-card">
  <span class="blog-card-tag">${item.category}</span>
  <h2 class="blog-card-title">${item.title}</h2>
  <p class="blog-card-excerpt">${item.summary}</p>
  <div class="blog-card-footer">
    <div class="blog-card-meta"><strong>${item.author}</strong> · ${item.published_date} · ${item.read_time}</div>
    <span class="blog-card-more">Read more →</span>
  </div>
</a>
```

### 7.6 News Listing (news.html)

Same pattern as blog. Key difference: uses `item.source || item.author` in meta, omits `read_time`.

### 7.7 Single Post View (post.html)

**Flow:**
1. Parse URL: `?id=` or `?slug=` or `#hash`
2. Load both `blogs.json` and `news.json` via `Promise.all`
3. Find matching item by ID or slug
4. Update `document.title`
5. Format content: `*bold*` → `<strong>`, `_italic_` → `<em>`
6. Render `.post-hero` (category, title, byline)
7. Render `.post-body-wrapper`:
   - Previous coverage banner (if `post.previous_coverage` exists)
   - Formatted content
   - Related articles grid (if `post.related_ids` has items)
   - Share buttons (LinkedIn, X/Twitter)

### 7.8 Archives (archives.html)

**Flow:**
1. Load both `blogs.json` and `news.json`
2. Add `type` property: "Blog" or "News"
3. Sort by `published_date` descending
4. Group by `YYYY-MM` key, label as "MonthName YYYY"
5. Render month headers + item rows (ID, type, title, date)

### 7.9 Homepage (index.html)

**Stacking Gallery:** Load `stack-images.json`, render `.stack-layer` divs with images and text.

**Featured Posts:** Load `blogs.json`, take first 3, render `.card-link` elements.

**Latest News:** Load `news.json`, take first 3, render `.post-card` elements.

### 7.10 Error Handling

| Feature | Error Behavior |
|---------|---------------|
| Profile load | Silent catch |
| Stacking gallery | Silent catch (section stays empty) |
| Blog listing | "Unable to load blog posts." message |
| News listing | "Unable to load news." message |
| Single post (data load) | Returns empty array |
| Single post (not found) | "Post not found." message |
| Archives | "Unable to load archives." on Promise.all failure |
| Featured/latest news | Silent catch |

### 7.11 Image Error Handler

```javascript
function handleImgError(img) {
  img.onerror = null;
  const div = document.createElement('div');
  div.style.cssText = `background:var(--border);border-radius:4px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:13px;font-family:Outfit,sans-serif;width:${img.style.width || '100%'};height:${img.style.height || '200px'}`;
  div.textContent = 'Image unavailable';
  img.parentNode.replaceChild(div, img);
}
```

---

## 8. CSS Architecture (style.css)

### 8.1 Structure

1. **CSS Reset** — `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }` + global transitions
2. **CSS Variables** — `:root` (light) and `.dark` (dark) overrides
3. **Typography** — Font imports, body styles, heading styles
4. **Layout Utilities** — Flex, grid, spacing, max-width, responsive helpers
5. **Components** — Navbar, hero, cards, buttons, filters, footer, archive, post, about, contact
6. **Dark Mode Overrides** — `.dark` class variable swaps, hardcoded component overrides
7. **Animations** — `fadeUp` keyframe
8. **Responsive** — Media queries at 640px and 768px

### 8.2 Key Patterns

- All theme-aware colors use CSS variables
- Dark mode swaps 10 variables via `.dark` class on `<html>`
- Global `*` transition enables smooth theme switching
- Sticky positioning for stacking gallery (`.stack-layer { position: sticky; top: 0; }`)
- Drop cap on first paragraph of post content
- Pill-shaped filter buttons (20px radius)
- Card hover: translateY(-2px) or border-left-color change

---

## 9. Content Creation Workflow

### 9.1 Overview

The site uses a daily content creation workflow with two custom tools:
1. **CONTENT_SKILL.md** — Reference document with FETCH PROMPT and editorial guidelines
2. **admin-review.html** — Offline admin tool for reviewing and approving content

### 9.2 CONTENT_SKILL.md Specification

This file contains:

**FETCH PROMPT** — Template prompt the user pastes into Claude:
```
You are a content researcher for "Prasad Chandra Kulal — Insurance & Market Analysis".

Today's date: [DATE]

Here is my current content registry:
[PASTE content-registry.json]

Research today's Indian insurance news using web search. Focus on:
- IRDAI regulatory developments
- Insurance company quarterly/annual results
- Premium growth data, VNB margins, solvency ratios
- Health, motor, life, general insurance segment news
- GST changes affecting insurance
- New product launches, market structure changes

For each item found:
1. Check the registry above — do NOT duplicate existing coverage
2. Write a full analysis (Blog) or market update (News)
3. Include data points, numbers, and source attribution
4. If this updates a previous article, link to it via previous_coverage_id

Output format: See the OUTPUT FORMAT section below.
```

**OUTPUT FORMAT** — Exact markdown structure for daily-fetch.md:
```markdown
# Daily Fetch — 2026-06-04

## ITEM 1
- **Type:** Blog
- **Title:** LIC Q4 FY26 Deep Dive: Record Profit, Surging VNB
- **Category:** Life Insurance
- **Tags:** LIC, FY26, Q4, PAT, VNB
- **Summary:** LIC reported a record Rs 57,419 crore PAT for FY26...
- **Why publish this:** First comprehensive analysis of LIC's record FY26 results...
- **Previous Coverage:** NWS-019 (if updating a previous article)

### Content

<p>Full HTML content with <strong>bold</strong> and <em>italic</em>...</p>
<p>Include data points, numbers, and analysis.</p>

---

## ITEM 2
...
```

**EDITORIAL RULES:**
- Insurance-only (life, general, health, motor, crop, cyber, reinsurance)
- India-only (no global markets outside insurance comparisons)
- No equity, crypto, general finance
- Categories: Life Insurance, General Insurance, Health, Motor, IRDAI/Regulatory, Personal Lines
- Author: Prasad Chandra Kulal
- Tone: Analytical, data-driven, professional
- Blog: 300-600 words, in-depth analysis, HTML content
- News: 100-200 words, market update, sourced from media outlets
- Every item must have a "Why publish this?" justification
- If updating previous coverage, link to the prior article ID

**ID ASSIGNMENT:**
- Blogs: Next sequential BLG-XXX after highest in registry
- News: Next sequential NWS-XXX after highest in registry

### 9.3 admin-review.html Specification

**Purpose:** Standalone offline admin tool for reviewing, approving, and exporting content.

**Tech:** Pure HTML/CSS/JS, no dependencies, works offline in Chrome.

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  HEADER: "Insurance Blog — Admin Review"                │
├──────────────┬──────────────────────────────────────────┤
│ LEFT SIDEBAR │ MAIN CONTENT                             │
│              │                                          │
│ Upload 1:    │ ┌─ EXISTING CONTENT ──────────────────┐ │
│ daily-fetch  │ │ Table: ID | Title | Date | Status    │ │
│              │ │ Each row: Keep/Remove toggle          │ │
│ Upload 2:    │ └────────────────────────────────────┘ │
│ registry     │                                          │
│              │ ┌─ NEW ITEMS ─────────────────────────┐ │
│ Stats:       │ │ Card per item:                       │ │
│ X approved   │ │  - Title, Category, Type badge       │ │
│ Y rejected   │ │  - Tags                              │ │
│ Z to remove  │ │  - Summary                           │ │
│              │ │  - "Why publish this?"                │ │
│ [Export]     │ │  - "UPDATE STORY" banner (if any)    │ │
│              │ │  - "Read full draft" expand button    │ │
│              │ │  - Approve / Reject buttons           │ │
│              │ │  - Title edit field (when approved)   │ │
│              │ └────────────────────────────────────┘ │
└──────────────┴──────────────────────────────────────────┘
```

**Key Functions:**

1. **File Upload & Parsing:**
   - `daily-fetch.md` → parse markdown items using regex on `## ITEM` headings
   - `content-registry.json` → parse JSON, display existing content table

2. **Existing Content Table:**
   - Columns: ID, Title, Category, Date, Keep/Remove toggle
   - Default: all set to "Keep"
   - Remove marks item for deletion

3. **New Item Cards:**
   - Parse each `## ITEM` block from daily-fetch.md
   - Extract fields: Type, Title, Category, Tags, Summary, Why publish this, Previous Coverage, Content
   - Render as card with approve/reject buttons
   - If `Previous Coverage` field exists → show yellow "UPDATE STORY" banner with link to old article
   - "Read full draft" button expands to show full HTML content
   - When approved → show editable title field

4. **Export Functionality:**
   - Click "Export Approved Output" → generates two files:
     - `approved-content.md`: Markdown with sections "NEW CONTENT TO PUBLISH" and "REMOVE FROM SITE"
     - `updated-registry.json`: Updated content-registry.json with new items added, removed items deleted, `last_updated` set to today

5. **Export Format — `approved-content.md`:**
   ```markdown
   # Approved Content — 2026-06-04

   ## NEW CONTENT TO PUBLISH

   ### BLG-020 — [Title]
   - Type: Blog
   - Category: Life Insurance
   - Tags: LIC, FY26
   - Summary: ...
   - Previous Coverage: NWS-019

   #### Content
   <p>Full HTML content...</p>

   ---

   ## REMOVE FROM SITE
   - NWS-005 (if any were marked for removal)
   ```

6. **Export Format — `updated-registry.json`:**
   - Same structure as current `content-registry.json`
   - New items added with next sequential IDs
   - Removed items deleted
   - `last_updated` set to today's date

### 9.4 Daily Workflow (8 Steps, ~15 Min)

| Step | Action | Time |
|------|--------|------|
| 1 | Paste fetch prompt into Claude with today's date + registry | 5 min |
| 2 | Save Claude's output as `fetch-YYYY-MM-DD.md` | 1 min |
| 3 | Open `admin-review.html` in Chrome, upload both files | 1 min |
| 4 | Review existing content (Keep/Remove) | 2 min |
| 5 | Review new items (Read, Approve/Reject, edit titles) | 5 min |
| 6 | Export → 2 files download automatically | 1 min |
| 7 | Replace `content-registry.json` with exported `updated-registry.json` | 1 min |
| 8 | Feed `approved-content.md` to AI code editor to update JSON files | 2 min |

---

## 10. Deployment

### 10.1 GitHub Actions Workflow (.github/workflows/pages.yml)

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - uses: actions/deploy-pages@v6
```

**Key:** No build step. Entire repo deployed as static files.

### 10.2 Deployment Flow

1. Push to `main` branch
2. GitHub Actions triggers
3. Uploads entire repo root as artifact
4. Deploys to GitHub Pages
5. Live at `https://iamkprasad.github.io`

---

## 11. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER                               │
│                                                         │
│  index.html ──load──> script.js ──fetch──> stack-images.json │
│       │                     │                            │
│       │                     ├──fetch──> blogs.json (first 3) │
│       │                     │                            │
│       │                     └──fetch──> news.json (first 3) │
│       │                                                  │
│  blog.html ──load──> script.js ──fetch──> blogs.json     │
│       │                     │                            │
│       │                     └──render──> #blog-feed-container │
│       │                                                  │
│  news.html ──load──> script.js ──fetch──> news.json      │
│       │                     │                            │
│       │                     └──render──> #news-feed-container │
│       │                                                  │
│  post.html ──load──> script.js ──fetch──> blogs.json     │
│       │                     │         + news.json        │
│       │                     │         (Promise.all)      │
│       │                     │                            │
│       │                     └──find by ?id= or ?slug=    │
│       │                         render full article      │
│       │                                                  │
│  archives.html ──load──> script.js ──fetch──> blogs.json │
│       │                     │         + news.json        │
│       │                     │                            │
│       │                     └──merge, sort, group by month │
│       │                                                  │
│  about.html    (all hardcoded, no dynamic content)       │
│  contact.html  (mailto: form, inline script)             │
│                                                         │
│  content-registry.json (metadata only, not loaded by site) │
└─────────────────────────────────────────────────────────┘
```

---

## 12. Editorial Rules

### Content Scope
- **Indian insurance sector only** — life, general, health, motor, crop, cyber, reinsurance
- **IRDAI regulatory coverage** — circulars, exposure drafts, governance changes
- **No equity, crypto, or general finance**
- **No global markets** outside insurance comparisons

### Content Types
- **Blog:** In-depth analysis, 300-600 words, HTML content with data points
- **News:** Short market update, 100-200 words, sourced from media outlets

### Categories
| Category | Description |
|----------|-------------|
| Life Insurance | LIC, SBI Life, HDFC Life, ICICI Prudential, Bajaj Allianz, etc. |
| General Insurance | ICICI Lombard, New India Assurance, SBI General, etc. |
| Health | Standalone health insurers, health insurance trends |
| Motor | Motor insurance, third-party premiums, vehicle sales |
| IRDAI/Regulatory | IRDAI circulars, RBC framework, Ind AS 117, FDI, GST |
| Personal Lines | Crop insurance, personal accident, home insurance |

### Tone
- Analytical, data-driven, professional
- Include specific numbers (premium growth %, VNB margins, solvency ratios)
- Cite sources (Economic Times, Business Standard, IRDAI, etc.)
- Not investment advice — informational only

### Author
- **Name:** Prasad Chandra Kulal
- **LinkedIn:** https://www.linkedin.com/in/prasadkulal/
- **Email:** prasad.kulal@example.com (placeholder)

---

## 13. Key Behaviors to Implement

### Must Have
1. Dark mode toggle with localStorage persistence, defaults to light
2. Blog listing with category filter buttons and live text search
3. News listing with category filter buttons and live text search
4. Single post view with URL-based routing (?id= or ?slug=)
5. Previous coverage banner on updated articles
6. Related articles grid at bottom of posts
7. Archives page grouping content by month
8. Mobile responsive with hamburger menu
9. Cache busting on JSON fetches
10. XHR fallback for file:// protocol compatibility

### Nice to Have
11. Stacking gallery on homepage with scroll effect
12. LinkedIn and X/Twitter share buttons on posts
13. Drop cap on first paragraph of blog posts
14. Image error fallback placeholder
15. Smooth dark mode transitions on all elements

---

## 14. Notes for AI Implementation

1. **No frameworks** — Pure vanilla HTML/CSS/JS only
2. **No build step** — Files deployed as-is
3. **JSON is truth** — All content lives in JSON files, fetched at runtime
4. **CSS variables drive theming** — Never hardcode colors, always use `var(--token)`
5. **Element IDs matter** — script.js checks for specific IDs to activate page logic
6. **Filter buttons use `data-filter`** — Values must match category strings exactly
7. **Date format is ISO** — `YYYY-MM-DD` for sorting and display
8. **Tags can be string or array** — Handle both in rendering
9. **`content-registry.json` is not consumed by the site** — It's metadata for the content workflow
10. **Contact form is mailto: only** — No backend, opens email client
