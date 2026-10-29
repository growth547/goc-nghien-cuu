// Fetches Vietnam series from the World Bank World Development Indicators API (CC BY 4.0)
// and writes one JSON file per indicator into src/content/du-lieu/<slug>.json.
//
// Usage:  node scripts/fetch-worldbank.mjs            refresh every indicator
//         node scripts/fetch-worldbank.mjs gdp lam-phat   refresh only these slugs
//
// Re-runnable: each run overwrites the files with the latest API data. If a request fails,
// the existing file for that indicator is left untouched and the script exits with code 1.
// The indicator list and Vietnamese texts live in scripts/worldbank-indicators.mjs.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { INDICATORS, THEMES } from "./worldbank-indicators.mjs";

const COUNTRY = "VNM";
const API = "https://api.worldbank.org/v2";
const LICENSE = "Creative Commons Attribution 4.0 International (CC BY 4.0)";
const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
const TERMS_URL = "https://datacatalog.worldbank.org/public-licenses";
const outDir = new URL("../src/content/du-lieu/", import.meta.url);

const only = process.argv.slice(2);
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJson(url, tries = 4) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i >= tries) throw new Error(`${url}: ${e.message}`);
      await sleep(1000 * i);
    }
  }
}

// The API answers errors as [{ message: [...] }] with HTTP 200.
function assertOk(json, url) {
  if (!Array.isArray(json) || json.length < 2 || json[0]?.message) {
    throw new Error(`${url}: ${JSON.stringify(json?.[0]?.message ?? json).slice(0, 200)}`);
  }
}

async function fetchSeries(code) {
  const rows = [];
  let meta;
  for (let page = 1; ; page++) {
    const url = `${API}/country/${COUNTRY}/indicator/${code}?format=json&per_page=100&page=${page}`;
    const json = await getJson(url);
    assertOk(json, url);
    meta = json[0];
    rows.push(...(json[1] ?? []));
    if (page >= (meta.pages ?? 1)) break;
  }
  return { meta, rows };
}

async function fetchIndicatorMeta(code) {
  const url = `${API}/indicator/${code}?format=json`;
  const json = await getJson(url);
  assertOk(json, url);
  return json[1][0];
}

function validateConfig() {
  const seen = new Set();
  for (const ind of INDICATORS) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(ind.slug)) throw new Error(`bad slug ${ind.slug}`);
    if (seen.has(ind.slug)) throw new Error(`duplicate slug ${ind.slug}`);
    seen.add(ind.slug);
    if (!THEMES.includes(ind.theme)) throw new Error(`${ind.slug}: unknown theme ${ind.theme}`);
    for (const k of ["code", "shortVi", "nameVi", "unit", "displayUnit", "explanation"]) {
      if (typeof ind[k] !== "string" || !ind[k]) throw new Error(`${ind.slug}: missing ${k}`);
    }
    if (!(ind.scale > 0) || !Number.isInteger(ind.decimals)) throw new Error(`${ind.slug}: bad scale/decimals`);
    if (!Array.isArray(ind.thesisUse) || !ind.thesisUse.length) throw new Error(`${ind.slug}: thesisUse empty`);
  }
}

validateConfig();
const unknown = only.filter(s => !INDICATORS.some(i => i.slug === s));
if (unknown.length) {
  console.error(`Unknown slug(s): ${unknown.join(", ")}`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
const fetchedAt = new Date().toISOString().slice(0, 10);
let failed = 0;

for (const ind of INDICATORS) {
  if (only.length && !only.includes(ind.slug)) continue;
  try {
    const [{ meta, rows }, info] = await Promise.all([fetchSeries(ind.code), fetchIndicatorMeta(ind.code)]);
    const values = rows
      .filter(r => r.value !== null && r.value !== undefined && /^\d{4}$/.test(String(r.date)))
      .map(r => ({ year: Number(r.date), value: Number(r.value) }))
      .filter(r => Number.isFinite(r.value))
      .sort((a, b) => a.year - b.year);
    if (values.length < 2) throw new Error(`only ${values.length} non-empty values`);
    const { slug, scale, decimals, ...editorial } = ind;
    const doc = {
      code: ind.code,
      theme: editorial.theme,
      shortVi: editorial.shortVi,
      nameVi: editorial.nameVi,
      nameEn: info.name,
      unit: editorial.unit,
      displayUnit: editorial.displayUnit,
      scale,
      decimals,
      explanation: editorial.explanation,
      thesisUse: editorial.thesisUse,
      sourceNote: (info.sourceNote ?? "").trim(),
      sourceOrganization: (info.sourceOrganization ?? "").trim(),
      source: info.source?.value ?? "World Development Indicators",
      lastUpdated: meta.lastupdated ?? fetchedAt,
      fetchedAt,
      license: LICENSE,
      licenseUrl: LICENSE_URL,
      termsUrl: TERMS_URL,
      dataUrl: `https://data.worldbank.org/indicator/${ind.code}?locations=VN`,
      apiUrl: `${API}/country/${COUNTRY}/indicator/${ind.code}?format=json&per_page=100`,
      values,
    };
    const file = new URL(`${slug}.json`, outDir);
    const existed = existsSync(file);
    writeFileSync(file, JSON.stringify(doc, null, 2) + "\n", "utf8");
    const first = values[0].year;
    const last = values[values.length - 1].year;
    console.log(`${existed ? "updated" : "created"} ${slug}: ${ind.code}, ${values.length} years (${first}–${last}), WDI updated ${doc.lastUpdated}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${ind.slug} (${ind.code}): ${e.message}`);
  }
  await sleep(150);
}

if (failed) {
  console.error(`${failed} indicator(s) failed; their previous files (if any) were kept.`);
  process.exit(1);
}
