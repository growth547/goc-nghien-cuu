---
title: "Cách thiết kế bảng hỏi khảo sát: lỗi thường gặp và cách sửa"
description: "Cách thiết kế bảng hỏi khảo sát cho khoá luận: tránh câu hỏi kép, câu hỏi dẫn dắt, sắp thứ tự câu hợp lý, giữ form vừa đủ ngắn và chạy pilot test trước khi thu."
pubDatetime: 2026-10-29T02:00:00+07:00
modDatetime: 2026-10-30T02:32:06+07:00
featured: false
tags: ["bảng hỏi","thang đo"]
---

<p>Phần lớn rắc rối khi phân tích dữ liệu khảo sát bắt nguồn từ bảng hỏi. Thang đo có alpha thấp vì một câu bị hiểu theo hai nghĩa. Phân tích hồi quy vô nghĩa vì câu hỏi ép người trả lời đồng ý. Tỉ lệ bỏ dở cao vì form dài 80 câu. Những lỗi này không sửa được sau khi đã thu xong 300 phiếu.</p>
<p>Bài này đi qua các lỗi hay gặp, thứ tự câu, độ dài form, phần đồng ý tham gia, cách chạy thử và cỡ mẫu cho vòng chạy thử.</p>

<h2>Bắt đầu từ mô hình nghiên cứu</h2>
<p>Trước khi viết câu đầu tiên, liệt kê các khái niệm trong mô hình nghiên cứu và thang đo bạn dùng cho từng khái niệm. Mỗi câu trong bảng hỏi phải trả lời được: câu này đo biến nào, sẽ dùng trong phân tích nào? Câu nào không trả lời được thì bỏ.</p>
<p>Nên kế thừa thang đo đã được kiểm định trong các nghiên cứu trước và ghi rõ nguồn. <a href="/thang-do/">Thư viện thang đo</a> có câu hỏi gốc tiếng Anh, bản tiếng Việt tham khảo và trích dẫn cho các mô hình hay dùng như <a href="/thang-do/tam/">TAM</a> hay <a href="/thang-do/servqual/">SERVQUAL</a>; nếu đã có mô hình, <a href="/cong-cu/bo-khao-sat/">Bộ khảo sát</a> ghép sẵn bảng hỏi từ các thang đo đó. Khi dịch từ tiếng Anh, hãy dịch rồi nhờ người khác dịch ngược lại để so nghĩa (Brislin, 1970). Một thang đo dịch vụng thường là nguyên nhân khiến Cronbach's alpha thấp, xem thêm bài <a href="/posts/cronbach-alpha-la-gi/">Cronbach's alpha là gì</a>.</p>

<h2>Các lỗi câu hỏi hay gặp</h2>
<table>
<thead>
<tr><th>Lỗi</th><th>Câu sai</th><th>Câu sửa lại</th></tr>
</thead>
<tbody>
<tr><td>Câu hỏi kép</td><td>"Nhân viên phục vụ nhanh nhẹn và thân thiện."</td><td>Tách thành hai câu: "Nhân viên phục vụ nhanh nhẹn." và "Nhân viên phục vụ thân thiện."</td></tr>
<tr><td>Câu hỏi dẫn dắt</td><td>"Bạn có đồng ý rằng học online giúp tiết kiệm thời gian không?"</td><td>"Học online giúp tôi tiết kiệm thời gian." (thang 1–5)</td></tr>
<tr><td>Từ ngữ có định kiến</td><td>"Bạn có ủng hộ việc lãng phí ngân sách cho quảng cáo không?"</td><td>"Bạn đánh giá thế nào về mức chi cho quảng cáo của công ty?"</td></tr>
<tr><td>Từ tuyệt đối</td><td>"Tôi luôn luôn kiểm tra giá trước khi mua."</td><td>"Tôi kiểm tra giá trước khi mua." kèm thang tần suất có mốc, từ "Không bao giờ" đến "Mọi lần mua"</td></tr>
<tr><td>Từ mơ hồ</td><td>"Bạn có thường xuyên mua sắm online không?"</td><td>"Trong 30 ngày qua, bạn mua sắm online bao nhiêu lần?"</td></tr>
<tr><td>Phủ định kép</td><td>"Tôi không cho rằng giá không hợp lý."</td><td>"Giá sản phẩm hợp lý."</td></tr>
<tr><td>Đáp án chồng lấn</td><td>18–25, 25–30, 30–40</td><td>18–24, 25–29, 30–39, từ 40 trở lên</td></tr>
<tr><td>Thiếu đáp án</td><td>Nghề nghiệp: Sinh viên / Nhân viên văn phòng / Kinh doanh</td><td>Thêm "Lao động tự do", "Nội trợ", "Khác (ghi rõ)"</td></tr>
<tr><td>Hỏi điều người trả lời không biết</td><td>"Chiến lược marketing của hãng có hiệu quả không?"</td><td>Hỏi về trải nghiệm của chính họ: "Tôi biết tới hãng qua quảng cáo trên mạng xã hội."</td></tr>
</tbody>
</table>

<h3>Câu hỏi kép</h3>
<p>Câu hỏi kép hỏi hai thứ trong một câu. Người thấy nhân viên nhanh nhưng không thân thiện sẽ không biết chọn mức nào, và bạn không biết con số 3 của họ nghĩa là gì. Cách phát hiện: tìm chữ "và", "hoặc", "cũng như" trong câu. Không phải câu nào có chữ "và" cũng là câu kép, nhưng đó là chỗ nên đọc lại.</p>

<h3>Câu hỏi dẫn dắt</h3>
<p>Câu hỏi dẫn dắt gợi ý đáp án mong muốn. Có ba dạng thường gặp: mở đầu bằng "Bạn có đồng ý rằng…", gắn thêm thông tin thiên vị ("Nhiều chuyên gia cho rằng X tốt, bạn nghĩ sao?"), hoặc chỉ đưa ra đáp án tích cực. Với thang Likert, viết câu dưới dạng một nhận định trung tính và để thang điểm làm phần còn lại. Bài <a href="/posts/thang-do-likert/">thang đo Likert 5 mức, 7 mức</a> giải thích cách chọn số mức và cách đặt nhãn.</p>

<h2>Thứ tự câu hỏi</h2>
<p>Thứ tự câu ảnh hưởng tới cách người ta trả lời. Một trình tự an toàn cho bảng hỏi khoá luận:</p>
<ol>
<li><strong>Lời giới thiệu ngắn:</strong> ai làm, mục đích, thời gian dự kiến, cam kết bảo mật, quyền dừng bất cứ lúc nào.</li>
<li><strong>Câu gạn lọc:</strong> xác định người trả lời có thuộc đối tượng không ("Bạn đã mua hàng trên ứng dụng X trong 6 tháng qua chưa?"). Đặt đầu tiên để không phí thời gian của người không phù hợp.</li>
<li><strong>Câu dễ, mang tính hành vi:</strong> tần suất sử dụng, thời gian sử dụng. Giúp người trả lời "khởi động".</li>
<li><strong>Các thang đo chính:</strong> nhóm theo từng khái niệm, mỗi khối có tiêu đề ngắn. Biến phụ thuộc như ý định hay sự hài lòng chung nên đặt sau các biến độc lập.</li>
<li><strong>Câu tự luận (nếu có):</strong> một hai câu, ở cuối phần chính.</li>
<li><strong>Thông tin nhân khẩu học:</strong> thu nhập, học vấn và các câu nhạy cảm để cuối, khi người trả lời đã quen với form.</li>
</ol>
<p>Hai hiệu ứng thứ tự đáng lưu ý. Thứ nhất, hỏi một khía cạnh cụ thể trước rồi hỏi đánh giá tổng thể có thể làm câu tổng thể bị kéo theo khía cạnh vừa nhắc. Thứ hai, với câu chọn nhiều đáp án, người trả lời trên màn hình có xu hướng chọn các đáp án ở đầu danh sách. Nếu công cụ cho phép, hãy xáo trộn thứ tự đáp án với các câu không có thứ tự tự nhiên. Tourangeau, Rips và Rasinski (2000) phân tích kỹ các hiệu ứng này trong <em>The Psychology of Survey Response</em>.</p>

<h2>Độ dài form</h2>
<p>Form càng dài thì càng nhiều người bỏ dở và càng nhiều người trả lời qua loa ở nửa sau. Galesic và Bosnjak (2009) cho thấy khi độ dài được thông báo tăng lên, ít người bắt đầu và hoàn thành khảo sát hơn, và các câu ở cuối được trả lời nhanh hơn, ngắn hơn. Krosnick (1991) gọi hiện tượng làm đại cho xong là <em>satisficing</em>: người trả lời chọn đáp án "tạm được" thay vì suy nghĩ thật.</p>
<p>Không có con số câu tối đa áp dụng cho mọi trường hợp. Cách thực tế:</p>
<ul>
<li>Nhờ ba người thuộc đối tượng làm thử và bấm giờ. Thời gian của bạn luôn ngắn hơn của họ.</li>
<li>Ghi thời gian dự kiến trung thực ở lời giới thiệu.</li>
<li>Rà lại từng câu theo câu hỏi ở đầu bài: câu này dùng cho phân tích nào? Câu "để cho đủ" thì bỏ.</li>
<li>Cỡ mẫu và số biến quan sát liên quan với nhau: quy tắc của Hair và cộng sự (2010) cho EFA tính cỡ mẫu theo số biến quan sát, nên thêm câu cũng là thêm phiếu phải thu. Dùng <a href="/cong-cu/tinh-co-mau/">công cụ tính cỡ mẫu</a> để thấy rõ.</li>
</ul>

<h2>Câu kiểm tra và câu đối chiếu</h2>
<p>Thiết kế sẵn công cụ để lọc dữ liệu sau này:</p>
<ul>
<li><strong>Câu kiểm tra chú ý:</strong> một đến hai câu yêu cầu chọn một mức cụ thể, ví dụ "vui lòng chọn mức "2 – Không đồng ý" cho câu này", đặt trong một khối Likert ở nửa sau phiếu. Đáp án đúng không nằm ở hai đầu thang và không phải mức giữa.</li>
<li><strong>Câu đảo chiều:</strong> một vài câu viết theo chiều ngược trong thang đo, nếu thang đo gốc có.</li>
<li><strong>Cặp câu đối chiếu:</strong> ví dụ câu gạn lọc "đã dùng sản phẩm" và câu tần suất sử dụng, để phát hiện trả lời mâu thuẫn.</li>
</ul>
<p>Cách dùng các câu này khi lọc được trình bày trong bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">cách lọc phiếu khảo sát không hợp lệ</a>.</p>

<p>Muốn xem các nguyên tắc trên ghép thành một phiếu hoàn chỉnh, từ lời giới thiệu tới phần nhân khẩu học, đọc bài <a href="/posts/mau-phieu-khao-sat-khoa-luan/">mẫu phiếu khảo sát khoá luận</a>. Khi đưa phiếu lên mạng, bài <a href="/posts/cach-tao-phieu-khao-sat-google-forms/">cách tạo phiếu khảo sát bằng Google Forms</a> chỉ cách làm câu gạn lọc, câu kiểm tra và lưới Likert để dữ liệu xuất ra dùng được ngay.</p>

<p>Nếu bạn thu mẫu qua một nền tảng, hãy kiểm tra xem nó hỗ trợ những gì bạn vừa thiết kế. Hai tính năng nên có: câu gạn lọc (chọn đáp án bị loại thì form kết thúc, không tính thưởng) và câu kiểm tra chất lượng có đáp án đúng bắt buộc.</p>

<h2>Lời giới thiệu và đồng ý tham gia</h2>
<p>Lời giới thiệu không chỉ để lịch sự. Đó là chỗ người trả lời quyết định có tham gia không, và là bằng chứng bạn đã thông báo đủ. Một lời giới thiệu tối thiểu gồm:</p>
<ul>
<li>Bạn là ai, học ở đâu, đề tài về gì (một câu, không lộ giả thuyết).</li>
<li>Thời gian làm dự kiến, đo từ vòng chạy thử.</li>
<li>Dữ liệu dùng vào việc gì, ai được xem, lưu ở đâu và trong bao lâu.</li>
<li>Tham gia là tự nguyện, có thể dừng bất cứ lúc nào, không có câu trả lời đúng sai.</li>
<li>Cách liên hệ với bạn khi có thắc mắc.</li>
<li>Một câu xác nhận đồng ý (ví dụ "Tôi đã đọc thông tin trên và đồng ý tham gia") trước khi vào phần chính.</li>
</ul>
<p>Nếu bạn thu thông tin có thể nhận diện người trả lời như email, số điện thoại hay mã sinh viên, hãy hỏi chỉ khi thật cần (ví dụ để gửi quà), tách khỏi phần trả lời khi phân tích và nói rõ mục đích. Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 có hiệu lực từ 01/01/2026, nên đây không còn chỉ là chuyện đạo đức nghiên cứu. Nhiều trường còn yêu cầu thủ tục xét duyệt đạo đức riêng với đề tài hỏi về sức khoẻ, tâm lý hay đối tượng dưới 18 tuổi; hãy hỏi giảng viên hướng dẫn trước khi phát phiếu. Lời giới thiệu mẫu có sẵn trong bài <a href="/posts/mau-phieu-khao-sat-khoa-luan/">mẫu phiếu khảo sát khoá luận</a>.</p>

<h2>Pilot test: bước hay bị bỏ qua nhất</h2>
<p>Chạy thử là cách rẻ nhất để phát hiện lỗi. Làm theo hai vòng:</p>
<h3>Vòng 1: phỏng vấn nhận thức với 5–10 người</h3>
<p>Ngồi cạnh người thuộc đối tượng khảo sát, nhờ họ vừa làm vừa nói to suy nghĩ. Hỏi thêm sau một số câu: "Bạn hiểu câu này nghĩa là gì?", "Vì sao bạn chọn mức 4?". Ghi lại mọi chỗ họ ngập ngừng hoặc hiểu khác bạn.</p>
<h3>Vòng 2: chạy thử form thật với một nhóm nhỏ</h3>
<ul>
<li>Kiểm tra logic rẽ nhánh: chọn đáp án bị loại ở câu gạn lọc có kết thúc form đúng không?</li>
<li>Xuất dữ liệu ra Excel và thử mã hoá, thử chạy vài phép tính. Nhiều lỗi chỉ lộ ra ở bước này, ví dụ câu hỏi nhiều lựa chọn bị dồn vào một ô.</li>
<li>Xem thời gian làm bài thực tế.</li>
<li>Chạy thử Cronbach's alpha bằng <a href="/cong-cu/cronbach-alpha/">công cụ tính Cronbach's alpha</a> để phát hiện câu có tương quan biến–tổng âm (thường là câu đảo chiều quên mã hoá ngược hoặc câu bị hiểu sai). Với mẫu nhỏ, kết quả chỉ mang tính tham khảo.</li>
</ul>
<p>Phiếu trong vòng pilot thường không gộp vào mẫu chính nếu bạn đã sửa bảng hỏi sau đó.</p>
<h3>Vòng chạy thử cần bao nhiêu người?</h3>
<p>Không có con số chuẩn cho mọi mục tiêu. Hertzog (2008) xem xét các mẫu pilot từ 10 đến 40 người mỗi nhóm và cho thấy quy tắc kinh nghiệm "lấy 10% cỡ mẫu chính" có thể không đủ khi mục tiêu là đánh giá công cụ đo hoặc ước lượng số liệu cho nghiên cứu chính; cỡ mẫu pilot nên chọn theo mục tiêu và độ chính xác bạn cần. Với khoá luận, cách làm thực tế:</p>
<ul>
<li>Vòng 1 (phỏng vấn nhận thức): 5 đến 10 người là đủ để phát hiện câu khó hiểu, vì mục tiêu là tìm lỗi chứ không phải tính số.</li>
<li>Vòng 2 (chạy form thật): khoảng 20 đến 40 người. Với số này, alpha và tương quan biến tổng dao động khá mạnh, nên chỉ dùng để phát hiện câu có vấn đề (tương quan âm, gần 0), không dùng để kết luận thang đo đạt hay không.</li>
</ul>

<h2>Câu hỏi thường gặp</h2>
<h3>Bảng hỏi khoá luận nên có bao nhiêu câu?</h3>
<p>Không có con số tối đa chung. Hãy bắt đầu từ mô hình: mỗi khái niệm 3 đến 6 câu theo thang đo gốc, cộng câu gạn lọc, câu kiểm tra và 5 đến 7 câu nhân khẩu học. Mô hình 6 khái niệm thường ra khoảng 30 đến 40 câu. Bấm giờ ở vòng chạy thử; nếu người thuộc đối tượng cần quá 15 phút, hãy xem lại có khái niệm hay câu nào không phục vụ phân tích.</p>
<h3>Có nên đặt tên khái niệm làm tiêu đề cho từng khối câu không?</h3>
<p>Nên dùng tiêu đề trung tính mô tả chủ đề ("Về việc sử dụng ứng dụng", "Về dự định của bạn") thay vì tên khái niệm học thuật như "Nhận thức sự hữu ích". Tên khái niệm vừa khó hiểu vừa gợi ý cho người trả lời bạn đang kỳ vọng điều gì.</p>
<h3>Có nên bắt buộc trả lời mọi câu?</h3>
<p>Với các câu thang đo dùng để phân tích, nên bắt buộc để tránh dữ liệu thiếu làm SPSS loại cả phiếu. Với câu nhạy cảm như thu nhập, thêm lựa chọn "Không muốn trả lời" thay vì để trống, để người trả lời không phải bỏ cả form hoặc chọn bừa.</p>
<h3>Có cần câu tự luận không?</h3>
<p>Không bắt buộc. Nếu có, chỉ một hai câu ở cuối phần chính và phải có kế hoạch dùng chúng, ví dụ trích dẫn minh hoạ trong chương thảo luận. Câu tự luận còn là chỗ dễ gặp câu trả lời do AI viết, xem bài <a href="/posts/phat-hien-cau-tra-loi-khao-sat-do-ai-viet/">phát hiện câu trả lời khảo sát do AI viết</a>.</p>

<h2>Checklist trước khi phát form</h2>
<ul>
<li>Mỗi câu gắn với một biến trong mô hình.</li>
<li>Không còn câu hỏi kép, câu dẫn dắt, phủ định kép.</li>
<li>Đáp án không chồng lấn và có lựa chọn "Khác" khi cần.</li>
<li>Câu gạn lọc ở đầu, nhân khẩu học nhạy cảm ở cuối.</li>
<li>Có 1–2 câu kiểm tra chú ý ở nửa sau phiếu và các cặp câu đối chiếu.</li>
<li>Lời giới thiệu có thời gian dự kiến, cách dùng dữ liệu và câu đồng ý tham gia.</li>
<li>Thời gian dự kiến được ghi trung thực trong lời giới thiệu.</li>
<li>Đã phỏng vấn nhận thức và chạy thử, đã xuất thử dữ liệu.</li>
</ul>
<p>Muốn xem toàn bộ quá trình từ bảng hỏi tới lúc thu đủ mẫu, đọc thêm <a href="/posts/cach-thu-mau-khao-sat-khoa-luan/">cách thu mẫu khảo sát khoá luận</a>. Nếu đề tài của bạn trùng với một chủ đề phổ biến, các <a href="/mau-bang-hoi/">mẫu bảng hỏi theo đề tài</a> đã ghép sẵn thang đo gốc, ví dụ <a href="/mau-bang-hoi/y-dinh-mua-hang-online/">ý định mua hàng online</a>.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Brislin, R. W. (1970). Back-translation for cross-cultural research. <em>Journal of Cross-Cultural Psychology, 1</em>(3), 185–216. https://doi.org/10.1177/135910457000100301</li>
<li>Galesic, M., &amp; Bosnjak, M. (2009). Effects of questionnaire length on participation and indicators of response quality in a web survey. <em>Public Opinion Quarterly, 73</em>(2), 349–360. https://doi.org/10.1093/poq/nfp031</li>
<li>Hair, J. F., Black, W. C., Babin, B. J., &amp; Anderson, R. E. (2010). <em>Multivariate data analysis</em> (7th ed.). Pearson.</li>
<li>Hertzog, M. A. (2008). Considerations in determining sample size for pilot studies. <em>Research in Nursing &amp; Health, 31</em>(2), 180–191. https://doi.org/10.1002/nur.20247</li>
<li>Krosnick, J. A. (1991). Response strategies for coping with the cognitive demands of attitude measures in surveys. <em>Applied Cognitive Psychology, 5</em>(3), 213–236. https://doi.org/10.1002/acp.2350050305</li>
<li>Tourangeau, R., Rips, L. J., &amp; Rasinski, K. (2000). <em>The psychology of survey response</em>. Cambridge University Press.</li>
</ul>
