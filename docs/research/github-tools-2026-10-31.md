# Dò GitHub: công cụ SEO, GEO và traffic cho Góc Nghiên Cứu (31/10/2026)

Cách dò: GitHub REST API `search/repositories` (không token), topic `seo`, `llms-txt`, `generative-engine-optimization`, `structured-data`, `schema-org`, `lighthouse`, `og-image`, `astro-integration`, `internal-linking`, `indexnow`, lọc repo có push sau 01/07/2026, sắp theo sao; thêm truy vấn repo tạo sau 04–06/2026 có nhiều sao. README đọc qua raw.githubusercontent.com. Số sao và ngày push lấy lúc 31/10/2026. "Commit gần nhất" là `pushed_at` của API.

Đã đối chiếu với `docs/GEO_PLAYBOOK.md` và `docs/research/doi-chieu-cong-cu-quoc-te.md` để không lặp: site đã có `llms.txt` + `llms-full.txt` sinh từ collections, robots.txt cho từng bot AI, JSON-LD (BlogPosting, FAQPage, DefinedTermSet, Dataset, DataCatalog, WebApplication), sitemap, IndexNow chạy tay, `check-seo.mjs` trong CI. Đây là đợt dò GitHub đầu tiên (chưa có `github-tools-*.md` trước đó).

Lưu ý chung: rất nhiều repo GEO mới (2026) là "skill cho agent" hoặc nền tảng theo dõi trả phí đội lốt mã nguồn mở; số sao tăng nhanh nhưng phần lõi thường chỉ là checklist. Không repo nào chứng minh được "làm X thì được ChatGPT trích". Google vẫn ghi rõ AI Overviews/AI Mode không cần file hay schema riêng.

## 1. Repo đáng chú ý

| # | Repo | Sao | Push gần nhất | Giấy phép | Làm gì | Hợp site tĩnh? | Công sức | Rủi ro |
|---|---|---|---|---|---|---|---|---|
| 1 | [jdevalk/specification.website](https://github.com/jdevalk/specification.website) | 918 | 30/10/2026 | Mã MIT, nội dung CC BY 4.0 | "Đặc tả website" của Joost de Valk (Yoast): từ `<title>` tới `/.well-known/`, có nhóm **Agent Readiness**, mỗi mục có nguồn và mức Required/Recommended/Optional/Avoid; có MCP server | Có, là checklist, không cài gì | Thấp (đọc, đối chiếu) | Không; chỉ là tài liệu |
| 2 | [jdevalk/seo-graph](https://github.com/jdevalk/seo-graph) | 50 | 21/09/2026 | MIT | Builder JSON-LD dạng `@graph` liên kết bằng `@id` (WebSite, WebPage, Article, BreadcrumbList…) + integration Astro (`<Seo>`, route cho endpoint "agent-ready") | Có | Trung bình (thay `src/utils/jsonLd.ts`) | Site đã có builder tự viết chạy tốt; đổi sang gói ngoài lợi ít |
| 3 | [google/schema-dts](https://github.com/google/schema-dts) | 1.254 | 02/10/2026 | Apache-2.0 | Kiểu TypeScript cho toàn bộ schema.org | Có (chỉ là devDependency kiểu) | Thấp | Gần như không; bắt lỗi chính tả property lúc `astro check` |
| 4 | [cucuwang/geoptimize](https://github.com/cucuwang/geoptimize) | 263 | 31/10/2026 | MIT | Lint nội dung tất định cho thư mục `dist`: cấu trúc, "citability" (số liệu có nguồn không), JSON-LD, noindex/canonical, lặp từ; có GitHub Action ngưỡng điểm. Tự nói rõ không dự đoán được việc AI trích | Có, chạy trên `dist` | Thấp (1 bước CI, chế độ cảnh báo) | Heuristic tiếng Anh, có thể báo sai với tiếng Việt; cần cài npm |
| 5 | [Auriti-Labs/geo-optimizer-skill](https://github.com/Auriti-Labs/geo-optimizer-skill) | 1.240 | 30/10/2026 | MIT | CLI Python `geo audit` chấm 0–100 khả năng ChatGPT/Perplexity/AI Overviews thu thập và trích; kiểm 27 crawler AI, 47 mục nội dung; có GitHub Action, MCP, integration Astro | Có (chạy ngoài, `uvx`) | Thấp nếu chỉ chạy audit một lần | Gắn với dịch vụ GeoReady; điểm số là heuristic tự đặt |
| 6 | [dodopayments/dualmark](https://github.com/dodopayments/dualmark) | 121 | 15/09/2026 | Apache-2.0 | Mỗi trang có "bản sao Markdown" (`/blog/<slug>.md`), header `Link rel=alternate type=text/markdown`, sinh `llms.txt`; có integration Astro | Một phần: GitHub Pages không đổi header và không content negotiation, chỉ phát được file `.md` tĩnh | Trung bình | Bài viết của site viết bằng HTML trong file `.md`, cần chuyển HTML→Markdown; lợi ích GEO chưa được chứng minh |
| 7 | [bojieyang/indexnow-action](https://github.com/bojieyang/indexnow-action) | 64 | 18/10/2026 | MIT | GitHub Action đọc sitemap, gửi URL lên IndexNow (Bing, Yandex, Seznam…) theo lịch | Có | Thấp | Gửi lại toàn bộ URL nếu cấu hình không lọc theo `lastmod` |
| 8 | [velohost/astro-indexnow](https://github.com/velohost/astro-indexnow) | 15 | 08/07/2026 | MIT | Integration Astro gửi mọi trang lên IndexNow lúc build | Có | Thấp | Gửi lúc build, trước khi trang thật sự lên mạng; README trống |
| 9 | [MrLouisWright/orphan-beacon](https://github.com/MrLouisWright/orphan-beacon) | 1 | 20/10/2026 | MIT | Dựng đồ thị link nội bộ từ HTML đã build: trang mồ côi, độ sâu click từ trang chủ, trang chỉ có 1 link vào; 0 dependency, có GitHub Action | Có, đúng loại site này (Astro tĩnh) | Thấp | Repo mới, 1 sao; nên chạy thử thủ công trước |
| 10 | [GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci) | 7.121 | 31/10/2026 | Apache-2.0 | Chạy Lighthouse mỗi commit, chặn khi điểm tụt | Có | Trung bình (thêm job, Chrome trong CI) | CI chậm thêm 1–3 phút; deploy mỗi giờ nên chỉ chạy vài URL mẫu |
| 11 | [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | 3.014 | 24/08/2026 | MIT | Agent Skills đo trước rồi sửa: Lighthouse, Core Web Vitals (CrUX + lab), WCAG 2.2, SEO | Có (dùng cho phiên agent bảo trì) | Thấp | Không cài vào site; chỉ là hướng dẫn cho agent |
| 12 | [kane50613/takumi](https://github.com/kane50613/takumi) | 3.163 | 31/10/2026 | MIT / Apache-2.0 | Engine Rust dựng ảnh OG từ JSX/HTML/CSS không cần trình duyệt; thay thế satori + sharp, có [astro-takumi](https://github.com/vikas5914/astro-takumi) (GPL-3.0) | Có | Trung bình | Site đã có OG động bằng satori; chỉ đáng đổi nếu build OG chậm |
| 13 | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | 24.563 | 22/10/2026 | MIT | Skill SEO cho Claude Code: 26 skill con (audit kỹ thuật, schema, nội dung, GEO) | Có (cho agent) | Thấp | Nhiều lời khuyên chung chung; phải lọc theo GEO_PLAYBOOK |
| 14 | [limelit-co/open](https://github.com/limelit-co/open) | 248 | 30/10/2026 | Apache-2.0 | Tự host, theo dõi ChatGPT/Claude/Perplexity/Gemini/AI Overviews có nhắc và trích site mình không theo bộ câu hỏi cố định; một binary Go, có MCP | Chạy ngoài site | Trung bình (cần máy chạy và API key các mô hình, tốn phí) | Pre-release; chi phí API theo số câu hỏi |
| 15 | [mlcommons/croissant](https://github.com/mlcommons/croissant) | 916 | 05/10/2026 | Apache-2.0 | Chuẩn metadata dataset xây trên schema.org `Dataset` (Hugging Face, Kaggle, Google Dataset Search dùng) | Một phần: áp được cho trang `/du-lieu/` | Trung bình | Thiên về dataset ML; chỉ lấy vài thuộc tính (`distribution`, `recordSet` không cần) |

Thêm để tham khảo, không đề xuất: [every-app/open-seo](https://github.com/every-app/open-seo) (25.786 sao, MIT, thay Semrush/Ahrefs, cần API trả phí DataForSEO), [thedaviddias/llms-txt-hub](https://github.com/thedaviddias/llms-txt-hub) (921 sao, danh bạ site có llms.txt; có thể gửi site vào để thêm một backlink, cần chủ site tự gửi PR), [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (57.529 sao, skill marketing chung).

## 2. Mẹo SEO/GEO mới đáng làm theo

1. **`lastmod` phải đúng, không phải "lúc build".** Google chỉ dùng `lastmod` khi nó "nhất quán và kiểm chứng được"; Bing dựa vào nó nhiều hơn. Site deploy mỗi giờ (tác vụ thang đo) nên trước đây mọi trang không phải bài viết đều báo vừa đổi, khiến máy tìm kiếm có thể bỏ qua `lastmod` của cả site. **Đã sửa trong lượt này** (mục 4).
2. **IndexNow chỉ cho URL vừa đổi, chạy sau khi deploy xong.** Cả indexnow-action và astro-indexnow đều phổ biến; ChatGPT search và Copilot dựa nhiều vào chỉ mục Bing, nên trang mới được Bing biết sớm là đường ngắn nhất tới trích dẫn AI. Có `lastmod` đúng rồi thì lọc được URL đổi.
3. **Đo bằng công cụ tất định, không tin "điểm GEO".** Repo nghiêm túc nhất (geoptimize) tự loại llms.txt và FAQ schema khỏi điểm vì chưa có bằng chứng, và chỉ dùng điểm để bắt hồi quy trong cùng site. Nên áp đúng tinh thần đó: số liệu có nguồn, câu trả lời đầu trang, canonical/noindex đúng (đã có trong GEO_PLAYBOOK).
4. **Liên kết nội bộ và độ sâu click.** Site có ~440 URL trong sitemap, phần lớn là trang thang đo/khái niệm/dữ liệu sinh tự động; trang chỉ có trong sitemap mà không ai link tới thì ít được crawl. orphan-beacon kiểm được ngay trên `dist`.
5. **JSON-LD dạng đồ thị có `@id`.** Xu hướng 2026 (seo-graph, specification.website) là nối WebSite → WebPage → Article → Organization bằng `@id` thay vì nhiều khối rời. Site đang in nhiều khối riêng; nối `@id` cho Organization/WebSite là việc nhỏ, không cần gói.
6. **Bản Markdown sạch của trang (llmstxt.org khuyến nghị `URL.md`).** Đáng làm khi có cách chuyển HTML bài viết sang Markdown; trên GitHub Pages chỉ phát được file `.md` tĩnh, không content negotiation. Ưu tiên thấp hơn 1–4.
7. **Theo dõi trích dẫn AI theo bộ câu hỏi cố định** (limelit/open hoặc làm tay 10–20 câu như GEO_PLAYBOOK đã ghi). Không có số đo này thì không biết mẹo GEO nào có tác dụng.

## 3. Đã áp dụng trong lượt này

`lastmod` trong sitemap lấy từ lịch sử git (`astro.config.ts`), không cần gói mới:

- Trang `/thang-do/`, `/khai-niem/`, `/mau-bang-hoi/`, `/du-lieu/`, `/bien-nghien-cuu/` và từng trang con: ngày commit gần nhất chạm file JSON của trang; trang hub lấy ngày mới nhất của thư mục.
- Bài viết: giữ `modDatetime`/`pubDatetime`.
- Trang còn lại (công cụ, trang chủ…): ngày commit gần nhất chạm mã/giao diện (bỏ qua `src/content` và `docs`).
- Không có lịch sử git (clone nông, file chưa commit): dùng ngày build như cũ.
- `.github/workflows/deploy.yml`: `actions/checkout` thêm `fetch-depth: 0` để CI có đủ lịch sử.

Kiểm tra: build bản sao tạm 473 trang, `check-seo` 0 lỗi 0 cảnh báo; sitemap ra nhiều mốc ngày khác nhau thay vì một mốc build; 17 script `check-*.mjs` của CI đều qua.

## Đề xuất áp dụng

Xếp theo hiệu quả kéo traffic dự kiến. Cả ba cần chủ site duyệt.

1. **IndexNow tự động sau mỗi deploy, chỉ gửi URL có `lastmod` mới** (không cần gói). Thêm job sau `deploy-pages` chạy `scripts/submit-indexnow.mjs` với tham số mới, ví dụ `--since <thời điểm deploy trước>`, đọc sitemap đã build và chỉ gửi URL đổi; `continue-on-error: true`. Lợi: Bing/Copilot/ChatGPT search thấy thang đo và bài mới trong vài giờ thay vì vài ngày. Cần duyệt vì CI sẽ tự gửi dữ liệu ra ngoài (api.indexnow.org) mỗi lần deploy.
2. **Kiểm trang mồ côi và độ sâu click bằng `orphan-beacon`** (cần cài devDependency `orphan-beacon`, MIT, 0 dependency). Chạy một lần trên `dist`, sửa link nội bộ cho các trang thang đo/khái niệm/dữ liệu sâu hơn 3 click; sau đó thêm vào CI ở chế độ chỉ báo. Lợi: Google crawl và xếp hạng các trang dài đuôi (đa số URL của site).
3. **Lint nội dung `geoptimize` trong CI ở chế độ cảnh báo** (cần cài devDependency `geoptimize`, MIT, hoặc dùng GitHub Action `cucuwang/geoptimize@v0.12.0`). Chạy trên `dist` sau `check-seo`, không chặn build cho tới khi có điểm nền; dùng để bắt trang mới thiếu nguồn cho số liệu hoặc thiếu đoạn trả lời đầu trang. Cần thử trước vì heuristic có thể báo sai với tiếng Việt.
