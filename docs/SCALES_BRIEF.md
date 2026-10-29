# Brief: Thư viện thang đo (Góc Nghiên Cứu)

Mỗi thang đo là một file `src/content/thang-do/<slug>.json`. Mẫu chuẩn: `src/content/thang-do/tam.json`. Đọc kỹ file đó và làm giống cấu trúc, độ dài, giọng văn.

Kiểm tra trước khi báo xong: `node scripts/check-scales.mjs <slug> [<slug>...]` phải in `ok`.

## Quy tắc quan trọng nhất: không bịa

Người đọc sẽ chép nguyên các biến quan sát vào luận văn. Một biến sai chữ hoặc gán sai tác giả là lỗi nghiêm trọng.

1. **Câu chữ tiếng Anh của từng biến phải khớp nguồn gốc.** Dùng WebSearch/WebFetch để tìm bài gốc hoặc bản tái bản đáng tin (trang của tác giả, trang nhà xuất bản, PMC/PubMed Central, trang chính thức của thang đo, tài liệu của trường đại học trích nguyên văn, phụ lục của bài báo có DOI). Ghi các URL bạn **thực sự đã mở và đối chiếu** vào `verifiedFrom`.
2. Nếu không đối chiếu được nguyên văn cho một thang đo, **không tạo file**. Ghi vào báo cáo cuối: tên thang đo, lý do.
3. Nếu bài gốc không công bố đủ biến (chỉ ví dụ vài biến), chỉ đưa những biến đã thấy, và ghi rõ trong `source` của khái niệm, ví dụ "Taylor & Todd (1995), 3 biến minh hoạ".
4. Trích dẫn trong `references` theo APA 7, có DOI khi có. Không bịa số trang, số tập, DOI. Không chắc thì bỏ phần đó.
5. Câu đảo chiều (reverse-scored) đánh dấu `"reverse": true`.

## Bản quyền

- Chỉ làm thang đo công bố trong bài báo học thuật hoặc tác giả cho phép dùng miễn phí cho nghiên cứu.
- **Không làm** các bộ có bản quyền thương mại phải mua (ví dụ MBI, MLQ, SF-36, bản TCM thương mại của Meyer & Allen). Nếu thang đo được giao thuộc loại này, báo lại thay vì làm.
- Trường `license`: nói ngắn gọn điều kiện sử dụng mà bạn tìm được (ví dụ "miễn phí cho nghiên cứu phi thương mại, theo trang của tác giả"). Không suy đoán.

## Nội dung tiếng Việt

- `vi`: dịch tự nhiên, rõ nghĩa, giữ đúng ý biến gốc; giữ placeholder dạng `[hệ thống]`, `[thương hiệu]`, `[công ty]`, `[dịch vụ]` khi bản gốc có đối tượng cụ thể.
- `title` ≤ 70 ký tự, bắt đầu bằng "Thang đo …", chứa từ khoá sinh viên hay tìm (ví dụ "Thang đo UTAUT2 tiếng Việt: Venkatesh và cộng sự (2012)").
- `description` 110–170 ký tự.
- `intro`: 3–5 câu, nói mô hình/thang đo đo cái gì, ai đề xuất, dùng cho đề tài kiểu gì ở Việt Nam.
- `usage`: 3–5 lưu ý thực tế (cách điều chỉnh, lỗi hay gặp khi dịch, kiểm định nên chạy).
- `sampleSize`: `arrowsMax` = số mũi tên nhiều nhất trỏ vào một biến trong mô hình gốc (bỏ trường này nếu là thang đo đơn lẻ, không phải mô hình); `note` 1–2 câu. Mốc power G*Power (f² = 0,15, α = 5%, power 0,80) theo số biến dự báo: 1 → 55, 2 → 68, 3 → 77, 4 → 85, 5 → 92, 6 → 98, 7 → 103, 8 → 109.
- `related`: 2–3 slug thang đo liên quan trong danh sách dưới.
- `field`: một trong: "Công nghệ & hệ thống thông tin", "Hành vi người tiêu dùng", "Chất lượng dịch vụ", "Marketing & thương hiệu", "Quản trị nhân sự & tổ chức", "Tâm lý & sức khoẻ tinh thần".
- Giọng văn thẳng, cụ thể. Không dùng gạch ngang dài (—), không "Trong thời đại…", "không chỉ… mà còn…", không emoji. Không nhắc tới Genius Data.

## Danh sách slug (dùng đúng slug)

tam (đã có), utaut, utaut2, ecm-tiep-tuc-su-dung, niem-tin-thuong-mai-dien-tu, rui-ro-cam-nhan, tpb, y-dinh-mua, mua-hang-ngau-hung, gia-tri-cam-nhan-perval, niem-tin-trung-thanh-thuong-hieu, servqual, servperf, e-s-qual, y-dinh-hanh-vi-khach-hang, tai-san-thuong-hieu, hai-long-cong-viec, gan-ket-cong-viec-uwes, y-dinh-nghi-viec, ho-tro-to-chuc-pos, hanh-vi-cong-dan-to-chuc, cam-ket-to-chuc-ocq, hai-long-cuoc-song-swls, cang-thang-pss-10, tu-trong-rosenberg, tu-hieu-qua-gse, tinh-cach-bfi-10, chanh-niem-maas
