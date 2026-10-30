# Nhu cầu tính năng mới cho Góc Nghiên Cứu

Nghiên cứu ngày 30/10/2026. Chỉ dùng nguồn đọc được mà không cần đăng nhập. Mục tiêu: tìm những khâu sinh viên Việt Nam còn vướng khi làm khoá luận, rồi đề xuất 15–20 tính năng, công cụ hoặc loại nội dung mà site **chưa có**, xếp theo thứ tự ưu tiên.

## 0. Site hiện có gì (để tránh làm trùng)

Theo trang chủ, `/cong-cu/` và `llms.txt` (https://gocnghiencuu.com/):

- **9 công cụ:** Bộ khảo sát khoá luận, Phân tích dữ liệu + chương 4 (Cronbach, EFA, tương quan, hồi quy), Vẽ mô hình, Chọn phương pháp phân tích, Máy tính cỡ mẫu, Trích dẫn APA 7, Cronbach's alpha, Chỉ số tài chính từ BCTC, Thư viện thang đo.
- **Nội dung:** 60 thang đo gốc (757 biến quan sát), khoảng 165 khái niệm đo lường, 40 trang so sánh khái niệm, 18 mẫu bảng hỏi, 204 chỉ số World Bank, biến nghiên cứu tài chính, 23 bài viết (gần như toàn bộ về bảng hỏi, mẫu, SPSS cơ bản).
- **Genius Data:** chỉ xuất hiện một lần, là link affiliate ở footer. Bước "Thu mẫu" trên trang chủ dẫn tới bài viết chứ không dẫn tới dịch vụ. Đây là lỗ hổng chuyển đổi lớn nhất hiện tại.
- `docs/CONTENT_BACKLOG.md` đã có các **bài viết** về PLS-SEM, HTMT, biến trung gian, panel FEM/REM, tổng quan tài liệu, chương 5, đề cương. Báo cáo này nói về **công cụ và loại nội dung**, các bài đó dùng làm trang dẫn vào công cụ.

Có thể nói gọn: site đang mạnh ở đoạn giữa (bảng hỏi → cỡ mẫu → Cronbach/EFA/hồi quy) và gần như trống ở **đầu quy trình** (chọn đề tài, tổng quan, khoảng trống), **phân tích nâng cao** (SEM, trung gian/điều tiết, dữ liệu bảng), **cuối quy trình** (chương 5, định dạng, đạo văn/AI, bảo vệ).

## 1. Phương pháp và giới hạn

- **Google Autocomplete** (`suggestqueries.google.com/complete/search?client=firefox&hl=vi&gl=vn&q=…`): khoảng 130 hạt giống, mở rộng 2 cấp (4–5 gợi ý đầu của mỗi hạt giống). Autocomplete cho biết truy vấn có tồn tại và phổ biến, **không cho biết lượng tìm kiếm**.
- **Tiêu đề và lượt xem YouTube:** đọc `ytInitialData` của trang kết quả tìm kiếm công khai. Lượt xem là số cộng dồn, video cũ có lợi thế.
- **Trang dịch vụ** (phamlocblog.com, xulysolieu.info): cho biết người ta trả tiền cho việc gì.
- **Quy định của trường:** các file hướng dẫn trình bày công khai.
- **Giới hạn:** Voz và các nhóm Facebook/Zalo cần đăng nhập hoặc bị chặn bot, công cụ tìm kiếm không trả về thread nào. Vì vậy bằng chứng từ diễn đàn còn mỏng. Không tìm thấy văn bản chính thức nào của trường Việt Nam quy định ngưỡng nội dung AI.

## 2. Bằng chứng theo từng khâu

### 2.1 Chọn đề tài, đề cương, chương 1
- Autocomplete "đề tài khóa luận" trả về toàn truy vấn **theo ngành và theo trường**: "đề tài khóa luận tốt nghiệp ngành kinh doanh quốc tế / luật kinh tế / thương mại điện tử / marketing / tài chính / logistics / ngân hàng", "đề tài khoá luận tốt nghiệp kế toán", "đề tài khóa luận tốt nghiệp ueh".
- "đề tài nghiên cứu khoa học về kinh tế / tâm lý / mạng xã hội / kinh tế xanh", "tên đề tài nghiên cứu khoa học dạng giải pháp".
- Chương 1 có rất nhiều truy vấn dạng "… là gì" và "cách viết …": "cách viết lý do chọn đề tài khóa luận", "cách viết mục tiêu nghiên cứu đề tài", "mục tiêu nghiên cứu tổng quát là gì", "câu hỏi nghiên cứu và giả thuyết nghiên cứu", "phạm vi không gian nghiên cứu là gì", "viết đề cương khóa luận tốt nghiệp", "ai viết đề cương nghiên cứu khoa học".
- YouTube: "QUY TRÌNH TÌM KIẾM TÊN ĐỀ TÀI NGHIÊN CỨU KHOA HỌC, KHÓA LUẬN TỐT NGHIỆP." **33.950** lượt xem (https://www.youtube.com/watch?v=iO8nHt-L_Mo). "Cách làm Lý do chọn đề tài bài Tiểu luận, NCKH, Báo cáo...." **40.463** (https://www.youtube.com/watch?v=AGByQyTf57M). "Quy trình tìm kiếm được tên đề tài … Part 1" **15.440** (https://www.youtube.com/watch?v=Co5biVLXnSs).

### 2.2 Tổng quan tài liệu, khoảng trống, lý thuyết nền
- Autocomplete: "cách viết tổng quan nghiên cứu trong và ngoài nước", "cách viết tổng quan tình hình nghiên cứu", "tổng quan tài liệu mẫu", "khoảng trống nghiên cứu là gì", "khoảng trống nghiên cứu mẫu", "khoảng trống nghiên cứu đề tài là gì", "lý thuyết nền là gì", "lý thuyết nền tpb", "khung lý thuyết nền là gì", "mô hình nghiên cứu sor", "mô hình nghiên cứu có biến kiểm soát".
- Tìm tài liệu: "cách tìm tài liệu tham khảo nước ngoài", "tìm bài báo trên scopus", "cách tìm bài báo khoa học tiếng việt", "tìm bài báo bằng doi", "scopus q1 là gì", "vjol hoặc google scholar là gì", "sci hub extension chrome".
- YouTube: "CÁCH TÌM TÀI LIỆU NGHIÊN CỨU KHOA HỌC // Search like a Scholar" **240.526** (https://www.youtube.com/watch?v=hb5L5x-G4tM). "Cách nhanh nhất viết tổng quan tài liệu nghiên cứu khoa học" **77.751** (https://www.youtube.com/watch?v=66MqN2b9w6M). "Làm tổng quan nghiên cứu (literature review) với AI" **73.859** (https://www.youtube.com/watch?v=abXVfIVrcxE). "HƯỚNG DẪN VIẾT TỔNG QUAN NGHIÊN CỨU TRONG ĐỀ CƯƠNG" **35.656** (https://www.youtube.com/watch?v=geDm-vSCFcI). "Thu thập bài báo từ Scopus và phân tích với VosViewer" **21.145** (https://www.youtube.com/watch?v=GXxlJ2KDz3g). "KHÁI NIỆM TÌM KIẾM Ở ĐÂU? VÀ VIẾT NHƯ THẾ NÀO ĐỂ KHÔNG BỊ ĐẠO VĂN?" **24.808** (https://www.youtube.com/watch?v=wsQPejySvA0).

### 2.3 Thu thập và làm sạch dữ liệu
- Autocomplete: "chạy số liệu gg form", "chạy số liệu khảo sát", "chạy dữ liệu khảo sát", "mua dữ liệu khảo sát", "phiếu khảo sát không hợp lệ", "số liệu mẫu chạy spss", "số liệu chạy spss đẹp", "cách fix số liệu chạy spss", "thuê chạy số liệu spss". Ba truy vấn gần cuối là tín hiệu rủi ro (xem 2.7).
- Lưu ý: "cách làm sạch dữ liệu" trên Google bị lấn át bởi nghĩa VNeID/đảng viên. Vì vậy nội dung nên nhắm tới "lọc phiếu khảo sát", "dữ liệu google form sang spss".
- Bài HUTECH ghi nhận sinh viên khó thu số liệu vì doanh nghiệp ít hợp tác và kinh phí hạn chế, sau đó còn vướng khâu xử lý (https://file1.hutech.edu.vn/file/editor/khoakhxhnv/Tuan-Nga.pdf).

### 2.4 Phân tích: SPSS nâng cao, AMOS, SmartPLS, Stata, EViews
- Autocomplete SmartPLS/AMOS: "chạy bootstrapping smartpls", "chạy mga smartpls", "htmt trong smartpls là gì", "srmr trong smartpls là gì", "smartpls và spss khác nhau như thế nào", "chạy cfa amos", "chạy bootstrap amos", "cách chạy sem trên amos", "kiểm định biến trung gian spss", "biến trung gian biến điều tiết là gì", "pls sem model fit criteria".
- Autocomplete dữ liệu bảng và chuỗi thời gian: "chạy stata dữ liệu bảng", "fem rem stata", "mô hình ols fem rem là gì", "system gmm stata xtabond2", "kiểm định phương sai sai số thay đổi trong stata", "cách khắc phục phương sai sai số thay đổi trong eview", "đa cộng tuyến trong stata", "ardl model in eviews".
- Autocomplete khâu kiểm định: "cách đọc kết quả hồi quy logistic trong spss", "hồi quy logistic đa biến trong spss", "welch anova là gì", "kiểm định tukey", "thống kê mô tả mẫu nghiên cứu".
- **Rào cản giấy phép phần mềm** (sinh viên tìm bản lậu): "spss for mac free", "smartpls 4 license key", "stata 17 serial number code authorization pdf", "stata download free for students", "eviews 12 student version serial number", "spss online", "chạy stata online".
- YouTube: "Hướng dẫn STATA | … phân tích dữ liệu trên STATA" **149.412** (https://www.youtube.com/watch?v=ghWSc6j1J6Q). "Mô hình hồi quy Pooled OLS, FEM, REM, FGLS trên STATA" **62.538** (https://www.youtube.com/watch?v=SI0HKRUappE). "Phân tích nhân tố khẳng định CFA trên AMOS" **58.074** (https://www.youtube.com/watch?v=CAhCfYTySFk). "Cách tạo dự án mới, nhập dữ liệu vào SMARTPLS 4" **48.039** (https://www.youtube.com/watch?v=xpmlQBTdh3U). "Cách chạy SMARTPLS 4: … Vẽ mô hình" **28.862** (https://www.youtube.com/watch?v=M-_pChJbL2w). "Cách chạy dữ liệu panel data" **27.454** (https://www.youtube.com/watch?v=Q4SaHNQ44FY). "Xử lý biến trung gian mediator trên SMARTPLS 4" **9.392** (https://www.youtube.com/watch?v=Ok0nE403G1M). "Hướng dẫn full SPSS từ nhập liệu, mã hóa, tất cả các kiểm định" **64.787** (https://www.youtube.com/watch?v=lXMT1FxFU74).
- **Khi kết quả không đạt:** YouTube "Phần 19: Cách xử lý Cronbach's Alpha thấp và biến gặp vấn đề trong SPSS" (https://www.youtube.com/watch?v=qge0RamLy4M), "Phần 20: Các lỗi phổ biến khi chạy Cronbach's Alpha" (https://www.youtube.com/watch?v=Y1rZao4Mfc0), "Cronbach alpha ở SPSS và Smart PLS khác nhau- Phần mềm nào tính sai?" (https://www.youtube.com/watch?v=EMqHKBCnVRM).

### 2.5 Viết chương 2–5
- Autocomplete: "cách viết chương 3 phương pháp nghiên cứu", "cách viết tiểu kết chương 1/2", "cách viết hàm ý quản trị", "đề xuất hàm ý quản trị", "hàm ý quản trị trong nghiên cứu khoa học là gì", "cách viết hạn chế của đề tài nghiên cứu", "hạn chế và hướng nghiên cứu tiếp theo", "đóng góp của đề tài nghiên cứu khoa học", "tóm tắt khóa luận tốt nghiệp", "abstract là gì trong luận văn", "lời cảm ơn khóa luận tốt nghiệp".
- YouTube về chương 5 gần như không có nội dung tiếng Việt tốt. Kết quả đầu tiên cho "viết chương 5 hàm ý quản trị" chỉ có **1.301** lượt xem, đăng 6 năm trước (https://www.youtube.com/watch?v=U4bwJheKtMM), các kết quả còn lại lạc đề. Đây là **khoảng trống cung**: nhu cầu có thật, nội dung tốt chưa có.

### 2.6 Đạo văn, AI, trích dẫn
- Autocomplete là cụm dày đặc nhất trong cả đợt khảo sát: "check đạo văn ueh", "check đạo văn ai tiếng việt", "turnitin có check ai tiếng việt không", "turnitin check ai tiếng việt được không", "đạo văn dưới bao nhiêu phần trăm", "check đạo văn ueh có lưu bài không", "check đạo văn turnitin có bị lưu bài không", "quy định kiểm tra đạo văn ueh", "kiểm tra đạo văn ussh / iuh / ctu", "cách giảm đạo văn turnitin", "giảm ai turnitin", "paraphrase tiếng việt tránh đạo văn", "paraphrase ai to human".
- YouTube: "Phần mềm chống đạo văn - cách chỉnh sửa khi 'dính' đạo văn" **89.098** (https://www.youtube.com/watch?v=r8C-WXwQ56M). "CHECK TURNITIN VÀ TƯ VẤN CÁCH VIẾT BÀI KHÔNG BỊ ĐẠO VĂN…" **53.628** (https://www.youtube.com/watch?v=pBzYuVq575o). "CHIÊU TRÒ LỪA GIẢM TỶ LỆ TRÙNG LẶP … CỦA NGƯỜI LÀM BÀI THUÊ" **47.755** (https://www.youtube.com/watch?v=2ZZRbrvRvDY).
- **Quy định trường:** theo trích đoạn kết quả tìm kiếm của file quy định quét Turnitin, Khoa Kinh tế ĐH SPKT TP.HCM (2023), trùng lặp không quá 40% toàn bài, không quá 10% từ một nguồn, quét tối đa 3 lần, dùng thủ thuật qua mặt thì 0 điểm (https://fe.hcmute.edu.vn/Resources/Docs/SubDomain/fe/Thông báo/2023-2024/Quy định về quét Turnitin KKT 04_03_2023.pdf, link hiện trả về 404, cần xác minh lại). Ngưỡng **mỗi trường một khác** và sinh viên đi tìm từng trường một.
- Trích dẫn: "trích dẫn apa 7th trong word", "trích dẫn tài liệu tham khảo ieee", "trích dẫn tài liệu tham khảo hcmue / ump / yds", "mendeley cite for word", "zoterobib". Công cụ APA hiện có đáp ứng một phần, IEEE và kiểu riêng của trường thì chưa có.

### 2.7 Định dạng theo quy định trường
- Autocomplete gần như toàn bộ gắn tên trường: "format khóa luận tốt nghiệp neu / ftu / ueh / tmu / uet / vnua", "trình bày khóa luận tốt nghiệp hub / hvnh / iuh", "quy định trình bày khóa luận tốt nghiệp ftu", "bìa tiểu luận iuh logo mới", "form tiểu luận iuh", "căn lề chuẩn khóa luận tốt nghiệp", "cách đánh số trang khóa luận trong word", "mục lục tự động bị lỗi", "mục lục tự động bị sai số trang".
- YouTube: "Cách tạo mục lục tự động trong word" **1.288.392** (https://www.youtube.com/watch?v=Ad31xhNMqoM). "Hướng dẫn căn lề, đánh số trang, làm bìa, mục lục tự động trên word | làm luận văn" **319.065** (https://www.youtube.com/watch?v=QVvDf20C2YE). "Cách căn chỉnh và định dạng bài tiểu luận, khóa luận đúng chuẩn" **76.683** (https://www.youtube.com/watch?v=ZX_SugMGTSE). "8 phút xong MỤC LỤC TỰ ĐỘNG cho … KLTN" **66.720** (https://www.youtube.com/watch?v=j1E-OITiQMo).
- Quy định thực tế khác nhau giữa các trường và khoa. NEU khoa CNTT dùng TNR 13, giãn dòng 1,3, lề trái 3,5 cm (https://fit.neu.edu.vn/post/mot-so-quy-dinh-viet-bao-cao-khoa-luan). HCMUS CTTT dùng giãn 1.5 lines, lề phải 2 cm (https://www.ctda.hcmus.edu.vn/wp-content/uploads/2022/06/CTTT_Quy-dinh-trinh-bay-KLTN-1.pdf). Ngoài ra còn UFM Marketing (https://khoamarketing.ufm.edu.vn/Resources/Docs/SubDomain/khoamarketing/TTTN/qui%20dinh%20trinh%20bay%202018.pdf), CTU (https://caf.ctu.edu.vn/images/upload/2026/TTS_HuongDan_ChiTiet_Viet_LVTN_2025.docx), Duy Tân, HCMUTE... Tất cả đều là file công khai, có thể số hoá thành dữ liệu có cấu trúc.

### 2.8 Bảo vệ
- Autocomplete: "slide bảo vệ khóa luận tốt nghiệp hub", "slide thuyết trình khóa luận tốt nghiệp neu", "kịch bản thuyết trình khóa luận tốt nghiệp", "câu hỏi phản biện khóa luận tốt nghiệp", "bảo vệ khóa luận có khó không", "phiếu nhận xét khóa luận tốt nghiệp", "slide bảo vệ đề cương luận văn thạc sĩ".
- YouTube: "NHỮNG LƯU Ý KHI RA HỘI ĐỒNG BẢO VỆ NCKH, KHÓA LUẬN TỐT NGHIỆP - PART 1." **28.816** (https://www.youtube.com/watch?v=eWHEb_nqbmQ). "KINH NGHIỆM BẢO VỆ KHÓA LUẬN ĐẠT ĐIỂM CAO" **13.336** (https://www.youtube.com/watch?v=RRwc-w1p3Rk). "Hướng dẫn bảo vệ khóa luận tốt nghiệp" **11.252** (https://www.youtube.com/watch?v=tnaTDCJjJQA). "RA HỘI ĐỒNG BẢO VỆ ĐỀ TÀI MÀ KHÔNG TRẢ LỜI ĐƯỢC THÌ NÓI SAO?" (https://www.youtube.com/watch?v=1xTc7asY6wk).

### 2.9 Người ta trả tiền cho việc gì (trang dịch vụ)
- **phamlocblog.com** (https://www.phamlocblog.com/p/dich-vu-spss.html): gói chạy SPSS từ 600.000đ (tương quan + hồi quy) đến 2.600.000đ (mô tả + Cronbach + EFA + Pearson + hồi quy + ANOVA/T-test). Lời chào hàng nhắm thẳng vào **kết quả không đạt**: thang đo dưới 0.6, "ma trận xoay lộn xộn", biến bị loại quá nhiều, mô hình không phù hợp, đa cộng tuyến. Trang còn nói sẽ "hỗ trợ dữ liệu" khi khách chưa có dữ liệu.
- **xulysolieu.info** (https://xulysolieu.info/): SPSS/AMOS/SmartPLS/Stata/EViews "từ 199K", hỗ trợ khoá luận và luận văn, check đạo văn kèm chỉnh sửa, bán "dữ liệu mẫu", tạo bộ dữ liệu theo mô hình khi khách không có dữ liệu, thu thập dữ liệu vĩ mô/tài chính và form khảo sát online.
- Trên YouTube có kênh dịch vụ quảng cáo công khai: "ĐƠN GIẢN- Hướng dẫn sửa số liệu SPSS để chạy Cronbach's Alpha kết quả đẹp. Dịch vụ SPSS-AMOS" **4.601** (https://www.youtube.com/watch?v=mDewQLFrO2U), "Chạy spss khóa luận … | Số liệu xấu thì alo mình" (https://www.youtube.com/watch?v=fbFyt3tREHI).
- Autocomplete: "dịch vụ chạy spss" (kèm tên các blog), "chạy stata thuê", "giá viết thuê khóa luận tốt nghiệp", "thuê người làm khóa luận tốt nghiệp".
- **Kết luận:** nhu cầu trả tiền mạnh nhất nằm ở (a) chạy phân tích nâng cao, (b) xử lý khi kết quả không đạt, (c) không có dữ liệu. Ở cả ba chỗ, thị trường đang đáp ứng bằng cách **sửa số liệu hoặc tạo dữ liệu**. Đây là cơ hội định vị rõ ràng cho Góc Nghiên Cứu và Genius Data: chẩn đoán trung thực, kèm thu mẫu thật.

## 3. Danh sách xếp hạng (18 mục)

Cách xếp hạng: độ mạnh nhu cầu × độ khớp với site hiện có × khả năng dẫn sang thu mẫu trên Genius Data × rủi ro liêm chính (càng thấp càng tốt). Công sức: S (≤3 ngày), M (1–2 tuần), L (>2 tuần).

| # | Tên | Vấn đề giải quyết | Bằng chứng nhu cầu | Công sức | Liên kết Genius Data | Rủi ro |
|---|---|---|---|---|---|---|
| 1 | **Bác sĩ kết quả: "Chạy không đạt thì làm gì"** | Cronbach thấp, EFA ma trận xoay lộn xộn, hồi quy không ý nghĩa hoặc sai dấu, VIF cao | Dịch vụ bán đúng nỗi đau này (2.9). Video "xử lý Cronbach thấp", "lỗi phổ biến". Autocomplete "cách fix số liệu chạy spss", "số liệu chạy spss đẹp" | M | **Rất mạnh.** Nguyên nhân gốc thường là phiếu rác, sai đối tượng, mẫu nhỏ, nên chẩn đoán dẫn tới gợi ý thu bổ sung hoặc thu lại có lọc chất lượng | Cao nếu làm sai. Phải tuyệt đối không "tối ưu" kết quả (xem đặc tả) |
| 2 | **Làm sạch dữ liệu khảo sát: Google Forms → SPSS** | Mã hoá, đảo biến ngược, lọc phiếu trả lời một chiều/quá nhanh/không qua câu kiểm tra, xuất .sav/.csv kèm bảng mã | "chạy số liệu gg form", "phiếu khảo sát không hợp lệ", "chạy dữ liệu khảo sát". Bài "lọc phiếu" là một trong các bài đã có | M | **Rất mạnh.** Báo cáo cho biết bao nhiêu phiếu hợp lệ còn thiếu so với cỡ mẫu, rồi gợi ý thu phần còn thiếu. Bộ lọc dùng chung logic chất lượng với Genius Data | Thấp. Chỉ được loại phiếu theo quy tắc khai báo trước, không loại để "làm đẹp" kết quả |
| 3 | **Phân tích SEM trên trình duyệt: CFA/PLS-SEM + trung gian/điều tiết** | Không có hoặc không mua được SmartPLS/AMOS. Không biết đọc AVE, CR, HTMT, bootstrap, gián tiếp | Video SmartPLS 48k/28k, AMOS 58k, mediator 9k. Autocomplete "smartpls 4 license key", "chạy bootstrapping smartpls", "kiểm định biến trung gian spss" | L | Mạnh. PLS-SEM/CB-SEM cần mẫu lớn hơn, nối máy tính cỡ mẫu với thu mẫu | Trung bình. Output là bảng + hướng dẫn đọc, không viết hộ thảo luận |
| 4 | **Ma trận tổng quan tài liệu + công cụ tìm khoảng trống** | Không biết tổng hợp nghiên cứu trước, không nêu được khoảng trống | Video 240k/77k/73k/35k. Autocomplete "khoảng trống nghiên cứu mẫu", "tổng quan trong và ngoài nước" | M–L | Trung bình. Khoảng trống về bối cảnh (VN, đối tượng mới) dẫn tới cần khảo sát đối tượng đó | Trung bình. Không tạo trích dẫn ảo, chỉ dùng metadata thật từ DOI |
| 5 | **Kiểm tra định dạng theo trường + mẫu Word theo trường** | Mỗi trường/khoa một quy định. Lỗi lề, giãn dòng, số trang, mục lục, bìa | Autocomplete "format khóa luận … neu/ftu/ueh/tmu/uet/vnua/hub/hvnh/iuh". Video mục lục 1,29 triệu, căn lề 319k | M | Yếu, nhưng **traffic lớn nhất** và lặp theo mùa, dùng làm cửa vào phễu | Thấp |
| 6 | **Trợ lý dữ liệu bảng: Pooled/FEM/REM/GMM + mã Stata/EViews/R** | Chọn mô hình, Hausman, kiểm định khuyết tật, khắc phục | Video Stata 149k, 62k, 20k×2. Autocomplete "fem rem stata", "system gmm stata xtabond2", "khắc phục phương sai sai số thay đổi eview" | M | Không có (dữ liệu thứ cấp). Bổ trợ cho công cụ chỉ số tài chính và World Bank | Thấp |
| 7 | **Tìm đề tài + kiểm tra tính khả thi** | Không biết chọn đề tài theo ngành. Chọn đề tài không thu được mẫu hoặc không có thang đo | Autocomplete "đề tài khóa luận tốt nghiệp ngành X" (≥8 ngành). Video 34k, 40k | M | **Mạnh.** Bước "khả thi" ước lượng đối tượng có tiếp cận được không, rồi dẫn tới Genius Data cho đối tượng khó | Thấp–trung bình. Gợi ý hướng, không giao đề hoàn chỉnh |
| 8 | **Kiểm tra trích dẫn và trùng lặp tự thân (không phải "giảm AI")** | Sợ đạo văn, không biết ngưỡng của trường, trích dẫn thiếu | Cụm autocomplete dày nhất ("check đạo văn ueh", "turnitin check ai tiếng việt"). Video 89k/53k/47k | M | Yếu | **Cao.** Chỉ làm: bảng ngưỡng theo trường, tìm câu chưa có trích dẫn, đối chiếu in-text với danh mục TLTK, hướng dẫn paraphrase đúng. Không làm humanizer |
| 9 | **Bộ chuẩn bị bảo vệ: khung slide + ngân hàng câu hỏi hội đồng** | Không biết làm slide, sợ câu hỏi phản biện | Autocomplete "slide bảo vệ … hub/neu", "câu hỏi phản biện khóa luận tốt nghiệp", "kịch bản thuyết trình". Video 28k/13k/11k | S–M | Yếu (câu hỏi về mẫu có thể dẫn về bài "hội đồng hỏi gì về khảo sát") | Thấp |
| 10 | **Khung chương 5: từ hệ số đến hàm ý, hạn chế, hướng tiếp theo** | Không biết nối kết quả với hàm ý quản trị | Autocomplete "cách viết hàm ý quản trị", "hạn chế và hướng nghiên cứu tiếp theo". Gần như không có video tốt (2.5) | S | Yếu–trung bình. Hạn chế "mẫu thuận tiện" dẫn tới gợi ý mẫu tốt hơn cho lần sau | Trung bình. Chỉ đưa khung và câu hỏi gợi mở dựa trên kết quả thật, không sinh đoạn văn hoàn chỉnh |
| 11 | **Trình tạo đề cương / chương 1 theo checklist** | Lý do, mục tiêu, câu hỏi, đối tượng, phạm vi lộn xộn và không khớp nhau | Rất nhiều truy vấn "… là gì", "cách viết …" (2.1) | S | Trung bình. Phạm vi + đối tượng khảo sát nối sang bộ khảo sát | Thấp (checklist kiểm tra tính nhất quán) |
| 12 | **Thư viện lý thuyết nền** (TPB, TAM, SOR, UTAUT, ECM, SCT…) | Không biết chọn và trích lý thuyết nền | "lý thuyết nền là gì", "lý thuyết nền tpb", "mô hình nghiên cứu sor", "khung lý thuyết nền" | S | Trung bình. Mỗi lý thuyết liên kết thang đo và mẫu bảng hỏi | Thấp |
| 13 | **Tra cứu tạp chí và nguồn tài liệu** (Scopus Q, danh mục HĐGSNN, VJOL) | Không phân biệt nguồn uy tín, không tìm được bài tiếng Việt | "scopus q1 là gì", "cách tìm bài báo khoa học tiếng việt", "tìm bài báo bằng doi". Video 240k, 11k | S–M | Không | Thấp. Không gợi ý Sci-Hub |
| 14 | **Hướng dẫn phân tích bằng phần mềm miễn phí** (jamovi/JASP/R + công cụ web của site) | Không có giấy phép SPSS/SmartPLS/Stata, dùng Mac | "spss for mac free", "smartpls 4 license key", "stata … serial number", "eviews student version" | S | Gián tiếp (giữ người dùng trong phễu) | Thấp. Không link bản crack |
| 15 | **Mở rộng công cụ phân tích: logistic, ANOVA/Welch, t-test, chi-square kèm hướng dẫn đọc** | Đề tài có biến phụ thuộc nhị phân, so sánh nhóm | "cách đọc kết quả hồi quy logistic trong spss", "welch anova là gì", "kiểm định tukey" | M | Trung bình (so sánh nhóm cần đủ mẫu mỗi nhóm, nối với hạn ngạch mẫu) | Thấp |
| 16 | **Bộ công cụ định tính: hướng dẫn phỏng vấn bán cấu trúc + bảng mã hoá** | Nghiên cứu sơ bộ định tính, phỏng vấn chuyên gia | "phỏng vấn sâu bán cấu trúc", "nghiên cứu định tính sơ bộ là gì" | M | Trung bình (tuyển người phỏng vấn, nếu Genius Data hỗ trợ) | Thấp. Không tạo transcript giả |
| 17 | **Lấy dữ liệu BCTC và vĩ mô cho đề tài tài chính** (hướng dẫn nguồn + mẫu Excel) | Không biết lấy BCTC nhiều năm, nhiều công ty | "lấy dữ liệu báo cáo tài chính", "tải báo cáo tài chính excel / cafef", "mua dữ liệu tài chính" | M | Không | Trung bình (bản quyền dữ liệu, xem `FIRM_DATA_LEGAL.md`) |
| 18 | **Lịch tiến độ khoá luận đếm ngược từ ngày bảo vệ** | Trễ hạn, dồn việc, thu mẫu sát hạn | Tuổi Trẻ về tốt nghiệp không đúng hạn (https://tuoitre.vn/vi-sao-sinh-vien-ngay-cang-kho-tot-nghiep-dung-han-20251128102203036.htm). Nghiên cứu 309 SV kinh tế TP.HCM: khó khăn chủ quan và vai trò GVHD là yếu tố chính (https://vjol.info.vn/vhu/article/view/55446) | S | **Mạnh.** Mốc "thu mẫu" có ngày cụ thể, nhắc trước, CTA Genius Data đúng thời điểm | Thấp |

Ngoài bảng: mẫu lời cảm ơn, tóm tắt và abstract (autocomplete nhiều nhưng giá trị thấp, chỉ cần vài trang nội dung S). Hỗ trợ trích dẫn IEEE và kiểu riêng của trường (UMP, YDS, HCMUE) nên làm như mở rộng công cụ APA hiện có.

## 4. Đặc tả chi tiết top 5

### #1 Bác sĩ kết quả: "Chạy không đạt thì làm gì?"

**Mục tiêu:** Khi sinh viên có kết quả "xấu", cho họ một chẩn đoán trung thực và các lựa chọn **hợp lệ về phương pháp**, thay vì đi thuê "sửa số liệu".

**Đầu vào:** file dữ liệu (dùng lại bộ đọc Excel/CSV/.sav của công cụ chương 4) + khai báo cấu trúc thang đo (lấy từ bộ khảo sát nếu sinh viên tạo bảng hỏi tại site) + loại vấn đề sinh viên chọn: Cronbach < 0.6/0.7, EFA không hội tụ hoặc tách nhân tố, KMO/Bartlett không đạt, hồi quy R² thấp, biến không ý nghĩa, sai dấu, VIF cao, phần dư không chuẩn.

**Các bước kiểm tra tự động (quy tắc tất định, không dùng LLM):**
1. **Chất lượng phiếu:** tỷ lệ phiếu trả lời một chiều (độ lệch chuẩn trong khối = 0), thời gian hoàn thành bất thường (nếu có cột timestamp), phiếu trùng lặp, giá trị ngoài thang, missing. Dùng chung quy tắc với công cụ #2.
2. **Biến đảo chiều chưa mã hoá ngược:** tương quan item–total âm thì báo "có thể là câu hỏi đảo nghĩa, kiểm tra bảng hỏi".
3. **Cỡ mẫu so với yêu cầu:** N/biến quan sát, N theo Hair, so với máy tính cỡ mẫu.
4. **Phân phối:** trần/sàn (>80% chọn cùng mức), phương sai gần 0.
5. **Cấu trúc:** cross-loading, item tải lên nhân tố khác, gợi ý hai khái niệm có thể chồng lấn (dẫn tới trang so sánh khái niệm).
6. **Hồi quy:** VIF, tương quan cao giữa các biến độc lập, outlier (Cook's D), dấu ngược với giả thuyết.

**Đầu ra:** báo cáo xếp theo mức độ nghiêm trọng, mỗi phát hiện có:
- giải thích bằng tiếng Việt và nguồn trích dẫn (Hair et al. 2019, Nunnally & Bernstein 1994, Field…);
- **các lựa chọn hợp lệ**: loại biến quan sát theo quy tắc báo trước (item-total < 0.3, giữ ≥3 item/khái niệm) **và ghi lại trong luận văn**; kiểm tra lại mã hoá; thu bổ sung mẫu đúng đối tượng; báo cáo trung thực giả thuyết bị bác bỏ (kèm câu mẫu "giả thuyết không được ủng hộ" và cách thảo luận ở chương 5); dùng phương pháp phù hợp hơn (ví dụ ω thay α, PLS-SEM cho mẫu nhỏ, kèm cảnh báo);
- **nhật ký thay đổi**: mọi biến hoặc phiếu bị loại được ghi lại để đưa vào chương 3/4 (minh bạch với hội đồng).

**Nối sang Genius Data:** khi phát hiện (1) tỷ lệ phiếu kém > X%, hoặc (3) mẫu hợp lệ < ngưỡng, hiển thị khối "Thu thêm N phiếu đúng đối tượng, có lọc chất lượng" với N tính sẵn, link có UTM `utm_content=result-doctor`. Không hiển thị CTA khi vấn đề không liên quan tới dữ liệu (ví dụ sai dấu do lý thuyết).

**Rào chắn liêm chính (bắt buộc):**
- Không có chức năng sửa, sinh, nội suy hay "cân" giá trị trả lời. Không thử tổ hợp loại biến hoặc loại phiếu để tìm kết quả đạt (đó là p-hacking). Công cụ chỉ đánh giá theo quy tắc khai báo trước và luôn hiển thị kết quả trước và sau.
- Trang có đoạn giải thích vì sao "làm đẹp số liệu" là gian lận và hội đồng phát hiện thế nào (phân phối quá đẹp, α > 0.95 toàn bộ…).

**SEO:** trang đích cho "cronbach alpha thấp phải làm sao", "efa không hội tụ", "hồi quy không có ý nghĩa thống kê", "biến bị loại quá nhiều". Autocomplete các cụm này trả về rỗng, có nghĩa là lượng tìm kiếm dạng câu còn thấp, nhưng video và dịch vụ cho thấy nhu cầu có thật. Nên nhắm thêm truy vấn ngắn như "cronbach alpha thấp".

**Công sức:** M (phần lớn thống kê đã có trong công cụ chương 4, chủ yếu là thêm quy tắc, giao diện và nội dung).

### #2 Làm sạch dữ liệu khảo sát: Google Forms → SPSS

**Mục tiêu:** biến file xuất từ Google Forms/Microsoft Forms/Genius Data thành bộ dữ liệu sạch, có bảng mã, sẵn để chạy.

**Luồng:**
1. Tải lên CSV/XLSX. Tự nhận cột timestamp, câu sàng lọc, câu Likert dạng chữ ("Hoàn toàn đồng ý"…) và đổi sang số theo mapping người dùng xác nhận.
2. Gán cột vào khái niệm: nếu bảng hỏi tạo bằng bộ khảo sát của site, nhập mã biến tự động (TAM1, PU2…), nếu không thì kéo thả.
3. Đánh dấu câu đảo chiều để mã hoá ngược.
4. Quy tắc lọc **khai báo trước**: trượt câu sàng lọc, trượt câu kiểm tra chú ý, trả lời một chiều theo khối, thời gian < ngưỡng (mặc định theo số câu × 2 giây, cho chỉnh), trùng lặp, thiếu > X%. Mỗi quy tắc bật/tắt được, có trích dẫn (Meade & Craig 2012; Curran 2016).
5. **Báo cáo:** N thô → N sau từng quy tắc (dạng phễu), so với cỡ mẫu mục tiêu.
6. **Xuất:** CSV/XLSX sạch, file .sav (thư viện ghi SAV phía client hoặc CSV + cú pháp SPSS `VALUE LABELS`), bảng mã hoá (nối với bài "bảng mã hoá thang đo"), đoạn văn mô tả quy trình làm sạch cho chương 3. Đoạn văn này là **mô tả thủ tục** có số liệu thật, không phải nội dung học thuật thay thế.
7. Nút "Chuyển sang phân tích" mở công cụ chương 4 và Bác sĩ kết quả với dữ liệu đã nạp.

**Nối sang Genius Data:** nếu N sạch < mục tiêu thì hiện "Còn thiếu N phiếu", CTA thu bổ sung với cùng bộ lọc. Nếu tỷ lệ loại > 30% thì gợi ý nguồn mẫu có kiểm soát chất lượng. Ghi chú này dựa trên số liệu thật nên không phải quảng cáo vu vơ.

**Rủi ro:** người dùng có thể vặn ngưỡng để loại phiếu "xấu". Giảm thiểu bằng cách: ngưỡng phải chọn **trước** khi xem kết quả phân tích (khoá cấu hình khi đã sang bước phân tích, đổi thì ghi log), và xuất kèm log.

**Công sức:** M. Xử lý hoàn toàn phía trình duyệt, không gửi dữ liệu lên server (điểm bán hàng về quyền riêng tư).

### #3 Phân tích SEM trên trình duyệt (CFA, PLS-SEM, trung gian và điều tiết)

**Mục tiêu:** sinh viên vẽ mô hình bằng công cụ vẽ mô hình hiện có, tải dữ liệu lên rồi nhận kết quả mô hình đo lường và mô hình cấu trúc, kèm hướng dẫn đọc từng bảng.

**Phạm vi phiên bản 1 (PLS-SEM trước, vì phổ biến trong khoá luận và không cần giả định phân phối):**
- **Mô hình đo lường (reflective):** outer loadings, Cronbach α, rho_A, CR, AVE, Fornell–Larcker, HTMT (ngưỡng 0.85/0.90, Henseler 2015), VIF item.
- **Mô hình cấu trúc:** path coefficients, bootstrap (5.000 mẫu, chạy trong Web Worker, có seed để tái lập), t, p, khoảng tin cậy, R², f², Q² (blindfolding hoặc PLSpredict để sau), SRMR.
- **Trung gian:** tác động gián tiếp cụ thể và tổng tác động gián tiếp có bootstrap CI, phân loại theo Zhao et al. (2010).
- **Điều tiết:** hai giai đoạn hoặc tích chỉ báo, kèm biểu đồ simple slope.
- Phiên bản 2: CFA/CB-SEM (lavaan-style, chỉ số CFI/TLI/RMSEA/SRMR theo Hu & Bentler 1999), MGA.
- **Kiểm chứng:** so kết quả với SmartPLS 4/seminr (R) trên 3–5 bộ dữ liệu công khai (ví dụ bộ corporate reputation của Hair et al.), sai số < 0.001 trên hệ số. Nên ghi bộ kiểm thử thành fixture.

**Đầu ra:** bảng theo định dạng APA, hình mô hình có hệ số (tái dùng renderer của công cụ vẽ mô hình), mỗi bảng có "Đọc bảng này thế nào" và ngưỡng có trích dẫn, xuất Word. Không sinh đoạn "thảo luận".

**Nối sang Genius Data:** chuỗi Vẽ mô hình → Cỡ mẫu (PLS-SEM, theo inverse square root/G*Power) → Bộ khảo sát → **thu mẫu** → Làm sạch (#2) → SEM. Trong máy tính cỡ mẫu, khi mô hình có trung gian/điều tiết thì nhắc mẫu lớn hơn và đặt CTA.

**SEO và nội dung đi kèm:** các bài trong backlog (pls-sem-la-gi-smartpls, htmt-la-gi, ave-cr-la-gi, bien-trung-gian-dieu-tiet, cfa-amos-chi-so-phu-hop) làm trang dẫn vào công cụ. Bắt thêm truy vấn "smartpls 4 license key", "spss for mac free" bằng thông điệp "không cần cài phần mềm".

**Rủi ro:** sai thuật toán làm hỏng luận văn thật. Bắt buộc có bộ kiểm chứng, ghi rõ phiên bản thuật toán, khuyến nghị đối chiếu với phần mềm chuẩn khi nộp. Liêm chính: thấp, vì chỉ tính toán trên dữ liệu người dùng.

**Công sức:** L (khoảng 3–4 tuần cho PLS-SEM v1 có kiểm chứng).

### #4 Ma trận tổng quan tài liệu + tìm khoảng trống nghiên cứu

**Mục tiêu:** giúp sinh viên **tự** tổng hợp tài liệu thật thành bảng tổng quan và nhìn ra khoảng trống, thay vì nhờ AI viết tổng quan (dễ có trích dẫn ảo).

**Luồng:**
1. Nhập danh sách DOI/tiêu đề (dùng lại bộ phân giải DOI của công cụ APA, Crossref/OpenAlex). Có thể tìm theo từ khoá qua OpenAlex API (miễn phí, có abstract đảo ngược và concept).
2. Mỗi bài thành một dòng của ma trận gồm các cột: tác giả–năm, quốc gia/bối cảnh, đối tượng, lý thuyết nền, biến độc lập/phụ thuộc/trung gian, phương pháp (SPSS/PLS/CB-SEM/panel), cỡ mẫu, kết quả chính. Metadata tự điền từ API. Các cột nội dung **sinh viên tự điền** (có thể gợi ý từ abstract, đánh dấu "cần kiểm tra").
3. **Bảng tổng hợp:** đếm theo bối cảnh × biến × phương pháp, heatmap "biến nào đã nghiên cứu ở VN chưa", biến có kết quả trái chiều, năm gần nhất. Đây chính là bằng chứng cho khoảng trống, chia theo **5 loại khoảng trống** (bối cảnh, đối tượng, biến, phương pháp, kết quả mâu thuẫn), mỗi loại có câu mẫu khung và ví dụ.
4. **Xuất:** bảng tổng quan dạng Word (bảng phụ lục chương 2 rất phổ biến), danh mục TLTK APA, file RIS cho Zotero/Mendeley.
5. Từ khoảng trống, nút "Đưa biến này vào mô hình" mở công cụ vẽ mô hình và thư viện thang đo.

**Nối sang Genius Data:** khoảng trống bối cảnh hoặc đối tượng (ví dụ "chưa có nghiên cứu trên Gen Z ở Đà Nẵng") dẫn tới một ghi chú khả thi: "đối tượng này tiếp cận được qua…". Liên kết vừa phải, không ép.

**Rủi ro:** (a) trích dẫn ảo, nên chỉ cho phép bài có DOI hoặc metadata xác minh được, (b) AI tóm tắt sai nên mọi gợi ý từ abstract phải gắn nhãn, (c) giới hạn tốc độ của OpenAlex/Crossref nên cần cache.

**Công sức:** M cho bản ma trận + xuất, L nếu thêm tìm kiếm và heatmap.

### #5 Kiểm tra định dạng theo trường + mẫu Word theo trường

**Mục tiêu:** hút traffic lớn nhất trong cả đợt khảo sát (format theo tên trường) và giải quyết việc sinh viên làm lại định dạng nhiều lần.

**Thành phần:**
1. **Cơ sở dữ liệu quy định** (JSON mỗi trường/khoa): khổ giấy, lề, font, cỡ chữ, giãn dòng, thụt đầu dòng, cấp heading và cách đánh số, đánh số trang (La Mã phần đầu), cấu trúc bìa/phụ bìa, kiểu trích dẫn (APA/IEEE/kiểu riêng), giới hạn số trang/từ, ngưỡng Turnitin nếu công bố. Mỗi trường có **link file gốc + ngày truy cập**. Ưu tiên theo autocomplete: NEU, FTU, UEH, TMU, UET, VNUA, HUB, HVNH, IUH, USSH, CTU, UFM, HCMUS, HCMUTE, Duy Tân.
2. **Trang theo trường** (`/dinh-dang/neu/`…): bảng quy định, hình bìa minh hoạ, câu hỏi thường gặp. Đây là trang SEO cho "format khóa luận tốt nghiệp neu".
3. **Mẫu .docx theo trường:** styles Heading 1–3 đã đánh số, caption bảng/hình, mục lục tự động, section break đổi kiểu số trang. Sinh tự động từ JSON bằng thư viện docx, giữ một nguồn dữ liệu duy nhất.
4. **Trình kiểm tra .docx (phía client):** đọc styles và section của file người dùng, so với quy định rồi liệt kê lỗi (lề sai, font không đồng nhất, heading không dùng style nên mục lục hỏng, số trang không tách phần đầu, bảng thiếu caption). Kèm hướng dẫn sửa trong Word, nối với các video mục lục và căn lề vì đó là nhu cầu triệu lượt xem.
5. Liên kết với công cụ APA: kiểm tra danh mục TLTK theo kiểu trích dẫn của trường.

**Nối sang Genius Data:** gián tiếp. Đặt khối "Bạn đang ở bước nào?" dẫn về bộ khảo sát hoặc thu mẫu cho người còn ở giai đoạn sớm, và thu email nhắc mốc (nối với #18).

**Rủi ro:** quy định thay đổi theo năm và theo khoa. Cần hiển thị "cập nhật lần cuối", cho phép người dùng gửi file quy định mới, và ghi rõ "đối chiếu với quy định chính thức của khoa". Không vấn đề liêm chính.

**Công sức:** M (dữ liệu 15 trường khoảng 1 tuần, mẫu docx + trình kiểm tra khoảng 1 tuần).

## 5. Loại trừ rõ ràng (không làm)

- Mọi chức năng **sinh, sửa, nội suy, nhân bản dữ liệu** hoặc "làm đẹp số liệu", kể cả "dữ liệu mẫu theo mô hình của bạn". Đối thủ đang bán đúng thứ này (2.9).
- Thử nhiều tổ hợp loại biến/loại phiếu để tìm kết quả "đạt" (p-hacking tự động).
- **Viết hộ** chương, tổng quan, hàm ý, lời cảm ơn hoàn chỉnh để nộp. Chỉ cung cấp khung, checklist, câu mẫu cấu trúc và diễn giải số liệu thật.
- **"Giảm AI / humanizer / paraphrase né Turnitin".** Chỉ làm hướng dẫn trích dẫn và paraphrase đúng cách cùng kiểm tra trích dẫn.
- Bán hoặc cung cấp phản hồi khảo sát giả, "mua mẫu ảo", trả lời hộ.
- Link phần mềm crack hoặc Sci-Hub.

## 6. Gợi ý thứ tự triển khai

1. Làm #2 (Làm sạch) và #1 (Bác sĩ kết quả) cùng nhau vì dùng chung bộ quy tắc chất lượng. Đây là điểm chạm tự nhiên nhất với Genius Data, đồng thời là thông điệp đối lập rõ với dịch vụ "sửa số liệu".
2. #5 Định dạng theo trường: traffic theo mùa (trước kỳ nộp tháng 4–6 và 11–12), nên làm sớm.
3. #3 SEM: tốn công nhất, nhưng khoá chặt chuỗi mô hình → cỡ mẫu → thu mẫu → phân tích.
4. #4, rồi đến các mục S (#9, #10, #11, #12, #18) xen giữa như nội dung SEO.
5. Sửa ngay (S): bước "Thu mẫu" trên trang chủ nên dẫn tới trang giới thiệu Genius Data, kèm bài hướng dẫn, thay vì chỉ có link affiliate ở footer.
