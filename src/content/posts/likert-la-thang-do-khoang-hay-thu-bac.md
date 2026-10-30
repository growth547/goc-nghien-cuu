---
title: "Likert là thang đo khoảng cách hay thứ bậc? Trả lời có nguồn"
description: "Likert là thang đo khoảng cách hay thứ bậc: phân biệt câu Likert và thang Likert, khi nào được tính trung bình, chạy t-test, hồi quy, SEM, kèm câu mẫu chương 3."
pubDatetime: 2026-10-30T02:31:00+07:00
featured: false
tags: ["thang đo","SPSS","khoá luận"]
---

<p>Câu trả lời ngắn: một câu hỏi Likert đơn lẻ là dữ liệu thứ bậc (ordinal). Điểm trung bình của nhiều câu Likert cùng đo một khái niệm thường được xử lý như dữ liệu khoảng (interval), và phần lớn các nghiên cứu phương pháp cho thấy cách làm này cho kết quả đáng tin trong các tình huống khoá luận hay gặp. Hai ý này không mâu thuẫn, vì chúng nói về hai đối tượng khác nhau. Bài này giải thích vì sao, khi nào cách xử lý "như khoảng" có rủi ro, và viết vào chương 3 thế nào để hội đồng không bắt lỗi.</p>

<h2>Bốn cấp độ đo của Stevens</h2>
<p>Cách phân loại định danh, thứ bậc, khoảng, tỉ lệ đến từ Stevens (1946). Mỗi cấp cho phép một nhóm phép toán khác nhau:</p>
<table>
<thead><tr><th>Cấp độ</th><th>Thông tin có trong con số</th><th>Ví dụ trong khảo sát</th><th>Thống kê mô tả phù hợp</th></tr></thead>
<tbody>
<tr><td>Định danh (nominal)</td><td>Chỉ phân loại</td><td>Giới tính, ngành học, ngân hàng đang dùng</td><td>Tần suất, mode</td></tr>
<tr><td>Thứ bậc (ordinal)</td><td>Phân loại và thứ tự</td><td>Năm học (1, 2, 3, 4), mức thu nhập theo khoảng, một câu Likert</td><td>Thêm trung vị, phân vị</td></tr>
<tr><td>Khoảng (interval)</td><td>Thứ tự và khoảng cách bằng nhau giữa các mức</td><td>Nhiệt độ °C, điểm tổng của một thang đo nhiều câu (khi chấp nhận giả định)</td><td>Thêm trung bình, độ lệch chuẩn</td></tr>
<tr><td>Tỉ lệ (ratio)</td><td>Có điểm 0 tuyệt đối</td><td>Tuổi, số lần mua hàng trong tháng, thời gian dùng ứng dụng mỗi ngày</td><td>Mọi phép toán, kể cả tỉ số</td></tr>
</tbody>
</table>
<p>Một câu Likert như "Tôi hài lòng với ứng dụng này" với 5 mức từ "Hoàn toàn không đồng ý" đến "Hoàn toàn đồng ý" chắc chắn có thứ tự. Điều không chắc là khoảng cách tâm lý giữa "Không đồng ý" và "Trung lập" có bằng khoảng cách giữa "Đồng ý" và "Hoàn toàn đồng ý" hay không. Người trả lời không được hỏi điều đó, nên dữ liệu không chứng minh được điều đó. Đây là gốc của tranh luận.</p>

<h2>Câu Likert khác thang Likert</h2>
<p>Carifio và Perla (2007, 2008) chỉ ra rằng phần lớn tranh cãi đến từ việc gộp hai khái niệm:</p>
<ul>
<li><strong>Câu Likert (Likert item, Likert-type item)</strong>: một câu hỏi với các mức trả lời có thứ tự. Ví dụ HL1 trong thang đo sự hài lòng.</li>
<li><strong>Thang Likert (Likert scale)</strong>: tập hợp nhiều câu cùng đo một khái niệm, được cộng hoặc lấy trung bình thành một điểm. Ví dụ HL là trung bình của HL1 đến HL4. Đây mới là thứ Likert (1932) thiết kế: ông đề xuất cộng điểm nhiều câu để đo thái độ, không phân tích từng câu riêng lẻ.</li>
</ul>
<p>Lập luận của Carifio và Perla: câu đơn lẻ nên được xem là thứ bậc, còn điểm tổng hợp của nhiều câu có tính chất gần với khoảng hơn nhiều, vì sai số đo của từng câu bù trừ cho nhau và số giá trị có thể có tăng lên.</p>

<h3>Ví dụ tính tay: vì sao điểm tổng hợp "liên tục" hơn</h3>
<p>Thang đo sự hài lòng có 4 câu, mỗi câu 5 mức. Một câu đơn chỉ nhận 5 giá trị: 1, 2, 3, 4, 5. Điểm trung bình của 4 câu nhận tổng từ 4 đến 20, tức 17 giá trị khác nhau: 1,00; 1,25; 1,50; ... ; 5,00. Với thang 6 câu, con số là 25 giá trị. Ba người trả lời:</p>
<table>
<thead><tr><th>Người</th><th>HL1</th><th>HL2</th><th>HL3</th><th>HL4</th><th>Trung bình HL</th></tr></thead>
<tbody>
<tr><td>A</td><td>4</td><td>4</td><td>3</td><td>4</td><td>3,75</td></tr>
<tr><td>B</td><td>4</td><td>5</td><td>4</td><td>4</td><td>4,25</td></tr>
<tr><td>C</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2,50</td></tr>
</tbody>
</table>
<p>Ở cấp từng câu, A và B "bằng nhau" ở HL1. Ở cấp điểm tổng hợp, sự khác biệt giữa họ hiện ra rõ hơn. Đây là lý do mọi phép tính trung bình, tương quan, hồi quy trong khoá luận nên làm trên biến tổng hợp, không trên từng câu.</p>

<h2>Hai phía của tranh luận</h2>
<h3>Phía "thứ bậc, dùng phi tham số"</h3>
<p>Jamieson (2004) viết trên <em>Medical Education</em> rằng dữ liệu Likert là thứ bậc, nên trung bình và độ lệch chuẩn không có ý nghĩa rõ ràng; nên dùng trung vị, tần suất và các kiểm định phi tham số như Mann-Whitney, Kruskal-Wallis. Lập luận này đúng về mặt lý thuyết đo lường khi áp vào một câu đơn lẻ.</p>
<h3>Phía "xử lý như khoảng được"</h3>
<p>Norman (2010) trả lời rằng các kiểm định tham số như t-test, ANOVA, tương quan Pearson và hồi quy rất bền (robust) trước vi phạm giả định về phân phối và cấp độ đo. Ông dẫn các nghiên cứu mô phỏng cho thấy kết quả gần như không đổi khi dữ liệu là Likert, kể cả với mẫu nhỏ và phân phối lệch. Sullivan và Artino (2013) đưa ra lời khuyên dung hoà: với câu đơn, báo cáo tần suất và trung vị; với thang đo nhiều câu, dùng trung bình và kiểm định tham số là chấp nhận được.</p>
<h3>Rủi ro có thật khi coi thứ bậc là khoảng</h3>
<p>Liddell và Kruschke (2018) phân tích lại nhiều bài báo tâm lý học và chỉ ra rằng phân tích dữ liệu thứ bậc bằng mô hình cho biến liên tục có thể gây ra ba loại sai: báo động giả (tìm thấy khác biệt không có thật), bỏ sót khác biệt có thật, và thậm chí đảo chiều kết luận. Rủi ro lớn nhất khi phân tích từng câu đơn lẻ, khi phân phối dồn về một đầu thang (ví dụ 70% chọn mức 5), và khi hai nhóm có phương sai rất khác nhau. Bài học thực tế: lập luận "tham số bền" của Norman không phải giấy phép cho mọi trường hợp.</p>

<h2>Bảng quyết định: phân tích nào, xử lý thế nào</h2>
<table>
<thead><tr><th>Việc bạn làm</th><th>Đối tượng</th><th>Cách xử lý dễ bảo vệ</th></tr></thead>
<tbody>
<tr><td>Mô tả từng câu trong chương 4</td><td>Câu đơn</td><td>Tần suất, tỉ lệ % từng mức; có thể kèm trung bình và độ lệch chuẩn để so sánh nhanh giữa các câu, ghi rõ là để tham khảo</td></tr>
<tr><td>Cronbach's alpha</td><td>Các câu trong một thang</td><td>Chạy bình thường; alpha dựa trên tương quan Pearson, là quy ước chung của mọi giáo trình</td></tr>
<tr><td>EFA trong SPSS</td><td>Các câu</td><td>Chạy bình thường với thang 5 mức trở lên; nếu thang chỉ 3 mức, cân nhắc ma trận tương quan polychoric (ngoài SPSS mặc định)</td></tr>
<tr><td>Tương quan, hồi quy</td><td>Biến tổng hợp</td><td>Pearson, OLS trên điểm trung bình các thang đo</td></tr>
<tr><td>So sánh nhóm (giới tính, năm học)</td><td>Biến tổng hợp</td><td>t-test, ANOVA; nếu phân phối rất lệch hoặc mẫu mỗi nhóm nhỏ, chạy thêm Mann-Whitney hoặc Kruskal-Wallis để đối chiếu</td></tr>
<tr><td>So sánh nhóm trên một câu đơn</td><td>Câu đơn</td><td>Ưu tiên Mann-Whitney, Kruskal-Wallis, hoặc Chi-bình phương trên bảng chéo</td></tr>
<tr><td>CFA, CB-SEM (AMOS)</td><td>Các câu</td><td>Với 5 mức trở lên và phân phối không quá lệch, ước lượng ML (có hiệu chỉnh) cho kết quả tương đương phương pháp cho biến thứ bậc; với 2 đến 4 mức, ưu tiên WLSMV (Rhemtulla và cộng sự, 2012)</td></tr>
<tr><td>PLS-SEM (SmartPLS)</td><td>Các câu</td><td>Xử lý như biến liên tục là thực hành chuẩn của phương pháp này</td></tr>
</tbody>
</table>
<p>Nếu bạn dùng <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu khảo sát</a> của Góc Nghiên Cứu, các bước tạo biến tổng hợp, Cronbach, EFA và hồi quy đã đi theo đúng thứ tự trên.</p>

<p>Nếu đề tài còn so sánh nhóm, hồi quy hay SEM, <a href="/cong-cu/chon-phuong-phap/">công cụ chọn phương pháp phân tích dữ liệu</a> gợi ý phép kiểm định phù hợp với loại biến và nêu giả định cần kiểm tra.</p>

<h2>Khai báo Measure trong SPSS</h2>
<p>Trong Variable View, cột Measure có ba lựa chọn: Scale, Ordinal, Nominal. Hai điều cần biết:</p>
<ol>
<li>Lựa chọn Measure không thay đổi phép tính của Regression, T-test hay Correlate. SPSS vẫn tính trung bình của biến Ordinal nếu bạn yêu cầu. Measure chủ yếu ảnh hưởng tới Chart Builder, Custom Tables và một số thủ tục tự chọn kiểm định.</li>
<li>Cách khai báo rõ ràng nhất: từng câu Likert (HL1, HL2...) để Ordinal; biến tổng hợp tính bằng Compute (HL = MEAN(HL1 TO HL4)) để Scale. Bảng mã hoá của bạn nên ghi đúng như vậy. Xem cách lập trong bài <a href="/posts/bang-ma-hoa-thang-do/">bảng mã hoá thang đo</a>.</li>
</ol>

<h2>Điều kiện để xử lý điểm tổng hợp như khoảng</h2>
<p>Không có ngưỡng chính thức, nhưng các điều kiện sau làm lập luận của bạn vững hơn. Mỗi điều đều kiểm tra được và ghi được vào chương 3 hoặc 4:</p>
<ul>
<li><strong>Thang có từ 5 mức trở lên.</strong> Rhemtulla và cộng sự (2012) cho thấy từ 5 mức, phương pháp cho biến liên tục hoạt động gần tương đương phương pháp cho biến thứ bậc trong mô hình SEM.</li>
<li><strong>Mỗi khái niệm đo bằng nhiều câu</strong>, thường từ 3 câu, và đạt độ tin cậy. Kiểm tra bằng <a href="/cong-cu/cronbach-alpha/">công cụ tính Cronbach's alpha</a>; cách đọc kết quả có trong bài <a href="/posts/cronbach-alpha-la-gi/">Cronbach's alpha là gì</a>.</li>
<li><strong>Nhãn mức trả lời cân đối</strong>: số mức đồng ý bằng số mức không đồng ý, mức giữa trung lập thật sự. Nhãn lệch như "Kém, Trung bình, Khá, Tốt, Rất tốt" làm khoảng cách giữa các mức kém đều. Bài <a href="/posts/thang-do-likert/">thang đo Likert 5 mức, 7 mức</a> có bộ nhãn chuẩn.</li>
<li><strong>Phân phối không dồn hết về một đầu.</strong> Xem skewness, kurtosis và biểu đồ tần suất của biến tổng hợp. Khi hơn một nửa mẫu chọn mức cao nhất, cả trung bình lẫn kiểm định tham số đều kém tin cậy.</li>
</ul>

<h2>Câu mẫu cho chương 3</h2>
<blockquote><p>Các khái niệm trong mô hình được đo bằng thang Likert 5 mức (1 = Hoàn toàn không đồng ý; 5 = Hoàn toàn đồng ý). Mỗi câu hỏi đơn lẻ được xem là dữ liệu thứ bậc và được mô tả bằng tần suất. Điểm của mỗi khái niệm được tính bằng trung bình cộng các câu hỏi thuộc khái niệm đó sau khi kiểm định độ tin cậy, và được xử lý như biến định lượng trong phân tích tương quan và hồi quy, theo lập luận của Carifio và Perla (2008) và Norman (2010) về tính bền vững của các kiểm định tham số đối với thang đo Likert nhiều câu.</p></blockquote>
<p>Nếu có so sánh nhóm và phân phối lệch, thêm một câu: "Kiểm định phi tham số Mann-Whitney được chạy bổ sung để đối chiếu và cho kết luận tương tự." Câu này chỉ viết khi bạn thực sự đã chạy và kết quả thực sự giống.</p>

<h2>Lỗi thường gặp</h2>
<ul>
<li><strong>Viết "thang đo Likert là thang đo khoảng" như một sự thật.</strong> Hội đồng có người theo quan điểm thứ bậc sẽ hỏi ngay. Viết "được xử lý như" và dẫn nguồn.</li>
<li><strong>Chạy hồi quy trên từng câu.</strong> Biến độc lập phải là khái niệm (biến tổng hợp), không phải HL1 hay HL2.</li>
<li><strong>Diễn giải trung bình câu đơn quá mức.</strong> "Trung bình HL3 = 3,62 nên khách hàng khá hài lòng" ít thông tin hơn "58% chọn Đồng ý hoặc Hoàn toàn đồng ý". Báo cáo cả hai.</li>
<li><strong>Tính trung bình khi chưa đảo điểm câu ngược chiều.</strong> Một câu đảo chiều chưa mã hoá lại sẽ làm sai cả biến tổng hợp lẫn alpha.</li>
<li><strong>Đổi thang giữa các khái niệm</strong> (khái niệm A 5 mức, khái niệm B 7 mức) rồi so sánh trung bình giữa A và B. Hai con số không cùng thước đo.</li>
<li><strong>Dẫn Likert (1932) để chứng minh dữ liệu là khoảng.</strong> Bài gốc của Likert không giải quyết câu hỏi này theo nghĩa của Stevens; Stevens công bố cách phân loại 14 năm sau.</li>
</ul>

<h2>Câu hỏi thường gặp</h2>
<h3>Vậy rốt cuộc nên ghi là thang thứ bậc hay thang khoảng?</h3>
<p>Ghi cả hai, đúng chỗ: câu hỏi đơn lẻ là thứ bậc, điểm tổng hợp của khái niệm được xử lý như biến định lượng. Đó là cách trình bày mà cả hai phía tranh luận đều chấp nhận được.</p>
<h3>Thang Likert 7 mức có "khoảng" hơn 5 mức không?</h3>
<p>Có thêm giá trị nên điểm tổng hợp mịn hơn, nhưng câu đơn 7 mức vẫn là thứ bậc. Số mức nên chọn theo đối tượng trả lời và thang đo gốc, không chọn để "được làm hồi quy".</p>
<h3>Có bắt buộc kiểm định phân phối chuẩn trước khi chạy t-test không?</h3>
<p>Giả định chuẩn áp dụng cho phần dư hoặc cho phân phối mẫu của trung bình, không phải cho từng câu Likert. Với mỗi nhóm khoảng 30 người trở lên, t-test thường bền. Vẫn nên xem histogram để phát hiện phân phối dồn về một đầu.</p>
<h3>Hội đồng hỏi "Likert là thứ bậc sao em tính trung bình?" thì trả lời gì?</h3>
<p>"Dạ, em tính trung bình trên thang đo nhiều câu đã đạt độ tin cậy, không trên câu đơn. Theo Norman (2010) và Carifio và Perla (2008), kiểm định tham số trên điểm tổng hợp như vậy cho kết quả đáng tin. Với từng câu em báo cáo tần suất." Xem thêm các câu hội đồng hay hỏi trong bài <a href="/posts/hoi-dong-hoi-gi-ve-phan-khao-sat/">hội đồng hỏi gì về phần khảo sát</a>.</p>
<h3>Cách chia mức "1,00 đến 1,80 là rất thấp" có nguồn không?</h3>
<p>Đó là quy ước diễn giải phổ biến ở Việt Nam, tính bằng (5 − 1) / 5 = 0,8, không có trong Likert (1932) hay Stevens (1946). Dùng được nếu ghi rõ là quy ước.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Carifio, J., &amp; Perla, R. J. (2007). Ten common misunderstandings, misconceptions, persistent myths and urban legends about Likert scales and Likert response formats and their antidotes. <em>Journal of Social Sciences, 3</em>(3), 106–116. https://doi.org/10.3844/jssp.2007.106.116</li>
<li>Carifio, J., &amp; Perla, R. (2008). Resolving the 50-year debate around using and misusing Likert scales. <em>Medical Education, 42</em>(12), 1150–1152. https://doi.org/10.1111/j.1365-2923.2008.03172.x</li>
<li>Jamieson, S. (2004). Likert scales: How to (ab)use them. <em>Medical Education, 38</em>(12), 1217–1218. https://doi.org/10.1111/j.1365-2929.2004.02012.x</li>
<li>Liddell, T. M., &amp; Kruschke, J. K. (2018). Analyzing ordinal data with metric models: What could possibly go wrong? <em>Journal of Experimental Social Psychology, 79</em>, 328–348. https://doi.org/10.1016/j.jesp.2018.08.009</li>
<li>Likert, R. (1932). A technique for the measurement of attitudes. <em>Archives of Psychology, 22</em>(140), 1–55.</li>
<li>Norman, G. (2010). Likert scales, levels of measurement and the "laws" of statistics. <em>Advances in Health Sciences Education, 15</em>(5), 625–632. https://doi.org/10.1007/s10459-010-9222-y</li>
<li>Rhemtulla, M., Brosseau-Liard, P. É., &amp; Savalei, V. (2012). When can categorical variables be treated as continuous? A comparison of robust continuous and categorical SEM estimation methods under suboptimal conditions. <em>Psychological Methods, 17</em>(3), 354–373. https://doi.org/10.1037/a0029315</li>
<li>Stevens, S. S. (1946). On the theory of scales of measurement. <em>Science, 103</em>(2684), 677–680. https://doi.org/10.1126/science.103.2684.677</li>
<li>Sullivan, G. M., &amp; Artino, A. R., Jr. (2013). Analyzing and interpreting data from Likert-type scales. <em>Journal of Graduate Medical Education, 5</em>(4), 541–542. https://doi.org/10.4300/JGME-5-4-18</li>
</ul>
