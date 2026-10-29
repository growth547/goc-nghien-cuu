// Unit check for the questionnaire kit (src/tools/bo-khao-sat.html):
// its statistics block must be the same code as the sample-size calculator's,
// and the pure kit helpers must behave on every published scale.
import { readFileSync, readdirSync } from "node:fs";

const block = (src, tag) => {
  const m = src.match(new RegExp(`//#${tag}-start([\\s\\S]*?)//#${tag}-end`));
  if (!m) throw new Error(`missing //#${tag} block`);
  return m[1];
};
const kitSrc = readFileSync("src/tools/bo-khao-sat.html", "utf8");
const calcSrc = readFileSync("src/tools/tinh-co-mau.html", "utf8");
let failed = 0;
const check = (ok, label) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}`);
  if (!ok) failed++;
};

const norm = s => s.split(String.fromCharCode(13)).join("").trim();
check(norm(block(kitSrc, "math")) === norm(block(calcSrc, "math")), "math block matches tinh-co-mau.html");

const api = new Function(
  `${block(kitSrc, "math")}${block(kitSrc, "kit")}
   return { placeholdersOf, fillPlaceholders, citeOf, citedBy, isAgreementScale, kitSample, normText, expandQuery, indexConstruct, rankConstructs };`
)();

check(api.fillPlaceholders("Sử dụng [hệ thống] giúp tôi", { "hệ thống": "ví MoMo" }) === "Sử dụng ví MoMo giúp tôi", "fills a placeholder");
check(api.fillPlaceholders("[Hệ thống] dễ dùng", { "hệ thống": "ví MoMo" }) === "Ví MoMo dễ dùng", "capitalises at a capitalised placeholder");
check(api.fillPlaceholders("Dùng [hệ thống]", {}) === "Dùng [hệ thống]", "keeps an unfilled placeholder visible");
check(api.citeOf("Davis (1989), 6 biến.") === "Davis (1989)", "cite: single author");
check(api.citeOf("Mowday, Steers & Porter (1979), 15 biến.") === "Mowday, Steers và Porter (1979)", "cite: & becomes và");
check(api.citeOf("Venkatesh và cộng sự (2003), Bảng 16, 4 biến.") === "Venkatesh và cộng sự (2003)", "cite: và cộng sự");
check(api.citeOf("Biến cảm nhận P1–P4 của Parasuraman, Zeithaml & Berry (1988), Cronin & Taylor (1992) dùng lại; 4 biến.") === "Parasuraman, Zeithaml và Berry (1988)", "cite: skips leading prose");

const pls = api.kitSample("pls", 2, 14);
check(pls.pow === 68 && pls.second === 155 && pls.min === 155, `PLS-SEM, 2 arrows: G*Power 68, ISR 155, min 155 (got ${pls.pow}/${pls.second}/${pls.min})`);
const spss = api.kitSample("spss", 5, 30);
check(spss.pow === 92 && spss.second === 150 && spss.min === 150, `SPSS, 5 predictors, 30 items: 92 vs 150 (got ${spss.pow}/${spss.second}/${spss.min})`);

check(api.citedBy("Davis (1989)", "Davis, F. D. (1989). Perceived usefulness") && !api.citedBy("Davis (1989)", "Davis, F. D., Bagozzi, R. P., & Warshaw, P. R. (1989). User acceptance"), "citedBy: single author does not match a co-authored paper");

// The static template pages use src/utils/kit.ts; it must agree with the browser copy.
const ts = await import("../src/utils/kit.ts");
for (let m = 1; m <= 8; m++) check(ts.POWER_N[m] === api.kitSample("pls", m, 1).pow, `POWER_N[${m}] = ${ts.POWER_N[m]} matches G*Power computation`);
check(ts.ISR_N === api.kitSample("pls", 1, 1).second, "ISR_N matches Kock & Hadaya computation");

// Every published construct must yield a real citation, not the raw source note.
const dir = "src/content/thang-do";
const scales = new Map();
for (const f of readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_"))) {
  const s = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  scales.set(f.slice(0, -5), s);
  for (const c of s.constructs) {
    const cite = api.citeOf(c.source);
    check(/\(\d{4}\)$/.test(cite) && cite.length < 80, `${f} ${c.code}: ${cite}`);
    check(ts.citeOf(c.source) === cite, `${f} ${c.code}: kit.ts gives the same citation`);
    const plain = s.references.map(r => r.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&"));
    check(plain.some(r => api.citedBy(cite, r)), `${f} ${c.code}: reference listed for ${cite}`);
  }
}

// Concept search: English, Vietnamese without diacritics, and synonyms reach the right constructs.
const all = [...scales.values()].flatMap(s => s.constructs.map(c => ({ s, c })));
const index = all.map(({ s, c }) => api.indexConstruct(s, c));
const top = (q, n) => api.rankConstructs(q, index).slice(0, n).map(i => all[i].c.nameEn.toLowerCase());
for (const [q, want] of [["trust", "trust"], ["niem tin", "trust"], ["hai long", "satisf"], ["intention to use", "intention"], ["perceived usefulness", "usefulness"], ["de su dung", "ease"], ["cang thang", "stress"], ["lanh dao", "lead"]]) {
  const got = top(q, 5);
  check(got.some(n => n.includes(want)), `search "${q}" finds ${want} in top 5 (got ${got.slice(0, 3).join(" | ")})`);
}
check(!api.expandQuery("gia tri").includes("chi phi"), "search: 'gia tri' does not pull in the price synonyms");

// Template pages: every construct key resolves, every path joins listed constructs,
// the model fits the precomputed power table, and every placeholder in its items is filled.
const tdir = "src/content/mau-bang-hoi";
for (const f of readdirSync(tdir).filter(f => f.endsWith(".json") && !f.startsWith("_"))) {
  const t = JSON.parse(readFileSync(`${tdir}/${f}`, "utf8"));
  const items = [];
  for (const key of t.constructs) {
    const [slug, code] = key.split(":");
    const c = scales.get(slug)?.constructs.find(x => x.code === code);
    check(Boolean(c), `${f}: construct ${key} exists`);
    if (c) items.push(...c.items);
  }
  check(t.paths.every(p => t.constructs.includes(p.from) && t.constructs.includes(p.to)), `${f}: paths use listed constructs`);
  check(ts.maxIndegree(t.paths) <= 8, `${f}: at most 8 arrows into one construct`);
  const left = items.map(i => ts.fillPlaceholders(i.vi, t.placeholders)).filter(v => /\[[^\]]+\]/.test(v));
  check(!left.length, `${f}: all placeholders filled${left.length ? ` (left: ${left[0]})` : ""}`);
}

if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
