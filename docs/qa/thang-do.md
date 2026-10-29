# QA audit: thư viện thang đo (/thang-do/)

Date: 2026-10-30. Scope: index + 60 live pages at https://growth547.github.io/goc-nghien-cuu/thang-do/, `src/content/thang-do/*.json`, `src/pages/thang-do/[slug].astro`.

Method: scripted crawl of all 60 pages and 145 internal links; scan of rendered `<main>` for leftover entities and placeholders; H2 and title/description extraction; automated JSON checks (item count in `source` against the actual items, reverse flags against negatively worded items, author/year in `source` against `references`, sample-size numbers against the f² = 0.15 power table); every reference DOI resolved through Crossref/DataCite; manual read of all 816 EN/VI item pairs; a mobile (375 px) render of `kiet-suc-cbi`.

What passed:
- All 60 pages and every internal link return 200, except the RSS link (P0-1).
- There are no leftover `&amp;` or other raw entities and no placeholder text.
- Every DOI resolves to the cited work, with matching year and authors.
- Item counts match `source` on every page. The two flagged pages are explained in their own `source` text: OCBI has 7/8 items, and PBC lists Box items 1, 2, 4, 5.
- Reverse flags are correct on every page I could check against the source: OCQ, PSS-10, PSQ-18, Rosenberg, BRS, BSCS, BFI-10, SERVQUAL, Babin, Rook & Fisher, Lichtenstein, POS and TPB.
- Sample-size numbers (68/77/85/103) are correct.
- I found no translation that changes an item's meaning.

## Summary

| Page (slug) | P0 | P1 | P2 |
|---|---|---|---|
| ALL 60 pages (template-level) | 2 | 1 | 4 |
| lanh-dao-chuyen-doi-glts | 2 | 0 | 1 |
| utaut2 | 1 | 1 | 0 |
| lanh-dao-phuc-vu | 1 | 0 | 1 |
| y-dinh-mua | 2 | 0 | 0 |
| cang-thang-pss-10 | 2 | 1 | 0 |
| tu-trong-rosenberg | 2 | 1 | 0 |
| kiet-suc-cbi | 2 | 0 | 0 |
| hai-long-cong-viec | 2 | 0 | 1 |
| 20 other pages with an unusable "Thang trả lời" card (list in P0-3) | 1 each | – | – |
| hanh-vi-cong-dan-to-chuc, mua-hang-ngau-hung | 0 | 1 | 1 |
| niem-tin-trung-thanh-thuong-hieu, cam-ket-to-chuc-ocq, co-don-ucla-3, gia-tri-cam-nhan-perval, gia-tri-mua-sam-khoai-lac-thuc-dung, lmx-7, marketing-mang-xa-hoi, tu-hieu-qua-gse, webqual | 0 | 1 | 0–1 |
| tam, tpb, utaut, ecm, servqual, servperf, dass-21, phq-9, gad-7, hai-long-cuoc-song-swls | 0 | 1 (depth) | 0–1 |

## P0: wrong or broken

**P0-1. The RSS link returns 404 on every page (site-wide).** The `<link rel="alternate">` points to `https://growth547.github.io/goc-nghien-cuu/rss.xml/`, which returns 404. The same path without the trailing slash returns 200. The cause is that `getRelativeLocaleUrl(…, "rss.xml")` adds the trailing slash.
File: `src/layouts/Layout.astro` lines 42–45 and 93. Change:
```astro
const rssHref = getAssetPath("rss.xml");   // same helper already used for sitemap-index.xml
...
href={new URL(rssHref, Astro.site)}
```

**P0-2. The `(R)` recoding note gives the wrong formula for scales that do not run 1–5 or 1–7.** The template says "thang 5 mức → 6 − điểm; 7 mức → 8 − điểm" on every page that has reverse items. That formula gives the wrong result on these pages:
- PSS-10 runs 0–4, so the recode is 4 − x. Applying "6 − x" makes 0 into 6.
- Rosenberg runs 0–3 (or 1–4).
- CBI is scored 0–100.
- The MOAQ job-satisfaction scale is often given as 6 points (1–6), so the recode is 7 − x.

Students copy this note into their coding plans.
File: `src/pages/thang-do/[slug].astro`, the `hasReverse &&` block. Replace it with:
```astro
<p class="text-sm">(R): câu đảo chiều. Điểm mới = (mức thấp nhất + mức cao nhất) − điểm trả lời:
thang 1–5 → 6 − điểm; 1–7 → 8 − điểm; 1–6 → 7 − điểm; 0–4 → 4 − điểm; 0–3 → 3 − điểm.
Luôn theo cách chấm ở mục "Thang trả lời" của trang này.</p>
```
A better long-term fix is an optional `reverseRule` string in the schema (`src/content.config.ts`) that each JSON can set.

**P0-3. The "Thang trả lời" stat card renders a whole paragraph, or cuts it off mid-sentence, on 27 pages.** The card uses `d.responseScale.split("(")[0]`. On `kiet-suc-cbi` at 375 px the card is 352 characters tall. On `tu-trong-rosenberg` it is cut to "Thang 4 mức đồng ý, không có điểm giữa: Rất đồng ý", which reads as if the scale were a single level.

Fix: add `responseScaleShort: z.string().max(28)` to the schema and render `{d.responseScaleShort}`. Values to add:

| Page | Value |
|---|---|
| cang-thang-pss-10 | `Tần suất 0–4` |
| chanh-niem-maas | `Tần suất 1–6` |
| chat-luong-dich-vu-y-te | `Likert 5 mức` |
| co-don-ucla-3 | `Tần suất 1–3` |
| dass-21 | `Mức độ 0–3` |
| dong-luc-hoc-tap-mslq | `Mức độ đúng 1–7` |
| dong-luc-lam-viec-mwms | `Mức độ đúng 1–7` |
| ecm-tiep-tuc-su-dung | `Likert/đối nghĩa 7 mức` |
| fomo | `Mức độ đúng 1–5` |
| gad-7 | `Tần suất 0–3` |
| phq-9 | `Tần suất 0–3` |
| gan-ket-cong-viec-uwes | `Tần suất 0–6` |
| hai-long-cong-viec | `Likert 6–7 mức` |
| ho-tro-xa-hoi-mspss | `Likert 7 mức` |
| kiet-suc-cbi | `Tần suất/mức độ, 0–100` |
| lanh-dao-chuyen-doi-glts | `Tần suất 1–5` |
| nghien-mang-xa-hoi-bsmas | `Tần suất 1–5` |
| lanh-dao-phuc-vu | `Likert 5 hoặc 7 mức` |
| tinh-cach-bfi-10 | `Likert 5 mức` |
| tpb | `Đối nghĩa + Likert 7 mức` |
| tu-hieu-qua-gse | `Mức độ đúng 1–4` |
| tu-kiem-soat-bscs | `Giống tôi 1–5` |
| tu-trong-rosenberg | `Đồng ý 4 mức (0–3)` |
| utaut | `Likert 7 mức` |
| y-dinh-mua | `7 mức (khả năng/đồng ý)` |
| y-dinh-nghi-viec | `Likert/khả năng 7 mức` |

**P0-4. Some item wording comes from sources that are not in the reference list.** A student cannot cite these items correctly. Add each reference after opening the source; the exact URLs are already in `verifiedFrom` or `source`.
- `lanh-dao-chuyen-doi-glts.json`: `source` cites Kloutsiniotis et al. (wording for TL1–TL6) and Saif et al. (wording for TL7), and `responseScale` cites Hendrikx et al. None of the three is in `references`. The full texts are the Europe PMC IDs listed in `verifiedFrom` (PMC8776468, PMC11200340, PMC9222929, PMC13445784). Add an APA entry for each, or remove the attribution.
- `lanh-dao-phuc-vu.json`: `source` cites "Wang, Kang & Choi (2021)", which is not in `references`. Add the full APA entry from the paper whose appendix was used. It is not recorded in `verifiedFrom`, so record that URL too.
- `utaut2.json`: HM, PV and HT are "adapted from" Kim et al. (2005), Dodds et al. (1991) and Limayem & Hirt (2003). None of the three is referenced. Add these:
  - `Dodds, W. B., Monroe, K. B., &amp; Grewal, D. (1991). Effects of price, brand, and store information on buyers' product evaluations. <em>Journal of Marketing Research, 28</em>(3), 307–319. https://doi.org/10.1177/002224379102800305` (DOI verified)
  - Kim, Chan & Gupta (2005) and Limayem & Hirt (2003): copy their entries from the reference list of Venkatesh et al. (2012), https://doi.org/10.2307/41410412.
- `y-dinh-mua.json`: the PV `source` cites "Li & Green, Journal of Management and Marketing Research" with no year and no reference entry. The URL is in `verifiedFrom` (http://www.aabri.com/manuscripts/10627.pdf). Add a full APA entry with its year, and put the year in `source`.

## P1: important content missing

**P1-1 (all pages): depth.** The pages share one fixed structure: intro, items, usage, sample size, license, references. They give none of the following:
- reliability values reported in the literature
- the model's paths
- Vietnamese validation studies
- the questions examiners usually ask
- which constructs the scale is typically paired with

The thinnest pages, measured as intro plus usage text in characters, are tam (959), su-thich-thu-cam-nhan, hai-long-cuoc-song-swls, tu-trong-rosenberg, chanh-niem-maas, nghien-dien-thoai-sas-sv, truyen-mieng-dien-tu-ewom, hai-long-cong-viec, tu-hieu-qua-gse and y-thuc-ve-gia. TAM, the most-searched scale, is the thinnest page.

Proposed schema additions (optional fields) in `src/content.config.ts`, each rendered as its own H2 in `[slug].astro`:
```ts
model: z.object({ paths: z.array(z.string()), source: z.string() }).optional(),
reliability: z.array(z.object({ construct: z.string(), alpha: z.string(), sample: z.string(), source: z.string() })).optional(),
vietnam: z.array(z.object({ ref: z.string(), note: z.string() })).optional(),
examinerQuestions: z.array(z.object({ q: z.string(), a: z.string() })).optional(), // also emit FAQPage JSON-LD
```
Content to add. I checked every DOI below on Crossref. Any reliability value must be copied from the cited table before publishing; I have not copied numbers here.
- **tam**:
  - Paths, from Davis, Bagozzi & Warshaw (1989), https://doi.org/10.1287/mnsc.35.8.982: PEOU → PU; PEOU → A; PU → A; PU → BI; A → BI; BI → actual use. Most later studies drop A.
  - Meta-analytic path strengths and reliabilities: King & He (2006), *Information & Management, 43*(6), 740–755, https://doi.org/10.1016/j.im.2006.05.003.
  - Original alphas for PU/PEOU: Davis (1989), Study 1/2 tables.
  - Also add the DOI to the existing Davis, Bagozzi & Warshaw 1989 reference.
- **utaut2**:
  - Meta-analytic paths: Tamilmani et al. (2021), *Information Systems Frontiers, 23*, 987–1005, https://doi.org/10.1007/s10796-020-10007-6.
  - Moderators: age, gender and experience on FC, HM, PV, HT → BI. Add a note that each moderator adds interaction arrows, which raises the sample-size requirement.
- **utaut**: add the moderators (gender, age, experience, voluntariness) to the sample-size note, with the same interaction-arrow caveat.
- **tpb**:
  - Paths: ATT, SN, PBC → INT; PBC → behaviour.
  - Meta-analysis: Armitage & Conner (2001), *British Journal of Social Psychology, 40*(4), 471–499, https://doi.org/10.1348/014466601164939.
- **gad-7**: general-population norms and reliability from Löwe et al. (2008), *Medical Care, 46*(3), 266–274, https://doi.org/10.1097/MLR.0b013e318160d093.
- **cang-thang-pss-10**: reliability across studies from Lee (2012), *Asian Nursing Research, 6*(4), 121–127, https://doi.org/10.1016/j.anr.2012.08.004.
- **tu-trong-rosenberg**: reliability and factor structure in 53 nations from Schmitt & Allik (2005), *JPSP, 89*(4), 623–642, https://doi.org/10.1037/0022-3514.89.4.623. This is also the answer to the examiner question "is the scale 1-factor or 2-factor (method effect of the negative items)?".
- **hai-long-cuoc-song-swls**: review and norms from Pavot & Diener (1993), *Psychological Assessment, 5*(2), 164–172, https://doi.org/10.1037/1040-3590.5.2.164.
- **dass-21, phq-9, ho-tro-xa-hoi-mspss**: these pages already cite Vietnamese validations (Tran et al., 2013; Vu et al., 2022; Kieu et al., 2023), but only inside the reference list. Surface them in a "Bản tiếng Việt đã kiểm định" section that gives the sample and the reported alpha or cut-off from each paper.
- **All SEM/PLS pages** (tam, utaut, utaut2, tpb, ecm, tai-san-thuong-hieu, marketing-mang-xa-hoi, chat-luong-he-thong-thong-tin, webqual, y-dinh-mua, niem-tin-trung-thanh-thuong-hieu): add two standard examiner Q&As.
  - "Kiểm tra giá trị phân biệt thế nào?": HTMT < 0.85/0.90, from Henseler, Ringle & Sarstedt (2015), *JAMS, 43*, 115–135, https://doi.org/10.1007/s11747-014-0403-8.
  - "Cỡ mẫu tối thiểu cho PLS-SEM?": the inverse square-root method, from Kock & Hadaya (2018), *Information Systems Journal, 28*(1), 227–261, https://doi.org/10.1111/isj.12131. This complements the existing f²-based note.

**P1-2. Some text cites a work that is not in `references`.**
- Add a reference entry for each of these citations:
  - `niem-tin-trung-thanh-thuong-hieu.json`: the usage text cites "Yoo & Donthu, 2001". Add the reference: https://doi.org/10.1016/S0148-2963(99)00098-3.
  - `co-don-ucla-3.json`: cites Russell, Peplau & Cutrona (1980).
  - `gia-tri-cam-nhan-perval.json`: cites Petrick (2002).
  - `gia-tri-mua-sam-khoai-lac-thuc-dung.json`: cites Rook & Fisher (1995). Copy the reference from `mua-hang-ngau-hung.json`.
  - `lmx-7.json`: cites Liden & Maslyn (1998).
  - `marketing-mang-xa-hoi.json`: cites Godey et al. (2016).
  - `tu-hieu-qua-gse.json`: cites Chen, Gully & Eden (2001).
  - `cam-ket-to-chuc-ocq.json`: cites Meyer & Allen.
- `webqual.json` mentions Loiacono et al. (2007) and Barnes & Vidgen (2002). Either add both references or drop the years.

**P1-3. `mua-hang-ngau-hung.json`: the source note is vague.** The note says wording was checked against "các bài trên PubMed Central". Name the specific papers with their DOIs, or remove the phrase.

**P1-4. `hanh-vi-cong-dan-to-chuc.json`: OCBI has 7 of its 8 items.** The page says the 8th item could not be checked against the original. Get the original appendix of Lee & Allen (2002), https://doi.org/10.1037/0021-9010.87.1.131, add the 8th item, and update the `source` text.

**P1-5. `hai-long-cong-viec.json`: one claim has no source.** The 6-point "Paul Spector archive" version is cited with no URL or reference. Add the archive URL to `references` and `verifiedFrom`.

## P2: polish

1. **H2 headings are generic on all 60 pages** ("Các khái niệm và biến quan sát", …) and never contain the scale name. Change the first H2 in the template to `Biến quan sát thang đo {d.name} (tiếng Việt và bản gốc)`. The `keyword` field exists in every JSON but is never rendered.
2. **Titles do not match what students search.**
   - 19 titles lack "tiếng Việt": bat-an-viec-lam, can-bang-cong-viec-cuoc-song, chat-luong-dich-vu-ngan-hang, chat-luong-dich-vu-y-te, chat-luong-he-thong-thong-tin, ecm-tiep-tuc-su-dung, gia-tri-mua-sam-khoai-lac-thuc-dung, hanh-vi-cong-dan-to-chuc, hieu-qua-cong-viec, lanh-dao-chuyen-doi-glts, marketing-mang-xa-hoi, niem-tin-thuong-mai-dien-tu, niem-tin-trung-thanh-thuong-hieu, phu-hop-ca-nhan-to-chuc, su-thich-thu-cam-nhan, thai-do-voi-quang-cao, truyen-mieng-dien-tu-ewom, webqual, y-dinh-hanh-vi-khach-hang.
   - 13 titles do not contain their own `keyword`: chat-luong-dich-vu-y-te, chat-luong-he-thong-thong-tin, co-don-ucla-3, do-tin-cay-nguon-ohanian, gia-tri-cam-nhan-perval, gia-tri-mua-sam-khoai-lac-thuc-dung, hoi-phuc-brs, marketing-mang-xa-hoi, niem-tin-trung-thanh-thuong-hieu, phu-hop-ca-nhan-to-chuc, tinh-cach-bfi-10, truyen-mieng-dien-tu-ewom, webqual.
   - 19 descriptions lack "biến quan sát".
   - Pattern to use, within 70 characters: `Thang đo {keyword} tiếng Việt: {n} biến quan sát, {author} ({year})`. Add a schema check that `title` contains `keyword`.
3. **The breadcrumb shows the raw slug** ("Thang Đo » kiet-suc-cbi"). File: `src/components/Breadcrumb.astro`. Accept a `current` prop and pass `d.name` from `[slug].astro`. Also check the CSS capitalisation that turns "Thang đo" into "Thang Đo".
4. **Item tables are cramped on mobile.** At 375 px the columns render 45/138/158 px, so the Vietnamese column (the one students copy) is the narrowest. Under `sm:`, put the English text under the Vietnamese in the same cell (`<span class="block sm:hidden">`) and hide the third column.
5. **`webqual` slug with SITEQUAL content.** The slug is `webqual` but the page is SITEQUAL. Its usage text also exposes an internal note ("Tên slug là 'webqual'…"). Rename the slug to `sitequal` with a redirect, and reword the note for readers.
6. **APA consistency.**
   - The MOAQ author is "Jenkins, D." in the 1979 entry but "Jenkins, G. D." in the 1983 entry (hai-long-cong-viec, y-dinh-nghi-viec).
   - Add missing DOIs: Davis, Bagozzi & Warshaw 1989 in tam and utaut (10.1287/mnsc.35.8.982), and Porter et al. 1974 in cam-ket-to-chuc-ocq (10.1037/h0037335).
   - Add missing pages: Cohen & Williamson 1988, pp. 31–67, in cang-thang-pss-10.
7. **Grit-S is a draft that never publishes.** `_grit-s.json` is excluded by the loader glob `[^_]*.json`. It looks complete and its reverse items (1, 3, 5, 6) are correct, so either publish it or log it as a draft.
8. **Small wording fix.** In `hanh-vi-cong-dan-to-chuc.json`, OCBI1 reads "Tôi giúp đỡ những đồng nghiệp đã nghỉ vắng", which is ambiguous. Change it to "Tôi giúp đỡ (làm thay) phần việc của đồng nghiệp vắng mặt."

Crawl scripts and raw output: in the audit session scratchpad, not committed.
