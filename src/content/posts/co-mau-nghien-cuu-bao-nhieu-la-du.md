---
title: "Cỡ mẫu nghiên cứu bao nhiêu là đủ? Từ Cochran tới G*Power, PLS-SEM"
description: "Cỡ mẫu tối thiểu theo phương pháp phân tích: Cochran, bảng Krejcie & Morgan, EFA, CFA, hồi quy, t-test, PLS-SEM với G*Power, kèm đoạn mẫu chương 3."
pubDatetime: 2026-10-29T07:00:00+07:00
modDatetime: 2026-10-30T02:18:59+07:00
featured: true
tags: ["cỡ mẫu","khoá luận","PLS-SEM"]
---

<p>"Em cần bao nhiêu phiếu?" là câu sinh viên hỏi giảng viên hướng dẫn nhiều nhất, và câu trả lời đúng là "tuỳ em định phân tích gì". Muốn ước lượng một tỉ lệ trong tổng thể thì dùng công thức Cochran. Muốn chạy EFA thì nhìn số biến quan sát. Muốn chạy hồi quy thì nhìn số biến độc lập. Bài này đi qua từng cách, tính tay từng con số, rồi chỉ cách gộp lại thành một cỡ mẫu bạn bảo vệ được trước hội đồng.</p>

<h2>Công thức Cochran: khi bạn muốn ước lượng một tỉ lệ</h2>
<p>Công thức trong sách <em>Sampling Techniques</em> của Cochran (1977) dùng khi mục tiêu là ước lượng một tỉ lệ, ví dụ tỉ lệ sinh viên có dùng ví điện tử, với sai số cho trước:</p>
<p><code>n0 = z² × p × (1 − p) / e²</code></p>
<ul>
<li><strong>z</strong>: giá trị tới hạn theo độ tin cậy. Độ tin cậy 95% thì z = 1,96; 99% thì z = 2,576.</li>
<li><strong>p</strong>: tỉ lệ ước đoán trong tổng thể. Không có thông tin trước thì lấy p = 0,5.</li>
<li><strong>e</strong>: sai số chấp nhận, ví dụ 0,05 tức là cộng trừ 5 điểm phần trăm.</li>
</ul>
<h3>Tính tay với z = 1,96, p = 0,5, e = 0,05</h3>
<ol>
<li>z² = 1,96 × 1,96 = 3,8416</li>
<li>p × (1 − p) = 0,5 × 0,5 = 0,25</li>
<li>Tử số: 3,8416 × 0,25 = 0,9604</li>
<li>e² = 0,05 × 0,05 = 0,0025</li>
<li>n0 = 0,9604 / 0,0025 = 384,16</li>
</ol>
<p>Cỡ mẫu luôn làm tròn lên, nên kết quả là <strong>385</strong>. Làm tròn xuống thành 384 nghĩa là sai số thực tế nhỉnh hơn 5% một chút.</p>
<p>Vì sao lấy p = 0,5? Tích p × (1 − p) đạt lớn nhất khi p = 0,5, nên đây là lựa chọn an toàn nhất khi bạn chưa biết gì về tổng thể. Nếu có nghiên cứu trước cho thấy tỉ lệ khoảng 30%, thay p = 0,3: tử số còn 3,8416 × 0,21 = 0,806736, chia 0,0025 được 322,69, làm tròn lên 323.</p>
<p>Cỡ mẫu thay đổi rất nhanh theo sai số:</p>
<table>
<thead>
<tr><th>Sai số e</th><th>n0 (độ tin cậy 95%, p = 0,5)</th><th>Cỡ mẫu làm tròn lên</th></tr>
</thead>
<tbody>
<tr><td>0,03</td><td>0,9604 / 0,0009 = 1.067,11</td><td>1.068</td></tr>
<tr><td>0,05</td><td>0,9604 / 0,0025 = 384,16</td><td>385</td></tr>
<tr><td>0,07</td><td>0,9604 / 0,0049 = 196</td><td>196</td></tr>
<tr><td>0,10</td><td>0,9604 / 0,01 = 96,04</td><td>97</td></tr>
</tbody>
</table>
<p>Giảm sai số đi một nửa thì cỡ mẫu tăng gấp bốn, vì e nằm ở mẫu số dưới dạng bình phương. Nếu đổi sang độ tin cậy 99% với e = 0,05: 2,576² × 0,25 / 0,0025 = 663,58, làm tròn lên 664.</p>
<h3>Hiệu chỉnh khi tổng thể nhỏ</h3>
<p>Khi biết quy mô tổng thể N và N không quá lớn (ví dụ toàn bộ nhân viên một công ty), Cochran (1977) đưa ra công thức hiệu chỉnh:</p>
<p><code>n = n0 / (1 + (n0 − 1) / N)</code></p>
<p>Với N = 2.000 và n0 = 384,16: (384,16 − 1) / 2.000 = 0,19158; mẫu số là 1,19158; n = 384,16 / 1,19158 = 322,40, làm tròn lên <strong>323</strong>. Với N = 500, kết quả là 217,49, làm tròn lên 218. Với tổng thể vài chục nghìn trở lên, phần hiệu chỉnh gần như không đổi kết quả, nên dùng thẳng 385.</p>

<h2>Công thức Slovin và Yamane</h2>
<p>Nhiều khoá luận ở Việt Nam dùng công thức:</p>
<p><code>n = N / (1 + N × e²)</code></p>
<p>Công thức này hay được gọi là công thức Slovin, nhưng tài liệu gốc mang tên Slovin rất khó truy ra. Nguồn có thật và hay được dẫn là sách <em>Statistics: An Introductory Analysis</em> của Yamane (1967), nên trong khoá luận bạn nên trích Yamane (1967).</p>
<p>Ví dụ với N = 2.000, e = 0,05: N × e² = 2.000 × 0,0025 = 5; n = 2.000 / (1 + 5) = 333,33, làm tròn lên <strong>334</strong>. Với N = 500: 500 / (1 + 1,25) = 222,22, làm tròn lên 223.</p>
<p>Công thức này gần như tương đương với Cochran có hiệu chỉnh khi p = 0,5 và z xấp xỉ 2 (độ tin cậy khoảng 95%): Cochran hiệu chỉnh với n0 = 400 cho 400N / (N + 399), còn Yamane cho 400N / (N + 400). Khi N rất lớn, kết quả tiến tới 1 / e² = 400. Vì vậy hai công thức cho số gần nhau, và hội đồng thường chấp nhận cả hai, miễn bạn ghi rõ N lấy từ đâu. Nếu bạn không biết N thì đừng dùng Slovin, vì cả công thức dựa vào N.</p>

<h2>Bảng Krejcie &amp; Morgan (1970)</h2>
<p>Nhiều giảng viên ở Việt Nam hỏi "em tra bảng Krejcie và Morgan chưa?". Bảng này nằm trong bài báo ngắn của Krejcie và Morgan (1970) trên <em>Educational and Psychological Measurement</em>. Nó không phải một phương pháp mới: hai tác giả tính sẵn cỡ mẫu cho nhiều quy mô tổng thể N bằng công thức</p>
<p><code>s = χ² × N × P × (1 − P) / (d² × (N − 1) + χ² × P × (1 − P))</code></p>
<p>với χ² = 3,841 (chi bình phương 1 bậc tự do ở mức 95%, chính là 1,96²), P = 0,5 và d = 0,05. Vì vậy bảng cho kết quả gần như trùng với Cochran có hiệu chỉnh ở trên. Một số dòng của bảng, chúng tôi tính lại theo công thức và làm tròn tới số nguyên gần nhất như bảng gốc:</p>
<table>
<thead>
<tr><th>Tổng thể N</th><th>Cỡ mẫu s</th><th>Tổng thể N</th><th>Cỡ mẫu s</th></tr>
</thead>
<tbody>
<tr><td>50</td><td>44</td><td>1.000</td><td>278</td></tr>
<tr><td>100</td><td>80</td><td>1.500</td><td>306</td></tr>
<tr><td>150</td><td>108</td><td>2.000</td><td>322</td></tr>
<tr><td>200</td><td>132</td><td>3.000</td><td>341</td></tr>
<tr><td>300</td><td>169</td><td>5.000</td><td>357</td></tr>
<tr><td>400</td><td>196</td><td>10.000</td><td>370</td></tr>
<tr><td>500</td><td>217</td><td>20.000</td><td>377</td></tr>
<tr><td>750</td><td>254</td><td>50.000</td><td>381</td></tr>
</tbody>
</table>
<p>Khi N lên tới cả triệu, s dừng ở khoảng 384. Hai điều cần nhớ khi dùng bảng: nó chỉ áp dụng khi mục tiêu là ước lượng một tỉ lệ với sai số 5%, và nó giả định mẫu ngẫu nhiên. Nếu phân tích chính của bạn là EFA, hồi quy hay SEM thì bảng này không phải căn cứ đúng, hãy dùng các mục bên dưới.</p>

<h2>Khi chạy EFA: quy tắc 5:1 và 10:1 của Hair</h2>
<p>Phần lớn khoá luận định lượng ở Việt Nam chạy Cronbach's alpha, EFA rồi hồi quy. Với EFA, thứ bạn cần ước lượng là ma trận tương quan giữa các biến quan sát, nên căn cứ tính cỡ mẫu là số biến quan sát và công thức Cochran ít liên quan.</p>
<p>Hair và cộng sự (2010, <em>Multivariate Data Analysis</em>, ấn bản 7) khuyến nghị:</p>
<ul>
<li>Cỡ mẫu tối thiểu 50, tốt hơn là từ 100 trở lên.</li>
<li>Số quan sát ít nhất gấp 5 lần số biến được phân tích (5:1), mức dễ chấp nhận hơn là 10:1.</li>
</ul>
<p>"Biến" ở đây là biến quan sát, tức là từng câu hỏi trong thang đo, không phải số khái niệm. Mô hình có 5 khái niệm độc lập với tổng cộng 22 câu, cộng 4 câu của biến phụ thuộc, là 26 biến quan sát. Theo 5:1 cần 26 × 5 = 130 phiếu; theo 10:1 cần 26 × 10 = 260 phiếu.</p>
<p>Các quy tắc tỉ lệ này chỉ là mức sàn. MacCallum và cộng sự (1999) cho thấy cỡ mẫu cần cho EFA phụ thuộc nhiều vào communality của các biến và số biến trên mỗi nhân tố: khi communality cao và mỗi nhân tố có nhiều biến, mẫu nhỏ vẫn cho nghiệm ổn định; khi communality thấp, cần mẫu lớn hơn nhiều. Chạy xong EFA, cách đọc KMO, Bartlett và ma trận xoay có ở bài <a href="/posts/cach-doc-ket-qua-efa-spss/">cách đọc kết quả EFA trên SPSS</a>.</p>

<h2>Khi chạy CFA hoặc CB-SEM (AMOS): nhìn số khái niệm và communality</h2>
<p>Nhiều khoá luận áp luôn quy tắc 5:1 của EFA cho CFA. Hai phân tích này khác nhau: CFA và CB-SEM ước lượng cả mô hình cùng lúc, nên cỡ mẫu phụ thuộc vào độ phức tạp của mô hình và độ mạnh của hệ số tải. Hair và cộng sự (2010, chương về SEM) đưa ra mức tối thiểu như sau:</p>
<table>
<thead>
<tr><th>Đặc điểm mô hình</th><th>Cỡ mẫu tối thiểu</th></tr>
</thead>
<tbody>
<tr><td>Từ 5 khái niệm trở xuống, mỗi khái niệm trên 3 biến quan sát, communality từ 0,6</td><td>100</td></tr>
<tr><td>Từ 7 khái niệm trở xuống, communality khoảng 0,5, không có khái niệm chưa đủ định danh</td><td>150</td></tr>
<tr><td>Từ 7 khái niệm trở xuống, communality dưới 0,45 hoặc nhiều khái niệm có dưới 3 biến quan sát</td><td>300</td></tr>
<tr><td>Nhiều khái niệm, một số có communality thấp hoặc dưới 3 biến quan sát</td><td>500</td></tr>
</tbody>
</table>
<p>Trong CFA, communality của một biến xấp xỉ bình phương hệ số tải chuẩn hoá: hệ số tải 0,77 tương ứng communality khoảng 0,6, hệ số tải 0,7 tương ứng khoảng 0,49. Với mô hình ví dụ ở trên (6 khái niệm, mỗi khái niệm 4 đến 5 câu, hệ số tải quanh 0,7), mức phù hợp là 150; nếu bản pilot cho nhiều hệ số tải dưới 0,67 (communality dưới 0,45), hãy nhắm 300.</p>
<p>Wolf và cộng sự (2013) mô phỏng Monte Carlo cho các mô hình SEM hay gặp và thấy cỡ mẫu cần thiết dao động từ 30 tới 460 tuỳ số biến quan sát, số nhân tố, độ lớn hệ số tải và hệ số đường dẫn. Kết luận của họ là các quy tắc kinh nghiệm chỉ nên dùng để tham chiếu. Nếu hội đồng hỏi sâu, bạn trích Hair và cộng sự (2010) cho mức tối thiểu và Wolf và cộng sự (2013) để giải thích vì sao mô hình có hệ số tải thấp cần mẫu lớn hơn.</p>


<h2>Khi chạy hồi quy: n ≥ 50 + 8m của Tabachnick &amp; Fidell</h2>
<p>Với hồi quy bội, Tabachnick &amp; Fidell (2013, <em>Using Multivariate Statistics</em>, ấn bản 6) đưa ra quy tắc kinh nghiệm:</p>
<ul>
<li><code>N ≥ 50 + 8m</code> để kiểm định tương quan bội (R² của cả mô hình), với m là số biến độc lập.</li>
<li><code>N ≥ 104 + m</code> để kiểm định từng biến độc lập riêng lẻ.</li>
</ul>
<p>Hai tác giả khuyên tính cả hai và lấy số lớn hơn. Với m = 5: 50 + 8 × 5 = 90 và 104 + 5 = 109, vậy cần ít nhất 109 phiếu. Lưu ý m là số biến độc lập đưa vào phương trình hồi quy, ở đây là 5 khái niệm, còn 22 câu hỏi thì không tính.</p>

<h2>Khi chạy PLS-SEM bằng SmartPLS: power thay cho quy tắc 10 lần</h2>
<p>Nhiều luận văn dùng SmartPLS vẫn trích quy tắc 10 lần: cỡ mẫu tối thiểu bằng 10 lần số mũi tên nhiều nhất trỏ vào một biến trong mô hình (Hair và cộng sự, 2011). Quy tắc này dễ tính nhưng các nghiên cứu sau cho thấy nó thường cho cỡ mẫu quá thấp, và chính nhóm tác giả của Hair đã chuyển sang khuyên dùng cách dựa trên power thống kê (Hair và cộng sự, 2022, <em>A Primer on Partial Least Squares Structural Equation Modeling</em>, ấn bản 3). Hội đồng chấm luận văn hiện nay cũng hay hỏi "mẫu này có đủ power không".</p>
<h3>Phân tích power bằng G*Power</h3>
<p>Ý tưởng: chọn trước mức ý nghĩa α, power mong muốn (thường 0,80) và cỡ hiệu ứng f² bạn muốn phát hiện, rồi tính cỡ mẫu nhỏ nhất đạt được power đó. Với PLS-SEM, phần cấu trúc được xem như hồi quy cho biến phụ thuộc nhận nhiều mũi tên nhất, nên số biến dự báo m chính là số mũi tên đó. Trong G*Power 3.1 (Faul và cộng sự, 2009) chọn <em>F tests → Linear multiple regression: Fixed model, R² deviation from zero</em>.</p>
<table>
<thead>
<tr><th>Số mũi tên trỏ vào (m)</th><th>f² = 0,02 (nhỏ)</th><th>f² = 0,15 (trung bình)</th><th>f² = 0,35 (lớn)</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>485</td><td>68</td><td>31</td></tr>
<tr><td>3</td><td>550</td><td>77</td><td>36</td></tr>
<tr><td>4</td><td>602</td><td>85</td><td>40</td></tr>
<tr><td>5</td><td>647</td><td>92</td><td>43</td></tr>
<tr><td>6</td><td>688</td><td>98</td><td>46</td></tr>
</tbody>
</table>
<p>Bảng tính với α = 5% và power = 0,80; mức f² 0,02, 0,15, 0,35 theo quy ước của Cohen (1988, 1992). Phần lớn luận văn chọn f² = 0,15. Bạn tự tính cho mô hình của mình bằng <a href="/cong-cu/tinh-co-mau/">máy tính cỡ mẫu</a>, kết quả khớp với G*Power.</p>
<h3>Phương pháp căn bậc hai nghịch đảo của Kock &amp; Hadaya</h3>
<p>Kock &amp; Hadaya (2018, <em>Information Systems Journal</em>) đề xuất một công thức riêng cho PLS-SEM, dựa trên hệ số đường dẫn nhỏ nhất mà bạn kỳ vọng có ý nghĩa thống kê (p<sub>min</sub>):</p>
<p><code>n_min &gt; (2,486 / |p_min|)²</code> với α = 5% và power = 0,80.</p>
<p>Nếu không có nghiên cứu trước, chọn mức thận trọng p<sub>min</sub> = 0,11 thì cần (2,486 / 0,11)² = 510,8, tức 511 phiếu; với p<sub>min</sub> = 0,2 cần 155 phiếu. Hair và cộng sự (2022) khuyên dùng phương pháp này khi chạy PLS-SEM. Memon và cộng sự (2020) có bài tổng quan rất dễ đọc về các cách xác định cỡ mẫu cho nghiên cứu khảo sát, nên đọc nếu hội đồng hỏi sâu.</p>

<h2>Khi so sánh nhóm: t-test và ANOVA</h2>
<p>Nếu câu hỏi nghiên cứu là "nam và nữ có khác nhau về ý định mua không" hay "ba nhóm thu nhập có mức hài lòng khác nhau không", cỡ mẫu tính theo từng nhóm chứ không theo tổng. Trong G*Power 3 (Faul và cộng sự, 2007), với α = 5% (hai phía), power 0,80 và các cỡ hiệu ứng quy ước của Cohen (1988), ta có:</p>
<table>
<thead>
<tr><th>Phép kiểm định</th><th>Hiệu ứng nhỏ</th><th>Hiệu ứng trung bình</th><th>Hiệu ứng lớn</th></tr>
</thead>
<tbody>
<tr><td>t-test hai nhóm độc lập (d = 0,2 / 0,5 / 0,8)</td><td>394 mỗi nhóm</td><td>64 mỗi nhóm</td><td>26 mỗi nhóm</td></tr>
<tr><td>ANOVA một yếu tố, 3 nhóm (f = 0,10 / 0,25 / 0,40)</td><td>323 mỗi nhóm</td><td>53 mỗi nhóm</td><td>22 mỗi nhóm</td></tr>
<tr><td>ANOVA một yếu tố, 4 nhóm (f = 0,10 / 0,25 / 0,40)</td><td>274 mỗi nhóm</td><td>45 mỗi nhóm</td><td>19 mỗi nhóm</td></tr>
</tbody>
</table>
<p>Hệ quả thực tế: một mẫu 300 phiếu chia khá đều cho 3 nhóm đủ để phát hiện khác biệt cỡ trung bình, nhưng nếu một nhóm chỉ có 20 người (ví dụ nhóm thu nhập trên 30 triệu) thì kiểm định cho nhóm đó gần như không có power. Khi phân bố nhóm lệch, hãy gộp nhóm trước khi phân tích và ghi rõ lý do.</p>

<h2>Chọn con số nào: mức tối thiểu của phương pháp phân tích chính</h2>
<p>Đừng cộng dồn hay lấy số lớn nhất của mọi công thức. Hãy xác định phương pháp phân tích chính của đề tài, lấy cỡ mẫu tối thiểu mà phương pháp đó đòi hỏi, và trích đúng nguồn:</p>
<table>
<thead>
<tr><th>Phân tích chính</th><th>Căn cứ nên dùng</th><th>Ví dụ (5 biến độc lập, 26 biến quan sát)</th></tr>
</thead>
<tbody>
<tr><td>PLS-SEM (SmartPLS)</td><td>Power G*Power; đối chiếu Kock &amp; Hadaya (2018)</td><td>92 (f² = 0,15)</td></tr>
<tr><td>Hồi quy bội (SPSS)</td><td>Power G*Power; đối chiếu Tabachnick &amp; Fidell (2013)</td><td>92; T&amp;F: 109</td></tr>
<tr><td>EFA (SPSS)</td><td>Hair và cộng sự (2010), 5:1; tốt hơn là 10:1</td><td>130; 10:1: 260</td></tr>
<tr><td>CFA / CB-SEM (AMOS)</td><td>Hair và cộng sự (2010) theo số khái niệm và communality; đối chiếu Wolf và cộng sự (2013)</td><td>150 (6 khái niệm, communality khoảng 0,5)</td></tr>
<tr><td>So sánh nhóm (t-test, ANOVA)</td><td>Power G*Power (Faul và cộng sự, 2007)</td><td>53 mỗi nhóm (3 nhóm, f = 0,25)</td></tr>
<tr><td>Ước lượng tỷ lệ</td><td>Cochran (1977)</td><td>385</td></tr>
</tbody>
</table>
<p>Cỡ mẫu tối thiểu được tính trên số phiếu hợp lệ còn lại sau khi lọc. Khi lên kế hoạch phát phiếu, cộng thêm phần dự phòng cho phiếu bị loại: với 15% phiếu bị loại và mức tối thiểu 92, nên phát khoảng 92 / 0,85 = 108,2, làm tròn lên 109 phiếu. Công thức chung là số phiếu cần phát = n / (1 − r), với r là tỉ lệ phiếu dự kiến bị loại; bảng tính sẵn cho nhiều mức r có ở bài <a href="/posts/cach-thu-du-mau-khao-sat-nhanh/">cách thu đủ mẫu khảo sát nhanh</a>. Đừng cộng thẳng 15% (92 × 1,15 = 105,8, tức 106), vì cách đó cho số thấp hơn mức cần.</p>

<p>Có con số rồi thì việc khó là thu đủ phiếu hợp lệ. Nếu không muốn đi xin điền form khắp các group, một lựa chọn là <a href="https://geniusdata.io/signup?ref=lab-blog&amp;next=%2Fapp%2Fforms&amp;utm_source=goc-nghien-cuu&amp;utm_medium=blog&amp;utm_campaign=ai-lab&amp;utm_content=co-mau-nghien-cuu-bao-nhieu-la-du" rel="sponsored noopener">Genius Data</a> (link giới thiệu), nơi người nghiên cứu tự đặt mức thưởng cho mỗi câu hỏi và chỉ trả tiền cho phiếu được duyệt.</p>

<h2>Câu hỏi thường gặp</h2>
<h3>Mẫu 200 có đủ không?</h3>
<p>Tuỳ phân tích chính. Với hồi quy hoặc PLS-SEM có tối đa 6 mũi tên trỏ vào một biến và f² = 0,15, 200 phiếu hợp lệ vượt mức 98 của G*Power. Với EFA 26 biến quan sát, 200 đạt 5:1 (130) nhưng chưa đạt 10:1 (260). Với CFA 6 khái niệm có hệ số tải quanh 0,7, 200 vượt mức 150 của Hair và cộng sự (2010). Với ước lượng tỉ lệ, 200 phiếu cho sai số khoảng ±6,9 điểm phần trăm thay vì ±5. Câu trả lời đúng trước hội đồng luôn bắt đầu bằng "phân tích chính của em là...".</p>
<h3>Có cần tính nhiều công thức rồi lấy số lớn nhất không?</h3>
<p>Không. Lấy mức tối thiểu của phân tích chính, sau đó kiểm tra cỡ mẫu đó có đủ cho các phân tích phụ không. Ví dụ đề tài chạy PLS-SEM và có thêm t-test theo giới tính thì kiểm tra thêm số người của mỗi giới.</p>
<h3>Không biết quy mô tổng thể N thì sao?</h3>
<p>Đừng dùng Yamane (Slovin) hay bảng Krejcie &amp; Morgan, vì cả hai cần N. Dùng căn cứ theo phương pháp phân tích (power, Hair, Tabachnick &amp; Fidell), hoặc Cochran không hiệu chỉnh nếu mục tiêu là ước lượng tỉ lệ.</p>
<h3>Thu được ít hơn cỡ mẫu tối thiểu thì làm gì?</h3>
<p>Báo cáo trung thực số phiếu hợp lệ, tính lại power thực tế với cỡ mẫu đó và ghi vào phần hạn chế. Không nên nới tiêu chí lọc phiếu sau khi đã thấy dữ liệu chỉ để đủ số, vì hội đồng sẽ hỏi tiêu chí lọc được đặt ra lúc nào.</p>

<h2>Năm lỗi hay gặp khi trình bày cỡ mẫu</h2>
<ol>
<li><strong>Dùng Slovin nhưng không có N.</strong> Ghi "N là toàn bộ người dùng mạng xã hội tại Việt Nam" mà không có nguồn số liệu thì công thức mất căn cứ. Nếu cần quy mô tổng thể cấp quốc gia, lấy từ nguồn chính thức và ghi năm, ví dụ <a href="/du-lieu/dan-so/">dân số Việt Nam</a> và <a href="/du-lieu/nguoi-dung-internet/">tỉ lệ người dùng internet</a> theo Ngân hàng Thế giới; với tổng thể vài triệu người trở lên, phần hiệu chỉnh gần như không đổi kết quả.</li>
<li><strong>Tính đúng cỡ mẫu xác suất rồi chọn mẫu thuận tiện.</strong> Công thức Cochran giả định mẫu ngẫu nhiên. Nếu bạn phát link qua mạng xã hội, hãy nói rõ con số chỉ là tham chiếu, và nêu hạn chế về tính đại diện.</li>
<li><strong>Đếm nhầm m.</strong> Trong 50 + 8m, m là số biến độc lập, không phải số câu hỏi. Ngược lại, trong quy tắc của Hair, cái cần đếm là số câu hỏi.</li>
<li><strong>Quên phần phiếu bị loại.</strong> Thu đúng 260 phiếu rồi loại 30 phiếu thì bạn đã dưới mức 10:1.</li>
<li><strong>Trích dẫn sai năm hoặc sai ấn bản.</strong> Quy tắc 5:1 và 10:1 nằm trong nhiều ấn bản sách của Hair; hãy ghi đúng ấn bản bạn thực sự đọc.</li>
</ol>

<h2>Đoạn văn mẫu cho chương 3</h2>
<blockquote>Mô hình nghiên cứu được phân tích bằng PLS-SEM, trong đó biến phụ thuộc nhận nhiều nhất 5 mũi tên. Cỡ mẫu tối thiểu được xác định bằng phân tích power trên G*Power 3.1 (Faul và cộng sự, 2009) với cỡ hiệu ứng trung bình f² = 0,15, mức ý nghĩa 5% và power 0,80 (Cohen, 1992), cho kết quả 92 quan sát. Đối chiếu theo phương pháp căn bậc hai nghịch đảo (Kock &amp; Hadaya, 2018) với hệ số đường dẫn nhỏ nhất kỳ vọng 0,2, cỡ mẫu tối thiểu là 155. Nghiên cứu thu được 180 phiếu hợp lệ, đáp ứng cả hai tiêu chí.</blockquote>
<p>Nếu bạn ghép bảng hỏi trong <a href="/cong-cu/bo-khao-sat/">Bộ khảo sát</a>, đoạn “Thang đo và cỡ mẫu” được viết sẵn theo đúng mô hình và số mũi tên bạn chọn, kèm danh mục tài liệu tham khảo.</p>
<h2>Tài liệu tham khảo</h2>
<ul>
<li>Cochran, W. G. (1977). <em>Sampling Techniques</em> (3rd ed.). Wiley.</li>
<li>Cohen, J. (1988). <em>Statistical Power Analysis for the Behavioral Sciences</em> (2nd ed.). Lawrence Erlbaum.</li>
<li>Cohen, J. (1992). A power primer. <em>Psychological Bulletin, 112</em>(1), 155–159. https://doi.org/10.1037/0033-2909.112.1.155</li>
<li>Faul, F., Erdfelder, E., Lang, A.-G., &amp; Buchner, A. (2007). G*Power 3: A flexible statistical power analysis program for the social, behavioral, and biomedical sciences. <em>Behavior Research Methods, 39</em>(2), 175–191. https://doi.org/10.3758/BF03193146</li>
<li>Faul, F., Erdfelder, E., Buchner, A., &amp; Lang, A.-G. (2009). Statistical power analyses using G*Power 3.1: Tests for correlation and regression analyses. <em>Behavior Research Methods, 41</em>(4), 1149–1160. https://doi.org/10.3758/BRM.41.4.1149</li>
<li>Hair, J. F., Black, W. C., Babin, B. J., &amp; Anderson, R. E. (2010). <em>Multivariate Data Analysis</em> (7th ed.). Pearson.</li>
<li>Hair, J. F., Ringle, C. M., &amp; Sarstedt, M. (2011). PLS-SEM: Indeed a silver bullet. <em>Journal of Marketing Theory and Practice, 19</em>(2), 139–152. https://doi.org/10.2753/MTP1069-6679190202</li>
<li>Hair, J. F., Hult, G. T. M., Ringle, C. M., &amp; Sarstedt, M. (2022). <em>A Primer on Partial Least Squares Structural Equation Modeling (PLS-SEM)</em> (3rd ed.). Sage.</li>
<li>Kock, N., &amp; Hadaya, P. (2018). Minimum sample size estimation in PLS-SEM: The inverse square root and gamma-exponential methods. <em>Information Systems Journal, 28</em>(1), 227–261. https://doi.org/10.1111/isj.12131</li>
<li>Krejcie, R. V., &amp; Morgan, D. W. (1970). Determining sample size for research activities. <em>Educational and Psychological Measurement, 30</em>(3), 607–610. https://doi.org/10.1177/001316447003000308</li>
<li>MacCallum, R. C., Widaman, K. F., Zhang, S., &amp; Hong, S. (1999). Sample size in factor analysis. <em>Psychological Methods, 4</em>(1), 84–99. https://doi.org/10.1037/1082-989X.4.1.84</li>
<li>Memon, M. A., Ting, H., Cheah, J.-H., Thurasamy, R., Chuah, F., &amp; Cham, T. H. (2020). Sample size for survey research: Review and recommendations. <em>Journal of Applied Structural Equation Modeling, 4</em>(2), i–xx. https://doi.org/10.47263/JASEM.4(2)01</li>
<li>Tabachnick, B. G., &amp; Fidell, L. S. (2013). <em>Using Multivariate Statistics</em> (6th ed.). Pearson.</li>
<li>Wolf, E. J., Harrington, K. M., Clark, S. L., &amp; Miller, M. W. (2013). Sample size requirements for structural equation models: An evaluation of power, bias, and solution propriety. <em>Educational and Psychological Measurement, 73</em>(6), 913–934. https://doi.org/10.1177/0013164413495237</li>
<li>Yamane, T. (1967). <em>Statistics: An Introductory Analysis</em> (2nd ed.). Harper &amp; Row.</li>
</ul>
<p>Muốn thử nhanh với số biến của mình, dùng <a href="/cong-cu/tinh-co-mau/">công cụ tính cỡ mẫu</a>: chọn phương pháp phân tích, nhập số biến là ra cỡ mẫu tối thiểu kèm trích dẫn. Có con số rồi thì bước tiếp theo là lên kế hoạch phát phiếu, xem bài <a href="/posts/cach-thu-mau-khao-sat-khoa-luan/">cách thu mẫu khảo sát khoá luận</a>. Và vì cỡ mẫu tính trên phiếu hợp lệ, bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">cách lọc phiếu khảo sát không hợp lệ</a> sẽ giúp bạn biết phải dự phòng bao nhiêu.</p>
