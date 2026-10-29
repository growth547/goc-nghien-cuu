# Góc Nghiên Cứu — kênh thử nghiệm của Genius Data

Microsite SEO tĩnh: 2 công cụ miễn phí (tính cỡ mẫu, Cronbach's alpha) + blog hướng dẫn cho sinh viên/học viên.
Mục đích: một kênh tăng trưởng độc lập, đo được, để so với các kênh chính thống của Genius Data.

```bash
node build.mjs            # -> dist/
node serve.mjs            # xem thử tại http://localhost:4321/goc-nghien-cuu/
node submit-indexnow.mjs  # sau khi deploy: báo Bing/Yandex có trang mới
```

Thêm bài: tạo `content/posts/<slug>.html` theo `content/BRIEF.md`, chạy lại build.

## Đo hiệu quả

Mọi link từ site sang geniusdata.io đều là `https://geniusdata.io/signup?ref=<code>&utm_...`.
Backend đã có sẵn attribution theo `?ref=`: đếm click (`AffiliateLink.clickCount`, mỗi phiên một lần) và gán người đăng ký (`User.signupAffiliateLinkId`).

| ref code   | Nguồn trong site |
|------------|------------------|
| `lab-web`  | trang chủ, chân trang |
| `lab-blog` | hộp CTA trong bài viết |
| `lab-tool` | hộp CTA trong trang công cụ |

**Bước bắt buộc trước khi chạy:** admin tạo 3 affiliate link với đúng 3 slug trên (`POST /affiliate/links`, `code` = slug, chủ link là một tài khoản nội bộ, loại link có thưởng 0). Mã chưa tồn tại sẽ bị backend bỏ qua im lặng, mất số liệu.

### So sánh với kênh chính thống (PostgreSQL)

```sql
-- Đăng ký mới và số người tạo khảo sát, theo kênh, 30 ngày gần nhất
WITH u AS (
  SELECT u.id, u."createdAt",
         CASE
           WHEN al.code LIKE 'lab-%' THEN 'AI lab: ' || al.code
           WHEN al.code IS NOT NULL  THEN 'Affiliate khác'
           WHEN u."heardAboutSource" IS NOT NULL THEN 'Tự khai: ' || u."heardAboutSource"
           ELSE 'Không rõ'
         END AS channel
  FROM "User" u
  LEFT JOIN "AffiliateLink" al ON al.id = u."signupAffiliateLinkId"
  WHERE u."createdAt" >= now() - interval '30 days'
)
SELECT channel,
       count(*)                                                    AS signups,
       count(*) FILTER (WHERE EXISTS (SELECT 1 FROM "Form" f WHERE f."createdById" = u.id)) AS created_survey
FROM u GROUP BY channel ORDER BY signups DESC;

-- Click và chuyển đổi của riêng kênh này
SELECT code, "clickCount", "successCount",
       round(100.0 * "successCount" / nullif("clickCount", 0), 1) AS conv_pct
FROM "AffiliateLink" WHERE code LIKE 'lab-%' ORDER BY code;
```

Lưu ý khi đọc số: `heardAboutSource` là khảo sát tự khai, `signupAffiliateLinkId` là đo thật. Người đến từ microsite nhưng không bấm CTA (gõ thẳng geniusdata.io) sẽ không được tính cho kênh này, nên số của kênh là cận dưới.
