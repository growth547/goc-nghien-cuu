# QA audit: /cong-cu/ tools (sample size, Cronbach's alpha, data analysis)

Date: 2026-10-30. Scope: `/cong-cu/`, `/cong-cu/tinh-co-mau/`, `/cong-cu/cronbach-alpha/`, `/cong-cu/phan-tich-du-lieu/` (questionnaire kit excluded). Sources: `src/tools/*.html`, `src/pages/cong-cu/*.astro`, `scripts/check-power.mjs`, `scripts/check-stats.mjs`. The live pages were fetched and their scripts match `src/` (whitespace differences only).

**How I tested.** The built-in browser hit its tab limit (no new tab could be opened) and the existing tabs belonged to other sessions, so I did not drive the live pages in a browser. Instead I ran each page's own `<script>` unchanged in Node 24 (same V8 engine as Chrome) with a small DOM shim, fired the real click and input handlers, and read the output HTML. Reference values came from G*Power tables, hand formulas, and an independent numpy implementation (my own alpha, KMO, Bartlett, eigen, R-style SVD varimax and OLS code). Mobile, accessibility and dark-mode findings below come from reading the markup and CSS. **I did not check them visually**, so they need a quick check on a phone before fixing.

## Correctness summary (the maths is right)

| Check | Tool | Reference | Result |
|---|---|---|---|
| G*Power, f²=.15, α=.05, power .80, m = 1/4/5/6/8/10 | 55/85/92/98/109/118 | G*Power 3.1 | match |
| f²=.02 (m=1, 5), f²=.35 (m=5), power .95 (m=5) | 395, 647, 43, 138 | G*Power | match |
| Kock & Hadaya p_min .10/.20/.30/.40 | 619/155/69/39 | Hair et al. 2022 table | match (see P1-1 on the range labels) |
| Cochran 95%, e 5%, p .5; N = 2000 | 385; 323; Slovin 334 | hand calc | match |
| Cronbach, 12×5 sample | α 0.655; CITC 0.885/0.792/0.725/0.796/−0.546; α-if-deleted 0.324/0.413/0.449/0.398/0.947 | numpy | match to 3 dp |
| Data tool on TAM sample (234 valid) | α 0.897/0.903/0.794, KMO 0.925, χ² 1873.6, 3 factors, 67.8%, loadings, r, B, SE, t, β, R² .290/.284, F 47.216, VIF 1.276 | numpy | all match to 3 dp |

`check-power.mjs` and `check-stats.mjs` both pass. No numeric discrepancies on clean data. All the bugs below are about input handling, edge cases and wording.

## P0: wrong results with no warning

**P0-1. Attitude items coded `ATT` (TPB, TAM) are dropped, and most respondents are deleted.** Steps: upload a CSV with `ATT1–ATT4, SN1–3, PBC1–3, INT1–3` (200 rows). Expected: four constructs including ATT, and no attention filter. Actual: the item regex excludes every `^ATT` column, `pt-attn` is auto-filled with `ATT1=4`, and 157 of 200 responses are removed as "trả lời sai câu kiểm tra chú ý ATT1". ATT2–ATT4 then appear as "Cơ cấu mẫu theo ATT2…" demographic tables. `ATT` is the standard code for Attitude in TPB, and the kit's own code even generates `TPB_ATT1`.

**P0-2. The analysis tool does not match the questionnaire kit's naming.** The page says to name the attention check `ATT`/`ATT1` and claims "Bộ khảo sát có sẵn bảng mã hoá theo đúng quy ước này". The kit actually names the attention check `AC1`/`ACHK` (`acCode()` in `bo-khao-sat.html`). Result: kit data runs with no attention filter, and `AC1` is reported as a demographic variable. Prefixed codes such as `TPB_ATT1` fail the grouping regex `/^[A-Za-z]+[_.]?\d+$/`. Fix this together with the kit rebuild: share one codebook and read it instead of guessing.

**P0-3. Large files crash with no message.** Steps: upload 5,000 rows × 30 items (complete data). Actual: `RangeError: Maximum call stack size exceeded` from `Math.min(...vals)` / `Math.max(...vals)` in `run()`. The button silently does nothing. The limit is about 120,000 cells, e.g. 4,000 × 30 or 3,000 × 40, which ordinary student theses do not reach. Fix: use a loop or `reduce`. Related: the missing, attention and straightlining filters use `filter(r => !bad.includes(r))`, which is O(n²) (5,000 rows with one-third missing took 1.2 s). Use a `Set`.

**P0-4. A constant (zero-variance) item produces a confidently wrong chapter 4.** Steps: set A1 = 3 in every row. Actual: Cronbach α includes A1 with CITC "—" and no warning. The EFA shows "KMO = —", Bartlett "χ² = —", an empty loading matrix, and then the text says "Tất cả biến quan sát đều có hệ số tải từ 0,5 trở lên. Không có biến tải chéo đáng kể." Expected: stop and name the constant column, as the Cronbach tool does.

## P1: important improvements

1. **Kock & Hadaya range labels do not match the published table.** The option "0,21–0,30" computes with 0.21 (→ 141), and "0,11–0,20" with 0.11 (→ 511). Hair et al. (2022) list 69 and 155 for those ranges. A reviewer comparing against the book will see a mismatch. Use single values (0,10 / 0,15 / 0,20 / 0,25 / 0,30) or the table's convention. The help text recommends "0,11–0,20", but the default is "0,21–0,30", and the "0,10" option is listed last.
2. **EFA paragraph arithmetic is wrong when there are fewer than 10 items.** With 5 items and the 10:1 checkbox on, the paragraph says "10 × 5 = 100 quan sát" because `target = max(100, 10k)`, while the result panel shows 50. Also, the result panel never reflects the checkbox. Write "max(100; 10 × k)" and show the same number in both places.
3. **The chapter-3 paragraph goes stale on invalid input.** Set m = 0 (or empty): the panel shows an error, but the old paragraph for m = 5 stays ready to copy, because `render()` returns before `renderThesis()`. Clear the paragraph whenever the panel shows an error.
4. **Non-integer m is accepted.** m = 2.5 gives "72,5 phiếu", "2.5 biến dự báo" (dot decimal) and "2.5 mũi tên". Round, or reject with a message.
5. **Singular correlation matrix (duplicate column).** The output reads "KMO = 1,000 (≥ 0,5)" with χ² "—". `invert()` returns null and the MSA terms fall back to 0. Detect this and name the near-duplicate items.
6. **Vietnamese construct codes are not grouped.** `ĐT1`, `TĐ1`, `HĐ1` and similar fail the ASCII regex ("nhận ra 1 khái niệm" for 3 constructs). Neither are Qualtrics-style `Q1_1`. Use `\p{L}` with the `u` flag and allow `_\d+` suffixes.
7. **Text Likert answers give an unexplained "Chỉ còn 0 phiếu hợp lệ".** Answers like "Đồng ý" or "Rất đồng ý" are never parsed. Detect this, say which columns are non-numeric, and offer a 1–5 mapping for the standard Vietnamese labels. The same applies to text attention answers: `ATTN=Đồng ý` is silently ignored because the regex only accepts digits. Warn when the attention column is not found.
8. **Single-item or unassigned numeric columns are reported as demographics.** For example, an `SAT1` single-item construct or `AC1` gets a "Cơ cấu mẫu theo SAT1" table. Only treat a column as demographic if it is not item-like, or let the user tick which columns are demographics. Category order is by count, so age bands come out unsorted.
9. **The CSV parser is naive.** Quoted fields containing commas (Google Forms headers are question texts such as "Bạn thấy app dễ dùng, nhanh?") split wrongly, and Excel files with merged two-row headers produce 0 constructs. Use a proper CSV parser (SheetJS is already loaded for .xlsx and parses CSV too) and add a "header row" selector.
10. **Reverse scoring uses the observed global min and max**, not the scale bounds. Correlations, alpha and EFA are unaffected, but means and construct scores shift when no one chose 1 or 5, or when 5- and 7-point items are mixed. Ask for the scale range (default 1–5). Also warn when a name in `pt-rev` is not a declared item (matching is case-sensitive).
11. **Cronbach tool input handling.**
    - Space-separated data with comma decimals ("3,5 4,0") is split on commas and shows α = −4,706 without a warning.
    - A numeric ID/STT column is silently treated as an item.
    - A timestamp column parses as 1 ("01/01/2026" → `parseFloat` = 1) and triggers the zero-variance message without naming the column.
    - Show the parsed column names, flag ID-like columns (monotonic 1..n), and name the offending column in errors.
12. **Negative item-total correlation should suggest reverse coding.** HL5 in the Cronbach tool's own sample has CITC −0.546, and the advice is only "cân nhắc loại". Add "câu này có thể là câu đảo chiều chưa đảo điểm".
13. **EFA runs on independent and dependent items together.** Most Vietnamese advisors expect a separate EFA for the dependent variable. Offer a "tách EFA biến phụ thuộc" option. Also add the "Total Variance Explained" table (eigenvalue, % variance, cumulative %); the page copy says eigenvalues are reported, but only the smallest retained one is.
14. **Mobile layout (from markup, not checked on a device).** `.pt-report table` is `width:100%` with no scroll wrapper. The 7-column regression table and wide EFA matrices will overflow at 375 px. The Cronbach tool uses `.table-wrap`; reuse it here.
15. **Keyboard access to file upload.** The file input is `hidden` inside a styled `<label>`, so it cannot be reached by Tab, which means keyboard users cannot upload. Use a visually-hidden (not `hidden`) input or a real button. `pt-status` has no `aria-live`, and errors such as "quá ít để phân tích" appear at the top of the page, possibly off-screen, while the old report stays visible.
16. **Performance in the sample-size tool.** `regN` is a linear search that recomputes on every keystroke: 250 ms for f² = 0,02, 1.3 s for m = 40 with α 1% and power .95, and 4.5 s for m = 200 (`max="40"` is not enforced). Use bisection on n and debounce input.

## P2: polish

- Inconsistent numbers between the panel and the paragraph: "power = 0,8" vs "0,80"; "α = 5%" vs "0,05". Cochran working shows "0,5·0,50".
- Typing e = 0.05 (meaning 5%) gives n = 3,841,600 and a cost of "15846,6 triệu đ" with no thousands separator and no "tỷ". Warn when e < 1.
- Cronbach's α "—" (when the total variance is 0) still gets the verdict "Thấp".
- Negative adjusted R² would read "giải thích −0,9% biến thiên". Say "không giải thích được" instead.
- Thousands separator missing in χ² (1873,6 → 1.873,6) while counts use "2.000".
- Word export:
  - Captions are "Bảng: …" with no numbers (should be "Bảng 4.1", "4.2" and so on).
  - No `Kaiser (1958)` reference for Varimax, although the page cites it.
  - The regression table leaves SE, t and Sig. of the constant blank (SPSS reports them).
  - Table cell alignment and the red flagging are lost in Word. Rows flagged red on screen give no indication in Word.
  - The `.doc` file is HTML (`application/msword`); some Word versions show a format warning. Consider real `.docx`.
- The hard-coded `.bad{color:#c0392b}` is likely low-contrast in dark mode. Use a theme token.
- `ss-out` is `aria-live` and updates on every keystroke, so screen readers re-announce constantly.
- The copy button in the data tool has no failure fallback; the sample-size tool has one.
- The Cronbach tool lacks SPSS's "Scale Mean/Variance if Item Deleted" columns, which students copy as a full table. It also has no copyable paragraph, unlike the other tools.
- Index page: a bare grid. Add one line per tool on "dùng khi nào" (which tool to use when) and the order of the workflow (cỡ mẫu → bảng hỏi → Cronbach → phân tích).

## What's missing for students (prioritised by demand)

1. **Descriptive statistics table** (mean, SD, min, max per item and construct, plus skewness and kurtosis). Almost every Vietnamese chapter 4 has it. It is cheap to add because the means already exist.
2. **Independent t-test and one-way ANOVA (with Levene, Welch, and Tamhane or Bonferroni post-hoc)** by gender, age and income on the DV. This is the standard "kiểm định khác biệt" section 4.6 in nearly every SPSS thesis. Demographic columns are already detected.
3. **Regression assumptions:** Durbin–Watson, histogram and P-P plot or residual normality, scatter of standardized residuals, plus hypothesis-supported tables (H1… chấp nhận/bác bỏ). Advisors routinely ask for these.
4. **Reliability and validity for PLS/CB-SEM users:** composite reliability (CR, rho_A), AVE, Fornell–Larcker, HTMT and outer loadings. Students using SmartPLS want a second opinion, and HTMT and CR/AVE can be computed from correlations and loadings without full SEM.
5. **Mediation (Hayes PROCESS Model 4 style, with a bootstrap CI for the indirect effect).** The sample TAM model (PEOU → PU → BI) is itself a mediation model, but the tool only runs one flat regression.
6. **Separate EFA runs and iterative item deletion** (rerun after dropping flagged items) with an audit trail sentence for chapter 4.
7. **Normality and outlier screening** (Mahalanobis distance, ±3 SD, skewness/kurtosis within ±2).
8. **Multi-scale Cronbach in the standalone tool,** or a pointer telling users that the data tool already does this.
9. Later: CFA fit indices (CMIN/df, CFI, TLI, RMSEA) via a light ML estimator. This is high value but the most work and the biggest risk of shipping wrong numbers.

Rationale: items 1–3 cover the SPSS chapter-4 template that most bachelor's theses follow, so they bring the most users for the least risk. Item 4 covers the fast-growing SmartPLS group. Items 5–9 are needed by master's students.
