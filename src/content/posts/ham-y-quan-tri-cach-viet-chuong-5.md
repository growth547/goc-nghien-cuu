---
title: "Hàm ý quản trị là gì? Cách viết chương 5 khoá luận có ví dụ"
description: "Hàm ý quản trị là gì, khác giải pháp ở đâu, cách viết chương 5 dựa trên hệ số hồi quy và điểm trung bình, ma trận ưu tiên IPA, ví dụ và đoạn mẫu."
pubDatetime: 2026-10-30T16:45:00+07:00
featured: false
tags: ["khoá luận","bảo vệ khoá luận"]
---

<p><strong>Hàm ý quản trị (managerial implications) là các đề xuất hành động cho nhà quản lý được rút ra trực tiếp từ kết quả nghiên cứu: yếu tố nào tác động mạnh, đang được đánh giá thấp ở đâu, thì ai nên làm gì để cải thiện.</strong> Một hàm ý tốt luôn có ba phần: phát hiện kèm con số (hệ số hồi quy, điểm trung bình), hành động cụ thể, và đối tượng thực hiện. Hàm ý quản trị thường là mục chính của chương 5, cùng với kết luận, thảo luận, hạn chế và hướng nghiên cứu tiếp theo.</p>

<p>Lỗi phổ biến nhất ở chương 5 là viết những đề xuất ai cũng viết được mà không cần làm nghiên cứu: "doanh nghiệp cần nâng cao chất lượng dịch vụ", "cần quan tâm hơn đến khách hàng". Bài này hướng dẫn cách biến bảng kết quả chương 4 thành hàm ý có căn cứ, kèm một ví dụ đầy đủ và các đoạn mẫu.</p>

<h2>Cấu trúc chương 5</h2>
<table>
<thead>
<tr><th>Mục</th><th>Nội dung</th><th>Câu hỏi mục này trả lời</th></tr>
</thead>
<tbody>
<tr><td>5.1 Kết luận</td><td>Tóm tắt kết quả theo từng mục tiêu, câu hỏi nghiên cứu ở chương 1</td><td>Nghiên cứu tìm được gì?</td></tr>
<tr><td>5.2 Thảo luận kết quả</td><td>So sánh với nghiên cứu trước, giải thích vì sao giống hay khác</td><td>Kết quả có hợp lý không, vì sao?</td></tr>
<tr><td>5.3 Hàm ý quản trị</td><td>Đề xuất hành động cho từng yếu tố, theo thứ tự ưu tiên</td><td>Nhà quản lý nên làm gì?</td></tr>
<tr><td>5.4 Hạn chế và hướng nghiên cứu tiếp theo</td><td>Giới hạn về mẫu, phương pháp, phạm vi; gợi ý cho nghiên cứu sau</td><td>Kết quả nên được tin đến đâu?</td></tr>
</tbody>
</table>
<p>Một số trường gộp 5.1 và 5.2, hoặc tách hàm ý lý thuyết (đóng góp cho học thuật) khỏi hàm ý quản trị. Theo đúng mẫu của khoa bạn. Thứ tự các mục của chương 4, nơi chương 5 lấy số liệu, có ở bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4 kết quả nghiên cứu</a>.</p>

<h2>Hàm ý quản trị khác giải pháp, kiến nghị thế nào</h2>
<ul>
<li><strong>Hàm ý quản trị</strong> xuất phát từ kết quả kiểm định của chính bạn. Yếu tố không có ý nghĩa thống kê thì không viết hàm ý "cần tăng cường" cho nó.</li>
<li><strong>Giải pháp</strong> trong các đề tài thực trạng (thường gặp ở chuyên đề tốt nghiệp) có thể dựa trên phân tích định tính, số liệu thứ cấp, kinh nghiệm thực tế.</li>
<li><strong>Kiến nghị</strong> thường hướng tới cơ quan nhà nước, hiệp hội, tức đối tượng ngoài phạm vi doanh nghiệp được nghiên cứu.</li>
</ul>
<p>Bartunek và Rynes (2010) phân tích phần "hàm ý cho thực tiễn" trong năm tạp chí quản trị hàng đầu và cho thấy ngay cả ở cấp độ đó, cách viết phần này vẫn còn nhiều tranh luận và thiếu thống nhất. Với khoá luận, quy tắc an toàn là: mỗi hàm ý phải truy ngược được về một con số trong chương 4.</p>

<h2>Bước 1: xếp hạng ưu tiên bằng hệ số và điểm trung bình</h2>
<p>Hai con số quyết định thứ tự viết hàm ý:</p>
<ul>
<li><strong>Mức độ quan trọng:</strong> hệ số hồi quy chuẩn hoá β (hoặc hệ số đường dẫn trong PLS-SEM). β lớn nghĩa là cải thiện yếu tố đó tạo ra thay đổi lớn ở biến phụ thuộc. Sullivan và Feinn (2012) nhấn mạnh p chỉ cho biết tác động có thật hay không, độ lớn hiệu ứng mới cho biết nó có đáng để hành động không.</li>
<li><strong>Mức độ thực hiện hiện tại:</strong> điểm trung bình của yếu tố trong thống kê mô tả. Điểm thấp nghĩa là còn nhiều dư địa cải thiện.</li>
</ul>
<p>Ghép hai trục lại là phân tích tầm quan trọng và mức độ thực hiện (Importance-Performance Analysis) của Martilla và James (1977). Ringle và Sarstedt (2016) phát triển cho PLS-SEM thành IPMA, có sẵn trong SmartPLS, quy điểm thực hiện về thang 0 đến 100:</p>
<p><code>Điểm thực hiện = (Trung bình − Giá trị nhỏ nhất của thang) / (Giá trị lớn nhất − Giá trị nhỏ nhất) × 100</code></p>

<h3>Ví dụ</h3>
<p>Đề tài: các yếu tố ảnh hưởng đến sự hài lòng của sinh viên với ứng dụng học trực tuyến, thang Likert 5 mức, kết quả hồi quy và thống kê mô tả (số liệu minh hoạ):</p>
<table>
<thead>
<tr><th>Yếu tố</th><th>β chuẩn hoá</th><th>Sig.</th><th>Trung bình</th><th>Điểm thực hiện (0–100)</th></tr>
</thead>
<tbody>
<tr><td>Chất lượng nội dung (ND)</td><td>0,38</td><td>&lt; 0,001</td><td>3,42</td><td>(3,42 − 1) / 4 × 100 = 60,5</td></tr>
<tr><td>Hỗ trợ kỹ thuật (HT)</td><td>0,29</td><td>&lt; 0,001</td><td>3,12</td><td>53,0</td></tr>
<tr><td>Tính dễ sử dụng (SD)</td><td>0,21</td><td>0,001</td><td>3,95</td><td>73,8</td></tr>
<tr><td>Tương tác với giảng viên (TT)</td><td>0,11</td><td>0,042</td><td>3,60</td><td>65,0</td></tr>
<tr><td>Chi phí (CP)</td><td>0,04</td><td>0,486</td><td>3,30</td><td>57,5</td></tr>
</tbody>
</table>
<p>Lấy mốc chia là trung bình của các yếu tố có ý nghĩa (β trung bình = 0,25; điểm thực hiện trung bình = 63,1), xếp vào bốn ô của Martilla và James (1977):</p>
<table>
<thead>
<tr><th></th><th>Thực hiện thấp</th><th>Thực hiện cao</th></tr>
</thead>
<tbody>
<tr><td><strong>Quan trọng cao</strong></td><td>Tập trung cải thiện: ND, HT</td><td>Duy trì: (không có)</td></tr>
<tr><td><strong>Quan trọng thấp</strong></td><td>Ưu tiên thấp: (không có)</td><td>Có thể đang đầu tư thừa: SD, TT</td></tr>
</tbody>
</table>
<p>Thứ tự viết hàm ý: (1) chất lượng nội dung, (2) hỗ trợ kỹ thuật, (3) duy trì tính dễ sử dụng, (4) tương tác với giảng viên. Chi phí không có ý nghĩa thống kê (Sig. = 0,486) nên không viết hàm ý "giảm chi phí"; nếu muốn, chỉ nêu trong phần thảo luận vì sao chi phí không tác động.</p>

<h2>Bước 2: tìm biến quan sát yếu nhất trong từng yếu tố</h2>
<p>Trung bình của khái niệm che mất chi tiết. Mở bảng thống kê mô tả của từng biến quan sát và tìm câu có điểm thấp nhất, đó là chỗ đặt hành động:</p>
<table>
<thead>
<tr><th>Biến</th><th>Nội dung câu hỏi</th><th>Trung bình</th></tr>
</thead>
<tbody>
<tr><td>HT1</td><td>Ứng dụng có hướng dẫn sử dụng rõ ràng</td><td>3,35</td></tr>
<tr><td>HT2</td><td>Thắc mắc của tôi được giải đáp trong vòng 24 giờ</td><td>2,86</td></tr>
<tr><td>HT3</td><td>Lỗi kỹ thuật được khắc phục nhanh chóng</td><td>3,15</td></tr>
</tbody>
</table>
<p>Trung bình của HT là (3,35 + 2,86 + 3,15) / 3 = 3,12. HT2 thấp nhất và là câu duy nhất dưới 3, tức nghiêng về phía không đồng ý. Hàm ý cho hỗ trợ kỹ thuật vì vậy nên nói về thời gian phản hồi, chứ không chung chung "nâng cao hỗ trợ kỹ thuật".</p>

<h2>Bước 3: viết từng hàm ý theo công thức bốn phần</h2>
<ol>
<li><strong>Căn cứ:</strong> nhắc lại phát hiện với con số (β, trung bình, câu thấp nhất).</li>
<li><strong>Hành động:</strong> việc cụ thể, đo được.</li>
<li><strong>Đối tượng:</strong> ai làm (ban quản lý đào tạo, bộ phận kỹ thuật, giảng viên).</li>
<li><strong>Kỳ vọng:</strong> vì sao hành động này cải thiện biến phụ thuộc, dẫn lại lý thuyết hoặc nghiên cứu trước nếu có.</li>
</ol>
<blockquote>Hỗ trợ kỹ thuật là yếu tố tác động mạnh thứ hai đến sự hài lòng (β = 0,29) nhưng có mức đánh giá thấp nhất trong các yếu tố (trung bình 3,12), trong đó biến "Thắc mắc của tôi được giải đáp trong vòng 24 giờ" chỉ đạt 2,86. Do đó, bộ phận hỗ trợ của nhà trường nên công bố cam kết thời gian phản hồi, bố trí kênh hỏi đáp trực tuyến trong giờ học cao điểm buổi tối và theo dõi tỉ lệ yêu cầu được giải đáp trong 24 giờ hằng tháng. Cải thiện thời gian phản hồi được kỳ vọng nâng sự hài lòng nhiều hơn so với đầu tư thêm vào giao diện, vốn đã được đánh giá cao (tính dễ sử dụng: 3,95).</blockquote>
<p>So với "Nhà trường cần nâng cao chất lượng hỗ trợ kỹ thuật cho sinh viên", đoạn trên cho người đọc biết vì sao ưu tiên, làm gì, ai làm và đo kết quả thế nào.</p>

<h2>Hàm ý theo nhóm đối tượng</h2>
<p>Nếu chương 4 có kiểm định khác biệt (T-test, ANOVA), dùng kết quả đó để viết hàm ý cho từng nhóm. Ví dụ sinh viên năm 1 hài lòng thấp hơn năm 4 có ý nghĩa thống kê: hàm ý là hướng dẫn sử dụng riêng cho tân sinh viên trong tuần đầu. Cách đọc kiểm định có ở bài <a href="/posts/kiem-dinh-t-test-anova-spss/">kiểm định T-test và ANOVA trong SPSS</a>. Mô hình có biến điều tiết thì hàm ý nói rõ nhóm nào cần ưu tiên, xem cách đọc độ dốc đơn ở bài <a href="/posts/bien-trung-gian-bien-dieu-tiet-la-gi/">biến trung gian và biến điều tiết là gì</a>.</p>

<h2>Khi giả thuyết bị bác bỏ</h2>
<p>Không viết hàm ý tăng cường cho yếu tố không có ý nghĩa, nhưng cũng không bỏ qua nó. Ở mục thảo luận, đưa ra lời giải thích hợp lý (mẫu đặc thù, yếu tố đã đạt mức "đủ" nên không còn tạo khác biệt, thang đo chưa phù hợp bối cảnh) và so sánh với nghiên cứu cho kết quả tương tự. Từ đó có thể có một hàm ý gián tiếp: không nên dồn nguồn lực vào yếu tố đó. Ví dụ với mô hình TPB, chuẩn chủ quan thường là yếu tố yếu nhất, xem bài <a href="/posts/mo-hinh-tpb-thuyet-hanh-vi-co-ke-hoach/">mô hình TPB là gì</a>. Nếu chưa chắc kết quả "không có ý nghĩa" là thật hay do lỗi phân tích, nhập bảng kết quả vào <a href="/cong-cu/bac-si-ket-qua/">bác sĩ kết quả</a> trước khi viết.</p>

<h2>Viết mục hạn chế và hướng nghiên cứu tiếp theo</h2>
<p>Hạn chế nên cụ thể, gắn với thiết kế của bạn, và mỗi hạn chế đi kèm một hướng khắc phục:</p>
<table>
<thead>
<tr><th>Hạn chế</th><th>Hướng nghiên cứu tiếp theo</th></tr>
</thead>
<tbody>
<tr><td>Mẫu thuận tiện, 250 sinh viên của một trường</td><td>Mở rộng sang nhiều trường, chọn mẫu phân tầng theo khối ngành</td></tr>
<tr><td>Dữ liệu cắt ngang, chưa kết luận quan hệ nhân quả</td><td>Khảo sát lặp lại hai thời điểm</td></tr>
<tr><td>R² = 0,48: còn 52% biến thiên chưa được giải thích</td><td>Bổ sung yếu tố như thói quen, đặc điểm môn học</td></tr>
<tr><td>Chỉ đo ý định, chưa đo hành vi thực tế</td><td>Kết hợp dữ liệu sử dụng thực tế từ hệ thống</td></tr>
</tbody>
</table>
<p>Tránh liệt kê hạn chế không liên quan đến kết quả ("thời gian có hạn", "kinh nghiệm của tác giả còn hạn chế"): hội đồng sẽ hỏi hạn chế đó ảnh hưởng thế nào đến kết luận. Cách viết về R² thấp mà không tự hạ giá trị nghiên cứu có ở bài <a href="/posts/r-binh-phuong-hieu-chinh/">R bình phương hiệu chỉnh là gì</a>.</p>

<h2>Lỗi hay gặp ở chương 5</h2>
<ul>
<li><strong>Hàm ý chung chung</strong>, có thể dán vào bất kỳ khoá luận nào cùng đề tài.</li>
<li><strong>Đưa số liệu mới</strong> chưa có ở chương 4. Chương 5 chỉ dùng lại kết quả đã trình bày.</li>
<li><strong>Thứ tự hàm ý không theo β</strong>: viết dài nhất cho yếu tố tác động yếu nhất.</li>
<li><strong>Kết luận quá đà</strong>: "chứng minh rằng", "khẳng định chắc chắn" với một mẫu thuận tiện. Dùng "cho thấy", "ủng hộ".</li>
<li><strong>Thiếu trích dẫn khi thảo luận</strong>. Phần so sánh với nghiên cứu trước cần nguồn; định dạng nhanh danh mục bằng <a href="/cong-cu/trich-dan-apa/">công cụ trích dẫn APA 7</a>.</li>
</ul>

<h2>Câu hỏi thường gặp</h2>
<h3>Hàm ý quản trị tiếng Anh là gì?</h3>
<p>Managerial implications. Trong bài báo quốc tế còn gặp practical implications (hàm ý thực tiễn) và implications for practice; hàm ý cho học thuật gọi là theoretical implications.</p>
<h3>Hàm ý quản trị có cần trích dẫn không?</h3>
<p>Phần căn cứ lấy từ kết quả của bạn thì không cần. Khi lập luận vì sao một hành động có hiệu quả, hoặc nêu ví dụ doanh nghiệp đã làm, nên dẫn nguồn. Phần thảo luận so sánh với nghiên cứu trước thì bắt buộc có trích dẫn.</p>
<h3>Bao nhiêu hàm ý là đủ?</h3>
<p>Thường mỗi yếu tố có ý nghĩa thống kê một nhóm hàm ý, mỗi nhóm hai đến bốn hành động gắn với các biến quan sát yếu nhất. Ít mà cụ thể tốt hơn nhiều mà chung chung.</p>
<h3>Chương 5 có cần nhắc lại giả thuyết không?</h3>
<p>Mục kết luận nên có một bảng tóm tắt giả thuyết chấp nhận hay bác bỏ, kèm hệ số. Từ bảng đó dẫn sang thảo luận và hàm ý. Không cần lặp lại toàn bộ bảng hồi quy; nếu cần chạy lại số liệu nhanh để kiểm tra, dùng <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu</a>.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Bartunek, J. M., &amp; Rynes, S. L. (2010). The construction and contributions of "implications for practice": What's in them and what might they offer? <em>Academy of Management Learning &amp; Education, 9</em>(1), 100–117. https://doi.org/10.5465/amle.9.1.zqr100</li>
<li>Martilla, J. A., &amp; James, J. C. (1977). Importance-performance analysis. <em>Journal of Marketing, 41</em>(1), 77–79. https://doi.org/10.1177/002224297704100112</li>
<li>Ringle, C. M., &amp; Sarstedt, M. (2016). Gain more insight from your PLS-SEM results: The importance-performance map analysis. <em>Industrial Management &amp; Data Systems, 116</em>(9), 1865–1886. https://doi.org/10.1108/IMDS-10-2015-0449</li>
<li>Sullivan, G. M., &amp; Feinn, R. (2012). Using effect size—or why the P value is not enough. <em>Journal of Graduate Medical Education, 4</em>(3), 279–282. https://doi.org/10.4300/JGME-D-12-00156.1</li>
</ul>
