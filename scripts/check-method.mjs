// Unit check for the analysis-method chooser (src/tools/chon-phuong-phap.html): its statistics block is
// the sample-size calculator's, its power numbers match Cohen (1992, Table 2) and G*Power, every path
// through the questions ends in a complete recommendation whose links and references exist, every
// author–year citation in the text has its reference, every DOI reference matches Crossref metadata
// (saved in scripts/fixtures/method-refs-crossref.json), and 20+ typical thesis designs get the right method.
import { readFileSync, existsSync } from "node:fs";

const block = (src, tag) => {
  const m = src.match(new RegExp(`//#${tag}-start([\\s\\S]*?)//#${tag}-end`));
  if (!m) throw new Error(`missing //#${tag} block`);
  return m[1];
};
const norm = s => s.split(String.fromCharCode(13)).join("").trim();
const src = readFileSync("src/tools/chon-phuong-phap.html", "utf8");
const calcSrc = readFileSync("src/tools/tinh-co-mau.html", "utf8");
const fx = JSON.parse(readFileSync("scripts/fixtures/method-refs-crossref.json", "utf8"));
let failed = 0,
  passed = 0;
const check = (ok, label, quiet = false) => {
  if (!ok || !quiet) console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failed++;
  else passed++;
};
check(!/goc-nghien-cuu/.test(block(src, "advisor")), "advisor links carry no hard-coded base path");
check(norm(block(src, "math")) === norm(block(calcSrc, "math")), "math block matches tinh-co-mau.html");
const api = new Function(`${block(src, "math")}${block(src, "advisor")} return { recommend, anovaN, pairedN, corrN, regN, isrN, factN, finv, ncfcdf, REFS, CHI_N, T };`)();

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
check(api.factN(1, 4, 0.25, 0.05, 0.8) === 128, `2 × 2 ANOVA interaction f = 0.25: 128 total (G*Power) — got ${api.factN(1, 4, 0.25, 0.05, 0.8)}`);
// Cohen (1992) Table 2 chi-square row (w = .30) against the noncentral chi-square, as F(df, ∞)
for (let df = 1; df <= 6; df++) {
  const d2 = 1e7, crit = api.finv(0.95, df, d2);
  let n = 2;
  while (1 - api.ncfcdf(crit, df, d2, 0.09 * n) < 0.8) n++;
  check(Math.abs(n - api.CHI_N[df]) <= 1, `chi-square df ${df}, w = .30: table ${api.CHI_N[df]}, exact ${n}`);
}

// ---- the form's questions and the advisor's answers agree ----
const radios = {};
for (const m of src.matchAll(/name="([a-z]+)" value="([^"]+)"/g)) (radios[m[1]] ||= []).push(m[2]);
const NAMES = JSON.parse(src.match(/const NAMES=(\[[^\]]+\])/)[1].replace(/'/g, '"'));
check(Object.keys(radios).every(n => NAMES.includes(n)) && NAMES.every(n => radios[n]), `every radio group is read back and restored from the URL (${NAMES.length} groups)`);
const OPTS = {
  compare: { out: ["cont", "ord", "nom"], groups: ["2", "3"], design: ["ind", "rep"], factors: ["1", "2"], normal: ["yes", "no"], df: ["1", "3", "6"], g: ["3", "5"] },
  relate: { pair: ["cc", "oo", "nn", "bc"], normal: ["yes", "no"] },
  predict: { dv: ["cont", "bin", "cat", "ord", "count"], chain: ["no", "yes"], k: ["1", "4", "12"], p: ["10", "50"] },
  model: { aim: ["predict", "confirm"], formative: ["no", "yes"], size: ["small", "large"], k: ["2", "6"] },
  scale: { origin: ["adapted", "new", "established"], items: ["10", "40"] },
  medmod: { mm: ["med", "mod", "both"], wtype: ["cont", "cat"], frame: ["reg", "sem"] },
  experiment: { xdesign: ["post", "prepost", "factorial", "within"], xout: ["cont", "ord", "bin"], xk: ["2", "3"], normal: ["yes", "no"], g: ["3", "4"] },
  panel: { unit: ["firm", "bank", "macro"], nt: ["nbig", "tbig"], dyn: ["no", "yes"] },
  ts: { tsaim: ["single", "system"], integ: ["unknown", "i0", "i1", "mix", "i2"] },
  policy: { ptype: ["did", "stock", "its"], timing: ["same", "stagger"] },
  qual: { qtype: ["qual", "explor", "explan"] },
  describe: {},
};
check(JSON.stringify(Object.keys(OPTS).sort()) === JSON.stringify([...radios.goal].sort()), `every goal on the form is tested (${radios.goal.join(", ")})`);
for (const [goal, o] of Object.entries(OPTS))
  for (const [k, vs] of Object.entries(o))
    if (radios[k]) check(JSON.stringify([...vs].sort()) === JSON.stringify([...radios[k]].sort()), `${goal}: every option of “${k}” is tested`, true);
// data-for tokens must be ones show() can produce
const tokens = new Set([...src.slice(0, src.indexOf("<script>")).matchAll(/data-for="([^"]+)"/g)].flatMap(m => m[1].split(" ")));
const made = new Set(radios.goal);
for (const v of radios.out) made.add("compare:" + v);
["compare:3", "compare:ind", "experiment:cont", "experiment:3"].forEach(t => made.add(t));
for (const v of radios.pair) made.add("relate:" + v);
for (const v of radios.dv) made.add("predict:" + v);
for (const v of radios.mm) made.add("medmod:" + v);
for (const v of radios.xdesign) made.add("experiment:" + v);
for (const v of radios.ptype) made.add("policy:" + v);
const showSrc = src.slice(src.indexOf("function show(a)"), src.indexOf("const li="));
for (const t of made) if (t.includes(":")) check(showSrc.includes(`'${t.split(":")[0]}:'`) || showSrc.includes(`'${t}'`), `show() can produce tag ${t}`, true);
for (const t of tokens) check(made.has(t), `data-for token “${t}” is produced by show()`);

// ---- link targets exist (source files) ----
const routes = [...block(src, "advisor").matchAll(/L\('([^']+)'/g)].map(m => m[1]);
const pageExists = r => {
  const p = r.replace(/\/$/, "");
  const [sec, slug] = [p.split("/")[0], p.split("/").slice(1).join("/")];
  if (sec === "posts") return existsSync(`src/content/posts/${slug}.md`) || existsSync(`src/content/posts/${slug}.mdx`);
  if (slug && sec === "bien-nghien-cuu") return existsSync(`src/content/bien-nghien-cuu/${slug}.json`);
  if (slug && sec === "du-lieu" && existsSync(`src/content/du-lieu/${slug}.json`)) return true;
  return existsSync(`src/pages/${p}.astro`) || existsSync(`src/pages/${p}/index.astro`);
};
for (const r of routes) check(pageExists(r), `link target exists: /${r}`);

// ---- references match Crossref ----
const plain = s => s.replace(/<[^>]+>/g, "");
for (const [key, ref] of Object.entries(api.REFS)) {
  const doi = (ref.match(/https:\/\/doi\.org\/(\S+)$/) || [])[1];
  if (!doi) continue;
  const f = fx[doi];
  if (!f) {
    check(false, `${key}: DOI ${doi} has Crossref metadata in the fixture`);
    continue;
  }
  const t = plain(ref), fam = f.family.split(" ").pop().toLowerCase();
  const first = (f.page || "").split("-")[0];
  const ok = t.toLowerCase().startsWith(f.family.toLowerCase()) || t.toLowerCase().includes(fam);
  check(ok && (!f.printed || t.includes(`(${f.year})`)) && (!f.volume || t.includes(`${f.volume}`)) && (!first || t.includes(first)), `${key}: author, year, volume, first page match Crossref (${f.family} ${f.year}, ${f.volume ?? "–"}, ${first || "–"})`);
}

// ---- every combination of answers gives a full recommendation ----
const combos = o => Object.entries(o).reduce((acc, [k, vs]) => acc.flatMap(a => vs.map(v => ({ ...a, [k]: v }))), [{}]);
const CITE = /(\p{Lu}[\p{L}’'-]+)(?: và cộng sự)?(?:,| \(| và \p{Lu}[\p{L}’'-]+,| & \p{Lu}[\p{L}’'-]+,| & \p{Lu}[\p{L}’'-]+ \(| và \p{Lu}[\p{L}’'-]+ \() ?(\d{4})\b/gu;
let n = 0;
const names = new Set(), linked = new Set(), refsUsed = new Set();
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
    check(m.links.length >= 2 && m.links.every(l => l && l.href.startsWith("/") && routes.includes(l.href.slice(1))), `${where}: at least two links to site pages (${m.name})`, true);
    m.links.forEach(l => linked.add(l.href));
    const refs = [...new Set([m, ...r.alts].flatMap(x => x.refs))];
    refs.forEach(k => refsUsed.add(k));
    check(m.refs.length && refs.every(k => api.REFS[k]), `${where}: references exist (${refs})`, true);
    const text = [m.name, ...m.why, ...m.assume, ...m.sample, ...m.report, ...r.alts.flatMap(x => [x.name, ...x.why])].join(" ");
    check(!/NaN|undefined|Infinity/.test(text), `${where}: no NaN/undefined in text`, true);
    for (const [, who, year] of text.matchAll(CITE)) {
      const hit = refs.some(k => plain(api.REFS[k]).includes(who) && api.REFS[k].includes(`(${year})`));
      check(hit, `${where}: citation ${who} (${year}) has its reference in the list`, true);
    }
    // the textbook (Field, 2018) backs the routine checks; every other reference of the main method is cited
    for (const k of m.refs.filter(k => k !== "field")) {
      const fam = plain(api.REFS[k]).split(",")[0].split(" ").pop();
      check(text.includes(fam), `${where}: reference ${k} is cited in the text`, true);
    }
  }
check(true, `${n} answer combinations checked, ${names.size} distinct recommendations, ${linked.size} distinct site links`);
check(Object.keys(api.REFS).every(k => refsUsed.has(k)), `every reference is used by some recommendation (unused: ${Object.keys(api.REFS).filter(k => !refsUsed.has(k))})`);

// ---- typical Vietnamese thesis designs ----
const rec = a => api.recommend(a);
const R = a => rec(a).main.name;
const has = (a, re) => re.test(JSON.stringify(rec(a)));
const scen = (label, ok) => check(ok, `thesis: ${label}`);
scen("2 independent groups, continuous: Welch t-test", /Welch/.test(R({ goal: "compare", out: "cont", groups: "2", design: "ind", normal: "yes" })));
scen("2 groups, single Likert item: Mann–Whitney", /Mann–Whitney/.test(R({ goal: "compare", out: "ord", groups: "2", design: "ind" })));
scen("satisfaction by 4 income groups: one-way ANOVA, 45 per group", /ANOVA một yếu tố/.test(R({ goal: "compare", out: "cont", groups: "3", design: "ind", factors: "1", normal: "yes", g: "4" })) && /45 quan sát mỗi nhóm/.test(rec({ goal: "compare", out: "cont", groups: "3", design: "ind", factors: "1", normal: "yes", g: "4" }).main.sample[0]));
scen("3+ groups, not normal: Kruskal–Wallis", /Kruskal/.test(R({ goal: "compare", out: "cont", groups: "3", design: "ind", normal: "no" })));
scen("gender × region (2 × 2): two-way ANOVA, 128 for the interaction", /ANOVA hai nhân tố \(2 × 2\)/.test(R({ goal: "compare", out: "cont", groups: "2", design: "ind", factors: "2", normal: "yes" })) && /^128 /.test(rec({ goal: "compare", out: "cont", groups: "2", design: "ind", factors: "2", normal: "yes" }).main.sample[0]));
scen("two factors, single Likert item: ordinal logistic, ART as alternative", /logistic thứ bậc/.test(R({ goal: "compare", out: "ord", groups: "2", design: "ind", factors: "2" })) && has({ goal: "compare", out: "ord", groups: "2", design: "ind", factors: "2" }, /Aligned Rank/));
scen("paired ordinal: Wilcoxon", /Wilcoxon/.test(R({ goal: "compare", out: "ord", groups: "2", design: "rep" })));
scen("nominal: chi-square, df 2 → 107", /chi bình phương/.test(R({ goal: "compare", out: "nom", groups: "2", design: "ind", df: "2" })) && /107/.test(rec({ goal: "compare", out: "nom", design: "ind", df: "2" }).main.sample[0]));
scen("correlation: Spearman for ordinal, Pearson otherwise", /Spearman/.test(R({ goal: "relate", pair: "oo" })) && /Pearson/.test(R({ goal: "relate", pair: "cc", normal: "yes" })));
scen("purchase yes/no: binary logistic, 10 × 5 / 0.25 = 200 (Peduzzi)", /logistic nhị phân/.test(R({ goal: "predict", dv: "bin", chain: "no", k: "5", p: "25" })) && /= 200 quan sát/.test(rec({ goal: "predict", dv: "bin", chain: "no", k: "5", p: "25" }).main.sample[0]));
scen("count outcome: Poisson or negative binomial, Cameron & Trivedi cited", /Poisson/.test(R({ goal: "predict", dv: "count", chain: "no" })) && has({ goal: "predict", dv: "count", chain: "no" }, /zero-inflated/));
scen("regression, 4 predictors: 85 by G*Power (Cohen 1992 table: 84)", /OLS/.test(R({ goal: "predict", dv: "cont", chain: "no", k: "4" })) && /^85 quan sát theo G\*Power/.test(rec({ goal: "predict", dv: "cont", chain: "no", k: "4" }).main.sample[0]));
scen("a chain of constructs goes to SEM", /PLS-SEM/.test(R({ goal: "predict", dv: "cont", chain: "yes", aim: "predict" })));
scen("UTAUT extension: PLS-SEM; confirmatory with large sample: CB-SEM; formative: PLS-SEM", /PLS-SEM/.test(R({ goal: "model", aim: "predict", formative: "no", size: "small", k: "3" })) && /CB-SEM/.test(R({ goal: "model", aim: "confirm", formative: "no", size: "large" })) && /PLS-SEM/.test(R({ goal: "model", aim: "confirm", formative: "yes", size: "large" })));
scen("PLS-SEM sample is the kit's rule (155 for 3 arrows)", /155/.test(rec({ goal: "model", aim: "predict", k: "3" }).main.sample[0]));
scen("scales: EFA 5:1 = 120, 10:1 = 240; CFA for established scales", /EFA/.test(R({ goal: "scale", origin: "adapted", items: "24" })) && /= 120; nên đạt .* = 240/.test(rec({ goal: "scale", origin: "adapted", items: "24" }).main.sample[0]) && /CFA/.test(R({ goal: "scale", origin: "established" })));
scen("mediation: bootstrap, Fritz & MacKinnon 78 / 162 / 558", /PROCESS \(Model 4\)/.test(R({ goal: "medmod", mm: "med", frame: "reg" })) && /78 .*162 .*558/.test(rec({ goal: "medmod", mm: "med" }).main.sample[0]));
scen("moderation by gender in SmartPLS: MGA with MICOM (Henseler et al., 2016)", /MGA/.test(R({ goal: "medmod", mm: "mod", wtype: "cat", frame: "sem" })) && rec({ goal: "medmod", mm: "mod", wtype: "cat", frame: "sem" }).main.refs.includes("henseler16"));
scen("continuous moderator in SPSS: PROCESS Model 1", /PROCESS Model 1/.test(R({ goal: "medmod", mm: "mod", wtype: "cont", frame: "reg" })));
scen("moderated mediation: index of moderated mediation", /Trung gian có điều kiện/.test(R({ goal: "medmod", mm: "both" })));
scen("experiment, two ad versions, post only: Welch t-test with manipulation check", /Welch/.test(R({ goal: "experiment", xdesign: "post", xout: "cont", xk: "2", normal: "yes" })) && has({ goal: "experiment", xdesign: "post", xout: "cont", xk: "2" }, /manipulation check/));
scen("experiment, pre/post with control class: ANCOVA, 48 per group (Borm: 64 × 0.75)", /ANCOVA/.test(R({ goal: "experiment", xdesign: "prepost", xout: "cont", xk: "2" })) && /Khoảng 48 người mỗi nhóm/.test(rec({ goal: "experiment", xdesign: "prepost", xout: "cont", xk: "2" }).main.sample[0]));
scen("experiment, pre/post with a single Likert item: ordinal logistic adjusted for baseline", /logistic thứ bậc: kết quả sau/.test(R({ goal: "experiment", xdesign: "prepost", xout: "ord", xk: "2" })));
scen("experiment 2 × 2: two-way ANOVA; binary outcome: logistic with interaction", /ANOVA hai nhân tố/.test(R({ goal: "experiment", xdesign: "factorial", xout: "cont", normal: "yes" })) && /logistic với hai yếu tố/.test(R({ goal: "experiment", xdesign: "factorial", xout: "bin" })));
scen("experiment, click yes/no across 3 versions: chi-square with df 2", /chi bình phương/.test(R({ goal: "experiment", xdesign: "post", xout: "bin", xk: "3", g: "3" })) && /bậc tự do 2/.test(rec({ goal: "experiment", xdesign: "post", xout: "bin", xk: "3", g: "3" }).main.sample[0]));
scen("within-subject experiment, 3 conditions: repeated-measures ANOVA", /ANOVA đo lặp lại/.test(R({ goal: "experiment", xdesign: "within", xout: "cont", xk: "3", normal: "yes" })));
scen("listed firms 300 × 8 years: Pooled/FEM/REM with Hausman, robust Hausman and clustered SE, firm variable pages", /FEM, REM/.test(R({ goal: "panel", unit: "firm", nt: "nbig", dyn: "no" })) && has({ goal: "panel", unit: "firm", nt: "nbig", dyn: "no" }, /Mundlak.*Petersen|Petersen.*Mundlak/) && has({ goal: "panel", unit: "firm", nt: "nbig", dyn: "no" }, /bien-nghien-cuu\/roa\//));
scen("27 banks with lagged NPL: system GMM, collapse instruments, bank variable pages", /GMM hệ thống/.test(R({ goal: "panel", unit: "bank", nt: "nbig", dyn: "yes" })) && /collapse/.test(rec({ goal: "panel", unit: "bank", nt: "nbig", dyn: "yes" }).main.sample[0]) && has({ goal: "panel", unit: "bank", dyn: "yes" }, /ty-le-no-xau/));
scen("10 ASEAN countries × 30 years: panel ARDL (PMG/MG) with CD, IPS, Westerlund; GMM advised against", /PMG/.test(R({ goal: "panel", unit: "macro", nt: "tbig", dyn: "no" })) && /PMG/.test(R({ goal: "panel", unit: "macro", nt: "tbig", dyn: "yes" })) && has({ goal: "panel", unit: "macro", nt: "tbig" }, /Không dùng GMM/) && has({ goal: "panel", unit: "macro", nt: "tbig" }, /du-lieu-bang/));
scen("Vietnam inflation drivers, mixed I(0)/I(1): ARDL bounds with Narayan small-sample critical values", /ARDL/.test(R({ goal: "ts", tsaim: "single", integ: "mix" })) && rec({ goal: "ts", tsaim: "single", integ: "mix" }).main.refs.includes("narayan") && has({ goal: "ts", tsaim: "single", integ: "mix" }, /du-lieu\/lam-phat/));
scen("exchange rate, rate, inflation all I(1), system: Johansen then VECM", /Johansen/.test(R({ goal: "ts", tsaim: "system", integ: "i1" })));
scen("system, mixed orders: Toda–Yamamoto; system, I(0): VAR in levels", /Toda–Yamamoto/.test(R({ goal: "ts", tsaim: "system", integ: "mix" })) && /VAR ở dạng gốc/.test(R({ goal: "ts", tsaim: "system", integ: "i0" })));
scen("an I(2) variable: no ARDL bounds until transformed", /I\(2\)/.test(R({ goal: "ts", tsaim: "single", integ: "i2" })));
scen("policy hitting some firms at once: DID with clustered SE (Bertrand et al., 2004)", /DID\) với tác động cố định hai chiều/.test(R({ goal: "policy", ptype: "did", timing: "same" })) && rec({ goal: "policy", ptype: "did", timing: "same" }).main.refs.includes("bertrand"));
scen("staggered adoption: Callaway–Sant’Anna / Sun–Abraham, not plain TWFE (Goodman-Bacon, 2021)", /Callaway/.test(R({ goal: "policy", ptype: "did", timing: "stagger" })) && rec({ goal: "policy", ptype: "did", timing: "stagger" }).main.refs.includes("goodmanBacon"));
scen("dividend announcement: event study with CAR (Brown & Warner, 1985)", /CAR/.test(R({ goal: "policy", ptype: "stock" })));
scen("one province before/after, no control: interrupted time series", /interrupted time series/.test(R({ goal: "policy", ptype: "its" })));
scen("in-depth interviews: thematic analysis, saturation 9–17 (Hennink & Kaiser, 2022)", /thematic/.test(R({ goal: "qual", qtype: "qual" })) && /9–17/.test(rec({ goal: "qual", qtype: "qual" }).main.sample[0]));
scen("interviews then survey: exploratory sequential with scale links", /tuần tự khám phá/.test(R({ goal: "qual", qtype: "explor" })) && has({ goal: "qual", qtype: "explor" }, /thang-do\//));
scen("survey then interviews: explanatory sequential", /tuần tự giải thích/.test(R({ goal: "qual", qtype: "explan" })));
scen("describe: 385 for ±5% (Cochran)", /385/.test(rec({ goal: "describe" }).main.sample[0]));
check(api.recommend({ goal: "nothing" }) === null, "unknown goal: no recommendation");

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
