---
title: "AVE và CR là gì? Giá trị hội tụ, độ tin cậy tổng hợp"
description: "AVE, CR (composite reliability) và rho_A là gì, ngưỡng AVE ≥ 0,5 và CR ≥ 0,7, công thức tính tay từ hệ số tải, khác Cronbach's alpha ở đâu, xử lý khi AVE thấp."
pubDatetime: 2026-10-30T18:15:00+07:00
featured: false
tags: ["PLS-SEM","thang đo","độ tin cậy"]
---

<p><strong>AVE (average variance extracted, phương sai trung bình được trích) là trung bình bình phương hệ số tải chuẩn hoá của các biến quan sát trong một khái niệm, cho biết khái niệm giải thích được bao nhiêu phần trăm biến thiên của các biến quan sát của nó; AVE từ 0,50 thì khái niệm đạt giá trị hội tụ (Fornell &amp; Larcker, 1981). CR (composite reliability, độ tin cậy tổng hợp) đo độ tin cậy của thang đo dựa trên hệ số tải; CR từ 0,70 đến 0,95 là đạt (Hair và cộng sự, 2019).</strong> rho_A là một hệ số độ tin cậy khác do Dijkstra và Henseler (2015) đề xuất, thường nằm giữa Cronbach's alpha và CR, dùng cùng mốc với CR.</p>

<p>Ba chỉ số này là bảng bắt buộc khi đánh giá mô hình đo lường trong SmartPLS và AMOS. Bài này giải thích mỗi chỉ số đo gì, tính tay từ hệ số tải, so với Cronbach's alpha, và nêu cách xử lý khi AVE dưới 0,5. Ví dụ số dùng dữ liệu mô phỏng bằng Python (numpy), không phải dữ liệu khảo sát thật.</p>

<h2>Giá trị hội tụ và độ tin cậy: hai câu hỏi khác nhau</h2>
<ul>
<li><strong>Độ tin cậy</strong> (reliability): các câu hỏi của thang đo có cho kết quả nhất quán với nhau không? Đo bằng Cronbach's alpha, CR, rho_A.</li>
<li><strong>Giá trị hội tụ</strong> (convergent validity): các câu hỏi có cùng phản ánh một khái niệm, với phần chung đủ lớn so với phần sai số không? Đo bằng hệ số tải và AVE.</li>
</ul>
<p>Thang đo có thể đạt độ tin cậy mà không đạt giá trị hội tụ: thang 8 câu, mỗi câu chỉ tải 0,6, vẫn có CR trên 0,8 nhờ số câu nhiều, nhưng AVE chỉ 0,36, nghĩa là gần hai phần ba biến thiên của mỗi câu là sai số. Fornell và Larcker (1981) gọi AVE là thước đo thận trọng hơn CR vì lý do này: chỉ nhìn CR, có thể kết luận thang đo tốt dù phần lớn phương sai là sai số đo lường.</p>

<h2>Công thức AVE và CR</h2>
<p>Với khái niệm có k biến quan sát, λᵢ là hệ số tải chuẩn hoá (outer loading trong SmartPLS, Standardized Regression Weights trong AMOS):</p>
<p><code>AVE = (λ₁² + λ₂² + … + λₖ²) / k</code></p>
<p><code>CR = (Σλᵢ)² / [(Σλᵢ)² + Σ(1 − λᵢ²)]</code></p>
<ul>
<li>λᵢ² là phần biến thiên của biến i do khái niệm giải thích; 1 − λᵢ² là phần sai số. Vì vậy hệ số tải 0,708 tương ứng λ² ≈ 0,50: khái niệm giải thích một nửa biến thiên của biến đó, và là lý do của mốc tải 0,708 trong PLS-SEM.</li>
<li>AVE ≥ 0,50 nghĩa là trung bình, khái niệm giải thích nhiều hơn sai số.</li>
<li>CR có dạng "phần đúng / (phần đúng + sai số)" của điểm tổng, theo mô hình đo lường bẩm sinh (congeneric) của Jöreskog (1971); Raykov (1997) phát triển cách ước lượng này.</li>
</ul>

<h2>Ví dụ tính tay</h2>
<p>Khái niệm chất lượng dịch vụ (CL), 4 câu, 250 phiếu mô phỏng, hệ số tải ngoài tính bằng thuật toán PLS tự viết, tương đương PLS-SEM algorithm của SmartPLS:</p>
<table>
<thead><tr><th>Biến</th><th>λ</th><th>λ²</th><th>1 − λ²</th></tr></thead>
<tbody>
<tr><td>CL1</td><td>0,869</td><td>0,755</td><td>0,245</td></tr>
<tr><td>CL2</td><td>0,851</td><td>0,724</td><td>0,276</td></tr>
<tr><td>CL3</td><td>0,779</td><td>0,607</td><td>0,393</td></tr>
<tr><td>CL4</td><td>0,685</td><td>0,469</td><td>0,531</td></tr>
<tr><td>Tổng</td><td>3,184</td><td>2,555</td><td>1,445</td></tr>
</tbody>
</table>
<ol>
<li>AVE = 2,555 / 4 = 0,639. Đạt (≥ 0,50).</li>
<li>(Σλ)² = 3,184² = 10,138.</li>
<li>CR = 10,138 / (10,138 + 1,445) = 10,138 / 11,583 = 0,875. Đạt (0,70 đến 0,95).</li>
<li>√AVE = √0,639 = 0,799, dùng cho bảng Fornell-Larcker.</li>
</ol>
<p>Trên cùng dữ liệu, Cronbach's alpha = 0,810 và rho_A = 0,837. Thứ tự α &lt; rho_A &lt; CR là điển hình: alpha giả định mọi biến có hệ số tải bằng nhau nên thường là cận dưới của độ tin cậy, CR dùng hệ số tải thực tế nên thường cao hơn (Hair và cộng sự, 2019).</p>
<p>Có thể làm bảng trên trong Excel: cột λ, cột =λ^2, cột =1−λ^2, rồi áp hai công thức. Với AMOS, dùng hệ số tải chuẩn hoá trong bảng Standardized Regression Weights.</p>

<h2>Ví dụ AVE không đạt nhưng CR đạt</h2>
<p>Thang đo giả định 5 câu với hệ số tải 0,78; 0,74; 0,70; 0,62; 0,45:</p>
<ul>
<li>Σλ² = 0,608 + 0,548 + 0,490 + 0,384 + 0,202 = 2,233, AVE = 2,233 / 5 = 0,447. Không đạt.</li>
<li>Σλ = 3,29, (Σλ)² = 10,824, Σ(1 − λ²) = 2,767, CR = 10,824 / 13,591 = 0,796. Đạt.</li>
</ul>
<p>Bỏ câu thứ 5 (tải 0,45), và giả sử bốn hệ số tải còn lại gần như không đổi: AVE = 2,030 / 4 = 0,508, CR = 8,066 / 10,036 = 0,804. Cả hai đạt. Trên dữ liệu thật, các hệ số tải sẽ thay đổi một chút sau khi loại biến, nên luôn chạy lại mô hình chứ không chỉ tính tay.</p>

<h2>rho_A là gì</h2>
<p>Dijkstra và Henseler (2015) đề xuất rho_A (ρA) như một hệ số độ tin cậy nhất quán cho PLS-SEM, tính từ trọng số ngoài và ma trận tương quan của các biến quan sát:</p>
<p><code>ρA = (ŵ'ŵ)² × ŵ'(S − diag S)ŵ / ŵ'(ŵŵ' − diag ŵŵ')ŵ</code></p>
<p>với ŵ là vector trọng số ngoài đã chuẩn hoá và S là ma trận tương quan. Bạn không cần tính tay rho_A; điều cần nhớ là nó thường nằm giữa α và CR, nên là một thoả hiệp hợp lý, và dùng cùng mốc với CR (Hair và cộng sự, 2019). SmartPLS 4 ghi ba cột: Cronbach's alpha, Composite reliability (rho_a) và Composite reliability (rho_c). Cột rho_c chính là CR theo công thức ở trên.</p>

<h2>Ngưỡng AVE, CR, rho_A</h2>
<table>
<thead><tr><th>Chỉ số</th><th>Ngưỡng</th><th>Nguồn</th></tr></thead>
<tbody>
<tr><td>Hệ số tải ngoài</td><td>≥ 0,708; 0,40 đến 0,708 cân nhắc loại nếu CR, AVE chưa đạt; &lt; 0,40 loại</td><td>Hair và cộng sự (2019, 2021)</td></tr>
<tr><td>AVE</td><td>≥ 0,50</td><td>Fornell &amp; Larcker (1981); Bagozzi &amp; Yi (1988)</td></tr>
<tr><td>CR (rho_c)</td><td>≥ 0,70 (0,60 chấp nhận trong nghiên cứu khám phá); 0,80 đến 0,90 là tốt; &gt; 0,95 có vấn đề</td><td>Hair và cộng sự (2019); Bagozzi &amp; Yi (1988) dùng mốc ≥ 0,60</td></tr>
<tr><td>rho_A</td><td>Như CR</td><td>Dijkstra &amp; Henseler (2015); Hair và cộng sự (2019)</td></tr>
</tbody>
</table>
<p>CR trên 0,95 thường không phải tin tốt: các câu hỏi có thể gần như lặp lại nhau, hoặc người trả lời chọn cùng một mức cho cả khối (Hair và cộng sự, 2019). Xem lại câu chữ và lọc phiếu rập khuôn theo bài <a href="/posts/cach-loc-phieu-khao-sat-khong-hop-le/">lọc phiếu khảo sát không hợp lệ</a>. Bảng ngưỡng đầy đủ cho mọi chỉ số ở trang <a href="/nguong-chap-nhan/">ngưỡng chấp nhận Cronbach, KMO, AVE, HTMT, VIF</a>.</p>

<h2>AVE dưới 0,5 thì xử lý thế nào</h2>
<ol>
<li><strong>Tìm biến tải thấp nhất.</strong> AVE là trung bình λ², nên một biến tải 0,45 kéo AVE xuống mạnh (λ² chỉ 0,20).</li>
<li><strong>Xem nội dung câu đó.</strong> Câu đảo chiều chưa mã hoá ngược thường có hệ số tải rất thấp hoặc âm (xem bài <a href="/posts/bang-ma-hoa-thang-do/">bảng mã hoá thang đo</a>). Câu dịch tối nghĩa cũng hay tải thấp.</li>
<li><strong>Loại từng biến một</strong>, chạy lại, kiểm tra AVE và CR sau mỗi lần. Giữ ít nhất 3 biến cho mỗi khái niệm và đảm bảo nội dung khái niệm không bị hụt.</li>
<li><strong>Ghi lý do loại biến</strong> vào chương 4. Hội đồng thường hỏi câu này.</li>
</ol>
<p>Một lập luận hay thấy trong khoá luận là "AVE dưới 0,5 vẫn chấp nhận được nếu CR trên 0,6", kèm trích dẫn Fornell và Larcker (1981). Như đã nói ở trên, bài báo gốc nhấn mạnh điều ngược lại: AVE thận trọng hơn CR. Các hướng dẫn PLS-SEM hiện hành (Hair và cộng sự, 2019) dùng AVE ≥ 0,50 làm tiêu chí. Nếu muốn dùng lập luận đó, hãy đọc bản gốc và trích đúng trang trước.</p>
<p>Nhập hệ số tải, CR, AVE vào <a href="/cong-cu/bac-si-ket-qua/">bác sĩ kết quả</a> để nhận chẩn đoán theo ngưỡng và đoạn văn giải trình có trích dẫn.</p>

<h2>AVE, CR và Cronbach's alpha: báo cáo cái nào</h2>
<ul>
<li><strong>Đề tài chạy SPSS</strong> (Cronbach, EFA, hồi quy): thường chỉ báo cáo Cronbach's alpha, xem bài <a href="/posts/cronbach-alpha-la-gi/">Cronbach's alpha là gì</a> hoặc tính nhanh bằng <a href="/cong-cu/cronbach-alpha/">công cụ tính Cronbach's alpha</a>. Có thể tính CR, AVE từ hệ số tải EFA, nhưng không phải yêu cầu chuẩn.</li>
<li><strong>Đề tài chạy SmartPLS</strong>: báo cáo α, rho_A, CR và AVE trong một bảng, cùng hệ số tải. Quy trình đầy đủ ở bài <a href="/posts/pls-sem-la-gi-smartpls/">PLS-SEM là gì</a>.</li>
<li><strong>Đề tài chạy AMOS (CFA)</strong>: tính CR, AVE từ hệ số tải chuẩn hoá bằng Excel theo công thức trên, kèm chỉ số phù hợp mô hình.</li>
</ul>
<p>Sau giá trị hội tụ là giá trị phân biệt: AVE còn được dùng trong tiêu chí Fornell-Larcker (√AVE lớn hơn tương quan với các khái niệm khác), nhưng tiêu chí chính hiện nay là HTMT, giải thích ở bài <a href="/posts/htmt-gia-tri-phan-biet/">HTMT và giá trị phân biệt</a>.</p>

<h2>Ba tình huống hay gặp khi đọc bảng</h2>
<ul>
<li><strong>Hệ số tải âm.</strong> Gần như luôn là câu đảo chiều chưa mã hoá ngược. λ² vẫn dương nên AVE có thể trông "bình thường", nhưng Σλ trong công thức CR bị kéo xuống mạnh. Mã hoá lại rồi chạy lại, đừng loại câu đó ngay.</li>
<li><strong>Khái niệm chỉ có 2 biến quan sát.</strong> AVE và CR vẫn tính được, nhưng rất nhạy với một biến tải thấp, và Cronbach's alpha với 2 câu thường thấp. Khi thiết kế bảng hỏi, nên giữ ít nhất 3 câu cho mỗi khái niệm.</li>
<li><strong>AVE đạt ở PLS-SEM nhưng không đạt ở CFA trên cùng dữ liệu.</strong> Bình thường: PLS-SEM tính hệ số tải từ điểm tổ hợp có trọng số nên hệ số tải thường cao hơn hệ số tải chuẩn hoá của CFA. Báo cáo theo đúng phương pháp bạn dùng, không lấy số của phương pháp này để biện hộ cho phương pháp kia.</li>
</ul>

<h2>Câu mẫu viết vào chương 4</h2>
<blockquote><p>Bảng 4.x cho thấy hệ số tải ngoài của các biến quan sát nằm trong khoảng 0,675 đến 0,872. Hai biến CL4 (0,685) và TT4 (0,675) có hệ số tải thấp hơn 0,708 nhưng được giữ lại vì độ tin cậy tổng hợp và AVE của các khái niệm tương ứng đều đạt ngưỡng (Hair và cộng sự, 2019). Cronbach's alpha từ 0,787 đến 0,835, rho_A từ 0,811 đến 0,837 và độ tin cậy tổng hợp từ 0,863 đến 0,890, đều trên 0,70 và dưới 0,95, cho thấy các thang đo đạt độ tin cậy. AVE của các khái niệm từ 0,613 đến 0,669, lớn hơn 0,50, do đó các thang đo đạt giá trị hội tụ (Fornell &amp; Larcker, 1981).</p></blockquote>
<p>Chọn thang đo gốc có hệ số tải cao đã được báo cáo là cách đơn giản nhất để AVE đạt ngay từ đầu; <a href="/thang-do/">thư viện thang đo</a> ghi nguồn gốc và độ tin cậy gốc cho từng thang.</p>

<h2>Câu hỏi thường gặp</h2>
<h3>AVE bao nhiêu là đạt?</h3>
<p>Từ 0,50 trở lên (Fornell &amp; Larcker, 1981). Nghĩa là trung bình khái niệm giải thích ít nhất một nửa biến thiên của các biến quan sát của nó.</p>
<h3>Composite reliability là gì, khác Cronbach's alpha thế nào?</h3>
<p>Cả hai đo độ tin cậy nhất quán nội tại. Cronbach's alpha giả định mọi biến quan sát có hệ số tải bằng nhau; CR dùng hệ số tải thực tế của từng biến nên phản ánh đúng hơn khi các biến tải chênh nhau. CR thường cao hơn alpha một chút.</p>
<h3>Cách tính AVE và CR bằng Excel?</h3>
<p>Nhập hệ số tải chuẩn hoá vào một cột, tạo cột bình phương và cột 1 trừ bình phương. AVE = trung bình cột bình phương. CR = (tổng hệ số tải)² chia cho [(tổng hệ số tải)² + tổng cột 1 trừ bình phương].</p>
<h3>CR lớn hơn 0,95 có sao không?</h3>
<p>Có thể là dấu hiệu các câu hỏi trùng lặp nội dung hoặc người trả lời chọn cùng một mức cho cả khối. Hair và cộng sự (2019) coi giá trị trên 0,95 là có vấn đề; xem lại câu chữ và lọc phiếu rập khuôn.</p>

<h2>Tài liệu tham khảo</h2>
<ul>
<li>Bagozzi, R. P., &amp; Yi, Y. (1988). On the evaluation of structural equation models. <em>Journal of the Academy of Marketing Science, 16</em>(1), 74–94. https://doi.org/10.1007/BF02723327</li>
<li>Dijkstra, T. K., &amp; Henseler, J. (2015). Consistent partial least squares path modeling. <em>MIS Quarterly, 39</em>(2), 297–316. https://doi.org/10.25300/MISQ/2015/39.2.02</li>
<li>Fornell, C., &amp; Larcker, D. F. (1981). Evaluating structural equation models with unobservable variables and measurement error. <em>Journal of Marketing Research, 18</em>(1), 39–50. https://doi.org/10.1177/002224378101800104</li>
<li>Hair, J. F., Risher, J. J., Sarstedt, M., &amp; Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. <em>European Business Review, 31</em>(1), 2–24. https://doi.org/10.1108/EBR-11-2018-0203</li>
<li>Hair, J. F., Jr., Hult, G. T. M., Ringle, C. M., Sarstedt, M., Danks, N. P., &amp; Ray, S. (2021). <em>Partial least squares structural equation modeling (PLS-SEM) using R: A workbook</em>. Springer. https://doi.org/10.1007/978-3-030-80519-7</li>
<li>Jöreskog, K. G. (1971). Statistical analysis of sets of congeneric tests. <em>Psychometrika, 36</em>(2), 109–133. https://doi.org/10.1007/BF02291393</li>
<li>Raykov, T. (1997). Estimation of composite reliability for congeneric measures. <em>Applied Psychological Measurement, 21</em>(2), 173–184. https://doi.org/10.1177/01466216970212006</li>
</ul>
