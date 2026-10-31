---
title: "CFA trong AMOS: chỉ số phù hợp mô hình và cách đọc"
description: "Cách chạy CFA trong AMOS, đọc CMIN/df, CFI, TLI, RMSEA, SRMR theo Hu & Bentler (1999), ví dụ tính tay và cách xử lý khi mô hình chưa phù hợp."
pubDatetime: 2026-10-31T10:01:36+07:00
featured: false
tags: ["CFA","AMOS","phân tích dữ liệu"]
---

<p><strong>Phân tích nhân tố khẳng định (CFA, confirmatory factor analysis) kiểm tra xem dữ liệu có khớp với cấu trúc thang đo bạn đã định trước hay không, và các chỉ số phù hợp mô hình (model fit) là thước đo mức khớp đó.</strong> Bộ ngưỡng hay dùng nhất là của Hu và Bentler (1999): CFI và TLI từ khoảng 0,95, RMSEA không quá khoảng 0,06, SRMR không quá khoảng 0,08. Nhiều luận văn chấp nhận mức nới hơn: CFI, TLI từ 0,90 và RMSEA dưới 0,08, kèm CMIN/df dưới 3.</p>

<p>Bài này đi qua các bước chạy CFA trong AMOS, vị trí từng chỉ số trong output, ý nghĩa và ngưỡng của mỗi chỉ số có nguồn kiểm chứng được, một ví dụ tính tay CMIN/df, RMSEA, CFI, TLI, và cách xử lý khi mô hình chưa phù hợp mà không "chế" số. Sau khi mô hình phù hợp, bạn còn phải đánh giá giá trị hội tụ và phân biệt, xem bài <a href="/posts/ave-cr-la-gi/">AVE và CR</a> và bài <a href="/posts/htmt-gia-tri-phan-biet/">HTMT</a>.</p>

<h2>CFA khác EFA ở điểm nào?</h2>
<p>EFA để dữ liệu tự cho biết có bao nhiêu nhân tố và biến nào thuộc nhân tố nào. CFA làm ngược lại: bạn khai báo trước mỗi biến quan sát chỉ đo một khái niệm, rồi kiểm định xem cấu trúc đó có phù hợp với ma trận hiệp phương sai của dữ liệu không.</p>
<table>
<thead>
<tr><th></th><th>EFA (SPSS)</th><th>CFA (AMOS)</th></tr>
</thead>
<tbody>
<tr><td>Mục đích</td><td>Khám phá cấu trúc</td><td>Khẳng định cấu trúc đã có lý thuyết</td></tr>
<tr><td>Biến quan sát tải lên</td><td>Mọi nhân tố (có tải chéo)</td><td>Chỉ khái niệm được khai báo</td></tr>
<tr><td>Kết quả chính</td><td>KMO, phương sai trích, ma trận xoay</td><td>Chỉ số phù hợp, hệ số tải chuẩn hoá, CR, AVE</td></tr>
<tr><td>Kiểm định toàn mô hình</td><td>Không</td><td>Có (Chi bình phương và các chỉ số phù hợp)</td></tr>
</tbody>
</table>
<p>Quy trình thường gặp trong luận văn: Cronbach's alpha, EFA trên SPSS (xem bài <a href="/posts/cach-doc-ket-qua-efa-spss/">cách đọc kết quả EFA</a>), CFA trên AMOS, rồi mô hình cấu trúc SEM. Nếu dùng SmartPLS thì không có bộ chỉ số phù hợp kiểu AMOS; PLS-SEM đánh giá mô hình đo lường bằng hệ số tải, CR, AVE, HTMT, xem bài <a href="/posts/pls-sem-la-gi-smartpls/">PLS-SEM là gì</a>.</p>

<h2>Cách chạy CFA trong AMOS</h2>
<ol>
<li><strong>Chuẩn bị dữ liệu.</strong> Lưu file .sav chỉ gồm các biến quan sát còn lại sau EFA. AMOS mặc định không tính được modification indices khi dữ liệu có ô trống, nên xử lý dữ liệu thiếu trước.</li>
<li><strong>Vẽ mô hình.</strong> Mỗi khái niệm là một hình elip, mỗi biến quan sát là một hình chữ nhật có mũi tên từ elip trỏ vào, kèm một sai số (hình tròn nhỏ). Công cụ <em>Draw a latent variable or add an indicator</em> vẽ cả cụm này một lần.</li>
<li><strong>Gán biến.</strong> <em>View → Variables in Dataset</em>, kéo tên biến vào hình chữ nhật. Đặt tên sai số bằng <em>Plugins → Name Unobserved Variables</em>.</li>
<li><strong>Nối hiệp phương sai.</strong> Vẽ mũi tên hai đầu giữa mọi cặp khái niệm. Có thể dùng <em>Plugins → Draw Covariances</em> sau khi chọn tất cả elip.</li>
<li><strong>Chọn output.</strong> <em>View → Analysis Properties → Output</em>, tích <em>Standardized estimates</em>, <em>Squared multiple correlations</em> và <em>Modification indices</em> (ngưỡng mặc định 4).</li>
<li><strong>Thêm SRMR.</strong> AMOS không in SRMR mặc định. Mở <em>Plugins → Standardized RMR</em>, để cửa sổ đó mở rồi mới chạy.</li>
<li><strong>Chạy.</strong> <em>Analyze → Calculate Estimates</em>, sau đó mở <em>View → Text Output</em>.</li>
</ol>
<p>AMOS tự cố định hệ số tải của một biến trên mỗi khái niệm bằng 1 để mô hình xác định được. Đó là lý do một mũi tên có số 1 trên hình; hệ số tải chuẩn hoá của biến đó vẫn được ước lượng bình thường.</p>

<h2>Các chỉ số phù hợp mô hình nằm ở đâu trong output AMOS?</h2>
<p>Mục <em>Model Fit</em> của Text Output có nhiều bảng, mỗi bảng ba dòng: <em>Default model</em> (mô hình của bạn), <em>Saturated model</em> (mô hình bão hoà, khớp hoàn hảo) và <em>Independence model</em> (mô hình độc lập, các biến không tương quan). <strong>Chỉ đọc dòng Default model.</strong></p>
<table>
<thead>
<tr><th>Bảng trong AMOS</th><th>Cột cần đọc</th></tr>
</thead>
<tbody>
<tr><td>CMIN</td><td>CMIN (Chi bình phương), DF, P, CMIN/DF</td></tr>
<tr><td>RMR, GFI</td><td>GFI, AGFI</td></tr>
<tr><td>Baseline Comparisons</td><td>NFI, TLI (rho2), CFI</td></tr>
<tr><td>RMSEA</td><td>RMSEA, LO 90, HI 90, PCLOSE</td></tr>
<tr><td>Cửa sổ plugin Standardized RMR</td><td>SRMR</td></tr>
</tbody>
</table>

<h2>Chỉ số phù hợp mô hình CFA bao nhiêu là đạt?</h2>
<p>Không có một bộ ngưỡng duy nhất. Bảng dưới gom các ngưỡng có nguồn gốc rõ ràng; ghi đúng nguồn bạn chọn trong chương 3.</p>
<table>
<thead>
<tr><th>Chỉ số</th><th>Ngưỡng tốt</th><th>Ngưỡng chấp nhận</th><th>Nguồn</th></tr>
</thead>
<tbody>
<tr><td>Chi bình phương, P</td><td>P &gt; 0,05</td><td>Thường không đạt khi mẫu lớn; không dùng một mình</td><td>Bentler &amp; Bonett (1980)</td></tr>
<tr><td>CMIN/df</td><td>≤ 3</td><td>Không có chuẩn thống nhất</td><td>Hair và cộng sự (2010)</td></tr>
<tr><td>CFI</td><td>≥ 0,95</td><td>≥ 0,90</td><td>Hu &amp; Bentler (1999); Bentler (1990)</td></tr>
<tr><td>TLI</td><td>≥ 0,95</td><td>≥ 0,90</td><td>Hu &amp; Bentler (1999)</td></tr>
<tr><td>RMSEA</td><td>≤ 0,05 (tốt), ≤ 0,06 (Hu &amp; Bentler)</td><td>≤ 0,08 (khá); 0,08 đến 0,10 (tạm)</td><td>Browne &amp; Cudeck (1992); MacCallum và cộng sự (1996)</td></tr>
<tr><td>PCLOSE</td><td>&gt; 0,05</td><td></td><td>Browne &amp; Cudeck (1992)</td></tr>
<tr><td>SRMR</td><td>≤ 0,08</td><td></td><td>Hu &amp; Bentler (1999)</td></tr>
</tbody>
</table>
<h3>Chi bình phương và CMIN/df</h3>
<p>Kiểm định Chi bình phương có giả thuyết H0 là mô hình khớp hoàn hảo với dữ liệu, nên P &gt; 0,05 là tốt. Vấn đề là Chi bình phương tăng theo cỡ mẫu: với vài trăm quan sát, những sai lệch nhỏ không quan trọng cũng làm P &lt; 0,05. Bentler và Bonett (1980) đã chỉ ra hạn chế này và đề xuất các chỉ số so sánh với mô hình độc lập. Vì thế hầu như mọi luận văn có P &lt; 0,05, và đó không phải lý do để kết luận mô hình không phù hợp.</p>
<p>CMIN/df chia Chi bình phương cho bậc tự do để giảm phụ thuộc vào độ phức tạp mô hình. Hair và cộng sự (2010) cho rằng tỉ số khoảng 3 trở xuống gắn với mô hình phù hợp tốt hơn, trừ khi mẫu rất lớn. Bạn sẽ gặp luận văn dùng ngưỡng 2, 3 hoặc 5; tỉ số này vẫn chịu ảnh hưởng của cỡ mẫu nên chỉ dùng tham khảo cùng các chỉ số khác.</p>
<h3>CFI và TLI</h3>
<p>CFI (Comparative Fit Index, Bentler, 1990) và TLI (Tucker-Lewis Index) đo mô hình của bạn tốt hơn mô hình độc lập bao nhiêu. Ngưỡng 0,90 là mức truyền thống; Hu và Bentler (1999) mô phỏng và đề xuất mức gần 0,95. TLI có phạt mô hình phức tạp nên thường thấp hơn CFI một chút.</p>
<h3>RMSEA và PCLOSE</h3>
<p>RMSEA (Root Mean Square Error of Approximation) đo mức sai lệch trên mỗi bậc tự do. Browne và Cudeck (1992) xem RMSEA từ 0,05 trở xuống là phù hợp tốt, tới 0,08 là sai số xấp xỉ hợp lý. MacCallum, Browne và Sugawara (1996) thêm mức 0,08 đến 0,10 là tạm (mediocre) và trên 0,10 là kém. AMOS in thêm khoảng tin cậy 90% (LO 90, HI 90) và PCLOSE, là giá trị p của kiểm định H0: RMSEA ≤ 0,05. PCLOSE &gt; 0,05 nghĩa là chưa bác bỏ được giả thuyết mô hình phù hợp tốt.</p>
<h3>SRMR</h3>
<p>SRMR là trung bình phần dư giữa tương quan quan sát và tương quan do mô hình tái tạo. Hu và Bentler (1999) khuyên báo cáo SRMR kèm CFI hoặc RMSEA, ví dụ SRMR ≤ 0,08 cùng CFI ≥ 0,95, vì cách kết hợp hai chỉ số cho ít sai lầm hơn dùng một chỉ số.</p>
<h3>GFI và AGFI</h3>
<p>GFI và AGFI vẫn xuất hiện trong nhiều luận văn với ngưỡng 0,90 hoặc thấp hơn. Sharma và cộng sự (2005) mô phỏng và thấy GFI bị ảnh hưởng mạnh bởi cỡ mẫu và số biến quan sát, nên khuyên không dùng GFI để đánh giá mô hình. Nếu GFI của bạn dưới 0,90 trong khi CFI, TLI, RMSEA, SRMR đạt, hãy dựa vào các chỉ số sau và trích Sharma và cộng sự (2005).</p>
<h3>Đừng coi ngưỡng là luật cứng</h3>
<p>Ngay sau công bố của Hu và Bentler, Marsh, Hau và Wen (2004) cảnh báo rằng các ngưỡng này được rút ra từ một số dạng mô hình cụ thể và không nên áp máy móc như "luật vàng". Steiger (2007) cũng nhắc rằng chỉ số tổng thể đạt chưa có nghĩa mọi phần của mô hình đều đúng. Khi bảo vệ, cách nói an toàn là: "các chỉ số đạt mức chấp nhận theo [nguồn], đồng thời hệ số tải và phần dư không cho thấy vấn đề cục bộ".</p>

<h2>Ví dụ tính tay: từ output tới bốn chỉ số</h2>
<p>Ví dụ giả định để minh hoạ: mô hình CFA có 6 khái niệm, mỗi khái niệm 4 biến quan sát (24 biến), N = 300.</p>
<ul>
<li>Số mô men của dữ liệu: 24 × 25 / 2 = 300. Số tham số tự do: 18 hệ số tải (6 hệ số đã cố định bằng 1), 6 phương sai khái niệm, 15 hiệp phương sai giữa khái niệm, 24 phương sai sai số, tổng 63. Bậc tự do df = 300 − 63 = 237.</li>
<li>Mô hình độc lập chỉ ước lượng 24 phương sai, nên df<sub>b</sub> = 300 − 24 = 276.</li>
<li>Giả sử AMOS cho χ² = 412,6 và χ²<sub>b</sub> của mô hình độc lập = 5.120,4.</li>
</ul>
<table>
<thead>
<tr><th>Chỉ số</th><th>Công thức</th><th>Tính</th><th>Kết quả</th></tr>
</thead>
<tbody>
<tr><td>CMIN/df</td><td>χ² / df</td><td>412,6 / 237</td><td>1,741</td></tr>
<tr><td>RMSEA</td><td>√[(χ² − df) / (df × (N − 1))]</td><td>√[175,6 / (237 × 299)] = √0,002478</td><td>0,050</td></tr>
<tr><td>CFI</td><td>1 − (χ² − df) / (χ²<sub>b</sub> − df<sub>b</sub>)</td><td>1 − 175,6 / 4.844,4</td><td>0,964</td></tr>
<tr><td>TLI</td><td>(χ²<sub>b</sub>/df<sub>b</sub> − χ²/df) / (χ²<sub>b</sub>/df<sub>b</sub> − 1)</td><td>(18,552 − 1,741) / 17,552</td><td>0,958</td></tr>
</tbody>
</table>
<p>Cả bốn chỉ số đạt mức tốt theo Hu và Bentler (1999), dù P của Chi bình phương chắc chắn nhỏ hơn 0,05. Ví dụ cũng cho thấy vì sao mẫu lớn làm χ² lớn mà RMSEA vẫn tốt: mẫu số của RMSEA có N − 1. Một số phần mềm dùng N thay cho N − 1 nên chữ số thứ ba có thể lệch nhẹ.</p>

<h2>Mô hình CFA chưa phù hợp thì xử lý thế nào?</h2>
<p>Làm theo thứ tự, mỗi lần sửa một chỗ, chạy lại và ghi lại lý do:</p>
<ol>
<li><strong>Kiểm tra dữ liệu.</strong> Lỗi nhập liệu, biến đảo chiều chưa mã hoá lại, phiếu trả lời một kiểu (straight-lining) đều làm mô hình kém. Xem bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">lọc phiếu khảo sát không hợp lệ</a>.</li>
<li><strong>Xem hệ số tải chuẩn hoá</strong> (bảng <em>Standardized Regression Weights</em>). Biến có hệ số tải dưới 0,5 là ứng viên để loại; Hair và cộng sự (2010) khuyên lý tưởng từ 0,7. Chỉ loại khi khái niệm vẫn còn ít nhất 3 biến và nội dung khái niệm không bị mất.</li>
<li><strong>Xem modification indices</strong> (bảng <em>Covariances</em> trong mục Modification Indices). MI lớn giữa hai sai số cho biết nối chúng sẽ giảm χ². Chỉ nối sai số của hai biến <strong>cùng một khái niệm</strong> và khi có lý do nội dung, ví dụ hai câu dùng cách diễn đạt gần giống nhau. Không nối sai số giữa hai khái niệm khác nhau.</li>
<li><strong>Dừng sớm.</strong> MacCallum, Roznowski và Necowitz (1992) cho thấy sửa mô hình dựa trên MI dễ "ăn may" theo mẫu cụ thể và khó lặp lại ở mẫu khác. Nếu phải sửa nhiều để đạt ngưỡng, hãy báo cáo đó là hạn chế.</li>
</ol>
<p>Mô hình CFA kém đôi khi vì cỡ mẫu nhỏ so với độ phức tạp; mức tối thiểu theo số khái niệm và communality có trong bài <a href="/posts/co-mau-nghien-cuu-bao-nhieu-la-du/">cỡ mẫu bao nhiêu là đủ</a>. Nếu bạn có số liệu mà không biết xử lý tiếp thế nào, <a href="/cong-cu/bac-si-ket-qua/">công cụ bác sĩ kết quả</a> nhận các chỉ số đã chạy và gợi ý cách xử lý hợp lệ kèm trích dẫn.</p>

<h2>Sau khi mô hình phù hợp: độ tin cậy và giá trị</h2>
<p>Chỉ số phù hợp đạt mới là điều kiện cần. Bước tiếp theo trong cùng mục CFA:</p>
<ul>
<li><strong>Giá trị hội tụ:</strong> hệ số tải chuẩn hoá từ 0,5 (tốt hơn 0,7) và có ý nghĩa; độ tin cậy tổng hợp CR từ 0,7; AVE từ 0,5 (Fornell &amp; Larcker, 1981). AMOS không in CR và AVE, bạn tính từ hệ số tải chuẩn hoá; cách tính có trong bài <a href="/posts/ave-cr-la-gi/">AVE và CR</a>.</li>
<li><strong>Giá trị phân biệt:</strong> căn bậc hai AVE của mỗi khái niệm lớn hơn tương quan của nó với khái niệm khác (Fornell &amp; Larcker, 1981), hoặc HTMT dưới 0,85 hay 0,90 (Henseler và cộng sự, 2015).</li>
</ul>
<p>Ví dụ với thang đo có sẵn như <a href="/thang-do/servqual/">SERVQUAL</a> hay <a href="/thang-do/tam/">TAM</a>: CFA giúp bạn chứng minh bản dịch tiếng Việt giữ được cấu trúc khái niệm của thang đo gốc.</p>

<h2>Đoạn văn mẫu cho chương 4</h2>
<blockquote>Phân tích nhân tố khẳng định được thực hiện trên AMOS với 24 biến quan sát thuộc 6 khái niệm (N = 300). Kiểm định Chi bình phương có ý nghĩa thống kê (χ² = 412,6; df = 237; p &lt; 0,001), điều thường gặp với cỡ mẫu lớn (Bentler &amp; Bonett, 1980). Các chỉ số còn lại cho thấy mô hình phù hợp với dữ liệu: CMIN/df = 1,74; CFI = 0,964; TLI = 0,958; RMSEA = 0,050, đều đạt ngưỡng của Hu và Bentler (1999). Tất cả hệ số tải chuẩn hoá đều lớn hơn 0,5 và có ý nghĩa thống kê ở mức 1%.</blockquote>
<p>Thay số của bạn vào; nếu một chỉ số chỉ đạt mức chấp nhận (ví dụ CFI = 0,92), ghi đúng như vậy và trích nguồn cho ngưỡng 0,90.</p>

<h2>Lỗi thường gặp khi báo cáo CFA</h2>
<ol>
<li><strong>Đọc nhầm dòng.</strong> Lấy số của Saturated model (CFI = 1) hoặc Independence model. Luôn đọc Default model.</li>
<li><strong>Kết luận mô hình kém chỉ vì P &lt; 0,05.</strong> Với mẫu vài trăm, đây là chuyện bình thường.</li>
<li><strong>Chỉ báo cáo các chỉ số đạt.</strong> Hội đồng sẽ hỏi chỉ số bị bỏ đi. Báo cáo một bộ cố định: χ², df, CMIN/df, CFI, TLI, RMSEA (kèm khoảng tin cậy), SRMR.</li>
<li><strong>Nối sai số tràn lan.</strong> Nối sai số khác khái niệm để đẩy CFI lên là sửa dữ liệu cho vừa mô hình.</li>
<li><strong>Trộn ngưỡng.</strong> Trích Hu và Bentler (1999) nhưng dùng mức 0,90 cho CFI. Ngưỡng 0,90 nên trích nguồn truyền thống, mức 0,95 mới là của Hu và Bentler.</li>
</ol>

<h2>Câu hỏi thường gặp</h2>
<h3>CMIN/df bao nhiêu là đạt?</h3>
<p>Mức hay dùng là 3 trở xuống, theo Hair và cộng sự (2010); một số tác giả chấp nhận tới 5. Không có chuẩn thống nhất và tỉ số này vẫn phụ thuộc cỡ mẫu, nên đọc cùng CFI, TLI, RMSEA và SRMR.</p>
<h3>RMSEA bao nhiêu là chấp nhận được?</h3>
<p>RMSEA ≤ 0,05 là tốt, ≤ 0,08 là chấp nhận (Browne &amp; Cudeck, 1992); Hu và Bentler (1999) đề xuất gần 0,06. Từ 0,08 đến 0,10 là tạm, trên 0,10 là kém (MacCallum và cộng sự, 1996).</p>
<h3>CFI chỉ đạt 0,88 thì sao?</h3>
<p>Chưa đạt mức 0,90. Kiểm tra dữ liệu, hệ số tải thấp và modification indices trong cùng khái niệm như ở mục xử lý. Nếu vẫn chưa đạt, báo cáo trung thực và nêu hạn chế; đừng nối sai số giữa các khái niệm khác nhau.</p>
<h3>Có bắt buộc báo cáo GFI không?</h3>
<p>Không. GFI nhạy với cỡ mẫu và số biến; Sharma và cộng sự (2005) khuyên không dùng. Bộ chỉ số nên báo cáo là χ², df, CMIN/df, CFI, TLI, RMSEA, SRMR.</p>
<h3>Lấy SRMR ở đâu trong AMOS?</h3>
<p>Mở <em>Plugins → Standardized RMR</em>, giữ cửa sổ đó mở, rồi chạy <em>Calculate Estimates</em>. Giá trị SRMR hiện trong cửa sổ plugin, không có trong Text Output.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Bentler, P. M. (1990). Comparative fit indexes in structural models. <em>Psychological Bulletin, 107</em>(2), 238–246. https://doi.org/10.1037/0033-2909.107.2.238</li>
<li>Bentler, P. M., &amp; Bonett, D. G. (1980). Significance tests and goodness of fit in the analysis of covariance structures. <em>Psychological Bulletin, 88</em>(3), 588–606. https://doi.org/10.1037/0033-2909.88.3.588</li>
<li>Browne, M. W., &amp; Cudeck, R. (1992). Alternative ways of assessing model fit. <em>Sociological Methods &amp; Research, 21</em>(2), 230–258. https://doi.org/10.1177/0049124192021002005</li>
<li>Fornell, C., &amp; Larcker, D. F. (1981). Evaluating structural equation models with unobservable variables and measurement error. <em>Journal of Marketing Research, 18</em>(1), 39–50. https://doi.org/10.2307/3151312</li>
<li>Hair, J. F., Black, W. C., Babin, B. J., &amp; Anderson, R. E. (2010). <em>Multivariate data analysis</em> (7th ed.). Pearson.</li>
<li>Henseler, J., Ringle, C. M., &amp; Sarstedt, M. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling. <em>Journal of the Academy of Marketing Science, 43</em>(1), 115–135. https://doi.org/10.1007/s11747-014-0403-8</li>
<li>Hu, L., &amp; Bentler, P. M. (1999). Cutoff criteria for fit indexes in covariance structure analysis: Conventional criteria versus new alternatives. <em>Structural Equation Modeling, 6</em>(1), 1–55. https://doi.org/10.1080/10705519909540118</li>
<li>MacCallum, R. C., Browne, M. W., &amp; Sugawara, H. M. (1996). Power analysis and determination of sample size for covariance structure modeling. <em>Psychological Methods, 1</em>(2), 130–149. https://doi.org/10.1037/1082-989X.1.2.130</li>
<li>MacCallum, R. C., Roznowski, M., &amp; Necowitz, L. B. (1992). Model modifications in covariance structure analysis: The problem of capitalization on chance. <em>Psychological Bulletin, 111</em>(3), 490–504. https://doi.org/10.1037/0033-2909.111.3.490</li>
<li>Marsh, H. W., Hau, K.-T., &amp; Wen, Z. (2004). In search of golden rules: Comment on hypothesis-testing approaches to setting cutoff values for fit indexes and dangers in overgeneralizing Hu and Bentler's (1999) findings. <em>Structural Equation Modeling, 11</em>(3), 320–341. https://doi.org/10.1207/s15328007sem1103_2</li>
<li>Sharma, S., Mukherjee, S., Kumar, A., &amp; Dillon, W. R. (2005). A simulation study to investigate the use of cutoff values for assessing model fit in covariance structure models. <em>Journal of Business Research, 58</em>(7), 935–943. https://doi.org/10.1016/j.jbusres.2003.10.007</li>
<li>Steiger, J. H. (2007). Understanding the limitations of global fit assessment in structural equation modeling. <em>Personality and Individual Differences, 42</em>(5), 893–898. https://doi.org/10.1016/j.paid.2006.09.017</li>
</ul>
<p>Bảng tổng hợp ngưỡng của các chỉ số khác (Cronbach, KMO, AVE, HTMT, VIF) có ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận</a>. Định dạng danh mục tham khảo của bạn bằng <a href="/cong-cu/trich-dan-apa/">công cụ trích dẫn APA</a>.</p>
