// Unit check for the research-model drawer (src/tools/ve-mo-hinh.html): its statistics block is the
// sample-size calculator's, its concept search ranks like the questionnaire kit, and the pure model
// helpers (arrow list parser, layers, layout, hypotheses, sample size, kit link) behave.
import { readFileSync, readdirSync } from "node:fs";

const block = (src, tag) => {
  const m = src.match(new RegExp(`//#${tag}-start([\\s\\S]*?)//#${tag}-end`));
  if (!m) throw new Error(`missing //#${tag} block`);
  return m[1];
};
const norm = s => s.split(String.fromCharCode(13)).join("").trim();
const src = readFileSync("src/tools/ve-mo-hinh.html", "utf8");
const calcSrc = readFileSync("src/tools/tinh-co-mau.html", "utf8");
const kitSrc = readFileSync("src/tools/bo-khao-sat.html", "utf8");
let failed = 0,
  passed = 0;
const check = (ok, label, quiet = false) => {
  if (!ok || !quiet) console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failed++;
  else passed++;
};

check(norm(block(src, "math")) === norm(block(calcSrc, "math")), "math block matches tinh-co-mau.html");

const api = new Function(
  `${block(src, "math")}${block(src, "search")}${block(src, "model")}
   return { codeFrom, addNode, addEdge, removeNode, findNode, parseArrows, edgesToText, inDegree, maxArrows, backEdges, layersOf, layout, lcFirst, hypotheses, modelSample, kitQuery, rankConstructs, indexConstruct, citeOf, regN, isrN };`
)();
const kit = new Function(`${block(kitSrc, "math")}${block(kitSrc, "kit")} return { rankConstructs, indexConstruct, kitSample, citeOf };`)();

// ---- search ranks exactly like the kit on the whole library ----
const scales = readdirSync("src/content/thang-do")
  .filter(f => f.endsWith(".json") && !f.startsWith("_"))
  .map(f => ({ slug: f.slice(0, -5), ...JSON.parse(readFileSync(`src/content/thang-do/${f}`, "utf8")) }));
const all = scales.flatMap(s => s.constructs.map(c => ({ s, c })));
const idxA = all.map(x => api.indexConstruct(x.s, x.c)),
  idxK = all.map(x => kit.indexConstruct(x.s, x.c));
const queries = ["trust", "hai long", "y dinh su dung", "ý định mua", "dễ sử dụng", "perceived usefulness", "eWOM", "căng thẳng", "lãnh đạo chuyển đổi", "niềm tin", "rủi ro", "giá trị cảm nhận", "gắn kết", "xyzzy"];
for (const q of queries) check(JSON.stringify(api.rankConstructs(q, idxA, 8)) === JSON.stringify(kit.rankConstructs(q, idxK, 8)), `search "${q}" ranks like the kit`);
const top = all[api.rankConstructs("perceived usefulness", idxA, 1)[0]];
check(top && top.c.code === "PU", `"perceived usefulness" finds PU first (got ${top && top.s.slug}:${top && top.c.code})`);
for (const x of all) check(api.citeOf(x.c.source) === kit.citeOf(x.c.source), `${x.s.slug}:${x.c.code} citation like the kit`, true);

// ---- codes and nodes ----
check(api.codeFrom("Stress") === "STR" && api.codeFrom("Niềm tin") === "NT", "one word: first three letters; two words: initials");
check(api.codeFrom("Trải nghiệm livestream bán hàng") === "TNLBH", "several words: initials");
check(api.codeFrom("PU") === "PU" && api.codeFrom("eWOM") === "EWO", "an upper-case code is kept");
const m0 = { nodes: [], edges: [] };
api.addNode(m0, "Nhận thức sự hữu ích", "tam:PU", "PU");
api.addNode(m0, "Hiệu quả mong đợi", "utaut:PE", "PU");
check(m0.nodes[1].id === "PU2", "a clashing code gets a number");
check(api.addNode(m0, "Nhận thức sự hữu ích", "tam:PU", "PU") === m0.nodes[0] && m0.nodes.length === 2, "the same library construct is not added twice");

// ---- arrow list ----
const m1 = { nodes: [], edges: [] };
api.addNode(m1, "Nhận thức tính dễ sử dụng", "tam:PEOU", "PEOU");
api.addNode(m1, "Nhận thức sự hữu ích", "tam:PU", "PU");
api.addNode(m1, "Ý định sử dụng", "tam:BI", "BI");
let r = api.parseArrows("PEOU -> PU\npu, peou → BI\n# ghi chú\nRủi ro cảm nhận -> BI (-)\nnhận thức sự hữu ích => BI\nPU -> PU\nchỉ một dòng", m1);
r.edges.forEach(e => api.addEdge(m1, e.from, e.to, e.sign));
check(m1.edges.length === 4, `four distinct arrows (got ${m1.edges.length}: ${api.edgesToText(m1).replace(/\n/g, "; ")})`);
check(m1.nodes.some(n => n.name === "Rủi ro cảm nhận" && n.id === "RRCN" && !n.key), "an unknown name becomes a free-text construct");
check(m1.edges.find(e => e.from === "RRCN").sign === -1, "(-) marks a negative arrow");
check(r.errors.length === 2 && /chính nó/.test(r.errors[0]) && /A -> B/.test(r.errors[1]), `self-loop and malformed line reported (${r.errors.join(" | ")})`);
const chain = { nodes: [], edges: [] };
r = api.parseArrows("X -> M -> Y\nX -> Y : -", chain);
r.edges.forEach(e => api.addEdge(chain, e.from, e.to, e.sign));
check(api.edgesToText(chain) === "X -> M\nM -> Y\nX -> Y (-)", `chain and ": -" parse (got ${api.edgesToText(chain).replace(/\n/g, "; ")})`);
const round = { nodes: chain.nodes.map(n => ({ ...n })), edges: [] };
api.parseArrows(api.edgesToText(chain), round).edges.forEach(e => api.addEdge(round, e.from, e.to, e.sign));
check(api.edgesToText(round) === api.edgesToText(chain), "edgesToText round-trips through parseArrows");

// ---- structure, layout ----
const { layer } = api.layersOf(m1);
check(layer.get("PEOU") === 0 && layer.get("PU") === 1 && layer.get("BI") === 2 && layer.get("RRCN") === 1, "layers: cause left, mediator middle, outcome right; a lone cause sits next to its effect");
const mx = api.maxArrows(m1);
check(mx.max === 3 && mx.at[0] === "BI", "max arrows into one construct: BI gets 3");
const L = api.layout(m1, { measure: t => t.length * 7 });
const boxes = [...L.box.values()];
let overlap = false;
for (const a of boxes) for (const b of boxes) if (a !== b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) overlap = true;
check(!overlap, "layout: no two boxes overlap");
check(boxes.every(b => b.x >= 0 && b.y >= 0 && b.x + b.w <= L.width && b.y + b.h <= L.height), "layout: every box inside the canvas");
check(L.paths.every(p => p.segs[0][0][0] < p.segs[p.segs.length - 1][3][0]), "layout: every arrow runs left to right");
// The PEOU -> BI arrow skips the PU column and must not cut through the PU or RRCN boxes.
const skip = L.paths[m1.edges.findIndex(e => e.from === "PEOU" && e.to === "BI")];
const midBoxes = boxes.filter(b => b.col === 1);
const samples = skip.segs.flatMap(s => Array.from({ length: 21 }, (_, k) => k / 20).map(t => [0, 1].map(i => (1 - t) ** 3 * s[0][i] + 3 * (1 - t) ** 2 * t * s[1][i] + 3 * (1 - t) * t * t * s[2][i] + t ** 3 * s[3][i])));
check(!samples.some(([x, y]) => midBoxes.some(b => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h)), "layout: an arrow skipping a column bends around its boxes");
const cyc = { nodes: [], edges: [] };
api.parseArrows("A -> B\nB -> C\nC -> A", cyc).edges.forEach(e => api.addEdge(cyc, e.from, e.to, e.sign));
check(api.backEdges(cyc).size === 1 && [...api.backEdges(cyc)][0] === 2, "a loop is found and the closing arrow marked");
const Lc = api.layout(cyc, {});
check(Lc.paths[2].back && Lc.height > Math.max(...[...Lc.box.values()].map(b => b.y + b.h)), "the closing arrow is drawn under the diagram");
const big = { nodes: [], edges: [] };
api.parseArrows("A1, A2, A3, A4, A5, A6 -> M1, M2\nM1, M2 -> Y\nA1 -> Y", big).edges.forEach(e => api.addEdge(big, e.from, e.to, e.sign));
const Lb = api.layout(big, { measure: t => t.length * 7 });
const bb = [...Lb.box.values()];
let ov2 = false;
for (const a of bb) for (const b of bb) if (a !== b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) ov2 = true;
check(!ov2 && Lb.paths.every(p => p.segs.flat().every(([x, y]) => x >= 0 && y >= 0 && x <= Lb.width && y <= Lb.height)), "a 9-construct model fits the canvas without overlaps");

// ---- hypotheses ----
check(api.lcFirst("Ý định sử dụng") === "ý định sử dụng" && api.lcFirst("eWOM tích cực") === "eWOM tích cực" && api.lcFirst("COVID lo âu") === "COVID lo âu", "lower-cases a name mid-sentence, not an acronym");
const hs = api.hypotheses(m1);
check(hs[0].text === "Nhận thức tính dễ sử dụng (PEOU) có tác động cùng chiều đến nhận thức sự hữu ích (PU).", `H1 text (${hs[0].text})`);
const neg = hs.find(h => /RRCN/.test(h.text) && h.edge != null);
check(neg && /ngược chiều đến ý định sử dụng \(BI\)\.$/.test(neg.text), "negative arrow reads 'ngược chiều'");
const med = hs.filter(h => h.mediator);
check(med.length === 1 && med[0].text === "Nhận thức sự hữu ích (PU) đóng vai trò trung gian trong mối quan hệ giữa nhận thức tính dễ sử dụng (PEOU) và ý định sử dụng (BI).", `one mediation hypothesis (${med.map(h => h.text).join(" | ")})`);
check(api.hypotheses(m1, { mediation: false }).length === 4 && hs.map(h => h.h).join() === "1,2,3,4,5", "numbering H1..H5 continues into mediation");

// ---- sample size is the kit's PLS-SEM rule ----
for (let a = 1; a <= 8; a++) {
  const m = { nodes: [], edges: [] };
  const srcs = Array.from({ length: a }, (_, i) => `X${i + 1}`).join(", ");
  api.parseArrows(`${srcs} -> Y`, m).edges.forEach(e => api.addEdge(m, e.from, e.to, e.sign));
  const s = api.modelSample(m), k = kit.kitSample("pls", a, 1);
  check(s.arrows === a && s.pow === k.pow && s.isr === k.second && s.min === k.min, `${a} arrows: ${s.min} like the kit (G*Power ${s.pow}, ISR ${s.isr})`, a > 2);
}
check(api.modelSample({ nodes: [{ id: "A", name: "A" }], edges: [] }) === null, "no arrows, no sample size");

// ---- kit link ----
const q = new URLSearchParams(api.kitQuery(m1).slice(1));
check(q.get("c") === "tam:PEOU,tam:PU,tam:BI" && q.get("a") === "3" && q.get("m") === "pls" && q.get("dv") === "tam:BI", `kit link carries library constructs, arrows and DV (${api.kitQuery(m1)})`);
const keys = new Set(scales.flatMap(s => s.constructs.map(c => `${s.slug}:${c.code}`)));
check(q.get("c").split(",").every(k => keys.has(k)), "kit link keys exist in the scale library");
check(/else if\(qs\.get\('c'\)\)/.test(kitSrc) && /qs\.get\('dv'\)/.test(kitSrc) && /qs\.get\('a'\)/.test(kitSrc), "the kit still reads ?c=, ?a= and ?dv=");
check(api.kitQuery({ nodes: [{ id: "A", name: "A", key: null }], edges: [] }) === "", "no library construct, no kit link");

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
