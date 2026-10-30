// Validates the /du-lieu/ data: source registry, raw caches (src/data/du-lieu/raw) and rich page files
// (src/content/du-lieu). Run: node scripts/check-data.mjs   (exit code 1 on any error)
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { SOURCES } from "./data-sources.mjs";
import { RICH, THEMES, validateRich } from "./indicators/index.mjs";

let errors = 0;
let warnings = 0;
const fail = (where, msg) => {
  errors++;
  console.log(`FAIL ${where}: ${msg}`);
};
const warn = (where, msg) => {
  warnings++;
  console.log(`warn ${where}: ${msg}`);
};
const isUrl = s => typeof s === "string" && /^https?:\/\/\S+$/.test(s);
const finite = v => typeof v === "number" && Number.isFinite(v);
const count = (s, sub) => s.split(sub).length - 1;

// ---------------------------------------------------------------- registry and editorial list
for (const [id, s] of Object.entries(SOURCES)) {
  for (const k of ["name", "org", "license", "licenseShort", "attribution", "licenseEvidence", "checkedAt"]) {
    if (typeof s[k] !== "string" || !s[k].trim()) fail(`source ${id}`, `missing ${k}`);
  }
  for (const k of ["licenseUrl", "termsUrl", "homeUrl"]) if (!isUrl(s[k])) fail(`source ${id}`, `bad ${k}`);
  if (!s.apa?.author || !s.apa?.container) fail(`source ${id}`, "missing apa.author/apa.container");
  if (/\bNC\b|NonCommercial|ND\b|NoDerivatives/i.test(s.license)) fail(`source ${id}`, `licence not allowed: ${s.license}`);
}
try {
  validateRich();
} catch (e) {
  fail("scripts/indicators", e.message);
}
const config = readFileSync(new URL("../src/content.config.ts", import.meta.url), "utf8");
const themeBlock = config.match(/DATASET_THEMES = \[([\s\S]*?)\] as const/)?.[1] ?? "";
const configThemes = [...themeBlock.matchAll(/"([^"]+)"/g)].map(m => m[1]);
if (JSON.stringify(configThemes) !== JSON.stringify(THEMES)) fail("themes", "THEMES (scripts/indicators/index.mjs) differ from DATASET_THEMES (src/content.config.ts)");

// ---------------------------------------------------------------- raw caches
const rawDir = new URL("../src/data/du-lieu/raw/", import.meta.url);
let rawSeries = 0;
for (const id of Object.keys(SOURCES)) {
  const file = new URL(`${id}.json`, rawDir);
  if (!existsSync(file)) {
    fail(`raw/${id}.json`, "missing (run node scripts/fetch-data.mjs)");
    continue;
  }
  let raw;
  try {
    raw = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    fail(`raw/${id}.json`, `invalid JSON: ${e.message}`);
    continue;
  }
  if (raw.source !== id) fail(`raw/${id}.json`, `source field is ${raw.source}`);
  for (const k of ["fetchedAt", "lastUpdated"]) if (!/^\d{4}-\d{2}-\d{2}$/.test(raw[k] ?? "")) fail(`raw/${id}.json`, `bad ${k}`);
  const ageDays = (Date.now() - Date.parse(raw.fetchedAt)) / 864e5;
  if (ageDays > 45) warn(`raw/${id}.json`, `fetched ${Math.round(ageDays)} days ago; refresh with node scripts/fetch-data.mjs ${id}`);
  for (const [code, s] of Object.entries(raw.series ?? {})) {
    rawSeries++;
    const w = `raw/${id}:${code}`;
    if (!s.nameEn) fail(w, "missing nameEn");
    if (!s.license) fail(w, "missing license");
    if (s.freq !== "A" && s.freq !== "M") fail(w, `bad freq ${s.freq}`);
    if (!Array.isArray(s.values) || !s.values.length) fail(w, "no values");
    const periodOk = s.freq === "M" ? p => /^\d{4}-(0[1-9]|1[0-2])$/.test(p) : p => Number.isInteger(p);
    let prev = null;
    for (const [p, v] of s.values ?? []) {
      if (!periodOk(p)) {
        fail(w, `bad period ${p}`);
        break;
      }
      if (!finite(v)) {
        fail(w, `non-finite value at ${p}`);
        break;
      }
      if (prev !== null && String(p) <= String(prev) && !(typeof p === "number" && p > prev)) {
        fail(w, `periods not ascending at ${p}`);
        break;
      }
      prev = p;
    }
    for (const [iso, vals] of Object.entries(s.peers ?? {})) {
      if (!/^[A-Z]{3}$/.test(iso)) fail(w, `bad peer code ${iso}`);
      if (vals.some(([y, v]) => !Number.isInteger(y) || !finite(v))) fail(w, `bad peer values for ${iso}`);
    }
  }
}

// ---------------------------------------------------------------- rich page files
const outDir = new URL("../src/content/du-lieu/", import.meta.url);
const files = readdirSync(outDir).filter(f => f.endsWith(".json") && !f.startsWith("_"));
const richSlugs = new Set(RICH.map(r => r.slug));
const varNames = new Map();
const titles = new Map();
for (const f of files) {
  const slug = f.slice(0, -5);
  const w = `du-lieu/${f}`;
  if (!richSlugs.has(slug)) fail(w, "not in the editorial list (scripts/indicators); run fetch-data to remove it");
  let d;
  try {
    d = JSON.parse(readFileSync(new URL(f, outDir), "utf8"));
  } catch (e) {
    fail(w, `invalid JSON: ${e.message}`);
    continue;
  }
  const src = SOURCES[d.source];
  if (!src) {
    fail(w, `unknown source ${d.source}`);
    continue;
  }
  for (const k of ["code", "varName", "title", "description", "shortVi", "nameVi", "nameEn", "unit", "explanation", "license", "publisher", "sourceName", "fetchedAt", "lastUpdated"]) {
    if (typeof d[k] !== "string" || !d[k].trim()) fail(w, `missing ${k}`);
  }
  for (const k of ["licenseUrl", "termsUrl", "dataUrl", "apiUrl"]) if (!isUrl(d[k])) fail(w, `bad ${k}`);
  if (d.license !== src.license) fail(w, `license "${d.license}" differs from registry "${src.license}"`);
  if (!d.citation?.author || !d.citation?.container) fail(w, "missing citation");
  if (!THEMES.includes(d.theme)) fail(w, `unknown theme ${d.theme}`);
  if (!(d.scale > 0) || !Number.isInteger(d.decimals)) fail(w, "bad scale/decimals");
  if (!Array.isArray(d.thesisUse) || !d.thesisUse.length) fail(w, "thesisUse empty");
  // SEO limits: title ≤ 65, description 110–170, "Việt Nam" not duplicated.
  if ((d.title ?? "").length > 65) fail(w, `title is ${d.title.length} chars (max 65): ${d.title}`);
  const dl = (d.description ?? "").length;
  if (dl < 110 || dl > 170) fail(w, `description is ${dl} chars (110–170)`);
  if (count(d.title ?? "", "Việt Nam") > 1 || /Việt Nam\s+Việt Nam/.test(d.title ?? "")) fail(w, `"Việt Nam" repeated in title: ${d.title}`);
  if (count(d.description ?? "", "Việt Nam") > 1) fail(w, `"Việt Nam" repeated in description`);
  if (titles.has(d.title)) fail(w, `same title as ${titles.get(d.title)}`);
  titles.set(d.title, f);
  if (!/^[a-z][a-z0-9_]{0,31}$/.test(d.varName ?? "")) fail(w, `bad varName ${d.varName}`);
  if (varNames.has(d.varName)) fail(w, `varName ${d.varName} also used by ${varNames.get(d.varName)}`);
  varNames.set(d.varName, f);
  const monthly = d.frequency === "M";
  if (!["A", "M"].includes(d.frequency)) fail(w, `bad frequency ${d.frequency}`);
  if (!Array.isArray(d.values) || d.values.length < 2) fail(w, "fewer than 2 values");
  let prevT = -Infinity;
  for (const p of d.values ?? []) {
    if (!Number.isInteger(p.year) || !finite(p.value)) {
      fail(w, `bad point ${JSON.stringify(p)}`);
      break;
    }
    if (monthly && !(Number.isInteger(p.month) && p.month >= 1 && p.month <= 12)) {
      fail(w, `bad month ${JSON.stringify(p)}`);
      break;
    }
    const t = p.year * 12 + (p.month ?? 0);
    if (t <= prevT) {
      fail(w, `periods not ascending at ${p.year}${p.month ? "-" + p.month : ""}`);
      break;
    }
    prevT = t;
  }
  for (const c of d.comparison ?? []) {
    if (!/^[A-Z]{3}$/.test(c.code) || !c.name) fail(w, `bad comparison entry ${c.code}`);
    if ((c.values ?? []).some(p => !Number.isInteger(p.year) || !finite(p.value))) fail(w, `bad comparison values for ${c.code}`);
  }
}
for (const slug of richSlugs) if (!files.includes(`${slug}.json`)) fail(`du-lieu/${slug}.json`, "missing (run node scripts/fetch-data.mjs)");

console.log(
  `check-data: ${Object.keys(SOURCES).length} sources, ${rawSeries} explorer series, ${files.length} rich pages; ${errors} error(s), ${warnings} warning(s).`
);
if (errors) process.exit(1);
