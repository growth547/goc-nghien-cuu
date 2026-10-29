---
title: "Cronbach's alpha là gì? Cách đọc kết quả SPSS từng bảng"
description: "Cronbach's alpha là gì, ngưỡng bao nhiêu là đạt, cách đọc bảng SPSS: alpha tổng, Corrected Item-Total Correlation dưới 0,3, Cronbach's Alpha if Item Deleted."
pubDatetime: 2026-10-29T18:00:00+07:00
featured: false
tags: ["độ tin cậy","SPSS"]
---

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

<h2>Chạy Cronbach's alpha trong SPSS</h2>
<ol>
<li>Vào <code>Analyze &gt; Scale &gt; Reliability Analysis</code>.</li>
<li>Đưa các câu của <strong>một</strong> thang đo vào ô Items. Mỗi khái niệm chạy một lần riêng.</li>
<li>Ô Model để <code>Alpha</code>.</li>
<li>Bấm <code>Statistics</code>, tích <code>Scale if item deleted</code> trong mục Descriptives for.</li>
<li>Bấm <code>Continue</code> rồi <code>OK</code>.</li>
</ol>
<p>Trước khi chạy, chắc chắn các câu đảo chiều đã được mã hoá lại (thang 5 mức: 6 − giá trị cũ). Cách làm có trong bài <a href="/goc-nghien-cuu/posts/thang-do-likert/">thang đo Likert 5 mức, 7 mức</a>.</p>

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
<li><strong>Alpha cao do phiếu rập khuôn.</strong> Phiếu chọn cùng một mức cho cả khối làm các câu tương quan cao giả tạo. Lọc phiếu trước, xem bài <a href="/goc-nghien-cuu/posts/cach-loc-phieu-khao-sat-khong-hop-le/">cách lọc phiếu khảo sát không hợp lệ</a>.</li>
<li><strong>Chạy trên mẫu thử quá nhỏ rồi kết luận.</strong> Với 20 đến 30 phiếu chạy thử, alpha dao động khá mạnh. Dùng kết quả để phát hiện câu có vấn đề và sửa câu chữ, còn kết luận chính thức dựa trên mẫu đầy đủ.</li>
</ul>

<h2>Câu mẫu khi viết vào chương 4</h2>
<blockquote>Thang đo Sự hài lòng ban đầu gồm 5 biến quan sát, có hệ số Cronbach's alpha 0,748. Biến HL4 có hệ số tương quan biến tổng 0,147, nhỏ hơn 0,3, nên bị loại. Sau khi loại HL4, hệ số Cronbach's alpha của thang đo là 0,822 và các biến còn lại có hệ số tương quan biến tổng từ 0,600 đến 0,673, đạt yêu cầu về độ tin cậy.</blockquote>
<p>Không có SPSS trong tay, hoặc muốn kiểm tra nhanh dữ liệu chạy thử? Dán dữ liệu vào <a href="/goc-nghien-cuu/cong-cu/cronbach-alpha/">công cụ tính Cronbach's alpha</a> để có alpha tổng, tương quan biến tổng và alpha nếu loại biến cho từng câu, đúng như hai cột bạn vừa học cách đọc ở trên.</p>
