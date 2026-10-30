---
title: "R bình phương hiệu chỉnh là gì? Bao nhiêu là đủ"
description: "R² và R² hiệu chỉnh khác nhau thế nào, công thức tính tay, R bình phương bao nhiêu là tốt, R² hiệu chỉnh dưới 50% có sao không và cách viết vào chương 4."
pubDatetime: 2026-10-30T17:15:00+07:00
featured: false
tags: ["SPSS","phân tích dữ liệu","khoá luận"]
---

<p><strong>R² (hệ số xác định) là tỉ lệ biến thiên của biến phụ thuộc được các biến độc lập trong mô hình giải thích; R² hiệu chỉnh (Adjusted R²) là R² đã trừ đi phần tăng "ảo" do thêm biến, tính theo công thức 1 − (1 − R²)(n − 1)/(n − k − 1).</strong> R² luôn tăng khi thêm biến, kể cả biến vô nghĩa; R² hiệu chỉnh chỉ tăng khi biến mới giải thích thêm nhiều hơn mức kỳ vọng do ngẫu nhiên. Không có mốc R² "đạt" chung cho mọi đề tài: R² hiệu chỉnh dưới 50% hoàn toàn có thể chấp nhận, miễn là mô hình có ý nghĩa thống kê và bạn so với các nghiên cứu cùng chủ đề.</p>

<p>Câu "R bình phương bao nhiêu là tốt" là một trong những câu hội đồng hỏi nhiều nhất ở phần hồi quy. Bài này giải thích hai chỉ số đo gì, tính tay một ví dụ, cho thấy R² tăng ra sao khi nhồi thêm biến nhiễu, tổng hợp các mốc tham khảo có nguồn và gợi ý cách trả lời khi R² thấp. Ví dụ số dùng dữ liệu mô phỏng bằng Python (numpy).</p>

<h2>R² đo cái gì</h2>
<p>Biến phụ thuộc (ví dụ ý định mua) có tổng biến thiên quanh giá trị trung bình, ký hiệu SST. Mô hình hồi quy dự đoán được một phần, phần còn lại là phần dư (SSE):</p>
<p><code>R² = 1 − SSE / SST</code></p>
<p>R² = 0,35 nghĩa là các biến độc lập cùng giải thích 35% biến thiên của ý định mua <em>trong mẫu</em>; 65% còn lại do các yếu tố ngoài mô hình và sai số đo lường. Với hồi quy có hằng số, R² nằm trong khoảng 0 đến 1 và bằng bình phương tương quan giữa giá trị thực và giá trị dự đoán. Trong bảng Model Summary của SPSS, cột R là căn bậc hai của R², không phải hệ số tương quan với một biến cụ thể nào.</p>
<p>R² có một khuyết điểm: nó <strong>không bao giờ giảm</strong> khi thêm biến. Một biến hoàn toàn ngẫu nhiên vẫn trùng hợp tương quan một chút với biến phụ thuộc trong mẫu, và mô hình tận dụng phần trùng hợp đó. Với mẫu nhỏ và nhiều biến, R² vì vậy phóng đại khả năng giải thích thật.</p>

<h2>R² hiệu chỉnh sửa lỗi đó thế nào</h2>
<p><code>R² hiệu chỉnh = 1 − (1 − R²) × (n − 1) / (n − k − 1)</code></p>
<p>với n là cỡ mẫu, k là số biến độc lập. Công thức này thường được gọi là công thức Wherry (Wherry, 1931). Thừa số (n − 1)/(n − k − 1) lớn hơn 1 và càng lớn khi k gần n, nên phần "chưa giải thích" (1 − R²) bị phóng to, kéo R² hiệu chỉnh xuống. Hai hệ quả:</p>
<ul>
<li>R² hiệu chỉnh luôn nhỏ hơn hoặc bằng R², và có thể <strong>âm</strong> khi mô hình gần như không giải thích được gì.</li>
<li>Thêm một biến chỉ làm R² hiệu chỉnh tăng nếu biến đó giải thích thêm đủ nhiều, cụ thể là khi giá trị |t| của nó lớn hơn 1.</li>
</ul>
<p>Mẫu càng lớn so với số biến thì hai chỉ số càng gần nhau. Cùng R² = 0,30:</p>
<table>
<thead><tr><th>Cỡ mẫu n</th><th>Số biến k</th><th>R²</th><th>R² hiệu chỉnh</th></tr></thead>
<tbody>
<tr><td>300</td><td>5</td><td>0,300</td><td>0,288</td></tr>
<tr><td>100</td><td>5</td><td>0,300</td><td>0,263</td></tr>
<tr><td>50</td><td>8</td><td>0,300</td><td>0,163</td></tr>
</tbody>
</table>
<p>Ví dụ dòng thứ hai: 1 − 0,70 × 99/94 = 1 − 0,70 × 1,0532 = 1 − 0,7372 = 0,263. Với 50 phiếu và 8 biến, gần một nửa R² là phần "ảo".</p>

<h2>Ví dụ: nhồi biến nhiễu vào mô hình</h2>
<p>Dữ liệu mô phỏng 80 quan sát. Biến phụ thuộc phụ thuộc thật vào 3 biến độc lập. Sau đó lần lượt thêm 7 biến hoàn toàn ngẫu nhiên, không liên quan gì đến biến phụ thuộc:</p>
<table>
<thead><tr><th>Số biến trong mô hình</th><th>R²</th><th>R² hiệu chỉnh</th></tr></thead>
<tbody>
<tr><td>3 (chỉ biến thật)</td><td>0,202</td><td>0,171</td></tr>
<tr><td>4</td><td>0,209</td><td>0,166</td></tr>
<tr><td>5</td><td>0,211</td><td>0,158</td></tr>
<tr><td>6</td><td>0,212</td><td>0,147</td></tr>
<tr><td>7</td><td>0,217</td><td>0,141</td></tr>
<tr><td>8</td><td>0,217</td><td>0,128</td></tr>
<tr><td>9</td><td>0,223</td><td>0,123</td></tr>
<tr><td>10 (thêm 7 biến nhiễu)</td><td>0,224</td><td>0,111</td></tr>
</tbody>
</table>
<p>R² tăng đều từ 0,202 lên 0,224, như thể mô hình "tốt hơn". R² hiệu chỉnh giảm đều từ 0,171 xuống 0,111, phản ánh đúng rằng các biến mới chỉ thêm nhiễu. Tính tay hai dòng đầu và cuối:</p>
<ul>
<li>3 biến: 1 − (1 − 0,202) × 79/76 = 1 − 0,798 × 1,0395 = 0,171.</li>
<li>10 biến: 1 − (1 − 0,224) × 79/69 = 1 − 0,776 × 1,1449 = 0,111.</li>
</ul>
<p>Kiểm định F cho phần R² tăng thêm (R² change) cũng xác nhận: F(7, 69) = 0,27, p = 0,96, tức 7 biến mới không giải thích thêm gì có ý nghĩa. Trong khi đó mô hình 3 biến có ý nghĩa: F(3, 76) = 6,43, p &lt; 0,001. Đây là lý do khi mô hình có nhiều biến độc lập, con số nên báo cáo và diễn giải là R² hiệu chỉnh.</p>

<h2>R bình phương bao nhiêu là tốt</h2>
<p>Không có ngưỡng chung. Các mốc dưới đây là mốc tham khảo do tác giả cụ thể đề xuất cho bối cảnh cụ thể; khi dùng, ghi đúng nguồn và đúng bối cảnh.</p>
<table>
<thead><tr><th>Mốc</th><th>Nguồn và bối cảnh</th></tr></thead>
<tbody>
<tr><td>R² ≈ 0,02 / 0,13 / 0,26: nhỏ / vừa / lớn</td><td>Quy đổi từ f² = 0,02 / 0,15 / 0,35 của Cohen (1988, 1992), theo R² = f² / (1 + f²); dùng cho khoa học hành vi</td></tr>
<tr><td>R² = 0,67 / 0,33 / 0,19: đáng kể / trung bình / yếu</td><td>Chin (1998), cho biến tiềm ẩn nội sinh trong mô hình PLS</td></tr>
<tr><td>R² = 0,75 / 0,50 / 0,25: đáng kể / trung bình / yếu</td><td>Hair và cộng sự (2011), cho nghiên cứu marketing dùng PLS-SEM</td></tr>
</tbody>
</table>
<p>Ba bộ mốc chênh nhau rất xa, và đó chính là điểm cần hiểu: "R² tốt" phụ thuộc lĩnh vực. Hành vi con người chịu tác động của rất nhiều yếu tố, nên mô hình 4 đến 5 biến giải thích 30% ý định đã là kết quả bình thường. Ngược lại, hồi quy chuỗi thời gian kinh tế vĩ mô thường cho R² trên 0,9 chỉ vì các biến cùng có xu hướng tăng theo thời gian. Hair và cộng sự (2019) cũng lưu ý R² rất cao (từ 0,90) với biến thái độ, hành vi thường là dấu hiệu quá khớp hoặc các khái niệm đo trùng nhau, không phải dấu hiệu mô hình xuất sắc.</p>
<p>Cách lập luận nên dùng: tìm 3 đến 5 nghiên cứu cùng mô hình (ví dụ TAM cho ví điện tử), ghi R² của họ, và đặt R² của bạn cạnh đó. Bảng ngưỡng cho mọi chỉ số kèm nguồn ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận các chỉ số</a>.</p>

<h2>R² hiệu chỉnh nhỏ hơn 50% có sao không</h2>
<p>Không làm hỏng mô hình. Câu hỏi này xuất phát từ quan niệm "R² dưới 0,5 là mô hình kém", vốn không có nguồn học thuật. Hãy phân biệt hai mục tiêu:</p>
<ul>
<li><strong>Giải thích (kiểm định giả thuyết)</strong>: mục tiêu của đa số khoá luận. Câu hỏi là các biến độc lập có tác động có ý nghĩa đến biến phụ thuộc hay không và theo chiều nào. R² thấp không làm hệ số bị chệch; Wooldridge (2020) nhấn mạnh rằng R² thấp chỉ cho biết còn nhiều yếu tố khác ảnh hưởng đến biến phụ thuộc, chứ không có nghĩa là ước lượng tác động của các biến trong mô hình không đáng tin.</li>
<li><strong>Dự báo</strong>: nếu mục tiêu là dự đoán chính xác giá trị cho từng người, R² thấp đúng là hạn chế. Khi đó nên đánh giá khả năng dự báo ngoài mẫu (với PLS-SEM là PLSpredict, theo Shmueli và cộng sự, 2019) thay vì chỉ nhìn R².</li>
</ul>
<p>Khi R² thấp bất thường so với nghiên cứu cùng chủ đề, hãy kiểm tra: câu đảo chiều đã mã hoá ngược chưa, biến tổng hợp đã tính đúng chưa, có nhiều phiếu trả lời rập khuôn không (xem bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">lọc phiếu khảo sát không hợp lệ</a>), và có thiếu biến quan trọng trong lý thuyết không. <a href="/cong-cu/bac-si-ket-qua/">Bác sĩ kết quả</a> chẩn đoán các nguyên nhân này theo quy tắc và gợi ý đoạn văn giải trình.</p>

<h2>R² trong SPSS, Stata và SmartPLS</h2>
<ul>
<li><strong>SPSS</strong>: bảng Model Summary có R, R Square, Adjusted R Square, Std. Error of the Estimate. Hồi quy phân cấp (nhiều Block) thêm R Square Change và Sig. F Change. Cách đọc toàn bộ bảng có ở bài <a href="/posts/hoi-quy-tuyen-tinh-boi-spss/">hồi quy tuyến tính bội SPSS</a>.</li>
<li><strong>Stata</strong>: lệnh <code>regress</code> in R-squared và Adj R-squared ở góc phải trên. Với dữ liệu bảng, <code>xtreg, fe</code> in ba loại R² (within, between, overall); xem bài <a href="/posts/hoi-quy-du-lieu-bang-panel/">hồi quy dữ liệu bảng</a>.</li>
<li><strong>SmartPLS</strong>: kết quả PLS-SEM algorithm → Quality criteria → R-square, gồm R-square và R-square adjusted cho mỗi biến tiềm ẩn nội sinh.</li>
<li><strong>Hồi quy logistic</strong> không có R² theo nghĩa trên; SPSS in Cox &amp; Snell và Nagelkerke R², là các "pseudo R²" đọc khác hẳn, giải thích ở bài <a href="/posts/hoi-quy-logistic-spss/">hồi quy logistic trong SPSS</a>.</li>
</ul>
<p>Nếu không có SPSS, <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát</a> in cả R² và R² hiệu chỉnh khi chạy hồi quy.</p>

<h2>Từ R² sang f²: đo đóng góp của từng biến</h2>
<p>R² cho biết cả mô hình giải thích bao nhiêu; muốn biết riêng một biến đóng góp bao nhiêu, dùng f² của Cohen (1988):</p>
<p><code>f² = (R²đủ − R²bỏ biến) / (1 − R²đủ)</code></p>
<p>Ví dụ giả định: R² đủ = 0,512, bỏ biến niềm tin thì R² còn 0,480: f² = 0,032 / 0,488 = 0,066, tác động nhỏ đến vừa theo mốc 0,02 / 0,15 / 0,35. SmartPLS in f² cho từng đường dẫn trong mục Quality criteria → f-square.</p>

<h2>Câu mẫu viết vào chương 4</h2>
<blockquote><p>Mô hình hồi quy có ý nghĩa thống kê (F(4, 245) = 64,26; p &lt; 0,001). Giá trị R² hiệu chỉnh bằng 0,504 cho thấy các biến độc lập trong mô hình giải thích được 50,4% biến thiên của ý định sử dụng. Mức giải thích này tương đương với các nghiên cứu áp dụng mô hình chấp nhận công nghệ trong bối cảnh ví điện tử [trích 2 đến 3 nghiên cứu], và lớn hơn mốc tác động lớn quy đổi từ Cohen (1988).</p></blockquote>
<p>Nếu R² hiệu chỉnh chỉ khoảng 0,20: "Mô hình giải thích được 20,3% biến thiên của ý định mua. Mức này cho thấy còn nhiều yếu tố ngoài mô hình ảnh hưởng đến ý định mua, là hướng mở rộng cho nghiên cứu sau; tuy nhiên mục tiêu của nghiên cứu là kiểm định tác động của các yếu tố đã đề xuất, và các tác động này có ý nghĩa thống kê." Ghi phần "yếu tố ngoài mô hình" vào mục hạn chế ở chương 5.</p>

<h2>Câu hỏi thường gặp</h2>
<h3>R bình phương và R bình phương hiệu chỉnh nên báo cáo cái nào?</h3>
<p>Báo cáo cả hai, diễn giải theo R² hiệu chỉnh khi mô hình có từ hai biến độc lập, nhất là khi mẫu nhỏ so với số biến. Với hồi quy đơn và mẫu vài trăm phiếu, hai con số gần như bằng nhau.</p>
<h3>R bình phương hiệu chỉnh nhỏ hơn 50 thì có cần thêm biến không?</h3>
<p>Không nên thêm biến chỉ để tăng R². Biến thêm vào phải có cơ sở lý thuyết và có giả thuyết từ chương 2; thêm biến sau khi thấy kết quả là chọn mô hình theo dữ liệu.</p>
<h3>R bình phương hiệu chỉnh âm là sao?</h3>
<p>Mô hình giải thích được ít hơn mức kỳ vọng nếu các biến độc lập hoàn toàn ngẫu nhiên. Thường đi kèm kiểm định F không có ý nghĩa. Kiểm tra lại mã hoá dữ liệu và cách tạo biến trước khi kết luận.</p>
<h3>R bình phương bằng 0,9 có tốt không?</h3>
<p>Với dữ liệu khảo sát thái độ, hành vi, R² từ 0,90 thường đáng ngờ hơn là đáng mừng: hai khái niệm có thể đo trùng nhau (kiểm tra HTMT và VIF, xem bài <a href="/posts/he-so-vif-da-cong-tuyen/">hệ số VIF</a>) hoặc mô hình quá khớp với mẫu.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Chin, W. W. (1998). The partial least squares approach to structural equation modeling. In G. A. Marcoulides (Ed.), <em>Modern methods for business research</em> (pp. 295–336). Lawrence Erlbaum Associates.</li>
<li>Cohen, J. (1988). <em>Statistical power analysis for the behavioral sciences</em> (2nd ed.). Lawrence Erlbaum Associates. https://doi.org/10.4324/9780203771587</li>
<li>Cohen, J. (1992). A power primer. <em>Psychological Bulletin, 112</em>(1), 155–159. https://doi.org/10.1037/0033-2909.112.1.155</li>
<li>Hair, J. F., Ringle, C. M., &amp; Sarstedt, M. (2011). PLS-SEM: Indeed a silver bullet. <em>Journal of Marketing Theory and Practice, 19</em>(2), 139–152. https://doi.org/10.2753/MTP1069-6679190202</li>
<li>Hair, J. F., Risher, J. J., Sarstedt, M., &amp; Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review, 31</em>(1), 2–24. https://doi.org/10.1108/EBR-11-2018-0203</li>
<li>Shmueli, G., Sarstedt, M., Hair, J. F., Cheah, J.-H., Ting, H., Vaithilingam, S., &amp; Ringle, C. M. (2019). Predictive model assessment in PLS-SEM: Guidelines for using PLSpredict. <em>European Journal of Marketing, 53</em>(11), 2322–2347. https://doi.org/10.1108/EJM-02-2019-0189</li>
<li>Wherry, R. J. (1931). A new formula for predicting the shrinkage of the coefficient of multiple correlation. <em>The Annals of Mathematical Statistics, 2</em>(4), 440–457. https://doi.org/10.1214/aoms/1177732951</li>
<li>Wooldridge, J. M. (2020). <em>Introductory econometrics: A modern approach</em> (7th ed.). Cengage Learning.</li>
</ul>
