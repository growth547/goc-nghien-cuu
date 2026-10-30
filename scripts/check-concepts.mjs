// Validates src/content/khai-niem/*.json (construct landing pages) and src/content/mau-bang-hoi/*.json
// (template pages: item overrides, Vietnamese studies, diagram paths): run `node scripts/check-concepts.mjs`.
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
  if (d.references !== undefined && (!Array.isArray(d.references) || d.references.some(r => typeof r !== "string" || !/\(\d{4}[a-z]?\)/.test(r))))
    fail(slug, "references must be strings with a (year)");
}

// ---- templates (src/content/mau-bang-hoi/*.json) ----
// Item overrides must name an item of a construct the template uses; studies need a real-looking
// citation; the page's copy of itemAnchors must read every template item like the kit does.
const tdir = new URL("../src/content/mau-bang-hoi/", import.meta.url);
const tfiles = jsonFiles(tdir);
const lib = await import("../src/pages/mau-bang-hoi/_lib.ts");
const kitSrc = readFileSync(new URL("../src/tools/bo-khao-sat.html", import.meta.url), "utf8");
const kitBlock = kitSrc.match(/\/\/#kit-start([\s\S]*?)\/\/#kit-end/);
const mathBlock = kitSrc.match(/\/\/#math-start([\s\S]*?)\/\/#math-end/);
const kitAnchors = kitBlock && mathBlock ? new Function(`${mathBlock[1]}${kitBlock[1]}; return itemAnchors;`)() : null;
if (!kitAnchors) fail("kit", "could not load itemAnchors from src/tools/bo-khao-sat.html");
for (const file of tfiles) {
  const slug = "mau-bang-hoi/" + file.slice(0, -5);
  let t;
  try { t = JSON.parse(readFileSync(new URL(file, tdir), "utf8")); } catch (e) { fail(slug, `invalid JSON: ${e.message}`); continue; }
  if (t.title?.length > 70) fail(slug, `title ${t.title.length} chars > 70`);
  if (t.description && (t.description.length < 110 || t.description.length > 170)) fail(slug, `description ${t.description.length} chars, need 110–170`);
  const used = new Map();
  for (const key of t.constructs ?? []) {
    const [s, code] = key.split(":");
    const c = scales.get(s)?.constructs.find(x => x.code === code);
    if (!c) { fail(slug, `construct ${key} not in the library`); continue; }
    for (const i of c.items) used.set(`${s}:${i.code}`, i);
  }
  for (const [k, v] of Object.entries(t.itemOverrides ?? {})) {
    if (!used.has(k)) fail(slug, `itemOverrides key "${k}" is not an item of this template's constructs`);
    else if (!v.trim() || v.trim() === used.get(k).vi) fail(slug, `itemOverrides "${k}" is empty or the same as the library wording`);
  }
  for (const s of t.studies ?? []) {
    for (const k of ["authors", "year", "title", "journal", "url", "sample"]) if (!s[k]) fail(slug, `study "${s.title ?? "?"}" missing ${k}`);
    if (s.url && !/^https:\/\//.test(s.url)) fail(slug, `study url must be https: ${s.url}`);
    if (s.year && (s.year < 1990 || s.year > new Date().getFullYear() + 1)) fail(slug, `study year ${s.year} looks wrong`);
  }
  if (new Set((t.studies ?? []).map(s => s.url)).size !== (t.studies ?? []).length) fail(slug, "duplicate study url");
  for (const r of t.references ?? []) if (!/\(\d{4}[a-z]?\)/.test(r)) fail(slug, `reference without (year): ${r.slice(0, 60)}`);
  const allText = [t.title, t.description, t.intro, t.modelNote, ...(t.tips ?? []), ...Object.values(t.itemOverrides ?? {})];
  if (allText.some(x => /—/.test(x ?? ""))) fail(slug, "uses an em dash; rewrite the sentence");
  if (kitAnchors)
    for (const [k, i] of used) {
      const vi = t.itemOverrides?.[k] ?? i.vi;
      if (JSON.stringify(lib.itemAnchors(vi)) !== JSON.stringify(kitAnchors(vi))) fail(slug, `itemAnchors differs from the kit on ${k}`);
    }
  // Every template must render a connected diagram: each construct on at least one path.
  for (const key of t.constructs ?? []) if (!(t.paths ?? []).some(p => p.from === key || p.to === key)) fail(slug, `construct ${key} is on no path`);
}
console.log(errors ? `${errors} problem(s)` : `ok: ${files.length} concept file(s), ${tfiles.length} template file(s)`);
process.exit(errors ? 1 : 0);
