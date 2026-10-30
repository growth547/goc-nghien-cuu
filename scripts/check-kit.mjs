// Unit check for the questionnaire kit (src/tools/bo-khao-sat.html):
// its statistics block must be the same code as the sample-size calculator's,
// and the pure kit helpers must behave on every published scale: every block has
// answer options, no editorial note reaches respondents, codes never clash, and the
// Google Apps Script and GDF exports are valid.
import { readFileSync, readdirSync } from "node:fs";

const block = (src, tag) => {
  const m = src.match(new RegExp(`//#${tag}-start([\\s\\S]*?)//#${tag}-end`));
  if (!m) throw new Error(`missing //#${tag} block`);
  return m[1];
};
const kitSrc = readFileSync("src/tools/bo-khao-sat.html", "utf8");
const calcSrc = readFileSync("src/tools/tinh-co-mau.html", "utf8");
let failed = 0,
  passed = 0;
// Bulk checks (quiet) print only failures; named checks print always.
const check = (ok, label, quiet = false) => {
  if (!ok || !quiet) console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failed++;
  else passed++;
};

const norm = s => s.split(String.fromCharCode(13)).join("").trim();
check(norm(block(kitSrc, "math")) === norm(block(calcSrc, "math")), "math block matches tinh-co-mau.html");

const api = new Function(
  `${block(kitSrc, "math")}${block(kitSrc, "kit")}
   return { placeholdersOf, fillPlaceholders, applyAddress, citeOf, citedBy, isAgreementScale, parseResponseScale, itemAnchors, itemFormat,
     legendOf, valuesOf, reverseRule, dedupeCodes, acCode, placeAttention, defaultScreening, DEMOS, DEMO_DEFAULT, buildSurvey, appsScript,
     toGDF, codebookRows, toCSV, kitSample, respondentPlaceholders, normText, expandQuery, indexConstruct, rankConstructs, LIK,
     generalQuestions, demoOf, mgaTotal, gridTitle, introLine, extraFromParams, thesisHtml };`
)();
const ts = await import("../src/utils/kit.ts");

// ---- placeholders, "này này", address ----
check(api.fillPlaceholders("Sử dụng [hệ thống] giúp tôi", { "hệ thống": "ví MoMo" }) === "Sử dụng ví MoMo giúp tôi", "fills a placeholder");
check(api.fillPlaceholders("[Hệ thống] dễ dùng", { "hệ thống": "ví MoMo" }) === "Ví MoMo dễ dùng", "capitalises at a capitalised placeholder");
check(api.fillPlaceholders("Dùng [hệ thống]", {}) === "Dùng [hệ thống]", "keeps an unfilled placeholder visible");
check(api.fillPlaceholders("Khả năng tôi mua [sản phẩm] này là cao.", { "sản phẩm": "mỹ phẩm này" }) === "Khả năng tôi mua mỹ phẩm này là cao.", "'này này' collapses to 'này'");
check(api.fillPlaceholders("[Sản phẩm] này có vẻ bền.", { "sản phẩm": "sản phẩm này" }) === "Sản phẩm này có vẻ bền.", "'này này' collapses after a capitalised placeholder");
check(api.fillPlaceholders("Xem [công ty] là lựa chọn đầu tiên khi mua dịch vụ [loại dịch vụ].", { "công ty": "cửa hàng này", "loại dịch vụ": "dịch vụ này" }) === "Xem cửa hàng này là lựa chọn đầu tiên khi mua dịch vụ này.", "'dịch vụ dịch vụ này' reads 'dịch vụ này'");
check(api.fillPlaceholders("Tôi đi từ từ tới [công ty].", { "công ty": "công ty" }) === "Tôi đi từ từ tới công ty.", "a real reduplicated word away from a placeholder stays");
for (const [t, v] of [["Khả năng tôi mua [sản phẩm] này là cao.", { "sản phẩm": "mỹ phẩm này" }], ["mua dịch vụ [loại dịch vụ].", { "loại dịch vụ": "dịch vụ này" }]])
  check(ts.fillPlaceholders(t, v) === api.fillPlaceholders(t, v), `kit.ts fills "${t}" like the tool`);
check(api.applyAddress("Anh/chị có biết vị trí của mình trong mắt quản lý không? Quản lý hiểu nhu cầu của anh/chị.", "Bạn") === "Bạn có biết vị trí của mình trong mắt quản lý không? Quản lý hiểu nhu cầu của bạn.", "address: anh/chị becomes bạn for students");
check(api.applyAddress("Bạn có thường cảm thấy mệt mỏi không? Lúc rảnh, bạn có đủ sức cho gia đình và bạn bè không?", "Anh/Chị") === "Anh/Chị có thường cảm thấy mệt mỏi không? Lúc rảnh, Anh/Chị có đủ sức cho gia đình và bạn bè không?", "address: pronoun bạn follows Anh/Chị, 'bạn bè' stays");
check(api.applyAddress("Tôi có những người bạn để chia sẻ.", "Anh/Chị") === "Tôi có những người bạn để chia sẻ.", "address: 'những người bạn' stays");

// ---- citations ----
check(api.citeOf("Davis (1989), 6 biến.") === "Davis (1989)", "cite: single author");
check(api.citeOf("Mowday, Steers & Porter (1979), 15 biến.") === "Mowday, Steers và Porter (1979)", "cite: & becomes và");
check(api.citeOf("Venkatesh và cộng sự (2003), Bảng 16, 4 biến.") === "Venkatesh và cộng sự (2003)", "cite: và cộng sự");
check(api.citeOf("Biến cảm nhận P1–P4 của Parasuraman, Zeithaml & Berry (1988), Cronin & Taylor (1992) dùng lại; 4 biến.") === "Parasuraman, Zeithaml và Berry (1988)", "cite: skips leading prose");
check(api.citedBy("Davis (1989)", "Davis, F. D. (1989). Perceived usefulness") && !api.citedBy("Davis (1989)", "Davis, F. D., Bagozzi, R. P., & Warshaw, P. R. (1989). User acceptance"), "citedBy: single author does not match a co-authored paper");

// ---- sample size ----
const pls = api.kitSample("pls", 2, 14);
check(pls.pow === 68 && pls.second === 155 && pls.min === 155, `PLS-SEM, 2 arrows: G*Power 68, ISR 155, min 155 (got ${pls.pow}/${pls.second}/${pls.min})`);
const spss = api.kitSample("spss", 5, 30);
check(spss.pow === 92 && spss.second === 150 && spss.min === 150, `SPSS, 5 predictors, 30 items: 92 vs 150 (got ${spss.pow}/${spss.second}/${spss.min})`);
for (let m = 1; m <= 8; m++) check(ts.POWER_N[m] === api.kitSample("pls", m, 1).pow, `POWER_N[${m}] = ${ts.POWER_N[m]} matches G*Power computation`);
check(ts.ISR_N === api.kitSample("pls", 1, 1).second, "ISR_N matches Kock & Hadaya computation");

// ---- response formats on concrete scales ----
const dir = "src/content/thang-do";
const scales = new Map();
for (const f of readdirSync(dir).filter(f => f.endsWith(".json"))) {
  const s = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  s.slug = f.slice(0, -5);
  scales.set(s.slug, s);
}
const published = [...scales.values()].filter(s => !s.slug.startsWith("_"));
const C = key => {
  const [slug, code] = key.split(":");
  const scale = scales.get(slug);
  return { key, scale, c: scale.constructs.find(c => c.code === code) };
};
const fmtOf = (key, item, mode) => {
  const { scale, c } = C(key);
  return api.itemFormat(scale, c, c.items.find(i => i.code === item), mode);
};
let f = fmtOf("gan-ket-cong-viec-uwes:VI", "VI1", "5");
check(f.kind === "labeled" && f.k === 7 && f.min === 0 && f.labels[6].startsWith("Luôn luôn"), "UWES keeps 0–6 frequency labels when agreement items are unified");
f = fmtOf("dass-21:D", "D3", "5");
check(f.k === 4 && f.min === 0 && !/Applied/.test(api.legendOf(f, "Anh/Chị")), "DASS-21: 0–3, English glosses dropped");
f = fmtOf("tu-trong-rosenberg:RSE", "RSE1", "orig");
check(f.k === 4 && f.min === 0 && f.labels[0] === "Rất không đồng ý" && f.labels[3] === "Rất đồng ý", "Rosenberg: 'Rất đồng ý (3)…' read low to high");
f = fmtOf("tam:PU", "PU1", "5");
check(f.kind === "agree" && f.k === 5 && f.notes.some(n => /7 mức của bản gốc sang Likert 5 mức/.test(n)), "TAM unified to Likert 5 says it was adjusted from 7");
f = fmtOf("truyen-mieng-dien-tu-ewom:EWOM", "EWOM1", "orig");
check(f.k === 5 && !/hoặc/.test(api.legendOf(f, "Anh/Chị")), "'5 hoặc 7 mức' never printed; original mode picks 5");
f = fmtOf("do-tin-cay-nguon-ohanian:ATT", "ATT1", "orig");
check(f.kind === "bipolar" && f.k === 7 && f.left === "Không hấp dẫn" && f.right === "Hấp dẫn", "semantic differential 'A – B' gives two poles");
f = fmtOf("tpb:ATT", "ATT2", "5");
check(f.kind === "bipolar" && f.left === "tốt" && f.right === "không tốt" && f.k === 5, "TPB ATT2 keeps the author's reversed poles");
f = fmtOf("tpb:SN", "SN1", "orig");
check(f.kind === "bipolar" && f.left === "nên" && f.right === "không nên" && /…/.test(f.stem), "TPB SN1 'nên 1 2 3 4 5 6 7 không nên' becomes a stem with poles");
f = fmtOf("y-dinh-mua:WTB", "WTB1", "orig");
check(f.kind === "bipolar" && f.left === "rất thấp" && f.right === "rất cao" && f.swapped, "WTB1 '(rất cao … rất thấp)' swapped so 1 is low (item not reverse-coded)");
f = fmtOf("y-dinh-nghi-viec:TI", "TI1", "5");
check(f.kind === "labeled" && f.k === 5 && /khả năng/.test(f.labels[1]), "MOAQ-TI1 is a likelihood question");
f = fmtOf("kiet-suc-cbi:WB", "WB1", "5");
const f2 = fmtOf("kiet-suc-cbi:WB", "WB4", "5");
check(f.labels[5] === "Rất cao" && f2.labels[5] === "Luôn luôn", "CBI: degree items and frequency items get their own anchors");

// ---- every item of every scale, every mode: options exist and nothing editorial leaks ----
const LEAK = /nghiên cứu|đối chiếu|đảo điểm|điểm tổng|bản gốc|hoặc \d|Lưu ý|tác giả|(?<!\p{L})theo(?!\p{L})|(?<!\p{L})cộng(?!\p{L})|trang |không phải Likert|\(\s*[A-Za-z][A-Za-z ,'/-]+\)/iu;
const OWN = ["kiet-suc-cbi", "lmx-7", "y-dinh-nghi-viec", "chat-luong-he-thong-thong-tin", "utaut2"];
let nItems = 0;
for (const s of scales.values()) {
  const P = api.parseResponseScale(s.responseScale);
  check(JSON.stringify(ts.parseResponseScale(s.responseScale)) === JSON.stringify(P), `${s.slug}: kit.ts reads the response scale the same way`, true);
  check(ts.isAgreementScale(s.responseScale) === api.isAgreementScale(s.responseScale), `${s.slug}: kit.ts agrees on agreement scale`, true);
  for (const c of s.constructs)
    for (const it of c.items)
      for (const mode of ["5", "7", "orig"]) {
        nItems++;
        const fm = api.itemFormat(s, c, it, mode);
        const vs = api.valuesOf(fm);
        const where = `${s.slug} ${it.code} (${mode})`;
        check(fm.k >= 2 && vs.length === fm.k, `${where}: at least 2 options (got ${fm.k})`, true);
        const legend = api.legendOf(fm, "Anh/Chị");
        const shown = [legend, ...Object.values(fm.labels), fm.left || "", fm.right || ""].join(" | ");
        check(!LEAK.test(shown) && Object.values(fm.labels).every(l => l.length <= 60), `${where}: respondent text has no editorial note (${shown.slice(0, 120)})`, true);
        check(!shown.includes(s.responseScale.slice(0, 40)), `${where}: responseScale prose is not printed`, true);
        if (fm.kind === "bipolar") check(fm.left && fm.right && fm.left !== fm.right, `${where}: two distinct poles`, true);
        if (fm.kind === "agree") check(/không đồng ý/i.test(fm.labels[2] || ""), `${where}: agreement level 2 is a disagree label (attention check relies on it)`, true);
        if (!P.agree && fm.kind === "labeled" && !OWN.includes(s.slug))
          check(ts.reverseRuleOf(s.responseScale) === api.reverseRule(fm), `${where}: kit.ts reverse rule matches (${api.reverseRule(fm)})`, true);
      }
}
check(true, `formats checked on ${nItems} item × mode combinations across ${scales.size} scales`);

// Every published construct must yield a real citation, not the raw source note.
for (const s of published)
  for (const c of s.constructs) {
    const cite = api.citeOf(c.source);
    check(/\(\d{4}\)$/.test(cite) && cite.length < 80, `${s.slug} ${c.code}: citation ${cite}`, true);
    check(ts.citeOf(c.source) === cite, `${s.slug} ${c.code}: kit.ts gives the same citation`, true);
    const plain = s.references.map(r => r.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&"));
    check(plain.some(r => api.citedBy(cite, r)), `${s.slug} ${c.code}: reference listed for ${cite}`, true);
  }

// ---- codes and the attention check ----
const dd = api.dedupeCodes([
  { tag: "TAM", code: "BI", items: ["BI1", "BI2"] },
  { tag: "UTAUT", code: "BI", items: ["BI1", "BI2", "BI3"] },
  { tag: "TAM", code: "PU", items: ["PU1"] },
]);
check(dd[0].code === "TAM_BI" && dd[1].items[2] === "UTAUT_BI3" && dd[2].items[0] === "PU1", "dedupe: clashing constructs get the scale prefix, others keep their codes");
check(api.acCode(["AC1", "PU1"]) === "ACHK" && api.acCode(["PU1"]) === "AC1", "attention code is AC1, or ACHK when AC1 is taken");
const pa = api.placeAttention([
  { kind: "labeled", items: [{}, {}, {}, {}] },
  { kind: "agree", items: [{ reverse: true }, {}, {}, { reverse: true }, {}] },
  { kind: "agree", items: [{}, {}] },
]);
check(pa && pa.block === 1 && pa.pos === 2, `attention check: middle agreement block, between two non-reverse items (got ${JSON.stringify(pa)})`);
check(api.placeAttention([{ kind: "labeled", items: [{}, {}] }, { kind: "bipolar", items: [{}] }]) === null, "attention check: no agreement block, no in-block placement");

// ---- surveys: personas and the whole library ----
const input = (keys, o = {}) => ({
  aud: "td", mode: "5", ph: {}, target: "", showNames: true, attn: true, screen: true, screenText: "", topic: "Đề tài thử", who: "", org: "", contact: "",
  ...o,
  demos: o.demos || api.DEMO_DEFAULT[o.aud || "td"],
  constructs: keys.map(k => {
    const x = C(k);
    return { key: k, scale: { slug: x.scale.slug, name: x.scale.name, responseScale: x.scale.responseScale }, c: x.c, items: x.c.items };
  }),
});

// GDF v1.1 self-check list: =FORM with title, continuous Q numbers, options on single/multi/dropdown,
// rows and cols on grids (≤ 60 rows), disqualify only with !screen, ≤ 3 !screen and ≤ 3 !qc,
// exactly one [correct] per !qc, valid unique section labels, only allowed line types.
const LINE = /^(=FORM|=SECTION #[a-z0-9-]+ \| .+|[a-z_]+: .*|Q\d+ \[[^\]]+\] .+|  (- |rows: |row: |cols: ).+|:::text .+|#.*|)$/;
function validateGDF(g) {
  const errs = [];
  const L = g.replace(/\n$/, "").split("\n");
  if (L[0] !== "=FORM") errs.push("first line is not =FORM");
  const firstSec = L.findIndex(l => l.startsWith("=SECTION"));
  if (!L.slice(1, firstSec < 0 ? L.length : firstSec).some(l => /^title: \S/.test(l))) errs.push("no title:");
  L.forEach((l, i) => {
    if (!LINE.test(l)) errs.push(`line ${i + 1} not an allowed type: ${l.slice(0, 60)}`);
  });
  const labels = L.filter(l => l.startsWith("=SECTION")).map(l => l.match(/^=SECTION #([^ ]+)/)[1]);
  if (new Set(labels).size !== labels.length) errs.push("duplicate section labels");
  if (labels.some(x => !/^[a-z0-9-]+$/.test(x))) errs.push("bad section label");
  const qs = [];
  for (const l of L) {
    const m = l.match(/^Q(\d+) \[([^\]]+)\] (.*)$/);
    if (m) qs.push({ n: +m[1], type: m[2], rest: m[3], kids: [] });
    else if (l.startsWith("  ") && qs.length) qs[qs.length - 1].kids.push(l);
  }
  qs.forEach((q, i) => {
    if (q.n !== i + 1) errs.push(`Q numbering breaks at Q${q.n}`);
  });
  let screens = 0,
    qcs = 0;
  for (const q of qs) {
    const opts = q.kids.filter(k => k.startsWith("  - "));
    const t = q.type.split(" ")[0];
    if (["single", "multi", "dropdown"].includes(t) && !opts.length) errs.push(`Q${q.n} has no options`);
    if (t === "grid" || t === "grid_multi") {
      const rows = q.kids.filter(k => k.startsWith("  row: ")).length + q.kids.filter(k => k.startsWith("  rows: ")).reduce((n, k) => n + k.slice(8).split(/(?<!\\)\|/).length, 0);
      const cols = q.kids.find(k => k.startsWith("  cols: "));
      if (!rows || !cols) errs.push(`Q${q.n} grid without rows or cols`);
      if (rows > 60) errs.push(`Q${q.n} grid has ${rows} rows`);
      if (cols && cols.slice(8).split(/(?<!\\)\|/).length < 2) errs.push(`Q${q.n} grid with fewer than 2 cols`);
    }
    if (t === "scale" && !/^scale [01]\.\.\d+ "[^"]+"\.\."[^"]+"$/.test(q.type)) errs.push(`Q${q.n} bad scale: ${q.type}`);
    const screen = /(^| )!screen( |$)/.test(q.rest.split(/[^!?=\w ]/)[0]);
    const qc = /^!qc=(reject|terminate)\b/.test(q.rest);
    if (screen) {
      screens++;
      if (!["single", "multi", "dropdown"].includes(t)) errs.push(`Q${q.n} !screen on ${t}`);
    }
    if (qc) {
      qcs++;
      if (!["single", "dropdown"].includes(t)) errs.push(`Q${q.n} !qc on ${t}`);
      if (opts.filter(o => / \[correct\]$/.test(o)).length !== 1) errs.push(`Q${q.n} !qc without exactly one [correct]`);
    }
    if (opts.some(o => / -> disqualify$/.test(o)) && !screen) errs.push(`Q${q.n} disqualify without !screen`);
    for (const k of q.kids) {
      const body = k.replace(/^  (- |rows: |row: |cols: )/, "").replace(/ -> (disqualify|submit|#[a-z0-9-]+)$/, "").replace(/ \[correct\]$/, "");
      if (/(?<!\\)->/.test(body)) errs.push(`Q${q.n} unescaped -> in ${body.slice(0, 40)}`);
      if (/^  (- |row: )/.test(k) && /(?<!\\)\|/.test(body)) errs.push(`Q${q.n} unescaped | in ${body.slice(0, 40)}`);
    }
  }
  if (screens > 3) errs.push(`${screens} !screen questions`);
  if (qcs > 3) errs.push(`${qcs} !qc questions`);
  return { errs, nQ: qs.length };
}

// Run the Apps Script against a stub FormApp that only has the real methods we rely on;
// any other property access is reported. Then answer the form twice (one respondent who passes
// screening, one who does not) and run xuatDuLieu to read back the coded data sheet.
function runAppsScript(code) {
  const errs = [],
    items = [];
  const NAV = { CONTINUE: "CONTINUE", SUBMIT: "SUBMIT", GO_TO_PAGE: "GO_TO_PAGE", RESTART: "RESTART" };
  const TYPE = { PAGE_BREAK: "PAGE_BREAK", GRID: "GRID", SCALE: "SCALE", MULTIPLE_CHOICE: "MULTIPLE_CHOICE", TEXT: "TEXT" };
  const strict = (o, name) => new Proxy(o, { get: (t, k) => (k in t ? t[k] : (errs.push(`unknown API ${name}.${String(k)}`), () => strict({}, "?"))) });
  const item = (type, methods) => {
    const o = { type, p: {}, cc: [] };
    const px = strict(o, type);
    for (const m of methods)
      o[m] = (...a) => {
        o.p[m] = a;
        return px;
      };
    o.createChoice = (v, nav) => {
      o.cc.push([v, nav]);
      return { v };
    };
    items.push(o);
    return px;
  };
  const MC = ["setTitle", "setHelpText", "setRequired", "setChoices", "setChoiceValues", "showOtherOption"];
  let dest = null,
    props = {},
    sheet = null,
    responses = [];
  const handle = o => strict({ getType: () => ({ page: TYPE.PAGE_BREAK, grid: TYPE.GRID, scale: TYPE.SCALE, mc: TYPE.MULTIPLE_CHOICE, text: TYPE.TEXT })[o.type], getId: () => items.indexOf(o) }, "Item");
  const formObj = {
    setDescription: () => form, setProgressBar: () => form, setConfirmationMessage: () => form,
    addMultipleChoiceItem: () => item("mc", MC),
    addPageBreakItem: () => item("page", ["setTitle", "setHelpText"]),
    addGridItem: () => item("grid", ["setTitle", "setHelpText", "setRows", "setColumns", "setRequired"]),
    addScaleItem: () => item("scale", ["setTitle", "setHelpText", "setBounds", "setLabels", "setRequired"]),
    addTextItem: () => item("text", ["setTitle", "setHelpText", "setRequired"]),
    setDestination: (t, id) => {
      dest = [t, id];
      return form;
    },
    getId: () => "form-id", getPublishedUrl: () => "u", getEditUrl: () => "e",
    getItems: () => items.map(handle),
    getResponses: () => responses.map(ans => strict({ getResponseForItem: h => (ans.has(h.getId()) ? strict({ getResponse: () => ans.get(h.getId()) }, "ItemResponse") : null) }, "FormResponse")),
  };
  const form = strict(formObj, "Form");
  const FormApp = strict({ create: () => form, openById: id => (id === "form-id" ? form : errs.push(`openById(${id})`)), PageNavigationType: NAV, DestinationType: { SPREADSHEET: "SPREADSHEET" }, ItemType: TYPE }, "FormApp");
  const sheetObj = { clear: () => sh, getRange: (r, c, nr, nc) => strict({ setValues: v => (v.length !== nr || v.some(x => x.length !== nc) ? errs.push(`setValues ${v.length}x${v[0]?.length} into ${nr}x${nc}`) : (sheet = v)) }, "Range") };
  const sh = strict(sheetObj, "Sheet");
  const ss = strict({ getId: () => "sheet-id", getUrl: () => "s", getSheetByName: () => null, insertSheet: () => sh }, "Spreadsheet");
  const SpreadsheetApp = strict({ create: () => ss, openById: id => (id === "sheet-id" ? ss : errs.push(`openById(${id})`)) }, "SpreadsheetApp");
  const PropertiesService = strict({ getScriptProperties: () => strict({ setProperties: o => (props = { ...props, ...o }), getProperty: k => props[k] ?? null }, "Properties") }, "PropertiesService");
  const Logger = { log: () => {} };
  let run = null;
  try {
    run = new Function("FormApp", "SpreadsheetApp", "PropertiesService", "Logger", `${code}\ntaoBangHoi();\nreturn xuatDuLieu;`)(FormApp, SpreadsheetApp, PropertiesService, Logger);
  } catch (e) {
    errs.push(`runtime: ${e.message}`);
  }
  for (const it of items) {
    if (it.type === "grid") {
      if (!(it.p.setRows?.[0]?.length >= 1) || !(it.p.setColumns?.[0]?.length >= 2) || it.p.setRequired?.[0] !== true) errs.push("grid without rows/columns/required");
      else if (new Set(it.p.setRows[0]).size !== it.p.setRows[0].length) errs.push("grid with duplicate rows");
      else if (new Set(it.p.setColumns[0]).size !== it.p.setColumns[0].length) errs.push("grid with duplicate columns");
    }
    if (it.type === "scale") {
      const [lo, hi] = it.p.setBounds || [];
      if (![0, 1].includes(lo) || !(hi >= 3 && hi <= 10)) errs.push(`scale bounds ${lo}..${hi}`);
      if (!it.p.setLabels?.[0] || !it.p.setLabels?.[1]) errs.push("scale without labels");
    }
    if (it.type === "mc") {
      const ch = it.cc.length ? it.cc.map(c => c[0]) : it.p.setChoiceValues?.[0] || [];
      if (ch.length < 2) errs.push("multiple choice with fewer than 2 choices");
      if (new Set(ch).size !== ch.length) errs.push("multiple choice with duplicate choices");
      if (it.cc.some(c => !Object.values(NAV).includes(c[1]))) errs.push("bad navigation type");
    }
  }
  if (!dest || dest[0] !== "SPREADSHEET" || dest[1] !== "sheet-id") errs.push("not linked to a spreadsheet created by the script");
  if (props.FORM_ID !== "form-id" || props.SHEET_ID !== "sheet-id") errs.push("form and sheet ids not saved for xuatDuLieu");
  // Respondent A answers everything: grids pick column 2 on every row, scales 3, choices the last
  // option (or a free "other" answer where offered), text "abc". Respondent B fails screening.
  const choicesOf = it => (it.cc.length ? it.cc.map(c => c[0]) : it.p.setChoiceValues?.[0] || []);
  const a = new Map(),
    b = new Map();
  items.forEach((it, i) => {
    if (it.type === "grid") a.set(i, it.p.setRows[0].map(() => it.p.setColumns[0][1]));
    if (it.type === "scale") a.set(i, "3");
    if (it.type === "text") a.set(i, "abc");
    if (it.type === "mc") a.set(i, it.p.showOtherOption?.[0] ? "Một câu trả lời khác" : it.cc.length ? choicesOf(it)[0] : choicesOf(it).at(-1));
  });
  const scr = items.find(it => it.cc.length);
  if (scr) b.set(items.indexOf(scr), scr.cc.find(c => c[1] === "SUBMIT")[0]);
  responses = scr ? [a, b] : [a];
  if (typeof run === "function")
    try {
      run();
    } catch (e) {
      errs.push(`xuatDuLieu runtime: ${e.message}`);
    }
  else errs.push("no xuatDuLieu function");
  return { errs, items, sheet, answers: a };
}

function checkSurvey(name, inp) {
  const sv = api.buildSurvey(inp);
  const codes = [...(sv.screening ? [sv.screening.code] : []), ...sv.constructs.flatMap(c => c.blocks.flatMap(b => b.items.map(i => i.code))), ...(sv.ac && !sv.ac.inBlock ? [sv.ac.code] : []), ...sv.demos.map(d => d.code)];
  check(new Set(codes).size === codes.length, `${name}: every column code is unique (${codes.length} codes)`);
  if (inp.attn) {
    check(Boolean(sv.ac) && /^(AC1|ACHK)/.test(sv.ac.code), `${name}: attention check present as ${sv.ac && sv.ac.code}`);
    const host = sv.constructs.flatMap(c => c.blocks).find(b => b.items.some(i => i.isAC));
    if (host) {
      const i = host.items.findIndex(x => x.isAC);
      check(host.kind === "agree" && !host.items[i - 1]?.reverse && !host.items[i + 1]?.reverse, `${name}: attention check sits in an agreement block, not next to a reverse item`);
    } else check(sv.ac && !sv.ac.inBlock && sv.ac.labels.length === 5, `${name}: no agreement block, standalone 5-option attention check`);
  }
  const g = api.toGDF(sv);
  const v = validateGDF(g);
  check(!v.errs.length, `${name}: GDF passes the v1.1 self-check list${v.errs.length ? ` (${v.errs.slice(0, 3).join("; ")})` : ""}`);
  check((g.match(/ \[correct\]$/gm) || []).length === (sv.ac ? 1 : 0) && (g.match(/ !screen /g) || []).length === (sv.screening ? 1 : 0), `${name}: GDF has one !screen and one !qc question`);
  check(!/(^|\| )[A-Z][A-Z0-9_]*\d+\. /m.test(g.split("\n").filter(l => /^  (rows?|cols): /.test(l)).map(l => l.replace(/^  (rows?|cols): /, "")).join("\n")), `${name}: GDF rows carry no variable codes`);
  const code = api.appsScript(sv);
  let parses = true;
  try {
    new Function(code);
  } catch (e) {
    parses = false;
  }
  check(parses, `${name}: Apps Script is valid JavaScript`);
  const run = runAppsScript(code);
  check(!run.errs.length, `${name}: Apps Script runs against FormApp using only real methods${run.errs.length ? ` (${[...new Set(run.errs)].slice(0, 3).join("; ")})` : ""}`);
  const rowsOK = run.items.filter(i => i.type === "grid").every(i => i.p.setRows[0].every(r => /^[A-Za-z][A-Za-z0-9_]*\. /.test(r)));
  check(rowsOK, `${name}: every Google Form grid row starts with its variable code`);
  const cb = api.codebookRows(sv);
  check(cb.length - 1 === codes.length, `${name}: codebook has one row per data column (${cb.length - 1})`);
  check(cb.some(r => /Đáp án đúng: 2/.test(r[8])) === Boolean(sv.ac) && cb.filter(r => /^TT\d/.test(r[0])).every(r => /1 = |Tự điền/.test(r[8])), `${name}: codebook lists the attention answer and demographic value labels`);
  check(api.toCSV(cb).startsWith("﻿"), `${name}: CSV starts with a BOM so Excel reads Vietnamese`);
  // Coded data sheet from xuatDuLieu: the codebook's columns minus free-text answers, one row for the
  // respondent who passed screening, numbers only; "Khác" typed in is coded as the "Khác (ghi rõ)" value.
  const coded = cb.slice(1).filter(r => !/^Tự điền/.test(r[8])).map(r => r[0]);
  check(Boolean(run.sheet) && JSON.stringify(run.sheet[0]) === JSON.stringify(coded), `${name}: xuatDuLieu writes one column per coded variable in codebook order${run.sheet ? "" : " (no sheet)"}`);
  check(Boolean(run.sheet) && run.sheet.length === 2 && run.sheet[1].every(v => typeof v === "number" && Number.isFinite(v)), `${name}: xuatDuLieu keeps only the respondent who passed screening, every value a number`);
  if (run.sheet)
    for (const d of sv.demos.filter(x => x.type === "single")) {
      const v = run.sheet[1][run.sheet[0].indexOf(d.code)], other = d.options.findIndex(x => /\(ghi rõ\)$/.test(x));
      check(v === (other >= 0 ? other + 1 : d.options.length), `${name}: ${d.code} coded ${v} as in the codebook`, true);
    }
  return sv;
}

// Persona 1: consumer, cosmetics bought online.
const p1 = checkSurvey(
  "persona consumer (TPB, eWOM, trust, value)",
  input(["tpb:ATT", "tpb:SN", "tpb:PBC", "truyen-mieng-dien-tu-ewom:EWOM", "niem-tin-thuong-mai-dien-tu:TR", "gia-tri-cam-nhan-perval:PV", "tpb:INT"], {
    aud: "td", ph: { "thực hiện hành vi": "mua mỹ phẩm trực tuyến", "sản phẩm": "mỹ phẩm này", "cửa hàng trực tuyến": "cửa hàng này" }, target: "mỹ phẩm",
  })
);
check(p1.addr === "Anh/Chị" && /mua mỹ phẩm trong 6 tháng/.test(p1.screening.text), "persona consumer: Anh/Chị and a 6-month purchase screening");
check(p1.demos.every(d => !d.options.includes("Dưới 18")), "persona consumer: no 'Dưới 18' option");
const sn = p1.constructs.find(c => c.code === "SN");
check(sn.blocks.length === 3 && sn.notes.length === 1 && /sang Likert 5 mức/.test(sn.notes[0]), `persona consumer: TPB SN mixes poles and agreement, change stated once (${sn.notes.join("; ")})`);
check(p1.constructs.find(c => c.code === "EWOM").blocks.some(b => b.items.some(i => i.isAC)), "persona consumer: attention check lands mid-form in the eWOM agreement block");
// Persona 2: employees.
const p2 = checkSurvey(
  "persona HRM (POS, servant leadership, UWES, turnover)",
  input(["ho-tro-to-chuc-pos:POS", "lanh-dao-phuc-vu:SL", "gan-ket-cong-viec-uwes:VI", "gan-ket-cong-viec-uwes:DE", "gan-ket-cong-viec-uwes:AB", "y-dinh-nghi-viec:TI"], {
    aud: "ld", ph: { "công ty": "Công ty ABC" }, target: "Công ty ABC",
  })
);
const uw = p2.constructs.find(c => c.code === "VI");
check(uw.blocks[0].min === 0 && uw.blocks[0].k === 7 && /0 = Không bao giờ/.test(uw.blocks[0].legend), "persona HRM: UWES keeps 0–6 next to Likert 5");
check(p2.constructs.find(c => c.code === "POS").notes.some(n => /7 mức của bản gốc sang Likert 5/.test(n)), "persona HRM: POS change from 7 to 5 points is stated");
check(/làm việc tại Công ty ABC từ 6 tháng/.test(p2.screening.text) && p2.demos.some(d => d.key === "tenure"), "persona HRM: employee screening and tenure question");
// Persona 3: supervisor checks.
const p3a = checkSurvey("supervisor TAM", input(["tam:PEOU", "tam:PU", "tam:BI"], { aud: "sv", ph: { "hệ thống": "ví điện tử" } }));
check(p3a.addr === "Bạn" && /sinh viên/.test(p3a.screening.text) && p3a.demos.some(d => d.key === "year"), "supervisor TAM: students get Bạn, student screening and year of study");
checkSurvey("supervisor SERVPERF → LOY", input(["servperf:TAN", "servperf:REL", "servperf:RES", "servperf:ASU", "servperf:EMP", "y-dinh-hanh-vi-khach-hang:LOY"], { aud: "td", ph: { "công ty": "cửa hàng này", "loại dịch vụ": "dịch vụ này" } }));
const p3c = checkSurvey("supervisor TPB entrepreneurship", input(["tpb:ATT", "tpb:SN", "tpb:PBC", "tpb:INT"], { aud: "sv", mode: "orig", ph: { "thực hiện hành vi": "khởi nghiệp kinh doanh sau khi tốt nghiệp" } }));
check(p3c.constructs[0].blocks[0].kind === "bipolar" && p3c.constructs[0].blocks[0].k === 7, "supervisor TPB: attitude stays a 7-point semantic differential");
checkSurvey("clashing codes (TAM BI + UTAUT BI + Ohanian ATT + TPB ATT)", input(["tam:BI", "utaut:BI", "do-tin-cay-nguon-ohanian:ATT", "tpb:ATT"], { aud: "td" }));
checkSurvey("no agreement block (PSS-10, GAD-7)", input(["cang-thang-pss-10:PSS", "gad-7:GAD"], { aud: "sv" }));

// ---- control and grouping variables from the model drawer link ----
{
  const ex = api.extraFromParams(new URLSearchParams("c=tam:PU&ctrl=Độ tuổi;Quy mô doanh nghiệp&ctrl=Thâm niên&grp=Loại hình doanh nghiệp:Nhà nước;Tư nhân trong nước"));
  check(JSON.stringify(ex.map(x => [x.label, x.opts, x.role])) === JSON.stringify([["Độ tuổi", "", "ctrl"], ["Quy mô doanh nghiệp", "", "ctrl"], ["Thâm niên", "", "ctrl"], ["Loại hình doanh nghiệp", "Nhà nước; Tư nhân trong nước", "grp"]]), `link: ctrl (; or repeated) and grp=name:groups are read (${JSON.stringify(ex)})`);
  check(api.extraFromParams(new URLSearchParams("c=tam:PU")).length === 0, "link: no ctrl/grp, no extra questions");
  const opt = x => ({ label: x.label, options: x.opts.split(/[;\n]/), role: x.role });
  const G = api.generalQuestions("ld", ["gender", "age", "edu"], ex.map(opt));
  const age = G.filter(g => g.key === "age");
  check(age.length === 1 && age[0].role === "ctrl", "control 'Độ tuổi' uses the ticked age question once, marked as a control");
  check(G.some(g => g.key === "tenure" && g.role === "ctrl" && Array.isArray(g.opts)), "control 'Thâm niên' adds the ready-made tenure question");
  const size = G.find(g => g.label === "Quy mô doanh nghiệp");
  check(size && size.custom && size.opts === "text" && size.role === "ctrl", "control with no ready-made question is a free answer");
  const grp = G.find(g => g.key === "orgtype");
  check(grp && grp.role === "grp" && grp.groups.join("|") === "Nhà nước|Tư nhân trong nước" && grp.opts.length === 4, "grouping variable whose groups are options of a ready-made question keeps that question");
  const G2 = api.generalQuestions("td", ["gender", "age"], [{ label: "Độ tuổi", options: ["Dưới 30", "Từ 30 trở lên"], role: "grp" }]);
  check(G2.filter(g => g.key === "age").length === 1 && G2.find(g => g.key === "age").opts.join("|") === "Dưới 30|Từ 30 trở lên", "grouping variable with its own groups replaces the age options, never asks age twice");
  check(api.demoOf("Chất lượng dịch vụ", "td") === null && api.demoOf("Giới tính", "sv")[0] === "gender", "ready-made match: 'chất lượng' is not income ('lương'), 'giới tính' is gender");
  const hr = checkSurvey(
    "persona HRM with controls and multigroup (link ctrl/grp)",
    input(["ho-tro-to-chuc-pos:POS", "gan-ket-cong-viec-uwes:VI", "y-dinh-nghi-viec:TI"], { aud: "ld", ph: { "công ty": "Công ty ABC" }, target: "Công ty ABC", demos: ["gender", "age", "edu"], extra: ex.map(opt) })
  );
  check(hr.mga && hr.mga.groups.length === 2 && hr.mga.code === hr.demos.find(d => d.key === "orgtype").code, "multigroup: grouping variable and its two groups reach the survey");
  check(api.mgaTotal(155, hr.mga) === 310 && api.mgaTotal(155, null) === 155, "multigroup: minimum sample is per group (155 × 2 = 310)");
  const cbh = api.codebookRows(hr);
  check(cbh.filter(r => r[1] === "Biến kiểm soát").length === 3 && cbh.some(r => r[1] === "Biến phân nhóm" && /So sánh đa nhóm: Nhà nước, Tư nhân trong nước/.test(r[8])), "codebook marks control and grouping variables");
  check(/# TT\d+: biến phân nhóm/.test(api.toGDF(hr)), "GDF notes the grouping variable");
  check(/Q\d+ \[text\] Quy mô doanh nghiệp/.test(api.toGDF(hr)) && /"TT4\. Quy mô doanh nghiệp"\)\.setRequired\(true\)/.test(api.appsScript(hr)), "a free-answer control variable is required on GDF and Google Form");
  const refsOf = c => scales.get(c.scale.slug).references;
  const plain = h => h.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
  const ss = api.kitSample("pls", 3, hr.nItems);
  const th = plain(api.thesisHtml(hr, { ss, method: "pls", arrows: 3, drop: 0.15 }, refsOf));
  check(/tổng cỡ mẫu tối thiểu là 155 × 2 = 310 quan sát/.test(th) && /Nhà nước và Tư nhân trong nước/.test(th) && /số phiếu dự kiến thu là 365 phiếu/.test(th), "chapter 3: multigroup minimum per group, total and planned forms");
  check(/Các biến kiểm soát độ tuổi \(TT2\), quy mô doanh nghiệp \(TT4\) và thâm niên làm việc tại tổ chức hiện tại \(TT5\)/.test(th), "chapter 3: control variables named with their codes");
  check(/Phiếu khảo sát gồm câu hỏi sàng lọc, phần đo lường gồm 3 khái niệm/.test(th), "chapter 3: questionnaire structure sentence");
  check((th.match(/6 − điểm/g) || []).length === 1 && /POS2, POS3/.test(th), "chapter 3: reverse items listed once with one rule");
  check(/Eisenberger, R\., Huntington/.test(th) && /Kock, N\./.test(th), "chapter 3: scale and method references listed");
}

// ---- wording on the respondent side ----
{
  const sv = api.buildSurvey(input(["lmx-7:LMX", "tam:PU"], { aud: "ld", ph: { "quản lý": "quản lý trực tiếp", "hệ thống": "phần mềm" }, who: "Nguyễn An", org: "Khoa QTKD", contact: "an@x.vn" }));
  const thl = api.thesisHtml(sv, { ss: api.kitSample("spss", 2, sv.nItems), method: "spss", arrows: 2, drop: 0 }, c => scales.get(c.scale.slug).references);
  check(/thang 5 mức \(1 đến 5\) với nhãn hai đầu riêng cho từng câu/.test(thl) && !/kết hợp thang 5 mức.*kết hợp thang 5 mức/.test(thl), "chapter 3: LMX-7 per-item anchors read as one scale");
  check(!/\(\s*[^()]*\)\s*\(/.test(thl.replace(/<[^>]+>/g, "")), "chapter 3: no two parentheses back to back");
  const one = sv.constructs[0].blocks.find(b => b.items.filter(i => !i.isAC).length === 1);
  check(one && !/cho mỗi câu|các phát biểu/.test(api.gridTitle(sv, one, "")), `a one-statement grid is not titled "cho mỗi câu" (${one && api.gridTitle(sv, one, "")})`);
  check(sv.ac.labels[1] === "2 - Không đồng ý", "attention check options carry the number the instruction asks for");
  check(/Người thực hiện: Nguyễn An, Khoa QTKD\. Liên hệ khi có thắc mắc: an@x\.vn\./.test(api.introLine(sv)), "online intro names the researcher and contact when given");
  const g = api.toGDF(sv);
  check(/  - 2 - Không đồng ý \[correct\]/.test(g), "GDF attention check: correct option numbered like the grid columns");
  const hidden = api.toGDF(api.buildSurvey(input(["tam:PU", "tam:BI"], { aud: "sv", showNames: false })));
  check(/=SECTION #phan-1 \| Phần 1/.test(hidden) && !/#nhan-thuc/.test(hidden), "GDF section labels do not reveal construct names when names are hidden");
  const cbr = api.codebookRows(api.buildSurvey(input(["tam:PU"], { aud: "sv" })));
  check(cbr.every(r => !/Điều chỉnh: điều chỉnh/.test(r[7])), "codebook does not say 'Điều chỉnh: điều chỉnh'");
}
// The whole library in one form, three modes, construct names hidden in one of them.
const everything = published.flatMap(s => s.constructs.map(c => `${s.slug}:${c.code}`));
for (const mode of ["5", "7", "orig"]) checkSurvey(`whole library (${everything.length} constructs, mode ${mode})`, input(everything, { aud: mode === "7" ? "ld" : "td", mode, showNames: mode !== "orig" }));

// ---- concept search ----
const all = published.flatMap(s => s.constructs.map(c => ({ s, c })));
const index = all.map(({ s, c }) => api.indexConstruct(s, c));
const top = (q, n) => api.rankConstructs(q, index).slice(0, n).map(i => all[i].c.nameEn.toLowerCase());
for (const [q, want] of [["trust", "trust"], ["niem tin", "trust"], ["hai long", "satisf"], ["intention to use", "intention"], ["perceived usefulness", "usefulness"], ["de su dung", "ease"], ["cang thang", "stress"], ["lanh dao", "lead"]]) {
  const got = top(q, 5);
  check(got.some(n => n.includes(want)), `search "${q}" finds ${want} in top 5 (got ${got.slice(0, 3).join(" | ")})`);
}
check(!api.expandQuery("gia tri").includes("chi phi"), "search: 'gia tri' does not pull in the price synonyms");
check(!api.expandQuery("niem tin").includes("tin") && api.expandQuery("niem tin").includes("trust"), "search: 'niem tin' keeps the phrase and 'trust', not the single word 'tin'");
{
  const risk = api.rankConstructs("nhan thuc rui ro", index).map(i => all[i]);
  check(risk.every(({ s, c }) => /risk|rui ro/.test(api.normText(`${c.nameEn} ${c.nameVi} ${s.fullName} ${c.definition}`))), `search: a concept the library lacks (perceived risk) does not return every "nhận thức" construct (got ${risk.slice(0, 3).map(x => x.c.nameEn).join(" | ")})`);
}
check(top("y dinh mua", 5).some(n => /buy|purchase|intention/.test(n)), "search: 'y dinh mua' still finds purchase intention");
for (const q of ["trust", "y dinh", "chat luong dich vu", "lanh dao"]) check(api.rankConstructs(q, index).length <= 12, `search "${q}": at most 12 results`);

// ---- template pages ----
const tdir = "src/content/mau-bang-hoi";
for (const tf of readdirSync(tdir).filter(f => f.endsWith(".json") && !f.startsWith("_"))) {
  const t = JSON.parse(readFileSync(`${tdir}/${tf}`, "utf8"));
  const items = [];
  for (const key of t.constructs) {
    const [slug, code] = key.split(":");
    const c = scales.get(slug)?.constructs.find(x => x.code === code);
    check(Boolean(c), `${tf}: construct ${key} exists`);
    if (c) items.push(...c.items);
  }
  check(t.paths.every(p => t.constructs.includes(p.from) && t.constructs.includes(p.to)), `${tf}: paths use listed constructs`);
  check(ts.maxIndegree(t.paths) <= 8, `${tf}: at most 8 arrows into one construct`);
  const filled = items.map(i => ts.fillPlaceholders(i.vi, t.placeholders));
  const left = filled.filter(v => /\[[^\]]+\]/.test(v));
  check(!left.length, `${tf}: all placeholders filled${left.length ? ` (left: ${left[0]})` : ""}`);
  check(filled.every((v, i) => v === api.fillPlaceholders(items[i].vi, t.placeholders)), `${tf}: kit.ts fills placeholders like the tool`);
  const dup = filled.find(v => /(?<!\p{L})(\p{L}+ \p{L}+) \1(?!\p{L})|(?<!\p{L})này này(?!\p{L})/iu.test(v));
  check(!dup, `${tf}: no doubled words after filling${dup ? ` (${dup})` : ""}`);
  check(["sv", "ld", "td"].includes(ts.audienceCode(t.audience)), `${tf}: audience maps to a tool audience (${ts.audienceCode(t.audience)})`);
}


// ---- unfilled placeholders are listed before Word / Google Form / GDF export (warning only) ----
{
  const pend = api.buildSurvey(input(["tam:PEOU", "tam:PU", "tam:BI"], { aud: "sv", topic: "", ph: {} }));
  const word = api.respondentPlaceholders(pend, "word"), gdf = api.respondentPlaceholders(pend, "gdf");
  check(word.includes("[tên đề tài]") && word.includes("[họ tên người thực hiện]") && word.includes("[trường/ngành]"), `placeholders: Word lists topic, author and screening blanks (${word.join(", ")})`);
  check(word.some(x => /hệ thống/i.test(x)), "placeholders: an unfilled item placeholder ([hệ thống]) is listed");
  check(!gdf.includes("[họ tên người thực hiện]") && gdf.includes("[tên đề tài]"), "placeholders: GDF lists only text it shows respondents");
  const done = api.buildSurvey(input(["tam:PEOU", "tam:PU", "tam:BI"], { aud: "td", topic: "Ví điện tử", who: "An", org: "Khoa KT", contact: "a@b.vn", target: "ví điện tử", ph: { "hệ thống": "ví điện tử" } }));
  for (const t of ["word", "gform", "gdf"]) check(api.respondentPlaceholders(done, t).length === 0, `placeholders: a filled survey has none in ${t} (${api.respondentPlaceholders(done, t).join(", ")})`);
  check(/phWarn\('word'\)/.test(kitSrc) && /phWarn\('gform'\)/.test(kitSrc) && /phWarn\('gdf'\)/.test(kitSrc) && /id="bk-ph-warn"[^>]*role="alert"/.test(kitSrc), "placeholders: each export button shows the warning");
}

console.log(`${passed} checks passed`);
if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
