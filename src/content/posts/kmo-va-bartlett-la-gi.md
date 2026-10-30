---
title: "KMO là gì? Kiểm định KMO và Bartlett trong SPSS, cách tính và xử lý khi thấp"
description: "Hệ số KMO và kiểm định Bartlett là gì, ngưỡng KMO ≥ 0,5 (Kaiser 1974), công thức và ví dụ tính tay, MSA từng biến trong Anti-image, xử lý KMO thấp, lỗi not positive definite."
pubDatetime: 2026-10-30T16:30:00+07:00
featured: false
tags: ["EFA","SPSS","phân tích dữ liệu"]
---

<p><strong>KMO (Kaiser-Meyer-Olkin) là chỉ số từ 0 đến 1 cho biết dữ liệu có phù hợp để phân tích nhân tố khám phá (EFA) hay không, bằng cách so sánh độ lớn của tương quan giữa các biến với tương quan riêng phần của chúng. Kiểm định Bartlett kiểm tra giả thuyết các biến hoàn toàn không tương quan với nhau.</strong> Dữ liệu đủ điều kiện chạy EFA khi KMO từ 0,5 trở lên (Kaiser, 1974) và Bartlett có Sig. nhỏ hơn 0,05. KMO từ 0,8 được xem là tốt.</p>

<p>Bảng <em>KMO and Bartlett's Test</em> là bảng đầu tiên của EFA trong SPSS. Bài này giải thích hai chỉ số đo cái gì, tính tay một ví dụ để bạn hiểu vì sao KMO cao hay thấp, cách đọc MSA của từng biến và xử lý khi KMO không đạt. Cách đọc toàn bộ kết quả EFA (Communalities, phương sai trích, ma trận xoay) có ở bài <a href="/posts/cach-doc-ket-qua-efa-spss/">phân tích EFA trong SPSS</a>.</p>

<h2>KMO đo cái gì</h2>
<p>Phân tích nhân tố giả định các biến tương quan với nhau vì chúng cùng phản ánh một vài nhân tố chung. Nếu đúng như vậy, khi đã loại phần ảnh hưởng của các biến còn lại, tương quan riêng phần giữa hai biến bất kỳ phải nhỏ. KMO đặt hai đại lượng cạnh nhau:</p>
<p><code>KMO = Σ r²ᵢⱼ / (Σ r²ᵢⱼ + Σ p²ᵢⱼ)</code></p>
<ul>
<li><strong>rᵢⱼ</strong>: tương quan thông thường giữa biến i và j.</li>
<li><strong>pᵢⱼ</strong>: tương quan riêng phần giữa i và j khi kiểm soát mọi biến khác (SPSS in dấu ngược lại ở phần <em>Anti-image Correlation</em>).</li>
<li>Tổng lấy trên mọi cặp i ≠ j.</li>
</ul>
<p>Tương quan riêng phần nhỏ so với tương quan thô thì KMO tiến về 1: phần chung giữa các biến được giải thích tốt bởi các biến khác, đúng điều EFA cần. Tương quan riêng phần lớn thì KMO thấp: các cặp biến liên quan với nhau theo kiểu riêng lẻ, không qua nhân tố chung. Chỉ số do Kaiser (1970) đề xuất dưới tên "measure of sampling adequacy" (MSA), sau được hoàn thiện trong Kaiser và Rice (1974).</p>

<h2>Ngưỡng KMO bao nhiêu là đạt</h2>
<table>
<thead>
<tr><th>Giá trị KMO</th><th>Mô tả của Kaiser (1974)</th><th>Cách hiểu trong khoá luận</th></tr>
</thead>
<tbody>
<tr><td>Từ 0,90</td><td>Marvelous (tuyệt vời)</td><td>Rất phù hợp</td></tr>
<tr><td>0,80 đến dưới 0,90</td><td>Meritorious (tốt)</td><td>Phù hợp tốt</td></tr>
<tr><td>0,70 đến dưới 0,80</td><td>Middling (trung bình)</td><td>Phù hợp</td></tr>
<tr><td>0,60 đến dưới 0,70</td><td>Mediocre (tạm được)</td><td>Chấp nhận được</td></tr>
<tr><td>0,50 đến dưới 0,60</td><td>Miserable (kém)</td><td>Chạm ngưỡng, nên xem MSA từng biến</td></tr>
<tr><td>Dưới 0,50</td><td>Unacceptable (không chấp nhận)</td><td>Không chạy EFA được</td></tr>
</tbody>
</table>
<p>Câu "0,5 ≤ KMO ≤ 1" quen thuộc trong khoá luận Việt Nam là cách viết gọn của hàng cuối bảng này. Một số giáo trình nước ngoài đặt mốc 0,6 (Tabachnick &amp; Fidell, 2019). Ngưỡng KMO cùng các chỉ số khác của EFA, CFA được tổng hợp kèm nguồn ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận Cronbach, KMO, AVE</a>.</p>

<h2>Ví dụ tính tay KMO</h2>
<p>Bốn biến quan sát, 200 phiếu, ma trận tương quan:</p>
<table>
<thead>
<tr><th></th><th>V1</th><th>V2</th><th>V3</th><th>V4</th></tr>
</thead>
<tbody>
<tr><td>V1</td><td>1</td><td>0,52</td><td>0,48</td><td>0,20</td></tr>
<tr><td>V2</td><td>0,52</td><td>1</td><td>0,55</td><td>0,15</td></tr>
<tr><td>V3</td><td>0,48</td><td>0,55</td><td>1</td><td>0,18</td></tr>
<tr><td>V4</td><td>0,20</td><td>0,15</td><td>0,18</td><td>1</td></tr>
</tbody>
</table>
<p>Tương quan riêng phần (tính từ ma trận nghịch đảo của ma trận tương quan): V1–V2 = 0,345; V1–V3 = 0,259; V1–V4 = 0,118; V2–V3 = 0,398; V2–V4 = 0,017; V3–V4 = 0,083.</p>
<ol>
<li>Tổng bình phương tương quan trên 6 cặp: 0,2704 + 0,2304 + 0,0400 + 0,3025 + 0,0225 + 0,0324 = 0,898.</li>
<li>Tổng bình phương tương quan riêng phần: 0,1190 + 0,0671 + 0,0139 + 0,1584 + 0,0003 + 0,0069 = 0,366.</li>
<li>KMO = 0,898 / (0,898 + 0,366) = 0,898 / 1,264 = 0,711.</li>
</ol>
<p>KMO = 0,711, mức "middling", dữ liệu phù hợp để chạy EFA. Tử số và mẫu số đều nhân đôi nếu bạn cộng cả hai nửa ma trận, nên kết quả không đổi.</p>

<h2>MSA của từng biến: bảng Anti-image</h2>
<p>KMO tổng là trung bình có trọng số; mỗi biến có MSA riêng, tính bằng cùng công thức nhưng chỉ trên các cặp có chứa biến đó. Trong SPSS, tích <code>Anti-image</code> ở nút <code>Descriptives</code>, rồi đọc đường chéo của phần <em>Anti-image Correlation</em> (các số có chữ "a" nhỏ). Với ví dụ trên:</p>
<table>
<thead>
<tr><th>Biến</th><th>MSA</th></tr>
</thead>
<tbody>
<tr><td>V1</td><td>0,730</td></tr>
<tr><td>V2</td><td>0,682</td></tr>
<tr><td>V3</td><td>0,709</td></tr>
<tr><td>V4</td><td>0,819</td></tr>
</tbody>
</table>
<p>Điều bất ngờ: V4, biến tương quan yếu với mọi biến khác (0,15 đến 0,20), lại có MSA cao nhất. Lý do là tương quan riêng phần của V4 còn nhỏ hơn nữa (0,017 đến 0,118). MSA cao chỉ có nghĩa V4 không có quan hệ "riêng tư" với biến nào; nó không có nghĩa V4 đo tốt nhân tố chung. Biến yếu kiểu V4 sẽ lộ ra ở bước sau: communality thấp và hệ số tải dưới 0,5. Vì vậy đừng dùng KMO hay MSA để quyết định giá trị hội tụ.</p>
<p>Biến có MSA dưới 0,5 thì cân nhắc loại, mỗi lần một biến, bắt đầu từ biến thấp nhất, rồi chạy lại (Hair và cộng sự, 2019).</p>

<h2>Kiểm định Bartlett</h2>
<p>Bartlett's Test of Sphericity kiểm định giả thuyết H0: ma trận tương quan tổng thể là ma trận đơn vị, tức mọi tương quan giữa các biến bằng 0. Thống kê kiểm định (Bartlett, 1950, 1954):</p>
<p><code>χ² = −[(n − 1) − (2p + 5) / 6] × ln|R|</code>, bậc tự do <code>df = p(p − 1) / 2</code></p>
<p>với n là cỡ mẫu, p là số biến, |R| là định thức ma trận tương quan. Với ví dụ trên: |R| = 0,448; ln|R| = −0,803; (200 − 1) − 13 / 6 = 196,83; χ² = 196,83 × 0,803 = 158,07; df = 4 × 3 / 2 = 6; Sig. &lt; 0,001. Bác bỏ H0: các biến có tương quan, phân tích nhân tố có ý nghĩa.</p>
<p>Bartlett rất dễ có ý nghĩa với cỡ mẫu vài trăm, nên nó gần như chỉ loại trừ tình huống cực đoan là các biến không liên quan gì nhau. Dziuban và Shirkey (1974) khuyên không dựa riêng vào Bartlett mà xem thêm MSA. Nói cách khác, Bartlett là điều kiện cần, KMO mới là chỉ số đáng đọc.</p>

<h2>Bảng SPSS và cách đọc</h2>
<p>Chạy <code>Analyze &gt; Dimension Reduction &gt; Factor</code>, đưa các biến vào, bấm <code>Descriptives</code>, tích <code>KMO and Bartlett's test of sphericity</code> và <code>Anti-image</code>. Bảng kết quả với 20 biến của một mô hình 5 nhân tố có thể trông như sau:</p>
<table>
<thead>
<tr><th colspan="2">KMO and Bartlett's Test</th><th>Giá trị</th></tr>
</thead>
<tbody>
<tr><td colspan="2">Kaiser-Meyer-Olkin Measure of Sampling Adequacy</td><td>0,846</td></tr>
<tr><td rowspan="3">Bartlett's Test of Sphericity</td><td>Approx. Chi-Square</td><td>2.731,52</td></tr>
<tr><td>df</td><td>190</td></tr>
<tr><td>Sig.</td><td>,000</td></tr>
</tbody>
</table>
<p>Kiểm tra nhanh df: 20 × 19 / 2 = 190, đúng với 20 biến; nếu df không khớp với số biến bạn định đưa vào là bạn đã quên hoặc thừa một biến. "Sig. = ,000" nghĩa là p &lt; 0,001, viết như vậy trong khoá luận chứ không viết p = 0.</p>

<h2>KMO thấp: nguyên nhân và cách xử lý</h2>
<table>
<thead>
<tr><th>Nguyên nhân</th><th>Dấu hiệu</th><th>Cách xử lý</th></tr>
</thead>
<tbody>
<tr><td>Có biến không thuộc về nhóm nào</td><td>MSA của biến đó dưới 0,5</td><td>Loại biến có MSA thấp nhất, chạy lại</td></tr>
<tr><td>Câu đảo chiều chưa mã hoá lại</td><td>Tương quan âm trong ma trận</td><td>Mã hoá lại (thang 5 mức: 6 − giá trị cũ)</td></tr>
<tr><td>Cỡ mẫu nhỏ</td><td>Dưới khoảng 100 phiếu, tương quan dao động mạnh</td><td>Thu thêm phiếu; tính mức cần ở <a href="/cong-cu/tinh-co-mau/">máy tính cỡ mẫu</a>, mục EFA</td></tr>
<tr><td>Quá ít biến cho mỗi nhân tố</td><td>Thang đo 2 câu</td><td>Thiết kế lại từ đầu với ít nhất 3 câu mỗi khái niệm</td></tr>
<tr><td>Phiếu trả lời bừa, rập khuôn</td><td>Tương quan thấp và lộn xộn</td><td>Lọc phiếu theo <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">cách lọc phiếu khảo sát không hợp lệ</a></td></tr>
</tbody>
</table>
<p>MacCallum và cộng sự (1999) cho thấy cỡ mẫu cần cho EFA phụ thuộc vào communality: khi communality cao và mỗi nhân tố có nhiều biến, mẫu nhỏ vẫn cho nghiệm ổn định; khi communality thấp, cần mẫu lớn hơn nhiều. Mẫu thử 30 phiếu thường cho KMO thấp hoặc không tính được, nên đừng hoảng khi chạy EFA trên dữ liệu pilot. Nhập KMO, MSA và các con số khác vào <a href="/cong-cu/bac-si-ket-qua/">bác sĩ kết quả</a> để xem cách xử lý hợp lệ có trích dẫn.</p>

<h2>Lỗi "This matrix is not positive definite"</h2>
<p>Khi SPSS không in KMO mà báo ma trận không xác định dương, định thức |R| bằng 0 hoặc âm và mọi công thức ở trên đều không tính được. Nguyên nhân hay gặp: đưa cả biến tổng hoặc biến trung bình cùng với các biến thành phần; hai biến trùng nhau hoàn toàn (copy cột); số phiếu ít hơn số biến; dùng Exclude cases pairwise với nhiều dữ liệu thiếu. Kiểm tra danh sách biến và dữ liệu thiếu trước, đó là nguyên nhân trong đa số trường hợp.</p>

<h2>Câu mẫu khi viết vào chương 4</h2>
<blockquote>Kết quả kiểm định cho thấy hệ số KMO = 0,846, thoả mãn điều kiện 0,5 ≤ KMO ≤ 1 (Kaiser, 1974), và kiểm định Bartlett có ý nghĩa thống kê (χ² = 2.731,52; df = 190; Sig. &lt; 0,001), cho thấy các biến quan sát có tương quan với nhau trong tổng thể. Do đó dữ liệu phù hợp để phân tích nhân tố khám phá.</blockquote>
<p>Muốn có bảng này mà không cần SPSS, tải file Excel lên <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát</a>: công cụ chạy EFA, xuất KMO, Bartlett, ma trận xoay và đoạn văn viết sẵn theo mẫu trên.</p>

<h2>Câu hỏi thường gặp</h2>
<h3>KMO là viết tắt của gì?</h3>
<p>Kaiser-Meyer-Olkin, ghép tên ba nhà nghiên cứu Kaiser, Meyer và Olkin. Tên đầy đủ trong SPSS là Kaiser-Meyer-Olkin Measure of Sampling Adequacy.</p>
<h3>Vì sao chạy EFA cho thang đo 2 biến thì KMO luôn bằng 0,5?</h3>
<p>Với 2 biến, không có biến nào khác để kiểm soát, nên tương quan riêng phần bằng đúng tương quan thô. Thay vào công thức: r² / (r² + r²) = 0,5. Đây là lý do thang đo 2 câu không phù hợp cho EFA.</p>
<h3>KMO 0,5 có được không?</h3>
<p>Đạt ngưỡng tối thiểu nhưng ở mức Kaiser gọi là "miserable". Xem MSA từng biến, loại biến thấp nhất nếu có lý do nội dung, và nêu rõ trong khoá luận. Hội đồng thường hỏi khi KMO dưới 0,6.</p>
<h3>KMO cao có nghĩa là thang đo có giá trị hội tụ không?</h3>
<p>Không. KMO chỉ cho biết dữ liệu phù hợp để phân tích nhân tố. Giá trị hội tụ đánh giá qua hệ số tải (EFA) hoặc AVE (CFA, PLS-SEM); độ tin cậy qua <a href="/posts/cronbach-alpha-la-gi/">Cronbach's alpha</a>.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Bartlett, M. S. (1950). Tests of significance in factor analysis. <em>British Journal of Statistical Psychology, 3</em>(2), 77–85. https://doi.org/10.1111/j.2044-8317.1950.tb00285.x</li>
<li>Bartlett, M. S. (1954). A note on the multiplying factors for various χ² approximations. <em>Journal of the Royal Statistical Society: Series B (Methodological), 16</em>(2), 296–298. https://doi.org/10.1111/j.2517-6161.1954.tb00174.x</li>
<li>Dziuban, C. D., &amp; Shirkey, E. C. (1974). When is a correlation matrix appropriate for factor analysis? Some decision rules. <em>Psychological Bulletin, 81</em>(6), 358–361. https://doi.org/10.1037/h0036316</li>
<li>Hair, J. F., Black, W. C., Babin, B. J., &amp; Anderson, R. E. (2019). <em>Multivariate data analysis</em> (8th ed.). Cengage.</li>
<li>Kaiser, H. F. (1970). A second generation little jiffy. <em>Psychometrika, 35</em>(4), 401–415. https://doi.org/10.1007/BF02291817</li>
<li>Kaiser, H. F. (1974). An index of factorial simplicity. <em>Psychometrika, 39</em>(1), 31–36. https://doi.org/10.1007/BF02291575</li>
<li>Kaiser, H. F., &amp; Rice, J. (1974). Little Jiffy, Mark IV. <em>Educational and Psychological Measurement, 34</em>(1), 111–117. https://doi.org/10.1177/001316447403400115</li>
<li>MacCallum, R. C., Widaman, K. F., Zhang, S., &amp; Hong, S. (1999). Sample size in factor analysis. <em>Psychological Methods, 4</em>(1), 84–99. https://doi.org/10.1037/1082-989X.4.1.84</li>
<li>Tabachnick, B. G., &amp; Fidell, L. S. (2019). <em>Using multivariate statistics</em> (7th ed.). Pearson.</li>
</ul>
