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
}
console.log(errors ? `${errors} problem(s)` : `ok: ${only.length || all.length} scale file(s)`);
process.exit(errors ? 1 : 0);
