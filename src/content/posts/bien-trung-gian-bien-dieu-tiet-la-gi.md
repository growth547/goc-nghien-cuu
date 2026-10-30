---
title: "Biến trung gian và biến điều tiết là gì? Khác nhau thế nào, kiểm định ra sao"
description: "Biến trung gian (mediator) và biến điều tiết (moderator) là gì, khác nhau ở đâu, cách viết giả thuyết, kiểm định bằng bootstrap và tương tác, ví dụ số, bảng mẫu và câu viết chương 4."
pubDatetime: 2026-10-30T15:45:00+07:00
featured: false
tags: ["mô hình nghiên cứu","phân tích dữ liệu","khoá luận"]
---

<p><strong>Biến trung gian (mediator) là biến nằm giữa con đường tác động: X ảnh hưởng đến M, rồi M ảnh hưởng đến Y, nên nó giải thích X tác động đến Y "bằng cách nào". Biến điều tiết (moderator) không nằm trên con đường đó mà làm thay đổi độ mạnh hoặc chiều của tác động X lên Y, nên nó trả lời câu hỏi "khi nào, với ai" thì tác động mạnh hay yếu.</strong> Trung gian được kiểm định bằng tác động gián tiếp a × b với khoảng tin cậy bootstrap; điều tiết được kiểm định bằng hệ số của biến tương tác X × W.</p>

<p>Phân biệt này do Baron và Kenny (1986) đặt nền móng. Bài này giải thích hai khái niệm bằng ví dụ quen thuộc trong khoá luận, cách kiểm định theo hướng dẫn hiện nay và cách viết kết quả.</p>

<h2>Biến trung gian là gì</h2>
<p>Ví dụ trong mô hình chấp nhận công nghệ: sinh viên thấy ứng dụng học trực tuyến hữu ích (X), nên có thái độ tích cực với việc dùng nó (M), và vì thái độ tích cực nên có ý định tiếp tục sử dụng (Y). Thái độ là biến trung gian: nó chuyển tác động của nhận thức hữu ích sang ý định.</p>
<p>Mô hình trung gian đơn có ba đường:</p>
<ul>
<li><strong>a</strong>: tác động của X lên M.</li>
<li><strong>b</strong>: tác động của M lên Y, khi đã kiểm soát X.</li>
<li><strong>c'</strong> (c phẩy): tác động trực tiếp của X lên Y, khi đã kiểm soát M.</li>
</ul>
<p>Tác động gián tiếp là tích <strong>a × b</strong>. Tác động tổng <strong>c</strong> (X lên Y khi chưa đưa M vào) bằng đúng c' + a × b trong hồi quy tuyến tính. Khái niệm trong ví dụ có định nghĩa và thang đo ở các trang <a href="/khai-niem/nhan-thuc-su-huu-ich/">nhận thức sự hữu ích</a>, <a href="/khai-niem/thai-do/">thái độ</a> và <a href="/khai-niem/y-dinh-su-dung/">ý định sử dụng</a>.</p>

<h2>Biến điều tiết là gì</h2>
<p>Tiếp ví dụ trên: nhận thức hữu ích làm tăng ý định sử dụng, nhưng tác động này có thể mạnh hơn ở người tin tưởng nhà cung cấp ứng dụng và yếu hơn ở người không tin. Niềm tin (W) là biến điều tiết. Nó không phải "bước trung gian" trên con đường từ hữu ích đến ý định; nó quyết định con đường đó dốc đến mức nào.</p>
<p>Biến điều tiết có thể là biến định lượng (niềm tin, kinh nghiệm, thu nhập) hoặc định danh (giới tính, khu vực). Với biến định danh, cách làm phổ biến trong PLS-SEM là phân tích đa nhóm (MGA), về bản chất cũng là kiểm định điều tiết.</p>

<h2>Khác nhau thế nào: bảng so sánh</h2>
<table>
<thead>
<tr><th>Tiêu chí</th><th>Biến trung gian (M)</th><th>Biến điều tiết (W)</th></tr>
</thead>
<tbody>
<tr><td>Câu hỏi trả lời</td><td>X tác động đến Y bằng cách nào, qua cơ chế gì</td><td>Tác động của X lên Y mạnh hay yếu khi nào, với ai</td></tr>
<tr><td>Vị trí trên sơ đồ</td><td>Nằm giữa X và Y: X → M → Y</td><td>Mũi tên từ W chĩa vào mũi tên X → Y</td></tr>
<tr><td>Quan hệ với X</td><td>Bị X tác động (đường a phải khác 0)</td><td>Thường không bị X tác động, đóng vai trò bối cảnh</td></tr>
<tr><td>Kiểm định bằng</td><td>Tác động gián tiếp a × b, khoảng tin cậy bootstrap</td><td>Hệ số của biến tương tác X × W</td></tr>
<tr><td>Giả thuyết mẫu</td><td>"Thái độ đóng vai trò trung gian trong mối quan hệ giữa nhận thức hữu ích và ý định sử dụng."</td><td>"Niềm tin điều tiết mối quan hệ giữa nhận thức hữu ích và ý định sử dụng, sao cho tác động mạnh hơn khi niềm tin cao."</td></tr>
<tr><td>Tiếng Anh</td><td>Mediator, mediating variable</td><td>Moderator, moderating variable</td></tr>
</tbody>
</table>
<p>Một mẹo nhận biết khi đọc bài báo: nếu tác giả viết "thông qua" (through, via) thì đó là trung gian; nếu viết "phụ thuộc vào", "mạnh hơn khi", "ở nhóm" (depends on, stronger when, for) thì đó là điều tiết. Cách viết giả thuyết từng loại có ở bài <a href="/posts/cach-dat-gia-thuyet-nghien-cuu/">cách đặt giả thuyết nghiên cứu</a>.</p>

<h2>Kiểm định trung gian: từ Baron và Kenny đến bootstrap</h2>
<p>Baron và Kenny (1986) đề xuất bốn bước: (1) X tác động có ý nghĩa lên Y, (2) X tác động lên M, (3) M tác động lên Y khi kiểm soát X, (4) tác động của X lên Y giảm đi khi đưa M vào; giảm về không là trung gian toàn phần, giảm một phần là trung gian một phần. Nhiều khoá luận vẫn làm theo các bước này.</p>
<p>Zhao và cộng sự (2010) chỉ ra hai vấn đề của cách làm cũ. Thứ nhất, bước 1 không cần thiết: tác động gián tiếp có thể tồn tại cả khi tác động tổng không có ý nghĩa (ví dụ khi tác động trực tiếp và gián tiếp ngược dấu triệt tiêu nhau). Thứ hai, kiểm định Sobel giả định a × b có phân phối chuẩn, điều thường không đúng với mẫu vừa và nhỏ. Họ đề xuất chỉ cần một điều kiện: tác động gián tiếp a × b có ý nghĩa, kiểm định bằng bootstrap như Preacher và Hayes (2008) hướng dẫn. Sau đó phân loại dựa trên c':</p>
<table>
<thead>
<tr><th>a × b</th><th>c' (trực tiếp)</th><th>Loại theo Zhao và cộng sự (2010)</th><th>Cách gọi quen thuộc</th></tr>
</thead>
<tbody>
<tr><td>Có ý nghĩa</td><td>Không có ý nghĩa</td><td>Indirect-only</td><td>Trung gian toàn phần</td></tr>
<tr><td>Có ý nghĩa</td><td>Có ý nghĩa, cùng dấu với a × b</td><td>Complementary</td><td>Trung gian một phần (bổ sung)</td></tr>
<tr><td>Có ý nghĩa</td><td>Có ý nghĩa, ngược dấu với a × b</td><td>Competitive</td><td>Trung gian cạnh tranh</td></tr>
<tr><td>Không có ý nghĩa</td><td>Có ý nghĩa</td><td>Direct-only</td><td>Không có trung gian</td></tr>
<tr><td>Không có ý nghĩa</td><td>Không có ý nghĩa</td><td>No-effect</td><td>Không có trung gian, không có tác động</td></tr>
</tbody>
</table>

<h3>Bootstrap làm gì</h3>
<p>Phần mềm rút lại mẫu có hoàn lại từ chính dữ liệu của bạn, thường 5.000 lần, mỗi lần tính lại a × b. Sắp xếp 5.000 giá trị đó, lấy phân vị 2,5% và 97,5% làm khoảng tin cậy 95%. <strong>Nếu khoảng tin cậy không chứa 0, tác động gián tiếp có ý nghĩa.</strong> Trong SmartPLS đó là bảng Specific Indirect Effects sau khi chạy Bootstrapping; trong SPSS là macro PROCESS Model 4 (Hayes, 2018); trong AMOS là User-defined estimands hoặc Indirect effects với bootstrap.</p>

<h3>Ví dụ số</h3>
<p>Bộ dữ liệu mô phỏng 300 sinh viên, thang 1 đến 5: X = nhận thức hữu ích, M = thái độ, Y = ý định sử dụng. Ba hồi quy cho kết quả (hệ số chưa chuẩn hoá):</p>
<table>
<thead>
<tr><th>Đường</th><th>Hồi quy</th><th>Hệ số</th><th>SE</th><th>t</th><th>p</th></tr>
</thead>
<tbody>
<tr><td>c (tổng)</td><td>Y theo X</td><td>0,500</td><td>0,054</td><td>9,22</td><td>&lt; 0,001</td></tr>
<tr><td>a</td><td>M theo X</td><td>0,561</td><td>0,053</td><td>10,62</td><td>&lt; 0,001</td></tr>
<tr><td>b</td><td>Y theo X và M (hệ số của M)</td><td>0,397</td><td>0,055</td><td>7,21</td><td>&lt; 0,001</td></tr>
<tr><td>c' (trực tiếp)</td><td>Y theo X và M (hệ số của X)</td><td>0,278</td><td>0,059</td><td>4,72</td><td>&lt; 0,001</td></tr>
</tbody>
</table>
<p>Tác động gián tiếp a × b = 0,561 × 0,397 = 0,223. Kiểm tra: c' + a × b = 0,278 + 0,223 = 0,501, khớp với c = 0,500 (chênh do làm tròn). Bootstrap 5.000 lần cho sai số chuẩn 0,034 và khoảng tin cậy 95% từ 0,159 đến 0,295, không chứa 0: tác động gián tiếp có ý nghĩa. Vì c' cũng có ý nghĩa và cùng dấu dương, đây là trung gian một phần dạng bổ sung. Tỉ lệ tác động đi qua trung gian là 0,223 / 0,500 = 44,5%.</p>

<h2>Kiểm định điều tiết bằng biến tương tác</h2>
<ol>
<li><strong>Tạo biến tương tác.</strong> Trừ trung bình cho X và W (mean-centering), rồi nhân hai biến đã trừ trung bình với nhau. Việc trừ trung bình không làm thay đổi hệ số tương tác hay ý nghĩa của nó, nhưng làm cho hệ số của X và W dễ đọc hơn: đó là tác động của X tại mức trung bình của W (Hayes, 2018; Aiken &amp; West, 1991).</li>
<li><strong>Chạy hồi quy</strong> Y theo X, W và X × W.</li>
<li><strong>Đọc hệ số của X × W.</strong> Có ý nghĩa thì có điều tiết. Dấu dương: W càng cao, tác động của X càng mạnh.</li>
<li><strong>Phân tích độ dốc đơn (simple slopes)</strong> tại W thấp (trung bình − 1 SD), trung bình và cao (trung bình + 1 SD), và vẽ đồ thị tương tác.</li>
</ol>

<h3>Ví dụ số</h3>
<p>Cùng 300 sinh viên, thêm W = niềm tin vào nhà cung cấp (trung bình 3,41; độ lệch chuẩn 0,81). Y = ý định sử dụng.</p>
<table>
<thead>
<tr><th>Biến</th><th>Hệ số</th><th>SE</th><th>t</th><th>p</th></tr>
</thead>
<tbody>
<tr><td>Hằng số</td><td>3,474</td><td>0,033</td><td>104,07</td><td>&lt; 0,001</td></tr>
<tr><td>Nhận thức hữu ích (X, đã trừ trung bình)</td><td>0,248</td><td>0,052</td><td>4,75</td><td>&lt; 0,001</td></tr>
<tr><td>Niềm tin (W, đã trừ trung bình)</td><td>0,278</td><td>0,041</td><td>6,73</td><td>&lt; 0,001</td></tr>
<tr><td>X × W</td><td>0,251</td><td>0,061</td><td>4,14</td><td>&lt; 0,001</td></tr>
</tbody>
</table>
<p>R² tăng từ 0,181 (chưa có tương tác) lên 0,226 khi thêm X × W, tức ΔR² = 0,045; F thay đổi = 17,13 với df (1; 296), p &lt; 0,001. Độ dốc đơn của X lên Y theo mức niềm tin:</p>
<table>
<thead>
<tr><th>Mức niềm tin</th><th>Giá trị W</th><th>Tác động của X</th><th>SE</th><th>p</th></tr>
</thead>
<tbody>
<tr><td>Thấp (−1 SD)</td><td>2,59</td><td>0,043</td><td>0,072</td><td>0,551</td></tr>
<tr><td>Trung bình</td><td>3,41</td><td>0,248</td><td>0,052</td><td>&lt; 0,001</td></tr>
<tr><td>Cao (+1 SD)</td><td>4,22</td><td>0,452</td><td>0,071</td><td>&lt; 0,001</td></tr>
</tbody>
</table>
<p>Cách đọc: độ dốc tại mỗi mức bằng 0,248 + 0,251 × (W − 3,41). Ở người niềm tin thấp, cảm thấy ứng dụng hữu ích gần như không làm tăng ý định (0,043, không có ý nghĩa); ở người niềm tin cao, tác động gấp gần hai lần mức trung bình. Phương pháp Johnson-Neyman cho biết chính xác từ mức niềm tin nào trở lên thì tác động bắt đầu có ý nghĩa, thay vì chỉ ba điểm cắt.</p>

<h2>Khi có cả hai: trung gian có điều tiết</h2>
<p>Nếu niềm tin điều tiết đường a (từ hữu ích đến thái độ) thì tác động gián tiếp không còn là một con số mà thay đổi theo W. Đây là trung gian có điều tiết (PROCESS Model 7 hoặc 14). Hayes (2015) đề xuất chỉ số trung gian có điều tiết (index of moderated mediation): nếu khoảng tin cậy bootstrap của chỉ số này không chứa 0, tác động gián tiếp phụ thuộc vào W. Mô hình kiểu này cần cỡ mẫu lớn hơn; tính trước bằng <a href="/cong-cu/tinh-co-mau/">máy tính cỡ mẫu</a>, mục biến điều tiết và trung gian.</p>

<h2>Làm trên công cụ, SPSS hay SmartPLS</h2>
<ul>
<li><strong>Không cài phần mềm:</strong> <a href="/cong-cu/trung-gian-dieu-tiet/">công cụ kiểm định trung gian và điều tiết</a> chạy Model 4, 6, 1, 7 kiểu PROCESS ngay trên trình duyệt, bootstrap 5.000 lần, simple slopes, Johnson-Neyman, đồ thị tương tác và đoạn văn chương 4.</li>
<li><strong>SPSS:</strong> cài macro PROCESS của Hayes, vào <code>Analyze &gt; Regression &gt; PROCESS</code>, chọn Model 4 cho trung gian, Model 1 cho điều tiết. Điều tiết cũng có thể làm tay bằng hồi quy với biến tương tác tự tạo, như hướng dẫn ở bài <a href="/posts/hoi-quy-tuyen-tinh-boi-spss/">hồi quy tuyến tính bội SPSS</a>.</li>
<li><strong>SmartPLS:</strong> vẽ biến trung gian như một khái niệm bình thường; điều tiết thêm bằng chuột phải vào mũi tên, <code>Add moderating effect</code>, chọn cách tạo biến tương tác Two-stage. Đọc kết quả trong Bootstrapping.</li>
</ul>
<p>Trước khi chạy, vẽ mô hình cho rõ mũi tên nào là trung gian, mũi tên nào bị điều tiết bằng <a href="/cong-cu/ve-mo-hinh/">công cụ vẽ mô hình nghiên cứu</a>; công cụ tự sinh giả thuyết H1, H2 theo đúng loại quan hệ. Lý do chọn biến trung gian, điều tiết cho mô hình nằm ở bài <a href="/posts/cach-xay-dung-mo-hinh-nghien-cuu/">cách xây dựng mô hình nghiên cứu</a>.</p>

<h2>Lỗi hay gặp</h2>
<ul>
<li><strong>Gọi biến điều tiết là trung gian và ngược lại.</strong> Kiểm tra bằng câu hỏi: X có gây ra W không? Nếu có, W giống trung gian hơn.</li>
<li><strong>Đọc hệ số của X trong mô hình có tương tác như tác động chung.</strong> Khi có X × W, hệ số của X là tác động tại W = 0 (hoặc tại trung bình nếu đã trừ trung bình), không phải tác động trung bình cho mọi người.</li>
<li><strong>Diễn giải nhân quả từ dữ liệu cắt ngang</strong> mà không nêu hạn chế. Mô hình trung gian ngầm định thứ tự X trước M trước Y; dữ liệu một thời điểm không chứng minh thứ tự đó.</li>
</ul>

<h2>Câu mẫu khi viết vào chương 4</h2>
<blockquote>Kết quả kiểm định bootstrap với 5.000 mẫu lặp cho thấy tác động gián tiếp của nhận thức hữu ích lên ý định sử dụng thông qua thái độ là 0,223, khoảng tin cậy 95% [0,159; 0,295] không chứa 0, do đó giả thuyết H4 được chấp nhận. Tác động trực tiếp vẫn có ý nghĩa (c' = 0,278; p &lt; 0,001), cho thấy thái độ đóng vai trò trung gian một phần (bổ sung) theo phân loại của Zhao và cộng sự (2010).</blockquote>
<blockquote>Hệ số của biến tương tác giữa nhận thức hữu ích và niềm tin là 0,251 (p &lt; 0,001), làm R² tăng thêm 0,045. Phân tích độ dốc đơn cho thấy tác động của nhận thức hữu ích lên ý định sử dụng không có ý nghĩa ở nhóm niềm tin thấp (B = 0,043; p = 0,551) nhưng có ý nghĩa và mạnh dần ở nhóm niềm tin trung bình (B = 0,248) và cao (B = 0,452). Giả thuyết H5 được chấp nhận.</blockquote>
<p>Các mốc ra quyết định (p, khoảng tin cậy, ΔR², f²) được tóm tắt ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận</a>.</p>

<h2>Câu hỏi thường gặp</h2>
<h3>Biến trung gian và biến điều tiết tiếng Anh là gì?</h3>
<p>Biến trung gian là mediator (mediating variable), biến điều tiết là moderator (moderating variable). Phân tích tương ứng là mediation analysis và moderation analysis; kết hợp hai loại là moderated mediation (trung gian có điều tiết).</p>
<h3>Biến điều tiết khác biến kiểm soát thế nào?</h3>
<p>Biến kiểm soát chỉ được đưa vào để tách phần ảnh hưởng của nó ra khỏi Y, bạn không đặt giả thuyết về nó. Biến điều tiết có giả thuyết riêng về việc nó làm thay đổi tác động của X lên Y, và được kiểm định qua biến tương tác X × W.</p>
<h3>Một biến có thể vừa là trung gian vừa là điều tiết không?</h3>
<p>Về kỹ thuật thì chạy được cả hai, nhưng lý thuyết phải chọn một vai trò. Baron và Kenny (1986) nhấn mạnh rằng hai vai trò khác nhau về bản chất; nếu bạn không lý giải được biến đó là cơ chế (trung gian) hay là bối cảnh (điều tiết), mô hình chưa sẵn sàng để kiểm định.</p>
<h3>Trung gian toàn phần có tốt hơn trung gian một phần không?</h3>
<p>Không. Zhao và cộng sự (2010) cho rằng trung gian một phần dạng bổ sung là kết quả phổ biến và thường gợi ý còn cơ chế trung gian khác chưa đưa vào mô hình. Đó là gợi ý hay cho mục hướng nghiên cứu tiếp theo, không phải điểm yếu.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Aiken, L. S., &amp; West, S. G. (1991). <em>Multiple regression: Testing and interpreting interactions</em>. Sage.</li>
<li>Baron, R. M., &amp; Kenny, D. A. (1986). The moderator–mediator variable distinction in social psychological research: Conceptual, strategic, and statistical considerations. <em>Journal of Personality and Social Psychology, 51</em>(6), 1173–1182. https://doi.org/10.1037/0022-3514.51.6.1173</li>
<li>Hayes, A. F. (2015). An index and test of linear moderated mediation. <em>Multivariate Behavioral Research, 50</em>(1), 1–22. https://doi.org/10.1080/00273171.2014.962683</li>
<li>Hayes, A. F. (2018). <em>Introduction to mediation, moderation, and conditional process analysis: A regression-based approach</em> (2nd ed.). Guilford Press.</li>
<li>Preacher, K. J., &amp; Hayes, A. F. (2008). Asymptotic and resampling strategies for assessing and comparing indirect effects in multiple mediator models. <em>Behavior Research Methods, 40</em>(3), 879–891. https://doi.org/10.3758/BRM.40.3.879</li>
<li>Zhao, X., Lynch, J. G., Jr., &amp; Chen, Q. (2010). Reconsidering Baron and Kenny: Myths and truths about mediation analysis. <em>Journal of Consumer Research, 37</em>(2), 197–206. https://doi.org/10.1086/651257</li>
</ul>
