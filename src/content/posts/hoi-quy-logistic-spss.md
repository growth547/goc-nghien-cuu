---
title: "Hồi quy logistic SPSS: cách chạy và đọc kết quả"
description: "Hồi quy logistic nhị phân trong SPSS: thiết lập, đọc Omnibus, Hosmer-Lemeshow, Nagelkerke R², Exp(B), bảng phân loại, cỡ mẫu theo số biến cố, câu mẫu chương 4."
pubDatetime: 2026-10-30T17:30:00+07:00
featured: false
tags: ["SPSS","phân tích dữ liệu","khoá luận"]
---

<p><strong>Hồi quy logistic nhị phân (binary logistic regression) dùng khi biến phụ thuộc chỉ có hai giá trị, như có/không ý định khởi nghiệp, đã/chưa mua, nghỉ việc/ở lại; mô hình ước lượng xác suất xảy ra sự kiện qua log của tỉ số odds.</strong> Trong SPSS, đọc kết quả theo thứ tự: Omnibus Tests (mô hình có ý nghĩa khi Sig. &lt; 0,05), Hosmer-Lemeshow (mô hình phù hợp khi Sig. &gt; 0,05), Nagelkerke R² (mức giải thích tương đối), bảng phân loại, rồi bảng Variables in the Equation với Exp(B) là tỉ số odds của từng biến. Cỡ mẫu nên có ít nhất khoảng 10 sự kiện (nhóm ít hơn) cho mỗi biến độc lập (Peduzzi và cộng sự, 1996).</p>

<p>Bài này đi qua từng hộp thoại và từng bảng kết quả với một bộ số liệu mô phỏng (tạo bằng Python, không phải dữ liệu khảo sát thật), kèm cách diễn giải Exp(B) đúng và câu mẫu cho chương 4.</p>

<h2>Khi nào dùng hồi quy logistic thay cho hồi quy tuyến tính</h2>
<p>Nếu mã hoá biến phụ thuộc 0/1 rồi chạy hồi quy tuyến tính, giá trị dự đoán có thể nhỏ hơn 0 hoặc lớn hơn 1, phần dư không thể phân phối chuẩn và phương sai chắc chắn thay đổi. Hồi quy logistic giải quyết bằng cách mô hình hoá:</p>
<p><code>ln[p / (1 − p)] = B₀ + B₁X₁ + B₂X₂ + … + BₖXₖ</code></p>
<p>Vế trái là log odds (logit). Odds = p / (1 − p): xác suất 0,20 tương ứng odds 0,25 (1 người có trên 4 người không). Hệ số B là mức thay đổi của log odds khi X tăng 1 đơn vị; Exp(B) là số lần odds được nhân lên. Hosmer và cộng sự (2013) là giáo trình chuẩn cho phương pháp này.</p>
<ul>
<li><strong>Biến phụ thuộc hai giá trị</strong>: binary logistic (bài này).</li>
<li><strong>Nhiều giá trị không thứ bậc</strong> (chọn ngân hàng A, B hay C): Multinomial Logistic.</li>
<li><strong>Nhiều giá trị có thứ bậc</strong>: Ordinal (PLUM). Thang Likert của một câu đơn lẻ có thể vào đây, nhưng điểm trung bình của thang đo nhiều câu thường dùng hồi quy tuyến tính.</li>
</ul>
<p>Nếu chưa chắc phương pháp nào hợp với dữ liệu của bạn, <a href="/cong-cu/chon-phuong-phap/">công cụ chọn phương pháp phân tích</a> hỏi loại biến và mục tiêu rồi gợi ý kèm nguồn.</p>

<h2>Cỡ mẫu: quy tắc số biến cố trên mỗi biến (EPV)</h2>
<p>Với logistic, điều quyết định không phải tổng số phiếu mà là số trường hợp ở <strong>nhóm ít hơn</strong> của biến phụ thuộc (gọi là số biến cố, events). EPV = số biến cố / số biến độc lập (tính cả từng biến giả).</p>
<ul>
<li>Peduzzi và cộng sự (1996) mô phỏng và thấy EPV dưới 10 làm hệ số bị chệch và khoảng tin cậy sai; từ đó có quy tắc "10 biến cố mỗi biến".</li>
<li>Vittinghoff và McCulloch (2007) cho thấy EPV từ 5 đến 9 thường vẫn cho kết quả chấp nhận được, nên quy tắc 10 không phải ranh giới cứng.</li>
</ul>
<p>Ví dụ: khảo sát 400 sinh viên, chỉ 107 người có ý định khởi nghiệp. Mô hình 4 biến độc lập có EPV = 107 / 4 = 26,8, đủ. Nếu chỉ có 30 người có ý định, mô hình 4 biến có EPV = 7,5, nằm ở vùng cần thận trọng và nên giảm số biến. Cỡ mẫu cho các phương pháp khác có ở bài <a href="/posts/co-mau-nghien-cuu-bao-nhieu-la-du/">cỡ mẫu bao nhiêu là đủ</a> và <a href="/cong-cu/tinh-co-mau/">công cụ tính cỡ mẫu</a>.</p>

<h2>Bộ dữ liệu ví dụ</h2>
<p>400 sinh viên (dữ liệu mô phỏng). Biến phụ thuộc YD: có ý định khởi nghiệp trong 3 năm tới (1 = có, 0 = không); 107 người trả lời có. Biến độc lập: thái độ đối với khởi nghiệp (TD, điểm trung bình thang Likert 5 mức), chuẩn chủ quan (CCQ, Likert 5 mức), giới tính nam (NAM, 1 = nam), từng đi làm thêm (LT, 1 = có). Khung lý thuyết là <a href="/posts/mo-hinh-tpb-thuyet-hanh-vi-co-ke-hoach/">thuyết hành vi có kế hoạch (TPB)</a>, thang đo lấy từ <a href="/thang-do/tpb/">bộ thang đo TPB</a>.</p>

<h2>Thiết lập trong SPSS</h2>
<p>Vào <strong>Analyze → Regression → Binary Logistic</strong>.</p>
<ol>
<li><strong>Dependent</strong>: YD. <strong>Covariates</strong>: TD, CCQ, NAM, LT. <strong>Method</strong>: Enter.</li>
<li><strong>Categorical</strong>: đưa các biến định tính vào Categorical Covariates. Mặc định SPSS lấy nhóm cuối (Last) làm nhóm tham chiếu; nếu biến mã 0/1 và bạn muốn so sánh nhóm 1 với nhóm 0, chọn Reference Category: First rồi bấm Change. Biến 0/1 cũng có thể để nguyên như biến định lượng, kết quả giống hệt.</li>
<li><strong>Options</strong>: tích Classification plots, Hosmer-Lemeshow goodness-of-fit, CI for exp(B) 95%. Classification cutoff để mặc định 0,5.</li>
<li><strong>Save</strong> (tuỳ chọn): Probabilities để lưu xác suất dự đoán, dùng vẽ đường ROC.</li>
</ol>
<p>Kiểm tra bảng <em>Dependent Variable Encoding</em> đầu kết quả: SPSS mô hình hoá xác suất của giá trị mã hoá nội bộ là 1. Nếu biến của bạn mã 1/2, SPSS tự chuyển 2 thành 1; hãy chắc chắn "1 nội bộ" đúng là nhóm "có sự kiện", nếu không mọi dấu hệ số sẽ đảo ngược.</p>

<h2>Block 0: mô hình chưa có biến</h2>
<p>Block 0 chỉ có hằng số: mọi người được dự đoán thuộc nhóm đông hơn. Bảng Classification Table của Block 0 cho tỉ lệ đúng 73,3% (293 / 400 người không có ý định). Đây là mốc để so sánh: mô hình có biến phải dự đoán tốt hơn 73,3% mới có giá trị phân loại. Phần còn lại của Block 0 ít khi cần báo cáo.</p>

<h2>Omnibus Tests of Model Coefficients</h2>
<table>
<thead><tr><th></th><th>Chi-square</th><th>df</th><th>Sig.</th></tr></thead>
<tbody>
<tr><td>Step</td><td>74,50</td><td>4</td><td>&lt; 0,001</td></tr>
<tr><td>Block</td><td>74,50</td><td>4</td><td>&lt; 0,001</td></tr>
<tr><td>Model</td><td>74,50</td><td>4</td><td>&lt; 0,001</td></tr>
</tbody>
</table>
<p>Đây là kiểm định tỉ số khả năng (likelihood ratio), tương đương kiểm định F của hồi quy tuyến tính: ít nhất một biến độc lập có tác động. Chi-square = −2LL của mô hình chỉ có hằng số trừ −2LL của mô hình đủ: 464,61 − 390,10 = 74,50, bậc tự do bằng số biến (4). Sig. &lt; 0,05 nên mô hình có ý nghĩa. Với Method Enter và một block, ba dòng bằng nhau.</p>

<h2>Model Summary: −2LL, Cox &amp; Snell và Nagelkerke R²</h2>
<table>
<thead><tr><th>−2 Log likelihood</th><th>Cox &amp; Snell R Square</th><th>Nagelkerke R Square</th></tr></thead>
<tbody><tr><td>390,10</td><td>0,170</td><td>0,247</td></tr></tbody>
</table>
<ul>
<li><strong>−2 Log likelihood</strong> càng nhỏ mô hình càng khớp, nhưng con số này không có thang tuyệt đối; nó chỉ dùng để so sánh các mô hình lồng nhau.</li>
<li><strong>Cox &amp; Snell R²</strong> = 1 − exp[(2/n)(LL₀ − LL)] không bao giờ đạt tới 1, kể cả với mô hình hoàn hảo.</li>
<li><strong>Nagelkerke R²</strong> chia Cox &amp; Snell cho giá trị tối đa có thể đạt, để thang chạy từ 0 đến 1 (Nagelkerke, 1991). Đây là con số hay được báo cáo: 0,247.</li>
</ul>
<p>Cả hai là "pseudo R²", không phải tỉ lệ phương sai được giải thích như R² của hồi quy tuyến tính. Đừng viết "mô hình giải thích 24,7% biến thiên"; viết "Nagelkerke R² = 0,247" và để nó đứng như một chỉ số so sánh tương đối. Pseudo R² của logistic thường thấp hơn nhiều so với R² tuyến tính trên cùng dữ liệu; thảo luận về mốc R² có ở bài <a href="/posts/r-binh-phuong-hieu-chinh/">R bình phương hiệu chỉnh</a>.</p>

<h2>Hosmer and Lemeshow Test</h2>
<table>
<thead><tr><th>Chi-square</th><th>df</th><th>Sig.</th></tr></thead>
<tbody><tr><td>8,14</td><td>8</td><td>0,420</td></tr></tbody>
</table>
<p>Kiểm định chia mẫu thành khoảng 10 nhóm theo xác suất dự đoán, rồi so số sự kiện quan sát với số kỳ vọng trong mỗi nhóm (Hosmer &amp; Lemeshow, 1980). Giả thuyết H₀ là mô hình phù hợp, nên ở đây <strong>muốn Sig. lớn hơn 0,05</strong>, ngược với các kiểm định khác. Sig. = 0,420 nên không có bằng chứng mô hình kém phù hợp. Cách SPSS chia nhóm khi có xác suất trùng nhau có thể khác một chút, nên số của bạn có thể lệch nhẹ nếu tự tính lại.</p>
<p>Hai lưu ý: với mẫu rất lớn (hàng nghìn), kiểm định gần như luôn bác bỏ dù mô hình chỉ lệch rất nhẹ (Paul và cộng sự, 2013); với mẫu nhỏ, kiểm định có ít khả năng phát hiện mô hình kém. Vì vậy đừng coi Hosmer-Lemeshow là tiêu chí duy nhất.</p>

<h2>Classification Table</h2>
<table>
<thead><tr><th rowspan="2">Quan sát</th><th colspan="2">Dự đoán</th><th rowspan="2">% đúng</th></tr>
<tr><th>Không (0)</th><th>Có (1)</th></tr></thead>
<tbody>
<tr><td>Không (0)</td><td>268</td><td>25</td><td>91,5</td></tr>
<tr><td>Có (1)</td><td>74</td><td>33</td><td>30,8</td></tr>
<tr><td>Tổng</td><td></td><td></td><td>75,3</td></tr>
</tbody>
</table>
<p>Tỉ lệ đúng chung 75,3%, chỉ cao hơn mốc 73,3% của Block 0 một chút. Nhìn từng dòng: mô hình nhận ra 91,5% người không có ý định (độ đặc hiệu) nhưng chỉ 30,8% người có ý định (độ nhạy). Đây là chuyện bình thường khi nhóm sự kiện chiếm thiểu số và ngưỡng phân loại là 0,5. Hạ ngưỡng xuống 0,3 (trong Options), độ nhạy tăng lên 69,2% (74/107) và độ đặc hiệu giảm còn 74,4% (218/293).</p>
<p>Một chỉ số không phụ thuộc ngưỡng là diện tích dưới đường ROC (AUC): lưu xác suất dự đoán (Save → Probabilities), rồi Analyze → Classify → ROC Curve. Dữ liệu ví dụ có AUC = 0,774: chọn ngẫu nhiên một người có ý định và một người không, mô hình xếp người có ý định cao hơn trong 77,4% trường hợp. Với khoá luận kiểm định giả thuyết, bảng phân loại và AUC là thông tin bổ sung; trọng tâm vẫn là bảng hệ số dưới đây.</p>

<h2>Variables in the Equation: đọc B, Wald và Exp(B)</h2>
<table>
<thead><tr><th>Biến</th><th>B</th><th>S.E.</th><th>Wald</th><th>df</th><th>Sig.</th><th>Exp(B)</th><th>95% CI cho Exp(B)</th></tr></thead>
<tbody>
<tr><td>TD</td><td>0,922</td><td>0,212</td><td>18,93</td><td>1</td><td>&lt; 0,001</td><td>2,515</td><td>1,660 – 3,810</td></tr>
<tr><td>CCQ</td><td>0,523</td><td>0,181</td><td>8,32</td><td>1</td><td>0,004</td><td>1,687</td><td>1,182 – 2,406</td></tr>
<tr><td>NAM</td><td>0,102</td><td>0,251</td><td>0,17</td><td>1</td><td>0,684</td><td>1,107</td><td>0,678 – 1,810</td></tr>
<tr><td>LT</td><td>1,150</td><td>0,254</td><td>20,44</td><td>1</td><td>&lt; 0,001</td><td>3,158</td><td>1,918 – 5,199</td></tr>
<tr><td>Constant</td><td>−6,551</td><td>0,829</td><td>62,45</td><td>1</td><td>&lt; 0,001</td><td>0,001</td><td></td></tr>
</tbody>
</table>
<ul>
<li><strong>Wald = (B / S.E.)²</strong>: (0,922 / 0,212)² = 18,9. So với phân phối chi-square 1 bậc tự do, cho Sig.</li>
<li><strong>Dấu của B</strong> cho chiều tác động: B dương thì biến tăng làm xác suất sự kiện tăng.</li>
<li><strong>Exp(B) của TD = 2,515</strong>: thái độ tăng 1 điểm thì <em>odds</em> có ý định khởi nghiệp nhân lên 2,515 lần (tăng 151,5%), khi các biến khác giữ nguyên.</li>
<li><strong>Exp(B) của LT = 3,158</strong>: sinh viên từng đi làm thêm có odds có ý định gấp 3,16 lần sinh viên chưa đi làm, cùng thái độ, chuẩn chủ quan và giới tính.</li>
<li><strong>NAM</strong>: Sig. = 0,684 và khoảng tin cậy 0,678 – 1,810 chứa 1, nên không có khác biệt có ý nghĩa giữa nam và nữ. Quy tắc đọc nhanh: khoảng tin cậy của Exp(B) chứa 1 thì không có ý nghĩa ở mức 5%.</li>
<li>Exp(B) nhỏ hơn 1 nghĩa là biến làm giảm odds; Exp(B) = 0,60 là odds giảm 40%.</li>
</ul>
<h3>Odds khác xác suất: lỗi diễn giải hay gặp nhất</h3>
<p>Viết "thái độ tăng 1 điểm thì xác suất khởi nghiệp tăng 2,5 lần" là sai. Exp(B) nhân odds, không nhân xác suất. Lấy một sinh viên nữ, chưa đi làm thêm, chuẩn chủ quan 3,2:</p>
<ul>
<li>Thái độ = 3: logit = −6,551 + 0,922 × 3 + 0,523 × 3,2 = −2,111, xác suất = 1 / (1 + e<sup>2,111</sup>) = 0,108.</li>
<li>Thái độ = 4: logit = −1,189, xác suất = 0,233.</li>
</ul>
<p>Odds tăng đúng 2,515 lần (0,121 lên 0,304), nhưng xác suất tăng từ 10,8% lên 23,3%, tức 12,5 điểm phần trăm. Ở vùng xác suất khác, cùng 1 điểm thái độ sẽ làm xác suất thay đổi một lượng khác; đó là bản chất phi tuyến của logistic.</p>

<h2>Hồi quy logistic đơn biến và đa biến</h2>
<p>Trong nghiên cứu y tế, "logistic đơn biến" là mô hình chỉ có một biến độc lập (cho OR thô, crude OR), "đa biến" là mô hình có nhiều biến cùng lúc (cho OR hiệu chỉnh, adjusted OR). Hai con số có thể khác nhau nhiều. Trong dữ liệu ví dụ, OR thô của thái độ là 3,01, giảm còn 2,515 khi kiểm soát chuẩn chủ quan và các biến khác, vì một phần tác động của thái độ đi cùng chuẩn chủ quan. Bảng kết quả kiểu y tế thường đặt OR thô và OR hiệu chỉnh cạnh nhau. Kết luận dựa trên OR hiệu chỉnh.</p>
<p>Đa cộng tuyến vẫn là vấn đề trong logistic. SPSS không in VIF trong hộp thoại Binary Logistic; chạy Linear Regression với cùng bộ biến độc lập (biến phụ thuộc nào cũng được) để lấy VIF, xem bài <a href="/posts/he-so-vif-da-cong-tuyen/">hệ số VIF và đa cộng tuyến</a>.</p>

<h2>Câu mẫu viết vào chương 4</h2>
<blockquote><p>Hồi quy logistic nhị phân được sử dụng để kiểm định tác động của các yếu tố đến ý định khởi nghiệp của sinh viên (n = 400; 107 sinh viên có ý định). Mô hình có ý nghĩa thống kê (χ²(4) = 74,50; p &lt; 0,001), kiểm định Hosmer-Lemeshow cho thấy mô hình phù hợp với dữ liệu (χ²(8) = 8,14; p = 0,420), Nagelkerke R² = 0,247 và mô hình phân loại đúng 75,3% trường hợp. Thái độ đối với khởi nghiệp (OR = 2,52; KTC 95%: 1,66 – 3,81; p &lt; 0,001), chuẩn chủ quan (OR = 1,69; KTC 95%: 1,18 – 2,41; p = 0,004) và kinh nghiệm làm thêm (OR = 3,16; KTC 95%: 1,92 – 5,20; p &lt; 0,001) làm tăng odds có ý định khởi nghiệp; H1, H2 và H4 được ủng hộ. Không có khác biệt có ý nghĩa thống kê theo giới tính (OR = 1,11; p = 0,684); H3 không được ủng hộ.</p></blockquote>
<p>Bố cục toàn chương có ở bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4</a>.</p>

<h2>Lỗi thường gặp</h2>
<ul>
<li><strong>Diễn giải Exp(B) như tỉ lệ xác suất</strong> (xem ví dụ trên).</li>
<li><strong>Đọc ngược Hosmer-Lemeshow</strong>: Sig. &lt; 0,05 mới là dấu hiệu kém phù hợp.</li>
<li><strong>Báo cáo Nagelkerke R² như phần trăm phương sai được giải thích.</strong></li>
<li><strong>Quên kiểm tra mã hoá biến phụ thuộc</strong>, khiến mọi hệ số đổi dấu.</li>
<li><strong>Chọn nhóm tham chiếu không hợp lý</strong> cho biến định tính nhiều nhóm (ví dụ nhóm có 5 người).</li>
<li><strong>Quá nhiều biến so với số biến cố</strong>: EPV thấp cho hệ số và Exp(B) rất lớn, khoảng tin cậy rộng bất thường. S.E. lớn bất thường (ví dụ trên 5) là dấu hiệu tách biệt hoàn toàn hoặc ô trống.</li>
</ul>

<h2>Câu hỏi thường gặp</h2>
<h3>Cách đọc kết quả hồi quy logistic trong SPSS theo thứ tự nào?</h3>
<p>Dependent Variable Encoding (kiểm tra mã hoá) → Omnibus Tests (Sig. &lt; 0,05) → Model Summary (Nagelkerke R²) → Hosmer and Lemeshow (Sig. &gt; 0,05) → Classification Table (so với Block 0) → Variables in the Equation (dấu B, Sig., Exp(B) và khoảng tin cậy).</p>
<h3>Nagelkerke R² bao nhiêu là tốt?</h3>
<p>Không có ngưỡng được chấp nhận chung. Pseudo R² của logistic thường thấp; 0,2 đến 0,4 rất thường gặp trong nghiên cứu hành vi. Báo cáo kèm Omnibus, Hosmer-Lemeshow và tỉ lệ phân loại, so với nghiên cứu cùng chủ đề.</p>
<h3>Hosmer-Lemeshow có Sig. nhỏ hơn 0,05 thì phải làm sao?</h3>
<p>Kiểm tra quan hệ phi tuyến của biến định lượng (thử thêm bình phương hoặc chia nhóm), biến tương tác bị bỏ sót và các quan sát ngoại lai. Nếu mẫu rất lớn, lệch nhỏ cũng có thể cho Sig. thấp (Paul và cộng sự, 2013); nêu điều này kèm AUC và bảng phân loại.</p>
<h3>Hồi quy logistic cần bao nhiêu mẫu?</h3>
<p>Tính theo nhóm ít hơn của biến phụ thuộc: khoảng 10 trường hợp cho mỗi biến độc lập (Peduzzi và cộng sự, 1996), có thể chấp nhận 5 đến 9 với thận trọng (Vittinghoff &amp; McCulloch, 2007). 8 biến độc lập cần khoảng 80 người ở nhóm ít hơn.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Hosmer, D. W., &amp; Lemeshow, S. (1980). Goodness of fit tests for the multiple logistic regression model. <em>Communications in Statistics: Theory and Methods, 9</em>(10), 1043–1069. https://doi.org/10.1080/03610928008827941</li>
<li>Hosmer, D. W., Jr., Lemeshow, S., &amp; Sturdivant, R. X. (2013). <em>Applied logistic regression</em> (3rd ed.). Wiley. https://doi.org/10.1002/9781118548387</li>
<li>Nagelkerke, N. J. D. (1991). A note on a general definition of the coefficient of determination. <em>Biometrika, 78</em>(3), 691–692. https://doi.org/10.1093/biomet/78.3.691</li>
<li>Paul, P., Pennell, M. L., &amp; Lemeshow, S. (2013). Standardizing the power of the Hosmer–Lemeshow goodness of fit test in large data sets. <em>Statistics in Medicine, 32</em>(1), 67–80. https://doi.org/10.1002/sim.5525</li>
<li>Peduzzi, P., Concato, J., Kemper, E., Holford, T. R., &amp; Feinstein, A. R. (1996). A simulation study of the number of events per variable in logistic regression analysis. <em>Journal of Clinical Epidemiology, 49</em>(12), 1373–1379. https://doi.org/10.1016/S0895-4356(96)00236-3</li>
<li>Vittinghoff, E., &amp; McCulloch, C. E. (2007). Relaxing the rule of ten events per variable in logistic and Cox regression. <em>American Journal of Epidemiology, 165</em>(6), 710–718. https://doi.org/10.1093/aje/kwk052</li>
</ul>
