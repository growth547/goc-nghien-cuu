---
title: "Hồi quy tuyến tính bội SPSS: cách chạy và đọc kết quả từng bảng"
description: "Hồi quy tuyến tính bội trong SPSS: thiết lập từng hộp thoại, đọc Model Summary, ANOVA, Coefficients, kiểm tra giả định, VIF, Cook, ví dụ số và câu mẫu chương 4."
pubDatetime: 2026-10-30T09:14:00+07:00
featured: false
tags: ["SPSS","phân tích dữ liệu","khoá luận"]
---

<p>Hồi quy tuyến tính bội ước lượng tác động của nhiều biến độc lập lên một biến phụ thuộc định lượng cùng lúc. Trong khoá luận dùng SPSS, đây thường là bước kiểm định giả thuyết, chạy sau Cronbach's alpha, EFA và tương quan. Bài này đi qua toàn bộ quy trình với một bộ số liệu ví dụ: thiết lập hộp thoại, đọc ba bảng chính, kiểm tra các giả định, xử lý khi giả định bị vi phạm, và viết kết quả vào chương 4.</p>

<h2>Khi nào dùng hồi quy tuyến tính bội</h2>
<ul>
<li>Biến phụ thuộc là định lượng: điểm trung bình của một thang đo nhiều câu (ví dụ ý định sử dụng), hoặc biến tỉ lệ như chi tiêu.</li>
<li>Các biến độc lập là định lượng, hoặc định tính đã chuyển thành biến giả (dummy).</li>
<li>Mô hình chỉ có một biến phụ thuộc và không có chuỗi quan hệ. Nếu mô hình có biến trung gian (X → M → Y), một phương trình hồi quy không kiểm định được toàn bộ mô hình; cân nhắc PLS-SEM hoặc phân tích trung gian bằng bootstrap.</li>
</ul>
<p>Biến độc lập và phụ thuộc phải là biến tổng hợp đã tạo bằng Compute (trung bình các câu của mỗi thang đo) sau khi kiểm định độ tin cậy, không phải từng câu riêng lẻ.</p>

<h2>Cỡ mẫu tối thiểu</h2>
<p>Green (1991) đề xuất hai quy tắc: N ≥ 50 + 8m để kiểm định toàn bộ mô hình và N ≥ 104 + m để kiểm định từng hệ số, với m là số biến độc lập. Với 4 biến độc lập: 50 + 8 × 4 = 82 và 104 + 4 = 108. Lấy số lớn hơn, 108, làm mức tối thiểu cho phần hồi quy. Các quy tắc này giả định mức tác động trung bình; nếu bạn kỳ vọng tác động nhỏ, cần mẫu lớn hơn nhiều. <a href="/cong-cu/tinh-co-mau/">Máy tính cỡ mẫu</a> tính theo power cho hồi quy, và bài <a href="/posts/co-mau-nghien-cuu-bao-nhieu-la-du/">cỡ mẫu bao nhiêu là đủ</a> so sánh các quy tắc.</p>

<h2>Bộ dữ liệu ví dụ</h2>
<p>Khảo sát 250 sinh viên về ý định sử dụng ví điện tử (BI). Bốn biến độc lập: nhận thức sự hữu ích (PU), nỗ lực kỳ vọng (EE), ảnh hưởng xã hội (SI), niềm tin (TR). Thang đo lấy từ <a href="/thang-do/tam/">TAM</a>, <a href="/thang-do/utaut2/">UTAUT2</a> và <a href="/thang-do/niem-tin-thuong-mai-dien-tu/">thang đo niềm tin thương mại điện tử</a>, Likert 5 mức. Mọi con số dưới đây là số minh hoạ, được tính cho khớp nhau để bạn thấy cách đọc.</p>

<h2>Thiết lập trong SPSS</h2>
<p>Vào <strong>Analyze → Regression → Linear</strong>.</p>
<ol>
<li><strong>Dependent</strong>: BI. <strong>Independent(s)</strong>: PU, EE, SI, TR. <strong>Method</strong>: Enter.</li>
<li><strong>Statistics</strong>: tích Estimates, Model fit, R squared change, Descriptives, Collinearity diagnostics, Durbin-Watson, Casewise diagnostics (outliers outside 3 standard deviations).</li>
<li><strong>Plots</strong>: đưa *ZRESID vào Y, *ZPRED vào X; tích Histogram và Normal probability plot.</li>
<li><strong>Save</strong>: tích Cook's (trong Distances) và Standardized (trong Residuals). SPSS sẽ thêm cột COO_1 và ZRE_1 vào dữ liệu.</li>
</ol>
<p><strong>Enter hay Stepwise?</strong> Dùng Enter khi kiểm định giả thuyết: mọi biến trong mô hình lý thuyết đều được đưa vào cùng lúc. Stepwise chọn biến theo dữ liệu của mẫu, nên kết quả phụ thuộc mẫu và không còn là kiểm định giả thuyết đã đặt trước.</p>

<h2>Bảng 1: Model Summary</h2>
<table>
<thead><tr><th>R</th><th>R Square</th><th>Adjusted R Square</th><th>Durbin-Watson</th></tr></thead>
<tbody><tr><td>0,716</td><td>0,512</td><td>0,504</td><td>1,94</td></tr></tbody>
</table>
<ul>
<li><strong>R²</strong> = 0,512: bốn biến độc lập cùng giải thích 51,2% biến thiên của BI trong mẫu.</li>
<li><strong>R² hiệu chỉnh</strong> = 0,504: điều chỉnh theo số biến và cỡ mẫu, là con số nên báo cáo. Kiểm tra: 1 − (1 − 0,512) × (250 − 1) / (250 − 4 − 1) = 1 − 0,488 × 1,0163 = 0,504.</li>
<li><strong>Durbin-Watson</strong> = 1,94: gần 2, không có dấu hiệu tự tương quan của phần dư. Field (2018) coi giá trị dưới 1 hoặc trên 3 là đáng lo. Với dữ liệu khảo sát cắt ngang, chỉ số này phụ thuộc thứ tự dòng trong file, nên ít thông tin hơn so với dữ liệu theo thời gian (Durbin &amp; Watson, 1950).</li>
</ul>
<p>Không có ngưỡng R² "đạt" chung cho mọi lĩnh vực. Đừng viết "R² trên 0,5 nên mô hình tốt"; thay vào đó so với các nghiên cứu cùng chủ đề. Nếu muốn một thước đo độ lớn, tính f² = R² / (1 − R²) = 0,512 / 0,488 = 1,05, lớn hơn nhiều mốc tác động lớn 0,35 của Cohen (1992).</p>

<h2>Bảng 2: ANOVA</h2>
<table>
<thead><tr><th>Nguồn</th><th>df</th><th>F</th><th>Sig.</th></tr></thead>
<tbody>
<tr><td>Regression</td><td>4</td><td rowspan="2">64,26</td><td rowspan="2">&lt; 0,001</td></tr>
<tr><td>Residual</td><td>245</td></tr>
</tbody>
</table>
<p>Kiểm định F trả lời câu hỏi: ít nhất một biến độc lập có tác động khác 0 không? Sig. &lt; 0,05 nên mô hình có ý nghĩa. F tính được từ R²: (0,512 / 4) / (0,488 / 245) = 0,128 / 0,00199 = 64,3. Bậc tự do là (k, n − k − 1) = (4, 245). Báo cáo đầy đủ: F(4, 245) = 64,26; p &lt; 0,001.</p>

<h2>Bảng 3: Coefficients</h2>
<table>
<thead><tr><th>Biến</th><th>B</th><th>Std. Error</th><th>Beta</th><th>t</th><th>Sig.</th><th>Tolerance</th><th>VIF</th></tr></thead>
<tbody>
<tr><td>(Constant)</td><td>0,412</td><td>0,231</td><td></td><td>1,78</td><td>0,076</td><td></td><td></td></tr>
<tr><td>PU</td><td>0,318</td><td>0,058</td><td>0,312</td><td>5,48</td><td>&lt; 0,001</td><td>0,543</td><td>1,84</td></tr>
<tr><td>EE</td><td>0,104</td><td>0,055</td><td>0,098</td><td>1,89</td><td>0,060</td><td>0,617</td><td>1,62</td></tr>
<tr><td>SI</td><td>0,215</td><td>0,049</td><td>0,226</td><td>4,39</td><td>&lt; 0,001</td><td>0,709</td><td>1,41</td></tr>
<tr><td>TR</td><td>0,241</td><td>0,061</td><td>0,235</td><td>3,95</td><td>&lt; 0,001</td><td>0,508</td><td>1,97</td></tr>
</tbody>
</table>
<p>Đọc theo cột:</p>
<ul>
<li><strong>B (chưa chuẩn hoá)</strong>: khi PU tăng 1 điểm và các biến khác giữ nguyên, BI tăng trung bình 0,318 điểm. Dùng B để viết phương trình và diễn giải theo đơn vị thang đo.</li>
<li><strong>Beta (chuẩn hoá)</strong>: dùng để so sánh mức tác động giữa các biến trong cùng mô hình. PU (0,312) mạnh nhất, tiếp theo TR (0,235) và SI (0,226).</li>
<li><strong>t = B / Std. Error</strong>: 0,318 / 0,058 = 5,48.</li>
<li><strong>Sig.</strong>: PU, SI, TR có p &lt; 0,05 nên giả thuyết tương ứng được ủng hộ. EE có p = 0,060 &gt; 0,05 nên không được ủng hộ ở mức 5%. Kiểm tra dấu của B khớp với chiều giả thuyết; hệ số ngược dấu thì giả thuyết không được ủng hộ dù p nhỏ.</li>
<li><strong>Hằng số</strong> không có ý nghĩa thống kê thì không sao; nó không phải đối tượng kiểm định.</li>
</ul>
<p>Phương trình chưa chuẩn hoá: BI = 0,412 + 0,318 PU + 0,104 EE + 0,215 SI + 0,241 TR.<br>Phương trình chuẩn hoá (chỉ các biến có ý nghĩa): BI = 0,312 PU + 0,235 TR + 0,226 SI.</p>

<h2>Kiểm tra giả định</h2>
<table>
<thead><tr><th>Giả định</th><th>Kiểm tra bằng</th><th>Dấu hiệu ổn</th><th>Nếu vi phạm</th></tr></thead>
<tbody>
<tr><td>Đa cộng tuyến</td><td>VIF, Tolerance</td><td>VIF thấp; ví dụ trên từ 1,41 đến 1,97</td><td>Xem bên dưới</td></tr>
<tr><td>Tuyến tính và phương sai đồng nhất</td><td>Scatterplot *ZRESID theo *ZPRED</td><td>Điểm phân tán ngẫu nhiên quanh 0, không có hình phễu hay hình cong</td><td>Hình phễu: báo cáo sai số chuẩn bền (HC3); hình cong: xem lại dạng quan hệ</td></tr>
<tr><td>Phân phối chuẩn của phần dư</td><td>Histogram, Normal P-P plot</td><td>Histogram gần hình chuông, điểm P-P bám đường chéo</td><td>Với mẫu lớn, ảnh hưởng nhỏ; kiểm tra điểm ngoại lai trước</td></tr>
<tr><td>Độc lập của phần dư</td><td>Durbin-Watson</td><td>Gần 2</td><td>Hiếm gặp với khảo sát cắt ngang chọn mẫu độc lập</td></tr>
<tr><td>Điểm ngoại lai, điểm ảnh hưởng</td><td>Casewise diagnostics, cột COO_1</td><td>Không có phần dư chuẩn hoá vượt ±3; Cook's distance dưới 1</td><td>Kiểm tra phiếu đó, không xoá chỉ vì làm kết quả xấu</td></tr>
</tbody>
</table>
<h3>VIF bao nhiêu là có vấn đề</h3>
<p>Ngưỡng 10 được trích nhiều nhất; nhiều tác giả dùng ngưỡng chặt hơn là 5 hoặc 3. O'Brien (2007) cho thấy các ngưỡng này không nên áp máy móc: VIF cao chỉ làm sai số chuẩn lớn lên, và việc nó có đáng lo hay không còn tuỳ cỡ mẫu và độ lớn hệ số. Cách viết an toàn: nêu ngưỡng bạn dùng kèm nguồn, và nếu có VIF trên 3, xem lại hai biến có tương quan cao có đo trùng khái niệm không (kiểm tra lại EFA).</p>
<h3>Cook's distance</h3>
<p>Cook (1977) đề xuất thước đo ảnh hưởng của từng quan sát lên toàn bộ hệ số. Mốc thường dùng là 1. Sắp xếp cột COO_1 giảm dần; nếu có phiếu vượt mốc, kiểm tra phiếu đó có lỗi nhập liệu hay trả lời rập khuôn không. Quy trình lọc phiếu nên làm trước khi chạy hồi quy, xem bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">lọc phiếu khảo sát không hợp lệ</a>.</p>

<h2>Thêm biến kiểm soát: hồi quy phân cấp</h2>
<p>Nếu muốn kiểm soát giới tính, năm học, thu nhập: trong hộp thoại Linear, đưa các biến kiểm soát vào Block 1, bấm Next, đưa bốn biến chính vào Block 2. Tích R squared change. Bảng Model Summary có thêm cột R² Change và Sig. F Change cho Block 2: phần biến thiên mà các biến chính giải thích thêm ngoài biến kiểm soát. Biến định tính có nhiều nhóm phải tạo biến giả, giữ một nhóm làm nhóm tham chiếu.</p>

<h2>Câu mẫu cho chương 4</h2>
<blockquote><p>Phân tích hồi quy tuyến tính bội với phương pháp Enter được thực hiện với ý định sử dụng ví điện tử là biến phụ thuộc và bốn biến độc lập. Mô hình có ý nghĩa thống kê (F(4, 245) = 64,26; p &lt; 0,001) và giải thích 50,4% biến thiên của ý định sử dụng (R² hiệu chỉnh = 0,504). Hệ số VIF của các biến độc lập nằm trong khoảng 1,41 đến 1,97, cho thấy đa cộng tuyến không phải vấn đề nghiêm trọng (O'Brien, 2007). Đồ thị phân tán phần dư chuẩn hoá theo giá trị dự đoán chuẩn hoá không cho thấy dấu hiệu phương sai thay đổi, biểu đồ tần số phần dư có dạng gần chuẩn, và không có quan sát nào có Cook's distance lớn hơn 1. Nhận thức sự hữu ích (β = 0,312; p &lt; 0,001), niềm tin (β = 0,235; p &lt; 0,001) và ảnh hưởng xã hội (β = 0,226; p &lt; 0,001) có tác động cùng chiều đến ý định sử dụng; H1, H3 và H4 được ủng hộ. Tác động của nỗ lực kỳ vọng không có ý nghĩa thống kê ở mức 5% (β = 0,098; p = 0,060); H2 không được ủng hộ.</p></blockquote>
<p>Cấu trúc toàn chương 4, từ mô tả mẫu tới kiểm định giả thuyết, có trong bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4</a>. Nếu không có SPSS, <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát</a> chạy hồi quy, kiểm tra giả định và gợi ý đoạn văn chương 4 ngay trên trình duyệt.</p>

<h2>Lỗi thường gặp</h2>
<ul>
<li><strong>So sánh mức tác động bằng B</strong> khi các biến có đơn vị khác nhau. Dùng Beta.</li>
<li><strong>Dùng Stepwise</strong> rồi viết là "kiểm định giả thuyết".</li>
<li><strong>Kết luận "mô hình phù hợp vì R² &gt; 0,5"</strong>. R² không có ngưỡng chung.</li>
<li><strong>Bỏ qua dấu của hệ số.</strong> Hệ số âm có ý nghĩa với giả thuyết cùng chiều là giả thuyết không được ủng hộ.</li>
<li><strong>Chỉ báo cáo VIF</strong>, không xem đồ thị phần dư. Đồ thị là nơi lộ ra phương sai thay đổi và quan hệ phi tuyến.</li>
<li><strong>Xoá điểm ngoại lai để "đẹp" kết quả</strong> mà không có lý do nội dung.</li>
<li><strong>Chạy hồi quy riêng cho từng biến độc lập</strong> thay vì một mô hình chung. Các hệ số đơn lẻ không kiểm soát lẫn nhau.</li>
</ul>

<h2>Câu hỏi thường gặp</h2>
<h3>Có bắt buộc chạy tương quan Pearson trước hồi quy không?</h3>
<p>Không bắt buộc về mặt thống kê, nhưng bảng tương quan cho bạn biết trước các cặp biến tương quan quá cao (thường trên 0,8) có thể gây đa cộng tuyến. Phần lớn khoá luận trình bày tương quan trước hồi quy.</p>
<h3>Biến độc lập không có ý nghĩa có cần chạy lại mô hình sau khi bỏ nó?</h3>
<p>Không. Báo cáo mô hình đầy đủ như đã đặt giả thuyết. Bỏ biến rồi chạy lại là chọn mô hình theo dữ liệu.</p>
<h3>R² hiệu chỉnh âm hoặc rất thấp thì sao?</h3>
<p>Mô hình giải thích được rất ít. Kiểm tra lại mã hoá câu đảo chiều, cách tạo biến tổng hợp, và lập luận lý thuyết. Kết quả thấp vẫn báo cáo trung thực và thảo luận.</p>
<h3>Báo cáo p = 0,000 có được không?</h3>
<p>SPSS hiển thị 0,000 do làm tròn; p không bao giờ bằng 0. Viết p &lt; 0,001.</p>
<h3>Dữ liệu Likert có chạy hồi quy tuyến tính được không?</h3>
<p>Được, trên điểm tổng hợp của thang đo nhiều câu. Lập luận và nguồn có trong bài <a href="/posts/likert-la-thang-do-khoang-hay-thu-bac/">Likert là thang đo khoảng hay thứ bậc</a>.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Cohen, J. (1992). A power primer. <em>Psychological Bulletin, 112</em>(1), 155–159. https://doi.org/10.1037/0033-2909.112.1.155</li>
<li>Cook, R. D. (1977). Detection of influential observation in linear regression. <em>Technometrics, 19</em>(1), 15–18. https://doi.org/10.1080/00401706.1977.10489493</li>
<li>Durbin, J., &amp; Watson, G. S. (1950). Testing for serial correlation in least squares regression. I. <em>Biometrika, 37</em>(3–4), 409–428. https://doi.org/10.1093/biomet/37.3-4.409</li>
<li>Field, A. (2018). <em>Discovering statistics using IBM SPSS Statistics</em> (5th ed.). SAGE Publications.</li>
<li>Green, S. B. (1991). How many subjects does it take to do a regression analysis? <em>Multivariate Behavioral Research, 26</em>(3), 499–510. https://doi.org/10.1207/s15327906mbr2603_7</li>
<li>O'Brien, R. M. (2007). A caution regarding rules of thumb for variance inflation factors. <em>Quality &amp; Quantity, 41</em>(5), 673–690. https://doi.org/10.1007/s11135-006-9018-6</li>
</ul>
