// Unit tests for the financial-ratio calculator (src/tools/tinh-chi-so-tai-chinh.html): run `node scripts/check-ratios.mjs`.
// Loads the code between //#fr-start and //#fr-end and checks number parsing, header matching, transposed input,
// every formula against values worked out by hand, lag/average rules, the panel CSV and the cited references.
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/tools/tinh-chi-so-tai-chinh.html", import.meta.url), "utf8");
const block = src.split("//#fr-start")[1]?.split("//#fr-end")[0];
if (!block) { console.log("FAIL: markers //#fr-start, //#fr-end not found"); process.exit(1); }
const T = new Function(`${block}; return { FIELDS, REFS, VARS, num, headerKey, parse, compute, toCSV, measurementText };`)();

let fails = 0, n = 0;
const ok = (cond, msg) => { n++; if (!cond) { fails++; console.log(`FAIL ${msg}`); } };
const near = (got, want, msg, tol = 1e-9) => ok(Number.isFinite(got) && Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)), `${msg}: got ${got}, want ${want}`);
const isNaNv = (got, msg) => ok(Number.isNaN(got), `${msg}: got ${got}, want empty`);

// ---- number parsing ----
for (const [s, v] of [["1.234.567", 1234567], ["1,234,567", 1234567], ["1 234 567", 1234567], ["(1.250)", -1250], ["-1.234,5", -1234.5], ["1,234.5", 1234.5], ["6,4", 6.4], ["12.5", 12.5], ["1,234", 1234], ["0", 0], ["11,5%", 11.5]])
  near(T.num(s), v, `num("${s}")`);
for (const s of ["", "-", "abc", "1/1/2020"]) isNaNv(T.num(s), `num("${s}")`);

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

if (fails) { console.log(`\n${fails} of ${n} checks failed`); process.exit(1); }
console.log(`OK ${n} calculator checks`);
