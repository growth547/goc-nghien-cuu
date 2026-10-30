// Unit check for the analysis-method chooser (src/tools/chon-phuong-phap.html): its statistics block is
// the sample-size calculator's, its power numbers match Cohen (1992, Table 2) and G*Power, and every
// path through the questions ends in a complete recommendation whose links and references exist.
import { readFileSync, existsSync } from "node:fs";

const block = (src, tag) => {
  const m = src.match(new RegExp(`//#${tag}-start([\\s\\S]*?)//#${tag}-end`));
  if (!m) throw new Error(`missing //#${tag} block`);
  return m[1];
};
const norm = s => s.split(String.fromCharCode(13)).join("").trim();
const src = readFileSync("src/tools/chon-phuong-phap.html", "utf8");
const calcSrc = readFileSync("src/tools/tinh-co-mau.html", "utf8");
let failed = 0,
  passed = 0;
const check = (ok, label, quiet = false) => {
  if (!ok || !quiet) console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failed++;
  else passed++;
};
check(norm(block(src, "math")) === norm(block(calcSrc, "math")), "math block matches tinh-co-mau.html");
const api = new Function(`${block(src, "math")}${block(src, "advisor")} return { recommend, anovaN, pairedN, corrN, regN, isrN, REFS, CHI_N };`)();

// ---- power numbers ----
check(api.anovaN(2, 0.25, 0.05, 0.8) === 64, `t-test d = 0.5: 64 per group (Cohen 1992; G*Power 128 total) — got ${api.anovaN(2, 0.25, 0.05, 0.8)}`);
for (const [k, cohen] of [[3, 52], [4, 45], [5, 39]]) {
  const n = api.anovaN(k, 0.25, 0.05, 0.8);
  check(Math.abs(n - cohen) <= 1, `ANOVA ${k} groups f = 0.25: ${n} per group (Cohen 1992 table ${cohen})`);
}
check(api.pairedN(0.5, 0.05, 0.8) === 34, `paired t dz = 0.5: 34 pairs (G*Power) — got ${api.pairedN(0.5, 0.05, 0.8)}`);
check(api.corrN(0.3, 0.05, 0.8) === 85, `r = .30: 85 (Cohen 1992) — got ${api.corrN(0.3, 0.05, 0.8)}`);
for (const [m, cohen] of [[2, 67], [4, 84], [6, 97], [8, 107]]) {
  const n = api.regN(m, 0.15, 0.05, 0.8);
  check(Math.abs(n - cohen) <= 2, `regression ${m} predictors: ${n} (Cohen 1992 table ${cohen})`);
}
check(api.isrN(0.2, 0.05, 0.8) === 155, "inverse square root, p_min 0.20: 155");

// ---- every combination of answers gives a full recommendation ----
const OPTS = {
  compare: { out: ["cont", "ord", "nom"], groups: ["2", "3"], design: ["ind", "rep"], factors: ["1", "2"], normal: ["yes", "no"], df: ["1", "3", "6"], g: ["3", "5"] },
  relate: { pair: ["cc", "oo", "nn", "bc"], normal: ["yes", "no"] },
  predict: { dv: ["cont", "bin", "cat", "ord", "count"], chain: ["no", "yes"], k: ["1", "4", "12"], p: ["10", "50"] },
  model: { aim: ["predict", "confirm"], formative: ["no", "yes"], size: ["small", "large"], k: ["2", "6"] },
  scale: { origin: ["adapted", "new", "established"], items: ["10", "40"] },
  medmod: { mm: ["med", "mod", "both"], wtype: ["cont", "cat"], frame: ["reg", "sem"] },
  panel: { nt: ["nbig", "tbig"], dyn: ["no", "yes"] },
  describe: {},
};
const combos = o => Object.entries(o).reduce((acc, [k, vs]) => acc.flatMap(a => vs.map(v => ({ ...a, [k]: v }))), [{}]);
const routes = (src.match(/href="\$\{l\.href\}"/) ? [...src.matchAll(/L\('([^']+)'/g)].map(m => m[1]) : []);
const pageExists = r => {
  const p = r.replace(/\/$/, "");
  if (p.startsWith("posts/")) return existsSync(`src/content/posts/${p.slice(6)}.md`) || existsSync(`src/content/posts/${p.slice(6)}.mdx`);
  return existsSync(`src/pages/${p}.astro`) || existsSync(`src/pages/${p}/index.astro`);
};
for (const r of routes) check(pageExists(r), `link target exists: /${r}`);
let n = 0;
const names = new Set();
for (const [goal, o] of Object.entries(OPTS))
  for (const c of combos(o)) {
    const a = { goal, ...c }, r = api.recommend(a);
    n++;
    const where = JSON.stringify(a);
    check(r && r.main && r.main.name, `${where}: has a recommendation`, true);
    if (!r) continue;
    names.add(r.main.name);
    const m = r.main;
    check(m.why.length && m.assume.length && m.sample.length && m.report.length, `${where}: why, assumptions, sample, reporting all filled (${m.name})`, true);
    check(m.refs.length && m.refs.every(k => api.REFS[k]), `${where}: references exist (${m.refs})`, true);
    check(m.sample.every(s => !/NaN|undefined|Infinity/.test(s)) && m.why.concat(m.assume, m.report).every(s => !/undefined/.test(s)), `${where}: no NaN/undefined in text`, true);
  }
check(true, `${n} answer combinations checked, ${names.size} distinct recommendations`);

// ---- spot checks of the decision rules ----
const R = a => api.recommend(a).main.name;
check(/Welch/.test(R({ goal: "compare", out: "cont", groups: "2", design: "ind", normal: "yes" })), "2 independent groups, continuous: Welch t-test");
check(/Mann–Whitney/.test(R({ goal: "compare", out: "ord", groups: "2", design: "ind" })), "2 groups, single Likert item: Mann–Whitney");
check(/ANOVA một yếu tố/.test(R({ goal: "compare", out: "cont", groups: "3", design: "ind", factors: "1", normal: "yes", g: "4" })), "3+ groups: one-way ANOVA");
check(/Kruskal/.test(R({ goal: "compare", out: "cont", groups: "3", design: "ind", normal: "no" })), "3+ groups, not normal: Kruskal–Wallis");
check(/Wilcoxon/.test(R({ goal: "compare", out: "ord", groups: "2", design: "rep" })), "paired ordinal: Wilcoxon");
check(/chi bình phương/.test(R({ goal: "compare", out: "nom", groups: "2", design: "ind", df: "2" })) && /107/.test(api.recommend({ goal: "compare", out: "nom", design: "ind", df: "2" }).main.sample[0]), "nominal: chi-square, df 2 → 107");
check(/Spearman/.test(R({ goal: "relate", pair: "oo" })) && /Pearson/.test(R({ goal: "relate", pair: "cc", normal: "yes" })), "correlation: Spearman for ordinal, Pearson otherwise");
check(/logistic nhị phân/.test(R({ goal: "predict", dv: "bin", chain: "no", k: "5", p: "25" })) && /= 200 quan sát/.test(api.recommend({ goal: "predict", dv: "bin", chain: "no", k: "5", p: "25" }).main.sample[0]), "binary DV: logistic, 10 × 5 / 0.25 = 200 (Peduzzi)");
check(/OLS/.test(R({ goal: "predict", dv: "cont", chain: "no", k: "4" })) && /^85 quan sát theo G\*Power/.test(api.recommend({ goal: "predict", dv: "cont", chain: "no", k: "4" }).main.sample[0]), "regression, 4 predictors: 85 by G*Power (Cohen 1992 table: 84)");
check(/PLS-SEM/.test(R({ goal: "predict", dv: "cont", chain: "yes", aim: "predict" })), "a chain of constructs goes to SEM");
check(/PLS-SEM/.test(R({ goal: "model", aim: "predict", formative: "no", size: "small", k: "3" })) && /CB-SEM/.test(R({ goal: "model", aim: "confirm", formative: "no", size: "large" })) && /PLS-SEM/.test(R({ goal: "model", aim: "confirm", formative: "yes", size: "large" })), "PLS-SEM vs CB-SEM by aim and formative constructs");
check(/155/.test(api.recommend({ goal: "model", aim: "predict", k: "3" }).main.sample[0]), "PLS-SEM sample is the kit's rule (155 for 3 arrows)");
check(/EFA/.test(R({ goal: "scale", origin: "adapted", items: "24" })) && /= 120; nên đạt .* = 240/.test(api.recommend({ goal: "scale", origin: "adapted", items: "24" }).main.sample[0]) && /CFA/.test(R({ goal: "scale", origin: "established" })), "scales: EFA 5:1 = 120, 10:1 = 240; CFA for established scales");
check(/PROCESS \(Model 4\)/.test(R({ goal: "medmod", mm: "med", frame: "reg" })) && /78 .*162 .*558/.test(api.recommend({ goal: "medmod", mm: "med" }).main.sample[0]), "mediation: bootstrap, Fritz & MacKinnon 78 / 162 / 558");
check(/MGA/.test(R({ goal: "medmod", mm: "mod", wtype: "cat", frame: "sem" })), "categorical moderator in SEM: multi-group analysis");
check(/FEM, REM/.test(R({ goal: "panel", nt: "nbig", dyn: "no" })) && /GMM/.test(R({ goal: "panel", dyn: "yes" })), "panel: FEM/REM with Hausman; GMM when dynamic");
check(api.recommend({ goal: "nothing" }) === null, "unknown goal: no recommendation");

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
