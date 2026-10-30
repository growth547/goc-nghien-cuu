---
title: "Cách đặt giả thuyết nghiên cứu: cấu trúc câu và ví dụ H1, H2"
description: "Cách đặt giả thuyết nghiên cứu: cấu trúc câu, cùng chiều hay ngược chiều, giả thuyết trung gian, điều tiết, đoạn lập luận mẫu, cách kết luận ủng hộ hay không."
pubDatetime: 2026-10-30T09:12:00+07:00
featured: false
tags: ["mô hình nghiên cứu","khoá luận","PLS-SEM"]
---

<p>Giả thuyết nghiên cứu là một phát biểu có thể kiểm định bằng dữ liệu về quan hệ giữa hai hay nhiều khái niệm, được suy ra từ lý thuyết và nghiên cứu trước. Trong khoá luận định lượng, mỗi mũi tên trong mô hình là một giả thuyết, đánh số H1, H2, H3... Bài này đưa ra mẫu câu cho từng loại giả thuyết, cách quyết định cùng chiều hay ngược chiều, cấu trúc đoạn lập luận trước mỗi giả thuyết, và cách viết kết luận khi dữ liệu không ủng hộ.</p>

<h2>Giả thuyết nghiên cứu khác H0 và H1 trong thống kê</h2>
<p>Đây là chỗ nhầm phổ biến nhất. Trong sách thống kê, H0 là giả thuyết không (không có tác động) và H1 (hay Ha) là giả thuyết đối. Trong khoá luận, H1, H2, H3 là số thứ tự các giả thuyết nghiên cứu, mỗi giả thuyết tương ứng một giả thuyết đối trong thống kê.</p>
<table>
<thead><tr><th></th><th>Giả thuyết nghiên cứu (viết trong chương 2)</th><th>Cặp giả thuyết thống kê (ngầm khi kiểm định)</th></tr></thead>
<tbody>
<tr><td>Ví dụ</td><td>H3: Nhận thức sự hữu ích có tác động cùng chiều đến sự hài lòng.</td><td>H0: β = 0; Ha: β ≠ 0 (hoặc β &gt; 0)</td></tr>
<tr><td>Cách viết</td><td>Bằng lời, gắn với khái niệm</td><td>Bằng ký hiệu, gắn với tham số</td></tr>
<tr><td>Có cần viết ra không</td><td>Bắt buộc</td><td>Không cần liệt kê cho từng giả thuyết, trừ khi khoa yêu cầu</td></tr>
</tbody>
</table>
<p>Không cần viết cặp "H0: Nhận thức sự hữu ích không tác động..." cho từng giả thuyết trong chương 2. Phần đó lặp lại và làm chương dài vô ích.</p>

<h2>Mẫu câu cho từng loại giả thuyết</h2>
<table>
<thead><tr><th>Loại</th><th>Mẫu câu</th><th>Ví dụ</th><th>Kiểm định</th></tr></thead>
<tbody>
<tr><td>Tác động cùng chiều</td><td>[X] có tác động cùng chiều đến [Y]</td><td>Sự hài lòng có tác động cùng chiều đến ý định tiếp tục sử dụng ví điện tử.</td><td>Hệ số hồi quy hoặc hệ số đường dẫn dương, có ý nghĩa</td></tr>
<tr><td>Tác động ngược chiều</td><td>[X] có tác động ngược chiều đến [Y]</td><td>Rủi ro cảm nhận có tác động ngược chiều đến ý định mua hàng trực tuyến.</td><td>Hệ số âm, có ý nghĩa</td></tr>
<tr><td>Trung gian</td><td>[M] đóng vai trò trung gian trong mối quan hệ giữa [X] và [Y]</td><td>Sự hài lòng đóng vai trò trung gian trong mối quan hệ giữa nhận thức sự hữu ích và ý định tiếp tục sử dụng.</td><td>Tác động gián tiếp X → M → Y có ý nghĩa (bootstrap)</td></tr>
<tr><td>Điều tiết</td><td>[W] điều tiết mối quan hệ giữa [X] và [Y], cụ thể...</td><td>Kinh nghiệm sử dụng điều tiết mối quan hệ giữa niềm tin và ý định tiếp tục sử dụng; quan hệ này mạnh hơn ở người dùng ít kinh nghiệm.</td><td>Biến tương tác X × W có ý nghĩa</td></tr>
<tr><td>Khác biệt nhóm</td><td>Có sự khác biệt về [Y] giữa các nhóm [đặc điểm]</td><td>Có sự khác biệt về ý định tiếp tục sử dụng giữa sinh viên các năm học.</td><td>t-test, ANOVA</td></tr>
</tbody>
</table>
<p>"Tác động cùng chiều" và "tác động tích cực" đều được dùng; chọn một cách và giữ nhất quán. Tránh "ảnh hưởng lớn", "ảnh hưởng mạnh" trong câu giả thuyết, vì độ mạnh không phải là điều bạn kiểm định bằng p.</p>

<h2>Cùng chiều hay ngược chiều: quyết định thế nào</h2>
<p>Chiều của giả thuyết đến từ lý thuyết, nhưng phải khớp với cách câu hỏi được viết trong bảng hỏi. Ba trường hợp hay gây lúng túng:</p>
<ul>
<li><strong>Giá.</strong> Trong UTAUT2, khái niệm là "giá trị giá cả" (price value), đo bằng các câu như "ứng dụng đáng đồng tiền", nên giả thuyết là cùng chiều (Venkatesh và cộng sự, 2012). Nếu bạn đo "giá cao" hoặc "chi phí cảm nhận", giả thuyết thành ngược chiều. Xem câu hỏi trên trang <a href="/thang-do/utaut2/">thang đo UTAUT2</a>.</li>
<li><strong>Rủi ro, lo ngại, căng thẳng.</strong> Khái niệm mang nghĩa tiêu cực, điểm cao là tệ, nên tác động lên ý định hay sự hài lòng thường là ngược chiều.</li>
<li><strong>Câu đảo chiều trong thang đo.</strong> Sau khi mã hoá lại, điểm cao của cả thang đo vẫn mang nghĩa của khái niệm. Chiều giả thuyết dựa trên nghĩa của khái niệm, không dựa trên từng câu.</li>
</ul>

<h2>Đoạn lập luận trước mỗi giả thuyết</h2>
<p>Một giả thuyết đứng một mình, chỉ kèm một trích dẫn, là điểm yếu hội đồng hay hỏi. Đoạn lập luận nên có bốn phần, khoảng 120 đến 200 chữ:</p>
<ol>
<li><strong>Cơ chế theo lý thuyết</strong>: vì sao X dẫn tới Y.</li>
<li><strong>Bằng chứng thực nghiệm</strong>: ít nhất hai nghiên cứu tìm thấy quan hệ này, nêu bối cảnh của họ.</li>
<li><strong>Lý do trong bối cảnh của bạn</strong>: vì sao quan hệ này đáng kiểm định ở đây.</li>
<li><strong>Câu giả thuyết</strong>, in đậm hoặc in nghiêng, đánh số.</li>
</ol>
<p>Ví dụ cho giả thuyết niềm tin trong mô hình ý định tiếp tục sử dụng ví điện tử (mô hình đầy đủ ở bài <a href="/posts/cach-xay-dung-mo-hinh-nghien-cuu/">cách xây dựng mô hình nghiên cứu</a>):</p>
<blockquote><p>Niềm tin phản ánh việc người dùng tin rằng nhà cung cấp dịch vụ trung thực, quan tâm tới khách hàng và đủ năng lực thực hiện cam kết (Gefen và cộng sự, 2003). Khi giao dịch diễn ra trực tuyến, người dùng không kiểm soát được hành vi của nhà cung cấp, nên niềm tin làm giảm cảm nhận bất định và khiến họ sẵn sàng tiếp tục giao dịch. Gefen và cộng sự (2003) cho thấy niềm tin tác động cùng chiều tới ý định mua hàng trực tuyến bên cạnh các yếu tố của TAM. Với ví điện tử, người dùng gửi tiền và dữ liệu thanh toán cho nhà cung cấp, nên lo ngại mất tiền hoặc lộ thông tin là một cân nhắc thường trực khi quyết định có dùng tiếp hay không. Do đó, giả thuyết sau được đề xuất:</p><p><em>H6: Niềm tin có tác động cùng chiều đến ý định tiếp tục sử dụng ví điện tử của sinh viên.</em></p></blockquote>
<p>Trong khoá luận thật, phần bằng chứng thực nghiệm nên có thêm các nghiên cứu về ví điện tử hoặc thanh toán di động, ưu tiên nghiên cứu tại Việt Nam hoặc châu Á.</p>

<h2>Giả thuyết trung gian và điều tiết</h2>
<h3>Trung gian</h3>
<p>Cách kiểm định trung gian theo bốn bước của Baron và Kenny (1986) đã được xem lại: Zhao và cộng sự (2010) cho thấy điều kiện duy nhất cần cho trung gian là tác động gián tiếp X → M → Y có ý nghĩa, kiểm định bằng bootstrap; tác động tổng của X lên Y không cần có ý nghĩa. Vì vậy, viết giả thuyết trung gian theo tác động gián tiếp, như mẫu trong bảng trên, và báo cáo khoảng tin cậy bootstrap của tác động gián tiếp.</p>
<p>Nếu mô hình có trung gian, giả thuyết trung gian thường được đánh số sau các giả thuyết trực tiếp (ví dụ H7, H8), hoặc ký hiệu H7a, H7b nếu có nhiều đường gián tiếp.</p>
<h3>Điều tiết</h3>
<p>Giả thuyết điều tiết nên nêu cả chiều điều tiết: quan hệ mạnh hơn hay yếu hơn ở nhóm nào. "W điều tiết quan hệ giữa X và Y" mà không nói chiều thì gần như không bác bỏ được, vì bất kỳ tương tác nào cũng "ủng hộ" nó.</p>

<h2>Có hướng hay không có hướng</h2>
<p>"X có tác động đến Y" là giả thuyết không có hướng; "X có tác động cùng chiều đến Y" là có hướng. Khoá luận dựa trên lý thuyết nền nên dùng giả thuyết có hướng. Lưu ý khi kiểm định: SPSS và SmartPLS mặc định báo p hai phía. Nếu bạn dùng p một phía cho giả thuyết có hướng, ghi rõ trong chương 3; nếu không ghi gì, người đọc hiểu là hai phía. Một hệ số có ý nghĩa nhưng ngược dấu với giả thuyết có hướng nghĩa là giả thuyết <strong>không được ủng hộ</strong>, dù p nhỏ.</p>

<h2>Kết luận giả thuyết: viết thế nào cho đúng</h2>
<p>Dữ liệu không "chứng minh" giả thuyết. Kiểm định cho biết dữ liệu có phù hợp với giả thuyết hay không ở một mức ý nghĩa đã chọn. Wasserstein và Lazar (2016), thay mặt Hiệp hội Thống kê Hoa Kỳ, nhấn mạnh rằng p-value không đo xác suất giả thuyết là đúng và không đo độ lớn của tác động. Cách viết an toàn:</p>
<table>
<thead><tr><th>Giả thuyết</th><th>Quan hệ</th><th>β</th><th>p</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td>H4</td><td>Nhận thức sự hữu ích → Ý định tiếp tục</td><td>0,21</td><td>0,003</td><td>Ủng hộ</td></tr>
<tr><td>H5</td><td>Sự hài lòng → Ý định tiếp tục</td><td>0,38</td><td>&lt; 0,001</td><td>Ủng hộ</td></tr>
<tr><td>H6</td><td>Niềm tin → Ý định tiếp tục</td><td>0,07</td><td>0,240</td><td>Không ủng hộ</td></tr>
</tbody>
</table>
<p>Các con số trong bảng là ví dụ minh hoạ cách trình bày. Dùng "ủng hộ" và "không ủng hộ" (supported, not supported), tránh "chấp nhận" và "bác bỏ" giả thuyết nghiên cứu, vì về mặt thống kê, cái bị bác bỏ hay không là H0. Kèm theo β, p, và nếu dùng PLS-SEM thì thêm khoảng tin cậy bootstrap và f². Cách trình bày chương 4 đầy đủ có trong bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4</a>.</p>
<p>Giả thuyết không được ủng hộ không phải là thất bại. Đó là kết quả cần thảo luận: vì sao ở bối cảnh của bạn quan hệ này không xuất hiện. Hội đồng đánh giá phần giải thích, không đánh giá số giả thuyết được ủng hộ.</p>

<h2>Không sửa giả thuyết sau khi thấy kết quả</h2>
<p>Kerr (1998) gọi việc viết lại giả thuyết sau khi biết kết quả là HARKing (hypothesizing after the results are known), ví dụ đổi "cùng chiều" thành "ngược chiều" vì hệ số ra âm, hoặc xoá giả thuyết không được ủng hộ khỏi chương 2. Việc này biến một phát hiện ngẫu nhiên thành "dự đoán thành công" và làm sai lệch kết luận. Cách tránh đơn giản: chốt và lưu bản chương 2 có ngày trước khi thu dữ liệu, giống tinh thần đăng ký trước mà Nosek và cộng sự (2018) đề xuất. Phát hiện bất ngờ vẫn được viết, nhưng trong phần thảo luận, ghi rõ là phát hiện ngoài giả thuyết.</p>

<h2>Lỗi thường gặp</h2>
<ul>
<li><strong>Giả thuyết ghép hai quan hệ</strong>: "X và Z có tác động cùng chiều đến Y". Tách thành hai giả thuyết.</li>
<li><strong>Tên khái niệm trong giả thuyết khác tên trong mô hình và bảng hỏi.</strong></li>
<li><strong>Đánh số không khớp hình vẽ.</strong> H3 trên hình phải là H3 trong bài và trong bảng kết quả. <a href="/cong-cu/ve-mo-hinh/">Công cụ vẽ mô hình nghiên cứu</a> đánh số giả thuyết theo mũi tên và sinh sẵn câu giả thuyết tiếng Việt để bạn chỉnh sửa.</li>
<li><strong>Giả thuyết không có lập luận</strong>, chỉ có một trích dẫn.</li>
<li><strong>Viết "giả thuyết được chứng minh".</strong> Dùng "được ủng hộ".</li>
<li><strong>Giả thuyết về biến nhân khẩu học không có lý thuyết</strong>, chỉ để có thêm kiểm định.</li>
</ul>

<h2>Câu hỏi thường gặp</h2>
<h3>Một khoá luận cần bao nhiêu giả thuyết?</h3>
<p>Bằng số mũi tên trong mô hình, cộng giả thuyết trung gian, điều tiết nếu có. Khoá luận đại học thường có 4 đến 8 giả thuyết.</p>
<h3>Giả thuyết khác biệt theo giới tính, độ tuổi có cần đặt không?</h3>
<p>Chỉ đặt khi có lý thuyết hoặc nghiên cứu trước dự đoán khác biệt. Nếu chỉ muốn mô tả, đưa vào phần phân tích bổ sung, không cần đánh số giả thuyết.</p>
<h3>Viết giả thuyết ở chương 1 hay chương 2?</h3>
<p>Phần lớn khoá luận đặt giả thuyết cuối chương 2, ngay sau phần lập luận, cùng với hình mô hình. Chương 1 chỉ nêu câu hỏi nghiên cứu.</p>
<h3>Hệ số có ý nghĩa ở mức 10% thì kết luận thế nào?</h3>
<p>Theo mức ý nghĩa bạn đã khai báo trong chương 3. Nếu khai báo 5% thì p = 0,08 là không ủng hộ; có thể bình luận "có xu hướng" trong phần thảo luận nhưng không đổi kết luận.</p>
<h3>Hội đồng hỏi "sao giả thuyết này bị bác bỏ" thì trả lời thế nào?</h3>
<p>Nêu kết quả đúng thuật ngữ (không được ủng hộ), rồi đưa một hai giải thích có cơ sở: đặc điểm mẫu, bối cảnh, đo lường. Xem thêm các tình huống trong bài <a href="/posts/hoi-dong-hoi-gi-ve-phan-khao-sat/">hội đồng hỏi gì về phần khảo sát</a>.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Baron, R. M., &amp; Kenny, D. A. (1986). The moderator–mediator variable distinction in social psychological research: Conceptual, strategic, and statistical considerations. <em>Journal of Personality and Social Psychology, 51</em>(6), 1173–1182. https://doi.org/10.1037/0022-3514.51.6.1173</li>
<li>Gefen, D., Karahanna, E., &amp; Straub, D. W. (2003). Trust and TAM in online shopping: An integrated model. <em>MIS Quarterly, 27</em>(1), 51–90. https://doi.org/10.2307/30036519</li>
<li>Kerr, N. L. (1998). HARKing: Hypothesizing after the results are known. <em>Personality and Social Psychology Review, 2</em>(3), 196–217. https://doi.org/10.1207/s15327957pspr0203_4</li>
<li>Nosek, B. A., Ebersole, C. R., DeHaven, A. C., &amp; Mellor, D. T. (2018). The preregistration revolution. <em>Proceedings of the National Academy of Sciences, 115</em>(11), 2600–2606. https://doi.org/10.1073/pnas.1708274114</li>
<li>Venkatesh, V., Thong, J. Y. L., &amp; Xu, X. (2012). Consumer acceptance and use of information technology: Extending the unified theory of acceptance and use of technology. <em>MIS Quarterly, 36</em>(1), 157–178. https://doi.org/10.2307/41410412</li>
<li>Wasserstein, R. L., &amp; Lazar, N. A. (2016). The ASA statement on p-values: Context, process, and purpose. <em>The American Statistician, 70</em>(2), 129–133. https://doi.org/10.1080/00031305.2016.1154108</li>
<li>Zhao, X., Lynch, J. G., Jr., &amp; Chen, Q. (2010). Reconsidering Baron and Kenny: Myths and truths about mediation analysis. <em>Journal of Consumer Research, 37</em>(2), 197–206. https://doi.org/10.1086/651257</li>
</ul>
