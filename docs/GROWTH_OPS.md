# Vận hành tăng trưởng Góc Nghiên Cứu

Mục tiêu: 1.000 lượt truy cập trong tuần ra mắt (31/10–06/11/2026), sau đó tăng đều mỗi tuần; kéo người dùng mới cho Genius Data qua link giới thiệu có ghi rõ (ref `lab-web`, `lab-blog`, `lab-tool`).

## Ai làm gì

| Mảng | Người/agent phụ trách | Lịch | Đầu ra | Kiểm tra |
|---|---|---|---|---|
| Thang đo | Tác vụ "tự thêm thang đo mỗi giờ" | Mỗi giờ, phút 23 | Tối đa 3 thang đo/giờ, nguyên văn từ nguồn mở | check-scales, CI, IndexNow |
| Bài SEO | Tác vụ "viết 2 bài SEO mỗi ngày" | 9:16 hằng ngày | 2 bài theo docs/CONTENT_BACKLOG.md | DOI qua Crossref, check-seo, CI |
| Bảo trì, dữ liệu, SEO theo Search Console | Tác vụ "quét, sửa, làm mới dữ liệu và tối ưu SEO" | T2, T5 6:13 | Sửa lỗi crawl, +5 chỉ số dữ liệu, tối ưu tối đa 8 trang CTR thấp, yêu cầu index | check-data, check-seo, docs/qa/gsc-weekly.md |
| Threads | Tác vụ đăng bài tối (20:31) và trưa (12:15) | Đến 27/11 | Đúng bài trong docs/social/lich-14-ngay*.md; nháp trả lời bình luận | So từng phần với file trước khi đăng |
| Đánh giá tăng trưởng | Tác vụ "đánh giá tăng trưởng hằng ngày" | 22:15 hằng ngày | docs/qa/growth-daily.md; chỉnh câu mở 3 bài Threads sắp tới theo bài nào chạy tốt | Chỉ đọc GA/Threads, không đăng |
| Reels | Agent dựng video, phiên chính đăng | 1 video/ngày | docs/launch/reels/ | Xem lại khung hình trước khi đăng |
| Facebook Page | Tác vụ một lần 9:30 ngày 31/10, sau đó phiên chính | Một lần, sau đó 1 bài/ngày | Page "Góc Nghiên Cứu" liên kết Instagram | Không tạo trùng |
| Nhóm Facebook, Spiderum, diễn đàn | Chủ site, từ tài khoản thật | 2 nhóm/ngày | Bài trong docs/launch/ra-mat.md | Đọc luật nhóm trước |

## Chỉ số theo dõi mỗi ngày

- GA4: người dùng, phiên, nguồn (threads, share, instagram, facebook, organic), sự kiện tool_run, export, share_click, affiliate_click.
- Threads: lượt xem, thích, trả lời, đăng lại, chia sẻ của từng bài; người theo dõi.
- Search Console (khi có dữ liệu): lượt hiển thị, nhấp, CTR, trang được index.
- Genius Data: lượt bấm link giới thiệu theo vị trí (affiliate_click).

## Vòng cải tiến

1. Mỗi tối: đánh giá bài Threads và nguồn traffic trong ngày, ghi vào docs/qa/growth-daily.md.
2. Kiểu bài nào có lượt chia sẻ/đăng lại cao nhất thì viết thêm theo kiểu đó; kiểu nào dưới trung bình hai lần liên tiếp thì thay.
3. Trang nào có nhiều người vào nhưng ít tool_run thì sửa phần đầu trang và nút bấm.
4. Vị trí giới thiệu Genius Data nào có affiliate_click cao thì giữ, vị trí bằng 0 sau 7 ngày thì xem lại ngữ cảnh.

## Luật chung

Không nhân vật giả, không đánh giá giả, không quảng cáo trá hình (Genius Data luôn ghi "đối tác giới thiệu"), không tự bình luận ngay sau khi đăng, không gửi tin nhắn cho người lạ khi chủ site chưa duyệt.
