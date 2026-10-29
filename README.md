# Góc Nghiên Cứu

Site nội dung về phương pháp nghiên cứu cho sinh viên, học viên: công cụ tính cỡ mẫu (PLS-SEM/G*Power, hồi quy, EFA, Cochran), Cronbach's alpha và các bài hướng dẫn. Dựng trên theme [AstroPaper](https://github.com/satnaing/astro-paper) (MIT).

```bash
pnpm install
pnpm dev                        # http://localhost:4321/goc-nghien-cuu/
node scripts/check-power.mjs    # kiểm tra công thức cỡ mẫu so với G*Power
```

Đẩy lên nhánh `main` là GitHub Actions tự build và deploy lên https://growth547.github.io/goc-nghien-cuu/.

- Bài viết: `src/content/posts/*.md` (frontmatter: title, description, pubDatetime, tags). Hướng dẫn giọng văn: `docs/BRIEF.md`.
- Công cụ: `src/tools/*.html`, trang ở `src/pages/cong-cu/`.
- Link về Genius Data: dùng `appLink()` trong `src/utils/appLink.ts`, gắn `?ref=lab-web|lab-blog|lab-tool` + UTM để đo hiệu quả kênh. Chỉ nhắc Genius Data thỉnh thoảng, đúng chỗ; chân trang và trang Giới thiệu giữ dòng "Đồng hành cùng Genius Data".

## Đo hiệu quả (PostgreSQL của Genius Data)

```sql
SELECT code, "clickCount", "successCount",
       round(100.0 * "successCount" / nullif("clickCount", 0), 1) AS conv_pct
FROM "AffiliateLink" WHERE code LIKE 'lab-%' ORDER BY code;
```
