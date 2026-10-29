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
   return { placeholdersOf, fillPlaceholders, citeOf, citedBy, isAgreementScale, kitSample };`
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

// Every published construct must yield a real citation, not the raw source note.
const dir = "src/content/thang-do";
for (const f of readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_"))) {
  const s = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  for (const c of s.constructs) {
    const cite = api.citeOf(c.source);
    check(/\(\d{4}\)$/.test(cite) && cite.length < 80, `${f} ${c.code}: ${cite}`);
    const plain = s.references.map(r => r.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&"));
    check(plain.some(r => api.citedBy(cite, r)), `${f} ${c.code}: reference listed for ${cite}`);
  }
}

if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
