#!/usr/bin/env node
// Live-site QA crawler: `node scripts/crawl-check.mjs [options] > report.md`
// Node 22+, no dependencies. Starts from the sitemap index, crawls every sitemap URL plus every
// internal link (within the base path), and prints a Markdown report grouped by severity.
// Exit code: 1 if any P0 problem was found, 0 otherwise (2 on crawler crash).
//
// Options:
//   --sitemap <url>      sitemap index (default: https://growth547.github.io/goc-nghien-cuu/sitemap-index.xml)
//   --base <url>         crawl scope prefix (default: derived from the sitemap URL's directory)
//   --no-external        skip external link checks
//   --no-assets          skip asset (css/js/img) size + status checks
//   --concurrency <n>    parallel requests (default 6 internal, external is min(n, 4))
//   --delay <ms>         polite delay between requests to the same external host (default 300)
//   --max-pages <n>      safety cap on crawled pages (default 2000)
//   --weight-kb <n>      page weight warning threshold in KB (default 1500)
//   --json <file>        also write raw results as JSON

import { writeFileSync } from "node:fs";

// ---------- options ----------
const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : def;
};
const flag = name => argv.includes(`--${name}`);
const SITEMAP = opt("sitemap", "https://growth547.github.io/goc-nghien-cuu/sitemap-index.xml");
const BASE = opt("base", SITEMAP.slice(0, SITEMAP.lastIndexOf("/") + 1));
const CHECK_EXTERNAL = !flag("no-external");
const CHECK_ASSETS = !flag("no-assets");
const CONC = Number(opt("concurrency", 6));
const EXT_CONC = Math.min(CONC, 4);
const DELAY = Number(opt("delay", 300));
const MAX_PAGES = Number(opt("max-pages", 2000));
const WEIGHT_KB = Number(opt("weight-kb", 1500));
const JSON_OUT = opt("json", null);
const UA = "goc-nghien-cuu-crawl-check/1.0 (+site QA; contact via repo)";
const baseUrl = new URL(BASE);

// ---------- helpers ----------
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}
async function req(url, { method = "GET", redirect = "manual", timeout = 20000 } = {}) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { method, redirect, headers: { "user-agent": UA, accept: "*/*" }, signal: AbortSignal.timeout(timeout) });
      return res;
    } catch (e) {
      if (attempt === 1) return { status: 0, error: e.cause?.code || e.name || String(e), headers: new Headers(), arrayBuffer: async () => new ArrayBuffer(0), text: async () => "" };
      await sleep(500);
    }
  }
}
const isInternal = u => u.origin === baseUrl.origin && u.pathname.startsWith(baseUrl.pathname);
const norm = u => { const x = new URL(u); x.hash = ""; return x.href; };
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = s => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] === "#") { const c = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(c) ? String.fromCodePoint(c) : m; }
  return ENT[e.toLowerCase()] ?? m;
});
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decode(m[1] ?? m[2] ?? m[3] ?? "") : null;
};
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(m => m[0]);
const snippet = (s, i, r = 40) => s.slice(Math.max(0, i - r), i + r).replace(/\s+/g, " ").trim();

// ---------- findings ----------
const findings = []; // {sev, cat, url, msg}
const add = (sev, cat, url, msg = "") => findings.push({ sev, cat, url, msg });

// ---------- sitemap ----------
async function readSitemap(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const res = await req(url, { redirect: "follow" });
  if (res.status !== 200) { add("P0", "Sitemap unreachable", url, `HTTP ${res.status || res.error}`); return []; }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => decode(m[1]));
  if (/<sitemapindex/i.test(xml)) return (await Promise.all(locs.map(l => readSitemap(l, seen)))).flat();
  return locs;
}

// ---------- page analysis ----------
const pages = new Map(); // url -> result
const linkSources = new Map(); // target url -> Set(source pages)
const externalLinks = new Map(); // url -> Set(source pages)
const assetRefs = new Map(); // asset url -> Set(pages)

function visibleText(html) {
  let body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  body = body.replace(/<(script|style|noscript|template|svg|pre|code|textarea)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  // drop elements hidden by attribute
  body = body.replace(/<([a-z0-9]+)\b[^>]*\shidden(\s|=|>)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const raw = body.replace(/<[^>]+>/g, " ");
  return { raw, text: decode(raw).replace(/\s+/g, " ") };
}

function analyze(url, html, bytes) {
  const r = { url, bytes, title: null, description: null, canonical: null, h1: 0, imgsNoAlt: [], jsonld: 0 };
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? html;
  const t = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  r.title = t ? decode(t[1]).replace(/\s+/g, " ").trim() : null;
  for (const m of tags(head, "meta")) {
    const n = (attr(m, "name") || "").toLowerCase();
    if (n === "description") r.description = (attr(m, "content") ?? "").trim();
    if (n === "robots") r.robots = attr(m, "content");
  }
  for (const l of tags(head, "link")) if ((attr(l, "rel") || "").toLowerCase().split(/\s+/).includes("canonical")) r.canonical = attr(l, "href");
  r.h1 = (html.match(/<h1\b/gi) || []).length;
  const noindex = /noindex/i.test(r.robots || "");

  // metadata checks
  if (!r.title) add("P0", "Missing <title>", url);
  else if ([...r.title].length > 65) add("P2", "Title > 65 chars", url, `${[...r.title].length}: "${r.title}"`);
  if (!r.description) add("P1", "Missing meta description", url);
  else {
    const L = [...r.description].length;
    if (L < 110 || L > 170) add("P2", "Description outside 110-170 chars", url, `${L}: "${r.description.slice(0, 90)}${L > 90 ? "…" : ""}"`);
  }
  if (!r.canonical) add("P1", "Missing canonical", url);
  else {
    try {
      const c = new URL(r.canonical, url);
      const here = new URL(url);
      // query-string variants (e.g. ?c= deep links) canonicalised to their bare path are not separate pages
      if (here.search && norm(c) === norm(here.origin + here.pathname)) r.variant = true;
      else if (norm(c) !== norm(url) && !noindex) add("P1", "Canonical points elsewhere", url, `→ ${c.href}`);
    } catch { add("P1", "Invalid canonical", url, r.canonical); }
  }
  if (r.h1 === 0) add("P1", "Missing H1", url);
  if (r.h1 > 1) add("P1", "Multiple H1", url, `${r.h1} H1 elements`);

  // markup without inline scripts/templates: hrefs inside JS template strings are not real links
  const markup = html.replace(/<(script|template)\b[\s\S]*?<\/\1>/gi, m => (/^<script\b[^>]*\ssrc=/i.test(m) ? m : " "));
  // images
  for (const img of tags(markup, "img")) {
    const alt = attr(img, "alt");
    const src = attr(img, "src") || attr(img, "data-src") || "(no src)";
    if (alt === null) r.imgsNoAlt.push(src);
    if (CHECK_ASSETS && src && !src.startsWith("data:") && src !== "(no src)") {
      try { const a = norm(new URL(src, url)); if (!assetRefs.has(a)) assetRefs.set(a, new Set()); assetRefs.get(a).add(url); } catch {}
    }
  }
  if (r.imgsNoAlt.length) add("P2", "Images without alt", url, `${r.imgsNoAlt.length}: ${r.imgsNoAlt.slice(0, 3).join(", ")}`);

  // JSON-LD
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)) {
    r.jsonld++;
    let data;
    try { data = JSON.parse(m[1]); } catch (e) { add("P0", "Invalid JSON-LD", url, e.message.slice(0, 120)); continue; }
    const nodes = Array.isArray(data) ? data : data["@graph"] ? data["@graph"] : [data];
    nodes.forEach((n, i) => { if (!n || typeof n !== "object" || !n["@type"]) add("P1", "JSON-LD node without @type", url, `node ${i}`); });
    if (!Array.isArray(data) && !data["@context"]) add("P2", "JSON-LD without @context", url);
  }

  // visible text checks
  const { raw, text } = visibleText(html);
  const dbl = raw.match(/&amp;(amp|lt|gt|quot|#\d+|nbsp);/i);
  if (dbl) add("P1", "Raw HTML entity visible in text", url, `…${snippet(raw, dbl.index)}…`);
  const rawEnt = text.match(/&(amp|lt|gt|quot|nbsp|#\d+);/i);
  if (rawEnt && !dbl) add("P1", "Raw HTML entity visible in text", url, `…${snippet(text, rawEnt.index)}…`);
  const PH = [
    [/\[(tên|ten|điền|dien|nhập|nhap|TODO|TBD|placeholder|xxx)[^\]]{0,40}\]/i, "P0"],
    [/\{\{[^}]{0,40}\}\}/, "P0"],
    [/\bundefined\b/, "P0"],
    [/\bNaN\b/, "P0"],
    [/\[object Object\]/, "P0"],
    [/lorem ipsum/i, "P0"],
    [/\bnull\b/, "P1"],
    [/\bTODO\b|\bFIXME\b/, "P1"],
  ];
  for (const [re, sev] of PH) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    const hits = [...text.matchAll(g)].filter(h => {
      if (h[0] !== "null") return true;
      const before = text.slice(Math.max(0, h.index - 25), h.index).toLowerCase();
      return !/(giả thuyết|gia thuyet|hypothesis|h0|mô hình|model)\s*$/.test(before); // "giả thuyết null" is real stats vocabulary
    });
    if (hits.length) add(sev, "Placeholder / bad value in visible text", url, `"${hits[0][0]}" ×${hits.length}: …${snippet(text, hits[0].index)}…`);
  }

  // links + assets
  for (const a of tags(markup, "a")) {
    const href = attr(a, "href");
    if (!href || /^(mailto|tel|javascript|data):/i.test(href) || href.startsWith("#")) continue;
    let u; try { u = new URL(href, url); } catch { add("P1", "Malformed href", url, href); continue; }
    if (!/^https?:$/.test(u.protocol)) continue;
    const key = norm(u);
    if (u.origin === baseUrl.origin && !u.pathname.startsWith(baseUrl.pathname)) { add("P0", "Internal link escapes base path", url, href); continue; }
    if (isInternal(u)) { if (!linkSources.has(key)) linkSources.set(key, new Set()); linkSources.get(key).add(url); }
    else { if (!externalLinks.has(key)) externalLinks.set(key, new Set()); externalLinks.get(key).add(url); }
  }
  if (CHECK_ASSETS) {
    for (const s of tags(html, "script")) { const src = attr(s, "src"); if (src) addAsset(src, url); }
    for (const l of tags(html, "link")) {
      const rel = (attr(l, "rel") || "").toLowerCase();
      if (/stylesheet|preload|modulepreload/.test(rel) && attr(l, "href")) addAsset(attr(l, "href"), url);
    }
  }
  return r;
}
function addAsset(src, page) {
  try { const a = norm(new URL(src, page)); if (!assetRefs.has(a)) assetRefs.set(a, new Set()); assetRefs.get(a).add(page); } catch {}
}

// ---------- crawl ----------
async function crawlOne(url, fromSitemap) {
  let cur = url, hops = [], res;
  for (let i = 0; i < 6; i++) {
    res = await req(cur);
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      const next = new URL(res.headers.get("location"), cur).href;
      hops.push(`${res.status} → ${next}`);
      cur = next;
      continue;
    }
    break;
  }
  const result = { url, status: res.status, error: res.error, finalUrl: cur, hops, fromSitemap };
  if (hops.length) {
    const src = [...(linkSources.get(url) || [])];
    add(fromSitemap ? "P1" : "P2", fromSitemap ? "Redirect (URL listed in sitemap)" : "Redirect (internal link)", url,
      hops.join(" ; ") + (src.length ? `; linked from ${src.length} page(s), e.g. ${src.slice(0, 3).join(", ")}` : ""));
  }
  if (res.status !== 200) {
    const src = [...(linkSources.get(url) || [])].slice(0, 3);
    add("P0", "Non-200 internal URL", url, `HTTP ${res.status || res.error}${fromSitemap ? " (in sitemap)" : ""}${src.length ? `; linked from ${src.join(", ")}` : ""}`);
    return result;
  }
  const ct = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());
  result.bytes = buf.length;
  result.contentType = ct;
  if (!/text\/html/i.test(ct)) return result;
  if (hops.length) { result.redirected = true; if (isInternal(new URL(cur))) enqueue(norm(cur), false); return result; }
  Object.assign(result, analyze(url, buf.toString("utf8"), buf.length));
  return result;
}

const queue = [];
const queued = new Set();
function enqueue(u, fromSitemap) {
  if (queued.has(u) || queued.size >= MAX_PAGES) return;
  queued.add(u);
  queue.push({ u, fromSitemap });
}

async function main() {
  const t0 = Date.now();
  const sitemapUrls = [...new Set((await readSitemap(SITEMAP)).map(norm))];
  const sitemapSet = new Set(sitemapUrls);
  sitemapUrls.forEach(u => enqueue(u, true));
  // crawl in waves: newly discovered internal links are enqueued after each wave
  while (queue.length) {
    const wave = queue.splice(0);
    await pool(wave, CONC, async ({ u, fromSitemap }) => { pages.set(u, await crawlOne(u, fromSitemap)); });
    for (const [target] of linkSources) {
      // skip file-like assets (pdf, xlsx…) from HTML crawl? still check status: enqueue everything internal
      enqueue(target, false);
    }
  }
  if (queued.size >= MAX_PAGES) add("P1", "Crawl capped", BASE, `stopped at --max-pages ${MAX_PAGES}`);

  // pages found by crawling but missing from sitemap (HTML 200 only, indexable)
  const htmlAll = [...pages.values()].filter(p => p.status === 200 && !p.redirected && /text\/html/i.test(p.contentType || ""));
  const variants = htmlAll.filter(p => p.variant);
  const htmlOk = htmlAll.filter(p => !p.variant);
  for (const p of htmlOk) {
    if (!sitemapSet.has(p.url) && !p.hops.length && !/noindex/i.test(p.robots || "") && !/\/404\/?$/.test(p.url)) add("P2", "Indexable page not in sitemap", p.url);
  }

  // duplicates
  const dup = (field, sev, cat) => {
    const m = new Map();
    for (const p of htmlOk) if (p[field]) { if (!m.has(p[field])) m.set(p[field], []); m.get(p[field]).push(p.url); }
    for (const [v, urls] of m) if (urls.length > 1) add(sev, cat, urls[0], `"${v.slice(0, 80)}" shared by ${urls.length} pages: ${urls.slice(1, 6).join(", ")}${urls.length > 6 ? " …" : ""}`);
  };
  dup("title", "P1", "Duplicate title");
  dup("description", "P1", "Duplicate meta description");

  // assets: status + bytes for page weight
  const assetSize = new Map();
  if (CHECK_ASSETS) {
    const list = [...assetRefs.keys()];
    await pool(list, CONC, async a => {
      const u = new URL(a);
      if (!isInternal(u) && u.origin === baseUrl.origin) { add("P0", "Asset outside base path", a, `used on ${[...assetRefs.get(a)][0]}`); }
      const res = await req(a, { redirect: "follow" });
      if (res.status !== 200) {
        add(isInternal(u) ? "P0" : "P1", "Broken asset (img/css/js)", a, `HTTP ${res.status || res.error}; used on ${[...assetRefs.get(a)].slice(0, 3).join(", ")}`);
        assetSize.set(a, 0);
        return;
      }
      assetSize.set(a, (await res.arrayBuffer()).byteLength);
    });
    for (const p of htmlOk) {
      let total = p.bytes;
      for (const [a, ps] of assetRefs) if (ps.has(p.url)) total += assetSize.get(a) || 0;
      p.weight = total;
      if (total > WEIGHT_KB * 1024) add("P2", `Page weight > ${WEIGHT_KB} KB`, p.url, `${(total / 1024).toFixed(0)} KB (HTML ${(p.bytes / 1024).toFixed(0)} KB)`);
    }
  }

  // external links
  const extResults = [];
  if (CHECK_EXTERNAL) {
    const byHost = new Map();
    for (const u of externalLinks.keys()) { const h = new URL(u).host; if (!byHost.has(h)) byHost.set(h, []); byHost.get(h).push(u); }
    // one worker per host, at most EXT_CONC hosts at a time; delay between requests to the same host
    await pool([...byHost.values()], EXT_CONC, async urls => {
      for (const u of urls) {
        let res = await req(u, { method: "HEAD", redirect: "follow", timeout: 15000 });
        if (res.status === 0 || res.status >= 400) { await sleep(DELAY); res = await req(u, { method: "GET", redirect: "follow", timeout: 20000 }); }
        if (res.status >= 500) { await sleep(DELAY * 4); res = await req(u, { method: "GET", redirect: "follow", timeout: 20000 }); }
        try { res.body?.cancel?.(); } catch {}
        const st = res.status;
        extResults.push({ url: u, status: st, error: res.error });
        const from = [...externalLinks.get(u)];
        const where = `from ${from.slice(0, 2).join(", ")}${from.length > 2 ? ` (+${from.length - 2})` : ""}`;
        if ([401, 403, 429, 999].includes(st)) add("P3", "External link blocks bots (verify manually)", u, `HTTP ${st}; ${where}`);
        else if (st === 0) add("P2", "External link unreachable (timeout/DNS)", u, `${res.error}; ${where}`);
        else if (st >= 500) add("P2", "External link 5xx (server error, may be transient or bot-filtering — verify in a browser)", u, `HTTP ${st}; ${where}`);
        else if (st >= 400) add("P1", "External link 4xx (dead link)", u, `HTTP ${st}; ${where}`);
        await sleep(DELAY);
      }
    });
  }

  // ---------- report ----------
  const SEV = { P0: "P0 — blocking (exit 1)", P1: "P1 — fix soon", P2: "P2 — polish / SEO", P3: "P3 — informational" };
  const counts = Object.fromEntries(Object.keys(SEV).map(s => [s, findings.filter(f => f.sev === s).length]));
  const weights = htmlOk.filter(p => p.weight).map(p => p.weight).sort((a, b) => a - b);
  const median = weights.length ? weights[Math.floor(weights.length / 2)] : 0;
  const out = [];
  out.push(`# Crawl check — ${BASE}`, "");
  out.push(`- Run: ${new Date().toISOString()} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  out.push(`- Sitemap URLs: ${sitemapUrls.length}; URLs crawled: ${pages.size}; HTML pages analysed: ${htmlOk.length} (+${variants.length} query-string variants canonicalised to their base page; excluded from duplicate/sitemap checks)`);
  out.push(`- External links: ${externalLinks.size}${CHECK_EXTERNAL ? ` (checked)` : " (skipped)"}; assets: ${assetRefs.size}${CHECK_ASSETS ? "" : " (skipped)"}`);
  if (weights.length) out.push(`- Page weight (HTML + referenced css/js/img, uncompressed): median ${(median / 1024).toFixed(0)} KB, max ${(weights.at(-1) / 1024).toFixed(0)} KB`);
  out.push(`- Findings: ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(", ")}`, "");
  for (const sev of Object.keys(SEV)) {
    const fs = findings.filter(f => f.sev === sev);
    if (!fs.length) continue;
    out.push(`## ${SEV[sev]} (${fs.length})`, "");
    const cats = [...new Set(fs.map(f => f.cat))];
    for (const c of cats) {
      const items = fs.filter(f => f.cat === c);
      out.push(`### ${c} (${items.length})`, "");
      for (const f of items.slice(0, 60)) out.push(`- ${f.url.replace(baseUrl.origin, "")}${f.msg ? ` — ${f.msg.replaceAll("|", "\\|")}` : ""}`);
      if (items.length > 60) out.push(`- … ${items.length - 60} more`);
      out.push("");
    }
  }
  if (weights.length) {
    out.push("## Heaviest pages", "", "| Page | Total KB | HTML KB |", "|---|---:|---:|");
    for (const p of [...htmlOk].sort((a, b) => (b.weight || 0) - (a.weight || 0)).slice(0, 10)) out.push(`| ${p.url.replace(baseUrl.origin, "")} | ${((p.weight || 0) / 1024).toFixed(0)} | ${(p.bytes / 1024).toFixed(0)} |`);
    out.push("");
  }
  process.stdout.write(out.join("\n") + "\n");
  if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify({ base: BASE, pages: [...pages.values()], findings, external: extResults }, null, 2));
  process.exitCode = counts.P0 > 0 ? 1 : 0;
}

main().catch(e => { console.error(e); process.exitCode = 2; });
