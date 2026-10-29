// Validates src/content/khai-niem/*.json (construct landing pages): run `node scripts/check-concepts.mjs`.
// Every "<scale slug>:<construct code>" key must resolve to a real construct in src/content/thang-do/.
import { readFileSync, readdirSync } from "node:fs";

const scaleDir = new URL("../src/content/thang-do/", import.meta.url);
const dir = new URL("../src/content/khai-niem/", import.meta.url);
const jsonFiles = d => readdirSync(d).filter(f => f.endsWith(".json") && !f.startsWith("_"));
const scales = new Map(jsonFiles(scaleDir).map(f => [f.slice(0, -5), JSON.parse(readFileSync(new URL(f, scaleDir), "utf8"))]));
const files = jsonFiles(dir);
const slugs = new Set(files.map(f => f.slice(0, -5)));
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
const texts = d => [d.title, d.description, d.intro, ...(d.tips ?? []), ...(d.constructs ?? []).map(c => c.note), ...(d.faq ?? []).flatMap(f => [f.q, f.a])];

for (const file of files) {
  const slug = file.slice(0, -5);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(slug, "slug must be lowercase ascii-kebab");
  let d;
  try { d = JSON.parse(readFileSync(new URL(file, dir), "utf8")); } catch (e) { fail(slug, `invalid JSON: ${e.message}`); continue; }
  for (const k of ["title", "description", "name", "nameEn", "field", "keyword", "intro", "constructs", "tips", "faq", "related"]) if (d[k] === undefined) fail(slug, `missing ${k}`);
  if (d.title?.length > 70) fail(slug, `title ${d.title.length} chars > 70`);
  if (d.title && !d.title.startsWith("Thang đo ")) fail(slug, "title must start with 'Thang đo '");
  if (d.description && (d.description.length < 110 || d.description.length > 170)) fail(slug, `description ${d.description.length} chars, need 110–170`);
  if (d.field && !FIELDS.includes(d.field)) fail(slug, `field must be one of: ${FIELDS.join(" | ")}`);
  if (!Array.isArray(d.tips) || d.tips.length < 3 || d.tips.length > 5) fail(slug, "tips needs 3–5 entries");
  if (!Array.isArray(d.faq) || d.faq.length !== 3 || d.faq.some(f => !f.q?.trim() || !f.a?.trim())) fail(slug, "faq needs exactly 3 {q, a}");
  if (!Array.isArray(d.related) || d.related.length !== 4) fail(slug, "related needs exactly 4 concept slugs");
  for (const r of d.related ?? []) {
    if (r === slug) fail(slug, "related lists itself");
    else if (!slugs.has(r)) fail(slug, `related concept "${r}" has no file`);
  }
  if (!Array.isArray(d.constructs) || !d.constructs.length) fail(slug, "constructs empty");
  const seen = new Set();
  for (const c of d.constructs ?? []) {
    if (!/^[a-z0-9-]+:[A-Za-z0-9]+$/.test(c.key ?? "")) { fail(slug, `bad key "${c.key}"`); continue; }
    if (seen.has(c.key)) fail(slug, `duplicate key ${c.key}`);
    seen.add(c.key);
    if (!c.note?.trim()) fail(slug, `key ${c.key} needs a note`);
    const [s, code] = c.key.split(":");
    const scale = scales.get(s);
    if (!scale) fail(slug, `key ${c.key}: no scale file "${s}"`);
    else if (!scale.constructs.some(x => x.code === code)) fail(slug, `key ${c.key}: scale "${s}" has no construct ${code}`);
  }
  if (texts(d).some(t => /—/.test(t ?? ""))) fail(slug, "uses an em dash; rewrite the sentence");
}
console.log(errors ? `${errors} problem(s)` : `ok: ${files.length} concept file(s)`);
process.exit(errors ? 1 : 0);
