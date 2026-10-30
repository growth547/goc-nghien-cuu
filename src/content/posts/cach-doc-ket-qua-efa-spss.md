---
title: "Phân tích EFA trong SPSS: đọc KMO, Bartlett, ma trận xoay"
description: "Phân tích EFA trong SPSS và đọc kết quả từng bảng: KMO, Bartlett, Communalities, phương sai trích, ma trận xoay, xử lý biến tải chéo, ngưỡng có nguồn."
pubDatetime: 2026-10-30T01:05:00+07:00
modDatetime: 2026-10-30T09:06:28+07:00
featured: false
tags: ["EFA","SPSS","phân tích dữ liệu"]
---

<p>Kết quả EFA trong SPSS đọc theo bốn bảng: KMO and Bartlett's Test (KMO từ 0,5 theo Kaiser, 1974, Bartlett có Sig. dưới 0,05), Communalities, Total Variance Explained và Rotated Component Matrix. Không có SPSS thì chạy EFA bằng <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát online</a>.</p>

<p>Chạy EFA trong SPSS mất một phút; phần khó là đọc kết quả và quyết định giữ hay bỏ biến, nhất là biến tải lên hai nhân tố. Bài này đi qua từng bảng theo thứ tự nên đọc, nói rõ ngưỡng nào đến từ đâu, chỗ nào chỉ là quy ước, và kết thúc bằng đoạn văn mẫu cho chương 4. Ví dụ xuyên suốt: 16 biến quan sát của năm nhân tố độc lập trong mô hình ý định dùng ứng dụng giao đồ ăn, mẫu 320 phiếu (số liệu minh hoạ).</p>

<h2>Trước khi chạy: thiết lập trong SPSS</h2>
<p><strong>Analyze</strong>, <strong>Dimension Reduction</strong>, <strong>Factor</strong>. Đưa các biến quan sát của biến độc lập vào ô Variables, rồi:</p>
<ul>
<li><strong>Descriptives</strong>: tích <em>KMO and Bartlett's test of sphericity</em>. Tích thêm <em>Anti-image</em> nếu muốn xem chỉ số MSA của từng biến.</li>
<li><strong>Extraction</strong>: phần lớn khoá luận ở Việt Nam dùng <em>Principal components</em> và giữ nhân tố có eigenvalue lớn hơn 1. Nếu giảng viên yêu cầu <em>Principal axis factoring</em>, kết hợp với phép xoay Promax (xem phần câu hỏi thường gặp).</li>
<li><strong>Rotation</strong>: <em>Varimax</em> (đi với Principal components) hoặc <em>Promax</em> (đi với Principal axis factoring).</li>
<li><strong>Options</strong>: tích <em>Sorted by size</em> và <em>Suppress small coefficients</em>, đặt <em>Absolute value below</em> là 0,3. Đây chỉ là ẩn bớt số cho dễ đọc, không ảnh hưởng kết quả.</li>
</ul>
<p>Chạy Cronbach's alpha trước và loại các biến có tương quan biến tổng thấp (xem bài <a href="/posts/cronbach-alpha-la-gi/">Cronbach's alpha là gì</a>). Câu đảo chiều phải được đảo điểm trước, nếu không chúng sẽ có hệ số tải âm. Biến phụ thuộc thường được chạy EFA riêng ở bước sau.</p>

<h2>Bảng 1: KMO and Bartlett's Test</h2>
<p>Bảng này trả lời câu hỏi: dữ liệu có đủ tương quan để phân tích nhân tố không?</p>
<h3>KMO (Kaiser-Meyer-Olkin Measure of Sampling Adequacy)</h3>
<p>KMO so sánh độ lớn của tương quan giữa các biến với tương quan riêng phần, nhận giá trị từ 0 đến 1. Kaiser (1974) đưa ra thang đánh giá:</p>
<table>
<thead><tr><th>KMO</th><th>Đánh giá của Kaiser (1974)</th></tr></thead>
<tbody>
<tr><td>Từ 0,90</td><td>Tuyệt vời (marvelous)</td></tr>
<tr><td>0,80 đến dưới 0,90</td><td>Rất tốt (meritorious)</td></tr>
<tr><td>0,70 đến dưới 0,80</td><td>Trung bình (middling)</td></tr>
<tr><td>0,60 đến dưới 0,70</td><td>Tầm thường (mediocre)</td></tr>
<tr><td>0,50 đến dưới 0,60</td><td>Kém (miserable)</td></tr>
<tr><td>Dưới 0,50</td><td>Không chấp nhận được</td></tr>
</tbody>
</table>
<p>Ngưỡng tối thiểu hay được trích là 0,5 (Hair và cộng sự, 2010). Đây là điều kiện <em>cần</em> để tiếp tục, không phải bằng chứng thang đo tốt.</p>
<p>Nếu KMO tổng thấp, mở bảng <em>Anti-image Matrices</em> và xem đường chéo của phần <em>Anti-image Correlation</em> (giá trị có chữ "a"). Đó là MSA của từng biến. Biến có MSA dưới 0,5 nên được xem xét loại, từng biến một, bắt đầu từ biến có MSA thấp nhất (Hair và cộng sự, 2010). Cách tính KMO, MSA bằng tay và vì sao biến yếu vẫn có thể có MSA cao được giải thích ở bài <a href="/posts/kmo-va-bartlett-la-gi/">KMO và Bartlett là gì</a>.</p>
<h3>Bartlett's Test of Sphericity</h3>
<p>Kiểm định giả thuyết ma trận tương quan là ma trận đơn vị, tức các biến không tương quan với nhau (Bartlett, 1954). Sig. nhỏ hơn 0,05 thì bác bỏ giả thuyết này, dữ liệu phù hợp để phân tích nhân tố. Với cỡ mẫu vài trăm, Bartlett gần như luôn có ý nghĩa, nên nó ít khi là vấn đề. KMO thông tin hơn.</p>
<p>SPSS hiển thị Sig. = .000. Khi viết, ghi <em>p</em> &lt; 0,001, không ghi "p = 0,000", vì xác suất không bao giờ bằng 0 tuyệt đối.</p>
<p><strong>Ví dụ:</strong> KMO = 0,861; Bartlett χ² = 2.914,6; df = 120; Sig. = .000. df = 16 × 15 / 2 = 120, đúng với 16 biến. Kết luận: dữ liệu phù hợp để phân tích nhân tố.</p>

<p>KMO dưới 0,5 hoặc Bartlett không có ý nghĩa thì chưa nên đọc tiếp các bảng sau. Nhập con số vào <a href="/cong-cu/bac-si-ket-qua/">bác sĩ kết quả</a> để xem nguyên nhân thường gặp và cách xử lý hợp lệ; ngưỡng KMO, hệ số tải và nguồn trích dẫn có ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận Cronbach, KMO, AVE, HTMT</a>.</p>

<h2>Bảng 2: Communalities</h2>
<p>Cột <em>Extraction</em> cho biết bao nhiêu phần phương sai của mỗi biến được các nhân tố trích giải thích. Hair và cộng sự (2010) coi biến có communality dưới 0,5 là chưa được giải thích đủ. Đây không phải lệnh loại biến ngay, mà là dấu hiệu để xem kỹ biến đó trong ma trận xoay.</p>

<h2>Bảng 3: Total Variance Explained</h2>
<p>Bảng này có ba nhóm cột: <em>Initial Eigenvalues</em>, <em>Extraction Sums of Squared Loadings</em> và <em>Rotation Sums of Squared Loadings</em>. Đọc như sau:</p>
<ol>
<li><strong>Số nhân tố trích:</strong> đếm số dòng có eigenvalue (cột Total của Initial Eigenvalues) lớn hơn 1. Đây là tiêu chí Kaiser (1960).</li>
<li><strong>Tổng phương sai trích:</strong> đọc cột <em>Cumulative %</em> tại dòng của nhân tố cuối cùng được trích, ở nhóm Extraction Sums.</li>
<li><strong>Đối chiếu với lý thuyết:</strong> số nhân tố trích có bằng số khái niệm trong mô hình không?</li>
</ol>
<p><strong>Ngưỡng tổng phương sai trích.</strong> Các khoá luận ở Việt Nam thường dùng mức từ 50% trở lên. Hair và cộng sự (2010) viết rằng trong khoa học xã hội, một lời giải giải thích khoảng 60% tổng phương sai, đôi khi ít hơn, thường được coi là thoả đáng. Nên viết "đạt mức từ 50% trở lên" và nếu bạn đạt trên 60%, nêu thêm điều đó.</p>
<p><strong>Ví dụ:</strong> 5 nhân tố có eigenvalue lớn hơn 1, nhân tố thứ năm có eigenvalue 1,124, tổng phương sai trích 71,4%. Số nhân tố khớp với 5 khái niệm độc lập trong mô hình.</p>
<h3>Khi số nhân tố không khớp mô hình</h3>
<p>Tiêu chí eigenvalue lớn hơn 1 có xu hướng trích thừa nhân tố khi có nhiều biến, và trích thiếu khi có ít biến (Costello &amp; Osborne, 2005; Fabrigar và cộng sự, 1999). Nếu kết quả lệch so với mô hình:</p>
<ul>
<li><strong>Thừa một nhân tố:</strong> thường là hai, ba biến của một khái niệm tách ra thành nhân tố riêng. Xem nội dung các câu đó: có phải chúng đo một khía cạnh khác, hoặc cùng là câu đảo chiều? Nếu là câu đảo chiều tách nhóm, đó là hiện tượng phổ biến do cách diễn đạt, không nhất thiết là khái niệm mới.</li>
<li><strong>Thiếu một nhân tố:</strong> hai khái niệm gộp làm một. Kiểm tra xem về lý thuyết chúng có gần nhau không (ví dụ hiệu quả kỳ vọng và nỗ lực kỳ vọng ở người dùng thành thạo).</li>
<li><strong>Kiểm tra bằng cách khác:</strong> xem Scree plot (điểm gãy của đường), hoặc phân tích song song (parallel analysis) của Horn (1965), được nhiều tác giả đánh giá chính xác hơn tiêu chí Kaiser.</li>
<li><strong>Có thể ép số nhân tố</strong> bằng <em>Fixed number of factors</em>, kèm giải thích trong bài.</li>
</ul>

<h2>Bảng 4: Rotated Component Matrix</h2>
<p>Đây là bảng quyết định. Mỗi dòng là một biến, mỗi cột là một nhân tố, số trong ô là hệ số tải (factor loading): tương quan giữa biến và nhân tố. Đọc theo từng dòng:</p>
<ol>
<li>Biến tải mạnh nhất lên nhân tố nào? Có đúng nhân tố của khái niệm nó thuộc về không?</li>
<li>Hệ số tải đó có đạt ngưỡng không?</li>
<li>Biến có tải đáng kể lên một nhân tố thứ hai không (tải chéo)?</li>
</ol>
<h3>Ngưỡng hệ số tải</h3>
<p>Hair và cộng sự (2010) đưa ra hai cách nhìn. Về ý nghĩa thực tiễn: ±0,30 đến ±0,40 là mức tối thiểu để diễn giải, từ ±0,50 là có ý nghĩa thực tiễn, từ ±0,70 là cấu trúc rõ ràng. Về ý nghĩa thống kê, ngưỡng phụ thuộc cỡ mẫu (với power 80%, α = 0,05):</p>
<table>
<thead><tr><th>Hệ số tải</th><th>Cỡ mẫu cần thiết</th></tr></thead>
<tbody>
<tr><td>0,30</td><td>350</td></tr>
<tr><td>0,35</td><td>250</td></tr>
<tr><td>0,40</td><td>200</td></tr>
<tr><td>0,45</td><td>150</td></tr>
<tr><td>0,50</td><td>120</td></tr>
<tr><td>0,55</td><td>100</td></tr>
<tr><td>0,60</td><td>85</td></tr>
<tr><td>0,65</td><td>70</td></tr>
<tr><td>0,70</td><td>60</td></tr>
<tr><td>0,75</td><td>50</td></tr>
</tbody>
</table>
<p>Phần lớn khoá luận dùng ngưỡng 0,5 bất kể cỡ mẫu, vì nó vừa có ý nghĩa thực tiễn vừa an toàn với mẫu từ 120 trở lên. Chọn một ngưỡng, ghi rõ trong chương 3 kèm nguồn, và áp dụng nhất quán.</p>
<h3>Hệ số tải âm</h3>
<p>Hệ số tải âm lớn trong khi các biến cùng nhóm dương gần như chắc chắn là câu đảo chiều chưa đảo điểm. Quay lại bước mã hoá, đừng loại biến. Xem bài <a href="/posts/bang-ma-hoa-thang-do/">bảng mã hoá thang đo</a>.</p>

<p>Sau khi loại biến khỏi EFA, chạy lại độ tin cậy cho khái niệm đó bằng <a href="/cong-cu/cronbach-alpha/">công cụ tính Cronbach's alpha online</a> để có bảng lần 1, lần 2 đặt cạnh nhau trong chương 4.</p>

<h2>Biến tải chéo: xử lý từng bước</h2>
<p>Biến tải chéo là biến có hệ số tải đáng kể lên hai nhân tố trở lên. Nó cho thấy người trả lời không phân biệt rõ câu đó thuộc khái niệm nào, làm yếu giá trị phân biệt. Hair và cộng sự (2010) coi biến tải chéo là ứng viên để loại. Quy trình hợp lý:</p>
<ol>
<li><strong>Xác định mức chênh.</strong> Tính hiệu giữa hệ số tải lớn nhất và hệ số tải lớn thứ hai của biến. Nhiều khoá luận ở Việt Nam dùng quy ước: nếu hiệu nhỏ hơn 0,3, biến bị coi là tải chéo và cân nhắc loại. Đây là quy ước thực hành phổ biến, không phải ngưỡng trong Hair và cộng sự (2010). Nhiều khoá luận dẫn quy ước này về Jabnoun và Al-Tamimi (2003), một nghiên cứu về chất lượng dịch vụ ngân hàng ở UAE; chúng tôi chưa đối chiếu được câu chữ trong bài gốc nên không khẳng định bài đó đặt ra mốc 0,3. Nếu dùng, hãy viết "theo quy ước thực hành" và chỉ dẫn nguồn sau khi bạn đã tự đọc bài gốc hoặc tài liệu tiếng Việt mà bạn theo.</li>
<li><strong>Đọc lại nội dung câu.</strong> Câu có hai ý không? Có từ ngữ gần với khái niệm kia không? Ví dụ "Ứng dụng dễ dùng nên giúp tôi đặt món nhanh hơn" vừa đo sự dễ dùng vừa đo hiệu quả. Lý do về nội dung giúp bạn bảo vệ quyết định trước hội đồng.</li>
<li><strong>Loại từng biến một.</strong> Loại biến có vấn đề nặng nhất trước (chênh lệch nhỏ nhất, hoặc hệ số tải chính thấp nhất), rồi chạy lại EFA. Loại một biến có thể làm biến khác hết tải chéo.</li>
<li><strong>Giữ tối thiểu 3 biến mỗi nhân tố.</strong> Nhân tố dưới 3 biến thường yếu và không ổn định (Costello &amp; Osborne, 2005). Nếu loại tiếp sẽ còn 2 biến, cân nhắc giữ biến tải chéo nhẹ và nêu trong phần hạn chế.</li>
<li><strong>Ghi lại mọi lần chạy.</strong> Chương 4 cần bảng tóm tắt: lần chạy, biến loại, lý do, KMO và tổng phương sai trích sau mỗi lần.</li>
</ol>
<p><strong>Ví dụ:</strong> ở lần 1, EE4 tải 0,52 lên nhân tố nỗ lực kỳ vọng và 0,47 lên nhân tố hiệu quả kỳ vọng, chênh 0,05. Nội dung "Tôi có thể dễ dàng trở nên thành thạo..." gần với cả hai ý. Loại EE4, chạy lại với 15 biến.</p>
<table>
<thead><tr><th>Lần chạy</th><th>Số biến</th><th>KMO</th><th>Bartlett</th><th>Số nhân tố</th><th>Phương sai trích</th><th>Biến loại</th></tr></thead>
<tbody>
<tr><td>1</td><td>16</td><td>0,861</td><td>p &lt; 0,001</td><td>5</td><td>71,4%</td><td>EE4 (tải chéo)</td></tr>
<tr><td>2</td><td>15</td><td>0,855</td><td>p &lt; 0,001</td><td>5</td><td>72,8%</td><td>Không</td></tr>
</tbody>
</table>
<h3>Biến tải lên sai nhân tố</h3>
<p>Nếu một biến nằm hẳn sang nhóm của khái niệm khác, hoặc loại biến vì nó không đo đúng khái niệm dự định, hoặc giữ và đặt lại tên nhân tố nếu lý thuyết cho phép. Cách thứ hai làm thay đổi mô hình, cần trao đổi với giảng viên.</p>

<h2>EFA cho biến phụ thuộc</h2>
<p>Chạy riêng với các biến của biến phụ thuộc (BI1, BI2, BI3). Kỳ vọng: KMO từ 0,5, Bartlett có ý nghĩa, trích đúng 1 nhân tố, phương sai trích từ 50%. Vì chỉ có một nhân tố, SPSS không xuất Rotated Component Matrix mà báo không thể xoay; đọc hệ số tải ở bảng <em>Component Matrix</em>. Một nhân tố cho thấy thang đo đơn hướng; giá trị hội tụ vẫn cần xem qua hệ số tải và độ tin cậy.</p>

<h2>Đoạn văn mẫu cho chương 4</h2>
<blockquote><p>Phân tích nhân tố khám phá được thực hiện với 16 biến quan sát của 5 nhân tố độc lập, sử dụng phương pháp trích Principal Components và phép xoay Varimax. Ở lần chạy thứ nhất, biến EE4 tải lên hai nhân tố với mức chênh lệch hệ số tải 0,05 nên bị loại. Kết quả lần chạy thứ hai với 15 biến cho thấy hệ số KMO = 0,855, thuộc mức rất tốt theo Kaiser (1974); kiểm định Bartlett có ý nghĩa thống kê (χ² = 2.701,3; df = 105; p &lt; 0,001), cho thấy dữ liệu phù hợp để phân tích nhân tố. Năm nhân tố có eigenvalue lớn hơn 1 được trích, giải thích 72,8% tổng phương sai. Tất cả biến quan sát có hệ số tải từ 0,5 trở lên trên nhân tố tương ứng (Hair và cộng sự, 2010) và không có biến tải chéo, các biến hội tụ đúng vào nhân tố đã đề xuất trong mô hình.</p></blockquote>
<p>df của Bartlett bằng k × (k − 1) / 2 với k là số biến; 15 biến cho df = 105.</p>
<p><a href="/cong-cu/phan-tich-du-lieu/">Công cụ phân tích dữ liệu</a> chạy EFA trên file Excel của bạn với Principal Components, Principal Axis Factoring hoặc Maximum Likelihood và phép xoay Varimax, Promax hoặc Direct Oblimin theo đúng quy ước của SPSS, xuất KMO, Bartlett, ma trận xoay (Pattern Matrix và Structure Matrix khi xoay xiên), đánh dấu biến có hệ số tải dưới 0,5 và biến tải từ 0,3 trở lên trên hơn một nhân tố, kèm đoạn văn viết sẵn để bạn đối chiếu với SPSS.</p>

<h2>Lỗi thường gặp</h2>
<table>
<thead><tr><th>Lỗi</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>Viết "KMO = 0,6 nên thang đo đạt giá trị hội tụ"</td><td>KMO chỉ cho biết dữ liệu phù hợp để chạy EFA; giá trị hội tụ xem ở hệ số tải</td></tr>
<tr><td>Loại cùng lúc nhiều biến tải chéo</td><td>Loại từng biến, chạy lại sau mỗi lần</td></tr>
<tr><td>Ghi "Sig. = 0,000"</td><td>Ghi p &lt; 0,001</td></tr>
<tr><td>Đọc Cumulative % ở cột Initial thay vì Extraction</td><td>Với Principal Components hai cột giống nhau; với Principal axis factoring phải đọc cột Extraction</td></tr>
<tr><td>Chạy EFA trước khi đảo điểm câu đảo chiều</td><td>Đảo điểm trước, hệ số tải âm sẽ biến mất</td></tr>
<tr><td>Đặt ngưỡng 0,5 ở Suppress rồi kết luận "không có tải chéo"</td><td>Đặt Suppress ở 0,3 để thấy được hệ số tải phụ</td></tr>
</tbody>
</table>

<h2>Câu hỏi thường gặp</h2>
<h3>Nên dùng Principal Components với Varimax hay Principal Axis Factoring với Promax?</h3>
<p>Về lý thuyết, Principal Components là phương pháp giảm chiều chứ không phải phân tích nhân tố theo nghĩa hẹp, và các khái niệm trong mô hình hành vi thường tương quan với nhau, nên Principal Axis Factoring kết hợp phép xoay xiên như Promax được nhiều tác giả khuyến nghị (Costello &amp; Osborne, 2005; Fabrigar và cộng sự, 1999). Trong thực hành khoá luận ở Việt Nam, Principal Components với Varimax vẫn phổ biến. Theo yêu cầu của giảng viên, và nêu rõ lựa chọn trong chương 3. Nếu dùng Promax, đọc <em>Pattern Matrix</em> thay cho Rotated Component Matrix.</p>
<h3>Chạy EFA chung tất cả biến hay tách biến độc lập, biến phụ thuộc?</h3>
<p>Với mô hình hồi quy, cách phổ biến là tách: một lần cho biến độc lập, một lần cho biến phụ thuộc, vì mục tiêu là kiểm tra cấu trúc của từng nhóm. Chạy chung cũng được chấp nhận nếu bạn muốn kiểm tra biến phụ thuộc có tách biệt với các biến độc lập không. Chọn một cách và giải thích.</p>
<h3>Đã chạy PLS-SEM thì có cần EFA không?</h3>
<p>Không bắt buộc, vì mô hình đo lường trong PLS-SEM đã đánh giá hệ số tải, độ tin cậy, giá trị hội tụ và phân biệt (Hair và cộng sự, 2019). Một số giảng viên vẫn yêu cầu EFA như bước sơ bộ; khi đó báo cáo ngắn gọn.</p>
<h3>Loại biến ở EFA có cần chạy lại Cronbach's alpha không?</h3>
<p>Có, cho nhân tố bị loại biến hoặc bị gộp, tách. Báo cáo alpha cuối cùng, cách đọc ở bài <a href="/posts/cronbach-alpha-la-gi/">Cronbach's alpha là gì</a>.</p>
<h3>Cỡ mẫu bao nhiêu thì chạy được EFA?</h3>
<p>Quy tắc hay dùng là ít nhất 5 quan sát cho mỗi biến, tốt hơn là 10 (Hair và cộng sự, 2010). Với 16 biến như ví dụ, tối thiểu 80, tốt hơn 160. Bảng so sánh với CFA và các phương pháp khác ở bài <a href="/posts/co-mau-nghien-cuu-bao-nhieu-la-du/">cỡ mẫu nghiên cứu bao nhiêu là đủ</a>, tính nhanh bằng <a href="/cong-cu/tinh-co-mau/">máy tính cỡ mẫu</a>. Các biến trong ví dụ lấy từ <a href="/thang-do/utaut2/">thang đo UTAUT2</a>.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Bartlett, M. S. (1954). A note on the multiplying factors for various χ² approximations. <em>Journal of the Royal Statistical Society: Series B (Methodological), 16</em>(2), 296–298. https://doi.org/10.1111/j.2517-6161.1954.tb00174.x</li>
<li>Costello, A. B., &amp; Osborne, J. W. (2005). Best practices in exploratory factor analysis: Four recommendations for getting the most from your analysis. <em>Practical Assessment, Research, and Evaluation, 10</em>, Article 7.</li>
<li>Fabrigar, L. R., Wegener, D. T., MacCallum, R. C., &amp; Strahan, E. J. (1999). Evaluating the use of exploratory factor analysis in psychological research. <em>Psychological Methods, 4</em>(3), 272–299. https://doi.org/10.1037/1082-989X.4.3.272</li>
<li>Hair, J. F., Black, W. C., Babin, B. J., &amp; Anderson, R. E. (2010). <em>Multivariate data analysis</em> (7th ed.). Pearson Prentice Hall.</li>
<li>Hair, J. F., Risher, J. J., Sarstedt, M., &amp; Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review, 31</em>(1), 2–24. https://doi.org/10.1108/EBR-11-2018-0203</li>
<li>Horn, J. L. (1965). A rationale and test for the number of factors in factor analysis. <em>Psychometrika, 30</em>(2), 179–185. https://doi.org/10.1007/BF02289447</li>
<li>Jabnoun, N., &amp; Al-Tamimi, H. A. H. (2003). Measuring perceived service quality at UAE commercial banks. <em>International Journal of Quality &amp; Reliability Management, 20</em>(4), 458–472. https://doi.org/10.1108/02656710310468614</li>
<li>Kaiser, H. F. (1960). The application of electronic computers to factor analysis. <em>Educational and Psychological Measurement, 20</em>(1), 141–151. https://doi.org/10.1177/001316446002000116</li>
<li>Kaiser, H. F. (1974). An index of factorial simplicity. <em>Psychometrika, 39</em>(1), 31–36. https://doi.org/10.1007/BF02291575</li>
</ul>
