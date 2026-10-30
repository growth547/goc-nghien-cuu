---
title: "Hồi quy dữ liệu bảng: Pooled OLS, FEM, REM và Hausman"
description: "Hồi quy dữ liệu bảng (panel) cho khoá luận tài chính: Pooled OLS, FEM, REM, kiểm định F, Breusch-Pagan LM, Hausman, sai số chuẩn cluster và lệnh Stata."
pubDatetime: 2026-10-30T17:45:00+07:00
featured: false
tags: ["phân tích dữ liệu","khoá luận"]
---

<p><strong>Dữ liệu bảng (panel data) là dữ liệu theo dõi cùng một nhóm đối tượng, như 40 doanh nghiệp niêm yết, qua nhiều năm. Hồi quy dữ liệu bảng có ba mô hình cơ bản: Pooled OLS (gộp toàn bộ, bỏ qua khác biệt giữa doanh nghiệp), mô hình tác động cố định FEM (mỗi doanh nghiệp có hằng số riêng) và mô hình tác động ngẫu nhiên REM (khác biệt giữa doanh nghiệp là một thành phần sai số ngẫu nhiên).</strong> Chọn mô hình bằng ba kiểm định: F test (Pooled hay FEM), Breusch-Pagan LM (Pooled hay REM) và Hausman (FEM hay REM). Sau đó kiểm tra phương sai thay đổi, tự tương quan và báo cáo sai số chuẩn vững theo cụm doanh nghiệp.</p>

<p>Bài này giải thích từng mô hình bằng trực giác, chạy cả quy trình trên một bộ dữ liệu bảng mô phỏng (tạo bằng Python, biết trước hệ số thật để thấy mô hình nào ước lượng đúng), kèm lệnh Stata và cách viết vào khoá luận.</p>

<h2>Dữ liệu bảng trông như thế nào</h2>
<p>Mỗi dòng là một cặp doanh nghiệp – năm. 40 doanh nghiệp × 8 năm = 320 quan sát. Dạng này gọi là dạng dài (long), là dạng Stata, EViews và R cần:</p>
<table>
<thead><tr><th>firm</th><th>year</th><th>ROA (%)</th><th>LEV</th><th>SIZE</th><th>GROW</th></tr></thead>
<tbody>
<tr><td>AAA</td><td>2018</td><td>…</td><td>…</td><td>…</td><td>…</td></tr>
<tr><td>AAA</td><td>2019</td><td>…</td><td>…</td><td>…</td><td>…</td></tr>
<tr><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td></tr>
<tr><td>BBB</td><td>2018</td><td>…</td><td>…</td><td>…</td><td>…</td></tr>
</tbody>
</table>
<p>Bảng đủ khi mọi doanh nghiệp có đủ mọi năm (balanced), không đủ thì gọi là bảng không cân bằng (unbalanced); cả ba mô hình đều chạy được với bảng không cân bằng. Định nghĩa và công thức các biến trong ví dụ: <a href="/bien-nghien-cuu/roa/">ROA</a>, <a href="/bien-nghien-cuu/don-bay-tai-chinh/">đòn bẩy tài chính</a>, <a href="/bien-nghien-cuu/quy-mo-doanh-nghiep/">quy mô doanh nghiệp</a>, <a href="/bien-nghien-cuu/tang-truong-doanh-thu/">tăng trưởng doanh thu</a>. Nếu cần dữ liệu thật dạng bảng, <a href="/du-lieu/du-lieu-bang/">bộ dữ liệu bảng</a> và <a href="/du-lieu/ngan-hang-niem-yet/">dữ liệu ngân hàng niêm yết</a> có sẵn file CSV dạng dài; <a href="/cong-cu/tinh-chi-so-tai-chinh/">công cụ tính chỉ số tài chính</a> tính ROA, đòn bẩy từ báo cáo tài chính nhiều năm.</p>

<h2>Ba mô hình, một câu hỏi: xử lý khác biệt riêng của từng doanh nghiệp thế nào</h2>
<p>Mỗi doanh nghiệp có những đặc điểm gần như không đổi theo thời gian và không có trong dữ liệu: năng lực ban lãnh đạo, văn hoá, vị thế ngành. Gọi phần này là αᵢ. Mô hình đầy đủ:</p>
<p><code>ROAᵢₜ = β₀ + β₁LEVᵢₜ + β₂SIZEᵢₜ + β₃GROWᵢₜ + αᵢ + uᵢₜ</code></p>
<table>
<thead><tr><th>Mô hình</th><th>Giả định về αᵢ</th><th>Hệ quả</th></tr></thead>
<tbody>
<tr><td>Pooled OLS</td><td>Không tồn tại (αᵢ = 0 với mọi i)</td><td>Nếu αᵢ có thật và tương quan với biến độc lập, hệ số bị chệch</td></tr>
<tr><td>FEM (fixed effects, within)</td><td>Tồn tại, được phép tương quan với biến độc lập</td><td>Loại αᵢ bằng cách trừ trung bình của từng doanh nghiệp; chỉ dùng biến thiên trong nội bộ doanh nghiệp qua thời gian; không ước lượng được biến không đổi theo thời gian (ngành, năm thành lập)</td></tr>
<tr><td>REM (random effects, GLS)</td><td>Tồn tại, ngẫu nhiên, <strong>không</strong> tương quan với biến độc lập</td><td>Hiệu quả hơn FEM (sai số chuẩn nhỏ hơn), dùng được cả biến thiên giữa các doanh nghiệp; nếu giả định sai thì chệch như Pooled</td></tr>
</tbody>
</table>
<p>Giả định "αᵢ không tương quan với biến độc lập" là điểm mấu chốt. Doanh nghiệp quản trị tốt (αᵢ cao) thường cũng vay ít hơn (LEV thấp) và lớn hơn (SIZE cao). Khi đó REM và Pooled gán một phần hiệu quả quản trị cho đòn bẩy và quy mô. Kiểm định Hausman (1978) kiểm tra đúng giả định này. Trình bày đầy đủ về ba mô hình có trong Wooldridge (2010) và Baltagi (2021).</p>

<h2>Ví dụ mô phỏng: biết trước đáp án</h2>
<p>Dữ liệu mô phỏng 40 doanh nghiệp × 8 năm. Hệ số thật được đặt là: LEV = −6,0; SIZE = 0,15; GROW = 2,5. Tác động riêng của doanh nghiệp αᵢ được tạo để tương quan dương với quy mô (doanh nghiệp tốt thường lớn), đúng tình huống REM vi phạm giả định. Kết quả ba mô hình:</p>
<table>
<thead><tr><th>Biến (hệ số thật)</th><th>Pooled OLS</th><th>FEM</th><th>REM</th></tr></thead>
<tbody>
<tr><td>LEV (−6,0)</td><td>−14,594 (1,049)</td><td><strong>−6,554</strong> (0,835)</td><td>−8,598 (0,877)</td></tr>
<tr><td>SIZE (0,15)</td><td>0,621 (0,098)</td><td><strong>0,326</strong> (0,196)</td><td>0,609 (0,135)</td></tr>
<tr><td>GROW (2,5)</td><td>3,373 (0,872)</td><td>3,441 (0,593)</td><td>3,458 (0,646)</td></tr>
<tr><td>Hằng số</td><td>−12,006</td><td></td><td>−14,735</td></tr>
</tbody>
</table>
<p>Trong ngoặc là sai số chuẩn thông thường. FEM cho hệ số LEV gần giá trị thật nhất; Pooled OLS phóng đại tác động của đòn bẩy hơn gấp đôi; REM nằm giữa. Hệ số SIZE của Pooled và REM lớn gấp bốn lần giá trị thật, vì chúng gán ảnh hưởng của chất lượng doanh nghiệp (αᵢ) cho quy mô. Trong FEM, SIZE không có ý nghĩa thống kê (t = 1,66) vì quy mô của một doanh nghiệp thay đổi rất ít qua 8 năm: FEM chỉ học từ biến thiên trong nội bộ doanh nghiệp, và biến gần như không đổi thì cho sai số chuẩn lớn. Đây là cái giá của FEM, không phải lỗi.</p>

<h2>Bước 1: F test, chọn Pooled OLS hay FEM</h2>
<p>Ở cuối bảng kết quả <code>xtreg, fe</code>, Stata in dòng "F test that all u_i=0". H₀: mọi doanh nghiệp có cùng hằng số (Pooled đủ dùng). Dữ liệu ví dụ: F(39, 277) = 12,28; p &lt; 0,001. Bác bỏ H₀, FEM tốt hơn Pooled OLS. Bậc tự do: 40 − 1 = 39 doanh nghiệp thêm vào, 320 − 40 − 3 = 277 cho phần dư.</p>

<h2>Bước 2: Breusch-Pagan LM, chọn Pooled OLS hay REM</h2>
<p>Breusch và Pagan (1980) đề xuất kiểm định nhân tử Lagrange: H₀ là phương sai của αᵢ bằng 0 (Pooled đủ dùng). Chạy sau <code>xtreg, re</code> bằng lệnh <code>xttest0</code>. Dữ liệu ví dụ: χ² = 214,4; p &lt; 0,001. Bác bỏ H₀, REM tốt hơn Pooled. Kết quả REM cũng cho sigma_u = 1,20, sigma_e = 1,57 và rho = 0,37: 37% phương sai sai số đến từ khác biệt giữa các doanh nghiệp.</p>
<p>Cả hai bước đều loại Pooled OLS. Đây là kết quả rất thường gặp với dữ liệu doanh nghiệp, và là lý do báo cáo chỉ Pooled OLS cho dữ liệu bảng thường bị hội đồng hỏi lại.</p>

<h2>Bước 3: Hausman, chọn FEM hay REM</h2>
<p>Ý tưởng của Hausman (1978): nếu giả định của REM đúng, cả FEM và REM đều nhất quán nên hệ số của chúng phải gần nhau; nếu giả định sai, chỉ FEM nhất quán và hai bộ hệ số sẽ khác nhau một cách hệ thống. H₀: khác biệt không có tính hệ thống (dùng REM).</p>
<pre><code>xtreg roa lev size grow, fe
estimates store fe
xtreg roa lev size grow, re
estimates store re
hausman fe re, sigmamore</code></pre>
<p>Dữ liệu ví dụ: χ²(3) = 57,2; p &lt; 0,001. Bác bỏ H₀, chọn FEM, khớp với việc ta biết αᵢ tương quan với quy mô.</p>
<p><strong>Lưu ý về ma trận không xác định dương.</strong> Chạy <code>hausman fe re</code> không có tuỳ chọn, Stata dùng phương sai sai số riêng của từng mô hình; hiệu hai ma trận phương sai có thể không xác định dương và Stata in cảnh báo kèm χ² âm hoặc vô nghĩa. Với dữ liệu ví dụ, cách mặc định cho χ² = −41,4, không diễn giải được. Tuỳ chọn <code>sigmamore</code> dùng chung một ước lượng phương sai cho cả hai mô hình và khắc phục được trường hợp này. Đừng báo cáo χ² âm như một kết quả "không bác bỏ H₀".</p>
<p>Một cách thay thế được dùng khi cần sai số chuẩn vững là kiểm định Mundlak (1978): thêm trung bình theo doanh nghiệp của từng biến độc lập vào REM và kiểm định chúng đồng thời bằng 0.</p>

<h2>Bước 4: phương sai thay đổi, tự tương quan và sai số chuẩn vững</h2>
<p>Chọn được FEM chưa phải là xong. Sai số chuẩn thông thường giả định phần dư có phương sai không đổi và không tương quan theo thời gian trong cùng doanh nghiệp, hai điều hiếm khi đúng với dữ liệu tài chính.</p>
<ul>
<li><strong>Tự tương quan</strong>: kiểm định Wooldridge, lệnh <code>xtserial roa lev size grow</code> (cài bằng <code>ssc install xtserial</code>), được trình bày trong Drukker (2003).</li>
<li><strong>Phương sai thay đổi giữa các doanh nghiệp</strong> trong FEM: kiểm định Wald sửa đổi, lệnh <code>xttest3</code> sau <code>xtreg, fe</code> (cài bằng <code>ssc install xttest3</code>).</li>
<li><strong>Khắc phục</strong>: sai số chuẩn vững theo cụm doanh nghiệp, <code>xtreg roa lev size grow, fe vce(cluster firm)</code>. Sai số chuẩn cụm vững với cả phương sai thay đổi lẫn tự tương quan bất kỳ trong cùng doanh nghiệp. Petersen (2009) cho thấy trong dữ liệu bảng tài chính, sai số chuẩn OLS thông thường có thể thấp hơn thực tế đáng kể, và khuyên dùng sai số chuẩn cụm.</li>
<li><strong>Tương quan giữa các doanh nghiệp trong cùng năm</strong> (cú sốc thị trường chung): sai số chuẩn Driscoll và Kraay (1998), lệnh <code>xtscc</code> (Hoechle, 2007), hoặc thêm biến giả năm <code>i.year</code>.</li>
</ul>
<p>Dữ liệu ví dụ, FEM với sai số chuẩn cụm: LEV −6,554 (0,832), SIZE 0,326 (0,203), GROW 3,441 (0,486). Hệ số không đổi, chỉ sai số chuẩn thay đổi. Với Pooled OLS, sai số chuẩn cụm của LEV tăng từ 1,049 lên 1,577 và của SIZE từ 0,098 lên 0,174: sai số chuẩn thông thường đã đánh giá quá cao độ chính xác, đúng như cảnh báo của Petersen (2009). Số trên tính bằng code tự viết; Stata có thể lệch ở chữ số thứ ba do cách hiệu chỉnh bậc tự do.</p>
<p>Lưu ý: với sai số chuẩn cụm, cần đủ nhiều cụm; vài chục doanh nghiệp trở lên là phổ biến trong thực hành. Chỉ có 5 đến 10 doanh nghiệp thì sai số chuẩn cụm kém tin cậy, nên nêu điều này ở phần hạn chế.</p>

<h2>Toàn bộ lệnh Stata theo thứ tự</h2>
<pre><code>* Khai báo dữ liệu bảng (firm phải là số; nếu là mã chữ: encode firm, gen(id))
xtset id year

* 1. Pooled OLS
reg roa lev size grow
reg roa lev size grow, vce(cluster id)

* 2. FEM: đọc dòng F test that all u_i=0
xtreg roa lev size grow, fe
estimates store fe
xttest3

* 3. REM và Breusch-Pagan LM
xtreg roa lev size grow, re
estimates store re
xttest0

* 4. Hausman
hausman fe re, sigmamore

* 5. Tự tương quan và mô hình cuối với sai số chuẩn cụm
xtserial roa lev size grow
xtreg roa lev size grow i.year, fe vce(cluster id)</code></pre>
<p>Kết quả <code>xtreg, fe</code> có ba R²: within (biến thiên trong doanh nghiệp được giải thích, là R² phù hợp nhất để báo cáo cho FEM; dữ liệu ví dụ là 0,254), between và overall. Cách đọc R² nói chung có ở bài <a href="/posts/r-binh-phuong-hieu-chinh/">R bình phương hiệu chỉnh</a>.</p>
<p>EViews: khai báo Panel trong Workfile Structure, chọn Fixed/Random ở tab Panel Options, Hausman qua View → Fixed/Random Effects Testing → Correlated Random Effects - Hausman Test. R: gói <code>plm</code> với <code>plm(..., model = "within")</code>, <code>phtest()</code> và <code>plmtest()</code>.</p>

<h2>Những tình huống không nên dùng FEM/REM thông thường</h2>
<ul>
<li><strong>Có biến trễ của biến phụ thuộc</strong> (ROAᵢ,ₜ₋₁ ở vế phải): FEM bị chệch khi số năm ít; tài liệu thường chuyển sang GMM.</li>
<li><strong>Biến quan tâm gần như không đổi theo thời gian</strong> (sở hữu nhà nước, kiểm toán Big4): FEM loại gần hết biến thiên; cân nhắc REM nếu Hausman cho phép, hoặc mô hình Mundlak.</li>
<li><strong>Số năm dài, số doanh nghiệp ít</strong> (ví dụ 5 quốc gia × 30 năm): cần quan tâm tính dừng của chuỗi thời gian trước.</li>
</ul>
<p><a href="/cong-cu/chon-phuong-phap/">Công cụ chọn phương pháp phân tích</a> gợi ý mô hình theo cấu trúc dữ liệu và mục tiêu, kèm nguồn trích dẫn.</p>

<h2>Câu mẫu viết vào chương 4</h2>
<blockquote><p>Nghiên cứu ước lượng ba mô hình Pooled OLS, FEM và REM. Kiểm định F cho thấy tác động cố định của doanh nghiệp có ý nghĩa (F(39, 277) = 12,28; p &lt; 0,001), kiểm định nhân tử Lagrange của Breusch và Pagan (1980) bác bỏ giả thuyết phương sai tác động riêng bằng 0 (χ² = 214,4; p &lt; 0,001), do đó mô hình Pooled OLS không phù hợp. Kiểm định Hausman (1978) bác bỏ giả thuyết khác biệt giữa hệ số FEM và REM không mang tính hệ thống (χ²(3) = 57,2; p &lt; 0,001), vì vậy mô hình FEM được lựa chọn. Để khắc phục phương sai sai số thay đổi và tự tương quan trong cùng doanh nghiệp, mô hình FEM được ước lượng với sai số chuẩn vững theo cụm doanh nghiệp (Petersen, 2009). Kết quả cho thấy đòn bẩy tài chính có tác động ngược chiều đến ROA (β = −6,554; p &lt; 0,001) và tăng trưởng doanh thu có tác động cùng chiều (β = 3,441; p &lt; 0,001), trong khi tác động của quy mô doanh nghiệp không có ý nghĩa thống kê ở mức 5%.</p></blockquote>

<h2>Câu hỏi thường gặp</h2>
<h3>Hausman có p lớn hơn 0,05 thì chọn mô hình nào?</h3>
<p>Không bác bỏ H₀ nên chọn REM, vì REM hiệu quả hơn khi giả định của nó không bị dữ liệu bác bỏ. Kiểm tra lại rằng χ² không âm và không có cảnh báo ma trận không xác định dương; nếu có, chạy lại với <code>sigmamore</code>.</p>
<h3>FEM và REM khác nhau như thế nào, nói ngắn gọn?</h3>
<p>FEM coi khác biệt riêng của từng đối tượng là cố định và cho phép nó tương quan với biến độc lập; REM coi đó là sai số ngẫu nhiên không tương quan với biến độc lập. FEM an toàn hơn, REM chính xác hơn khi giả định đúng.</p>
<h3>Dữ liệu bảng có cần kiểm định tính dừng không?</h3>
<p>Với bảng nhiều đối tượng và ít năm (ví dụ 100 doanh nghiệp × 8 năm), phần lớn khoá luận không cần. Với bảng ít đối tượng và nhiều năm (dữ liệu quốc gia), cần kiểm định nghiệm đơn vị cho dữ liệu bảng trước khi hồi quy.</p>
<h3>Có cần chạy cả Pooled OLS nếu biết sẽ chọn FEM?</h3>
<p>Nên trình bày cả ba mô hình trong một bảng cạnh nhau rồi đến các kiểm định lựa chọn. Hội đồng muốn thấy quá trình lựa chọn, không chỉ mô hình cuối.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Baltagi, B. H. (2021). <em>Econometric analysis of panel data</em> (6th ed.). Springer. https://doi.org/10.1007/978-3-030-53953-5</li>
<li>Breusch, T. S., &amp; Pagan, A. R. (1980). The Lagrange multiplier test and its applications to model specification in econometrics. <em>The Review of Economic Studies, 47</em>(1), 239–253. https://doi.org/10.2307/2297111</li>
<li>Driscoll, J. C., &amp; Kraay, A. C. (1998). Consistent covariance matrix estimation with spatially dependent panel data. <em>Review of Economics and Statistics, 80</em>(4), 549–560. https://doi.org/10.1162/003465398557825</li>
<li>Drukker, D. M. (2003). Testing for serial correlation in linear panel-data models. <em>The Stata Journal, 3</em>(2), 168–177. https://doi.org/10.1177/1536867X0300300206</li>
<li>Hausman, J. A. (1978). Specification tests in econometrics. <em>Econometrica, 46</em>(6), 1251–1271. https://doi.org/10.2307/1913827</li>
<li>Hoechle, D. (2007). Robust standard errors for panel regressions with cross-sectional dependence. <em>The Stata Journal, 7</em>(3), 281–312. https://doi.org/10.1177/1536867X0700700301</li>
<li>Mundlak, Y. (1978). On the pooling of time series and cross section data. <em>Econometrica, 46</em>(1), 69–85. https://doi.org/10.2307/1913646</li>
<li>Petersen, M. A. (2009). Estimating standard errors in finance panel data sets: Comparing approaches. <em>The Review of Financial Studies, 22</em>(1), 435–480. https://doi.org/10.1093/rfs/hhn053</li>
<li>Wooldridge, J. M. (2010). <em>Econometric analysis of cross section and panel data</em> (2nd ed.). MIT Press.</li>
</ul>
