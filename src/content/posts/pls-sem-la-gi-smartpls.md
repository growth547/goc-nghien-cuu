---
title: "PLS-SEM là gì? Khi nào dùng SmartPLS thay CB-SEM"
description: "PLS-SEM là gì, khác CB-SEM (AMOS) ở đâu, khi nào nên dùng, cỡ mẫu tối thiểu và quy trình SmartPLS: mô hình đo lường, mô hình cấu trúc, bootstrap, ví dụ số."
pubDatetime: 2026-10-30T18:00:00+07:00
featured: false
tags: ["PLS-SEM","phân tích dữ liệu","khoá luận"]
---

<p><strong>PLS-SEM (partial least squares structural equation modeling) là phương pháp mô hình cấu trúc tuyến tính ước lượng các biến tiềm ẩn bằng tổ hợp có trọng số của biến quan sát, rồi ước lượng quan hệ giữa chúng bằng một chuỗi hồi quy, với mục tiêu tối đa hoá phần biến thiên được giải thích của các biến phụ thuộc.</strong> Khác với CB-SEM (AMOS, LISREL) vốn tái tạo ma trận hiệp phương sai, PLS-SEM không đòi phân phối chuẩn, chạy được với mô hình phức tạp và khái niệm nguyên nhân (formative), và phù hợp khi mục tiêu là giải thích và dự báo (Hair và cộng sự, 2019). SmartPLS là phần mềm phổ biến nhất để chạy PLS-SEM, với quy trình hai bước: đánh giá mô hình đo lường, rồi đánh giá mô hình cấu trúc bằng bootstrap.</p>

<p>Bài này giải thích PLS-SEM bằng trực giác, so sánh với CB-SEM, nêu cách tính cỡ mẫu tối thiểu, rồi đi qua toàn bộ quy trình SmartPLS với một bộ dữ liệu mô phỏng (tạo bằng Python với thuật toán PLS tự viết, không phải dữ liệu khảo sát thật). Số của SmartPLS trên dữ liệu thật của bạn sẽ khác, nhưng cách đọc thì giống.</p>

<h2>PLS-SEM hoạt động thế nào</h2>
<p>Mô hình PLS-SEM gồm hai phần:</p>
<ul>
<li><strong>Mô hình đo lường (outer model)</strong>: quan hệ giữa mỗi biến tiềm ẩn và các biến quan sát của nó. Ví dụ "sự hài lòng" đo bằng 4 câu HL1 đến HL4.</li>
<li><strong>Mô hình cấu trúc (inner model)</strong>: quan hệ giữa các biến tiềm ẩn, tức các giả thuyết H1, H2, H3.</li>
</ul>
<p>Thuật toán lặp đi lặp lại hai việc: (1) tính điểm mỗi biến tiềm ẩn bằng tổng có trọng số các biến quan sát; (2) cập nhật trọng số sao cho điểm đó liên hệ tốt nhất với các biến tiềm ẩn kề bên trong mô hình. Khi trọng số ổn định, điểm biến tiềm ẩn được dùng để chạy hồi quy OLS cho từng biến phụ thuộc, cho ra hệ số đường dẫn và R². Vì vậy, nhiều khái niệm của hồi quy (R², VIF, f²) xuất hiện lại trong PLS-SEM với ý nghĩa gần như y hệt.</p>
<p>PLS-SEM không có kiểm định ý nghĩa dựa trên phân phối chuẩn. Sai số chuẩn được ước lượng bằng <strong>bootstrap</strong>: lấy mẫu lặp có hoàn lại hàng nghìn lần từ dữ liệu của bạn, chạy lại mô hình trên mỗi mẫu, và xem hệ số dao động bao nhiêu.</p>

<h2>PLS-SEM hay CB-SEM: chọn thế nào</h2>
<table>
<thead><tr><th>Tiêu chí</th><th>PLS-SEM (SmartPLS)</th><th>CB-SEM (AMOS)</th></tr></thead>
<tbody>
<tr><td>Mục tiêu</td><td>Giải thích phương sai, dự báo; phát triển lý thuyết</td><td>Kiểm định, xác nhận lý thuyết; so sánh mô hình</td></tr>
<tr><td>Khái niệm đo lường</td><td>Reflective và formative đều được</td><td>Chủ yếu reflective; formative phức tạp</td></tr>
<tr><td>Phân phối dữ liệu</td><td>Không đòi chuẩn</td><td>Ước lượng ML giả định chuẩn đa biến</td></tr>
<tr><td>Cỡ mẫu</td><td>Hoạt động với mẫu nhỏ hơn, nhưng vẫn cần đủ power</td><td>Thường cần mẫu lớn hơn</td></tr>
<tr><td>Độ phù hợp tổng thể</td><td>Không có chỉ số phù hợp được chấp nhận rộng rãi; SRMR còn tạm thời</td><td>CFI, TLI, RMSEA, SRMR</td></tr>
<tr><td>Mô hình phức tạp</td><td>Nhiều biến, nhiều đường dẫn vẫn hội tụ</td><td>Dễ không hội tụ khi mô hình lớn</td></tr>
</tbody>
</table>
<p>Hair và cộng sự (2019) khuyên dùng PLS-SEM khi mục tiêu là dự báo hoặc giải thích, khi có khái niệm formative, khi mô hình phức tạp, hoặc khi cần dùng điểm biến tiềm ẩn cho phân tích tiếp. Reinartz và cộng sự (2009) so sánh hai phương pháp bằng mô phỏng và thấy PLS-SEM có power cao hơn khi mẫu nhỏ. Ngược lại, khi lý thuyết đã vững, mọi khái niệm là reflective và mục tiêu là kiểm định độ phù hợp của toàn mô hình, CB-SEM là lựa chọn tự nhiên.</p>
<p>Một điểm tranh luận: khi dữ liệu thực sự sinh ra từ mô hình nhân tố chung (đúng giả định của CB-SEM), PLS-SEM có xu hướng phóng đại hệ số tải và thu nhỏ hệ số đường dẫn. Sarstedt và cộng sự (2016) chỉ ra chiều ngược lại cũng đúng: khi dữ liệu sinh ra từ mô hình tổng hợp (composite), CB-SEM mới là bên chệch. Henseler và cộng sự (2014) phản bác nhiều nhận định phổ biến về PLS. Nếu cần ước lượng nhất quán cho mô hình nhân tố chung trong SmartPLS, có thể dùng PLSc (consistent PLS) của Dijkstra và Henseler (2015). Đừng chọn PLS-SEM chỉ vì "mẫu nhỏ" hay "dữ liệu không chuẩn"; hãy lập luận theo mục tiêu nghiên cứu.</p>

<h2>Cỡ mẫu tối thiểu cho PLS-SEM</h2>
<ul>
<li><strong>Quy tắc 10 lần</strong>: cỡ mẫu ít nhất gấp 10 lần số mũi tên lớn nhất trỏ vào một biến tiềm ẩn (Hair và cộng sự, 2011). Dễ dùng nhưng thường đánh giá thấp cỡ mẫu cần thiết.</li>
<li><strong>Căn bậc hai nghịch đảo</strong> (Kock &amp; Hadaya, 2018): n<sub>min</sub> &gt; (2,486 / |β<sub>min</sub>|)² ở mức ý nghĩa 5% và power 80%, với β<sub>min</sub> là hệ số đường dẫn nhỏ nhất kỳ vọng có ý nghĩa. Kỳ vọng hệ số nhỏ nhất là 0,2 thì cần (2,486 / 0,2)² = 154,5, tức 155 phiếu.</li>
<li><strong>G*Power</strong> theo hồi quy bội cho biến tiềm ẩn có nhiều mũi tên trỏ vào nhất.</li>
</ul>
<p><a href="/cong-cu/tinh-co-mau/">Công cụ tính cỡ mẫu</a> tính cả ba cách cho PLS-SEM và in đoạn văn chương 3 có trích dẫn; bài <a href="/posts/co-mau-nghien-cuu-bao-nhieu-la-du/">cỡ mẫu bao nhiêu là đủ</a> so sánh các quy tắc.</p>

<h2>Mô hình và dữ liệu ví dụ</h2>
<p>Ba khái niệm reflective, mỗi khái niệm 4 câu Likert 5 mức, 250 phiếu mô phỏng: chất lượng dịch vụ (CL), sự hài lòng (HL), lòng trung thành (TT). Ba giả thuyết: H1 CL → HL, H2 CL → TT, H3 HL → TT. Đây là mô hình kinh điển của nghiên cứu dịch vụ; thang đo chất lượng dịch vụ hay dùng là SERVQUAL. Vẽ mô hình trước khi vào SmartPLS bằng <a href="/cong-cu/ve-mo-hinh/">công cụ vẽ mô hình nghiên cứu</a>.</p>

<h2>Quy trình trong SmartPLS 4</h2>
<ol>
<li><strong>Chuẩn bị dữ liệu</strong>: file CSV hoặc Excel, mỗi cột là một biến quan sát, dòng đầu là tên biến, không có ô chữ trong cột số. Đã lọc phiếu và mã hoá ngược câu đảo chiều.</li>
<li><strong>Tạo project, nhập dữ liệu</strong>, kiểm tra SmartPLS nhận đúng giá trị thiếu (missing value marker).</li>
<li><strong>Vẽ mô hình</strong>: thả biến tiềm ẩn, kéo các biến quan sát vào, nối mũi tên theo giả thuyết. Mặc định là reflective; đổi sang formative bằng chuột phải nếu cần.</li>
<li><strong>Chạy PLS-SEM algorithm</strong> (để mặc định path weighting scheme). Kết quả này cho hệ số tải, độ tin cậy, AVE, HTMT, VIF, R², f².</li>
<li><strong>Chạy Bootstrapping</strong> với 5.000 mẫu con trở lên (Hair và cộng sự, 2021 khuyên 10.000), percentile bootstrap, kiểm định hai phía, mức 0,05. Kết quả này cho t, p và khoảng tin cậy của mọi hệ số.</li>
<li><strong>Chạy PLSpredict</strong> nếu muốn đánh giá khả năng dự báo ngoài mẫu (Shmueli và cộng sự, 2019).</li>
</ol>

<h2>Bước 1: đánh giá mô hình đo lường</h2>
<p>Theo Hair và cộng sự (2019), khái niệm reflective được đánh giá theo bốn tiêu chí:</p>
<table>
<thead><tr><th>Khái niệm</th><th>Hệ số tải ngoài</th><th>Cronbach's α</th><th>rho_A</th><th>CR (rho_c)</th><th>AVE</th></tr></thead>
<tbody>
<tr><td>CL</td><td>0,685 – 0,869</td><td>0,810</td><td>0,837</td><td>0,875</td><td>0,639</td></tr>
<tr><td>HL</td><td>0,794 – 0,846</td><td>0,835</td><td>0,836</td><td>0,890</td><td>0,669</td></tr>
<tr><td>TT</td><td>0,675 – 0,872</td><td>0,787</td><td>0,811</td><td>0,863</td><td>0,613</td></tr>
</tbody>
</table>
<ul>
<li><strong>Hệ số tải ngoài</strong> nên từ 0,708. CL4 (0,685) và TT4 (0,675) thấp hơn một chút; Hair và cộng sự (2019) chỉ khuyên loại biến tải 0,40 đến 0,70 khi việc loại làm CR hoặc AVE vượt ngưỡng. Ở đây CR và AVE đã đạt, nên giữ lại để bảo toàn nội dung thang đo.</li>
<li><strong>Độ tin cậy</strong> (α, rho_A, CR) từ 0,70 đến 0,95: đạt. rho_A nằm giữa α và CR như kỳ vọng.</li>
<li><strong>Giá trị hội tụ</strong>: AVE từ 0,50: đạt. Cách tính tay CR và AVE có ở bài <a href="/posts/ave-cr-la-gi/">AVE, CR là gì</a>.</li>
<li><strong>Giá trị phân biệt</strong>: HTMT của các cặp CL–HL = 0,553; CL–TT = 0,528; HL–TT = 0,710, đều dưới 0,85. Chi tiết ở bài <a href="/posts/htmt-gia-tri-phan-biet/">HTMT và giá trị phân biệt</a>.</li>
</ul>
<p>Khái niệm formative đánh giá khác hẳn: outer VIF, ý nghĩa và độ lớn của trọng số ngoài, và phân tích dư thừa (redundancy analysis). Không áp dụng α, CR, AVE cho khái niệm formative.</p>

<h2>Bước 2: đánh giá mô hình cấu trúc</h2>
<p><strong>Cộng tuyến (inner VIF).</strong> TT có hai biến dự báo là CL và HL, tương quan giữa điểm hai biến là 0,466, nên inner VIF = 1 / (1 − 0,466²) = 1,28, dưới mốc 3. Xem thêm bài <a href="/posts/he-so-vif-da-cong-tuyen/">hệ số VIF và đa cộng tuyến</a>.</p>
<p><strong>Hệ số đường dẫn và bootstrap</strong> (5.000 mẫu):</p>
<table>
<thead><tr><th>Giả thuyết</th><th>β</th><th>Độ lệch chuẩn bootstrap</th><th>t</th><th>Khoảng tin cậy 95%</th><th>f²</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td>H1: CL → HL</td><td>0,466</td><td>0,050</td><td>9,26</td><td>0,368 – 0,567</td><td>0,277</td><td>Ủng hộ</td></tr>
<tr><td>H2: CL → TT</td><td>0,197</td><td>0,055</td><td>3,60</td><td>0,089 – 0,305</td><td>0,049</td><td>Ủng hộ</td></tr>
<tr><td>H3: HL → TT</td><td>0,494</td><td>0,050</td><td>9,94</td><td>0,395 – 0,590</td><td>0,304</td><td>Ủng hộ</td></tr>
</tbody>
</table>
<p>Hệ số có ý nghĩa khi |t| &gt; 1,96 hoặc khoảng tin cậy 95% không chứa 0. Cả ba giả thuyết được ủng hộ. Kết quả bootstrap thay đổi nhẹ mỗi lần chạy vì mẫu con ngẫu nhiên; cố định seed trong SmartPLS nếu muốn kết quả lặp lại được.</p>
<p><strong>R²</strong>: HL = 0,217; TT = 0,373. Theo mốc Hair và cộng sự (2011), đây là mức yếu đến trung bình; cách diễn giải R² và vì sao không nên dùng mốc máy móc có ở bài <a href="/posts/r-binh-phuong-hieu-chinh/">R bình phương hiệu chỉnh</a>.</p>
<p><strong>f²</strong> theo mốc 0,02 / 0,15 / 0,35 (nhỏ / vừa / lớn): CL → TT có tác động nhỏ (0,049), hai đường còn lại ở mức vừa. f² của CL → TT nhỏ vì phần lớn tác động của chất lượng đến trung thành đi qua sự hài lòng.</p>
<p><strong>Tác động gián tiếp.</strong> CL → HL → TT = 0,466 × 0,494 = 0,230, lớn hơn tác động trực tiếp 0,197. Kiểm định ý nghĩa của tác động gián tiếp bằng mục Specific indirect effects trong kết quả bootstrap (khoảng tin cậy không chứa 0). Phân biệt trung gian toàn phần và một phần có ở bài <a href="/posts/bien-trung-gian-bien-dieu-tiet-la-gi/">biến trung gian và biến điều tiết</a>.</p>
<p><strong>Khả năng dự báo</strong>: Q² từ blindfolding (Stone, 1974) là chỉ số cũ; Hair và cộng sự (2019) khuyên báo cáo PLSpredict, so RMSE hoặc MAE của mô hình PLS với mô hình hồi quy tuyến tính chuẩn cho từng biến quan sát của khái niệm mục tiêu.</p>

<h2>Câu mẫu viết vào chương 4</h2>
<blockquote><p>Mô hình được ước lượng bằng PLS-SEM trên phần mềm SmartPLS 4 (Ringle và cộng sự, 2024). Mô hình đo lường đạt yêu cầu: hệ số tải ngoài từ 0,675 đến 0,872, Cronbach's alpha từ 0,787 đến 0,835, độ tin cậy tổng hợp từ 0,863 đến 0,890, AVE từ 0,613 đến 0,669 và mọi giá trị HTMT dưới 0,85 (Hair và cộng sự, 2019; Henseler và cộng sự, 2015). Trong mô hình cấu trúc, giá trị VIF bằng 1,28, không có dấu hiệu cộng tuyến. Kết quả bootstrap với 5.000 mẫu cho thấy chất lượng dịch vụ tác động cùng chiều đến sự hài lòng (β = 0,466; p &lt; 0,001) và lòng trung thành (β = 0,197; p &lt; 0,001), sự hài lòng tác động cùng chiều đến lòng trung thành (β = 0,494; p &lt; 0,001). Mô hình giải thích 21,7% biến thiên của sự hài lòng và 37,3% biến thiên của lòng trung thành.</p></blockquote>
<p>Bố cục chương 4 đầy đủ có ở bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4</a>.</p>

<h2>Lỗi thường gặp khi dùng SmartPLS</h2>
<ul>
<li><strong>Báo cáo kết quả PLS-SEM algorithm mà không bootstrap</strong>: không có p, không kiểm định được giả thuyết.</li>
<li><strong>Loại biến quan sát hàng loạt</strong> để đẩy AVE lên mà không xem nội dung.</li>
<li><strong>Dùng chỉ số phù hợp kiểu AMOS</strong> (CFI, RMSEA) cho PLS-SEM, hoặc bác bỏ mô hình chỉ vì SRMR trên 0,08.</li>
<li><strong>Áp α, CR, AVE cho khái niệm formative.</strong></li>
<li><strong>Chạy EFA trong SPSS rồi lại chạy SmartPLS</strong> mà không giải thích vì sao: với thang đo đã có sẵn, nhiều hướng dẫn PLS-SEM đi thẳng vào đánh giá mô hình đo lường.</li>
</ul>
<p>Nhập hệ số tải, CR, AVE, HTMT, VIF vào <a href="/cong-cu/bac-si-ket-qua/">bác sĩ kết quả</a> để kiểm tra theo từng ngưỡng và nhận gợi ý xử lý có trích dẫn.</p>

<h2>Câu hỏi thường gặp</h2>
<h3>PLS-SEM và SEM khác nhau như thế nào?</h3>
<p>Cả hai đều là SEM. "SEM" trong khoá luận Việt Nam thường chỉ CB-SEM chạy bằng AMOS, ước lượng bằng ma trận hiệp phương sai và đánh giá bằng chỉ số phù hợp. PLS-SEM ước lượng bằng tổ hợp có trọng số và chuỗi hồi quy, tập trung vào phần biến thiên được giải thích.</p>
<h3>SmartPLS cần bao nhiêu mẫu?</h3>
<p>Theo phương pháp căn bậc hai nghịch đảo (Kock &amp; Hadaya, 2018), nếu hệ số đường dẫn nhỏ nhất kỳ vọng là 0,2 thì cần khoảng 155 phiếu; hệ số nhỏ nhất 0,15 thì cần khoảng 275 phiếu. Quy tắc 10 lần thường cho con số thấp hơn mức cần.</p>
<h3>Có cần chạy Cronbach's alpha và EFA trên SPSS trước khi chạy SmartPLS không?</h3>
<p>Không bắt buộc. SmartPLS báo cáo Cronbach's alpha, rho_A và CR trong phần đánh giá mô hình đo lường. Nhiều giáo viên hướng dẫn vẫn yêu cầu EFA khi thang đo được điều chỉnh nhiều hoặc dịch mới; hỏi trước để thống nhất.</p>
<h3>Bootstrap bao nhiêu mẫu là đủ?</h3>
<p>Tối thiểu 5.000; Hair và cộng sự (2021) khuyên 10.000 cho kết quả cuối cùng. Số mẫu bootstrap không liên quan đến cỡ mẫu khảo sát.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Dijkstra, T. K., &amp; Henseler, J. (2015). Consistent partial least squares path modeling. <em>MIS Quarterly, 39</em>(2), 297–316. https://doi.org/10.25300/MISQ/2015/39.2.02</li>
<li>Hair, J. F., Ringle, C. M., &amp; Sarstedt, M. (2011). PLS-SEM: Indeed a silver bullet. <em>Journal of Marketing Theory and Practice, 19</em>(2), 139–152. https://doi.org/10.2753/MTP1069-6679190202</li>
<li>Hair, J. F., Risher, J. J., Sarstedt, M., &amp; Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review, 31</em>(1), 2–24. https://doi.org/10.1108/EBR-11-2018-0203</li>
<li>Hair, J. F., Jr., Hult, G. T. M., Ringle, C. M., Sarstedt, M., Danks, N. P., &amp; Ray, S. (2021). <em>Partial least squares structural equation modeling (PLS-SEM) using R: A workbook</em>. Springer. https://doi.org/10.1007/978-3-030-80519-7</li>
<li>Henseler, J., Dijkstra, T. K., Sarstedt, M., Ringle, C. M., Diamantopoulos, A., Straub, D. W., Ketchen, D. J., Jr., Hair, J. F., Hult, G. T. M., &amp; Calantone, R. J. (2014). Common beliefs and reality about PLS: Comments on Rönkkö and Evermann (2013). <em>Organizational Research Methods, 17</em>(2), 182–209. https://doi.org/10.1177/1094428114526928</li>
<li>Henseler, J., Ringle, C. M., &amp; Sarstedt, M. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling. <em>Journal of the Academy of Marketing Science, 43</em>(1), 115–135. https://doi.org/10.1007/s11747-014-0403-8</li>
<li>Kock, N., &amp; Hadaya, P. (2018). Minimum sample size estimation in PLS-SEM: The inverse square root and gamma-exponential methods. <em>Information Systems Journal, 28</em>(1), 227–261. https://doi.org/10.1111/isj.12131</li>
<li>Reinartz, W., Haenlein, M., &amp; Henseler, J. (2009). An empirical comparison of the efficacy of covariance-based and variance-based SEM. <em>International Journal of Research in Marketing, 26</em>(4), 332–344. https://doi.org/10.1016/j.ijresmar.2009.08.001</li>
<li>Ringle, C. M., Wende, S., &amp; Becker, J.-M. (2024). <em>SmartPLS 4</em> [Computer software]. SmartPLS. https://www.smartpls.com</li>
<li>Sarstedt, M., Hair, J. F., Ringle, C. M., Thiele, K. O., &amp; Gudergan, S. P. (2016). Estimation issues with PLS and CBSEM: Where the bias lies! <em>Journal of Business Research, 69</em>(10), 3998–4010. https://doi.org/10.1016/j.jbusres.2016.06.007</li>
<li>Shmueli, G., Sarstedt, M., Hair, J. F., Cheah, J.-H., Ting, H., Vaithilingam, S., &amp; Ringle, C. M. (2019). Predictive model assessment in PLS-SEM: Guidelines for using PLSpredict. <em>European Journal of Marketing, 53</em>(11), 2322–2347. https://doi.org/10.1108/EJM-02-2019-0189</li>
<li>Stone, M. (1974). Cross-validatory choice and assessment of statistical predictions. <em>Journal of the Royal Statistical Society: Series B (Methodological), 36</em>(2), 111–133. https://doi.org/10.1111/j.2517-6161.1974.tb00994.x</li>
</ul>
