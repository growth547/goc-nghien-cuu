# Studio Reels: làm video ngắn 9:16 bằng code

Đầu vào là một kịch bản JSON. Đầu ra là mp4 1080×1920, 30 fps, dưới 10 MB, âm lượng −14 LUFS, kèm ảnh bìa.

Định dạng của loạt video là **"Cú trực đêm"**:

1. Hook: cảnh 2:07 sáng, kèm chữ lớn đập vào mắt.
2. Cú than "Thôi xong…", camera zoom ba nhịp theo tiếng "dun dun dun".
3. Cú nói "Khoan. Để Cú."
4. Demo công cụ thật, quay trên site.
5. Kêu gọi gửi cho bạn, rồi chốt bằng câu "**Một cú là xong!**" kèm logo âm thanh.

Bối cảnh: `audit-2026-10-31.md`, `research-2026-10-31.md`. Nhân vật: `../brand/README.md`.

## Các file
| File | Việc |
|---|---|
| `scripts/video/studio.py` | Pipeline: `capture` (quay site), `voice` (giọng cú), `render` (dựng hình và âm thanh), `frames` (xuất ảnh kiểm tra) |
| `scripts/video/mascot.py` | Rig cú Nghiên: 20 bộ phận SVG, có miệng 4 dáng, mắt, cánh, đầu. `python mascot.py build` để vẽ lại |
| `scripts/video/scene.py` | Cảnh minh hoạ bàn học 2:07 sáng: laptop, đồng hồ, cửa sổ, giấy nhớ, cốc C4 |
| `scripts/video/sound.py` | Logo âm thanh, tiếng "hú-hú", các hiệu ứng tiếng, nhạc nền 100 BPM. Tất cả tự tổng hợp |
| `scripts/video/reels/*.json` | Kịch bản từng video |

## Cài một lần
- **Python 3.12** đã có `playwright`, `pillow`, `numpy`, `imageio-ffmpeg`. Script dùng Chrome đã cài sẵn (`channel="chrome"`).
- **edge-tts** cài riêng ngoài repo:
  ```
  python -m pip install --target C:\Users\Admin\.antigravity\video-studio\pylib edge-tts==7.3.1
  ```
- **Font Be Vietnam Pro** (OFL) đặt ở `C:\Users\Admin\.antigravity\video-studio\assets\fonts`. Font này không có ký tự α, → và ✓, nên đừng dùng chúng trong chữ do studio vẽ.

## Làm một video
```
python scripts/video/studio.py scripts/video/reels/reel-1-pls-sem.json            # cả 3 bước, khoảng 10 phút
python scripts/video/studio.py scripts/video/reels/reel-1-pls-sem.json voice      # chỉ đọc lại giọng
python scripts/video/studio.py scripts/video/reels/reel-1-pls-sem.json frames 0.5 12 30   # ảnh kiểm tra trước khi dựng
python scripts/video/studio.py scripts/video/reels/reel-1-pls-sem.json render
```
- File trung gian nằm ở `video-studio/build/<id>/`, gồm `rec/` (khung quay), `rec.json`, `lines/`, `voice.wav`, `timeline.json` và `stills.png`.
- Thành phẩm ở `docs/launch/reels/<id>.mp4` và `cover-<id>.png` (thư mục này bị gitignore). Caption nằm trong `captions.md`.
- Edge đôi khi không trả âm thanh. Script đợi giữa các câu và thử lại 8 lần.
  - Có câu bị từ chối lần nào cũng vậy, ví dụ cụm "bảy lăm". Khi đó đổi cách nói ("bảy năm chín").

## Kịch bản
### `record`: quay site thật, từng khung một
Khung xem là 400×352, phóng ×2,5 thì ra footage 1000×880. Dùng `scale: 4` khi cần zoom sâu, ví dụ vào sơ đồ.

| Bước | Tác dụng |
|---|---|
| `goto` | Mở trang |
| `clip` | Bắt đầu một đoạn có tên |
| `hold` | Đứng yên vài giây |
| `scroll {to, dur, block}` | Cuộn mượt tới phần tử, có easing |
| `hscroll {sel, x}` | Kéo bảng rộng sang ngang |
| `hl [sel, nhãn]` / `unhl` | Viền cam quanh phần tử, kèm nhãn ✓ |
| `tap sel` hoặc `{sel, click:false}` | Vòng chạm, có bấm thật hoặc không |
| `select` | Chọn trong dropdown |
| `type {sel, text}` | Gõ chữ, mỗi khung vài ký tự |
| `live {seconds \| until}` | Quay liên tục theo thời gian thật trong lúc trang tính toán |
| `read` | Lấy số liệu thật trên trang, ví dụ thời gian chạy bootstrap |

Bộ chọn phần tử là của Playwright, nên dùng được `:has-text()`, `>> nth=0`.

### `beats`: mỗi beat là một cảnh, dài bằng lời nói của nó
- `lines`: các câu cú nói. Mỗi câu có `say`, `rate`, `pitch`, `gap` riêng.
  - `{Hiển thị|cách đọc}` cho thuật ngữ, ví dụ `{HTMT|ếch ti em ti}`.
  - `*từ khoá*` để tô cam trong bong bóng và cho cú co giãn người ở từ đó.
- `layout`:
  - `desk`: cảnh bàn học. Có thêm `alarm`, `zoom: [[giây, mức]]`, `focus`.
  - mặc định: footage trong khung trình duyệt, dùng `clip`, có thể thêm `cam` để zoom/lia trong footage.
  - `end`: màn kết có địa chỉ site, thêm `logo: true` để phát logo âm thanh.
- `owl`: idle, point, wow, panic, tired, smug, happy. `fx`: shock, sweat, sparkle, burst. `enter: true` cho cú nhảy vào.
- `stickers`: `{text, at, pos, style: big|red|orange|ink|green|white, size, rot}`.
- `sfx`: `{name, at, gain}`. Tên lấy từ `sound.SFX`: pop, whoosh, click, ding, bonk, typing, riser, stamp, scratch, dun, hoot, logo.
  - Tiếng click khi chạm, pop khi sticker hiện, whoosh khi chuyển cảnh được tự thêm.
- `music: stop/resume`: dừng nhạc kiểu tape-stop rồi bật lại, dùng cho nhịp hài.
- `stopwatch: true` trên clip có `live`: đồng hồ chạy theo thời gian thật đo trên site, ghi "tua nhanh xN".
- `dur: "auto"` cho beat không có lời.

## Quy tắc nội dung
- Câu mở dưới 2 giây, có chữ lớn ngay khung đầu. Nói rõ vấn đề, ví dụ "SmartPLS hết hạn dùng thử", chứ không nói trống "hết hạn".
- Lời nói là một mạch kể kiểu sinh viên nói chuyện với bạn, không đọc lại chữ trên màn hình. Câu ngắn, có "nè, nha, luôn".
- Chỉ nói điều công cụ thật sự làm được. Mọi con số trong video đều lấy từ lần quay thật với dữ liệu mẫu. Nhắc người xem đọc lại kết quả trước khi đưa vào bài.
- Cú Nghiên là mascot hoạt hình. Không giả người thật, không có lời khen giả, không nhắc Genius Data trong video.
- **Không đăng khi người dùng chưa xem và duyệt bản mẫu.**

## Bố cục (1080×1920)
| Thành phần | Toạ độ |
|---|---|
| Khung trình duyệt | x 40–1040, y 262–1212 (thanh địa chỉ cao 70) |
| Cú | góc dưới trái, chân ở y 1585, kích thước 420 |
| Bong bóng thoại | x 420–1010, y 1250–1470 |
| Chữ lớn ở cảnh desk | y 330–520 |
| Ảnh bìa | chữ và cú nằm trong dải giữa 1080×1350 |
