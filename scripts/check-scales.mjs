// Validates src/content/thang-do/*.json beyond the zod schema: run `node scripts/check-scales.mjs [slug...]`.
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../src/content/thang-do/", import.meta.url);
const all = readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_"));
const slugs = new Set(all.map(f => f.slice(0, -5)));
const only = process.argv.slice(2);
const FIELDS = [
  "Công nghệ & hệ thống thông tin",
  "Hành vi người tiêu dùng",
  "Chất lượng dịch vụ",
  "Marketing & thương hiệu",
  "Quản trị nhân sự & tổ chức",
  "Tâm lý & sức khoẻ tinh thần",
];
let errors = 0;
// Title/keyword and prose-citation checks: switched on once existing files comply.
const STRICT = false;
const plain = html => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&");
// "Davis (1989)", "Davis, Bagozzi & Warshaw (1989)", "Venkatesh và cộng sự (2003)", "(Yoo & Donthu, 2001)".
const NAME = String.raw`(?<!\p{L})(?:[Vv]an der |[Vv]an |[Dd]e |[Dd]i |[Ll]e )*\p{Lu}[\p{L}'\-]+`;
const NARR = new RegExp(String.raw`(${NAME})(?:(?:, | & | và )${NAME})*(?: và cộng sự| et al\.)?\s*\((\d{4})`, "gu");
const PAREN = new RegExp(String.raw`\((${NAME})(?:(?:, | & | và )${NAME})*(?: và cộng sự| et al\.)?, (\d{4})`, "gu");
const NOT_NAMES = new Set(["Bảng", "Table", "Hình", "Figure", "Likert", "Study", "Nghiên", "Mẫu", "Theo", "Thang", "Năm", "Bản", "Phụ"]);
const citations = text => [...text.matchAll(NARR), ...text.matchAll(PAREN)].map(m => [m[1], m[2]]).filter(([s]) => !NOT_NAMES.has(s));
const fail = (slug, msg) => { errors++; console.log(`FAIL ${slug}: ${msg}`); };

for (const file of all) {
  const slug = file.slice(0, -5);
  if (only.length && !only.includes(slug)) continue;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(slug, "slug must be lowercase ascii-kebab");
  let d;
  try { d = JSON.parse(readFileSync(new URL(file, dir), "utf8")); } catch (e) { fail(slug, `invalid JSON: ${e.message}`); continue; }
  const need = ["title", "description", "name", "fullName", "field", "keyword", "intro", "responseScale", "constructs", "usage", "sampleSize", "license", "references", "verifiedFrom"];
  for (const k of need) if (d[k] === undefined) fail(slug, `missing ${k}`);
  if (d.title?.length > 70) fail(slug, `title ${d.title.length} chars > 70`);
  if (d.description && (d.description.length < 110 || d.description.length > 170)) fail(slug, `description ${d.description.length} chars, need 110–170`);
  if (d.field && !FIELDS.includes(d.field)) fail(slug, `field must be one of: ${FIELDS.join(" | ")}`);
  if (!Array.isArray(d.usage) || d.usage.length < 2) fail(slug, "usage needs ≥ 2 tips");
  if (!Array.isArray(d.references) || !d.references.length) fail(slug, "references empty");
  if (!Array.isArray(d.verifiedFrom) || !d.verifiedFrom.length || d.verifiedFrom.some(u => !/^https?:\/\//.test(u))) fail(slug, "verifiedFrom must list http(s) URLs actually checked");
  if (typeof d.sampleSize?.note !== "string") fail(slug, "sampleSize.note missing");
  if (d.sampleSize?.arrowsMax !== undefined && !(Number.isInteger(d.sampleSize.arrowsMax) && d.sampleSize.arrowsMax >= 1)) fail(slug, "sampleSize.arrowsMax must be a positive integer");
  for (const r of d.related ?? []) if (!slugs.has(r) && !only.length) fail(slug, `related slug "${r}" has no file`);
  const codes = new Set();
  for (const c of d.constructs ?? []) {
    for (const k of ["code", "nameVi", "nameEn", "definition", "source", "items"]) if (c[k] === undefined) fail(slug, `construct ${c.code ?? "?"} missing ${k}`);
    for (const i of c.items ?? []) {
      if (codes.has(i.code)) fail(slug, `duplicate item code ${i.code}`);
      codes.add(i.code);
      if (!i.en?.trim() || !i.vi?.trim()) fail(slug, `item ${i.code} needs both en and vi`);
      if (i.vi && !/[ăâđêôơưáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ]/i.test(i.vi)) fail(slug, `item ${i.code} vi text has no Vietnamese diacritics`);
    }
  }
  for (const k of ["intro", "license", "fullName"]) if (/—/.test(d[k] ?? "")) fail(slug, `${k} uses an em dash; rewrite the sentence`);

  // Stat card and reverse-scoring note.
  if (typeof d.responseScaleShort !== "string" || !d.responseScaleShort.trim()) fail(slug, "responseScaleShort missing (≤ 28 chars, e.g. 'Likert 7 mức', 'Tần suất 0–4')");
  else if (d.responseScaleShort.length > 28) fail(slug, `responseScaleShort ${d.responseScaleShort.length} chars > 28`);
  const hasReverse = (d.constructs ?? []).some(c => (c.items ?? []).some(i => i.reverse));
  if (hasReverse && !/điểm mới =/.test(d.reverseRule ?? "")) fail(slug, "scale has (R) items: reverseRule must give the recode for this scale's range, e.g. 'Thang 1–5: điểm mới = 1 + 5 − điểm = 6 − điểm.'");
  if (!hasReverse && d.reverseRule) fail(slug, "reverseRule set but no item is reverse-scored");
  if (STRICT && d.title && d.keyword && !d.title.toLowerCase().includes(d.keyword.toLowerCase())) fail(slug, `title must contain keyword "${d.keyword}"`);

  // Optional depth sections.
  const refs = (d.references ?? []).map(plain);
  const cited = (where, text) => {
    for (const [surname, year] of citations(text))
      if (!refs.some(r => r.startsWith(surname) && r.includes(`(${year}`))) fail(slug, `${where}: "${surname} … ${year}" is not in references`);
  };
  const isUrl = u => typeof u === "string" && /^https?:\/\/\S+$/.test(u);
  if (d.model !== undefined) {
    if (!Array.isArray(d.model.paths) || !d.model.paths.length) fail(slug, "model.paths must list the original paths");
    if (!d.model.source || !citations(d.model.source).length) fail(slug, "model.source must cite the work, e.g. 'Davis, Bagozzi & Warshaw (1989), Hình 1.'");
    cited("model", [d.model.source, d.model.note, ...(d.model.paths ?? [])].join(" "));
  }
  for (const [n, r] of (d.reliability ?? []).entries()) {
    for (const k of ["construct", "value", "sample", "source"]) if (!r[k]?.trim?.()) fail(slug, `reliability[${n}] missing ${k}`);
    if (!isUrl(r.url)) fail(slug, `reliability[${n}].url must be the page you copied the value from`);
    if (!/(Bảng|Table|tr\.|p\.|Hình|Figure)/.test(r.source ?? "")) fail(slug, `reliability[${n}].source must name the table or page the value comes from`);
    if (!citations(r.source ?? "").length) fail(slug, `reliability[${n}].source must start with a citation`);
    cited(`reliability[${n}]`, r.source ?? "");
  }
  const vs = d.vietnamStudies ?? [];
  if (vs.length > 4) fail(slug, "vietnamStudies: list 2–4 studies");
  for (const [n, v] of vs.entries()) {
    for (const k of ["authors", "title", "journal"]) if (!v[k]?.trim?.()) fail(slug, `vietnamStudies[${n}] missing ${k}`);
    if (!Number.isInteger(v.year) || v.year < 1990 || v.year > 2100) fail(slug, `vietnamStudies[${n}].year must be a number`);
    if (!isUrl(v.url)) fail(slug, `vietnamStudies[${n}].url must be the page you opened`);
  }
  if (new Set(vs.map(v => v.url)).size !== vs.length) fail(slug, "vietnamStudies: duplicate URL");
  const qa = d.examinerQA ?? [];
  if (qa.length > 4) fail(slug, "examinerQA: keep 2–3 questions");
  for (const [n, x] of qa.entries()) {
    if (!x.q?.trim() || !x.a?.trim()) fail(slug, `examinerQA[${n}] needs q and a`);
    if (x.q && !x.q.trim().endsWith("?")) fail(slug, `examinerQA[${n}].q must be a question`);
    cited(`examinerQA[${n}]`, x.a ?? "");
  }
  // Every "Author (year)" in reader-facing prose must be in references.
  if (STRICT) {
    cited("intro", d.intro ?? "");
    for (const [n, u] of (d.usage ?? []).entries()) cited(`usage[${n}]`, u);
    for (const c of d.constructs ?? []) cited(`construct ${c.code} source`, c.source ?? "");
  }
  const prose = JSON.stringify([d.title, d.description, d.intro, d.responseScale, d.responseScaleShort, d.reverseRule, d.usage, d.model, d.reliability, d.vietnamStudies, d.examinerQA, d.sampleSize, d.license, d.constructs?.map(c => [c.definition, c.source])]);
  if (/—/.test(prose)) fail(slug, "em dash (—) in reader-facing text; rewrite the sentence");
}
console.log(errors ? `${errors} problem(s)` : `ok: ${only.length || all.length} scale file(s)`);
process.exit(errors ? 1 : 0);
