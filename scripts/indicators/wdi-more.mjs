// Rich-page indicators from World Development Indicators added after the first 39
// (see ../worldbank-indicators.mjs for field documentation).
const pct = (decimals = 2) => ({ unit: "%", scale: 1, displayUnit: "%", decimals });
const pctGdp = { unit: "% GDP", scale: 1, displayUnit: "% GDP", decimals: 2 };
const usdBn = { unit: "USD, giá hiện hành", scale: 1e9, displayUnit: "tỷ USD", decimals: 1 };

export const WDI_MORE = [
  // ---------------------------------------------------------------- Tăng trưởng & cơ cấu kinh tế
  {
    slug: "gdp-gia-so-sanh",
    code: "NY.GDP.MKTP.KD",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "GDP thực (giá 2015)",
    nameVi: "GDP theo giá so sánh năm 2015 (USD)",
    unit: "USD, giá cố định 2015",
    scale: 1e9,
    displayUnit: "tỷ USD (giá 2015)",
    decimals: 1,
    explanation:
      "GDP đã loại bỏ biến động giá bằng cách quy về mặt bằng giá năm 2015 rồi đổi sang đô la Mỹ theo tỷ giá năm gốc. Vì giá cố định, chuỗi này cho biết sản lượng thực tăng bao nhiêu, khác với GDP giá hiện hành vốn tăng cả do lạm phát và tỷ giá.",
    thesisUse: [
      "Biến sản lượng thực trong hàm sản xuất Cobb–Douglas (ln Y = ln A + α ln K + β ln L), dùng cùng chuỗi vốn và lao động để ước lượng đóng góp của các nhân tố vào tăng trưởng.",
      "Lấy logarit rồi kiểm định nghiệm đơn vị (ADF, PP); chuỗi thường là I(1) nên phù hợp với kiểm định đồng liên kết Johansen hoặc ARDL bound test.",
    ],
  },
  {
    slug: "gni-binh-quan-dau-nguoi",
    code: "NY.GNP.PCAP.CD",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "GNI bình quân đầu người",
    nameVi: "Tổng thu nhập quốc gia (GNI) bình quân đầu người, phương pháp Atlas",
    unit: "USD/người, giá hiện hành (Atlas)",
    scale: 1,
    displayUnit: "USD",
    decimals: 0,
    explanation:
      "GNI bằng GDP cộng thu nhập ròng từ nước ngoài (lương, lợi nhuận, lãi). World Bank quy đổi sang USD bằng phương pháp Atlas (tỷ giá bình quân 3 năm có điều chỉnh lạm phát) để giảm ảnh hưởng của biến động tỷ giá ngắn hạn. Đây là chỉ tiêu World Bank dùng để xếp nhóm thu nhập: thấp, trung bình thấp, trung bình cao, cao.",
    thesisUse: [
      "Dẫn chứng bối cảnh trong chương tổng quan: Việt Nam thuộc nhóm thu nhập trung bình thấp và khoảng cách tới ngưỡng trung bình cao; đề tài về 'bẫy thu nhập trung bình' thường dùng chuỗi này.",
      "Khi nền kinh tế có nhiều doanh nghiệp FDI chuyển lợi nhuận về nước, chênh lệch GDP – GNI là bằng chứng định lượng về phần thu nhập không ở lại trong nước.",
    ],
  },
  {
    slug: "nang-suat-lao-dong",
    code: "SL.GDP.PCAP.EM.KD",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "năng suất lao động",
    nameVi: "GDP trên mỗi lao động có việc làm (PPP, giá 2021)",
    unit: "USD PPP giá cố định 2021/lao động",
    scale: 1,
    displayUnit: "USD PPP/lao động",
    decimals: 0,
    explanation:
      "GDP theo sức mua tương đương (giá cố định 2021) chia cho số người có việc làm. Đây là thước đo năng suất lao động tổng thể dùng để so sánh giữa các nước, vì đã loại bỏ cả khác biệt giá cả giữa các nước lẫn lạm phát theo thời gian.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về tác động của vốn con người, FDI, chuyển đổi số hoặc chuyển dịch cơ cấu lao động đến năng suất.",
      "So sánh với Thái Lan, Malaysia, Indonesia để minh hoạ khoảng cách năng suất của Việt Nam trong khu vực; nên dùng tốc độ tăng thay vì mức tuyệt đối khi chạy hồi quy chuỗi thời gian.",
    ],
  },
  {
    slug: "ty-trong-che-bien-che-tao",
    code: "NV.IND.MANF.ZS",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "tỷ trọng chế biến, chế tạo trong GDP",
    nameVi: "Giá trị tăng thêm ngành công nghiệp chế biến, chế tạo (% GDP)",
    ...pctGdp,
    explanation:
      "Phần GDP do ngành chế biến, chế tạo (ISIC mục C) tạo ra. Khác với tỷ trọng 'công nghiệp' nói chung, chỉ tiêu này không gồm khai khoáng, điện, nước và xây dựng, nên phản ánh sát hơn mức độ công nghiệp hoá.",
    thesisUse: [
      "Đo mức độ công nghiệp hoá trong các đề tài về chuyển dịch cơ cấu kinh tế, 'phi công nghiệp hoá sớm' hoặc vai trò của FDI trong chế biến chế tạo.",
      "Biến kiểm soát cơ cấu ngành trong mô hình phát thải CO2 hoặc tiêu thụ năng lượng, vì chế biến chế tạo tiêu tốn nhiều năng lượng hơn dịch vụ.",
    ],
  },
  {
    slug: "tieu-dung-ho-gia-dinh",
    code: "NE.CON.PRVT.ZS",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "tiêu dùng hộ gia đình so với GDP",
    nameVi: "Chi tiêu tiêu dùng cuối cùng của hộ gia đình (% GDP)",
    ...pctGdp,
    explanation:
      "Tỷ lệ chi tiêu cho hàng hoá, dịch vụ của hộ gia đình (gồm cả các tổ chức phi lợi nhuận phục vụ hộ gia đình) trên GDP theo phương pháp chi tiêu. Đây là cấu phần lớn nhất của tổng cầu, cho biết tăng trưởng dựa vào tiêu dùng trong nước đến mức nào.",
    thesisUse: [
      "Phân tích cơ cấu tổng cầu (C + I + G + NX) trong đề tài về động lực tăng trưởng; so sánh với tỷ lệ đầu tư và xuất khẩu.",
      "Biến kiểm soát trong mô hình về hành vi tiết kiệm, tín dụng tiêu dùng hoặc tác động của thu nhập đến tiêu dùng (hàm tiêu dùng Keynes).",
    ],
  },
  {
    slug: "tieu-dung-chinh-phu",
    code: "NE.CON.GOVT.ZS",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "chi tiêu dùng của Chính phủ so với GDP",
    nameVi: "Chi tiêu tiêu dùng cuối cùng của Chính phủ (% GDP)",
    ...pctGdp,
    explanation:
      "Chi tiêu thường xuyên của Nhà nước cho hàng hoá, dịch vụ (lương khu vực công, quốc phòng, hành chính…), tính theo % GDP. Không gồm chi đầu tư công (nằm trong tích luỹ tài sản) và chi chuyển giao.",
    thesisUse: [
      "Đại diện cho quy mô Chính phủ trong đề tài về quan hệ chi tiêu công và tăng trưởng (luật Wagner, giả thuyết Keynes) hoặc hiệu ứng lấn át đầu tư tư nhân.",
      "Biến chính sách tài khoá trong mô hình VAR cùng lãi suất và lạm phát khi thiếu chuỗi thu chi ngân sách dài hạn.",
    ],
  },
  {
    slug: "tiet-kiem-quoc-gia",
    code: "NY.GNS.ICTR.ZS",
    theme: "Tăng trưởng & cơ cấu kinh tế",
    shortVi: "tiết kiệm quốc gia so với GDP",
    nameVi: "Tổng tiết kiệm quốc gia (% GDP)",
    ...pctGdp,
    explanation:
      "Tổng tiết kiệm bằng thu nhập quốc dân khả dụng trừ tiêu dùng cuối cùng, cộng chuyển giao ròng, tính theo % GDP. Chênh lệch giữa tiết kiệm và đầu tư bằng cán cân vãng lai: tiết kiệm lớn hơn đầu tư nghĩa là nền kinh tế cho nước ngoài vay ròng.",
    thesisUse: [
      "Kiểm định câu đố Feldstein–Horioka (tương quan giữa tiết kiệm và đầu tư trong nước) để đánh giá mức độ hội nhập tài chính quốc tế.",
      "Biến giải thích trong mô hình tăng trưởng Solow mở rộng hoặc đề tài về tác động của già hoá dân số đến tiết kiệm.",
    ],
  },
  {
    slug: "lam-phat-chi-so-giam-phat",
    code: "NY.GDP.DEFL.KD.ZG",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "lạm phát theo chỉ số giảm phát GDP",
    nameVi: "Lạm phát tính theo chỉ số giảm phát GDP (%/năm)",
    unit: "%/năm",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Tốc độ tăng của chỉ số giảm phát GDP (GDP danh nghĩa chia GDP thực). Khác với CPI chỉ đo giá rổ hàng tiêu dùng, chỉ số giảm phát bao trùm giá của mọi hàng hoá, dịch vụ cuối cùng sản xuất trong nước, kể cả hàng đầu tư và xuất khẩu.",
    thesisUse: [
      "Dùng làm thước đo lạm phát thay thế để kiểm tra độ vững của kết quả khi mô hình chính dùng CPI.",
      "Chuyển chuỗi danh nghĩa sang chuỗi thực (ví dụ tín dụng, chi tiêu công) khi không có chỉ số giá riêng của từng khoản mục.",
    ],
  },
  {
    slug: "chi-so-gia-tieu-dung",
    code: "FP.CPI.TOTL",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "chỉ số giá tiêu dùng CPI",
    nameVi: "Chỉ số giá tiêu dùng (2010 = 100)",
    unit: "chỉ số, 2010 = 100",
    scale: 1,
    displayUnit: "điểm (2010 = 100)",
    decimals: 1,
    explanation:
      "Mức giá chung của rổ hàng hoá, dịch vụ tiêu dùng, lấy năm 2010 bằng 100. Chuỗi mức giá này dùng để giảm phát các biến danh nghĩa; tốc độ tăng của nó chính là lạm phát CPI.",
    thesisUse: [
      "Giảm phát lương, thu nhập, doanh thu, giá nhà… về giá cố định trước khi chạy hồi quy (giá trị thực = danh nghĩa / CPI × 100).",
      "Tính tỷ giá thực song phương RER = e × P*/P khi kết hợp với CPI của nước đối tác; cần đưa hai chuỗi về cùng năm gốc.",
    ],
  },
  {
    slug: "ty-le-ngheo-4-2-usd",
    code: "SI.POV.LMIC",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ nghèo theo chuẩn 4,20 USD/ngày",
    nameVi: "Tỷ lệ dân số sống dưới 4,20 USD/ngày (PPP 2021)",
    ...pct(1),
    explanation:
      "Tỷ lệ dân số có mức chi tiêu bình quân dưới 4,20 USD/người/ngày theo sức mua năm 2021, chuẩn nghèo World Bank dùng cho nhóm nước thu nhập trung bình thấp như Việt Nam. Số liệu tính từ Khảo sát mức sống dân cư (VHLSS), chỉ có ở các năm khảo sát.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về tăng trưởng vì người nghèo, tác động của kiều hối, tín dụng vi mô hoặc chi tiêu công đến giảm nghèo.",
      "Vì chỉ có các năm khảo sát (cách 2 năm), không nên nội suy để chạy chuỗi thời gian; phù hợp hơn để mô tả xu hướng hoặc dùng trong dữ liệu bảng nhiều nước.",
    ],
  },
  {
    slug: "thu-nhap-10-giau-nhat",
    code: "SI.DST.10TH.10",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ trọng thu nhập của 10% giàu nhất",
    nameVi: "Tỷ trọng thu nhập (chi tiêu) của nhóm 10% giàu nhất",
    ...pct(1),
    explanation:
      "Phần trăm tổng thu nhập hay chi tiêu của cả nước thuộc về 10% dân số có mức sống cao nhất, tính từ khảo sát hộ gia đình. Cùng với hệ số Gini, đây là thước đo bất bình đẳng dễ diễn giải.",
    thesisUse: [
      "Thước đo bất bình đẳng thay thế cho Gini để kiểm tra độ vững trong đề tài về tăng trưởng và bất bình đẳng (đường cong Kuznets).",
      "So sánh với tỷ trọng của 20% nghèo nhất để tính tỷ số Palma hoặc khoảng cách giàu – nghèo.",
    ],
  },
  {
    slug: "thu-nhap-20-ngheo-nhat",
    code: "SI.DST.FRST.20",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ trọng thu nhập của 20% nghèo nhất",
    nameVi: "Tỷ trọng thu nhập (chi tiêu) của nhóm 20% nghèo nhất",
    ...pct(1),
    explanation:
      "Phần trăm tổng thu nhập hay chi tiêu thuộc về 20% dân số nghèo nhất. Tỷ trọng tăng cho thấy nhóm nghèo được hưởng lợi từ tăng trưởng nhiều hơn mức trung bình.",
    thesisUse: [
      "Đo 'tăng trưởng vì người nghèo' (pro-poor growth): so sánh tốc độ tăng thu nhập của nhóm 20% nghèo nhất với thu nhập bình quân.",
      "Biến phụ thuộc trong đề tài về tác động của chính sách an sinh, giáo dục, tài chính toàn diện đến phân phối thu nhập.",
    ],
  },
  // ---------------------------------------------------------------- Lao động
  {
    slug: "that-nghiep-thanh-nien",
    code: "SL.UEM.1524.ZS",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ thất nghiệp thanh niên",
    nameVi: "Tỷ lệ thất nghiệp của thanh niên 15–24 tuổi (ước tính mô hình ILO)",
    ...pct(2),
    explanation:
      "Tỷ lệ người 15–24 tuổi trong lực lượng lao động đang không có việc làm và đang tìm việc, theo ước tính mô hình của ILO để so sánh được giữa các nước. Thất nghiệp thanh niên thường cao gấp 2–3 lần tỷ lệ chung.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về giáo dục nghề nghiệp, kỹ năng của sinh viên tốt nghiệp hoặc tác động của tăng trưởng đến việc làm thanh niên (định luật Okun cho nhóm trẻ).",
      "Số liệu là ước tính mô hình; khi cần số chính thức theo điều tra lao động việc làm, ghi rõ nguồn và không trộn hai chuỗi.",
    ],
  },
  {
    slug: "viec-lam-de-bi-ton-thuong",
    code: "SL.EMP.VULN.ZS",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ việc làm dễ bị tổn thương",
    nameVi: "Việc làm dễ bị tổn thương (% tổng việc làm, ước tính ILO)",
    ...pct(1),
    explanation:
      "Tỷ lệ lao động tự làm không thuê lao động và lao động gia đình không hưởng lương trong tổng việc làm. Nhóm này thường không có hợp đồng, bảo hiểm xã hội và thu nhập bấp bênh, nên chỉ tiêu dùng để đo chất lượng việc làm.",
    thesisUse: [
      "Đại diện cho mức độ phi chính thức của thị trường lao động khi thiếu chuỗi dài về việc làm phi chính thức.",
      "Biến giải thích trong đề tài về nghèo, bảo hiểm xã hội tự nguyện hoặc tác động của công nghiệp hoá đến chất lượng việc làm.",
    ],
  },
  {
    slug: "lao-dong-nong-nghiep",
    code: "SL.AGR.EMPL.ZS",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ lao động nông nghiệp",
    nameVi: "Lao động trong nông, lâm, thuỷ sản (% tổng việc làm, ước tính ILO)",
    ...pct(1),
    explanation:
      "Tỷ lệ người có việc làm chính trong nông nghiệp, lâm nghiệp và thuỷ sản. So sánh với tỷ trọng nông nghiệp trong GDP cho thấy năng suất lao động nông nghiệp thấp hơn bao nhiêu so với bình quân nền kinh tế.",
    thesisUse: [
      "Đo chuyển dịch cơ cấu lao động trong đề tài về công nghiệp hoá, mô hình hai khu vực của Lewis hoặc di cư nông thôn – thành thị.",
      "Kết hợp với lao động công nghiệp và dịch vụ để phân rã tăng năng suất thành phần 'trong ngành' và phần 'chuyển dịch cơ cấu' (shift-share).",
    ],
  },
  {
    slug: "lao-dong-cong-nghiep",
    code: "SL.IND.EMPL.ZS",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ lao động công nghiệp",
    nameVi: "Lao động trong công nghiệp và xây dựng (% tổng việc làm, ước tính ILO)",
    ...pct(1),
    explanation:
      "Tỷ lệ người làm việc trong khai khoáng, chế biến chế tạo, điện nước và xây dựng. Tốc độ tăng của chỉ tiêu này phản ánh khả năng hấp thụ lao động rời khỏi nông nghiệp của khu vực công nghiệp.",
    thesisUse: [
      "Biến cơ cấu lao động trong đề tài về FDI và việc làm, đô thị hoá hoặc phát thải.",
      "Dùng cùng tỷ lệ lao động nông nghiệp và dịch vụ (tổng bằng 100%) nên chỉ đưa hai trong ba biến vào cùng mô hình để tránh đa cộng tuyến hoàn hảo.",
    ],
  },
  {
    slug: "lao-dong-dich-vu",
    code: "SL.SRV.EMPL.ZS",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ lao động dịch vụ",
    nameVi: "Lao động trong khu vực dịch vụ (% tổng việc làm, ước tính ILO)",
    ...pct(1),
    explanation:
      "Tỷ lệ người làm việc trong thương mại, vận tải, lưu trú, ăn uống, tài chính, giáo dục, y tế và các dịch vụ khác. Khu vực dịch vụ thường hấp thụ phần lớn lao động chuyển khỏi nông nghiệp ở giai đoạn sau công nghiệp hoá.",
    thesisUse: [
      "Đo mức độ dịch vụ hoá của thị trường lao động trong đề tài về du lịch, thương mại điện tử, chuyển đổi số.",
      "So sánh với tỷ trọng dịch vụ trong GDP để đánh giá năng suất tương đối của khu vực dịch vụ.",
    ],
  },
  {
    slug: "ty-le-lao-dong-lam-cong-an-luong",
    code: "SL.EMP.WORK.ZS",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ lao động làm công ăn lương",
    nameVi: "Lao động làm công ăn lương (% tổng việc làm, ước tính ILO)",
    ...pct(1),
    explanation:
      "Tỷ lệ người có việc làm là lao động làm thuê hưởng lương, thưởng (có hoặc không có hợp đồng) trên tổng số người có việc làm. Tỷ lệ tăng cho thấy thị trường lao động chính thức hoá dần và lao động rời khỏi hình thức tự làm.",
    thesisUse: [
      "Đo mức độ hiện đại hoá thị trường lao động trong đề tài về tiền lương tối thiểu, bảo hiểm xã hội bắt buộc hoặc công đoàn.",
      "Biến kiểm soát khi giải thích tỷ trọng thu nhập của người lao động trong GDP.",
    ],
  },
  {
    slug: "ty-le-tham-gia-lao-dong-nu",
    code: "SL.TLF.CACT.FE.ZS",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ tham gia lao động của nữ",
    nameVi: "Tỷ lệ tham gia lực lượng lao động của nữ (15 tuổi trở lên, ước tính ILO)",
    ...pct(1),
    explanation:
      "Tỷ lệ phụ nữ từ 15 tuổi trở lên đang làm việc hoặc tìm việc. Việt Nam thuộc nhóm có tỷ lệ phụ nữ tham gia lao động cao trong khu vực, nên chỉ tiêu này hay xuất hiện trong nghiên cứu về giới.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về bình đẳng giới, giáo dục của nữ, mức sinh và chăm sóc trẻ em; kiểm định giả thuyết đường cong chữ U giữa phát triển và lao động nữ.",
      "Biến giải thích trong mô hình tăng trưởng hoặc nghèo khi xét vai trò của lao động nữ.",
    ],
  },
  {
    slug: "luc-luong-lao-dong",
    code: "SL.TLF.TOTL.IN",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "lực lượng lao động",
    nameVi: "Lực lượng lao động (người, 15 tuổi trở lên)",
    unit: "người",
    scale: 1e6,
    displayUnit: "triệu người",
    decimals: 2,
    explanation:
      "Tổng số người từ 15 tuổi trở lên đang có việc làm hoặc thất nghiệp (đang tìm việc), theo định nghĩa của ILO. Đây là biến lao động (L) thường dùng trong hàm sản xuất cấp quốc gia.",
    thesisUse: [
      "Biến đầu vào lao động trong hàm sản xuất Cobb–Douglas hoặc mô hình hạch toán tăng trưởng (cùng vốn và TFP).",
      "Mẫu số để tự tính các tỷ lệ theo lao động, ví dụ vốn trên lao động hoặc tín dụng trên lao động.",
    ],
  },
  {
    slug: "thanh-nien-neet",
    code: "SL.UEM.NEET.ZS",
    theme: "Giá cả, lao động & thu nhập",
    shortVi: "tỷ lệ thanh niên NEET",
    nameVi: "Tỷ lệ thanh niên không đi học, không làm việc, không đào tạo (NEET)",
    ...pct(1),
    explanation:
      "Tỷ lệ người 15–24 tuổi không có việc làm và không tham gia học tập hay đào tạo. Chỉ tiêu này bao quát hơn thất nghiệp thanh niên vì gồm cả những người đã nản lòng không tìm việc, và là chỉ tiêu SDG 8.6.1.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về chuyển tiếp từ trường học sang việc làm, giáo dục nghề nghiệp và chính sách việc làm cho thanh niên.",
      "So sánh với tỷ lệ thất nghiệp thanh niên để chỉ ra phần thanh niên 'vô hình' trong thống kê thất nghiệp.",
    ],
  },
  // ---------------------------------------------------------------- Thương mại & đầu tư
  {
    slug: "xuat-khau-hang-hoa",
    code: "TX.VAL.MRCH.CD.WT",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "kim ngạch xuất khẩu hàng hoá",
    nameVi: "Kim ngạch xuất khẩu hàng hoá (USD, giá hiện hành)",
    ...usdBn,
    explanation:
      "Giá trị hàng hoá Việt Nam xuất khẩu trong năm theo giá FOB, tính bằng đô la Mỹ, theo số liệu thương mại của WTO. Không gồm xuất khẩu dịch vụ (du lịch, vận tải…).",
    thesisUse: [
      "Biến phụ thuộc hoặc giải thích chính trong đề tài về xuất khẩu và tăng trưởng (giả thuyết tăng trưởng dẫn dắt bởi xuất khẩu, kiểm định nhân quả Granger).",
      "Lấy logarit khi đưa vào mô hình trọng lực (gravity) hoặc ARDL; dùng cùng kim ngạch nhập khẩu để tính cán cân thương mại hàng hoá.",
    ],
  },
  {
    slug: "nhap-khau-hang-hoa",
    code: "TM.VAL.MRCH.CD.WT",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "kim ngạch nhập khẩu hàng hoá",
    nameVi: "Kim ngạch nhập khẩu hàng hoá (USD, giá hiện hành)",
    ...usdBn,
    explanation:
      "Giá trị hàng hoá Việt Nam nhập khẩu trong năm, tính bằng đô la Mỹ. Phần lớn nhập khẩu của Việt Nam là máy móc, nguyên liệu và linh kiện phục vụ sản xuất, nên nhập khẩu thường tăng cùng xuất khẩu.",
    thesisUse: [
      "Kiểm định quan hệ dài hạn giữa xuất khẩu và nhập khẩu (bền vững cán cân thương mại) bằng đồng liên kết.",
      "Biến kiểm soát trong đề tài về tỷ giá và cán cân thương mại (hiệu ứng tuyến J, điều kiện Marshall–Lerner).",
    ],
  },
  {
    slug: "xuat-khau-hang-hoa-dich-vu",
    code: "NE.EXP.GNFS.CD",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "xuất khẩu hàng hoá và dịch vụ",
    nameVi: "Xuất khẩu hàng hoá và dịch vụ (USD, giá hiện hành)",
    ...usdBn,
    explanation:
      "Giá trị hàng hoá và dịch vụ bán cho nước ngoài theo tài khoản quốc gia, gồm cả du lịch quốc tế, vận tải, dịch vụ tài chính… Đây là thành phần X trong đẳng thức GDP = C + I + G + X − M.",
    thesisUse: [
      "Dùng khi mô hình cần tổng xuất khẩu theo tài khoản quốc gia (nhất quán với GDP), thay vì chỉ hàng hoá.",
      "Tính độ mở thương mại hoặc đóng góp của xuất khẩu ròng vào tăng trưởng GDP.",
    ],
  },
  {
    slug: "can-can-thuong-mai",
    code: "NE.RSB.GNFS.CD",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "cán cân thương mại hàng hoá và dịch vụ",
    nameVi: "Cán cân hàng hoá và dịch vụ (xuất khẩu ròng, USD)",
    ...usdBn,
    explanation:
      "Xuất khẩu trừ nhập khẩu hàng hoá và dịch vụ theo tài khoản quốc gia. Giá trị dương là thặng dư thương mại, âm là thâm hụt.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về tác động của tỷ giá, FDI, hiệp định thương mại tự do đến cán cân thương mại.",
      "Vì có thể âm, không lấy logarit; chuẩn hoá bằng cách chia cho GDP hoặc dùng tỷ số xuất khẩu/nhập khẩu.",
    ],
  },
  {
    slug: "can-can-vang-lai",
    code: "BN.CAB.XOKA.GD.ZS",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "cán cân vãng lai so với GDP",
    nameVi: "Cán cân vãng lai (% GDP)",
    ...pctGdp,
    explanation:
      "Tổng của cán cân thương mại hàng hoá, dịch vụ, thu nhập sơ cấp (lợi nhuận, lãi) và chuyển giao vãng lai (kiều hối), chia cho GDP. Thâm hụt kéo dài cần được bù bằng vốn nước ngoài, nên đây là chỉ báo quan trọng về ổn định vĩ mô.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về thâm hụt kép (ngân sách và vãng lai), tỷ giá thực và cán cân vãng lai.",
      "Biến cảnh báo sớm khủng hoảng tiền tệ trong mô hình logit/probit cùng dự trữ ngoại hối và nợ nước ngoài.",
    ],
  },
  {
    slug: "fdi-ra-nuoc-ngoai",
    code: "BM.KLT.DINV.CD.WD",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "đầu tư trực tiếp ra nước ngoài",
    nameVi: "Đầu tư trực tiếp ra nước ngoài, dòng ra ròng (BoP, USD)",
    unit: "USD, giá hiện hành",
    scale: 1e6,
    displayUnit: "triệu USD",
    decimals: 0,
    explanation:
      "Giá trị vốn đầu tư trực tiếp mà nhà đầu tư Việt Nam đưa ra nước ngoài trong năm theo cán cân thanh toán (vốn chủ sở hữu, lợi nhuận tái đầu tư, khoản vay nội bộ), trừ phần rút về.",
    thesisUse: [
      "Biến chính trong đề tài về quốc tế hoá doanh nghiệp Việt Nam, lý thuyết đường phát triển đầu tư (Investment Development Path) của Dunning.",
      "So sánh với dòng FDI vào để tính FDI ròng của nền kinh tế.",
    ],
  },
  {
    slug: "xuat-khau-cong-nghe-cao",
    code: "TX.VAL.TECH.MF.ZS",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "tỷ trọng xuất khẩu công nghệ cao",
    nameVi: "Xuất khẩu sản phẩm công nghệ cao (% xuất khẩu hàng chế tạo)",
    ...pct(1),
    explanation:
      "Tỷ trọng các sản phẩm có hàm lượng nghiên cứu – phát triển cao (máy tính, điện tử, dược phẩm, thiết bị khoa học, hàng không vũ trụ…) trong tổng xuất khẩu hàng chế tạo. Việt Nam có tỷ trọng cao chủ yếu nhờ điện thoại và linh kiện điện tử của doanh nghiệp FDI.",
    thesisUse: [
      "Đo mức độ tinh vi của rổ xuất khẩu trong đề tài về FDI và nâng cấp chuỗi giá trị, đổi mới sáng tạo hoặc vốn con người.",
      "Cần thận trọng khi diễn giải: tỷ trọng cao không đồng nghĩa giá trị gia tăng trong nước cao vì khâu lắp ráp chiếm phần lớn.",
    ],
  },
  {
    slug: "thue-quan-binh-quan",
    code: "TM.TAX.MRCH.WM.AR.ZS",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "thuế quan bình quân",
    nameVi: "Thuế suất nhập khẩu áp dụng bình quân gia quyền, mọi mặt hàng (%)",
    ...pct(2),
    explanation:
      "Thuế suất nhập khẩu thực tế áp dụng, tính bình quân có trọng số theo kim ngạch nhập khẩu của từng mặt hàng. Chỉ tiêu giảm mạnh sau khi Việt Nam gia nhập WTO và tham gia các FTA.",
    thesisUse: [
      "Đo mức độ tự do hoá thương mại trong đề tài về tác động của hội nhập (WTO, CPTPP, EVFTA) đến thương mại, tăng trưởng, thu ngân sách.",
      "Biến chi phí thương mại trong mô hình trọng lực khi kết hợp với dữ liệu song phương.",
    ],
  },
  {
    slug: "chi-so-dieu-kien-thuong-mai",
    code: "TT.PRI.MRCH.XD.WD",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "chỉ số điều kiện thương mại",
    nameVi: "Chỉ số điều kiện thương mại ròng (2015 = 100)",
    unit: "chỉ số, 2015 = 100",
    scale: 1,
    displayUnit: "điểm (2015 = 100)",
    decimals: 1,
    explanation:
      "Tỷ số giữa chỉ số giá xuất khẩu và chỉ số giá nhập khẩu, nhân 100. Chỉ số tăng nghĩa là với cùng lượng hàng xuất khẩu, Việt Nam đổi được nhiều hàng nhập khẩu hơn.",
    thesisUse: [
      "Biến cú sốc bên ngoài trong mô hình VAR về tăng trưởng, cán cân thương mại hoặc tỷ giá.",
      "Giải thích tác động của biến động giá hàng hoá thế giới (dầu, gạo, cà phê) đến thu nhập quốc gia.",
    ],
  },
  {
    slug: "khach-du-lich-quoc-te",
    code: "ST.INT.ARVL",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "lượng khách du lịch quốc tế",
    nameVi: "Số lượt khách du lịch quốc tế đến",
    unit: "lượt khách",
    scale: 1e6,
    displayUnit: "triệu lượt",
    decimals: 2,
    explanation:
      "Số lượt khách quốc tế đến Việt Nam trong năm theo thống kê của Tổ chức Du lịch Thế giới (UN Tourism). World Bank hiện chỉ cập nhật đến năm 2020.",
    thesisUse: [
      "Biến chính trong đề tài về du lịch và tăng trưởng (giả thuyết tăng trưởng dẫn dắt bởi du lịch) hoặc tác động của COVID-19.",
      "Biến giải thích cầu du lịch trong mô hình cầu du lịch (thu nhập nước gửi khách, tỷ giá, giá tương đối).",
    ],
  },
  {
    slug: "chi-so-hieu-qua-logistics",
    code: "LP.LPI.OVRL.XQ",
    theme: "Thương mại & đầu tư nước ngoài",
    shortVi: "chỉ số hiệu quả logistics (LPI)",
    nameVi: "Chỉ số hiệu quả logistics (LPI) tổng hợp (1 = thấp, 5 = cao)",
    unit: "điểm (1–5)",
    scale: 1,
    displayUnit: "điểm",
    decimals: 2,
    explanation:
      "Điểm đánh giá năng lực logistics của World Bank dựa trên khảo sát các công ty giao nhận quốc tế về hải quan, hạ tầng, vận tải quốc tế, năng lực dịch vụ logistics, khả năng truy xuất lô hàng và tính đúng hạn. Chỉ có ở các năm khảo sát.",
    thesisUse: [
      "Biến chi phí thương mại phi thuế trong mô hình trọng lực hoặc đề tài về logistics và xuất khẩu.",
      "Mô tả bối cảnh ngành logistics Việt Nam trong khoá luận ngành quản trị chuỗi cung ứng, so sánh với Thái Lan, Malaysia.",
    ],
  },
  // ---------------------------------------------------------------- Tài chính – ngân hàng (WDI)
  {
    slug: "du-tru-ngoai-hoi-thang-nhap-khau",
    code: "FI.RES.TOTL.MO",
    theme: "Tài chính – ngân hàng",
    shortVi: "dự trữ ngoại hối tính theo tháng nhập khẩu",
    nameVi: "Tổng dự trữ quốc tế tính bằng số tháng nhập khẩu",
    unit: "tháng nhập khẩu",
    scale: 1,
    displayUnit: "tháng",
    decimals: 1,
    explanation:
      "Dự trữ ngoại hối (gồm vàng) chia cho giá trị nhập khẩu hàng hoá, dịch vụ bình quân một tháng. Ngưỡng an toàn truyền thống là 3 tháng nhập khẩu.",
    thesisUse: [
      "Đo mức độ an toàn ngoại tệ trong đề tài về ổn định tỷ giá, rủi ro khủng hoảng tiền tệ.",
      "Biến kiểm soát trong mô hình về chính sách tiền tệ của Ngân hàng Nhà nước (can thiệp ngoại hối).",
    ],
  },
  {
    slug: "atm",
    code: "FB.ATM.TOTL.P5",
    theme: "Tài chính – ngân hàng",
    shortVi: "số máy ATM trên 100.000 người lớn",
    nameVi: "Số máy ATM trên 100.000 người trưởng thành",
    unit: "máy/100.000 người từ 15 tuổi",
    scale: 1,
    displayUnit: "máy",
    decimals: 1,
    explanation:
      "Số máy rút tiền tự động trên 100.000 người từ 15 tuổi trở lên, theo khảo sát Financial Access Survey. Đây là chỉ tiêu tiếp cận dịch vụ tài chính về mặt hạ tầng.",
    thesisUse: [
      "Một thành phần của chỉ số tài chính toàn diện (tổng hợp bằng PCA cùng chi nhánh ngân hàng, tài khoản, tín dụng).",
      "Biến giải thích trong đề tài về thanh toán không tiền mặt, ngân hàng số: số ATM giảm hoặc chững lại khi thanh toán điện tử phát triển.",
    ],
  },
  {
    slug: "ty-le-so-huu-tai-khoan",
    code: "FX.OWN.TOTL.ZS",
    theme: "Tài chính – ngân hàng",
    shortVi: "tỷ lệ người lớn có tài khoản",
    nameVi: "Tỷ lệ người từ 15 tuổi có tài khoản tại tổ chức tài chính hoặc ví di động (Global Findex)",
    ...pct(1),
    explanation:
      "Tỷ lệ người trưởng thành có tài khoản ngân hàng, tổ chức tài chính khác hoặc tài khoản tiền di động, theo khảo sát Global Findex của World Bank (các năm 2011, 2014, 2017, 2021, 2024). Đây là chỉ tiêu cốt lõi của tài chính toàn diện.",
    thesisUse: [
      "Dẫn chứng bối cảnh cho đề tài về ý định sử dụng ngân hàng số, ví điện tử, Mobile Money (phần tổng quan, tính cấp thiết).",
      "So sánh với các nước ASEAN để chỉ ra khoảng cách tài chính toàn diện; chuỗi quá ngắn nên không dùng cho hồi quy chuỗi thời gian.",
    ],
  },
  {
    slug: "von-hoa-thi-truong-chung-khoan",
    code: "CM.MKT.LCAP.GD.ZS",
    theme: "Tài chính – ngân hàng",
    shortVi: "vốn hoá thị trường chứng khoán so với GDP",
    nameVi: "Vốn hoá thị trường của các công ty niêm yết trong nước (% GDP)",
    ...pctGdp,
    explanation:
      "Tổng giá trị thị trường (giá cổ phiếu × số cổ phiếu lưu hành) của các công ty niêm yết trong nước cuối năm, chia cho GDP. Chỉ tiêu đo quy mô thị trường chứng khoán so với nền kinh tế.",
    thesisUse: [
      "Biến phát triển thị trường vốn trong đề tài về phát triển tài chính và tăng trưởng, so sánh vai trò ngân hàng và thị trường chứng khoán.",
      "Kết hợp với tín dụng tư nhân/GDP để xây dựng chỉ số cấu trúc tài chính (ngân hàng chủ đạo hay thị trường chủ đạo).",
    ],
  },
  {
    slug: "tang-truong-cung-tien",
    code: "FM.LBL.BMNY.ZG",
    theme: "Tài chính – ngân hàng",
    shortVi: "tăng trưởng cung tiền M2",
    nameVi: "Tốc độ tăng cung tiền mở rộng (M2, %/năm)",
    unit: "%/năm",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Tốc độ tăng của khối tiền mở rộng (tiền mặt ngoài ngân hàng, tiền gửi không kỳ hạn và có kỳ hạn) so với năm trước. Đây là biến đại diện cho lập trường chính sách tiền tệ khi xét theo lượng tiền.",
    thesisUse: [
      "Biến chính sách tiền tệ trong mô hình VAR/SVAR về lạm phát, tăng trưởng hoặc tỷ giá (cùng lãi suất).",
      "Kiểm định thuyết số lượng tiền tệ (quan hệ giữa tăng cung tiền và lạm phát) trong dài hạn.",
    ],
  },
  {
    slug: "ty-gia-ppp",
    code: "PA.NUS.PPP",
    theme: "Tài chính – ngân hàng",
    shortVi: "hệ số chuyển đổi sức mua PPP",
    nameVi: "Hệ số chuyển đổi sức mua tương đương (PPP), GDP (VND/USD quốc tế)",
    unit: "VND/USD quốc tế",
    scale: 1,
    displayUnit: "VND",
    decimals: 0,
    explanation:
      "Số đồng Việt Nam cần để mua cùng lượng hàng hoá, dịch vụ mà 1 đô la Mỹ mua được ở Mỹ. Hệ số này thấp hơn nhiều so với tỷ giá thị trường vì giá dịch vụ, hàng không giao thương ở Việt Nam rẻ hơn.",
    thesisUse: [
      "Quy đổi thu nhập, chi tiêu, lương từ VND sang USD PPP để so sánh mức sống với nước khác.",
      "Tính mức giá tương đối (tỷ giá PPP / tỷ giá thị trường) để đánh giá đồng tiền định giá thấp hay cao (hiệu ứng Balassa–Samuelson).",
    ],
  },
  {
    slug: "ty-le-dich-vu-no",
    code: "DT.TDS.DECT.EX.ZS",
    theme: "Tài chính – ngân hàng",
    shortVi: "nghĩa vụ trả nợ nước ngoài so với xuất khẩu",
    nameVi: "Tổng nghĩa vụ trả nợ nước ngoài (% xuất khẩu hàng hoá, dịch vụ và thu nhập sơ cấp)",
    ...pct(2),
    explanation:
      "Tiền trả gốc và lãi của nợ nước ngoài dài hạn, trả lãi nợ ngắn hạn và trả nợ IMF, chia cho thu nhập từ xuất khẩu. Chỉ tiêu cho biết bao nhiêu phần trăm nguồn thu ngoại tệ phải dùng để trả nợ.",
    thesisUse: [
      "Đo khả năng trả nợ trong đề tài về tính bền vững nợ nước ngoài và nợ công.",
      "Biến kiểm soát rủi ro quốc gia trong mô hình về chi phí vay nước ngoài hoặc xếp hạng tín nhiệm.",
    ],
  },
  // ---------------------------------------------------------------- Doanh nghiệp & môi trường kinh doanh
  {
    slug: "mat-do-doanh-nghiep-moi",
    code: "IC.BUS.NDNS.ZS",
    theme: "Doanh nghiệp & môi trường kinh doanh",
    shortVi: "mật độ doanh nghiệp mới",
    nameVi: "Mật độ doanh nghiệp mới đăng ký (trên 1.000 người 15–64 tuổi)",
    unit: "doanh nghiệp/1.000 người 15–64 tuổi",
    scale: 1,
    displayUnit: "DN/1.000 người",
    decimals: 2,
    explanation:
      "Số công ty trách nhiệm hữu hạn mới đăng ký trong năm trên 1.000 người trong độ tuổi lao động, theo cơ sở dữ liệu Entrepreneurship của World Bank. Chỉ tiêu đo mức độ khởi nghiệp chính thức, chuẩn hoá theo quy mô dân số để so sánh giữa các nước.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về môi trường kinh doanh, cải cách thủ tục hành chính và khởi nghiệp.",
      "Biến giải thích trong mô hình về việc làm, đổi mới sáng tạo; lưu ý chỉ tính doanh nghiệp có tư cách pháp nhân, không gồm hộ kinh doanh.",
    ],
  },
  {
    slug: "so-doanh-nghiep-moi",
    code: "IC.BUS.NREG",
    theme: "Doanh nghiệp & môi trường kinh doanh",
    shortVi: "số doanh nghiệp mới đăng ký",
    nameVi: "Số doanh nghiệp mới đăng ký trong năm",
    unit: "doanh nghiệp",
    scale: 1,
    displayUnit: "doanh nghiệp",
    decimals: 0,
    explanation:
      "Số công ty trách nhiệm hữu hạn (và tương đương) đăng ký mới trong năm theo số liệu cơ quan đăng ký kinh doanh tổng hợp bởi World Bank Entrepreneurship Database.",
    thesisUse: [
      "Biến động lực khởi nghiệp trong đề tài về tác động của Luật Doanh nghiệp, COVID-19, chi phí tuân thủ đến gia nhập thị trường.",
      "Lấy logarit khi dùng trong hồi quy; kết hợp với mật độ doanh nghiệp mới để loại bỏ ảnh hưởng của quy mô dân số.",
    ],
  },
  {
    slug: "doanh-nghiep-dung-von-ngan-hang",
    code: "IC.FRM.BNKS.ZS",
    theme: "Doanh nghiệp & môi trường kinh doanh",
    shortVi: "doanh nghiệp dùng vốn ngân hàng để đầu tư",
    nameVi: "Tỷ lệ doanh nghiệp dùng vốn vay ngân hàng để tài trợ đầu tư (Enterprise Surveys)",
    ...pct(1),
    explanation:
      "Tỷ lệ doanh nghiệp trong mẫu Enterprise Surveys của World Bank có dùng vốn ngân hàng để mua tài sản cố định. Khảo sát doanh nghiệp tư nhân phi nông nghiệp ở Việt Nam các năm 2009, 2015 và 2023.",
    thesisUse: [
      "Dẫn chứng mức độ tiếp cận tín dụng ngân hàng của doanh nghiệp trong đề tài về cấu trúc vốn, tài trợ doanh nghiệp nhỏ và vừa.",
      "So sánh với các nước trong khu vực ở cùng năm khảo sát; chỉ 3 điểm dữ liệu nên dùng để mô tả, không hồi quy.",
    ],
  },
  {
    slug: "chi-phi-khong-chinh-thuc",
    code: "IC.FRM.CORR.ZS",
    theme: "Doanh nghiệp & môi trường kinh doanh",
    shortVi: "chi phí không chính thức của doanh nghiệp",
    nameVi: "Tỷ lệ doanh nghiệp được kỳ vọng phải chi trả không chính thức cho cán bộ (Enterprise Surveys)",
    ...pct(1),
    explanation:
      "Tỷ lệ doanh nghiệp cho biết phải trả 'quà', khoản chi không chính thức để 'được việc' khi làm các thủ tục như giấy phép, thuế, hải quan, theo Enterprise Surveys. Đây là thước đo tham nhũng vặt dưới góc nhìn doanh nghiệp.",
    thesisUse: [
      "Biến môi trường thể chế trong đề tài về tham nhũng và hiệu quả doanh nghiệp (giả thuyết 'bôi trơn' hay 'cát trong bánh xe').",
      "Bổ sung cho chỉ số Kiểm soát tham nhũng của WGI: một bên là cảm nhận chuyên gia, một bên là trải nghiệm của doanh nghiệp.",
    ],
  },
  {
    slug: "doanh-nghiep-dao-tao-chinh-thuc",
    code: "IC.FRM.TRNG.ZS",
    theme: "Doanh nghiệp & môi trường kinh doanh",
    shortVi: "doanh nghiệp có đào tạo chính thức",
    nameVi: "Tỷ lệ doanh nghiệp tổ chức đào tạo chính thức cho nhân viên (Enterprise Surveys)",
    ...pct(1),
    explanation:
      "Tỷ lệ doanh nghiệp có chương trình đào tạo chính thức cho nhân viên làm việc toàn thời gian trong năm tài chính trước khảo sát.",
    thesisUse: [
      "Dẫn chứng cho đề tài quản trị nhân sự về đào tạo, phát triển nhân viên và năng suất.",
      "Biến vốn con người cấp doanh nghiệp khi so sánh Việt Nam với các nước khác.",
    ],
  },
  {
    slug: "doanh-nghiep-canh-tranh-phi-chinh-thuc",
    code: "IC.FRM.CMPU.ZS",
    theme: "Doanh nghiệp & môi trường kinh doanh",
    shortVi: "cạnh tranh từ khu vực phi chính thức",
    nameVi: "Tỷ lệ doanh nghiệp phải cạnh tranh với cơ sở không đăng ký kinh doanh (Enterprise Surveys)",
    ...pct(1),
    explanation:
      "Tỷ lệ doanh nghiệp cho biết đang cạnh tranh với các cơ sở kinh doanh không đăng ký hoặc phi chính thức. Chỉ tiêu phản ánh áp lực từ khu vực phi chính thức lên doanh nghiệp tuân thủ.",
    thesisUse: [
      "Biến môi trường cạnh tranh trong đề tài về kinh tế phi chính thức, tuân thủ thuế và hiệu quả doanh nghiệp.",
      "Dẫn chứng mô tả trong chương bối cảnh; chỉ có 3 vòng khảo sát.",
    ],
  },
  {
    slug: "thoi-gian-xu-ly-thu-tuc",
    code: "IC.GOV.DURS.ZS",
    theme: "Doanh nghiệp & môi trường kinh doanh",
    shortVi: "thời gian lãnh đạo DN dành cho thủ tục",
    nameVi: "Tỷ lệ thời gian của lãnh đạo doanh nghiệp dành cho thủ tục, quy định của Nhà nước (Enterprise Surveys)",
    unit: "% thời gian của quản lý cấp cao",
    scale: 1,
    displayUnit: "%",
    decimals: 1,
    explanation:
      "Phần trăm thời gian làm việc trong tuần mà quản lý cấp cao phải dành để xử lý các yêu cầu của quy định nhà nước (thuế, giấy phép, lao động…). Đây là thước đo gánh nặng thủ tục hành chính.",
    thesisUse: [
      "Biến chi phí tuân thủ trong đề tài về cải cách hành chính và hiệu quả doanh nghiệp.",
      "Bổ sung cho các chỉ số cảm nhận như PCI khi so sánh quốc tế.",
    ],
  },
  // ---------------------------------------------------------------- Dân số
  {
    slug: "ty-suat-sinh",
    code: "SP.DYN.TFRT.IN",
    theme: "Dân số & đô thị hoá",
    shortVi: "tổng tỷ suất sinh",
    nameVi: "Tổng tỷ suất sinh (số con bình quân một phụ nữ)",
    unit: "con/phụ nữ",
    scale: 1,
    displayUnit: "con/phụ nữ",
    decimals: 2,
    explanation:
      "Số con trung bình một phụ nữ sinh ra trong cả đời nếu trải qua tỷ suất sinh theo tuổi của năm đó. Mức 2,1 là mức sinh thay thế; Việt Nam đã xuống dưới mức này trong những năm gần đây.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về các yếu tố kinh tế – xã hội ảnh hưởng đến mức sinh (giáo dục của nữ, đô thị hoá, thu nhập).",
      "Bối cảnh cho đề tài về già hoá dân số, chính sách dân số và lực lượng lao động tương lai.",
    ],
  },
  {
    slug: "dan-so-tren-65-tuoi",
    code: "SP.POP.65UP.TO.ZS",
    theme: "Dân số & đô thị hoá",
    shortVi: "tỷ lệ dân số từ 65 tuổi",
    nameVi: "Tỷ lệ dân số từ 65 tuổi trở lên (% dân số)",
    ...pct(2),
    explanation:
      "Phần trăm dân số từ 65 tuổi trở lên. Theo quy ước quốc tế, một nước bước vào giai đoạn 'già hoá' khi tỷ lệ này vượt 7% và trở thành 'dân số già' khi vượt 14%.",
    thesisUse: [
      "Biến già hoá dân số trong đề tài về tiết kiệm, chi tiêu y tế, quỹ hưu trí và tăng trưởng.",
      "Biến kiểm soát cơ cấu tuổi trong mô hình tiêu dùng hoặc thị trường lao động.",
    ],
  },
  {
    slug: "ty-le-phu-thuoc",
    code: "SP.POP.DPND",
    theme: "Dân số & đô thị hoá",
    shortVi: "tỷ số phụ thuộc",
    nameVi: "Tỷ số phụ thuộc (% dân số trong độ tuổi lao động)",
    ...pct(1),
    explanation:
      "Số người dưới 15 tuổi và từ 65 tuổi trở lên trên 100 người 15–64 tuổi. Tỷ số thấp nghĩa là nền kinh tế đang trong thời kỳ 'dân số vàng'.",
    thesisUse: [
      "Đo cơ hội dân số vàng trong đề tài về cơ cấu tuổi và tăng trưởng, tiết kiệm (giả thuyết vòng đời).",
      "Biến kiểm soát nhân khẩu học trong mô hình về chi tiêu công cho giáo dục và y tế.",
    ],
  },
  {
    slug: "tang-truong-dan-so",
    code: "SP.POP.GROW",
    theme: "Dân số & đô thị hoá",
    shortVi: "tốc độ tăng dân số",
    nameVi: "Tốc độ tăng dân số (%/năm)",
    unit: "%/năm",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Tốc độ tăng dân số giữa năm so với năm trước, gồm cả tăng tự nhiên (sinh trừ chết) và di cư thuần.",
    thesisUse: [
      "Biến n trong mô hình tăng trưởng Solow (n + g + δ) khi kiểm định hội tụ có điều kiện.",
      "Chuyển các chỉ tiêu tổng sang bình quân đầu người khi phân tích tăng trưởng thu nhập.",
    ],
  },
  {
    slug: "mat-do-dan-so",
    code: "EN.POP.DNST",
    theme: "Dân số & đô thị hoá",
    shortVi: "mật độ dân số",
    nameVi: "Mật độ dân số (người/km² đất liền)",
    unit: "người/km²",
    scale: 1,
    displayUnit: "người/km²",
    decimals: 0,
    explanation:
      "Dân số giữa năm chia cho diện tích đất liền (không gồm mặt nước nội địa). Việt Nam thuộc nhóm nước có mật độ dân số cao trên thế giới.",
    thesisUse: [
      "Biến kiểm soát áp lực dân số trong đề tài môi trường (phát thải, mất rừng, ô nhiễm không khí).",
      "Biến hiệu ứng kinh tế quy mô và tích tụ trong mô hình đô thị hoá, hạ tầng.",
    ],
  },
  {
    slug: "di-cu-thuan",
    code: "SM.POP.NETM",
    theme: "Dân số & đô thị hoá",
    shortVi: "di cư quốc tế thuần",
    nameVi: "Di cư quốc tế thuần (người nhập cư trừ người xuất cư)",
    unit: "người",
    scale: 1e3,
    displayUnit: "nghìn người",
    decimals: 1,
    explanation:
      "Số người nhập cư trừ số người xuất cư trong năm, gồm cả công dân và người nước ngoài, theo ước tính World Population Prospects của Liên Hợp Quốc. Giá trị âm nghĩa là số người rời đi nhiều hơn số người đến.",
    thesisUse: [
      "Bối cảnh cho đề tài về xuất khẩu lao động, kiều hối và chảy máu chất xám.",
      "Là ước tính mô hình, không phải số đếm; nên ghi rõ khi trích dẫn.",
    ],
  },
  // ---------------------------------------------------------------- Giáo dục & y tế
  {
    slug: "ty-le-nhap-hoc-trung-hoc",
    code: "SE.SEC.ENRR",
    theme: "Giáo dục & y tế",
    shortVi: "tỷ lệ nhập học trung học",
    nameVi: "Tỷ lệ nhập học trung học (gộp, % nhóm tuổi tương ứng)",
    ...pct(1),
    explanation:
      "Tổng số học sinh trung học (THCS và THPT) không phân biệt tuổi, chia cho dân số trong độ tuổi trung học chính thức. Có thể vượt 100% do học sinh học muộn hoặc lưu ban.",
    thesisUse: [
      "Đại diện cho vốn con người trong mô hình tăng trưởng Mankiw–Romer–Weil (MRW) khi thiếu chuỗi số năm đi học.",
      "Biến giải thích trong đề tài về giáo dục và giảm nghèo hoặc lao động trẻ em.",
    ],
  },
  {
    slug: "ty-le-hoan-thanh-tieu-hoc",
    code: "SE.PRM.CMPT.ZS",
    theme: "Giáo dục & y tế",
    shortVi: "tỷ lệ hoàn thành tiểu học",
    nameVi: "Tỷ lệ hoàn thành tiểu học (% nhóm tuổi tương ứng)",
    ...pct(1),
    explanation:
      "Số học sinh mới vào lớp cuối cấp tiểu học chia cho dân số ở độ tuổi vào lớp cuối cấp, theo UNESCO UIS. Chỉ tiêu đo hiệu quả của hệ thống giáo dục phổ cập.",
    thesisUse: [
      "Biến chất lượng giáo dục cơ bản khi so sánh quốc tế hoặc trong đề tài về chi tiêu công cho giáo dục.",
      "Dẫn chứng thành tựu phổ cập giáo dục tiểu học trong phần bối cảnh.",
    ],
  },
  {
    slug: "trinh-do-trung-hoc-pho-thong",
    code: "SE.SEC.CUAT.UP.ZS",
    theme: "Giáo dục & y tế",
    shortVi: "tỷ lệ người từ 25 tuổi tốt nghiệp THPT",
    nameVi: "Tỷ lệ dân số từ 25 tuổi đã hoàn thành ít nhất trung học phổ thông (%)",
    ...pct(1),
    explanation:
      "Phần trăm người từ 25 tuổi trở lên có trình độ học vấn từ trung học phổ thông trở lên, theo điều tra dân số và khảo sát hộ gia đình. Đây là thước đo trình độ của lực lượng lao động trưởng thành.",
    thesisUse: [
      "Biến vốn con người cho lực lượng lao động trong mô hình năng suất hoặc hấp thụ FDI.",
      "Chỉ có các năm có điều tra; nội suy chỉ nên dùng cho mục đích mô tả.",
    ],
  },
  {
    slug: "ty-le-hoc-sinh-giao-vien-tieu-hoc",
    code: "SE.PRM.ENRL.TC.ZS",
    theme: "Giáo dục & y tế",
    shortVi: "số học sinh trên một giáo viên tiểu học",
    nameVi: "Tỷ lệ học sinh trên giáo viên, cấp tiểu học",
    unit: "học sinh/giáo viên",
    scale: 1,
    displayUnit: "học sinh/GV",
    decimals: 1,
    explanation:
      "Số học sinh tiểu học bình quân trên một giáo viên. Tỷ lệ thấp hơn thường gắn với điều kiện dạy học tốt hơn, dù không đồng nghĩa với chất lượng.",
    thesisUse: [
      "Biến đầu vào giáo dục trong mô hình hàm sản xuất giáo dục hoặc đề tài về hiệu quả chi tiêu công cho giáo dục.",
      "So sánh nguồn lực giáo dục giữa Việt Nam và các nước ASEAN.",
    ],
  },
  {
    slug: "chi-giao-duc-trong-chi-ngan-sach",
    code: "SE.XPD.TOTL.GB.ZS",
    theme: "Giáo dục & y tế",
    shortVi: "chi giáo dục trong tổng chi ngân sách",
    nameVi: "Chi tiêu công cho giáo dục (% tổng chi tiêu của Chính phủ)",
    ...pct(1),
    explanation:
      "Phần trăm tổng chi ngân sách nhà nước dành cho giáo dục (chi thường xuyên và chi đầu tư). Việt Nam đặt mục tiêu dành khoảng 20% tổng chi ngân sách cho giáo dục.",
    thesisUse: [
      "Đo mức độ ưu tiên ngân sách cho giáo dục trong đề tài về hiệu quả chi tiêu công.",
      "So sánh với mục tiêu 15–20% của Tuyên bố Incheon về giáo dục 2030.",
    ],
  },
  {
    slug: "ty-suat-tu-vong-tre-duoi-5-tuoi",
    code: "SH.DYN.MORT",
    theme: "Giáo dục & y tế",
    shortVi: "tỷ suất tử vong trẻ dưới 5 tuổi",
    nameVi: "Tỷ suất tử vong trẻ em dưới 5 tuổi (trên 1.000 trẻ sinh sống)",
    unit: "‰ (trên 1.000 trẻ sinh sống)",
    scale: 1,
    displayUnit: "‰",
    decimals: 1,
    explanation:
      "Xác suất một trẻ sơ sinh tử vong trước 5 tuổi, tính trên 1.000 trẻ sinh sống, theo ước tính của nhóm liên cơ quan Liên Hợp Quốc (UN IGME). Đây là chỉ tiêu SDG 3.2.1 và thước đo tổng hợp về y tế, dinh dưỡng, nước sạch.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về tác động của chi tiêu y tế, thu nhập, giáo dục của mẹ đến sức khoẻ trẻ em.",
      "Biến kết quả y tế trong dữ liệu bảng nhiều nước để đánh giá hiệu quả hệ thống y tế.",
    ],
  },
  {
    slug: "ty-suat-tu-vong-tre-so-sinh",
    code: "SP.DYN.IMRT.IN",
    theme: "Giáo dục & y tế",
    shortVi: "tỷ suất tử vong trẻ dưới 1 tuổi",
    nameVi: "Tỷ suất tử vong trẻ dưới 1 tuổi (trên 1.000 trẻ sinh sống)",
    unit: "‰ (trên 1.000 trẻ sinh sống)",
    scale: 1,
    displayUnit: "‰",
    decimals: 1,
    explanation:
      "Số trẻ tử vong trước 1 tuổi trên 1.000 trẻ sinh sống trong năm, theo UN IGME. Chỉ tiêu nhạy với chất lượng chăm sóc thai sản và sơ sinh.",
    thesisUse: [
      "Biến kết quả y tế trong đề tài về chi tiêu y tế công, bảo hiểm y tế hoặc bất bình đẳng thu nhập.",
      "Biến kiểm soát mức phát triển xã hội trong mô hình về mức sinh.",
    ],
  },
  {
    slug: "ty-so-tu-vong-me",
    code: "SH.STA.MMRT",
    theme: "Giáo dục & y tế",
    shortVi: "tỷ số tử vong mẹ",
    nameVi: "Tỷ số tử vong mẹ (trên 100.000 trẻ sinh sống, ước tính mô hình)",
    unit: "ca/100.000 trẻ sinh sống",
    scale: 1,
    displayUnit: "ca/100.000",
    decimals: 0,
    explanation:
      "Số phụ nữ tử vong do nguyên nhân liên quan đến thai sản trên 100.000 trẻ sinh sống, theo ước tính mô hình của nhóm liên cơ quan Liên Hợp Quốc (MMEIG). Đây là chỉ tiêu SDG 3.1.1.",
    thesisUse: [
      "Biến kết quả y tế bà mẹ trong đề tài về tiếp cận dịch vụ y tế, giáo dục của phụ nữ và nghèo.",
      "Là ước tính mô hình có khoảng tin cậy rộng; nên ghi chú khi so sánh từng năm.",
    ],
  },
  {
    slug: "suy-dinh-duong-thap-coi",
    code: "SH.STA.STNT.ZS",
    theme: "Giáo dục & y tế",
    shortVi: "tỷ lệ trẻ suy dinh dưỡng thấp còi",
    nameVi: "Tỷ lệ trẻ dưới 5 tuổi suy dinh dưỡng thể thấp còi (%)",
    ...pct(1),
    explanation:
      "Phần trăm trẻ dưới 5 tuổi có chiều cao theo tuổi thấp hơn trung vị chuẩn WHO hơn 2 độ lệch chuẩn. Thấp còi phản ánh thiếu dinh dưỡng kéo dài và ảnh hưởng lâu dài đến năng lực học tập, lao động.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về an ninh lương thực, nước sạch, giáo dục của mẹ và nghèo.",
      "Chỉ tiêu vốn con người sớm trong đề tài về tác động dài hạn của dinh dưỡng.",
    ],
  },
  {
    slug: "tiem-chung-soi",
    code: "SH.IMM.MEAS",
    theme: "Giáo dục & y tế",
    shortVi: "tỷ lệ tiêm chủng sởi",
    nameVi: "Tỷ lệ trẻ 12–23 tháng tuổi được tiêm vắc-xin sởi (%)",
    ...pct(0),
    explanation:
      "Phần trăm trẻ 12–23 tháng tuổi đã được tiêm vắc-xin sởi trước 12 tháng hoặc trong khoảng 12–23 tháng, theo ước tính WHO/UNICEF. Thường dùng làm đại diện cho độ bao phủ của chương trình tiêm chủng mở rộng.",
    thesisUse: [
      "Biến đầu vào y tế dự phòng trong mô hình về tử vong trẻ em.",
      "Đo năng lực hệ thống y tế cơ sở khi so sánh giữa các nước hoặc qua các giai đoạn.",
    ],
  },
  {
    slug: "bac-si",
    code: "SH.MED.PHYS.ZS",
    theme: "Giáo dục & y tế",
    shortVi: "số bác sĩ trên 1.000 dân",
    nameVi: "Số bác sĩ trên 1.000 dân",
    unit: "bác sĩ/1.000 dân",
    scale: 1,
    displayUnit: "bác sĩ/1.000 dân",
    decimals: 2,
    explanation:
      "Số bác sĩ (đa khoa và chuyên khoa) trên 1.000 dân theo số liệu nhân lực y tế của WHO. Chỉ tiêu đo nguồn nhân lực y tế sẵn có.",
    thesisUse: [
      "Biến đầu vào y tế trong mô hình về tuổi thọ, tử vong trẻ em hoặc hiệu quả hệ thống y tế (phân tích bao dữ liệu DEA giữa các nước).",
      "Bối cảnh cho đề tài về quá tải bệnh viện, phân bổ nhân lực y tế.",
    ],
  },
  {
    slug: "chi-tieu-y-te-binh-quan",
    code: "SH.XPD.CHEX.PC.CD",
    theme: "Giáo dục & y tế",
    shortVi: "chi tiêu y tế bình quân đầu người",
    nameVi: "Chi tiêu y tế thường xuyên bình quân đầu người (USD, giá hiện hành)",
    unit: "USD/người, giá hiện hành",
    scale: 1,
    displayUnit: "USD/người",
    decimals: 0,
    explanation:
      "Tổng chi tiêu y tế thường xuyên (công, tư, tiền túi) chia cho dân số, theo tài khoản y tế quốc gia của WHO. Không gồm chi đầu tư xây dựng cơ sở y tế.",
    thesisUse: [
      "Biến đầu vào y tế trong mô hình về tuổi thọ, tử vong trẻ em (thường lấy logarit).",
      "Kiểm định quan hệ giữa thu nhập và chi tiêu y tế (độ co giãn thu nhập của cầu y tế: y tế là hàng hoá thiết yếu hay xa xỉ).",
    ],
  },
  // ---------------------------------------------------------------- Năng lượng & môi trường
  {
    slug: "phat-thai-co2",
    code: "EN.GHG.CO2.MT.CE.AR5",
    theme: "Năng lượng & môi trường",
    shortVi: "tổng phát thải CO2",
    nameVi: "Tổng phát thải CO2, không gồm LULUCF (triệu tấn CO2 tương đương)",
    unit: "triệu tấn CO2e",
    scale: 1,
    displayUnit: "triệu tấn CO2e",
    decimals: 1,
    explanation:
      "Lượng CO2 phát thải từ đốt nhiên liệu hoá thạch, quá trình công nghiệp và các nguồn khác, không tính phần phát thải và hấp thụ do sử dụng đất, thay đổi sử dụng đất và lâm nghiệp (LULUCF), theo cơ sở dữ liệu EDGAR.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài kiểm định đường cong Kuznets môi trường (EKC) với GDP, GDP bình phương, năng lượng, FDI, độ mở thương mại.",
      "Kiểm định giả thuyết 'thiên đường ô nhiễm' (FDI làm tăng phát thải) bằng ARDL hoặc NARDL.",
    ],
  },
  {
    slug: "phat-thai-khi-nha-kinh",
    code: "EN.GHG.ALL.MT.CE.AR5",
    theme: "Năng lượng & môi trường",
    shortVi: "tổng phát thải khí nhà kính",
    nameVi: "Tổng phát thải khí nhà kính, không gồm LULUCF (triệu tấn CO2 tương đương)",
    unit: "triệu tấn CO2e",
    scale: 1,
    displayUnit: "triệu tấn CO2e",
    decimals: 1,
    explanation:
      "Tổng phát thải CO2, CH4, N2O và các khí nhà kính có fluor, quy đổi sang CO2 tương đương theo hệ số tiềm năng làm nóng toàn cầu của Báo cáo đánh giá lần thứ 5 (AR5) của IPCC, không tính LULUCF.",
    thesisUse: [
      "Thước đo áp lực khí hậu đầy đủ hơn CO2, phù hợp với đề tài có nông nghiệp (lúa nước phát thải nhiều CH4).",
      "Đánh giá tiến độ cam kết phát thải ròng bằng 0 của Việt Nam vào năm 2050.",
    ],
  },
  {
    slug: "tieu-thu-nang-luong-binh-quan",
    code: "EG.USE.PCAP.KG.OE",
    theme: "Năng lượng & môi trường",
    shortVi: "tiêu thụ năng lượng bình quân đầu người",
    nameVi: "Tiêu thụ năng lượng sơ cấp bình quân đầu người (kg dầu quy đổi)",
    unit: "kg dầu quy đổi/người",
    scale: 1,
    displayUnit: "kgOE/người",
    decimals: 0,
    explanation:
      "Lượng năng lượng sơ cấp sử dụng trong nước (sản xuất cộng nhập khẩu trừ xuất khẩu và dự trữ cho tàu biển, máy bay quốc tế) chia cho dân số, quy đổi ra kg dầu tương đương.",
    thesisUse: [
      "Biến năng lượng trong mô hình quan hệ năng lượng – tăng trưởng (giả thuyết tăng trưởng, bảo tồn, phản hồi, trung tính) bằng kiểm định nhân quả Toda–Yamamoto.",
      "Biến giải thích trong mô hình EKC về phát thải CO2.",
    ],
  },
  {
    slug: "cuong-do-nang-luong",
    code: "EG.EGY.PRIM.PP.KD",
    theme: "Năng lượng & môi trường",
    shortVi: "cường độ năng lượng",
    nameVi: "Cường độ năng lượng sơ cấp (MJ trên 1 USD GDP PPP 2021)",
    unit: "MJ/USD PPP 2021",
    scale: 1,
    displayUnit: "MJ/USD",
    decimals: 2,
    explanation:
      "Lượng năng lượng sơ cấp cần để tạo ra 1 đô la GDP theo sức mua (giá 2021). Cường độ giảm nghĩa là nền kinh tế sử dụng năng lượng hiệu quả hơn. Đây là chỉ tiêu SDG 7.3.1.",
    thesisUse: [
      "Biến hiệu quả năng lượng trong đề tài về công nghệ, cơ cấu ngành và phát thải.",
      "Phân rã thay đổi phát thải thành hiệu ứng quy mô, cơ cấu và kỹ thuật (phương pháp LMDI).",
    ],
  },
  {
    slug: "dien-tu-than",
    code: "EG.ELC.COAL.ZS",
    theme: "Năng lượng & môi trường",
    shortVi: "tỷ trọng điện từ than",
    nameVi: "Sản lượng điện từ than (% tổng sản lượng điện)",
    ...pct(1),
    explanation:
      "Phần trăm sản lượng điện sản xuất từ nhiệt điện than. Tỷ trọng này tăng mạnh ở Việt Nam sau năm 2010 và là nguồn phát thải lớn nhất của ngành điện.",
    thesisUse: [
      "Biến cơ cấu nguồn điện trong mô hình phát thải CO2 hoặc ô nhiễm không khí.",
      "Bối cảnh cho đề tài về chuyển dịch năng lượng, Quy hoạch điện VIII và năng lượng tái tạo.",
    ],
  },
  {
    slug: "dien-tai-tao",
    code: "EG.ELC.RNEW.ZS",
    theme: "Năng lượng & môi trường",
    shortVi: "tỷ trọng điện tái tạo",
    nameVi: "Sản lượng điện từ nguồn tái tạo (% tổng sản lượng điện, gồm thuỷ điện)",
    ...pct(1),
    explanation:
      "Phần trăm sản lượng điện từ thuỷ điện, điện gió, mặt trời, sinh khối, địa nhiệt. Với Việt Nam, phần lớn là thuỷ điện; điện mặt trời và gió tăng mạnh từ 2019. World Bank hiện chỉ cập nhật đến 2021.",
    thesisUse: [
      "Biến năng lượng sạch trong mô hình EKC hoặc đề tài về tác động của năng lượng tái tạo đến tăng trưởng và phát thải.",
      "Lưu ý tách thuỷ điện khi phân tích chính sách giá FIT cho điện gió, mặt trời.",
    ],
  },
  {
    slug: "ton-that-dien-nang",
    code: "EG.ELC.LOSS.ZS",
    theme: "Năng lượng & môi trường",
    shortVi: "tỷ lệ tổn thất điện năng",
    nameVi: "Tổn thất truyền tải và phân phối điện (% sản lượng)",
    ...pct(1),
    explanation:
      "Phần trăm điện năng bị mất trên đường truyền tải và phân phối, kể cả thất thoát do trộm điện. Chỉ tiêu phản ánh chất lượng hạ tầng lưới điện.",
    thesisUse: [
      "Biến chất lượng hạ tầng trong đề tài về hiệu quả ngành điện, đầu tư lưới điện.",
      "Dẫn chứng cải thiện hiệu quả vận hành của ngành điện qua thời gian.",
    ],
  },
  {
    slug: "dien-tich-rung",
    code: "AG.LND.FRST.ZS",
    theme: "Năng lượng & môi trường",
    shortVi: "tỷ lệ diện tích rừng",
    nameVi: "Diện tích rừng (% diện tích đất)",
    ...pct(1),
    explanation:
      "Phần trăm diện tích đất có rừng (tán che trên 10%, cây cao trên 5 m), gồm rừng tự nhiên và rừng trồng, theo Đánh giá tài nguyên rừng toàn cầu của FAO.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về mất rừng, tăng trưởng nông nghiệp và EKC cho rừng.",
      "Biến kiểm soát bể hấp thụ carbon trong mô hình phát thải.",
    ],
  },
  {
    slug: "o-nhiem-bui-pm25",
    code: "EN.ATM.PM25.MC.M3",
    theme: "Năng lượng & môi trường",
    shortVi: "nồng độ bụi mịn PM2.5",
    nameVi: "Mức phơi nhiễm bụi mịn PM2.5 trung bình năm (µg/m³)",
    unit: "µg/m³",
    scale: 1,
    displayUnit: "µg/m³",
    decimals: 1,
    explanation:
      "Nồng độ trung bình năm của bụi mịn có đường kính dưới 2,5 micromet mà dân số phải phơi nhiễm, có trọng số theo dân số, ước tính từ vệ tinh và mô hình. Hướng dẫn của WHO (2021) là 5 µg/m³.",
    thesisUse: [
      "Biến ô nhiễm không khí trong đề tài về sức khoẻ, năng suất lao động và tăng trưởng.",
      "Biến phụ thuộc thay thế cho CO2 trong mô hình EKC (ô nhiễm cục bộ).",
    ],
  },
  // ---------------------------------------------------------------- Nông nghiệp
  {
    slug: "tang-truong-nong-nghiep",
    code: "NV.AGR.TOTL.KD.ZG",
    theme: "Nông nghiệp & giá nông sản",
    shortVi: "tăng trưởng nông, lâm, thuỷ sản",
    nameVi: "Tốc độ tăng giá trị tăng thêm nông, lâm nghiệp và thuỷ sản (%/năm, giá so sánh)",
    unit: "%/năm",
    scale: 1,
    displayUnit: "%",
    decimals: 2,
    explanation:
      "Tốc độ tăng giá trị tăng thêm thực của khu vực nông, lâm nghiệp và thuỷ sản. Khu vực này tăng chậm và ổn định hơn công nghiệp, dịch vụ, và từng là 'bệ đỡ' của nền kinh tế năm 2020.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về tác động của biến đổi khí hậu, tín dụng nông nghiệp, đầu tư công cho nông nghiệp.",
      "So sánh với tăng trưởng GDP để phân tích đóng góp của nông nghiệp vào tăng trưởng.",
    ],
  },
  {
    slug: "san-luong-ngu-coc",
    code: "AG.PRD.CREL.MT",
    theme: "Nông nghiệp & giá nông sản",
    shortVi: "sản lượng lương thực có hạt",
    nameVi: "Sản lượng ngũ cốc (tấn): lúa, ngô và các loại hạt",
    unit: "tấn",
    scale: 1e6,
    displayUnit: "triệu tấn",
    decimals: 2,
    explanation:
      "Tổng sản lượng thu hoạch các loại ngũ cốc (lúa, ngô, lúa mì, kê…) theo FAO. Ở Việt Nam, lúa chiếm phần lớn sản lượng.",
    thesisUse: [
      "Biến đầu ra trong hàm sản xuất nông nghiệp (cùng diện tích, phân bón, lao động) hoặc đề tài về an ninh lương thực.",
      "Biến giải thích xuất khẩu gạo trong mô hình cung xuất khẩu.",
    ],
  },
  {
    slug: "nang-suat-ngu-coc",
    code: "AG.YLD.CREL.KG",
    theme: "Nông nghiệp & giá nông sản",
    shortVi: "năng suất ngũ cốc",
    nameVi: "Năng suất ngũ cốc (kg/ha)",
    unit: "kg/ha",
    scale: 1,
    displayUnit: "kg/ha",
    decimals: 0,
    explanation:
      "Sản lượng ngũ cốc thu hoạch trên mỗi hecta diện tích gieo trồng. Năng suất lúa của Việt Nam thuộc nhóm cao nhất Đông Nam Á.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về tác động của nhiệt độ, lượng mưa, phân bón, thuỷ lợi đến năng suất cây trồng.",
      "So sánh năng suất với Thái Lan, Indonesia, Philippines để phân tích lợi thế cạnh tranh của lúa gạo.",
    ],
  },
  {
    slug: "su-dung-phan-bon",
    code: "AG.CON.FERT.ZS",
    theme: "Nông nghiệp & giá nông sản",
    shortVi: "lượng phân bón sử dụng",
    nameVi: "Lượng phân bón sử dụng (kg trên 1 ha đất canh tác)",
    unit: "kg/ha đất canh tác",
    scale: 1,
    displayUnit: "kg/ha",
    decimals: 0,
    explanation:
      "Lượng dinh dưỡng đạm, lân, kali từ phân bón hoá học sử dụng trên mỗi hecta đất canh tác, theo FAO. Không gồm phân hữu cơ.",
    thesisUse: [
      "Biến đầu vào trong hàm sản xuất nông nghiệp; kết hợp với giá phân bón thế giới (urê, DAP) để phân tích tác động của cú sốc giá đầu vào.",
      "Biến áp lực môi trường trong đề tài về nông nghiệp bền vững, ô nhiễm nguồn nước.",
    ],
  },
  {
    slug: "chi-so-san-xuat-luong-thuc",
    code: "AG.PRD.FOOD.XD",
    theme: "Nông nghiệp & giá nông sản",
    shortVi: "chỉ số sản xuất lương thực, thực phẩm",
    nameVi: "Chỉ số sản xuất lương thực, thực phẩm (2014–2016 = 100)",
    unit: "chỉ số, 2014–2016 = 100",
    scale: 1,
    displayUnit: "điểm",
    decimals: 1,
    explanation:
      "Chỉ số khối lượng sản xuất các loại cây trồng, vật nuôi dùng làm thực phẩm và có giá trị dinh dưỡng (không gồm cà phê, chè), so với bình quân 2014–2016, theo FAO.",
    thesisUse: [
      "Biến sản lượng nông nghiệp tổng hợp trong mô hình an ninh lương thực, lạm phát lương thực.",
      "Biến kiểm soát cung trong đề tài về giá lương thực trong nước.",
    ],
  },
  {
    slug: "san-luong-nuoi-trong-thuy-san",
    code: "ER.FSH.AQUA.MT",
    theme: "Nông nghiệp & giá nông sản",
    shortVi: "sản lượng nuôi trồng thuỷ sản",
    nameVi: "Sản lượng nuôi trồng thuỷ sản (tấn)",
    unit: "tấn",
    scale: 1e6,
    displayUnit: "triệu tấn",
    decimals: 2,
    explanation:
      "Sản lượng cá, tôm, nhuyễn thể và các loài thuỷ sản khác nuôi trồng trong ao, lồng bè, vùng ven biển, theo FAO. Việt Nam là một trong những nước nuôi trồng thuỷ sản lớn nhất thế giới (cá tra, tôm).",
    thesisUse: [
      "Biến cung trong đề tài về xuất khẩu thuỷ sản, rào cản kỹ thuật (thẻ vàng IUU, chống bán phá giá).",
      "So sánh với sản lượng khai thác để phân tích chuyển dịch từ khai thác sang nuôi trồng.",
    ],
  },
  {
    slug: "san-luong-khai-thac-thuy-san",
    code: "ER.FSH.CAPT.MT",
    theme: "Nông nghiệp & giá nông sản",
    shortVi: "sản lượng khai thác thuỷ sản",
    nameVi: "Sản lượng khai thác thuỷ sản (tấn)",
    unit: "tấn",
    scale: 1e6,
    displayUnit: "triệu tấn",
    decimals: 2,
    explanation:
      "Sản lượng thuỷ sản đánh bắt tự nhiên ở biển và nội địa, theo FAO. Không gồm nuôi trồng.",
    thesisUse: [
      "Biến áp lực khai thác nguồn lợi biển trong đề tài về nghề cá bền vững, sinh kế ngư dân.",
      "Bối cảnh cho nghiên cứu về thẻ vàng IUU của Liên minh châu Âu.",
    ],
  },
  // ---------------------------------------------------------------- Công nghệ & chuyển đổi số
  {
    slug: "bang-thong-rong-co-dinh",
    code: "IT.NET.BBND.P2",
    theme: "Công nghệ & chuyển đổi số",
    shortVi: "thuê bao băng rộng cố định",
    nameVi: "Thuê bao Internet băng rộng cố định trên 100 dân",
    unit: "thuê bao/100 dân",
    scale: 1,
    displayUnit: "thuê bao/100 dân",
    decimals: 1,
    explanation:
      "Số thuê bao truy cập Internet tốc độ cao (từ 256 kbit/s) qua cáp quang, DSL, cáp đồng trục… trên 100 dân, theo Liên minh Viễn thông Quốc tế (ITU).",
    thesisUse: [
      "Biến hạ tầng số trong đề tài về kinh tế số, thương mại điện tử và tăng trưởng.",
      "Thành phần của chỉ số phát triển ICT tự xây dựng (cùng người dùng Internet, thuê bao di động).",
    ],
  },
  {
    slug: "xuat-khau-hang-ict",
    code: "TX.VAL.ICTG.ZS.UN",
    theme: "Công nghệ & chuyển đổi số",
    shortVi: "tỷ trọng xuất khẩu hàng ICT",
    nameVi: "Xuất khẩu hàng hoá công nghệ thông tin – truyền thông (% tổng xuất khẩu hàng hoá)",
    ...pct(1),
    explanation:
      "Phần trăm xuất khẩu máy tính, thiết bị ngoại vi, thiết bị truyền thông, điện tử tiêu dùng và linh kiện điện tử trong tổng xuất khẩu hàng hoá, theo UNCTAD. Tỷ trọng của Việt Nam tăng vọt sau khi Samsung đầu tư sản xuất điện thoại.",
    thesisUse: [
      "Biến cơ cấu xuất khẩu công nghệ trong đề tài về FDI ngành điện tử, chuỗi giá trị toàn cầu.",
      "So sánh với Malaysia, Philippines, Thái Lan, những nước cũng xuất khẩu nhiều hàng điện tử.",
    ],
  },
  {
    slug: "chi-nghien-cuu-phat-trien",
    code: "GB.XPD.RSDV.GD.ZS",
    theme: "Công nghệ & chuyển đổi số",
    shortVi: "chi tiêu cho R&D so với GDP",
    nameVi: "Chi tiêu cho nghiên cứu và phát triển (% GDP)",
    ...pct(2),
    displayUnit: "% GDP",
    unit: "% GDP",
    explanation:
      "Tổng chi cho nghiên cứu cơ bản, nghiên cứu ứng dụng và phát triển thực nghiệm của doanh nghiệp, Nhà nước, trường đại học và tổ chức phi lợi nhuận, chia cho GDP, theo UNESCO UIS. Việt Nam chỉ có số liệu ở một số năm điều tra.",
    thesisUse: [
      "Biến đầu vào đổi mới sáng tạo trong mô hình tăng trưởng nội sinh hoặc đề tài về năng suất.",
      "So sánh với mức 1–2% GDP của các nước công nghiệp mới để minh hoạ khoảng cách đầu tư cho khoa học.",
    ],
  },
  {
    slug: "don-dang-ky-sang-che",
    code: "IP.PAT.RESD",
    theme: "Công nghệ & chuyển đổi số",
    shortVi: "đơn đăng ký sáng chế của người trong nước",
    nameVi: "Số đơn đăng ký sáng chế của người cư trú",
    unit: "đơn",
    scale: 1,
    displayUnit: "đơn",
    decimals: 0,
    explanation:
      "Số đơn đăng ký sáng chế nộp tại Cục Sở hữu trí tuệ Việt Nam bởi người cư trú (cá nhân, doanh nghiệp trong nước), theo WIPO. Đây là thước đo đầu ra đổi mới sáng tạo trong nước.",
    thesisUse: [
      "Biến phụ thuộc trong đề tài về đầu tư R&D, vốn con người và đổi mới sáng tạo.",
      "Biến đại diện cho tiến bộ công nghệ trong mô hình tăng trưởng nội sinh (thường lấy ln(1 + số đơn)).",
    ],
  },
  {
    slug: "bai-bao-khoa-hoc",
    code: "IP.JRN.ARTC.SC",
    theme: "Công nghệ & chuyển đổi số",
    shortVi: "số bài báo khoa học",
    nameVi: "Số bài báo khoa học và kỹ thuật công bố",
    unit: "bài báo",
    scale: 1,
    displayUnit: "bài",
    decimals: 0,
    explanation:
      "Số bài báo khoa học, kỹ thuật của tác giả có địa chỉ tại Việt Nam công bố trên các tạp chí được chỉ mục, theo Quỹ Khoa học Quốc gia Mỹ (NSF). Bài viết chung nhiều nước được chia theo tỷ lệ.",
    thesisUse: [
      "Đo năng lực nghiên cứu quốc gia trong đề tài về giáo dục đại học, chính sách khoa học công nghệ.",
      "Biến đầu ra đổi mới sáng tạo bổ sung cho số đơn sáng chế.",
    ],
  },
];
