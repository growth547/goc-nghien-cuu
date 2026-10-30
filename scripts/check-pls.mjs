// Checks the PLS-SEM engine in src/tools/pls-sem.html against
//  - seminr 2.6 and cSEM 0.7 (R; scripts/pls_reference.R): loadings, weights, paths, R², R² adjusted, alpha, rho_A,
//    rho_c, AVE, HTMT, Fornell–Larcker, cross-loadings, outer and inner VIF, f², total and total indirect effects,
//    and seminr's own 5,000-sample bootstrap (standard errors and percentile CIs within Monte Carlo error);
//  - an independent numpy implementation on the data matrix (scripts/pls_reference.py): every estimate above, specific
//    indirect effects, Q² by blindfolding, and the bootstrap, replaying the same resampling stream (must match to
//    rounding, BCa included) and from numpy's own generator (SEs within Monte Carlo error);
//  - cSEM (scripts/fixtures/pls-extra-reference.json, Rscript scripts/pls_reference.R extra): SRMR of the saturated and
//    estimated model, HTMT2; PLSpredict on the tool's own fold assignment (--export-folds) refitted fold by fold with
//    seminr and lm() (must match to rounding), and cSEM's predict() with its own folds (within Monte Carlo error);
//  - identities: total = direct + Σ specific indirect, chapter-4 report renders for every case.
// Data: the tool's own sample data (its generator must reproduce the fixture exactly) and a simulated survey with a
// formative construct, a single-item construct and missing values. node scripts/check-pls.mjs --export-sample rewrites
// scripts/fixtures/pls-data/sample.csv from the generator (then rerun the R and Python references).
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("src/tools/pls-sem.html", "utf8");
const block = tag => {
  const parts = src.split(`//#${tag}-start`);
  if (parts.length !== 2 || !parts[1].includes(`//#${tag}-end`)) throw new Error(`missing //#${tag} block`);
  return parts[1].split(`//#${tag}-end`)[0];
};
const T = new Function(`${block("pls")}${block("data")}${block("report")}; return { P: PLS_ENGINE(), sampleData, SAMPLE_PATHS, parseCSV, buildTable, pickHeaderRow, suggestGroups, buildInput, parsePaths, fromDrawing, report };`)();
const P = T.P;

if (process.argv.includes("--export-sample")) {
  const raw = T.sampleData(), keep = raw[0].map((h, i) => (/^(CL|GT|HL|NT|TT)\d$/.test(h) ? i : -1)).filter(i => i >= 0);
  writeFileSync("scripts/fixtures/pls-data/sample.csv", raw.map(r => keep.map(i => r[i]).join(",")).join("\n") + "\n");
  console.log("wrote scripts/fixtures/pls-data/sample.csv");
  process.exit(0);
}

const FX = JSON.parse(readFileSync("scripts/fixtures/pls-reference.json", "utf8"));
// PLSpredict settings shared with the R reference: the tool's defaults; the fold seed is the case's bootstrap seed.
const PRED = { folds: 10, reps: 10 };
function caseInput(C) {
  const cs = C.case, D = FX.datasets[cs.data], items = cs.constructs.flatMap(c => c[1]);
  const col = h => Float64Array.from(D.rows, r => (r[D.names.indexOf(h)] == null ? NaN : r[D.names.indexOf(h)]));
  let k = 0;
  const cons = cs.constructs.map(([name, its, mode]) => ({ name, idx: its.map(() => k++), mode })), names = cons.map(c => c.name);
  return { cols: items.map(col), items, cons, paths: cs.paths.map(([a, b]) => [names.indexOf(a), names.indexOf(b), 1]), missing: cs.missing };
}
if (process.argv.includes("--export-folds")) {
  // Fold assignment of every PLSpredict repetition, for Rscript scripts/pls_reference.R extra.
  const out = {};
  for (const C of FX.cases) out[C.case.id] = { folds: PRED.folds, seed: C.case.seed, assign: P.foldsOf(P.prepare(caseInput(C)).n, PRED.folds, PRED.reps, C.case.seed).map(f => Array.from(f)) };
  writeFileSync("scripts/fixtures/pls-data/predict-folds.json", JSON.stringify(out));
  console.log("wrote scripts/fixtures/pls-data/predict-folds.json");
  process.exit(0);
}
const XR = JSON.parse(readFileSync("scripts/fixtures/pls-extra-reference.json", "utf8"));
let failed = 0, passed = 0;
const dev = {}; // largest deviation per comparison group, printed at the end
const near = (a, b, tol, label, group) => {
  const ok = Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol;
  if (group) dev[group] = Math.max(dev[group] ?? 0, Math.abs(a - b));
  if (!ok) console.log(`FAIL ${label}: ${a} vs ${b} (tol ${tol})`);
  ok ? passed++ : failed++;
  return ok;
};
const truthy = (c, label) => { if (!c) console.log(`FAIL ${label}`); c ? passed++ : failed++; };
const TOL = 1e-6; // point estimates against seminr, cSEM, numpy (all converge to 1e-7 on the weights)
const mat = (m, r, c) => { const i = m.rows.indexOf(r), j = m.cols.indexOf(c); return i < 0 || j < 0 ? NaN : m.v[i][j] ?? NaN; };

// 1. The tool's sample data generator reproduces the fixture.
{
  const raw = T.sampleData(), d = FX.datasets.sample, H = raw[0];
  let same = true;
  for (const [j, h] of d.names.entries()) for (let i = 0; i < d.rows.length; i++) if (raw[i + 1][H.indexOf(h)] !== d.rows[i][j]) same = false;
  truthy(same && raw.length - 1 === d.rows.length, "sampleData() reproduces scripts/fixtures/pls-data/sample.csv");
  // The whole input path the page uses: header detection, grouping, path parsing.
  const tbl = T.buildTable(raw, T.pickHeaderRow(raw)), gs = T.suggestGroups(tbl.header);
  truthy(gs.map(g => g.code).join(",") === "CL,GT,HL,NT,TT", "sample columns grouped into CL, GT, HL, NT, TT");
  const inp = T.buildInput(tbl, gs, "", 1, 5, ""), pp = T.parsePaths(T.SAMPLE_PATHS, inp.cons.map(c => c.name));
  truthy(!inp.errors.length && !pp.errors.length && pp.paths.length === 7, "sample model parses (7 paths)");
  const pr = P.prepare({ cols: inp.cols, items: inp.items, cons: inp.cons, paths: pp.paths, missing: "mean" }), est = P.estimate(pr);
  const ref = FX.cases[0].r.seminr;
  near(est.B[0][2], mat(ref.paths, "CL", "HL"), TOL, "page input path: CL → HL equals seminr");
  // Drawing-tool hand-off: compact JSON with ids, a negative arrow and a moderator.
  const vm = { v: 3, n: [["CL", "Chất lượng", 0], ["HL", "Hài lòng", 0], ["XX", "Khác", 0]], e: [["CL", "HL"], ["HL", "XX", -1]], mo: [["XX", "CL", "HL"]] };
  const r = T.fromDrawing(JSON.stringify(vm), ["CL", "HL", "TT"]);
  truthy(r.text === "CL -> HL" && r.notes.length === 2, "drawing-tool model: matched arrows kept, unmatched node and moderator reported");
  const pn = T.parsePaths("CL, GT -> HL\nHL -> TT (-)\nHL > NT", ["CL", "GT", "HL", "NT", "TT"]);
  truthy(pn.paths.length === 4 && pn.paths[2][2] === -1 && !pn.errors.length, "path syntax: lists, (-) sign, > arrow");
  truthy(T.parsePaths("CL -> ZZ", ["CL"]).errors.length === 1, "unknown construct in a path is reported");
}

// 2. Every case against R, numpy and the bootstrap references.
for (const C of FX.cases) {
  const cs = C.case, D = FX.datasets[cs.data], R = C.r.seminr, CS = C.r.csem, PY = C.py;
  console.log(`\n== ${cs.id}: ${cs.constructs.length} constructs, ${cs.paths.length} paths ==`);
  const items = cs.constructs.flatMap(c => c[1]), col = h => Float64Array.from(D.rows, r => (r[D.names.indexOf(h)] == null ? NaN : r[D.names.indexOf(h)]));
  let k = 0;
  const cons = cs.constructs.map(([name, its, mode]) => ({ name, idx: its.map(() => k++), mode }));
  const names = cons.map(c => c.name), ix = n => names.indexOf(n);
  const pr = P.prepare({ cols: items.map(col), items, cons, paths: cs.paths.map(([a, b]) => [ix(a), ix(b), 1]), missing: cs.missing });
  const est = P.estimate(pr), m = pr.m;
  near(pr.n, PY.n, 0, "n");
  truthy(est.conv, `converged in ${est.iter} iterations`);
  truthy(Math.abs(est.iter - (R.iterations + 1)) <= 1, `iterations ${est.iter} vs seminr ${R.iterations + 1}`);
  // Measurement model.
  items.forEach((h, i) => {
    const j = pr.owner[i], cn = names[j];
    near(est.load[i], mat(R.loadings, h, cn), TOL, `${h} loading vs seminr`, "loadings (seminr)");
    near(est.weight[i], mat(R.weights, h, cn), TOL, `${h} weight vs seminr`, "weights (seminr)");
    near(est.load[i], CS.loadings[`${cn} =~ ${h}_i`] ?? CS.loadings[`${cn} <~ ${h}_i`], TOL, `${h} loading vs cSEM`, "loadings (cSEM)");
    near(est.weight[i], CS.weights[`${cn} <~ ${h}_i`], TOL, `${h} weight vs cSEM`, "weights (cSEM)");
    near(est.load[i], PY.est.loadings[h], TOL, `${h} loading vs numpy`, "loadings (numpy)");
    near(est.weight[i], PY.est.weights[h], TOL, `${h} weight vs numpy`, "weights (numpy)");
    names.forEach((cn2, j2) => near(est.cross[i * m + j2], mat(R.cross, h, cn2), TOL, `${h} cross-loading on ${cn2}`, "cross-loadings (seminr)"));
    const vi = R.vif_items[cn];
    if (pr.blk[j].length > 1) near(est.ovif[i], vi[h], 1e-5, `${h} outer VIF vs seminr`, "outer VIF (seminr)");
    near(est.ovif[i], PY.est.ovif[h], 1e-5, `${h} outer VIF vs numpy`, "outer VIF (numpy)");
  });
  pr.blk.forEach((b, j) => {
    const r = est.rel[j], cn = names[j], py = PY.est.rel[cn];
    truthy(!!r === !!py, `${cn}: reliability reported iff reflective multi-item`);
    if (!r) return;
    for (const [key, rk] of [["alpha", "alpha"], ["rhoA", "rhoA"], ["rhoC", "rhoC"], ["ave", "AVE"]]) {
      near(r[key], mat(R.reliability, cn, rk), TOL, `${cn} ${key} vs seminr`, `${key} (seminr)`);
      near(r[key], py[key], TOL, `${cn} ${key} vs numpy`, `${key} (numpy)`);
    }
    near(Math.sqrt(r.ave), mat(R.fl, cn, cn), TOL, `${cn} √AVE (Fornell–Larcker diagonal)`, "Fornell–Larcker (seminr)");
  });
  for (let a = 0; a < m; a++) for (let b = 0; b < a; b++) {
    const v = mat(R.fl, names[a], names[b]), w = Number.isFinite(v) ? v : mat(R.fl, names[b], names[a]);
    near(est.C[a][b], w, TOL, `LV correlation ${names[a]}–${names[b]}`, "Fornell–Larcker (seminr)");
  }
  for (const [key, v] of Object.entries(est.htmt)) {
    const [i, j] = key.split(",").map(Number), a = names[i], b = names[j];
    const r = Number.isFinite(mat(R.htmt, a, b)) ? mat(R.htmt, a, b) : mat(R.htmt, b, a);
    near(v, r, TOL, `HTMT ${a}–${b} vs seminr`, "HTMT (seminr)");
    near(v, PY.est.htmt[`${a},${b}`], TOL, `HTMT ${a}–${b} vs numpy`, "HTMT (numpy)");
  }
  truthy(Object.keys(est.htmt).length === Object.keys(PY.est.htmt).length, "HTMT pairs: reflective multi-item constructs only");
  // Structural model.
  for (const j of pr.endo) {
    const e = est.eq[j], cn = names[j], py = PY.est.eq[cn];
    e.pred.forEach((a, t) => {
      near(e.b[t], mat(R.paths, names[a], cn), TOL, `${names[a]} → ${cn} vs seminr`, "paths (seminr)");
      near(e.b[t], CS.paths[`${cn} ~ ${names[a]}`], TOL, `${names[a]} → ${cn} vs cSEM`, "paths (cSEM)");
      near(e.b[t], py.b[py.pred.indexOf(names[a])], TOL, `${names[a]} → ${cn} vs numpy`, "paths (numpy)");
      // f² from the full model's construct scores, as cSEM; seminr re-estimates the whole model without the path,
      // which moves f² in the third decimal (reported, not tested).
      near(e.f2[t], CS.f2[`${cn} ~ ${names[a]}`], TOL, `f² ${names[a]} → ${cn} vs cSEM`, "f² (cSEM)");
      dev["f² vs seminr re-estimation (not tested)"] = Math.max(dev["f² vs seminr re-estimation (not tested)"] ?? 0, Math.abs(e.f2[t] - mat(R.f2, names[a], cn)));
      near(e.f2[t], py.f2[names[a]], TOL, `f² ${names[a]} → ${cn} vs numpy`, "f² (numpy)");
      if (e.pred.length > 1) near(e.vif[t], R.vif_antecedents[cn][names[a]], 1e-5, `inner VIF ${names[a]} → ${cn} vs seminr`, "inner VIF (seminr)");
      near(e.vif[t], py.vif[names[a]], 1e-5, `inner VIF ${names[a]} → ${cn} vs numpy`, "inner VIF (numpy)");
    });
    near(e.r2, mat(R.paths, "R^2", cn), TOL, `R² ${cn} vs seminr`, "R² (seminr)");
    near(e.r2, CS.r2[cn], TOL, `R² ${cn} vs cSEM`, "R² (cSEM)");
    near(e.r2adj, mat(R.paths, "AdjR^2", cn), TOL, `R² adjusted ${cn} vs seminr`, "R² adjusted (seminr)");
    near(e.r2adj, py.r2adj, TOL, `R² adjusted ${cn} vs numpy`, "R² adjusted (numpy)");
  }
  for (const [a, b] of pr.reach) {
    const key = a + ">" + b, nk = `${names[a]}>${names[b]}`;
    near(est.te[key], mat(R.total, names[a], names[b]), TOL, `total effect ${nk} vs seminr`, "total effects (seminr)");
    near(est.te[key], PY.est.total[nk], TOL, `total effect ${nk} vs numpy`, "total effects (numpy)");
    const ti = est.ti[key] ?? 0;
    near(ti, mat(R.total_indirect, names[a], names[b]), TOL, `total indirect ${nk} vs seminr`, "total indirect (seminr)");
    near(est.te[key], est.B[a][b] + ti, 1e-12, `total = direct + indirect ${nk}`);
  }
  pr.chains.forEach((c, i) => near(est.spec[i], PY.est.spec[c.map(j => names[j]).join(">")], TOL, `specific indirect ${c.map(j => names[j]).join(" → ")} vs numpy`, "specific indirect (numpy)"));
  truthy(pr.chains.length === Object.keys(PY.est.spec).length, `${pr.chains.length} causal chains, as numpy`);
  // Q² by blindfolding.
  const q2 = P.blindfold(pr, cs.D);
  for (const [cn, r] of Object.entries(PY.q2)) near(q2[ix(cn)].q2, r.q2, 1e-6, `Q² ${cn} (D = ${cs.D}) vs numpy`, "Q² (numpy)");
  truthy(Object.keys(q2).filter(j => q2[j]).length === Object.keys(PY.q2).length, "Q² for reflective endogenous constructs only");

  // Bootstrap: the same stream as numpy's replay, BCa included.
  const t0 = performance.now(), boot = P.bootstrap(pr, est, cs.B, cs.seed, { conf: 0.95, bca: true }), ms = performance.now() - t0;
  console.log(`bootstrap ${cs.B} resamples + jackknife (n = ${pr.n}, ${pr.p} indicators): ${(ms / 1000).toFixed(1)} s, ${boot.redraw} redrawn`);
  near(boot.redraw, PY.boot.redraw, 0, "redrawn resamples, as numpy");
  const keyName = k => {
    const [t, v] = [k.slice(0, k.indexOf(":")), k.slice(k.indexOf(":") + 1)];
    if (t === "l" || t === "w") return `${t}:${items[+v]}`;
    if (t === "r2") return `r2:${names[+v]}`;
    if (t === "si") return "si:" + pr.chains[+v].map(j => names[j]).join(">");
    if (t === "h") return "h:" + v.split(",").map(j => names[+j]).join(",");
    return `${t}:` + v.split(">").map(j => names[+j]).join(">");
  };
  const ex = PY.boot.exact, ind = PY.boot.indep;
  // numpy also resamples the loading and weight of single-item constructs (always 1); the tool leaves them out.
  const single = new Set(items.filter((h, i) => pr.blk[pr.owner[i]].length === 1).flatMap(h => [`l:${h}`, `w:${h}`]));
  truthy(Object.keys(boot.stats).length === Object.keys(ex).filter(k => !single.has(k)).length, `${Object.keys(boot.stats).length} bootstrapped statistics, as numpy`);
  for (const [k, s] of Object.entries(boot.stats)) {
    const n = keyName(k), e = ex[n];
    if (!e) { truthy(false, `bootstrapped ${n} missing in numpy`); continue; }
    for (const f of ["mean", "se", "lo", "hi", "q95", "bcLo", "bcHi"]) near(s[f], e[f], 1e-5, `${n} ${f} (same stream)`, `bootstrap ${f} (numpy replay)`);
    near(s.t, e.t, 1e-3 * Math.max(1, e.t), `${n} t (same stream)`, "bootstrap t (numpy replay)");
    near(s.p, e.p, 1e-6, `${n} p (same stream)`, "bootstrap p (numpy replay)");
    near(s.se / ind[n].se, 1, 0.06, `${n} SE vs numpy's own generator`, "bootstrap SE ratio − 1 (numpy RNG)");
  }
  // Against seminr's own bootstrap (different RNG): SEs within 6%, percentile bounds within 0.25 SE.
  const RB = R.boot, rowOf = (m2, r) => m2.rows.indexOf(r);
  const vsR = (label, s, m2, row) => {
    const i = rowOf(m2, row);
    if (i < 0) { truthy(false, `seminr bootstrap row ${row} missing`); return; }
    const v = m2.v[i], col = c => v[m2.cols.indexOf(c)];
    near(s.est, col("Original Est."), TOL, `${label} original vs seminr bootstrap table`);
    near(s.se / col("Bootstrap SD"), 1, 0.06, `${label} SE vs seminr`, "bootstrap SE ratio − 1 (seminr)");
    near(s.lo / s.se, col("2.5% CI") / s.se, 0.25, `${label} 2.5% bound vs seminr (in SE)`, "bootstrap CI bounds, in SE (seminr)");
    near(s.hi / s.se, col("97.5% CI") / s.se, 0.25, `${label} 97.5% bound vs seminr (in SE)`, "bootstrap CI bounds, in SE (seminr)");
  };
  pr.paths.forEach(p => vsR(`path ${names[p.from]} → ${names[p.to]}`, boot.stats[`p:${p.from}>${p.to}`], RB.paths, `${names[p.from]}  ->  ${names[p.to]}`));
  items.forEach((h, i) => { if (pr.blk[pr.owner[i]].length > 1) vsR(`loading ${h}`, boot.stats[`l:${i}`], RB.loadings, `${h}  ->  ${names[pr.owner[i]]}`); });
  pr.pairs.forEach(([a, b]) => vsR(`total indirect ${names[a]} → ${names[b]}`, boot.stats[`ti:${a}>${b}`], RB.total_indirect, `${names[a]}  ->  ${names[b]}`));
  for (const key of Object.keys(est.htmt)) { const [i, j] = key.split(",").map(Number); vsR(`HTMT ${names[i]}–${names[j]}`, boot.stats[`h:${key}`], RB.htmt, `${names[i]}  ->  ${names[j]}`); }
  pr.chains.forEach((c, i) => {
    const r = RB.specific[c.map(j => names[j]).join(">")], s = boot.stats[`si:${i}`];
    if (!r) { truthy(false, `seminr specific effect ${c.join(">")} missing`); return; }
    // seminr's specific_effect_significance(): [original, bootstrap mean, SD, t, 2.5%, 97.5%, p].
    near(s.est, r[0], TOL, `specific ${c.map(j => names[j]).join(" → ")} vs seminr`, "specific indirect (seminr)");
    near(s.se / r[2], 1, 0.06, `specific ${c.map(j => names[j]).join(" → ")} SE vs seminr`, "bootstrap SE ratio − 1 (seminr)");
  });
  // Reproducible: same seed, same numbers.
  const again = P.bootstrap(pr, est, 200, cs.seed, { conf: 0.95 }), first = P.bootstrap(pr, est, 200, cs.seed, { conf: 0.95 });
  truthy(Object.keys(again.stats).every(k => again.stats[k].se === first.stats[k].se), "same seed gives identical bootstrap");
  // The chapter-4 report renders with and without bootstrap.
  for (const b of [null, boot]) {
    const r = T.report(pr, est, b, q2, { sec: "4.3", tab: 5, fig: 2, conf: 0.95, ci: "bca", D: cs.D });
    truthy(r.html.includes("Bảng 4.5.") && r.html.includes("Tài liệu tham khảo") && !/NaN|undefined/.test(r.html.replace(/<[^>]+>/g, "")), `report renders (${b ? "with" : "without"} bootstrap, ${r.tables} tables)`);
  }
}

// 3. SRMR against cSEM; PLSpredict against seminr on the same folds (exact) and cSEM's own folds (Monte Carlo error).
for (const C of FX.cases) {
  const id = C.case.id, X = XR[id], inp = caseInput(C), pr = P.prepare(inp), est = P.estimate(pr);
  console.log(`\n== ${id}: SRMR and PLSpredict ==`);
  const s = P.srmr(pr, est);
  near(s.sat, X.srmr.saturated, 1e-6, `SRMR saturated ${s.sat.toFixed(4)} vs cSEM`, "SRMR saturated (cSEM)");
  near(s.est, X.srmr.estimated, 1e-6, `SRMR estimated ${s.est.toFixed(4)} vs cSEM`, "SRMR estimated (cSEM)");
  truthy(s.est >= s.sat - 1e-12, "SRMR of the estimated model is not below the saturated one");
  const folds = P.foldsOf(pr.n, PRED.folds, PRED.reps, C.case.seed), fx = JSON.parse(readFileSync("scripts/fixtures/pls-data/predict-folds.json", "utf8"))[id];
  truthy(folds.every((f, r) => f.every((v, i) => v === fx.assign[r][i])), "fold assignment equals the one exported to R");
  truthy(folds.every(f => { const c = new Array(PRED.folds).fill(0); f.forEach(v => c[v]++); return Math.max(...c) - Math.min(...c) <= 1; }), "folds differ in size by at most one row");
  const t0 = performance.now(), pp = P.plsPredict(pr, { ...PRED, seed: C.case.seed }), ms = performance.now() - t0;
  console.log(`PLSpredict ${PRED.folds} folds × ${PRED.reps} repetitions (n = ${pr.n}): ${(ms / 1000).toFixed(2)} s`);
  const R = X.predict, CP = X.csem_predict, names = pp.items.map(x => inp.items[x.item]);
  truthy(names.join(",") === R.items.join(","), "predicted indicators = indicators of endogenous constructs");
  truthy(pp.failed === 0 && !pp.lmFail, "every fold estimated");
  pp.items.forEach((x, t) => {
    const h = names[t];
    for (const [k, rk] of [["rmse", "rmse"], ["mae", "mae"], ["lmRmse", "lm_rmse"], ["lmMae", "lm_mae"], ["q2", "q2"], ["skew", "skew"]])
      near(x[k], R[rk][h], 1e-6, `${h} ${k} vs seminr (same folds)`, `PLSpredict ${k} (seminr, same folds)`);
    // cSEM draws its own folds and its Q²predict centres the errors: within Monte Carlo error of 10 × 10-fold CV.
    // (cSEM's LM benchmark has no intercept, so it is not comparable; the LM benchmark is checked against lm() above.)
    for (const [k, rk] of [["rmse", "rmse"], ["mae", "mae"]])
      near(x[k] / CP[rk][h], 1, 0.02, `${h} ${k} vs cSEM's own folds (ratio)`, `PLSpredict ${k} ratio − 1 (cSEM, own folds)`);
    near(x.q2, CP.q2[h], 0.02, `${h} Q²predict vs cSEM's own folds`, "PLSpredict Q²predict (cSEM, own folds)");
  });
  const again = P.plsPredict(pr, { ...PRED, seed: C.case.seed });
  truthy(again.items.every((x, t) => x.rmse === pp.items[t].rmse && x.q2 === pp.items[t].q2), "same seed gives identical PLSpredict");
  const r = T.report(pr, est, null, P.blindfold(pr, C.case.D), { sec: "4.3", tab: 5, fig: 2, conf: 0.95, ci: "perc", D: C.case.D, srmr: s, pred: pp });
  truthy(r.html.includes("SRMR") && r.html.includes("PLSpredict") && r.html.includes("Q²<sub>predict</sub>") && !/NaN|undefined/.test(r.html.replace(/<[^>]+>/g, "")), "report renders SRMR and PLSpredict");
  // HTMT2 (geometric means) against cSEM, for the reflective multi-item pairs the tool reports.
  const pr2 = P.prepare({ ...inp, htmt2: true }), est2 = P.estimate(pr2), H2 = X.htmt2, nm2 = inp.cons.map(c => c.name);
  for (const [key, v] of Object.entries(est2.htmt)) {
    const [i, j] = key.split(",").map(Number), a = H2.rows.indexOf(nm2[i]), b = H2.rows.indexOf(nm2[j]);
    near(v, H2.v[Math.max(a, b)][Math.min(a, b)], 1e-6, `HTMT2 ${nm2[i]}–${nm2[j]} vs cSEM`, "HTMT2 (cSEM)");
  }
  truthy(Object.keys(est2.htmt).length === Object.keys(est.htmt).length, "HTMT2 for the same pairs as HTMT");
  const b2 = P.bootstrap(pr2, est2, 200, C.case.seed, { conf: 0.95 }), r2 = T.report(pr2, est2, b2, {}, { sec: "4.3", tab: 5, fig: 2, conf: 0.95, ci: "perc", D: 7 });
  truthy(Object.keys(est2.htmt).every(k => Math.abs(b2.stats[`h:${k}`].est - est2.htmt[k]) < 1e-9) && r2.html.includes("Hệ số HTMT2") && r2.html.includes("Roemer"), "HTMT2 bootstrapped and reported");
}

// 4. Listwise deletion drops incomplete rows; mean replacement keeps them.
{
  const C = FX.cases[1], D = FX.datasets[C.case.data], items = C.case.constructs.flatMap(c => c[1]);
  const col = h => Float64Array.from(D.rows, r => (r[D.names.indexOf(h)] == null ? NaN : r[D.names.indexOf(h)]));
  let k = 0;
  const cons = C.case.constructs.map(([name, its, mode]) => ({ name, idx: its.map(() => k++), mode })), names = cons.map(c => c.name);
  const o = { cols: items.map(col), items, cons, paths: C.case.paths.map(([a, b]) => [names.indexOf(a), names.indexOf(b), 1]) };
  const full = D.rows.filter(r => items.every(h => r[D.names.indexOf(h)] != null)).length;
  near(P.prepare({ ...o, missing: "listwise" }).n, full, 0, "listwise n = complete rows");
  near(P.prepare({ ...o, missing: "mean" }).n, D.rows.length, 0, "mean replacement keeps every row");
  let threw = "";
  try { P.prepare({ ...o, paths: [...o.paths, [names.indexOf("LOY"), names.indexOf("FQ"), 1]], missing: "mean" }); } catch (e) { threw = e.message; }
  truthy(/vòng lặp/.test(threw), "a cycle in the structural model is refused");
}

console.log("\nLargest deviations:");
for (const [g, v] of Object.entries(dev)) console.log(`  ${g}: ${v.toExponential(2)}`);
console.log(`\ncheck-pls: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
