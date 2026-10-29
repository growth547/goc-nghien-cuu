// Editorial list of World Bank WDI indicators published under /du-lieu/.
// The fetch script (scripts/fetch-worldbank.mjs) merges these fields with the live series.
// To add an indicator: append an entry here (code must exist for VNM in WDI), then re-run the fetch script.
//
// Fields: slug (file name, ascii kebab), code (World Bank code), theme (must be one of THEMES and of
// DATASET_THEMES in src/content.config.ts), shortVi (used in the page title "Số liệu <shortVi> Việt Nam..."),
// nameVi, unit (unit of the raw value in the CSV), scale + displayUnit + decimals (how the page shows values),
// explanation (what the indicator measures), thesisUse (how theses typically use it).

export const THEMES = [
  "Tăng trưởng & cơ cấu kinh tế",
  "Giá cả, lao động & thu nhập",
  "Thương mại & đầu tư nước ngoài",
  "Tài chính – ngân hàng",
  "Dân số & đô thị hoá",
  "Công nghệ & chuyển đổi số",
  "Giáo dục & y tế",
  "Năng lượng & môi trường",
];

const pctGdp = { unit: "% GDP", scale: 1, displayUnit: "% GDP", decimals: 2 };

export const INDICATORS = [
  // Tăng trưởng & cơ cấu kinh tế
  {
    slug: "gdp",
    code: "NY.GDP.MKTP.CD",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "GDP",
    nameVi: "Tổng sản phẩm trong nước (GDP), giá hiện hành",
    unit: "USD, giá hiện hành",
    scale: 1e9,
    displayUnit: "tỷ USD",
    decimals: 1,
    explanation:
      "GDP đo tổng giá trị hàng hoá và dịch vụ cuối cùng được tạo ra trong lãnh thổ Việt Nam trong một năm, quy đổi sang đô la Mỹ theo giá hiện hành (chưa loại trừ lạm phát). Đây là thước đo quy mô nền kinh tế, dùng để so sánh Việt Nam với các nước khác.",
    thesisUse: [
      "Biến kiểm soát quy mô nền kinh tế trong mô hình hồi quy chuỗi thời gian; thường lấy logarit (ln GDP) trước khi đưa vào mô hình.",
      "Mẫu số khi tự tính các tỷ lệ như tín dụng/GDP, xuất khẩu/GDP. Muốn so sánh tăng trưởng thực thì dùng chuỗi tăng trưởng GDP thay vì GDP giá hiện hành.",
    ],
  },
  {
    slug: "tang-truong-gdp",
    code: "NY.GDP.MKTP.KD.ZG",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "tăng trưởng GDP",
    nameVi: "Tốc độ tăng trưởng GDP (giá so sánh)",
    unit: "%/năm",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Tốc độ tăng GDP thực so với năm trước, tính theo giá cố định nên đã loại bỏ ảnh hưởng của biến động giá. Đây là chỉ tiêu tăng trưởng kinh tế được trích dẫn nhiều nhất.",
    thesisUse: [
      "Biến phụ thuộc trong các đề tài về tác động của FDI, xuất khẩu, đầu tư công, tín dụng đến tăng trưởng kinh tế (mô hình ARDL, VAR, OLS chuỗi thời gian).",
      "Biến kiểm soát chu kỳ kinh tế trong các nghiên cứu ngân hàng (nợ xấu, lợi nhuận ngân hàng) dùng dữ liệu bảng.",
    ],
  },
  {
    slug: "gdp-binh-quan-dau-nguoi",
    code: "NY.GDP.PCAP.CD",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "GDP bình quân đầu người",
    nameVi: "GDP bình quân đầu người, giá hiện hành",
    unit: "USD/người, giá hiện hành",
    scale: 1,
    displayUnit: "USD",
    decimals: 0,
    explanation:
      "GDP chia cho dân số giữa năm, tính bằng đô la Mỹ theo giá hiện hành. Chỉ tiêu phản ánh mức thu nhập bình quân và thường dùng để xếp nhóm thu nhập quốc gia.",
    thesisUse: [
      "Đại diện cho mức sống hoặc trình độ phát triển trong các đề tài về tiêu dùng, du lịch, chuyển đổi số, môi trường (ví dụ kiểm định đường cong Kuznets môi trường với CO2).",
      "Khi so sánh sức mua giữa các nước, nên dùng chuỗi GDP bình quân đầu người theo PPP.",
    ],
  },
  {
    slug: "gdp-binh-quan-dau-nguoi-ppp",
    code: "NY.GDP.PCAP.PP.CD",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "GDP bình quân đầu người theo PPP",
    nameVi: "GDP bình quân đầu người theo sức mua tương đương (PPP)",
    unit: "USD quốc tế/người, PPP giá hiện hành",
    scale: 1,
    displayUnit: "USD PPP",
    decimals: 0,
    explanation:
      "GDP bình quân đầu người quy đổi theo sức mua tương đương (PPP), tức là đã điều chỉnh chênh lệch mặt bằng giá giữa các nước. Một đô la quốc tế mua được lượng hàng hoá như một đô la Mỹ tại Mỹ.",
    thesisUse: [
      "Phù hợp hơn GDP bình quân theo tỷ giá khi so sánh mức sống giữa Việt Nam và các nước khác trong dữ liệu bảng đa quốc gia.",
    ],
  },
  {
    slug: "ty-trong-nong-nghiep",
    code: "NV.AGR.TOTL.ZS",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "tỷ trọng nông nghiệp trong GDP",
    nameVi: "Giá trị tăng thêm ngành nông, lâm nghiệp và thuỷ sản (% GDP)",
    ...pctGdp,
    explanation:
      "Phần đóng góp của khu vực nông, lâm nghiệp và thuỷ sản vào GDP. Tỷ trọng này giảm dần là dấu hiệu của quá trình chuyển dịch cơ cấu kinh tế sang công nghiệp và dịch vụ.",
    thesisUse: [
      "Mô tả chuyển dịch cơ cấu kinh tế trong chương bối cảnh; làm biến cơ cấu ngành trong các mô hình tăng trưởng, việc làm, phát thải.",
    ],
  },
  {
    slug: "ty-trong-cong-nghiep",
    code: "NV.IND.TOTL.ZS",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "tỷ trọng công nghiệp trong GDP",
    nameVi: "Giá trị tăng thêm ngành công nghiệp và xây dựng (% GDP)",
    ...pctGdp,
    explanation:
      "Phần đóng góp của công nghiệp (khai khoáng, chế biến chế tạo, điện, nước) và xây dựng vào GDP.",
    thesisUse: [
      "Đo mức độ công nghiệp hoá; hay dùng làm biến giải thích trong các đề tài về phát thải CO2, tiêu thụ năng lượng và tăng trưởng.",
    ],
  },
  {
    slug: "ty-trong-dich-vu",
    code: "NV.SRV.TOTL.ZS",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "tỷ trọng dịch vụ trong GDP",
    nameVi: "Giá trị tăng thêm khu vực dịch vụ (% GDP)",
    ...pctGdp,
    explanation:
      "Phần đóng góp của khu vực dịch vụ (thương mại, vận tải, tài chính, du lịch, giáo dục, y tế...) vào GDP.",
    thesisUse: [
      "Mô tả cơ cấu kinh tế trong chương tổng quan; biến kiểm soát trong các đề tài về du lịch, tài chính, thương mại điện tử.",
    ],
  },
  {
    slug: "tong-tich-luy-tai-san",
    code: "NE.GDI.TOTL.ZS",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "tổng tích luỹ tài sản (đầu tư) so với GDP",
    nameVi: "Tổng tích luỹ tài sản (% GDP)",
    ...pctGdp,
    explanation:
      "Tổng tích luỹ tài sản (gross capital formation) gồm chi đầu tư vào tài sản cố định cộng với thay đổi hàng tồn kho của toàn nền kinh tế, tính theo % GDP. Đây là đại diện phổ biến cho tỷ lệ đầu tư của nền kinh tế.",
    thesisUse: [
      "Đại diện cho vốn đầu tư (biến K) trong các mô hình hàm sản xuất và tăng trưởng kinh tế.",
    ],
  },

  // Giá cả, lao động & thu nhập
  {
    slug: "lam-phat",
    code: "FP.CPI.TOTL.ZG",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "lạm phát (CPI)",
    nameVi: "Lạm phát theo chỉ số giá tiêu dùng (CPI)",
    unit: "%/năm",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Tốc độ thay đổi hằng năm của chỉ số giá tiêu dùng (CPI), tức mức tăng giá bình quân của giỏ hàng hoá và dịch vụ mà hộ gia đình mua. Đây là thước đo lạm phát được dùng rộng rãi nhất.",
    thesisUse: [
      "Biến kiểm soát vĩ mô gần như bắt buộc trong các đề tài ngân hàng (lợi nhuận, nợ xấu, rủi ro tín dụng) và thị trường chứng khoán.",
      "Biến phụ thuộc trong các đề tài về tác động của cung tiền, tỷ giá, giá dầu đến lạm phát (mô hình VAR/ARDL).",
    ],
  },
  {
    slug: "ty-le-that-nghiep",
    code: "SL.UEM.TOTL.ZS",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ thất nghiệp",
    nameVi: "Tỷ lệ thất nghiệp (ước tính theo mô hình của ILO)",
    unit: "% lực lượng lao động",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Tỷ lệ người trong lực lượng lao động không có việc làm nhưng đang tìm việc và sẵn sàng làm việc. Số liệu là ước tính theo mô hình của Tổ chức Lao động Quốc tế (ILO) nên có thể khác số liệu do Tổng cục Thống kê công bố.",
    thesisUse: [
      "Biến kiểm soát vĩ mô trong các đề tài về nợ xấu, tiêu dùng, tội phạm; kiểm định quy luật Okun hoặc đường cong Phillips cho Việt Nam.",
    ],
  },
  {
    slug: "ty-le-tham-gia-luc-luong-lao-dong",
    code: "SL.TLF.CACT.ZS",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ tham gia lực lượng lao động",
    nameVi: "Tỷ lệ tham gia lực lượng lao động (dân số từ 15 tuổi trở lên, ước tính của ILO)",
    unit: "% dân số từ 15 tuổi trở lên",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Tỷ lệ dân số từ 15 tuổi trở lên đang làm việc hoặc đang tìm việc. Số liệu là ước tính theo mô hình của ILO.",
    thesisUse: [
      "Đại diện cho nguồn lao động (biến L) trong mô hình hàm sản xuất; mô tả thị trường lao động trong chương bối cảnh.",
    ],
  },
  {
    slug: "he-so-gini",
    code: "SI.POV.GINI",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "hệ số Gini",
    nameVi: "Chỉ số Gini (bất bình đẳng thu nhập/chi tiêu)",
    unit: "điểm, thang 0–100",
    scale: 1,
    displayUnit: "điểm",
    decimals: 1,
    explanation:
      "Chỉ số Gini đo mức bất bình đẳng trong phân phối thu nhập hoặc chi tiêu: 0 là hoàn toàn bình đẳng, 100 là hoàn toàn bất bình đẳng. Số liệu tính từ các cuộc khảo sát mức sống hộ gia đình nên chỉ có ở một số năm.",
    thesisUse: [
      "Mô tả bất bình đẳng trong các đề tài về giảm nghèo, tăng trưởng bao trùm, tài chính toàn diện. Chuỗi ngắn và có năm trống nên chủ yếu dùng để mô tả, không đủ cho hồi quy chuỗi thời gian.",
    ],
  },
  {
    slug: "ty-le-ngheo",
    code: "SI.POV.DDAY",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ nghèo",
    nameVi: "Tỷ lệ nghèo theo chuẩn nghèo cùng cực quốc tế của World Bank",
    unit: "% dân số",
    scale: 1,
    displayUnit: "%",
    decimals: 1,
    explanation:
      "Tỷ lệ dân số sống dưới chuẩn nghèo cùng cực quốc tế của World Bank (mức chi tiêu mỗi ngày theo sức mua tương đương; mức chuẩn cụ thể ghi trong tên tiếng Anh của chỉ tiêu). Đây là chuẩn quốc tế, khác chuẩn nghèo đa chiều của Việt Nam.",
    thesisUse: [
      "Mô tả thành tựu giảm nghèo và so sánh quốc tế. Khi viết về chính sách trong nước, nên đối chiếu thêm tỷ lệ hộ nghèo theo chuẩn của Việt Nam.",
    ],
  },

  // Thương mại & đầu tư nước ngoài
  {
    slug: "fdi",
    code: "BX.KLT.DINV.CD.WD",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "FDI vào Việt Nam",
    nameVi: "Đầu tư trực tiếp nước ngoài (FDI), dòng vốn vào ròng",
    unit: "USD, giá hiện hành (cán cân thanh toán)",
    scale: 1e9,
    displayUnit: "tỷ USD",
    decimals: 2,
    explanation:
      "Dòng vốn FDI vào ròng theo cán cân thanh toán: vốn mới của nhà đầu tư nước ngoài cộng lợi nhuận tái đầu tư và vay nội bộ công ty, trừ phần rút vốn. Số liệu này gần với FDI giải ngân, không phải FDI đăng ký mà Cục Đầu tư nước ngoài hay công bố.",
    thesisUse: [
      "Biến giải thích chính trong các đề tài về tác động của FDI đến tăng trưởng, xuất khẩu, việc làm, môi trường (giả thuyết nơi trú ẩn ô nhiễm). Thường lấy logarit hoặc dùng chuỗi FDI/GDP.",
    ],
  },
  {
    slug: "fdi-phan-tram-gdp",
    code: "BX.KLT.DINV.WD.GD.ZS",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "FDI so với GDP",
    nameVi: "Đầu tư trực tiếp nước ngoài, dòng vốn vào ròng (% GDP)",
    ...pctGdp,
    explanation:
      "Dòng vốn FDI vào ròng chia cho GDP. Chuẩn hoá theo quy mô nền kinh tế nên dễ so sánh giữa các năm và giữa các nước hơn số tuyệt đối.",
    thesisUse: [
      "Dạng biến FDI hay dùng nhất trong hồi quy tăng trưởng và mô hình dữ liệu bảng đa quốc gia, vì tránh được vấn đề quy mô và đơn vị tiền tệ.",
    ],
  },
  {
    slug: "xuat-khau-phan-tram-gdp",
    code: "NE.EXP.GNFS.ZS",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "xuất khẩu so với GDP",
    nameVi: "Xuất khẩu hàng hoá và dịch vụ (% GDP)",
    ...pctGdp,
    explanation:
      "Giá trị xuất khẩu hàng hoá và dịch vụ chia cho GDP. Việt Nam thuộc nhóm nền kinh tế có tỷ lệ này rất cao, phản ánh mức độ phụ thuộc vào thị trường bên ngoài.",
    thesisUse: [
      "Biến giải thích trong các đề tài kiểm định giả thuyết tăng trưởng dựa vào xuất khẩu (export-led growth); biến kiểm soát độ mở nền kinh tế.",
    ],
  },
  {
    slug: "nhap-khau-phan-tram-gdp",
    code: "NE.IMP.GNFS.ZS",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "nhập khẩu so với GDP",
    nameVi: "Nhập khẩu hàng hoá và dịch vụ (% GDP)",
    ...pctGdp,
    explanation:
      "Giá trị nhập khẩu hàng hoá và dịch vụ chia cho GDP. Với Việt Nam, nhập khẩu gắn chặt với xuất khẩu vì nhiều ngành gia công, lắp ráp nhập nguyên liệu và linh kiện.",
    thesisUse: [
      "Dùng cùng xuất khẩu để tính cán cân thương mại; biến giải thích trong các đề tài về tỷ giá và cán cân thương mại (hiệu ứng tuyến J).",
    ],
  },
  {
    slug: "do-mo-thuong-mai",
    code: "NE.TRD.GNFS.ZS",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "độ mở thương mại",
    nameVi: "Độ mở thương mại: tổng xuất nhập khẩu (% GDP)",
    ...pctGdp,
    explanation:
      "Tổng giá trị xuất khẩu và nhập khẩu hàng hoá, dịch vụ chia cho GDP. Tỷ lệ trên 100% cho thấy nền kinh tế có độ mở rất lớn.",
    thesisUse: [
      "Biến độ mở thương mại (trade openness) chuẩn trong các mô hình tăng trưởng, FDI, môi trường và phát triển tài chính.",
    ],
  },
  {
    slug: "no-nuoc-ngoai",
    code: "DT.DOD.DECT.CD",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "nợ nước ngoài",
    nameVi: "Tổng nợ nước ngoài",
    unit: "USD, giá hiện hành",
    scale: 1e9,
    displayUnit: "tỷ USD",
    decimals: 1,
    explanation:
      "Tổng dư nợ phải trả cho người không cư trú bằng ngoại tệ, hàng hoá hoặc dịch vụ, gồm nợ công và nợ được bảo lãnh, nợ tư nhân không được bảo lãnh, tín dụng IMF và nợ ngắn hạn.",
    thesisUse: [
      "Biến giải thích trong các đề tài về nợ nước ngoài và tăng trưởng, rủi ro tỷ giá; nên chia cho GDP trước khi đưa vào mô hình.",
    ],
  },
  {
    slug: "du-tru-ngoai-hoi",
    code: "FI.RES.TOTL.CD",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "dự trữ ngoại hối",
    nameVi: "Tổng dự trữ quốc tế (bao gồm vàng)",
    unit: "USD, giá hiện hành",
    scale: 1e9,
    displayUnit: "tỷ USD",
    decimals: 1,
    explanation:
      "Tổng tài sản dự trữ do ngân hàng trung ương nắm giữ: ngoại tệ, vàng tiền tệ, quyền rút vốn đặc biệt (SDR) và vị thế dự trữ tại IMF.",
    thesisUse: [
      "Biến giải thích trong các đề tài về ổn định tỷ giá, chính sách tiền tệ và khả năng chống chịu cú sốc bên ngoài.",
    ],
  },

  // Tài chính – ngân hàng
  {
    slug: "lai-suat-cho-vay",
    code: "FR.INR.LEND",
    theme: "Tài chính – ngân hàng",
    shortVi: "lãi suất cho vay",
    nameVi: "Lãi suất cho vay bình quân",
    unit: "%/năm",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Lãi suất bình quân mà các ngân hàng áp dụng cho các khoản vay ngắn và trung hạn của khu vực tư nhân, theo số liệu Thống kê Tài chính Quốc tế (IFS) của IMF.",
    thesisUse: [
      "Biến kiểm soát chi phí vốn trong các đề tài về đầu tư doanh nghiệp, tín dụng, nợ xấu, giá nhà và thị trường chứng khoán.",
      "Chuỗi có thể dừng sớm hơn các chỉ tiêu khác; nếu cần số liệu mới hơn, bổ sung từ báo cáo của Ngân hàng Nhà nước và ghi rõ nguồn.",
    ],
  },
  {
    slug: "lai-suat-tien-gui",
    code: "FR.INR.DPST",
    theme: "Tài chính – ngân hàng",
    shortVi: "lãi suất tiền gửi",
    nameVi: "Lãi suất tiền gửi bình quân",
    unit: "%/năm",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Lãi suất bình quân các ngân hàng trả cho tiền gửi không kỳ hạn, có kỳ hạn hoặc tiết kiệm, theo số liệu IFS của IMF.",
    thesisUse: [
      "Dùng cùng lãi suất cho vay để tính chênh lệch lãi suất (lending–deposit spread), đại diện cho hiệu quả trung gian của hệ thống ngân hàng.",
    ],
  },
  {
    slug: "lai-suat-thuc",
    code: "FR.INR.RINR",
    theme: "Tài chính – ngân hàng",
    shortVi: "lãi suất thực",
    nameVi: "Lãi suất thực (lãi suất cho vay đã điều chỉnh lạm phát)",
    unit: "%/năm",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Lãi suất cho vay sau khi đã điều chỉnh lạm phát, với lạm phát đo bằng chỉ số giảm phát GDP. Lãi suất thực âm nghĩa là lạm phát cao hơn lãi suất danh nghĩa.",
    thesisUse: [
      "Biến chi phí vốn thực trong các đề tài về đầu tư, tiết kiệm và tăng trưởng; tốt hơn lãi suất danh nghĩa khi giai đoạn nghiên cứu có lạm phát biến động mạnh.",
    ],
  },
  {
    slug: "tin-dung-khu-vuc-tu-nhan",
    code: "FS.AST.PRVT.GD.ZS",
    theme: "Tài chính – ngân hàng",
    shortVi: "tín dụng cho khu vực tư nhân so với GDP",
    nameVi: "Tín dụng trong nước cho khu vực tư nhân (% GDP)",
    unit: "% GDP",
    scale: 1,
    displayUnit: "% GDP",
    decimals: 1,
    explanation:
      "Các khoản cho vay, mua chứng khoán phi cổ phần, tín dụng thương mại và các khoản phải thu khác mà các tổ chức tài chính cấp cho khu vực tư nhân, chia cho GDP.",
    thesisUse: [
      "Đại diện phổ biến nhất cho mức độ phát triển tài chính (financial development) trong các đề tài về tài chính và tăng trưởng, tài chính và môi trường.",
    ],
  },
  {
    slug: "cung-tien-m2",
    code: "FM.LBL.BMNY.GD.ZS",
    theme: "Tài chính – ngân hàng",
    shortVi: "cung tiền M2 so với GDP",
    nameVi: "Cung tiền mở rộng (M2) (% GDP)",
    ...pctGdp,
    explanation:
      "Cung tiền mở rộng gồm tiền mặt ngoài hệ thống ngân hàng, tiền gửi không kỳ hạn, có kỳ hạn, tiết kiệm và tiền gửi ngoại tệ của khu vực ngoài ngân hàng trung ương, chia cho GDP.",
    thesisUse: [
      "Đại diện cho chính sách tiền tệ hoặc độ sâu tài chính trong các đề tài về lạm phát, tăng trưởng và thị trường chứng khoán.",
    ],
  },
  {
    slug: "ty-gia",
    code: "PA.NUS.FCRF",
    theme: "Tài chính – ngân hàng",
    shortVi: "tỷ giá USD/VND",
    nameVi: "Tỷ giá chính thức VND/USD (bình quân năm)",
    unit: "VND/USD, bình quân năm",
    scale: 1,
    displayUnit: "VND/USD",
    decimals: 0,
    explanation:
      "Tỷ giá chính thức do cơ quan quản lý công bố, tính bình quân các tháng trong năm, biểu thị số đồng Việt Nam đổi được một đô la Mỹ. Tỷ giá tăng nghĩa là VND mất giá.",
    thesisUse: [
      "Biến giải thích trong các đề tài về xuất nhập khẩu, cán cân thương mại, lạm phát (truyền dẫn tỷ giá) và thị trường chứng khoán.",
      "Dùng để quy đổi các số liệu tính bằng VND sang USD theo năm.",
    ],
  },
  {
    slug: "chi-nhanh-ngan-hang",
    code: "FB.CBK.BRCH.P5",
    theme: "Tài chính – ngân hàng",
    shortVi: "số chi nhánh ngân hàng trên 100.000 người trưởng thành",
    nameVi: "Số chi nhánh ngân hàng thương mại trên 100.000 người trưởng thành",
    unit: "chi nhánh/100.000 người trưởng thành",
    scale: 1,
    displayUnit: "chi nhánh",
    decimals: 2,
    explanation:
      "Số chi nhánh ngân hàng thương mại tính trên 100.000 người từ 15 tuổi trở lên, theo khảo sát Tiếp cận tài chính (Financial Access Survey) của IMF.",
    thesisUse: [
      "Đại diện cho khả năng tiếp cận dịch vụ ngân hàng trong các đề tài về tài chính toàn diện (financial inclusion).",
    ],
  },

  // Dân số & đô thị hoá
  {
    slug: "dan-so",
    code: "SP.POP.TOTL",
    theme: "Dân số & đô thị hoá",
    shortVi: "dân số",
    nameVi: "Tổng dân số",
    unit: "người",
    scale: 1e6,
    displayUnit: "triệu người",
    decimals: 2,
    explanation:
      "Tổng số người cư trú tại Việt Nam, không phân biệt quốc tịch hay tình trạng pháp lý, tính vào giữa năm.",
    thesisUse: [
      "Mẫu số để tự tính các chỉ tiêu bình quân đầu người; biến kiểm soát quy mô thị trường trong các đề tài về FDI, tiêu dùng.",
    ],
  },
  {
    slug: "ty-le-dan-so-do-thi",
    code: "SP.URB.TOTL.IN.ZS",
    theme: "Dân số & đô thị hoá",
    shortVi: "tỷ lệ dân số đô thị",
    nameVi: "Tỷ lệ dân số đô thị",
    unit: "% tổng dân số",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Tỷ lệ dân số sống ở khu vực đô thị theo định nghĩa của cơ quan thống kê quốc gia, do Liên Hợp Quốc ước tính và chuẩn hoá.",
    thesisUse: [
      "Biến đô thị hoá trong các đề tài về tiêu thụ năng lượng, phát thải CO2, tăng trưởng và thị trường bất động sản.",
    ],
  },
  {
    slug: "tuoi-tho-trung-binh",
    code: "SP.DYN.LE00.IN",
    theme: "Dân số & đô thị hoá",
    shortVi: "tuổi thọ trung bình",
    nameVi: "Tuổi thọ trung bình tính từ lúc sinh",
    unit: "năm",
    scale: 1,
    displayUnit: "năm",
    decimals: 1,
    explanation:
      "Số năm trung bình một trẻ sơ sinh sẽ sống nếu tỷ lệ tử vong theo độ tuổi của năm đó không đổi trong suốt cuộc đời.",
    thesisUse: [
      "Đại diện cho sức khoẻ dân số và vốn con người trong các đề tài về y tế, tăng trưởng và phát triển bền vững.",
    ],
  },

  // Công nghệ & chuyển đổi số
  {
    slug: "nguoi-dung-internet",
    code: "IT.NET.USER.ZS",
    theme: "Công nghệ & chuyển đổi số",
    shortVi: "tỷ lệ người dùng Internet",
    nameVi: "Tỷ lệ người sử dụng Internet",
    unit: "% dân số",
    scale: 1,
    displayUnit: "%",
    decimals: 1,
    explanation:
      "Tỷ lệ dân số đã sử dụng Internet trong 3 tháng gần nhất, qua bất kỳ thiết bị nào, theo số liệu của Liên minh Viễn thông Quốc tế (ITU).",
    thesisUse: [
      "Số liệu bối cảnh cho các đề tài về thương mại điện tử, ngân hàng số, mạng xã hội, chuyển đổi số; biến công nghệ trong mô hình tăng trưởng.",
    ],
  },
  {
    slug: "thue-bao-di-dong",
    code: "IT.CEL.SETS.P2",
    theme: "Công nghệ & chuyển đổi số",
    shortVi: "số thuê bao di động trên 100 dân",
    nameVi: "Số thuê bao điện thoại di động trên 100 dân",
    unit: "thuê bao/100 dân",
    scale: 1,
    displayUnit: "thuê bao",
    decimals: 1,
    explanation:
      "Số thuê bao di động đang hoạt động (trả trước và trả sau) tính trên 100 dân, theo ITU. Có thể vượt 100 vì một người dùng nhiều SIM.",
    thesisUse: [
      "Số liệu bối cảnh cho các đề tài về ví điện tử, thanh toán di động, ứng dụng gọi xe, giao đồ ăn.",
    ],
  },

  // Giáo dục & y tế
  {
    slug: "ty-le-nhap-hoc-dai-hoc",
    code: "SE.TER.ENRR",
    theme: "Giáo dục & y tế",
    shortVi: "tỷ lệ nhập học đại học",
    nameVi: "Tỷ lệ nhập học giáo dục đại học (tỷ lệ thô)",
    unit: "% dân số trong độ tuổi đại học",
    scale: 1,
    displayUnit: "%",
    decimals: 1,
    explanation:
      "Tổng số người đang học ở bậc sau phổ thông (cao đẳng, đại học, sau đại học), không phân biệt tuổi, chia cho dân số trong 5 năm tuổi ngay sau tuổi tốt nghiệp phổ thông, theo UNESCO.",
    thesisUse: [
      "Đại diện cho vốn con người trong các mô hình tăng trưởng; số liệu bối cảnh cho các đề tài về giáo dục đại học, học trực tuyến.",
    ],
  },
  {
    slug: "chi-tieu-giao-duc",
    code: "SE.XPD.TOTL.GD.ZS",
    theme: "Giáo dục & y tế",
    shortVi: "chi tiêu công cho giáo dục so với GDP",
    nameVi: "Chi tiêu của Chính phủ cho giáo dục (% GDP)",
    ...pctGdp,
    explanation:
      "Tổng chi của Chính phủ (trung ương và địa phương) cho giáo dục, gồm chi thường xuyên và chi đầu tư, chia cho GDP, theo UNESCO.",
    thesisUse: [
      "Biến đầu tư công cho vốn con người trong các đề tài về tăng trưởng và chất lượng giáo dục; chuỗi ngắn nên phù hợp mô tả hơn hồi quy.",
    ],
  },
  {
    slug: "chi-tieu-y-te",
    code: "SH.XPD.CHEX.GD.ZS",
    theme: "Giáo dục & y tế",
    shortVi: "chi tiêu y tế so với GDP",
    nameVi: "Chi tiêu y tế thường xuyên (% GDP)",
    ...pctGdp,
    explanation:
      "Tổng chi cho hàng hoá và dịch vụ y tế tiêu dùng trong năm (từ ngân sách, bảo hiểm y tế và hộ gia đình), chưa gồm chi đầu tư, chia cho GDP, theo Tổ chức Y tế Thế giới (WHO).",
    thesisUse: [
      "Biến giải thích trong các đề tài về sức khoẻ, tuổi thọ và vốn con người; số liệu bối cảnh cho các đề tài về bệnh viện, bảo hiểm y tế.",
    ],
  },
  {
    slug: "chi-tieu-y-te-tu-tui",
    code: "SH.XPD.OOPC.CH.ZS",
    theme: "Giáo dục & y tế",
    shortVi: "chi tiêu y tế từ tiền túi hộ gia đình",
    nameVi: "Chi tiêu y tế trực tiếp từ tiền túi hộ gia đình (% tổng chi y tế thường xuyên)",
    unit: "% chi tiêu y tế thường xuyên",
    scale: 1,
    displayUnit: "%",
    decimals: 1,
    explanation:
      "Phần chi phí y tế người dân tự trả trực tiếp khi sử dụng dịch vụ (không qua bảo hiểm), tính theo % tổng chi y tế thường xuyên, theo WHO. Tỷ lệ cao cho thấy gánh nặng tài chính y tế đè lên hộ gia đình.",
    thesisUse: [
      "Số liệu bối cảnh cho các đề tài về bảo hiểm y tế, bảo hiểm sức khoẻ, sự hài lòng với dịch vụ bệnh viện.",
    ],
  },

  // Năng lượng & môi trường
  {
    slug: "phat-thai-co2-binh-quan",
    code: "EN.GHG.CO2.PC.CE.AR5",
    theme: "Năng lượng & môi trường",
    shortVi: "phát thải CO2 bình quân đầu người",
    nameVi: "Phát thải CO2 bình quân đầu người (không gồm sử dụng đất và lâm nghiệp)",
    unit: "tấn CO2e/người",
    scale: 1,
    displayUnit: "tấn/người",
    decimals: 2,
    explanation:
      "Lượng khí CO2 phát thải bình quân mỗi người trong năm, chủ yếu từ đốt nhiên liệu hoá thạch và sản xuất công nghiệp, không tính phát thải và hấp thụ từ sử dụng đất, thay đổi sử dụng đất và lâm nghiệp (LULUCF).",
    thesisUse: [
      "Biến phụ thuộc trong các đề tài kiểm định đường cong Kuznets môi trường (EKC), tác động của FDI, thương mại, năng lượng đến môi trường.",
    ],
  },
  {
    slug: "ty-le-tiep-can-dien",
    code: "EG.ELC.ACCS.ZS",
    theme: "Năng lượng & môi trường",
    shortVi: "tỷ lệ dân số được tiếp cận điện",
    nameVi: "Tỷ lệ dân số được tiếp cận điện",
    unit: "% dân số",
    scale: 1,
    displayUnit: "%",
    decimals: 1,
    explanation:
      "Tỷ lệ dân số có điện sinh hoạt, tổng hợp từ khảo sát hộ gia đình và số liệu ngành điện.",
    thesisUse: [
      "Số liệu bối cảnh cho các đề tài về phát triển nông thôn, giảm nghèo và năng lượng.",
    ],
  },
  {
    slug: "nang-luong-tai-tao",
    code: "EG.FEC.RNEW.ZS",
    theme: "Năng lượng & môi trường",
    shortVi: "tỷ trọng năng lượng tái tạo",
    nameVi: "Tỷ trọng năng lượng tái tạo trong tổng tiêu thụ năng lượng cuối cùng",
    unit: "% tổng tiêu thụ năng lượng cuối cùng",
    scale: 1,
    displayUnit: "%",
    decimals: 1,
    explanation:
      "Phần năng lượng tái tạo (thuỷ điện, sinh khối, mặt trời, gió...) trong tổng năng lượng tiêu thụ cuối cùng. Chuỗi thường có độ trễ vài năm so với các chỉ tiêu kinh tế.",
    thesisUse: [
      "Biến giải thích trong các đề tài về chuyển dịch năng lượng, phát thải CO2 và tăng trưởng xanh.",
    ],
  },
];
