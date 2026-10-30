// Unit check for the result doctor (src/tools/bac-si-ket-qua.html): run `node scripts/check-doctor.mjs`.
// Loads the code between //#doctor-start and //#doctor-end and checks number parsing, the SPSS / SmartPLS table reader,
// the diagnosis rules (reverse coding before deletion, item-removal limits, sample-size CTA only when the sample is short),
// the integrity guard rails, the change log and chapter paragraph, and every reference against Crossref metadata saved in
// scripts/fixtures/doctor-crossref.json. `--online` looks every DOI up on api.crossref.org again and rewrites the fixture.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const src = readFileSync("src/tools/bac-si-ket-qua.html", "utf8");
const block = src.split("//#doctor-start")[1]?.split("//#doctor-end")[0];
if (!block) { console.log("FAIL: markers //#doctor-start, //#doctor-end not found"); process.exit(1); }
const T = new Function(`${block}; return { CTA_URL, REFS, ETHICS, ACT, num, rowOf, stem, parseOutput, analyzeRot, requiredN, diagnose, changeLog, chapterText, keyOf };`)();

let fails = 0, n = 0;
const ok = (cond, msg) => { n++; if (!cond) { fails++; console.log(`FAIL ${msg}`); } };
const near = (got, want, msg, tol = 1e-9) => ok(Number.isFinite(got) && Math.abs(got - want) <= tol, `${msg}: got ${got}, want ${want}`);

// ---- numbers as SPSS and SmartPLS print them ----
for (const [s, v] of [[".812", 0.812], [",812", 0.812], ["0,812", 0.812], ["0.812", 0.812], [".712a", 0.712], ["-.124", -0.124], ["−0,124", -0.124], [".000b", 0], ["1,234.5", 1234.5], ["1.234,5", 1234.5], ["812.334", 812.334], ["56,7%", 56.7], ["3", 3], ["1,232", 1232], ["0,05", 0.05]])
  near(T.num(s), v, `num("${s}")`);
ok(T.num("<.001") < 0.001 && T.num("<.001") > 0, "num('<.001') is below .001");
for (const s of ["", "HL1", "Sig.", "a.", "(Constant)", "1/2"]) ok(Number.isNaN(T.num(s)), `num("${s}") is not a number`);
ok(T.stem("HL1") === "HL" && T.stem("TC_3") === "TC" && T.stem("pu 12") === "pu" && T.stem("YD") === "YD", "code prefixes");

// ---- SPSS output pasted as text (tab-separated, as SPSS copies it) ----
const spss = src.match(/const EX_SPSS=\[([\s\S]*?)\]\.join\('\\n'\);/);
ok(spss, "EX_SPSS example present");
const exSpss = new Function(`return [${spss[1]}].join('\\n')`)();
const P = T.parseOutput(exSpss);
ok(P.scales.length === 1 && P.scales[0].name === "HL" && P.scales[0].k === 5, `one scale HL with 5 items, got ${JSON.stringify(P.scales.map(s => [s.name, s.k]))}`);
near(P.scales[0].alpha, 0.642, "HL alpha");
near(P.scales[0].items[4].citc, -0.124, "HL5 corrected item-total");
near(P.scales[0].items[4].aid, 0.781, "HL5 alpha if deleted");
near(P.efa.kmo, 0.684, "KMO"); near(P.efa.bartP, 0, "Bartlett sig");
ok(P.efa.extracted === 4 && P.efa.eig1 === 4, `4 factors extracted, got ${P.efa.extracted}`); near(P.efa.variance, 63.476, "cumulative extraction %");
ok(P.efa.rows.length === 13 && P.efa.nf === 4, `13 rotated rows, 4 components (got ${P.efa.rows.length}, ${P.efa.nf})`);
near(P.reg.r2, 0.182, "R square"); near(P.reg.adj, 0.165, "adjusted R square"); near(P.reg.fP, 0, "ANOVA sig");
ok(P.reg.dv === "YD", "dependent variable from footnote");
ok(P.reg.coefs.map(c => c.name).join() === "HL,TC,DU", `coefficients without constant: ${P.reg.coefs.map(c => c.name)}`);
near(P.reg.coefs[1].beta, 0.107, "TC beta"); near(P.reg.coefs[1].p, 0.188, "TC sig"); near(P.reg.coefs[2].vif, 1.267, "DU VIF");
const R = T.analyzeRot(P.efa.rows);
ok(R.cross.map(x => x.name).join() === "HL4,DU3", `cross-loadings HL4, DU3 (Howard .40-.30-.20), got ${R.cross.map(x => x.name)}`);
ok(R.neg.map(x => x.name).join() === "HL5", "negative loading HL5");
ok(R.split.some(s => s.stem === "HL" && s.factors.join() === "1,4"), "HL split across factors 1 and 4");

// The same tables copied without tabs (from Word or a PDF): space-separated rows.
const spaced = ["Item-Total Statistics", "Scale Mean if Item Deleted  Scale Variance if Item Deleted  Corrected Item-Total Correlation  Cronbach's Alpha if Item Deleted", "TC1 10.2 4.1 ,512 ,702", "TC2 10.4 4.3 ,601 ,655", "TC3 10.1 4.0 ,233 ,781", "", "KMO and Bartlett's Test", "Kaiser-Meyer-Olkin Measure of Sampling Adequacy. ,471", "Sig. ,062", "", "Descriptive Statistics", "N Minimum Maximum Mean Std. Deviation Skewness Kurtosis", "YD1 200 1 5 4,61 ,62 -2,41 ,17 7,90 ,34", "Valid N (listwise) 200"].join("\n");
const Q = T.parseOutput(spaced);
ok(Q.scales.length === 1 && Q.scales[0].name === "TC" && Q.scales[0].items.length === 3, "space-separated Item-Total read");
near(Q.scales[0].items[2].citc, 0.233, "TC3 citc (space-separated)");
near(Q.efa.kmo, 0.471, "KMO (space-separated)"); near(Q.efa.bartP, 0.062, "Bartlett (space-separated)");
near(Q.norm.skew, 2.41, "max |skewness|"); near(Q.norm.kurt, 7.9, "max |kurtosis|");

// ---- SmartPLS 4 tables ----
const pls = src.match(/const EX_PLS=\[([\s\S]*?)\]\.join\('\\n'\);/);
const exPls = new Function(`return [${pls[1]}].join('\\n')`)();
const S = T.parseOutput(exPls);
ok(S.pls.constructs.length === 3, "three constructs");
near(S.pls.constructs[1].ave, 0.452, "TC AVE"); near(S.pls.constructs[1].cr, 0.801, "TC CR (rho_c, not rho_a)"); near(S.pls.constructs[1].alpha, 0.701, "TC alpha");
const hy = S.pls.htmt.find(h => (h.a === "YD" && h.b === "HL") || (h.a === "HL" && h.b === "YD"));
ok(hy && Math.abs(hy.v - 0.913) < 1e-9 && S.pls.htmt.length === 3, `HTMT matrix read (${JSON.stringify(S.pls.htmt)})`);
ok(S.pls.loadings.length === 5 && S.pls.loadings.find(l => l.name === "TC4").v === 0.498, "outer loadings matrix");
const tcp = S.reg.coefs.find(c => c.name === "TC -> YD");
ok(tcp && tcp.beta === 0.081 && tcp.p === 0.22 && tcp.vif === 1.601, `path TC -> YD with p and inner VIF: ${JSON.stringify(tcp)}`);
const L = T.parseOutput("Heterotrait-monotrait ratio (HTMT) - List\n\tHeterotrait-monotrait ratio (HTMT)\nTC <-> HL\t0.861\nYD <-> TC\t0.402");
ok(L.pls.htmt.length === 2 && L.pls.htmt[0].a === "TC" && L.pls.htmt[0].v === 0.861, "HTMT list format");
ok(T.parseOutput("chỉ là một đoạn chữ\nkhông có bảng").found.length === 0, "plain text: nothing recognised");

// ---- diagnosis rules ----
const base = { ctx: { n: 250, target: 200, items: 15, method: "reg", origin: "translated", reverse: "unknown", channel: "targeted", screened: "yes" } };
const D = inp => T.diagnose({ ...base, ...inp, ctx: { ...base.ctx, ...(inp.ctx || {}) } });
const keys = f => f.actions.map(a => a.key);

// Negative item-total correlation: reverse coding first, never deletion.
let r = D({ scales: [{ name: "HL", k: 5, alpha: 0.642, items: [{ name: "HL1", citc: 0.56, aid: 0.51 }, { name: "HL5", citc: -0.124, aid: 0.781 }] }] });
let f = r.findings.find(x => x.id.startsWith("rel-neg"));
ok(f && f.sev === 3 && keys(f)[0] === "reverse" && !keys(f).includes("drop"), `negative CITC: reverse first, no deletion (${f && keys(f)})`);
// Low alpha, 5 items: deletion of the weakest item allowed, after checks, with ≥ 3 items left.
r = D({ scales: [{ name: "TC", k: 5, alpha: 0.62, items: [{ name: "TC1", citc: 0.5, aid: 0.55 }, { name: "TC3", citc: 0.18, aid: 0.68 }] }] });
f = r.findings.find(x => x.id === "rel-TC");
ok(f && f.sev === 2 && keys(f).indexOf("reverse") < keys(f).indexOf("drop") && keys(f).indexOf("entry") < keys(f).indexOf("drop"), `low α: checks before deletion (${f && keys(f)})`);
ok(keys(f).at(-1) === "limit", "reporting as limitation is offered last");
let drop = f.actions.find(a => a.key === "drop");
ok(/TC3/.test(drop.title) && /còn 4 biến/.test(drop.report), "drop names TC3 and the 4 items left");
// Three items: deletion refused.
r = D({ scales: [{ name: "DU", k: 3, alpha: 0.55, items: [{ name: "DU2", citc: 0.12, aid: 0.7 }] }] });
drop = r.findings[0].actions.find(a => a.key === "drop");
ok(r.findings[0].sev === 3 && /Không nên loại/.test(drop.title), "3-item scale: no deletion");
// Already shortened scale: deletion still possible but flagged for supervisor approval.
r = D({ scales: [{ name: "PU", k: 4, k0: 5, alpha: 0.66, items: [{ name: "PU4", citc: 0.2, aid: 0.69 }] }] });
ok(/đã bị loại 1 biến/.test(r.findings[0].actions.find(a => a.key === "drop").how), "previous deletions are disclosed");
// Deleting an item that does not raise alpha: content reason only.
r = D({ scales: [{ name: "PE", k: 6, alpha: 0.74, items: [{ name: "PE2", citc: 0.25, aid: 0.73 }] }] });
ok(r.findings[0].sev === 1 && /không cao hơn α hiện tại/.test(r.findings[0].actions.find(a => a.key === "drop").how), "acceptable α: deletion optional, no gain flagged");
r = D({ scales: [{ name: "SI", k: 4, alpha: 0.97, items: [] }] });
ok(r.findings[0] && /cao bất thường/.test(r.findings[0].title), "α > .95 flagged as redundancy");
r = D({ scales: [{ name: "AB", k: 2, alpha: 0.65, items: [] }] });
ok(/Spearman–Brown/.test(r.findings[0].meaning), "two-item scale: Spearman–Brown");
// EFA
r = D({ efa: { kmo: 0.47, bartP: 0.2 } });
ok(r.findings.find(x => x.id === "kmo").sev === 3 && r.findings.find(x => x.id === "bartlett").sev === 3, "KMO < .5 and Bartlett n.s. are serious");
r = D({ efa: { kmo: 0.684 } });
ok(!r.findings.some(x => x.id === "kmo"), "KMO .684: no finding");
r = D({ efa: { expected: 3, extracted: 4, rows: P.efa.rows } });
ok(r.findings.some(x => x.id === "nfactors") && r.findings.some(x => x.id === "efa-neg") && r.findings.some(x => x.id === "efa-cross"), "factor count, negative and cross-loadings found");
ok(r.findings.find(x => x.id === "nfactors").actions.some(a => a.key === "parallel"), "parallel analysis offered");
r = D({ efa: { variance: 46.2 } });
ok(r.findings[0].sev === 1, "variance < 50%: note only");
// PLS
r = D({ ctx: { method: "pls", n: 200 }, pls: { constructs: [{ name: "TC", alpha: 0.7, cr: 0.801, ave: 0.452 }], htmt: [{ a: "HL", b: "YD", v: 0.913 }, { a: "HL", b: "TC", v: 0.86 }, { a: "TC", b: "YD", v: 0.5 }], loadings: [{ name: "TC4", v: 0.38 }] } });
ok(r.findings.find(x => x.id === "ave-TC").sev === 1, "AVE .45 with CR .80: lenient Fornell–Larcker note");
ok(r.findings.find(x => x.id === "htmt-HL-YD").sev === 3 && r.findings.find(x => x.id === "htmt-HL-TC").sev === 2 && !r.findings.some(x => x.id === "htmt-TC-YD"), "HTMT .913 serious, .86 warning, .50 fine");
ok(r.findings.find(x => x.id === "ol").sev === 2, "outer loading < .40");
// Regression
const coefs = [{ h: "H1", name: "HL", sign: "+", beta: 0.34, p: 0.0001, vif: 1.2 }, { h: "H2", name: "TC", sign: "+", beta: 0.11, p: 0.188, vif: 6.2 }, { h: "H3", name: "DU", sign: "+", beta: -0.21, p: 0.01, vif: 1.3 }];
r = D({ reg: { r2: 0.06, fP: 0, dv: "YD", coefs } });
f = r.findings.find(x => x.id === "ns");
ok(f && f.sev === 1 && /Giả thuyết H2 \(TC → YD\) không được ủng hộ \(β = 0,110; p = 0,188\)/.test(f.template[0]), `not-supported template: ${f && f.template}`);
ok(keys(f)[0] === "notsupported" && !keys(f).includes("more"), "enough sample: no 'collect more' for a non-significant result");
ok(r.findings.find(x => x.id === "vif").sev === 2, "VIF 6.2 flagged");
ok(r.findings.find(x => x.id === "sign").actions.some(a => a.key === "sign"), "significant wrong sign flagged");
ok(r.findings.find(x => x.id === "r2").sev === 1, "low R²: note");
ok(!r.cta, "no CTA when the sample is adequate");
// Sample short: CTA with the shortfall, and only then.
r = D({ ctx: { n: 142, target: 200 }, reg: { coefs } });
ok(r.cta && r.cta.shortfall === 58 && r.cta.need === 200, `shortfall 58 to the planned 200 (${JSON.stringify(r.cta)})`);
ok(r.findings[0].id === "sample" && r.findings[0].sev === 3, "sample shortfall listed first");
ok(r.findings.find(x => x.id === "ns").actions.some(a => a.key === "more"), "underpowered non-significance offers more data");
ok(/dừng tuỳ ý/.test(r.findings[0].actions.find(a => a.key === "more").when), "collect-more warns against optional stopping");
r = D({ ctx: { n: 120, target: NaN, method: "pls", items: 12 } });
ok(r.need === 155 && r.cta.shortfall === 35, "PLS-SEM inverse square root minimum 155");
r = D({ ctx: { n: 90, target: NaN, items: 30 }, reg: { coefs: coefs.slice(0, 2) } });
ok(r.need === 150 && r.rules.length === 2, "EFA 5 × 30 = 150 beats Green 104 + 2");
// Data context
r = D({ ctx: { reverse: "yes-not" } });
ok(r.findings[0].id === "revctx" && r.findings[0].sev === 3, "declared unrecoded reverse items: serious");
r = D({ ctx: { channel: "open", screened: "no" }, scales: [{ name: "A", k: 4, alpha: 0.65, items: [] }] });
ok(r.findings.some(x => x.id === "screen") && r.findings.find(x => x.id === "rel-A").actions.some(a => a.key === "quality"), "open link, unscreened: quality screening offered");
r = D({ norm: { skew: 2.4, kurt: 3 } });
ok(r.findings[0].id === "norm" && r.findings[0].actions.some(a => a.key === "robust"), "strong skew: bootstrap, residuals");
r = D({ norm: { skew: 0.8, kurt: 1, normP: 0.001 } });
ok(r.findings[0].id === "normtest" && r.findings[0].sev === 0, "significant normality test only: information");
r = D({ cmb: { harman: 54.2, fullVif: 3.6 } });
ok(r.findings.length === 2, "Harman > 50% and full VIF > 3.3");
ok(D({}).findings.length === 0, "nothing entered: nothing found");

// ---- every action is complete, ordered and cited; nothing suggests changing data ----
const all = [];
const big = D({ ctx: { n: 100, target: 300, channel: "open", screened: "no", reverse: "yes-not", method: "reg" }, scales: [{ name: "X", k: 5, alpha: 0.5, items: [{ name: "X1", citc: -0.1 }] }, { name: "Y", k: 5, alpha: 0.65, items: [{ name: "Y2", citc: 0.2, aid: 0.7 }] }, { name: "Z", k: 3, alpha: 0.6, items: [{ name: "Z1", citc: 0.1 }] }, { name: "W", k: 4, alpha: 0.98, items: [] }], efa: { kmo: 0.45, bartP: 0.3, expected: 3, extracted: 2, variance: 40, cross: "A1", low: "B2", neg: "C3" }, pls: { constructs: [{ name: "K", ave: 0.3, cr: 0.55 }, { name: "M", ave: 0.6, cr: 0.97 }], htmt: [{ a: "K", b: "M", v: 0.95 }], loadings: [{ name: "K1", v: 0.3 }] }, reg: { r2: 0.05, fP: 0.3, coefs }, norm: { skew: 3, kurt: 9 }, cmb: { harman: 60, fullVif: 4 } });
for (const f of big.findings) for (const a of f.actions) all.push([f, a]);
ok(big.findings.length >= 25, `large case gives many findings (${big.findings.length})`);
for (const [f, a] of all) {
  ok(a.title && a.how && a.when && a.effect && a.report && a.refs.length, `${f.id}/${a.key}: what, when, effect, report, refs all filled`);
  ok(a.refs.every(k => T.REFS[k]), `${f.id}/${a.key}: references exist`);
  ok(!/undefined|NaN|\[object/.test(a.title + a.how + a.when + a.effect + a.report + a.say), `${f.id}/${a.key}: no undefined/NaN in text`);
}
for (const f of big.findings) {
  ok(f.actions.every((a, i, arr) => i === 0 || arr[i - 1].order <= a.order), `${f.id}: actions in order`);
  ok(!/undefined|NaN/.test(f.title + f.evidence + f.meaning), `${f.id}: no undefined/NaN`);
  if (f.cta) ok(big.cta, `${f.id}: CTA only with a sample shortfall`);
}
ok(big.findings.every((f, i, a) => i === 0 || a[i - 1].sev >= f.sev), "findings sorted by severity");
// Guard rails: no option text proposes editing, imputing, generating responses or trying deletions until it passes.
const BAD = /(điền (thêm|bù) (giá trị|câu trả lời|điểm)|nội suy|tạo (thêm )?dữ liệu|sinh dữ liệu|thử (loại|xoá) (đến|tới|cho tới) khi|đổi phương pháp để|chỉnh (số|điểm) (cho|để))/i;
for (const [f, a] of all) ok(!BAD.test(a.title + " " + a.how), `${f.id}/${a.key}: no data-altering suggestion`);
ok(T.ETHICS.length >= 4 && T.ETHICS.every(x => x.refs.length && x.refs.every(k => T.REFS[k])), "integrity warnings cite sources");
ok(["fanelli", "simmons", "kerr", "john"].every(k => T.ETHICS.some(x => x.refs.includes(k))), "fabrication, p-hacking, HARKing, QRP sources cited");
ok(big.refs.every(k => T.REFS[k]), "used references exist");

// ---- change log and chapter paragraph ----
r = D({ ctx: { n: 142, target: 200, channel: "open", screened: "no" }, scales: [{ name: "HL", k: 5, alpha: 0.642, items: [{ name: "HL5", citc: -0.124, aid: 0.781 }] }], reg: { dv: "YD", coefs } });
const fh = r.findings.find(x => x.id.startsWith("rel-neg"));
const done = { [T.keyOf(fh, fh.actions[0])]: { after: "α tăng từ 0,642 lên 0,781" } };
const log = T.changeLog(r, done);
ok(log.some(x => /mã hoá ngược/.test(x.action) && x.after === "α tăng từ 0,642 lên 0,781" && /Weijters/.test(x.refs)), "change log row for the reverse-coding step");
ok(log.some(x => /Chưa thay đổi/.test(x.action)), "unaddressed findings stay in the log");
ok(log.every((x, i) => x.step === i + 1), "log rows numbered");
const para = T.chapterText(r, done, { ctx: { n: 142, channel: "open" } }).join(" ");
ok(/142 phiếu hợp lệ/.test(para) && /mã hoá lại/.test(para) && /0,781/.test(para) && /không được ủng hộ/.test(para) && /hạn chế/.test(para), `chapter paragraph: ${para.slice(0, 200)}…`);
const none = T.chapterText(r, {}, { ctx: { n: 142 } }).join(" ");
ok(/Không có thay đổi nào/.test(none), "nothing ticked: paragraph says nothing was changed");

// ---- page: CTA link, guide length, links ----
ok(T.CTA_URL === "https://geniusdata.io/signup?ref=lab-tool&next=%2Fapp%2Fforms&utm_source=goc-nghien-cuu&utm_medium=tool&utm_campaign=ai-lab&utm_content=bac-si-ket-qua", "CTA URL");
ok((src.match(/href="\$\{CTA_URL\}" rel="sponsored noopener"/g) || []).length >= 2 && (src.match(/\(link giới thiệu\)/g) || []).length >= 2, "CTA links are rel=sponsored and labelled");
const page = readFileSync("src/pages/cong-cu/bac-si-ket-qua.astro", "utf8");
const guide = page.split('<Fragment slot="guide">')[1]?.split("</Fragment>")[0] ?? "";
const words = guide.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").split(/\s+/).filter(w => /[\p{L}\d]/u.test(w)).length;
ok(words >= 700 && words <= 900, `guide has ${words} words (700–900)`);
ok(!/href="\/goc-nghien-cuu\//.test(src + guide), "no hard-coded base path in links");
const rel = [...(src + guide).matchAll(/href="(\.\.\/[^"#]+)"/g)].map(m => new URL(m[1], "https://x/cong-cu/bac-si-ket-qua/").pathname.slice(1));
ok(rel.length >= 3, `relative links found (${rel.length})`);
for (const m of rel.map(p => [null, p])) {
  const p = m[1].replace(/\/$/, "");
  const exists = p.startsWith("posts/") ? existsSync(`src/content/posts/${p.slice(6)}.md`) || existsSync(`src/content/posts/${p.slice(6)}.mdx`) : existsSync(`src/pages/${p}.astro`) || existsSync(`src/pages/${p}/index.astro`);
  ok(exists, `link target exists: /${p}`);
}

// ---- references against Crossref ----
const FX = "scripts/fixtures/doctor-crossref.json";
const fold = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "").toLowerCase();
if (process.argv.includes("--online")) {
  const out = {};
  for (const [k, ref] of Object.entries(T.REFS)) {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(ref.doi)}`, { headers: { "user-agent": "goc-nghien-cuu reference check" } });
    if (!res.ok) { ok(false, `${k}: DOI ${ref.doi} not on Crossref (HTTP ${res.status})`); continue; }
    const m = (await res.json()).message;
    out[ref.doi] = { family: m.author?.[0]?.family ?? "", authors: m.author?.length ?? 0, year: (m["published-print"] ?? m["published-online"] ?? m.issued)["date-parts"][0][0], volume: m.volume ?? "", page: m.page ?? m["article-number"] ?? "", title: String(m.title?.[0] ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() };
  }
  writeFileSync(FX, JSON.stringify(out, null, 1) + "\n");
  console.log(`Crossref: ${Object.keys(out).length} DOIs saved to ${FX}`);
}
const fx = JSON.parse(readFileSync(FX, "utf8"));
for (const [k, ref] of Object.entries(T.REFS)) {
  const m = fx[ref.doi];
  if (!m) { ok(false, `${k}: DOI ${ref.doi} missing from ${FX} (run with --online)`); continue; }
  const t = fold(ref.text);
  ok(t.includes(`(${m.year})`), `${k}: Crossref year ${m.year} in reference`);
  ok(t.startsWith(fold(m.family).split(/\s+/)[0]), `${k}: first author ${m.family}`);
  ok(fold(ref.cite).startsWith(fold(m.family).split(/\s+/)[0]) && ref.cite.endsWith(String(m.year)), `${k}: in-text citation ${ref.cite}`);
  ok(!m.volume || t.includes(`, ${m.volume}</em>`), `${k}: volume ${m.volume}`);
  const first = String(m.page).split("-")[0];
  ok(!first || t.includes(first), `${k}: first page ${first}`);
  const alnum = x => fold(x).replace(/<[^>]+>/g, "").replace(/[^a-z0-9]/g, "");
  const title = alnum(m.title.replace(/^statistics notes:\s*/i, ""));
  ok(alnum(t).includes(title.slice(0, 25)), `${k}: title "${m.title.slice(0, 40)}"`);
}
const usedKeys = new Set([...src.matchAll(/REFS\.(\w+)\.cite|ref:'(\w+)'|refs:\[([^\]]*)\]|cite\(\[([^\]]*)\]/g)].flatMap(m => (m[1] || m[2] ? [m[1] || m[2]] : (m[3] || m[4]).match(/\w+/g) || [])));
for (const k of Object.keys(T.REFS)) ok(usedKeys.has(k), `${k}: reference is used somewhere`);

console.log(`${n - fails}/${n} checks passed`);
if (fails) process.exit(1);
