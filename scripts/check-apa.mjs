// Unit check for the APA 7 citation tool (src/tools/trich-dan-apa.html): the formatter, run on real
// Crossref /works metadata saved in scripts/fixtures/apa-crossref.json (and DataCite CSL for arXiv),
// must give the APA 7 reference, italics and in-text citations below, written out by hand.
import { readFileSync } from "node:fs";

const src = readFileSync("src/tools/trich-dan-apa.html", "utf8");
const m = src.match(/\/\/#apa-start([\s\S]*?)\/\/#apa-end/);
if (!m) throw new Error("missing //#apa block");
const api = new Function(`${m[1]} return { normalize, formatRef, citeIn, prepare, segText, segHtml, sentenceCase, cleanTitle, initials, authorList, parseLine, yearOf };`)();
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
check(/Crossref chỉ có trang đầu/.test(ref(rec("10.2307/1913827")).warn.join(" ")), "a start page alone is flagged (Hausman 1978)");
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
check(api.segText(ref(noYear).seg) === "World Bank. (n.d.). Annual report. World Bank." && api.citeIn(noYear, "en").paren === "(World Bank, n.d.)", "group author, no date: n.d.");

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
