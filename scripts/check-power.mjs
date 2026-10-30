// Checks the sample-size math embedded in src/tools/tinh-co-mau.html against
// published reference values. Run: node scripts/check-power.mjs
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../src/tools/tinh-co-mau.html", import.meta.url), "utf8");
const math = html.split("//#math-start")[1].split("//#math-end")[0];
const { regN, isrN } = new Function(`${math}; return { regN, isrN };`)();
const cases = [
  ["G*Power: f²=.15, 5 predictors, α=.05, power=.80", regN(5, 0.15, 0.05, 0.8), 92],
  ["G*Power: f²=.15, 2 predictors, α=.05, power=.80", regN(2, 0.15, 0.05, 0.8), 68],
  ["G*Power: f²=.15, 3 predictors, α=.05, power=.95", regN(3, 0.15, 0.05, 0.95), 119],
  ["Kock & Hadaya: p_min=.20, α=.05, power=.80", isrN(0.2, 0.05, 0.8), 155],
  ["Kock & Hadaya: p_min=.11, α=.05, power=.80", isrN(0.11, 0.05, 0.8), 511],
];
let bad = 0;
for (const [name, got, want] of cases) {
  const ok = got === want; if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${got} (expected ${want})`);
}
const check = (ok, label) => { console.log(`${ok ? "ok  " : "FAIL"} ${label}`); if (!ok) bad++; };

// Kock & Hadaya options follow the Hair et al. (2022) table (each p_min range is computed at its upper bound),
// and the default matches the help text.
const { isrN: isr } = new Function(`${math}; return { isrN };`)();
const opts = [...html.match(/<select id="ss-pmin">([\s\S]*?)<\/select>/)[1].matchAll(/<option value="([\d.]+)"( selected)?>/g)].map(m => [+m[1], Boolean(m[2])]);
const table = { 0.1: 619, 0.2: 155, 0.3: 69, 0.4: 39 };
for (const [v, n] of Object.entries(table)) check(opts.some(o => o[0] === +v) && isr(+v, 0.05, 0.8) === n, `p_min option ${v} gives ${n} as in Hair et al. (2022)`);
check(opts.filter(o => o[1]).map(o => o[0]).join() === "0.2" && /giữ 0,20/.test(html), "p_min default is 0,20, as the help text says");
check(opts.map(o => o[0]).join() === [...opts.map(o => o[0])].sort((a, b) => a - b).join(), "p_min options in ascending order");

// ---- the page itself, run against a tiny DOM: panel and chapter-3 paragraph must agree ----
function fakeDom(markup) {
  const els = {}, dataFor = [], formHandlers = {};
  const attrs = s => Object.fromEntries([...s.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map(m => [m[1], m[2] ?? true]));
  const mk = (tag, a) => ({
    tagName: tag.toUpperCase(), type: a.type || "", id: a.id, hidden: false, innerHTML: "", textContent: "", value: a.value ?? "", checked: Boolean(a.checked),
    dataset: Object.fromEntries(Object.entries(a).filter(([k]) => k.startsWith("data-")).map(([k, v]) => [k.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase()), v])),
    addEventListener(ev, fn) { if (a.id === "ss-form") formHandlers[ev] = fn; },
  });
  for (const m of markup.matchAll(/<(input|select|textarea|div|button|label|span|form|small)\b([^>]*)>/g)) {
    const a = attrs(m[2]), el = mk(m[1], a);
    if (m[1] === "select") {
      const body = markup.slice(m.index).match(/<select[^>]*>([\s\S]*?)<\/select>/)[1];
      const os = [...body.matchAll(/<option value="([^"]*)"( selected)?/g)];
      el.value = (os.find(o => o[2]) || os[0])[1];
    }
    if (a.id) els[a.id] = el;
    if (a["data-for"]) dataFor.push(el);
  }
  const doc = {
    getElementById: id => els[id],
    querySelectorAll: () => dataFor,
    querySelector: () => ({ dataset: { labelPls: "Số mũi tên", labelReg: "Số biến độc lập", labelMod: "Tổng số biến dự báo" }, textContent: "" }),
  };
  return { els, doc, fire: () => formHandlers.change() };
}
const page = fakeDom(html);
new Function("document", "navigator", "getSelection", html.split("<script>")[1].split("</script>")[0])(page.doc, {}, () => ({}));
const E = page.els, txt = id => E[id].innerHTML.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const set = (vals, strict = false) => { for (const [k, v] of Object.entries(vals)) E[k].value = String(v); E["ss-strict"].checked = strict; page.fire(); };

set({ "ss-method": "pls", "ss-m": 5 });
check(/Cỡ mẫu tối thiểu 92 /.test(txt("ss-out")) && /power = 0,80/.test(txt("ss-out")) && /α = 0,05/.test(txt("ss-out")), "PLS default: 92, power 0,80, α 0,05 in the panel");
check(/α = 0,05 và power thống kê 0,80/.test(txt("ss-thesis")), "PLS paragraph uses the same α and power format");
set({ "ss-method": "pls", "ss-m": 5, "ss-pmin": "0.2", "ss-drop": 15 }, true);
check(/Cỡ mẫu tối thiểu 155 /.test(txt("ss-out")) && /tối thiểu là 155 quan sát/.test(txt("ss-thesis")) && /phát ra là 183 phiếu/.test(txt("ss-thesis")), "PLS + Kock & Hadaya: panel and paragraph both 155, 183 to send");
set({ "ss-method": "efa", "ss-items": 5 }, true);
check(/Cỡ mẫu tối thiểu 100 /.test(txt("ss-out")) && /max\(100; 10 × 5\) = 100 quan sát/.test(txt("ss-thesis")) && !/10 × 5 = 100/.test(txt("ss-thesis")), "P1-2: EFA 5 items with 10:1 reads max(100; 10 × 5) = 100 in panel and paragraph");
set({ "ss-method": "efa", "ss-items": 30 }, false);
check(/Cỡ mẫu tối thiểu 150 /.test(txt("ss-out")) && /= 150 quan sát/.test(txt("ss-thesis")), "EFA 30 items without 10:1: 150 in both places");
for (const bad of ["0", "", "2.5", "41"]) {
  set({ "ss-method": "reg", "ss-m": bad });
  check(/class="err"/.test(E["ss-out"].innerHTML) && !/quan sát/.test(txt("ss-thesis")), `P1-3/P1-4: m = "${bad}" shows an error and clears the paragraph`);
}
set({ "ss-method": "prop", "ss-e": 5, "ss-p": 50, "ss-N": "" });
check(/1,96²·0,5·0,5\/0,05² = 384,16/.test(txt("ss-out")) && /Cỡ mẫu tối thiểu 385 /.test(txt("ss-out")), "Cochran working reads 1,96²·0,5·0,5/0,05² = 384,16 → 385");
set({ "ss-method": "prop", "ss-e": 0.05, "ss-p": 50, "ss-N": "" });
check(/nhập 5, không nhập 0,05/.test(txt("ss-out")) && /tỷ/.test(txt("ss-out")), "e = 0,05 warns about percent input; cost shown in tỷ");
const t0 = performance.now();
set({ "ss-method": "reg", "ss-m": 40, "ss-alpha": "0.01", "ss-power": "0.95", "ss-f2": "0.02" });
check(performance.now() - t0 < 1500, `P1-16: m = 40, f² = 0,02, α 1%, power .95 renders in ${(performance.now() - t0).toFixed(0)} ms`);

// ---- methods outside the shared block (//#page-stats), against G*Power 3.1 and published tables ----
const pageStats = html.split("//#page-stats-start")[1].split("//#page-stats-end")[0];
const S = new Function(`${math}${pageStats}; return { incN, tN, anovaN, chiN, rmseaN, corrN, chi2cdf, ncx2cdf, hairTier, FM };`)();
const eq = (got, want, label) => check(got === want, `${label}: ${got} (expected ${want})`);
eq(S.incN(3, 3, 0.15, 0.05, 0.8), regN(3, 0.15, 0.05, 0.8), "R² increase with all predictors tested = R² deviation from zero (m = 3)");
eq(S.incN(5, 5, 0.02, 0.05, 0.8), regN(5, 0.02, 0.05, 0.8), "R² increase with all predictors tested = R² deviation from zero (m = 5, f² = .02)");
eq(S.incN(1, 3, 0.02, 0.05, 0.8), 395, "G*Power R² increase: 1 tested of 3, f² = .02");
eq(S.incN(1, 3, 0.15, 0.05, 0.8), 55, "G*Power R² increase: 1 tested of 3, f² = .15");
eq(S.tN(0.5, 0.05, 0.8), 64, "G*Power t-test independent, d = .5: n per group");
eq(S.tN(0.2, 0.05, 0.8), 394, "G*Power t-test independent, d = .2: n per group");
eq(S.tN(0.8, 0.05, 0.8), 26, "G*Power t-test independent, d = .8: n per group");
eq(S.tN(0.5, 0.05, 0.95), 105, "G*Power t-test independent, d = .5, power .95: n per group");
eq(S.tN(0.5, 0.05, 0.8, true), 34, "G*Power t-test paired, dz = .5: pairs");
for (const [k, want] of [[3, 159], [4, 180], [5, 200]]) eq(Math.ceil(S.anovaN(k, 0.25, 0.05, 0.8) / k) * k, want, `G*Power ANOVA f = .25, ${k} groups: total N in equal groups`);
for (const [w, df, want] of [[0.3, 1, 88], [0.3, 2, 108], [0.3, 4, 133], [0.5, 1, 32]]) eq(S.chiN(w, df, 0.05, 0.8), want, `G*Power χ² w = ${w}, df = ${df}`);
check(Math.abs(S.chi2cdf(3.841459, 1) - 0.95) < 1e-6 && Math.abs(S.chi2cdf(18.307038, 10) - 0.95) < 1e-6, "χ² CDF: 3,841 (df 1) and 18,307 (df 10) at 0,95");
check(Math.abs(S.ncx2cdf(5, 3, 0) - S.chi2cdf(5, 3)) < 1e-12, "noncentral χ² with λ = 0 is the central χ²");
// MacCallum, Browne & Sugawara (1996), Table 4 (test of close fit, α = .05, power = .80).
for (const [df, want] of [[10, 782], [40, 252], [100, 132]]) eq(S.rmseaN(df, 0.05, 0.8), want, `MacCallum et al. (1996) close fit, df = ${df}`);
for (const [df, want] of [[2, 3488], [4, 1807], [20, 435]]) { const got = S.rmseaN(df, 0.05, 0.8); check(Math.abs(got - want) / want < 0.005, `MacCallum et al. (1996) close fit, df = ${df}: ${got} within 0,5% of ${want}`); }
for (const [r, want] of [[0.1, 783], [0.3, 85], [0.5, 30]]) eq(S.corrN(r, 0.05, 0.8), want, `Fisher z, r = ${r} (G*Power exact gives at most 1 fewer)`);
// Fritz & MacKinnon (2007) Table 3: index 4·a + b over S, H, M, L.
eq(S.FM.perc[5], 162, "Fritz & MacKinnon percentile bootstrap HH"); eq(S.FM.bc[0], 462, "Fritz & MacKinnon bias-corrected SS"); eq(S.FM.joint[15], 36, "Fritz & MacKinnon joint significance LL"); eq(S.FM.sobel[10], 90, "Fritz & MacKinnon Sobel MM");
check(Object.values(S.FM).every(r => r.length === 16), "Fritz & MacKinnon rows have 16 conditions");
// Hair et al. (2010) SEM minimums.
for (const [k, mi, c, want] of [[5, 4, "high", 100], [5, 3, "high", 150], [7, 3, "mid", 150], [6, 4, "low", 300], [6, 2, "mid", 300], [8, 4, "high", 500]]) eq(S.hairTier(k, mi, c), want, `Hair et al. (2010) tier: ${k} constructs, min ${mi} items, communality ${c}`);

// ---- every method in the page: panel and paragraph agree, nothing undefined ----
const num0 = () => +(txt("ss-out").match(/Cỡ mẫu tối thiểu ([\d.]+) /) || [])[1]?.replace(/\./g, "");
const methods = [...html.match(/<select id="ss-method">([\s\S]*?)<\/select>/)[1].matchAll(/<option value="(\w+)"/g)].map(m => m[1]);
const reset = { "ss-m": 5, "ss-f2": "0.15", "ss-alpha": "0.05", "ss-power": "0.8", "ss-items": 25, "ss-k": 5, "ss-minitems": 4, "ss-sdf": "", "ss-groups": 1, "ss-N": "", "ss-e": 5, "ss-p": 50, "ss-drop": 15, "ss-tested": 1, "ss-g": 3, "ss-cdf": 1 };
check(methods.length === 11, `11 methods offered (${methods.join(", ")})`);
for (const mth of methods) for (const strict of [false, true]) {
  set({ ...reset, "ss-method": mth }, strict);
  const n = num0(), th = txt("ss-thesis");
  check(Number.isFinite(n) && n > 0 && !/undefined|NaN/.test(txt("ss-out") + th) && th.includes(`${n.toLocaleString("vi-VN")} quan sát`) && /Tài liệu tham khảo/.test(th), `${mth}${strict ? " + cross-check" : ""}: panel ${n} appears in the paragraph, no undefined`);
  const cites = [...th.matchAll(/\(([A-Z][\w]+)(?: và [A-Z]\w+| và cộng sự)?, (\d{4})\)|([A-Z]\w+)(?: và [A-Z]\w+| và cộng sự)? \((\d{4})\)/g)].map(m => [m[1] || m[3], m[2] || m[4]]);
  const listed = E["ss-thesis"].innerHTML.split("Tài liệu tham khảo")[1];
  const missing = cites.filter(([a, y]) => !new RegExp(`<li>${a},[^<]*\\(${y}\\)`).test(listed));
  check(!missing.length, `${mth}${strict ? " + cross-check" : ""}: every in-text citation is in the reference list${missing.length ? ` (missing ${missing.map(m => m.join(" ")).join(", ")})` : ""}`);
}
for (const mth of ["med", "ttest", "anova", "chi", "corr"]) { set({ ...reset, "ss-method": mth }); check(E["ss-strict-row"].hidden, `${mth}: the cross-check box is hidden (no second criterion)`); }
set({ ...reset, "ss-method": "pls" });
check(!E["ss-strict-row"].hidden && /cần 155 quan sát, nhiều hơn 92/.test(txt("ss-out")), "PLS without cross-check warns that the inverse square root needs 155 > 92");
set({ ...reset, "ss-method": "pls", "ss-groups": 2 });
check(num0() === 184 && /2 × 92 = 184 quan sát/.test(txt("ss-thesis")) && /phát ra là 217 phiếu/.test(txt("ss-thesis")) && /Matthews, L\. \(2017\)/.test(E["ss-thesis"].innerHTML), "MGA 2 groups: 2 × 92 = 184, 217 to send, Matthews (2017) listed");
set({ ...reset, "ss-method": "pls", "ss-groups": 2 }, true);
check(num0() === 310 && /2 × 155 = 310/.test(txt("ss-thesis")), "MGA 2 groups with inverse square root: 2 × 155 = 310");
set({ ...reset, "ss-method": "cbsem" });
check(num0() === 150 && /df = 265/.test(txt("ss-out")) && /Hair và cộng sự \(2010\)/.test(txt("ss-thesis")), "CB-SEM default (5 constructs, 25 items, communality 0,5): 150, CFA df = 265");
set({ ...reset, "ss-method": "cbsem", "ss-sdf": 10 }, true);
check(num0() === 782 && /bậc tự do df = 10/.test(txt("ss-thesis")) && /MacCallum/.test(txt("ss-thesis")), "CB-SEM with df 10 and RMSEA power: 782 in panel and paragraph");
set({ ...reset, "ss-method": "cbsem", "ss-k": 7, "ss-minitems": 4 });
check(/class="err"/.test(E["ss-out"].innerHTML), "CB-SEM: 7 constructs × 4 items > 25 items is an error");
set({ ...reset, "ss-method": "mod" });
check(num0() === S.incN(1, 5, 0.02, 0.05, 0.8) && /Aguinis/.test(txt("ss-thesis")) && /R² increase/.test(txt("ss-thesis")), `Moderation default: ${num0()} = G*Power R² increase, 1 of 5, f² = .02, Aguinis cited`);
set({ ...reset, "ss-method": "mod", "ss-tested": 6 });
check(/class="err"/.test(E["ss-out"].innerHTML), "Moderation: more interaction terms than predictors is an error");
set({ ...reset, "ss-method": "med" });
check(num0() === 162 && /0,26/.test(txt("ss-thesis")) && /Fritz/.test(txt("ss-thesis")), "Mediation default HH percentile bootstrap: 162");
set({ ...reset, "ss-method": "ttest" });
check(num0() === 128 && /64 quan sát mỗi nhóm/.test(txt("ss-thesis")) && /mức trung bình/.test(txt("ss-thesis")), "t-test default: 64 per group, 128 total, d = 0,5 named medium");
set({ ...reset, "ss-method": "anova", "ss-g": 4 });
check(num0() === 180 && /45 quan sát mỗi nhóm/.test(txt("ss-thesis")), "ANOVA 4 groups: 45 per group, 180 total");
set({ ...reset, "ss-method": "corr", "ss-r": "0.5" });
check(num0() === 30 && /r = 0,5 \(mức lớn/.test(txt("ss-thesis")), "Correlation r = 0,5 is named large (not medium as d = 0,5)");
for (const [N, want] of [[100, 80], [1000, 278], [2000, 322], [10000, 370]]) {
  set({ ...reset, "ss-method": "prop", "ss-N": N });
  check(new RegExp(`Krejcie & Morgan \\(1970\\): ${want.toLocaleString("vi-VN")}`).test(txt("ss-out")), `Krejcie & Morgan table: N = ${N} → ${want}`);
}
set({ ...reset, "ss-method": "prop", "ss-N": 2000 });
check(num0() === 323 && /hiệu chỉnh tổng thể hữu hạn giảm cỡ mẫu đáng kể/.test(txt("ss-out")), "Cochran N = 2.000: 323 and the FPC note says it matters");
set({ ...reset, "ss-method": "prop", "ss-N": 1000000 });
check(/hầu như không đổi/.test(txt("ss-out")), "Cochran N = 1.000.000: FPC note says it barely changes n");
set({ ...reset, "ss-method": "prop", "ss-N": -5 });
check(/class="err"/.test(E["ss-out"].innerHTML), "Cochran: negative N is an error, not silently ignored");
set({ ...reset, "ss-method": "prop", "ss-p": 0.5 });
check(/nhập 50/.test(txt("ss-out")), "Cochran: p = 0,5 warns that p is in percent");
const t1 = performance.now();
set({ ...reset, "ss-method": "cbsem", "ss-sdf": 1, "ss-alpha": "0.01", "ss-power": "0.95" }, true);
set({ ...reset, "ss-method": "cbsem", "ss-items": 120, "ss-k": 12 }, true);
check(performance.now() - t1 < 3000, `CB-SEM extremes (df 1, α 1%, power .95; 120 items) render in ${(performance.now() - t1).toFixed(0)} ms`);

process.exit(bad ? 1 : 0);
