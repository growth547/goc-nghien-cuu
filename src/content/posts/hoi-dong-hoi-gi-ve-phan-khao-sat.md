---
title: "Hội đồng hay hỏi gì về phần khảo sát? 8 câu và cách trả lời"
description: "8 câu hội đồng hay hỏi về cỡ mẫu, chọn mẫu, dịch thang đo, Cronbach's alpha, lọc phiếu, sai lệch phương pháp chung và PLS-SEM, kèm câu trả lời có trích dẫn."
pubDatetime: 2026-10-29T08:00:00+07:00
featured: true
tags: ["bảo vệ khoá luận","cỡ mẫu","PLS-SEM"]
---

<p>Phần lớn câu hỏi về chương 3 trong buổi bảo vệ xoay quanh một ý: <em>số liệu của em có đáng tin không?</em> Cách trả lời tốt nhất là chuẩn bị sẵn từ lúc viết, mỗi lựa chọn có một lý do và một trích dẫn. Dưới đây là 8 câu thường gặp nhất, câu trả lời mẫu, và chỗ bạn cần ghi vào bài để không bị hỏi lần nữa.</p>

<h2>1. "Vì sao cỡ mẫu là con số này?"</h2>
<p><strong>Trả lời sai:</strong> "Dạ theo công thức Slovin" (khi bạn chạy PLS-SEM), hoặc "Dạ thầy hướng dẫn bảo lấy 300".</p>
<p><strong>Trả lời đúng:</strong> cỡ mẫu đi theo phương pháp phân tích chính. Với PLS-SEM, nói rõ bạn dùng phân tích power: "Cấu trúc có nhiều mũi tên trỏ vào nhất có 5 mũi tên, với f² = 0,15, α = 0,05 và power 80%, G*Power cho cỡ mẫu tối thiểu 92 (Faul và cộng sự, 2009). Theo phương pháp căn bậc hai nghịch đảo của Kock và Hadaya (2018), với hệ số đường dẫn nhỏ nhất kỳ vọng 0,2, cần 155. Em lấy mức lớn hơn và cộng 15% dự phòng phiếu loại."</p>
<p><a href="/goc-nghien-cuu/cong-cu/tinh-co-mau/">Máy tính cỡ mẫu</a> làm đúng các bước này và sinh luôn đoạn văn chương 3 kèm tài liệu tham khảo APA.</p>

<h2>2. "Mẫu thuận tiện thì có đại diện được không?"</h2>
<p>Không, và bạn nên nói thẳng như vậy. Chọn mẫu phi xác suất không cho phép suy rộng thống kê ra toàn tổng thể. Câu trả lời tốt gồm ba ý: (1) mục tiêu là kiểm định quan hệ giữa các biến chứ không ước lượng tỉ lệ tổng thể, (2) bạn mô tả đặc điểm mẫu (giới tính, độ tuổi, ngành, khu vực) để người đọc tự đánh giá mức tương đồng, (3) bạn đã ghi điều này trong phần hạn chế. Hội đồng ít khi bắt lỗi chọn mẫu thuận tiện, họ bắt lỗi khi bạn <em>không thừa nhận</em> nó.</p>

<h2>3. "Thang đo lấy ở đâu, dịch thế nào?"</h2>
<p>Cần trả lời được ba thứ: nguồn gốc (tác giả, năm, bài báo), cách dịch, và cách kiểm tra bản dịch. Quy trình thường được chấp nhận là dịch xuôi rồi dịch ngược bởi một người khác (Brislin, 1970), nhờ giảng viên hoặc chuyên gia đọc lại, sau đó khảo sát thử với 20 đến 30 người để sửa câu khó hiểu. Ghi rõ câu nào bạn đã điều chỉnh từ ngữ cho phù hợp bối cảnh Việt Nam.</p>
<p><a href="/goc-nghien-cuu/thang-do/">Thư viện thang đo</a> có câu hỏi gốc tiếng Anh, bản tiếng Việt tham khảo và nguồn trích dẫn của hơn 60 thang đo hay dùng (TAM, UTAUT2, TPB, SERVQUAL, SWLS...).</p>

<h2>4. "Sao Cronbach's alpha của nhân tố này chỉ 0,65?"</h2>
<p>Ngưỡng hay được trích là 0,7 (Nunnally, 1978). Nếu bạn ở dưới mức đó, đừng chống chế, hãy giải thích bằng số liệu: nhân tố có ít biến quan sát (alpha nhạy với số câu), bạn đã xem cột <em>Corrected Item-Total Correlation</em> và <em>Cronbach's Alpha if Item Deleted</em>, và quyết định giữ hay bỏ câu nào vì lý do gì. Với PLS-SEM, báo cáo thêm độ tin cậy tổng hợp (composite reliability) và rho_A, vì alpha giả định mọi câu có tải nhân tố bằng nhau và thường cho giá trị thấp hơn (Hair và cộng sự, 2019).</p>
<p>Chạy thử nhanh trên dữ liệu của bạn bằng <a href="/goc-nghien-cuu/cong-cu/cronbach-alpha/">công cụ Cronbach's alpha</a>, dán thẳng từ Excel. Nếu cần chạy cho mọi thang đo cùng lúc kèm EFA và hồi quy, dùng <a href="/goc-nghien-cuu/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát</a>.</p>

<h2>5. "Em loại bao nhiêu phiếu, theo tiêu chí gì?"</h2>
<p>Câu này rất hay bị hỏi khi bảng thống kê mô tả có N khác với số phiếu thu về. Hãy có sẵn một dòng: "Thu về 412 phiếu, loại 47 phiếu (23 phiếu trả lời sai câu kiểm tra chú ý, 15 phiếu chọn cùng một mức cho mọi câu, 9 phiếu hoàn thành dưới 2 phút), còn 365 phiếu hợp lệ." Tiêu chí loại phải được định ra <em>trước</em> khi xem kết quả, nếu không sẽ bị nghi là chọn phiếu cho đẹp số liệu. Meade và Craig (2012) tổng hợp các cách phát hiện trả lời cẩu thả. Chi tiết từng tiêu chí ở bài <a href="/goc-nghien-cuu/posts/cach-loc-phieu-khao-sat-khong-hop-le/">cách lọc phiếu khảo sát không hợp lệ</a>.</p>

<h2>6. "Khảo sát online, làm sao biết không phải một người làm nhiều lần?"</h2>
<p>Trả lời bằng biện pháp bạn đã áp dụng, không bằng lời hứa: giới hạn mỗi tài khoản một lần trả lời, kiểm tra trùng email hoặc số điện thoại nếu có thu, xem các phiếu nộp liên tiếp cách nhau vài giây với đáp án gần giống nhau. Địa chỉ IP không đủ tin cậy vì nhiều người dùng chung mạng ký túc xá hoặc 4G. Nếu bạn thu một phần mẫu qua một nền tảng khảo sát có trả thưởng (ví dụ <a href="https://geniusdata.io/signup?ref=lab-blog&amp;next=%2Fapp%2Fforms&amp;utm_source=goc-nghien-cuu&amp;utm_medium=blog&amp;utm_campaign=ai-lab&amp;utm_content=hoi-dong-hoi-gi-ve-phan-khao-sat" rel="sponsored noopener">Genius Data</a> (link giới thiệu), nơi người nghiên cứu tự đặt mức thưởng cho mỗi câu hỏi và chỉ trả tiền cho phiếu được duyệt), ghi rõ tên nền tảng, số phiếu thu từ đó và các bước lọc bạn tự làm thêm trên dữ liệu tải về. Hội đồng đánh giá các bước bạn làm và báo cáo được, không đánh giá lời quảng cáo của nền tảng.</p>

<h2>7. "Em có kiểm tra sai lệch do phương pháp chung (common method bias) không?"</h2>
<p>Khi mọi biến đều do cùng một người tự trả lời trong cùng một bảng hỏi, hội đồng có quyền nghi ngờ các tương quan bị thổi phồng. Trả lời hai lớp:</p>
<ul>
<li><strong>Biện pháp thủ tục</strong> (Podsakoff và cộng sự, 2003): ẩn danh, trộn thứ tự câu hỏi, tách biến độc lập và phụ thuộc ra các phần khác nhau của bảng hỏi.</li>
<li><strong>Kiểm định thống kê</strong>: với PLS-SEM, dùng đánh giá đa cộng tuyến toàn phần, mọi VIF ≤ 3,3 là không có dấu hiệu sai lệch đáng kể (Kock, 2015). Kiểm định một nhân tố của Harman vẫn hay được dùng nhưng được coi là yếu, nên chỉ để làm bổ sung.</li>
</ul>

<h2>8. "Sao chọn PLS-SEM mà không phải CB-SEM (AMOS)?"</h2>
<p>Lý do hợp lệ: mục tiêu là dự báo và giải thích biến phụ thuộc, mô hình phức tạp với nhiều cấu trúc, có cấu trúc đo lường dạng cấu tạo (formative), hoặc dữ liệu không phân phối chuẩn (Hair và cộng sự, 2019). Lý do <em>không nên</em> nói một mình: "vì mẫu nhỏ". PLS-SEM chạy được với mẫu nhỏ, nhưng power vẫn phụ thuộc cỡ mẫu, và hội đồng sẽ hỏi tiếp ngay câu số 1.</p>

<h2>Một trang để in mang theo</h2>
<p>Trước buổi bảo vệ, viết ra giấy cho từng câu trên: con số của bạn, lý do, và một trích dẫn. Nếu câu nào bạn chưa trả lời được trong một câu nói, đó là chỗ cần sửa trong chương 3 trước, không phải chỗ để ứng biến trước hội đồng.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Brislin, R. W. (1970). Back-translation for cross-cultural research. <em>Journal of Cross-Cultural Psychology, 1</em>(3), 185–216.</li>
<li>Faul, F., Erdfelder, E., Buchner, A., &amp; Lang, A.-G. (2009). Statistical power analyses using G*Power 3.1: Tests for correlation and regression analyses. <em>Behavior Research Methods, 41</em>(4), 1149–1160.</li>
<li>Hair, J. F., Risher, J. J., Sarstedt, M., &amp; Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review, 31</em>(1), 2–24.</li>
<li>Kock, N. (2015). Common method bias in PLS-SEM: A full collinearity assessment approach. <em>International Journal of e-Collaboration, 11</em>(4), 1–10.</li>
<li>Kock, N., &amp; Hadaya, P. (2018). Minimum sample size estimation in PLS-SEM: The inverse square root and gamma-exponential methods. <em>Information Systems Journal, 28</em>(1), 227–261.</li>
<li>Meade, A. W., &amp; Craig, S. B. (2012). Identifying careless responses in survey data. <em>Psychological Methods, 17</em>(3), 437–455.</li>
<li>Nunnally, J. C. (1978). <em>Psychometric theory</em> (2nd ed.). McGraw-Hill.</li>
<li>Podsakoff, P. M., MacKenzie, S. B., Lee, J.-Y., &amp; Podsakoff, N. P. (2003). Common method biases in behavioral research: A critical review of the literature and recommended remedies. <em>Journal of Applied Psychology, 88</em>(5), 879–903.</li>
</ul>
