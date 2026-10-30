# Nguồn dữ liệu BCTC ngân hàng niêm yết: nhật ký rà soát từng ngân hàng

Dùng cho bộ dữ liệu thí điểm `/du-lieu/ngan-hang-niem-yet/` (dữ liệu: `src/data/ngan-hang-niem-yet/`, kiểm tra:
`scripts/check-bank-data.mjs`). Khung pháp lý chung: `docs/FIRM_DATA_LEGAL.md`.

Ngày rà soát: 30/10/2026. Người thực hiện: ban biên tập Góc Nghiên Cứu (có hỗ trợ của Claude).

## Quy tắc

1. Chỉ dùng tệp PDF BCTC hợp nhất đã kiểm toán do **chính ngân hàng** đăng trên website quan hệ nhà đầu tư. Không dùng
   trang tổng hợp (CafeF, Vietstock, FiinGroup, VNDIRECT, SSI), cổng HOSE, HNX, UBCKNN, bản sao, bộ nhớ đệm hay nơi lưu
   PDF của bên thứ ba.
2. Trước khi tải bất cứ tệp nào, mở và ghi lại điều khoản sử dụng website và `robots.txt` của ngân hàng. Loại ngân hàng
   nếu điều khoản cấm truy cập tự động, tải về, hoặc tái sử dụng/phân phối lại nội dung, hoặc `robots.txt` chặn đường dẫn
   chứa BCTC.
3. Tải bằng `curl` với user agent mặc định của curl (không giả trình duyệt), tuần tự, cách nhau ít nhất 3 giây. Không
   vượt captcha hay trang kiểm tra bot. Trang danh mục tài liệu được mở bằng trình duyệt như người dùng thường.
4. Không đăng lại tệp PDF. Trang web chỉ đăng các con số (không thuộc đối tượng bảo hộ quyền tác giả, khoản 3 Điều 15
   Luật SHTT) kèm đường link về tệp gốc, số trang, và cho phép ngân hàng yêu cầu gỡ.

## Ngân hàng đã dùng

### VCB – Vietcombank (HOSE)

- Trang nguồn: <https://www.vietcombank.com.vn/vi-VN/Nha-dau-tu/Chi-tiet-nha-dau-tu> → "Báo cáo định kỳ" → "Báo cáo Tài
  chính", chọn năm.
- `robots.txt` (<https://www.vietcombank.com.vn/robots.txt>):
  ```
  User-agent: *
  Allow: /
  ```
- Điều khoản: không có trang điều khoản sử dụng website (đã tìm ở chân trang, sitemap 4,8 MB không có trang nào chứa
  "dieu-khoan" cho website). Chân trang chỉ ghi: "© 2023 Bản quyền thuộc về Ngân hàng TMCP Ngoại thương Việt Nam
  (Vietcombank)". Câu bản quyền chung không cấm trích số liệu (số liệu không có quyền tác giả); không đăng lại PDF.
- Kết luận: **dùng**.
- Tệp (đường dẫn dưới `https://www.vietcombank.com.vn/-/media/Project/VCB-Sites/VCB/Nha-Dau-tu/`):
  2015 `Files-Migrate/3-Bao-cao-tai-chinh/2015/NHAT20DA20KIEM20TOAN20NAM202015.pdf`;
  2016 `.../2016/Bao20cao20tai20chinh20hop20nhat20201620da20kiem20toan.pdf`;
  2018 `.../2018/BCTC20hop20nhat20da20kiem20toan20201820v2.pdf`; 2019, 2020, 2021 (tên tệp mã hoá trong thư mục
  `Files-Migrate/3-Bao-cao-tai-chinh/<năm>/`); 2022 `.../2022/2022-CN-HN.pdf`;
  2023 `Files/BC-dinh-ky/BCTC/2023/20240329---VCB---BCTC-hop-nhat-kiem-toan-2023.pdf`;
  2024 `Files/BC-dinh-ky/BCTC/2024/VCB-31122024---FS-Conso---VIE.pdf`;
  2025 `Files/BC-dinh-ky/BCTC/2025/20260327---VCB---BCTC-hop-nhat-kiem-toan-nam-2025.pdf`.
  Website không có BCTC hợp nhất kiểm toán năm 2017 (chỉ có BCTC quý 2017); số năm 2017 lấy từ cột so sánh của BCTC
  2018. Đường link đầy đủ của từng giá trị nằm trong cột `source_url` của file CSV.
- Đặc điểm tệp: bản scan có chữ ký (không có lớp chữ, trừ 2019 có lớp OCR chất lượng thấp nên vẫn xử lý như bản scan).

### CTG – VietinBank (HOSE)

- Trang nguồn: <https://investor.vietinbank.vn/vi/financialreports.aspx> (chuyển tới `download.aspx`).
- `robots.txt` (<https://investor.vietinbank.vn/robots.txt>):
  ```
  User-Agent: *
  Disallow:
  ```
  (`https://www.vietinbank.vn/robots.txt` chỉ chặn `/admin`, `/api`, `/draft`.)
- Điều khoản: không tìm thấy trang điều khoản sử dụng website ở chân trang của vietinbank.vn và investor.vietinbank.vn
  (tìm thêm qua công cụ tìm kiếm chỉ ra điều khoản dịch vụ iPay, iPOS, không phải điều khoản website). Chân trang:
  "© 2025 - Bản quyền thuộc về Ngân Hàng TMCP Công Thương Việt Nam".
- Kết luận: **dùng**.
- Tệp: BCTC hợp nhất kiểm toán 2023, 2024, 2025 (trang đầu của danh mục). Các năm trước nằm ở các trang sau của danh
  mục, chưa tải trong đợt thí điểm; số năm 2022 lấy từ cột so sánh của BCTC 2023. Bản scan.

### TCB – Techcombank (HOSE)

- Trang nguồn: <https://techcombank.com/nha-dau-tu/thong-tin-tai-chinh/bao-cao-tai-chinh-vas>. Danh mục do trang tự
  nạp từ `https://techcombank.com/graphql/execute.json/techcombank/viewDocumentList;cfPath=/content/dam/techcombank/master-data/vi/list-view-document/bao-cao-tai-chinh-vas/`
  (một yêu cầu GET công khai, không tham số chữ ký, không bị `robots.txt` chặn; đã tải đúng một lần để đọc danh mục).
- `robots.txt` (<https://techcombank.com/robots.txt>), các dòng chặn:
  ```
  User-agent: *
  Disallow: /ve-chung-toi/phap-ly-va-tuan-thu/*
  Disallow: /thong-tin/phap-ly-va-tuan-thu/*
  Disallow: /thong-tin/archive/*
  Disallow: /mang-luoi-dia-diem-atm/*
  ...
  ```
  Không chặn `/nha-dau-tu/` hay `/content/dam/` (nơi chứa PDF).
- Điều khoản: chân trang có "Bản quyền © 2026 thuộc về Ngân hàng Thương mại cổ phần Kỹ thương Việt Nam" và liên kết
  "Điều khoản & Điều kiện" dẫn tới trang biểu phí, biểu mẫu, điều khoản sản phẩm cho khách hàng (không phải điều khoản
  sử dụng website). Trang "Pháp lý và tuân thủ" (mở bằng trình duyệt, không cào) chỉ đăng thông báo đấu giá, thu giữ tài
  sản bảo đảm. Không có điều khoản cấm truy cập tự động hay tái sử dụng.
- Kết luận: **dùng**.
- Tệp: 2015–2019 bản "đã kiểm toán" (scan); 2020–2025 "Hợp nhất (Bản tra cứu)" có lớp chữ (đường dẫn trong
  `source_url`). Techcombank đăng thêm bản ký và đóng dấu; bản tra cứu có cùng nội dung và cho phép đối chiếu lớp chữ
  với OCR.

## Ngân hàng bị loại

### BID – BIDV

- `robots.txt` (<https://bidv.com.vn/robots.txt>): chặn `/wps/portal/*`, `/wps/myportal/*` và một đường dẫn wcmrest;
  không chặn `/wps/wcm/connect/` (nơi chứa PDF).
- Điều khoản sử dụng (<https://bidv.com.vn/vn/dieu-khoan-su-dung>, mục "Bản quyền và thương hiệu"):
  > "Không ai được thay đổi, xoá, huỷ, giả mạo, sao chép, tiết lộ, hiển thị, di chuyển trái phép, sử dụng vì các mục
  > đích thương mại hay công cộng bất kỳ một phần hoặc toàn bộ những tài liệu này mà nếu không được BIDV chấp thuận
  > trước bằng văn bản. Việc sử dụng này là hợp pháp nếu đáp ứng đầy đủ các tiêu chí sau: - cho chính mục đích giao
  > dịch với BIDV, - khi sử dụng phải trích dẫn nguồn và giữ nguyên dường dẫn đến tài liệu gốc…"
- Kết luận: **loại**. Điều khoản cấm sử dụng cho mục đích công cộng bất kỳ phần nào của tài liệu khi chưa có chấp thuận
  bằng văn bản; dùng hợp pháp chỉ khi "cho chính mục đích giao dịch với BIDV". Không tải tệp nào. Muốn đưa vào: gửi thư
  xin chấp thuận tới bộ phận quan hệ nhà đầu tư, lưu thư trả lời vào `docs/`.

### MBB – MB

- `robots.txt` (<https://www.mbbank.com.vn/robots.txt>):
  ```
  User-agent: ClaudeBot
  Disallow: /
  User-agent: GPTBot
  Disallow: /
  User-agent: Google-Extended
  Disallow: /
  ... (Amazonbot, Applebot-Extended, Bytespider, CCBot, meta-externalagent)
  User-agent: *
  Allow: /
  ```
- Kết luận: **loại**. MB chặn rõ các tác tử AI, trong đó có ClaudeBot. Dù việc tải do người biên tập chỉ đạo và dùng
  user agent mặc định của curl, bộ dữ liệu được dựng với sự hỗ trợ của Claude nên tôn trọng ý định của MB và không tải
  tệp nào. Chưa đọc điều khoản website vì đã đủ căn cứ loại.

## Chưa rà soát xong (chưa tải gì)

- **VPB – VPBank**: `robots.txt` chỉ chặn `/en/bi-kip-va-chia-se/` và `/bai-viet/`; chân trang trang báo cáo tài chính
  chỉ có "Bản quyền © 2026 thuộc về Ngân hàng TMCP Việt Nam Thịnh Vượng" và "Chính sách bảo mật"; trang
  `/ve-chung-toi/kiem-soat-tuan-thu/terms-vn` là hợp đồng dịch vụ VPBank Mobile, không phải điều khoản website. Danh
  mục BCTC chọn năm bằng điều khiển chưa thao tác được trong đợt này. Ứng viên đợt sau.
- **ACB**: `robots.txt` cho phép `/` (chỉ chặn `/*undefined`, `/*-landing-page`); chưa tìm thấy điều khoản website ở
  trang `/nha-dau-tu`. Ứng viên đợt sau.
- HDB, STB, SHB, LPB, VIB, TPB, MSB, SSB, OCB, EIB, NAB, BAB, ABB, VAB, KLB, BVB, PGB, SGB, VBB, NVB: chưa rà soát.

## Trích xuất và kiểm tra (tóm tắt)

- Lượt 1 và lượt 2 độc lập: tệp có lớp chữ → lớp chữ PDF (PyMuPDF) và OCR ảnh trang (RapidOCR, 170 dpi); tệp scan →
  OCR 170 dpi ảnh màu và OCR 230 dpi ảnh xám. Một giá trị chỉ được giữ khi hai lượt cho cùng một số. Hai lượt OCR
  dùng chung một công cụ nên giá trị từ tệp scan còn phải nằm trong một đẳng thức kế toán đã khớp hoặc khớp cột so
  sánh của BCTC năm sau. BCTC 2025 của VCB (trang PDF 8–9) và CTG (trang 8, 9, 11) được đọc lại bằng mắt làm lượt
  thứ ba vì chưa có BCTC năm sau.
- Kết quả đợt thí điểm (30/10/2026): 928 giá trị đăng, 93 giá trị gắn cờ không đăng, 144 trường hợp BCTC năm sau
  trình bày lại số năm trước (giữ số gốc, ghi số trình bày lại trong cột `restated_in_next_report`). Tỷ lệ nợ xấu mới
  có cho TCB 2019–2025 (2019 và 2022 lấy từ cột so sánh của BCTC năm sau, vì bảng phân loại nợ trong BCTC 2022 gộp cả
  cho vay ký quỹ nên tổng không khớp); VCB và CTG chưa trích thuyết minh. CAR chưa trích (không nằm trong BCTC kiểm toán).
- Kiểm tra kế toán trên từng cột, đối chiếu cột so sánh của BCTC năm sau, ghi nhận trình bày lại: xem phần "Cách trích
  và kiểm tra" trên trang và `scripts/check-bank-data.mjs`.
- Công cụ trích xuất chạy ngoài kho mã (thư mục làm việc tạm); kết quả đã kiểm tra được ghi vào
  `src/data/ngan-hang-niem-yet/values.json`. Giá trị bị gắn cờ: `review.json` (chỉ ghi mã khoản mục và lý do, không
  ghi số).
