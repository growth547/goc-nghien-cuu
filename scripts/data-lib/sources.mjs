// One fetcher per data source. Each returns a "raw cache" object:
//   { source, fetchedAt, lastUpdated, series: { [code]: { nameEn, unit, freq: "A"|"M", note, org,
//     topics, license, values: [[period, value], ...], peers?: { [ISO3]: [[year, value], ...] } } } }
// Periods are integer years (freq A) or "YYYY-MM" strings (freq M).
// A fetcher receives the previous cache (or null) and may reuse it when the source has not changed.
// Licences of every source are documented in scripts/data-sources.mjs.
import { getBuffer, getJson, getText, parseCsv, sleep } from "./http.mjs";
import { readXlsx, readZip } from "./xlsx.mjs";
import { ASEAN_PEERS } from "../data-sources.mjs";

const WB = "https://api.worldbank.org/v2";
const PEER_CODES = ASEAN_PEERS.map(p => p.code);
const today = () => new Date().toISOString().slice(0, 10);
const num = v => (v === null || v === undefined || v === "" ? NaN : Number(v));

// ---------------------------------------------------------------- World Bank API (WDI, WGI, GFDD)
const WB_SOURCE_NUM = { wdi: 2, wgi: 3, gfdd: 32 };
const WB_OK_LICENSES = new Set(["CC BY-4.0", "CC BY 3.0 IGO"]);

async function wbAllVnm(n) {
  const out = {};
  for (let page = 1; ; page++) {
    const url = `${WB}/sources/${n}/country/VNM/series/all/time/all?format=json&per_page=50000&page=${page}`;
    const j = await getJson(url);
    if (!j?.source?.data) throw new Error(`${url}: unexpected response ${JSON.stringify(j).slice(0, 200)}`);
    for (const r of j.source.data) {
      const v = num(r.value);
      if (!Number.isFinite(v)) continue;
      const code = r.variable.find(x => x.concept === "Series").id;
      const year = Number(String(r.variable.find(x => x.concept === "Time").id).replace(/^YR/, ""));
      if (!Number.isInteger(year)) continue;
      (out[code] ??= []).push([year, v]);
    }
    if (page >= Number(j.pages ?? 1)) break;
  }
  for (const k in out) out[k].sort((a, b) => a[0] - b[0]);
  return out;
}

async function wbIndicatorMeta(n) {
  const j = await getJson(`${WB}/indicator?source=${n}&format=json&per_page=5000`);
  if (!Array.isArray(j) || !Array.isArray(j[1])) throw new Error(`indicator list for source ${n} failed`);
  return Object.fromEntries(j[1].map(i => [i.id, i]));
}

async function wbLicenses(n) {
  const lic = {};
  for (let page = 1; ; page++) {
    const j = await getJson(`${WB}/sources/${n}/series/all/metadata?format=json&per_page=2000&page=${page}`);
    for (const v of j.source[0].concept[0].variable) {
      lic[v.id] = v.metatype.find(m => m.id === "License_Type")?.value ?? null;
    }
    if (page >= Number(j.pages ?? 1)) break;
  }
  return lic;
}

async function wbPeers(n, code) {
  const peers = {};
  for (let page = 1; ; page++) {
    const url = `${WB}/country/${PEER_CODES.join(";")}/indicator/${code}?source=${n}&format=json&per_page=1000&page=${page}`;
    const j = await getJson(url);
    if (!Array.isArray(j) || j[0]?.message) throw new Error(`${url}: ${JSON.stringify(j?.[0]?.message ?? j).slice(0, 160)}`);
    for (const r of j[1] ?? []) {
      const v = num(r.value);
      if (!Number.isFinite(v) || !/^\d{4}$/.test(r.date)) continue;
      (peers[r.countryiso3code] ??= []).push([Number(r.date), v]);
    }
    if (page >= Number(j[0].pages ?? 1)) break;
  }
  for (const k in peers) peers[k].sort((a, b) => a[0] - b[0]);
  return peers;
}

export async function fetchWorldBank(sourceId, { cached, peerCodes, force, log }) {
  const n = WB_SOURCE_NUM[sourceId];
  const src = await getJson(`${WB}/sources/${n}?format=json`);
  const lastUpdated = src?.[1]?.[0]?.lastupdated ?? today();
  let series;
  if (cached && cached.lastUpdated === lastUpdated && !force) {
    log(`${sourceId}: unchanged since ${lastUpdated}, reusing series`);
    series = cached.series;
  } else {
    const [values, meta, lic] = await Promise.all([
      wbAllVnm(n),
      wbIndicatorMeta(n),
      // GFDD has no per-series licence field; the dataset licence (CC BY 4.0) applies.
      sourceId === "gfdd" ? Promise.resolve(null) : wbLicenses(n),
    ]);
    series = {};
    let excluded = 0;
    for (const [code, vals] of Object.entries(values)) {
      const license = lic ? lic[code] : "CC BY-4.0";
      if (!WB_OK_LICENSES.has(license)) {
        excluded++;
        continue;
      }
      const m = meta[code] ?? {};
      series[code] = {
        nameEn: (m.name ?? code).trim(),
        unit: (m.unit ?? "").trim(),
        freq: "A",
        note: (m.sourceNote ?? "").trim(),
        org: (m.sourceOrganization ?? "").trim(),
        topics: (m.topics ?? []).map(t => (t.value ?? "").trim()).filter(Boolean),
        license,
        values: vals,
      };
    }
    log(`${sourceId}: ${Object.keys(series).length} series with Viet Nam data (${excluded} excluded by licence)`);
  }
  // ASEAN peers for the indicators that have rich pages; reuse cached peers when the source is unchanged.
  const reuse = cached && cached.lastUpdated === lastUpdated && !force;
  for (const code of peerCodes) {
    if (!series[code]) continue;
    if (reuse && cached.series[code]?.peers) {
      series[code].peers = cached.series[code].peers;
      continue;
    }
    series[code].peers = await wbPeers(n, code);
    await sleep(120);
  }
  return { source: sourceId, fetchedAt: today(), lastUpdated, series };
}

// ---------------------------------------------------------------- Penn World Table 11.0
const PWT_URL = "https://dataverse.nl/api/access/datafile/554105"; // pwt110.xlsx, doi:10.34894/FABVLR
const PWT_SKIP = new Set(["countrycode", "country", "currency_unit", "year", "i_cig", "i_xm", "i_xr", "i_outlier", "i_irr", "cor_exp"]);

export async function fetchPwt({ cached, peerCodes, force, log }) {
  const need = [...peerCodes].filter(c => !cached?.series?.[c]?.peers);
  if (cached && !force && !need.length) {
    log("pwt: version 11.0 is fixed, reusing cache");
    return cached;
  }
  const wb = readXlsx(await getBuffer(PWT_URL));
  const legend = Object.fromEntries(
    wb.sheet("Legend").filter(r => r && r[0] && r[1]).map(r => [String(r[0]).trim(), String(r[1]).trim()])
  );
  const rows = wb.sheet("Data").filter(Boolean);
  const head = rows[0];
  const idx = Object.fromEntries(head.map((h, i) => [h, i]));
  const series = {};
  for (const r of rows.slice(1)) {
    const iso = r[idx.countrycode];
    if (!PEER_CODES.includes(iso)) continue;
    const year = r[idx.year];
    for (const v of head) {
      if (PWT_SKIP.has(v)) continue;
      const val = num(r[idx[v]]);
      if (!Number.isFinite(val)) continue;
      const s = (series[v] ??= {
        nameEn: legend[v] ?? v,
        unit: "",
        freq: "A",
        note: legend[v] ?? "",
        org: "Groningen Growth and Development Centre",
        topics: ["Productivity & growth (PWT)"],
        license: "CC BY 4.0",
        values: [],
        allPeers: {},
      });
      if (iso === "VNM") s.values.push([year, val]);
      (s.allPeers[iso] ??= []).push([year, val]);
    }
  }
  for (const [code, s] of Object.entries(series)) {
    if (s.values.length < 2) {
      delete series[code];
      continue;
    }
    if (peerCodes.has(code)) s.peers = s.allPeers;
    delete s.allPeers;
  }
  log(`pwt: ${Object.keys(series).length} variables with Viet Nam data`);
  return { source: "pwt", fetchedAt: today(), lastUpdated: "2025-10-07", series };
}

// ---------------------------------------------------------------- ILOSTAT (SDMX API)
// Curated list: dataflow + key after REF_AREA. Codes are this site's ids for the series.
export const ILO_SERIES = [
  { code: "EMP_NIFL_RT", flow: "DF_EMP_NIFL_SEX_RT", key: "A.EMP_NIFL_RT.SEX_T", nameEn: "Informal employment rate (% of total employment)", unit: "%" },
  { code: "EAR_EMTA_USD", flow: "DF_EAR_EMTA_SEX_CUR_NB", key: "A.EAR_EMTA_NB.SEX_T.CUR_TYPE_USD", nameEn: "Average monthly earnings of employees (US dollars)", unit: "USD/month" },
  { code: "EAR_EMTA_LCU", flow: "DF_EAR_EMTA_SEX_CUR_NB", key: "A.EAR_EMTA_NB.SEX_T.CUR_TYPE_LCU", nameEn: "Average monthly earnings of employees (local currency)", unit: "VND/month" },
  { code: "EAR_EMTA_PPP", flow: "DF_EAR_EMTA_SEX_CUR_NB", key: "A.EAR_EMTA_NB.SEX_T.CUR_TYPE_PPP", nameEn: "Average monthly earnings of employees (2021 PPP $)", unit: "PPP $/month" },
  { code: "EAR_INEE_USD", flow: "DF_EAR_INEE_CUR_NB", key: "A.EAR_INEE_NB.CUR_TYPE_USD", nameEn: "Monthly minimum wage (US dollars)", unit: "USD/month" },
  { code: "EAR_INEE_LCU", flow: "DF_EAR_INEE_CUR_NB", key: "A.EAR_INEE_NB.CUR_TYPE_LCU", nameEn: "Monthly minimum wage (local currency)", unit: "VND/month" },
  { code: "LAP_2GDP_RT", flow: "DF_LAP_2GDP_NOC_RT", key: "A.LAP_2GDP_RT", nameEn: "Labour income share as a percent of GDP (ILO modelled estimates)", unit: "% of GDP" },
  { code: "EMP_2TRU_RT", flow: "DF_EMP_2TRU_SEX_AGE_RT", key: "A.EMP_2TRU_RT.SEX_T.AGE_YTHADULT_YGE15", nameEn: "Time-related underemployment rate, 15+ (ILO modelled estimates)", unit: "%" },
  { code: "EAR_EMTG_NB", flow: "DF_EAR_EMTG_SEX_NB", key: "A.EAR_EMTG_NB.SEX_T", nameEn: "Gini index of monthly earnings of employees", unit: "index (0-100)" },
  { code: "HOW_TEMP_NB", flow: "DF_HOW_TEMP_SEX_ECO_NB", key: "A.HOW_TEMP_NB.SEX_T.ECO_AGGREGATE_TOTAL", nameEn: "Mean weekly hours actually worked per employed person", unit: "hours/week" },
  { code: "EAR_XTLP_RT", flow: "DF_EAR_XTLP_SEX_RT", key: "A.EAR_XTLP_RT.SEX_T", nameEn: "Low pay rate (% of employees)", unit: "%" },
  { code: "LUU_XLU4_RT", flow: "DF_LUU_XLU4_SEX_AGE_RT", key: "A.LUU_XLU4_RT.SEX_T.AGE_YTHADULT_YGE15", nameEn: "Composite rate of labour underutilization (LU4), 15+", unit: "%" },
  { code: "SDG_0852_RT", flow: "DF_SDG_0852_SEX_AGE_RT", key: "A.SDG_0852_RT.SEX_T.AGE_YTHADULT_YGE15", nameEn: "Unemployment rate, 15+ (SDG 8.5.2, national labour force survey)", unit: "%" },
];

export async function fetchIlostat({ cached, peerCodes, force, log }) {
  if (cached && !force && cached.fetchedAt === today()) return cached;
  const series = {};
  const lastYear = new Date().getFullYear() - 1;
  let failed = 0;
  for (const s of ILO_SERIES) {
    const url = `https://sdmx.ilo.org/rest/data/ILO,${s.flow}/${PEER_CODES.join("+")}.${s.key}?format=csv`;
    let rows;
    try {
      rows = parseCsv(await getText(url, 2));
    } catch (e) {
      failed++;
      if (cached?.series?.[s.code]) series[s.code] = cached.series[s.code];
      log(`ilostat: ${s.code} failed (${e.message.slice(-50)}), ${cached?.series?.[s.code] ? "kept cached series" : "no cache"}`);
      continue;
    }
    const head = rows[0];
    const iArea = head.indexOf("REF_AREA");
    const iTime = head.indexOf("TIME_PERIOD");
    const iVal = head.indexOf("OBS_VALUE");
    if (iArea < 0 || iTime < 0 || iVal < 0) throw new Error(`${s.code}: unexpected CSV header`);
    const peers = {};
    for (const r of rows.slice(1)) {
      const year = Number(r[iTime]);
      const v = num(r[iVal]);
      // Modelled series include projections; keep observed/estimated years only.
      if (!Number.isInteger(year) || year > lastYear || !Number.isFinite(v)) continue;
      (peers[r[iArea]] ??= []).push([year, v]);
    }
    for (const k in peers) peers[k].sort((a, b) => a[0] - b[0]);
    if (!peers.VNM || peers.VNM.length < 2) {
      log(`ilostat: ${s.code} has no Viet Nam data, skipped`);
      continue;
    }
    series[s.code] = {
      nameEn: s.nameEn,
      unit: s.unit,
      freq: "A",
      note: "",
      org: "International Labour Organization",
      topics: ["Labour (ILOSTAT)"],
      license: "CC BY 4.0",
      flow: s.flow,
      values: peers.VNM,
      ...(peerCodes.has(s.code) ? { peers } : {}),
    };
    await sleep(1500);
  }
  if (failed === ILO_SERIES.length) throw new Error("all ILOSTAT requests failed");
  log(`ilostat: ${Object.keys(series).length} series${failed ? ` (${failed} failed)` : ""}`);
  return { source: "ilostat", fetchedAt: today(), lastUpdated: today(), series };
}

// ---------------------------------------------------------------- World Bank Pink Sheet (monthly)
const PINK_PAGE = "https://www.worldbank.org/en/research/commodity-markets";
const PINK_FALLBACK =
  "https://thedocs.worldbank.org/en/doc/74e8be41ceb20fa0da750cda2f6b9e4e-0050012026/related/CMO-Historical-Data-Monthly.xlsx";
const PINK_INDEX_NAMES = [
  "Total index", "Energy index", "Non-energy index", "Agriculture index", "Beverages index", "Food index",
  "Oils & meals index", "Grains index", "Other food index", "Raw materials index", "Timber index",
  "Other raw materials index", "Fertilizers index", "Metals & minerals index", "Base metals (ex. iron ore) index",
  "Precious metals index",
];
export const pinkCode = name =>
  "PINK_" +
  name
    .replace(/\*/g, "")
    .trim()
    .toUpperCase()
    .replace(/&/g, "AND")
    .replace(/%/g, "PCT")
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

const MONTHS_EN = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const pinkPeriod = s => {
  const m = /^(\d{4})M(\d{2})$/.exec(String(s ?? "").trim());
  return m ? `${m[1]}-${m[2]}` : null;
};

export async function fetchPink({ log }) {
  let url = PINK_FALLBACK;
  try {
    const html = await getText(PINK_PAGE, 2);
    const m = html.match(/https:\/\/thedocs\.worldbank\.org\/[^"' ]+CMO-Historical-Data-Monthly\.xlsx/);
    if (m) url = m[0];
  } catch {
    log("pink: commodity-markets page not reachable, using last known file URL");
  }
  const wb = readXlsx(await getBuffer(url));
  const prices = wb.sheet("Monthly Prices");
  const updated = prices.slice(0, 6).flat().find(c => typeof c === "string" && /^Updated on/i.test(c)) ?? "";
  const um = updated.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
  const mi = um ? MONTHS_EN.indexOf(um[1].slice(0, 3).toLowerCase()) : -1;
  const lastUpdated = mi >= 0 ? `${um[3]}-${String(mi + 1).padStart(2, "0")}-${um[2].padStart(2, "0")}` : today();
  const series = {};
  const headRow = prices.findIndex(r => r && r[1] && /Crude oil/i.test(String(r[1])));
  if (headRow < 0) throw new Error("pink: header row not found");
  const names = prices[headRow];
  const units = prices[headRow + 1];
  for (let c = 1; c < names.length; c++) {
    if (!names[c]) continue;
    const name = String(names[c]).replace(/\*/g, "").replace(/\s+/g, " ").trim();
    const values = [];
    for (const r of prices.slice(headRow + 2)) {
      const p = pinkPeriod(r?.[0]);
      const v = num(r?.[c]);
      if (p && Number.isFinite(v)) values.push([p, v]);
    }
    if (values.length < 2) continue;
    series[pinkCode(name)] = {
      nameEn: name,
      unit: String(units?.[c] ?? "").replace(/[()]/g, "").trim(),
      freq: "M",
      note: "Monthly average price in nominal US dollars.",
      org: "World Bank Prospects Group",
      topics: ["Commodity prices"],
      license: "CC BY 4.0",
      values,
    };
  }
  const idx = wb.sheet("Monthly Indices");
  const first = idx.findIndex(r => pinkPeriod(r?.[0]));
  const width = (idx[first] ?? []).length - 1;
  if (width !== PINK_INDEX_NAMES.length) throw new Error(`pink: expected ${PINK_INDEX_NAMES.length} index columns, found ${width}`);
  PINK_INDEX_NAMES.forEach((name, i) => {
    const values = [];
    for (const r of idx.slice(first)) {
      const p = pinkPeriod(r?.[0]);
      const v = num(r?.[i + 1]);
      if (p && Number.isFinite(v)) values.push([p, v]);
    }
    series[pinkCode(name)] = {
      nameEn: `Commodity price index: ${name} (2010=100)`,
      unit: "2010=100",
      freq: "M",
      note: "Monthly price index based on nominal US dollars, 2010=100.",
      org: "World Bank Prospects Group",
      topics: ["Commodity prices"],
      license: "CC BY 4.0",
      values,
    };
  });
  log(`pink: ${Object.keys(series).length} monthly series, updated ${lastUpdated}`);
  return { source: "pink", fetchedAt: today(), lastUpdated, fileUrl: url, series };
}

// ---------------------------------------------------------------- FAOSTAT producer prices (bulk)
const FAO_ZIP = "https://bulks-faostat.fao.org/production/Prices_E_Asia.zip";
const FAO_ELEMENTS = {
  5532: { suffix: "USD", unit: "USD/tonne", label: "Producer price (USD/tonne)" },
  5530: { suffix: "LCU", unit: "VND/tonne", label: "Producer price (local currency/tonne)" },
  5539: { suffix: "PPI", unit: "2014-2016=100", label: "Producer price index (2014-2016=100)" },
};

export async function fetchFaostat({ cached, peerCodes, force, log }) {
  const age = cached ? (Date.now() - Date.parse(cached.fetchedAt)) / 864e5 : Infinity;
  if (cached && !force && age < 7) {
    log(`faostat: cache is ${Math.round(age)} day(s) old, reusing`);
    return cached;
  }
  const zip = readZip(await getBuffer(FAO_ZIP));
  const file = [...zip.keys()].find(k => /NOFLAG\.csv$/i.test(k));
  if (!file) throw new Error("faostat: NOFLAG csv not found in zip");
  const rows = parseCsv(zip.get(file)().toString("utf8"));
  const head = rows[0];
  const ix = n => head.indexOf(n);
  const iArea = ix("Area"), iM49 = ix("Area Code (M49)"), iItem = ix("Item"), iItemCode = ix("Item Code");
  const iEl = ix("Element Code"), iMonths = ix("Months Code");
  const yearCols = head.map((h, i) => [h, i]).filter(([h]) => /^Y\d{4}$/.test(h));
  const M49 = { "'704": "VNM", "'764": "THA", "'360": "IDN", "'458": "MYS", "'608": "PHL", "'702": "SGP", "'116": "KHM", "'418": "LAO", "'104": "MMR", "'156": "CHN" };
  const series = {};
  for (const r of rows.slice(1)) {
    const iso = M49[r[iM49]];
    const el = FAO_ELEMENTS[r[iEl]];
    if (!iso || !el || r[iMonths] !== "7021") continue;
    const code = `FAO_${r[iItemCode]}_${el.suffix}`;
    const vals = [];
    for (const [h, i] of yearCols) {
      const v = num(r[i]);
      if (Number.isFinite(v)) vals.push([Number(h.slice(1)), v]);
    }
    if (!vals.length) continue;
    const s = (series[code] ??= {
      nameEn: `${r[iItem]}: ${el.label}`,
      unit: el.unit,
      freq: "A",
      note: "Annual producer price received by farmers at the farm gate (FAOSTAT domain PP).",
      org: "FAO Statistics Division",
      topics: ["Agricultural producer prices (FAOSTAT)"],
      license: "CC BY 4.0",
      values: [],
      allPeers: {},
    });
    if (iso === "VNM") s.values = vals;
    // Local-currency prices are not comparable across countries; only USD and index go to peers.
    if (el.suffix !== "LCU") s.allPeers[iso] = vals;
  }
  for (const [code, s] of Object.entries(series)) {
    if (s.values.length < 2) {
      delete series[code];
      continue;
    }
    if (peerCodes.has(code)) s.peers = s.allPeers;
    delete s.allPeers;
  }
  log(`faostat: ${Object.keys(series).length} Viet Nam producer price series`);
  return { source: "faostat", fetchedAt: today(), lastUpdated: today(), series };
}

export const FETCHERS = {
  wdi: o => fetchWorldBank("wdi", o),
  wgi: o => fetchWorldBank("wgi", o),
  gfdd: o => fetchWorldBank("gfdd", o),
  pwt: fetchPwt,
  ilostat: fetchIlostat,
  pink: fetchPink,
  faostat: fetchFaostat,
};
