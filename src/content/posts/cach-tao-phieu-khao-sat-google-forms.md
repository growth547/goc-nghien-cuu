---
title: "Cách tạo phiếu khảo sát Google Forms cho khoá luận: từng bước"
description: "Tạo phiếu khảo sát khoá luận bằng Google Forms: lưới Likert hay trắc nghiệm, bắt buộc trả lời, chia phần, câu gạn lọc, câu kiểm tra chú ý, xuất sang SPSS."
pubDatetime: 2026-10-30T01:01:00+07:00
modDatetime: 2026-10-30T09:06:28+07:00
featured: false
tags: ["Google Forms","bảng hỏi","SPSS"]
---

<p>Các hướng dẫn Google Forms phổ biến dạy bạn bấm nút "Thêm câu hỏi". Bài này tập trung vào những thứ quyết định dữ liệu có dùng được không: loại câu hỏi cho thang Likert, câu gạn lọc, câu kiểm tra chú ý, trộn thứ tự câu, và đưa dữ liệu từ Google Sheets vào SPSS. Bài giả định bạn đã có nội dung bảng hỏi hoàn chỉnh. Nếu chưa, đọc trước bài <a href="/posts/mau-phieu-khao-sat-khoa-luan/">mẫu phiếu khảo sát khoá luận</a> và <a href="/posts/cach-thiet-ke-bang-hoi/">cách thiết kế bảng hỏi</a>.</p>
<p>Tên nút trong bài theo giao diện tiếng Việt, kèm tên tiếng Anh ở những chỗ hay được dịch khác nhau giữa các phiên bản.</p>

<h2>Bước 0: Chuẩn bị bản Word cuối cùng và mã biến</h2>
<p>Đừng soạn câu hỏi trực tiếp trên Google Forms. Hãy có một bản Word đã được giảng viên duyệt, trong đó mỗi phát biểu Likert có sẵn mã biến (PE1, PE2, EE1...). Mã này sẽ thành tên cột trong SPSS và tên biến trong <a href="/posts/bang-ma-hoa-thang-do/">bảng mã hoá thang đo</a> ở chương 3. Ghi luôn vào bản này luồng chuyển phần của câu gạn lọc và đáp án đúng của câu kiểm tra chú ý.</p>

<h2>Bước 1: Tạo biểu mẫu, tiêu đề và lời chào</h2>
<ol>
<li>Vào forms.google.com, chọn <strong>Biểu mẫu trống</strong>, bằng tài khoản Google cá nhân (tài khoản trường có thể bị khoá sau khi tốt nghiệp).</li>
<li>Tiêu đề: ngắn, dễ hiểu với người ngoài ngành. "Khảo sát thói quen dùng ứng dụng giao đồ ăn" tốt hơn "Các nhân tố ảnh hưởng đến ý định hành vi theo UTAUT2".</li>
<li>Phần mô tả ngay dưới tiêu đề: dán lời chào, mục đích, thời gian làm bài ước tính, cam kết ẩn danh và thông tin liên hệ. Mẫu câu chữ có trong bài <a href="/posts/mau-phieu-khao-sat-khoa-luan/">mẫu phiếu khảo sát khoá luận</a>.</li>
</ol>
<p>Thời gian ước tính phải là con số đo được khi chạy thử. Hứa 5 phút mà mất 12 phút sẽ làm người trả lời bỏ ngang.</p>

<h2>Bước 2: Chọn loại câu hỏi cho thang Likert</h2>
<p>Quyết định này ảnh hưởng cả trải nghiệm trên điện thoại lẫn dạng dữ liệu xuất ra. Có ba lựa chọn:</p>
<table>
<thead><tr><th>Loại câu hỏi</th><th>Cách hiển thị</th><th>Dữ liệu xuất ra Sheets</th><th>Nên dùng khi</th></tr></thead>
<tbody>
<tr><td>Lưới trắc nghiệm</td><td>Mỗi hàng là một phát biểu, mỗi cột là một mức</td><td>Mỗi hàng thành một cột riêng, tên cột dạng "Câu hỏi [Hàng]", giá trị là nhãn cột (chữ)</td><td>Phần lớn người trả lời dùng máy tính, mỗi lưới 3 đến 6 phát biểu</td></tr>
<tr><td>Trắc nghiệm (mỗi phát biểu một câu)</td><td>Từng phát biểu đứng riêng, các mức xếp dọc</td><td>Mỗi câu một cột, giá trị là nhãn (chữ)</td><td>Phần lớn người trả lời dùng điện thoại</td></tr>
<tr><td>Phạm vi tuyến tính</td><td>Dãy số 1 đến 5 (hoặc 7), chỉ có nhãn ở hai đầu</td><td>Mỗi câu một cột, giá trị là số</td><td>Bạn cần số ngay mà không mã hoá lại, chấp nhận chỉ gắn nhãn hai đầu</td></tr>
</tbody>
</table>
<p>Lưới trắc nghiệm gọn nhất, nhưng trên màn hình điện thoại hẹp, các cột bị ép nhỏ hoặc phải kéo ngang, người trả lời dễ bấm nhầm hàng. Lưới cũng khiến việc chọn cùng một cột cho mọi hàng trở nên rất dễ, đúng kiểu trả lời đối phó mà Krosnick (1991) gọi là <em>satisficing</em>. Link chia sẻ qua Zalo, Messenger hay nhóm Facebook chủ yếu được mở trên điện thoại, nên hãy xem trước trên điện thoại thật.</p>
<p>Phạm vi tuyến tính cho ra số trực tiếp. Tuy vậy, thang có nhãn cho mọi mức thường được người trả lời hiểu nhất quán hơn thang chỉ gắn nhãn hai đầu (Krosnick &amp; Presser, 2010), nên nếu dùng loại này, ghi rõ ý nghĩa 5 mức trong phần mô tả của mục.</p>
<h3>Mẹo để lưới vẫn xuất ra số</h3>
<p>Đặt nhãn cột có số đứng đầu: "1. Hoàn toàn không đồng ý", "2. Không đồng ý", "3. Trung lập", "4. Đồng ý", "5. Hoàn toàn đồng ý". Khi xử lý, lấy ký tự đầu bằng <code>=VALUE(LEFT(B2;1))</code> (hoặc dấu phẩy thay dấu chấm phẩy, tuỳ thiết lập vùng của Sheets). Dùng một bộ nhãn cho toàn phiếu.</p>

<h2>Bước 3: Bắt buộc trả lời, nhưng có lối thoát</h2>
<ul>
<li>Câu trắc nghiệm, phạm vi tuyến tính: bật công tắc <strong>Bắt buộc</strong> ở góc dưới.</li>
<li>Lưới trắc nghiệm: bấm dấu ba chấm, bật <strong>Yêu cầu câu trả lời trong mỗi hàng</strong> (bản tiếng Anh: <em>Require a response in each row</em>). Chỉ bật "Bắt buộc" thôi chưa đủ với lưới, vì nếu không bật tuỳ chọn này người trả lời có thể bỏ trống một số hàng.</li>
<li>Muốn mọi câu mới tạo đều bắt buộc: vào <strong>Cài đặt</strong>, mục <strong>Giá trị mặc định</strong>, bật đặt câu hỏi là bắt buộc theo mặc định. Thiết lập này chỉ áp dụng cho câu hỏi tạo sau đó.</li>
</ul>
<p>Với câu nhạy cảm như thu nhập, bắt buộc trả lời mà không có lựa chọn "Không muốn trả lời" sẽ khiến người ta bỏ ngang hoặc chọn bừa. Thêm lựa chọn đó và mã hoá nó là giá trị thiếu trong SPSS.</p>

<h2>Bước 4: Chia phần (section)</h2>
<p>Bấm biểu tượng <strong>Thêm phần</strong> (hai thanh ngang) ở thanh công cụ bên phải. Một bố cục dễ theo dõi cho khoá luận:</p>
<ol>
<li>Phần 1: lời chào và câu gạn lọc.</li>
<li>Phần 2 đến phần n: mỗi phần một hoặc hai nhân tố, có tiêu đề ngắn như "Về sự tiện lợi của ứng dụng".</li>
<li>Phần cuối: thông tin cá nhân.</li>
<li>Một phần riêng cho người không đủ điều kiện, chỉ có lời cảm ơn.</li>
</ol>
<p>Chia phần giúp mỗi màn hình ngắn hơn trên điện thoại và cho phép bật thanh tiến trình (<strong>Cài đặt</strong>, mục <strong>Bản trình bày</strong>, <strong>Hiển thị thanh tiến trình</strong>). Đừng chia quá vụn: 6 đến 8 phần cho phiếu 30 đến 40 câu là vừa.</p>

<h2>Bước 5: Câu gạn lọc với "Chuyển đến phần dựa trên câu trả lời"</h2>
<p>Ví dụ đề tài về ứng dụng giao đồ ăn chỉ khảo sát người đã từng đặt món qua ứng dụng. Cách làm:</p>
<ol>
<li>Ở phần 1, tạo câu "Trong 3 tháng gần đây, bạn có đặt đồ ăn qua ứng dụng (GrabFood, ShopeeFood...) ít nhất một lần không?" với loại <strong>Trắc nghiệm</strong>, hai đáp án Có, Không.</li>
<li>Bấm dấu ba chấm ở góc dưới phải câu hỏi, chọn <strong>Chuyển đến phần dựa trên câu trả lời</strong> (<em>Go to section based on answer</em>).</li>
<li>Cạnh đáp án "Có", chọn "Chuyển đến phần 2". Cạnh đáp án "Không", chọn phần cảm ơn dành cho người không đủ điều kiện, hoặc chọn <strong>Gửi biểu mẫu</strong>.</li>
<li>Kéo xuống cuối phần cuối cùng của luồng chính (thông tin cá nhân), ở ô "Sau phần...", chọn <strong>Gửi biểu mẫu</strong>. Nếu không, người trả lời xong sẽ bị dẫn tiếp vào phần cảm ơn dành cho người bị loại.</li>
</ol>
<p>Theo trợ giúp chính thức của Google, tuỳ chọn này chỉ có ở hai loại câu hỏi <strong>Trắc nghiệm</strong> và <strong>Menu thả xuống</strong> (Google, n.d.). Nếu bạn tạo câu gạn lọc bằng hộp kiểm hay lưới, menu sẽ không hiện tuỳ chọn chuyển phần.</p>
<p>Dẫn người bị loại tới phần cảm ơn rồi gửi biểu mẫu giúp bạn có dòng ghi nhận "Không" trong Sheets để báo cáo tỉ lệ bị loại trong chương 3. Lọc bỏ các dòng này trước khi phân tích.</p>
<p>Nếu cần nhiều điều kiện cùng lúc (ví dụ vừa đã dùng ứng dụng, vừa sống ở Hà Nội), đặt mỗi câu gạn lọc trong một phần riêng, mỗi phần có luồng chuyển của nó. Google Forms không có điều kiện kiểu "A và B" trong cùng một câu.</p>

<h2>Bước 6: Chèn câu kiểm tra chú ý</h2>
<p>Câu kiểm tra chú ý dạng chỉ dẫn là một phát biểu yêu cầu chọn một đáp án cụ thể, ví dụ thêm vào giữa một lưới: "Để xác nhận bạn đang đọc kỹ, vui lòng chọn <em>Không đồng ý</em> ở dòng này." Meade và Craig (2012) cho thấy câu dạng này giúp phát hiện người trả lời cẩu thả. Lưu ý:</p>
<ul>
<li>Một đến hai câu cho phiếu 30 đến 50 câu, đặt ở nửa sau phiếu.</li>
<li>Đáp án đúng nên là một mức không nằm ở hai đầu và không phải mức giữa, để người chọn bừa cùng một cột bị lộ.</li>
<li>Ghi tiêu chí loại phiếu vào kế hoạch xử lý số liệu <em>trước</em> khi thu. Quy trình chi tiết ở bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">cách lọc phiếu khảo sát không hợp lệ</a>.</li>
</ul>

<h2>Bước 7: Trộn thứ tự câu, nhưng không trộn thứ tự mức</h2>
<p>Có ba nút "trộn" trong Google Forms, và chỉ hai nút nên dùng:</p>
<table>
<thead><tr><th>Tuỳ chọn</th><th>Vị trí</th><th>Có nên bật?</th></tr></thead>
<tbody>
<tr><td>Trộn thứ tự câu hỏi (<em>Shuffle question order</em>)</td><td>Cài đặt, mục Bản trình bày</td><td>Có thể bật. Câu hỏi chỉ bị trộn trong phạm vi từng phần, nên câu gạn lọc ở phần 1 vẫn đứng đầu.</td></tr>
<tr><td>Trộn thứ tự hàng (<em>Shuffle row order</em>)</td><td>Dấu ba chấm của lưới trắc nghiệm</td><td>Nên bật. Các phát biểu trong lưới xuất hiện theo thứ tự khác nhau với mỗi người.</td></tr>
<tr><td>Xáo trộn thứ tự tuỳ chọn (<em>Shuffle option order</em>)</td><td>Dấu ba chấm của câu trắc nghiệm</td><td>Không bật cho câu Likert. Các mức đồng ý có thứ tự, xáo trộn sẽ gây nhầm lẫn.</td></tr>
</tbody>
</table>
<p>Trộn thứ tự là một biện pháp thủ tục giảm sai lệch do phương pháp chung (Podsakoff và cộng sự, 2003). Nếu bật, ghi điều đó vào chương 3.</p>
<p>Nếu một phần có câu nối ý nhau ("Nếu có, bạn dùng ứng dụng nào?"), việc trộn sẽ đảo lộn chúng. Tách các câu đó ra một phần riêng.</p>

<h2>Bước 8: Cài đặt thu câu trả lời</h2>
<ul>
<li><strong>Thu thập địa chỉ email</strong>: chọn <em>Không thu thập</em> nếu bạn đã cam kết ẩn danh. Chọn <em>Đã xác minh</em> sẽ buộc người trả lời đăng nhập và ghi lại email Google của họ, mâu thuẫn với lời hứa ẩn danh.</li>
<li><strong>Giới hạn 1 câu trả lời</strong> (<em>Limit to 1 response</em>): buộc đăng nhập Google, mỗi tài khoản trả lời một lần. Đổi lại, người không có hoặc không muốn đăng nhập tài khoản Google sẽ không làm được, và người có hai tài khoản vẫn làm được hai lần. Nếu không bật, kiểm tra trùng lặp khi làm sạch dữ liệu.</li>
<li><strong>Tin nhắn xác nhận</strong>: thay câu mặc định bằng lời cảm ơn và thông tin liên hệ của bạn.</li>
<li><strong>Xuất bản</strong>: giao diện hiện tại yêu cầu bấm Xuất bản trước khi chia sẻ. Với tài khoản trường, kiểm tra biểu mẫu không bị giới hạn chỉ người trong tổ chức.</li>
</ul>

<h2>Bước 9: Chạy thử trước khi phát link</h2>
<ol>
<li>Dùng nút <strong>Xem trước</strong> (biểu tượng con mắt) đi qua từng nhánh: trả lời "Có" ở câu gạn lọc, rồi trả lời "Không". Kiểm tra mỗi nhánh kết thúc đúng chỗ.</li>
<li>Nhờ 5 đến 10 người đúng đối tượng làm thật trên điện thoại, bấm giờ, hỏi câu nào khó hiểu.</li>
<li>Mở Sheets, xem dữ liệu xuất ra có đúng số cột, tên cột, dạng giá trị như bạn định không.</li>
<li>Sửa xong, xoá các câu trả lời thử trong tab <strong>Câu trả lời</strong>, hoặc ghi lại mốc thời gian để lọc chúng ra sau.</li>
</ol>
<p>Sau khi phát link chính thức, tránh sửa câu chữ: dữ liệu trước và sau khi sửa không còn đo cùng một thứ.</p>

<h2>Bước 10: Từ Google Sheets sang SPSS</h2>
<ol>
<li>Tab <strong>Câu trả lời</strong>, bấm <strong>Liên kết với Trang tính</strong> (hoặc <strong>Xem trong Trang tính</strong> nếu đã liên kết). Làm việc trên một bản sao, giữ nguyên trang gốc.</li>
<li>Xoá các dòng chạy thử, dòng bị loại ở câu gạn lọc, và áp dụng các tiêu chí lọc phiếu đã định.</li>
<li>Đổi tiêu đề cột thành mã biến: "Câu hỏi [Tôi thấy ứng dụng hữu ích...]" thành PE1, không dấu cách.</li>
<li>Đổi nhãn chữ sang số. Nếu dùng mẹo đánh số ở bước 2, dùng hàm LEFT. Nếu không, dùng <strong>Tìm và thay thế</strong> với tuỳ chọn khớp toàn bộ nội dung ô, thay "Hoàn toàn không đồng ý" trước "Không đồng ý" để tránh thay nhầm.</li>
<li>Câu hộp kiểm (chọn nhiều đáp án) xuất ra một ô chứa các đáp án cách nhau bởi dấu phẩy. Tách thành nhiều cột 0 và 1, mỗi đáp án một cột, trước khi đưa vào SPSS.</li>
<li><strong>Tệp</strong>, <strong>Tải xuống</strong>, chọn Microsoft Excel (.xlsx). Trong SPSS: <strong>File</strong>, <strong>Import Data</strong>, <strong>Excel</strong>, tích "Read variable names from the first row of data".</li>
<li>Khai báo Values, Measure, Missing trong Variable View theo bảng mã hoá.</li>
</ol>
<p>Muốn xem nhanh Cronbach's alpha và EFA trước khi mở SPSS, dán dữ liệu đã đổi sang số vào <a href="/cong-cu/phan-tich-du-lieu/">công cụ phân tích dữ liệu</a>.</p>
<h3>Google Forms không ghi thời gian bắt đầu</h3>
<p>Cột "Dấu thời gian" chỉ ghi lúc bấm gửi, không ghi lúc bắt đầu làm. Vì vậy bạn không tính được thời gian hoàn thành, và tiêu chí "loại phiếu làm dưới 2 phút" không áp dụng được. Dựa vào câu kiểm tra chú ý, trả lời rập khuôn và cặp câu mâu thuẫn, hoặc dùng nền tảng có ghi thời lượng.</p>

<h2>Lỗi thường gặp và cách sửa</h2>
<table>
<thead><tr><th>Lỗi</th><th>Hậu quả</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>Lưới chỉ bật "Bắt buộc", quên "Yêu cầu câu trả lời trong mỗi hàng"</td><td>Dữ liệu thiếu rải rác</td><td>Bật tuỳ chọn cho từng lưới trước khi phát link</td></tr>
<tr><td>Câu gạn lọc dùng hộp kiểm</td><td>Không có tuỳ chọn chuyển phần</td><td>Đổi sang Trắc nghiệm hoặc Menu thả xuống</td></tr>
<tr><td>Phần cuối luồng chính để mặc định "Tiếp tục đến phần tiếp theo"</td><td>Người đủ điều kiện bị dẫn vào trang cảm ơn của người bị loại</td><td>Đặt "Gửi biểu mẫu" sau phần cuối luồng chính</td></tr>
<tr><td>Nhãn mức không thống nhất giữa các lưới</td><td>Phải mã hoá nhiều bộ, dễ sai</td><td>Dùng một bộ nhãn duy nhất có số đứng đầu</td></tr>
<tr><td>Một lưới 12 đến 15 hàng</td><td>Trả lời rập khuôn, khó đọc trên điện thoại</td><td>Tách thành các lưới 3 đến 6 hàng theo từng nhân tố</td></tr>
</tbody>
</table>

<h2>Câu hỏi thường gặp</h2>
<h3>Nên dùng lưới trắc nghiệm hay phạm vi tuyến tính cho Likert?</h3>
<p>Đa số dùng máy tính: lưới có nhãn đánh số. Đa số dùng điện thoại: trắc nghiệm từng câu, hoặc phạm vi tuyến tính kèm chú thích từng mức. Dùng một kiểu cho cả phiếu.</p>
<h3>Có cần bắt người trả lời đăng nhập Google không?</h3>
<p>Không bắt buộc. Đăng nhập chống trả lời nhiều lần nhưng làm giảm số người làm; nếu không bật, kiểm tra trùng lặp khi làm sạch dữ liệu.</p>
<h3>Google Forms có tính được thời gian làm bài không?</h3>
<p>Không, dấu thời gian chỉ ghi lúc gửi (xem bước 10).</p>
<h3>Xuất dữ liệu ra SPSS có cần tiện ích bổ sung không?</h3>
<p>Không. Tải file .xlsx rồi dùng File, Import Data, Excel trong SPSS là đủ.</p>

<h3>Có cách nào không phải gõ lại từng câu vào Google Forms?</h3>
<p>Nếu bảng hỏi của bạn ghép từ các thang đo có trong thư viện, <a href="/cong-cu/bo-khao-sat/">Bộ khảo sát</a> xuất được một đoạn Google Apps Script tạo form với lưới Likert, câu gạn lọc và câu kiểm tra AC1. Sau khi chạy, vẫn rà lại từng câu theo các bước ở trên. Nếu chưa có bảng hỏi, xem các <a href="/mau-bang-hoi/">mẫu bảng hỏi theo đề tài</a>.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Google. (n.d.). <em>Show questions based on answers</em>. Google Docs Editors Help. https://support.google.com/docs/answer/141062</li>
<li>Krosnick, J. A. (1991). Response strategies for coping with the cognitive demands of attitude measures in surveys. <em>Applied Cognitive Psychology, 5</em>(3), 213–236. https://doi.org/10.1002/acp.2350050305</li>
<li>Krosnick, J. A., &amp; Presser, S. (2010). Question and questionnaire design. In P. V. Marsden &amp; J. D. Wright (Eds.), <em>Handbook of survey research</em> (2nd ed., pp. 263–313). Emerald.</li>
<li>Meade, A. W., &amp; Craig, S. B. (2012). Identifying careless responses in survey data. <em>Psychological Methods, 17</em>(3), 437–455. https://doi.org/10.1037/a0028085</li>
<li>Podsakoff, P. M., MacKenzie, S. B., Lee, J.-Y., &amp; Podsakoff, N. P. (2003). Common method biases in behavioral research: A critical review of the literature and recommended remedies. <em>Journal of Applied Psychology, 88</em>(5), 879–903. https://doi.org/10.1037/0021-9010.88.5.879</li>
</ul>
