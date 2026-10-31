---
title: "Tương quan Pearson trong SPSS: cách chạy, đọc và báo cáo"
description: "Hệ số tương quan Pearson là gì, cách chạy trong SPSS, đọc bảng Correlations, ngưỡng mạnh yếu theo Cohen (1988), cỡ mẫu cần thiết và cách báo cáo theo APA."
pubDatetime: 2026-10-31T10:01:36+07:00
featured: false
tags: ["SPSS","tương quan","phân tích dữ liệu"]
---

<p><strong>Hệ số tương quan Pearson (r) đo mức độ hai biến định lượng cùng tăng hoặc ngược chiều nhau theo một đường thẳng, nhận giá trị từ −1 đến +1.</strong> Trong SPSS, chạy bằng <em>Analyze → Correlate → Bivariate</em>; hai biến có tương quan có ý nghĩa thống kê khi Sig. (2-tailed) nhỏ hơn 0,05. Theo quy ước của Cohen (1988), |r| khoảng 0,10 là yếu, 0,30 là trung bình và 0,50 trở lên là mạnh.</p>

<p>Trong khoá luận định lượng, phân tích tương quan thường nằm giữa EFA và hồi quy: bạn kiểm tra biến phụ thuộc có tương quan với từng biến độc lập không, và các biến độc lập có tương quan quá cao với nhau không. Bài này đi từ công thức, ví dụ tính tay, các bước trong SPSS, cách đọc bảng <em>Correlations</em>, tới đoạn văn mẫu cho chương 4. Nếu chưa có SPSS, <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu chương 4</a> chạy được tương quan Pearson ngay trên trình duyệt và xuất bảng theo chuẩn APA.</p>

<h2>Hệ số tương quan Pearson là gì?</h2>
<p>Hệ số tương quan Pearson (Pearson product-moment correlation coefficient) là hiệp phương sai của hai biến chia cho tích độ lệch chuẩn của chúng. Dấu của r cho biết chiều quan hệ, độ lớn |r| cho biết các điểm dữ liệu bám sát một đường thẳng tới mức nào. Công thức được Karl Pearson trình bày trong bài báo năm 1896 về hồi quy và di truyền.</p>
<p><code>r = Σ(x − x̄)(y − ȳ) / √[Σ(x − x̄)² × Σ(y − ȳ)²]</code></p>
<ul>
<li><strong>r = +1</strong>: mọi điểm nằm đúng trên một đường thẳng đi lên.</li>
<li><strong>r = −1</strong>: mọi điểm nằm đúng trên một đường thẳng đi xuống.</li>
<li><strong>r = 0</strong>: không có quan hệ tuyến tính. Hai biến vẫn có thể liên quan theo dạng cong.</li>
</ul>
<p>Bình phương của r cho biết tỉ lệ phương sai hai biến chia sẻ với nhau. r = 0,5 nghĩa là hai biến chia sẻ 25% phương sai, còn 75% còn lại do yếu tố khác.</p>

<h3>Ví dụ tính tay với 5 người trả lời</h3>
<p>Giả sử 5 sinh viên trả lời hai câu Likert 5 mức: X là "Nhận thức sự hữu ích", Y là "Ý định sử dụng".</p>
<table>
<thead>
<tr><th>Người</th><th>X</th><th>Y</th><th>x − x̄</th><th>y − ȳ</th><th>(x − x̄)(y − ȳ)</th><th>(x − x̄)²</th><th>(y − ȳ)²</th></tr>
</thead>
<tbody>
<tr><td>1</td><td>2</td><td>2</td><td>−1,4</td><td>−1,4</td><td>1,96</td><td>1,96</td><td>1,96</td></tr>
<tr><td>2</td><td>3</td><td>2</td><td>−0,4</td><td>−1,4</td><td>0,56</td><td>0,16</td><td>1,96</td></tr>
<tr><td>3</td><td>3</td><td>4</td><td>−0,4</td><td>0,6</td><td>−0,24</td><td>0,16</td><td>0,36</td></tr>
<tr><td>4</td><td>4</td><td>4</td><td>0,6</td><td>0,6</td><td>0,36</td><td>0,36</td><td>0,36</td></tr>
<tr><td>5</td><td>5</td><td>5</td><td>1,6</td><td>1,6</td><td>2,56</td><td>2,56</td><td>2,56</td></tr>
<tr><td>Tổng</td><td>17</td><td>17</td><td></td><td></td><td>5,2</td><td>5,2</td><td>7,2</td></tr>
</tbody>
</table>
<p>Trung bình x̄ = ȳ = 17 / 5 = 3,4. Tử số là 5,2; mẫu số là √(5,2 × 7,2) = √37,44 = 6,119. Vậy r = 5,2 / 6,119 = 0,85, một tương quan dương rất mạnh.</p>
<p>Nhưng với n = 5, kiểm định cho t = r × √(n − 2) / √(1 − r²) = 0,85 × 1,732 / 0,527 = 2,795 với 3 bậc tự do, p = 0,068. Tương quan rất mạnh mà vẫn <strong>không có ý nghĩa thống kê</strong>, vì mẫu quá nhỏ. Đây là lý do luôn phải đọc r và Sig. cùng nhau.</p>

<h2>Khi nào được dùng tương quan Pearson?</h2>
<p>Dùng Pearson khi cả hai biến là định lượng (khoảng hoặc tỉ lệ), quan hệ giữa chúng gần tuyến tính và không có giá trị ngoại lai lớn. Nếu một biến là thứ bậc, phân phối lệch mạnh hoặc có ngoại lai, dùng tương quan hạng Spearman (Spearman, 1904).</p>
<table>
<thead>
<tr><th>Điều kiện</th><th>Cách kiểm tra trong SPSS</th><th>Không đạt thì làm gì</th></tr>
</thead>
<tbody>
<tr><td>Hai biến định lượng</td><td>Xem Measure trong Variable View</td><td>Biến định danh: dùng kiểm định khác (Chi bình phương, t-test)</td></tr>
<tr><td>Quan hệ tuyến tính</td><td>Graphs → Chart Builder → Scatter</td><td>Quan hệ cong: biến đổi biến hoặc dùng mô hình phi tuyến</td></tr>
<tr><td>Không có ngoại lai lớn</td><td>Biểu đồ phân tán, Boxplot trong Explore</td><td>Kiểm tra lỗi nhập liệu; báo cáo thêm Spearman</td></tr>
<tr><td>Phân phối xấp xỉ chuẩn (cho kiểm định p)</td><td>Analyze → Descriptive Statistics → Explore, xem Skewness, Kurtosis</td><td>Lệch mạnh và mẫu nhỏ: dùng Spearman</td></tr>
</tbody>
</table>
<p>Về giả định phân phối chuẩn: Bishara và Hittner (2012) mô phỏng nhiều dạng dữ liệu không chuẩn và thấy kiểm định Pearson khá vững khi mẫu đủ lớn, nhưng có thể cho tỉ lệ sai lầm loại I lệch khỏi 5% khi phân phối rất lệch, nhất là với mẫu nhỏ. Trong những trường hợp đó Spearman là lựa chọn an toàn hơn.</p>
<p>Biểu đồ phân tán không phải thủ tục cho có. Anscombe (1973) dựng bốn bộ dữ liệu có cùng trung bình, cùng phương sai và cùng hệ số tương quan (khoảng 0,82), nhưng hình dạng hoàn toàn khác nhau: một bộ tuyến tính, một bộ cong, một bộ bị một điểm ngoại lai kéo lệch. Chỉ nhìn r thì không phân biệt được.</p>
<p>Còn câu hỏi điểm Likert có được xem là định lượng hay không, xem bài <a href="/posts/likert-la-thang-do-khoang-hay-thu-bac/">Likert là thang đo khoảng hay thứ bậc</a>. Ngắn gọn: điểm trung bình của nhiều câu Likert trong một thang đo thường được xử lý như biến định lượng, còn một câu Likert đơn lẻ thì nên cân nhắc Spearman.</p>

<h2>Cách chạy tương quan Pearson trong SPSS</h2>
<p>Trong khoá luận, bạn tương quan các <strong>biến đại diện</strong> (điểm trung bình của mỗi khái niệm), không phải từng câu hỏi. Quy trình:</p>
<ol>
<li><strong>Tạo biến đại diện.</strong> Sau khi Cronbach's alpha và EFA đã loại xong biến rác, vào <em>Transform → Compute Variable</em>. Ở Target Variable gõ tên, ví dụ <code>PU</code>; ở Numeric Expression gõ <code>MEAN(PU1,PU2,PU3,PU4)</code>. Làm tương tự cho mọi khái niệm. Chỉ đưa vào các câu còn giữ lại sau EFA.</li>
<li><strong>Mở hộp thoại.</strong> <em>Analyze → Correlate → Bivariate</em>.</li>
<li><strong>Chọn biến.</strong> Đưa biến phụ thuộc lên đầu danh sách, sau đó là các biến độc lập. Thứ tự này giúp dòng đầu tiên của bảng chính là tương quan giữa biến phụ thuộc và từng biến độc lập.</li>
<li><strong>Chọn hệ số.</strong> Tích <em>Pearson</em>. Nếu cần đối chiếu, tích thêm <em>Spearman</em>.</li>
<li><strong>Kiểm định.</strong> Chọn <em>Two-tailed</em> (mặc định) và tích <em>Flag significant correlations</em> để SPSS gắn dấu sao.</li>
<li><strong>Options.</strong> Tích <em>Means and standard deviations</em> để có luôn bảng thống kê mô tả. Ở Missing Values, giữ <em>Exclude cases pairwise</em> nếu dữ liệu có ô trống rải rác; chọn <em>listwise</em> nếu muốn N giống hệt mô hình hồi quy phía sau.</li>
<li>Bấm <strong>OK</strong>.</li>
</ol>
<p>Lệnh tương đương trong Syntax:</p>
<p><code>CORRELATIONS /VARIABLES=YD PU PEOU SI FC /PRINT=TWOTAIL NOSIG /STATISTICS DESCRIPTIVES /MISSING=PAIRWISE.</code></p>
<p>Các khái niệm ví dụ ở đây lấy từ <a href="/thang-do/tam/">thang đo TAM (Davis, 1989)</a>: nhận thức sự hữu ích (PU), nhận thức dễ sử dụng (PEOU) và ý định sử dụng (YD).</p>

<h2>Đọc bảng Correlations trong SPSS như thế nào?</h2>
<p>Mỗi ô của bảng có ba dòng: <em>Pearson Correlation</em> là hệ số r, <em>Sig. (2-tailed)</em> là giá trị p, <em>N</em> là số quan sát dùng để tính. Bảng đối xứng qua đường chéo, nên chỉ cần đọc một nửa. Đường chéo luôn bằng 1 vì mỗi biến tương quan hoàn hảo với chính nó.</p>
<p>Đọc theo ba câu hỏi:</p>
<ol>
<li><strong>Có ý nghĩa thống kê không?</strong> Sig. &lt; 0,05 là có. Dấu * nghĩa là p &lt; 0,05, dấu ** nghĩa là p &lt; 0,01. SPSS in "0,000" khi p rất nhỏ; khi báo cáo ghi "p &lt; 0,001", không ghi "p = 0,000".</li>
<li><strong>Chiều nào?</strong> r dương là cùng chiều, r âm là ngược chiều. So với chiều của giả thuyết bạn đặt ra.</li>
<li><strong>Mạnh hay yếu?</strong> Dùng bảng ngưỡng ở mục sau.</li>
</ol>
<p>Ví dụ: với N = 200, r giữa ý định sử dụng và nhận thức sự hữu ích là 0,25. Khi đó t = 0,25 × √198 / √(1 − 0,0625) = 0,25 × 14,071 / 0,968 = 3,633, p ≈ 0,0004. Tương quan có ý nghĩa thống kê, cùng chiều, mức yếu đến trung bình. Cũng với N = 200, r = 0,12 cho p ≈ 0,09, chưa có ý nghĩa ở mức 5%.</p>

<h3>Hệ số r nhỏ nhất có ý nghĩa thống kê theo cỡ mẫu</h3>
<p>Bảng dưới tính từ phân phối t với kiểm định hai phía. Với cỡ mẫu của bạn, r có trị tuyệt đối từ mức này trở lên sẽ có Sig. dưới ngưỡng tương ứng.</p>
<table>
<thead>
<tr><th>Cỡ mẫu N</th><th>|r| tối thiểu, p &lt; 0,05</th><th>|r| tối thiểu, p &lt; 0,01</th></tr>
</thead>
<tbody>
<tr><td>30</td><td>0,361</td><td>0,463</td></tr>
<tr><td>50</td><td>0,279</td><td>0,361</td></tr>
<tr><td>100</td><td>0,197</td><td>0,256</td></tr>
<tr><td>150</td><td>0,160</td><td>0,210</td></tr>
<tr><td>200</td><td>0,139</td><td>0,182</td></tr>
<tr><td>300</td><td>0,113</td><td>0,149</td></tr>
<tr><td>500</td><td>0,088</td><td>0,115</td></tr>
</tbody>
</table>
<p>Hệ quả: với mẫu 300 phiếu, gần như mọi cặp khái niệm trong mô hình đều "có ý nghĩa thống kê". Ý nghĩa thống kê chỉ nói tương quan khác 0, không nói tương quan đủ lớn để quan trọng. Vì vậy phải bàn thêm độ lớn của r.</p>

<h2>Hệ số tương quan bao nhiêu là mạnh?</h2>
<p>Ngưỡng hay được trích nhất là của Cohen (1988), cũng được tóm tắt trong Cohen (1992): |r| = 0,10 là hiệu ứng nhỏ, 0,30 là trung bình, 0,50 là lớn. Cohen tự nói đây là quy ước dùng khi không có căn cứ tốt hơn, không phải ranh giới cứng.</p>
<table>
<thead>
<tr><th>Nguồn</th><th>Nhỏ / yếu</th><th>Trung bình / điển hình</th><th>Lớn / mạnh</th></tr>
</thead>
<tbody>
<tr><td>Cohen (1988, 1992)</td><td>0,10</td><td>0,30</td><td>0,50</td></tr>
<tr><td>Gignac &amp; Szodorai (2016), nghiên cứu khác biệt cá nhân</td><td>0,10</td><td>0,20</td><td>0,30</td></tr>
</tbody>
</table>
<p>Gignac và Szodorai (2016) tổng hợp các hệ số tương quan đã công bố trong lĩnh vực tâm lý học khác biệt cá nhân và thấy mức điển hình thấp hơn quy ước của Cohen, nên đề xuất 0,10, 0,20 và 0,30. Nếu đề tài của bạn đo thái độ, tính cách hay hành vi, đây là căn cứ tốt để giải thích vì sao r = 0,25 không phải là "yếu".</p>
<p>Schober, Boer và Schwarte (2018) nhắc rằng các bảng diễn giải "yếu, vừa, mạnh" khác nhau giữa các tài liệu và có tính quy ước; nên diễn giải độ lớn của r trong bối cảnh lĩnh vực của bạn và luôn kèm khoảng tin cậy hoặc giá trị p.</p>

<h2>Cần bao nhiêu mẫu để phát hiện một tương quan?</h2>
<p>Để có power 0,80 ở mức ý nghĩa 5% (hai phía), cỡ mẫu xấp xỉ theo biến đổi Fisher z là n = [(1,96 + 0,84) / z(r)]² + 3, với z(r) = artanh(r). Làm tròn lên:</p>
<table>
<thead>
<tr><th>Tương quan muốn phát hiện</th><th>Cỡ mẫu xấp xỉ</th></tr>
</thead>
<tbody>
<tr><td>r = 0,10</td><td>783</td></tr>
<tr><td>r = 0,20</td><td>194</td></tr>
<tr><td>r = 0,30</td><td>85</td></tr>
<tr><td>r = 0,40</td><td>47</td></tr>
<tr><td>r = 0,50</td><td>30</td></tr>
</tbody>
</table>
<p>G*Power dùng phép tính chính xác nên có thể lệch một hai đơn vị. Nếu tương quan chỉ là bước phụ trước hồi quy, cỡ mẫu nên tính theo phân tích chính; <a href="/cong-cu/tinh-co-mau/">công cụ tính cỡ mẫu</a> và bài <a href="/posts/co-mau-nghien-cuu-bao-nhieu-la-du/">cỡ mẫu bao nhiêu là đủ</a> hướng dẫn chi tiết.</p>

<h2>Tương quan giữa các biến độc lập cao có sao không?</h2>
<p>Có thể là dấu hiệu đa cộng tuyến. Nếu hai biến độc lập tương quan rất cao với nhau, hồi quy sẽ khó tách riêng tác động của từng biến, hệ số có thể đổi dấu hoặc mất ý nghĩa. Bảng tương quan chỉ cho cảnh báo sớm; kết luận cuối cùng dựa vào VIF trong hồi quy, xem bài <a href="/posts/he-so-vif-da-cong-tuyen/">hệ số VIF và đa cộng tuyến</a>. Tương quan rất cao giữa hai khái niệm cũng là câu hỏi về giá trị phân biệt: có thể hai thang đo đang đo cùng một thứ.</p>
<p>Ngược lại, nếu một biến độc lập không tương quan có ý nghĩa với biến phụ thuộc, nhiều giảng viên sẽ hỏi có nên đưa nó vào hồi quy không. Đừng tự loại biến chỉ vì tương quan đơn không có ý nghĩa: tương quan hai biến không kiểm soát các biến khác, và giả thuyết của bạn cần được kiểm định trong mô hình hồi quy đầy đủ. Ghi nhận kết quả và bàn ở chương 5.</p>

<h2>Cách trình bày kết quả tương quan trong chương 4</h2>
<p>Bảng chuẩn gồm trung bình, độ lệch chuẩn và ma trận tương quan nửa dưới. Ví dụ định dạng (số liệu minh hoạ, N = 250):</p>
<table>
<thead>
<tr><th>Biến</th><th>M</th><th>SD</th><th>1</th><th>2</th><th>3</th><th>4</th></tr>
</thead>
<tbody>
<tr><td>1. Ý định sử dụng</td><td>3,82</td><td>0,71</td><td></td><td></td><td></td><td></td></tr>
<tr><td>2. Nhận thức sự hữu ích</td><td>3,95</td><td>0,64</td><td>0,52**</td><td></td><td></td><td></td></tr>
<tr><td>3. Nhận thức dễ sử dụng</td><td>3,77</td><td>0,69</td><td>0,41**</td><td>0,46**</td><td></td><td></td></tr>
<tr><td>4. Ảnh hưởng xã hội</td><td>3,40</td><td>0,83</td><td>0,18**</td><td>0,12</td><td>0,09</td><td></td></tr>
</tbody>
</table>
<p>Ghi chú dưới bảng: ** p &lt; 0,01. Theo APA 7, hệ số tương quan không có số 0 trước dấu thập phân khi viết bằng tiếng Anh (r = .52); trong luận văn tiếng Việt, hầu hết trường chấp nhận cách viết 0,52, miễn thống nhất toàn bài.</p>
<p>Câu báo cáo trong văn bản: ghi r, bậc tự do (N − 2) và p. Ví dụ:</p>
<blockquote>Kết quả phân tích tương quan Pearson cho thấy ý định sử dụng có tương quan thuận, có ý nghĩa thống kê với nhận thức sự hữu ích, r(248) = 0,52, p &lt; 0,001, và với nhận thức dễ sử dụng, r(248) = 0,41, p &lt; 0,001. Theo quy ước của Cohen (1988), đây lần lượt là các mức tương quan mạnh và trung bình. Tương quan giữa các biến độc lập đều dưới 0,50, chưa cho thấy dấu hiệu đa cộng tuyến nghiêm trọng; điều này được kiểm tra lại bằng hệ số VIF trong phân tích hồi quy.</blockquote>
<p>Sau tương quan là hồi quy bội; xem bài <a href="/posts/hoi-quy-tuyen-tinh-boi-spss/">hồi quy tuyến tính bội trong SPSS</a>. Cấu trúc toàn chương có ở bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4</a>.</p>

<h2>Lỗi thường gặp khi phân tích tương quan</h2>
<ol>
<li><strong>Kết luận nhân quả.</strong> "X tương quan với Y" không có nghĩa X làm tăng Y. Có thể Y ảnh hưởng X, hoặc một biến thứ ba ảnh hưởng cả hai. Viết "có mối liên hệ", không viết "tác động".</li>
<li><strong>Chỉ đọc Sig.</strong> Với mẫu lớn, r = 0,12 cũng có ý nghĩa. Luôn bàn độ lớn của r.</li>
<li><strong>Tương quan từng câu hỏi thay vì biến đại diện.</strong> Ma trận 30 × 30 câu hỏi không trả lời câu hỏi nghiên cứu nào. Tương quan giữa các câu hỏi là việc của EFA.</li>
<li><strong>Tính biến đại diện bằng SUM khi có ô trống.</strong> Hàm SUM của SPSS bỏ qua ô trống, nên người thiếu một câu có tổng điểm thấp hơn hẳn người trả lời đủ. Dùng MEAN (điểm trung bình không phụ thuộc số câu đã trả lời) và xử lý dữ liệu thiếu trước.</li>
<li><strong>Không vẽ biểu đồ phân tán.</strong> Một vài ngoại lai có thể tạo ra hoặc xoá đi một tương quan, như bộ dữ liệu của Anscombe (1973).</li>
<li><strong>Ghi p = 0,000.</strong> p không bao giờ bằng 0; ghi p &lt; 0,001.</li>
</ol>

<h2>Câu hỏi thường gặp</h2>
<h3>Hệ số tương quan Pearson bao nhiêu là đạt?</h3>
<p>Không có ngưỡng "đạt" chung. Điều kiện cần là Sig. &lt; 0,05 để kết luận có tương quan. Về độ lớn, theo Cohen (1988) |r| từ 0,10 là nhỏ, từ 0,30 là trung bình, từ 0,50 là lớn. Chiều của r phải khớp với giả thuyết.</p>
<h3>Pearson và Spearman khác nhau thế nào?</h3>
<p>Pearson đo quan hệ tuyến tính giữa hai biến định lượng. Spearman tính tương quan trên thứ hạng nên đo quan hệ đơn điệu, ít bị ảnh hưởng bởi ngoại lai và phân phối lệch. Biến thứ bậc hoặc dữ liệu lệch mạnh với mẫu nhỏ thì dùng Spearman.</p>
<h3>Sig. lớn hơn 0,05 thì phải loại biến không?</h3>
<p>Không bắt buộc. Tương quan đơn không kiểm soát các biến khác. Nếu biến đó nằm trong mô hình lý thuyết, vẫn đưa vào hồi quy để kiểm định giả thuyết, rồi báo cáo kết quả trung thực.</p>
<h3>Tương quan giữa các biến độc lập bao nhiêu là quá cao?</h3>
<p>Không có ngưỡng thống nhất cho ma trận tương quan; đây chỉ là bước cảnh báo. Hãy kiểm tra VIF trong hồi quy và giá trị phân biệt (HTMT) nếu dùng SEM để kết luận.</p>
<h3>Có cần kiểm định một phía không?</h3>
<p>Mặc định dùng hai phía. Chỉ dùng một phía khi giả thuyết đã nêu chiều trước khi thu dữ liệu và bạn sẵn sàng bỏ qua tương quan ngược chiều; nhiều hội đồng vẫn yêu cầu hai phía.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Anscombe, F. J. (1973). Graphs in statistical analysis. <em>The American Statistician, 27</em>(1), 17–21. https://doi.org/10.1080/00031305.1973.10478966</li>
<li>Bishara, A. J., &amp; Hittner, J. B. (2012). Testing the significance of a correlation with nonnormal data: Comparison of Pearson, Spearman, transformation, and resampling approaches. <em>Psychological Methods, 17</em>(3), 399–417. https://doi.org/10.1037/a0028087</li>
<li>Cohen, J. (1988). <em>Statistical power analysis for the behavioral sciences</em> (2nd ed.). Lawrence Erlbaum.</li>
<li>Cohen, J. (1992). A power primer. <em>Psychological Bulletin, 112</em>(1), 155–159. https://doi.org/10.1037/0033-2909.112.1.155</li>
<li>Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. <em>MIS Quarterly, 13</em>(3), 319–340. https://doi.org/10.2307/249008</li>
<li>Gignac, G. E., &amp; Szodorai, E. T. (2016). Effect size guidelines for individual differences researchers. <em>Personality and Individual Differences, 102</em>, 74–78. https://doi.org/10.1016/j.paid.2016.06.069</li>
<li>Pearson, K. (1896). Mathematical contributions to the theory of evolution. III. Regression, heredity, and panmixia. <em>Philosophical Transactions of the Royal Society of London. Series A, 187</em>, 253–318. https://doi.org/10.1098/rsta.1896.0007</li>
<li>Schober, P., Boer, C., &amp; Schwarte, L. A. (2018). Correlation coefficients: Appropriate use and interpretation. <em>Anesthesia &amp; Analgesia, 126</em>(5), 1763–1768. https://doi.org/10.1213/ANE.0000000000002864</li>
<li>Spearman, C. (1904). The proof and measurement of association between two things. <em>The American Journal of Psychology, 15</em>(1), 72–101. https://doi.org/10.2307/1412159</li>
</ul>
<p>Cần định dạng danh mục tài liệu tham khảo của bạn theo APA 7, dùng <a href="/cong-cu/trich-dan-apa/">công cụ trích dẫn APA</a>. Bảng tổng hợp ngưỡng của các chỉ số khác (Cronbach, KMO, VIF, R²) có ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận</a>.</p>
