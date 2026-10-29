---
title: "Bảng mã hoá thang đo: cách lập cho chương 3 và SPSS"
description: "Cách lập bảng mã hoá thang đo cho chương 3 và Variable View trong SPSS: đặt mã biến, câu đảo chiều, biến nhân khẩu học, giá trị thiếu, kèm bảng mẫu, cú pháp."
pubDatetime: 2026-10-30T01:04:00+07:00
featured: false
tags: ["thang đo","SPSS","khoá luận"]
---

<p>"Bảng mã hoá thang đo" trong khoá luận thực chất là hai bảng có chung một xương sống. Bảng thứ nhất nằm trong chương 3: liệt kê từng khái niệm, mã và nội dung từng biến quan sát, nguồn thang đo. Bảng thứ hai, thường để ở phụ lục, là bảng mã hoá dữ liệu đầy đủ: cách mỗi câu trả lời được đổi thành số trong SPSS, kể cả câu nhân khẩu học, câu đảo chiều và giá trị thiếu. Bài này hướng dẫn lập cả hai, rồi chuyển thẳng sang Variable View của SPSS để bạn không phải khai báo hai lần.</p>

<h2>Bảng mã hoá dùng để làm gì</h2>
<ul>
<li><strong>Cho hội đồng:</strong> đối chiếu được mỗi mã trong bảng kết quả chương 4 (PE1, HT3...) với câu hỏi thật và với thang đo gốc.</li>
<li><strong>Cho bạn:</strong> nhập liệu và làm sạch dữ liệu nhất quán, biết câu nào phải đảo điểm trước khi chạy Cronbach's alpha.</li>
<li><strong>Cho người đọc sau:</strong> lặp lại được nghiên cứu. Đây là lý do các sách hướng dẫn SPSS đều khuyên lập codebook trước khi nhập dữ liệu (Pallant, 2020).</li>
</ul>

<h2>Bước 1: Đặt mã biến</h2>
<p>Mã biến là tên viết tắt của khái niệm cộng số thứ tự: PE1, PE2, PE3. Một số quy tắc giúp tránh lỗi về sau:</p>
<ol>
<li><strong>Chọn một ngôn ngữ cho mọi mã.</strong> Hoặc viết tắt tiếng Anh theo thang đo gốc (PE cho Performance Expectancy), hoặc viết tắt tiếng Việt (HQ cho Hiệu quả kỳ vọng). Dùng tiếng Anh giúp đối chiếu với bài gốc dễ hơn; dùng tiếng Việt dễ đọc hơn với hội đồng. Đừng trộn.</li>
<li><strong>Không trùng tiền tố.</strong> "TT" cho cả "Thói quen" và "Thông tin" sẽ gây nhầm. Kiểm tra cả danh sách trước khi chốt.</li>
<li><strong>Đúng quy tắc tên biến của SPSS.</strong> Tên biến phải bắt đầu bằng chữ cái, không có dấu cách, không kết thúc bằng dấu chấm, không trùng từ khoá dành riêng như ALL, AND, BY, EQ, GE, GT, LE, LT, NE, NOT, OR, TO, WITH (IBM, n.d.). Tránh dấu tiếng Việt trong tên biến, để nhãn có dấu ở cột Label.</li>
<li><strong>Đánh số liên tục trong khái niệm.</strong> Nếu bạn bỏ bớt câu so với thang đo gốc, đánh số lại liên tục và ghi chú câu gốc tương ứng (ví dụ PE2 trong bài là PE3 trong thang đo gốc).</li>
<li><strong>Mã cho câu nhân khẩu học và câu kiểm tra.</strong> Dùng tiền tố riêng như D1 đến D6 cho thông tin chung, AC1 cho câu kiểm tra chú ý, SC1 cho câu gạn lọc.</li>
</ol>

<h2>Bước 2: Lập bảng mã hoá cho chương 3</h2>
<p>Bảng chương 3 thường có năm cột: khái niệm, mã, phát biểu, nguồn, và ghi chú (câu đảo chiều, câu đã điều chỉnh). Ví dụ với đề tài ý định tiếp tục dùng ứng dụng giao đồ ăn theo UTAUT2 (Venkatesh và cộng sự, 2012), câu chữ lấy từ <a href="/goc-nghien-cuu/thang-do/utaut2/">thang đo UTAUT2 tiếng Việt</a>:</p>
<p><em>Bảng 3.x. Bảng mã hoá thang đo</em></p>
<table>
<thead><tr><th>Khái niệm</th><th>Mã</th><th>Phát biểu</th><th>Nguồn</th></tr></thead>
<tbody>
<tr><td rowspan="3">Hiệu quả kỳ vọng (PE)</td><td>PE1</td><td>Tôi thấy ứng dụng giao đồ ăn hữu ích trong cuộc sống hằng ngày.</td><td rowspan="3">Venkatesh và cộng sự (2012)</td></tr>
<tr><td>PE2</td><td>Sử dụng ứng dụng giao đồ ăn giúp tôi làm mọi việc nhanh hơn.</td></tr>
<tr><td>PE3</td><td>Sử dụng ứng dụng giao đồ ăn làm tăng năng suất của tôi.</td></tr>
<tr><td rowspan="3">Ảnh hưởng xã hội (SI)</td><td>SI1</td><td>Những người quan trọng với tôi nghĩ rằng tôi nên sử dụng ứng dụng giao đồ ăn.</td><td rowspan="3">Venkatesh và cộng sự (2012)</td></tr>
<tr><td>SI2</td><td>Những người có ảnh hưởng tới hành vi của tôi nghĩ rằng tôi nên sử dụng ứng dụng giao đồ ăn.</td></tr>
<tr><td>SI3</td><td>Những người mà tôi coi trọng ý kiến muốn tôi sử dụng ứng dụng giao đồ ăn.</td></tr>
<tr><td rowspan="3">Thói quen (HT)</td><td>HT1</td><td>Việc sử dụng ứng dụng giao đồ ăn đã trở thành thói quen của tôi.</td><td rowspan="3">Venkatesh và cộng sự (2012), điều chỉnh từ Limayem và Hirt (2003)</td></tr>
<tr><td>HT2</td><td>Tôi bị nghiện sử dụng ứng dụng giao đồ ăn.</td></tr>
<tr><td>HT3</td><td>Tôi phải sử dụng ứng dụng giao đồ ăn.</td></tr>
<tr><td rowspan="3">Ý định hành vi (BI)</td><td>BI1</td><td>Tôi dự định tiếp tục sử dụng ứng dụng giao đồ ăn trong tương lai.</td><td rowspan="3">Venkatesh và cộng sự (2012)</td></tr>
<tr><td>BI2</td><td>Tôi sẽ luôn cố gắng sử dụng ứng dụng giao đồ ăn trong cuộc sống hằng ngày.</td></tr>
<tr><td>BI3</td><td>Tôi có kế hoạch tiếp tục sử dụng ứng dụng giao đồ ăn thường xuyên.</td></tr>
</tbody>
</table>
<p>Ghi chú dưới bảng: thang đo Likert 5 mức, 1 = Rất không đồng ý đến 5 = Rất đồng ý. PE1, PE2, PE3 tương ứng PE1, PE3, PE4 trong bài gốc. Nguồn: tác giả tổng hợp.</p>
<p>Nếu khoa của bạn quen dùng bảng có thêm cột "Phát biểu gốc (tiếng Anh)", thêm cột đó. Nó giúp hội đồng kiểm tra chất lượng bản dịch ngay trên bảng.</p>
<p><a href="/goc-nghien-cuu/cong-cu/bo-khao-sat/">Bộ khảo sát</a> tạo sẵn bảng này: chọn các khái niệm trong mô hình, bấm "Tải bảng mã hoá (Excel)" để nhận file có các cột Mã, Khái niệm, Phát biểu (tiếng Việt), Phát biểu gốc, Đảo điểm, Nguồn và Thang trả lời. Bạn chỉ cần xoá cột không dùng và dán vào Word.</p>

<h2>Bước 3: Lập bảng mã hoá dữ liệu đầy đủ (phụ lục)</h2>
<p>Bảng này nói rõ mỗi câu trả lời thành số nào. Với câu Likert, một dòng cho cả nhóm là đủ. Với câu nhân khẩu học, liệt kê từng giá trị:</p>
<table>
<thead><tr><th>Mã</th><th>Nội dung</th><th>Giá trị</th><th>Thang đo lường (Measure)</th></tr></thead>
<tbody>
<tr><td>SC1</td><td>Đặt đồ ăn qua ứng dụng trong 3 tháng gần đây</td><td>1 = Có; 0 = Không</td><td>Nominal</td></tr>
<tr><td>PE1 đến BI3</td><td>Các phát biểu Likert</td><td>1 = Rất không đồng ý; 2 = Không đồng ý; 3 = Trung lập; 4 = Đồng ý; 5 = Rất đồng ý</td><td>Scale (xem bước 5)</td></tr>
<tr><td>AC1</td><td>Câu kiểm tra chú ý</td><td>Đạt nếu = 2; còn lại loại phiếu</td><td>Nominal</td></tr>
<tr><td>D1</td><td>Giới tính</td><td>1 = Nam; 2 = Nữ; 3 = Khác; 99 = Không muốn trả lời</td><td>Nominal</td></tr>
<tr><td>D2</td><td>Độ tuổi</td><td>1 = Dưới 18; 2 = 18 đến 22; 3 = 23 đến 27; 4 = 28 đến 35; 5 = Trên 35</td><td>Ordinal</td></tr>
<tr><td>D3</td><td>Nghề nghiệp</td><td>1 = Sinh viên; 2 = Nhân viên văn phòng; 3 = Lao động tự do; 4 = Kinh doanh; 5 = Khác</td><td>Nominal</td></tr>
<tr><td>D4</td><td>Tần suất đặt món</td><td>1 = Dưới 1 lần/tháng; 2 = 1 đến 3 lần/tháng; 3 = 1 đến 2 lần/tuần; 4 = 3 lần/tuần trở lên</td><td>Ordinal</td></tr>
<tr><td>D6</td><td>Chi tiêu hằng tháng</td><td>1 = Dưới 3 triệu; 2 = 3 đến dưới 6 triệu; 3 = 6 đến dưới 10 triệu; 4 = Từ 10 triệu; 99 = Không muốn trả lời</td><td>Ordinal</td></tr>
</tbody>
</table>
<p>Ba lưu ý:</p>
<ul>
<li><strong>Giá trị thiếu dùng mã nằm ngoài khoảng hợp lệ</strong>, như 99, và khai báo trong cột Missing. Đừng để 0, vì 0 dễ bị tính vào trung bình.</li>
<li><strong>Câu chọn nhiều đáp án</strong> (ví dụ "Bạn dùng những ứng dụng nào?") được tách thành nhiều biến 0/1, mỗi đáp án một biến: D5_1 = GrabFood, D5_2 = ShopeeFood...</li>
<li><strong>Câu đảo chiều</strong> ghi rõ trong bảng (cột "Đảo điểm" hoặc ký hiệu "(R)") và ghi tên biến mới sau khi đảo.</li>
</ul>

<h2>Bước 4: Câu đảo chiều và cách đảo điểm</h2>
<p>Câu đảo chiều là câu mà đồng ý nhiều nghĩa là khái niệm thấp, ví dụ "Tôi thấy ứng dụng khó sử dụng" trong thang đo sự dễ dùng. Thang đo UTAUT2 trong ví dụ không có câu đảo chiều, nhưng nhiều thang đo tâm lý có (<a href="/goc-nghien-cuu/thang-do/tu-trong-rosenberg/">thang tự trọng Rosenberg</a>, <a href="/goc-nghien-cuu/thang-do/cang-thang-pss-10/">thang căng thẳng PSS-10</a>). Trước khi chạy Cronbach's alpha, phải đảo điểm theo công thức:</p>
<p><code>Điểm sau khi đảo = (số mức + 1) − điểm gốc</code></p>
<p>Với thang 5 mức: 1 thành 5, 2 thành 4, 3 giữ nguyên, 4 thành 2, 5 thành 1. Với thang 7 mức: lấy 8 trừ điểm gốc.</p>
<p>Trong SPSS: <strong>Transform</strong>, <strong>Recode into Different Variables</strong>, chọn biến, đặt tên mới có hậu tố _R, khai báo từng cặp giá trị cũ và mới. Luôn đảo sang biến mới, không ghi đè biến gốc, để còn kiểm tra lại. Quên đảo điểm là nguyên nhân hay gặp khiến hệ số tương quan biến tổng bị âm và Cronbach's alpha thấp bất thường; xem thêm bài <a href="/goc-nghien-cuu/posts/cronbach-alpha-la-gi/">Cronbach's alpha là gì</a>.</p>

<h2>Bước 5: Khai báo Variable View trong SPSS</h2>
<p>Mỗi dòng trong Variable View là một biến, mỗi cột là một thuộc tính. Đối chiếu với bảng mã hoá như sau (Field, 2018; Hoàng Trọng &amp; Chu Nguyễn Mộng Ngọc, 2008):</p>
<table>
<thead><tr><th>Cột</th><th>Điền gì</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td>Name</td><td>Mã biến</td><td>PE1</td></tr>
<tr><td>Type</td><td>Numeric cho mọi câu đã mã hoá thành số</td><td>Numeric</td></tr>
<tr><td>Width / Decimals</td><td>Decimals = 0 cho câu Likert và nhân khẩu học</td><td>8 / 0</td></tr>
<tr><td>Label</td><td>Nội dung phát biểu, có dấu tiếng Việt</td><td>Ứng dụng hữu ích trong cuộc sống hằng ngày</td></tr>
<tr><td>Values</td><td>Nhãn cho từng giá trị</td><td>1 = Rất không đồng ý ... 5 = Rất đồng ý</td></tr>
<tr><td>Missing</td><td>Mã giá trị thiếu</td><td>99</td></tr>
<tr><td>Measure</td><td>Nominal, Ordinal hoặc Scale</td><td>Scale</td></tr>
</tbody>
</table>
<h3>Measure của câu Likert: Ordinal hay Scale?</h3>
<p>Về lý thuyết, một câu Likert đơn lẻ là thang thứ bậc (Ordinal). Trong thực hành, các khoá luận tính trung bình, chạy Cronbach's alpha, EFA và hồi quy trên dữ liệu Likert, và Norman (2010) lập luận rằng các phép thống kê tham số khá vững với loại dữ liệu này. Thiết lập Measure trong SPSS không làm thay đổi kết quả Cronbach's alpha, EFA hay hồi quy; nó chủ yếu ảnh hưởng tới Chart Builder và một số hộp thoại. Cách an toàn: đặt Scale cho các câu Likert và biến trung bình của khái niệm, Nominal hoặc Ordinal cho câu nhân khẩu học, và giữ nhất quán.</p>
<h3>Làm nhanh bằng cú pháp</h3>
<p>Thay vì bấm từng ô, mở <strong>File</strong>, <strong>New</strong>, <strong>Syntax</strong>, dán đoạn sau (sửa tên biến cho khớp dữ liệu của bạn), bôi đen và chạy:</p>
<pre><code>VALUE LABELS PE1 TO BI3
  1 'Rất không đồng ý' 2 'Không đồng ý' 3 'Trung lập' 4 'Đồng ý' 5 'Rất đồng ý'.
VARIABLE LEVEL PE1 TO BI3 (SCALE).
VALUE LABELS D1 1 'Nam' 2 'Nữ' 3 'Khác' 99 'Không muốn trả lời'.
MISSING VALUES D1 D6 (99).
VARIABLE LEVEL D1 D3 (NOMINAL) /D2 D4 D6 (ORDINAL).
* Ví dụ đảo điểm một câu đảo chiều EE5 trên thang 5 mức.
RECODE EE5 (1=5) (2=4) (3=3) (4=2) (5=1) INTO EE5_R.
* Biến trung bình của khái niệm, cần ít nhất 3 câu có giá trị.
COMPUTE PE = MEAN.3(PE1, PE2, PE3).
EXECUTE.</code></pre>
<p>Từ khoá TO lấy mọi biến nằm giữa PE1 và BI3 theo thứ tự cột trong file, nên hãy chắc các câu Likert đứng liền nhau và không có cột khác xen giữa. Hàm MEAN.3 chỉ tính trung bình khi có ít nhất 3 giá trị hợp lệ, an toàn hơn MEAN thông thường vốn tính cả khi chỉ có một giá trị.</p>

<h2>Lỗi thường gặp</h2>
<table>
<thead><tr><th>Lỗi</th><th>Hậu quả</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>Mã trong bảng chương 3 khác mã trong bảng kết quả chương 4</td><td>Hội đồng không đối chiếu được</td><td>Dùng một bảng mã làm nguồn duy nhất, sao chép tên biến từ đó</td></tr>
<tr><td>Không ghi nguồn cho từng khái niệm</td><td>Bị hỏi "thang đo lấy ở đâu"</td><td>Thêm cột Nguồn, ghi rõ tác giả, năm, và "điều chỉnh từ" nếu có</td></tr>
<tr><td>Quên đảo điểm câu đảo chiều</td><td>Tương quan biến tổng âm, alpha thấp</td><td>Đảo sang biến _R trước khi phân tích</td></tr>
<tr><td>Mã "Không muốn trả lời" là 0 hoặc 6</td><td>Bị tính vào trung bình, sai thống kê mô tả</td><td>Dùng 99 và khai báo Missing</td></tr>
<tr><td>Tên biến có dấu cách hoặc dấu tiếng Việt</td><td>Lỗi khi nhập hoặc khi chạy cú pháp</td><td>Tên biến không dấu, nhãn có dấu ở Label</td></tr>
<tr><td>Đánh số lại câu mà không ghi chú</td><td>Không khớp với bài gốc</td><td>Ghi chú tương ứng với số câu gốc dưới bảng</td></tr>
</tbody>
</table>

<h2>Câu hỏi thường gặp</h2>
<h3>Bảng mã hoá thang đo đặt ở chương 3 hay phụ lục?</h3>
<p>Bảng khái niệm, mã, phát biểu và nguồn đặt ở chương 3, phần thiết kế thang đo. Bảng mã hoá dữ liệu đầy đủ (giá trị, giá trị thiếu, câu nhân khẩu học) đặt ở phụ lục. Một số trường gộp làm một; theo mẫu của khoa bạn.</p>
<h3>Có bắt buộc dùng mã tiếng Anh không?</h3>
<p>Không. Chỉ cần nhất quán và dễ đối chiếu. Nếu dùng mã tiếng Việt, nên ghi tên khái niệm tiếng Anh gốc cạnh tên tiếng Việt ở cột Khái niệm.</p>
<h3>Biến bị loại sau Cronbach's alpha hoặc EFA có xoá khỏi bảng mã hoá không?</h3>
<p>Không xoá ở chương 3, vì bảng đó mô tả thang đo bạn đã dùng để thu dữ liệu. Việc loại biến được báo cáo ở chương 4, kèm lý do.</p>
<h3>Có cần khai báo Label cho từng câu Likert không?</h3>
<p>Không bắt buộc, nhưng nên. Label giúp bảng kết quả SPSS dễ đọc khi đối chiếu, và bạn có thể tắt hiển thị Label nếu bảng quá rộng.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Field, A. (2018). <em>Discovering statistics using IBM SPSS Statistics</em> (5th ed.). SAGE.</li>
<li>Hoàng Trọng, &amp; Chu Nguyễn Mộng Ngọc. (2008). <em>Phân tích dữ liệu nghiên cứu với SPSS</em> (Tập 1). NXB Hồng Đức.</li>
<li>IBM. (n.d.). <em>Variable names</em>. IBM SPSS Statistics documentation. https://www.ibm.com/docs/en/spss-statistics</li>
<li>Limayem, M., &amp; Hirt, S. G. (2003). Force of habit and information systems usage: Theory and initial validation. <em>Journal of the Association for Information Systems, 4</em>(1), 65–97. https://doi.org/10.17705/1jais.00030</li>
<li>Norman, G. (2010). Likert scales, levels of measurement and the "laws" of statistics. <em>Advances in Health Sciences Education, 15</em>(5), 625–632. https://doi.org/10.1007/s10459-010-9222-y</li>
<li>Pallant, J. (2020). <em>SPSS survival manual: A step by step guide to data analysis using IBM SPSS</em> (7th ed.). Routledge.</li>
<li>Venkatesh, V., Thong, J. Y. L., &amp; Xu, X. (2012). Consumer acceptance and use of information technology: Extending the unified theory of acceptance and use of technology. <em>MIS Quarterly, 36</em>(1), 157–178. https://doi.org/10.2307/41410412</li>
</ul>
