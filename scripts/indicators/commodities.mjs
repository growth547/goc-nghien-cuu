// Rich pages: world commodity prices, monthly, from the World Bank Pink Sheet (CC BY 4.0).
// These series are world-market prices, not Viet Nam data, so pages are titled "Giá ... theo tháng".
const T = "Giá hàng hoá thế giới";
const U = {
  mt: { unit: "USD/tấn (giá danh nghĩa)", scale: 1, displayUnit: "USD/tấn", decimals: 0 },
  kg: { unit: "USD/kg (giá danh nghĩa)", scale: 1, displayUnit: "USD/kg", decimals: 2 },
  bbl: { unit: "USD/thùng (giá danh nghĩa)", scale: 1, displayUnit: "USD/thùng", decimals: 2 },
  mmbtu: { unit: "USD/triệu BTU (giá danh nghĩa)", scale: 1, displayUnit: "USD/triệu BTU", decimals: 2 },
  oz: { unit: "USD/ounce troy (giá danh nghĩa)", scale: 1, displayUnit: "USD/ounce", decimals: 1 },
  dmtu: { unit: "USD/tấn khô (dmtu, giá danh nghĩa)", scale: 1, displayUnit: "USD/tấn", decimals: 1 },
  idx: { unit: "chỉ số, 2010 = 100 (theo USD danh nghĩa)", scale: 1, displayUnit: "điểm (2010 = 100)", decimals: 1 },
};
const transmission =
  "Kiểm định truyền dẫn giá từ thị trường thế giới sang giá trong nước (đồng liên kết Johansen, mô hình hiệu chỉnh sai số ECM, NARDL để xem giá tăng và giảm truyền dẫn có đối xứng không), kết hợp với giá tại vườn của FAOSTAT hoặc chỉ số giá trong nước.";

const c = (slug, code, shortVi, nameVi, unit, explanation, uses) => ({
  slug,
  source: "pink",
  code,
  theme: T,
  shortVi,
  nameVi,
  ...unit,
  explanation,
  thesisUse: uses,
});

export const COMMODITIES = [
  c("gia-gao-viet-nam-5-tam", "PINK_RICE_VIET_NAMESE_5PCT", "gạo Việt Nam 5% tấm", "Giá gạo trắng Việt Nam 5% tấm xuất khẩu (USD/tấn)", U.mt,
    "Giá chào bán gạo trắng Việt Nam loại 5% tấm, giao FOB cảng Hồ Chí Minh, bình quân tháng. Đây là giá tham chiếu chính cho gạo xuất khẩu của Việt Nam, thường thấp hơn gạo Thái cùng loại vài chục USD/tấn.",
    [
      "Biến giá xuất khẩu trong đề tài về năng lực cạnh tranh của gạo Việt Nam so với Thái Lan (chênh lệch giá, tỷ số giá), tác động của lệnh hạn chế xuất khẩu gạo của Ấn Độ năm 2023.",
      transmission,
    ]),
  c("gia-gao-thai-5-tam", "PINK_RICE_THAI_5PCT", "gạo Thái Lan 5% tấm", "Giá gạo trắng Thái Lan 5% tấm xuất khẩu (USD/tấn)", U.mt,
    "Giá gạo trắng Thái Lan loại 5% tấm, FOB Bangkok, bình quân tháng. Đây là giá gạo tham chiếu lâu đời nhất của thị trường thế giới (từ năm 1960) và thường được dùng làm 'giá gạo thế giới'.",
    [
      "Biến giá đối thủ cạnh tranh khi phân tích giá và sản lượng gạo xuất khẩu của Việt Nam; tính chênh lệch giá Thái – Việt theo tháng.",
      "Chuỗi dài nhất để phân tích chu kỳ và cú sốc giá lương thực (2008, 2011, 2023) bằng mô hình GARCH hoặc kiểm định gãy cấu trúc.",
    ]),
  c("gia-gao-thai-25-tam", "PINK_RICE_THAI_25PCT", "gạo Thái Lan 25% tấm", "Giá gạo trắng Thái Lan 25% tấm xuất khẩu (USD/tấn)", U.mt,
    "Giá gạo trắng Thái Lan loại 25% tấm (chất lượng thấp hơn), FOB Bangkok, bình quân tháng. Phân khúc này cạnh tranh trực tiếp với gạo cấp thấp của Việt Nam ở thị trường châu Phi, Philippines.",
    [
      "So sánh với gạo 5% tấm để phân tích chênh lệch giá theo chất lượng (premium) trong đề tài về nâng cấp chất lượng gạo xuất khẩu.",
      "Biến giá trong mô hình cầu nhập khẩu gạo của các thị trường giá rẻ.",
    ]),
  c("gia-ca-phe-robusta", "PINK_COFFEE_ROBUSTA", "cà phê Robusta", "Giá cà phê Robusta thế giới (USD/kg)", U.kg,
    "Giá cà phê Robusta theo Tổ chức Cà phê Quốc tế (ICO), bình quân tháng của các thị trường New York và Le Havre/Marseille. Việt Nam là nước sản xuất và xuất khẩu Robusta lớn nhất thế giới nên đây là giá quan trọng nhất với ngành cà phê trong nước.",
    [
      transmission,
      "Biến giá trong mô hình cung cà phê của Việt Nam (phản ứng diện tích trồng với giá có độ trễ), hoặc đề tài về biến động giá và thu nhập nông hộ Tây Nguyên.",
    ]),
  c("gia-ca-phe-arabica", "PINK_COFFEE_ARABICA", "cà phê Arabica", "Giá cà phê Arabica thế giới (USD/kg)", U.kg,
    "Giá cà phê Arabica theo ICO, bình quân tháng của các thị trường Mỹ và Đức. Arabica thường đắt hơn Robusta; chênh lệch hai loại thay đổi theo mùa vụ ở Brazil và Việt Nam.",
    [
      "Phân tích quan hệ dài hạn và hiệu ứng lan toả biến động giữa giá Arabica và Robusta (mô hình VECM, GARCH đa biến).",
      "Bối cảnh cho đề tài về chuyển đổi sang cà phê đặc sản, Arabica Cầu Đất – Sơn La.",
    ]),
  c("gia-cao-su-tsr20", "PINK_RUBBER_TSR20", "cao su TSR20", "Giá cao su TSR20 thế giới (USD/kg)", U.kg,
    "Giá cao su kỹ thuật TSR20 (tiêu chuẩn kỹ thuật, dùng chủ yếu cho lốp xe) trên thị trường Singapore, bình quân tháng. Cao su SVR của Việt Nam thường được định giá theo loại này.",
    [
      transmission,
      "Biến giá đầu vào của ngành săm lốp hoặc biến giá đầu ra trong đề tài về các doanh nghiệp cao su niêm yết (phân tích lợi nhuận theo giá cao su).",
    ]),
  c("gia-cao-su-rss3", "PINK_RUBBER_RSS3", "cao su RSS3", "Giá cao su tờ xông khói RSS3 thế giới (USD/kg)", U.kg,
    "Giá cao su tờ xông khói hạng 3 (RSS3) trên thị trường Singapore, bình quân tháng, chuỗi từ năm 1960. Đây là chuỗi giá cao su dài nhất trong Pink Sheet.",
    [
      "Biến giá cao su dài hạn cho phân tích chu kỳ giá hàng hoá và siêu chu kỳ (super-cycle).",
      "So sánh với TSR20 để kiểm định mức độ liên kết giữa các loại cao su.",
    ]),
  c("gia-duong-the-gioi", "PINK_SUGAR_WORLD", "đường thế giới", "Giá đường thô thế giới (USD/kg)", U.kg,
    "Giá đường thô theo Hiệp định Đường Quốc tế (ISA), FOB các cảng vùng Caribe, bình quân tháng. Giá đường thế giới ảnh hưởng đến ngành mía đường Việt Nam, nhất là sau khi thuế nhập khẩu đường từ ASEAN giảm theo ATIGA.",
    [
      "Phân tích tác động của hội nhập (ATIGA) và giá đường nhập khẩu lên ngành mía đường trong nước.",
      "Biến giá trong đề tài về liên kết giá năng lượng – lương thực (đường dùng sản xuất ethanol).",
    ]),
  c("gia-ngo-the-gioi", "PINK_MAIZE", "ngô", "Giá ngô thế giới (USD/tấn)", U.mt,
    "Giá ngô vàng số 2 của Mỹ, FOB vùng Vịnh Mexico, bình quân tháng. Việt Nam nhập khẩu lượng lớn ngô làm thức ăn chăn nuôi, nên giá ngô thế giới ảnh hưởng trực tiếp đến chi phí ngành chăn nuôi.",
    [
      "Biến chi phí đầu vào trong đề tài về giá thức ăn chăn nuôi, giá thịt lợn và lợi nhuận doanh nghiệp thức ăn chăn nuôi.",
      "Phân tích liên kết giá lương thực – năng lượng (ngô dùng sản xuất ethanol) bằng VAR hoặc kiểm định nhân quả Granger.",
    ]),
  c("gia-lua-mi-the-gioi", "PINK_WHEAT_US_HRW", "lúa mì", "Giá lúa mì đỏ cứng vụ đông của Mỹ (USD/tấn)", U.mt,
    "Giá lúa mì HRW số 1 của Mỹ, xuất khẩu từ vùng Vịnh, bình quân tháng. Việt Nam nhập khẩu toàn bộ lúa mì cho sản xuất bột mì, mì ăn liền và thức ăn chăn nuôi.",
    [
      "Biến chi phí nguyên liệu trong đề tài về ngành thực phẩm chế biến, mì ăn liền.",
      "Phân tích cú sốc giá lương thực do chiến tranh Nga – Ukraine năm 2022.",
    ]),
  c("gia-dau-tuong", "PINK_SOYBEANS", "đậu tương", "Giá đậu tương thế giới (USD/tấn)", U.mt,
    "Giá đậu tương của Mỹ, CIF Rotterdam, bình quân tháng. Đậu tương và khô đậu tương là nguyên liệu nhập khẩu chủ yếu cho thức ăn chăn nuôi và dầu ăn ở Việt Nam.",
    [
      "Biến giá đầu vào trong mô hình giá thức ăn chăn nuôi và giá thịt trong nước.",
      "Phân tích tác động của căng thẳng thương mại Mỹ – Trung đến giá nông sản thế giới.",
    ]),
  c("gia-dau-co", "PINK_PALM_OIL", "dầu cọ", "Giá dầu cọ thế giới (USD/tấn)", U.mt,
    "Giá dầu cọ thô của Malaysia/Indonesia, CIF Rotterdam, bình quân tháng. Dầu cọ là dầu thực vật được giao dịch nhiều nhất thế giới và là nguyên liệu chính của ngành dầu ăn Việt Nam.",
    [
      "Biến chi phí đầu vào trong đề tài về ngành dầu ăn, thực phẩm chế biến.",
      "Phân tích liên kết giá dầu cọ với giá dầu thô (biodiesel) và chính sách xuất khẩu của Indonesia.",
    ]),
  c("gia-bong-xo", "PINK_COTTON_A_INDEX", "bông xơ (Cotton A Index)", "Giá bông xơ thế giới, Cotton Outlook A Index (USD/kg)", U.kg,
    "Chỉ số giá bông xơ Cotton Outlook 'A', giao CFR các cảng Viễn Đông, bình quân tháng. Việt Nam nhập khẩu gần như toàn bộ bông cho ngành sợi – dệt may xuất khẩu.",
    [
      "Biến chi phí nguyên liệu trong đề tài về ngành dệt may, lợi nhuận doanh nghiệp sợi niêm yết.",
      "Kiểm định truyền dẫn giá bông sang giá sợi và hàng may mặc xuất khẩu.",
    ]),
  c("gia-che-the-gioi", "PINK_TEA_AVG_3_AUCTIONS", "chè (bình quân 3 sàn đấu giá)", "Giá chè thế giới, bình quân ba sàn đấu giá (USD/kg)", U.kg,
    "Giá bình quân của các phiên đấu giá chè ở Kolkata, Colombo và Mombasa, bình quân tháng. Chè xuất khẩu của Việt Nam chủ yếu là chè đen và chè xanh giá thấp, chịu ảnh hưởng của giá thế giới.",
    [
      "Biến giá thế giới trong đề tài về xuất khẩu chè, năng lực cạnh tranh và sinh kế vùng trồng chè trung du miền núi phía Bắc.",
      "So sánh với giá chè xuất khẩu bình quân của Việt Nam (từ số liệu hải quan) để đo khoảng cách chất lượng.",
    ]),
  c("gia-tom-the-gioi", "PINK_SHRIMPS_MEXICAN", "tôm (Mexico, cỡ lớn)", "Giá tôm thế giới, tôm Mexico cỡ 26–30 con/pound (USD/kg)", U.kg,
    "Giá tôm trắng Mexico cỡ 26–30 con/pound tại thị trường New York, bình quân tháng. Đây là giá tôm tham chiếu duy nhất trong Pink Sheet; tôm là mặt hàng thuỷ sản xuất khẩu lớn nhất của Việt Nam.",
    [
      "Biến giá tham chiếu thế giới trong đề tài về xuất khẩu tôm của Việt Nam sang Mỹ, thuế chống bán phá giá.",
      "Lưu ý: tôm Việt Nam là tôm chân trắng và tôm sú nuôi nên giá khác; chuỗi phù hợp để phân tích xu hướng, không phải mức giá tuyệt đối.",
    ]),
  c("gia-bot-ca", "PINK_FISH_MEAL", "bột cá", "Giá bột cá thế giới (USD/tấn)", U.mt,
    "Giá bột cá Peru (65% đạm), CIF Hamburg, bình quân tháng. Bột cá là nguyên liệu chính của thức ăn thuỷ sản, nên giá bột cá ảnh hưởng đến chi phí nuôi tôm, cá tra.",
    [
      "Biến chi phí đầu vào trong đề tài về ngành nuôi trồng thuỷ sản và thức ăn thuỷ sản.",
      "Phân tích tác động của hiện tượng El Niño (giảm sản lượng cá cơm Peru) đến giá thức ăn thuỷ sản.",
    ]),
  c("gia-phan-ure", "PINK_UREA", "phân urê", "Giá phân urê thế giới (USD/tấn)", U.mt,
    "Giá phân urê dạng hạt, FOB vùng Trung Đông, bình quân tháng. Giá urê gắn chặt với giá khí đốt (nguyên liệu sản xuất đạm) và ảnh hưởng đến chi phí trồng lúa của nông dân.",
    [
      "Biến chi phí đầu vào trong mô hình lợi nhuận trồng lúa hoặc đề tài về doanh nghiệp phân bón niêm yết (Đạm Phú Mỹ, Đạm Cà Mau).",
      "Kiểm định truyền dẫn giá khí đốt → giá urê → giá lương thực bằng VAR.",
    ]),
  c("gia-phan-dap", "PINK_DAP", "phân DAP", "Giá phân DAP thế giới (USD/tấn)", U.mt,
    "Giá phân diammonium phosphate (DAP), FOB vùng Vịnh Mỹ, bình quân tháng. DAP là phân bón cung cấp lân và đạm phổ biến.",
    [
      "Biến chi phí phân bón trong hàm lợi nhuận sản xuất nông nghiệp.",
      "Phân tích cú sốc giá phân bón 2021–2022 và chính sách thuế giá trị gia tăng với phân bón.",
    ]),
  c("gia-dau-brent", "PINK_CRUDE_OIL_BRENT", "dầu thô Brent", "Giá dầu thô Brent (USD/thùng)", U.bbl,
    "Giá giao ngay dầu thô Brent (Biển Bắc), bình quân tháng. Brent là chuẩn định giá cho phần lớn dầu thô giao dịch quốc tế, kể cả dầu thô Việt Nam, và là cơ sở tính giá xăng dầu trong nước.",
    [
      "Biến cú sốc giá dầu trong mô hình VAR/SVAR về lạm phát, tăng trưởng, cán cân thương mại của Việt Nam.",
      "Biến giải thích trong đề tài về giá xăng dầu trong nước, Quỹ bình ổn giá xăng dầu, hoặc lợi nhuận ngành vận tải, hàng không.",
    ]),
  c("gia-dau-tho-binh-quan", "PINK_CRUDE_OIL_AVERAGE", "dầu thô (bình quân Brent, Dubai, WTI)", "Giá dầu thô bình quân Brent, Dubai và WTI (USD/thùng)", U.bbl,
    "Bình quân giản đơn giá giao ngay của ba loại dầu chuẩn Brent, Dubai và WTI, bình quân tháng; World Bank dùng chuỗi này làm 'giá dầu thế giới' trong các báo cáo.",
    [
      "Biến giá dầu tổng hợp ít phụ thuộc vào một thị trường khu vực, phù hợp cho mô hình vĩ mô dài hạn (chuỗi từ năm 1960).",
      "Chuyển sang giá thực bằng cách chia cho CPI Mỹ khi phân tích dài hạn.",
    ]),
  c("gia-than-uc", "PINK_COAL_AUSTRALIAN", "than Australia", "Giá than nhiệt Australia (USD/tấn)", U.mt,
    "Giá than nhiệt Australia, FOB Newcastle, bình quân tháng. Việt Nam nhập khẩu ngày càng nhiều than cho nhiệt điện, chủ yếu từ Australia và Indonesia.",
    [
      "Biến chi phí nhiên liệu trong đề tài về giá điện, chi phí sản xuất điện than và chuyển dịch năng lượng.",
      "Phân tích cú sốc giá năng lượng năm 2022 lên ngành điện và xi măng.",
    ]),
  c("gia-khi-lng-nhat-ban", "PINK_LIQUEFIED_NATURAL_GAS_JAPAN", "khí LNG (Nhật Bản)", "Giá khí thiên nhiên hoá lỏng LNG nhập khẩu vào Nhật Bản (USD/triệu BTU)", U.mmbtu,
    "Giá LNG nhập khẩu bình quân của Nhật Bản, bình quân tháng – giá tham chiếu cho thị trường LNG châu Á. Việt Nam bắt đầu nhập khẩu LNG từ năm 2023 cho các nhà máy điện khí.",
    [
      "Biến chi phí nhiên liệu trong đề tài về điện khí LNG trong Quy hoạch điện VIII.",
      "So sánh với giá khí châu Âu, Mỹ để phân tích sự phân mảnh của thị trường khí toàn cầu.",
    ]),
  c("gia-quang-sat", "PINK_IRON_ORE_CFR_SPOT", "quặng sắt", "Giá quặng sắt giao ngay, CFR Trung Quốc (USD/tấn khô)", U.dmtu,
    "Giá quặng sắt giao ngay (hàm lượng sắt 62%), giao CFR cảng Thiên Tân, Trung Quốc, bình quân tháng. Quặng sắt là đầu vào chính của các nhà máy thép lò cao như Hoà Phát, Formosa.",
    [
      "Biến chi phí nguyên liệu trong đề tài về lợi nhuận ngành thép, giá cổ phiếu doanh nghiệp thép niêm yết.",
      "Phân tích liên kết giữa giá quặng sắt và giá thép xây dựng trong nước.",
    ]),
  c("gia-dong", "PINK_COPPER", "đồng", "Giá đồng thế giới (USD/tấn)", U.mt,
    "Giá đồng tinh luyện loại A trên Sàn Kim loại London (LME), bình quân tháng. Giá đồng thường được coi là chỉ báo sớm của chu kỳ kinh tế toàn cầu.",
    [
      "Biến cú sốc cầu toàn cầu trong mô hình VAR về xuất khẩu, sản xuất công nghiệp.",
      "Biến chi phí nguyên liệu trong đề tài về ngành dây cáp điện, thiết bị điện.",
    ]),
  c("gia-nhom", "PINK_ALUMINUM", "nhôm", "Giá nhôm thế giới (USD/tấn)", U.mt,
    "Giá nhôm nguyên chất 99,7% trên Sàn Kim loại London (LME), bình quân tháng. Việt Nam xuất khẩu bauxite/alumin và nhập khẩu nhôm cho ngành nhôm định hình, xây dựng.",
    [
      "Biến giá nguyên liệu trong đề tài về ngành vật liệu xây dựng, nhôm định hình.",
      "So sánh với các kim loại cơ bản khác trong phân tích chu kỳ giá kim loại.",
    ]),
  c("gia-vang-the-gioi", "PINK_GOLD", "vàng thế giới", "Giá vàng thế giới (USD/ounce troy)", U.oz,
    "Giá vàng 99,5% trên thị trường London (giá chốt LBMA), bình quân tháng. Đây là giá tham chiếu cho giá vàng trong nước; chênh lệch giá vàng miếng trong nước và thế giới là chủ đề thường gặp trong nghiên cứu.",
    [
      "Biến tài sản trú ẩn trong đề tài về quan hệ giữa giá vàng, tỷ giá, lạm phát và thị trường chứng khoán (VAR, DCC-GARCH).",
      "Tính chênh lệch giá vàng trong nước – thế giới (cần quy đổi ounce sang lượng và USD sang VND) trong đề tài về quản lý thị trường vàng.",
    ]),
  c("chi-so-gia-nang-luong", "PINK_ENERGY_INDEX", "chỉ số giá năng lượng thế giới", "Chỉ số giá năng lượng thế giới của World Bank (2010 = 100)", U.idx,
    "Chỉ số giá bình quân gia quyền của dầu thô, khí thiên nhiên và than (trọng số theo giá trị xuất khẩu toàn cầu), tính theo USD danh nghĩa, 2010 = 100.",
    [
      "Biến cú sốc giá năng lượng tổng hợp trong mô hình lạm phát nhập khẩu (truyền dẫn sang CPI Việt Nam).",
      "Thay thế cho giá dầu khi muốn bao quát cả khí và than.",
    ]),
  c("chi-so-gia-luong-thuc", "PINK_FOOD_INDEX", "chỉ số giá lương thực, thực phẩm thế giới", "Chỉ số giá lương thực, thực phẩm thế giới của World Bank (2010 = 100)", U.idx,
    "Chỉ số giá tổng hợp của ngũ cốc, dầu thực vật – khô dầu và các thực phẩm khác (đường, thịt, trái cây…), tính theo USD danh nghĩa, 2010 = 100.",
    [
      "Biến cú sốc giá lương thực thế giới trong mô hình về lạm phát lương thực trong nước, an ninh lương thực.",
      "Phân tích tác động của giá lương thực thế giới đến nghèo và chi tiêu hộ gia đình.",
    ]),
  c("chi-so-gia-phan-bon", "PINK_FERTILIZERS_INDEX", "chỉ số giá phân bón thế giới", "Chỉ số giá phân bón thế giới của World Bank (2010 = 100)", U.idx,
    "Chỉ số giá tổng hợp của urê, DAP, TSP, kali clorua và quặng phosphat, tính theo USD danh nghĩa, 2010 = 100.",
    [
      "Biến chi phí đầu vào nông nghiệp tổng hợp trong đề tài về lợi nhuận và năng suất trồng trọt.",
      "Phân tích truyền dẫn giá năng lượng sang giá phân bón và giá lương thực.",
    ]),
  c("chi-so-gia-kim-loai", "PINK_METALS_AND_MINERALS_INDEX", "chỉ số giá kim loại và khoáng sản", "Chỉ số giá kim loại và khoáng sản thế giới của World Bank (2010 = 100)", U.idx,
    "Chỉ số giá tổng hợp của nhôm, đồng, quặng sắt, chì, niken, thiếc, kẽm, tính theo USD danh nghĩa, 2010 = 100 (không gồm kim loại quý).",
    [
      "Biến chu kỳ cầu công nghiệp toàn cầu trong mô hình về xuất khẩu, sản xuất công nghiệp của Việt Nam.",
      "Biến chi phí nguyên liệu cho ngành xây dựng, cơ khí.",
    ]),
  c("chi-so-gia-nong-san", "PINK_AGRICULTURE_INDEX", "chỉ số giá nông sản thế giới", "Chỉ số giá nông sản thế giới của World Bank (2010 = 100)", U.idx,
    "Chỉ số giá tổng hợp của đồ uống (cà phê, ca cao, chè), lương thực – thực phẩm và nguyên liệu thô nông nghiệp (gỗ, bông, cao su…), tính theo USD danh nghĩa, 2010 = 100.",
    [
      "Biến điều kiện thương mại nông sản trong đề tài về xuất khẩu nông sản của Việt Nam.",
      "Phân tích đồng biến động giữa giá nông sản và giá năng lượng.",
    ]),
];
