// Unit tests for the survey-cleaning tool (src/tools/lam-sach-du-lieu.html): run `node scripts/check-clean.mjs`.
// Loads the code between //#clean-start and //#clean-end and checks header codes for Google Forms, Microsoft Forms and
// Genius Data exports, Likert conversion, reverse coding, demographic recoding, every cleaning rule and the funnel,
// the exported CSV, SPSS syntax and codebook, the chapter-3 paragraph and its references.
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/tools/lam-sach-du-lieu.html", import.meta.url), "utf8");
const block = src.split("//#clean-start")[1]?.split("//#clean-end")[0];
if (!block) { console.log("FAIL: markers //#clean-start, //#clean-end not found"); process.exit(1); }
const T = new Function(`${block}; return { normText, parseCSV, toNum, extractCode, questionText, detectSource, guessColumns, likertValue, detectScale, scaleSpec, parseCustom,
  parseCodebook, parseValueLabels, matchCodebook, recodeDemo, parseTime, guessDayFirst, parseDuration, longstring, parseRuleSpec, spssName, clean, toCleanCSV, toAllCSV,
  spssSyntax, codebookCSV, chapter3, REFS, RULES, sampleExport, MAP5, MAP7 };`)();

let fails = 0, n = 0;
const ok = (cond, msg) => { n++; if (!cond) { fails++; console.log(`FAIL ${msg}`); } };
const eq = (got, want, msg) => ok(JSON.stringify(got) === JSON.stringify(want), `${msg}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

// ---- CSV and numbers ----
eq(T.parseCSV('﻿a,b\r\n"x, y","say ""hi"""\r\n\r\n'), [["a", "b"], ["x, y", 'say "hi"']], "parseCSV quotes, BOM, blank line");
eq(T.parseCSV("a;b\n1;2"), [["a", "b"], ["1", "2"]], "parseCSV semicolon");
for (const [s, v] of [["4", 4], ["3,5", 3.5], ["4 - Đồng ý", 4], ["Đồng ý (4)", 4], [5, 5]]) eq(T.toNum(s), v, `toNum(${s})`);
for (const s of ["", "Đồng ý", "30/10/2026"]) ok(Number.isNaN(T.toNum(s)), `toNum(${s}) is NaN`);

// ---- header codes ----
for (const [h, c] of [
  ["PU1", "PU1"], ["TT1. Giới tính", "TT1"], ["Mức độ đồng ý của Anh/Chị với các phát biểu sau [PU1. Ứng dụng hữu ích]", "PU1"],
  ["5. Mức độ đồng ý [PEOU_2. Dễ dùng]", "PEOU_2"], ["SANGLOC. Bạn đã từng…?", "SANGLOC"], ["Mức độ đồng ý [ACHK. Hãy chọn Không đồng ý]", "ACHK"],
  ["Tôi tin ứng dụng (TC3)", "TC3"], ["ĐT1. Đãi ngộ tốt", "ĐT1"], ["3. TT2. Năm học", "TT2"],
  ["Giới tính của bạn", null], ["Mức độ đồng ý [Ứng dụng hữu ích]", null], ["Dấu thời gian", null]])
  eq(c === null && h === "Dấu thời gian" ? null : T.extractCode(h), c, `extractCode("${h}")`);
eq(T.questionText("Mức độ đồng ý [PU1. Ứng dụng hữu ích]", "PU1"), "Ứng dụng hữu ích", "questionText grid");
eq(T.questionText("TT1. Giới tính", "TT1"), "Giới tính", "questionText prefix");
eq(T.detectSource(["Dấu thời gian", "PU1"]), "google", "Google Forms (vi)");
eq(T.detectSource(["Timestamp", "PU1"]), "google", "Google Forms (en)");
eq(T.detectSource(["ID", "Start time", "Completion time", "Email", "Name", "PU1"]), "ms", "Microsoft Forms");
eq(T.detectSource(["No.", "Wave", "Respondent code", "Submitted at (ISO)", "Duration (seconds)", "1. PU1"]), "gd", "Genius Data");
eq(T.detectSource(["PU1", "PU2"]), "other", "plain sheet");

// ---- Likert labels ----
for (const [s, v] of [["Hoàn toàn không đồng ý", 1], ["Không đồng ý", 2], ["Trung lập", 3], ["Bình thường", 3], ["Đồng ý", 4], ["Hoàn toàn đồng ý", 5], ["Rất hài lòng", 5],
  ["Strongly disagree", 1], ["Neither agree nor disagree", 3], ["Agree", 4], ["2 - Không đồng ý", 2]]) eq(T.likertValue(s, T.MAP5), v, `5-point "${s}"`);
for (const [s, v] of [["Hơi không đồng ý", 3], ["Trung lập", 4], ["Hơi đồng ý", 5], ["Đồng ý", 6], ["Strongly agree", 7], ["Somewhat agree", 5]]) eq(T.likertValue(s, T.MAP7), v, `7-point "${s}"`);
ok(Number.isNaN(T.likertValue("Có lẽ", T.MAP5)), "unknown label is NaN");
eq(T.detectScale(["Đồng ý", "Hơi đồng ý", "Trung lập"]).points, 7, "detect 7 from 'Hơi đồng ý'");
eq(T.detectScale(["Agree", "Strongly agree"]).lang, "en", "detect English labels");
eq(T.detectScale([1, 3, 6, 7]).points, 7, "detect 7 from numbers");
eq(T.detectScale(["Rất quan trọng", "Quan trọng", "Không quan trọng"]).custom, true, "unknown labels ask for a custom scale");
const cust = T.scaleSpec("custom", "Rất không quan trọng = 1\nKhông quan trọng = 2\nBình thường = 3\nQuan trọng = 4\nRất quan trọng = 5", 1, 5);
eq(T.likertValue("Quan trọng", cust.map), 4, "custom label");
eq(cust.labels[4], [5, "Rất quan trọng"], "custom value labels");
const s04 = T.scaleSpec("vi5", "", 0, 4);
eq(T.likertValue("Hoàn toàn đồng ý", s04.map), 4, "labels follow a 0–4 range");

// ---- codebook from the questionnaire kit ----
const kitCb = [
  "Mã,Khái niệm,Biến quan sát (tiếng Việt),Câu gốc (tiếng Anh),Nguồn,Thang trả lời,Đảo điểm,Kế thừa/Điều chỉnh,Nhãn giá trị",
  'SANGLOC,Câu sàng lọc,Bạn đã từng dùng ứng dụng?,,,,,,"1 = Đã từng; 2 = Chưa từng (dừng khảo sát)"',
  "PU1,Nhận thức hữu ích (PU),Ứng dụng giúp tôi giao dịch nhanh hơn,,Davis (1989),,Không,Kế thừa nguyên văn,",
  "PEOU4,Dễ sử dụng (PEOU),Tôi thấy ứng dụng khó sử dụng,,Davis (1989),,Có: 6 − điểm,Điều chỉnh,",
  "AC1,Kiểm tra sự chú ý,Hãy chọn Không đồng ý,,,,,,Đáp án đúng: 2 = Không đồng ý; chọn mức khác thì loại phiếu",
  'TT1,Thông tin chung,Giới tính,,,,,,"1 = Nam; 2 = Nữ; 3 = Khác (ghi rõ)"',
  "TT9,Thông tin chung,Tên trường,,,,,Câu tự đặt,Tự điền"].join("\n");
const CB = T.parseCodebook(kitCb);
eq(CB.size, 6, "codebook rows");
eq(CB.get("SANGLOC").kind, "screen", "screening row");
eq(CB.get("SANGLOC").screenFail, ["Chưa từng"], "screening fail answer");
eq(CB.get("AC1").attnAnswer, 2, "attention answer");
eq(CB.get("PEOU4").reverse, true, "reverse flag");
eq(CB.get("PU1").reverse, false, "not reversed");
eq(CB.get("TT1").values, [[1, "Nam"], [2, "Nữ"], [3, "Khác (ghi rõ)"]], "value labels");
eq(CB.get("TT9").kind, "text", "free-text row");
eq(T.matchCodebook("Mức độ đồng ý [Ứng dụng giúp tôi giao dịch nhanh hơn]", CB)?.code, "PU1", "header matched by question text");
eq(T.parseCodebook("PU1,Dễ dùng\nPU2,Hữu ích").get("PU2").label, "Hữu ích", "two-column codebook without header");

// ---- demographic recoding ----
const inc = T.recodeDemo(["Từ 5 triệu trở lên", "Dưới 3 triệu", "Từ 3 đến dưới 5 triệu", "", "Dưới 3 triệu"]);
eq(inc.labels, [[1, "Dưới 3 triệu"], [2, "Từ 3 đến dưới 5 triệu"], [3, "Từ 5 triệu trở lên"]], "income bands in numeric order");
const sex = T.recodeDemo(["Nữ", "Khác", "Nam"]);
eq(sex.labels.map(x => x[1]), ["Nam", "Nữ", "Khác"], "alphabetical, Khác last");
ok(Number.isNaN(sex.code("")), "blank demographic is missing");
const sexCb = T.recodeDemo(["Nữ", "Nam", "Phi nhị giới"], CB.get("TT1"));
eq([sexCb.code("Nữ"), sexCb.code("Nam"), sexCb.code("Phi nhị giới"), sexCb.code("2")], [2, 1, 3, 2], "codebook codes; free-text other goes to Khác");
eq(T.recodeDemo(["20", "21", "22"]).numeric, true, "numeric answers stay numbers");

// ---- time ----
eq(T.parseTime("30/10/2026 9:00:30", true) - T.parseTime("30/10/2026 9:00:00", true), 30, "d/m time");
eq(T.parseTime("10/30/2026 1:05:00 PM", false) - T.parseTime("10/30/2026 12:55:00 PM", false), 600, "m/d time with PM");
eq(T.parseTime(46000.5) - T.parseTime(46000), 43200, "Excel serial");
eq(T.parseTime("2026-10-30T09:00:00Z") - T.parseTime("2026-10-30 08:59:00"), 60, "ISO");
eq(T.guessDayFirst(["5/10/2026 8:00", "25/10/2026 8:00"], false), true, "day-first proven by 25");
eq(T.guessDayFirst(["10/25/2026 8:00"], true), false, "month-first proven by 25");
eq([T.parseDuration("125"), T.parseDuration("00:02:05"), T.parseDuration("2:05"), T.parseDuration(125)], [125, 125, 125, 125], "durations");

// ---- small helpers ----
eq(T.longstring([4, 4, 4, 2, 2, NaN, 2, 2]), 3, "longstring, blank breaks the run");
eq(T.parseRuleSpec("AC1=2 ACHK=Không đồng ý"), [{ code: "AC1", values: ["2"] }, { code: "ACHK", values: ["Không đồng ý"] }], "rule spec, two checks");
eq(T.parseRuleSpec("SANGLOC=Chưa từng|Không phải"), [{ code: "SANGLOC", values: ["Chưa từng", "Không phải"] }], "rule spec, alternatives");
const used = new Set();
eq(["ĐT1", "PU1", "pu1", "1abc", "TO", "Câu 3"].map(c => T.spssName(c, used)), ["DT1", "PU1", "pu1_2", "abc", "TO_V", "Cau_3"], "SPSS names");

// ---- full pipeline on a Microsoft Forms-like file with every rule firing once ----
const L = ["Hoàn toàn không đồng ý", "Không đồng ý", "Trung lập", "Đồng ý", "Hoàn toàn đồng ý"];
const head = ["ID", "Start time", "Completion time", "Email", "SANGLOC. Bạn đã từng dùng?", "PU1. A", "PU2. B", "PU3. C", "PEOU1. D", "PEOU2. E", "PEOU3. F (đảo)", "AC1. Chọn Không đồng ý", "TT1. Giới tính", "TT2. Thu nhập"];
const mk = (id, sec, scr, items, ac, sex, inc) => [id, "10/30/2026 9:00:00 AM", `10/30/2026 9:${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")} AM`, `x${id}@mail.com`, scr, ...items.map(v => (v === "" ? "" : L[v - 1])), ac, sex, inc];
const R = [
  mk(1, 300, "Đã từng", [4, 4, 5, 3, 4, 2], "2 - Không đồng ý", "Nam", "Dưới 3 triệu"),
  mk(2, 300, "Chưa từng", ["", "", "", "", "", ""], "", "", ""), // screening
  mk(3, 300, "Đã từng", [4, 5, 4, 4, 3, 2], "4 - Đồng ý", "Nữ", "Dưới 3 triệu"), // attention
  mk(4, 20, "Đã từng", [3, 4, 4, 4, 5, 1], "2 - Không đồng ý", "Nữ", "Từ 3 triệu trở lên"), // speed
  mk(5, 300, "Đã từng", [4, 4, 4, 4, 4, 4], "2 - Không đồng ý", "Nam", "Dưới 3 triệu"), // straight-lining
  mk(6, 310, "Đã từng", [4, 4, 5, 3, 4, 2], "2 - Không đồng ý", "Nam", "Dưới 3 triệu"), // duplicate of 1
  mk(7, 300, "Đã từng", [5, "", 4, 4, 4, 2], "2 - Không đồng ý", "Nữ", "Từ 3 triệu trở lên"), // missing
  mk(8, 300, "Đã từng", [2, 3, 2, 3, 2, 5], "2 - Không đồng ý", "Nữ", "Từ 3 triệu trở lên"),
];
const cols = T.guessColumns(head, R, new Map());
const role = c => cols.find(x => x.code === c)?.role;
eq(["SANGLOC", "PU1", "PEOU3", "AC1", "TT1", "TT2"].map(role), ["screen", "item", "item", "attn", "demo", "demo"], "column roles");
eq([cols[0].role, cols[1].role, cols[2].role, cols[3].role], ["meta", "start", "end", "meta"], "Microsoft Forms metadata roles");
const scale = T.scaleSpec("vi5", "", 1, 5);
const rules = { screen: { on: true, spec: "SANGLOC=Chưa từng" }, attn: { on: true, spec: "AC1=2" }, speed: { on: true, sec: 60 }, straight: { on: true, len: 6 }, dup: { on: true }, missing: { on: true, pct: 0 } };
const res = T.clean({ cols, rows: R, scale, reverse: ["PEOU3"], rules, target: 10, missingCode: 99, source: "ms", dayFirst: false });
eq(res.stages.map(s => [s.key, s.removed, s.left]), [["screen", 1, 7], ["attn", 1, 6], ["speed", 1, 5], ["straight", 1, 4], ["dup", 1, 3], ["missing", 1, 2]], "funnel");
eq(res.valid.map(r => r.id), [1, 8], "valid responses");
eq([res.n0, res.n, res.short], [8, 2, 8], "counts and shortfall");
eq(res.warnings, [], "no warnings");
const csv = T.toCleanCSV(res).trim().split("\r\n");
eq(csv[0], "ID,SANGLOC,PU1,PU2,PU3,PEOU1,PEOU2,PEOU3,AC1,TT1,TT2,THOIGIAN", "clean CSV header (email, start/end dropped; duration added)");
eq(csv[1], "1,1,4,4,5,3,4,4,2,1,1,300", "row 1: Likert→numbers, PEOU3 reversed 2→4, demographics coded");
eq(csv[2], "8,1,2,3,2,3,2,1,2,2,2,300", "row 8: PEOU3 reversed 5→1");
ok(!/mail\.com/.test(T.toCleanCSV(res) + T.toAllCSV(res)), "emails never exported");
const all = T.toAllCSV(res).replace(/^﻿/, "").trim().split("\r\n");
eq(all.length, 9, "all-responses CSV has every row");
ok(all[2].endsWith(',0,Không qua câu sàng lọc,0,6'), `all CSV reason column: ${all[2]}`);
// independent flags: row 6 duplicates row 1 whatever the order
eq(res.stages.find(s => s.key === "dup").flagged, 1, "duplicate flagged");
// missing threshold above 0: one blank in six items is 16.7%, kept at 20%
const res20 = T.clean({ cols, rows: R, scale, reverse: [], rules: { ...rules, missing: { on: true, pct: 20 } }, missingCode: 99, source: "ms", dayFirst: false });
eq(res20.valid.map(r => r.id), [1, 7, 8], "missing 20% keeps one blank");
ok(T.toCleanCSV(res20).includes("7,1,5,99,"), "blank written as the missing code");
// rules off → nothing removed except nothing
const none = T.clean({ cols, rows: R, scale, reverse: [], rules: { screen: { on: false }, attn: { on: false }, speed: { on: false }, straight: { on: false }, dup: { on: false }, missing: { on: false } }, missingCode: 99 });
eq(none.n, 8, "no rules, no removals");
ok(none.stages.every(s => !s.on), "all stages off");
// a reverse code that is not an item is reported
const badRev = T.clean({ cols, rows: R, scale, reverse: ["XYZ9"], rules, missingCode: 99, dayFirst: false });
ok(badRev.warnings.some(w => /XYZ9/.test(w)), "unknown reverse item warned");
// longstring threshold above the item count is capped
const capped = T.clean({ cols, rows: R, scale, reverse: [], rules: { ...rules, straight: { on: true, len: 50 } }, missingCode: 99, dayFirst: false });
eq(capped.applied.straight, 6, "longstring threshold capped at item count");
// out-of-range numbers are missing and warned
const oorRows = R.map((r, i) => (i === 0 ? r.map((v, j) => (j === 5 ? "8" : v)) : r));
const oor = T.clean({ cols, rows: oorRows, scale, reverse: [], rules: { ...rules, missing: { on: false } }, missingCode: 99, dayFirst: false });
ok(oor.warnings.some(w => /ngoài|khoảng 1–5/.test(w)), "out-of-range warned");

// ---- SPSS syntax ----
const sps = T.spssSyntax(res, "du-lieu-sach.csv");
for (const s of ["GET DATA", "/FILE='du-lieu-sach.csv'", "/ENCODING='UTF8'", "/FIRSTCASE=2", "  ID F8.0", "  THOIGIAN F8.0.", "VARIABLE LABELS", "/PEOU3 'F (đảo) (đã đảo điểm)'",
  "VALUE LABELS", "    1 'Hoàn toàn không đồng ý'", "    99 'Không trả lời'", "MISSING VALUES", "  (99).", "VARIABLE LEVEL", "(NOMINAL)", "(SCALE)", "EXECUTE.", "* COMPUTE PU_TB = MEAN(PU1, PU2, PU3)."])
  ok(sps.includes(s), `syntax contains ${s}`);
ok(/  \/TT1\r\n    1 'Nam'\r\n    2 'Nữ'/.test(sps) || /TT1[\s\S]*1 'Nam'/.test(sps), "gender value labels");
ok(/PEOU3[\s\S]*?1 'Hoàn toàn đồng ý \(đã đảo điểm\)'/.test(sps), "reversed item labels flipped");
// every command ends with a period, every quote is balanced
for (const cmd of ["GET DATA", "VARIABLE LABELS", "VALUE LABELS", "MISSING VALUES", "VARIABLE LEVEL"]) {
  const after = sps.slice(sps.indexOf(cmd)); const end = after.search(/\.\r\n/);
  ok(end > 0, `${cmd} is terminated`);
}
ok(sps.split("\r\n").every(l => (l.replace(/''/g, "").match(/'/g) || []).length % 2 === 0), "balanced quotes on every line");
ok(T.spssSyntax({ ...res, out: res.out.map(c => (c.name === "PU1" ? { ...c, label: "Tôi 'thích' nó" } : c)) }, "a.csv").includes("'Tôi ''thích'' nó'"), "quotes doubled");

// ---- codebook CSV ----
const book = T.codebookCSV(res);
ok(book.startsWith("﻿"), "codebook has BOM for Excel");
ok(book.includes('"PEOU3","PEOU3","F (đảo) (đã đảo điểm)","Câu thang đo","PEOU","Có: điểm mới = 6 − điểm cũ"'), "codebook reverse row");
ok(book.includes('"1 = Dưới 3 triệu; 2 = Từ 3 triệu trở lên"'), "codebook value labels");

// ---- chapter 3 ----
const ch = T.chapter3(res), text = ch.paras.join(" ");
for (const s of ["Microsoft Forms", "thu về 8 phiếu", "(Meade &amp; Craig, 2012; Curran, 2016)", "(1) loại 1 phiếu không thoả điều kiện ở câu sàng lọc SANGLOC",
  "dưới 60 giây", "(Huang và cộng sự, 2012)", "toàn bộ 6 câu thang đo (Johnson, 2005)", "trùng lặp hoàn toàn", "bỏ trống ít nhất một câu",
  "còn 2 phiếu hợp lệ, chiếm 25,0%", "còn thiếu 8 phiếu so với cỡ mẫu tối thiểu 10 phiếu", "(đáp án đúng: 2; Oppenheimer và cộng sự, 2009)", "8 phiếu", "PEOU3", "điểm mới = 6 − điểm cũ", "từ ngày 30/10/2026 đến ngày 30/10/2026"])
  ok(text.includes(s), `chapter 3 mentions "${s}"`);
eq(ch.refs.length, 5, "five references");
ok(ch.refs.every((r, i, a) => i === 0 || a[i - 1].localeCompare(r, "en") <= 0), "references A–Z");
ok(!/impute|nội suy|ước lượng giá trị/i.test(text), "no imputation in the procedure");
const chNone = T.chapter3(none);
ok(chNone.refs.length === 2 && /không áp dụng quy tắc/.test(chNone.paras[0]), "no rules → plain statement, two references");

// ---- references as registered at Crossref (checked on api.crossref.org, 30/10/2026) ----
const crossref = {
  meade: ["10.1037/a0028085", "(2012)", "17</em>(3), 437–455"],
  curran: ["10.1016/j.jesp.2015.07.006", "(2016)", "66</em>, 4–19"],
  huang: ["10.1007/s10869-011-9231-8", "(2012)", "27</em>(1), 99–114"],
  johnson: ["10.1016/j.jrp.2004.09.009", "(2005)", "39</em>(1), 103–129"],
  oppenheimer: ["10.1016/j.jesp.2009.03.009", "(2009)", "45</em>(4), 867–872"],
};
for (const [k, parts] of Object.entries(crossref)) for (const p of parts) ok(T.REFS[k].includes(p), `reference ${k} has ${p}`);

// ---- sample file end to end ----
const S = T.sampleExport();
eq(S.length, 241, "sample has 240 responses");
const sc = T.guessColumns(S[0], S.slice(1), new Map());
eq(T.detectSource(S[0]), "google", "sample is a Google Forms export");
eq(sc.filter(c => c.role === "item").length, 11, "sample items");
const sres = T.clean({ cols: sc, rows: S.slice(1), scale: T.scaleSpec("vi5", "", 1, 5), reverse: ["PEOU4"], rules: { ...rules, attn: { on: true, spec: "AC1=2" }, screen: { on: true, spec: "SANGLOC=Chưa từng" }, straight: { on: true, len: 11 } }, target: 220, missingCode: 99, source: "google" });
ok(sres.stages.filter(s => s.on).every(s => s.removed > 0 || s.key === "speed"), `every rule removes something on the sample: ${JSON.stringify(sres.stages.map(s => [s.key, s.removed]))}`);
ok(!sres.stages.find(s => s.key === "speed").on, "speed rule off for Google Forms (no duration)");
ok(sres.warnings.some(w => /Google Forms chỉ ghi thời điểm nộp/.test(w)), "speed rule explained");
ok(sres.n > 150 && sres.n < 240, `sample valid N ${sres.n}`);
ok(sres.dateRange && T.chapter3(sres).paras[0].includes("từ ngày 05/10/2026"), "sample date range read day-first");

console.log(fails ? `${fails} of ${n} checks failed` : `check-clean: all ${n} checks passed`);
process.exit(fails ? 1 : 0);
