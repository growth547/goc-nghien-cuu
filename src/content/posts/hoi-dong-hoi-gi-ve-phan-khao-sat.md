---
title: "Hội đồng hay hỏi gì về phần khảo sát? 14 câu và cách trả lời"
description: "14 câu hội đồng hay hỏi về cỡ mẫu, chọn mẫu, thang đo, alpha, EFA, lọc phiếu, đa cộng tuyến, R², giả thuyết bị bác, PLS-SEM, kèm câu trả lời có trích dẫn."
pubDatetime: 2026-10-29T08:00:00+07:00
modDatetime: 2026-10-30T02:37:18+07:00
featured: true
tags: ["bảo vệ khoá luận","cỡ mẫu","PLS-SEM"]
---

<p>Phần lớn câu hỏi về chương 3 trong buổi bảo vệ xoay quanh một ý: <em>số liệu của em có đáng tin không?</em> Cách trả lời tốt nhất là chuẩn bị sẵn từ lúc viết, mỗi lựa chọn có một lý do và một trích dẫn. Dưới đây là 14 câu thường gặp, chia theo hai phần: tám câu về thu thập dữ liệu (chương 3) và sáu câu về kết quả (chương 4). Mỗi câu có câu trả lời mẫu, chỗ bạn cần ghi vào bài để không bị hỏi lần nữa, và link tới bài hướng dẫn chi tiết.</p>

<h2>Phần A: Thu thập dữ liệu</h2>

<h3>1. "Vì sao cỡ mẫu là con số này?"</h3>
<p><strong>Trả lời sai:</strong> "Dạ theo công thức Slovin" (khi bạn chạy PLS-SEM), hoặc "Dạ thầy hướng dẫn bảo lấy 300".</p>
<p><strong>Trả lời đúng:</strong> cỡ mẫu đi theo phương pháp phân tích chính. Với PLS-SEM, nói rõ bạn dùng phân tích power: "Cấu trúc có nhiều mũi tên trỏ vào nhất có 5 mũi tên, với f² = 0,15, α = 0,05 và power 80%, G*Power cho cỡ mẫu tối thiểu 92 (Faul và cộng sự, 2009). Theo phương pháp căn bậc hai nghịch đảo của Kock và Hadaya (2018), với hệ số đường dẫn nhỏ nhất kỳ vọng 0,2, cần 155. Em lấy mức lớn hơn và cộng 15% dự phòng phiếu loại."</p>
<p>Nếu bạn chạy CFA bằng AMOS hoặc chỉ ước lượng một tỉ lệ, căn cứ sẽ khác; bài <a href="/posts/co-mau-nghien-cuu-bao-nhieu-la-du/">cỡ mẫu nghiên cứu bao nhiêu là đủ</a> có bảng chọn căn cứ theo từng phương pháp, kể cả bảng Krejcie và Morgan mà giảng viên hay hỏi. <a href="/cong-cu/tinh-co-mau/">Máy tính cỡ mẫu</a> làm đúng các bước này và sinh luôn đoạn văn chương 3 kèm tài liệu tham khảo APA.</p>

<h3>2. "Mẫu thuận tiện thì có đại diện được không?"</h3>
<p>Không, và bạn nên nói thẳng như vậy. Chọn mẫu phi xác suất không cho phép suy rộng thống kê ra toàn tổng thể. Câu trả lời tốt gồm ba ý: (1) mục tiêu là kiểm định quan hệ giữa các biến chứ không ước lượng tỉ lệ tổng thể, (2) bạn mô tả đặc điểm mẫu (giới tính, độ tuổi, ngành, khu vực) để người đọc tự đánh giá mức tương đồng, (3) bạn đã ghi điều này trong phần hạn chế. Hội đồng ít khi bắt lỗi chọn mẫu thuận tiện, họ bắt lỗi khi bạn <em>không thừa nhận</em> nó. Bảng so sánh các phương pháp chọn mẫu và cách theo dõi hạn ngạch có ở bài <a href="/posts/cach-thu-mau-khao-sat-khoa-luan/">cách thu mẫu khảo sát khoá luận</a>.</p>

<h3>3. "Thang đo lấy ở đâu, dịch thế nào?"</h3>
<p>Cần trả lời được ba thứ: nguồn gốc (tác giả, năm, bài báo), cách dịch, và cách kiểm tra bản dịch. Quy trình thường được chấp nhận là dịch xuôi rồi dịch ngược bởi một người khác (Brislin, 1970), nhờ giảng viên hoặc chuyên gia đọc lại, sau đó khảo sát thử với 20 đến 30 người để sửa câu khó hiểu. Ghi rõ câu nào bạn đã điều chỉnh từ ngữ cho phù hợp bối cảnh Việt Nam.</p>
<p><a href="/thang-do/">Thư viện thang đo</a> có câu hỏi gốc tiếng Anh, bản tiếng Việt tham khảo và nguồn trích dẫn của hơn 60 thang đo hay dùng (TAM, UTAUT2, TPB, SERVQUAL, SWLS...).</p>

<h3>4. "Sao Cronbach's alpha của nhân tố này chỉ 0,65?"</h3>
<p>Ngưỡng hay được trích là 0,7 (Nunnally, 1978). Nếu bạn ở dưới mức đó, đừng chống chế, hãy giải thích bằng số liệu: nhân tố có ít biến quan sát (alpha nhạy với số câu), bạn đã xem cột <em>Corrected Item-Total Correlation</em> và <em>Cronbach's Alpha if Item Deleted</em>, và quyết định giữ hay bỏ câu nào vì lý do gì. Với PLS-SEM, báo cáo thêm độ tin cậy tổng hợp (composite reliability) và rho_A, vì alpha giả định mọi câu có tải nhân tố bằng nhau và thường cho giá trị thấp hơn (Hair và cộng sự, 2019).</p>
<p>Cách đọc từng cột và sự khác nhau giữa alpha, omega và CR có ở bài <a href="/posts/cronbach-alpha-la-gi/">Cronbach's alpha là gì</a>; cách trình bày bảng độ tin cậy cho mọi thang đo ở bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4</a>. Chạy thử nhanh trên dữ liệu của bạn bằng <a href="/cong-cu/cronbach-alpha/">công cụ Cronbach's alpha</a>, dán thẳng từ Excel. Nếu cần chạy cho mọi thang đo cùng lúc kèm EFA và hồi quy, dùng <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát</a>.</p>

<h3>5. "Em loại bao nhiêu phiếu, theo tiêu chí gì?"</h3>
<p>Câu này rất hay bị hỏi khi bảng thống kê mô tả có N khác với số phiếu thu về. Hãy có sẵn một dòng: "Thu về 412 phiếu, loại 47 phiếu (23 phiếu trả lời sai câu kiểm tra chú ý, 15 phiếu chọn cùng một mức cho mọi câu, 9 phiếu hoàn thành dưới 2 phút), còn 365 phiếu hợp lệ." Tiêu chí loại phải được định ra <em>trước</em> khi xem kết quả, nếu không sẽ bị nghi là chọn phiếu cho đẹp số liệu. Meade và Craig (2012) tổng hợp các cách phát hiện trả lời cẩu thả. Chi tiết từng tiêu chí ở bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">cách lọc phiếu khảo sát không hợp lệ</a>.</p>

<h3>6. "Khảo sát online, làm sao biết không phải một người làm nhiều lần?"</h3>
<p>Trả lời bằng biện pháp bạn đã áp dụng, không bằng lời hứa: giới hạn mỗi tài khoản một lần trả lời, kiểm tra trùng email hoặc số điện thoại nếu có thu, xem các phiếu nộp liên tiếp cách nhau vài giây với đáp án gần giống nhau. Địa chỉ IP không đủ tin cậy vì nhiều người dùng chung mạng ký túc xá hoặc 4G. Nếu bạn thu một phần mẫu qua một nền tảng khảo sát có trả thưởng (ví dụ <a href="https://geniusdata.io/signup?ref=lab-blog&amp;next=%2Fapp%2Fforms&amp;utm_source=goc-nghien-cuu&amp;utm_medium=blog&amp;utm_campaign=ai-lab&amp;utm_content=hoi-dong-hoi-gi-ve-phan-khao-sat" rel="sponsored noopener">Genius Data</a> (link giới thiệu), nơi người nghiên cứu tự đặt mức thưởng cho mỗi câu hỏi và chỉ trả tiền cho phiếu được duyệt), ghi rõ tên nền tảng, số phiếu thu từ đó và các bước lọc bạn tự làm thêm trên dữ liệu tải về. Hội đồng đánh giá các bước bạn làm và báo cáo được, không đánh giá lời quảng cáo của nền tảng.</p>

<h3>7. "Em có kiểm tra sai lệch do phương pháp chung (common method bias) không?"</h3>
<p>Khi mọi biến đều do cùng một người tự trả lời trong cùng một bảng hỏi, hội đồng có quyền nghi ngờ các tương quan bị thổi phồng. Trả lời hai lớp:</p>
<ul>
<li><strong>Biện pháp thủ tục</strong> (Podsakoff và cộng sự, 2003): ẩn danh, trộn thứ tự câu hỏi, tách biến độc lập và phụ thuộc ra các phần khác nhau của bảng hỏi.</li>
<li><strong>Kiểm định thống kê</strong>: với PLS-SEM, dùng đánh giá đa cộng tuyến toàn phần, mọi VIF ≤ 3,3 là không có dấu hiệu sai lệch đáng kể (Kock, 2015). Kiểm định một nhân tố của Harman vẫn hay được dùng nhưng được coi là yếu, nên chỉ để làm bổ sung.</li>
</ul>

<h3>8. "Sao chọn PLS-SEM mà không phải CB-SEM (AMOS)?"</h3>
<p>Lý do hợp lệ: mục tiêu là dự báo và giải thích biến phụ thuộc, mô hình phức tạp với nhiều cấu trúc, có cấu trúc đo lường dạng cấu tạo (formative), hoặc dữ liệu không phân phối chuẩn (Hair và cộng sự, 2019). Lý do <em>không nên</em> nói một mình: "vì mẫu nhỏ". PLS-SEM chạy được với mẫu nhỏ, nhưng power vẫn phụ thuộc cỡ mẫu, và hội đồng sẽ hỏi tiếp ngay câu số 1.</p>

<h2>Phần B: Kết quả phân tích</h2>

<h3>9. "Vì sao chọn thang Likert 5 mức?"</h3>
<p><strong>Trả lời sai:</strong> "Dạ vì các bài khác cũng dùng 5 mức."</p>
<p><strong>Trả lời đúng:</strong> "Em giữ đúng số mức của thang đo gốc (tác giả, năm) để kết quả so sánh được với nghiên cứu trước." Nếu bạn đã đổi số mức, nói rõ lý do (ví dụ đa số trả lời trên điện thoại, đồng bộ thang cho cả bảng hỏi) và thừa nhận đó là một điều chỉnh so với bản gốc. Preston và Colman (2000) cho thấy thang quá ít mức kém hơn về độ tin cậy, còn giữa 5 và 7 mức khác biệt nhỏ, nên lý do bối cảnh là đủ. Chi tiết ở bài <a href="/posts/thang-do-likert/">thang đo Likert 5 mức, 7 mức</a>.</p>

<h3>10. "Vì sao em loại biến này?"</h3>
<p>Hội đồng muốn nghe tiêu chí, không muốn nghe "vì SPSS báo". Chuẩn bị một bảng nhỏ: biến bị loại, ở bước nào (Cronbach's alpha hay EFA), chỉ số cụ thể và ngưỡng có nguồn. Ví dụ: "HL4 có tương quan biến tổng 0,147, dưới mức 0,3 nên bị loại ở bước kiểm định độ tin cậy; EE4 tải 0,52 và 0,47 lên hai nhân tố, chênh 0,05, nên bị loại ở lần chạy EFA thứ nhất." Ngưỡng hệ số tải 0,5 có nguồn từ Hair và cộng sự (2010); mức chênh 0,3 cho biến tải chéo là quy ước thực hành phổ biến ở Việt Nam, nên gọi đúng là quy ước. Thêm hai ý để thuyết phục: bạn loại từng biến một và chạy lại, và nội dung biến bị loại có lý do để bị hiểu lẫn (câu hai ý, câu gần nghĩa với khái niệm khác). Cách đọc từng bảng có ở bài <a href="/posts/cach-doc-ket-qua-efa-spss/">cách đọc kết quả EFA trên SPSS</a>.</p>

<h3>11. "Mô hình có đa cộng tuyến không?"</h3>
<p>Trả lời bằng VIF, không bằng bảng tương quan. Tương quan cặp thấp không loại trừ đa cộng tuyến giữa nhiều biến. Với hồi quy trên SPSS, ngưỡng phổ biến là VIF dưới 10 (Hair và cộng sự, 2010), nhưng nhiều tác giả dùng mức chặt hơn; nếu VIF của bạn đều dưới 3, nói thẳng con số đó. Với PLS-SEM, Hair và cộng sự (2019) xem VIF từ 5 trở lên là dấu hiệu có vấn đề và khuyên lý tưởng là quanh 3 trở xuống. Nếu có biến VIF cao, giải thích bạn đã xử lý thế nào (gộp khái niệm trùng nghĩa, bỏ biến) thay vì im lặng.</p>

<h3>12. "R² chỉ 0,35, có thấp quá không?"</h3>
<p>Không có ngưỡng R² chung cho mọi lĩnh vực. Với PLS-SEM, Hair và cộng sự (2019) nêu các mốc 0,25, 0,50 và 0,75 là yếu, trung bình và đáng kể, đồng thời nhấn mạnh mức chấp nhận được tuỳ bối cảnh nghiên cứu. Câu trả lời tốt gồm: (1) diễn giải đúng ("các biến trong mô hình giải thích 35% biến thiên của ý định"), (2) so với các nghiên cứu cùng chủ đề bạn đã trích ở chương 2, (3) nêu những yếu tố ngoài mô hình có thể giải thích phần còn lại và đưa vào hướng nghiên cứu tiếp theo. Đừng nói "R² thấp nhưng không sao vì các giả thuyết đều có ý nghĩa": đó là hai câu hỏi khác nhau.</p>

<h3>13. "Giả thuyết H3 bị bác, em giải thích thế nào?"</h3>
<p>Giả thuyết bị bác không phải lỗi của bạn, miễn là bạn báo cáo trung thực. Một câu trả lời đủ ý có ba phần. Thứ nhất, nêu đúng kết quả: hệ số, giá trị p, và rằng p lớn hơn 0,05 có nghĩa là dữ liệu chưa đủ bằng chứng cho quan hệ đó, không có nghĩa là chứng minh "không có quan hệ" (Wasserstein &amp; Lazar, 2016). Thứ hai, đưa ra lời giải thích có căn cứ: bối cảnh khác nghiên cứu gốc (ví dụ ảnh hưởng xã hội yếu hơn với người đã quen dùng ứng dụng), đặc điểm mẫu, hoặc power chưa đủ cho hiệu ứng nhỏ. Thứ ba, so với các nghiên cứu khác cũng không ủng hộ quan hệ này nếu có. Tuyệt đối không xoá giả thuyết khỏi chương 2 sau khi thấy kết quả.</p>

<h3>14. "Có khác biệt giữa nam và nữ (hoặc giữa các nhóm thu nhập) không?"</h3>
<p>Câu này hay đến khi bạn có câu hỏi nghiên cứu về nhóm, hoặc khi hội đồng thấy bảng mô tả mẫu lệch. Chuẩn bị: t-test cho biến hai nhóm, ANOVA một yếu tố cho biến nhiều nhóm; đọc kiểm định Levene trước, nếu phương sai không đồng nhất thì dùng dòng "Equal variances not assumed" hoặc kiểm định Welch. Nhớ kiểm tra số người mỗi nhóm: với α = 0,05 và power 0,80, phát hiện khác biệt cỡ trung bình giữa hai nhóm cần khoảng 64 người mỗi nhóm (Faul và cộng sự, 2007). Nếu một nhóm chỉ có 20 người, hãy nói rõ kết quả cho nhóm đó chỉ mang tính tham khảo, hoặc gộp nhóm trước khi phân tích. Bảng cỡ mẫu theo nhóm có ở bài <a href="/posts/co-mau-nghien-cuu-bao-nhieu-la-du/">cỡ mẫu nghiên cứu bao nhiêu là đủ</a>, cách trình bày ở mục so sánh nhóm của bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4</a>.</p>

<p>Trước buổi bảo vệ, đối chiếu từng chỉ số của bạn với <a href="/nguong-chap-nhan/">bảng ngưỡng chấp nhận có nguồn</a>, nhập những chỉ số chưa đạt vào <a href="/cong-cu/bac-si-ket-qua/">bác sĩ kết quả</a> để chuẩn bị câu trả lời, và kiểm tra lại danh mục tài liệu bằng <a href="/cong-cu/trich-dan-apa/">công cụ trích dẫn APA 7</a>: hội đồng hay soi lỗi trích dẫn thang đo gốc.</p>

<h2>Một trang để in mang theo</h2>
<p>Trước buổi bảo vệ, viết ra giấy cho từng câu trên: con số của bạn, lý do, và một trích dẫn. Mẫu một dòng cho mỗi câu: "Câu 1: n tối thiểu 155 (Kock &amp; Hadaya, 2018), thu 412, hợp lệ 365." Nếu câu nào bạn chưa trả lời được trong một câu nói, đó là chỗ cần sửa trong chương 3 trước, không phải chỗ để ứng biến trước hội đồng.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Brislin, R. W. (1970). Back-translation for cross-cultural research. <em>Journal of Cross-Cultural Psychology, 1</em>(3), 185–216. https://doi.org/10.1177/135910457000100301</li>
<li>Faul, F., Erdfelder, E., Lang, A.-G., &amp; Buchner, A. (2007). G*Power 3: A flexible statistical power analysis program for the social, behavioral, and biomedical sciences. <em>Behavior Research Methods, 39</em>(2), 175–191. https://doi.org/10.3758/BF03193146</li>
<li>Faul, F., Erdfelder, E., Buchner, A., &amp; Lang, A.-G. (2009). Statistical power analyses using G*Power 3.1: Tests for correlation and regression analyses. <em>Behavior Research Methods, 41</em>(4), 1149–1160. https://doi.org/10.3758/BRM.41.4.1149</li>
<li>Hair, J. F., Black, W. C., Babin, B. J., &amp; Anderson, R. E. (2010). <em>Multivariate data analysis</em> (7th ed.). Pearson.</li>
<li>Hair, J. F., Risher, J. J., Sarstedt, M., &amp; Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review, 31</em>(1), 2–24. https://doi.org/10.1108/EBR-11-2018-0203</li>
<li>Kock, N. (2015). Common method bias in PLS-SEM: A full collinearity assessment approach. <em>International Journal of e-Collaboration, 11</em>(4), 1–10. https://doi.org/10.4018/ijec.2015100101</li>
<li>Kock, N., &amp; Hadaya, P. (2018). Minimum sample size estimation in PLS-SEM: The inverse square root and gamma-exponential methods. <em>Information Systems Journal, 28</em>(1), 227–261. https://doi.org/10.1111/isj.12131</li>
<li>Meade, A. W., &amp; Craig, S. B. (2012). Identifying careless responses in survey data. <em>Psychological Methods, 17</em>(3), 437–455. https://doi.org/10.1037/a0028085</li>
<li>Nunnally, J. C. (1978). <em>Psychometric theory</em> (2nd ed.). McGraw-Hill.</li>
<li>Podsakoff, P. M., MacKenzie, S. B., Lee, J.-Y., &amp; Podsakoff, N. P. (2003). Common method biases in behavioral research: A critical review of the literature and recommended remedies. <em>Journal of Applied Psychology, 88</em>(5), 879–903. https://doi.org/10.1037/0021-9010.88.5.879</li>
<li>Preston, C. C., &amp; Colman, A. M. (2000). Optimal number of response categories in rating scales: Reliability, validity, discriminating power, and respondent preferences. <em>Acta Psychologica, 104</em>(1), 1–15. https://doi.org/10.1016/S0001-6918(99)00050-5</li>
<li>Wasserstein, R. L., &amp; Lazar, N. A. (2016). The ASA statement on p-values: Context, process, and purpose. <em>The American Statistician, 70</em>(2), 129–133. https://doi.org/10.1080/00031305.2016.1154108</li>
</ul>
