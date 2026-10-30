# Góc Nghiên Cứu

Site nội dung về phương pháp nghiên cứu cho sinh viên, học viên: công cụ tính cỡ mẫu (PLS-SEM/G*Power, hồi quy, EFA, Cochran), Cronbach's alpha và các bài hướng dẫn. Dựng trên theme [AstroPaper](https://github.com/satnaing/astro-paper) (MIT).

```bash
pnpm install
pnpm dev                        # http://localhost:4321/
node scripts/check-power.mjs    # kiểm tra công thức cỡ mẫu so với G*Power
```

Đẩy lên nhánh `main` là GitHub Actions tự build và deploy lên https://gocnghiencuu.com/.

- Bài viết: `src/content/posts/*.md` (frontmatter: title, description, pubDatetime, tags). Hướng dẫn giọng văn: `docs/BRIEF.md`.
- Công cụ: `src/tools/*.html`, trang ở `src/pages/cong-cu/`.
- Link về Genius Data: dùng `appLink()` trong `src/utils/appLink.ts`, gắn `?ref=lab-web|lab-blog|lab-tool` + UTM để đo hiệu quả kênh. Chỉ nhắc Genius Data thỉnh thoảng, đúng chỗ; chân trang và trang Giới thiệu giữ dòng "Đồng hành cùng Genius Data".

## Giao diện: design token và ảnh chụp so sánh

- Token (cỡ chữ, khoảng cách, bo góc, bóng, màu viền) ở `src/styles/theme.css`; component dùng chung (`.btn`, `.card`, `.badge`, `.callout-box`, `.cta`, `.panel`, `.table-scroll`) ở `src/styles/global.css`; chữ bài viết ở `src/styles/typography.css`. Công cụ trong `src/tools/*.html` chỉ dùng class có sẵn, không viết thêm style riêng nếu không cần.
- Chụp các trang chính ở 390px (điện thoại) và 1440px (máy tính) để so trước/sau khi sửa giao diện (cần Python Playwright và Chrome đã cài):

```bash
python -I scripts/ui-snapshots.py --base https://gocnghiencuu.com --out ui-shots/before
node node_modules/astro/bin/astro.mjs build && python -m http.server 4321 -d dist   # cửa sổ khác
python -I scripts/ui-snapshots.py --base http://127.0.0.1:4321 --out ui-shots/after
python -I scripts/ui-snapshots.py --compare ui-shots/before ui-shots/after --out ui-shots/so-sanh.png
```

Thêm `--dark` để chụp giao diện tối, `--full` để chụp cả trang, `--only home,pls` để chụp vài trang. Script báo dòng `horizontal overflow` nếu trang bị cuộn ngang trên điện thoại. Thư mục `ui-shots/` không đưa lên git.

## Đo hiệu quả (PostgreSQL của Genius Data)

```sql
SELECT code, "clickCount", "successCount",
       round(100.0 * "successCount" / nullif("clickCount", 0), 1) AS conv_pct
FROM "AffiliateLink" WHERE code LIKE 'lab-%' ORDER BY code;
```
