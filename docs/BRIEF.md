# Brief cho người viết bài — Góc Nghiên Cứu (by Genius Data)

Microsite nội dung tiếng Việt, do Genius Data vận hành (ghi rõ ở chân trang). Mục tiêu: xếp hạng Google cho các câu sinh viên/học viên hay tìm, và dẫn người đọc về geniusdata.io. Bài phải **thật sự hữu ích** dù người đọc không bao giờ dùng Genius Data.

## Định dạng file

Mỗi bài là một file `content/posts/<slug>.html`:

```
<!--
{"title":"Tiêu đề ≤ 65 ký tự, chứa từ khoá chính",
 "description":"Mô tả 140–160 ký tự cho Google",
 "date":"2026-10-29",
 "audience":"researcher",
 "keyword":"từ khoá chính",
 "readingMinutes":7}
-->
<p>Mở bài…</p>
<h2>…</h2>
…
{{CTA}}
…
```

- `audience`: `researcher` (người cần thu mẫu) hoặc `respondent` (người đi làm khảo sát).
- Thân bài chỉ dùng thẻ: `p h2 h3 ul ol li table thead tbody tr th td blockquote strong em a code`. Không `h1` (layout tự thêm), không CSS, không ảnh, không emoji.
- Đặt `{{CTA}}` đúng **một lần**, ở khoảng 2/3 bài, nơi người đọc vừa thấy vấn đề và muốn giải pháp. Layout sẽ thay bằng hộp kêu gọi hành động.
- Link nội bộ dạng root-relative: `/bai-viet/<slug>/`, `/cong-cu/tinh-co-mau/`, `/cong-cu/cronbach-alpha/`. Mỗi bài nên link 2–3 bài/công cụ khác trong danh sách dưới.
- Không link trực tiếp tới geniusdata.io trong thân bài (hộp CTA lo việc đó).
- Độ dài 1.000–1.600 từ. Có ít nhất một bảng hoặc danh sách kiểm tra dùng được ngay.

## Danh sách bài (slug — từ khoá)

1. `cach-thu-mau-khao-sat-khoa-luan` — cách thu mẫu khảo sát khoá luận
2. `co-mau-nghien-cuu-bao-nhieu-la-du` — cỡ mẫu nghiên cứu bao nhiêu là đủ
3. `thang-do-likert` — thang đo Likert 5 mức, 7 mức
4. `cronbach-alpha-la-gi` — Cronbach's alpha là gì, cách đọc kết quả
5. `cach-loc-phieu-khao-sat-khong-hop-le` — cách lọc phiếu khảo sát không hợp lệ
6. `phat-hien-cau-tra-loi-khao-sat-do-ai-viet` — phát hiện câu trả lời khảo sát do AI viết
7. `khao-sat-kiem-tien-uy-tin` — khảo sát kiếm tiền uy tín (bài cho đáp viên)
8. `cach-thiet-ke-bang-hoi` — cách thiết kế bảng hỏi khảo sát

Công cụ có trên site: `/cong-cu/tinh-co-mau/` (Cochran, Slovin/Yamane, quy tắc EFA của Hair, hồi quy của Tabachnick & Fidell), `/cong-cu/cronbach-alpha/` (dán dữ liệu, ra alpha, tương quan biến–tổng, alpha nếu loại biến).

## Sự thật về Genius Data (chỉ được dùng những điều này, không bịa thêm)

- Nền tảng kết nối người cần khảo sát (sinh viên làm khoá luận, học viên cao học, giảng viên, doanh nghiệp) với cộng đồng người trả lời.
- Người tạo khảo sát chọn nhóm đối tượng mục tiêu, tự đặt mức thưởng mỗi câu: tối thiểu 0,15 GP/câu, gợi ý 0,4 GP/câu. 1 GP = 1.100 đ (đã gồm VAT). Ví dụ trên trang giá: form 15 câu × 0,4 GP = 6 GP/phản hồi; 200 phản hồi ≈ 1.320.000 đ.
- **Chỉ trả cho phản hồi được duyệt.**
- Có câu gạn lọc (screening, chọn đáp án bị loại thì kết thúc form, không tính thưởng) và câu kiểm tra chất lượng (attention check), mỗi loại miễn phí tới 3 câu/form.
- Theo dõi tiến độ thu mẫu.
- Hệ thống tự chấm chất lượng từng phản hồi: phát hiện điền bừa/rập khuôn, các câu trả lời trong cùng phiếu mâu thuẫn nhau, và câu trả lời tự luận có dấu hiệu do AI viết. Phiếu đáng ngờ bị gắn cờ; với câu tự luận quá sơ sài, đáp viên được gợi ý viết lại. **Chỉ mô tả ở mức này, không nêu thuật toán, ngưỡng, hay tín hiệu cụ thể** (đang làm hồ sơ sở hữu trí tuệ).
- Đáp viên tự chọn khảo sát phù hợp, làm lúc nào cũng được, tích GTOKEN từ khảo sát hợp lệ, dùng GTOKEN cho nhiều nhu cầu trong hệ sinh thái (đổi quà, voucher).
- Website đã thông báo với Bộ Công Thương. Email: hi@geniusdata.io.

## Giọng văn

- Viết như một người làm nghiên cứu có kinh nghiệm nói chuyện với sinh viên: thẳng, cụ thể, có ví dụ số liệu.
- Tránh văn AI: không "Trong thời đại…", "Hãy cùng tìm hiểu", "Tóm lại", "không chỉ… mà còn…", không câu kiểu "X không phải là A, mà là B", không gạch ngang chèn ý, không liệt kê ba tính từ.
- Trích dẫn học thuật phải đúng và có thật (ví dụ Cochran 1977; Yamane 1967; Hair và cộng sự 2010; Tabachnick & Fidell 2013; Nunnally 1978; Likert 1932). Không bịa số liệu thống kê hay khảo sát nào. Không biết chắc thì đừng viết.
- Nhắc Genius Data tối đa 1–2 lần trong thân bài, đúng chỗ, như một trong các lựa chọn. Bài 7 phải công bằng: đưa tiêu chí nhận biết trang uy tín/lừa đảo mà người đọc dùng được với bất kỳ trang nào, và ghi rõ site này do Genius Data vận hành khi nhắc tới nó.
