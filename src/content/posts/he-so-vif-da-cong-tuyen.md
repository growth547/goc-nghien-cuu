---
title: "Hệ số VIF là gì? Đa cộng tuyến, VIF bao nhiêu là đạt"
description: "Đa cộng tuyến là gì, hệ số VIF bao nhiêu là đạt (10, 5 hay 3), VIF trong SPSS và inner/outer VIF trong SmartPLS, ví dụ số và cách xử lý khi VIF cao."
pubDatetime: 2026-10-30T17:00:00+07:00
featured: false
tags: ["SPSS","phân tích dữ liệu","PLS-SEM"]
---

<p><strong>Đa cộng tuyến là hiện tượng các biến độc lập trong một mô hình hồi quy tương quan mạnh với nhau, khiến mô hình khó tách riêng tác động của từng biến. Hệ số VIF (variance inflation factor) đo mức độ này: VIF = 1 / (1 − R²ⱼ), trong đó R²ⱼ là phần biến thiên của biến j được các biến độc lập còn lại giải thích.</strong> Trong hồi quy OLS (SPSS, Stata), quy ước phổ biến là VIF dưới 10, chặt hơn là dưới 5; trong PLS-SEM (SmartPLS), Hair và cộng sự (2019) coi VIF từ 5 là cộng tuyến nghiêm trọng và khuyên VIF lý tưởng ở khoảng 3 trở xuống.</p>

<p>Bài này giải thích VIF đo cái gì, vì sao VIF cao làm "mất" ý nghĩa thống kê của biến, đọc VIF trong SPSS, phân biệt inner VIF và outer VIF trong SmartPLS, và xử lý khi VIF vượt ngưỡng. Ví dụ số dùng dữ liệu mô phỏng bằng Python (numpy), không phải dữ liệu khảo sát thật.</p>

<h2>Đa cộng tuyến là gì và vì sao nó gây rắc rối</h2>
<p>Hồi quy bội ước lượng tác động của mỗi biến độc lập khi giữ các biến khác cố định. Nếu hai biến gần như luôn đi cùng nhau, chẳng hạn "nhận thức sự hữu ích" và "sự hài lòng" khi câu hỏi của hai thang đo gần nghĩa, dữ liệu gần như không có trường hợp nào một biến tăng mà biến kia đứng yên. Mô hình khi đó không đủ thông tin để chia tác động cho từng biến. Hậu quả điển hình:</p>
<ul>
<li><strong>Sai số chuẩn (Std. Error) của hệ số tăng lên</strong>, nên t giảm và Sig. tăng: biến đáng lẽ có ý nghĩa trở thành không có ý nghĩa.</li>
<li><strong>Hệ số không ổn định</strong>: thêm hoặc bớt vài phiếu, hệ số đổi mạnh, có khi đổi dấu.</li>
<li><strong>R² gần như không đổi.</strong> Đa cộng tuyến không làm mô hình dự báo kém đi; nó chỉ làm phần chia tác động giữa các biến trở nên mơ hồ.</li>
</ul>
<p>Điểm thứ ba quan trọng khi bảo vệ: đa cộng tuyến là vấn đề của việc <em>diễn giải từng hệ số</em>, không phải của độ phù hợp mô hình. O'Brien (2007) nhấn mạnh rằng VIF cao chỉ làm phương sai của hệ số lớn lên, và mức đó có đáng lo hay không còn tuỳ cỡ mẫu và độ lớn của hệ số.</p>

<h2>Công thức VIF và Tolerance</h2>
<p>Với mỗi biến độc lập j, chạy một hồi quy phụ: biến j là biến phụ thuộc, các biến độc lập còn lại là biến giải thích. Lấy R² của hồi quy phụ đó (gọi là R²ⱼ):</p>
<p><code>Tolerance = 1 − R²ⱼ</code> &nbsp;&nbsp; <code>VIF = 1 / Tolerance = 1 / (1 − R²ⱼ)</code></p>
<p>Tên gọi "hệ số phóng đại phương sai" lấy từ chỗ phương sai của hệ số bⱼ bằng phương sai lúc biến j không tương quan với biến nào khác, nhân với VIF. Vì vậy sai số chuẩn bị phóng đại √VIF lần. VIF = 4 nghĩa là sai số chuẩn gấp đôi so với trường hợp không có cộng tuyến; VIF = 10 nghĩa là gấp khoảng 3,16 lần.</p>
<table>
<thead><tr><th>R²ⱼ</th><th>Tolerance</th><th>VIF</th><th>Sai số chuẩn phóng đại (√VIF)</th></tr></thead>
<tbody>
<tr><td>0,50</td><td>0,50</td><td>2,0</td><td>1,41 lần</td></tr>
<tr><td>0,67</td><td>0,33</td><td>3,0</td><td>1,73 lần</td></tr>
<tr><td>0,80</td><td>0,20</td><td>5,0</td><td>2,24 lần</td></tr>
<tr><td>0,90</td><td>0,10</td><td>10,0</td><td>3,16 lần</td></tr>
</tbody>
</table>
<p>Đọc bảng này, "VIF lớn hơn 2" (một biến thể tìm kiếm hay gặp) chỉ có nghĩa là 50% biến thiên của biến đó trùng với các biến khác. Trong khảo sát hành vi, nơi các khái niệm vốn tương quan với nhau, VIF từ 1,5 đến 2,5 là rất bình thường và không phải dấu hiệu đa cộng tuyến.</p>

<h2>Hệ số VIF bao nhiêu là đạt</h2>
<table>
<thead><tr><th>Bối cảnh</th><th>Ngưỡng hay dùng</th><th>Nguồn</th></tr></thead>
<tbody>
<tr><td>Hồi quy OLS (SPSS, Stata)</td><td>VIF &lt; 10 (Tolerance &gt; 0,10); chặt hơn: VIF &lt; 5</td><td>Mốc 10 thường được dẫn về Marquardt (1970); O'Brien (2007) cảnh báo không áp máy móc</td></tr>
<tr><td>PLS-SEM, mô hình cấu trúc (inner VIF)</td><td>Lý tưởng ≤ 3; 3 đến 5 có thể có cộng tuyến; ≥ 5 nghiêm trọng</td><td>Hair và cộng sự (2019)</td></tr>
<tr><td>PLS-SEM, chỉ báo nguyên nhân (outer VIF, formative)</td><td>Như trên; Diamantopoulos và Siguaw (2006) dùng mốc 3,3</td><td>Hair và cộng sự (2019); Diamantopoulos &amp; Siguaw (2006)</td></tr>
<tr><td>Kiểm tra sai lệch phương pháp chung (full collinearity VIF)</td><td>Mọi VIF ≤ 3,3</td><td>Kock &amp; Lynn (2012); Kock (2015)</td></tr>
</tbody>
</table>
<p>Cách viết an toàn trong khoá luận: nêu rõ ngưỡng bạn dùng kèm nguồn, đúng với phương pháp (đừng dùng mốc 10 của hồi quy cho mô hình SmartPLS). Toàn bộ ngưỡng có nguồn nằm ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận Cronbach, KMO, AVE, HTMT, VIF</a>.</p>

<h2>Ví dụ số: một biến "trùng" làm mất ý nghĩa thống kê</h2>
<p>Dữ liệu mô phỏng 250 phiếu, biến phụ thuộc là ý định sử dụng ví điện tử (BI), bốn biến độc lập: nhận thức sự hữu ích (PU), nỗ lực kỳ vọng (EE), ảnh hưởng xã hội (SI), niềm tin (TR). Mô hình 1 chỉ có bốn biến này. Mô hình 2 thêm biến "sự hài lòng" (HL), được tạo để gần như trùng với PU (tương quan 0,96), giống tình huống hai thang đo hỏi gần cùng một ý.</p>
<table>
<thead><tr><th rowspan="2">Biến</th><th colspan="4">Mô hình 1 (4 biến)</th><th colspan="4">Mô hình 2 (thêm HL)</th></tr>
<tr><th>B</th><th>Std. Error</th><th>t</th><th>VIF</th><th>B</th><th>Std. Error</th><th>t</th><th>VIF</th></tr></thead>
<tbody>
<tr><td>PU</td><td>0,359</td><td>0,057</td><td>6,33</td><td>1,67</td><td>0,175</td><td>0,159</td><td>1,10</td><td>13,04</td></tr>
<tr><td>EE</td><td>0,020</td><td>0,059</td><td>0,33</td><td>1,56</td><td>0,019</td><td>0,059</td><td>0,32</td><td>1,56</td></tr>
<tr><td>SI</td><td>0,158</td><td>0,059</td><td>2,66</td><td>1,52</td><td>0,160</td><td>0,059</td><td>2,69</td><td>1,53</td></tr>
<tr><td>TR</td><td>0,240</td><td>0,052</td><td>4,62</td><td>1,45</td><td>0,234</td><td>0,052</td><td>4,47</td><td>1,46</td></tr>
<tr><td>HL</td><td></td><td></td><td></td><td></td><td>0,207</td><td>0,166</td><td>1,24</td><td>12,79</td></tr>
<tr><td>R² / R² hiệu chỉnh</td><td colspan="4">0,453 / 0,444</td><td colspan="4">0,456 / 0,445</td></tr>
</tbody>
</table>
<p>Ba điều đáng chú ý:</p>
<ol>
<li><strong>PU từ có ý nghĩa mạnh (t = 6,33) thành không có ý nghĩa (t = 1,10)</strong>, và HL cũng không có ý nghĩa (t = 1,24), dù cả hai rõ ràng liên quan đến ý định. Mô hình chỉ không biết chia tác động cho biến nào.</li>
<li><strong>Sai số chuẩn của PU tăng từ 0,057 lên 0,159</strong>, gấp 2,8 lần. Kiểm tra bằng công thức: √(13,04 / 1,67) = √7,81 = 2,79. VIF của PU là 13,04 vì R²ⱼ = 0,923: 92,3% biến thiên của PU được HL và ba biến khác giải thích. Tolerance = 1 − 0,923 = 0,077.</li>
<li><strong>R² gần như không đổi</strong> (0,453 lên 0,456), các biến không dính cộng tuyến (EE, SI, TR) giữ nguyên hệ số và VIF. Đa cộng tuyến chỉ ảnh hưởng tới cặp biến trùng nhau.</li>
</ol>
<p>Nếu đọc máy móc bảng Mô hình 2, bạn sẽ kết luận "nhận thức sự hữu ích không tác động đến ý định", một kết luận sai. Đó là lý do phải xem VIF trước khi viết phần kiểm định giả thuyết.</p>

<h2>Đọc VIF trong SPSS và Stata</h2>
<p><strong>SPSS:</strong> Analyze → Regression → Linear, bấm Statistics, tích <em>Collinearity diagnostics</em>. Bảng Coefficients sẽ có thêm hai cột Tolerance và VIF ở cuối. Cách thiết lập đầy đủ và đọc các bảng còn lại có ở bài <a href="/posts/hoi-quy-tuyen-tinh-boi-spss/">hồi quy tuyến tính bội trong SPSS</a>. SPSS còn in bảng <em>Collinearity Diagnostics</em> (eigenvalue, condition index); với khoá luận, cột VIF thường là đủ.</p>
<p><strong>Stata:</strong> sau lệnh <code>regress bi pu ee si tr</code>, gõ <code>estat vif</code>. Stata in VIF và 1/VIF (tức Tolerance) cho từng biến cùng VIF trung bình.</p>
<p><strong>Không có SPSS:</strong> <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát</a> chạy hồi quy trên trình duyệt, in VIF cho từng biến và tô màu khi VIF từ 5.</p>
<p>VIF chỉ phụ thuộc vào các biến độc lập, không phụ thuộc vào biến phụ thuộc. Mô hình có hai biến phụ thuộc với cùng bộ biến độc lập sẽ cho cùng một bộ VIF.</p>

<h2>Inner VIF và outer VIF trong SmartPLS</h2>
<p>Trong PLS-SEM, VIF xuất hiện ở hai chỗ, và đây là phần hay bị nhầm nhất:</p>
<table>
<thead><tr><th></th><th>Inner VIF</th><th>Outer VIF</th></tr></thead>
<tbody>
<tr><td>Đo giữa</td><td>Các biến tiềm ẩn cùng trỏ vào một biến tiềm ẩn phụ thuộc</td><td>Các biến quan sát (chỉ báo) trong cùng một khái niệm</td></tr>
<tr><td>Dùng để</td><td>Đánh giá mô hình cấu trúc, trước khi đọc hệ số đường dẫn</td><td>Đánh giá mô hình đo lường nguyên nhân (formative)</td></tr>
<tr><td>Ngưỡng</td><td>Lý tưởng ≤ 3, nghiêm trọng ≥ 5 (Hair và cộng sự, 2019)</td><td>Như inner VIF với khái niệm formative</td></tr>
<tr><td>Trong SmartPLS 4</td><td>Kết quả PLS-SEM algorithm → Collinearity statistics (VIF) → Inner model</td><td>Cùng mục, tab Outer model</td></tr>
</tbody>
</table>
<p><strong>Inner VIF</strong> tính đúng như VIF của hồi quy, chỉ khác là "biến độc lập" là điểm của các biến tiềm ẩn. Ví dụ, trong mô hình chất lượng dịch vụ → hài lòng → trung thành, có thêm đường chất lượng → trung thành, thì lòng trung thành có hai biến dự báo. Nếu tương quan giữa điểm chất lượng và điểm hài lòng là 0,466, inner VIF của cả hai bằng 1 / (1 − 0,466²) = 1,28, rất thấp. Biến tiềm ẩn chỉ trỏ vào từ một nguồn thì không có inner VIF có nghĩa (bằng 1).</p>
<p><strong>Outer VIF</strong> chỉ có ý nghĩa với khái niệm formative, nơi mỗi chỉ báo đóng góp một phần riêng vào khái niệm (ví dụ "chất lượng trang web" tạo thành từ tốc độ, giao diện, bảo mật). Với khái niệm reflective, loại phổ biến nhất trong khoá luận dùng thang đo Likert, các biến quan sát <em>được kỳ vọng</em> tương quan cao với nhau vì cùng phản ánh một khái niệm, nên outer VIF cao không phải lỗi. SmartPLS vẫn in outer VIF cho mọi khái niệm; đừng loại biến reflective chỉ vì outer VIF cao. Với khái niệm reflective, hãy xem hệ số tải, CR, AVE và HTMT, giải thích ở bài <a href="/posts/ave-cr-la-gi/">AVE, CR là gì</a> và bài <a href="/posts/htmt-gia-tri-phan-biet/">HTMT và giá trị phân biệt</a>.</p>
<p>Một trường hợp ngoại lệ: outer VIF của một biến reflective rất cao (ví dụ trên 10) thường báo hiệu hai câu hỏi gần như lặp lại nhau. Hair và cộng sự (2019) cũng cảnh báo độ tin cậy trên 0,95 là dấu hiệu câu hỏi trùng lặp. Lúc đó nên xem lại nội dung câu, không phải vì VIF mà vì thang đo đang hỏi một ý hai lần.</p>
<p>Quy trình đánh giá mô hình đo lường và mô hình cấu trúc theo thứ tự có ở bài <a href="/posts/pls-sem-la-gi-smartpls/">PLS-SEM là gì</a>.</p>

<h2>Full collinearity VIF: kiểm tra sai lệch phương pháp chung</h2>
<p>Kock và Lynn (2012) đề xuất chạy VIF giữa <em>tất cả</em> biến tiềm ẩn, kể cả biến phụ thuộc, bằng cách hồi quy mỗi biến lên mọi biến còn lại. Kock (2015) dùng cách này để phát hiện sai lệch phương pháp chung (common method bias) trong PLS-SEM: nếu mọi VIF đều ≤ 3,3, mô hình được coi là không bị ảnh hưởng đáng kể. Đây là phép kiểm khác hẳn inner VIF thông thường; ghi rõ bạn đang báo cáo loại nào.</p>

<h2>Xử lý khi VIF cao</h2>
<ol>
<li><strong>Tìm cặp biến gây ra.</strong> Xem ma trận tương quan: cặp có tương quan trên 0,8 thường là thủ phạm. Trong ví dụ, PU và HL tương quan 0,96.</li>
<li><strong>Xem lại nội dung đo lường.</strong> Hai thang đo có câu gần nghĩa không? Nếu EFA cho các câu của hai khái niệm tải vào cùng một nhân tố, có thể chúng là một khái niệm. Xem bài <a href="/posts/cach-doc-ket-qua-efa-spss/">đọc kết quả EFA trong SPSS</a>.</li>
<li><strong>Gộp hoặc dựng khái niệm bậc cao</strong> nếu lý thuyết cho phép coi hai biến là hai mặt của một khái niệm lớn hơn.</li>
<li><strong>Bỏ một biến</strong> chỉ khi có lý do lý thuyết, và ghi rõ trong chương 3 hoặc 4. Không bỏ biến chỉ để hạ VIF rồi giấu đi.</li>
<li><strong>Đa cộng tuyến do biến tương tác</strong> (X, M và X × M cùng trong mô hình): VIF cao gần như luôn xuất hiện vì X × M tương quan với X và M. Chuẩn hoá hoặc trừ trung bình (mean-centering) X và M trước khi nhân sẽ hạ VIF của các hạng tử bậc một; kiểm định hệ số tương tác thì không đổi. <a href="/cong-cu/trung-gian-dieu-tiet/">Công cụ kiểm định trung gian, điều tiết</a> làm bước này tự động.</li>
<li><strong>Tăng cỡ mẫu</strong> làm sai số chuẩn nhỏ đi, bù lại phần phóng đại. Đây là lý do O'Brien (2007) phản đối ngưỡng cứng: VIF bằng 8 với 2.000 quan sát có thể ít đáng lo hơn VIF bằng 3 với 80 quan sát.</li>
</ol>
<p>Nhập VIF cùng các chỉ số khác vào <a href="/cong-cu/bac-si-ket-qua/">bác sĩ kết quả</a> để nhận gợi ý xử lý có trích dẫn và đoạn văn giải trình.</p>

<h2>Câu mẫu viết vào chương 4</h2>
<blockquote><p>Hệ số phóng đại phương sai (VIF) của các biến độc lập nằm trong khoảng 1,45 đến 1,67, thấp hơn nhiều so với ngưỡng 10 thường được sử dụng và cả ngưỡng chặt hơn là 5, cho thấy hiện tượng đa cộng tuyến không ảnh hưởng đáng kể đến kết quả ước lượng (O'Brien, 2007).</p></blockquote>
<p>Với SmartPLS: "Giá trị inner VIF của các biến tiềm ẩn dự báo lòng trung thành đều bằng 1,28, dưới ngưỡng 3 theo khuyến nghị của Hair và cộng sự (2019), do đó cộng tuyến giữa các biến dự báo không phải là vấn đề trong mô hình cấu trúc." Thay khoảng giá trị bằng số của bạn.</p>

<h2>Câu hỏi thường gặp</h2>
<h3>Hệ số VIF lớn hơn 2 có bị đa cộng tuyến không?</h3>
<p>Không theo bất kỳ ngưỡng phổ biến nào. VIF = 2 nghĩa là sai số chuẩn phóng đại khoảng 1,41 lần, mức rất thường gặp khi các khái niệm trong mô hình vốn có liên quan. Mốc 2 không có nguồn học thuật vững; nếu giáo viên hướng dẫn yêu cầu, hãy hỏi lại nguồn họ dùng.</p>
<h3>VIF là gì trong SPSS, nằm ở bảng nào?</h3>
<p>VIF nằm ở hai cột cuối bảng Coefficients (Collinearity Statistics: Tolerance, VIF), chỉ xuất hiện khi bạn tích Collinearity diagnostics trong nút Statistics của hộp thoại Linear Regression.</p>
<h3>Inner VIF và outer VIF là gì, báo cáo cái nào?</h3>
<p>Inner VIF đo cộng tuyến giữa các biến tiềm ẩn trỏ vào cùng một biến phụ thuộc, luôn báo cáo khi đánh giá mô hình cấu trúc. Outer VIF đo cộng tuyến giữa các chỉ báo của một khái niệm, chỉ cần báo cáo với khái niệm formative.</p>
<h3>VIF bằng 1 có nghĩa là gì?</h3>
<p>Biến đó không tương quan tuyến tính với các biến độc lập còn lại (R²ⱼ = 0). Trong SmartPLS, biến tiềm ẩn chỉ có một biến trỏ vào cũng cho inner VIF bằng 1.</p>
<h3>Hồi quy logistic có cần kiểm tra VIF không?</h3>
<p>Có. VIF chỉ phụ thuộc vào các biến độc lập, nên có thể chạy một hồi quy tuyến tính bất kỳ với cùng bộ biến độc lập trong SPSS để lấy VIF, rồi dùng cho mô hình logistic. Xem bài <a href="/posts/hoi-quy-logistic-spss/">hồi quy logistic trong SPSS</a>.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Diamantopoulos, A., &amp; Siguaw, J. A. (2006). Formative versus reflective indicators in organizational measure development: A comparison and empirical illustration. <em>British Journal of Management, 17</em>(4), 263–282. https://doi.org/10.1111/j.1467-8551.2006.00500.x</li>
<li>Hair, J. F., Risher, J. J., Sarstedt, M., &amp; Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review, 31</em>(1), 2–24. https://doi.org/10.1108/EBR-11-2018-0203</li>
<li>Kock, N. (2015). Common method bias in PLS-SEM: A full collinearity assessment approach. <em>International Journal of e-Collaboration, 11</em>(4), 1–10. https://doi.org/10.4018/ijec.2015100101</li>
<li>Kock, N., &amp; Lynn, G. S. (2012). Lateral collinearity and misleading results in variance-based SEM: An illustration and recommendations. <em>Journal of the Association for Information Systems, 13</em>(7), 546–580. https://doi.org/10.17705/1jais.00302</li>
<li>Marquardt, D. W. (1970). Generalized inverses, ridge regression, biased linear estimation, and nonlinear estimation. <em>Technometrics, 12</em>(3), 591–612. https://doi.org/10.1080/00401706.1970.10488699</li>
<li>O'Brien, R. M. (2007). A caution regarding rules of thumb for variance inflation factors. <em>Quality &amp; Quantity, 41</em>(5), 673–690. https://doi.org/10.1007/s11135-006-9018-6</li>
</ul>
