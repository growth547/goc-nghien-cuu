# Cú Nghiên, mascot của Góc Nghiên Cứu

Cú Nghiên là **nhân vật hoạt hình của thương hiệu**. Cú không đóng vai người thật, không đóng vai một sinh viên có thật, không đưa ra lời khen hay đánh giá thay người dùng. Trong video, cú chỉ giới thiệu công cụ bằng giọng của chính mình.

Tên lấy từ "nghiên cứu", vì chữ "cứu" gần với "cú": Góc Nghiên Cứu có cú Nghiên.

## Tính cách
- Một con cú mê số liệu, kiểu "đàn anh khoá trên" hay giúp bạn bè: nói nhanh, thân thiện, xưng "mình", gọi người xem là "bạn".
- Hơi kịch tính với nỗi khổ làm khoá luận như bản dùng thử hết hạn, bảng SPSS hay chương 4. Thấy kết quả đẹp thì phấn khích.
- Trung thực: chỉ nói những gì công cụ làm được, và luôn nhắc người xem đọc lại kết quả trước khi đưa vào bài.

## Giọng nói
- Một giọng cố định: `vi-VN-HoaiMyNeural` (edge-tts), nghe sáng và dễ thương.
- Mỗi câu đọc riêng, có tốc độ và cao độ riêng:
  - hoảng thì khoảng +16% / +32 Hz;
  - than thì khoảng −6% / −8 Hz;
  - khoe thì khoảng +8% / +40 Hz.
- Sau đó nâng 1 bán cung (asetrate ×1,06 + atempo), chỉnh EQ cho sáng và nén nhẹ, để ra chất nhân vật hoạt hình.
- Câu cửa miệng: **"Khoan. Để Cú."** ở bước ngoặt và **"Một cú là xong!"** để chốt.
- Thuật ngữ viết theo cách sinh viên hay đọc: `{SmartPLS|smát pi eo ét}`.

## Âm thanh thương hiệu
Tất cả nằm trong `scripts/video/sound.py`, tự tổng hợp nên không vướng bản quyền.
- **Logo âm thanh:** ba nốt marimba đi lên C5, F5, A5 (ba cột logo), rồi chuông C6 kèm lấp lánh (chấm cam), rồi tiếng "hú-hú" của cú.
- **Nhạc nền:** 100 BPM, giọng Fa trưởng, dùng chính âm sắc marimba của logo.

## Hình
- Phong cách chibi phẳng, viền mực `#14211c`.
  - Đầu to (khoảng 55% chiều cao) màu `#128a6b`, thân hình quả lê `#0b6b53`, cánh `#08513f`.
  - Bụng bạc hà `#e1f1ea` có ba cột biểu đồ của logo kèm chấm cam.
  - Mặt kem `#fdf0e3`, má hồng cam.
  - Kính tròn viền cam `#f4a85e`, mỏ và chân cũng cam.
- Rig (`scripts/video/mascot.py`):
  - 20 bộ phận SVG, nằm ở `mascot/parts/`;
  - miệng 4 dáng, chạy theo âm lượng giọng;
  - mắt: mở, nửa, nhắm, cười, tròn xoe; con ngươi nhìn theo hướng;
  - lông mày: nhướng, cau, buồn;
  - cánh xoay quanh vai, đầu nghiêng, thân co giãn.
- Ảnh mẫu các biểu cảm: `mascot/cu-nghien-*.png` (idle, talk, point, wow, happy, panic, tired, smug).
- Font: Be Vietnam Pro.
- Vẽ lại sau khi sửa: `python scripts/video/mascot.py build`.
