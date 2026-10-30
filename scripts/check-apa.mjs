// Unit check for the APA 7 citation tool (src/tools/trich-dan-apa.html): the formatter, run on real
// Crossref /works metadata saved in scripts/fixtures/apa-crossref.json (and DataCite CSL for arXiv),
// must give the APA 7 reference, italics and in-text citations below, written out by hand.
import { readFileSync } from "node:fs";

const src = readFileSync("src/tools/trich-dan-apa.html", "utf8");
const m = src.match(/\/\/#apa-start([\s\S]*?)\/\/#apa-end/);
if (!m) throw new Error("missing //#apa block");
const api = new Function(`${m[1]} return { normalize, formatRef, citeIn, prepare, segText, segHtml, sentenceCase, cleanTitle, initials, authorList, parseLine, yearOf, fixVnName, parseNames, isVnPerson, dedupe, groupCite, toRIS, toBibTeX, toDocx, matchScore, fixContainer };`)();
const fx = JSON.parse(readFileSync("scripts/fixtures/apa-crossref.json", "utf8"));
let failed = 0,
  passed = 0;
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failed++;
  else passed++;
};
const rec = doi => {
  const k = Object.keys(fx).find(k => k.toLowerCase() === doi.toLowerCase());
  if (!k) throw new Error(`no fixture ${doi}`);
  return api.normalize(fx[k]);
};
const ref = (r, o) => api.formatRef(r, o);

// [DOI, reference text, italic parts, in-text vi (paren, narrative), in-text en (paren, narrative)]
const CASES = [
  ["10.2307/249008", "Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS Quarterly, 13(3), 319–340. https://doi.org/10.2307/249008", ["MIS Quarterly", "13"], ["(Davis, 1989)", "Davis (1989)"], ["(Davis, 1989)", "Davis (1989)"]],
  ["10.2307/30036540", "Venkatesh, V., Morris, M. G., Davis, G. B., & Davis, F. D. (2003). User acceptance of information technology: Toward a unified view. MIS Quarterly, 27(3), 425–478. https://doi.org/10.2307/30036540", ["MIS Quarterly", "27"], ["(Venkatesh và cộng sự, 2003)", "Venkatesh và cộng sự (2003)"], ["(Venkatesh et al., 2003)", "Venkatesh et al. (2003)"]],
  ["10.1111/isj.12131", "Kock, N., & Hadaya, P. (2018). Minimum sample size estimation in PLS-SEM: The inverse square root and gamma-exponential methods. Information Systems Journal, 28(1), 227–261. https://doi.org/10.1111/isj.12131", ["Information Systems Journal", "28"], ["(Kock và Hadaya, 2018)", "Kock và Hadaya (2018)"], ["(Kock & Hadaya, 2018)", "Kock and Hadaya (2018)"]],
  ["10.3758/BRM.41.4.1149", "Faul, F., Erdfelder, E., Buchner, A., & Lang, A.-G. (2009). Statistical power analyses using G*Power 3.1: Tests for correlation and regression analyses. Behavior Research Methods, 41(4), 1149–1160. https://doi.org/10.3758/brm.41.4.1149", ["Behavior Research Methods", "41"], ["(Faul và cộng sự, 2009)", "Faul và cộng sự (2009)"], ["(Faul et al., 2009)", "Faul et al. (2009)"]],
  ["10.1037/0033-2909.112.1.155", "Cohen, J. (1992). A power primer. Psychological Bulletin, 112(1), 155–159. https://doi.org/10.1037/0033-2909.112.1.155", ["Psychological Bulletin", "112"], ["(Cohen, 1992)", "Cohen (1992)"], ["(Cohen, 1992)", "Cohen (1992)"]],
  ["10.1177/0013164413495237", "Wolf, E. J., Harrington, K. M., Clark, S. L., & Miller, M. W. (2013). Sample size requirements for structural equation models: An evaluation of power, bias, and solution propriety. Educational and Psychological Measurement, 73(6), 913–934. https://doi.org/10.1177/0013164413495237", ["Educational and Psychological Measurement", "73"], ["(Wolf và cộng sự, 2013)", "Wolf và cộng sự (2013)"], ["(Wolf et al., 2013)", "Wolf et al. (2013)"]],
  ["10.3389/fpsyg.2019.01021", "Fiebelkorn, F., & Menzel, S. (2019). Biology teachers’ worldviews on the global distribution and loss of biodiversity: A GIS-based mental-mapping approach. Frontiers in Psychology, 10, Article 1021. https://doi.org/10.3389/fpsyg.2019.01021", ["Frontiers in Psychology", "10"], ["(Fiebelkorn và Menzel, 2019)", "Fiebelkorn và Menzel (2019)"], ["(Fiebelkorn & Menzel, 2019)", "Fiebelkorn and Menzel (2019)"]],
  ["10.1007/978-3-030-80519-7", "Hair, J. F., Hult, G. T. M., Ringle, C. M., Sarstedt, M., Danks, N. P., & Ray, S. (2021). Partial least squares structural equation modeling (PLS-SEM) using R: A workbook. Springer International Publishing. https://doi.org/10.1007/978-3-030-80519-7", ["Partial least squares structural equation modeling (PLS-SEM) using R: A workbook"], ["(Hair và cộng sự, 2021)", "Hair và cộng sự (2021)"], ["(Hair et al., 2021)", "Hair et al. (2021)"]],
  ["10.1007/978-3-030-80519-7_1", "Hair, J. F., Jr., Hult, G. T. M., Ringle, C. M., Sarstedt, M., Danks, N. P., & Ray, S. (2021). An introduction to structural equation modeling. In Partial least squares structural equation modeling (PLS-SEM) using R (pp. 1–29). Springer International Publishing. https://doi.org/10.1007/978-3-030-80519-7_1", ["Partial least squares structural equation modeling (PLS-SEM) using R"], null, null],
  ["10.1145/3290605.3300233", "Amershi, S., Weld, D., Vorvoreanu, M., Fourney, A., Nushi, B., Collisson, P., Suh, J., Iqbal, S., Bennett, P. N., Inkpen, K., Teevan, J., Kikin-Gil, R., & Horvitz, E. (2019). Guidelines for human-AI interaction. In Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems (pp. 1–13). ACM. https://doi.org/10.1145/3290605.3300233", ["Proceedings of the 2019 CHI Conference on Human Factors in Computing Systems"], ["(Amershi và cộng sự, 2019)", "Amershi và cộng sự (2019)"], ["(Amershi et al., 2019)", "Amershi et al. (2019)"]],
  ["10.1101/2020.02.07.937862", "Gorbalenya, A. E., Baker, S. C., Baric, R. S., de Groot, R. J., Drosten, C., Gulyaeva, A. A., Haagmans, B. L., Lauber, C., Leontovich, A. M., Neuman, B. W., Penzar, D., Perlman, S., Poon, L. L. M., Samborskiy, D., Sidorov, I. A., Sola, I., & Ziebuhr, J. (2020). Severe acute respiratory syndrome-related coronavirus: The species and its viruses – a statement of the Coronavirus Study Group [Preprint]. bioRxiv. https://doi.org/10.1101/2020.02.07.937862", ["Severe acute respiratory syndrome-related coronavirus: The species and its viruses – a statement of the Coronavirus Study Group"], null, null],
  ["10.1037/0000165-000", "American Psychological Association. (2020). Publication manual of the American Psychological Association (7th ed.). https://doi.org/10.1037/0000165-000", ["Publication manual of the American Psychological Association"], ["(American Psychological Association, 2020)", "American Psychological Association (2020)"], null],
  ["csl:10.48550/ARXIV.1706.03762", "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., & Polosukhin, I. (2017). Attention is all you need [Preprint]. arXiv. https://doi.org/10.48550/ARXIV.1706.03762", ["Attention is all you need"], null, ["(Vaswani et al., 2017)", "Vaswani et al. (2017)"]],
  ["10.1111/j.1467-9280.2007.01882.x", "Fritz, M. S., & MacKinnon, D. P. (2007). Required sample size to detect the mediated effect. Psychological Science, 18(3), 233–239. https://doi.org/10.1111/j.1467-9280.2007.01882.x", ["Psychological Science", "18"], ["(Fritz và MacKinnon, 2007)", "Fritz và MacKinnon (2007)"], null],
  ["10.1177/002224378101800104", "Fornell, C., & Larcker, D. F. (1981). Evaluating structural equation models with unobservable variables and measurement error. Journal of Marketing Research, 18(1), 39–50. https://doi.org/10.1177/002224378101800104", ["Journal of Marketing Research", "18"], ["(Fornell và Larcker, 1981)", "Fornell và Larcker (1981)"], ["(Fornell & Larcker, 1981)", "Fornell and Larcker (1981)"]],
  ["10.1007/s11747-014-0403-8", "Henseler, J., Ringle, C. M., & Sarstedt, M. (2015). A new criterion for assessing discriminant validity in variance-based structural equation modeling. Journal of the Academy of Marketing Science, 43(1), 115–135. https://doi.org/10.1007/s11747-014-0403-8", ["Journal of the Academy of Marketing Science", "43"], ["(Henseler và cộng sự, 2015)", "Henseler và cộng sự (2015)"], null],
  ["10.1037/0021-9010.88.5.879", "Podsakoff, P. M., MacKenzie, S. B., Lee, J.-Y., & Podsakoff, N. P. (2003). Common method biases in behavioral research: A critical review of the literature and recommended remedies. Journal of Applied Psychology, 88(5), 879–903. https://doi.org/10.1037/0021-9010.88.5.879", ["Journal of Applied Psychology", "88"], null, ["(Podsakoff et al., 2003)", "Podsakoff et al. (2003)"]],
  ["10.1016/0749-5978(91)90020-T", "Ajzen, I. (1991). The theory of planned behavior. Organizational Behavior and Human Decision Processes, 50(2), 179–211. https://doi.org/10.1016/0749-5978(91)90020-t", ["Organizational Behavior and Human Decision Processes", "50"], ["(Ajzen, 1991)", "Ajzen (1991)"], null],
  ["10.1037/0022-3514.51.6.1173", "Baron, R. M., & Kenny, D. A. (1986). The moderator–mediator variable distinction in social psychological research: Conceptual, strategic, and statistical considerations. Journal of Personality and Social Psychology, 51(6), 1173–1182. https://doi.org/10.1037/0022-3514.51.6.1173", ["Journal of Personality and Social Psychology", "51"], ["(Baron và Kenny, 1986)", "Baron và Kenny (1986)"], null],
  ["10.1080/10705519909540118", "Hu, L.-T., & Bentler, P. M. (1999). Cutoff criteria for fit indexes in covariance structure analysis: Conventional criteria versus new alternatives. Structural Equation Modeling: A Multidisciplinary Journal, 6(1), 1–55. https://doi.org/10.1080/10705519909540118", ["Structural Equation Modeling: A Multidisciplinary Journal", "6"], null, ["(Hu & Bentler, 1999)", "Hu and Bentler (1999)"]],
  ["10.1191/1478088706qp063oa", "Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77–101. https://doi.org/10.1191/1478088706qp063oa", ["Qualitative Research in Psychology", "3"], null, null],
  ["10.1007/BF02310555", "Cronbach, L. J. (1951). Coefficient alpha and the internal structure of tests. Psychometrika, 16(3), 297–334. https://doi.org/10.1007/bf02310555", ["Psychometrika", "16"], ["(Cronbach, 1951)", "Cronbach (1951)"], null],
  ["10.2753/MTP1069-6679190202", "Hair, J. F., Ringle, C. M., & Sarstedt, M. (2011). PLS-SEM: Indeed a silver bullet. Journal of Marketing Theory and Practice, 19(2), 139–152. https://doi.org/10.2753/mtp1069-6679190202", ["Journal of Marketing Theory and Practice", "19"], null, null],
  ["10.1108/apjml-01-2017-0010", "Nguyen, O. D. Y., & Cassidy, J. F. (2018). Consumer intention and credit card adoption in Vietnam. Asia Pacific Journal of Marketing and Logistics, 30(4), 779–796. https://doi.org/10.1108/apjml-01-2017-0010", ["Asia Pacific Journal of Marketing and Logistics", "30"], ["(Nguyen và Cassidy, 2018)", "Nguyen và Cassidy (2018)"], null],
  // Vietnamese authors whose names Crossref stores in Western order
  ["10.25073/2588-1108/vnueab.4279", "Nguyen, T. H., & Cung, L. A. (2019). Internal service quality, external service quality, employee Satisfaction and customer Satisfaction for Vietnamese hotels: A theoretical approach. VNU Journal of Science: Economics and Business, 35(4). https://doi.org/10.25073/2588-1108/vnueab.4279", ["VNU Journal of Science: Economics and Business", "35"], ["(Nguyen và Cung, 2019)", "Nguyen và Cung (2019)"], null],
  ["10.22144/ctu.jsi.2019.104", "Nguyễn, T. H. H., & Đỗ, T. A. (2019). Phát triển năng lực tạo lập văn bản thuyết minh cho học sinh thông qua phân tích mẫu trong dạy đọc hiểu. Can Tho University Journal of Science, 55(Khoa học Giáo dục), 89. https://doi.org/10.22144/ctu.jsi.2019.104", ["Can Tho University Journal of Science", "55"], ["(Nguyễn và Đỗ, 2019)", "Nguyễn và Đỗ (2019)"], null],
  ["10.1108/jm2-08-2025-0447", "Truong, T. P. A., & Pham, N. D. (2026). Modeling the impact of servant leadership on frugal innovation: Sequential mediation of collaborative culture and corporate social responsibility to employees. Journal of Modelling in Management. Advance online publication. https://doi.org/10.1108/jm2-08-2025-0447", ["Journal of Modelling in Management"], ["(Truong và Pham, 2026)", "Truong và Pham (2026)"], null],
  ["10.33301/jed-p-2018-20-02-03", "Ho, D. B., Pham, V. M., Pham, V. T., & Truong, N. H. (2018). A stochastic analysis of Vietnam bilateral trade efficiency. Journal of Economics and Development, 50–64. https://doi.org/10.33301/jed-p-2018-20-02-03", ["Journal of Economics and Development"], ["(Ho và cộng sự, 2018)", "Ho và cộng sự (2018)"], null],
  ["10.1177/1073274821989320", "Tran, V. T., Dao, V. T., Nguyen, K.-D., Ta, V. T., Vu, K. T., Trinh, S. H., Nguyen, H. C., Bui, T. O., Nguyen, Q. T., Vu, H. D., Nguyen, H. L., & Tran, H. T. (2021). Risk factors of Pancreatic Cancer in Vietnam: A matched case–control hospital-based study. Cancer Control, 28, Article 1073274821989320. https://doi.org/10.1177/1073274821989320", ["Cancer Control", "28"], null, ["(Tran et al., 2021)", "Tran et al. (2021)"]],
  ["10.46223/hcmcoujs.soci.en.14.4.2951.2024", "Phan, T. T. N. (2024). Attitudes of English majors towards the use of the Quizizz platform in English language learning. Ho Chi Minh City Open University Journal of Science - Social Sciences, 14(4), 69–83. https://doi.org/10.46223/hcmcoujs.soci.en.14.4.2951.2024", ["Ho Chi Minh City Open University Journal of Science - Social Sciences", "14"], ["(Phan, 2024)", "Phan (2024)"], null],
  ["10.46223/hcmcoujs.econ.vi.17.4.2025.2022", "Ma, T. N. (2023). Các mô hình hồi quy cơ bản trong quản trị kinh doanh. Tạp Chí Khoa Học Đại Học Mở Thành Phố Hồ Chí Minh - Kinh Tế và Quản Trị Kinh Doanh, 17(4), 150–158. https://doi.org/10.46223/hcmcoujs.econ.vi.17.4.2025.2022", ["Tạp Chí Khoa Học Đại Học Mở Thành Phố Hồ Chí Minh - Kinh Tế và Quản Trị Kinh Doanh", "17"], ["(Ma, 2023)", "Ma (2023)"], null],
  ["10.13106/jafeb.2019.vol6.no4.261", "Nguyen, H. M., & Bui, T. K. (2019). The relationship between the perceived mental benefits, online trust, and personal information disclosure in online shopping. The Journal of Asian Finance, Economics and Business, 6(4), 261–270. https://doi.org/10.13106/jafeb.2019.vol6.no4.261", ["The Journal of Asian Finance, Economics and Business", "6"], ["(Nguyen và Bui, 2019)", "Nguyen và Bui (2019)"], null],
  ["10.1108/jabes-05-2020-0053", "Truong, T. H. H. (2021). The drivers of omni-channel shopping intention: A case study for fashion retailing sector in Danang, Vietnam. Journal of Asian Business and Economic Studies, 28(2), 143–159. https://doi.org/10.1108/jabes-05-2020-0053", ["Journal of Asian Business and Economic Studies", "28"], ["(Truong, 2021)", "Truong (2021)"], null],
  // other source types
  ["10.1596/2070-8416-0001", "Sadler, M. (2008). Cotton in the global context. World Bank. https://doi.org/10.1596/2070-8416-0001", ["Cotton in the global context"], ["(Sadler, 2008)", "Sadler (2008)"], null],
  ["10.32657/10356/19917", "Sadreddini, S. (n.d.). Fouling mitigation in coagulation microfiltration hybrid system for drinking water treatment [Doctoral dissertation, Nanyang Technological University]. https://doi.org/10.32657/10356/19917", ["Fouling mitigation in coagulation microfiltration hybrid system for drinking water treatment"], ["(Sadreddini, n.d.)", "Sadreddini (n.d.)"], null],
  ["csl:10.5281/zenodo.3509134", "The pandas development team. (2026). pandas-dev/pandas: Pandas (Version 3.1.0) [Computer software]. Zenodo. https://doi.org/10.5281/ZENODO.3509134", ["pandas-dev/pandas: Pandas"], null, ["(The pandas development team, 2026)", "The pandas development team (2026)"]],
  ["10.1007/978-3-319-05542-8_15-1", "Sarstedt, M., Ringle, C. M., & Hair, J. F. (2017). Partial least squares structural equation modeling. In Handbook of market research (pp. 1–40). Springer International Publishing. https://doi.org/10.1007/978-3-319-05542-8_15-1", ["Handbook of market research"], null, null],
  ["10.1038/s41586-020-2649-2", "Harris, C. R., Millman, K. J., van der Walt, S. J., Gommers, R., Virtanen, P., Cournapeau, D., Wieser, E., Taylor, J., Berg, S., Smith, N. J., Kern, R., Picus, M., Hoyer, S., van Kerkwijk, M. H., Brett, M., Haldane, A., del Río, J. F., Wiebe, M., Peterson, P., . . . Oliphant, T. E. (2020). Array programming with NumPy. Nature, 585(7825), 357–362. https://doi.org/10.1038/s41586-020-2649-2", ["Nature", "585"], ["(Harris và cộng sự, 2020)", "Harris và cộng sự (2020)"], null],
];
for (const [doi, text, italics, vi, en] of CASES) {
  const r = rec(doi), f = ref(r);
  const got = api.segText(f.seg);
  check(got === text, `${doi}: reference${got === text ? "" : `\n     want ${text}\n     got  ${got}`}`);
  const it = f.seg.filter(s => s.i).map(s => s.t);
  check(JSON.stringify(it) === JSON.stringify(italics), `${doi}: italics ${JSON.stringify(it)}`);
  if (vi) { const c = api.citeIn(r, "vi"); check(c.paren === vi[0] && c.narr === vi[1], `${doi}: in-text vi ${c.paren} / ${c.narr}`); }
  if (en) { const c = api.citeIn(r, "en"); check(c.paren === en[0] && c.narr === en[1], `${doi}: in-text en ${c.paren} / ${c.narr}`); }
}

// ---- details ----
check(rec("10.1111/isj.12131").year === 2018, "issue year wins over online-first year (Kock & Hadaya 2016 online, 2018 issue)");
check(/Chỉ có trang đầu/.test(ref(rec("10.2307/1913827")).warn.join(" ")), "a start page alone is flagged (Hausman 1978)");
check(api.segHtml(ref(rec("10.2307/249008")).seg).includes("<i>MIS Quarterly</i>, <i>13</i>(3)"), "HTML: journal and volume italic, issue not");
check(api.segText(ref(rec("10.2307/249008"), { sentence: false }).seg).includes("Perceived Usefulness, Perceived Ease of Use"), "sentence case can be switched off");
check(api.initials("Albert-Georg") === "A.-G." && api.initials("J.F.") === "J. F." && api.initials("G. Tomas M.") === "G. T. M." && api.initials("Thị Thu Hà") === "T. T. H.", "initials: hyphenated, run together, Vietnamese");
const many = Array.from({ length: 23 }, (_, i) => ({ family: `Tac${String.fromCharCode(65 + i)}`, given: "An" }));
const al = api.authorList(many);
check(al.startsWith("TacA, A., TacB, A.,") && al.includes("TacS, A., . . . TacW, A.") && !al.includes("TacT"), "21+ authors: first 19, ellipsis, last");
check(api.authorList(many.slice(0, 20)).endsWith("TacS, A., & TacT, A."), "20 authors listed in full with &");
const vn = api.normalize({ type: "journal-article", title: ["Factors affecting online shopping intention of Vietnamese consumers"], author: [{ given: "Thi Thu Ha", family: "NGUYEN" }, { given: "Van An", family: "Tran" }, { given: "Minh", family: "Le" }], "container-title": ["Journal of Asian Finance, Economics and Business"], volume: "7", issue: "10", page: "1-10", issued: { "date-parts": [[2020]] }, DOI: "10.1/x" });
check(api.segText(ref(vn).seg).startsWith("Nguyen, T. T. H., Tran, V. A., & Le, M. (2020). Factors affecting online shopping intention of Vietnamese consumers."), "Vietnamese names: family in caps fixed, given to initials; sentence-case title untouched");
check(api.citeIn(vn, "vi").narr === "Nguyen và cộng sự (2020)", "Vietnamese in-text: Nguyen và cộng sự (2020)");
check(api.sentenceCase("The Impact of COVID-19 on Vietnamese SMEs: Evidence From Hanoi") === "The impact of COVID-19 on Vietnamese SMEs: Evidence from Hanoi", "sentence case keeps acronyms, proper nouns, capital after colon");
check(api.sentenceCase("Why Do People Use TikTok? A Uses and Gratifications Approach") === "Why do people use TikTok? A uses and gratifications approach", "sentence case: capital after a question mark");
check(api.cleanTitle("<i>Title</i>\n  : sub", null) === "Title: sub" && api.cleanTitle("A View1") === "A View" && api.cleanTitle("Main", ["the subtitle"]) === "Main: The subtitle", "title cleaning: tags, spaces, footnote digit, subtitle");
const noAuth = api.normalize({ type: "journal-article", title: ["Editorial Note on Sampling"], "container-title": ["Some Journal"], volume: "3", page: "1-2", issued: { "date-parts": [[2021]] } });
check(api.segText(ref(noAuth).seg).startsWith("Editorial note on sampling. (2021). Some Journal, 3, 1–2.") && api.citeIn(noAuth, "vi").paren === "(“Editorial note on sampling”, 2021)", "no author: title moves to the author position");
const noYear = api.normalize({ type: "report", title: ["Annual report"], author: [{ name: "World Bank" }], publisher: "World Bank" });
check(api.segText(ref(noYear).seg) === "World Bank. (n.d.). Annual report." && api.citeIn(noYear, "en").paren === "(World Bank, n.d.)", "group author, no date: n.d.; publisher same as author left out (APA 7, 9.24)");

// ---- Crossref quirks around Vietnamese records ----
check(rec("10.13106/jafeb.2019.vol6.no4.261").authors.length === 2 && /nơi công tác/.test(ref(rec("10.13106/jafeb.2019.vol6.no4.261")).warn.join(" ")), "an affiliation listed as author is dropped with a note (JAFEB)");
check(/viết hoa toàn bộ/.test(ref(rec("10.46223/hcmcoujs.soci.en.14.4.2951.2024")).warn.join(" ")), "an ALL CAPS journal name is fixed with a note");
check(/ghi ngược tên Việt “Ha, N. T.”/.test(ref(rec("10.25073/2588-1108/vnueab.4279")).warn.join(" ")), "a reversed Vietnamese name is reported");
check(rec("10.22144/ctu.jsi.2019.104").lang === "vi" && rec("10.2307/249008").lang === "en", "source language read from the title");
const fv = (f, g) => { const b = api.fixVnName({ family: f, given: g }); return `${b.family}|${b.given}`; };
check(fv("Nguyen", "Thi Thu Ha") === "Nguyen|Thi Thu Ha" && fv("Tran", "Van Dat") === "Tran|Van Dat" && fv("Smith", "John") === "Smith|John" && fv("Han", "Jung Woo") === "Han|Jung Woo" && fv("Ho", "Wing-Kai") === "Ho|Wing-Kai" && fv("Lee", "J.-Y.") === "Lee|J.-Y.", "names already in order, Korean and Chinese names left alone");
check(fv("Hạnh", "Nguyễn Thị Hồng") === "Nguyễn|Thị Hồng Hạnh" && fv("Ngoc Anh", "Luu Dam") === "Luu|Dam Ngoc Anh" && fv("KHOA", "Bui Thanh") === "Bui|Thanh Khoa", "given name starting with a surname is turned round");
check(fv("Van Pham", "Minh") === "Pham|Van Minh" && fv("Nguyen Khac", "Minh") === "Nguyen|Khac Minh" && fv("Truong Thi Phuong", "Anh") === "Truong|Thi Phuong Anh", "surname inside a two- or three-word family field");
check(fv("Phan", "Nga Thi Tuyet") === "Phan|Thi Tuyet Nga" && fv("Bui", "Oanh Thi") === "Bui|Thi Oanh", "given name in Western order moved round the middle name Thi/Van");

check(api.isVnPerson(rec("10.25073/2588-1108/vnueab.4279").authors[1]) && !api.isVnPerson({ family: "Ho", given: "Wing-Kai" }) && !api.isVnPerson({ family: "Lee", given: "Jeong-Yeon" }), "Vietnamese person detected for the full-name option (Cung Lan Anh), not Chinese or Korean names");

// ---- manual entry: name parsing ----
const PN = t => api.parseNames(t).map(a => a.family ? `${a.family}|${a.given}${a.suffix ? "|" + a.suffix : ""}` : `{${a.name}}`).join(" ; ");
check(PN("Nguyễn Thị Thu Hà\nTrần Văn An") === "Nguyễn|Thị Thu Hà ; Trần|Văn An", "Vietnamese full names: surname first");
check(PN("Smith, John A.\nJohn A. Smith\nLudwig van Beethoven\nHair, Joseph F., Jr.") === "Smith|John A. ; Smith|John A. ; van Beethoven|Ludwig ; Hair|Joseph F.|Jr.", `Western names: comma form, natural order, particle, suffix (${PN("Smith, John A.\nJohn A. Smith\nLudwig van Beethoven\nHair, Joseph F., Jr.")})`);
check(PN("Tổng cục Thống kê; Quốc hội\n{Genius Data}\nWorld Bank\nWHO") === "{Tổng cục Thống kê} ; {Quốc hội} ; {Genius Data} ; {World Bank} ; {WHO}", "organisations: keywords, braces, acronyms");
check(PN("Nguyen Van An") === "Nguyen|Van An" && PN("Le Thi Mai") === "Le|Thi Mai", "Vietnamese names without diacritics");

// ---- manual entry: one record per source type, checked against APA 7 examples ----
const M = o => ({ manual: true, authors: [], editors: [], lang: "vi", title: "", ...o });
const MT = (o, opt) => api.segText(ref(M(o), opt).seg);
const MI = (o, opt) => ref(M(o), opt).seg.filter(s => s.i).map(s => s.t);
const eq = (got, want, label) => check(got === want, `${label}${got === want ? "" : `\n     want ${want}\n     got  ${got}`}`);
const vnA = api.parseNames("Nguyễn Thị Thu Hà\nTrần Văn An");
const vnArticle = { kind: "article", authors: vnA, year: 2020, title: "Các nhân tố ảnh hưởng đến ý định mua sắm trực tuyến của người tiêu dùng tại Thành phố Hồ Chí Minh", container: "Tạp chí Kinh tế và Phát triển", volume: "280", issue: "2", page: "12–21" };
eq(MT(vnArticle), "Nguyễn, T. T. H., & Trần, V. A. (2020). Các nhân tố ảnh hưởng đến ý định mua sắm trực tuyến của người tiêu dùng tại Thành phố Hồ Chí Minh. Tạp chí Kinh tế và Phát triển, 280(2), 12–21.", "manual Vietnamese journal article, no DOI");
check(JSON.stringify(MI(vnArticle)) === JSON.stringify(["Tạp chí Kinh tế và Phát triển", "280"]), "manual article: journal and volume italic");
eq(MT(vnArticle, { vnFull: true }), "Nguyễn Thị Thu Hà & Trần Văn An. (2020). Các nhân tố ảnh hưởng đến ý định mua sắm trực tuyến của người tiêu dùng tại Thành phố Hồ Chí Minh. Tạp chí Kinh tế và Phát triển, 280(2), 12–21.", "full Vietnamese names kept when asked");
check(api.citeIn(M(vnArticle), "vi", { vnFull: true }).paren === "(Nguyễn Thị Thu Hà và Trần Văn An, 2020)" && api.citeIn(M(vnArticle), "vi").paren === "(Nguyễn và Trần, 2020)", "in-text: full names or surnames");
check(MT({ ...vnArticle, trans: "Factors affecting online shopping intention of consumers in Ho Chi Minh City" }).includes("Thành phố Hồ Chí Minh [Factors affecting online shopping intention of consumers in Ho Chi Minh City]. Tạp chí"), "translated title in square brackets after the original");
eq(MT({ kind: "article", authors: vnA, year: 2019, title: "Tên bài", container: "Tạp chí Ngân hàng", issue: "15", page: "3–9" }), "Nguyễn, T. T. H., & Trần, V. A. (2019). Tên bài. Tạp chí Ngân hàng, (15), 3–9.", "journal with issue number only");
eq(MT({ kind: "book", authors: api.parseNames("Nguyễn Đình Thọ"), year: 2014, title: "Phương pháp nghiên cứu khoa học trong kinh doanh", edition: "2", publisher: "Nhà xuất bản Tài chính" }), "Nguyễn, Đ. T. (2014). Phương pháp nghiên cứu khoa học trong kinh doanh (Xuất bản lần thứ 2). Nhà xuất bản Tài chính.", "Vietnamese book with edition");
eq(MT({ kind: "book", lang: "en", authors: api.parseNames("Hair, Joseph F.\nBlack, William C.\nBabin, Barry J.\nAnderson, Rolph E."), year: 2019, title: "Multivariate data analysis", edition: "8", publisher: "Cengage" }), "Hair, J. F., Black, W. C., Babin, B. J., & Anderson, R. E. (2019). Multivariate data analysis (8th ed.). Cengage.", "English book, 8th ed. (APA 7 10.2)");
eq(MT({ kind: "book", lang: "en", editors: api.parseNames("Hoyle, Rick H."), year: 2012, title: "Handbook of structural equation modeling", publisher: "Guilford Press" }), "Hoyle, R. H. (Ed.). (2012). Handbook of structural equation modeling. Guilford Press.", "edited book: editor in the author position (Ed.)");
eq(MT({ kind: "chapter", lang: "en", authors: api.parseNames("Sarstedt, Marko\nRingle, Christian M.\nHair, Joseph F."), editors: api.parseNames("Homburg, Christian\nKlarmann, Martin\nVomberg, Arnd"), year: 2022, title: "Partial least squares structural equation modeling", container: "Handbook of market research", page: "587–632", publisher: "Springer" }), "Sarstedt, M., Ringle, C. M., & Hair, J. F. (2022). Partial least squares structural equation modeling. In C. Homburg, M. Klarmann, & A. Vomberg (Eds.), Handbook of market research (pp. 587–632). Springer.", "chapter in an edited book, three editors (APA 7 10.3)");
eq(MT({ kind: "chapter", authors: api.parseNames("Lê Văn Huy"), editors: api.parseNames("Nguyễn Văn Thắng"), year: 2017, title: "Mô hình cấu trúc tuyến tính", container: "Giáo trình phương pháp nghiên cứu", page: "120–150", publisher: "Nhà xuất bản Đại học Kinh tế Quốc dân" }), "Lê, V. H. (2017). Mô hình cấu trúc tuyến tính. Trong V. T. Nguyễn (Chủ biên), Giáo trình phương pháp nghiên cứu (tr. 120–150). Nhà xuất bản Đại học Kinh tế Quốc dân.", "Vietnamese chapter: Trong, Chủ biên, tr.");
eq(MT({ kind: "proceedings", lang: "vi", authors: api.parseNames("Hoàng Trọng"), year: 2022, title: "Ứng dụng PLS-SEM trong nghiên cứu marketing", container: "Kỷ yếu Hội thảo khoa học quốc gia Kinh tế số", page: "45–58", publisher: "Nhà xuất bản Lao động" }), "Hoàng, T. (2022). Ứng dụng PLS-SEM trong nghiên cứu marketing. Trong Kỷ yếu Hội thảo khoa học quốc gia Kinh tế số (tr. 45–58). Nhà xuất bản Lao động.", "Vietnamese conference proceedings");
eq(MT({ kind: "thesis", authors: api.parseNames("Phạm Thị Lan"), year: 2021, title: "Ảnh hưởng của truyền miệng điện tử đến ý định mua hàng", thesisType: "master", institution: "Trường Đại học Kinh tế Quốc dân" }), "Phạm, T. L. (2021). Ảnh hưởng của truyền miệng điện tử đến ý định mua hàng [Luận văn thạc sĩ chưa xuất bản]. Trường Đại học Kinh tế Quốc dân.", "unpublished Vietnamese master's thesis");
eq(MT({ kind: "thesis", authors: api.parseNames("Phạm Thị Lan"), year: 2021, title: "Tên luận án", thesisType: "doctoral", institution: "Trường Đại học Kinh tế Quốc dân", url: "https://lib.neu.edu.vn/x" }), "Phạm, T. L. (2021). Tên luận án [Luận án tiến sĩ, Trường Đại học Kinh tế Quốc dân]. https://lib.neu.edu.vn/x", "Vietnamese dissertation online");
eq(MT({ kind: "thesis", lang: "en", authors: api.parseNames("Nguyen, Van An"), year: 2018, title: "Essays on corporate governance in Vietnam", thesisType: "doctoral", institution: "University of Tasmania", database: "ProQuest Dissertations and Theses Global" }), "Nguyen, V. A. (2018). Essays on corporate governance in Vietnam [Doctoral dissertation, University of Tasmania]. ProQuest Dissertations and Theses Global.", "dissertation from a database (APA 7 10.6)");
eq(MT({ kind: "thesis", lang: "en", authors: api.parseNames("Harris, Lisa"), year: 2014, title: "Instructional leadership perceptions and practices", thesisType: "doctoral", institution: "University of Missouri" }), "Harris, L. (2014). Instructional leadership perceptions and practices [Unpublished doctoral dissertation]. University of Missouri.", "unpublished dissertation (APA 7 10.6)");
eq(MT({ kind: "report", authors: api.parseNames("Tổng cục Thống kê"), year: 2023, title: "Niên giám thống kê 2022", publisher: "Nhà xuất bản Thống kê" }), "Tổng cục Thống kê. (2023). Niên giám thống kê 2022. Nhà xuất bản Thống kê.", "government report, group author");
eq(MT({ kind: "report", lang: "en", authors: api.parseNames("World Bank"), year: 2022, title: "Vietnam country climate and development report", publisher: "World Bank", url: "https://openknowledge.worldbank.org/handle/10986/37618" }), "World Bank. (2022). Vietnam country climate and development report. https://openknowledge.worldbank.org/handle/10986/37618", "report: publisher same as author left out");
eq(MT({ kind: "report", lang: "en", authors: api.parseNames("National Cancer Institute"), year: 2019, title: "Taking time: Support for people with cancer", number: "18-2059", publisher: "U.S. Department of Health and Human Services", url: "https://www.cancer.gov/publications/patient-education/takingtime.pdf" }), "National Cancer Institute. (2019). Taking time: Support for people with cancer (Report No. 18-2059). U.S. Department of Health and Human Services. https://www.cancer.gov/publications/patient-education/takingtime.pdf", "report with number (APA 7 10.4 example)");
eq(MT({ kind: "web", authors: api.parseNames("Bộ Y tế"), year: 2023, month: 5, day: 4, title: "Hướng dẫn phòng chống sốt xuất huyết", container: "Bộ Y tế", url: "https://moh.gov.vn/x" }), "Bộ Y tế. (2023, ngày 4 tháng 5). Hướng dẫn phòng chống sốt xuất huyết. https://moh.gov.vn/x", "web page by an organisation: site name same as author left out");
check(JSON.stringify(MI({ kind: "web", authors: api.parseNames("Bộ Y tế"), year: 2023, title: "Hướng dẫn", url: "https://moh.gov.vn/x" })) === JSON.stringify(["Hướng dẫn"]), "web page title italic");
eq(MT({ kind: "web", lang: "en", authors: [], year: null, title: "Labor force survey", container: "General Statistics Office of Vietnam", url: "https://www.gso.gov.vn/en/", accessed: "2024-03-05" }), "Labor force survey. (n.d.). General Statistics Office of Vietnam. Retrieved March 5, 2024, from https://www.gso.gov.vn/en/", "web page, no author, no date, retrieval date (APA 7 10.16)");
eq(MT({ kind: "news", authors: api.parseNames("Minh Sơn"), year: 2024, month: 1, day: 12, title: "Giá vàng tăng mạnh", container: "VnExpress", url: "https://vnexpress.net/x" }), "Sơn, M. (2024, ngày 12 tháng 1). Giá vàng tăng mạnh. VnExpress. https://vnexpress.net/x", "online news: pen name read as Given Family");
eq(MT({ kind: "news", lang: "en", authors: api.parseNames("Guarino, Ben"), year: 2017, month: 12, day: 4, title: "How will humanity react to alien life? Psychologists have some predictions", container: "The Washington Post", url: "https://www.washingtonpost.com/x" }), "Guarino, B. (2017, December 4). How will humanity react to alien life? Psychologists have some predictions. The Washington Post. https://www.washingtonpost.com/x", "online news (APA 7 10.1 example 16)");
check(JSON.stringify(MI({ kind: "news", authors: [], year: 2024, title: "Tin", container: "Tuổi Trẻ", url: "u" })) === JSON.stringify(["Tuổi Trẻ"]), "news: newspaper italic only");
const law = { kind: "legal", authors: api.parseNames("Quốc hội"), year: 2020, title: "Luật Doanh nghiệp", number: "59/2020/QH14", url: "https://vbpl.vn/x" };
check(MT(law) === "Quốc hội. (2020). Luật Doanh nghiệp số 59/2020/QH14. https://vbpl.vn/x" && JSON.stringify(MI(law)) === JSON.stringify(["Luật Doanh nghiệp số 59/2020/QH14"]), "Vietnamese law: issuing body, title with number in italics, not sentence-cased");
check(api.citeIn(M(law), "vi").paren === "(Quốc hội, 2020)", "law in-text: (Quốc hội, 2020)");
eq(MT({ kind: "legal", authors: api.parseNames("Chính phủ"), year: 2023, title: "Nghị định về bảo vệ dữ liệu cá nhân", number: "13/2023/NĐ-CP" }), "Chính phủ. (2023). Nghị định về bảo vệ dữ liệu cá nhân số 13/2023/NĐ-CP.", "decree without link");

// ---- in-text: same surname, different first authors; group citations ----
const same = api.prepare([M({ ...vnArticle }), M({ kind: "article", authors: api.parseNames("Nguyễn Văn Bình"), year: 2021, title: "Bài khác", container: "Tạp chí X", volume: "1", page: "1–2" })]);
check(api.citeIn(same[0], "vi").paren === "(T. T. H. Nguyễn và Trần, 2020)" && api.citeIn(same[1], "vi").paren === "(V. B. Nguyễn, 2021)", "first authors with the same surname get initials (APA 7 8.20)");
check(api.citeIn(api.prepare([M({ ...vnArticle }), M({ kind: "article", authors: api.parseNames("Nguyễn Văn Bình"), year: 2021, title: "Bài khác", container: "X" })], { vnFull: true })[0], "vi", { vnFull: true }).paren === "(Nguyễn Thị Thu Hà và Trần Văn An, 2020)", "no initials needed with full names");
check(api.citeIn(api.prepare([M({ ...vnArticle }), M({ ...vnArticle, title: "Bài thứ hai" })])[0], "vi").paren === "(Nguyễn và Trần, 2020a)", "same authors and year: a/b, no initials");
const grp = api.prepare(["10.2307/30036540", "10.2307/249008", "10.1108/EBR-11-2018-0203", "10.1007/978-3-030-80519-7", "10.1007/978-3-030-80519-7_1", "10.1111/isj.12131"].map(rec));
eq(api.groupCite(grp, "en"), "(Davis, 1989; Hair et al., 2019, 2021a, 2021b; Kock & Hadaya, 2018; Venkatesh et al., 2003)", "group citation A–Z, semicolons, same name once with years in order");
check(api.groupCite(grp.slice(0, 1), "vi") === "(Davis, 1989)", "group of one");

const kap = (co, t) => M({ kind: "article", lang: "en", authors: api.parseNames("Kapoor, A.;Bloom, B.;" + co + ";Lee, D."), year: 2017, title: t, container: "J", volume: "1", page: "1–2" });
const kp = api.prepare([kap("Montez, C.", "First paper"), kap("Zucker, C.", "Second paper")]);
check(api.citeIn(kp[0], "en").paren === "(Kapoor, Bloom, Montez, et al., 2017)" && api.citeIn(kp[1], "en").paren === "(Kapoor, Bloom, Zucker, et al., 2017)" && api.citeIn(kp[0], "vi").paren === "(Kapoor, Bloom, Montez, và cộng sự, 2017)", "et al. that would collide names enough authors (APA 7 8.18)");
// ---- de-duplication ----
const d1 = rec("10.2307/249008"), d2 = { ...rec("10.2307/249008") }, d3 = { ...rec("10.2307/249008"), doi: "", manual: true };
const dd = api.dedupe([d1, d2, d3, rec("10.1111/isj.12131")]);
check(dd.kept.length === 2 && dd.dropped.length === 2 && dd.kept[0].manual === true, "duplicates by DOI and by title+year, the manual copy kept");
check(api.dedupe([vnArticle, { ...vnArticle, year: 2021 }]).kept.length === 2, "same title, different year: kept apart");

// ---- title search: unrelated Crossref guesses rejected ----
check(api.matchScore("Venkatesh 2003 User acceptance of information technology: Toward a unified view", rec("10.2307/30036540")) === 1, "match score: right paper");
check(api.matchScore("Các nhân tố ảnh hưởng đến ý định mua sắm trực tuyến", rec("10.2307/30036540")) < 0.3, "match score: unrelated paper");
check(api.matchScore("Nguyễn Đình Thọ (2014). Phương pháp nghiên cứu khoa học trong kinh doanh. NXB Tài chính", { title: "Giáo trình phương pháp nghiên cứu trong kinh doanh", year: 2021, authors: [{ family: "Dao", given: "Huan" }] }) < 0.7, "match score: similar title but other year and authors rejected (a Vietnamese textbook vs an OSF preprint)");
check(api.parseLine("https://vnexpress.net/gia-vang-4700000.html").kind === "url" && api.parseLine("https://doi.org/10.2307/249008").kind === "doi", "a plain link is a web page, a doi.org link a DOI");

// ---- exports ----
const exp = api.prepare([rec("10.2307/249008"), rec("10.1007/978-3-030-80519-7_1"), M(law), M({ kind: "thesis", authors: api.parseNames("Phạm Thị Lan"), year: 2021, title: "Luận văn & 100% dữ liệu", thesisType: "master", institution: "NEU" })]);
const ris = api.toRIS(exp);
check(/TY  - JOUR\r\nAU  - Davis, Fred D\.\r\nPY  - 1989\r\nTI  - Perceived Usefulness/.test(ris) && /SP  - 319\r\nEP  - 340/.test(ris) && /DO  - 10\.2307\/249008/.test(ris) && (ris.match(/ER  - /g) || []).length === 4, "RIS: type, author, year, pages, DOI, four records");
check(/TY  - GOVDOC[\s\S]*AU  - Quốc hội[\s\S]*TI  - Luật Doanh nghiệp số 59\/2020\/QH14/.test(ris) && /TY  - THES[\s\S]*M3  - Master's thesis/.test(ris) && /TY  - CHAP/.test(ris), "RIS: law, thesis, chapter");
const bib = api.toBibTeX(exp);
check(/@article\{davis1989,\n  author = \{Davis, Fred D\.\}/.test(bib) && /pages = \{319--340\}/.test(bib) && /@incollection\{hair2021,/.test(bib) && /author = \{\{Quốc hội\}\}/.test(bib) && /@mastersthesis\{/.test(bib) && /title = \{\{Luận văn \\& 100\\% dữ liệu\}\}/.test(bib) && /school = \{NEU\}/.test(bib), "BibTeX: keys, authors, pages, organisation braces, escaping, thesis");
const dx = api.toDocx(exp.map(r => ref(r).seg), "Tài liệu tham khảo");
const dxs = new TextDecoder().decode(dx);
check(dx[0] === 0x50 && dx[1] === 0x4b && dxs.includes("word/document.xml") && dxs.includes("<w:i/>") && dxs.includes('w:hanging="720"') && dxs.includes("Tài liệu tham khảo") && dxs.includes("Luật Doanh nghiệp số 59/2020/QH14"), ".docx: zip with document, italics, hanging indent");
check(Object.keys(fx).length >= 40, `fixtures: ${Object.keys(fx).length} real DOIs`);

// ---- list: alphabetical, a/b suffixes ----
const list = api.prepare(["10.2307/30036540", "10.1111/isj.12131", "10.2307/249008", "10.1108/EBR-11-2018-0203", "10.1007/978-3-030-80519-7", "10.1007/978-3-030-80519-7_1"].map(rec));
check(list.map(r => r.authors[0].family + r.year + r.suffix).join(" ") === "Davis1989 Hair2021a Hair2021b Hair2019 Kock2018 Venkatesh2003", `A–Z letter by letter over all authors (Hair, Hult before Hair, Risher), then year, a/b by title (${list.map(r => r.authors[0].family + r.year + r.suffix).join(" ")})`);
check(api.citeIn(list[1], "en").paren === "(Hair et al., 2021a)", "suffix reaches the in-text citation");
const solo = api.prepare([vn, api.normalize({ ...fx["10.2307/249008"], author: [{ given: "An", family: "Nguyen" }] })]);
check(solo[0].authors.length === 1, "one author sorts before the same surname with co-authors");
check(api.prepare(["10.2307/30036540", "10.2307/249008"].map(rec), { sort: "in" })[0].authors[0].family === "Venkatesh", "input order kept when asked");

// ---- input lines ----
const P = s => api.parseLine(s);
check(P("https://doi.org/10.1016/S0895-4356(96)00236-3").doi === "10.1016/S0895-4356(96)00236-3", "DOI with parentheses kept whole");
check(P("Davis, F. D. (1989). ... MIS Quarterly, 13(3), 319–340. https://doi.org/10.2307/249008.").doi === "10.2307/249008", "DOI pulled out of a pasted reference, trailing period dropped");
check(P("(see doi:10.1111/isj.12131)").doi === "10.1111/isj.12131", "unbalanced closing parenthesis dropped");
check(P("https://doi.org/10.1111%2Fisj.12131").doi === "10.1111/isj.12131", "URL-encoded DOI");
check(P("When to use and how to report the results of PLS-SEM").kind === "query", "a title becomes a search");
check(P("abc").kind === "bad" && P("   ") === null, "too short line rejected, blank ignored");

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
