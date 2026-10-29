# Đợt 1: Threads và nhóm Facebook

Nguyên tắc:
- Đăng từ tài khoản "Góc Nghiên Cứu", không dùng nick giả, không tự khen.
- Mỗi bài cho người đọc giá trị ngay trong bài, link chỉ để ở cuối hoặc trong bình luận đầu.
- Không nhắc Genius Data trong bài đăng mạng xã hội. Link về Genius Data chỉ nằm trong bài trên site.
- Nhóm Facebook nên đăng: các nhóm SPSS, AMOS, SmartPLS, "làm khoá luận", "nghiên cứu khoa học sinh viên". Đọc luật nhóm trước, nhóm cấm link thì đăng nội dung và để link khi có người hỏi.

UTM cho link trên mạng xã hội: thêm `?utm_source=threads` hoặc `?utm_source=facebook&utm_content=<tên nhóm>` vào link trang.

---

## Bài 1 (Threads, chuỗi) — hook: câu hội đồng

**1/** Câu hội đồng hỏi nhiều nhất về chương 3: "Vì sao em chọn cỡ mẫu này?"
Trả lời "dạ theo Slovin" khi bạn chạy PLS-SEM là tự mở thêm 3 câu hỏi nữa.

**2/** Cỡ mẫu đi theo phương pháp phân tích chính, không theo công thức quen tay.
• Ước lượng tỉ lệ: Cochran
• EFA: số biến quan sát × 5 hoặc × 10 (Hair)
• Hồi quy, PLS-SEM: phân tích power (G*Power)

**3/** Ví dụ PLS-SEM: cấu trúc có nhiều mũi tên trỏ vào nhất có 5 mũi tên, f² = 0,15, α = 0,05, power 80% → tối thiểu 92.
Kiểm tra thêm theo Kock & Hadaya (2018), hệ số đường dẫn nhỏ nhất 0,2 → 155.
Lấy số lớn hơn, cộng 15% dự phòng phiếu loại.

**4/** Mình làm một máy tính miễn phí làm đúng các bước trên, và viết luôn đoạn chương 3 có trích dẫn APA để bạn dán vào bài:
https://growth547.github.io/goc-nghien-cuu/cong-cu/tinh-co-mau/?utm_source=threads&utm_content=dot1-hook

---

## Bài 2 (Threads, đơn) — danh sách 8 câu

8 câu hội đồng hay hỏi về phần khảo sát:
1. Vì sao cỡ mẫu là con số này?
2. Mẫu thuận tiện có đại diện không?
3. Thang đo lấy ở đâu, dịch thế nào?
4. Sao alpha chỉ 0,65?
5. Loại bao nhiêu phiếu, theo tiêu chí gì?
6. Sao biết không phải một người làm nhiều lần?
7. Có kiểm tra common method bias không?
8. Sao chọn PLS-SEM mà không phải AMOS?

Câu nào bạn chưa trả lời được trong một câu nói thì đó là chỗ cần sửa chương 3. Câu trả lời mẫu kèm trích dẫn ở đây:
https://growth547.github.io/goc-nghien-cuu/posts/hoi-dong-hoi-gi-ve-phan-khao-sat/?utm_source=threads&utm_content=dot1-8cau

---

## Bài 3 (Facebook nhóm SmartPLS/SPSS) — dài, giá trị trong bài

Tiêu đề: [Chia sẻ] Cách trả lời câu "common method bias" khi bảo vệ (PLS-SEM)

Khi mọi biến đều do cùng một người tự trả lời trong một bảng hỏi, hội đồng hay hỏi về sai lệch do phương pháp chung. Trả lời hai lớp:

1) Biện pháp thủ tục (Podsakoff và cộng sự, 2003): ẩn danh, trộn thứ tự câu, tách biến độc lập và phụ thuộc ra các phần khác nhau của bảng hỏi.

2) Kiểm định thống kê: trong PLS-SEM dùng full collinearity, mọi VIF ≤ 3,3 là ổn (Kock, 2015). Harman một nhân tố vẫn hay dùng nhưng bị coi là yếu, chỉ nên để bổ sung.

Câu "Sao chọn PLS-SEM?" thì đừng chỉ nói "vì mẫu nhỏ", hội đồng sẽ hỏi tiếp ngay chuyện power.

Mình tổng hợp 8 câu hay gặp kèm câu trả lời mẫu và tài liệu tham khảo, ai cần thì để link dưới bình luận.

(Bình luận đầu: link bài 8 câu, utm_source=facebook)

---

## Bài 4 (Threads, đơn) — thư viện thang đo

Tìm thang đo TAM, UTAUT2, TPB, SERVQUAL mà chỉ thấy bản dịch chép qua nhiều đời, sai cả mã biến?
Mình gom 21 thang đo hay dùng: câu gốc tiếng Anh, bản tiếng Việt tham khảo, nguồn trích dẫn, link kiểm chứng tới bài gốc.
https://growth547.github.io/goc-nghien-cuu/thang-do/?utm_source=threads&utm_content=dot1-thangdo

---

## Bài 5 (Threads, đơn) — Cronbach

Cronbach's alpha 0,65, bỏ câu nào?
Đừng nhìn mỗi alpha tổng. Xem 2 cột:
• Corrected Item-Total Correlation < 0,3 → ứng viên loại
• Alpha if Item Deleted cao hơn alpha hiện tại → loại thì tăng
Nhưng loại câu phải giữ được nội dung của khái niệm, không phải loại cho đẹp số.
Dán dữ liệu từ Excel, ra đủ 3 cột trong 2 giây, không cần SPSS:
https://growth547.github.io/goc-nghien-cuu/cong-cu/cronbach-alpha/?utm_source=threads&utm_content=dot1-alpha

---

## Lịch đăng gợi ý

| Ngày | Kênh | Bài |
|---|---|---|
| T2 20:00 | Threads | Bài 1 (chuỗi) |
| T3 20:00 | 2 nhóm Facebook | Bài 3 |
| T4 20:00 | Threads | Bài 5 |
| T5 20:00 | Threads | Bài 2 |
| T6 20:00 | Threads | Bài 4 |

Sau 7 ngày đọc số: lượt vào trang theo utm_source, và `GET /affiliate/channel-stats` cho lượt đăng ký `lab-*`. Bài nào kéo người nhiều nhất thì đợt 2 viết thêm cùng dạng.
