// Checks the reliability tool src/tools/cronbach-alpha.html: alpha, Feldt interval, ML omega, SMC and the SPSS
// Item-Total columns against values computed independently (numpy / scipy.stats.f / scipy BFGS on the ML discrepancy,
// cross-checked with sklearn FactorAnalysis); odd paste formats; grouping by code prefix; reverse-coding and dropping;
// then the page itself in a tiny DOM (tables, chapter-4 paragraph, references, Word file).
// Run: node scripts/check-cronbach.mjs
import { readFileSync } from "node:fs";
const html = readFileSync(new URL("../src/tools/cronbach-alpha.html", import.meta.url), "utf8");
const page = readFileSync(new URL("../src/pages/cong-cu/cronbach-alpha.astro", import.meta.url), "utf8");
const block = html.split("//#ca-start")[1].split("//#ca-end")[0];
const CA = new Function(`${block}; return { parse, analyse, cellNum, makeGroups, stem, scaleReport, feldtCI, fQuantile, omegaML, alpha };`)();
let bad = 0;
const check = (ok, label) => { console.log(`${ok ? "ok  " : "FAIL"} ${label}`); if (!ok) bad++; };
const near = (got, want, tol, label) => check(Math.abs(got - want) <= tol, `${label}: ${typeof got === "number" ? got.toFixed(6) : got} (expected ${want})`);

// ---- F quantiles vs scipy.stats.f.ppf ----
[[0.975, 39, 117, 1.623553243862086], [0.025, 39, 117, 0.5756271808787303], [0.975, 9, 18, 2.929112493123264], [0.025, 9, 18, 0.27016213936232103],
 [0.975, 2, 4, 10.649110640673513], [0.5, 1, 1, 1], [0.995, 299, 2691, 1.2385571227496937]]
  .forEach(([p, a, b, want]) => near(CA.fQuantile(p, a, b), want, 1e-7 * Math.max(1, want), `F quantile p=${p}, df=(${a}, ${b}) as scipy`));

// ---- the multi-scale sample, every number against the Python reference ----
const sampleMulti = new Function(`${html.match(/const SAMPLE_MULTI=([\s\S]*?\.join\('\\n'\));/)[1].replace(/^/, "return ")}`)();
const p = CA.parse(sampleMulti);
check(p.names.join() === "GioiTinh,HL1,HL2,HL3,HL4,TC1,TC2,TC3,TC4,DU1,DU2,DU3" && p.removed.map(r => r.name).join() === "STT", `sample: STT removed, ${p.names.length} numeric columns kept`);
const G = CA.makeGroups(p.names, "");
check(G.groups.map(g => `${g.name}:${g.idx.length}`).join() === "HL:4,TC:4,DU:3" && G.singles.join() === "GioiTinh", `sample: grouped by prefix into HL, TC, DU; GioiTinh left alone (${G.groups.map(g => g.name)}; ${G.singles})`);
const rep = (g, o) => CA.scaleReport(p, G.groups.find(x => x.name === g), o);
const REF = {
  HL: { alpha: 0.741265, ci: [0.579931, 0.851065], aStd: 0.749788, rbar: 0.428294, omega: 0.769672, smc: [0.556813, 0.478324, 0.623582, 0.183557], citc: [0.723637, 0.521969, 0.709654, 0.253165], aid: [0.57621, 0.689729, 0.581209, 0.835526], sd: [0.916725, 1.009887, 0.938835, 1.01779] },
  HL_drop: { alpha: 0.835526, ci: [0.722058, 0.907498], omega: 0.842515, citc: [0.659327, 0.651482, 0.788722] },
  TC_raw: { alpha: 0.280558, ci: [-0.168053, 0.58587], omega: 0.571074, citc: [0.480662, 0.413632, -0.400235, 0.433197] },
  TC_rev: { alpha: 0.759137, ci: [0.608946, 0.861353], omega: 0.766808, citc: [0.618217, 0.569231, 0.400235, 0.667262], aid: [0.668376, 0.695945, 0.791379, 0.646328] },
  DU: { alpha: 0.820301, ci: [0.69633, 0.898935], omega: 0.825404, smc: [0.531005, 0.49488, 0.396571] },
};
const cmp = (r, ref, tag) => {
  near(r.alpha, ref.alpha, 1e-6, `${tag}: alpha`);
  near(r.ci[0], ref.ci[0], 1e-6, `${tag}: Feldt 95% lower`); near(r.ci[1], ref.ci[1], 1e-6, `${tag}: Feldt 95% upper`);
  near(r.omega.omega, ref.omega, 1e-5, `${tag}: omega (ML one-factor)`);
  for (const f of ["aStd", "rbar"]) if (ref[f] != null) near(r[f], ref[f], 1e-6, `${tag}: ${f}`);
  for (const f of ["smc", "citc", "aid", "sd"]) if (ref[f]) ref[f].forEach((v, j) => near(r.items[j][f], v, 1e-6, `${tag}: ${f} ${r.items[j].name}`));
};
const hl = rep("HL", {});
cmp(hl.first, REF.HL, "HL");
const hlD = rep("HL", { drop: ["hl4"] });
check(hlD.final && hlD.final.k === 3 && hlD.dropped.join() === "HL4" && hlD.first.alpha === hl.first.alpha, "HL: dropping hl4 (any case) keeps run 1 and adds run 2 with 3 items");
cmp(hlD.final, REF.HL_drop, "HL without HL4");
cmp(rep("TC", {}).first, REF.TC_raw, "TC, TC3 not recoded");
const tc = rep("TC", { reverse: ["TC3"] });
check(tc.range.join() === "1,5" && tc.reversed.join() === "TC3", `TC: TC3 recoded on the 1–5 range (${tc.range})`);
cmp(tc.first, REF.TC_rev, "TC, TC3 recoded");
near(rep("TC", { reverse: ["TC3"], range: "1-7" }).first.items[2].m, 8 - rep("TC", {}).first.items[2].m, 1e-12, "TC: recoding on 1–7 gives 8 − score");
cmp(rep("DU", {}).first, REF.DU, "DU");
// SPSS Scale Mean / Variance if Item Deleted = mean / variance of the total without that item
{ const rows = p.cells.map(r => G.groups[0].idx.map(j => r[j])), rest = rows.map(r => r[1] + r[2] + r[3]), m = rest.reduce((s, x) => s + x, 0) / rest.length;
  near(hl.first.items[0].smd, m, 1e-12, "scale mean if HL1 deleted"); near(hl.first.items[0].svd, rest.reduce((s, x) => s + (x - m) ** 2, 0) / (rest.length - 1), 1e-12, "scale variance if HL1 deleted"); }

// ---- 8 items on a 1–7 scale, n = 150 (fixture), against numpy / scipy / sklearn ----
{ const k8 = CA.parse(readFileSync(new URL("./fixtures/cronbach-k8.tsv", import.meta.url), "utf8"));
  check(k8.k === 8 && k8.rows.length === 150 && /^Biến 1$/.test(k8.names[0]), `k8 fixture: no header, 8 columns named Biến 1…8, 150 rows (${k8.k}, ${k8.rows.length})`);
  const g = CA.makeGroups(k8.names, ""); check(g.groups.length === 1 && g.groups[0].idx.length === 8, "k8: unnamed columns form one scale");
  const r = CA.scaleReport(k8, g.groups[0], {}).first;
  near(r.alpha, 0.810075, 1e-6, "k8: alpha"); near(r.ci[0], 0.76042, 1e-6, "k8: Feldt lower"); near(r.ci[1], 0.852786, 1e-6, "k8: Feldt upper");
  near(r.aStd, 0.806622, 1e-6, "k8: standardised alpha"); near(r.omega.omega, 0.824316, 1e-5, "k8: omega (scipy BFGS 0.824316, sklearn 0.824316)");
  [0.571067, 0.465531, 0.250854, 0.243432, 0.483165, 0.344653, 0.12511, 0.310677].forEach((v, j) => near(r.items[j].smc, v, 1e-6, `k8: squared multiple correlation item ${j + 1}`));
  check(r.omega.converged && !r.omega.heywood, `k8: ML converged in ${r.omega.iterations} iterations, no Heywood case`); }

// Omega edge cases: 2 items → undefined (Spearman–Brown instead); a near-perfect item → Heywood flag.
{ const two = CA.analyse(["A", "B"], [[1, 2], [2, 2], [3, 4], [4, 5], [5, 4]]);
  check(Number.isNaN(two.omega.omega) && Math.abs(two.sb - 2 * 0.8249579113843054 / (1 + 0.8249579113843054)) < 1e-9, `2 items: omega undefined, Spearman–Brown ${two.sb.toFixed(4)}`);
  const rows = Array.from({ length: 30 }, (_, i) => { const t = (i * 7) % 5 + 1, u = (i * 3) % 5 + 1; return [t, t, Math.min(5, Math.max(1, t + ((i % 3) - 1))), Math.min(5, Math.max(1, Math.round((t + u) / 2)))]; });
  const hw = CA.analyse(["A", "B", "C", "D"], rows);
  check(hw.omega.heywood && Number.isFinite(hw.omega.omega) && hw.omega.omega <= 1, `identical items A and B: Heywood case flagged, omega ${hw.omega.omega.toFixed(3)} stays finite`); }

// ---- odd paste formats ----
{ const spss = CA.parse("HL1\tHL2\tHL3\n4\t.\t5\n3\t3\t4\n5\t4\t5\n2\t2\t\n4\t5\t4\n");
  check(spss.k === 3 && spss.cells.length === 5 && Number.isNaN(spss.cells[0][1]) && spss.rows.length === 3, `SPSS "." and an empty cell are missing, not text (${spss.k} columns, ${spss.rows.length} complete rows)`); }
{ const csv = CA.parse('"HL1","HL2","HL3"\n"3,5","4","4,5"\n"2,5","3","3"\n"4","4,5","5"\n');
  check(csv.k === 3 && csv.rows[0].join() === "3.5,4,4.5" && csv.sep === "dấu phẩy", `quoted CSV with decimal commas inside quotes (${csv.rows[0]})`); }
{ const semi = CA.parse("\uFEFFHL1;HL2;HL3\r\n3,5;4;4,5\r\n2,5;3;3\r\n");
  check(semi.k === 3 && semi.rows[1].join() === "2.5,3,3" && semi.sep === "dấu chấm phẩy", "Excel VN CSV: BOM, CRLF, semicolons, decimal commas"); }
{ const gf = CA.parse("Dấu thời gian\tHL1\tHL2\tHL3\n2026/10/01 10:00:00\tĐồng ý\tHoàn toàn đồng ý\tTrung lập\n2026/10/01 10:05:00\tKhông đồng ý\tĐồng ý\tĐồng ý\n2026/10/01 10:09:00\tHoàn toàn không đồng ý\tKhông đồng ý\tbình thường\n");
  check(gf.k === 3 && gf.labelScale === 5 && gf.rows.map(r => r.join("")).join("|") === "453|244|123" && gf.removed[0]?.name === "Dấu thời gian", `Google Forms 5-point labels mapped to 1–5, timestamp dropped (${gf.rows.map(r => r.join("")).join("|")})`); }
{ const g7 = CA.parse("A\tB\tC\nHơi đồng ý\tĐồng ý\tHoàn toàn đồng ý\nTrung lập\tHơi không đồng ý\tKhông đồng ý\nHoàn toàn không đồng ý\tĐồng ý\tHơi đồng ý\n");
  check(g7.labelScale === 7 && g7.rows.map(r => r.join("")).join("|") === "567|432|165", `7-point labels: "hơi" switches to 1–7 (${g7.rows.map(r => r.join("")).join("|")})`); }
{ const m = CA.parse("A\tB\tC\n4\t99\t5\n3\t3\t4\n5\t4\t-9\n2\t2\t3\n", { missing: [99, -9] });
  check(m.rows.length === 2 && Number.isNaN(m.cells[0][1]) && Number.isNaN(m.cells[2][2]), "user-missing codes 99 and −9 become blanks"); }
{ const noHeadLabels = CA.parse("Đồng ý\tĐồng ý\tTrung lập\nKhông đồng ý\tĐồng ý\tĐồng ý\nTrung lập\tKhông đồng ý\tKhông đồng ý\n");
  check(noHeadLabels.rows.length === 3 && noHeadLabels.names[0] === "Biến 1", "a first row of answer labels is data, not a header"); }

// review round 2: Google Forms headers carrying a code are shortened to the code (tables stay readable, Loại/Đảo work)
{ const gfh = CA.parse("HL1. Tôi hài lòng với dịch vụ\tHL2. Tôi sẽ quay lại\tHL3: Tôi giới thiệu cho bạn bè\tGiới tính\n4\t5\t4\t1\n3\t3\t2\t2\n5\t4\t5\t1\n");
  check(gfh.names.join() === "HL1,HL2,HL3,Giới tính", `long coded headers shortened to codes (${gfh.names})`);
  const dup = CA.parse("A1. câu một\tA1. câu một lặp\n1\t2\n2\t3\n");
  check(dup.names[0].startsWith("A1. "), "duplicate codes keep the full header"); }

// ---- per-scale listwise: a blank in one scale does not cost a respondent in another (as SPSS RELIABILITY) ----
{ const t = "A1\tA2\tA3\tB1\tB2\tB3\n4\t4\t5\t\t3\t2\n3\t3\t3\t4\t4\t4\n5\t4\t4\t2\t2\t3\n2\t2\t3\t3\t3\t3\n4\t5\t4\t5\t4\t5\n";
  const q = CA.parse(t), g = CA.makeGroups(q.names, "");
  const [a, b] = g.groups.map(x => CA.scaleReport(q, x, {}));
  check(a.n === 5 && b.n === 4 && b.missing === 1 && q.rows.length === 4, `listwise per scale: A keeps 5 respondents, B 4 (${a.n}, ${b.n})`); }

// ---- names → scales ----
const stems = { HL1: "HL", HL_2: "HL", "hl 3": "hl", HL04: "HL", HL5R: "HL", HL6_r: "HL", "Q1_1": "Q1", "Q1_12": "Q1", "TC.3": "TC", "Hài lòng 2": "Hài lòng", "HL1. Tôi hài lòng với dịch vụ": "HL", "Mức độ đồng ý [Nhân viên thân thiện]": "Mức độ đồng ý", Tuoi: "Tuoi" };
for (const [n, s] of Object.entries(stems)) check(CA.stem(n) === s, `stem("${n}") = "${CA.stem(n)}" (expected "${s}")`);
{ const names = ["Câu 1", "Câu 2", "Câu 3", "Câu 4", "Câu 5", "Câu 6", "GT"];
  const g = CA.makeGroups(names, "Hài lòng: Câu 1-Câu 3\nTin cậy = Câu 4 đến Câu 6\nGT, Câu 9");
  check(g.groups.map(x => `${x.name}:${x.idx.join("")}`).join("|") === "Hài lòng:012|Tin cậy:345" && g.singles.join() === "GT" && g.unknown.join() === "Câu,9", `declared groups with ranges ("-", "đến") and names with spaces (${g.groups.map(x => `${x.name}:${x.idx.join("")}`).join("|")}; unknown ${g.unknown})`);
  const g2 = CA.makeGroups(["HL1", "HL2", "HL3", "TC1", "TC2"], "hl1 hl2 hl3\nTC1;TC2");
  check(g2.groups.map(x => `${x.name}:${x.idx.length}`).join() === "HL:3,TC:2" && !g2.unknown.length, "declared groups without a name, case-insensitive, space or semicolon separated"); }

// ---- the page in a tiny DOM ----
function mountPage() {
  const els = {}, handlers = {}, blobs = [];
  for (const m of html.matchAll(/<(input|select|textarea|div|button)\b([^>]*)\bid="([^"]+)"/g)) {
    const id = m[3], sel = m[1] === "select" ? html.split(`id="${id}"`)[1].match(/<option value="([^"]*)"/)[1] : "";
    els[id] = { id, value: sel, innerHTML: "", textContent: "", innerText: "", addEventListener(ev, fn) { handlers[id + ":" + ev] = fn; } };
  }
  const document = { getElementById: id => els[id], createElement: () => ({ click() {}, remove() {} }), body: { appendChild() {} } };
  class Blob { constructor(parts) { blobs.push(parts.join("")); } }
  const URL = { createObjectURL: () => "blob:x", revokeObjectURL() {} };
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  new Function("document", "Blob", "URL", "navigator", "getSelection", "setTimeout", script)(document, Blob, URL, {}, () => ({}), () => {});
  const click = (id, ev = {}) => handlers[id + ":click"](ev);
  const act = (a, item) => click("ca-out", { target: { closest: () => ({ dataset: { act: a, item } }) } });
  return { els, click, act, blobs, change: id => handlers[id + ":change"]() };
}
const strip = s => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");
const P = mountPage(), out = () => P.els["ca-out"].innerHTML, th = () => P.els["ca-thesis"].innerHTML;
check(/gom thành 3 thang đo/.test(out()) && /Không tính cho GioiTinh/.test(out()) && /cột STT/.test(out()), "page loads the questionnaire sample: 3 scales, GioiTinh and STT explained");
check(/Bảng tổng hợp/.test(out()) && (out().match(/class="ca-scale"/g) || []).length === 3, "page: summary table and one section per scale");
check(out().includes("0,741") && out().includes("[0,580; 0,851]") && out().includes("0,770"), "page: HL alpha 0,741, Feldt [0,580; 0,851], omega 0,770 in decimal commas");
check(/TC3 có tương quan biến–tổng âm/.test(out()) && /data-act="rev" data-item="TC3"/.test(out()), "page: TC3 flagged as an unrecoded reverse item, with a one-click recode");
P.act("rev", "TC3");
check(P.els["ca-rev"].value === "TC3" && out().includes("0,759") && /Đã đảo điểm TC3 theo thang 1–5/.test(out()), "page: one click recodes TC3 and alpha becomes 0,759");
P.act("drop", "HL4");
check(P.els["ca-drop"].value === "HL4" && /Thang đo HL \(lần 2, sau khi loại biến\)/.test(out()) && out().includes("0,836") && /Đưa HL4 trở lại/.test(out()), "page: one click drops HL4, run 2 shows alpha 0,836 with an undo button");
const t1 = strip(th());
check(/Kết quả lần 1 cho hệ số Cronbach's alpha = 0,741; biến HL4 có tương quan biến – tổng hiệu chỉnh 0,253 \(nhỏ hơn 0,3\) và nếu loại thì alpha tăng lên 0,836/.test(t1) && /Kết quả lần 2 với 3 biến còn lại cho alpha = 0,836 \(KTC 95%: \[0,722; 0,907\]\), omega = 0,843/.test(t1), "chapter text reports run 1 → run 2 for HL with CI and omega");
check(/TC3 là câu đảo chiều nên được mã hoá lại \(6 − điểm\)/.test(t1), "chapter text says TC3 was recoded as 6 − score");
check(/cả 3 thang đo đều đạt độ tin cậy sau khi loại 1 biến; 10 biến quan sát được giữ lại/.test(t1), `chapter text concludes 3 scales reliable, 10 items kept`);
// every in-text citation has a reference entry and vice versa
{ const body = t1.split("Tài liệu tham khảo")[0], refs = t1.split("Tài liệu tham khảo")[1];
  const cites = { "Cronbach, 1951": "Cronbach, L. J.", "Feldt và cộng sự": "Feldt, L. S.", "Hayes & Coutts": "Hayes, A. F.", "Nunnally, 1978": "Nunnally, J. C. (1978)", "Nunnally & Bernstein": "Nunnally, J. C., & Bernstein", "Hair và cộng sự": "Hair, J. F.", "Tavakol & Dennick": "Tavakol, M.", "Eisinga": "Eisinga, R." };
  for (const [c, r] of Object.entries(cites)) check(body.includes(c) === refs.includes(r), `citation "${c}" ${body.includes(c) ? "is listed" : "is not cited and not listed"}`); }
P.act("undrop", "HL4");
check(P.els["ca-drop"].value === "" && !/lần 2/.test(out()), "page: undo puts HL4 back");
P.els["ca-dec"].value = "."; P.change("ca-dec");
check(out().includes("0.741") && out().includes("[0.580, 0.851]") && !/0,741/.test(out()) && /alpha từ 0.7 trở lên/.test(strip(th())), "page: English decimal point switches every number, including thresholds in the text");
P.els["ca-dec"].value = ","; P.change("ca-dec");
P.click("ca-word");
const doc = P.blobs.at(-1) || ""; if (process.env.DBG) console.log(doc);
check(/Bảng 4\.1\. Tổng hợp/.test(doc) && /thang đo TC: alpha = 0,759/.test(doc) && /Tài liệu tham khảo/.test(doc) && /charset="utf-8"/.test(doc) && !/class="flag/.test(doc) && !/<button/.test(doc), "Word file: summary table, item tables, chapter text, references; no buttons or flags");
// one scale, declared groups, errors
P.click("ca-sample");
check(/gom thành 1 thang đo/.test(out()) && !/Bảng tổng hợp/.test(out()) && /HL5 có tương quan biến–tổng âm/.test(out()), "page: single-scale sample, no summary table, HL5 reverse hint");
P.els["ca-data"].value = "Câu 1\tCâu 2\tCâu 3\tCâu 4\n4\t4\t2\t2\n3\t3\t4\t5\n5\t4\t1\t2\n2\t2\t4\t4\n4\t5\t2\t1\n";
P.els["ca-groups"].value = "Hài lòng: Câu 1-Câu 2\nRời bỏ: Câu 3, Câu 4"; P.click("ca-run");
check(/Thang đo Hài lòng/.test(out()) && /Thang đo Rời bỏ/.test(out()) && /Spearman-Brown/.test(out()) && /Eisinga/.test(strip(th())), "page: declared names used; 2-item scales get Spearman–Brown and the Eisinga reference");
P.els["ca-groups"].value = ""; P.els["ca-data"].value = "Tuổi\tGiới tính\n20\t1\n30\t2\n"; P.click("ca-run");
check(/Không có nhóm nào đủ 2 biến/.test(out()) && th() === "", "page: no scale → clear message, no chapter text");
P.els["ca-data"].value = Array.from({ length: 6 }, (_, i) => Array.from({ length: 14 }, (_, j) => ((i * 3 + j * 2) % 5) + 1).join("\t")).join("\n").replace(/^/, Array.from({ length: 14 }, (_, j) => `Q${j + 1}`).join("\t") + "\n"); P.click("ca-run");
check(/có hơn 12 biến/.test(out()), "page: 14 items under one prefix → warned it may mix constructs");

// review round 1: demographics sharing a code, unrecoded item inside omega, Excel's trailing empty columns
P.els["ca-data"].value = "TT1\tTT2\tTT3\tHL1\tHL2\tHL3\t\t\n" + [[1, 3, 5, 4, 4, 5], [2, 1, 2, 3, 3, 3], [1, 6, 4, 5, 5, 4], [2, 2, 1, 2, 2, 3], [1, 4, 3, 4, 5, 4], [2, 5, 2, 3, 2, 2]].map(r => r.join("\t") + "\t\t").join("\n"); P.click("ca-run");
check(/điểm cao nhất rất khác nhau \(TT1: 2, TT2: 6, TT3: 5\)/.test(out()) && !/Đã bỏ cột/.test(out()), "page: TT1–TT3 (gender, age band, income) sharing a code are flagged; trailing empty Excel columns dropped silently");
P.click("ca-sample-multi");
check(/TC3 có hệ số tải âm trong mô hình một nhân tố, nên omega chưa có ý nghĩa/.test(out()), "page: omega of a scale with an unrecoded item is marked as meaningless until recoded");
P.act("rev", "TC3");
check(!/hệ số tải âm/.test(out()), "page: …and the note goes once TC3 is recoded");

// ---- the guide page: references with verified DOIs (api.crossref.org), thresholds consistent with the tool ----
for (const doi of ["10.1007/BF02310555", "10.1177/014662168701100107", "10.1080/19312458.2020.1718629", "10.5116/ijme.4dfb.8dfd", "10.1007/s00038-012-0416-3", "10.1007/s11165-016-9602-2"])
  check(page.includes(`https://doi.org/${doi}`), `guide page lists doi ${doi}`);
check(/0,90/.test(page) && !/Trên 0,95/.test(page), "guide page: Tavakol & Dennick's 0,90 ceiling, as the tool says");

if (bad) { console.error(`${bad} check(s) failed`); process.exit(1); }
console.log("all Cronbach checks passed");
