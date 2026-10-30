---
title: "HTMT là gì? Đánh giá giá trị phân biệt và Fornell-Larcker"
description: "HTMT là gì, ngưỡng 0,85 hay 0,90, cách tính tay, khác Fornell-Larcker ở đâu, kiểm định bootstrap, xử lý khi vượt ngưỡng và câu viết chương 4."
pubDatetime: 2026-10-30T16:00:00+07:00
featured: false
tags: ["PLS-SEM","thang đo","khoá luận"]
---

<p><strong>HTMT (heterotrait-monotrait ratio) là tỉ số giữa tương quan trung bình của các biến quan sát thuộc hai khái niệm khác nhau và tương quan trung bình của các biến trong cùng một khái niệm, dùng để đánh giá giá trị phân biệt.</strong> Theo Henseler và cộng sự (2015), HTMT dưới 0,85 (hoặc dưới 0,90 với các khái niệm gần nghĩa) thì hai khái niệm đạt giá trị phân biệt. HTMT được đề xuất vì tiêu chí Fornell-Larcker thường không phát hiện được hai khái niệm thực ra đang đo cùng một thứ.</p>

<p>Trong khoá luận dùng SmartPLS, HTMT là bảng bắt buộc của phần đánh giá mô hình đo lường, sau độ tin cậy (Cronbach's alpha, CR) và giá trị hội tụ (AVE). Bài này giải thích HTMT đo gì, tính tay một ví dụ, so sánh với Fornell-Larcker trên cùng bộ số liệu và hướng dẫn xử lý khi HTMT vượt ngưỡng.</p>

<h2>Giá trị phân biệt là gì</h2>
<p>Giá trị phân biệt (discriminant validity) là mức độ một khái niệm thực sự khác các khái niệm còn lại trong mô hình. Nếu "sự hài lòng" và "lòng trung thành" có các câu hỏi tương quan với nhau mạnh gần bằng tương quan giữa các câu trong cùng một thang đo, người trả lời không phân biệt được hai khái niệm, và hệ số đường dẫn giữa chúng trở nên khó tin: bạn đang hồi quy một thứ lên chính nó.</p>
<p>Ba cách đánh giá hay gặp trong khoá luận:</p>
<table>
<thead>
<tr><th>Tiêu chí</th><th>Cách làm</th><th>Ngưỡng</th><th>Ghi chú</th></tr>
</thead>
<tbody>
<tr><td>Fornell-Larcker (1981)</td><td>So căn bậc hai AVE của mỗi khái niệm với tương quan của nó với các khái niệm khác</td><td>√AVE lớn hơn mọi tương quan trên cùng hàng, cột</td><td>Kém nhạy khi hệ số tải chênh nhau ít (Henseler và cộng sự, 2015)</td></tr>
<tr><td>Hệ số tải chéo (cross-loadings)</td><td>Mỗi biến tải lên khái niệm của nó cao hơn lên khái niệm khác</td><td>Tải riêng lớn hơn mọi tải chéo</td><td>Rất dễ đạt, ít khi phát hiện vấn đề</td></tr>
<tr><td>HTMT (Henseler và cộng sự, 2015)</td><td>Tỉ số tương quan khác khái niệm / cùng khái niệm</td><td>&lt; 0,85 (thận trọng) hoặc &lt; 0,90 (khái niệm gần nghĩa)</td><td>Tiêu chí chính hiện nay (Hair và cộng sự, 2019)</td></tr>
</tbody>
</table>

<h2>Công thức HTMT</h2>
<p>Với hai khái niệm i và j:</p>
<p><code>HTMT(i, j) = H / √(Mᵢ × Mⱼ)</code></p>
<ul>
<li><strong>H</strong> (heterotrait): trung bình tương quan giữa từng biến của khái niệm i với từng biến của khái niệm j. Hai khái niệm có 4 biến mỗi khái niệm thì có 4 × 4 = 16 tương quan.</li>
<li><strong>Mᵢ, Mⱼ</strong> (monotrait): trung bình tương quan giữa các biến trong cùng khái niệm i (hoặc j). 4 biến thì có 4 × 3 / 2 = 6 tương quan.</li>
</ul>
<p>Trực giác: nếu các câu của hai khái niệm tương quan với nhau mạnh ngang các câu trong cùng một khái niệm, tỉ số tiến về 1, tức hai khái niệm không tách được. Henseler và cộng sự (2015) cho thấy HTMT là ước lượng của tương quan thật giữa hai khái niệm khi đã loại sai số đo lường (với điều kiện các biến có hệ số tải gần bằng nhau). Vì vậy HTMT = 0,87 có thể hiểu gần đúng là "nếu đo hoàn hảo, hai khái niệm tương quan khoảng 0,87".</p>

<h2>Ví dụ tính tay</h2>
<p>Bộ dữ liệu mô phỏng 250 khách hàng, thang Likert 5 mức, ba khái niệm mỗi khái niệm 4 biến: chất lượng dịch vụ (CL), sự hài lòng (HL), lòng trung thành (TT). Dưới đây là phần ma trận tương quan cần cho cặp HL và TT (làm tròn 2 chữ số).</p>
<p><strong>Tương quan khác khái niệm (HL với TT):</strong></p>
<table>
<thead>
<tr><th></th><th>TT1</th><th>TT2</th><th>TT3</th><th>TT4</th></tr>
</thead>
<tbody>
<tr><td>HL1</td><td>0,45</td><td>0,52</td><td>0,39</td><td>0,42</td></tr>
<tr><td>HL2</td><td>0,42</td><td>0,45</td><td>0,42</td><td>0,42</td></tr>
<tr><td>HL3</td><td>0,36</td><td>0,52</td><td>0,40</td><td>0,42</td></tr>
<tr><td>HL4</td><td>0,44</td><td>0,54</td><td>0,39</td><td>0,46</td></tr>
</tbody>
</table>
<p><strong>Tương quan trong cùng khái niệm:</strong> giữa các biến HL là 0,48; 0,46; 0,54; 0,44; 0,50; 0,52. Giữa các biến TT là 0,52; 0,46; 0,49; 0,59; 0,53; 0,52.</p>
<ol>
<li>H = tổng 16 ô / 16 = (1,78 + 1,71 + 1,70 + 1,83) / 16 = 7,02 / 16 = 0,439.</li>
<li>M<sub>HL</sub> = 2,94 / 6 = 0,490. M<sub>TT</sub> = 3,11 / 6 = 0,518.</li>
<li>√(0,490 × 0,518) = √0,2538 = 0,504.</li>
<li>HTMT = 0,439 / 0,504 = 0,871.</li>
</ol>
<p>Làm tương tự cho hai cặp còn lại, được bảng HTMT:</p>
<table>
<thead>
<tr><th></th><th>CL</th><th>HL</th><th>TT</th></tr>
</thead>
<tbody>
<tr><td>CL</td><td></td><td></td><td></td></tr>
<tr><td>HL</td><td>0,666</td><td></td><td></td></tr>
<tr><td>TT</td><td>0,604</td><td>0,870</td><td></td></tr>
</tbody>
</table>
<p>CL với HL và CL với TT đều dưới 0,85, đạt. HL với TT bằng 0,870: vượt mốc thận trọng 0,85 nhưng dưới 0,90. Hai khái niệm này gần nghĩa về lý thuyết (khách hàng hài lòng thì có xu hướng trung thành), nên theo Henseler và cộng sự (2015) có thể áp dụng mốc 0,90, nhưng cần xem tiếp kiểm định bootstrap bên dưới.</p>

<h2>Cùng dữ liệu, Fornell-Larcker nói gì</h2>
<p>Tính điểm mỗi khái niệm bằng trung bình cộng các biến, hệ số tải là tương quan của từng biến với điểm đó (SmartPLS dùng trọng số ước lượng thay cho trung bình cộng, nên số của bạn sẽ hơi khác). AVE của CL, HL, TT lần lượt là 0,628; 0,618; 0,639. Bảng Fornell-Larcker đặt √AVE trên đường chéo:</p>
<table>
<thead>
<tr><th></th><th>CL</th><th>HL</th><th>TT</th></tr>
</thead>
<tbody>
<tr><td>CL</td><td><strong>0,792</strong></td><td></td><td></td></tr>
<tr><td>HL</td><td>0,532</td><td><strong>0,786</strong></td><td></td></tr>
<tr><td>TT</td><td>0,487</td><td>0,699</td><td><strong>0,799</strong></td></tr>
</tbody>
</table>
<p>Mọi tương quan đều nhỏ hơn √AVE trên cùng hàng và cột (0,699 &lt; 0,786 và &lt; 0,799), nên theo Fornell-Larcker cả ba khái niệm đạt giá trị phân biệt. Trong khi đó HTMT của HL và TT là 0,870. Đây đúng là tình huống Henseler và cộng sự (2015) mô phỏng: Fornell-Larcker bỏ sót vấn đề vì tương quan giữa hai điểm khái niệm (0,699) đã bị sai số đo lường kéo xuống, còn HTMT ước lượng tương quan sau khi loại phần sai số đó. Voorhees và cộng sự (2016) cũng ghi nhận Fornell-Larcker phát hiện kém trong nghiên cứu marketing và khuyên dùng HTMT.</p>

<h2>Kiểm định HTMT bằng bootstrap</h2>
<p>Con số HTMT tính từ một mẫu có sai số chọn mẫu, nên ngoài so với ngưỡng, nên xem khoảng tin cậy bootstrap. Henseler và cộng sự (2015) gọi đây là HTMT<sub>inference</sub>: khoảng tin cậy không chứa 1 thì hai khái niệm phân biệt được. Franke và Sarstedt (2019) so sánh bốn cách và khuyên kiểm định chặt hơn: HTMT phải nhỏ hơn có ý nghĩa so với ngưỡng 0,85 hoặc 0,90, tức cận trên của khoảng tin cậy một phía 95% nằm dưới ngưỡng.</p>
<p>Với dữ liệu ví dụ, bootstrap 5.000 lần cho:</p>
<table>
<thead>
<tr><th>Cặp</th><th>HTMT</th><th>Cận trên một phía 95%</th><th>Kết luận theo ngưỡng 0,90</th></tr>
</thead>
<tbody>
<tr><td>HL → CL</td><td>0,666</td><td>0,766</td><td>Đạt</td></tr>
<tr><td>TT → CL</td><td>0,604</td><td>0,696</td><td>Đạt</td></tr>
<tr><td>TT → HL</td><td>0,870</td><td>0,927</td><td>Chưa đạt: không chắc chắn dưới 0,90</td></tr>
</tbody>
</table>
<p>HL và TT qua được kiểm định so với 1 (cận trên 0,927 &lt; 1) nhưng không qua được kiểm định chặt so với 0,90. Kết luận trung thực: giá trị phân biệt giữa hài lòng và trung thành ở mức giới hạn, cần xem xét như phần sau.</p>
<p>Trong SmartPLS 4: chạy <code>Bootstrapping</code> (5.000 mẫu con), mở <code>Discriminant validity &gt; Heterotrait-monotrait ratio (HTMT)</code> trong kết quả bootstrap, chọn tab <code>Confidence intervals</code>. Nếu muốn cận trên một phía, chọn kiểu kiểm định One-tailed khi cài bootstrap và đọc cột 95%. Không có SmartPLS thì <a href="/cong-cu/pls-sem/">chạy PLS-SEM trên trình duyệt</a>: bảng HTMT kèm sẵn cận trên một phía 95% từ bootstrap.</p>

<h2>Khi HTMT vượt ngưỡng: xử lý thế nào</h2>
<ol>
<li><strong>Xem lại nội dung các câu.</strong> Có câu nào của HL thực ra hỏi về ý định quay lại ("Tôi sẽ tiếp tục dùng dịch vụ này")? Câu như vậy thuộc về TT. Hai thang đo vay từ hai nguồn khác nhau rất hay chồng ý.</li>
<li><strong>Tìm biến gây ra tương quan chéo cao.</strong> Trong bảng tương quan, cột TT2 có tương quan với HL cao nhất (0,45 đến 0,54). Thử loại TT2, tính lại HTMT. Chỉ loại khi còn đủ ít nhất 3 biến và nội dung khái niệm không bị hụt; ghi lý do vào chương 4.</li>
<li><strong>Kiểm tra dữ liệu.</strong> Phiếu trả lời rập khuôn (cùng một mức cho cả khối) làm tương quan chéo tăng giả tạo. Lọc lại theo bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">cách lọc phiếu khảo sát không hợp lệ</a>.</li>
<li><strong>Lập luận lý thuyết cho mốc 0,90</strong> khi hai khái niệm vốn gần nghĩa, và trích dẫn rõ (Henseler và cộng sự, 2015; Hair và cộng sự, 2019).</li>
<li><strong>Cân nhắc gộp</strong> nếu lý thuyết cho phép coi hai khái niệm là một, hoặc đổi mô hình. Đây là thay đổi lớn, nên bàn với giáo viên hướng dẫn.</li>
</ol>
<p>Không nên loại biến hàng loạt chỉ để kéo HTMT xuống: mỗi lần loại phải có lý do về nội dung. Nhập HTMT, AVE, hệ số tải vào <a href="/cong-cu/bac-si-ket-qua/">bác sĩ kết quả</a> để xem các cách xử lý hợp lệ có trích dẫn và đoạn văn giải trình.</p>

<h2>HTMT trong quy trình đánh giá mô hình đo lường</h2>
<p>Theo Hair và cộng sự (2019), mô hình đo lường kết quả (reflective) đánh giá theo bốn bước:</p>
<ol>
<li>Hệ số tải ngoài từ 0,708 (chấp nhận 0,40 đến 0,70 nếu các chỉ số khác đạt).</li>
<li>Độ tin cậy: Cronbach's alpha, rho_A, CR từ 0,70 đến 0,95. Cách tính CR có ở bài <a href="/posts/cronbach-alpha-la-gi/">Cronbach's alpha là gì</a>.</li>
<li>Giá trị hội tụ: AVE từ 0,50. Cách tính tay AVE có ở bài <a href="/posts/ave-cr-la-gi/">AVE và CR là gì</a>.</li>
<li>Giá trị phân biệt: HTMT dưới 0,85 hoặc 0,90, kèm khoảng tin cậy bootstrap.</li>
</ol>
<p>Toàn bộ ngưỡng kèm nguồn có ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận Cronbach, KMO, AVE, HTMT, VIF</a>. HTMT chỉ áp dụng cho khái niệm kết quả (reflective) có từ 2 biến trở lên; khái niệm nguyên nhân (formative) và khái niệm một biến không tính HTMT. Roemer và cộng sự (2021) đề xuất HTMT2, dùng trung bình nhân thay cho trung bình cộng để ước lượng tốt hơn khi hệ số tải chênh nhau nhiều; một số phiên bản SmartPLS báo cáo thêm chỉ số này.</p>

<h2>Câu mẫu khi viết vào chương 4</h2>
<blockquote>Giá trị phân biệt được đánh giá bằng tiêu chí HTMT (Henseler và cộng sự, 2015). Bảng 4.x cho thấy giá trị HTMT của các cặp khái niệm nằm trong khoảng 0,604 đến 0,870. Cặp sự hài lòng và lòng trung thành có HTMT = 0,870, vượt ngưỡng 0,85 nhưng nhỏ hơn ngưỡng 0,90 áp dụng cho các khái niệm gần nghĩa về mặt lý thuyết; khoảng tin cậy bootstrap không chứa 1. Do đó, các khái niệm trong mô hình đạt giá trị phân biệt, tuy nhiên mức phân biệt giữa sự hài lòng và lòng trung thành ở mức giới hạn và được nêu trong phần hạn chế của nghiên cứu.</blockquote>
<p>Định nghĩa hai khái niệm trong ví dụ, kèm thang đo có nguồn, ở trang <a href="/khai-niem/su-hai-long-khach-hang/">sự hài lòng của khách hàng</a> và <a href="/khai-niem/long-trung-thanh/">lòng trung thành</a>. Chọn thang đo có câu hỏi tách bạch ngay từ đầu là cách rẻ nhất để tránh HTMT cao; <a href="/cong-cu/bo-khao-sat/">công cụ tạo bảng hỏi</a> lấy câu hỏi từ thang đo gốc có trích dẫn cho từng khái niệm.</p>

<h2>Câu hỏi thường gặp</h2>
<h3>HTMT bao nhiêu là đạt, 0,85 hay 0,90?</h3>
<p>Henseler và cộng sự (2015) đề xuất 0,85 là mốc thận trọng, 0,90 cho các khái niệm gần nghĩa về lý thuyết (ví dụ hài lòng và trung thành, thái độ và ý định). Dùng 0,90 thì phải lập luận vì sao hai khái niệm gần nghĩa, không chọn mốc sau khi đã thấy kết quả.</p>
<h3>HTMT2 là gì, khác HTMT thế nào?</h3>
<p>HTMT2 do Roemer và cộng sự (2021) đề xuất, thay trung bình cộng các tương quan bằng trung bình nhân. Khi hệ số tải của các biến khá đồng đều, hai chỉ số gần như bằng nhau; khi hệ số tải chênh nhau nhiều, HTMT2 ước lượng tương quan thật chính xác hơn. Ngưỡng đọc như HTMT.</p>
<h3>Fornell-Larcker đạt nhưng HTMT không đạt thì kết luận theo cái nào?</h3>
<p>Theo HTMT. Henseler và cộng sự (2015) chỉ ra Fornell-Larcker thường không phát hiện được thiếu giá trị phân biệt, như ví dụ ở trên. Báo cáo cả hai bảng nếu giáo viên hướng dẫn yêu cầu, nhưng kết luận dựa trên HTMT.</p>
<h3>Chạy SPSS và AMOS thì có tính HTMT được không?</h3>
<p>Được. HTMT chỉ cần ma trận tương quan giữa các biến quan sát, nên tính từ bảng Correlations của SPSS bằng Excel theo đúng ba bước ở trên. Voorhees và cộng sự (2016) khuyên dùng HTMT cả trong CB-SEM (AMOS), không chỉ PLS-SEM.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Fornell, C., &amp; Larcker, D. F. (1981). Evaluating structural equation models with unobservable variables and measurement error. <em>Journal of Marketing Research, 18</em>(1), 39–50. https://doi.org/10.2307/3151312</li>
<li>Franke, G., &amp; Sarstedt, M. (2019). Heuristics versus statistics in discriminant validity testing: A comparison of four procedures. <em>Internet Research, 29</em>(3), 430–447. https://doi.org/10.1108/IntR-12-2017-0515</li>
<li>Hair, J. F., Risher, J. J., Sarstedt, M., &amp; Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review, 31</em>(1), 2–24. https://doi.org/10.1108/EBR-11-2018-0203</li>
<li>Henseler, J., Ringle, C. M., &amp; Sarstedt, M. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling. <em>Journal of the Academy of Marketing Science, 43</em>(1), 115–135. https://doi.org/10.1007/s11747-014-0403-8</li>
<li>Roemer, E., Schuberth, F., &amp; Henseler, J. (2021). HTMT2: An improved criterion for assessing discriminant validity in structural equation modeling. <em>Industrial Management &amp; Data Systems, 121</em>(12), 2637–2650. https://doi.org/10.1108/IMDS-02-2021-0082</li>
<li>Voorhees, C. M., Brady, M. K., Calantone, R., &amp; Ramirez, E. (2016). Discriminant validity testing in marketing: An analysis, causes for concern, and proposed remedies. <em>Journal of the Academy of Marketing Science, 44</em>(1), 119–134. https://doi.org/10.1007/s11747-015-0455-4</li>
</ul>
