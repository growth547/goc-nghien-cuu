// Checks the PROCESS-style engine in src/tools/trung-gian-dieu-tiet.html (models 1, 4, 6, 7) against
//  - published R output for the mtcars data (Henderson & Velleman, 1981; R datasets),
//  - an independent numpy/scipy implementation (scripts/process_reference.py → scripts/fixtures/process-reference.json):
//    coefficients, OLS SEs, p, CIs, R², ΔR², Sobel, conditional effects, Johnson–Neyman points, and
//    bootstrap CIs, both replaying the same resampling stream (must match to rounding) and from numpy's own
//    generator (must match within Monte Carlo error),
//  - closed forms: at each Johnson–Neyman point the conditional effect has p exactly 1 − confidence; c = c′ + Σ ab.
import { readFileSync } from "node:fs";

const src = readFileSync("src/tools/trung-gian-dieu-tiet.html", "utf8");
const parts = src.split("//#process-start");
if (parts.length !== 2 || !parts[1].includes("//#process-end")) throw new Error("missing //#process block");
const P = new Function(`${parts[1].split("//#process-end")[0]}; return PROCESS_ENGINE();`)();
const FX = JSON.parse(readFileSync("scripts/fixtures/process-reference.json", "utf8"));

let failed = 0, passed = 0;
const near = (a, b, tol, label, quiet) => {
  const ok = Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol;
  if (!ok || !quiet) console.log(`${ok ? "ok  " : "FAIL"} ${label}: ${a} vs ${b} (tol ${tol})`);
  ok ? passed++ : failed++;
};
const rel = (a, b, r, label, quiet) => near(a, b, r * Math.max(1, Math.abs(b)), label, quiet);

// Inverse normal (Acklam) for the Monte Carlo tolerance of a percentile.
function qnorm(p) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const q = Math.min(p, 1 - p), t = Math.sqrt(-2 * Math.log(q));
  const x = (((((c[0] * t + c[1]) * t + c[2]) * t + c[3]) * t + c[4]) * t + c[5]) / ((((d[0] * t + d[1]) * t + d[2]) * t + d[3]) * t + 1);
  return p < 0.5 ? x : -x;
}

for (const { case: cs, ref } of FX.cases) {
  console.log(`\n== ${cs.id} (model ${cs.model}) ==`);
  const D = FX.datasets[cs.data], col = k => Float64Array.from(D[k], v => (v == null ? NaN : v));
  const raw = { X: col(cs.x), Y: col(cs.y), M: cs.m.map(col), W: cs.w ? col(cs.w) : null, C: cs.cov.map(col) };
  const pr = P.prepare(raw, { model: cs.model, center: cs.center, probe: cs.probe, conf: cs.conf });
  const est = P.estimate(pr);
  near(pr.n, ref.n, 0, "listwise n");

  // Regression equations.
  for (const r of est.eqs) {
    const R = ref.eqs[r.out], f = r.fit;
    r.pred.forEach((v, i) => {
      const c = f.coef[i], q = R.pred.indexOf(v);
      rel(c.b, R.b[q], 1e-8, `${r.out} b[${v}]`, true);
      rel(c.se, R.se[q], 1e-8, `${r.out} se[${v}]`, true);
      rel(c.t, R.t[q], 1e-7, `${r.out} t[${v}]`, true);
      near(c.p, R.p[q], 1e-7, `${r.out} p[${v}]`, true);
      rel(c.lo, R.lo[q], 1e-7, `${r.out} LLCI[${v}]`, true);
      rel(c.hi, R.hi[q], 1e-7, `${r.out} ULCI[${v}]`, true);
    });
    near(f.r2, R.r2, 1e-10, `${r.out} R²`);
    rel(f.F, R.F, 1e-8, `${r.out} F`, true);
    near(f.fp, R.fp, 1e-7, `${r.out} p(F)`, true);
    if (r.change) {
      const C = ref.change[r.out];
      near(r.change.dr2, C.dr2, 1e-10, `${r.out} ΔR² of X×W`);
      rel(r.change.F, C.F, 1e-7, `${r.out} F change`);
      near(r.change.p, C.p, 1e-7, `${r.out} p of F change`);
      // ΔR² F test equals t² of the interaction coefficient.
      const t = f.coef[r.pred.indexOf("XW")].t;
      rel(r.change.F, t * t, 1e-9, `${r.out} F change = t² of X×W`, true);
    }
  }
  if (est.total) {
    rel(est.total.fit.coef[1].b, ref.total.b[1], 1e-8, "total effect c");
    rel(est.total.fit.coef[1].se, ref.total.se[1], 1e-8, "SE of c", true);
    // c = c′ + Σ indirect (exact OLS identity with identical covariates).
    const dir = est.eqs.find(r => r.out === "Y").fit.coef[1].b;
    const tot = est.effects["ind:total"] ?? est.effects["ind:1"];
    near(est.total.fit.coef[1].b, dir + tot, 1e-9, "c = c′ + total indirect");
  }

  // Published anchors.
  if (cs.published) {
    for (const [eq, m] of Object.entries(cs.published)) {
      if (eq === "r2") continue;
      for (const [v, val] of Object.entries(m)) {
        const r = eq === "total" ? est.total : est.eqs.find(e => e.out === eq);
        const got = r.fit.coef[r.pred.indexOf(v)].b, dp = String(val).split(".")[1].length;
        near(got, val, 0.51 * 10 ** -dp, `published ${eq} ${v} (R lm)`);
      }
    }
    for (const [eq, val] of Object.entries(cs.published.r2 || {})) {
      const r = eq === "total" ? est.total : est.eqs.find(e => e.out === eq);
      near(r.fit.r2, val, 0.51e-4, `published R² ${eq}`);
    }
  }

  // Point effects.
  for (const [k, v] of Object.entries(ref.effects)) rel(est.effects[k], v, 1e-8, `effect ${k}`, true);
  near(Object.keys(est.effects).length, Object.keys(ref.effects).length, 0, "number of effects");
  for (const [k, s] of Object.entries(ref.sobel)) {
    rel(est.sobel[k].se, s.se, 1e-8, `Sobel SE ${k}`, true);
    rel(est.sobel[k].z, s.z, 1e-7, `Sobel z ${k}`);
    near(est.sobel[k].p, s.p, 1e-7, `Sobel p ${k}`, true);
  }

  // Conditional effects and Johnson–Neyman.
  est.cond.forEach((c, i) => {
    const R = ref.cond[i];
    c.rows.forEach((r, j) => {
      rel(c.rows[j].wOrig, R.wOrig[j], 1e-10, `${c.out} probe W[${j}]`, true);
      rel(r.theta, R.rows[j].theta, 1e-8, `${c.out} θ at W[${j}]`, true);
      rel(r.se, R.rows[j].se, 1e-8, `${c.out} SE θ at W[${j}]`, true);
      near(r.p, R.rows[j].p, 1e-7, `${c.out} p θ at W[${j}]`, true);
      rel(r.lo, R.rows[j].lo, 1e-7, `${c.out} LLCI θ at W[${j}]`, true);
    });
    console.log(`ok   ${c.out}: ${c.rows.length} conditional effects match (θ, SE, p, CI)`);
    if (R.jn) {
      near(c.jn.roots.length, R.jn.length, 0, `${c.out} JN points inside the range of W`);
      c.jn.roots.forEach((w, j) => rel(w, R.jn[j], 1e-7, `${c.out} JN point ${j + 1} vs numpy roots`));
      c.jn.all.forEach((w, j) => rel(w, R.jnAll[j], 1e-7, `${c.out} JN root ${j + 1} (incl. outside range)`, true));
      c.jn.rootRows.forEach((r, j) => near(r.p, 1 - cs.conf, 1e-7, `${c.out} p at JN point ${j + 1} = 1 − confidence`));
    }
  });

  // Bootstrap.
  if (cs.B) {
    const t0 = Date.now(), bt = P.bootstrap(pr, cs.B, cs.seed);
    console.log(`     bootstrap ${cs.B} × n = ${pr.n} in ${Date.now() - t0} ms`);
    near(bt.redraw, ref.redrawExact, 0, "redrawn resamples = numpy replay");
    let worst = 0, worstMC = 0, worstSE = 0;
    for (const [k, R] of Object.entries(ref.bootExact)) {
      const s = bt.stats[k];
      for (const f of ["se", "lo", "hi"]) {
        const d = Math.abs(s[f] - R[f]) / Math.max(1e-12, R.se);
        worst = Math.max(worst, d);
        near(s[f], R[f], 1e-7 * Math.max(1, Math.abs(R[f])) + 1e-9, `exact replay ${k}.${f}`, true);
      }
      // Monte Carlo tolerance for a percentile: 4·√2·√(p(1−p)/B)/φ(z_p)·SE, ×1.5 for skewed products.
      const p = (1 - cs.conf) / 2, z = qnorm(p), phi = Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
      const I = ref.bootIndep[k], tol = 1.5 * 4 * Math.SQRT2 * Math.sqrt(p * (1 - p) / cs.B) / phi;
      for (const f of ["lo", "hi"]) {
        const d = Math.abs(s[f] - I[f]) / I.se;
        worstMC = Math.max(worstMC, d / tol);
        near(d, 0, tol, `independent numpy bootstrap ${k}.${f} (in SE units)`, true);
      }
      const dse = Math.abs(s.se - I.se) / I.se;
      worstSE = Math.max(worstSE, dse);
      near(dse, 0, 0.1, `independent bootstrap SE ${k} (relative)`, true);
    }
    console.log(`ok   ${Object.keys(ref.bootExact).length} bootstrapped effects; replay max |diff| = ${worst.toExponential(2)} SE; independent RNG max = ${worstMC.toFixed(2)} of MC tolerance, SE max rel. diff ${(worstSE * 100).toFixed(1)}%`);
    const again = P.bootstrap(pr, Math.min(cs.B, 500), cs.seed), again2 = P.bootstrap(pr, Math.min(cs.B, 500), cs.seed);
    near(JSON.stringify(again.stats) === JSON.stringify(again2.stats) ? 1 : 0, 1, 0, "same seed → same bootstrap", true);
  }
}

// Distribution helpers against scipy values.
near(P.tCrit(30, 0.95), 2.0422724563012373, 1e-8, "t critical df 30, 95% (scipy)");
near(P.zP(1.959963984540054), 0.05, 1e-9, "normal two-tailed p at 1.96");

console.log(`\n${passed} checks passed, ${failed} failed`);
if (failed) process.exit(1);
