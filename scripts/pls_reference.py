"""Independent numpy/scipy reference for the PLS-SEM tool (src/tools/pls-sem.html).

The JavaScript engine works on the correlation matrix of the indicators; this file works on the data matrix
(scores Y = ZW, numpy.linalg.lstsq for every regression, numpy.corrcoef, matrix inverse for total effects),
so the two share no code. It covers what seminr and cSEM do not report the same way: Q² by blindfolding,
bias-corrected and accelerated (BCa) bootstrap intervals, and two bootstraps per case:
  exact - replays the JS resampling stream (mulberry32, same seed), so SEs and CIs must agree to rounding;
  indep - numpy's own generator, so SEs must agree within Monte Carlo error.

Steps (run from the repository root; needs numpy and scipy, and R with seminr and cSEM for step 2):
  1. python scripts/pls_reference.py data     -> scripts/fixtures/pls-data/*.csv (sample data from the tool + simulated)
  2. Rscript scripts/pls_reference.R          -> scripts/fixtures/pls-data/r-results.json
  3. python scripts/pls_reference.py ref      -> scripts/fixtures/pls-reference.json (data, Python and R results)
The tool's sample data comes from its own generator: node scripts/check-pls.mjs --export-sample writes it.
"""
import json
import sys
from pathlib import Path

import numpy as np
from scipy import stats

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "fixtures" / "pls-data"
OUT = ROOT / "fixtures" / "pls-reference.json"

# Model specifications: constructs (name, items, mode) and structural paths, in the order the tool receives them.
CASES = [
    {
        "id": "sample",
        "data": "sample",
        "constructs": [["CL", ["CL1", "CL2", "CL3", "CL4"], "A"], ["GT", ["GT1", "GT2", "GT3"], "A"],
                       ["HL", ["HL1", "HL2", "HL3", "HL4"], "A"], ["NT", ["NT1", "NT2", "NT3"], "A"],
                       ["TT", ["TT1", "TT2", "TT3", "TT4"], "A"]],
        "paths": [["CL", "GT"], ["CL", "HL"], ["GT", "HL"], ["HL", "NT"], ["HL", "TT"], ["NT", "TT"], ["CL", "TT"]],
        "missing": "mean", "seed": 20261030, "B": 5000, "D": 7,
    },
    {
        "id": "formative",
        "data": "formative",
        "constructs": [["FQ", ["FQ1", "FQ2", "FQ3", "FQ4"], "B"], ["SAT", ["SAT1", "SAT2", "SAT3"], "A"],
                       ["TRU", ["TRU1", "TRU2", "TRU3"], "A"], ["LOY", ["LOY1", "LOY2", "LOY3", "LOY4"], "A"],
                       ["AGE", ["AGE"], "A"]],
        "paths": [["FQ", "SAT"], ["FQ", "TRU"], ["SAT", "TRU"], ["SAT", "LOY"], ["TRU", "LOY"], ["AGE", "LOY"]],
        "missing": "mean", "seed": 7, "B": 5000, "D": 7,
    },
]


def make_formative(n=250, seed=2026):
    """Simulated survey: a formative quality index (four correlated causes), three reflective constructs on a 7-point
    scale, a single-item control and about 1% missing answers."""
    rng = np.random.default_rng(seed)
    C = 0.35 + 0.65 * np.eye(4)
    x = rng.multivariate_normal(np.zeros(4), C, n)
    fq = x @ np.array([0.45, 0.3, 0.25, 0.15])
    fq = fq / fq.std()
    age = rng.normal(0, 1, n)
    sat = 0.55 * fq + 0.8 * rng.normal(0, 1, n)
    tru = 0.25 * fq + 0.45 * sat + 0.75 * rng.normal(0, 1, n)
    loy = 0.35 * sat + 0.3 * tru + 0.1 * age + 0.75 * rng.normal(0, 1, n)
    lik = lambda v: np.clip(np.round(4 + 1.2 * v), 1, 7)
    cols = {}
    for j in range(4):
        cols[f"FQ{j + 1}"] = lik(x[:, j])
    for name, lv, ls in [("SAT", sat, [0.85, 0.8, 0.75]), ("TRU", tru, [0.8, 0.8, 0.7]), ("LOY", loy, [0.8, 0.85, 0.75, 0.65])]:
        sd = lv.std()
        for j, l in enumerate(ls):
            cols[f"{name}{j + 1}"] = lik(l * lv / sd + np.sqrt(1 - l * l) * rng.normal(0, 1, n))
    cols["AGE"] = np.round(22 + 4 * np.abs(age) + rng.normal(0, 1, n))
    names = list(cols)
    X = np.column_stack([cols[k] for k in names]).astype(float)
    mask = rng.random(X.shape) < 0.01
    X[mask] = np.nan
    return names, X


def write_csv(path, names, X):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(",".join(names) + "\n")
        for row in X:
            f.write(",".join("NA" if np.isnan(v) else (str(int(v)) if float(v).is_integer() else repr(float(v))) for v in row) + "\n")


def read_csv(path):
    lines = Path(path).read_text(encoding="utf-8").strip().split("\n")
    names = lines[0].split(",")
    X = np.array([[np.nan if v == "NA" else float(v) for v in l.split(",")] for l in lines[1:]])
    return names, X


def mulberry32(seed):
    a = seed & 0xFFFFFFFF

    def nxt():
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = ((a ^ (a >> 15)) * (1 | a)) & 0xFFFFFFFF
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & 0xFFFFFFFF)) & 0xFFFFFFFF) ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return nxt


class Model:
    def __init__(self, case, names, X):
        self.names = [c[0] for c in case["constructs"]]
        self.items = [it for c in case["constructs"] for it in c[1]]
        self.modes = [c[2] if len(c[1]) > 1 else "A" for c in case["constructs"]]
        col = {h: i for i, h in enumerate(names)}
        Xm = X[:, [col[h] for h in self.items]]
        if case["missing"] == "mean":
            mu = np.nanmean(Xm, axis=0)
            Xm = np.where(np.isnan(Xm), mu, Xm)
        else:
            Xm = Xm[~np.isnan(Xm).any(axis=1)]
        self.X = Xm
        self.n, self.p = Xm.shape
        self.m = len(self.names)
        self.blocks, k = [], 0
        for c in case["constructs"]:
            self.blocks.append(list(range(k, k + len(c[1]))))
            k += len(c[1])
        self.A = np.zeros((self.m, self.m))  # A[i, j] = 1 when i -> j
        for f, t in case["paths"]:
            self.A[self.names.index(f), self.names.index(t)] = 1
        self.paths = [(self.names.index(f), self.names.index(t)) for f, t in case["paths"]]
        self.endo = [j for j in range(self.m) if self.A[:, j].any()]


def zscore(X):
    return (X - X.mean(axis=0)) / X.std(axis=0, ddof=1)


def pls(M, X, maxit=300, tol=1e-7):
    """Lohmöller's PLS algorithm on the data matrix, path weighting scheme, initial weights 1."""
    Z = zscore(X)
    n = Z.shape[0]
    W = np.zeros((M.p, M.m))
    for j, b in enumerate(M.blocks):
        W[b, j] = 1.0

    def rescale(W):
        return W / (Z @ W).std(axis=0, ddof=1)

    W = rescale(W)
    conv = False
    for it in range(1, maxit + 1):
        Y = Z @ W
        R = np.corrcoef(Y.T)
        E = np.zeros((M.m, M.m))
        for j in range(M.m):
            for i in range(M.m):
                if M.A[j, i]:
                    E[i, j] = R[i, j]
            pred = np.flatnonzero(M.A[:, j])
            if len(pred):
                E[pred, j] = np.linalg.lstsq(Y[:, pred], Y[:, j], rcond=None)[0]
        P = zscore(Y @ E)
        Wn = np.zeros_like(W)
        for j, b in enumerate(M.blocks):
            if M.modes[j] == "B":
                Wn[b, j] = np.linalg.lstsq(Z[:, b], P[:, j], rcond=None)[0]
            else:
                Wn[b, j] = Z[:, b].T @ P[:, j] / (n - 1)
        Wn = rescale(Wn)
        diff = np.abs(Wn - W).sum()
        W = Wn
        if diff < tol:
            conv = True
            break
    return {"Z": Z, "W": W, "Y": Z @ W, "iter": it, "conv": conv}


def r2_of(y, X):
    if X.shape[1] == 0:
        return 0.0
    b = np.linalg.lstsq(X, y, rcond=None)[0]
    e = y - X @ b
    return 1 - (e @ e) / (y @ y)


def chains(M):
    out = []

    def walk(path):
        if len(path) >= 3:
            out.append(path)
        for t in np.flatnonzero(M.A[path[-1]]):
            walk(path + [int(t)])

    for j in range(M.m):
        walk([j])
    return out


def htmt(M, R):
    out = {}
    ok = [M.modes[j] == "A" and len(b) > 1 for j, b in enumerate(M.blocks)]
    R = np.abs(R)

    def mono(b):
        S = R[np.ix_(b, b)]
        return S[np.triu_indices(len(b), 1)].mean()

    for i in range(M.m):
        for j in range(i + 1, M.m):
            if ok[i] and ok[j]:
                out[f"{M.names[i]},{M.names[j]}"] = R[np.ix_(M.blocks[i], M.blocks[j])].mean() / np.sqrt(mono(M.blocks[i]) * mono(M.blocks[j]))
    return out


def full(M, X):
    f = pls(M, X)
    Z, W, Y = f["Z"], f["W"], f["Y"]
    n = Z.shape[0]
    L = Z.T @ Y / (n - 1)  # cross-loadings (both standardised)
    own = {M.items[k]: L[k, j] for j, b in enumerate(M.blocks) for k in b}
    weights = {M.items[k]: W[k, j] for j, b in enumerate(M.blocks) for k in b}
    R = np.corrcoef(Z.T)
    rel, ovif = {}, {}
    for j, b in enumerate(M.blocks):
        for k in b:
            others = [x for x in b if x != k]
            ovif[M.items[k]] = 1 / (1 - r2_of(Z[:, k], Z[:, others])) if others else 1.0
        if M.modes[j] == "B" or len(b) < 2:
            continue
        lam = np.array([L[k, j] for k in b])
        S = R[np.ix_(b, b)]
        k = len(b)
        alpha = k / (k - 1) * (1 - np.trace(S) / S.sum())
        w = W[b, j]
        Sn = S - np.diag(np.diag(S))
        Wn = np.outer(w, w) - np.diag(w * w)
        rhoA = (w @ w) ** 2 * (w @ Sn @ w) / (w @ Wn @ w)
        rhoC = lam.sum() ** 2 / (lam.sum() ** 2 + (1 - lam ** 2).sum())
        rel[M.names[j]] = {"alpha": alpha, "rhoA": rhoA, "rhoC": rhoC, "ave": (lam ** 2).mean()}
    Bm = np.zeros((M.m, M.m))
    eq = {}
    for j in M.endo:
        pred = list(np.flatnonzero(M.A[:, j]))
        b = np.linalg.lstsq(Y[:, pred], Y[:, j], rcond=None)[0]
        Bm[pred, j] = b
        r2 = r2_of(Y[:, j], Y[:, pred])
        k = len(pred)
        f2, vif = {}, {}
        for a in pred:
            rest = [x for x in pred if x != a]
            f2[M.names[a]] = (r2 - r2_of(Y[:, j], Y[:, rest])) / (1 - r2)
            vif[M.names[a]] = 1 / (1 - r2_of(Y[:, a], Y[:, rest])) if rest else 1.0
        eq[M.names[j]] = {"pred": [M.names[a] for a in pred], "b": list(b), "r2": r2, "r2adj": 1 - (1 - r2) * (n - 1) / (n - k - 1), "f2": f2, "vif": vif}
    T = np.linalg.inv(np.eye(M.m) - Bm) - np.eye(M.m)
    ind = T - Bm
    spec = {">".join(M.names[c] for c in ch): float(np.prod([Bm[ch[t], ch[t + 1]] for t in range(len(ch) - 1)])) for ch in chains(M)}
    fl = np.corrcoef(Y.T)
    for j in range(M.m):
        if M.names[j] in rel:
            fl[j, j] = np.sqrt(rel[M.names[j]]["ave"])
    return {"iter": f["iter"], "conv": f["conv"], "loadings": own, "weights": weights, "cross": {M.items[k]: list(L[k]) for k in range(M.p)},
            "lvcor": np.corrcoef(Y.T).tolist(), "fl": fl.tolist(), "rel": rel, "ovif": ovif, "eq": eq,
            "total": {f"{M.names[a]}>{M.names[b]}": T[a, b] for a in range(M.m) for b in range(M.m) if abs(T[a, b]) > 0},
            "totind": {f"{M.names[a]}>{M.names[b]}": ind[a, b] for a in range(M.m) for b in range(M.m) if abs(ind[a, b]) > 0},
            "spec": spec, "htmt": htmt(M, R), "W": W, "Bm": Bm, "Y": Y}


def stat_vector(M, X):
    """Bootstrapped statistics by name; None when the PLS algorithm does not converge."""
    f = pls(M, X)
    if not f["conv"]:
        return None
    Z, W, Y = f["Z"], f["W"], f["Y"]
    n = Z.shape[0]
    L = Z.T @ Y / (n - 1)
    Bm = np.zeros((M.m, M.m))
    out = {}
    r2 = {}
    for j in M.endo:
        pred = list(np.flatnonzero(M.A[:, j]))
        Bm[pred, j] = np.linalg.lstsq(Y[:, pred], Y[:, j], rcond=None)[0]
        r2[j] = r2_of(Y[:, j], Y[:, pred])
    for a, b in M.paths:
        out[f"p:{M.names[a]}>{M.names[b]}"] = Bm[a, b]
    for j, bl in enumerate(M.blocks):
        for k in bl:
            out[f"l:{M.items[k]}"] = L[k, j]
            out[f"w:{M.items[k]}"] = W[k, j]
    for j in M.endo:
        out[f"r2:{M.names[j]}"] = r2[j]
    T = np.linalg.inv(np.eye(M.m) - Bm) - np.eye(M.m)
    reach = (np.linalg.matrix_power(np.eye(M.m) + M.A, M.m) > 0) & ~np.eye(M.m, dtype=bool)
    for ch in chains(M):
        out["si:" + ">".join(M.names[c] for c in ch)] = float(np.prod([Bm[ch[t], ch[t + 1]] for t in range(len(ch) - 1)]))
    has_ind = {(ch[0], ch[-1]) for ch in chains(M)}
    for a in range(M.m):
        for b in range(M.m):
            if (a, b) in has_ind:
                out[f"ti:{M.names[a]}>{M.names[b]}"] = T[a, b] - Bm[a, b]
            if reach[a, b]:
                out[f"te:{M.names[a]}>{M.names[b]}"] = T[a, b]
    for k, v in htmt(M, np.corrcoef(Z.T)).items():
        out["h:" + k] = v
    return out


def summarize(draws, theta, B, conf=0.95, acc=None):
    out = {}
    al = (1 - conf) / 2
    for k, d in draws.items():
        d = np.array(d)
        se = d.std(ddof=1)
        t = abs(theta[k]) / se
        r = {"mean": d.mean(), "se": se, "t": t, "p": 2 * stats.t.sf(t, B - 1), "lo": np.quantile(d, al), "hi": np.quantile(d, 1 - al), "q95": np.quantile(d, 0.95)}
        if acc is not None:
            z0 = stats.norm.ppf((d < theta[k]).mean())
            a = acc[k]
            za = stats.norm.ppf(al)
            adj = lambda z: stats.norm.cdf(z0 + (z0 + z) / (1 - a * (z0 + z)))
            r.update({"z0": z0, "a": a, "bcLo": np.quantile(d, adj(za)), "bcHi": np.quantile(d, adj(-za))})
        out[k] = r
    return out


def bootstrap(M, X, B, draw):
    theta = stat_vector(M, X)
    draws = {k: [] for k in theta}
    redraw = 0
    while len(draws[next(iter(draws))]) < B:
        idx = draw()
        v = stat_vector(M, X[idx])
        if v is None:
            redraw += 1
            continue
        for k in draws:
            draws[k].append(v[k])
    return theta, draws, redraw


def jackknife_acc(M, X, theta):
    n = X.shape[0]
    jk = {k: [] for k in theta}
    for i in range(n):
        v = stat_vector(M, np.delete(X, i, axis=0))
        for k in jk:
            jk[k].append(v[k])
    acc = {}
    for k, d in jk.items():
        d = np.array(d)
        dd = d.mean() - d
        acc[k] = (dd ** 3).sum() / (6 * ((dd ** 2).sum()) ** 1.5) if (dd ** 2).sum() > 0 else 0.0
    return acc


def blindfold(M, X, D):
    """Q² (construct cross-validated redundancy) by blindfolding, omission distance D; see the JS engine for the steps."""
    Z = zscore(X)
    n = Z.shape[0]
    out = {}
    for j in M.endo:
        if M.modes[j] != "A":
            continue
        b = M.blocks[j]
        K = len(b)
        pos = np.arange(n)[:, None] * K + np.arange(K)[None, :]  # data-point numbers, case by case
        sse = sso = 0.0
        for d in range(D):
            omit = pos % D == d
            Zd = Z.copy()
            for t, k in enumerate(b):
                Zd[omit[:, t], k] = Z[~omit[:, t], k].mean()
            mean_d, sd_d = Zd.mean(axis=0), Zd.std(axis=0, ddof=1)
            f = pls(M, Zd)
            Y = f["Y"]
            pred = list(np.flatnonzero(M.A[:, j]))
            beta = np.linalg.lstsq(Y[:, pred], Y[:, j], rcond=None)[0]
            yhat = Y[:, pred] @ beta
            lam = f["Z"].T @ Y[:, j] / (n - 1)
            for t, k in enumerate(b):
                rows = omit[:, t]
                xhat = lam[k] * yhat[rows] * sd_d[k] + mean_d[k]
                sse += ((Z[rows, k] - xhat) ** 2).sum()
                sso += (Z[rows, k] ** 2).sum()
        out[M.names[j]] = {"q2": 1 - sse / sso, "sse": sse, "sso": sso}
    return out


def clean(o):
    if isinstance(o, dict):
        return {k: clean(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [clean(v) for v in o]
    if isinstance(o, (np.floating, float)):
        return None if not np.isfinite(o) else float(o)
    if isinstance(o, np.integer):
        return int(o)
    if isinstance(o, np.bool_):
        return bool(o)
    return o


def run(case):
    names, X = read_csv(DATA / f"{case['data']}.csv")
    M = Model(case, names, X)
    est = full(M, M.X)
    for k in ("W", "Bm", "Y"):
        est.pop(k)
    rnd = mulberry32(case["seed"])
    n = M.n
    theta, draws, redraw = bootstrap(M, M.X, case["B"], lambda: np.array([int(rnd() * n) for _ in range(n)]))
    acc = jackknife_acc(M, M.X, theta)
    exact = summarize(draws, theta, case["B"], 0.95, acc)
    rng = np.random.default_rng(case["seed"])
    _, draws2, _ = bootstrap(M, M.X, case["B"], lambda: rng.integers(0, n, n))
    indep = summarize(draws2, theta, case["B"])
    q2 = blindfold(M, M.X, case["D"])
    print(f"{case['id']}: n = {n}, iterations {est['iter']}, redraws {redraw}")
    return {"n": n, "est": est, "boot": {"exact": exact, "indep": {k: {"se": v["se"], "lo": v["lo"], "hi": v["hi"]} for k, v in indep.items()}, "redraw": redraw}, "q2": q2}


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "data":
        DATA.mkdir(parents=True, exist_ok=True)
        names, X = make_formative()
        write_csv(DATA / "formative.csv", names, X)
        print("wrote", DATA / "formative.csv")
        return
    r = json.loads((DATA / "r-results.json").read_text(encoding="utf-8"))
    datasets = {}
    for c in CASES:
        names, X = read_csv(DATA / f"{c['data']}.csv")
        datasets[c["data"]] = {"names": names, "rows": [[None if np.isnan(v) else float(v) for v in row] for row in X]}
    out = {"generated": "python scripts/pls_reference.py ref", "datasets": datasets, "cases": []}
    for c in CASES:
        out["cases"].append({"case": c, "py": run(c), "r": r[c["id"]]})
    OUT.write_text(json.dumps(clean(out), ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
