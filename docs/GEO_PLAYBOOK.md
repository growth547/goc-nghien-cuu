# GEO playbook: được AI tìm thấy, hiểu, tin và trích dẫn

Mục tiêu: khi sinh viên hỏi ChatGPT, Gemini/Google AI Overviews, Perplexity, Copilot hay Claude về "thang đo X", "cỡ mẫu PLS-SEM", "Cronbach's alpha bao nhiêu là đạt", câu trả lời trích Góc Nghiên Cứu và đặt link.

Nguyên tắc nền (đã kiểm tra trong tài liệu chính thức, 30/10/2026):

- Google: AI Overviews và AI Mode **không có yêu cầu riêng**. Trang chỉ cần được index và đủ điều kiện hiện snippet; không cần schema hay file "AI" đặc biệt; structured data phải khớp nội dung hiển thị. https://developers.google.com/search/docs/appearance/ai-features
- ChatGPT search dùng **OAI-SearchBot**; GPTBot chỉ là thu thập để huấn luyện; ChatGPT-User là lượt truy cập theo yêu cầu người dùng. https://developers.openai.com/api/docs/bots
- Perplexity: **PerplexityBot** để hiện trong kết quả; Perplexity-User khi người dùng hỏi. https://docs.perplexity.ai/guides/bots
- Claude: ClaudeBot (huấn luyện), Claude-SearchBot (tìm kiếm), Claude-User (theo yêu cầu). https://support.claude.com/en/articles/8896518
- Bing/Copilot: gửi URL thay đổi qua IndexNow (`node scripts/submit-indexnow.mjs`). https://www.bing.com/indexnow/getstarted
- llms.txt là đề xuất cộng đồng (https://llmstxt.org), chưa được Google dùng; chi phí thấp nên vẫn cung cấp.

Đã có trên site: `/robots.txt` (cho phép tất cả bot trên; **chỉ có hiệu lực khi đặt ở gốc tên miền**, tức sau khi chuyển sang domain riêng), `/llms.txt`, `/llms-full.txt` (sinh từ collections lúc build), trang `/phuong-phap-bien-soan/` (E-E-A-T: kiểm chứng, sửa lỗi, công khai affiliate), sitemap, IndexNow.

## 1. Checklist cho mỗi agent nội dung (áp dụng cho mọi trang mới hoặc sửa)

1. **Câu trả lời trước.** 1–3 câu đầu trang trả lời thẳng câu hỏi chính, có con số hoặc tên cụ thể (ví dụ "Cronbach's alpha ≥ 0,7 là chấp nhận được cho nghiên cứu khám phá theo Nunnally (1978)"). AI hay trích đúng đoạn này.
2. **H2 dạng câu hỏi thật.** Lấy từ Google gợi ý, "Mọi người cũng hỏi", Search Console, nhóm Facebook. Ví dụ: "Thang đo TAM gồm bao nhiêu biến?", "Cỡ mẫu tối thiểu cho PLS-SEM là bao nhiêu?". Ngay dưới H2 là câu trả lời 40–60 từ, rồi mới tới chi tiết.
3. **Dữ kiện kiểm được.** Mỗi số, mỗi câu gán cho tác giả phải có nguồn mở được (DOI, PMC, trang chính thức) ghi trên trang. Không bịa, không ước lượng. Một trang ít mà đúng thắng một trang dài mà sai.
4. **Tên thực thể nhất quán.** Dùng đúng một cách viết: "Góc Nghiên Cứu"; tên thang đo dạng "Tên viết tắt + tên đầy đủ tiếng Anh + tác giả (năm)", ví dụ "UTAUT2 (Venkatesh, Thong & Xu, 2012)". Khái niệm: tiếng Việt kèm tiếng Anh trong ngoặc ở lần đầu.
5. **Dữ liệu riêng.** Ưu tiên thứ chỉ site này có: số biến, câu đảo chiều, bảng cỡ mẫu tính sẵn, số liệu World Bank đã định dạng, ví dụ chương 3/4. AI trích nguồn có thông tin gốc.
6. **Bảng và danh sách** cho dữ kiện so sánh (thang đo A vs B, ngưỡng chỉ số). Nội dung quan trọng phải là văn bản HTML, không nằm trong ảnh hay chỉ trong JS.
7. **Liên kết nội bộ**: trang thang đo ↔ khái niệm ↔ mẫu bảng hỏi ↔ công cụ; mỗi bài viết link tới ít nhất một công cụ và một thang đo.
8. **Ngày cập nhật** đúng (`modDatetime` cho bài viết) khi sửa nội dung thật; không đổi ngày khi không sửa.
9. **Không nhồi từ khoá, không văn mẫu AI** ("Trong thời đại…", gạch ngang dài, emoji).
10. **Structured data khớp nội dung hiển thị** (xem mục 3). Không thêm FAQ schema cho câu hỏi không có trên trang.
11. Chạy script kiểm tra tương ứng (`check-scales`, `check-concepts`, …) và sau khi deploy chạy `node scripts/submit-indexnow.mjs`.

## 2. Việc tự động hoá được

### Mỗi giờ / mỗi lần deploy

- Build lại `llms.txt`, `llms-full.txt`, sitemap (tự động trong `astro build`).
- `node scripts/submit-indexnow.mjs` sau mỗi deploy thành công (có thể thêm bước vào workflow sau `deploy-pages`).
- `node scripts/crawl-check.mjs --no-external` để bắt link gãy, trang 404, thiếu title/description.

### Mỗi ngày

- Đối chiếu sitemap với `llms.txt`: mọi trang thang đo/khái niệm/dữ liệu phải có trong cả hai.
- Kiểm tra structured data của 5 trang ngẫu nhiên bằng Rich Results Test / validator.schema.org (có thể gọi qua script với HTML đã build).
- Lấy truy vấn mới từ Search Console và Bing Webmaster (API) → thêm vào `docs/CONTENT_BACKLOG.md` các câu hỏi chưa có trang trả lời.
- Thử hỏi ChatGPT/Perplexity/Gemini 10–20 câu mục tiêu (danh sách cố định) và ghi lại nguồn được trích → theo dõi tỉ lệ được trích theo tuần.

### Mỗi tuần / tháng

- Lấy lại dữ liệu World Bank (`node scripts/fetch-worldbank.mjs`) và đăng nếu có năm mới.
- Viết 1 trang "thống kê gốc" (ví dụ: "Cronbach's alpha trung bình của các thang đo phổ biến", "Bảng cỡ mẫu PLS-SEM theo số mũi tên", "Các chỉ số kinh tế Việt Nam dùng nhiều nhất trong khoá luận") từ dữ liệu sẵn có trên site, có bảng, có nguồn, có CSV.
- Rà các trang có hiển thị nhưng CTR thấp trong Search Console: viết lại đoạn trả lời đầu trang và title.

## 3. Structured data: trang nào gắn schema nào

Component: `src/components/JsonLd.astro` (in một khối JSON-LD, tự escape `<`). Builder: `src/utils/jsonLd.ts`. Cách dùng trong trang (bên trong `<Layout>`):

```astro
---
import JsonLd from "@/components/JsonLd.astro";
import { scaleTermSetLd } from "@/utils/jsonLd";
const pageUrl = new URL(Astro.url.pathname, Astro.site).href;
---
<JsonLd slot="head" data={scaleTermSetLd(entry, pageUrl)} />
```

| Trang (chủ sở hữu) | Đang có | Nên thêm | Builder |
|---|---|---|---|
| `/thang-do/[slug]` | Article, FAQPage | DefinedTermSet các khái niệm của thang đo (mã, tên Việt/Anh, định nghĩa, citation) | `scaleTermSetLd(entry, pageUrl)` |
| `/khai-niem/[slug]` | Article, FAQPage, BreadcrumbList | DefinedTerm thuộc bộ thuật ngữ của site | `conceptTermLd(entry, pageUrl, glossaryUrl)` với `glossaryUrl` = URL tuyệt đối của `/khai-niem/` |
| `/khai-niem/` | không | DefinedTermSet (bộ thuật ngữ) | `glossaryLd(concepts, glossaryUrl, c => url)` |
| `/du-lieu/` | không | DataCatalog chứa các Dataset | `dataCatalogLd(datasets, catalogUrl, d => url)` |
| `/du-lieu/[slug]` | Dataset + DataDownload | giữ nguyên; bảo đảm có `license`, `temporalCoverage`, `creator` = World Bank | – |
| `/mau-bang-hoi/[slug]` | Article | không cần thêm; có thể thêm `about` trỏ tới các `#<CODE>` của trang thang đo | – |
| Công cụ (ToolLayout) | WebApplication | giữ nguyên | – |
| `/phuong-phap-bien-soan/` | AboutPage + Organization (publishingPrinciples, correctionsPolicy) | đã có | `publisherLd` |
| Trang chủ | WebSite, Organization | thêm `publishingPrinciples` trỏ tới `/phuong-phap-bien-soan/` (dùng `publisherLd`) | `publisherLd` |

Lưu ý: Google chỉ có rich result cho Dataset (Dataset Search); DefinedTerm/DefinedTermSet là schema.org hợp lệ, giúp máy hiểu thực thể nhưng không tạo hiển thị đặc biệt. Đừng hứa hẹn thứ hạng từ schema.

## 4. Việc cần chủ site làm (tài khoản, quan hệ)

- **Domain riêng**: khi chuyển, cập nhật `site.url` trong `astro-paper.config.ts`, đặt redirect 301 từ GitHub Pages, kiểm tra `https://<domain>/robots.txt` và `/llms.txt` trả 200, đổi `SITE` trong `scripts/submit-indexnow.mjs`, đặt file key IndexNow ở gốc.
- **Google Search Console**: thêm domain property, gửi sitemap, theo dõi truy vấn; dùng URL Inspection cho trang mới quan trọng.
- **Bing Webmaster Tools**: thêm site (có thể nhập từ Search Console), gửi sitemap, bật IndexNow. Bing là nguồn của Copilot và nhiều câu trả lời tìm kiếm của AI.
- **Được trích bởi nơi uy tín**: gửi trang thang đo/công cụ cho giảng viên phương pháp nghiên cứu, thư viện trường, trang khoa, nhóm Facebook/Zalo nghiên cứu, diễn đàn; đề nghị đưa vào danh mục tài nguyên môn học (danh sách trong `docs/outreach/`). Link từ `.edu.vn` và được nhắc tên trên diễn đàn là tín hiệu tin cậy mạnh nhất.
- **YouTube/TikTok/Facebook**: mỗi video hướng dẫn (chạy Cronbach, tính cỡ mẫu) có mô tả kèm link trang tương ứng và tên "Góc Nghiên Cứu" viết thống nhất; ghim bình luận có link.
- **Hồ sơ thực thể**: dùng một tên, một logo, một mô tả trên GitHub, Facebook, YouTube; thêm các URL đó vào `sameAs` của `publisherLd`.
- **Phản hồi lỗi**: theo dõi GitHub issues, sửa nhanh và ghi trong commit; đây là bằng chứng "đáng tin" mà trang phương pháp mô tả.

## 5. Không làm

- Không tạo trang mỏng hàng loạt chỉ đổi từ khoá; không chép nội dung trang khác; không bịa trích dẫn hay số liệu.
- Không chặn bot tìm kiếm AI (OAI-SearchBot, PerplexityBot, Claude-SearchBot, Bingbot) nếu muốn được trích.
- Không đặt nội dung chính trong ảnh, PDF hay chỉ sau khi chạy JS.
- Không đổi câu chữ công khai affiliate.
