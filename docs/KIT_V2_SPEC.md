# Bộ khảo sát v2: đặc tả

Nguồn: 3 phiên đóng vai người dùng (sinh viên năm cuối dùng điện thoại, học viên cao học dùng SmartPLS, giảng viên hướng dẫn), nghiên cứu nhu cầu tìm kiếm và đối thủ, thống kê khái niệm trong khoảng 80 nghiên cứu Việt Nam (30/10/2026). Không có công cụ tiếng Việt nào sinh bảng hỏi từ thang đo gốc có trích dẫn: đây là khoảng trống mình chiếm.

Mục tiêu: sinh viên làm xong bảng hỏi có thể nộp giảng viên duyệt mà không bị gạch đỏ vì lỗi của công cụ, và dựng được Google Form trong vài phút.

## P0: lỗi làm hỏng dữ liệu hoặc bị gạch đỏ ngay

1. **Mã câu kiểm tra chú ý** đổi thành `AC1` (nếu trùng mã nào trong bảng hỏi thì `ACHK`). Không bao giờ trùng mã. Thêm kiểm tra trùng mã toàn bảng hỏi; trùng thì tự thêm tiền tố khái niệm.
2. **Câu kiểm tra chú ý** chỉ đặt trong một khối dùng thang đồng ý Likert, gần giữa phiếu, không đặt giữa các câu đảo chiều; ghi rõ mức: `chọn mức "2 – Không đồng ý"`. Không có khối đồng ý nào thì thành câu riêng có 5 lựa chọn đồng ý.
3. **Mọi khối đều có ô chọn.**
   - Thang đồng ý: theo lựa chọn 5/7 mức hoặc số mức gốc.
   - Thang tần suất, mức độ đúng, khả năng: lấy số mức và nhãn từ `responseScale` (các cặp `số = nhãn`, hoặc "N mức", hoặc khoảng `a–b`); cột ghi số, chú giải ghi nhãn.
   - Thang hai đầu mút (biến dạng "Tính từ A – Tính từ B" hoặc có "(… … …)"): hai cột tính từ ở hai bên, giữa là 1…k.
   - Không bao giờ in ghi chú biên tập (`responseScale` dài, "trang đối chiếu… không ghi…", "5 hoặc 7 mức") lên phiếu cho người trả lời. Ghi chú đó hiện riêng cho sinh viên ở khu cài đặt.
4. **Thang hỗn hợp** (ví dụ UWES 0–6 cạnh Likert): chương 3 nêu đúng thang của từng khái niệm, và ghi rõ mọi chỗ đã đổi so với bản gốc (ví dụ "điều chỉnh từ 7 mức của bản gốc sang Likert 5 mức").
5. **Đối tượng khảo sát** là lựa chọn bắt buộc: Người tiêu dùng / người dùng; Người lao động; Sinh viên. Lựa chọn này quyết định:
   - **Câu sàng lọc mặc định**, sửa được trong ô văn bản; không ghi đè khi người dùng đã sửa.
     - Tiêu dùng: "đã từng sử dụng/mua {đối tượng} trong [6 tháng] qua?"
     - Lao động: "hiện đang làm việc tại {công ty} từ [6 tháng] trở lên?"
     - Sinh viên: "hiện là sinh viên [trường/ngành]?"
   - **Xưng hô**: Anh/Chị cho người đi làm và người tiêu dùng, Bạn cho sinh viên. Câu tự thuật giữ "tôi". Nếu thang gốc dùng "anh/chị" trong câu hỏi, thay theo xưng hô đã chọn.
   - **Bộ nhân khẩu học**, chọn từng câu, không có "Dưới 18":
     - Sinh viên: giới tính, năm học, ngành/khối ngành, trường (tự điền), chi tiêu hằng tháng (Dưới 2 triệu, 2–4, 4–6, Trên 6 triệu), tần suất liên quan đề tài.
     - Lao động: giới tính, độ tuổi (18–25, 26–35, 36–45, Trên 45), trình độ, thâm niên (Dưới 1 năm, 1–3, 3–5, Trên 5), chức vụ (Nhân viên, Trưởng nhóm/Quản lý cấp trung, Quản lý cấp cao), loại hình doanh nghiệp, thu nhập (Dưới 10 triệu, 10–20, 20–30, Trên 30).
     - Tiêu dùng: giới tính, độ tuổi (18–24, 25–34, 35–44, 45–54, Từ 55), nghề nghiệp (Học sinh/sinh viên, Nhân viên văn phòng, Công chức/viên chức, Công nhân, Kinh doanh tự do/chủ doanh nghiệp, Nội trợ/hưu trí, Khác), học vấn (THCS trở xuống, THPT, Cao đẳng/Trung cấp, Đại học, Sau đại học), thu nhập (Chưa có thu nhập, Dưới 5 triệu, 5–10, 10–20, 20–30, Trên 30), tần suất sử dụng/mua.
6. **Số mũi tên**: không tự ghi đè khi người dùng đã nhập. Chỉ nhận số nguyên ≥ 1. Dự phòng phiếu loại giới hạn 0–50%. Giải thích rõ hơn bằng một câu kèm ví dụ. Ghi rõ Kock & Hadaya (p_min = 0,2) không phụ thuộc số mũi tên, và vì sao chọn 0,2.
7. **"này này"**: sau khi thay chỗ trống, gộp "này này" thành "này" (sửa ở cả `fillPlaceholders` trong `src/tools/bo-khao-sat.html` và `src/utils/kit.ts`). Ví dụ trong ô chỗ trống phải đúng loại từ: [thực hiện hành vi] là cụm động từ, [công ty] là tên tổ chức…
8. **Chương 3 không khẳng định điều chưa làm.**
   - Dịch xuôi – dịch ngược, khảo sát thử, tham vấn chuyên gia viết dạng điều kiện trong ngoặc vuông, ví dụ "[Nếu đã thực hiện:] Thang đo được dịch xuôi và dịch ngược…".
   - Bỏ "đã được kiểm định trong các nghiên cứu trước". Thay bằng "kế thừa từ".
   - Thêm đoạn sai lệch phương pháp chung (biện pháp thủ tục, Podsakoff và cộng sự, 2003) và kế hoạch khảo sát thử, đều trong ngoặc vuông.
   - Thêm **Bảng mã hoá thang đo** ngay trong đoạn chương 3, cột: Khái niệm | Mã | Biến quan sát | Câu gốc (tiếng Anh) | Nguồn | Kế thừa/điều chỉnh.

## P1: để dùng được ngay

9. **Bỏ hoặc sửa từng câu**: trong khu "Câu hỏi đã chọn", mỗi biến có ô tick giữ/bỏ và nút sửa câu chữ. Câu đã sửa đánh dấu "điều chỉnh" trong bảng mã hoá và chương 3. Cảnh báo khi một khái niệm còn dưới 3 biến.
10. **Thứ tự khái niệm**: danh sách đã chọn có nút lên/xuống; mặc định biến phụ thuộc (khái niệm được nhiều mũi tên trỏ vào, hoặc người dùng đánh dấu) xếp cuối. Giữ thứ tự câu gốc trong mỗi thang.
11. **Xuất Google Forms**: nút "Tạo Google Form" sinh một đoạn Google Apps Script (FormApp) và hướng dẫn 4 bước: script.google.com → dán → Chạy → cấp quyền. Script tạo:
    - tiêu đề và lời mở đầu;
    - phần sàng lọc, có điều hướng "Chưa từng" tới cuối form (submit);
    - mỗi khái niệm một phần, dùng GridItem (hàng = phát biểu kèm mã, cột = mức), bắt buộc trả lời;
    - câu kiểm tra chú ý trong lưới tương ứng;
    - phần nhân khẩu học dạng MultipleChoice;
    - liên kết với Google Sheets nếu được.
    Tên hàng bắt đầu bằng mã biến để cột xuất ra khớp với SPSS. Ghi rõ dữ liệu không đi qua máy chủ của mình.
12. **Bảng mã hoá** (CSV, nhãn nút ghi rõ "CSV, mở bằng Excel"): thêm dòng câu sàng lọc, AC1 (đáp án đúng), nhân khẩu học (nhãn giá trị 1 = …), cột Đảo điểm đúng, cột Điều chỉnh.
13. **File Word**: tiêu đề "PHỤ LỤC 1. PHIẾU KHẢO SÁT"; khổ A4 và lề (`@page`); có các trường Trường/Khoa, thông tin liên hệ người thực hiện, Mã phiếu; câu tham gia tự nguyện, có thể dừng bất cứ lúc nào; đánh số "Câu n" xuyên suốt, kể cả nhân khẩu học; hướng dẫn cách đánh dấu; người thực hiện xưng ngôi thứ nhất số ít ("Tôi là…").
14. **Lưu trạng thái** vào URL (`history.replaceState`) và localStorage (bọc try/catch); có nút "Sao chép link".
15. **Cảnh báo phiếu dài**: hơn 15 phút hoặc hơn 60 câu thì báo, kèm gợi ý.
16. **Điện thoại**: không cuộn lồng (danh sách khái niệm cao hơn hoặc mở rộng); thanh "Đã chọn N khái niệm · M câu" dính trên cùng; bảng xem trước bọc trong `overflow-x:auto`; nhãn select không bị cắt chữ; checkbox có tên dễ hiểu cho trình đọc màn hình (aria-label).
17. **Tìm kiếm bớt nhiễu**: khi cụm nhiều từ khớp một cụm đồng nghĩa (ví dụ "niem tin"), không thêm riêng các từ đơn ("tin"); chỉ hiện kết quả có điểm ≥ 40% điểm cao nhất; tối đa 12 kết quả cho mỗi cụm.

## P2: niềm tin

18. Khu thông tin cho sinh viên trên trang: số thang đo đang có, cách kiểm chứng nguồn, công thức cỡ mẫu, link "Checklist trước khi nộp GVHD" (đủ biến phụ thuộc, ≥ 3 biến mỗi khái niệm, Likert đồng chiều, câu sàng lọc khớp đối tượng, khảo sát thử).
19. Trang mẫu bảng hỏi: sửa "6 − điểm" theo số mức thật; "dịch vụ dịch vụ này"; chương 3 rút gọn dùng ngoặc vuông điều kiện; template khởi nghiệp nên chuyển sang EIQ Liñán & Chen (2009) khi thư viện có thang đó.
