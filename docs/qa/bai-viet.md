# QA bài viết: Góc Nghiên Cứu /posts/

Ngày audit: 2026-10-30 (01:55 giờ VN). Phạm vi: 15 file `src/content/posts/*.md`, `PostLayout.astro`, bản live tại https://gocnghiencuu.com/posts/. Chỉ đọc, không sửa nguồn.

Cách kiểm: đọc toàn văn từng bài; tính lại mọi phép tính (Cochran, Yamane, hiệu chỉnh tổng thể, số phiếu thô, df, bảng G*Power chạy lại bằng scipy noncentral F); đối chiếu 25 DOI qua api.crossref.org; curl mọi link nội bộ và link Genius Data; đọc HTML live của 9 bài đang lên để kiểm heading, HTML thô và thuộc tính rel; đọc CSS bảng trong `typography.css` cho hiển thị trên điện thoại.

Tóm lại: **không thấy số sai hay tài liệu bịa.** Mọi phép tính khớp và cả 25 DOI khớp tác giả, năm, tập, số, trang trên Crossref. Lỗi P0 nằm ở phát hành (6 bài đang 404), tuân thủ affiliate (5 bài nói về Genius Data vượt câu cho phép, 1 link thiếu rel) và một con số sai về chính site.

## Bảng tóm tắt (thang 1–5)

| Bài | Đúng | Hiển thị | Độ sâu | Ghi chú chính |
|---|---|---|---|---|
| cronbach-alpha-la-gi | 5 | 5 | 3 | Không có danh mục TLTK, không có omega/CR, không có FAQ |
| thang-do-likert | 5 | 5 | 3 | Không có danh mục TLTK; thiếu bộ nhãn tần suất/mức độ quan trọng |
| co-mau-nghien-cuu-bao-nhieu-la-du | 4,5 | 4,5 | 4 | Gộp CFA với quy tắc EFA; claim GD vượt phạm vi |
| cach-doc-ket-qua-efa-spss | 5 | 1 (404) | 4,5 | Chưa lên live; quy ước 0,3 chưa có nguồn |
| cach-loc-phieu-khao-sat-khong-hop-le | 5 | 5 | 3,5 | Không có danh mục TLTK; thiếu longstring/Mahalanobis |
| cach-thiet-ke-bang-hoi | 4,5 | 5 | 3 | Không có TLTK; mâu thuẫn nhỏ "luôn luôn→thường" |
| cach-thu-mau-khao-sat-khoa-luan | 4 | 5 | 3,5 | Bảng giá GD vượt phạm vi; công thức dự phòng lệch với bài khác |
| cach-thu-du-mau-khao-sat-nhanh | 5 | 1 (404) | 4,5 | Link GD thiếu rel |
| cach-tao-phieu-khao-sat-google-forms | 5 | 1 (404) | 4,5 | Chưa lên live |
| mau-phieu-khao-sat-khoa-luan | 5 | 1 (404) | 4,5 | Chưa lên live |
| bang-ma-hoa-thang-do | 5 | 1 (404) | 4,5 | Chưa lên live |
| cach-viet-chuong-4-ket-qua-nghien-cuu | 5 | 1 (404) | 4,5 | Chưa lên live |
| hoi-dong-hoi-gi-ve-phan-khao-sat | 4 | 5 | 3 | "21 thang đo" sai; claim GD vượt phạm vi; mỏng (1.337 từ) |
| khao-sat-kiem-tien-uy-tin | 4 | 5 | 3,5 | Claim GD (GTOKEN, Bộ Công Thương) vượt phạm vi |
| phat-hien-cau-tra-loi-khao-sat-do-ai-viet | 4,5 | 5 | 3,5 | Đoạn mô tả tính năng GD vượt phạm vi; không có TLTK |

## P0: lỗi cần sửa trước

**P0-1. Sáu bài trả về 404 và sẽ không tự lên live.** Các bài `bang-ma-hoa-thang-do`, `cach-doc-ket-qua-efa-spss`, `cach-tao-phieu-khao-sat-google-forms`, `cach-thu-du-mau-khao-sat-nhanh`, `cach-viet-chuong-4-ket-qua-nghien-cuu` và `mau-phieu-khao-sat-khoa-luan` có `pubDatetime` 2026-10-30 từ 09:00 đến 14:00 (+07). `postFilter.ts` bỏ bài hẹn giờ lúc build, còn `.github/workflows/deploy.yml` chỉ chạy `on: push` và không có `schedule`. Vì vậy các bài này vẫn 404 cho đến lần push tiếp theo sau 14:00. Cách sửa: thêm `schedule: - cron: "15 7 * * *"` (14:15 giờ VN) và `workflow_dispatch` vào deploy.yml, hoặc push lại sau 14:00 hôm nay. Chúng chỉ link lẫn nhau, nên hiện chưa có bài live nào trỏ vào link chết.

**P0-2. Link affiliate thiếu rel.** Trong `cach-thu-du-mau-khao-sat-nhanh.md`, link `<a href="https://geniusdata.io/signup?...utm_content=cach-thu-du-mau-khao-sat-nhanh">Genius Data</a> (link giới thiệu)` không có `rel`. Sửa: thêm `rel="sponsored noopener"`. Các link GD khác trong bài viết, footer và ToolLayout đều đã có rel.

**P0-3. Claim về Genius Data vượt câu cho phép.** Câu chuẩn: *"người nghiên cứu tự đặt mức thưởng cho mỗi câu hỏi và chỉ trả tiền cho phiếu được duyệt"*. Footer có câu "Một số link trên trang là link giới thiệu (affiliate)", nên phần công bố đã được bao trên toàn site; vấn đề nằm ở nội dung claim.

| Bài | Trích nguyên văn | Vấn đề |
|---|---|---|
| co-mau…du | "các nền tảng thu mẫu có lọc đối tượng như Genius Data cho phép đặt trước số phiếu và chỉ trả cho phiếu được duyệt" | Lọc đối tượng, đặt trước số phiếu |
| cach-thu-mau… | "bạn chọn nhóm đối tượng mục tiêu và tự đặt mức thưởng mỗi câu, tối thiểu 0,15 GP/câu, mức gợi ý 0,4 GP/câu, với 1 GP = 1.100 đ đã gồm VAT… 200 phản hồi khoảng 1.320.000 đ" | Bảng giá, mức sàn, VAT, nhắm đối tượng. Phép tính đúng (15×0,4×200×1.100) nhưng dễ lỗi thời và là claim thương mại |
| cach-thu-mau… (link thứ hai) | "nơi bạn chọn đối tượng và chỉ trả cho phiếu được duyệt" | Nhắm đối tượng; thiếu "(link giới thiệu)" |
| hoi-dong… | "một nền tảng có xác minh người trả lời và lọc phiếu sẵn, ví dụ Genius Data" | Xác minh người trả lời, lọc phiếu |
| phat-hien…ai-viet | "Genius Data tự chấm chất lượng từng phản hồi, trong đó có việc nhận diện câu tự luận có dấu hiệu do AI viết… đáp viên được gợi ý viết lại" | Mô tả tính năng chấm chất lượng bằng AI |
| khao-sat-kiem-tien… | "tích GTOKEN… đổi quà hoặc voucher trong hệ sinh thái. Website đã thông báo với Bộ Công Thương và có email hỗ trợ hi@geniusdata.io" | Cơ chế thưởng phía đáp viên, claim pháp lý chưa có bằng chứng trên trang |

Văn bản thay thế dùng chung cho các bài nghiên cứu: *"Một lựa chọn là Genius Data (link giới thiệu), nơi người nghiên cứu tự đặt mức thưởng cho mỗi câu hỏi và chỉ trả tiền cho phiếu được duyệt."* Bài `khao-sat-kiem-tien` viết cho đáp viên nên câu chuẩn không khớp. Ở bài này nên bỏ đoạn GD và giữ phần công bố affiliate. Nếu muốn giữ câu về Bộ Công Thương, phải dẫn link hồ sơ online.gov.vn đã kiểm chứng, đúng như checklist bài này yêu cầu người đọc tự làm.

**P0-4. Con số sai về site.** Trong `hoi-dong…`: "nguồn trích dẫn của 21 thang đo hay dùng". Thư viện hiện có 60 thang đo đã xuất bản (`src/content/thang-do/*.json`, không tính `_grit-s`). Sửa: "của hơn 60 thang đo hay dùng (TAM, UTAUT2, TPB, SERVQUAL, SWLS…)", hoặc bỏ con số để khỏi lỗi thời.

## P1: lỗ hổng nội dung

**P1-1. Mâu thuẫn giữa các bài về câu kiểm tra chú ý.** Google Forms viết: "Đáp án đúng nên là một mức không nằm ở hai đầu và không phải mức giữa". Trong khi đó `cach-loc-phieu` dùng "chọn Rất không đồng ý" và `cach-thu-mau` dùng "chọn Hoàn toàn không đồng ý", tức đáp án ở đầu thang. `mau-phieu` và `bang-ma-hoa` dùng "Không đồng ý" (=2), khớp với Google Forms. Nên thống nhất mọi ví dụ về "Không đồng ý", và thống nhất số câu và vị trí: 1–2 câu, nửa sau phiếu (hiện `cach-loc-phieu` ghi "1–3 câu… giữa form").

**P1-2. Cỡ mẫu CFA (`co-mau`).** Dòng bảng "EFA / CFA → Hair 2010, 5:1 → 130" áp quy tắc của EFA cho CFA. Hair và cộng sự (2010, chương SEM) đưa mức tối thiểu cho CB-SEM theo số khái niệm và communality: 100 khi có từ 5 khái niệm trở xuống, mỗi khái niệm trên 3 biến và communality từ 0,6; lên 300–500 khi communality thấp hoặc nhiều khái niệm. Nên tách thành dòng "CFA/CB-SEM (AMOS)" với căn cứ đó, kèm Wolf và cộng sự (2013), https://doi.org/10.1177/0013164413495237.

**P1-3. Quy ước chênh lệch tải chéo 0,3 (`cach-doc-ket-qua-efa`).** Bài đúng khi nói đây không phải ngưỡng của Hair, nhưng lại để người đọc tự tìm nguồn. Nên nêu nguồn khoá luận Việt Nam hay trích (Jabnoun & Al-Tamimi, 2003, *IJQRM* 20(4), https://doi.org/10.1108/02656710310468614) và kiểm lại câu chữ gốc trước khi dẫn.

**P1-4. Năm bài thiếu danh mục tài liệu tham khảo** dù có trích dẫn trong thân bài: cronbach (Cronbach 1951 https://doi.org/10.1007/BF02310555, Nunnally 1978, Hair 2010), likert (Likert 1932; Preston & Colman 2000 https://doi.org/10.1016/S0001-6918(99)00050-5; Jamieson 2004 https://doi.org/10.1111/j.1365-2929.2004.02012.x; Norman 2010), lọc phiếu (Meade & Craig 2012; Huang và cộng sự 2012 https://doi.org/10.1007/s10869-011-9231-8; Oppenheimer và cộng sự 2009 https://doi.org/10.1016/j.jesp.2009.03.009), thiết kế bảng hỏi (Galesic & Bosnjak 2009 https://doi.org/10.1093/poq/nfp031; Krosnick 1991; Tourangeau và cộng sự 2000), AI (Liang và cộng sự 2023 https://doi.org/10.1016/j.patter.2023.100779). Người đọc là sinh viên chép trích dẫn, nên mỗi bài cần một danh mục APA.

**P1-5. Liên kết nội bộ tới 6 bài mới (làm ngay khi chúng lên live).** Hiện các bài này chỉ link lẫn nhau. Nên thêm:
- cronbach: link tới cach-doc-ket-qua-efa-spss (bước sau alpha) và cach-viet-chuong-4.
- likert: link tới bang-ma-hoa-thang-do (đoạn mã hoá câu đảo chiều) và mau-phieu.
- cach-thiet-ke-bang-hoi: link tới mau-phieu và google-forms (thay cho câu "Bảng hỏi tốt mới là một nửa").
- cach-thu-mau: link tới cach-thu-du-mau-khao-sat-nhanh (Bước 4–5) và google-forms (Bước 3).
- co-mau: link tới cach-doc-ket-qua-efa-spss (mục EFA).
- hoi-dong: Q1 link tới co-mau, Q2 link tới cach-thu-mau, Q4 link tới cach-doc-ket-qua-efa và chuong-4. Hiện Q1 chỉ dẫn tới máy tính.
- cach-loc-phieu: link tới chuong-4 (mục 4.1, báo cáo số phiếu bị loại).

**P1-6. Độ sâu so với kết quả tìm kiếm.** Kết quả tiếng Việt cho các truy vấn chính (amis.misa.vn, ahaslides, statology, finhay, toplist…) nhìn chung mỏng hơn bài của ta về nguồn trích, nhưng có những thứ ta chưa có: ảnh chụp output SPSS, file dữ liệu mẫu và FAQ. Nên bổ sung:
- *cronbach* (1.390 từ): ảnh chú thích 3 bảng SPSS; mục "Alpha, omega hay CR?" (McDonald's omega; độ tin cậy tổng hợp, theo Hair 2019); FAQ "alpha 0,6 có được không", "thang đo 2 câu thì sao" (dùng Spearman-Brown, Eisinga và cộng sự 2013 https://doi.org/10.1007/s00038-012-0416-3); file .sav hoặc .xlsx mẫu khớp ví dụ HL1–HL5.
- *likert*: bảng nhãn cho thang tần suất, mức độ quan trọng và mức độ hài lòng; FAQ "có được đổi 7 mức thành 5 mức không"; nguồn cho cách chia khoảng 0,8 (trang IUH jst.iuh.edu.vn so sánh ba cách phân tổ, nên nêu rõ đây là quy ước).
- *co-mau*: bảng Krejcie & Morgan (1970), https://doi.org/10.1177/001316447003000308, mà sinh viên Việt Nam hay được hỏi; cỡ mẫu cho t-test và ANOVA trên G*Power; FAQ "mẫu 200 có đủ không".
- *hoi-dong* (bài mỏng nhất, 1.337 từ): thêm 4–6 câu hội đồng hay hỏi (vì sao chọn Likert 5 mức, vì sao loại biến ở EFA, đa cộng tuyến, R² thấp, giả thuyết bị bác, khác biệt theo nhóm), mỗi câu có câu trả lời mẫu và link tới bài chi tiết.
- *cach-loc-phieu*: chỉ số longstring và khoảng cách Mahalanobis (Curran 2016, đã dẫn ở bài thu-nhanh), cú pháp SPSS cho longstring, một đoạn mẫu chương 3 báo cáo phiếu bị loại.
- *cach-thiet-ke-bang-hoi*: cỡ mẫu cho pilot (Hertzog 2008, https://doi.org/10.1002/nur.20247), mục đạo đức và đồng ý tham gia (link tới mau-phieu), FAQ.
- *phat-hien-ai*: ví dụ thật (đã ẩn danh) một câu trả lời người viết và một câu do chatbot viết, đặt cạnh nhau; cách báo cáo số phiếu loại vì AI trong chương 3.

**P1-7. Công thức dự phòng không thống nhất.** `cach-thu-mau` viết "cộng thêm khoảng 10 đến 20%" (tức n×1,2, ví dụ 300 → 360), còn `co-mau` và `cach-thu-du-mau` dùng n/(1−r) (300 → 375). Nên thống nhất theo n/(1−r) và link tới bảng ở bài thu-nhanh.

## P2: hoàn thiện

- `co-mau`: "Công thức này thực chất là trường hợp riêng của Cochran có hiệu chỉnh" chưa thật chính xác. Cochran hiệu chỉnh với n0 = 400 cho 400N/(N+399), còn Yamane cho 400N/(N+400). Sửa thành "gần như tương đương với".
- `co-mau`: "Tài liệu tham khảo" đang là h3 nằm dưới h2 "Đoạn văn mẫu cho chương 3", nên đổi thành h2 cho khớp với các bài khác. Tên Faul và cộng sự (2009) ở đây bị cắt mất phụ đề ": Tests for correlation and regression analyses" (bài hoi-dong có đầy đủ).
- `cronbach`: có thể thêm sắc thái của Nunnally (1978): 0,7 cho giai đoạn đầu, 0,8 cho nghiên cứu cơ bản, 0,9 khi dùng để ra quyết định.
- `cach-thiet-ke-bang-hoi`: bảng lỗi đề xuất sửa "luôn luôn" thành "thường", trong khi dòng ngay dưới lại coi "thường xuyên" là từ mơ hồ. Nên đổi câu sửa thành dạng có mốc tần suất.
- Nhãn Likert chưa thống nhất: "Hoàn toàn (không) đồng ý" ở likert và thu-mau, "Rất (không) đồng ý" ở bang-ma-hoa, mau-phieu và google-forms. Nên chọn một bộ nhãn.
- `cach-thu-du-mau`: đoạn mẫu ghi thu từ "05/11 đến 24/11/2026", tức ngày trong tương lai so với ngày đăng. Nên dùng ngày trong quá khứ hoặc ghi "[ngày]".
- `mau-phieu`: "vì PE2 gốc đã bị loại" khớp với dữ liệu `utaut2.json` của site, nhưng tôi chưa kiểm được trên phụ lục bản gốc qua nguồn mở. Nên đối chiếu với phụ lục MISQ 2012 trước khi khẳng định.
- Các khoảng trống hai dòng còn sót sau khi bỏ khối CTA (cach-loc-phieu, cach-thiet-ke, khao-sat-kiem-tien, phat-hien-ai) hiển thị bình thường, chỉ cần dọn cho sạch nguồn.
- Hiển thị: 9 bài live đều có đúng 1 h1, thứ tự heading hợp lệ, không lộ HTML hay markdown thô. Trên màn hình dưới 768px, bảng trong prose chuyển thành khối cuộn ngang (`typography.css`, `> table { block; overflow-x-auto }`), nên bảng 7 cột của bài EFA sẽ cuộn được chứ không tràn trang. Tôi chưa kiểm được trên trình duyệt ở cỡ điện thoại vì tab trình duyệt dùng chung đang bị điều hướng chỗ khác; nên mở thử bài EFA và bài bang-ma-hoa (bảng có rowspan) trên điện thoại thật sau khi lên live.

## Đã kiểm và đúng (để khỏi kiểm lại)

- Cochran: 384,16 → 385; e = 0,03 → 1.068; e = 0,07 → 196; e = 0,10 → 97; mức 99% → 664; p = 0,3 → 323. Hiệu chỉnh N = 2.000 → 323, N = 500 → 218. Yamane: 334 và 223.
- Bảng G*Power: cả 15 ô khớp (f² 0,02 / 0,15 / 0,35; m = 2–6). Kock & Hadaya: 511 và 155.
- Tabachnick & Fidell 50+8m và 104+m; Hair 5:1 và 10:1; bảng hệ số tải theo cỡ mẫu (0,30 → 350 … 0,75 → 50); thang KMO của Kaiser (1974); ngưỡng PLS-SEM của Hair 2019 (0,708; 0,70–0,95; AVE 0,5; HTMT 0,85/0,90; VIF < 3; Q²); Kock 2015 VIF ≤ 3,3; Durbin-Watson theo Field.
- Số học trong các ví dụ: df Bartlett (120, 105), F(5, 317), t(321), 402 − 79 = 323 (80,3%), số phiếu thô n/(1−r), 27 câu trong phiếu mẫu, alpha tính tay 0,80.
- Crossref khớp cho cả 25 DOI: Bartlett 1954, Fabrigar 1999, Hair 2019, Horn 1965, Kaiser 1960/1974, Limayem & Hirt 2003, Norman 2010, Venkatesh 2003/2012, Fornell & Larcker 1981, Henseler 2015, Kock 2015, Kock & Hadaya 2018, Wasserstein & Lazar 2016, Krosnick 1991, Meade & Craig 2012, Podsakoff 2003, Curran 2016, Douglas 2023, Etikan 2016, Singer & Ye 2013, Ward & Meade 2023, Brislin 1970, Liang 2023.
- Câu chữ các item UTAUT2 (PE, EE, SI, PV, HT, BI) khớp với bản gốc tiếng Anh. Luật 91/2025/QH15 có hiệu lực từ 01/01/2026. Google Forms: chuyển phần theo câu trả lời chỉ có ở Trắc nghiệm và Menu thả xuống (https://support.google.com/docs/answer/141062).
- Mọi link nội bộ trỏ tới trang công cụ, thang đo và mẫu bảng hỏi đều trả 200; link signup Genius Data trả 200.
