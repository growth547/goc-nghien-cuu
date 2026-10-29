# QA: trang khái niệm (25) và mẫu bảng hỏi (12)

Ngày rà soát: 30/10/2026. Phạm vi: `src/content/khai-niem/*.json`, `src/content/mau-bang-hoi/*.json`, `src/pages/khai-niem/**`, `src/pages/mau-bang-hoi/**`, bản live trên growth547.github.io.

Cách làm: dựng lại nội dung đã điền placeholder bằng chính `src/utils/kit.ts`; tải 39 trang live; parse JSON-LD; kiểm tra 190 link khác nhau; mở preset của Bộ khảo sát (TPB, TAM); đối chiếu một số khẳng định với nguồn gốc.

Lưu ý: cây làm việc đang có thay đổi chưa commit ở `src/pages/mau-bang-hoi/[slug].astro`, `src/utils/kit.ts` và `src/tools/bo-khao-sat.html`. Mục nào thay đổi này đã sửa thì ghi "(đã sửa ở local, chưa deploy)".

## Tóm tắt

- Hiển thị tốt: 39/39 trang trả về 200. Toàn bộ JSON-LD parse được (khái niệm: Article + FAQPage + BreadcrumbList; mẫu: Article). 100% bảng nằm trong `overflow-x-auto`. Link nội dung không có link hỏng. Link duy nhất bị 404 là link RSS có ở mọi trang.
- Nội dung khái niệm nhìn chung chính xác. Tôi đã kiểm tra các điểm sau và đều đúng: số câu và câu đảo chiều của OCQ, PSS-10, DASS-21, MSLQ, MWMS, CBI, PHQ-9 và GAD-7; ngưỡng cắt; việc nhân 2 điểm DASS; nghiên cứu Vu và cộng sự (2022) về PHQ-9; việc GSE chưa có bản tiếng Việt.
- Phần lớn lỗi nằm ở **mẫu bảng hỏi**: câu điền placeholder bị sai nghĩa, câu viết cho người đi làm bị đưa nguyên cho sinh viên, câu dạng cặp đầu mút bị trả lời bằng thang đồng ý, quy tắc đảo điểm sai trên bản live, và mô tả trang ghi sai nguồn.
- Về độ sâu, đối thủ (ví dụ phantichspss) chỉ đưa danh sách biến, không có nguồn từng câu. Trang của ta đã vượt về độ chặt chẽ. Còn thiếu hình mô hình, bảng nghiên cứu Việt Nam, file tải về và kết quả điển hình.

## P0: lỗi cần sửa ngay

1. **Đảo điểm sai trên mẫu sức khoẻ tinh thần** (live). Trang `/mau-bang-hoi/cang-thang-va-hai-long-cuoc-song-sinh-vien/` ghi: "(R): câu đảo chiều, đảo điểm trước khi phân tích (thang 5 mức: 6 − điểm)." Quy tắc này sai với PSS-10 (thang 0–4, phải là 4 − điểm) và Rosenberg (thang 0–3, phải là 3 − điểm). Sinh viên làm theo sẽ ra điểm sai. Phần `reverseRules` ở local đã sửa đúng (đã kiểm tra: PSS ra "4 − điểm", RSE ra "3 − điểm"). **Sửa:** deploy bản local.

2. **Mẫu TPB khởi nghiệp, phiên bản trang tĩnh**: các câu ATT1–ATT4, SN1 và PBC2 in sẵn "1 2 3 4 5 6 7" trong câu, ví dụ "…là: tốt 1 2 3 4 5 6 7 không tốt". Nhưng đoạn đầu trang lại nói câu đồng ý dùng "Likert 5 mức", và ghi chú đảo điểm (cả live lẫn local) là "6 − điểm". Bộ khảo sát thì làm đúng: tôi đã mở preset và thấy thang đối nghĩa 1–5 với hai tính từ ở hai đầu. Như vậy trang tĩnh mâu thuẫn với chính công cụ. **Sửa:** khi render trang mẫu, bỏ cụm số "1 2 3 4 5 6 7" trong câu và hiện cặp tính từ như kit, hoặc ghi rõ "thang đối nghĩa 5 mức, đảo 6 − điểm".

3. **Mẫu niềm tin và trung thành thương hiệu: placeholder làm câu vô nghĩa.** Với `"sản phẩm": "sản phẩm của thương hiệu này"`, PL1 thành: "Lần tới khi mua sản phẩm của thương hiệu này, tôi sẽ mua thương hiệu này." Câu bị lặp ý. Câu gốc (Chaudhuri và Holbrook) hỏi về *loại sản phẩm*. **Sửa:** đặt `"sản phẩm": "loại sản phẩm này"`, hoặc để trống `[loại sản phẩm, ví dụ: dầu gội]` cho người dùng tự điền.

4. **Mẫu học trực tuyến (UTAUT)**: PE4 hiện cho sinh viên là "Nếu sử dụng hệ thống học trực tuyến, tôi sẽ có nhiều cơ hội được tăng lương hơn." PE1 và PE2 vẫn nói "công việc". **Sửa:** cho phép mẫu ghi đè câu của từng biến (ví dụ trường `itemOverrides`). PE4 đổi thành "…giúp tôi đạt kết quả học tập tốt hơn", "công việc" đổi thành "việc học". Chương 3 tự ghi "điều chỉnh".

5. **Mẫu ý định mua (Dodds)**: PQ1–PQ4, PV1, PV2, PV4, WTB1, WTB4 và WTB5 là câu dạng đầu mút, như "Khả năng tôi mua sản phẩm này là (rất cao … rất thấp)". Mẫu lại cho trả lời bằng Likert đồng ý 5 mức, mà câu "khả năng… là rất cao…rất thấp" thì không trả lời được bằng đồng ý/không đồng ý. Đầu tích cực lại nằm bên trái nhưng không có dấu (R). **Sửa:** viết lại thành phát biểu khẳng định ("Sản phẩm này có chất lượng gia công cao") và ghi "điều chỉnh từ Dodds và cộng sự, 1991", hoặc giữ dạng đối nghĩa và đảo cực để 5 = rất cao.

6. **Mẫu ví điện tử (TAM)**: mô tả trang (meta description) ghi "14 câu từ thang đo gốc Davis (1989)". Sai: 2 câu BI lấy từ Venkatesh và Davis (2000), và chính đoạn chương 3 của kit ghi đúng như vậy. **Sửa:** "12 câu của Davis (1989) và 2 câu ý định của Venkatesh và Davis (2000)". Ngoài ra, PU1–PU6 nói "công việc" với sinh viên ("cải thiện kết quả công việc của tôi"), nên ghi đè thành "thanh toán, chi tiêu" như cách sửa ở mục 4.

7. **Link RSS 404 trên mọi trang.** Header có `<link rel=alternate href=".../goc-nghien-cuu/rss.xml/">` (`Layout.astro` dòng 42–44), footer cũng vậy (`Footer.astro` dòng 43). Lỗi do `getRelativeLocaleUrl` tự thêm dấu `/` vào cuối. Đường dẫn `/rss.xml` không có dấu `/` trả về 200. **Sửa:** ghép `import.meta.env.BASE_URL + "rss.xml"` thay vì dùng `getRelativeLocaleUrl`.

8. **Preset kit từ trang mẫu (live) thiếu `dt` và `dv`.** Khi mở, kit chưa chọn đối tượng nên bảng hỏi chưa hiện, và biến phụ thuộc chưa được đánh dấu. Tôi đã mở preset TPB: 4 khái niệm và placeholder được chọn đúng. Local đã thêm `dt`/`dv`, và kit live đọc được `dt=sv`. **Sửa:** deploy bản local.

## P1: nội dung cần bổ sung

### Độ chính xác và khẳng định chưa có nguồn

- `chuan-chu-quan` FAQ: "chuẩn chủ quan là yếu tố dự báo yếu nhất của ý định". Thêm nguồn Armitage và Conner (2001, *British Journal of Social Psychology*, 40, 471–499), là phân tích tổng hợp cho kết quả này.
- `chuan-chu-quan` tip: "SN3 (áp lực xã hội) thường có hệ số tải thấp" hiện chưa có nguồn. Bỏ, hoặc dẫn nghiên cứu cụ thể.
- `thai-do` FAQ: "Francis và cộng sự (2004) gợi ý từ 4 đến 6 cặp". Tôi chưa tìm được câu này trong sổ tay của Francis. Cần đối chiếu lại; nếu không có thì sửa thành "Ajzen khuyến nghị gồm cả tính từ công cụ và cảm xúc".
- `nhan-thuc-su-huu-ich` FAQ: "Davis (1989) và nhiều phân tích tổng hợp…". Ghi tên một phân tích tổng hợp, ví dụ King và He (2006, *Information & Management*, 43, 740–755).
- `su-hai-long-khach-hang` tip: "nhiều khoá luận dùng thang SAT của ECM và đổi tên đối tượng" chưa có nguồn. Đây cũng là trang yếu nhất so với từ khoá có nhiều tìm kiếm nhất. Nên ưu tiên thang hài lòng khách hàng tổng quát, đang đứng đầu `SCALE_BACKLOG.md`.
- `hai-long-cong-viec` và `y-dinh-nghi-viec`: responseScale ghi "Bộ MOAQ năm 1975", nhưng nguồn trích là Cammann và cộng sự (1979). Cần thống nhất một năm. Cột "Thang trả lời" trên trang khái niệm đang hiện nguyên câu "Bộ MOAQ năm 1975 dùng thang 7 mức", nên rút gọn lại.
- `dong-luc-hoc-tap`: tip ghi nhãn "7 = Hoàn toàn đúng với tôi", còn responseScale ghi "7 = Rất đúng với tôi". Thống nhất theo bản gốc ("very true of me").
- `kiet-suc`: ghi chú đảo điểm chung "(thang 5 mức: 6 − điểm…)" không đúng với cách chấm của CBI (quy về 0–100, đảo WB7 bằng 100 − điểm). Trang thang đo CBI cũng ghi "6 − điểm". Nên dùng `reverseRuleOf` cho trang khái niệm, như trang mẫu đã làm.
- `y-dinh-su-dung` và `nhan-thuc-de-su-dung`: SITEQUAL và MBE cùng trích là "Yoo và Donthu (2001)". Nếu một đề tài dùng cả hai, danh mục tài liệu tham khảo sẽ bị trùng. Đổi thành 2001a/2001b.
- Mẫu `ho-tro-to-chuc-va-cam-ket` tip: "Không dùng bộ TCM thương mại của Meyer và Allen nếu chưa mua quyền". Cần kiểm tra lại: theo tôi nhớ, giấy phép học thuật của TCM có thể miễn phí khi đăng ký. Nếu đúng, nên ghi "cần đăng ký giấy phép".

### Mô hình và giả thuyết của từng mẫu

| Mẫu | Đánh giá | Bổ sung |
|---|---|---|
| ví điện tử (TAM) | Đường PEOU→PU→BI và PEOU→BI hợp lý. Nhưng sinh viên phần lớn đã dùng MoMo, nên câu "Nếu được tiếp cận…" không phù hợp | Gợi ý dùng biến ECM:CI cho người đã dùng; thêm niềm tin và rủi ro cảm nhận (sau khi có `rui-ro-cam-nhan`) |
| ngân hàng số (UTAUT2) | Đúng mô hình gốc | PV và HM yếu khi app ngân hàng miễn phí; tip về cỡ mẫu theo 7 mũi tên dễ gây hiểu lầm (power ra 103, mức hiển thị là 155 vì ISR lớn hơn) |
| giao đồ ăn (UTAUT2 bỏ FC) | Hợp lý, có tip giải thích | PE4 "tăng năng suất" cần ghi đè câu |
| học trực tuyến (UTAUT) | Đúng: FC→hành vi, không →ý định | Xem P0 mục 4 |
| SERVPERF→trung thành | Có cơ sở (Zeithaml và cộng sự, 1996). Phần lớn khoá luận Việt Nam đi theo SQ→hài lòng→trung thành | Thêm hài lòng làm trung gian; nên dùng bản câu khẳng định 1991 (Parasuraman, Berry và Zeithaml, 1991) thay cho 9 câu phủ định liền nhau. LOY4 "khi mua dịch vụ này" sửa thành "khi có nhu cầu về loại dịch vụ này" |
| POS→JS→OC và POS→JS→TI | Có cơ sở | Dẫn Rhoades và Eisenberger (2002, *JAP*, 87, 698–714) trong `modelNote` |
| Chaudhuri và Holbrook | Đúng bài gốc | Xem P0 mục 3 |
| Tài sản thương hiệu | Mô hình cấu trúc thực ra của Yoo, Donthu và Lee (2000); Yoo và Donthu (2001) là bài phát triển thang | Sửa `modelNote` và tiêu đề cho đúng |
| TPB khởi nghiệp | Hợp lý | Dẫn Liñán và Chen (2009) và Krueger và cộng sự (2000). SN5 "những người giống tôi **đã** khởi nghiệp sau khi tốt nghiệp" sai thì với người chưa tốt nghiệp: đổi thành "Nhiều bạn cùng trang lứa với tôi sẽ khởi nghiệp…" |
| PSS, RSE, GSE→SWLS | Hợp lý | Tiêu đề thiếu GSE. SWLS có ngưỡng chuẩn trên thang 7 mức; tip nên khuyên giữ 7 mức |
| Dodds (slug `y-dinh-mua-hang-online`) | Mô hình đúng Dodds (1991), nhưng không có yếu tố "online" | Đổi slug và tiêu đề, hoặc làm mẫu online riêng (niềm tin Gefen, rủi ro, eWOM) |

Cỡ mẫu: POWER_N (55/68/77/85/92/98/103/109), ISR = 155 và mức dự phòng ÷0,85 đều đúng.

### Độ sâu so với đối thủ

Trang phantichspss về "mô hình và thang đo gắn kết công chức" có hình mô hình, nhưng biến chỉ ở dạng danh sách, không ghi nguồn từng câu, không có nghiên cứu Việt Nam, không có file tải về và không có kết quả. Tìm kiếm Google-style cho "mẫu bảng hỏi ví điện tử" chủ yếu ra bài báo (TNU, Tạp chí Công Thương), không có mẫu tải được. Lưu ý: công cụ tìm kiếm tôi có chỉ trả kết quả từ Mỹ, nên chưa thấy hết thứ hạng của luanvanviet hay 1080.

Để trang của ta rõ ràng tốt hơn, cần thêm:

1. **Sơ đồ mô hình** dạng SVG sinh từ `paths` trên mỗi trang mẫu. Đây là thứ đối thủ có mà ta chưa có.
2. **Bảng "Nghiên cứu Việt Nam đã dùng"** gồm tác giả, năm, mẫu, alpha, hệ số đường dẫn. Các nguồn đã xác minh để bắt đầu:
   - Vu và cộng sự (2022), *Frontiers in Psychiatry* 13:838747: PHQ-9, n = 899, hai nhân tố, α = 0,84/0,80.
   - Tran, Tran và Fisher (2013), *BMC Psychiatry*: DASS-21.
   - Nghiên cứu MoMo với 1.966 sinh viên 15 trường ở Hà Nội, theo UTAUT (tapchicongthuong.vn).
   - Nghiên cứu ví điện tử ở ĐH Đồng Tháp, n = 376 (jst.tnu.edu.vn/jst/article/view/7458).
   - Hai nghiên cứu cuối cần lấy đủ tên tác giả trước khi đăng.
3. **Nút tải Word dạng file tĩnh** (`/mau-bang-hoi/<slug>.docx`) để Google index được. Hiện chỉ có nút mở kit.
4. **"Kết quả điển hình"**: khoảng alpha và hệ số đường dẫn thường gặp (ví dụ PU→BI) từ các nghiên cứu Việt Nam trong bảng ở mục 2, kèm nguồn.
5. JSON-LD của trang mẫu: thêm `BreadcrumbList`, `datePublished`/`dateModified` và `image`. FAQPage hiện gần như không còn được Google hiện rich result cho site thường, nên không nên kỳ vọng vào nó.

## P2: hoàn thiện

- `truyen-mieng`: keyword "thang đo truyền miệng điện tử" lệch với tên trang "Truyền miệng". Nên tách làm hai trang hoặc đổi H1.
- `chat-luong-dich-vu-va-long-trung-thanh`: REL5 "cửa hàng này lưu giữ hồ sơ…" không hợp với quán ăn hay cửa hàng; nên bỏ mặc định câu này với placeholder dạng cửa hàng.
- Mẫu giao đồ ăn và ngân hàng số: HT3 "Tôi phải sử dụng…" dịch sát chữ ("I must use"); nên dùng "Sử dụng … đã trở thành việc tự nhiên với tôi".
- Thẻ "Mẫu bảng hỏi khác" luôn hiện 6 mẫu đầu theo thứ tự chữ cái. Nên chọn theo cùng lĩnh vực.
- Trang khái niệm chỉ hiện "Dùng trong Bộ khảo sát" cho từng thang riêng. Nên thêm nút "Mở cả bộ" (ví dụ cả 5 thành phần SERVPERF).
- Kiểm tra mobile mới làm ở mức cấu trúc: mọi bảng đã nằm trong khung cuộn. Chưa chụp màn hình ở 375px vì pane trình duyệt bị dùng chung.

## Độ phủ: trang nên làm tiếp (xếp theo nhu cầu)

**A. Trang khái niệm cho thang đã có trong thư viện (làm nhanh, không cần thang mới):**

1. Mua hàng ngẫu hứng (`mua-hang-ngau-hung`): rất nhiều đề tài TikTok Shop và livestream.
2. Nghiện mạng xã hội (BSMAS) và nghiện điện thoại (SAS-SV).
3. Hỗ trợ xã hội (MSPSS).
4. Lòng tự trọng (Rosenberg).
5. Hài lòng cuộc sống (SWLS).
6. Độ tin cậy nguồn / KOL (Ohanian).
7. Lãnh đạo chuyển đổi (GLTS).
8. Công bằng tổ chức.
9. OCB.
10. Hiệu quả công việc.
11. Cân bằng công việc – cuộc sống.
12. FOMO.
13. Cô đơn (UCLA-3).
14. Khả năng phục hồi (BRS).
15. Chất lượng dịch vụ điện tử / E-S-QUAL: có thể tách khỏi trang chất lượng dịch vụ.

**B. Khái niệm cần thang mới (đúng thứ tự trong `SCALE_BACKLOG.md`):**

1. Hài lòng khách hàng tổng quát.
2. Rủi ro cảm nhận.
3. Hình ảnh thương hiệu.
4. Hình ảnh điểm đến và ý định quay lại.
5. Ý thức sức khoẻ, mối quan tâm môi trường và niềm tin xanh (ba khái niệm này cho cụm đề tài sản phẩm xanh).
6. Ý định khởi nghiệp (EIQ) và giáo dục khởi nghiệp.
7. Chia sẻ tri thức.
8. Hỗ trợ của cấp trên.

**C. Mẫu bảng hỏi mới:**

1. Ý định mua thực phẩm hữu cơ/xanh: TPB + mối quan tâm môi trường + ý thức sức khoẻ.
2. Ý định mua hàng online: TAM + niềm tin (Gefen) + rủi ro cảm nhận + eWOM. Có thể thay cho mẫu Dodds đang dùng sai slug.
3. KOL/livestream → ý định mua: Ohanian + thái độ với thương hiệu + ý định mua.
4. Mua hàng ngẫu hứng trên TikTok Shop.
5. Nghiện mạng xã hội và sức khoẻ tinh thần sinh viên: BSMAS + DASS-21 + MSPSS.
6. Ý định dùng ChatGPT/AI trong học tập: UTAUT2.
7. Hài lòng sinh viên với chất lượng đào tạo (HEdPERF).
8. Lãnh đạo chuyển đổi → gắn kết công việc → hiệu quả.
9. E-S-QUAL → hài lòng → trung thành trên sàn TMĐT.
10. Du lịch: hình ảnh điểm đến → hài lòng → quay lại.
