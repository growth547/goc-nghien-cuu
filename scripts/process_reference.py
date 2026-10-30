"""Independent numpy/scipy reference for the PROCESS-style tool (src/tools/trung-gian-dieu-tiet.html).

Writes scripts/fixtures/process-reference.json; scripts/check-process.mjs runs the JavaScript engine on the
same data and compares point estimates, OLS standard errors, Sobel tests, Johnson-Neyman points and
bootstrap CIs. Nothing here shares code with the JS engine: OLS uses numpy.linalg.lstsq and inv(X'X),
p-values and critical values come from scipy.stats, bootstrap refits each equation on the resampled rows.

Two bootstraps per case:
  exact  - replays the JS resampling stream (mulberry32, same seed), so the CIs must agree to rounding;
  indep  - numpy's own generator, so the CIs must agree within Monte Carlo error.

Run (needs numpy and scipy):  python scripts/process_reference.py
"""
import json
from pathlib import Path

import numpy as np
from scipy import stats

# Motor Trend road tests, 1973-74 models (Henderson & Velleman, 1981, Biometrics 37(2), 391-411,
# https://doi.org/10.2307/2530428); distributed as `mtcars` in R's datasets package.
MTCARS = """
Mazda RX4,21.0,6,160.0,110,3.90,2.620,16.46,0,1,4,4
Mazda RX4 Wag,21.0,6,160.0,110,3.90,2.875,17.02,0,1,4,4
Datsun 710,22.8,4,108.0,93,3.85,2.320,18.61,1,1,4,1
Hornet 4 Drive,21.4,6,258.0,110,3.08,3.215,19.44,1,0,3,1
Hornet Sportabout,18.7,8,360.0,175,3.15,3.440,17.02,0,0,3,2
Valiant,18.1,6,225.0,105,2.76,3.460,20.22,1,0,3,1
Duster 360,14.3,8,360.0,245,3.21,3.570,15.84,0,0,3,4
Merc 240D,24.4,4,146.7,62,3.69,3.190,20.00,1,0,4,2
Merc 230,22.8,4,140.8,95,3.92,3.150,22.90,1,0,4,2
Merc 280,19.2,6,167.6,123,3.92,3.440,18.30,1,0,4,4
Merc 280C,17.8,6,167.6,123,3.92,3.440,18.90,1,0,4,4
Merc 450SE,16.4,8,275.8,180,3.07,4.070,17.40,0,0,3,3
Merc 450SL,17.3,8,275.8,180,3.07,3.730,17.60,0,0,3,3
Merc 450SLC,15.2,8,275.8,180,3.07,3.780,18.00,0,0,3,3
Cadillac Fleetwood,10.4,8,472.0,205,2.93,5.250,17.98,0,0,3,4
Lincoln Continental,10.4,8,460.0,215,3.00,5.424,17.82,0,0,3,4
Chrysler Imperial,14.7,8,440.0,230,3.23,5.345,17.42,0,0,3,4
Fiat 128,32.4,4,78.7,66,4.08,2.200,19.47,1,1,4,1
Honda Civic,30.4,4,75.7,52,4.93,1.615,18.52,1,1,4,2
Toyota Corolla,33.9,4,71.1,65,4.22,1.835,19.90,1,1,4,1
Toyota Corona,21.5,4,120.1,97,3.70,2.465,20.01,1,0,3,1
Dodge Challenger,15.5,8,318.0,150,2.76,3.520,16.87,0,0,3,2
AMC Javelin,15.2,8,304.0,150,3.15,3.435,17.30,0,0,3,2
Camaro Z28,13.3,8,350.0,245,3.73,3.840,15.41,0,0,3,4
Pontiac Firebird,19.2,8,400.0,175,3.08,3.845,17.05,0,0,3,2
Fiat X1-9,27.3,4,79.0,66,4.08,1.935,18.90,1,1,4,1
Porsche 914-2,26.0,4,120.3,91,4.43,2.140,16.70,0,1,5,2
Lotus Europa,30.4,4,95.1,113,3.77,1.513,16.90,1,1,5,2
Ford Pantera L,15.8,8,351.0,264,4.22,3.170,14.50,0,1,5,4
Ferrari Dino,19.7,6,145.0,175,3.62,2.770,15.50,0,1,5,6
Maserati Bora,15.0,8,301.0,335,3.54,3.570,14.60,0,1,5,8
Volvo 142E,21.4,4,121.0,109,4.11,2.780,18.60,1,1,4,2
"""


def mtcars():
    cols = ["mpg", "cyl", "disp", "hp", "drat", "wt", "qsec", "vs", "am", "gear", "carb"]
    rows = [line.split(",")[1:] for line in MTCARS.strip().splitlines()]
    return {c: [float(r[j]) for r in rows] for j, c in enumerate(cols)}


def synth_a(n=300, seed=11):
    """Continuous X, three mediators, continuous moderator W, a binary and a continuous covariate."""
    g = np.random.default_rng(seed)
    x = g.normal(3.4, 0.8, n)
    w = g.normal(3.0, 0.9, n)
    sex = (g.random(n) < 0.55).astype(float)
    age = np.round(g.normal(24, 4, n))
    xc, wc = x - 3.4, w - 3.0
    m1 = 1.2 + 0.45 * x + 0.15 * w - 0.25 * xc * wc + 0.1 * sex + g.normal(0, 0.7, n)
    m2 = 0.8 + 0.30 * x + 0.20 * w + 0.05 * xc * wc + g.normal(0, 0.8, n)
    m3 = 2.0 + 0.05 * x + 0.01 * age + g.normal(0, 0.8, n)
    y = 0.5 + 0.20 * x + 0.35 * m1 + 0.25 * m2 + 0.05 * m3 + 0.2 * w - 0.12 * xc * wc - 0.1 * sex + g.normal(0, 0.7, n)
    d = {"X": x, "W": w, "SEX": sex, "AGE": age, "M1": m1, "M2": m2, "M3": m3, "Y": y}
    d = {k: np.round(v, 4) for k, v in d.items()}
    # A few missing values to exercise listwise deletion.
    d["M2"] = d["M2"].astype(object)
    for i in (7, 101, 222):
        d["M2"][i] = None
    return {k: [None if v is None else float(v) for v in arr] for k, arr in d.items()}


def synth_b(n=200, seed=23):
    """Binary X (treatment), serial mediators, binary moderator G, one covariate, four mediators for model 4."""
    g = np.random.default_rng(seed)
    x = (g.random(n) < 0.5).astype(float)
    grp = (g.random(n) < 0.4).astype(float)
    cov = g.normal(0, 1, n)
    m1 = 2.5 + 0.6 * x + 0.3 * grp + 0.5 * x * grp + 0.2 * cov + g.normal(0, 1, n)
    m2 = 1.0 + 0.2 * x + 0.45 * m1 + g.normal(0, 1, n)
    m3 = 3.0 - 0.4 * x + g.normal(0, 1, n)
    m4 = 2.0 + 0.1 * x + 0.3 * cov + g.normal(0, 1, n)
    y = 1.0 + 0.1 * x + 0.4 * m1 + 0.3 * m2 + 0.25 * m3 + 0.05 * m4 + 0.15 * cov + g.normal(0, 1, n)
    d = {"T": x, "G": grp, "COV": cov, "M1": m1, "M2": m2, "M3": m3, "M4": m4, "Y": y}
    return {k: [float(v) for v in np.round(arr, 4)] for k, arr in d.items()}


DATASETS = {"mtcars": mtcars(), "synthA": synth_a(), "synthB": synth_b()}

CASES = [
    # Published anchors (R lm on mtcars): mpg ~ hp * wt, mpg ~ wt * am, mpg ~ wt + hp, mpg ~ wt.
    dict(id="mtcars-m1-hp-wt", data="mtcars", model=1, x="hp", w="wt", y="mpg", m=[], cov=[], center=False, probe="sd", conf=0.95, B=0, seed=1,
         published={"Y": {"const": 49.80842, "X": -0.12010, "W": -8.21662, "XW": 0.02785}, "r2": {"Y": 0.8848}}),
    dict(id="mtcars-m1-wt-am", data="mtcars", model=1, x="wt", w="am", y="mpg", m=[], cov=[], center=False, probe="sd", conf=0.95, B=0, seed=1,
         published={"Y": {"const": 31.4161, "X": -3.7859, "W": 14.8784, "XW": -5.2984}, "r2": {"Y": 0.8330}}),
    dict(id="mtcars-m4-wt-hp", data="mtcars", model=4, x="wt", w=None, y="mpg", m=["hp"], cov=[], center=False, probe="sd", conf=0.95, B=5000, seed=20261030,
         published={"Y": {"const": 37.22727, "X": -3.87783, "M1": -0.03177}, "total": {"const": 37.2851, "X": -5.3445}, "r2": {"Y": 0.8268, "total": 0.7528}}),
    dict(id="synthA-m4-parallel3-cov", data="synthA", model=4, x="X", w=None, y="Y", m=["M1", "M2", "M3"], cov=["SEX", "AGE"], center=False, probe="sd", conf=0.95, B=5000, seed=101),
    dict(id="synthA-m7-k2-centered-pct", data="synthA", model=7, x="X", w="W", y="Y", m=["M1", "M2"], cov=["SEX"], center=True, probe="pct", conf=0.95, B=5000, seed=202),
    dict(id="synthA-m1-centered-sd-cov-90", data="synthA", model=1, x="X", w="W", y="Y", m=[], cov=["SEX", "AGE"], center=True, probe="sd", conf=0.90, B=0, seed=1),
    dict(id="synthA-m1-uncentered", data="synthA", model=1, x="X", w="W", y="M1", m=[], cov=[], center=False, probe="pct", conf=0.95, B=0, seed=1),
    dict(id="synthB-m6-binaryX-cov", data="synthB", model=6, x="T", w=None, y="Y", m=["M1", "M2"], cov=["COV"], center=False, probe="sd", conf=0.95, B=5000, seed=303),
    dict(id="synthB-m7-binaryW", data="synthB", model=7, x="T", w="G", y="Y", m=["M1"], cov=["COV"], center=True, probe="sd", conf=0.95, B=5000, seed=404),
    dict(id="synthB-m4-four-99", data="synthB", model=4, x="T", w=None, y="Y", m=["M1", "M2", "M3", "M4"], cov=[], center=False, probe="sd", conf=0.99, B=2000, seed=505),
]


def mulberry32(seed):
    a = seed & 0xFFFFFFFF

    def nxt():
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = ((a ^ (a >> 15)) * (1 | a)) & 0xFFFFFFFF
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & 0xFFFFFFFF)) & 0xFFFFFFFF) ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return nxt


def ols(y, cols, conf):
    X = np.column_stack([np.ones(len(y))] + list(cols))
    b, *_ = np.linalg.lstsq(X, y, rcond=None)
    e = y - X @ b
    n, p = X.shape
    df = n - p
    mse = e @ e / df
    V = mse * np.linalg.inv(X.T @ X)
    se = np.sqrt(np.diag(V))
    t = b / se
    tc = stats.t.ppf(1 - (1 - conf) / 2, df)
    sst = ((y - y.mean()) ** 2).sum()
    r2 = 1 - (e @ e) / sst
    F = (r2 / (p - 1)) / ((1 - r2) / df)
    return dict(b=b, se=se, t=t, p=2 * stats.t.sf(np.abs(t), df), lo=b - tc * se, hi=b + tc * se, V=V, r2=r2, F=F,
                fp=stats.f.sf(F, p - 1, df), df1=p - 1, df2=df, tc=tc)


def setup(case):
    D = DATASETS[case["data"]]
    names = [case["x"], case["y"]] + case["m"] + ([case["w"]] if case["w"] else []) + case["cov"]
    arr = {k: np.array([np.nan if v is None else v for v in D[k]], float) for k in set(names)}
    ok = np.all([np.isfinite(arr[k]) for k in names], axis=0)
    a = {k: v[ok] for k, v in arr.items()}
    x, y = a[case["x"]], a[case["y"]]
    xbin = len(np.unique(x)) == 2
    w = a[case["w"]] if case["w"] else None
    wbin = w is not None and len(np.unique(w)) == 2
    mod = case["model"] in (1, 7)
    mx = x.mean() if case["center"] and mod and not xbin else 0.0
    mw = w.mean() if case["center"] and mod and w is not None and not wbin else 0.0
    xc = x - mx
    wc = w - mw if w is not None else None
    v = {"X": xc, "Y": y}
    for j, m in enumerate(case["m"]):
        v[f"M{j+1}"] = a[m]
    if w is not None:
        v["W"], v["XW"] = wc, xc * wc
    for j, c in enumerate(case["cov"]):
        v[f"C{j+1}"] = a[c]
    cv = [f"C{j+1}" for j in range(len(case["cov"]))]
    ms = [f"M{j+1}" for j in range(len(case["m"]))]
    model = case["model"]
    if model == 4:
        eqs = [(m, ["X"] + cv) for m in ms] + [("Y", ["X"] + ms + cv)]
    elif model == 6:
        eqs = [("M1", ["X"] + cv), ("M2", ["X", "M1"] + cv), ("Y", ["X", "M1", "M2"] + cv)]
    elif model == 1:
        eqs = [("Y", ["X", "W", "XW"] + cv)]
    else:
        eqs = [(m, ["X", "W", "XW"] + cv) for m in ms] + [("Y", ["X"] + ms + cv)]

    def probes(z, binary):
        if binary:
            return sorted(np.unique(z).tolist())
        if case["probe"] == "pct":
            return np.quantile(z, [0.16, 0.5, 0.84]).tolist()
        m, s = z.mean(), z.std(ddof=1)
        return [m - s, m, m + s]

    wOrig = probes(w, wbin) if w is not None else []
    return dict(n=int(ok.sum()), v=v, eqs=eqs, cv=cv, k=len(ms), xbin=xbin, wbin=wbin, mx=mx, mw=mw, w=w, x=x,
                wOrig=wOrig, wModel=[q - mw for q in wOrig], xOrig=probes(x, xbin))


def effects_from(S, case, coef, sdx, sdy):
    """Effects written out separately from the JS (explicit formulas per model)."""
    out = {}
    std = (lambda e: e / sdy) if S["xbin"] else (lambda e: e * sdx / sdy)
    model, k = case["model"], S["k"]
    if model in (4, 6):
        if model == 4:
            ind = [coef(f"M{j}", "X") * coef("Y", f"M{j}") for j in range(1, k + 1)]
        else:
            a1, a2, d21 = coef("M1", "X"), coef("M2", "X"), coef("M2", "M1")
            b1, b2 = coef("Y", "M1"), coef("Y", "M2")
            ind = [a1 * b1, a1 * d21 * b2, a2 * b2]
        for j, e in enumerate(ind, 1):
            out[f"ind:{j}"] = e
            out[f"std:{j}"] = std(e)
        if len(ind) > 1:
            out["ind:total"] = sum(ind)
            out["std:total"] = std(sum(ind))
            for i in range(len(ind)):
                for j in range(i + 1, len(ind)):
                    out[f"con:{i+1}-{j+1}"] = ind[i] - ind[j]
    if model == 7:
        for j in range(1, k + 1):
            a1, a3, b = coef(f"M{j}", "X"), coef(f"M{j}", "XW"), coef("Y", f"M{j}")
            out[f"imm:{j}"] = a3 * b
            for i, w in enumerate(S["wModel"]):
                out[f"cind:{j}:{i}"] = (a1 + a3 * w) * b
    return out


def boot(S, case, draw_idx, B):
    keys, draws, redraw = None, [], 0
    v, n = S["v"], S["n"]
    while len(draws) < B:
        idx = draw_idx()
        sol = {}
        okay = True
        for out, pred in S["eqs"]:
            X = np.column_stack([np.ones(n)] + [v[p][idx] for p in pred])
            if np.linalg.matrix_rank(X) < X.shape[1]:
                okay = False
                break
            sol[out] = dict(zip(["const"] + pred, np.linalg.lstsq(X, v[out][idx], rcond=None)[0]))
        if not okay:
            redraw += 1
            continue
        ef = effects_from(S, case, lambda e, p: sol[e][p], v["X"][idx].std(ddof=1), v["Y"][idx].std(ddof=1))
        keys = keys or list(ef)
        draws.append([ef[k] for k in keys])
    A = np.array(draws)
    lo = max(1, int(np.floor(B * (1 - case["conf"]) / 2 + 1e-9)))
    srt = np.sort(A, axis=0)
    return {k: dict(se=float(A[:, j].std(ddof=1)), lo=float(srt[lo - 1, j]), hi=float(srt[B - lo, j])) for j, k in enumerate(keys)}, redraw


def run(case):
    S = setup(case)
    v, conf = S["v"], case["conf"]
    res = {"n": S["n"], "eqs": {}, "change": {}}
    fits = {}
    for out, pred in S["eqs"]:
        f = ols(v[out], [v[p] for p in pred], conf)
        fits[out] = (["const"] + pred, f)
        res["eqs"][out] = dict(pred=["const"] + pred, b=f["b"].tolist(), se=f["se"].tolist(), t=f["t"].tolist(), p=f["p"].tolist(),
                               lo=f["lo"].tolist(), hi=f["hi"].tolist(), r2=f["r2"], F=f["F"], fp=f["fp"], df1=f["df1"], df2=f["df2"])
        if "XW" in pred:
            red = ols(v[out], [v[p] for p in pred if p != "XW"], conf)
            dr2 = f["r2"] - red["r2"]
            Fc = dr2 / ((1 - f["r2"]) / f["df2"])
            res["change"][out] = dict(dr2=dr2, F=Fc, p=float(stats.f.sf(Fc, 1, f["df2"])))
    if case["model"] in (4, 6):
        pred = ["X"] + S["cv"]
        f = ols(v["Y"], [v[p] for p in pred], conf)
        res["total"] = dict(b=f["b"].tolist(), se=f["se"].tolist(), p=f["p"].tolist(), r2=f["r2"])

    def coef(e, p):
        names, f = fits[e]
        return f["b"][names.index(p)]

    def cse(e, p):
        names, f = fits[e]
        return f["se"][names.index(p)]

    res["effects"] = effects_from(S, case, coef, S["x"].std(ddof=1), v["Y"].std(ddof=1))
    sob = {}

    def sobel(ea, pa, eb, pb):
        a, b, sa, sb = coef(ea, pa), coef(eb, pb), cse(ea, pa), cse(eb, pb)
        se = np.sqrt(b * b * sa * sa + a * a * sb * sb)
        z = a * b / se
        return dict(se=float(se), z=float(z), p=float(2 * stats.norm.sf(abs(z))))

    if case["model"] == 4:
        for j in range(1, S["k"] + 1):
            sob[str(j)] = sobel(f"M{j}", "X", "Y", f"M{j}")
    if case["model"] == 6:
        sob["1"] = sobel("M1", "X", "Y", "M1")
        sob["3"] = sobel("M2", "X", "Y", "M2")
    res["sobel"] = sob

    # Conditional effects and Johnson-Neyman from the closed form.
    res["cond"] = []
    for out, pred in S["eqs"]:
        if "XW" not in pred:
            continue
        names, f = fits[out]
        i1, i3 = names.index("X"), names.index("XW")
        b1, b3 = f["b"][i1], f["b"][i3]
        V = f["V"]
        rows = []
        for w in S["wModel"]:
            th = b1 + b3 * w
            se = np.sqrt(V[i1, i1] + w * w * V[i3, i3] + 2 * w * V[i1, i3])
            rows.append(dict(theta=th, se=se, p=float(2 * stats.t.sf(abs(th / se), f["df2"])), lo=th - f["tc"] * se, hi=th + f["tc"] * se))
        c = dict(out=out, wOrig=S["wOrig"], rows=rows)
        if not S["wbin"]:
            t2 = f["tc"] ** 2
            roots = np.roots([b3 * b3 - t2 * V[i3, i3], 2 * (b1 * b3 - t2 * V[i1, i3]), b1 * b1 - t2 * V[i1, i1]])
            roots = sorted(float(r.real) + S["mw"] for r in roots if abs(r.imag) < 1e-12)
            lo, hi = S["w"].min(), S["w"].max()
            c["jn"] = [r for r in roots if lo <= r <= hi]
            c["jnAll"] = roots
        res["cond"].append(c)

    if case["B"]:
        n = S["n"]
        rnd = mulberry32(case["seed"])
        res["bootExact"], res["redrawExact"] = boot(S, case, lambda: np.array([int(rnd() * n) for _ in range(n)]), case["B"])
        g = np.random.default_rng(case["seed"])
        res["bootIndep"], _ = boot(S, case, lambda: g.integers(0, n, n), case["B"])
    return res


def clean(o):
    if isinstance(o, dict):
        return {k: clean(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [clean(v) for v in o]
    if isinstance(o, (np.floating, np.integer)):
        return o.item()
    return o


if __name__ == "__main__":
    out = {"note": "Generated by scripts/process_reference.py (numpy %s, scipy). Do not edit by hand." % np.__version__,
           "datasets": DATASETS, "cases": []}
    for case in CASES:
        print("running", case["id"])
        out["cases"].append({"case": case, "ref": clean(run(case))})
    path = Path(__file__).parent / "fixtures" / "process-reference.json"
    path.write_text(json.dumps(clean(out), ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("wrote", path, path.stat().st_size, "bytes")
