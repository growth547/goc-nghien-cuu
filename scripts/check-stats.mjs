// Checks the statistics in src/tools/phan-tich-du-lieu.html against closed forms and
// textbook values, so the chapter-4 report a student copies is numerically right.
import { readFileSync } from "node:fs";

const src = readFileSync("src/tools/phan-tich-du-lieu.html", "utf8");
const m = src.match(/\/\/#stats-start([\s\S]*?)\/\/#stats-end/);
if (!m) throw new Error("missing //#stats block");
const S = new Function(`${m[1]}; return { gammaQ, tP, fP, mean, variance, pearson, corrMatrix, invert, logDet, cronbach, eigenSym, varimax, efa, ols };`)();

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

if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); }
