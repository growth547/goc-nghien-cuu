// Unit check for the research-model drawer (src/tools/ve-mo-hinh.html): its statistics block is the
// sample-size calculator's, its concept search ranks like the questionnaire kit, and the pure model
// helpers (arrow list parser, layers, layout, hypotheses, sample size, kit link), the canvas editor's
// pure parts (graph edits, undo/redo, geometry, warnings, link format) and the extended models (higher-order
// constructs, moderation, multigroup comparison, control variables) behave.
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
   return { codeFrom, addNode, addEdge, removeNode, findNode, parseArrows, edgesToText, inDegree, maxArrows, backEdges, layersOf, layout, lcFirst, hypotheses, modelSample, kitQuery, rankConstructs, indexConstruct, citeOf, regN, isrN,
     GRID, BOX_W, snapTo, hasPos, boxOf, overlaps, freeSpot, autoArrange, placeNew, boundsOf, fitView, zoomAt, borderPoint, quadAt, routeEdge, routeAll, edgeIndex, nodesInRect,
     removeNodes, removeEdge, toggleSign, reverseEdge, moveEdge, moveNodes, renameNode, recodeNode, modelWarnings, packModel, unpackModel, createHistory,
     predictorsOf, hNumbers, controlsOf, incN, regPower, tidy, makeHoc, attachChild, detachChild, ungroupHoc, setHocMode, setCtrl, arrangeChildren, hocLinks, childrenOf,
     addMod, removeMod, toggleModDir, modRoutes, setMga, mgaPaths, toggleMgaPath, parseGroups };`
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
check(/else if\(qs\.get\('c'\)/.test(kitSrc) && /qs\.get\('dv'\)/.test(kitSrc) && /qs\.get\('a'\)/.test(kitSrc), "the kit still reads ?c=, ?a= and ?dv=");
check(api.kitQuery({ nodes: [{ id: "A", name: "A", key: null }], edges: [] }) === "", "no library construct, no kit link");


// ---- canvas editor: graph edits ----
const tam = () => {
  const m = { nodes: [], edges: [] };
  api.parseArrows("PEOU -> PU\nPU -> BI\nPEOU -> BI", m).edges.forEach(e => api.addEdge(m, e.from, e.to, e.sign));
  return m;
};
const g1 = tam();
api.removeNodes(g1, ["PU"]);
check(g1.nodes.map(n => n.id).join() === "PEOU,BI" && api.edgesToText(g1) === "PEOU -> BI", "deleting a construct drops its arrows");
const g2 = tam();
check(api.toggleSign(g2, 1) === -1 && g2.edges[1].sign === -1 && api.toggleSign(g2, 1) === 1, "toggleSign flips + and −");
check(api.toggleSign(g2, 9) === 0, "toggleSign on a missing arrow does nothing");
check(api.reverseEdge(g2, 0) === "reversed" && api.edgesToText(g2).split("\n")[0] === "PU -> PEOU", "reverseEdge turns an arrow around");
api.addEdge(g2, "BI", "PU");
check(api.reverseEdge(g2, 1) === "exists" && g2.edges[1].from === "PU", "reverseEdge refuses when the opposite arrow exists");
const g3 = tam();
check(api.moveEdge(g3, 2, -1) && api.edgesToText(g3) === "PEOU -> PU\nPEOU -> BI\nPU -> BI" && !api.moveEdge(g3, 0, -1), "moveEdge reorders arrows (and so H numbers)");
check(api.removeEdge(g3, 0) && g3.edges.length === 2 && !api.removeEdge(g3, 5), "removeEdge");
check(api.renameNode(g3, "BI", "  Ý định   tiếp tục sử dụng ") && g3.nodes.find(n => n.id === "BI").name === "Ý định tiếp tục sử dụng" && !api.renameNode(g3, "BI", "  "), "renameNode trims and refuses an empty name");
check(api.recodeNode(g3, "BI", "CI") === "" && g3.edges.every(e => e.to !== "BI") && g3.edges.some(e => e.to === "CI"), "recodeNode renames the code in every arrow");
check(/đã dùng/.test(api.recodeNode(g3, "CI", "pu")) && /bắt đầu bằng chữ/.test(api.recodeNode(g3, "CI", "1X")) && api.recodeNode(g3, "CI", "CI") === "", "recodeNode refuses a taken or malformed code");
const g4 = tam();
g4.nodes.forEach((n, i) => { n.x = i * 10; n.y = 0; });
api.moveNodes(g4, ["PU", "BI"], 20, -40);
check(g4.nodes.map(n => `${n.x},${n.y}`).join(" ") === "0,0 30,-40 40,-40", "moveNodes moves only the chosen constructs");

// ---- hypotheses follow the edits ----
const g5 = tam();
api.toggleSign(g5, 0);
const h5 = api.hypotheses(g5);
check(/ngược chiều đến nhận thức sự hữu ích \(PU\)\.$/.test(h5[0].text) || /ngược chiều đến PU\.$/.test(h5[0].text), `a flipped arrow reads 'ngược chiều' (${h5[0].text})`);
check(h5.filter(h => h.mediator === "PU").length === 1 && h5.map(h => h.h).join() === "1,2,3,4", "TAM: three direct and one mediation hypothesis");
api.moveEdge(g5, 2, -1);
check(api.hypotheses(g5)[1].text === "PEOU có tác động cùng chiều đến BI.", "moving an arrow up renumbers its hypothesis");

// ---- warnings: cycles, isolated constructs, too few items ----
const w1 = { nodes: [], edges: [] };
api.parseArrows("A -> B\nB -> C\nC -> A", w1).edges.forEach(e => api.addEdge(w1, e.from, e.to, e.sign));
api.addNode(w1, "Đứng riêng", null, "D");
const ws = api.modelWarnings(w1, { itemsOf: n => ({ A: 2, B: 5 })[n.id] ?? null });
check(ws.some(w => w.kind === "cycle" && /C → A/.test(w.text)), "warning: the loop C → A");
check(ws.some(w => w.kind === "lone" && w.ids.join() === "D"), "warning: the isolated construct D");
check(ws.some(w => w.kind === "items" && w.ids.join() === "A" && /A \(2 biến\)/.test(w.text)), "warning: A has fewer than 3 items, B does not");
check(api.modelWarnings(tam(), { itemsOf: () => 4 }).length === 0, "no warnings for TAM with 4-item scales");
check(api.modelWarnings({ nodes: [{ id: "A", name: "A" }], edges: [] }).length === 0, "a single construct is not flagged as isolated");
// The library itself: warnings use the real item counts.
const pu = all.find(x => x.s.slug === "tam" && x.c.code === "PU");
check(pu && pu.c.items.length >= 3, "TAM PU has at least 3 items in the library");

// ---- undo / redo ----
const H = api.createHistory(3);
H.reset("a");
check(!H.canUndo() && !H.canRedo() && H.undo() === null, "fresh history: nothing to undo");
H.push("b"); H.push("c");
check(!H.push("c"), "pushing the same snapshot twice is a no-op");
check(H.undo() === "b" && H.undo() === "a" && H.undo() === null && H.redo() === "b", "undo walks back, redo forward");
H.push("x");
check(!H.canRedo() && H.list.join() === "a,b,x", "a new edit after undo drops the redo branch");
H.push("y");
check(H.list.join() === "b,x,y" && H.undo() === "x", "history keeps at most the limit");
// Undo/redo over real edits, as the page does it.
const ed = tam(), hist = api.createHistory();
api.placeNew(ed, {});
hist.reset(api.packModel(ed));
api.toggleSign(ed, 0); hist.push(api.packModel(ed));
api.removeNodes(ed, ["PU"]); hist.push(api.packModel(ed));
let back = api.unpackModel(hist.undo());
check(back.nodes.length === 3 && back.edges[0].sign === -1, "undo brings a deleted construct back with its arrows");
back = api.unpackModel(hist.undo());
check(back.edges.every(e => e.sign === 1), "undo again restores the original sign");
check(api.unpackModel(hist.redo()).edges[0].sign === -1, "redo replays the sign change");

// ---- link / storage format ----
const s1 = tam();
s1.nodes[0].key = "tam:PEOU";
api.placeNew(s1, {});
api.toggleSign(s1, 2);
const packed = api.packModel(s1);
const s2 = api.unpackModel(packed, k => keys.has(k));
check(api.packModel(s2) === packed && s2.nodes[0].key === "tam:PEOU" && s2.nodes.every(api.hasPos), "pack → unpack round-trips codes, names, keys, signs and positions");
check(api.unpackModel(packed, () => false).nodes[0].key === null, "an unknown library key is dropped on load");
const v1 = api.unpackModel('{"n":[["PU","Nhận thức sự hữu ích","tam:PU"],["BI","Ý định"]],"e":[["PU","BI",-1],["PU","ZZ"],"rác"]}');
check(v1.nodes.length === 2 && v1.edges.length === 1 && v1.edges[0].sign === -1 && !v1.nodes.some(api.hasPos), "an old link (no positions) still loads; bad arrows are skipped");
check(api.placeNew(v1, {}) === 2 && v1.nodes.every(api.hasPos) && v1.nodes[0].x < v1.nodes[1].x, "constructs without positions get the layered layout");
check(api.unpackModel("{}").nodes.length === 0 && api.unpackModel('{"n":[["A","A"],["A","trùng"]]}').nodes.length === 1, "empty and duplicate entries are tolerated");

// ---- geometry ----
const R = (x, y, w = 176, h = 46) => ({ x, y, w, h });
const a = R(0, 0), b = R(400, 0), mid = R(200, -10, 60, 66);
const bp = api.borderPoint(a, 1000, 23);
check(Math.abs(bp[0] - 176) < 1e-9 && Math.abs(bp[1] - 23) < 1e-9, "borderPoint: a ray to the right leaves through the right side");
const straight = api.routeEdge(a, b, []);
check(straight.off === 0 && /^M176\.0,23\.0 L400\.0,23\.0$/.test(straight.d), `routeEdge: straight between borders when clear (${straight.d})`);
const around = api.routeEdge(a, b, [mid]);
check(around.off !== 0 && around.hits === 0 && /Q/.test(around.d), `routeEdge: curves around a box in the way (offset ${around.off})`);
const inside = Array.from({ length: 25 }, (_, i) => api.quadAt(around.p0, around.c, around.p1, i / 24)).some(([x, y]) => x > mid.x && x < mid.x + mid.w && y > mid.y && y < mid.y + mid.h);
check(!inside, "routeEdge: the curve does not cut the box");
const pair = { nodes: [{ id: "A", name: "A", x: 0, y: 0 }, { id: "B", name: "B", x: 400, y: 0 }], edges: [] };
api.addEdge(pair, "A", "B"); api.addEdge(pair, "B", "A");
const bx = new Map(pair.nodes.map(n => [n.id, api.boxOf(n)]));
const [r1, r2] = api.routeAll(pair, bx);
check(Math.abs(r1.label[1] - r2.label[1]) > 20, "A → B and B → A are drawn apart, labels do not overlap");
const onBorder = (p, r) => (Math.abs(p[0] - r.x) < 0.01 || Math.abs(p[0] - r.x - r.w) < 0.01) && p[1] >= r.y - 0.01 && p[1] <= r.y + r.h + 0.01 || (Math.abs(p[1] - r.y) < 0.01 || Math.abs(p[1] - r.y - r.h) < 0.01) && p[0] >= r.x - 0.01 && p[0] <= r.x + r.w + 0.01;
check(onBorder(r1.p1, bx.get("B")) && onBorder(r1.p0, bx.get("A")) && onBorder(around.p1, b), "arrows start and end on the box borders");
const crowd = { nodes: [{ id: "A", name: "A", x: 0, y: 0 }, { id: "B", name: "B", x: 0, y: 200 }, { id: "C", name: "C", x: 400, y: 0 }, { id: "D", name: "D", x: 400, y: 200 }], edges: [] };
api.addEdge(crowd, "A", "D"); api.addEdge(crowd, "B", "C");
const cr = api.routeAll(crowd, new Map(crowd.nodes.map(n => [n.id, api.boxOf(n)])));
check(Math.abs(cr[0].label[0] - cr[1].label[0]) >= 44 || Math.abs(cr[0].label[1] - cr[1].label[1]) >= 24, `crossing arrows keep their H labels apart (${cr.map(r => r.label.map(v => v.toFixed(0))).join(" / ")})`);
const fv = api.fitView({ x: 100, y: 50, w: 800, h: 300 }, 600, 400, 40);
const sx = v => v * fv.k + fv.x, sy = v => v * fv.k + fv.y;
check(sx(100) >= 39.9 && sx(900) <= 560.1 && sy(50) >= 39.9 && sy(350) <= 360.1, `fitView puts the whole model inside the frame (k=${fv.k.toFixed(3)})`);
check(api.fitView(null, 600, 400).k === 1 && api.fitView({ x: 0, y: 0, w: 10, h: 10 }, 600, 400).k === 1.25, "fitView: empty model at 100%, tiny model capped at 125%");
const v0 = { k: 1, x: 30, y: -20 }, zv = api.zoomAt(v0, 2, 300, 200);
check(Math.abs((300 - v0.x) / v0.k - (300 - zv.x) / zv.k) < 1e-9 && Math.abs((200 - v0.y) / v0.k - (200 - zv.y) / zv.k) < 1e-9 && zv.k === 2, "zoomAt keeps the point under the cursor still");
check(api.zoomAt({ k: 2.4, x: 0, y: 0 }, 2, 0, 0).k === 2.5 && api.zoomAt({ k: 0.3, x: 0, y: 0 }, 0.1, 0, 0).k === 0.25, "zoom is clamped to 25%–250%");
const spot = api.freeSpot([R(0, 0), R(0, 80)], 0, 0, 176, 46);
check(![R(0, 0), R(0, 80)].some(r => api.overlaps({ x: spot[0], y: spot[1], w: 176, h: 46 }, r, 23)) && spot[0] % 20 === 0 && spot[1] % 20 === 0, `freeSpot finds a free grid spot (${spot})`);
check(api.snapTo(29) === 20 && api.snapTo(31) === 40 && api.snapTo(-11) === -20, "snapTo the 20 px grid");
check(api.nodesInRect(new Map([["A", R(0, 0)], ["B", R(300, 300)]]), { x: -10, y: -10, w: 50, h: 50 }).join() === "A", "rubber band picks the boxes it touches");
const arr = tam();
api.autoArrange(arr, { measure: t => t.length * 7 });
const ab = arr.nodes.map(n => api.boxOf(n, { measure: t => t.length * 7 }));
check(arr.nodes.every(n => n.x % 20 === 0 && n.y % 20 === 0) && !ab.some((p, i) => ab.some((q, j) => i !== j && api.overlaps(p, q))), "auto layout: snapped to the grid, no overlaps");
check(arr.nodes.find(n => n.id === "PEOU").x < arr.nodes.find(n => n.id === "PU").x && arr.nodes.find(n => n.id === "PU").x < arr.nodes.find(n => n.id === "BI").x, "auto layout: PEOU left, PU middle, BI right");
check(api.boxOf({ id: "X", name: "X" }).h === 46 && api.boxOf({ id: "PU", name: "Nhận thức sự hữu ích" }, { showCode: true, measure: t => t.length * 7 }).lines.join(" ") === "Nhận thức sự hữu ích (PU)", "boxOf: label with code, minimum height");
const placed = tam();
api.placeNew(placed, {});
api.addNode(placed, "Rủi ro cảm nhận", null, "PR");
check(api.placeNew(placed, {}) === 1 && api.hasPos(placed.nodes[3]), "a new construct gets a free spot beside the drawing");
const pb = placed.nodes.map(n => api.boxOf(n));
check(!pb.some((p, i) => pb.some((q, j) => i !== j && api.overlaps(p, q))), "…without overlapping the others");

// ---- sample size after edits ----
const ss = tam();
check(api.modelSample(ss).min === kit.kitSample("pls", 2, 1).min, "TAM: sample size of 2 arrows into BI");
api.parseArrows("PR, SN -> BI", ss).edges.forEach(e => api.addEdge(ss, e.from, e.to, e.sign));
check(api.modelSample(ss).arrows === 4 && api.modelSample(ss).min === kit.kitSample("pls", 4, 1).min, "adding two causes of BI raises the sample to 4 arrows");
api.removeNodes(ss, ["PR", "SN", "PU"]);
check(api.modelSample(ss).arrows === 1, "deleting constructs lowers it again");

// ======== higher-order constructs, moderation, multigroup, control variables ========
// As the page does after the arrow list or a link: parse, add, then tidy.
const arrows = (m, text) => { api.parseArrows(text, m).edges.forEach(e => api.addEdge(m, e.from, e.to, e.sign)); return api.tidy(m); };
const plsMin = a => kit.kitSample("pls", a, 1).min;

// ---- higher-order constructs ----
const hc = arrows({ nodes: [], edges: [] }, "TAN, DU, DC -> SAT\nTAN -> DU\nPV -> SAT");
const sq = api.makeHoc(hc, ["TAN", "DU", "DC"], "Chất lượng dịch vụ", "rr", "SQ");
check(sq && sq.id === "SQ" && sq.type === "hoc" && api.childrenOf(hc, "SQ").map(n => n.id).join() === "TAN,DU,DC", "makeHoc: three LOCs under SQ");
check(api.edgesToText(hc) === "SQ -> SAT\nPV -> SAT", `makeHoc: LOC arrows move to the HOC, LOC→LOC arrows and duplicates go (${api.edgesToText(hc).replace(/\n/g, "; ")})`);
check(api.hocLinks(hc).every(l => l.from === "SQ") && api.hocLinks(hc).length === 3, "reflective–reflective: links run HOC → LOCs");
let P = api.predictorsOf(hc);
check(P.get("SAT").length === 2 && P.get("TAN").join() === "SQ" && P.get("SQ").length === 0, "reflective–reflective: each LOC has the HOC as its one predictor");
check(api.maxArrows(hc).max === 2 && api.modelSample(hc).min === plsMin(2), "reflective–reflective HOC: the sample follows the structural arrows (2 into SAT)");
check(api.hypotheses(hc).length === 2 && api.hypotheses(hc)[0].text === "Chất lượng dịch vụ (SQ) có tác động cùng chiều đến SAT.", `HOC hypotheses are about the HOC, none for its LOCs (${api.hypotheses(hc)[0].text})`);
api.setHocMode(hc, "SQ", "rf");
check(api.hocLinks(hc).every(l => l.to === "SQ"), "reflective–formative: links run LOCs → HOC");
P = api.predictorsOf(hc);
check(P.get("SQ").join() === "TAN,DU,DC" && api.maxArrows(hc).max === 3 && api.maxArrows(hc).at.join() === "SQ", "reflective–formative: the HOC gets one predictor per LOC (3), the largest count");
check(api.modelSample(hc).arrows === 3 && api.modelSample(hc).min === plsMin(3), "reflective–formative HOC: sample for 3 predictors like the kit");
arrows(hc, "IMG -> SQ");
check(api.predictorsOf(hc).get("SQ").length === 4 && api.modelSample(hc).arrows === 4, "an antecedent of a reflective–formative HOC adds to its LOCs (3 + 1)");
check(api.modelWarnings(hc).some(w => w.kind === "hoc-rf-in" && /hai giai đoạn/.test(w.text)), "warning: reflective–formative HOC with arrows in → two-stage approach");
arrows(hc, "PV -> TAN");
check(api.edgesToText(hc).split("\n").includes("PV -> SQ") && !hc.edges.some(e => e.to === "TAN"), "an arrow drawn to a LOC attaches to its HOC");
check(api.attachChild(hc, "PV", "SQ") && hc.nodes.find(n => n.id === "PV").parent === "SQ" && !hc.edges.some(e => e.from === "PV" || e.to === "PV"), "attachChild: a construct dropped in the HOC becomes a LOC; its arrows move to the HOC");
check(!api.attachChild(hc, "SQ", "SQ") && api.detachChild(hc, "PV") && !hc.nodes.find(n => n.id === "PV").parent, "a HOC cannot be its own LOC; detachChild frees a LOC");
const one = arrows({ nodes: [], edges: [] }, "A -> B");
check(api.makeHoc(one, ["A"], "X") === null, "makeHoc needs at least two constructs");
const fewHoc = arrows({ nodes: [], edges: [] }, "A -> B"); api.addNode(fewHoc, "Bậc cao", null, "H"); fewHoc.nodes[2].type = "hoc"; fewHoc.nodes[2].mode = "rr";
check(api.modelWarnings(fewHoc).some(w => w.kind === "hoc-few" && w.ids[0] === "H"), "warning: a HOC with fewer than two LOCs");
const ug = arrows({ nodes: [], edges: [] }, "A, B -> Y"); api.makeHoc(ug, ["A", "B"], "Bậc cao", "rr", "H");
api.removeNodes(ug, ["H"]);
check(ug.nodes.every(n => !n.parent) && ug.edges.length === 0, "deleting a HOC frees its LOCs");
const ug2 = arrows({ nodes: [], edges: [] }, "A, B -> Y"); api.makeHoc(ug2, ["A", "B"], "Bậc cao", "rr", "H");
check(api.ungroupHoc(ug2, "H") && ug2.nodes.every(n => !n.parent && !n.type) && api.edgesToText(ug2) === "H -> Y", "ungroupHoc: the HOC becomes an ordinary construct and keeps its arrows");
const lay = arrows({ nodes: [], edges: [] }, "A, B -> Y"); api.makeHoc(lay, ["A", "B"], "Bậc cao", "rf", "H");
const ll = api.layersOf({ nodes: lay.nodes, edges: [...lay.edges, ...api.hocLinks(lay).map(l => ({ from: l.child, to: l.hoc }))] }).layer;
api.autoArrange(lay, {});
const xs = id => lay.nodes.find(n => n.id === id).x;
check(xs("A") < xs("H") && xs("B") < xs("H") && xs("H") < xs("Y") && ll.get("H") === 1, "auto layout: LOCs left of their HOC, HOC left of its outcome");
lay.nodes.find(n => n.id === "H").x = 600; lay.nodes.find(n => n.id === "H").y = 300;
api.arrangeChildren(lay, "H", {});
const lb = ["A", "B"].map(id => api.boxOf(lay.nodes.find(n => n.id === id)));
check(lb.every(b => b.x + b.w < 600) && !api.overlaps(lb[0], lb[1]) && lb.every(b => b.y % 20 === 0), "arrangeChildren: LOCs in a column left of the HOC, no overlap");

// ---- moderation ----
const md = arrows({ nodes: [], edges: [] }, "X -> Y\nZ -> Y");
api.addNode(md, "Thu nhập", null, "W");
check(api.addMod(md, "W", "X", "Y") === "added" && md.mods.length === 1 && md.mods[0].dir === 1, "addMod: W moderates X → Y");
P = api.predictorsOf(md);
check(P.get("Y").join() === "X,Z,W,X×W" && api.maxArrows(md).max === 4, "moderation: Y gains W and X×W (2 + 2 predictors)");
check(api.modelSample(md).arrows === 4 && api.modelSample(md).min === plsMin(4), "moderation: sample of 4 predictors into Y like the kit");
let mh = api.hypotheses(md);
check(mh[2].mod === 0 && mh[2].text === "Thu nhập (W) điều tiết tác động của x lên y theo hướng tăng cường.", `moderation hypothesis text (${mh[2].text})`);
check(api.toggleModDir(md, 0) === -1 && /theo hướng làm suy yếu\.$/.test(api.hypotheses(md)[2].text), "moderation: strengthening ↔ weakening");
check(api.addMod(md, "W", "X", "Y") === "exists" && api.addMod(md, "X", "X", "Y") === "self" && api.addMod(md, "W", "Y", "X") === "noedge", "addMod refuses duplicates, a moderator on its own arrow and a missing arrow");
api.addMod(md, "W", "Z", "Y");
check(api.predictorsOf(md).get("Y").join() === "X,Z,W,X×W,Z×W", "a second moderated arrow into Y by the same W adds only its interaction term");
const md2 = arrows({ nodes: [], edges: [] }, "X -> Y\nW -> Y");
api.addMod(md2, "W", "X", "Y");
check(api.predictorsOf(md2).get("Y").length === 3, "W already pointing into Y is not counted twice (X, W, X×W)");
const s0 = api.modelSample(md), sF = api.modelSample(md, { modF2: true });
check(s0.mod && s0.mod.f2 === 0.02 && s0.mod.k === 5 && s0.mod.at === "Y" && s0.min === s0.base, "the f² = 0,02 figure is shown without changing the minimum by default");
check(sF.min === Math.max(sF.base, sF.mod.n) && sF.mod.n === 395 && sF.min === 395, `toggle on: minimum covers the interaction at f² = 0,02 (${sF.mod.n})`);
check(api.incN(1, 1, 0.02, 0.05, 0.8) === api.regN(1, 0.02, 0.05, 0.8) && api.incN(1, 1, 0.02, 0.05, 0.8) === 395, `R² increase with one predictor equals the R² test: 395 like G*Power (${api.incN(1, 1, 0.02, 0.05, 0.8)})`);
check(api.incN(3, 1, 0.15, 0.05, 0.8) === 55 && api.incN(5, 1, 0.02, 0.05, 0.8) === 395 && api.regN(5, 0.02, 0.05, 0.8) > 600, `R² increase, 1 tested of 3 or 5: 55 (f² = 0,15) and 395 (f² = 0,02) like G*Power; testing the whole R² would need ${api.regN(5, 0.02, 0.05, 0.8)}`);
const mb = new Map(md.nodes.map((n, i) => [n.id, api.boxOf({ ...n, x: [0, 400, 0, 200][i], y: [0, 0, 200, -200][i] })]));
const mr = api.routeAll(md, mb), mm = api.modRoutes(md, mb, mr);
const xr = mr[0], mid0 = api.quadAt(xr.p0, xr.c, xr.p1, 0.5);
check(mm.length === 2 && Math.hypot(mm[0].p1[0] - mid0[0], mm[0].p1[1] - mid0[1]) < 1e-6, "the moderator's arrow ends on the middle of X → Y");
check(Math.hypot(xr.label[0] - mid0[0], xr.label[1] - mid0[1]) > 30, "a moderated arrow's H label moves off its middle");
const mrm = arrows({ nodes: [], edges: [] }, "X -> Y\nW -> V"); api.addMod(mrm, "W", "X", "Y");
api.reverseEdge(mrm, 0);
check(mrm.mods[0].from === "Y" && mrm.mods[0].to === "X", "reversing an arrow carries its moderator");
api.recodeNode(mrm, "W", "TN");
check(mrm.mods[0].w === "TN", "recoding the moderator updates the moderation");
api.removeEdge(mrm, 0);
check(mrm.mods.length === 0, "deleting the arrow drops its moderation");
const mrn = arrows({ nodes: [], edges: [] }, "X -> Y\nW -> V"); api.addMod(mrn, "W", "X", "Y"); api.removeNodes(mrn, ["W"]);
check(mrn.mods.length === 0 && api.removeMod(md, 1) && md.mods.length === 1, "deleting the moderator drops it; removeMod");
check(api.modelWarnings(arrows({ nodes: [{ id: "W", name: "W" }], edges: [], mods: [] }, "X -> Y")).some(w => w.kind === "lone") && !(() => { const m = arrows({ nodes: [{ id: "W", name: "W" }], edges: [] }, "X -> Y"); api.addMod(m, "W", "X", "Y"); return api.modelWarnings(m).some(w => w.kind === "lone"); })(), "a moderator with no arrows of its own is not flagged as unconnected");

// ---- control variables ----
const cv = arrows({ nodes: [], edges: [] }, "PU, PEOU -> BI\nPEOU -> PU");
api.addNode(cv, "Giới tính", null, "GT"); api.addNode(cv, "Tuổi", null, "AGE");
check(api.setCtrl(cv, "GT", true) && api.setCtrl(cv, "AGE", true), "setCtrl marks control variables");
arrows(cv, "GT, AGE -> BI\nPU -> GT");
check(!cv.edges.some(e => e.to === "GT"), "nothing points into a control variable");
const ch = api.hypotheses(cv);
check(ch.filter(h => h.edge != null).length === 3 && !ch.some(h => /GT|AGE/.test(h.text)) && ch.map(h => h.h).join() === "1,2,3,4", `control variables get no hypothesis; numbering skips them (${ch.map(h => h.text).join(" | ")})`);
check(api.controlsOf(cv).map(c => `${c.id}:${c.to.join()}`).join() === "GT:BI,AGE:BI", "controlsOf lists them with their dependent constructs");
check(api.predictorsOf(cv).get("BI").length === 4 && api.modelSample(cv).arrows === 4 && api.modelSample(cv).min === plsMin(4), "control variables count as predictors for the sample (2 + 2 into BI)");
const hn = api.hNumbers(ch);
check(hn.edge.get(cv.edges.findIndex(e => e.from === "GT")) === undefined && hn.edge.get(0) === 1, "hNumbers: control arrows have no H label");
check(api.addMod(cv, "GT", "PU", "BI") === "ctrl", "a control variable cannot moderate");
check(!api.setCtrl(cv, "BI", false) && api.setCtrl(cv, "GT", false) && api.hypotheses(cv).some(h => /Giới tính/.test(h.text)), "unmarking a control variable gives it a hypothesis again");
check(api.setCtrl(cv, "PU", true) && !cv.edges.some(e => e.to === "PU"), "turning a construct into a control drops the arrows into it");
const idleCv = { nodes: [{ id: "A", name: "A" }, { id: "C", name: "C", type: "ctrl" }], edges: [] };
check(api.modelWarnings(idleCv).some(w => w.kind === "ctrl"), "warning: a control variable with no arrow");
check(api.hypotheses(arrows({ nodes: [{ id: "C", name: "C", type: "ctrl" }], edges: [] }, "C -> M\nM -> Y")).filter(h => h.mediator).length === 0, "no mediation hypothesis starting from a control variable");

// ---- multigroup ----
const mg = tam();
check(api.parseGroups("Nam; Nữ ;; Nam; Khác; A; B").join() === "Nam,Nữ,Khác,A", "parseGroups: trims, drops duplicates, at most 4");
api.setMga(mg, { name: "Giới tính", groups: "Nam; Nữ" });
let gh = api.hypotheses(mg);
const mgaH = gh.filter(h => h.mga != null);
check(mgaH.length === 3 && mgaH[0].text === "Tác động của PEOU lên PU khác nhau giữa nhóm Nam và nhóm Nữ (phân theo giới tính).", `MGA: one hypothesis per compared arrow (${mgaH[0] && mgaH[0].text})`);
check(gh.map(h => h.h).join() === "1,2,3,4,5,6,7", "MGA hypotheses come after direct and mediation ones");
let ms = api.modelSample(mg);
check(ms.groups === 2 && ms.min === plsMin(2) && ms.total === 2 * plsMin(2) && ms.send === Math.ceil(2 * plsMin(2) / 0.85), `MGA: each group needs the minimum, total ×2 (${ms.min} × 2 = ${ms.total})`);
check(api.toggleMgaPath(mg, 1) === false && api.mgaPaths(mg).join() === "0,2" && api.hypotheses(mg).filter(h => h.mga != null).length === 2, "an arrow can be left out of the comparison");
api.setMga(mg, { name: "Khu vực", groups: "Bắc; Trung; Nam", skip: mg.mga.skip });
check(/khác nhau giữa các nhóm Bắc, Trung và Nam \(phân theo khu vực\)\.$/.test(api.hypotheses(mg).find(h => h.mga != null).text) && api.modelSample(mg).total === 3 * plsMin(2), "three groups: wording and total ×3");
api.reverseEdge(mg, 1);
check(mg.mga.skip.join() === "BI>PU", "the left-out key follows a reversed arrow");
api.recodeNode(mg, "BI", "INT");
check(mg.mga.skip.join() === "INT>PU", "…and a recoded construct");
api.setMga(mg, { name: "X", groups: "Một" });
check(api.hypotheses(mg).every(h => h.mga == null) && api.modelSample(mg).groups === 0 && api.modelWarnings(mg).some(w => w.kind === "mga"), "one group: no comparison, a warning");
api.setMga(mg, null);
check(!("mga" in mg), "MGA off");

// ---- link / storage with every element type ----
const full = arrows({ nodes: [], edges: [] }, "TAN, DU -> SAT\nPV -> SAT\nSAT -> LOY (-)\nGT -> LOY");
full.nodes.find(n => n.id === "TAN").key = "servqual:TAN";
api.makeHoc(full, ["TAN", "DU"], "Chất lượng dịch vụ", "rf", "SQ");
api.setCtrl(full, "GT", true);
api.addNode(full, "Thu nhập", null, "TN");
api.addMod(full, "TN", "PV", "SAT", -1);
api.setMga(full, { name: "Giới tính", groups: ["Nam", "Nữ"], skip: ["PV>SAT"] });
api.placeNew(full, {});
delete full.nodes.find(n => n.id === "TN").x;
const pk = api.packModel(full), back2 = api.unpackModel(pk);
check(api.packModel(back2) === pk, "pack → unpack → pack round-trips HOC, LOCs, control, moderation, groups");
check(back2.nodes.find(n => n.id === "SQ").type === "hoc" && back2.nodes.find(n => n.id === "SQ").mode === "rf" && back2.nodes.find(n => n.id === "TAN").parent === "SQ" && back2.nodes.find(n => n.id === "TAN").key === "servqual:TAN", "…HOC type and LOC parent and key");
check(back2.nodes.find(n => n.id === "GT").type === "ctrl" && back2.mods[0].w === "TN" && back2.mods[0].dir === -1 && back2.mga.groups.join() === "Nam,Nữ" && back2.mga.skip.join() === "PV>SAT", "…control variable, moderation direction, groups and the skipped arrow");
check(!api.hasPos(back2.nodes.find(n => n.id === "TN")) && JSON.parse(pk).n.find(a => a[0] === "TN").length === 3, "…a construct without a position stays without one");
check(JSON.stringify(api.hypotheses(back2)) === JSON.stringify(api.hypotheses(full)) && api.modelSample(back2).total === api.modelSample(full).total, "…same hypotheses and sample after the round trip");
const v2 = '{"v":2,"n":[["PEOU","Dễ sử dụng","tam:PEOU",0,0],["PU","Hữu ích","tam:PU",240,0],["BI","Ý định","tam:BI",480,0]],"e":[["PEOU","PU"],["PU","BI"],["PEOU","BI",-1]]}';
const old2 = api.unpackModel(v2);
check(old2.nodes.length === 3 && old2.nodes.every(n => api.hasPos(n) && !n.type && !n.parent) && !old2.mods && !old2.mga && old2.edges[2].sign === -1, "a v2 link (positions, no new elements) still loads");
check(api.packModel(old2) === api.packModel(api.unpackModel(api.packModel(old2))) && api.hypotheses(old2).length === 4, "…and re-saves and reads the same");
const bad = api.unpackModel('{"v":3,"n":[["A","A",0,0,0,{"p":"B"}],["B","B",0,0,0],["C","C",0,null,null,{"c":1}],["H","H",0,null,null,{"h":"zz"}]],"e":[["A","B"],["B","C"]],"mo":[["C","A","B"],["H","B","A"],["H","A","B",-1],"x"],"g":{"v":"G","l":["a"," a ","b","c","d","e"],"x":["Q>R"]}}');
check(!bad.nodes[0].parent && bad.edges.length === 1 && bad.nodes[3].mode === "rr", "a tampered link: a parent that is no HOC is dropped, arrows into a control variable go, unknown HOC mode reads reflective–reflective");
check(bad.mods.length === 1 && bad.mods[0].w === "H" && bad.mods[0].dir === -1 && bad.mga.groups.join() === "a,b,c,d" && bad.mga.skip.length === 0, "…moderations by a control variable or on a missing arrow are dropped; groups capped at 4");

// ---- kit hand-off with HOC and control variables ----
const kq = arrows({ nodes: [], edges: [] }, "A -> Q\nGT -> Q");
kq.nodes[0].key = "tam:PEOU";
api.addNode(kq, "Dễ dùng 2", "tam:PU", "PU"); api.addNode(kq, "Ý định", "tam:BI", "BI");
api.makeHoc(kq, ["PU", "BI"], "Bậc cao", "rr", "HQ");
arrows(kq, "A -> HQ");
api.setCtrl(kq, "GT", true);
const kqq = new URLSearchParams(api.kitQuery(kq).slice(1));
check(kqq.get("c") === "tam:PEOU,tam:PU,tam:BI" && kqq.get("dv") === "tam:PU,tam:BI" && kqq.get("a") === "2", `kit link: LOCs of a dependent HOC are its measured items and flagged dependent (${api.kitQuery(kq)})`);
api.addNode(kq, "Quy mô: lớn; nhỏ", null, "QM"); api.setCtrl(kq, "QM", true);
api.setMga(kq, { name: "Loại hình", groups: "Nhà nước; Tư nhân" });
const kq2 = new URLSearchParams(api.kitQuery(kq).slice(1));
check(kq2.get("ctrl") === "GT;Quy mô lớn nhỏ" && kq2.get("grp") === "Loại hình:Nhà nước;Tư nhân", `kit link: control variables as ctrl=, the grouping variable as grp=Name:G1;G2 (${kq2.get("ctrl")} | ${kq2.get("grp")})`);
check(api.kitQuery(tam()).indexOf("ctrl=") < 0 && api.kitQuery(tam()).indexOf("grp=") < 0, "no control or grouping variable, no ctrl= or grp=");
// When the kit reads them, it splits ctrl on ";" and grp on the first ":" then ";" (as built above).
if (/qs\.getAll\('ctrl'\)/.test(kitSrc)) check(/qs\.get\('grp'\)/.test(kitSrc) && /indexOf\(':'\)/.test(kitSrc), "the kit reads ?ctrl= and ?grp=Name:groups");

console.log(`
${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
