---
title: "Cách lọc phiếu khảo sát không hợp lệ trước khi chạy SPSS"
description: "Lọc phiếu khảo sát không hợp lệ: rập khuôn, quá nhanh, trượt câu kiểm tra chú ý, trùng lặp, longstring, Mahalanobis, kèm cú pháp SPSS và đoạn mẫu chương 3."
pubDatetime: 2026-10-29T04:00:00+07:00
modDatetime: 2026-10-30T02:30:29+07:00
featured: false
tags: ["làm sạch dữ liệu","SPSS"]
---

<p><strong>Phiếu khảo sát không hợp lệ là phiếu không đúng đối tượng hoặc được điền cho xong, và nên lọc trước khi chạy SPSS theo tiêu chí khai báo từ trước:</strong> loại chắc chắn phiếu không qua câu gạn lọc và phiếu trùng lặp; loại phiếu trượt câu kiểm tra chú ý; với phiếu làm quá nhanh, điền rập khuôn hay trả lời câu đảo chiều ngược logic thì chỉ loại khi có thêm một dấu hiệu khác. Số phiếu loại theo từng tiêu chí phải được báo cáo trong chương 3.</p>

<p>Bạn thu đủ 300 phiếu, mở SPSS chạy Cronbach's alpha và thấy một thang đo chỉ đạt 0,52. Chạy EFA thì các biến nhảy lung tung sang nhân tố khác. Trước khi nghi ngờ mô hình, hãy nghi ngờ dữ liệu. Trong rất nhiều bộ dữ liệu khoá luận, một phần phiếu được điền cho xong: chọn cùng một mức cho cả trang, bấm qua 40 câu trong một phút, hoặc trả lời mâu thuẫn với chính mình.</p>
<p>Những phiếu này làm loãng tương quan giữa các biến, kéo alpha xuống và làm cấu trúc nhân tố méo đi. Meade và Craig (2012) gọi đây là phản hồi bất cẩn (careless responding). Bài này đi qua sáu loại phiếu cần soát, hai chỉ số thống kê bổ sung (longstring và khoảng cách Mahalanobis), một quy trình lọc bạn làm được bằng Excel hoặc SPSS và đoạn mẫu để báo cáo trong khoá luận.</p>

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
<p>Đếm xem mỗi phiếu có bao nhiêu khối bằng 0. Phiếu rập khuôn ở hầu hết các khối là ứng viên loại. Xem thêm bài <a href="/posts/thang-do-likert/">thang đo Likert 5 mức, 7 mức</a>.</p>

<h2>2. Thời gian làm bài quá nhanh</h2>
<p>Google Forms không ghi thời gian bắt đầu, chỉ có dấu thời gian lúc nộp (xem thêm bài <a href="/posts/cach-tao-phieu-khao-sat-google-forms/">cách tạo phiếu khảo sát bằng Google Forms</a>). Nếu công cụ của bạn ghi được thời lượng, đây là tiêu chí khách quan nhất. Huang và cộng sự (2012) đề xuất mốc khoảng 2 giây cho mỗi câu: đọc và hiểu một câu Likert nhanh hơn thế gần như không khả thi. Với form 40 câu, phiếu dưới 80 giây rất đáng ngờ.</p>
<p>Một cách thực dụng khác là lấy trung vị thời gian của cả mẫu, rồi xem xét kỹ những phiếu nhanh hơn rất nhiều so với trung vị. Đừng dùng trung bình: vài người mở form rồi bỏ đó cả tiếng sẽ kéo nó lên.</p>
<p>Thời gian nhanh nên đi kèm một tiêu chí khác trước khi loại. Người đọc nhanh vẫn có thể trả lời nghiêm túc.</p>

<h2>3. Trượt câu kiểm tra chú ý</h2>
<p>Câu kiểm tra chú ý (attention check) là câu có đáp án đúng duy nhất, ví dụ: <em>"Để xác nhận bạn đang đọc kỹ, vui lòng chọn mức "2 – Không đồng ý" cho câu này."</em> Đặt nó lẫn trong một khối Likert ở nửa sau phiếu, không đặt ở câu đầu hay câu cuối. Đáp án đúng nên là một mức không nằm ở hai đầu thang và không phải mức giữa: người chọn cùng một cột cho cả khối, dù là cột đầu, cột cuối hay cột giữa, đều sẽ trượt. Đây cũng là cách câu AC1 trong <a href="/cong-cu/bo-khao-sat/">Bộ khảo sát</a> được viết. Oppenheimer và cộng sự (2009) gọi dạng câu này là instructional manipulation check.</p>
<p>Một vài lưu ý:</p>
<ul>
<li>Dùng 1–2 câu cho một form, đủ để bắt người không đọc mà không làm đáp viên khó chịu.</li>
<li>Nếu rất nhiều người trượt, nhiều khả năng câu của bạn viết khó hiểu. Xem lại câu chữ trước khi loại hàng loạt.</li>
<li>Với 1 câu kiểm tra (như AC1), trượt là loại. Với 2 câu, loại khi trượt cả hai; trượt một câu thì gắn flag và xét cùng các tiêu chí khác.</li>
</ul>

<h2>4. Câu hỏi đảo chiều trả lời ngược logic</h2>
<p>Thang đo tốt thường có vài câu đảo chiều. Ví dụ trong một thang đo hài lòng công việc (xem các thang đo thật ở <a href="/thang-do/hai-long-cong-viec/">trang thang đo hài lòng công việc</a>):</p>
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
<p>Khi thiết kế bảng hỏi, hãy đánh dấu sẵn các cặp câu có thể đối chiếu. Lúc lọc, viết công thức <code>IF</code> cho từng cặp. Câu tự luận cũng cần đọc lướt: câu trả lời vô nghĩa ("abc", "ok", "không biết" cho mọi câu) hoặc lạc đề là dấu hiệu rõ. Câu tự luận còn có một vấn đề mới là văn bản do AI viết, xem bài <a href="/posts/phat-hien-cau-tra-loi-khao-sat-do-ai-viet/">phát hiện câu trả lời khảo sát do AI viết</a>.</p>

<h2>7. Hai chỉ số bổ sung: longstring và khoảng cách Mahalanobis</h2>
<p>Độ lệch chuẩn bằng 0 chỉ bắt được phiếu chọn y hệt nhau cho cả khối. Hai chỉ số dưới đây bắt được những dạng tinh vi hơn. Curran (2016) và Meade và Craig (2012) đều xếp chúng vào bộ công cụ phát hiện phản hồi bất cẩn.</p>
<h3>Longstring: chuỗi dài nhất các câu trả lời giống nhau liên tiếp</h3>
<p>Longstring đếm số câu liên tiếp dài nhất mà một người chọn cùng một mức, tính theo đúng thứ tự câu trên phiếu (Johnson, 2005). Một người chọn 4 cho 18 câu liền nhau rồi mới đổi sang 3 có độ lệch chuẩn khác 0, nhưng longstring bằng 18. Cú pháp SPSS cho 30 câu Likert đặt liền nhau từ Q1 đến Q30:</p>
<pre><code>VECTOR q = Q1 TO Q30.
COMPUTE run = 1.
COMPUTE longstr = 1.
LOOP #i = 2 TO 30.
  DO IF q(#i) = q(#i - 1).
    COMPUTE run = run + 1.
  ELSE.
    COMPUTE run = 1.
  END IF.
  COMPUTE longstr = MAX(longstr, run).
END LOOP.
EXECUTE.</code></pre>
<p>Chạy trên dữ liệu <strong>trước khi</strong> mã hoá ngược câu đảo chiều, vì người điền bừa chọn cùng một cột bất kể câu thuận hay nghịch. Không có ngưỡng chung cho mọi bảng hỏi. Cách làm thận trọng là vẽ biểu đồ tần suất của longstr, rồi gắn flag cho những phiếu tách hẳn khỏi phần còn lại, ví dụ có chuỗi dài bằng cả một khối Likert trở lên. Ghi ngưỡng bạn chọn vào chương 3.</p>
<h3>Khoảng cách Mahalanobis: tổ hợp câu trả lời bất thường</h3>
<p>Khoảng cách Mahalanobis đo mức một phiếu nằm xa trung tâm của cả mẫu khi xét tất cả các câu cùng lúc. Phiếu trả lời ngẫu nhiên thường có tổ hợp lạ, ví dụ rất đồng ý với câu thuận và cũng rất đồng ý với câu nghịch. Trong SPSS, vào <code>Analyze &gt; Regression &gt; Linear</code>, đưa một biến bất kỳ (ví dụ mã phiếu) vào Dependent, các câu Likert vào Independent(s), bấm <code>Save</code> và tích <code>Mahalanobis</code>. SPSS tạo biến MAH_1. Sau đó tính xác suất theo phân phối chi bình phương với bậc tự do bằng số câu:</p>
<pre><code>COMPUTE p_mah = 1 - CDF.CHISQ(MAH_1, 30).
EXECUTE.</code></pre>
<p>Phiếu có p_mah dưới 0,001 là ngoại lai đa biến theo ngưỡng của Tabachnick và Fidell (2013). Lưu ý rằng một người thật có quan điểm khác số đông cũng có thể bị gắn cờ, nên chỉ dùng chỉ số này như một flag, không loại phiếu chỉ vì nó.</p>

<h2>Bảng tổng hợp tiêu chí</h2>
<table>
<thead>
<tr><th>Loại</th><th>Cách kiểm tra</th><th>Mức độ</th><th>Gợi ý xử lý</th></tr>
</thead>
<tbody>
<tr><td>Không qua câu gạn lọc</td><td>Lọc theo đáp án loại</td><td>Chắc chắn</td><td>Loại</td></tr>
<tr><td>Trùng lặp</td><td>Trùng định danh hoặc trùng toàn bộ dòng</td><td>Chắc chắn</td><td>Giữ phiếu đầu, loại phần còn lại</td></tr>
<tr><td>Trượt câu kiểm tra chú ý</td><td>So với đáp án đúng</td><td>Mạnh</td><td>Có 1 câu: trượt là loại. Có 2 câu: loại khi trượt cả hai</td></tr>
<tr><td>Quá nhanh</td><td>Thời lượng so với số câu và trung vị</td><td>Trung bình</td><td>Loại khi kèm một tiêu chí khác</td></tr>
<tr><td>Rập khuôn</td><td>Độ lệch chuẩn từng khối bằng 0</td><td>Trung bình</td><td>Loại khi rập khuôn hầu hết các khối</td></tr>
<tr><td>Đảo chiều lệch logic</td><td>So cặp câu thuận và nghịch</td><td>Trung bình</td><td>Loại khi nhiều cặp cùng lệch</td></tr>
<tr><td>Mâu thuẫn nội dung</td><td>Công thức IF cho từng cặp câu</td><td>Tuỳ trường hợp</td><td>Đọc lại cả phiếu rồi quyết định</td></tr>
<tr><td>Longstring cao</td><td>Chuỗi dài nhất cùng một mức, theo thứ tự câu</td><td>Trung bình</td><td>Flag, xét cùng tiêu chí khác</td></tr>
<tr><td>Mahalanobis p &lt; 0,001</td><td>Khoảng cách đa biến so với cả mẫu</td><td>Yếu</td><td>Flag, không loại nếu chỉ có tiêu chí này</td></tr>
</tbody>
</table>

<p>Làm thủ công cho 300 phiếu mất vài buổi tối. Đây là lúc cách thu mẫu ảnh hưởng trực tiếp tới khối lượng việc lọc.</p>

<p>Nếu dùng nền tảng thu mẫu có trả thưởng, hãy hỏi họ xử lý phiếu kém chất lượng thế nào: có tự gắn cờ phiếu điền rập khuôn, phiếu mâu thuẫn hay câu tự luận do AI viết không, và bạn có phải trả tiền cho phiếu bị loại không. Dù vậy, bạn vẫn nên tự chạy quy trình dưới đây trên file xuất ra.</p>

<h2>Quy trình 8 bước trước khi chạy SPSS</h2>
<ol>
<li>Xuất dữ liệu, lưu một bản gốc chỉ đọc.</li>
<li>Loại phiếu không đạt câu gạn lọc (sai đối tượng).</li>
<li>Loại phiếu trùng lặp.</li>
<li>Tạo cột flag cho: trượt câu kiểm tra, quá nhanh, rập khuôn, longstring cao, đảo chiều lệch, mâu thuẫn, Mahalanobis. Mỗi cột ghi 0 hoặc 1. Các cột flag này nên có sẵn tên trong <a href="/posts/bang-ma-hoa-thang-do/">bảng mã hoá</a>.</li>
<li>Loại phiếu trượt câu kiểm tra chú ý theo quy tắc ở mục 3. Với các phiếu còn lại, cộng các cột flag: loại phiếu có tổng flag từ 2 trở lên, phiếu có đúng 1 flag thì đọc lại bằng mắt.</li>
<li>Mã hoá ngược các câu đảo chiều.</li>
<li>Kiểm tra cỡ mẫu còn lại so với yêu cầu. Nếu thiếu, thu thêm thay vì nới tiêu chí. Dùng <a href="/cong-cu/tinh-co-mau/">công cụ tính cỡ mẫu</a> để biết bạn cần bao nhiêu.</li>
<li>Chạy Cronbach's alpha trên dữ liệu sạch. Bạn có thể dán dữ liệu vào <a href="/cong-cu/cronbach-alpha/">công cụ tính Cronbach's alpha</a> để so sánh trước và sau khi lọc.</li>
</ol>
<p>Phần trượt câu kiểm tra chú ý, phiếu rập khuôn, mã hoá ngược câu đảo chiều và chạy alpha (bước 4, 6 và 8) có thể làm tự động bằng <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát</a>: công cụ ghi rõ số phiếu bị loại theo từng lý do để bạn đưa vào chương 4. Các tiêu chí còn lại như thời gian làm bài hay mâu thuẫn giữa các câu vẫn cần lọc tay theo bảng ở trên.</p>

<p>Các quy tắc rập khuôn, trả lời quá nhanh, trượt câu kiểm tra chú ý và phiếu trùng có sẵn trong <a href="/cong-cu/lam-sach-du-lieu/">công cụ làm sạch dữ liệu khảo sát Google Forms</a>: bạn khai báo ngưỡng trước, công cụ ghi lại phiếu nào bị loại vì lý do gì.</p>

<h2>Đoạn mẫu báo cáo phiếu bị loại trong chương 3</h2>
<p>Viết tiêu chí lọc ở chương 3 (phương pháp), còn số phiếu cụ thể bị loại theo từng lý do đưa vào mục 4.1 của chương 4. Ví dụ đoạn chương 3:</p>
<blockquote>Dữ liệu được làm sạch theo các tiêu chí xác định trước khi phân tích, dựa trên Meade và Craig (2012) và Curran (2016). Phiếu bị loại khi (1) không thuộc đối tượng khảo sát theo câu gạn lọc, (2) trùng lặp, (3) trả lời sai câu kiểm tra chú ý, hoặc (4) có từ hai dấu hiệu trả lời bất cẩn trở lên trong số: thời gian hoàn thành dưới 2 giây cho mỗi câu (Huang và cộng sự, 2012), chọn cùng một mức cho mọi câu của tất cả các khối Likert, chuỗi trả lời giống nhau dài hơn một khối, và trả lời mâu thuẫn ở các cặp câu đảo chiều.</blockquote>
<p>Ví dụ đoạn chương 4 tương ứng: "Thu về 402 phiếu. Sau khi loại 38 phiếu không thuộc đối tượng khảo sát, 29 phiếu trả lời sai câu kiểm tra chú ý và 12 phiếu chọn cùng một mức cho mọi phát biểu, còn lại 323 phiếu hợp lệ (80,3%)." Cách trình bày bảng tỉ lệ loại và đặc điểm mẫu có ở bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4 kết quả nghiên cứu</a>.</p>

<h2>Lọc bao nhiêu là vừa?</h2>
<p>Không có tỉ lệ chuẩn. Điều quan trọng là tiêu chí nhất quán và được báo cáo. Nếu bạn loại quá nửa mẫu, vấn đề nằm ở khâu thu mẫu hoặc bảng hỏi, và lọc mạnh tay hơn không giải quyết được.</p>
<p>Một mẹo cuối: chạy phân tích chính hai lần, với dữ liệu đầy đủ và dữ liệu đã lọc. Nếu kết luận giống nhau, bạn có thêm một đoạn kiểm tra độ vững cho chương kết quả. Nếu khác nhau, đó là bằng chứng cho thấy việc lọc là cần thiết.</p>
<p>Cách tốt nhất để lọc ít là thiết kế bảng hỏi tốt từ đầu: ngắn vừa đủ, câu rõ nghĩa, có sẵn câu kiểm tra và câu đối chiếu. Xem thêm <a href="/posts/cach-thiet-ke-bang-hoi/">cách thiết kế bảng hỏi khảo sát</a>.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Curran, P. G. (2016). Methods for the detection of carelessly invalid responses in survey data. <em>Journal of Experimental Social Psychology, 66</em>, 4–19. https://doi.org/10.1016/j.jesp.2015.07.006</li>
<li>Huang, J. L., Curran, P. G., Keeney, J., Poposki, E. M., &amp; DeShon, R. P. (2012). Detecting and deterring insufficient effort responding to surveys. <em>Journal of Business and Psychology, 27</em>(1), 99–114. https://doi.org/10.1007/s10869-011-9231-8</li>
<li>Johnson, J. A. (2005). Ascertaining the validity of individual protocols from Web-based personality inventories. <em>Journal of Research in Personality, 39</em>(1), 103–129. https://doi.org/10.1016/j.jrp.2004.09.009</li>
<li>Meade, A. W., &amp; Craig, S. B. (2012). Identifying careless responses in survey data. <em>Psychological Methods, 17</em>(3), 437–455. https://doi.org/10.1037/a0028085</li>
<li>Oppenheimer, D. M., Meyvis, T., &amp; Davidenko, N. (2009). Instructional manipulation checks: Detecting satisficing to increase statistical power. <em>Journal of Experimental Social Psychology, 45</em>(4), 867–872. https://doi.org/10.1016/j.jesp.2009.03.009</li>
<li>Tabachnick, B. G., &amp; Fidell, L. S. (2013). <em>Using multivariate statistics</em> (6th ed.). Pearson.</li>
</ul>
