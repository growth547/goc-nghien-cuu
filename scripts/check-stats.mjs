// Checks the statistics in src/tools/phan-tich-du-lieu.html against closed forms and
// textbook values, so the chapter-4 report a student copies is numerically right.
import { readFileSync } from "node:fs";

const src = readFileSync("src/tools/phan-tich-du-lieu.html", "utf8");
const block = tag => {
  const parts = src.split(`//#${tag}-start`);
  if (parts.length !== 2 || !parts[1].includes(`//#${tag}-end`)) throw new Error(`missing //#${tag} block`);
  return parts[1].split(`//#${tag}-end`)[0];
};
const S = new Function(
  `${block("stats")}${block("data")}${block("report")}; return { gammaQ, tP, fP, mean, variance, minMax, pearson, corrMatrix, invert, logDet, describe, cronbach, eigenSym, varimax, efa, ols,
    oneway, levene, welchAnova, ttest, postHoc, pcLoadings, crAve, htmt, parseCSV, extractCode, groupOf, pickHeaderRow, buildTable, toNum, likertNum, classify, suggestGroups, guessScale, orderCats, analyze };`
)();

let failed = 0;
const near = (a, b, tol, label) => {
  const ok = Math.abs(a - b) <= tol;
  console.log(`${ok ? "ok  " : "FAIL"} ${label}: ${a} vs ${b}`);
  if (!ok) failed++;
};

// Distribution tails (values from standard tables).
near(S.tP(2.0, 10), 0.07339, 2e-4, "t = 2, df = 10, two-tailed p");
near(S.tP(2.228, 10), 0.05, 2e-4, "t = 2.228, df = 10 is the 5% critical value");
near(S.fP(3.49, 2, 20), 0.05, 1e-3, "F = 3.49 (2, 20) is the 5% critical value");
near(S.gammaQ(1, 1.5), Math.exp(-1.5), 1e-10, "chi-square df 2 tail = exp(-x/2)");
near(S.gammaQ(5, 18.307 / 2), 0.05, 2e-4, "chi-square 18.307 with df 10 is the 5% critical value");

// Deterministic test data: three correlated items plus noise.
let s = 7;
const rnd = () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
const norm = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const n = 300;
const f1 = Array.from({ length: n }, norm), f2 = Array.from({ length: n }, norm);
const items = [0.8, 0.7, 0.75, 0.6].map(l => f1.map(v => l * v + 0.6 * norm()))
  .concat([0.8, 0.7, 0.65].map(l => f2.map(v => l * v + 0.6 * norm())));

// Cronbach's alpha against the covariance form k·c̄ / (v̄ + (k − 1)·c̄).
const cols = items.slice(0, 4), k = cols.length;
const cov = (a, b) => { const ma = S.mean(a), mb = S.mean(b); return a.reduce((t, v, i) => t + (v - ma) * (b[i] - mb), 0) / (a.length - 1); };
let vbar = 0, cbar = 0, pairs = 0;
for (let i = 0; i < k; i++) { vbar += S.variance(cols[i]) / k; for (let j = i + 1; j < k; j++) { cbar += cov(cols[i], cols[j]); pairs++; } }
cbar /= pairs;
near(S.cronbach(cols).alpha, (k * cbar) / (vbar + (k - 1) * cbar), 1e-10, "alpha equals the covariance formula");

// Eigen-decomposition: A·v = λ·v and eigenvalues sum to the trace.
const R = S.corrMatrix(items), eig = S.eigenSym(R);
near(eig.reduce((t, e) => t + e.val, 0), R.length, 1e-9, "eigenvalues sum to the number of variables");
const e0 = eig[0], Av = R.map(r => r.reduce((t, v, j) => t + v * e0.vec[j], 0));
near(Math.max(...Av.map((v, i) => Math.abs(v - e0.val * e0.vec[i]))), 0, 1e-9, "A·v = λ·v for the first component");

// EFA: two factors recovered, rotation keeps communalities, items load on their own factor.
const e = S.efa(items, 0);
near(e.k, 2, 0, "eigenvalue > 1 keeps 2 factors");
const L = Array.from({ length: items.length }, (_, i) => eig.slice(0, 2).map(x => x.vec[i] * Math.sqrt(x.val)));
near(Math.max(...e.rotated.map((r, i) => Math.abs(r.reduce((t, v) => t + v * v, 0) - L[i].reduce((t, v) => t + v * v, 0)))), 0, 1e-9, "varimax keeps communalities");
const own = e.rotated.map(r => (Math.abs(r[0]) > Math.abs(r[1]) ? 0 : 1));
near(new Set(own.slice(0, 4)).size + new Set(own.slice(4)).size + (own[0] !== own[4] ? 0 : 1), 2, 0, "items 1–4 and 5–7 load on different factors");
near(e.kmo > 0.5 && e.kmo < 1 ? 1 : 0, 1, 0, `KMO in (0.5, 1): ${e.kmo.toFixed(3)}`);
const bart = -(n - 1 - (2 * 7 + 5) / 6) * S.logDet(R);
near(e.chi, bart, 1e-9, "Bartlett chi-square matches the formula");

// OLS: simple regression slope = r·sy/sx; residuals orthogonal to predictors.
const x = items[0], y = items[1], fit = S.ols(y, [x]);
near(fit.coef[0].b, S.pearson(x, y) * Math.sqrt(S.variance(y) / S.variance(x)), 1e-10, "simple slope = r·sy/sx");
near(fit.coef[0].beta, S.pearson(x, y), 1e-10, "standardised beta = r in simple regression");
near(fit.r2, S.pearson(x, y) ** 2, 1e-10, "R² = r² in simple regression");
const multi = S.ols(items[2], [items[0], items[1], items[4]]);
const pred = items[2].map((_, i) => multi.b0 + multi.coef.reduce((t, c, j) => t + c.b * [items[0], items[1], items[4]][j][i], 0));
const res = items[2].map((v, i) => v - pred[i]);
near(Math.max(...[items[0], items[1], items[4]].map(xx => Math.abs(xx.reduce((t, v, i) => t + v * res[i], 0)))), 0, 1e-8, "residuals orthogonal to predictors");
near(multi.coef[0].vif, 1 / (1 - S.ols(items[0], [items[1], items[4]]).r2), 1e-8, "VIF = 1 / (1 − R² of that predictor on the others)");


// ---------- new statistics: closed forms and reference values (scipy.stats 1.18; R and SPSS give the same) ----------
const ga = [3, 4, 5, 4, 3, 5, 4, 4, 2, 5], gb = [2, 3, 3, 2, 4, 3, 1, 3, 2, 3, 2, 4], gc = [4, 5, 5, 5, 4, 5, 3, 5];
const tt = S.ttest(ga, gb);
near(tt.pooled.t, 3.0734777223274152, 1e-9, "Student t (pooled) = scipy ttest_ind");
near(tt.pooled.p, 0.005994457175736196, 1e-7, "Student t p-value");
near(tt.welch.t, 3.040447610095598, 1e-9, "Welch t = scipy ttest_ind(equal_var=False)");
near(tt.welch.df, 18.313282052143585, 1e-9, "Welch–Satterthwaite df");
near(tt.welch.p, 0.006936943152296041, 1e-7, "Welch t p-value");
{ // the Welch df by hand
  const v1 = S.variance(ga) / ga.length, v2 = S.variance(gb) / gb.length;
  near(tt.welch.df, (v1 + v2) ** 2 / (v1 ** 2 / (ga.length - 1) + v2 ** 2 / (gb.length - 1)), 1e-12, "Welch df by hand");
}
near(S.levene([ga, gb]).F, 0.005912485969393578, 1e-9, "Levene (mean) two groups = scipy levene(center='mean')");
near(S.levene([ga, gb, gc]).F, 0.13442368547491906, 1e-9, "Levene (mean) three groups");
near(S.levene([ga, gb, gc]).p, 0.8748010009133204, 1e-7, "Levene p-value");
const ow = S.oneway([ga, gb, gc]);
near(ow.F, 11.14219474497682, 1e-9, "one-way ANOVA F = scipy f_oneway");
near(ow.p, 0.0002963699529772123, 1e-8, "one-way ANOVA p-value");
{ // F by hand: (SSB / (k − 1)) / (SSW / (N − k))
  const all = [...ga, ...gb, ...gc], gm = S.mean(all);
  const ssb = [ga, gb, gc].reduce((s, g) => s + g.length * (S.mean(g) - gm) ** 2, 0), ssw = [ga, gb, gc].reduce((s, g) => s + (g.length - 1) * S.variance(g), 0);
  near(ow.F, ssb / 2 / (ssw / (all.length - 3)), 1e-12, "ANOVA F by hand");
}
const wa = S.welchAnova([ga, gb, gc]);
near(wa.F, 12.259042766735513, 1e-9, "Welch ANOVA F = scipy f_oneway(equal_var=False)");
near(wa.p, 0.0004883499138413599, 1e-7, "Welch ANOVA p-value");
near(S.tP(2.086, 20), 0.05, 2e-4, "t table: 2.086 with df 20 is the 5% two-tailed value");
{ // Bonferroni = pairwise t on the pooled MSW, times the number of pairs; Tamhane T2 = Šidák on Welch t
  const ph = S.postHoc([ga, gb, gc], true), p01 = S.tP((S.mean(ga) - S.mean(gb)) / Math.sqrt(ow.msw * (1 / ga.length + 1 / gb.length)), ow.df2);
  near(ph[0].p, Math.min(1, 3 * p01), 1e-12, "Bonferroni p = 3 × pairwise p");
  near(S.postHoc([ga, gb, gc], false)[0].p, 1 - (1 - tt.welch.p) ** 3, 1e-12, "Tamhane T2 p = 1 − (1 − Welch p)³");
}
const sk = [1, 2, 2, 3, 3, 3, 4, 4, 5, 9, 1.5, 2.5], dsk = S.describe(sk);
near(dsk.skew, 1.880454809697664, 1e-9, "skewness = SPSS/scipy skew(bias=False)");
near(dsk.kurt, 4.540367710428037, 1e-9, "kurtosis = SPSS/scipy kurtosis(bias=False)");
near(S.describe([1, 2, 3, 4, 5]).skew, 0, 1e-12, "symmetric data has skewness 0");
near(S.describe([1, 2, 3, 4, 5]).kurt, -1.2, 1e-12, "1..5 has kurtosis −1.2 (closed form)");
near(dsk.seSkew, Math.sqrt((6 * 12 * 11) / (10 * 13 * 15)), 1e-12, "SE of skewness, n = 12");
// CR / AVE / HTMT against hand calculation
const ca = S.crAve([0.7, 0.8, 0.9]);
near(ca.cr, 5.76 / (5.76 + 1.06), 1e-12, "CR = (Σλ)² / ((Σλ)² + Σ(1 − λ²)) for λ = .7, .8, .9");
near(ca.ave, (0.49 + 0.64 + 0.81) / 3, 1e-12, "AVE = Σλ² / k");
{
  const Rh = [[1, 0.6, 0.3, 0.2], [0.6, 1, 0.4, 0.1], [0.3, 0.4, 1, 0.5], [0.2, 0.1, 0.5, 1]];
  near(S.htmt(Rh, [[0, 1], [2, 3]])[1][0], 0.25 / Math.sqrt(0.6 * 0.5), 1e-12, "HTMT = mean heterotrait r / √(monotrait A × monotrait B)");
  const L2 = S.pcLoadings([items[0], items[1]]), r = S.pearson(items[0], items[1]);
  near(L2[0], Math.sqrt((1 + r) / 2), 1e-9, "two-item PC loading = √((1 + r)/2)");
}
{ // Durbin–Watson and the constant's standard error in simple regression
  const xx = items[3], yy = items[2], m = S.ols(yy, [xx]);
  const e = yy.map((v, i) => v - m.b0 - m.coef[0].b * xx[i]);
  near(m.dw, e.slice(1).reduce((s, v, i) => s + (v - e[i]) ** 2, 0) / e.reduce((s, v) => s + v * v, 0), 1e-10, "Durbin–Watson = Σ(eₜ − eₜ₋₁)² / Σeₜ²");
  const mx = S.mean(xx), sxx = xx.reduce((s, v) => s + (v - mx) ** 2, 0);
  near(m.se0, Math.sqrt(m.mse * (1 / xx.length + (mx * mx) / sxx)), 1e-10, "SE of the constant = √(MSE·(1/n + x̄²/Sxx))");
}

// ---------- regression tests for the QA report (docs/qa/cong-cu.md) ----------
const check = (ok, label) => { console.log(`${ok ? "ok  " : "FAIL"} ${label}`); if (!ok) failed++; };
let seed = 11;
const R01 = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const N01 = () => Math.sqrt(-2 * Math.log(R01() + 1e-12)) * Math.cos(2 * Math.PI * R01());
const lik = v => Math.min(5, Math.max(1, Math.round(3 + v)));
// A data table: Likert items for each construct {code: nItems}, plus extra(i) columns.
function makeData(spec, nRows, extra = () => ({})) {
  const head = Object.entries(spec).flatMap(([c, k]) => Array.from({ length: k }, (_, j) => `${c}${j + 1}`));
  const rows = [];
  for (let i = 0; i < nRows; i++) {
    const g = N01(), r = {};
    Object.entries(spec).forEach(([c, k]) => { const f = 0.6 * g + 0.8 * N01(); for (let j = 1; j <= k; j++) r[`${c}${j}`] = lik(0.9 * f + 0.6 * N01()); });
    Object.assign(r, extra(i));
    rows.push(r);
  }
  const cols = [...head, ...Object.keys(rows[0]).filter(k => !head.includes(k))];
  return [cols, ...rows.map(r => cols.map(c => r[c]))];
}
// What the page does on upload and on "Phân tích": header row, kinds, groups, defaults, analyze().
function runTable(raw, opts = {}) {
  const t = S.buildTable(raw, S.pickHeaderRow(raw)), kinds = S.classify(t.header, t.rows, t.labels), groups = S.suggestGroups(t.header, kinds);
  const by = k => t.header.filter(h => kinds[h] === k), kit = by("attn").find(h => /^(AC\d*|ACHK(_\d+)?)$/i.test(h));
  const res = S.analyze({ header: t.header, rows: t.rows, labels: t.labels, groups, rev: "", scaleMin: 1, scaleMax: 5, dv: groups.length ? groups[groups.length - 1].code : "", efaMode: "tach", k: "eigen",
    attn: kit ? `${kit}=2` : "", attnCols: by("attn"), screen: by("screen"), straight: true, demos: by("demo"), neg: "", ...opts });
  return { t, kinds, groups, res };
}
const plain = h => h.replace(/<[^>]+>/g, " ").replace(/&lt;/g, "<").replace(/&amp;/g, "&");

// P0-1: ATT is the TPB attitude construct, not an attention check.
{
  const { kinds, groups, res } = runTable(makeData({ ATT: 4, SN: 3, PBC: 3, INT: 3 }, 200));
  check(groups.map(g => g.code).join(",") === "ATT,SN,PBC,INT", `P0-1: ATT1–ATT4 form a construct (${groups.map(g => g.code)})`);
  check(!Object.values(kinds).includes("attn"), "P0-1: no attention check guessed from ATT1–ATT4");
  check(!res.error && res.n0 === 200 && !/kiểm tra chú ý/.test(res.html), `P0-1: no respondent removed by an attention filter (n = ${res.n})`);
  check(!/Cơ cấu mẫu theo ATT/.test(res.html), "P0-1: ATT2–ATT4 are not reported as demographics");
}
// P0-2: the questionnaire kit's naming (AC1, SANGLOC, TT*, prefixed TPB_ATT1, Vietnamese ĐT1) and Google Forms headers.
{
  const raw = makeData({ TPB_ATT: 3, TPB_SN: 3, "ĐT": 3, "TĐ": 3 }, 240, i => ({ "Dấu thời gian": `2026/10/0${1 + (i % 9)} 10:00:00`, SANGLOC: i % 40 === 0 ? "Chưa từng" : "Đã từng", AC1: i % 12 === 0 ? "4" : "2", "TT1. Giới tính": i % 3 ? "Nữ" : "Nam", "TT2. Độ tuổi": ["Từ 25 đến 34", "Từ 18 đến 24", "Từ 35 đến 44"][i % 3] }));
  raw[0] = raw[0].map(h => (h === "ĐT1" ? "Mức độ đồng ý của bạn [ĐT1. Tôi tin ứng dụng này]" : h));
  const { kinds, groups, res } = runTable(raw);
  check(groups.map(g => g.code).join(",") === "TPB_ATT,TPB_SN,ĐT,TĐ", `P0-2: prefixed and Vietnamese codes grouped (${groups.map(g => g.code)})`);
  check(kinds.AC1 === "attn" && kinds.SANGLOC === "screen" && kinds.TT1 === "demo" && kinds.TT2 === "demo" && kinds["Dấu thời gian"] === "id", "P0-2: AC1 attention, SANGLOC screening, TT* demographics, timestamp ignored");
  check(/không qua câu sàng lọc SANGLOC/.test(res.html) && /trả lời sai câu kiểm tra chú ý AC1/.test(res.html), "P0-2: screening and kit attention check (AC1=2) both filter");
  check(/Cơ cấu mẫu theo TT2 \(Độ tuổi\)/.test(res.html) && plain(res.html).indexOf("Từ 18 đến 24") < plain(res.html).indexOf("Từ 25 đến 34"), "P0-2: TT2 labelled and age bands sorted");
  check(!/Cơ cấu mẫu theo AC1/.test(res.html), "P0-2: AC1 is not a demographic table");
  check(S.groupOf("Q1_1") === "Q1" && S.groupOf("PU_2") === "PU" && S.groupOf("TPB_ATT1") === "TPB_ATT" && S.groupOf("đt1") === "ĐT", "P0-2: Q1_1, PU_2, TPB_ATT1, đt1 group keys");
  const ac = S.classify(["AC1", "AC2", "AC3", "ACHK"], [[1, 2, 3, 2], [2, 3, 3, 2]], {});
  check(ac.AC1 === "item" && ac.ACHK === "attn", "P0-2: AC1–AC3 (affective commitment) stay a construct, ACHK is the check");
  const trust = makeData({ TT: 4, PU: 3 }, 120);
  check(runTable(trust).groups.some(g => g.code === "TT"), "P0-2: numeric, correlated TT1–TT4 (tin tưởng) stay a construct");
}
// P0-3: large files use loops, not spread (10 000 × 40 used to throw RangeError).
{
  const raw = makeData({ A: 10, B: 10, C: 10, D: 10 }, 10000);
  const t0 = performance.now(), { res } = runTable(raw), ms = performance.now() - t0;
  check(!res.error && res.n > 9000, `P0-3: 10 000 × 40 analysed (${res.n} valid) in ${(ms / 1000).toFixed(1)} s`);
  check(ms < 30000, "P0-3: 10 000 × 40 finishes in under 30 s");
  const big = new Float64Array(300000).map((_, i) => i % 7);
  check(S.minMax(big)[1] === 6 && S.describe(big).max === 6, "P0-3: min/max of 300 000 values without spread");
}
// P0-4: a constant item is removed with a warning and the chapter text never contradicts the numbers.
{
  const raw = makeData({ A: 4, B: 4, Y: 3 }, 220);
  raw.slice(1).forEach(r => (r[0] = 3));
  const { res } = runTable(raw);
  check(!res.error && res.warnings.some(w => /A1.*phương sai bằng 0/.test(w)), "P0-4: warning names the constant item A1");
  check(/biến A1 được loại do mọi phiếu trả lời cùng một mức/.test(res.html), "P0-4: the chapter says A1 was removed");
  check(!/KMO = —|χ² = —/.test(res.html) && !/<td>A1<\/td>/.test(res.html.split("4.4.")[1]), "P0-4: EFA has numbers and no A1 row");
}
// P1-5: duplicate and linearly dependent columns.
{
  const raw = makeData({ A: 4, B: 4, Y: 3 }, 220);
  raw[0].push("A5");
  raw.slice(1).forEach(r => r.push(r[1]));
  const { res } = runTable(raw);
  check(res.warnings.some(w => /A5 trùng lặp với A2/.test(w)) && /KMO = 0,\d{3}/.test(res.html) && !/KMO = 1,000/.test(res.html), "P1-5: duplicate A5 removed, KMO is a real value");
  check(S.efa([items[0], items[1], items[0].map((v, i) => v + items[1][i])], 0).singular === true, "P1-5: a sum of two items makes EFA report a singular matrix");
}
// P1-7: Likert answers written as words, and text attention answers.
{
  const words = ["Hoàn toàn không đồng ý", "Không đồng ý", "Trung lập", "Đồng ý", "Hoàn toàn đồng ý"];
  const raw = makeData({ A: 3, B: 3 }, 150, i => ({ ACHK: i % 10 ? "Không đồng ý" : "Đồng ý" }));
  raw.slice(1).forEach(r => { for (let j = 0; j < 6; j++) r[j] = words[r[j] - 1]; });
  const { res } = runTable(raw);
  check(!res.error && res.warnings.some(w => /dạng chữ sang số/.test(w)), "P1-7: text Likert answers mapped to 1–5 with a notice");
  check(/15 phiếu trả lời sai câu kiểm tra chú ý ACHK/.test(res.html), "P1-7: text attention answers compared with the numeric key");
  const bad = makeData({ A: 3 }, 60);
  bad.slice(1).forEach(r => { r[0] = "abc"; r[1] = "xyz"; });
  const r2 = runTable(bad, { groups: [{ code: "A", items: ["A1", "A2", "A3"] }] }).res;
  check(Boolean(r2.error) && /A1/.test(r2.error), `P1-7: non-numeric columns are named instead of “0 phiếu hợp lệ” (${r2.error})`);
  const r3 = runTable(makeData({ A: 3, B: 3 }, 60), { attn: "ATTN=4" }).res;
  check(r3.warnings.some(w => /Không tìm thấy cột ATTN/.test(w)), "P1-7: a missing attention column is reported");
}
// P1-8: single-item constructs are not demographics; categories in a natural order.
{
  const { kinds } = runTable(makeData({ A: 3, B: 3 }, 60, () => ({ SAT1: 1 + Math.floor(R01() * 5) })));
  check(kinds.SAT1 === "single", "P1-8: SAT1 alone is a single item, not a demographic");
  check(S.orderCats([["Trên 45", 5], ["Từ 26 đến 35", 9], ["Dưới 18", 2], ["Khác", 1], ["Từ 18 đến 25", 7]]).map(x => x[0]).join("|") === "Dưới 18|Từ 18 đến 25|Từ 26 đến 35|Trên 45|Khác", "P1-8: age bands sorted by value, Khác last");
}
// P1-9: CSV quoting, BOM, semicolons, Google Forms headers, merged header rows.
{
  const csv = '﻿Dấu thời gian,"Bạn thấy app dễ dùng, nhanh? [PU1]","Mức độ đồng ý [PU2. Ứng dụng ""rất"" hữu ích]"\r\n2026/10/01,4,5\r\n2026/10/02,"3",4\r\n';
  const raw = S.parseCSV(csv);
  check(raw.length === 3 && raw[0].length === 3 && raw[1][1] === "4", `P1-9: quoted commas keep 3 columns (${raw[0].length})`);
  check(S.extractCode(raw[0][1]) === "PU1" && S.extractCode(raw[0][2]) === "PU2", "P1-9: codes taken from Google Forms headers");
  check(S.parseCSV("A1;A2\n3,5;4\n").map(r => r.length).join() === "2,2", "P1-9: semicolon files with decimal commas");
  const merged = [["Nhận thức hữu ích", "", "", "Ý định", ""], ["PU1", "PU2", "PU3", "BI1", "BI2"], [4, 5, 4, 3, 4], [3, 3, 4, 4, 4]];
  check(S.pickHeaderRow(merged) === 1, "P1-9: a two-row merged header picks the code row");
}
// P1-10: reverse scoring uses the declared scale, not the observed min and max.
{
  const raw = makeData({ A: 3, B: 3 }, 200);
  raw.slice(1).forEach(r => (r[0] = Math.min(4, Math.max(2, r[0]))));
  const base = runTable(raw).res, rev = runTable(raw, { rev: "a1 ZZ9" }).res;
  const meanOf = res => +plain(res.html).match(/A1\s+[\d.]+\s+\d\s+\d\s+([\d,]+)/)[1].replace(",", ".");
  near(meanOf(rev), 6 - meanOf(base), 1.5e-3, "P1-10: reversed mean = 6 − mean on a 1–5 scale though nobody chose 1 or 5");
  check(rev.warnings.some(w => /ZZ9/.test(w)), "P1-10: an unknown reverse item is reported");
}
// The new chapter-4 sections are present, tables are numbered, references are listed.
{
  const { res } = runTable(makeData({ A: 4, B: 4, Y: 3 }, 300, i => ({ GT: i % 2 ? "Nam" : "Nữ", TN: ["Dưới 5 triệu", "Từ 5 đến dưới 10 triệu", "Từ 10 triệu trở lên"][i % 3] })));
  const h = plain(res.html);
  for (const sec of ["4.2. Thống kê mô tả", "4.5. Độ tin cậy tổng hợp", "Ma trận Fornell – Larcker", "HTMT", "Durbin–Watson", "Tóm tắt kết quả kiểm định giả thuyết", "4.8. Kiểm định sự khác biệt", "Levene", "Tổng phương sai trích", "EFA cho biến phụ thuộc"])
    check(h.includes(sec), `report contains “${sec}”`);
  check(/Bảng 4\.1\. /.test(h) && h.includes(`Bảng 4.${res.tables}. `), `tables numbered 4.1–4.${res.tables}`);
  const cites = { durbin51: "Durbin & Watson, 1951", field13: "Field, 2013", fornell81: "Fornell & Larcker, 1981", george19: "George & Mallery, 2019", hair10: "Hair và cộng sự, 2010", hair22: "Hair và cộng sự, 2022", henseler15: "Henseler và cộng sự (2015)", kaiser58: "Kaiser, 1958", kaiser74: "Kaiser, 1974", kline16: "Kline (2016)", levene60: "Levene, 1960", nunnally78: "Nunnally, 1978", nunnally94: "Nunnally & Bernstein, 1994", welch47: "Welch, 1947", welch51: "1951)" };
  const body = h.split("Tài liệu tham khảo")[0];
  check(res.refs.every(r => !cites[r] || body.includes(cites[r])), `every listed reference is cited in the text (${res.refs.filter(r => cites[r] && !body.includes(cites[r]))})`);
}

// ---------- the standalone Cronbach tool (src/tools/cronbach-alpha.html) ----------
{
  const caSrc = readFileSync("src/tools/cronbach-alpha.html", "utf8");
  const CA = new Function(`${caSrc.split("//#ca-start")[1].split("//#ca-end")[0]}; return { parse, analyse, cellNum };`)();
  const sample = new Function(`return \`${caSrc.match(/const SAMPLE=`([\s\S]*?)`/)[1]}\`;`)();
  const p = CA.parse(sample), r = CA.analyse(p.names, p.rows);
  near(r.alpha, 0.655, 5e-4, "Cronbach tool sample: alpha (QA reference, numpy)");
  [0.885, 0.792, 0.725, 0.796, -0.546].forEach((v, j) => near(r.items[j].citc, v, 5e-4, `Cronbach tool sample: CITC ${p.names[j]}`));
  [0.324, 0.413, 0.449, 0.398, 0.947].forEach((v, j) => near(r.items[j].aid, v, 5e-4, `Cronbach tool sample: alpha if ${p.names[j]} deleted`));
  { // SPSS "Scale Mean / Variance if Item Deleted" = mean and variance of the total without that item
    const rest = p.rows.map(row => row.reduce((s, x) => s + x, 0) - row[0]);
    near(r.items[0].smd, S.mean(rest), 1e-12, "scale mean if item deleted");
    near(r.items[0].svd, S.variance(rest), 1e-12, "scale variance if item deleted");
  }
  const sp = CA.parse("A B C\n3,5 4,0 4,5\n2,5 3,0 3,0\n4,0 4,5 5,0\n1,5 2,0 2,5\n");
  check(sp.k === 3 && sp.rows[0][0] === 3.5 && sp.sep === "khoảng trắng", `P1-11: space-separated decimal commas read as 3 columns (${sp.k}, ${sp.rows[0]})`);
  near(CA.analyse(sp.names, sp.rows).alpha, S.cronbach([[3.5, 2.5, 4, 1.5], [4, 3, 4.5, 2], [4.5, 3, 5, 2.5]]).alpha, 1e-12, "P1-11: …and give the alpha of those numbers instead of −4,7");
  const rowsTxt = Array.from({ length: 10 }, (_, i) => `${i + 1}\t0${1 + (i % 9)}/10/2026\t${[4, 3, 5, 2, 4, 3, 5, 2, 4, 3][i]}\t${[4, 3, 4, 2, 5, 3, 5, 3, 4, 2][i]}\t${[5, 3, 4, 2, 4, 2, 5, 2, 4, 3][i]}`).join("\n");
  const idp = CA.parse(`STT\tThời gian\tX1\tX2\tX3\n${rowsTxt}`);
  check(idp.names.join() === "X1,X2,X3" && idp.removed.map(x => x.name).join() === "STT,Thời gian", `P1-11: STT and timestamp columns removed by name (${idp.removed.map(x => x.name + ": " + x.why).join("; ")})`);
  const noHead = CA.parse(rowsTxt.split("\n").map(l => l.split("\t").filter((_, j) => j !== 1).join("\t")).join("\n"));
  check(noHead.k === 3 && /số thứ tự/.test(noHead.removed[0]?.why || ""), "P1-11: an unnamed 1..n counter column is flagged and removed");
  check(Number.isNaN(CA.cellNum("01/01/2026")) && CA.cellNum("4 - Đồng ý") === 4 && CA.cellNum("3,5") === 3.5, "P1-11: a date is not the number 1; '4 - Đồng ý' is 4");
  const cst = CA.parse("A\tB\tC\n3\t4\t5\n3\t2\t4\n3\t5\t5\n3\t1\t2\n");
  check(CA.analyse(cst.names, cst.rows).constant.join() === "A", "P1-11: the zero-variance column is named");
  check(/câu đảo chiều chưa đảo điểm/.test(caSrc) && /tương quan biến–tổng âm/.test(caSrc), "P1-12: a negative item-total correlation suggests reverse coding");
}

if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); }
