# Dữ liệu cấp doanh nghiệp: rà soát pháp lý trước khi xây dữ liệu

Ngày rà soát: 30/10/2026. Người rà soát: ban biên tập Góc Nghiên Cứu (có hỗ trợ của Claude).
Phạm vi: có được trích số liệu báo cáo tài chính (BCTC) của doanh nghiệp niêm yết để xây một bộ dữ liệu công khai
(trang web + CSV) hay không, và lấy từ nguồn nào.

Đây là ghi chú nội bộ, không phải ý kiến tư vấn pháp lý. Trích dẫn điều khoản của doanh nghiệp được giữ ngắn,
phần còn lại tóm tắt; văn bản quy phạm pháp luật được trích nguyên văn (không thuộc đối tượng bảo hộ quyền tác giả,
khoản 2 Điều 15 Luật SHTT).

Trong suốt bước này **không cào (scrape) trang nào**. Chỉ mở trang điều khoản, chân trang và `robots.txt` bằng tay
hoặc bằng trình duyệt, không vượt captcha hay trang kiểm tra bot (trang thuvienphapluat.vn hiện trang kiểm tra
Cloudflare nên đã bỏ qua, dùng bản hợp nhất trên datafiles.chinhphu.vn thay thế).

## 1. Khung pháp luật

### 1.1. Số liệu không được bảo hộ quyền tác giả; sưu tập dữ liệu thì có

Luật Sở hữu trí tuệ số 50/2005/QH11, bản hợp nhất 155/VBHN-VPQH (2025),
<https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/9/155-vbhn-vpqh.pdf>. Đã đối chiếu thêm với dự thảo bản hợp nhất
2026 (sau Luật số 131/2025/QH15), <https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/10/160-vbhn-vpqh.signed.pdf>:
hai điều dưới đây không đổi, Điều 15 chỉ được bổ sung khoản 4.

- Điều 15, khoản 3, các đối tượng **không** thuộc phạm vi bảo hộ quyền tác giả:
  > "3. Quy trình, hệ thống, phương pháp hoạt động, khái niệm, nguyên lý, số liệu."
- Điều 22, khoản 2:
  > "Sưu tập dữ liệu là tập hợp có tính sáng tạo thể hiện ở sự tuyển chọn, sắp xếp các tư liệu dưới dạng điện tử
  > hoặc dạng khác. Việc bảo hộ quyền tác giả đối với sưu tập dữ liệu không bao hàm chính các tư liệu đó, không gây
  > phương hại đến quyền tác giả của chính tư liệu đó."

Hệ quả: từng con số trong BCTC (tổng tài sản, lợi nhuận…) là số liệu, không ai giữ quyền tác giả. Nhưng
**cách một trang tổng hợp chọn và sắp xếp** số liệu (cơ sở dữ liệu của CafeF, Vietstock, FiinGroup…) có thể là sưu
tập dữ liệu được bảo hộ; và độc lập với quyền tác giả, **điều khoản sử dụng** (hợp đồng) của trang đó vẫn ràng buộc
người dùng đã truy cập. Vì vậy câu hỏi quyết định không phải "số liệu có bản quyền không" mà là "nguồn mình lấy cho
phép gì".

### 1.2. Doanh nghiệp niêm yết phải công khai BCTC kiểm toán

Thông tư 96/2020/TT-BTC hướng dẫn công bố thông tin trên thị trường chứng khoán (hiệu lực 01/01/2021; đã sửa đổi bởi
Thông tư 68/2024/TT-BTC và các thông tư sau; bản gốc đọc tại
<https://mbs.com.vn/files/uploads/2025/04/96_2020_tt-btc_huong-dan-cbtt-tren-ttck.pdf>, số hiệu và ngày ban hành
khớp bản trên vbpl.vn):

- Điều 10 khoản 1: công ty đại chúng phải công bố BCTC năm đã kiểm toán, "bao gồm đầy đủ các báo cáo, phụ lục, thuyết
  minh", trong 10 ngày kể từ ngày ký báo cáo kiểm toán, không quá 90 ngày sau khi kết thúc năm tài chính.
- Điều 7 khoản 1: phương tiện công bố gồm "a) Trang thông tin điện tử (website) của tổ chức là đối tượng công bố
  thông tin; b) Hệ thống công bố thông tin của Ủy ban Chứng khoán Nhà nước; c) Trang thông tin điện tử của Sở giao dịch
  chứng khoán…".
- Điều 7 khoản 2 điểm c, d: website của doanh nghiệp phải có chuyên mục quan hệ cổ đông chứa các thông tin công bố định
  kỳ, và "phải đảm bảo nhà đầu tư có thể tìm kiếm và tiếp cận được các dữ liệu".
- Điều 4 khoản 5 điểm a: thông tin công bố định kỳ phải "được lưu giữ và truy cập được trên trang thông tin điện tử
  của đối tượng công bố thông tin tối thiểu là 05 năm".
- Điều 14: tổ chức niêm yết còn phải công bố BCTC bán niên (soát xét) và BCTC quý.

Hệ quả: nguồn gốc gần nhất và chính danh nhất của số liệu BCTC là **website quan hệ nhà đầu tư của chính doanh
nghiệp**; Sở giao dịch và UBCKNN là kênh nhận và đăng lại. Thông tư quy định nghĩa vụ công khai để nhà đầu tư tiếp cận,
nhưng **không** quy định giấy phép cho bên thứ ba tái phân phối hàng loạt.

### 1.3. Chế độ kế toán dùng để định nghĩa biến

Thông tư 200/2014/TT-BTC (chế độ kế toán doanh nghiệp) và Thông tư 49/2014/TT-BNHNN (sửa đổi Hệ thống tài khoản kế
toán các tổ chức tín dụng; mẫu BCTC tổ chức tín dụng theo Quyết định 16/2007/QĐ-NHNN và các văn bản sửa đổi) dùng để
gọi tên chỉ tiêu BCTC trong thư viện biến. Đây là văn bản quy phạm pháp luật nên dùng tên chỉ tiêu, mã số không vướng
quyền tác giả.

## 2. Điều khoản của từng nguồn

| Nguồn | Điều khoản tìm được (ngày đọc 30/10/2026) | robots.txt | Kết luận |
|---|---|---|---|
| **FiinGroup** (fiingroup.vn, FiinPro, FiinTrade) | "Điều khoản và Điều kiện sử dụng website" sửa đổi lần 1, hiệu lực 01/01/2026, <https://fiingroup.vn/Data/pdf/FG/FGVN-Dieu-khoan-va-Dieu-kien-VIE.pdf>. Mục 4: nội dung "không được phép sao chép, truyền tải hoặc phân phối" khi chưa có đồng ý bằng văn bản. Mục 5: chỉ cấp giấy phép giới hạn "cho mục đích cá nhân". | Allow / | **KHÔNG DÙNG** |
| **Vietstock / VietstockFinance** | "Điều khoản sử dụng", sửa đổi 28/10/2020, <https://finance.vietstock.vn/dieu-khoan-su-dung>. Mục 1.2 cấm dùng Dịch vụ "để xây dựng cơ sở dữ liệu dưới bất kỳ hình thức nào", cấm chuyển nội dung trích xuất cho bên thứ ba, và cấm "sử dụng bất kỳ phương thức tự động nào" để thu thập. Quyền truy cập không dùng cho mục đích thương mại. | Chặn `/export` | **KHÔNG DÙNG** |
| **VNDIRECT** (dstock, vndirect.com.vn) | "Điều khoản sử dụng", <https://dautu.vndirect.com.vn/dieu-khoan-su-dung/>. Mục 1: dữ liệu giá, số liệu "đều đã được đăng ký bản quyền"; phân tán lại khi chưa có chấp thuận bằng văn bản "là trái phép"; chỉ dùng cho mục đích cá nhân. | (không có tệp) | **KHÔNG DÙNG** |
| **SSI / SSI iBoard** | "Điều khoản và Chính sách dịch vụ iBoard", <https://www.ssi.com.vn/khach-hang-ca-nhan/dieu-khoan-va-chinh-sach-iboard>. Trừ tải về, in để dùng cá nhân, người dùng "không được phép sao chép, dẫn liên kết, phân phối" nội dung. | Disallow trống | **KHÔNG DÙNG** |
| **CafeF** (VCCorp) | Không tìm thấy trang điều khoản sử dụng công khai; chân trang chỉ có "© Copyright 2007 - 2026 - Công ty Cổ phần VCCorp" và chính sách bảo mật (<https://cafef.vn/static/chinh-sach-bao-mat.html>). Trang dữ liệu ghi số liệu "được tổng hợp từ các nguồn". Không có giấy phép tái sử dụng ⇒ mặc định mọi quyền được bảo lưu với phần sưu tập dữ liệu. | Allow / | **KHÔNG DÙNG** (không có cho phép; bản thân CafeF cũng chỉ là nguồn thứ cấp) |
| **HOSE** (hsx.vn) | Không có trang điều khoản sử dụng hay câu bản quyền ở chân trang. Trang "Giới thiệu dịch vụ cung cấp thông tin" (<https://www.hsx.vn/vi/dich-vu/cung-cap-thong-tin>, 26/03/2024) cho thấy HOSE **bán** gói "Thông tin công bố" của doanh nghiệp niêm yết, kể cả cho tổ chức muốn "phân phối lại cho người dùng", kèm biểu giá. | `Disallow:` trống | Xem, tải từng BCTC để đối chiếu: được. Lấy hàng loạt để phân phối lại: **không** (đó là sản phẩm HOSE bán theo hợp đồng). |
| **HNX** (hnx.vn) | Chân trang: "© 2016 Bản quyển thuộc Sở Giao dịch Chứng khoán Hà Nội", có mục "Dịch vụ cung cấp thông tin" (bán dữ liệu). Không có điều khoản sử dụng hay giấy phép mở. | Không có tệp (404) | Như HOSE. |
| **UBCKNN** (ssc.gov.vn, congbothongtin.ssc.gov.vn) | Cổng thông tin cơ quan nhà nước; chân trang chỉ có số giấy phép 300/GP-BC, không có điều khoản tái sử dụng hay giấy phép dữ liệu mở. | Không có tệp (404) | Không có cho phép tường minh để tái phân phối; dùng để tra cứu, dẫn link. |
| **Website IR của doanh nghiệp** (nguồn gốc theo Điều 7 TT96) | Mỗi doanh nghiệp một điều khoản khác nhau. Ví dụ đã đọc qua: Agribank yêu cầu trích dẫn, dẫn về tài liệu gốc; NAPAS coi việc phân phối hoặc tạo sản phẩm phái sinh từ nội dung web khi chưa có chấp thuận là xâm phạm. Vietcombank không hiển thị điều khoản ở chân trang. Chưa rà đủ 27 ngân hàng. | Tuỳ trang | Có thể dùng **từng con số** (Điều 15.3) kèm trích dẫn; dựng cả bộ dữ liệu công khai thì phải rà và lưu điều khoản của **từng** doanh nghiệp, hoặc xin chấp thuận. |

## 3. Kết luận

1. **Các trang tổng hợp đều bị loại**, bất kể kỹ thuật có lấy được hay không: FiinGroup, Vietstock, VNDIRECT, SSI cấm
   rõ việc sao chép, phân phối, xây cơ sở dữ liệu hoặc thu thập tự động; CafeF không cấp bất kỳ quyền tái sử dụng nào.
   Trang web không được tải, cào hay hướng dẫn sinh viên cào dữ liệu từ các nguồn này.
2. **Sở giao dịch và UBCKNN** không có giấy phép mở; HOSE, HNX còn bán chính gói "thông tin công bố" để phân phối lại.
   Dùng các cổng này để **tra cứu và dẫn link** tới BCTC gốc thì được; tải hàng loạt để dựng bộ dữ liệu công khai thì
   không.
3. **Số liệu BCTC tự thân không có quyền tác giả** (Điều 15.3 Luật SHTT) và doanh nghiệp buộc phải công khai trên
   website của mình (Điều 7, Điều 10 TT96). Một con số được trích tay từ BCTC kiểm toán, ghi rõ nguồn (URL tệp + trang),
   là cách dùng hợp pháp, đúng thông lệ trích dẫn trong khoá luận.
4. **Không có nguồn nào mà điều khoản cho phép tường minh** việc dựng và phát hành lại một bộ dữ liệu cấp doanh nghiệp.
   Theo điều kiện của đề bài ("chỉ làm khi bước 1 tìm được nguồn có điều khoản cho phép"), **bước 4 (bộ dữ liệu thí điểm
   27 ngân hàng) bị hoãn**. Muốn làm sau này cần một trong hai: (a) rà, lưu bản chụp điều khoản website của từng ngân
   hàng và chỉ dùng ngân hàng không cấm; hoặc (b) xin chấp thuận bằng văn bản (email bộ phận IR), lưu thư trả lời trong
   `docs/`.
5. Những gì **hợp pháp bất kể kết luận trên** và đã làm: thư viện định nghĩa biến (`/bien-nghien-cuu/`, chỉ là công thức
   và trích dẫn học thuật) và công cụ tính chỉ số (`/cong-cu/tinh-chi-so-tai-chinh/`): sinh viên tự nhập số từ BCTC mình
   tải về, công cụ chạy trong trình duyệt, không gửi số liệu đi đâu, trang web không lưu hay phát hành lại số liệu.

## 4. Hướng dẫn cho sinh viên (đưa vào trang công cụ)

- Lấy BCTC kiểm toán từ mục "Quan hệ cổ đông / Nhà đầu tư" trên website doanh nghiệp, hoặc tra từ HOSE, HNX, UBCKNN và
  bấm sang tệp gốc. Ghi lại URL tệp và số trang của từng chỉ tiêu.
- Không dùng số liệu tải từ CafeF, Vietstock, FiinPro, VNDIRECT, SSI để **phát hành lại** (đăng kèm khoá luận lên mạng,
  chia sẻ file). Nếu trường có thuê bao FiinPro hay VietstockFinance, chỉ dùng trong phạm vi hợp đồng của trường và ghi
  nguồn đúng tên dịch vụ.
- Trong chương 3 nêu rõ: nguồn (BCTC hợp nhất hay riêng, đã kiểm toán), giai đoạn, cách xử lý năm tài chính đổi kỳ, và
  các chỉ tiêu đã điều chỉnh.
