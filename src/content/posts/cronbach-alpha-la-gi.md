---
title: "Cronbach's alpha là gì, bao nhiêu là đạt? Cách đọc bảng SPSS"
description: "Cronbach's alpha là gì, bao nhiêu là đạt (0,6 hay 0,7), cách đọc từng bảng SPSS, khi nào loại câu, alpha khác omega và CR ra sao, kèm câu mẫu chương 4."
pubDatetime: 2026-10-29T05:00:00+07:00
modDatetime: 2026-10-30T02:23:14+07:00
featured: false
tags: ["độ tin cậy","SPSS"]
---

<p>Cronbach's alpha là hệ số đo độ nhất quán nội tại của một thang đo nhiều câu hỏi: các câu cùng đo một khái niệm thì câu trả lời phải đi cùng chiều nhau. Mốc được trích nhiều nhất là 0,7 (Nunnally, 1978), có thể chấp nhận 0,6 trong nghiên cứu khám phá (Hair và cộng sự, 2010). Muốn tính ngay không cần SPSS, dùng <a href="/cong-cu/cronbach-alpha/">công cụ tính Cronbach's alpha online</a>.</p>

<p>Chạy xong Cronbach's alpha trong SPSS, bạn nhận được ba bảng với hàng chục con số. Phần lớn sinh viên chỉ nhìn một số duy nhất là alpha tổng có trên 0,7 không, rồi bỏ qua bảng quan trọng nhất là bảng Item-Total Statistics. Bài này giải thích alpha đo cái gì, cách chạy, cách đọc từng bảng, và khi nào nên loại một câu hỏi.</p>

<h2>Cronbach's alpha đo cái gì</h2>
<p>Cronbach's alpha, do Lee Cronbach công bố năm 1951 trên tạp chí Psychometrika, đo độ nhất quán nội tại của một thang đo: các câu hỏi cùng đo một khái niệm có biến thiên cùng nhau hay không. Nếu một người đồng ý cao với câu "Tôi hài lòng với dịch vụ" thì cũng nên đồng ý cao với "Tôi sẽ giới thiệu dịch vụ cho người khác". Khi các câu đi cùng chiều như vậy trên toàn mẫu, alpha cao.</p>
<p>Công thức:</p>
<p><code>α = k / (k − 1) × (1 − Σσᵢ² / σₜ²)</code></p>
<ul>
<li><strong>k</strong>: số câu trong thang đo.</li>
<li><strong>Σσᵢ²</strong>: tổng phương sai của từng câu.</li>
<li><strong>σₜ²</strong>: phương sai của điểm tổng (cộng tất cả các câu lại).</li>
</ul>
<p>Ví dụ tính tay: thang đo 4 câu, tổng phương sai từng câu là 3,2, phương sai của điểm tổng là 8,0. Ta có 3,2 / 8,0 = 0,4; 1 − 0,4 = 0,6; k / (k − 1) = 4 / 3; α = 4 / 3 × 0,6 = 0,80.</p>
<p>Trực giác: khi các câu tương quan dương với nhau, phương sai điểm tổng lớn hơn nhiều so với tổng phương sai từng câu, tỉ số nhỏ lại và alpha tăng. Khi các câu không liên quan nhau, hai đại lượng xấp xỉ bằng nhau và alpha tiến về 0.</p>
<p>Hai điều alpha không cho bạn biết. Alpha cao chưa chứng minh thang đo chỉ đo một khái niệm duy nhất; việc đó cần EFA. Và alpha tăng theo số câu, nên thang đo 12 câu dễ đạt alpha cao dù các câu chỉ tương quan vừa phải.</p>

<h2>Ngưỡng alpha bao nhiêu là đạt</h2>
<p>Mốc được trích nhiều nhất là 0,7 theo Nunnally (1978, <em>Psychometric Theory</em>). Hair và cộng sự (2010) coi 0,7 là mức thường được chấp nhận và cho biết có thể hạ xuống 0,6 trong nghiên cứu khám phá. Cách đọc phổ biến trong khoá luận:</p>
<table>
<thead>
<tr><th>Giá trị alpha</th><th>Cách đọc thường dùng</th><th>Việc nên làm</th></tr>
</thead>
<tbody>
<tr><td>Trên 0,95</td><td>Rất cao</td><td>Xem lại có câu nào lặp ý gần như nguyên văn không</td></tr>
<tr><td>0,8 đến 0,95</td><td>Tốt</td><td>Giữ, kiểm tra bảng Item-Total như bình thường</td></tr>
<tr><td>0,7 đến dưới 0,8</td><td>Chấp nhận được</td><td>Giữ, xem có câu nào kéo alpha xuống không</td></tr>
<tr><td>0,6 đến dưới 0,7</td><td>Chấp nhận trong nghiên cứu khám phá</td><td>Giải thích rõ, ưu tiên xem xét loại câu yếu</td></tr>
<tr><td>Dưới 0,6</td><td>Không đạt</td><td>Kiểm tra mã hoá câu đảo chiều, xem lại nội dung câu hỏi</td></tr>
</tbody>
</table>
<p>Mốc 0,7 của Nunnally thực ra gắn với mục đích sử dụng. Lance và cộng sự (2006) đọc lại sách gốc và chỉ ra rằng Nunnally (1978) đề nghị khoảng 0,7 cho giai đoạn đầu của một hướng nghiên cứu, 0,8 cho nghiên cứu cơ bản, và từ 0,9 trở lên khi điểm số được dùng để ra quyết định về từng cá nhân (ví dụ tuyển dụng, chẩn đoán). Khoá luận khảo sát thái độ, hành vi thuộc nhóm đầu, nên 0,7 là mốc hợp lý; nhưng đừng viết "Nunnally cho rằng 0,7 là đủ cho mọi trường hợp".</p>

<p>Ngưỡng của alpha và các chỉ số đi kèm (CR, AVE, KMO, HTMT) cùng nguồn gốc từng con số được tổng hợp ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận các chỉ số trong luận văn định lượng</a>. Nếu alpha của bạn dưới 0,6 hoặc có tương quan biến–tổng âm, <a href="/cong-cu/bac-si-ket-qua/">bác sĩ kết quả</a> chỉ ra thứ tự kiểm tra và những cách xử lý hội đồng chấp nhận.</p>

<h2>Chạy Cronbach's alpha trong SPSS</h2>
<ol>
<li>Vào <code>Analyze &gt; Scale &gt; Reliability Analysis</code>.</li>
<li>Đưa các câu của <strong>một</strong> thang đo vào ô Items. Mỗi khái niệm chạy một lần riêng.</li>
<li>Ô Model để <code>Alpha</code>.</li>
<li>Bấm <code>Statistics</code>, tích <code>Scale if item deleted</code> trong mục Descriptives for.</li>
<li>Bấm <code>Continue</code> rồi <code>OK</code>.</li>
</ol>
<p>Trước khi chạy, chắc chắn các câu đảo chiều đã được mã hoá lại (thang 5 mức: 6 − giá trị cũ). Cách làm có trong bài <a href="/posts/thang-do-likert/">thang đo Likert 5 mức, 7 mức</a>, còn cách đặt tên biến và ghi câu đảo chiều vào bảng mã hoá có ở bài <a href="/posts/bang-ma-hoa-thang-do/">bảng mã hoá thang đo</a>.</p>

<h2>Đọc bảng Reliability Statistics</h2>
<p>Bảng này có ba cột: <code>Cronbach's Alpha</code>, <code>Cronbach's Alpha Based on Standardized Items</code> và <code>N of Items</code>. Số bạn báo cáo là cột đầu tiên. Cột thứ hai tính trên dữ liệu chuẩn hoá; với thang Likert cùng số mức, hai số thường rất gần nhau. N of Items là số câu, kiểm tra lại cho khớp với số câu bạn định đưa vào.</p>
<p>Bảng Case Processing Summary phía trên cho biết bao nhiêu phiếu được dùng. SPSS mặc định loại phiếu thiếu bất kỳ câu nào trong thang đo, nên nếu số Valid thấp hơn cỡ mẫu, bạn có dữ liệu thiếu cần xử lý.</p>

<h2>Đọc bảng Item-Total Statistics</h2>
<p>Đây là bảng quyết định có loại câu nào hay không. Hai cột cần đọc kỹ:</p>
<ul>
<li><strong>Corrected Item-Total Correlation:</strong> tương quan giữa một câu và tổng các câu còn lại. Quy ước phổ biến là câu có giá trị dưới 0,3 được xem là đóng góp yếu vào thang đo.</li>
<li><strong>Cronbach's Alpha if Item Deleted:</strong> alpha của thang đo nếu bỏ câu đó. Nếu số này cao hơn alpha tổng một cách rõ rệt, bỏ câu đó làm thang đo nhất quán hơn.</li>
</ul>
<p>Ví dụ minh hoạ với thang đo "Sự hài lòng" gồm 5 câu, 200 phiếu, alpha tổng = 0,748:</p>
<table>
<thead>
<tr><th>Câu</th><th>Corrected Item-Total Correlation</th><th>Cronbach's Alpha if Item Deleted</th></tr>
</thead>
<tbody>
<tr><td>HL1</td><td>0,612</td><td>0,667</td></tr>
<tr><td>HL2</td><td>0,580</td><td>0,679</td></tr>
<tr><td>HL3</td><td>0,644</td><td>0,651</td></tr>
<tr><td>HL4</td><td>0,147</td><td>0,822</td></tr>
<tr><td>HL5</td><td>0,628</td><td>0,661</td></tr>
</tbody>
</table>
<p>Cách đọc: alpha tổng 0,748 đã vượt 0,7, nhưng HL4 có tương quan biến tổng 0,147, dưới mốc 0,3. Nếu bỏ HL4, alpha tăng lên 0,822. Bốn câu còn lại đều có tương quan biến tổng trên 0,5 và nếu bỏ bất kỳ câu nào trong số đó thì alpha đều giảm so với 0,748. Kết luận: cân nhắc loại HL4.</p>
<p>Sau khi loại HL4 và chạy lại, alpha của 4 câu còn lại là 0,822; tương quan biến tổng lần lượt là 0,639; 0,600; 0,673; 0,670, đều trên 0,3; alpha nếu loại từng câu nằm trong khoảng 0,763 đến 0,796, đều thấp hơn 0,822. Thang đo dừng ở đây.</p>

<h2>Alpha, omega hay độ tin cậy tổng hợp (CR)?</h2>
<p>Alpha giả định mọi câu trong thang đo có hệ số tải lên khái niệm bằng nhau (giả định tau tương đương). Thang đo thực tế hiếm khi như vậy: có câu tải 0,85, có câu tải 0,6. Khi hệ số tải chênh nhau, alpha thường ước lượng thấp hơn độ tin cậy thật. Vì vậy nhiều tác giả khuyên báo cáo thêm, hoặc thay bằng, hệ số dựa trên hệ số tải (Dunn và cộng sự, 2014; Hayes &amp; Coutts, 2020).</p>
<table>
<thead>
<tr><th>Hệ số</th><th>Tính từ đâu</th><th>Thường gặp trong</th><th>Ngưỡng hay dùng</th></tr>
</thead>
<tbody>
<tr><td>Cronbach's alpha</td><td>Phương sai từng câu và phương sai điểm tổng</td><td>SPSS, khoá luận chạy EFA và hồi quy</td><td>Từ 0,7</td></tr>
<tr><td>McDonald's omega (ω)</td><td>Hệ số tải và phương sai sai số của mô hình một nhân tố</td><td>JASP, jamovi, gói R psych</td><td>Từ 0,7, đọc như alpha</td></tr>
<tr><td>Độ tin cậy tổng hợp (CR, rho_C)</td><td>Hệ số tải chuẩn hoá từ CFA hoặc PLS-SEM</td><td>AMOS, SmartPLS</td><td>0,70 đến 0,95 (Hair và cộng sự, 2019)</td></tr>
</tbody>
</table>
<p>Với hệ số tải chuẩn hoá λ, omega của mô hình một nhân tố và CR theo Fornell và Larcker (1981) có cùng công thức:</p>
<p><code>CR = (Σλ)² / ((Σλ)² + Σ(1 − λ²))</code></p>
<p>Ví dụ tính tay với 4 câu có hệ số tải 0,75; 0,70; 0,80; 0,72:</p>
<ol>
<li>Σλ = 0,75 + 0,70 + 0,80 + 0,72 = 2,97; bình phương được 8,8209.</li>
<li>Phương sai sai số từng câu là 1 − λ²: 0,4375; 0,51; 0,36; 0,4816; tổng là 1,7891.</li>
<li>CR = 8,8209 / (8,8209 + 1,7891) = 8,8209 / 10,61 = 0,831.</li>
</ol>
<p>Cùng bộ hệ số tải đó, phương sai trích trung bình AVE = (0,5625 + 0,49 + 0,64 + 0,5184) / 4 = 0,553, trên ngưỡng 0,5. Trong SmartPLS, CR hiện ở cột rho_c, kèm rho_a nằm giữa alpha và CR. Nếu khoá luận của bạn chỉ chạy SPSS để làm EFA và hồi quy, alpha vẫn là hệ số hội đồng chờ đợi; nếu chạy CFA hoặc PLS-SEM, hãy báo cáo cả alpha và CR, cộng AVE cho giá trị hội tụ. Bước tiếp theo, giá trị phân biệt, xem ở bài <a href="/posts/htmt-gia-tri-phan-biet/">HTMT là gì</a>.</p>

<p>Với dữ liệu khảo sát thử 20–30 phiếu, đọc alpha thận trọng như hướng dẫn trong bài <a href="/posts/nghien-cuu-so-bo-la-gi/">nghiên cứu sơ bộ là gì</a>.</p>

<h2>Quy trình loại câu hỏi đúng cách</h2>
<ol>
<li><strong>Loại từng câu một.</strong> Loại câu yếu nhất, chạy lại, rồi mới xét tiếp. Các con số thay đổi sau mỗi lần loại.</li>
<li><strong>Xem nội dung trước khi loại.</strong> Câu có tương quan thấp có thể là câu đảo chiều chưa mã hoá lại, câu dịch sai nghĩa, hoặc câu hai ý. Sửa được lỗi thì không cần loại.</li>
<li><strong>Đừng loại chỉ để tăng alpha thêm 0,01.</strong> Nếu alpha đã đạt và câu đó có tương quan biến tổng trên 0,3, mức tăng nhỏ không đáng đánh đổi độ bao phủ nội dung.</li>
<li><strong>Giữ ít nhất 3 câu cho mỗi thang đo.</strong> Thang đo còn 2 câu khó đứng vững khi chạy EFA.</li>
<li><strong>Ghi lại câu bị loại và lý do</strong> để đưa vào chương 4.</li>
</ol>

<h2>Những lỗi hay gặp</h2>
<ul>
<li><strong>Alpha âm.</strong> SPSS hiện cảnh báo giá trị âm do hiệp phương sai trung bình giữa các câu âm. Gần như luôn do có câu đảo chiều chưa mã hoá lại. Tìm câu có Corrected Item-Total Correlation âm.</li>
<li><strong>Chạy alpha cho cả bảng hỏi.</strong> Alpha chỉ có nghĩa khi tính cho các câu cùng đo một khái niệm. Mỗi khái niệm chạy riêng.</li>
<li><strong>Alpha cao do phiếu rập khuôn.</strong> Phiếu chọn cùng một mức cho cả khối làm các câu tương quan cao giả tạo. Lọc phiếu trước, xem bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">cách lọc phiếu khảo sát không hợp lệ</a>.</li>
<li><strong>Chạy trên mẫu thử quá nhỏ rồi kết luận.</strong> Với 20 đến 30 phiếu chạy thử, alpha dao động khá mạnh. Dùng kết quả để phát hiện câu có vấn đề và sửa câu chữ, còn kết luận chính thức dựa trên mẫu đầy đủ.</li>
</ul>

<h2>Câu hỏi thường gặp</h2>
<h3>Alpha 0,6 có được không?</h3>
<p>Được chấp nhận trong nghiên cứu khám phá (Hair và cộng sự, 2010), nhưng bạn phải nói rõ đề tài là khám phá và đã xem bảng Item-Total. Nếu thang đo được lấy nguyên từ một nghiên cứu đã công bố với alpha 0,85 mà của bạn chỉ 0,6, hãy kiểm tra mã hoá câu đảo chiều và bản dịch trước khi viện dẫn lý do "khám phá".</p>
<h3>Thang đo chỉ có 2 câu thì tính gì?</h3>
<p>Với 2 câu, alpha thường thấp và không phải ước lượng tốt. Eisinga và cộng sự (2013) khuyên dùng hệ số Spearman-Brown: <code>ρ = 2r / (1 + r)</code>, với r là tương quan Pearson giữa hai câu. Ví dụ r = 0,55 thì ρ = 1,10 / 1,55 = 0,71. Tốt hơn nữa là tránh thang đo 2 câu ngay từ lúc thiết kế, vì EFA và CFA đều cần từ 3 câu cho mỗi khái niệm.</p>
<h3>Alpha cao trên 0,95 có tốt không?</h3>
<p>Chưa chắc. Alpha rất cao thường do các câu gần như lặp lại nhau (ví dụ "Tôi hài lòng" và "Tôi cảm thấy hài lòng"), hoặc do thang đo quá dài. Xem lại các cặp câu có tương quan trên 0,8 và cân nhắc bỏ một câu thừa.</p>
<h3>Có nên chạy alpha trước hay sau EFA?</h3>
<p>Thông lệ ở khoá luận Việt Nam là chạy alpha trước để loại câu yếu, rồi mới đưa các câu còn lại vào EFA. Nếu EFA làm một câu chuyển sang nhân tố khác hoặc bị loại, chạy lại alpha cho nhân tố đã thay đổi. Cách đọc EFA có ở bài <a href="/posts/cach-doc-ket-qua-efa-spss/">cách đọc kết quả EFA trên SPSS</a>.</p>

<h2>Câu mẫu khi viết vào chương 4</h2>
<blockquote>Thang đo Sự hài lòng ban đầu gồm 5 biến quan sát, có hệ số Cronbach's alpha 0,748. Biến HL4 có hệ số tương quan biến tổng 0,147, nhỏ hơn 0,3, nên bị loại. Sau khi loại HL4, hệ số Cronbach's alpha của thang đo là 0,822 và các biến còn lại có hệ số tương quan biến tổng từ 0,600 đến 0,673, đạt yêu cầu về độ tin cậy.</blockquote>
<p>Không có SPSS trong tay, hoặc muốn kiểm tra nhanh dữ liệu chạy thử? Dán dữ liệu vào <a href="/cong-cu/cronbach-alpha/">công cụ tính Cronbach's alpha</a> để có alpha tổng, tương quan biến tổng và alpha nếu loại biến cho từng câu, đúng như hai cột bạn vừa học cách đọc ở trên. Khi đã có đủ dữ liệu cho mọi thang đo, tải file Excel lên <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát</a>: công cụ chạy alpha cho từng khái niệm cùng lúc, kèm EFA, tương quan, hồi quy và viết sẵn đoạn chương 4 theo đúng mẫu câu ở trên.</p>

<p>Bảng alpha của mọi thang đo nên được gom vào mục 4.2 của chương 4, xem cách trình bày ở bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4 kết quả nghiên cứu</a>. Nếu bạn đang chọn thang đo, mỗi trang trong <a href="/thang-do/">thư viện thang đo</a> có câu hỏi gốc và nguồn trích dẫn để bạn tra alpha mà nghiên cứu gốc đã báo cáo, ví dụ <a href="/thang-do/hai-long-cong-viec/">thang đo hài lòng công việc</a>; định nghĩa khái niệm "sự hài lòng" có ở trang <a href="/khai-niem/su-hai-long-khach-hang/">sự hài lòng của khách hàng</a>.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Cronbach, L. J. (1951). Coefficient alpha and the internal structure of tests. <em>Psychometrika, 16</em>(3), 297–334. https://doi.org/10.1007/BF02310555</li>
<li>Dunn, T. J., Baguley, T., &amp; Brunsden, V. (2014). From alpha to omega: A practical solution to the pervasive problem of internal consistency estimation. <em>British Journal of Psychology, 105</em>(3), 399–412. https://doi.org/10.1111/bjop.12046</li>
<li>Eisinga, R., te Grotenhuis, M., &amp; Pelzer, B. (2013). The reliability of a two-item scale: Pearson, Cronbach, or Spearman-Brown? <em>International Journal of Public Health, 58</em>(4), 637–642. https://doi.org/10.1007/s00038-012-0416-3</li>
<li>Fornell, C., &amp; Larcker, D. F. (1981). Evaluating structural equation models with unobservable variables and measurement error. <em>Journal of Marketing Research, 18</em>(1), 39–50. https://doi.org/10.2307/3151312</li>
<li>Hair, J. F., Black, W. C., Babin, B. J., &amp; Anderson, R. E. (2010). <em>Multivariate data analysis</em> (7th ed.). Pearson.</li>
<li>Hair, J. F., Risher, J. J., Sarstedt, M., &amp; Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review, 31</em>(1), 2–24. https://doi.org/10.1108/EBR-11-2018-0203</li>
<li>Hayes, A. F., &amp; Coutts, J. J. (2020). Use omega rather than Cronbach's alpha for estimating reliability. But… <em>Communication Methods and Measures, 14</em>(1), 1–24. https://doi.org/10.1080/19312458.2020.1718629</li>
<li>Lance, C. E., Butts, M. M., &amp; Michels, L. C. (2006). The sources of four commonly reported cutoff criteria: What did they really say? <em>Organizational Research Methods, 9</em>(2), 202–220. https://doi.org/10.1177/1094428105284919</li>
<li>Nunnally, J. C. (1978). <em>Psychometric theory</em> (2nd ed.). McGraw-Hill.</li>
</ul>
