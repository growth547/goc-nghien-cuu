---
title: "Phát hiện câu trả lời khảo sát do AI viết và cách phòng"
description: "Cách phát hiện câu trả lời khảo sát do AI viết bằng mắt thường, và cách thiết kế câu hỏi tự luận khiến việc nhờ ChatGPT trả lời trở nên khó và vô ích."
pubDatetime: 2026-10-29T01:00:00+07:00
modDatetime: 2026-10-30T09:04:50+07:00
featured: false
tags: ["làm sạch dữ liệu","AI"]
---

<p>Bạn đọc phần trả lời tự luận của 200 phiếu. Phần lớn ngắn, có lỗi chính tả, viết kiểu nói chuyện. Rồi tới phiếu số 87: ba đoạn văn mạch lạc, có mở bài, có "thứ nhất, thứ hai, cuối cùng", kết bằng một câu tổng kết gọn gàng. Phiếu số 112 cũng vậy. Phiếu số 140 cũng vậy, và dùng gần đúng những cụm từ của phiếu 87.</p>
<p>Câu trả lời do chatbot viết đã thành chuyện thường gặp trong khảo sát trực tuyến, nhất là khảo sát có trả thưởng. Câu trả lời như vậy không phản ánh trải nghiệm hay quan điểm của người được hỏi, nên không dùng được làm dữ liệu nghiên cứu. Bài này giúp bạn nhận diện bằng mắt và thiết kế câu hỏi để giảm vấn đề ngay từ đầu.</p>

<h2>Trước hết: đừng tin máy dò AI</h2>
<p>Các công cụ "dò văn bản AI" cho kết quả thiếu ổn định. Tháng 7/2023, OpenAI đã ngừng công cụ phân loại văn bản AI của chính họ vì độ chính xác thấp (OpenAI, 2023); khi ra mắt, chính OpenAI cho biết công cụ chỉ nhận đúng 26% văn bản do AI viết và gắn nhầm 9% văn bản do người viết. Cũng năm đó, Liang và cộng sự (2023) công bố trên tạp chí <em>Patterns</em> rằng nhiều bộ dò thường xếp nhầm bài viết của người không bản ngữ là do AI viết. Chưa có cơ sở để tin rằng chúng làm tốt hơn với tiếng Việt.</p>
<p>Vì vậy, đừng loại phiếu chỉ vì một trang web báo "87% AI". Hãy dựa vào nhiều dấu hiệu cùng lúc, và đối chiếu với phần còn lại của phiếu.</p>

<h2>Các dấu hiệu nhận biết bằng mắt</h2>
<table>
<thead>
<tr><th>Dấu hiệu</th><th>Trông như thế nào</th><th>Độ tin cậy</th></tr>
</thead>
<tbody>
<tr><td>Chung chung, không có chi tiết riêng</td><td>"Dịch vụ cần cải thiện chất lượng và nâng cao trải nghiệm khách hàng" mà không nói cụ thể chuyện gì đã xảy ra</td><td>Trung bình. Nhiều người thật cũng viết chung chung</td></tr>
<tr><td>Cấu trúc bài luận trong ô trả lời ngắn</td><td>Mở bài, gạch đầu dòng, đánh số, câu kết tổng hợp</td><td>Trung bình đến cao</td></tr>
<tr><td>Lặp lại nguyên văn câu hỏi</td><td>Câu đầu tiên diễn đạt lại đề bài trước khi trả lời</td><td>Trung bình</td></tr>
<tr><td>Nhiều phiếu giống nhau về cấu trúc</td><td>Cùng cách mở đầu, cùng thứ tự ý, cùng cụm từ hiếm gặp</td><td>Cao</td></tr>
<tr><td>Lệch văn phong trong cùng phiếu</td><td>Câu khác viết không dấu, viết tắt, nhưng một câu thì văn chuẩn chỉnh, dài</td><td>Cao</td></tr>
<tr><td>Lệch với câu trắc nghiệm</td><td>Chọn "chưa từng dùng" nhưng viết nhận xét chi tiết về trải nghiệm sử dụng</td><td>Cao</td></tr>
<tr><td>Độ dài bất thường so với thời gian làm bài</td><td>Hàng trăm chữ nhưng cả phiếu hoàn thành rất nhanh</td><td>Cao nếu công cụ có ghi thời lượng</td></tr>
<tr><td>Dấu vết sao chép</td><td>Còn sót "Dưới đây là câu trả lời…", định dạng markdown như dấu ** hay ###</td><td>Gần như chắc chắn</td></tr>
</tbody>
</table>

<p>Dấu hiệu mạnh nhất thường là <strong>sự không khớp</strong>: giữa câu tự luận và câu trắc nghiệm, giữa văn phong các câu với nhau, giữa lượng chữ và thời gian bỏ ra. Một người viết hay vẫn viết khớp với chính họ. Văn bản dán từ chatbot thì thường lạc khỏi phần còn lại của phiếu.</p>

<h3>Đặt cạnh nhau: một câu trả lời của người và một câu của chatbot</h3>
<p>Hai câu dưới đây do chúng tôi tự viết để minh hoạ, không phải phiếu thật. Câu hỏi: <em>"Lần gần nhất đặt đồ ăn qua ứng dụng, điều gì khiến bạn không hài lòng?"</em></p>
<table>
<thead>
<tr><th>Kiểu người thật hay viết</th><th>Kiểu chatbot hay viết</th></tr>
</thead>
<tbody>
<tr><td>"tối t5 đặt bún bò quán gần ktx, app báo 25p mà gần 1 tiếng mới tới, nước lèo nguội. shipper ko gọi trước"</td><td>"Nhìn chung, trải nghiệm của tôi khá tích cực. Tuy nhiên, thời gian giao hàng đôi khi chưa đáp ứng kỳ vọng, và chất lượng món ăn có thể bị ảnh hưởng. Ngoài ra, việc giao tiếp giữa tài xế và khách hàng đóng vai trò quan trọng trong việc nâng cao trải nghiệm tổng thể."</td></tr>
</tbody>
</table>
<p>Câu bên trái có lỗi chính tả, viết tắt, nhưng có chi tiết chỉ người trong cuộc biết: món gì, quán ở đâu, thời gian hứa và thời gian thật. Câu bên phải đúng ngữ pháp, có "nhìn chung", "tuy nhiên", "ngoài ra", "đóng vai trò quan trọng", và không có một chi tiết nào kiểm chứng được. Nếu cùng phiếu đó, các câu trắc nghiệm được làm rất nhanh và các ô tự luận khác viết không dấu, khả năng câu bên phải được dán từ chatbot là cao. Một câu như vậy đứng riêng thì chưa đủ để kết luận.</p>

<h3>Cách soát nhanh trong Excel</h3>
<ol>
<li>Thêm cột đếm số ký tự của mỗi câu tự luận: <code>=LEN(F2)</code>. Sắp xếp giảm dần và đọc kỹ nhóm dài nhất.</li>
<li>Tìm các cụm từ hay gặp trong văn chatbot mà đáp viên bình thường hiếm dùng, ví dụ "nhìn chung", "đóng vai trò quan trọng", "ngoài ra", "trải nghiệm tổng thể". Dùng <code>=ISNUMBER(SEARCH("nhìn chung",F2))</code>. Một cụm không nói lên gì, nhiều cụm cùng xuất hiện thì đáng đọc lại.</li>
<li>Sắp xếp theo câu tự luận để các câu giống nhau nằm cạnh nhau. Văn bản sinh ra từ cùng một đề bài thường có khung giống nhau.</li>
<li>Với mỗi phiếu nghi ngờ, đọc lại toàn bộ phiếu chứ không chỉ một câu.</li>
</ol>

<h2>Thiết kế câu hỏi khó nhờ AI trả lời</h2>
<p>Bạn không chặn được hoàn toàn việc dán câu trả lời từ chatbot. Nhưng bạn có thể làm cho việc đó tốn công hơn tự viết, và làm cho câu trả lời giả dễ lộ hơn.</p>

<h3>Hỏi trải nghiệm cụ thể, không hỏi ý kiến chung</h3>
<p>Câu yếu: <em>"Bạn nghĩ gì về dịch vụ giao đồ ăn?"</em> Chatbot trả lời câu này rất trơn tru.</p>
<p>Câu tốt hơn: <em>"Kể lại lần gần nhất bạn đặt đồ ăn qua ứng dụng: bạn đặt món gì, mất bao lâu, có gì khiến bạn không hài lòng?"</em> Chatbot không biết lần gần nhất của bạn. Nó vẫn có thể bịa, nhưng chuyện bịa thường thiếu chi tiết thật như tên quán, giá tiền, giờ giấc.</p>

<h3>Neo vào câu trả lời trước đó trong form</h3>
<p>Nếu công cụ khảo sát cho phép chèn đáp án trước vào câu sau (piping), hãy dùng. Ví dụ: <em>"Ở câu trên bạn chọn mức 2 cho tiêu chí tốc độ giao hàng. Điều gì khiến bạn chấm như vậy?"</em> Người dán từ chatbot phải chép cả ngữ cảnh, và câu trả lời giả dễ lệch với điểm đã chấm.</p>

<h3>Dùng ngữ cảnh địa phương</h3>
<p>Hỏi về những thứ gắn với nơi chốn, thời điểm, nhóm người cụ thể mà mẫu của bạn biết rõ: căng tin trường, tuyến xe buýt bạn đi, đợt đăng ký học phần vừa rồi. Đáp viên thật trả lời dễ, chatbot thì phải đoán.</p>

<h3>Cho phép trả lời ngắn và nói rõ điều đó</h3>
<p>Nhiều người dùng AI vì sợ viết ngắn bị đánh giá thấp. Ghi chú ngay dưới câu hỏi: <em>"Chỉ cần 1–3 câu, viết theo cách bạn vẫn nói. Không cần văn hay."</em> Câu trả lời ngắn mà thật có giá trị hơn một đoạn văn đẹp mà giả.</p>

<h3>Giảm số câu tự luận</h3>
<p>Mỗi câu tự luận là một chỗ đáp viên mệt mỏi có thể tìm đường tắt. Giữ một hai câu thật sự cần, các ý khác chuyển thành trắc nghiệm có lựa chọn "Khác (ghi rõ)".</p>

<h3>Nói rõ cam kết dữ liệu</h3>
<p>Thêm một dòng ở đầu form: câu trả lời phải là ý kiến của chính bạn, phiếu có dấu hiệu sao chép hoặc dùng AI viết hộ sẽ không được tính. Câu này không chặn được người cố tình, nhưng nó giảm số người làm theo thói quen.</p>

<p>Dù thiết kế tốt tới đâu, bạn vẫn phải đọc lại từng câu tự luận, và với vài trăm phiếu thì việc này rất tốn thời gian.</p>

<p>Nếu bạn thu mẫu qua một nền tảng, hãy hỏi nền tảng đó có kiểm tra câu tự luận hay không, kiểm tra bằng cách nào và bạn có xem được lý do một phiếu bị gắn cờ không. Một lựa chọn để thu mẫu là <a href="https://geniusdata.io/signup?ref=lab-blog&amp;next=%2Fapp%2Fforms&amp;utm_source=goc-nghien-cuu&amp;utm_medium=blog&amp;utm_campaign=ai-lab&amp;utm_content=phat-hien-cau-tra-loi-khao-sat-do-ai-viet" rel="sponsored noopener">Genius Data</a> (link giới thiệu), nơi người nghiên cứu tự đặt mức thưởng cho mỗi câu hỏi và chỉ trả tiền cho phiếu được duyệt. Dù dùng nền tảng nào, các nguyên tắc thiết kế ở trên và bước tự đọc lại câu tự luận vẫn là tuyến phòng thủ đầu tiên, và chính bạn là người phải giải thích tiêu chí loại phiếu trong chương 3.</p>

<h2>Xử lý phiếu nghi ngờ thế nào</h2>
<ul>
<li><strong>Đánh dấu, đừng xoá ngay.</strong> Thêm cột flag và ghi lý do.</li>
<li><strong>Cần ít nhất hai dấu hiệu.</strong> Ví dụ: văn phong lệch so với các câu khác và nội dung mâu thuẫn với câu trắc nghiệm.</li>
<li><strong>Xem cả phiếu.</strong> Phiếu có câu tự luận do AI viết thường cũng có dấu hiệu khác như làm quá nhanh hay điền rập khuôn. Xem bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">cách lọc phiếu khảo sát không hợp lệ</a> để áp dụng cùng lúc.</li>
<li><strong>Nếu chỉ câu tự luận có vấn đề</strong> mà phần trắc nghiệm hợp lý, bạn có thể giữ phần định lượng và bỏ câu tự luận đó khỏi phân tích định tính. Ghi rõ quyết định này trong phần phương pháp.</li>
<li><strong>Không công kích đáp viên.</strong> Nếu bạn liên hệ lại, hỏi một câu cụ thể về trải nghiệm của họ thay vì buộc tội.</li>
</ul>

<h2>Báo cáo trong chương 3 và chương 4</h2>
<p>Hội đồng sẽ hỏi "dựa vào đâu em nói câu này do AI viết?". Vì không có công cụ dò đáng tin, câu trả lời phải là một tiêu chí bạn viết ra trước và áp dụng nhất quán. Ví dụ đoạn chương 3:</p>
<blockquote>Các câu trả lời tự luận được hai người đọc độc lập. Một câu bị đánh dấu nghi do công cụ AI tạo ra khi có ít nhất hai trong các dấu hiệu sau: còn sót định dạng hoặc lời dẫn của chatbot; cấu trúc bài luận trong ô trả lời ngắn; văn phong lệch rõ so với các câu khác trong cùng phiếu; nội dung mâu thuẫn với câu trắc nghiệm; độ dài không tương xứng với thời gian làm phiếu. Không sử dụng phần mềm phát hiện văn bản AI do độ chính xác chưa được kiểm chứng (Liang và cộng sự, 2023). Với phiếu bị đánh dấu, câu tự luận được loại khỏi phân tích định tính; toàn bộ phiếu chỉ bị loại khi đồng thời có dấu hiệu trả lời bất cẩn ở phần định lượng (Meade &amp; Craig, 2012).</blockquote>
<p>Ở mục 4.1 của chương 4, ghi số câu tự luận bị loại và số phiếu bị loại hẳn vì lý do này, tách riêng với các lý do khác như trượt câu kiểm tra chú ý. Cách trình bày bảng số phiếu bị loại có ở bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4 kết quả nghiên cứu</a>.</p>

<h2>Checklist cho câu hỏi tự luận</h2>
<ul>
<li>Câu hỏi có yêu cầu một trải nghiệm cụ thể (lần gần nhất, ở đâu, khi nào) không?</li>
<li>Có neo vào một đáp án trước đó trong form không?</li>
<li>Có gắn với ngữ cảnh mà chỉ nhóm mẫu của bạn biết không?</li>
<li>Đã ghi chú "trả lời ngắn cũng được" chưa?</li>
<li>Số câu tự luận đã giảm tới mức tối thiểu chưa?</li>
<li>Có câu trắc nghiệm nào để đối chiếu với câu tự luận không?</li>
</ul>
<p>Nếu bảng hỏi của bạn còn đang ở giai đoạn soạn, đọc thêm <a href="/posts/cach-thiet-ke-bang-hoi/">cách thiết kế bảng hỏi khảo sát</a> để xử lý các lỗi khác như câu hỏi kép và câu hỏi dẫn dắt. Ví dụ ở bài này lấy chủ đề giao đồ ăn; nếu đề tài của bạn cũng vậy, <a href="/mau-bang-hoi/y-dinh-dung-ung-dung-giao-do-an/">mẫu bảng hỏi ý định dùng ứng dụng giao đồ ăn</a> có sẵn thang đo gốc để bạn thêm một hai câu tự luận theo các nguyên tắc trên.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Liang, W., Yuksekgonul, M., Mao, Y., Wu, E., &amp; Zou, J. (2023). GPT detectors are biased against non-native English writers. <em>Patterns, 4</em>(7), 100779. https://doi.org/10.1016/j.patter.2023.100779</li>
<li>Meade, A. W., &amp; Craig, S. B. (2012). Identifying careless responses in survey data. <em>Psychological Methods, 17</em>(3), 437–455. https://doi.org/10.1037/a0028085</li>
<li>OpenAI. (2023, January 31). <em>New AI classifier for indicating AI-written text</em> [Cập nhật ngày 20/7/2023: công cụ ngừng hoạt động]. https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/</li>
</ul>
