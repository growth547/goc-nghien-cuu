# QA toàn trang: growth547.github.io/goc-nghien-cuu

Audit date: 2026-10-30. Read-only audit. Nothing in `src/` was changed.

**Timing caveat.** The redesign (commit `1f2a9c1`: new brand mark, forest-green palette, sticky nav with "Dữ liệu") was deployed partway through this audit. Crawl #1 and the first screenshot pass ran against the old UI. Crawl #3 and screenshot pass #2 ran against the redesign, and the findings below come from those runs unless a finding says otherwise. Some fixes are in the working tree but not deployed yet (for example the footer `{" "}`), and those are marked.

## How to re-run

```
node scripts/crawl-check.mjs > crawl.md          # full run, ~6–9 min (external links are rate-limited)
node scripts/crawl-check.mjs --no-external        # fast run, internal checks only
node scripts/crawl-check.mjs --json out.json      # also dump raw results
```

Exit 1 = at least one P0. Severity rules:

- **P0:** non-200 internal URL, missing `<title>`, invalid JSON-LD, broken internal asset, link escaping `/`, or a visible placeholder (`undefined`, `NaN`, `[object Object]`, `[tên …]`, `{{…}}`).
- **P1:** missing description, canonical or H1; multiple H1; duplicate title or description; raw entity in text; external 4xx; visible `null` (except "giả thuyết null").
- **P2:** length rules, missing alt, redirects, external 5xx or timeouts, weight above 1.5 MB.

The script does not report JS template hrefs inside `<script>` as links. Query-string variants (`?c=…`) are skipped when their canonical is the bare path. These two cases caused all the false P0s and P1s in the first run.

## 1. Crawler results

Crawl #3 ran against the redesign, at 2026-10-29T19:14Z, and took 242 s. It found 164 sitemap URLs, 365 URLs crawled in total, 181 HTML pages plus 141 `?c=` deep-link variants, and 112 external links.

- **Findings:** P0 = 0, P1 = 0, P2 = 85. Exit code 0.
- **Page weight** (HTML + CSS/JS/img, uncompressed): median 157 KB, max 468 KB (`/cong-cu/bo-khao-sat/`, 353 KB of it HTML because of the embedded scale JSON). Next heaviest: `/` at 217 KB and the EFA and chương 4 posts at 191 KB.
- **Crawl #2** (mid-deploy) gave P2 = 83, with the same categories.

### P0: none

There are no 404s, no invalid JSON-LD, no missing titles and no visible `undefined`/`NaN`/placeholders. Every page has exactly one H1, a canonical and a meta description. No `<img>` is missing `alt`.

The first run did report 2 P0s on `/cong-cu/bo-khao-sat/`: `href="${LINK}"` and `href="${REQ}${encodeURIComponent(…)}"`. These were false positives. Both strings live inside an inline `<script>` template literal. The crawler now ignores them.

### P1: none on the current deploy

On the old deploy, `/posts/` and `/posts/2/` had duplicate titles and descriptions. That was because the redirecting URLs `/posts` and `/posts/2` were also analysed, which was a crawler bug and is now fixed.

### P2 (85)

**Title > 65 chars (44).** These are almost all `/du-lieu/*`, plus `/` (68) and `/cong-cu/phan-tich-du-lieu/` (72). The worst case is `/du-lieu/chi-nhanh-ngan-hang/` at 104 chars. The template in `src/utils/dataSeries.ts` `pageTitleOf()` adds about 45 fixed chars ("Số liệu … Việt Nam qua các năm (YYYY–YYYY): tải CSV").

- **Content bug:** `/du-lieu/fdi/` has the title "Số liệu FDI vào **Việt Nam Việt Nam** …". `shortVi` in `src/content/du-lieu/fdi.json` already contains "vào Việt Nam".

**Description outside 110–170 (24).**

- 7 pages on `/du-lieu/` run 171–190 chars, from the template at `src/pages/du-lieu/[slug].astro:36`. Examples: `ty-le-tham-gia-luc-luong-lao-dong` (190), `chi-tieu-y-te-tu-tui` (189), `phat-thai-co2-binh-quan` (182).
- `/cong-cu/phan-tich-du-lieu/` is 172 chars.
- 15 tag pages are 31–46 chars ("Các bài viết thuộc chủ đề "SPSS"."), from `src/i18n/lang/vi.ts`. `/tags/` is 34 chars.
- The 102-char `/posts/2/` description from the old deploy is gone.

**Internal redirects (2).**

- `/posts` → `/posts/` (linked from `/posts/2/`)
- `/posts/2` → `/posts/2/` (linked from `/posts/`)

Pagination emits URLs without the trailing slash, from `src/components/Pagination.astro:27,37`. The cause is `trailingSlash: "ignore"` in `astro.config.ts`.

**External 5xx / timeouts (15 in crawl #3, 15 in crawl #2, 14 in crawl #1).** All of them are `data.worldbank.org/indicator/…?locations=VN` links on `/du-lieu/*`. They are **flaky, not dead**: a *different* set of indicators failed in each run (25 of 40 World Bank links returned 200 in crawl #2). The World Bank SPA throttles automated clients. These are not actionable on our side. Optionally, link to `api.worldbank.org` or accept the noise (the crawler already keeps them at P2).

**Not flagged, just observed.** The 141 `?c=<scale>:<construct>` deep links to `/cong-cu/bo-khao-sat/` all canonicalise correctly to the bare tool URL. That is correct and needs no change.

## 2. Manual review (headless Chrome, 1366×900 and 375×812, light and dark)

I could not use the built-in browser pane. `tabs_create` failed twice with "tab cap reached", and the existing tabs belong to other agents, so I did not hijack them. Instead I drove local headless Chrome over CDP (scratchpad script, not in the repo). That run used viewport emulation and `prefers-color-scheme`, plus an automated scan for horizontal overflow, WCAG contrast (every element that has its own text, against its effective background), broken images, console errors and nav links. There was no window to reset, so the "reset to desktop" step does not apply.

Automated results, 7 pages × 4 modes:

- `scrollWidth == viewport` everywhere (no horizontal overflow).
- No text below 4.5:1 (3:1 for large text) in light or dark.
- No broken images and no console errors.
- Exactly one H1 per page.
- The mobile hamburger (`aria-label="Mở menu"`) opens a full menu with 6 items plus a CTA.

### Screenshots described

**Old UI (pre-redesign, pass 1)**

- **Desktop header:** at 1366 px every nav label wrapped onto two lines ("Bài / viết", "Mẫu / bảng hỏi"). The active-page wavy underline was drawn under *both* lines.
- **Desktop breadcrumbs** were Title Case ("Thang Đo", "Dữ Liệu Thứ Cấp Việt Nam", "Bài Viết (Trang 1)").
- **Footer** read "ví dụ tớiGenius Data", with the space missing.
- **Homepage hero** said "21 thang đo gốc" while `/thang-do/` said 60.

**Redesign (pass 2)**

- **Homepage, desktop light:** two-column hero with a product mock (TAM items PU1–PU3, the "Đoạn chương 3" callout, and Word/Google Form/GDF/Excel buttons). The nav fits on one line. Clean.
- **Homepage, mobile dark:** readable. The mint CTA has dark text and the secondary button is outlined. No overflow.
- **`/thang-do/`, desktop dark:** filter input, category chips with counts, 3-column cards with accent titles. Good contrast.
- **`/khai-niem/`, mobile light:** the section header "Công nghệ & hệ thống thông tin" wraps to 2 lines and its count badge "3" floats far right, vertically centred on the 2 lines (minor). The filter placeholder is truncated ("…hài lòng, trust").
- **`/cong-cu/`, desktop light:** bento grid. On "Phân tích dữ liệu, viết chương 4" the "4" orphans onto its own line. The featured card has a large empty middle.
- **`/du-lieu/`, mobile dark:** callout box and mint CSV button are fine. The card meta line "Năm 2025: 18.088 USD PPP" is very small (about 11 px).
- **`/posts/`, mobile dark:** tag pills render "Khoá Luận", "Thang Đo" because `Card.astro` uses the CSS `capitalize` class. That casing is wrong for Vietnamese. All 6 newest posts show 30/10/2026.
- **`/mau-bang-hoi/`, desktop light:** 2-column list of 12 templates. Fine.

**Navigation gaps**

- `/khai-niem/` (25 pages) is not in the header nav or the mobile menu. It is reachable only from the homepage and `/thang-do/`.
- `Header.astro:30` maps `khai-niem` onto the "Thang đo" item for the active-state highlight. That suggests the omission is intentional, but the 25 pages still have no global entry.
- `/cong-cu/` does link to "Dữ liệu" and "Mẫu bảng hỏi" in its "Đi kèm công cụ" section, so there is no gap there.

## 3. Bugs likely fixed by the redesign (UI/component)

| # | Bug | Status |
|---|---|---|
| R1 | Nav labels wrap onto 2 lines at 1366 px; wavy active underline doubled | Fixed in the deployed redesign |
| R2 | Breadcrumb Title Case | Fixed (now "Thang đo", "Bài viết (trang 1)") |
| R3 | "tớiGenius Data" missing space | Fixed in the working tree (`Footer.astro:96` `{" "}`), **not deployed yet** |
| R4 | "Dữ liệu" missing from nav | Fixed |
| R5 | Tag pills Title-Cased ("Khoá Luận") | **Introduced** by the redesign: `src/components/Card.astro:23` `capitalize` |
| R6 | Concept section header/badge wrap on mobile; truncated placeholder | Redesign polish: `src/pages/khai-niem/index.astro` |
| R7 | Orphaned "4" in the tool card title | Redesign polish: `src/components/ToolCards.astro` (use `text-wrap: balance`) |

## 4. Content/data bugs (not touched by the redesign)

| # | Bug | File |
|---|---|---|
| C1 | "FDI vào Việt Nam Việt Nam" in the title and H1 | `src/content/du-lieu/fdi.json` (`shortVi` → "FDI") |
| C2 | Stale "21 thang đo hay dùng" (library now has 60) | `src/content/posts/hoi-dong-hoi-gi-ve-phan-khao-sat.md:21` |
| C3 | 44 titles > 65 chars | `src/utils/dataSeries.ts` `pageTitleOf()`, `src/pages/index.astro:178`, `src/pages/cong-cu/phan-tich-du-lieu.astro` |
| C4 | 8 descriptions > 170 chars | `src/pages/du-lieu/[slug].astro:36`, `src/pages/cong-cu/phan-tich-du-lieu.astro` |
| C5 | 16 tag/tag-index descriptions < 50 chars | `src/i18n/lang/vi.ts` (tag description string) |
| C6 | Pagination 301s | `src/components/Pagination.astro:27,37` or `astro.config.ts` `trailingSlash` |
| C7 | World Bank links flaky (5xx/timeout) | `src/pages/du-lieu/[slug].astro` (source link). Low priority |

## 5. Top 15 fixes, ranked by impact

1. **FDI double "Việt Nam".** Set `shortVi: "FDI"` in `src/content/du-lieu/fdi.json`. The bug is visible in the title, H1 and SERP.
2. **Shorten `/du-lieu/*` titles.** Change `src/utils/dataSeries.ts` `pageTitleOf()` to `Số liệu ${shortVi} Việt Nam ${first}–${last} (CSV)`, dropping "qua các năm" and ": tải". That fixes about 40 of the 44.
3. **Add `/khai-niem/` to nav.** It has 25 SEO landing pages with no global entry. Add it to the nav items in `src/components/Header.astro` (around line 40), or as a sub-link under "Thang đo". This is a redesign decision, so it goes to the other agent.
4. **Deploy the footer space fix.** It is already in `src/components/Footer.astro:96` but not live.
5. **Tag pill casing.** Remove `capitalize` in `src/components/Card.astro:23`. Vietnamese tags are lower-case by design.
6. **Pagination trailing slash.** Append `/` in `src/components/Pagination.astro`, or set `trailingSlash: "always"` in `astro.config.ts` (check the GitHub Pages behaviour first).
7. **Trim `/du-lieu/*` descriptions.** Drop "theo World Bank (WDI)" or the APA clause when `nameVi` is long, in `src/pages/du-lieu/[slug].astro:36`.
8. **Fix the stale "21 thang đo" claim.** Change it in `src/content/posts/hoi-dong-hoi-gi-ve-phan-khao-sat.md:21`, or use a generic "hơn 50", so it does not go stale again.
9. **Write real tag descriptions.** Use 110–160 chars that name the post count and topic, in `src/i18n/lang/vi.ts` / `src/pages/tags/[tag]/[...page].astro`.
10. **Homepage title.** Trim the 68 chars to ≤ 65 in `src/pages/index.astro:178`, for example by dropping "khoá luận".
11. **`/cong-cu/phan-tich-du-lieu/` title and description.** Trim to 65 / 170 chars in `src/pages/cong-cu/phan-tich-du-lieu.astro`.
12. **Small meta text on data cards.** The "Năm 2025: …" line on `/du-lieu/` cards renders at about 11 px. Raise it to at least 12–13 px in `src/pages/du-lieu/index.astro`.
13. **Balance card titles.** Add `text-wrap: balance` on card headings, in `src/components/ToolCards.astro` / `src/styles/global.css`, to avoid orphans like "4".
14. **`/khai-niem/` mobile section header.** Put the count badge inline with the heading text (`src/pages/khai-niem/index.astro`) and shorten the filter placeholder.
15. **Wire `scripts/crawl-check.mjs` into CI.** Run it after deploy (`--no-external` on every push, full run weekly). Optionally add a `"crawl": "node scripts/crawl-check.mjs"` script to `package.json`.

Not recommended: changing the World Bank links. The failures rotate between runs.
