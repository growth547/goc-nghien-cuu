// Validates src/content/bien-nghien-cuu/*.json (research-variable pages): run `node scripts/check-variables.mjs`.
// `--online` also looks every DOI up on api.crossref.org and checks the year and first author against the text.
// Variables with `calc` must exist in the calculator (src/tools/tinh-chi-so-tai-chinh.html) with the same slug,
// and the work the calculator cites for that variable must be one of the page's references.
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../src/content/bien-nghien-cuu/", import.meta.url);
const files = readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_"));
const slugs = new Set(files.map(f => f.slice(0, -5)));
const GROUPS = [
  "Khả năng sinh lời",
  "Cấu trúc vốn",
  "Thanh khoản & vốn lưu động",
  "Rủi ro & kiệt quệ tài chính",
  "Định giá thị trường",
  "Đặc điểm doanh nghiệp",
  "Cổ tức & đầu tư",
  "Chất lượng lợi nhuận & kiểm toán",
  "Quản trị công ty & sở hữu",
  "Trách nhiệm xã hội & ESG",
  "Ngân hàng",
];
const SCOPES = ["Doanh nghiệp", "Ngân hàng", "Doanh nghiệp và ngân hàng"];
const STATEMENTS = ["CĐKT", "KQKD", "LCTT", "Thuyết minh", "Thị trường", "Báo cáo thường niên", "Báo cáo quản trị", "CĐKT-TCTD", "KQKD-TCTD"];
// Line-item codes on the Thông tư 200/2014/TT-BTC forms B01-DN, B02-DN, B03-DN (indirect method).
const CODES = {
  CĐKT: "100 110 120 121 123 130 131 140 141 149 150 200 210 220 221 222 223 227 230 240 250 260 270 300 310 311 320 330 338 339 400 410 411 421 429 440",
  KQKD: "01 02 10 11 20 21 22 23 24 25 26 30 31 32 40 50 51 52 60 61 62 70",
  LCTT: "01 02 08 20 21 22 30 36 40 50 60 70",
};
const valid = Object.fromEntries(Object.entries(CODES).map(([k, v]) => [k, new Set(v.split(" "))]));

let errors = 0;
const fail = (slug, msg) => { errors++; console.log(`FAIL ${slug}: ${msg}`); };
const all = [];

// Calculator registry: same extraction as check-ratios.mjs.
const toolSrc = readFileSync(new URL("../src/tools/tinh-chi-so-tai-chinh.html", import.meta.url), "utf8");
const block = toolSrc.split("//#fr-start")[1]?.split("//#fr-end")[0];
const tool = block ? new Function(`${block}; return { VARS, REFS };`)() : null;
if (!tool) fail("tool", "could not load VARS from src/tools/tinh-chi-so-tai-chinh.html");

for (const file of files) {
  const slug = file.slice(0, -5);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(slug, "slug must be lowercase ascii-kebab");
  let d;
  try { d = JSON.parse(readFileSync(new URL(file, dir), "utf8")); } catch (e) { fail(slug, `invalid JSON: ${e.message}`); continue; }
  all.push([slug, d]);
  for (const k of ["title", "description", "name", "nameEn", "symbol", "group", "scope", "keyword", "definition", "formula", "items", "variants", "relations", "mistakes", "stata", "r", "references", "related"])
    if (d[k] === undefined || d[k] === "") fail(slug, `missing ${k}`);
  if (d.title?.length > 70) fail(slug, `title ${d.title.length} chars > 70`);
  if (d.description && (d.description.length < 110 || d.description.length > 170)) fail(slug, `description ${d.description.length} chars, need 110–170`);
  if (d.group && !GROUPS.includes(d.group)) fail(slug, `group must be one of: ${GROUPS.join(" | ")}`);
  if (d.scope && !SCOPES.includes(d.scope)) fail(slug, `scope must be one of: ${SCOPES.join(" | ")}`);
  if ((d.definition ?? "").length < 150) fail(slug, "definition shorter than 150 chars");
  for (const it of d.items ?? []) {
    if (!STATEMENTS.includes(it.statement)) fail(slug, `item "${it.label}": unknown statement ${it.statement}`);
    if (it.code !== undefined) {
      if (!valid[it.statement]) fail(slug, `item "${it.label}": code given for ${it.statement}, which has no TT200 codes`);
      else for (const c of String(it.code).split("+")) if (!valid[it.statement].has(c.trim())) fail(slug, `item "${it.label}": ${it.statement} code ${c} is not a TT200 code`);
    }
    if (d.scope === "Ngân hàng" && it.code) fail(slug, `bank variable must not cite TT200 codes (${it.label})`);
  }
  if (!Array.isArray(d.variants) || !d.variants.length) fail(slug, "needs at least 1 variant");
  if (!Array.isArray(d.relations) || !d.relations.length || d.relations.some(r => !["+", "-", "±"].includes(r.sign) || !r.note?.trim())) fail(slug, "relations need {with, sign +/-/±, note}");
  if (!Array.isArray(d.mistakes) || d.mistakes.length < 2) fail(slug, "needs at least 2 common mistakes");
  if (!Array.isArray(d.references) || d.references.length < 2 || d.references.length > 4) fail(slug, "needs 2–4 references");
  const dois = new Set();
  for (const r of d.references ?? []) {
    if (!/^10\.\d{4,9}\/\S+$/.test(r.doi ?? "")) fail(slug, `bad DOI "${r.doi}"`);
    if (dois.has(r.doi?.toLowerCase())) fail(slug, `duplicate DOI ${r.doi}`);
    dois.add(r.doi?.toLowerCase());
    if (!/\(\d{4}\)/.test(r.text ?? "")) fail(slug, `reference without (year): ${r.text?.slice(0, 50)}`);
    if (/doi\.org/i.test(r.text ?? "")) fail(slug, "put the DOI in `doi`, not in the reference text");
  }
  if (!Array.isArray(d.related) || d.related.length < 2) fail(slug, "needs at least 2 related variables");
  for (const r of d.related ?? []) {
    if (r === slug) fail(slug, "related lists itself");
    else if (!slugs.has(r)) fail(slug, `related variable "${r}" has no file`);
  }
  const texts = [d.title, d.description, d.definition, d.formula, ...(d.mistakes ?? []), ...(d.variants ?? []).flatMap(v => [v.name, v.formula, v.note]), ...(d.relations ?? []).flatMap(r => [r.with, r.note])];
  if (texts.some(t => /—/.test(t ?? ""))) fail(slug, "uses an em dash; rewrite the sentence");
  if (tool && d.calc !== undefined) {
    const v = tool.VARS.find(x => x.id === d.calc);
    if (!v) fail(slug, `calc "${d.calc}" is not a variable in the calculator`);
    else {
      if (v.slug !== slug) fail(slug, `calculator variable ${d.calc} points to slug ${v.slug}`);
      const cited = tool.REFS[v.cite]?.doi?.toLowerCase();
      if (!cited || !dois.has(cited)) fail(slug, `calculator cites ${v.cite} (${cited}) for ${d.calc}, which is not in this page's references`);
    }
  }
}
// Every calculator variable needs a page that points back to it.
if (tool) for (const v of tool.VARS) if (!all.some(([, d]) => d.calc === v.id)) fail(`tool:${v.id}`, `no variable page has calc "${v.id}"`);
const symbols = new Map();
for (const [slug, d] of all) {
  if (symbols.has(d.symbol)) fail(slug, `symbol ${d.symbol} also used by ${symbols.get(d.symbol)}`);
  symbols.set(d.symbol, slug);
}
if (all.length < 40 || all.length > 60) fail("collection", `${all.length} variables, expected 40–60`);

if (process.argv.includes("--online")) {
  const seen = new Map();
  for (const [slug, d] of all) for (const r of d.references) if (!seen.has(r.doi.toLowerCase())) seen.set(r.doi.toLowerCase(), [slug, r]);
  for (const [doi, [slug, r]] of seen) {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    if (!res.ok) { fail(slug, `DOI ${doi} not found on Crossref (HTTP ${res.status})`); continue; }
    const m = (await res.json()).message;
    const year = (m["published-print"] ?? m["published-online"] ?? m.issued)["date-parts"][0][0];
    const fold = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    // Vietnamese names are often split the other way round on Crossref (family "Minh Sang", given "Nguyen").
    const first = fold(`${m.author?.[0]?.family ?? ""} ${m.author?.[0]?.given ?? ""}`).trim();
    const text = fold(r.text);
    if (!text.includes(`(${year})`)) fail(slug, `DOI ${doi}: Crossref year ${year} not in "${r.text.slice(0, 60)}"`);
    if (first && !first.split(/[\s.-]+/).some(w => w.length > 1 && text.includes(w))) fail(slug, `DOI ${doi}: first author "${m.author[0].family}" not in reference text`);
  }
  console.log(`checked ${seen.size} DOIs on Crossref`);
}

if (errors) { console.log(`\n${errors} problem(s) in ${files.length} variable files`); process.exit(1); }
console.log(`OK ${files.length} variables (${all.filter(([, d]) => d.calc).length} computed by the calculator)`);
