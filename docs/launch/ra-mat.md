# Bộ tài liệu ra mắt Góc Nghiên Cứu (31/10 – 06/11/2026)

Trang: https://gocnghiencuu.com/ · Người đăng: chủ trang, bằng tài khoản cá nhân của mình.

Mọi con số và tính năng dưới đây đã đối chiếu với mã nguồn công cụ (`src/tools/*.html`, `src/pages/cong-cu/*.astro`) ngày 30/10/2026. Nếu sửa công cụ sau ngày này, đọc lại mục "Sự thật dùng được" trước khi đăng.

## Quy tắc chung (đọc trước khi đăng bất cứ thứ gì)

- Luôn nói thật: "mình làm web này". Không lập tài khoản phụ, không nhờ người khác vào khen, không bình luận "seeding", không viết đánh giá hay lời cảm ơn giả.
- Không hứa thứ công cụ chưa có (xem "Giới hạn cần nói thật" bên dưới). Hỏi gì chưa làm được thì nói chưa làm được.
- Không nhắc tới dịch vụ thu thập khảo sát nào trong các bài ở đây. Nếu có người hỏi "web kiếm tiền bằng gì", trả lời đúng như chân trang: một số link trên trang là link giới thiệu (affiliate), được ghi rõ ở chân trang; công cụ vẫn miễn phí, không cần tài khoản.
- Đọc nội quy từng nhóm/diễn đàn trước khi đăng. Nhóm cấm quảng cáo thì chỉ dùng biến thể "nhờ góp ý" (mục 2C), và nếu nội quy cấm cả link thì đừng đăng, hoặc nhắn admin xin phép trước.
- Đăng thủ công, mỗi nơi một văn bản hơi khác nhau. Không dùng công cụ đăng hàng loạt.

## Sự thật dùng được (nguồn cho mọi bài)

| Công cụ | Làm được gì (đúng như trang ghi) | Đường dẫn |
|---|---|---|
| PLS-SEM | Tải Excel/CSV hoặc dùng dữ liệu mẫu 300 phiếu. Outer loadings, outer weights, Cronbach's alpha, rho_A, rho_c (CR), AVE, Fornell–Larcker, HTMT, cross loadings, VIF; hệ số đường dẫn, R², R² hiệu chỉnh, f², inner VIF, tác động gián tiếp/tổng; Q² blindfolding (D = 7); bootstrap mặc định 5.000 mẫu, có seed, percentile hoặc BCa. Hỗ trợ khái niệm formative (Mode B). Xuất Word (bảng, hình, đoạn văn chương 4, tài liệu tham khảo), CSV. Thuật toán PLS chuẩn (Lohmöller, 1989) với mặc định của SmartPLS; ước lượng khớp gói R seminr và cSEM tới ít nhất 9 chữ số thập phân. Lấy được mô hình từ công cụ Vẽ mô hình. | /cong-cu/pls-sem/ |
| Cronbach's alpha | Dán thẳng từ Excel, SPSS, Google Forms; tự gom biến theo mã (HL1, HL2… thành HL); bảng Item-Total Statistics như SPSS; khoảng tin cậy 95% của alpha (Feldt và cộng sự, 1987); McDonald's omega; đảo câu ngược và loại biến (ghi lần 1, lần 2); nhãn chữ "Đồng ý"… tự đổi sang điểm; xuất Word. | /cong-cu/cronbach-alpha/ |
| Phân tích dữ liệu | Tải Excel/CSV hoặc dữ liệu mẫu TAM 250 phiếu. Lọc phiếu, đảo điểm, thống kê mô tả, Cronbach's alpha, EFA (PCA + Varimax có chuẩn hoá Kaiser, KMO, Bartlett), CR/AVE gần đúng, tương quan, hồi quy bội OLS (VIF, Durbin–Watson), t-test/ANOVA theo nhân khẩu học (Levene, Welch). Xuất nháp chương 4 bằng Word. | /cong-cu/phan-tich-du-lieu/ |
| Làm sạch dữ liệu | Nhận file Google Forms, Microsoft Forms (CSV/Excel). Đặt mã biến, đổi nhãn Likert thành số, đảo câu ngược, loại phiếu theo quy tắc khai báo trước (sàng lọc, câu kiểm tra chú ý, làm quá nhanh, trả lời một chiều, trùng lặp, thiếu). Xuất file sạch CSV, cú pháp SPSS (.sps), bảng mã hoá, danh sách phiếu kèm lý do loại. | /cong-cu/lam-sach-du-lieu/ |
| Tính cỡ mẫu | PLS-SEM (căn bậc hai nghịch đảo, bảng Hair và cộng sự 2022), CB-SEM/CFA, hồi quy bội (kiểu G*Power, f²), biến điều tiết, biến trung gian (Fritz & MacKinnon, 2007), EFA, t-test, ANOVA, chi bình phương, Pearson, Cochran/Slovin/Krejcie & Morgan. Kèm đoạn chọn mẫu chương 3 có trích dẫn APA. | /cong-cu/tinh-co-mau/ |
| Vẽ mô hình | Kéo thả khái niệm từ thư viện, nối mũi tên, đổi chiều +/−, biến điều tiết, khái niệm bậc cao, biến kiểm soát, so sánh đa nhóm; nhập bằng chữ "A -> B"; xuất PNG, SVG, link; chép giả thuyết H1…Hn viết sẵn. Dùng được trên điện thoại. | /cong-cu/ve-mo-hinh/ |
| Trích dẫn APA 7 | Dán DOI hoặc tên bài (tra Crossref), nhập tay sách, luận văn, web, báo điện tử, văn bản pháp luật; tên tác giả Việt đúng APA hoặc giữ đủ họ tên; xếp A–Z. | /cong-cu/trich-dan-apa/ |
| Thư viện thang đo | 60 thang đo, có bản tiếng Việt, bản gốc tiếng Anh, tác giả, năm, độ tin cậy, gợi ý trích dẫn. | /thang-do/ |
| Ngưỡng chấp nhận | Một bảng ngưỡng alpha, CR, AVE, KMO, hệ số tải, HTMT, VIF, CFI, RMSEA, R², f², mỗi ngưỡng có nguồn kèm DOI. | /nguong-chap-nhan/ |

Chung cho mọi công cụ: miễn phí, không cần tài khoản, dữ liệu xử lý ngay trên trình duyệt, không gửi lên máy chủ (riêng công cụ APA chỉ gửi DOI hoặc tên bài tới Crossref).

**Giới hạn cần nói thật khi được hỏi:** công cụ PLS-SEM đã có SRMR, PLSpredict, HTMT2 nhưng chưa có PLSc, MGA và mô hình bậc cao trong phần ước lượng (công cụ Vẽ mô hình vẽ được, nhưng chưa chạy được). Phân tích dữ liệu chưa có CFA/CB-SEM (kiểu AMOS). EFA dùng PCA + Varimax (như mặc định SPSS), không phải PAF/Promax. Số bootstrap lệch nhẹ so với SmartPLS vì mỗi phần mềm rút mẫu ngẫu nhiên khác nhau. Người làm khoá luận vẫn phải tự diễn giải và sửa đoạn văn.

---

## 1. Định vị và 3 hook

**Định vị (2 dòng):**
Góc Nghiên Cứu là bộ công cụ miễn phí cho khoá luận định lượng: từ thang đo, cỡ mẫu, làm sạch dữ liệu đến PLS-SEM và chương 4, chạy ngay trên trình duyệt.
Không cài phần mềm, không tạo tài khoản, dữ liệu không rời máy bạn, và mọi ngưỡng đều có nguồn để trích.

**3 hook mạnh nhất:**

1. **"Chạy PLS-SEM online miễn phí, khỏi cài hay crack SmartPLS."** Đủ bảng cho chương 4: outer loadings, CR, AVE, HTMT, hệ số đường dẫn, bootstrap 5.000 mẫu, R², f², Q², xuất Word.
2. **"Cronbach's alpha + EFA ngay trên trình duyệt, dán từ Excel là ra bảng như SPSS."** Item-Total Statistics, KMO–Bartlett, ma trận xoay, kèm đoạn văn chương 4.
3. **"60 thang đo tiếng Việt có nguồn gốc."** Có bản gốc tiếng Anh, tác giả, năm, để hội đồng hỏi "thang đo lấy ở đâu" là trả lời được.

Hook phụ dùng xoay vòng: "Vẽ mô hình nghiên cứu kéo thả, tự viết giả thuyết H1, H2…", "Chuyển file Google Form sang SPSS trong 1 phút", "Trích dẫn APA 7 đúng tên tác giả Việt".

---

## 2. Bài đăng nhóm Facebook

Quy ước link: nếu nhóm cho để link trong bài thì để ở cuối bài; nếu nhóm hay bóp tiếp cận bài có link hoặc nội quy bảo "link để ở bình luận" thì bỏ dòng link và tự bình luận link ngay sau khi đăng. Mỗi biến thể dưới 1.200 ký tự (đã đếm, chưa tính link).

### 2A. Kể chuyện / phát hiện

Đoạn mở đầu là câu chuyện mẫu: chỉ giữ chi tiết đúng với bạn (dùng thử hết hạn, máy Mac…), không đúng thì thay bằng lý do thật bạn làm web.

> Hồi làm khoá luận, khâu mình mệt nhất không phải viết mà là chạy số liệu. SmartPLS bản dùng thử hết hạn đúng tuần nộp, SPSS thì máy Mac cài không nổi, đi xin bản crack thì sợ dính virus.
>
> Nên mấy tháng nay mình tự làm một web nhỏ tên Góc Nghiên Cứu, gom mấy thứ ngày đó mình cần, chạy luôn trên trình duyệt:
>
> 👉 PLS-SEM: outer loadings, CR, AVE, HTMT, hệ số đường dẫn, bootstrap 5.000 mẫu, R², f², Q², tải Word
> 👉 Cronbach's alpha: dán từ Excel là ra bảng Item-Total như SPSS
> 👉 EFA, tương quan, hồi quy và nháp chương 4
> 👉 Tính cỡ mẫu, vẽ mô hình, trích dẫn APA 7
> 👉 60 thang đo tiếng Việt có ghi nguồn gốc
>
> Miễn phí, không cần tài khoản, dữ liệu xử lý ngay trên máy bạn chứ không gửi lên đâu cả. Kết quả PLS mình đối chiếu với gói R seminr và cSEM, nhưng các bạn vẫn nên so lại với phần mềm trường dùng ở lần đầu.
>
> Web còn thiếu nhiều thứ (chưa có CFA kiểu AMOS, chưa có MGA), bạn nào dùng thấy sai hay khó hiểu chỗ nào cứ bình luận, mình sửa.
>
> Link: https://gocnghiencuu.com/

### 2B. Dạng danh sách

> Mình gom 6 việc trong khoá luận định lượng mà giờ làm được miễn phí trên trình duyệt, không cần cài phần mềm. Web này do mình tự làm, chia sẻ cho bạn nào đang chạy deadline:
>
> 1️⃣ Chọn thang đo: 60 thang đo tiếng Việt kèm bản gốc, tác giả, năm để trích
> 2️⃣ Tính cỡ mẫu: PLS-SEM, hồi quy, EFA, t-test, ANOVA, Cochran, có sẵn đoạn chương 3
> 3️⃣ Vẽ mô hình: kéo thả, xuất PNG cho Word, tự viết giả thuyết H1, H2…
> 4️⃣ Làm sạch file Google Form: đổi nhãn Likert thành số, lọc phiếu trả lời một chiều, xuất file cho SPSS
> 5️⃣ Cronbach's alpha, EFA, hồi quy, hoặc PLS-SEM như SmartPLS (HTMT, bootstrap, R², f², Q²)
> 6️⃣ Trích dẫn APA 7, tên tác giả Việt đúng chuẩn
>
> Tất cả miễn phí, không đăng ký, dữ liệu không rời máy bạn. Mỗi ngưỡng (alpha 0,7, AVE 0,5, HTMT 0,85…) đều có nguồn kèm DOI để bạn trích khi hội đồng hỏi.
>
> Bạn đang kẹt ở bước nào thì bình luận, mình trả lời từng bạn.
>
> 🔗 https://gocnghiencuu.com/cong-cu/

### 2C. Nhờ góp ý (dùng cho nhóm hạn chế quảng cáo)

> Mọi người ơi, mình là sinh viên/cựu sinh viên làm khoá luận định lượng, đang tự làm một web công cụ miễn phí cho việc chạy số liệu, và muốn nhờ các bạn đang làm khoá luận hoặc NCKH dùng thử rồi chê thật lòng giúp mình.
>
> Hiện web có: PLS-SEM chạy trên trình duyệt (outer loadings, CR, AVE, HTMT, bootstrap), Cronbach's alpha, EFA và hồi quy, tính cỡ mẫu, vẽ mô hình, và 60 thang đo tiếng Việt có nguồn.
>
> Mình đang muốn biết 3 điều:
> 1. Kết quả có khớp với SPSS/SmartPLS máy bạn không? Lệch ở bảng nào?
> 2. Đoạn văn chương 4 nó viết ra có dùng được không, hay phải sửa nhiều?
> 3. Bạn cần thêm tính năng gì nhất (CFA, MGA, PLSc…)?
>
> Web miễn phí, không cần tài khoản, dữ liệu xử lý trên máy bạn. Mình không bán gì trong bài này, chỉ cần góp ý để sửa cho đúng. Nếu admin thấy không phù hợp thì cứ gỡ giúp mình nhé.
>
> Link mình để ở bình luận đầu.

Bình luận đầu cho 2C: `Link đây ạ: https://gocnghiencuu.com/ (có dữ liệu mẫu để thử ngay, không cần file của bạn)`

### Chọn nhóm và nhịp đăng

**Loại nhóm nên tìm** (không có danh sách tên nhóm ở đây vì chưa xác minh được; tự tìm và đọc nội quy):

| Loại nhóm | Gõ vào ô tìm nhóm Facebook | Biến thể hợp |
|---|---|---|
| NCKH sinh viên | `nghiên cứu khoa học sinh viên`, `NCKH`, `Eureka` | 2A hoặc 2C |
| Khoá luận / luận văn | `khoá luận tốt nghiệp`, `khóa luận`, `luận văn thạc sĩ`, `làm luận văn` | 2B |
| Phần mềm thống kê | `SPSS`, `SmartPLS`, `AMOS`, `PLS-SEM`, `xử lý số liệu`, `phân tích định lượng` | 2C (nhóm này hay có dịch vụ chạy thuê, dễ bị coi là cạnh tranh) |
| Trường đại học | `sinh viên <tên trường>`, `<tên trường> confession`, `hỏi đáp <tên trường>` (khối kinh tế: NEU, UEH, FTU, TMU, UEB, HVTC, HVNH, UEL…) | 2C, hoặc nhắn admin xin phép trước |
| Theo ngành | `marketing sinh viên`, `quản trị kinh doanh`, `tài chính ngân hàng sinh viên`, `nhân sự HR sinh viên` | 2B, nhấn hook thang đo theo ngành |

Kiểm tra trước khi đăng ở mỗi nhóm: nhóm còn hoạt động (có bài trong 7 ngày gần nhất), nội quy có cho giới thiệu sản phẩm/link không, có ngày riêng cho chia sẻ tài liệu không.

**Nhịp đăng để không bị đánh dấu spam:**
- Tối đa 2–3 nhóm mỗi ngày, cách nhau ít nhất vài giờ.
- Không đăng nguyên văn một bài ở hai nhóm liền nhau: đổi câu mở đầu, đổi thứ tự danh sách, đổi biến thể.
- Không đăng lại ở nhóm đã đăng trong 2 tuần.
- Trả lời mọi bình luận bằng tay, trong ngày, viết riêng cho từng người (không dán một câu trả lời mẫu). Người hỏi lỗi thì cảm ơn, ghi lại, sửa xong quay lại báo.
- Bài bị duyệt chậm hoặc bị từ chối: không đăng lại, nhắn admin hỏi lý do.
- Không tag người lạ, không nhắn tin hàng loạt cho thành viên nhóm.

---

## 3. Bài Spiderum (bản nháp)

Chuyên mục gợi ý: Giáo dục hoặc Khoa học – Công nghệ. Đăng bằng tài khoản cá nhân; câu giới thiệu ở cuối ghi rõ mình làm web.

**Tiêu đề:** Mình làm khoá luận PLS-SEM mà không cần SmartPLS bản quyền: quy trình 6 bước

**Sapo:** Đây không phải bài "mẹo qua môn". Đây là quy trình mình ước gì có người kể cho mình từ năm ba: làm PLS-SEM sao cho hội đồng hỏi câu nào cũng có nguồn để đáp, và làm được bằng công cụ miễn phí.

---

Năm cuối đại học, mình chọn đề tài định lượng với mô hình 5 khái niệm, 7 giả thuyết. Giảng viên hướng dẫn bảo: "Mô hình này chạy PLS-SEM cho gọn." Mình gật đầu, rồi về mới biết SmartPLS là phần mềm trả phí, bản dùng thử có hạn, còn bản "share" trên mạng thì vừa rủi ro bảo mật vừa không đàng hoàng để ghi vào luận văn.

Từ đó mình học được hai điều. Một là PLS-SEM không phải phép màu của một phần mềm. Nó là một thuật toán đã công bố (Wold, 1982; Lohmöller, 1989), nên phần mềm nào cài đúng thì ra cùng kết quả. Hai là thứ hội đồng hỏi gần như không bao giờ là "em dùng phần mềm gì", mà là "ngưỡng này em lấy ở đâu" và "cỡ mẫu này đủ chưa".

Dưới đây là 6 bước mình làm, kèm ngưỡng và nguồn để bạn tự kiểm tra.

### Bước 1. Vẽ mô hình và viết giả thuyết trước khi chạm vào dữ liệu

Nghe hiển nhiên nhưng rất nhiều bạn thu dữ liệu xong mới chỉnh mô hình cho "ra đẹp". Làm thế là đi ngược logic kiểm định. Mỗi mũi tên trong mô hình phải có cơ sở lý thuyết hoặc nghiên cứu trước, và phải được ghi thành giả thuyết H1, H2… trước khi phát phiếu.

Khi vẽ, để ý ba thứ: chiều tác động (dương hay âm), có biến trung gian không (chuỗi X → M → Y), có biến điều tiết không. Ba thứ này quyết định cỡ mẫu và cách kiểm định ở các bước sau.

Mỗi khái niệm nên dùng thang đo đã công bố, ghi rõ tác giả và năm. Nếu dịch thang đo nước ngoài, ghi rõ cách dịch (dịch ngược, hỏi ý kiến chuyên gia) và các chỉnh sửa. Đừng lấy thang đo từ khoá luận khoá trước rồi ghi nguồn là khoá luận đó: hãy lần về bài gốc.

### Bước 2. Tính cỡ mẫu bằng một phương pháp có thể trích dẫn

Quy tắc "10 lần số mũi tên" (Barclay và cộng sự, 1995) vẫn xuất hiện trong nhiều khoá luận, nhưng các tài liệu PLS-SEM gần đây khuyên không dựa vào nó vì thường cho cỡ mẫu quá nhỏ. Hair và cộng sự (2022) đề xuất phương pháp căn bậc hai nghịch đảo của Kock và Hadaya (2018): cỡ mẫu tối thiểu phụ thuộc vào hệ số đường dẫn nhỏ nhất mà bạn muốn phát hiện là có ý nghĩa.

Ví dụ: muốn phát hiện đường dẫn nhỏ nhất khoảng 0,11–0,20 ở mức ý nghĩa 5%, cần khoảng 155 quan sát; nếu đường dẫn nhỏ nhất kỳ vọng ở khoảng 0,21–0,30 thì cần khoảng 69. Không có nghiên cứu trước để ước lượng thì nên giữ mức 0,20 (tức khoảng 155). Sau đó cộng thêm tỷ lệ phiếu hỏng dự kiến, thường 10–20%.

Viết đoạn cỡ mẫu trong chương 3 nên nêu đủ: phương pháp, giả định (mức ý nghĩa, power, hệ số nhỏ nhất), con số tối thiểu, con số thu thực tế, và nguồn.

### Bước 3. Làm sạch dữ liệu với quy tắc đặt trước

Phiếu thu về từ Google Forms thường lẫn phiếu trả lời một màu (chọn "Đồng ý" từ đầu đến cuối), phiếu làm quá nhanh, phiếu trùng. Nguyên tắc quan trọng nhất: **ghi quy tắc loại phiếu vào đề cương trước khi nhìn kết quả**, rồi áp dụng đúng quy tắc đó. Loại phiếu sau khi thấy alpha thấp là thao túng dữ liệu, dù vô tình.

Các quy tắc hay dùng: không qua câu sàng lọc, sai câu kiểm tra chú ý, thời gian làm quá ngắn, chọn cùng một mức cho nhiều câu liên tiếp, thiếu quá nhiều câu. Báo số phiếu bị loại theo từng lý do trong mục 4.1. Nhớ đảo điểm câu đảo chiều trước khi phân tích (thang 1–5 thì điểm mới = 6 − điểm cũ).

### Bước 4. Đánh giá mô hình đo lường

Đây là phần nhiều bảng nhất. Thứ tự đọc theo Hair và cộng sự (2019):

- **Hệ số tải ngoài (outer loadings)** từ 0,708 trở lên. Biến từ 0,40 đến dưới 0,708 chỉ loại khi việc loại giúp CR hoặc AVE đạt ngưỡng; dưới 0,40 thì loại. Loại xong phải chạy lại.
- **Độ tin cậy**: Cronbach's alpha, rho_A và độ tin cậy tổng hợp (CR, rho_c) từ 0,70, nhưng trên 0,95 là dấu hiệu các câu hỏi trùng ý nhau.
- **Giá trị hội tụ**: AVE từ 0,50 (Fornell & Larcker, 1981).
- **Giá trị phân biệt**: HTMT dưới 0,85, hoặc dưới 0,90 với các khái niệm gần nghĩa (Henseler và cộng sự, 2015). HTMT là tiêu chí chính; Fornell–Larcker và hệ số tải chéo nay chỉ nên để tham khảo, vì Henseler và cộng sự cho thấy chúng kém nhạy khi phát hiện vấn đề.

Nếu một chỉ số không đạt, đừng âm thầm đổi sang ngưỡng dễ hơn. Ghi rõ chỉ số nào không đạt, xử lý thế nào (loại biến, gộp khái niệm…) và vì sao xử lý đó hợp lệ.

### Bước 5. Đánh giá mô hình cấu trúc bằng bootstrap

- **Đa cộng tuyến**: VIF giữa các khái niệm nên dưới 3 (Hair và cộng sự, 2019).
- **Hệ số đường dẫn**: kiểm định bằng bootstrap, nên dùng 5.000 mẫu và ghi lại seed để người khác chạy lại ra cùng kết quả. Kết luận dựa trên p hai phía hoặc khoảng tin cậy 95% không chứa 0.
- **R²**: mức 0,25 / 0,50 / 0,75 thường được đọc là yếu / trung bình / mạnh, nhưng tuỳ lĩnh vực; R² thấp không làm mô hình "sai".
- **f²**: 0,02 / 0,15 / 0,35 là nhỏ / trung bình / lớn (Cohen, 1988).
- **Q²** (blindfolding) lớn hơn 0 cho thấy mô hình có khả năng dự báo.
- **Trung gian**: kết luận theo khoảng tin cậy bootstrap của tác động gián tiếp, không dùng Sobel; phân loại trung gian toàn phần, một phần theo Zhao và cộng sự (2010).

### Bước 6. Viết chương 4 và tự kiểm tra

Mỗi bảng trong chương 4 nên đi kèm ba câu: con số chính là gì, so với ngưỡng nào (có nguồn), kết luận gì. Phần thảo luận (so sánh với nghiên cứu trước, giải thích vì sao giả thuyết bị bác bỏ, hàm ý quản trị) là phần không công cụ nào viết thay bạn được, và cũng là phần hội đồng chấm kỹ nhất.

Trước khi nộp, tự hỏi: mọi ngưỡng đã có nguồn chưa? Cỡ mẫu tối thiểu có nguồn chưa? Quy tắc loại phiếu có nằm trong đề cương không? Seed và số mẫu bootstrap có được ghi lại không?

### Vậy chạy bằng gì nếu không có SmartPLS?

Có vài lựa chọn hợp pháp và miễn phí:

- **R với gói seminr hoặc cSEM**: đầy đủ, minh bạch, nhưng phải viết vài dòng code.
- **Công cụ chạy trên trình duyệt**: mình làm một trang tên [Góc Nghiên Cứu](https://gocnghiencuu.com/cong-cu/pls-sem/), chạy PLS-SEM ngay trên trình duyệt với mặc định giống SmartPLS (path weighting, dữ liệu chuẩn hoá, tiêu chí dừng 10⁻⁷, tối đa 300 vòng lặp), ra đủ các bảng ở bước 4–5 và xuất Word. Mình đối chiếu điểm ước lượng với seminr và cSEM; số bootstrap thì lệch nhẹ giữa các phần mềm như mọi phần mềm khác, vì rút mẫu ngẫu nhiên khác nhau. Nó có SRMR và PLSpredict, nhưng chưa có MGA hay PLSc, nên nếu hội đồng trường bạn yêu cầu các phân tích đó thì vẫn cần R hoặc SmartPLS.

Dù dùng gì, ở lần đầu hãy chạy dữ liệu mẫu trên hai phần mềm và so kết quả. Đó là cách tốt nhất để tin công cụ của mình, và cũng là câu trả lời tốt nhất nếu hội đồng hỏi.

Nếu cần tra nhanh ngưỡng và nguồn của từng chỉ số, mình có tổng hợp ở [bảng ngưỡng chấp nhận](https://gocnghiencuu.com/nguong-chap-nhan/), mỗi dòng có DOI.

*Minh bạch: mình là người làm trang Góc Nghiên Cứu nhắc trong bài. Trang miễn phí, không cần tài khoản. Bạn thấy chỗ nào trong bài sai, cứ bình luận để mình sửa.*

**Tài liệu tham khảo**

- Barclay, D., Higgins, C., & Thompson, R. (1995). The partial least squares (PLS) approach to causal modeling. *Technology Studies, 2*(2), 285–309.
- Cohen, J. (1988). *Statistical power analysis for the behavioral sciences* (2nd ed.). Lawrence Erlbaum.
- Fornell, C., & Larcker, D. F. (1981). Evaluating structural equation models with unobservable variables and measurement error. *Journal of Marketing Research, 18*(1), 39–50.
- Hair, J. F., Risher, J. J., Sarstedt, M., & Ringle, C. M. (2019). When to use and how to report the results of PLS-SEM. *European Business Review, 31*(1), 2–24.
- Hair, J. F., Hult, G. T. M., Ringle, C. M., & Sarstedt, M. (2022). *A primer on partial least squares structural equation modeling (PLS-SEM)* (3rd ed.). Sage.
- Henseler, J., Ringle, C. M., & Sarstedt, M. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling. *Journal of the Academy of Marketing Science, 43*(1), 115–135.
- Kock, N., & Hadaya, P. (2018). Minimum sample size estimation in PLS-SEM: The inverse square root and gamma-exponential methods. *Information Systems Journal, 28*(1), 227–261.
- Lohmöller, J.-B. (1989). *Latent variable path modeling with partial least squares*. Physica.
- Wold, H. (1982). Soft modeling: The basic design and some extensions. In K. G. Jöreskog & H. Wold (Eds.), *Systems under indirect observation* (Part II, pp. 1–54). North-Holland.
- Zhao, X., Lynch, J. G., & Chen, Q. (2010). Reconsidering Baron and Kenny: Myths and truths about mediation analysis. *Journal of Consumer Research, 37*(2), 197–206.

(Phần thân khoảng 1.400 từ. Trước khi đăng, đọc lại một lượt cho đúng giọng mình; câu chuyện mở bài sửa theo trải nghiệm thật của bạn, đừng giữ chi tiết nào không đúng với bạn.)

---

## 4. Kế hoạch diễn đàn và hỏi đáp

**Nơi nên vào:**
- **VOZ**: box học tập/ngoại ngữ (tên box có thể đổi, xem mục lục diễn đàn). Không mở thớt quảng cáo. Tìm thớt có sẵn với từ khoá `SPSS`, `SmartPLS`, `luận văn`, `khoá luận`, `NCKH` và trả lời khi đúng câu hỏi. Nếu mở thớt mới, mở dạng chia sẻ kinh nghiệm (rút gọn bài Spiderum) và ghi "mình làm web này" ngay đầu.
- **Tinh tế**: chỉ hợp ở mảng phần mềm/web (ví dụ "web chạy thống kê trên trình duyệt, không gửi dữ liệu lên máy chủ"). Đăng tối đa 1 bài, dạng giới thiệu dự án cá nhân, không đăng lại.
- **Reddit**: r/VietNam hoặc subreddit học tập tiếng Việt nếu có, kiểm tra luật "self-promotion" trước. Nhiều subreddit yêu cầu tài khoản có lịch sử đóng góp; đừng lập tài khoản mới chỉ để đăng.
- **Quora / hỏi đáp kiểu "Hỏi đáp" trên Facebook, Hoidap247…**: chỉ trả lời câu đã có người hỏi.

**Nguyên tắc trả lời:** trả lời đầy đủ trước, như thể không có công cụ nào; nhắc công cụ đúng một lần, kèm "mình làm"; nêu ít nhất một lựa chọn khác không phải của mình.

### Câu trả lời mẫu 1: "Chạy SmartPLS ở đâu miễn phí?"

> SmartPLS là phần mềm trả phí; trang chủ smartpls.com có chương trình dùng thử, điều kiện cụ thể bạn xem trên đó vì họ thay đổi theo phiên bản. Mình khuyên đừng dùng bản crack: vừa rủi ro mã độc, vừa khó giải thích nếu hội đồng hỏi phần mềm.
>
> Lựa chọn miễn phí và hợp pháp:
> 1. **R + gói seminr hoặc cSEM**: đủ outer loadings, CR, AVE, HTMT, bootstrap. Phải viết code nhưng ví dụ trong tài liệu gói khá dễ theo.
> 2. **Công cụ trên trình duyệt**: mình có làm một trang miễn phí chạy PLS-SEM với mặc định giống SmartPLS (https://gocnghiencuu.com/cong-cu/pls-sem/), ra loadings, alpha, rho_A, CR, AVE, HTMT, hệ số đường dẫn, bootstrap 5.000 mẫu, R², f², Q², SRMR, PLSpredict, xuất Word. Chưa có MGA, PLSc.
>
> Dùng gì thì cũng nên chạy thử dữ liệu mẫu trên hai phần mềm và so kết quả ở lần đầu. Khi báo cáo, ghi rõ phần mềm, số mẫu bootstrap và ngưỡng theo Hair và cộng sự (2019) là đủ để hội đồng chấp nhận.

### Câu trả lời mẫu 2: "Tính Cronbach's alpha online được không?"

> Được, và cũng có thể tự tính bằng Excel nếu thang đo ít biến: α = k/(k−1) × (1 − tổng phương sai từng biến / phương sai điểm tổng), với k là số biến quan sát, phương sai tính theo mẫu (chia n−1) như SPSS.
>
> Nhưng trong khoá luận, chỉ alpha là chưa đủ; bạn cần bảng Item-Total Statistics, gồm tương quan biến–tổng hiệu chỉnh (thường yêu cầu ≥ 0,3) và alpha nếu loại biến. Alpha từ 0,7 thường được chấp nhận (Nunnally, 1978), trên 0,95 có thể là các câu trùng ý. Nếu một biến có tương quan biến–tổng âm, gần như chắc chắn là câu đảo chiều chưa mã hoá lại.
>
> Không có SPSS thì JASP và jamovi đều miễn phí và có Reliability Analysis. Còn nếu muốn dán thẳng từ Excel/Google Forms, mình có làm một công cụ miễn phí: https://gocnghiencuu.com/cong-cu/cronbach-alpha/ , tự gom biến theo mã (HL1, HL2…), ra bảng như SPSS, có omega và khoảng tin cậy, xuất Word. Dữ liệu xử lý trên máy bạn, không gửi lên đâu.

### Câu trả lời mẫu 3: "Cỡ mẫu PLS-SEM tối thiểu bao nhiêu?"

> Đừng dùng quy tắc "10 lần số mũi tên" nữa; Hair và cộng sự (2022) khuyên dùng phương pháp căn bậc hai nghịch đảo của Kock và Hadaya (2018). Cỡ mẫu tối thiểu phụ thuộc vào hệ số đường dẫn nhỏ nhất bạn kỳ vọng có ý nghĩa: ở mức 5%, đường dẫn khoảng 0,11–0,20 cần khoảng 155 quan sát, khoảng 0,21–0,30 cần khoảng 69. Không có nghiên cứu trước để ước lượng thì giữ mức 0,20 (155), cộng thêm 10–20% phiếu hỏng.
>
> Trong chương 3, ghi đủ: phương pháp, mức ý nghĩa, power, hệ số nhỏ nhất, cỡ mẫu tối thiểu và nguồn. Nếu mô hình có biến điều tiết, cỡ mẫu cần lớn hơn nhiều vì hiệu ứng tương tác thường rất nhỏ.
>
> Mình có làm một máy tính cỡ mẫu miễn phí có sẵn bảng của Hair và đoạn văn chương 3 kèm trích dẫn: https://gocnghiencuu.com/cong-cu/tinh-co-mau/

---

## 5. Kịch bản TikTok / Reels (quay màn hình, 30–45 giây)

Chuẩn bị chung: quay trên Chrome máy tính, phóng to 125% cho chữ dễ đọc, tắt tab khác và thông báo. Dùng dữ liệu mẫu của công cụ, không dùng dữ liệu thật của ai. Phụ đề chữ to; giọng nói tự nhiên, xưng "mình". Caption mỗi video: "Web mình tự làm, miễn phí, link ở bio." Đặt link https://gocnghiencuu.com/ ở bio trước khi đăng.

### Video 1: "PLS-SEM không cần SmartPLS" (≈ 40 giây)

| Giây | Màn hình | Lời / chữ trên màn hình |
|---|---|---|
| 0–2 | Bảng HTMT và hệ số đường dẫn đã chạy xong (cảnh cuối, chiếu trước) | "Chạy PLS-SEM mà không cần SmartPLS?" |
| 2–7 | Mở gocnghiencuu.com/cong-cu/pls-sem/ | "Web miễn phí mình làm, chạy ngay trên trình duyệt." |
| 7–12 | Mục 1: bấm **Dùng dữ liệu mẫu (300 phiếu)** | "Bạn tải file Excel của mình lên, mình dùng dữ liệu mẫu cho nhanh." |
| 12–18 | Mục 2 hiện các khái niệm đã tự nhóm; mục 3 hiện các đường X -> Y | "Nó tự nhóm biến theo tên cột. Mũi tên giả thuyết gõ ở đây, hoặc lấy từ công cụ vẽ mô hình." |
| 18–22 | Chọn **Số mẫu bootstrap: 5.000**, bấm **Chạy PLS-SEM** | "Bootstrap 5.000 mẫu, bấm chạy." |
| 22–34 | Cuộn qua bảng outer loadings, CR/AVE, HTMT, hệ số đường dẫn và p | "Loadings, CR, AVE, HTMT, hệ số đường dẫn, R², f², Q²: đủ cho chương 4." |
| 34–40 | Bấm **Tải Word**, mở file | "Tải Word có sẵn bảng và đoạn văn. Link ở bio." |

### Video 2: "Cronbach's alpha trong 20 giây" (≈ 35 giây)

| Giây | Màn hình | Lời / chữ trên màn hình |
|---|---|---|
| 0–2 | Bảng Item-Total Statistics | "Không có SPSS vẫn ra bảng này." |
| 2–6 | Mở gocnghiencuu.com/cong-cu/cronbach-alpha/ | "Dán từ Excel hay Google Forms là xong." |
| 6–10 | Bấm **Mẫu: cả bảng hỏi** (hoặc dán dữ liệu từ Excel vào ô Dữ liệu) | "Mình dùng dữ liệu mẫu." |
| 10–14 | Bấm **Tính độ tin cậy** | "Nó tự gom HL1, HL2… thành một thang đo." |
| 14–24 | Cuộn bảng tổng hợp, chỉ vào tương quan biến–tổng và alpha nếu loại biến | "Alpha, tương quan biến–tổng, alpha nếu loại biến, giống SPSS." |
| 24–30 | Bấm **Loại** ở một biến yếu → kết quả hiện lần 1 và lần 2 | "Loại biến yếu, nó ghi cả lần 1 và lần 2 như luận văn hay trình bày." |
| 30–35 | Bấm **Tải file Word** | "Có cả đoạn văn kèm trích dẫn. Link ở bio." |

### Video 3: "Vẽ mô hình nghiên cứu, tự ra giả thuyết" (≈ 35 giây)

| Giây | Màn hình | Lời / chữ trên màn hình |
|---|---|---|
| 0–2 | Mô hình TAM vẽ xong, mũi tên có nhãn H1, H2 | "Đừng vẽ mô hình bằng Word nữa." |
| 2–6 | Mở gocnghiencuu.com/cong-cu/ve-mo-hinh/ | "Web miễn phí mình làm." |
| 6–10 | Bấm **Nạp ví dụ TAM** | "Bấm một cái là có mô hình mẫu." |
| 10–18 | Gõ một khái niệm vào ô thư viện (ví dụ "niềm tin"), kéo vào khung; kéo chấm tròn bên phải ô sang ô ý định để nối | "Thêm khái niệm từ thư viện, kéo chấm tròn để nối mũi tên." |
| 18–24 | Bấm nhãn +/− trên mũi tên để đổi chiều | "Tác động ngược chiều thì bấm vào đây." |
| 24–30 | Bấm **Chép giả thuyết**, dán vào Word | "Giả thuyết H1, H2… viết sẵn." |
| 30–35 | Bấm **PNG** | "Tải hình chèn vào luận văn. Link ở bio." |

Quay xong xem lại từng cảnh: nút nào đổi tên hay đổi vị trí so với kịch bản thì sửa lời theo màn hình thật.

---

## 6. Backlink hợp lệ

Chỉ xin link ở nơi link tới công cụ miễn phí thật sự giúp người đọc. Không mua link, không trao đổi link, không đăng bài khách chỉ để chèn link, không spam bình luận blog.

**Loại trang nên nhắm:**
- Trang hướng dẫn nghiên cứu của thư viện đại học (mục "Hướng dẫn nghiên cứu", "Tài nguyên mở", "Công cụ hỗ trợ trích dẫn", LibGuides). Công cụ APA 7 và thư viện thang đo hợp nhất ở đây.
- Trang tài nguyên/đề cương môn Phương pháp nghiên cứu của giảng viên (site cá nhân, Google Sites, trang bộ môn).
- Trang CLB NCKH, CLB học thuật (mục tài liệu, bài "công cụ hữu ích cho NCKH"). Danh sách tổ chức đã xác minh kênh liên hệ có trong `docs/outreach/targets.csv`, mẫu tin nhắn trong `docs/outreach/messages.md` (nhớ đổi link `growth547.github.io/goc-nghien-cuu` thành `gocnghiencuu.com`).
- Phòng Quản lý khoa học, trang hướng dẫn Eureka/NCKH sinh viên cấp trường.
- Bài tổng hợp "công cụ miễn phí cho sinh viên" của blog giáo dục, trang tài nguyên mở.
- Danh mục dự án mã nguồn mở / công cụ thống kê miễn phí (nếu kho GitHub công khai).

**Email mẫu gửi giảng viên / thư viện** (gửi tới email công vụ đã công bố, mỗi người một lần, nhắc lại tối đa một lần sau 7 ngày):

> **Tiêu đề:** Đề xuất bổ sung công cụ miễn phí vào trang tài nguyên Phương pháp nghiên cứu
>
> Kính gửi Thầy/Cô [Tên] (hoặc: Kính gửi Thư viện [Tên trường]),
>
> Em là [Tên], người làm trang Góc Nghiên Cứu (https://gocnghiencuu.com/), bộ công cụ miễn phí cho sinh viên làm nghiên cứu định lượng: trích dẫn APA 7 (đúng tên tác giả Việt, có văn bản pháp luật), tính cỡ mẫu, Cronbach's alpha, PLS-SEM và thư viện 60 thang đo có nguồn gốc. Công cụ không cần tài khoản, dữ liệu xử lý trên trình duyệt.
>
> Em thấy trang [tên trang tài nguyên] của Thầy/Cô có danh sách công cụ cho sinh viên. Nếu Thầy/Cô thấy phù hợp, mong Thầy/Cô cân nhắc bổ sung. Em rất mong nhận góp ý nếu Thầy/Cô thấy chỗ nào chưa chính xác về phương pháp.
>
> Em cảm ơn Thầy/Cô đã dành thời gian.
>
> Trân trọng,
> [Tên] – [email liên hệ]

---

## 7. Lịch 7 ngày (31/10 – 06/11/2026)

Threads đã được lên lịch tự động lúc 20:30 mỗi ngày (riêng 05/11 lúc 12:15) theo `docs/social/lich-14-ngay.md`; lịch dưới chỉ tham chiếu, không đăng lại nội dung Threads ở nơi khác. Khung giờ Facebook nhóm gợi ý: 11:30–13:00 hoặc 19:30–21:30 (giả thuyết, cần đo).

| Ngày | Threads (đã lên lịch) | Facebook nhóm | Nội dung dài / video | Diễn đàn, hỏi đáp | Việc khác |
|---|---|---|---|---|---|
| T7 31/10 | 20:30 ra mắt trang | 2 nhóm NCKH, biến thể 2A | Quay sẵn video 1 (PLS-SEM) | — | Cập nhật bio TikTok/Facebook có link. Ghi số liệu nền (mục đo lường) |
| CN 01/11 | 20:30 tổng hợp 5 công cụ | 2 nhóm khoá luận, biến thể 2B | Đăng TikTok video 1 (tối) | 1–2 câu trả lời (mẫu 1) ở thớt có sẵn | Trả lời toàn bộ bình luận hôm trước |
| T2 02/11 | 20:30 "Hội đồng hỏi" số 1 | 2 nhóm SPSS/SmartPLS, biến thể 2C | Đăng bài Spiderum (sáng) | — | Ghi lỗi/góp ý nhận được vào GitHub issues |
| T3 03/11 | 20:30 poll "kẹt ở khâu nào" | 1–2 nhóm trường đại học (đã xin phép admin nếu cần), 2C | Đăng TikTok video 2 (Cronbach) | 1–2 câu trả lời (mẫu 2) | Gửi 3–5 email backlink (mục 6) |
| T4 04/11 | 20:30 cheat sheet KMO–Bartlett | 2 nhóm theo ngành (marketing/QTKD/tài chính), 2B viết lại | Trả lời bình luận Spiderum | 1 thớt VOZ dạng chia sẻ kinh nghiệm hoặc 1 bài Tinh tế | — |
| T5 05/11 | 12:15 "p không bao giờ bằng 0" | Không đăng nhóm mới; quay lại các bài cũ trả lời bình luận, báo lỗi đã sửa | Đăng TikTok video 3 (vẽ mô hình) | 1–2 câu trả lời (mẫu 3) | Gửi thêm 3–5 email backlink |
| T6 06/11 | 20:30 AI và trích dẫn bịa | 1–2 nhóm còn lại, biến thể khác nhóm đó chưa thấy | — | — | Tổng kết tuần: kênh nào ra lượt truy cập và góp ý thật, quyết định tuần sau |

### Đo gì và đo bằng gì

**Tình trạng analytics (cập nhật 31/10/2026):** GA4 đã bật (`G-FXE0951K7Y`, khai báo `gaMeasurementId` trong `astro-paper.config.ts`, thẻ ở `src/layouts/Layout.astro`). `page_view` gửi ở mỗi `astro:page-load` (cả lần tải đầu lẫn khi chuyển trang bằng ClientRouter). Ngoài ra có Google Search Console (đã xác minh) và Bing Webmaster.

**Sự kiện GA4 tự đặt** (gửi bằng `transport_type: "beacon"` để không mất khi bấm link rời trang; không có thông tin cá nhân, không gửi nội dung dữ liệu người dùng dán hay tải lên):

| Sự kiện | Tham số | Khi nào gửi | Nguồn |
|---|---|---|---|
| `tool_run` | `tool` (slug trang, vd `pls-sem`, `cronbach-alpha`) | Công cụ có nút chạy (id kết thúc `-run`: PLS-SEM, Cronbach, phân tích dữ liệu, làm sạch, bác sĩ kết quả, trung gian–điều tiết, APA, chỉ số tài chính): mỗi lần bấm nút. Công cụ tự tính khi nhập (tính cỡ mẫu, vẽ mô hình, bộ khảo sát, chọn phương pháp): một lần mỗi lượt xem trang, ở thao tác đầu tiên. Đây là lượt bấm chạy, kể cả khi dữ liệu lỗi. | `src/scripts/track.ts` |
| `export` | `tool`, `format` (`docx`, `csv`, `sps`, `png`, `svg`, `ris`, `bibtex`, `google_form`, `gdf`, `link`, `copy`) | Bấm nút tải hoặc sao chép kết quả trong công cụ (theo id nút trong `src/tools/*.html`) | `src/scripts/track.ts` |
| `share_click` | `channel` (`facebook`, `messenger`, `zalo`, `copy`, `webshare`) | Bấm nút trong thanh "Gửi cho bạn cùng nhóm" ở trang công cụ và bài viết | `src/components/ShareBar.astro` |
| `feedback_click` | `tool` | Bấm "Gửi góp ý" dưới thanh chia sẻ ở trang công cụ (mở issue GitHub theo mẫu `.github/ISSUE_TEMPLATE/gop-y-cong-cu.md`, điền sẵn link trang) | `src/scripts/track.ts` |
| `affiliate_click` | `placement` (`data-placement` của link, nếu không có thì `utm_content`, nếu không có thì đường dẫn trang), `link_domain` | Bấm bất kỳ link `rel="sponsored"` nào (link giới thiệu Genius Data) | `src/scripts/track.ts` |

Link chia sẻ từ thanh chia sẻ mang `utm_source=share&utm_medium=<kênh>`, nên lượt vào từ link bạn bè gửi nhau hiện trong GA4 ở Nguồn/Phương tiện `share / zalo`, `share / facebook`…

Cách xem: GA4 → Báo cáo → Tương tác → Sự kiện (số lần mỗi sự kiện); muốn xem theo `tool`, `format`, `channel`, `placement` thì vào Quản trị → Định nghĩa tuỳ chỉnh → tạo chiều tuỳ chỉnh phạm vi sự kiện cho từng tham số (chỉ có dữ liệu từ lúc tạo). Kiểm tra nhanh: Quản trị → DebugView, hoặc Báo cáo → Thời gian thực. Nên đánh dấu `tool_run` và `share_click` là sự kiện chính (key event) để so kênh.

Còn thiếu: chưa có thông báo cookie; nên ghi ở `/about/` hoặc chân trang rằng trang dùng GA4 để đếm lượt truy cập.


**Link có UTM** (chỉ có ích khi đã gắn analytics; không gắn UTM vào link affiliate):

```
https://gocnghiencuu.com/?utm_source=facebook&utm_medium=group&utm_content=<loai-nhom>-<ngay>
https://gocnghiencuu.com/cong-cu/pls-sem/?utm_source=spiderum&utm_medium=article
https://gocnghiencuu.com/?utm_source=tiktok&utm_medium=bio
https://gocnghiencuu.com/?utm_source=voz&utm_medium=forum
```

Nhóm Facebook đôi khi coi link dài có tham số là spam; khi đó dùng link gọn không UTM.

| Chỉ số | Cách đo | Ghi khi nào |
|---|---|---|
| Lượt truy cập theo nguồn | Analytics (nếu đã gắn): referral facebook.com, l.facebook.com, spiderum.com, tiktok.com, voz.vn, tinhte.vn; tham số UTM | Mỗi tối |
| Trang công cụ được mở nhiều nhất | Analytics: trang `/cong-cu/*` theo nguồn | Cuối tuần |
| Tìm kiếm thương hiệu | Search Console: truy vấn "góc nghiên cứu", "gocnghiencuu"; lượt hiển thị trang chủ và `/cong-cu/` | 03/11 và 06/11 (GSC trễ 2–3 ngày) |
| Phản hồi trên bài | Đếm tay: bình luận, câu hỏi, lượt chia sẻ, bài bị từ chối, mỗi nhóm một dòng | Mỗi tối |
| Video | Lượt xem, thời gian xem trung bình, lượt bấm vào hồ sơ (TikTok Analytics) | 48 giờ sau mỗi video |
| Spiderum | Lượt xem, upvote, bình luận | 02/11 và 06/11 |
| Góp ý sản phẩm | Lỗi, lệch kết quả so với SPSS/SmartPLS, tính năng được xin (CFA, MGA…), ghi vào GitHub issues | Khi nhận |
| Backlink | Email đã gửi, trả lời, trang đã thêm link; Search Console → Liên kết (cập nhật chậm) | 06/11 |

Không đặt mục tiêu số cứng cho tuần đầu vì chưa có dữ liệu nền. Mục tiêu của tuần là biết kênh nào ra người dùng thật (có câu hỏi, có góp ý) để tuần sau dồn sức vào đó.
