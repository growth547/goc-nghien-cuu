// Unit tests for the financial-ratio calculator (src/tools/tinh-chi-so-tai-chinh.html): run `node scripts/check-ratios.mjs`.
// Loads the code between //#fr-start and //#fr-end and checks number parsing, header matching, transposed input,
// every formula against values worked out by hand, lag/average rules, the panel CSV and the cited references.
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/tools/tinh-chi-so-tai-chinh.html", import.meta.url), "utf8");
const block = src.split("//#fr-start")[1]?.split("//#fr-end")[0];
if (!block) { console.log("FAIL: markers //#fr-start, //#fr-end not found"); process.exit(1); }
const T = new Function(`${block}; return { FIELDS, REFS, VARS, UNITS, num, headerKey, detectDecimal, yearOf, parse, compute, pctile, winsorize, describe, checkData, csvColumns, toCSV, codeSnippets, measurementText };`)();

let fails = 0, n = 0;
const ok = (cond, msg) => { n++; if (!cond) { fails++; console.log(`FAIL ${msg}`); } };
const near = (got, want, msg, tol = 1e-9) => ok(Number.isFinite(got) && Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)), `${msg}: got ${got}, want ${want}`);
const isNaNv = (got, msg) => ok(Number.isNaN(got), `${msg}: got ${got}, want empty`);

// ---- number parsing ----
for (const [s, v] of [["1.234.567", 1234567], ["1,234,567", 1234567], ["1 234 567", 1234567], ["(1.250)", -1250], ["-1.234,5", -1234.5], ["1,234.5", 1234.5], ["6,4", 6.4], ["12.5", 12.5], ["1,234", 1234], ["0", 0], ["11,5%", 11.5], ["-", 0], ["–", 0], ["0.125", 0.125], ["0,125", 0.125], ["−5", -5], ["1.234,567", 1234.567]])
  near(T.num(s), v, `num("${s}")`);
for (const s of ["", "abc", "1/1/2020", "n/a"]) isNaNv(T.num(s), `num("${s}")`);

// ---- headers ----
for (const [h, k] of [["ta", "ta"], ["270", "ta"], ["CĐKT 270", "ta"], ["Tổng cộng tài sản", "ta"], ["tong cong tai san", "ta"], ["KQKD 60", "ni"], ["Mã CK", "firm"], ["Năm", "year"], ["51+52", "tax"], ["mcap", "mcap"]])
  ok(T.headerKey(h, "firm") === k, `headerKey("${h}") = ${T.headerKey(h, "firm")}, want ${k}`);
ok(T.headerKey("Thu nhập lãi thuần", "bank") === "nii", "bank header by label");
ok(T.headerKey("không có", "firm") === null, "unknown header is null");

// ---- fixture: two firms, AAA has a gap (2019 then 2021), BBB has negative equity in 2023 ----
const firmText = [
  "firm\tyear\tta\tca\tcash\tsti\tar\tinv\tppe\ttl\tcl\tap\tstd\tltd\teq\tre\trev\tcogs\tint\tebt\ttax\tni\tcfo\tda\tcapex\tdiv\tmcap",
  "AAA\t2019\t800\t500\t50\t10\t120\t180\t250\t400\t300\t80\t100\t90\t400\t90\t1000\t760\t12\t60\t12\t48\t30\t20\t(50)\t(15)\t600",
  "AAA\t2021\t1.000\t600\t80\t20\t150\t200\t300\t550\t350\t90\t150\t120\t450\t110\t1.200\t900\t15\t70\t14\t56\t40\t25\t(60)\t(20)\t750",
  "AAA\t2022\t1.100\t640\t90\t30\t160\t210\t320\t600\t380\t95\t170\t130\t500\t140\t1.320\t980\t18\t85\t17\t68\t75\t28\t(70)\t(25)\t840",
  "BBB\t2022\t500\t200\t40\t0\t60\t70\t220\t200\t120\t40\t50\t60\t300\t50\t450\t330\t0\t30\t6\t24\t35\t15\t(30)\t(10)\t300",
  "BBB\t2023\t540\t230\t45\t5\t65\t75\t230\t560\t130\t42\t55\t65\t(20)\t60\t480\t350\t9\t(32)\t0\t(32)\t30\t16\t(35)\t0\t320",
].join("\n");
const P = T.parse(firmText, "firm");
ok(P.errors.length === 0 && P.unknown.length === 0, `parse errors: ${P.errors.concat(P.unknown).join("; ")}`);
ok(P.data.length === 5, `parsed ${P.data.length} rows, want 5`);
const R = T.compute(P.data, "firm", false);
const get = (firm, year, id, res = R) => res.rows.find(r => r.firm === firm && r.year === year).values[id];

// AAA 2022, end-of-period balances; each expected value written out from the formula.
const a = { ta: 1100, ca: 640, cash: 90, ar: 160, inv: 210, ppe: 320, tl: 600, cl: 380, ap: 95, std: 170, ltd: 130, eq: 500, re: 140, rev: 1320, cogs: 980, int: 18, ebt: 85, tax: 17, ni: 68, cfo: 75, capex: 70, div: 25, mcap: 840 };
const expectAAA2022 = {
  roa: 68 / 1100, roe: 68 / 500, ros: 68 / 1320, gpm: 340 / 1320, at: 1320 / 1100, lev: 600 / 1100, debt: 300 / 1100, de: 600 / 500,
  ltdr: 130 / 1100, stdr: 170 / 300, icr: 103 / 18, cr: 640 / 380, qr: 430 / 380, cash: 90 / 1100,
  ccc: 365 * (210 / 980 + 160 / 1320 - 95 / 980),
  z: 1.2 * (260 / 1100) + 1.4 * (140 / 1100) + 3.3 * (103 / 1100) + 0.6 * (840 / 600) + 1.0 * (1320 / 1100),
  z2: 6.56 * (260 / 1100) + 3.26 * (140 / 1100) + 6.72 * (103 / 1100) + 1.05 * (500 / 600),
  q: (840 + 600) / 1100, mtb: 840 / 500, size: Math.log(1100), growth: 1320 / 1200 - 1, tang: 320 / 1100,
  capex: 70 / 1000, etr: 17 / 85, payout: 25 / 68, tacc: (68 - 75) / 1000,
};
for (const [id, want] of Object.entries(expectAAA2022)) near(get("AAA", 2022, id), want, `AAA 2022 ${id}`);
ok(Object.keys(expectAAA2022).length === T.VARS.filter(v => v.scope !== "bank").length, "every firm variable has a hand-checked value");
void a;

// Lags never bridge a gap: AAA 2021 follows 2019, so growth, capex and tacc are empty.
for (const id of ["growth", "capex", "tacc"]) isNaNv(get("AAA", 2021, id), `AAA 2021 ${id} (gap year)`);
// Rows without a meaning are empty: BBB 2023 has negative equity and a loss; BBB 2022 has no interest expense.
for (const id of ["roe", "de", "mtb", "etr", "payout"]) isNaNv(get("BBB", 2023, id), `BBB 2023 ${id}`);
isNaNv(get("BBB", 2022, "icr"), "BBB 2022 icr with zero interest");
near(get("BBB", 2023, "roa"), -32 / 540, "BBB 2023 roa (loss kept)");

// Average balances: AAA 2022 roa = 68 / ((1000 + 1100) / 2); AAA 2021 has no consecutive previous year.
const RA = T.compute(T.parse(firmText, "firm").data, "firm", true);
near(get("AAA", 2022, "roa", RA), 68 / 1050, "AAA 2022 roa with average assets");
near(get("AAA", 2022, "ccc", RA), 365 * (205 / 980 + 155 / 1320 - 92.5 / 980), "AAA 2022 ccc with average balances");
isNaNv(get("AAA", 2021, "roa", RA), "AAA 2021 roa with average assets (gap year)");
near(get("AAA", 2022, "lev", RA), 600 / 1100, "lev stays end-of-period under averaging");

// Market value from price × shares when mcap is absent.
const ps = T.parse("firm\tyear\tta\ttl\teq\tprice\tshares\nX\t2022\t1000000\t400000\t600000\t20\t45000", "firm");
const rps = T.compute(ps.data, "firm", false);
near(rps.rows[0].values.q, (20 * 45000 + 400000) / 1000000, "q from price × shares");

// ---- transposed single-firm statement (items as rows, years as columns) ----
const tr = T.parse(["Chỉ tiêu\t2022\t2023", "Mã CK\tCCC\tCCC", "Tổng cộng tài sản\t1.000\t1.200", "KQKD 60\t50\t90", "Vốn chủ sở hữu\t400\t450"].join("\n"), "firm");
ok(tr.transposed === true, "transposed input detected");
ok(tr.data.length === 2 && tr.data[1].firm === "CCC" && tr.data[1].year === 2023, "transposed rows have firm and year");
near(T.compute(tr.data, "firm", false).rows[1].values.roe, 90 / 450, "roe from transposed input");

// ---- bank template ----
const bankText = [
  "firm\tyear\tta\tloans\tllr\tdeposits\teq\tea\tii\tnii\ttoi\topex\tprov\tebt\tni\tnpl\tcar",
  "NHA\t2021\t1000000\t650000\t9000\t780000\t80000\t930000\t60000\t28000\t36000\t13000\t8000\t15000\t12000\t9750\t11,2",
  "NHA\t2022\t1120000\t730000\t10000\t850000\t92000\t1040000\t72000\t31000\t40000\t14500\t9000\t16500\t13200\t12400\t11,5",
  "NHA\t2023\t1250000\t820000\t11500\t930000\t105000\t\t80000\t33000\t43000\t15500\t10500\t17000\t13600\t15580\t11,9",
].join("\n");
const PB = T.parse(bankText, "bank");
const RB = T.compute(PB.data, "bank", false);
const roas = [12000 / 1000000, 13200 / 1120000, 13600 / 1250000];
const m = roas.reduce((s, x) => s + x, 0) / 3, sd = Math.sqrt(roas.reduce((s, x) => s + (x - m) ** 2, 0) / 2);
const expectNHA2023 = {
  roa: 13600 / 1250000, roe: 13600 / 105000, size: Math.log(1250000), zbank: (13600 / 1250000 + 105000 / 1250000) / sd,
  npl: 15580 / 820000, car: 0.119, ldr: 820000 / 930000, cir: 15500 / 43000, llp: 10500 / 820000, lg: 820000 / 730000 - 1,
  nonint: (43000 - 33000) / 43000, eqta: 105000 / 1250000, nim: 33000 / 1250000,
};
for (const [id, want] of Object.entries(expectNHA2023)) near(get("NHA", 2023, id, RB), want, `NHA 2023 ${id}`);
ok(Object.keys(expectNHA2023).length === T.VARS.filter(v => v.scope !== "firm").length, "every bank variable has a hand-checked value");
ok(/tổng tài sản/.test(RB.rows.find(r => r.year === 2023).notes.nim ?? ""), "NIM without earning assets is flagged as an approximation");
near(get("NHA", 2022, "nim", RB), 31000 / 1040000, "NHA 2022 nim on earning assets");
isNaNv(get("NHA", 2022, "zbank", RB), "zbank needs three years");

// ---- CSV and measurement paragraph ----
const csv = T.toCSV(P.data, R, "firm").trim().split("\n");
ok(csv.length === 1 + 5, `CSV has ${csv.length} lines, want header + 5`);
const head = csv[0].split(",");
ok(head[0] === "firm" && head[1] === "year" && head.includes("roa") && head.includes("ta"), "CSV header has firm, year, inputs and variables");
ok(csv.every(l => l.split(",").length === head.length), "every CSV row has as many cells as the header");
ok(!csv.join("").includes("NaN"), "missing values are blank in the CSV");
const mt = T.measurementText(R, false);
ok(mt.refs.every(k => T.REFS[k]), "measurement paragraph cites known references");
ok(/2019–2022|2019–2023/.test(mt.html) && mt.html.includes("Thông tư 200/2014/TT-BTC"), "measurement paragraph names period and accounting regime");
for (const v of T.VARS) ok(T.REFS[v.cite], `${v.id} cites unknown reference ${v.cite}`);
for (const [k, r] of Object.entries(T.REFS)) ok(/^10\.\d{4,9}\/\S+$/.test(r.doi) && /\(\d{4}\)/.test(r.apa), `reference ${k} needs a DOI and (year)`);
ok(new Set(T.VARS.map(v => v.id)).size === T.VARS.length, "variable ids are unique");
for (const tpl of ["firm", "bank"]) ok(new Set(T.FIELDS[tpl].map(f => f.key)).size === T.FIELDS[tpl].length, `${tpl} field keys are unique`);

// ---- header aliases, ambiguity, statement-scoped codes ----
for (const [h, k, tpl = "firm", sec] of [["Tổng tài sản", "ta"], ["LNST", "ni"], ["Doanh thu thuần", "rev"], ["Phải thu khách hàng", "ar"], ["Vay ngắn hạn", "std"], ["Total assets", "ta"], ["51", "taxc"], ["52", "taxd"], ["Mã chứng khoán", "firm"],
  ["20", "cfo", "firm", "LCTT"], ["02", "da", "firm", "LCTT"], ["Cho vay khách hàng", "loans", "bank"], ["Tiền gửi của khách hàng", "deposits", "bank"], ["Lợi nhuận sau thuế", "ni", "bank"], ["Tỷ lệ nợ xấu (%)", "nplr", "bank"], ["Ngân hàng", "firm", "bank"]])
  ok(T.headerKey(h, tpl, sec) === k, `headerKey("${h}", ${tpl}, ${sec}) = ${T.headerKey(h, tpl, sec)}, want ${k}`);
ok(T.headerKey("Lợi nhuận", "firm") === null, "ambiguous 'Lợi nhuận' is not guessed");
ok(T.headerKey("20", "firm", "KQKD") === null, "KQKD 20 (gross profit) is not LCTT 20");
for (const [c, y] of [["2023", 2023], ["Năm 2023", 2023], ["31/12/2023", 2023], ["01/01/2023", 2022], ["FY2021", 2021], ["Thuyết minh", null], ["Mã số", null]])
  ok(T.yearOf(c) === y, `yearOf("${c}") = ${T.yearOf(c)}, want ${y}`);

// ---- decimal mark decided for the whole table ----
ok(T.detectDecimal([["1,250", "12,5"]]) === ",", "comma decimal detected from 12,5");
ok(T.detectDecimal([["1,250", "0.5"]]) === ".", "dot decimal detected from 0.5");
ok(T.detectDecimal([["1.234.567", "1,250"]]) === ",", "dot thousands imply comma decimals");
ok(T.detectDecimal([["1,250"]]) === null, "1,250 alone is ambiguous");
near(T.parse("firm\tyear\tta\tni\nX\t2023\t1,250\t12,5", "firm").data[0].ta, 1.25, "1,250 is 1.25 in a comma-decimal table");
near(T.parse('firm,year,ta,ni\nX,2023,"1,250",0.5', "firm").data[0].ta, 1250, "1,250 is 1250 in a dot-decimal table");
near(T.parse("Mã CK;Năm;Tổng tài sản;LNST\nVNM;2023;1.234,5;12,5", "firm").data[0].ta, 1234.5, "semicolon CSV with Vietnamese numbers");

// ---- full vertical BCTC with title, Mã số, Thuyết minh, date columns and KQKD/LCTT codes that collide ----
const bctc = [
  "CÔNG TY CỔ PHẦN XYZ", "BẢNG CÂN ĐỐI KẾ TOÁN\t\t\t\t",
  "Chỉ tiêu\tMã số\tThuyết minh\t31/12/2023\t01/01/2023", "Mã CK\t\t\tXYZ\tXYZ",
  "TÀI SẢN NGẮN HẠN\t100\t\t600\t500", "Tiền và các khoản tương đương tiền\t110\tV.1\t90\t80", "Tiền\t111\t\t50\t40",
  "TỔNG CỘNG TÀI SẢN\t270\t\t1.200\t1.000", "NỢ PHẢI TRẢ\t300\t\t700\t550", "VỐN CHỦ SỞ HỮU\t400\t\t500\t450",
  "BÁO CÁO KẾT QUẢ HOẠT ĐỘNG KINH DOANH\t\t\t\t",
  "Doanh thu thuần về bán hàng và cung cấp dịch vụ\t10\t\t1.500\t1.300", "Giá vốn hàng bán\t11\t\t(1.100)\t(950)",
  "Lợi nhuận gộp về bán hàng và cung cấp dịch vụ\t20\t\t400\t350", "Chi phí tài chính\t22\t\t30\t25", "Trong đó: Chi phí lãi vay\t23\t\t20\t18",
  "Tổng lợi nhuận kế toán trước thuế\t50\t\t120\t100", "Chi phí thuế TNDN hiện hành\t51\t\t25\t21", "Chi phí thuế TNDN hoãn lại\t52\t\t(1)\t-",
  "Lợi nhuận sau thuế thu nhập doanh nghiệp\t60\t\t96\t79",
  "Lợi nhuận trước thuế\t01\t\t120\t100", "Khấu hao TSCĐ và BĐSĐT\t02\t\t40\t35", "Lưu chuyển tiền thuần từ hoạt động kinh doanh\t20\t\t110\t90",
  "Tiền chi để mua sắm, xây dựng TSCĐ và các tài sản dài hạn khác\t21\t\t(80)\t(60)",
].join("\n");
const PX = T.parse(bctc, "firm");
ok(PX.transposed && PX.data.length === 2 && PX.data.every(r => r.firm === "XYZ"), `vertical BCTC: ${PX.data.length} rows of XYZ`);
const x23 = PX.data.find(r => r.year === 2023) ?? {}, x22 = PX.data.find(r => r.year === 2022) ?? {};
for (const [k, v] of Object.entries({ ta: 1200, ca: 600, cash: 90, tl: 700, eq: 500, rev: 1500, cogs: -1100, int: 20, ebt: 120, tax: 24, ni: 96, da: 40, cfo: 110, capex: -80 }))
  near(x23[k], v, `vertical BCTC 2023 ${k}`);
near(x22.ta, 1000, "01/01/2023 column is year 2022");
near(x22.tax, 21, "tax = 51 + 52 with '-' as zero");
const RX = T.compute(PX.data, "firm", false);
near(get("XYZ", 2023, "gpm", RX), 400 / 1500, "gross margin with cost of sales in parentheses");
near(get("XYZ", 2023, "etr", RX), 24 / 120, "ETR from codes 51 + 52");
near(get("XYZ", 2023, "capex", RX), 80 / 1000, "capex over previous-year assets from vertical input");

// ---- long data (firm, year, variable, value) and a table without firm column ----
const PL = T.parse("firm,year,variable,value\nA,2022,ta,100\nA,2022,ni,5\nA,2023,ta,110\nA,2023,ni,6", "firm");
near(get("A", 2023, "roa", T.compute(PL.data, "firm", false)), 6 / 110, "roa from long data");
const PN = T.parse("year\tta\tni\n2022\t100\t5\n2023\t110\t6", "firm");
ok(PN.errors.length === 0 && PN.data.length === 2 && PN.data[0].firm === "DN" && PN.notes.length === 1, "no firm column: one firm named DN");

// ---- bank: CAR as decimal or percent, NPL ratio when the amount is missing ----
const PB2 = T.parse("firm\tyear\tta\tloans\tcar\tnplr\nB\t2023\t100\t60\t0,119\t1,8\nC\t2023\t100\t60\t12,5\t", "bank");
const RB2 = T.compute(PB2.data, "bank", false);
near(get("B", 2023, "car", RB2), 0.119, "CAR entered as a decimal is kept");
near(get("C", 2023, "car", RB2), 0.125, "CAR entered as percent is divided by 100");
near(get("B", 2023, "npl", RB2), 0.018, "NPL from the published ratio when the amount is missing");
isNaNv(get("C", 2023, "npl", RB2), "NPL empty without amount or ratio");

// ---- negative equity under averaging, units for price × shares ----
const neg = T.parse("firm\tyear\tni\teq\tta\nN\t2022\t5\t(10)\t100\nN\t2023\t8\t40\t120", "firm");
isNaNv(get("N", 2023, "roe", T.compute(neg.data, "firm", { avg: true })), "ROE with average equity is empty when last year's equity was negative");
near(get("N", 2023, "roe", T.compute(neg.data, "firm", false)), 8 / 40, "ROE on ending equity still computed");
const psu = T.parse("firm\tyear\tta\ttl\teq\tprice\tshares\nX\t2022\t1000\t400\t600\t20000\t45000000", "firm");
near(T.compute(psu.data, "firm", { unit: "trieu" }).rows[0].values.q, (20000 * 45000000 / 1e6 + 400) / 1000, "price × shares converted to triệu đồng");

// ---- Stata percentiles, winsorizing, lags, descriptive statistics ----
const s5 = [1, 2, 3, 4, 5], s10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
near(T.pctile(s10, 50), 5.5, "pctile 50 of 1..10"); near(T.pctile(s5, 50), 3, "pctile 50 of 1..5");
near(T.pctile(s5, 1), 1, "pctile 1 of 5 values"); near(T.pctile(s5, 99), 5, "pctile 99 of 5 values");
near(T.pctile(s10, 25), 3, "pctile 25 of 1..10 (P = 2.5, 3rd value)");
near(T.pctile(Array.from({ length: 200 }, (_, i) => i + 1), 1), 2.5, "pctile 1 of 1..200 (P = 2, mean of 2nd and 3rd)");
const fake = { vars: [{ id: "x" }], rows: Array.from({ length: 200 }, (_, i) => ({ values: { x: i + 1 } })) };
fake.rows[5].values.x = NaN;
T.winsorize(fake, 1);
const xs = Array.from({ length: 200 }, (_, i) => i + 1).filter(v => v !== 6);
ok(fake.bounds.x.lo === xs[Math.ceil(199 * 0.01) - 1], `winsor p1 of 199 values = ${xs[Math.ceil(199 * 0.01) - 1]}, got ${fake.bounds.x.lo}`);
ok(fake.bounds.x.hi === xs[Math.ceil(199 * 0.99) - 1], `winsor p99 of 199 values = ${xs[Math.ceil(199 * 0.99) - 1]}, got ${fake.bounds.x.hi}`);
ok(fake.rows[0].final.x === fake.bounds.x.lo && fake.rows[199].final.x === fake.bounds.x.hi && fake.rows[100].final.x === 101, "winsorized values clamp only the tails");
ok(fake.bounds.x.nlo === 1 && fake.bounds.x.nhi === 1, `one value replaced at each end, got ${fake.bounds.x.nlo}/${fake.bounds.x.nhi}`);
ok(Number.isNaN(fake.rows[5].final.x), "missing stays missing after winsorizing");
ok(fake.rows[0].values.x === 1, "raw value kept beside the winsorized one");
const RW = T.compute(T.parse(firmText, "firm").data, "firm", { winsor: 1, lag: true });
near(RW.rows.find(r => r.firm === "AAA" && r.year === 2022).lag.roa, RW.rows.find(r => r.firm === "AAA" && r.year === 2021).final.roa, "lag of roa is the previous year's value");
isNaNv(RW.rows.find(r => r.firm === "AAA" && r.year === 2021).lag.roa, "no lag across the 2019→2021 gap");
isNaNv(RW.rows.find(r => r.firm === "BBB" && r.year === 2022).lag.roa, "no lag across firms");
const ds = T.describe(R).find(d => d.id === "roa"), roaAll = R.rows.map(r => r.values.roa);
const mean = roaAll.reduce((a, b) => a + b, 0) / 5;
ok(ds.n === 5, "describe N"); near(ds.mean, mean, "describe mean");
near(ds.sd, Math.sqrt(roaAll.reduce((a, b) => a + (b - mean) ** 2, 0) / 4), "describe SD with n − 1");
near(ds.min, Math.min(...roaAll), "describe min"); near(ds.max, Math.max(...roaAll), "describe max");

// ---- panel CSV: unique Stata/R/EViews names, winsorized and lag columns ----
const hd = T.toCSV(P.data, RW, "firm").trim().split("\n");
const h0 = hd[0].split(",");
ok(new Set(h0).size === h0.length, `CSV column names are unique: ${h0.filter((c, i) => h0.indexOf(c) !== i)}`);
ok(new Set(h0.map(c => c.toLowerCase())).size === h0.length, "CSV names stay unique for case-insensitive EViews");
ok(h0.every(c => /^[a-z][a-z0-9_]{0,31}$/.test(c)), "CSV names are valid Stata names");
for (const c of ["cash", "cash_ta", "capex", "capex_ta", "roa", "roa_w", "roa_w_l1"]) ok(h0.includes(c), `CSV has column ${c}`);
const row22 = hd.find(l => l.startsWith("AAA,2022,")).split(",");
near(+row22[h0.indexOf("roa_w_l1")], RW.rows.find(r => r.firm === "AAA" && r.year === 2021).final.roa, "CSV lag column", 1e-8);
const hb = T.toCSV(PB.data, RB, "bank").trim().split("\n")[0].split(",");
ok(new Set(hb).size === hb.length && hb.includes("npl") && hb.includes("npl_ratio") && hb.includes("car_ratio"), "bank CSV keeps npl input apart from npl_ratio");
const code = T.codeSnippets(RW, "firm", "f.csv");
ok(/xtset id year/.test(code) && /pdata\.frame/.test(code) && /pagestruct/.test(code), "Stata, R and EViews code");

// ---- data checks ----
const bad = T.parse("firm\tyear\tta\ttl\teq\nK\t2022\t1000\t400\t500\nK\t2023\t1100000\t500000\t600000", "firm");
const w = T.checkData(bad.data, "firm", "ty");
ok(w.some(m => /K 2022: tổng tài sản/.test(m)), "balance-sheet identity violation reported");
ok(w.some(m => /100 lần/.test(m)), "unit jump between years reported");
ok(T.checkData(P.data, "firm", "ty").length === 0, `clean fixture has no warnings: ${T.checkData(P.data, "firm", "ty")}`);
ok(T.checkData(P.data, "firm", "dong").some(m => /Đơn vị/.test(m)), "small totals in đồng trigger a unit warning");

// ---- measurement paragraph mentions unit, winsorizing and lags ----
const mw = T.measurementText(RW, RW.opts).html;
ok(/winsorize ở phân vị 1% và 99%/.test(mw) && /Biến trễ/.test(mw) && /đơn vị đồng/.test(mw), "paragraph states winsorizing, lag and unit");

// ---- vertical statement with "Năm nay / Năm trước" columns: the year comes from the title ----
const rel = T.parse(["BÁO CÁO KẾT QUẢ HOẠT ĐỘNG KINH DOANH", "Cho năm tài chính kết thúc ngày 31/12/2024", "Chỉ tiêu\tMã số\tNăm nay\tNăm trước", "Doanh thu thuần về bán hàng và cung cấp dịch vụ\t10\t900\t800", "Lợi nhuận sau thuế thu nhập doanh nghiệp\t60\t45\t40"].join("\n"), "firm");
ok(rel.transposed && rel.errors.length === 0 && rel.data.map(r => r.year).join() === "2023,2024", `Năm nay / Năm trước read as 2024 / 2023: ${rel.data.map(r => r.year)} ${rel.errors}`);
near(rel.data[1].rev, 900, "Năm nay column holds the report year");
const relNo = T.parse(["Chỉ tiêu\tMã số\tNăm nay\tNăm trước", "Doanh thu thuần\t10\t900\t800", "LNST\t60\t45\t40"].join("\n"), "firm");
ok(relNo.errors.some(e => /Năm nay/.test(e)), "Năm nay without a year in the title asks for year headers");

// ---- cycle 2: headers with units in brackets and item numbering; vertical TT49 bank statement; ticker case ----
for (const [h, k, tpl = "firm"] of [["Tổng tài sản (tỷ đồng)", "ta"], ["LNST (triệu đồng)", "ni"], ["A. TÀI SẢN NGẮN HẠN", "ca"], ["II. Đầu tư tài chính ngắn hạn", "sti"],
  ["VI. Cho vay khách hàng", "loans", "bank"], ["1. Thu nhập lãi và các khoản thu nhập tương tự", "ii", "bank"], ["Nợ xấu (%)", "nplr", "bank"], ["Nợ xấu (tỷ đồng)", "npl", "bank"], ["CAR (%)", "car", "bank"]])
  ok(T.headerKey(h, tpl) === k, `headerKey("${h}", ${tpl}) = ${T.headerKey(h, tpl)}, want ${k}`);
ok(T.headerKey("1. Tiền", "firm") === null, "sub-item 'Tiền' is not cash and equivalents");
const tt49 = T.parse([
  "Chỉ tiêu\tThuyết minh\t31/12/2024\t31/12/2023", "Ngân hàng\t\tVCB\tVCB",
  "TỔNG TÀI SẢN\t\t2.085.000\t1.839.613", "VI. Cho vay khách hàng\t\t1.418.000\t1.250.000", "1. Cho vay khách hàng\t8\t1.440.000\t1.270.000", "2. Dự phòng rủi ro cho vay khách hàng\t9\t(22.000)\t(20.000)",
  "III. Tiền gửi của khách hàng\t\t1.590.000\t1.450.000", "VIII. Vốn chủ sở hữu\t\t190.000\t165.000",
  "1. Thu nhập lãi và các khoản thu nhập tương tự\t\t110.000\t100.000", "I. Thu nhập lãi thuần\t\t56.000\t55.400", "VIII. Tổng thu nhập hoạt động\t\t70.000\t68.000",
  "IX. Chi phí hoạt động\t\t(22.000)\t(21.000)", "XI. Chi phí dự phòng rủi ro tín dụng\t\t(5.000)\t(6.000)", "XII. Tổng lợi nhuận trước thuế\t\t42.000\t41.000", "XIV. Lợi nhuận sau thuế\t\t33.800\t32.800",
].join("\n"), "bank");
ok(tt49.transposed && tt49.data.length === 2 && tt49.data[0].firm === "VCB", `vertical TT49 statement: ${tt49.data.length} rows`);
const v24 = tt49.data.find(r => r.year === 2024) ?? {};
for (const [k, v] of Object.entries({ ta: 2085000, loans: 1440000, llr: -22000, deposits: 1590000, eq: 190000, ii: 110000, nii: 56000, toi: 70000, opex: -22000, prov: -5000, ebt: 42000, ni: 33800 }))
  near(v24[k], v, `TT49 2024 ${k}`);
const RT = T.compute(tt49.data, "bank", false);
near(get("VCB", 2024, "cir", RT), 22000 / 70000, "CIR from a vertical TT49 statement");
near(get("VCB", 2024, "lg", RT), 1440000 / 1270000 - 1, "loan growth on gross loans");
const tk = T.parse("firm\tyear\tta\tni\nvnm\t2022\t100\t5\nVNM \t2023\t110\t6", "firm");
ok(new Set(tk.data.map(r => r.firm)).size === 1, "tickers vnm and VNM are one firm");
near(get("VNM", 2023, "growth", T.compute(T.parse("firm\tyear\trev\nvnm\t2022\t100\nVNM\t2023\t110", "firm").data, "firm", false)), 0.1, "lag found across ticker case");

if (fails) { console.log(`\n${fails} of ${n} checks failed`); process.exit(1); }
console.log(`OK ${n} calculator checks`);
