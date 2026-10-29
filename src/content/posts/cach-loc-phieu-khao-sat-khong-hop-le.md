---
title: "Cách lọc phiếu khảo sát không hợp lệ trước khi chạy SPSS"
description: "Hướng dẫn lọc phiếu khảo sát không hợp lệ: điền rập khuôn, làm quá nhanh, trượt câu kiểm tra chú ý, trùng lặp, mâu thuẫn. Có quy trình 8 bước trước SPSS."
pubDatetime: 2026-10-29T04:00:00+07:00
featured: false
tags: ["làm sạch dữ liệu","SPSS"]
---

<p>Bạn thu đủ 300 phiếu, mở SPSS chạy Cronbach's alpha và thấy một thang đo chỉ đạt 0,52. Chạy EFA thì các biến nhảy lung tung sang nhân tố khác. Trước khi nghi ngờ mô hình, hãy nghi ngờ dữ liệu. Trong rất nhiều bộ dữ liệu khoá luận, một phần phiếu được điền cho xong: chọn cùng một mức cho cả trang, bấm qua 40 câu trong một phút, hoặc trả lời mâu thuẫn với chính mình.</p>
<p>Những phiếu này làm loãng tương quan giữa các biến, kéo alpha xuống và làm cấu trúc nhân tố méo đi. Meade và Craig (2012) gọi đây là phản hồi bất cẩn (careless responding). Bài này đi qua sáu loại phiếu cần soát và một quy trình lọc bạn làm được bằng Excel hoặc SPSS.</p>

<h2>Nguyên tắc trước khi lọc</h2>
<ul>
<li><strong>Giữ nguyên file gốc.</strong> Mọi thao tác làm trên bản sao. Thêm cột đánh dấu (flag) thay vì xoá dòng ngay.</li>
<li><strong>Đặt tiêu chí trước khi nhìn kết quả.</strong> Nếu bạn lọc đi lọc lại cho tới khi alpha đẹp, đó là chỉnh dữ liệu cho vừa giả thuyết. Ghi tiêu chí ra giấy, áp dụng một lần.</li>
<li><strong>Báo cáo trong chương phương pháp.</strong> Ghi rõ thu được bao nhiêu phiếu, loại bao nhiêu, vì lý do gì, còn lại bao nhiêu. Hội đồng đánh giá cao sự minh bạch này hơn một con số đẹp.</li>
</ul>

<h2>1. Điền rập khuôn (straightlining)</h2>
<p>Đáp viên chọn cùng một mức, thường là 3 hoặc 4, cho mọi câu trong một khối Likert. Một hai khối như vậy chưa chắc là gian lận: có người thật sự thấy mọi thứ ở mức "bình thường". Dấu hiệu rõ hơn là phiếu rập khuôn ở <em>tất cả</em> các khối, kể cả khối có câu đảo chiều.</p>
<p>Cách kiểm tra nhanh: tính độ lệch chuẩn của các câu trong mỗi khối cho từng người. Độ lệch chuẩn bằng 0 nghĩa là chọn y hệt nhau.</p>
<ul>
<li>Excel: <code>=STDEV.P(D2:M2)</code> cho khối từ cột D đến M.</li>
<li>SPSS: <code>COMPUTE sd_khoi1 = SD(Q1 TO Q10).</code> rồi <code>EXECUTE.</code></li>
</ul>
<p>Đếm xem mỗi phiếu có bao nhiêu khối bằng 0. Phiếu rập khuôn ở hầu hết các khối là ứng viên loại. Xem thêm bài <a href="/goc-nghien-cuu/posts/thang-do-likert/">thang đo Likert 5 mức, 7 mức</a>.</p>

<h2>2. Thời gian làm bài quá nhanh</h2>
<p>Google Forms không ghi thời gian bắt đầu, chỉ có dấu thời gian lúc nộp. Nếu công cụ của bạn ghi được thời lượng, đây là tiêu chí khách quan nhất. Huang và cộng sự (2012) đề xuất mốc khoảng 2 giây cho mỗi câu: đọc và hiểu một câu Likert nhanh hơn thế gần như không khả thi. Với form 40 câu, phiếu dưới 80 giây rất đáng ngờ.</p>
<p>Một cách thực dụng khác là lấy trung vị thời gian của cả mẫu, rồi xem xét kỹ những phiếu nhanh hơn rất nhiều so với trung vị. Đừng dùng trung bình: vài người mở form rồi bỏ đó cả tiếng sẽ kéo nó lên.</p>
<p>Thời gian nhanh nên đi kèm một tiêu chí khác trước khi loại. Người đọc nhanh vẫn có thể trả lời nghiêm túc.</p>

<h2>3. Trượt câu kiểm tra chú ý</h2>
<p>Câu kiểm tra chú ý (attention check) là câu có đáp án đúng duy nhất, ví dụ: <em>"Để xác nhận bạn đang đọc kỹ, vui lòng chọn Rất không đồng ý ở câu này."</em> Đặt nó lẫn trong một khối Likert, giữa form, không đặt ở câu đầu hay câu cuối. Oppenheimer và cộng sự (2009) gọi dạng câu này là instructional manipulation check.</p>
<p>Một vài lưu ý:</p>
<ul>
<li>Dùng 1–3 câu cho một form, đủ để bắt người không đọc mà không làm đáp viên khó chịu.</li>
<li>Nếu rất nhiều người trượt, nhiều khả năng câu của bạn viết khó hiểu.</li>
<li>Trượt một câu trong ba có thể do sơ ý. Trượt từ hai câu trở lên là tín hiệu mạnh.</li>
</ul>

<h2>4. Câu hỏi đảo chiều trả lời ngược logic</h2>
<p>Thang đo tốt thường có vài câu đảo chiều. Ví dụ trong thang đo hài lòng công việc:</p>
<ul>
<li>Q3: "Tôi thấy công việc hiện tại thú vị."</li>
<li>Q7 (đảo chiều): "Tôi thường thấy chán khi làm việc."</li>
</ul>
<p>Người đọc kỹ sẽ trả lời hai câu theo hướng ngược nhau. Người chọn 5 cho cả Q3 lẫn Q7 nhiều khả năng không đọc. Hãy so sánh <strong>trước khi</strong> mã hoá ngược Q7 (đổi 1 thành 5, 2 thành 4), nếu không bạn sẽ nhầm hướng. Sau khi lọc xong mới mã hoá ngược để chạy alpha.</p>
<p>Một cặp lệch có thể do người trả lời hiểu nhầm. Nhiều cặp cùng lệch trong một phiếu thì đáng loại.</p>

<h2>5. Phiếu trùng lặp</h2>
<p>Trùng lặp xảy ra khi một người nộp nhiều lần để nhận thưởng, hoặc bạn bè "điền giúp" bằng cùng một máy. Kiểm tra:</p>
<ul>
<li>Trùng email, số điện thoại hoặc mã sinh viên (nếu có thu).</li>
<li>Hai dòng giống nhau hoàn toàn ở mọi câu. Excel: nối các cột bằng <code>=TEXTJOIN("|",TRUE,D2:AZ2)</code> rồi dùng <code>COUNTIF</code> để đếm chuỗi lặp.</li>
<li>Nhiều phiếu nộp cách nhau vài giây với câu trả lời gần như giống hệt.</li>
</ul>
<p>Với phiếu trùng, giữ lại phiếu đầu tiên và loại các phiếu sau.</p>

<h2>6. Mâu thuẫn giữa các câu trong cùng phiếu</h2>
<p>Loại này phụ thuộc nội dung bảng hỏi. Ví dụ:</p>
<ul>
<li>Chọn "18–22 tuổi" nhưng ghi "đã đi làm hơn 10 năm".</li>
<li>Trả lời "chưa từng dùng ứng dụng X" ở câu gạn lọc nhưng chấm điểm chi tiết từng tính năng của X.</li>
<li>Chọn thu nhập "dưới 5 triệu/tháng" nhưng chi tiêu mua sắm trực tuyến "trên 10 triệu/tháng".</li>
</ul>
<p>Khi thiết kế bảng hỏi, hãy đánh dấu sẵn các cặp câu có thể đối chiếu. Lúc lọc, viết công thức <code>IF</code> cho từng cặp. Câu tự luận cũng cần đọc lướt: câu trả lời vô nghĩa ("abc", "ok", "không biết" cho mọi câu) hoặc lạc đề là dấu hiệu rõ. Câu tự luận còn có một vấn đề mới là văn bản do AI viết, xem bài <a href="/goc-nghien-cuu/posts/phat-hien-cau-tra-loi-khao-sat-do-ai-viet/">phát hiện câu trả lời khảo sát do AI viết</a>.</p>

<h2>Bảng tổng hợp tiêu chí</h2>
<table>
<thead>
<tr><th>Loại</th><th>Cách kiểm tra</th><th>Mức độ</th><th>Gợi ý xử lý</th></tr>
</thead>
<tbody>
<tr><td>Không qua câu gạn lọc</td><td>Lọc theo đáp án loại</td><td>Chắc chắn</td><td>Loại</td></tr>
<tr><td>Trùng lặp</td><td>Trùng định danh hoặc trùng toàn bộ dòng</td><td>Chắc chắn</td><td>Giữ phiếu đầu, loại phần còn lại</td></tr>
<tr><td>Trượt câu kiểm tra chú ý</td><td>So với đáp án đúng</td><td>Mạnh</td><td>Loại nếu trượt từ 2 câu</td></tr>
<tr><td>Quá nhanh</td><td>Thời lượng so với số câu và trung vị</td><td>Trung bình</td><td>Loại khi kèm một tiêu chí khác</td></tr>
<tr><td>Rập khuôn</td><td>Độ lệch chuẩn từng khối bằng 0</td><td>Trung bình</td><td>Loại khi rập khuôn hầu hết các khối</td></tr>
<tr><td>Đảo chiều lệch logic</td><td>So cặp câu thuận và nghịch</td><td>Trung bình</td><td>Loại khi nhiều cặp cùng lệch</td></tr>
<tr><td>Mâu thuẫn nội dung</td><td>Công thức IF cho từng cặp câu</td><td>Tuỳ trường hợp</td><td>Đọc lại cả phiếu rồi quyết định</td></tr>
</tbody>
</table>

<p>Làm thủ công cho 300 phiếu mất vài buổi tối, và bạn vẫn phải trả công cho cả những phiếu sẽ bị loại. Đây là lúc cách thu mẫu ảnh hưởng trực tiếp tới khối lượng việc lọc.</p>


<p>Nếu dùng nền tảng thu mẫu có trả thưởng, hãy hỏi họ xử lý phiếu kém chất lượng thế nào: có tự gắn cờ phiếu điền rập khuôn, phiếu mâu thuẫn hay câu tự luận do AI viết không, và bạn có phải trả tiền cho phiếu bị loại không. Dù vậy, bạn vẫn nên tự chạy quy trình dưới đây trên file xuất ra.</p>

<h2>Quy trình 8 bước trước khi chạy SPSS</h2>
<ol>
<li>Xuất dữ liệu, lưu một bản gốc chỉ đọc.</li>
<li>Loại phiếu không đạt câu gạn lọc (sai đối tượng).</li>
<li>Loại phiếu trùng lặp.</li>
<li>Tạo cột flag cho: trượt câu kiểm tra, quá nhanh, rập khuôn, đảo chiều lệch, mâu thuẫn. Mỗi cột ghi 0 hoặc 1.</li>
<li>Cộng các cột flag. Loại phiếu có tổng flag từ 2 trở lên, hoặc trượt từ 2 câu kiểm tra chú ý. Phiếu có đúng 1 flag thì đọc lại bằng mắt.</li>
<li>Mã hoá ngược các câu đảo chiều.</li>
<li>Kiểm tra cỡ mẫu còn lại so với yêu cầu. Nếu thiếu, thu thêm thay vì nới tiêu chí. Dùng <a href="/goc-nghien-cuu/cong-cu/tinh-co-mau/">công cụ tính cỡ mẫu</a> để biết bạn cần bao nhiêu.</li>
<li>Chạy Cronbach's alpha trên dữ liệu sạch. Bạn có thể dán dữ liệu vào <a href="/goc-nghien-cuu/cong-cu/cronbach-alpha/">công cụ tính Cronbach's alpha</a> để so sánh trước và sau khi lọc.</li>
</ol>
<p>Phần trượt câu kiểm tra chú ý, phiếu rập khuôn, mã hoá ngược câu đảo chiều và chạy alpha (bước 4, 6 và 8) có thể làm tự động bằng <a href="/goc-nghien-cuu/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát</a>: công cụ ghi rõ số phiếu bị loại theo từng lý do để bạn đưa vào chương 4. Các tiêu chí còn lại như thời gian làm bài hay mâu thuẫn giữa các câu vẫn cần lọc tay theo bảng ở trên.</p>

<h2>Lọc bao nhiêu là vừa?</h2>
<p>Không có tỉ lệ chuẩn. Điều quan trọng là tiêu chí nhất quán và được báo cáo. Nếu bạn loại quá nửa mẫu, vấn đề nằm ở khâu thu mẫu hoặc bảng hỏi, và lọc mạnh tay hơn không giải quyết được.</p>
<p>Một mẹo cuối: chạy phân tích chính hai lần, với dữ liệu đầy đủ và dữ liệu đã lọc. Nếu kết luận giống nhau, bạn có thêm một đoạn kiểm tra độ vững cho chương kết quả. Nếu khác nhau, đó là bằng chứng cho thấy việc lọc là cần thiết.</p>
<p>Cách tốt nhất để lọc ít là thiết kế bảng hỏi tốt từ đầu: ngắn vừa đủ, câu rõ nghĩa, có sẵn câu kiểm tra và câu đối chiếu. Xem thêm <a href="/goc-nghien-cuu/posts/cach-thiet-ke-bang-hoi/">cách thiết kế bảng hỏi khảo sát</a>.</p>
