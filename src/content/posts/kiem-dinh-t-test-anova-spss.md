---
title: "Kiểm định T-test và ANOVA trong SPSS: chạy và đọc kết quả"
description: "T-test độc lập và One-way ANOVA trong SPSS: đọc Levene, khi nào dùng Welch, Tukey hay Games-Howell, ví dụ số, bảng mẫu và câu viết chương 4."
pubDatetime: 2026-10-30T15:30:00+07:00
featured: false
tags: ["SPSS","phân tích dữ liệu","khoá luận"]
---

<p><strong>Kiểm định T-test độc lập (Independent Samples T-test) so sánh giá trị trung bình của một biến định lượng giữa hai nhóm, còn ANOVA một yếu tố (One-way ANOVA) so sánh từ ba nhóm trở lên.</strong> Trong SPSS, bạn đọc kiểm định Levene trước: Sig. của Levene lớn hơn 0,05 thì đọc dòng giả định phương sai bằng nhau (với ANOVA là bảng ANOVA và post hoc Tukey), nhỏ hơn 0,05 thì đọc dòng Welch (với ANOVA là bảng Robust Tests và post hoc Games-Howell). Sau đó mới nhìn Sig. của chính kiểm định để kết luận có khác biệt hay không.</p>

<p>Trong khoá luận khảo sát, hai kiểm định này thường nằm ở cuối chương 4 dưới tên "kiểm định sự khác biệt theo đặc điểm nhân khẩu học": nam và nữ, các năm học, các mức thu nhập có đánh giá khác nhau không. Bài này dùng một bộ số liệu ví dụ 240 phiếu, đi qua từng hộp thoại, từng bảng kết quả và câu viết mẫu.</p>

<h2>Khi nào dùng T-test, khi nào dùng ANOVA</h2>
<table>
<thead>
<tr><th>Tình huống</th><th>Kiểm định</th><th>Đường dẫn trong SPSS</th></tr>
</thead>
<tbody>
<tr><td>So sánh trung bình giữa 2 nhóm độc lập (nam, nữ)</td><td>Independent Samples T-test</td><td><code>Analyze &gt; Compare Means &gt; Independent-Samples T Test</code></td></tr>
<tr><td>So sánh từ 3 nhóm độc lập trở lên (năm 1 đến năm 4)</td><td>One-way ANOVA</td><td><code>Analyze &gt; Compare Means &gt; One-Way ANOVA</code></td></tr>
<tr><td>Cùng một người đo hai lần (trước và sau)</td><td>Paired Samples T-test</td><td><code>Analyze &gt; Compare Means &gt; Paired-Samples T Test</code></td></tr>
<tr><td>So sánh trung bình mẫu với một con số cho trước (ví dụ điểm 3)</td><td>One-Sample T-test</td><td><code>Analyze &gt; Compare Means &gt; One-Sample T Test</code></td></tr>
</tbody>
</table>
<p>Biến cần so sánh phải là biến định lượng. Trong khoá luận, đó thường là điểm trung bình của một thang đo (ví dụ HL là trung bình của HL1 đến HL4), tạo bằng <code>Transform &gt; Compute Variable</code> với hàm <code>MEAN(HL1,HL2,HL3,HL4)</code>. Biến nhóm phải là biến định danh đã mã hoá thành số (1 = Nam, 2 = Nữ). Cách đặt mã có ở bài <a href="/posts/bang-ma-hoa-thang-do/">bảng mã hoá thang đo</a>.</p>
<p>Không chạy nhiều T-test cho các cặp nhóm thay cho ANOVA. Với 4 nhóm có 6 cặp; chạy 6 T-test riêng ở mức 5% thì xác suất có ít nhất một kết luận sai tăng lên đáng kể. ANOVA kiểm định chung một lần, rồi post hoc so sánh từng cặp có hiệu chỉnh.</p>

<h2>Các giả định cần biết</h2>
<ul>
<li><strong>Quan sát độc lập:</strong> mỗi người chỉ thuộc một nhóm, không trả lời hai lần. Giả định này do thiết kế chọn mẫu quyết định, không kiểm tra bằng một con số.</li>
<li><strong>Phân phối chuẩn trong từng nhóm:</strong> với nhóm từ khoảng 30 quan sát trở lên, T-test và ANOVA khá vững khi dữ liệu lệch vừa phải. Lumley và cộng sự (2002) cho thấy với mẫu lớn, các kiểm định này vẫn cho kết quả tin cậy kể cả khi dữ liệu không chuẩn. Nhóm nhỏ (dưới 15 đến 20 người) và lệch mạnh thì cân nhắc kiểm định phi tham số Mann-Whitney hoặc Kruskal-Wallis.</li>
<li><strong>Phương sai đồng nhất giữa các nhóm:</strong> kiểm tra bằng Levene. Đây là giả định quyết định bạn đọc dòng nào.</li>
</ul>
<p>Delacre và cộng sự (2017) chỉ ra rằng T-test của Welch, vốn không cần giả định phương sai bằng nhau, gần như không mất gì khi phương sai thật sự bằng nhau và an toàn hơn nhiều khi chúng khác nhau, đặc biệt khi cỡ nhóm chênh lệch. Lập luận tương tự áp dụng cho Welch F trong ANOVA (Delacre và cộng sự, 2019). Thông lệ ở khoá luận Việt Nam vẫn là đọc theo Levene, nên bài này trình bày theo thông lệ đó và nói rõ chỗ nên dùng Welch.</p>

<h2>Chạy Independent Samples T-test</h2>
<ol>
<li>Vào <code>Analyze &gt; Compare Means &gt; Independent-Samples T Test</code>.</li>
<li>Đưa biến cần so sánh (HL) vào ô <code>Test Variable(s)</code>. Có thể đưa nhiều biến cùng lúc.</li>
<li>Đưa biến nhóm (GioiTinh) vào ô <code>Grouping Variable</code>, bấm <code>Define Groups</code>, nhập 1 cho Group 1 và 2 cho Group 2.</li>
<li>SPSS 27 trở lên có thêm ô <code>Estimate effect sizes</code>; tích vào để có Cohen's d.</li>
<li>Bấm <code>OK</code>.</li>
</ol>

<h3>Ví dụ: sự hài lòng của nam và nữ</h3>
<p>Bộ số liệu ví dụ có 240 sinh viên đánh giá mức hài lòng với ứng dụng học trực tuyến (thang 1 đến 5, trung bình 4 câu). Bảng Group Statistics:</p>
<table>
<thead>
<tr><th>Giới tính</th><th>N</th><th>Mean</th><th>Std. Deviation</th><th>Std. Error Mean</th></tr>
</thead>
<tbody>
<tr><td>Nam</td><td>98</td><td>3,556</td><td>0,765</td><td>0,077</td></tr>
<tr><td>Nữ</td><td>142</td><td>3,815</td><td>0,589</td><td>0,049</td></tr>
</tbody>
</table>
<p>Bảng Independent Samples Test (rút gọn):</p>
<table>
<thead>
<tr><th>Dòng</th><th>Levene F</th><th>Levene Sig.</th><th>t</th><th>df</th><th>Sig. (2-tailed)</th><th>Mean Difference</th><th>95% CI</th></tr>
</thead>
<tbody>
<tr><td>Equal variances assumed</td><td>6,302</td><td>0,013</td><td>−2,962</td><td>238</td><td>0,003</td><td>−0,259</td><td>−0,431 đến −0,087</td></tr>
<tr><td>Equal variances not assumed</td><td></td><td></td><td>−2,826</td><td>172,70</td><td>0,005</td><td>−0,259</td><td>−0,440 đến −0,078</td></tr>
</tbody>
</table>

<h3>Đọc bảng theo hai bước</h3>
<ol>
<li><strong>Bước 1, Levene:</strong> Sig. = 0,013 &lt; 0,05, tức phương sai của hai nhóm khác nhau (độ lệch chuẩn của nam 0,765, của nữ 0,589). Vì vậy bỏ dòng trên, đọc dòng <code>Equal variances not assumed</code>. Đây chính là T-test của Welch, nên df là số lẻ 172,70.</li>
<li><strong>Bước 2, T-test:</strong> trên dòng đã chọn, Sig. (2-tailed) = 0,005 &lt; 0,05, có khác biệt có ý nghĩa thống kê. Mean Difference âm vì SPSS lấy Nhóm 1 trừ Nhóm 2: nam thấp hơn nữ 0,259 điểm.</li>
</ol>
<p>Lỗi phổ biến nhất là nhìn Sig. của Levene rồi kết luận "có khác biệt giữa nam và nữ". Levene chỉ trả lời câu hỏi phương sai có bằng nhau không; câu hỏi trung bình có khác nhau không nằm ở cột Sig. (2-tailed).</p>

<h3>Thêm độ lớn hiệu ứng</h3>
<p>Sig. chỉ cho biết khác biệt có khả năng là thật, không cho biết khác biệt lớn hay nhỏ. Với mẫu rất lớn, chênh lệch 0,05 điểm cũng có thể có Sig. &lt; 0,05. Báo cáo thêm Cohen's d (Lakens, 2013):</p>
<p><code>d = (M₁ − M₂) / s_pooled</code>, với <code>s_pooled = √[((n₁ − 1)s₁² + (n₂ − 1)s₂²) / (n₁ + n₂ − 2)]</code></p>
<p>Tính tay: (97 × 0,7645² + 141 × 0,5885²) / 238 = (56,69 + 48,83) / 238 = 0,4434; căn bậc hai được 0,666. d = −0,259 / 0,666 = −0,39. Theo quy ước của Cohen (1988), khoảng 0,2 là nhỏ, 0,5 là trung bình, 0,8 là lớn, nên đây là khác biệt nhỏ đến trung bình. Quy ước này chỉ là mốc tham khảo; Cohen cũng khuyên đặt kết quả trong bối cảnh lĩnh vực.</p>

<h2>Chạy One-way ANOVA</h2>
<ol>
<li>Vào <code>Analyze &gt; Compare Means &gt; One-Way ANOVA</code>.</li>
<li>Đưa HL vào <code>Dependent List</code>, đưa NamHoc vào <code>Factor</code>.</li>
<li>Bấm <code>Options</code>, tích <code>Descriptive</code>, <code>Homogeneity of variance test</code> và <code>Welch</code>. Bấm <code>Continue</code>.</li>
<li>Bấm <code>Post Hoc</code>, tích <code>Tukey</code> (cho trường hợp phương sai đồng nhất) và <code>Games-Howell</code> (cho trường hợp không đồng nhất). Chọn sẵn cả hai, đọc cái nào tuỳ kết quả Levene.</li>
<li>SPSS 27 trở lên có ô <code>Estimate effect size for overall tests</code>; tích để có eta bình phương.</li>
</ol>

<h3>Ví dụ: sự hài lòng theo năm học</h3>
<table>
<thead>
<tr><th>Năm học</th><th>N</th><th>Mean</th><th>Std. Deviation</th></tr>
</thead>
<tbody>
<tr><td>Năm 1</td><td>52</td><td>3,514</td><td>0,696</td></tr>
<tr><td>Năm 2</td><td>61</td><td>3,635</td><td>0,646</td></tr>
<tr><td>Năm 3</td><td>70</td><td>3,743</td><td>0,615</td></tr>
<tr><td>Năm 4</td><td>57</td><td>3,956</td><td>0,735</td></tr>
<tr><td>Tổng</td><td>240</td><td>3,717</td><td>0,685</td></tr>
</tbody>
</table>
<p><strong>Test of Homogeneity of Variances</strong> (dòng Based on Mean): Levene = 1,133; df1 = 3; df2 = 236; Sig. = 0,336. Sig. &gt; 0,05, phương sai đồng nhất, nên đọc bảng ANOVA và post hoc Tukey.</p>
<table>
<thead>
<tr><th>ANOVA</th><th>Sum of Squares</th><th>df</th><th>Mean Square</th><th>F</th><th>Sig.</th></tr>
</thead>
<tbody>
<tr><td>Between Groups</td><td>5,848</td><td>3</td><td>1,949</td><td>4,335</td><td>0,005</td></tr>
<tr><td>Within Groups</td><td>106,135</td><td>236</td><td>0,450</td><td></td><td></td></tr>
<tr><td>Total</td><td>111,983</td><td>239</td><td></td><td></td><td></td></tr>
</tbody>
</table>
<p>F = Mean Square giữa nhóm / Mean Square trong nhóm = 1,949 / 0,450 = 4,335, Sig. = 0,005 &lt; 0,05: có ít nhất một cặp năm học khác nhau. Bảng ANOVA không nói cặp nào; đó là việc của post hoc.</p>
<p>Độ lớn hiệu ứng: eta bình phương η² = SS giữa nhóm / SS tổng = 5,848 / 111,983 = 0,052, tức năm học giải thích khoảng 5,2% biến thiên của sự hài lòng. Theo Cohen (1988), η² khoảng 0,01 là nhỏ, 0,06 là trung bình, 0,14 là lớn. Omega bình phương, ít chệch hơn với mẫu nhỏ, bằng 0,040 trong ví dụ này (Lakens, 2013).</p>

<h3>Đọc post hoc Tukey</h3>
<table>
<thead>
<tr><th>Cặp so sánh</th><th>Mean Difference</th><th>Sig.</th><th>95% CI</th></tr>
</thead>
<tbody>
<tr><td>Năm 4 − Năm 1</td><td>0,442*</td><td>0,004</td><td>0,109 đến 0,774</td></tr>
<tr><td>Năm 4 − Năm 2</td><td>0,321*</td><td>0,049</td><td>0,001 đến 0,641</td></tr>
<tr><td>Năm 4 − Năm 3</td><td>0,213</td><td>0,284</td><td>−0,096 đến 0,523</td></tr>
<tr><td>Năm 3 − Năm 1</td><td>0,228</td><td>0,248</td><td>−0,089 đến 0,546</td></tr>
<tr><td>Năm 3 − Năm 2</td><td>0,108</td><td>0,796</td><td>−0,196 đến 0,412</td></tr>
<tr><td>Năm 2 − Năm 1</td><td>0,121</td><td>0,775</td><td>−0,207 đến 0,448</td></tr>
</tbody>
</table>
<p>SPSS in bảng đầy đủ 12 dòng (mỗi cặp xuất hiện hai lần, đổi dấu) và gắn dấu * cạnh Mean Difference có Sig. &lt; 0,05. Kết luận: sinh viên năm 4 hài lòng cao hơn năm 1 và năm 2; các cặp còn lại không khác biệt có ý nghĩa. Lưu ý cặp Năm 4 − Năm 2 có Sig. 0,049 và khoảng tin cậy chạm sát 0 (0,001), nên viết thận trọng.</p>

<h3>Khi Levene có Sig. &lt; 0,05</h3>
<p>Bỏ bảng ANOVA, đọc bảng <code>Robust Tests of Equality of Means</code> (dòng Welch) và post hoc Games-Howell. Games và Howell (1976) xây dựng thủ tục này cho trường hợp phương sai không bằng nhau hoặc cỡ nhóm chênh lệch. Với dữ liệu ví dụ, Welch F(3; 126,71) = 3,799, Sig. = 0,012; kết luận chung không đổi. Nếu bạn quên tích Welch trong Options, SPSS sẽ không in bảng này, phải chạy lại.</p>

<h2>Tóm tắt quy tắc chọn dòng</h2>
<table>
<thead>
<tr><th>Kết quả Levene</th><th>T-test đọc</th><th>ANOVA đọc</th><th>Post hoc</th></tr>
</thead>
<tbody>
<tr><td>Sig. ≥ 0,05</td><td>Equal variances assumed</td><td>Bảng ANOVA (F)</td><td>Tukey</td></tr>
<tr><td>Sig. &lt; 0,05</td><td>Equal variances not assumed</td><td>Robust Tests, dòng Welch</td><td>Games-Howell</td></tr>
</tbody>
</table>
<p>Không cần đọc post hoc khi Sig. của F (hoặc Welch) lớn hơn 0,05: không có khác biệt chung thì không đi tìm cặp khác biệt. Ngưỡng 0,05 và các mốc hiệu ứng khác được gom ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận trong phân tích định lượng</a>.</p>

<h2>Những lỗi hay gặp</h2>
<ul>
<li><strong>Nhóm quá nhỏ.</strong> Mức thu nhập "trên 30 triệu" chỉ có 6 người thì trung bình nhóm đó rất bấp bênh. Gộp nhóm kề nhau (ví dụ "từ 20 triệu trở lên") trước khi chạy, và ghi rõ việc gộp trong chương 3.</li>
<li><strong>Dùng T-test cho biến có ba nhóm</strong> bằng cách chỉ định hai nhóm trong Define Groups. Làm vậy là bỏ qua nhóm thứ ba mà không nói ra.</li>
<li><strong>Chạy trên từng câu hỏi thay vì điểm thang đo.</strong> So sánh theo từng biến quan sát làm số kiểm định tăng vọt; so sánh trên điểm trung bình của khái niệm.</li>
<li><strong>Kết luận nhân quả.</strong> "Năm 4 hài lòng hơn" không có nghĩa "học lâu làm tăng sự hài lòng". Dữ liệu cắt ngang chỉ cho thấy sự khác biệt.</li>
<li><strong>Không tính cỡ mẫu cho phép so sánh.</strong> Muốn phát hiện khác biệt cỡ d = 0,5 giữa hai nhóm với độ mạnh 80% cần khoảng 64 người mỗi nhóm. Thử các mức khác trong <a href="/cong-cu/tinh-co-mau/">máy tính cỡ mẫu</a>, mục T-test và ANOVA.</li>
</ul>

<h2>Câu mẫu khi viết vào chương 4</h2>
<blockquote>Kết quả kiểm định Independent Samples T-test cho thấy kiểm định Levene có Sig. = 0,013 &lt; 0,05, phương sai giữa hai nhóm giới tính không đồng nhất, do đó sử dụng kết quả ở dòng Equal variances not assumed. Giá trị Sig. của kiểm định t bằng 0,005 &lt; 0,05, cho thấy có sự khác biệt có ý nghĩa thống kê về sự hài lòng giữa nam và nữ: nữ (M = 3,815; SD = 0,589) hài lòng cao hơn nam (M = 3,556; SD = 0,765), t(172,70) = −2,826, Cohen's d = −0,39.</blockquote>
<blockquote>Kiểm định Levene theo năm học có Sig. = 0,336 &gt; 0,05, phương sai giữa các nhóm đồng nhất. Kết quả ANOVA cho thấy F(3; 236) = 4,335, Sig. = 0,005 &lt; 0,05, η² = 0,052: có sự khác biệt về sự hài lòng giữa các năm học. Kiểm định sau Tukey cho thấy sinh viên năm 4 có mức hài lòng cao hơn sinh viên năm 1 (chênh lệch 0,442; Sig. = 0,004) và năm 2 (chênh lệch 0,321; Sig. = 0,049); các cặp còn lại không khác biệt có ý nghĩa.</blockquote>
<p>Phần kiểm định khác biệt thường đặt sau hồi quy trong chương 4, xem thứ tự các mục ở bài <a href="/posts/cach-viet-chuong-4-ket-qua-nghien-cuu/">cách viết chương 4 kết quả nghiên cứu</a>. Nếu bạn chưa chắc nên dùng T-test, ANOVA hay phương pháp khác cho câu hỏi của mình, trả lời vài câu trong <a href="/cong-cu/chon-phuong-phap/">công cụ chọn phương pháp phân tích</a>.</p>
<p>Không có SPSS? <a href="/cong-cu/phan-tich-du-lieu/">Công cụ phân tích dữ liệu khảo sát</a> chạy T-test và ANOVA ngay trên file Excel: tự đọc Levene, tự chuyển sang Welch khi phương sai không đồng nhất và viết sẵn đoạn văn theo đúng logic ở trên. Đã có bảng kết quả SPSS mà không chắc mình đọc đúng, dán vào <a href="/cong-cu/bac-si-ket-qua/">bác sĩ kết quả</a> để đối chiếu.</p>

<h2>Câu hỏi thường gặp</h2>
<h3>Kiểm định T-test và ANOVA khác nhau thế nào?</h3>
<p>T-test so sánh trung bình của đúng hai nhóm, ANOVA so sánh từ ba nhóm trở lên. Với hai nhóm, ANOVA cho cùng kết luận: F bằng t bình phương (với ví dụ trên, 2,962² = 8,77 là F của ANOVA hai nhóm khi phương sai giả định bằng nhau).</p>
<h3>Sig. của Levene nhỏ hơn 0,05 có phải là có khác biệt?</h3>
<p>Không. Levene chỉ kiểm tra phương sai giữa các nhóm có bằng nhau không, để chọn dòng kết quả. Kết luận về khác biệt trung bình dựa vào Sig. (2-tailed) của T-test hoặc Sig. của F (hay Welch) trong ANOVA.</p>
<h3>ANOVA có ý nghĩa nhưng Tukey không có cặp nào khác biệt thì sao?</h3>
<p>Có thể xảy ra vì F kiểm định mọi tổ hợp so sánh, không riêng từng cặp, và Tukey hiệu chỉnh cho nhiều phép so sánh nên thận trọng hơn. Báo cáo trung thực: có khác biệt chung nhưng chưa xác định được cặp cụ thể, kèm bảng trung bình để người đọc thấy xu hướng.</p>
<h3>Có cần kiểm tra phân phối chuẩn trước khi chạy T-test không?</h3>
<p>Với mỗi nhóm từ khoảng 30 người trở lên, T-test và ANOVA ít nhạy với phân phối không chuẩn (Lumley và cộng sự, 2002). Hội đồng có hỏi thì nêu Skewness và Kurtosis trong bảng mô tả. Nhóm nhỏ và lệch mạnh thì chạy thêm Mann-Whitney hoặc Kruskal-Wallis để đối chiếu.</p>
<h3>Thu nhập có 5 mức nhưng có mức chỉ 8 người, làm sao?</h3>
<p>Gộp các mức kề nhau để mỗi nhóm có đủ người, ưu tiên cách gộp có ý nghĩa thực tế, rồi chạy ANOVA trên biến nhóm mới (<code>Transform &gt; Recode into Different Variables</code>). Ghi rõ lý do gộp nhóm trong chương 3.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Cohen, J. (1988). <em>Statistical power analysis for the behavioral sciences</em> (2nd ed.). Lawrence Erlbaum Associates.</li>
<li>Delacre, M., Lakens, D., &amp; Leys, C. (2017). Why psychologists should by default use Welch's t-test instead of Student's t-test. <em>International Review of Social Psychology, 30</em>(1), 92–101. https://doi.org/10.5334/irsp.82</li>
<li>Delacre, M., Leys, C., Mora, Y. L., &amp; Lakens, D. (2019). Taking parametric assumptions seriously: Arguments for the use of Welch's F-test instead of the classical F-test in one-way ANOVA. <em>International Review of Social Psychology, 32</em>(1), 13. https://doi.org/10.5334/irsp.198</li>
<li>Games, P. A., &amp; Howell, J. F. (1976). Pairwise multiple comparison procedures with unequal n's and/or variances: A Monte Carlo study. <em>Journal of Educational Statistics, 1</em>(2), 113–125. https://doi.org/10.3102/10769986001002113</li>
<li>Lakens, D. (2013). Calculating and reporting effect sizes to facilitate cumulative science: A practical primer for t-tests and ANOVAs. <em>Frontiers in Psychology, 4</em>, 863. https://doi.org/10.3389/fpsyg.2013.00863</li>
<li>Lumley, T., Diehr, P., Emerson, S., &amp; Chen, L. (2002). The importance of the normality assumption in large public health data sets. <em>Annual Review of Public Health, 23</em>, 151–169. https://doi.org/10.1146/annurev.publhealth.23.100901.140546</li>
<li>Welch, B. L. (1947). The generalization of "Student's" problem when several different population variances are involved. <em>Biometrika, 34</em>(1–2), 28–35. https://doi.org/10.1093/biomet/34.1-2.28</li>
</ul>
