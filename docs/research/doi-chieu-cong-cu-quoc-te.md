# Đối chiếu Góc Nghiên Cứu với công cụ quốc tế

Ngày khảo sát: 30/10/2026. Nguồn: trang tính năng và tài liệu công khai của từng công cụ, cộng với kiểm tra trực tiếp header API bằng `curl` cùng ngày. Không đăng ký, không đăng nhập ở đâu. Phần "chúng ta có gì" đối chiếu với mã nguồn trong `src/tools/*.html` và `src/pages/cong-cu/*.astro`, không chỉ với trang chủ.

Phạm vi loại trừ: không đề xuất bất cứ gì giúp gian lận học thuật (viết hộ, paraphrase để né đạo văn, "humanizer", né máy dò AI, bịa dữ liệu hay trích dẫn). Kiểm tra đạo văn kiểu Scribbr/Turnitin cũng bị loại vì cần cơ sở dữ liệu văn bản và máy chủ, không làm được trên site tĩnh.

Ghi chú về độ chắc chắn: Scribbr chặn bot (HTTP 403), trang INN (inn.theorizeit.org) trả 522 và MarketingScales.com không phân giải DNS ngày khảo sát, nên mô tả ba nơi này dựa trên trang trợ giúp, tài liệu bên thứ ba và hiểu biết sẵn có; các chỗ đó ghi "(chưa kiểm lại trực tiếp)".

---

## 1. Ma trận tính năng

Ký hiệu: **Có** / **Một phần** / **Không** / để trống = không thuộc phạm vi công cụ đó.

### 1.1 Thống kê và phân tích dữ liệu

| Năng lực | Góc NC | JASP | jamovi | SmartPLS 4 | PSPP | Laerd / Statology / UCLA (hướng dẫn) |
|---|---|---|---|---|---|---|
| Chạy trong trình duyệt, không cài, dữ liệu không rời máy | **Có** | Không (app desktop) | Một phần (jamovi cloud cần tài khoản) | Không | Không | |
| Đọc Excel/CSV | Có | Có | Có | Có | Có | |
| Đọc .sav SPSS | Không | Có | Có | Không | Có | |
| Lọc phiếu: câu sàng lọc, câu kiểm tra chú ý, straightlining, thiếu | **Có** (tự động, ghi lý do vào 4.1) | Không | Không | Không | Không | Statology/Laerd chỉ có bài hướng dẫn |
| Đảo điểm câu đảo chiều tự động | Có | Thủ công | Thủ công | Thủ công | Thủ công | |
| Thống kê mô tả, skewness, kurtosis | Có | Có | Có | Có | Có | Có |
| Biểu đồ (histogram, Q-Q, boxplot, scatter, raincloud) | **Không** | Có | Có | Một phần | Có | Có (ảnh) |
| Cronbach's alpha, alpha nếu loại biến | Có | Có | Có | Có | Có | Có |
| McDonald's omega | **Không** | Có | Có | Có (rho_A, rho_C) | Không | Có bài |
| EFA: PCA + Varimax, KMO, Bartlett | Có | Có | Có | | Có | Có |
| EFA: PAF/ML, Promax/Oblimin, parallel analysis | **Không** | Có | Có | | Một phần | Có |
| CFA với chỉ số phù hợp (CFI, TLI, RMSEA, SRMR) | **Không** | Có | Có (SEMLj) | Có (CB-SEM) | Không | Có bài |
| CR, AVE, Fornell–Larcker, HTMT | Có (xấp xỉ qua PCA) | Một phần | Một phần (module) | Có | Không | |
| Tương quan Pearson | Có | Có | Có | | Có | Có |
| Hồi quy bội OLS, VIF, Durbin–Watson | Có | Có | Có | Có | Có | Có |
| Hồi quy phân cấp (ΔR²), biến giả | **Không** | Có | Có | | Có | Có |
| Hồi quy logistic | **Không** | Có | Có | Có | Có | Có |
| t-test độc lập, Welch, ANOVA, Welch ANOVA, post hoc | Có | Có | Có | | Có | Có |
| t-test cặp, Mann-Whitney, Kruskal-Wallis, Wilcoxon | **Không** | Có | Có | | Có | Có |
| Chi-square bảng chéo, Cramér's V | **Không** | Có | Có | | Có | Có |
| Shapiro-Wilk | **Không** | Có | Có | | Có | Có |
| Effect size kèm khoảng tin cậy (d, η², ω², f²) | **Không** (trừ f² trong cỡ mẫu) | Có | Có | Có (f²) | Một phần | Có |
| Trung gian / điều tiết, bootstrap CI | **Không** (chỉ vẽ được) | Có (module Process) | Có (medmod, jAMM) | Có | Không | Có bài |
| Ước lượng PLS-SEM (path, R², f², Q², bootstrap) | **Không** (chỉ vẽ mô hình) | Có (PLS-SEM trong module SEM) | Có (module) | **Có** (chuẩn mực) | Không | |
| Dữ liệu bảng FEM/REM/Hausman | **Không** | Không | Một phần (GAMLj mixed) | | Không | Statology có R/Stata |
| Kiểm tra chệch phương pháp chung (Harman) | **Không** | Gián tiếp (EFA 1 nhân tố) | Gián tiếp | Có (VIF toàn phần) | Gián tiếp | |
| Chương 4 viết sẵn bằng tiếng Việt, xuất Word | **Có** (độc nhất) | Không | Không | Không | Không | Laerd: mẫu câu báo cáo (tiếng Anh, trả phí) |
| Lưu dự án, mở lại | Không | Có (.jasp) | Có (.omv) | Có | Có (.sps) | |
| Xuất cú pháp tái lập (syntax/R) | **Không** | Một phần (R code) | Có (syntax mode, R) | Không | Có | |
| Dữ liệu mẫu để thử | Có | Có (Data Library) | Có | Có | | Có |

Nguồn: https://jasp-stats.org/features/ (34 module, bản 0.19.3), https://library.jamovi.org/, https://smartpls.com/documentation/algorithms-and-techniques, https://www.gnu.org/software/pspp/, https://statistics.laerd.com/spss-tutorials/one-way-anova-using-spss-statistics.php, https://www.statology.org/, https://stats.oarc.ucla.edu/other/mult-pkg/whatstat/.

### 1.2 Cỡ mẫu và thiết kế

| Năng lực | Góc NC | G*Power | jamovi (jpower) | JASP (Power) |
|---|---|---|---|---|
| Cochran, Slovin/Yamane, tỉ lệ | Có | Không | Không | Không |
| PLS-SEM (f², số mũi tên), hồi quy, EFA/CFA (quy tắc kinh nghiệm) | Có | Một phần (hồi quy F) | Không | Không |
| t-test, ANOVA, chi-square, tương quan, logistic theo power | **Không** | Có | Có (t-test) | Có |
| Phân tích độ nhạy (sensitivity), post hoc, compromise | **Không** | Có | Có | Có |
| Đồ thị power theo cỡ mẫu | **Không** | Có | Có | Có |
| Đoạn chương 3 viết sẵn về cỡ mẫu | **Có** | Không | Không | Không |

Nguồn: https://www.psychologie.hhu.de/arbeitsgruppen/allgemeine-psychologie-und-arbeitspsychologie/gpower

### 1.3 Bảng hỏi và thang đo

| Năng lực | Góc NC | Qualtrics | SurveyMonkey | Google Forms | MarketingScales | INN (Larsen) |
|---|---|---|---|---|---|---|
| Thư viện thang đo đã kiểm chứng, có nguồn gốc | **Có** (60 thang đo, bản tiếng Việt) | Có (Library, câu hỏi mẫu) | Có (Question Bank, câu do SM soạn) | Không | Có (hàng nghìn thang đo marketing, có đánh giá tâm trắc) (chưa kiểm lại trực tiếp) | Có (>70.000 construct, tìm theo ngữ nghĩa) (chưa kiểm lại trực tiếp) |
| Tìm construct trùng tên khác nghĩa / khác tên cùng nghĩa (jingle-jangle) | **Không** | Không | Không | Không | Không | **Có** (LSA) |
| Độ tin cậy từng nghiên cứu trước đã báo cáo | Một phần (trên trang thang đo) | Không | Không | Không | **Có** | Không |
| Xuất bảng hỏi Word / Google Forms | **Có** | Có (Word) | Có (PDF) | | | |
| Logic rẽ nhánh, ngẫu nhiên hoá | Không (đẩy sang Google Forms/GDF) | Có | Có | Có (theo section) | | |
| Kiểm tra chất lượng bảng hỏi trước khi gửi | **Không** | **Có** (ExpertReview: thời lượng, ma trận, mobile, câu hai ý) | Có (SurveyMonkey Genius) | Không | | |
| Câu kiểm tra chú ý, sàng lọc mã hoá sẵn | **Có** | Có | Có | Một phần | | |
| Bảng mã hoá biến dùng chung với công cụ phân tích | **Có** (độc nhất) | Một phần | Không | Không | | |

Nguồn: https://www.qualtrics.com/support/survey-platform/survey-module/survey-checker/survey-methodology-compliance-best-practices/, https://www.surveymonkey.com/mp/survey-templates/, https://support.google.com/docs/answer/7032287, AMCIS 2010 "A Transdisciplinary Approach to Construct Search and Integration" (https://aisel.aisnet.org/amcis2010/524), mẫu sách Bruner Vol. 10 (https://scaleresearch.siu.edu/V10sample.pdf).

### 1.4 Tài liệu, trích dẫn, đọc bài

| Năng lực | Góc NC | Zotero / ZoteroBib | Mendeley | Scribbr Citation | Elicit / Consensus | scite | Semantic Scholar | Connected Papers / ResearchRabbit |
|---|---|---|---|---|---|---|---|---|
| Tạo trích dẫn từ DOI / tên bài | **Có** (Crossref + DataCite) | Có | Có | Có | | | Có (nút Cite) | |
| ISBN (sách), URL (web) | **Không** | Có | Có | Có | | | | |
| Nhiều chuẩn: APA, Harvard, IEEE, Vancouver, MLA, Chicago | **Không** (chỉ APA 7) | Có (>10.000 CSL) | Có | Có (4 chuẩn chính) | | | Một phần | |
| Xuất RIS / BibTeX, nhập vào Word/LaTeX | **Không** | Có | Có | Một phần | Có (Elicit) | | Có | Có |
| Thư viện cá nhân lưu lại | Không | Có | Có | Có (cần tài khoản) | | | Có (cần tài khoản) | Có |
| Tìm bài theo từ khoá / câu hỏi | **Không** | | Có | | Có (AI) | Có | Có | |
| Bản truy cập mở (OA link) | **Không** | Có | | | Có | | Có | |
| Cờ bài bị rút (retraction) | **Không** | **Có** (Retraction Watch) | Không | | | **Có** | | |
| Kiểm tra danh mục tài liệu (khớp trích dẫn trong bài) | **Không** | Không | Không | Có (Citation Checker, trả phí) | | Có (Reference Check, trả phí) | | |
| Bản đồ trích dẫn (bài liên quan, trước/sau) | **Không** | | | | | Có | Một phần | **Có** |
| Tóm tắt bằng AI | Không (không cần) | | | | Có | Có | Có (TLDR) | |

Nguồn: https://www.zotero.org/blog/retracted-item-notifications/, https://zbib.org/, https://www.scribbr.com/citation/generator/, https://elicit.com/, https://consensus.app/, https://help.scite.ai/zh/article/how-do-i-use-the-scite-reference-check-u52q0w, https://www.semanticscholar.org/product/api, https://www.connectedpapers.com/about, https://www.researchrabbit.ai/.

### 1.5 Viết và hướng dẫn

| Năng lực | Góc NC | Scribbr | Laerd | Statology | UCLA OARC | Grammarly | Overleaf |
|---|---|---|---|---|---|---|---|
| Bài hướng dẫn phương pháp | Có (23 bài) | Có (hàng nghìn) | Có (96 bài SPSS, phần lớn trả phí) | Có (hàng nghìn, miễn phí) | Có | | Có (LaTeX) |
| Bảng "nên dùng kiểm định nào" | **Có** (Chọn phương pháp) | Có (bài) | Có (Test Selector, trả phí) | Có (bài) | **Có** (whatstat, link sang SPSS/Stata/R/SAS) | | |
| Giải thích từng con số trong output (annotated output) | Một phần (bài hồi quy) | Không | Có | Có | **Có** (chuẩn mực) | | |
| Mẫu câu báo cáo APA | Có (chương 4) | Có | Có | Một phần | Một phần | | |
| Hộp "Cite this article" | **Không** | **Có** | Có | Không | Có (cách trích UCLA) | | |
| Ngưỡng chỉ số có nguồn | Có (rải rác) | Có | Có | Có | Có | | |
| Kiểm tra văn phong học thuật | Không | Có (proofreading, trả phí) | | | | Có | |
| Mẫu luận văn LaTeX | Không | | | | | | Có |

**Điểm mạnh riêng của Góc NC** (không công cụ quốc tế nào gộp đủ): tiếng Việt; một chuỗi liền mạch thang đo → bảng hỏi có mã hoá → cỡ mẫu → lọc phiếu → phân tích → chương 4 Word; câu kiểm tra chú ý/sàng lọc dùng chung bảng mã giữa bảng hỏi và phân tích; chạy hoàn toàn trong trình duyệt nên dữ liệu đáp viên không rời máy; dữ liệu World Bank và chỉ số tài chính cho khoá luận dữ liệu thứ cấp.

---

## 2. 15 tính năng đáng làm nhất

Cách xếp: Giá trị với sinh viên (V, 1–5: bao nhiêu khoá luận cần, hội đồng có hỏi không) × Khả thi trên site tĩnh (F, 1–5). Hoà điểm thì ưu tiên V cao hơn và việc nối được vào luồng hiện có. Effort: S ≤ 3 ngày, M ≤ 2 tuần, L > 2 tuần (một người, đã quen mã hiện tại).

| # | Tính năng | V | F | Effort | Dùng API ngoài |
|---|---|---|---|---|---|
| 1 | Trung gian và điều tiết (kiểu PROCESS 4, 1, 7) có bootstrap | 5 | 4 | M | Không |
| 2 | Biểu đồ chuẩn APA trong phân tích dữ liệu | 4 | 5 | S–M | Không |
| 3 | Effect size, khoảng tin cậy, câu báo cáo APA cho mọi kiểm định | 4 | 5 | S | Không |
| 4 | Kiểm định còn thiếu: chi-square, phi tham số, t-test cặp, Shapiro-Wilk | 4 | 5 | M | Không |
| 5 | Kiểm tra danh mục tài liệu tham khảo | 5 | 4 | M | Crossref, OpenAlex |
| 6 | Trích dẫn nhiều chuẩn + ISBN + RIS/BibTeX + thư viện cục bộ | 5 | 4 | M | Crossref, Open Library, CSL |
| 7 | Tìm tài liệu và "bài nào đã dùng thang đo này" | 5 | 4 | M | OpenAlex |
| 8 | Độ tin cậy và EFA mở rộng: ω, PAF/Promax, parallel analysis, Harman, Mahalanobis | 4 | 5 | S–M | Không |
| 9 | Kiểm tra chất lượng bảng hỏi trước khi gửi | 4 | 5 | S | Không |
| 10 | Lưu dự án + xuất cú pháp SPSS/R để tự kiểm lại | 4 | 5 | S | Không |
| 11 | Cỡ mẫu theo power cho t-test, ANOVA, chi-square, tương quan + độ nhạy + đồ thị | 4 | 4 | M | Không |
| 12 | Hồi quy phân cấp (ΔR²), biến giả, logistic nhị phân | 4 | 4 | M | Không |
| 13 | Ước lượng PLS-SEM từ mô hình đã vẽ | 5 | 3 | L | Không |
| 14 | Thẩm định nội dung và pilot: CVI, kappa, ICC, phiếu dịch ngược | 3 | 5 | S | Không |
| 15 | Hồi quy dữ liệu bảng cho khoá luận tài chính (Pooled, FEM, REM, Hausman) | 4 | 3 | L | Không |

Ngoài top 15 nhưng đáng ghi sổ: CFA có chỉ số phù hợp (V4 F2, L: cần tối ưu ML ổn định, nên làm sau #13 vì dùng chung bộ tối ưu); bản đồ trích dẫn kiểu Connected Papers từ `referenced_works`/`related_works` của OpenAlex (V3 F4, M); tìm construct gần nghĩa trong thư viện thang đo kiểu INN bằng TF-IDF chạy sẵn lúc build (V3 F4, M); trình đọc output SPSS dán vào kiểu UCLA annotated output (V4 F3, M); đọc file .sav (V3 F4, S, có thư viện JS mã nguồn mở).

### 2.1 Trung gian và điều tiết (PROCESS 4, 1, 7)

- **Người khác làm:** PROCESS macro của Hayes cho SPSS (https://www.processmacro.org/), jamovi module medmod/jAMM (https://library.jamovi.org/), JASP module Process (https://jasp-stats.org/features/), SmartPLS "PROCESS-style path analysis" (https://smartpls.com/faq/smartpls4/whatsnew). Hội đồng Việt Nam hỏi về biến trung gian rất thường xuyên; công cụ Vẽ mô hình của ta đã cho vẽ biến trung gian/điều tiết nhưng chưa tính được.
- **Thiết kế:** Trong Phân tích dữ liệu thêm bước "Mô hình có trung gian/điều tiết?" đọc trực tiếp mô hình từ Vẽ mô hình (cùng mã khái niệm, cùng localStorage). Hỗ trợ 3 mô hình phổ biến nhất: Model 4 (X→M→Y, nhiều M song song), Model 1 (X×W→Y, tự trung tâm hoá, simple slopes tại M±1SD, đồ thị tương tác), Model 7 (điều tiết đường a, chỉ số trung gian có điều tiết). Hiệu ứng gián tiếp bằng percentile bootstrap 5.000 lần, seed cố định (ghi seed vào chương 4 để tái lập). OLS đã có sẵn; bootstrap 5.000 × N=300 chạy < 2 giây trong Web Worker. Thêm mục "4.x Kiểm định vai trò trung gian" với bảng tác động trực tiếp/gián tiếp/toàn phần và câu báo cáo, dẫn Hayes (2022) và Zhao, Lynch & Chen (2010) cho phân loại trung gian.
- **Kiểm chứng:** so với PROCESS v4 trên 2 bộ dữ liệu mẫu, khớp tới 3 chữ số với hệ số, khác biệt CI bootstrap trong sai số Monte Carlo; đưa bảng đối chiếu lên trang công cụ.
- **Effort:** M. **API:** không.

### 2.2 Biểu đồ chuẩn APA

- **Người khác làm:** JASP raincloud plot, Flexplot (https://jasp-stats.org/features/); jamovi tự vẽ histogram, Q-Q, boxplot cho mọi phân tích; Laerd và Statology dùng ảnh đồ thị trong từng bài.
- **Thiết kế:** SVG tự vẽ (không cần thư viện; Vẽ mô hình đã có mã xuất SVG/PNG có thể tái dùng). Bộ tối thiểu: histogram + đường chuẩn và Q-Q cho phần dư hồi quy; scatter phần dư chuẩn hoá theo giá trị dự báo; biểu đồ trung bình có thanh CI 95% cho t-test/ANOVA; cột tần số cho nhân khẩu học; đồ thị simple slopes (từ #1). Kiểu APA 7: không lưới, nhãn trục đầy đủ, "Hình 4.x" ở trên, chú thích ở dưới. Chèn vào file Word chương 4 dưới dạng PNG độ phân giải gấp 3 (Word không nhận SVG ổn định ở bản cũ) kèm nút tải SVG.
- **Effort:** S–M. **API:** không.

### 2.3 Effect size, khoảng tin cậy, câu báo cáo APA

- **Người khác làm:** JASP/jamovi có ô tích effect size ở mọi bảng; Laerd có mục "Reporting the output" mẫu câu APA cho từng kiểm định; Scribbr có bài "Reporting statistics in APA Style" (https://www.scribbr.com/apa-style/numbers-and-statistics/ (Scribbr chặn bot, chưa mở lại được)).
- **Thiết kế:** Thêm cột Cohen's d (+ Hedges g) và CI 95% cho t-test; η², ω² cho ANOVA; f² cho từng biến độc lập trong hồi quy (đã có công thức ở công cụ cỡ mẫu); r cho phi tham số. Mỗi bảng kết quả có ô "Câu báo cáo" đúng định dạng APA 7 bằng tiếng Việt (dấu phẩy thập phân tuỳ chọn), ví dụ "t(198) = 2,45; p = 0,015; d = 0,35; KTC 95% [0,07; 0,63]". Diễn giải mức độ theo Cohen (1988) có ghi rõ là quy ước, không phải ngưỡng cứng.
- **Effort:** S. **API:** không.

### 2.4 Kiểm định còn thiếu: chi-square, phi tham số, t-test cặp, Shapiro-Wilk

- **Người khác làm:** đủ ở JASP, jamovi, PSPP; bảng chọn kiểm định của UCLA (https://stats.oarc.ucla.edu/other/mult-pkg/whatstat/) dẫn sang từng hướng dẫn. Công cụ Chọn phương pháp của ta đã gợi ý Mann-Whitney/Kruskal-Wallis nhưng Phân tích dữ liệu chưa chạy được, tạo đứt gãy.
- **Thiết kế:** (a) Chi-square bảng chéo nhân khẩu học × biến định danh, cảnh báo ô kỳ vọng < 5, Fisher exact cho 2×2, Cramér's V. (b) Mann-Whitney U, Kruskal-Wallis + Dunn–Bonferroni, Wilcoxon. (c) Paired t-test cho thiết kế trước/sau. (d) Shapiro-Wilk theo thuật toán Royston AS R94 (có bản JS mã nguồn mở, kiểm với R `shapiro.test`), kèm cảnh báo rằng với N > 300 nên đọc skewness/kurtosis thay vì p. Tự gợi ý phi tham số khi Levene và chuẩn đều vi phạm, ghi lý do vào chương 4.
- **Effort:** M. **API:** không.

### 2.5 Kiểm tra danh mục tài liệu tham khảo

Đây là công cụ liêm chính học thuật: giúp sinh viên phát hiện tài liệu trích sai, thiếu, hoặc đã bị rút, không tạo nội dung thay họ.

- **Người khác làm:** scite Reference Check nhận PDF bản thảo, báo bài có thông báo biên tập (retraction, expression of concern) và cách bài được trích (https://help.scite.ai/zh/article/how-do-i-use-the-scite-reference-check-u52q0w), cần trả phí. Zotero desktop tự gắn cờ bài bị rút nhờ dữ liệu Retraction Watch, nay lấy qua Crossref, kiểm theo DOI mà không tải thư viện lên máy chủ (https://www.zotero.org/blog/retracted-item-notifications/). Scribbr Citation Checker kiểm tra lỗi định dạng APA (trả phí).
- **Thiết kế:** Hai ô dán: thân bài (hoặc chương 1–2) và danh mục tài liệu. Chạy trong trình duyệt:
  1. Tách trích dẫn trong bài theo mẫu APA ("Tác giả, năm", "Tác giả và cộng sự, năm", "et al.", nhiều tác giả cách bằng ";") và đối chiếu với danh mục: trích trong bài mà thiếu trong danh mục, có trong danh mục mà không được trích, năm lệch, chính tả tên lệch (khoảng cách Levenshtein).
  2. Với mỗi mục có DOI hoặc tìm được DOI qua Crossref: so tên bài, năm, tạp chí với metadata; báo DOI hỏng.
  3. Cờ rút bài: trường `update-to` có `type: retraction` của Crossref (gồm cả nguồn Retraction Watch) hoặc `is_retracted` của OpenAlex.
  4. Lỗi định dạng APA 7 thường gặp: thiếu DOI dạng https, viết hoa tên bài, "&" trước tác giả cuối, thứ tự chữ cái.
  Kết quả là danh sách việc cần sửa, sinh viên tự sửa. Không lưu gì lên máy chủ.
- **Effort:** M. **API:** Crossref (đã dùng), OpenAlex.
- **Kiểm tra điều khoản:**
  - Crossref: "No sign-up is required to use the REST API" (https://www.crossref.org/documentation/retrieve-metadata/rest-api/). Giới hạn từ 12/2025: public pool 5 yêu cầu/giây cho một bản ghi, 1 yêu cầu/giây cho truy vấn danh sách, đồng thời 1; polite pool (thêm `mailto`) 10 và 3 (https://www.crossref.org/blog/announcing-changes-to-rest-api-rate-limits/). Header thực tế ngày 30/10/2026: `x-rate-limit-limit: 5`, `access-control-allow-origin: *`. Lưu ý quan trọng: Crossref giới hạn theo email, nên **không** đặt một `mailto` chung của site vào mã phía trình duyệt (mọi sinh viên sẽ chung một hạn mức); dùng public pool, hàng đợi tuần tự 1 yêu cầu/giây cho truy vấn tên bài, cache theo DOI trong sessionStorage, lùi lại khi gặp 429 như Crossref khuyên ("back off if you start seeing 429 statuses", https://www.crossref.org/documentation/retrieve-metadata/rest-api/tips-for-using-the-crossref-rest-api/). Dữ liệu Retraction Watch: trang tài liệu của Crossref không nêu giấy phép riêng, chỉ yêu cầu ghi nguồn; ghi "Dữ liệu rút bài: Retraction Watch qua Crossref" ở kết quả (https://www.crossref.org/documentation/retrieve-metadata/retraction-watch/).
  - OpenAlex: "Our data is CC0" (https://openalex.org/about); "you can make basic queries with no key at all" (https://help.openalex.org/how-to-use-the-api/rate-limits-and-authentication). Header ngày 30/10/2026 khi không có key: `X-RateLimit-Limit-USD: 0.1`, một truy vấn tìm kiếm tốn `0.001`, tức khoảng 100 truy vấn danh sách/ngày cho mỗi người dùng không key, có CORS `*`. Đủ cho một sinh viên kiểm một danh mục 60–100 mục nếu gom DOI bằng bộ lọc `doi:a|b|c` (một yêu cầu cho nhiều DOI). Không nhúng API key vào mã tĩnh: key sẽ lộ và cả site chia chung hạn mức $1/ngày.

### 2.6 Trích dẫn nhiều chuẩn, ISBN, RIS/BibTeX, thư viện cục bộ

- **Người khác làm:** ZoteroBib (https://zbib.org/) không cần tài khoản, nhận DOI/ISBN/URL, hơn 10.000 chuẩn CSL, xuất RIS/BibTeX, lưu trong trình duyệt. Scribbr Citation Generator có APA, MLA, Chicago, Harvard, tìm theo tên, URL, ISBN, DOI (https://www.scribbr.com/citation/generator/).
- **Thiết kế:** Giữ công cụ APA hiện có làm lõi, thêm: (a) ISBN qua Open Library; (b) chọn chuẩn: APA 7, Harvard (Cite Them Right), IEEE, Vancouver, Chicago tác giả-năm, MLA 9 (các trường Việt Nam dùng nhiều nhất APA, Harvard, IEEE cho kỹ thuật, Vancouver cho y); dùng `citeproc-js` với file CSL tải sẵn vào repo (không gọi mạng); (c) xuất RIS và BibTeX, nhập RIS/BibTeX từ Zotero/Mendeley/Google Scholar; (d) danh mục lưu localStorage, sắp chữ cái, sao chép sang Word giữ thụt lề treo (HTML clipboard); (e) chuẩn hoá tên tác giả Việt (Nguyễn Văn A → "Nguyễn, V. A." theo APA hoặc giữ nguyên họ tên theo quy định nhiều trường, có tuỳ chọn).
- **Effort:** M. **API:** Crossref (đã dùng), Open Library; file CSL tĩnh.
- **Kiểm tra điều khoản:**
  - Open Library: miễn key, CORS `*` (kiểm ngày 30/10/2026); giới hạn "Non-identified requests are capped at 1 per second" theo tóm tắt trang https://openlibrary.org/developers/api, và trang nói API "not intended to serve as a data backend for third-party services". Dùng tra cứu từng ISBN do người dùng nhập là đúng mục đích (yêu cầu theo thời gian thực cho người thật), không bulk, có cache. Trình duyệt không cho đặt header `User-Agent`, nên chỉ chạy ở mức 1 yêu cầu/giây. Nếu cần nhiều hơn, đăng ký use case qua form của Open Library (chủ site làm).
  - Chuẩn CSL: "All styles in this repository are released under the Creative Commons Attribution-ShareAlike 3.0 Unported license" và phải nhắc rõ dự án CSL kèm link citationstyles.org (https://github.com/citation-style-language/styles). Thêm dòng ghi công ở chân công cụ.
  - citeproc-js: giấy phép kép CPAL 1.0 / AGPL 3.0 (thư mục LICENSE trong https://github.com/Juris-M/citeproc-js). Repo của site là MIT và công khai, nên dùng được nếu giữ nguyên thông báo bản quyền và ghi công; nếu muốn tránh copyleft, phương án nhẹ hơn là tự viết formatter cho 4–6 chuẩn (mã APA hiện có đã làm theo hướng này).

### 2.7 Tìm tài liệu và "bài nào đã dùng thang đo này"

- **Người khác làm:** Elicit và Consensus tìm bài theo câu hỏi và tóm tắt bằng AI (https://elicit.com/, https://consensus.app/); Semantic Scholar tìm kiếm có TLDR (https://www.semanticscholar.org/); ResearchRabbit/Connected Papers mở rộng từ một bài gốc. Không công cụ nào nối với thư viện thang đo.
- **Thiết kế:** Không dùng AI tóm tắt (không có máy chủ, và tóm tắt máy dễ khiến sinh viên trích bài chưa đọc). Hai chế độ:
  1. *Tìm bài:* ô tìm tiếng Anh, có gợi ý từ khoá Anh từ trang khái niệm (ví dụ "Ý định sử dụng" → "behavioral intention", "intention to use"); lọc năm, chỉ bài OA, loại bài (article/review); hiển thị số trích dẫn, tạp chí, link OA (`open_access.oa_url`), nút "Thêm vào danh mục" nối với #6.
  2. *Ai đã dùng thang đo này:* trên mỗi trang `/thang-do/[slug]`, nút gọi OpenAlex `filter=cites:W…` của bài gốc thang đo, lọc thêm từ khoá bối cảnh (ví dụ "Vietnam", "bank"), hiện 20 bài mới nhất. Giúp sinh viên tìm nghiên cứu trước để kế thừa và so sánh, đúng câu hội đồng hay hỏi.
- **Effort:** M. **API:** OpenAlex (CC0, không key cho truy vấn cơ bản, CORS `*`; trích dẫn ở #5). Không chọn Semantic Scholar làm nguồn chính vì giấy phép API cấp "a limited, non-exclusive, non-transferable, non-sublicensable and terminable license", yêu cầu ghi công "Semantic Scholar" trên website, dữ liệu một phần theo CC BY-NC, và pool không key là "1000 requests per second shared among all unauthenticated users" (https://www.semanticscholar.org/product/api/license, https://www.semanticscholar.org/product/api). Site do một doanh nghiệp vận hành và có link affiliate, nên CC BY-NC là rủi ro; OpenAlex CC0 an toàn hơn.

### 2.8 Độ tin cậy và EFA mở rộng

- **Người khác làm:** JASP module Reliability có ω và nhiều hệ số; Factor có PAF/ML, xoay xiên, parallel analysis (https://jasp-stats.org/features/); SmartPLS báo rho_A, rho_C, VIF toàn phần cho chệch phương pháp chung.
- **Thiết kế:** (a) McDonald's ω từ hệ số tải một nhân tố; (b) EFA thêm PAF và Promax/Oblimin (nhiều giảng viên yêu cầu "PAF + Promax" khi dữ liệu dùng cho CFA/SEM sau đó), hiển thị pattern + structure matrix; (c) parallel analysis của Horn (100 bộ dữ liệu ngẫu nhiên, Worker) để chọn số nhân tố, so với eigenvalue > 1; (d) kiểm định Harman một nhân tố (tỷ lệ phương sai nhân tố đầu < 50%, ghi rõ hạn chế theo Podsakoff và cộng sự, 2003) và VIF toàn phần (Kock, 2015) — hai câu hội đồng rất hay hỏi; (e) Mahalanobis để phát hiện ngoại lai đa biến, cho chọn loại hay giữ, ghi số phiếu vào 4.1.
- **Effort:** S–M. **API:** không.

### 2.9 Kiểm tra chất lượng bảng hỏi trước khi gửi

- **Người khác làm:** Qualtrics ExpertReview chấm bảng hỏi trước khi phát: thời lượng dự kiến, tương thích di động, lạm dụng ma trận, lỗi khảo sát (https://www.qualtrics.com/support/survey-platform/survey-module/survey-checker/survey-methodology-compliance-best-practices/).
- **Thiết kế:** Trong Bộ khảo sát, thêm bảng "Kiểm tra trước khi gửi" chạy trên bảng hỏi đang soạn: ước thời lượng (khoảng 5–7 giây/câu Likert, 20–30 giây/câu mở), cảnh báo > 15 phút; câu có thể hai ý (chứa "và", "hoặc" giữa hai động từ/tính từ), câu phủ định kép, câu dẫn dắt ("Bạn có đồng ý rằng… rất tốt"); số câu đảo chiều mỗi thang đo; thang đo dưới 3 biến quan sát; nhãn thang Likert không nhất quán giữa các khối; số câu kiểm tra chú ý (khuyên 1–2); thiếu câu đồng ý tham gia và cam kết bảo mật; tỷ lệ câu so với cỡ mẫu dự kiến (nối với Máy tính cỡ mẫu). Mỗi cảnh báo dẫn tới bài hướng dẫn có sẵn (`cach-thiet-ke-bang-hoi`, `thang-do-likert`).
- **Effort:** S. **API:** không.

### 2.10 Lưu dự án và xuất cú pháp SPSS/R

- **Người khác làm:** JASP lưu file .jasp chứa dữ liệu và phân tích; jamovi lưu .omv và có syntax mode xuất mã R (https://www.jamovi.org/); PSPP chạy cú pháp tương thích SPSS.
- **Thiết kế:** (a) Nút "Lưu dự án" tải một file `.gnc.json` (cấu hình: nhóm khái niệm, câu đảo chiều, câu kiểm tra, lựa chọn EFA, giả thuyết; tuỳ chọn kèm dữ liệu) và "Mở dự án"; không dùng máy chủ. (b) Nút "Xuất cú pháp SPSS" (RELIABILITY, FACTOR, REGRESSION, T-TEST, ONEWAY đúng các lựa chọn đã dùng) và "Xuất mã R" (psych, lavaan/seminr). Giá trị chính: sinh viên và giảng viên tự chạy lại trên phần mềm chuẩn để đối chiếu, tăng độ tin cậy của công cụ và minh bạch kết quả. Ghi trong chương 4 phiên bản công cụ và ngày chạy.
- **Effort:** S. **API:** không.

### 2.11 Cỡ mẫu theo power cho các kiểm định khác

- **Người khác làm:** G*Power tính a priori, post hoc, sensitivity, compromise cho t, F, χ², z, exact; vẽ đồ thị power (https://www.psychologie.hhu.de/arbeitsgruppen/allgemeine-psychologie-und-arbeitspsychologie/gpower). jamovi jpower, JASP Power.
- **Thiết kế:** Thêm vào Máy tính cỡ mẫu: t-test độc lập/cặp, ANOVA một chiều, chi-square độ phù hợp/bảng chéo, tương quan, logistic (Hsieh, 1998). Cần phân phối t, F, χ² không trung tâm: tự cài bằng chuỗi Poisson-mixture (chuẩn trong tài liệu G*Power, Faul và cộng sự, 2007), kiểm với bảng G*Power 3.1 cho 20 trường hợp, đăng bảng đối chiếu lên trang. Thêm chế độ "độ nhạy": với N đã thu, effect size nhỏ nhất phát hiện được là bao nhiêu (hữu ích khi mẫu thu thiếu). Đồ thị power–N bằng SVG.
- **Effort:** M. **API:** không.

### 2.12 Hồi quy phân cấp, biến giả, logistic nhị phân

- **Người khác làm:** jamovi Linear Regression có "Model Builder" theo khối và ΔR²; JASP Regression có logistic; Laerd có hướng dẫn hierarchical/binomial logistic (trả phí).
- **Thiết kế:** (a) Hồi quy theo khối: khối 1 biến kiểm soát (nhân khẩu học, tự mã hoá biến giả với nhóm tham chiếu chọn được), khối 2 biến chính; bảng R², ΔR², F change, Sig. F change như SPSS. Bài `hoi-quy-tuyen-tinh-boi-spss` đã có mục "Thêm biến kiểm soát: hồi quy phân cấp", công cụ nên làm được đúng việc đó. (b) Logistic nhị phân (IRLS): B, SE, Wald, Exp(B) + CI, -2LL, Nagelkerke R², Hosmer–Lemeshow, bảng phân loại; cho các đề tài "có/không sử dụng", "có/không mua".
- **Effort:** M. **API:** không.

### 2.13 Ước lượng PLS-SEM từ mô hình đã vẽ

- **Người khác làm:** SmartPLS 4: PLS algorithm, bootstrapping, PLSpredict, IPMA, MGA (https://smartpls.com/documentation/algorithms-and-techniques); bản miễn phí giới hạn, bản đầy đủ trả phí. JASP có PLS-SEM trong module SEM. Ở Việt Nam PLS-SEM chiếm phần lớn khoá luận định lượng ngành kinh tế–quản trị.
- **Thiết kế:** Nút "Ước lượng với dữ liệu" trong Vẽ mô hình, nhận file đã lọc từ Phân tích dữ liệu. Thuật toán PLS lặp (path weighting, mode A cho reflective), outer loadings/weights, rho_A, CR, AVE, HTMT, inner VIF, hệ số đường dẫn, R², R² hiệu chỉnh, f²; bootstrap 5.000 trong Web Worker (t, p, CI percentile); Q²_predict đơn giản qua PLSpredict k-fold. Kết quả vẽ đè lên canvas (hệ số trên mũi tên, R² trong ô) và xuất bảng vào chương 4. Chỉ làm reflective + trung gian; formative và moderation hai giai đoạn để sau. Kiểm chứng với gói R `seminr` (GPL-3, chỉ dùng để đối chiếu, không nhúng mã) trên bộ dữ liệu mẫu công khai, đăng bảng đối chiếu.
- **Lưu ý trung thực:** HTMT/CR/AVE hiện tính qua PCA "có thể lệch ở chữ số thập phân thứ hai" so với SmartPLS (ghi trên trang công cụ); làm #13 xong thì thay bằng giá trị PLS thật.
- **Effort:** L. **API:** không.

### 2.14 Thẩm định nội dung và pilot

- **Người khác làm:** JASP Reliability có intraclass correlation, rater agreement (Cohen's/Fleiss' kappa) (https://jasp-stats.org/features/). Không công cụ phổ biến nào có CVI, dù nhiều khoá luận y, giáo dục, điều dưỡng ở Việt Nam phải báo cáo.
- **Thiết kế:** Công cụ nhỏ: nhập điểm 1–4 của 3–10 chuyên gia cho từng câu → I-CVI, S-CVI/Ave, S-CVI/UA (Lynn, 1986; Polit & Beck, 2006), kappa hiệu chỉnh cơ hội; Cohen's kappa cho 2 người mã hoá câu mở; ICC cho test–retest. Kèm phiếu dịch ngược (bản gốc – bản dịch – bản dịch ngược – nhận xét) xuất Word, nối với bài `dich-nguoc-back-translation-la-gi` và FAQ trang chủ đã khuyên dịch ngược + pilot 20–30 người.
- **Effort:** S. **API:** không.

### 2.15 Hồi quy dữ liệu bảng cho khoá luận tài chính

- **Người khác làm:** Stata `xtreg, fe/re`, `hausman`; Statology và UCLA OARC có hướng dẫn Stata/R cho panel (https://stats.oarc.ucla.edu/stata/); không có công cụ trình duyệt miễn phí nào làm trọn.
- **Thiết kế:** Nối với Tính chỉ số tài chính và 52 biến doanh nghiệp/ngân hàng: dữ liệu dạng dài (mã công ty, năm, biến). Chạy Pooled OLS, FEM (within), REM (Swamy–Arora), kiểm định F (Pooled vs FEM), Breusch–Pagan LM (Pooled vs REM), Hausman (FEM vs REM), VIF, Wald cho phương sai thay đổi, Wooldridge cho tự tương quan; nếu vi phạm, sai số chuẩn cụm theo công ty (thay cho FGLS, ghi rõ khác biệt với cách làm hay gặp ở Việt Nam). Bảng kết quả đặt 3 mô hình cạnh nhau như luận văn hay trình bày, và đoạn chương 4. Kiểm với Stata/R `plm` trên bộ Grunfeld công khai.
- **Effort:** L. **API:** không.

---

## 3. Vì sao Scribbr, Laerd, Statology xếp hạng tốt và được AI trích, và ta nên đổi gì

### 3.1 Mẫu nội dung quan sát được

| Mẫu | Scribbr | Laerd | Statology | UCLA OARC |
|---|---|---|---|---|
| Câu đầu là định nghĩa/trả lời trực tiếp | Có | Có | Có (1–2 câu rồi vào ví dụ) | Có |
| Một trang trả lời đúng một câu hỏi hẹp | Có | Có (mỗi kiểm định × phần mềm) | **Rất mạnh**: "How to X in Excel/R/Python/SPSS/TI-84", hàng nghìn trang cùng khuôn | Có |
| Ví dụ có dữ liệu cụ thể xuyên suốt | Có | Có (kịch bản, dữ liệu, ảnh từng bước) | Có (dataset nhỏ ngay trong bài) | Có (file dữ liệu tải được) |
| Giả định của kiểm định trước khi chạy | Một phần | **Có** (đánh số 1–6) | Một phần | Có |
| Giải thích từng con số trong output | Một phần | Có | Có ("Interpreting the Output") | **Chuẩn mực** (annotated output, chú thích đánh số) |
| Mẫu câu báo cáo | **Có** | **Có** ("Reporting the output") | Một phần | Một phần |
| Tác giả có tên + ngày sửa | **Có** ("Published on… by…, Revised on…") | Không | Có (Zach Bobbitt + "Last updated") | Có |
| Hộp "Cite this article" | **Có** (APA/MLA/Chicago sao chép được) | Có | Không | Có |
| FAQ cuối bài | **Có** | Không | Không | Có (trang FAQ riêng) |
| Công cụ gắn với bài | Có (citation generator, plagiarism) | Có (Test Selector) | Có (calculators) | Không |
| Cụm trang chủ đề (hub) + link "bài liên quan" | **Có** (knowledge base theo chủ đề) | Có | Có ("You Might Also Like") | Có |

Nguồn: https://statistics.laerd.com/spss-tutorials/one-way-anova-using-spss-statistics.php (đọc ngày 30/10/2026: 6 giả định đánh số, kịch bản khoá đào tạo, 8 bước có ảnh, phần nâng cao bị khoá), https://www.statology.org/one-way-anova-excel/ (ví dụ 30 sinh viên, mục "Interpreting the Output", byline và "Last updated"), https://stats.oarc.ucla.edu/other/mult-pkg/whatstat/. Scribbr chặn bot ngày khảo sát; mô tả theo cấu trúc bài Scribbr đã biết (chưa kiểm lại trực tiếp).

Vì sao AI hay trích: đoạn đầu tự đứng được (trích nguyên đoạn không cần ngữ cảnh), một trang khớp đúng một câu hỏi, con số và ngưỡng có nguồn nằm trong văn bản HTML, tác giả và ngày rõ ràng, và có sẵn câu trích dẫn trang. Theo `docs/GEO_PLAYBOOK.md`, Google không có yêu cầu riêng cho AI Overviews, nên những mẫu trên là thứ thực sự tạo khác biệt, không phải schema.

### 3.2 Ta đang ở đâu

Đã có: câu trả lời đầu trang, H2 dạng câu hỏi (playbook mục 1), FAQ + JSON-LD khớp nội dung, llms.txt, ngày cập nhật, bài hồi quy có cấu trúc gần Laerd (bộ dữ liệu ví dụ → thiết lập SPSS → từng bảng → giả định → câu mẫu chương 4). Thiếu: tác giả có tên, hộp trích dẫn trang, trang annotated output, cụm trang dài đuôi theo phần mềm, dữ liệu ví dụ tải được nối thẳng với công cụ, bằng chứng công cụ khớp SPSS.

### 3.3 Thay đổi cụ thể (theo thứ tự làm)

1. **Hộp "Trích dẫn trang này"** cuối mọi bài, trang thang đo, khái niệm, dữ liệu: APA 7 tiếng Việt và tiếng Anh, nút sao chép, kèm thẻ `citation_title`, `citation_author`, `citation_publication_date`, `citation_online_date` trong `<head>`. Sinh viên được phép trích trang tổng hợp thang đo/ngưỡng; mỗi lần trích là một backlink và một tín hiệu thực thể. Với trang thang đo, ghi rõ "trích bài gốc của thang đo, không trích trang này cho câu hỏi" để không khuyến khích trích nguồn thứ cấp sai chỗ. Effort S, làm trong `PostLayout.astro` và layout thang đo.
2. **Tác giả và người duyệt có tên thật** (họ tên, học vị, chuyên môn, link hồ sơ ORCID/Google Scholar) trên bài và trang `/phuong-phap-bien-soan/`, với `Person` trong JSON-LD; dòng "Biên soạn bởi… · Duyệt chuyên môn bởi… · Cập nhật…" như Scribbr. Hiện bài chỉ có `site.author`. Việc này cần chủ site quyết định người đứng tên.
3. **Trang "Ngưỡng chấp nhận các chỉ số"** một bảng duy nhất: alpha, tương quan biến–tổng, KMO, Bartlett, phương sai trích, hệ số tải, CR, AVE, HTMT, VIF, Durbin–Watson, R², f², Q², SRMR, CFI/TLI/RMSEA, skewness/kurtosis, mỗi dòng có trích dẫn gốc (DOI). Đây là loại trang AI trích nhiều nhất vì câu hỏi "X bao nhiêu là đạt" rất phổ biến. Dữ liệu đã nằm rải rác trong hướng dẫn công cụ; gom lại, xuất cả CSV.
4. **Trang giải thích output từng dòng (kiểu UCLA)**: "Đọc bảng Coefficients SPSS", "Đọc bảng Rotated Component Matrix", "Đọc Construct reliability and validity của SmartPLS", "Đọc bảng Path coefficients bootstrap". Bảng output dựng lại bằng HTML (không ảnh), mỗi ô đánh số, chú thích bên dưới. Mỗi trang kết thúc bằng câu báo cáo mẫu và nút "Chạy thử với dữ liệu này" mở công cụ.
5. **Cụm trang dài đuôi theo phần mềm (kiểu Statology)**: cùng một kiểm định × SPSS / SmartPLS / jamovi / Excel / Góc NC, cùng một bộ dữ liệu ví dụ tiếng Việt (ví dụ 250 phiếu ngân hàng số TAM). Mỗi trang ngắn (600–1.000 từ), một câu hỏi. Sinh tự động khung từ một tệp dữ liệu, nhưng nội dung giải thích viết tay và kiểm số liệu, tránh trang mỏng hàng loạt.
6. **Bộ dữ liệu ví dụ công khai** `/du-lieu/mau-khao-sat/…` (CSV + mô tả biến + giấy phép CC BY 4.0, `Dataset` JSON-LD) dùng chung cho mọi bài và công cụ, có kết quả SPSS chuẩn kèm theo. Laerd và UCLA đều neo bài vào dữ liệu cụ thể; dataset còn được Google Dataset Search lập chỉ mục.
7. **Bảng đối chiếu "khớp SPSS/SmartPLS"** trên mỗi trang công cụ: chạy bộ dữ liệu mẫu, đặt kết quả của công cụ cạnh SPSS 29/SmartPLS 4/R với số chữ số trùng khớp. Là bằng chứng gốc chỉ site này có, đúng mục 5 "Dữ liệu riêng" của playbook, và trả lời câu hỏi đầu tiên của giảng viên: "công cụ này có đúng không".
8. **Mục "Giả định" đánh số** đầu mọi bài kiểm định (kiểu Laerd), mỗi giả định có một câu "kiểm tra bằng…" link tới đúng phần của công cụ.
9. **Hub theo chủ đề**: trang `/huong-dan/phan-tich-dinh-luong/` liệt kê theo luồng (làm sạch → độ tin cậy → EFA → CFA/PLS → hồi quy → khác biệt nhóm), giống knowledge base của Scribbr; mỗi bài có khối "Bài tiếp theo trong chuỗi". Hiện danh sách bài là phẳng theo ngày.
10. **FAQ cuối bài lấy từ câu hỏi thật** (Search Console, nhóm Facebook khoá luận), 3–5 câu, câu trả lời 40–60 từ, chỉ thêm `FAQPage` khi câu hỏi hiển thị trên trang (đúng playbook mục 1.10).
11. **Song ngữ thuật ngữ** nhất quán ở lần đầu ("hệ số tải nhân tố (factor loading)") và trang tiếng Anh tối thiểu cho các công cụ (tiêu đề, mô tả, hướng dẫn): truy vấn tiếng Anh từ sinh viên Việt Nam và AI trả lời bằng tiếng Anh vẫn có thể trích công cụ.
12. **Không làm**: quiz/khảo sát chặn nội dung, nội dung sau tường đăng ký (Laerd khoá phần nâng cao làm giảm khả năng AI trích phần đó), trang sinh tự động không kiểm số liệu.

---

## Phụ lục: kiểm tra API ngày 30/10/2026 (`curl` với `Origin: https://growth547.github.io`)

| API | HTTP | CORS | Header giới hạn quan sát |
|---|---|---|---|
| `api.crossref.org/works/{doi}` | 200 | `*` | `x-rate-limit-limit: 5`, `x-rate-limit-interval: 1s` |
| `api.openalex.org/works?search=…` (không key) | 200 | `*` | `X-RateLimit-Limit-USD: 0.1`, `X-RateLimit-Cost-USD: 0.001` |
| `api.semanticscholar.org/graph/v1/paper/DOI:…` | 200 | `*` | không có |
| `openlibrary.org/isbn/{isbn}.json` | 302 → 200 | `*` | không có |
| `api.unpaywall.org/v2/{doi}?email=` | 422 với email giả | `*` | Không dùng: OpenAlex đã có trường OA cùng nguồn (Unpaywall thuộc OurResearch) |
| `api.worldbank.org/v2/…` | 200 | `*` | không có |
