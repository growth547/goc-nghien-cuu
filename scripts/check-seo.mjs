#!/usr/bin/env node
// SEO check on the built site: `node scripts/check-seo.mjs [dist] [--strict]` (run after `astro build`).
// Node 22+, no dependencies. Reads every HTML file in dist plus the sitemap and reports:
//   errors (exit 1): missing/duplicate title or description on an indexable page, canonical not
//     https://gocnghiencuu.com/<path>/ for its own path, H1 count other than 1, JSON-LD that does not
//     parse or has no @type, a noindex page listed in the sitemap, a sitemap URL with no page,
//     the old address growth547.github.io/goc-nghien-cuu anywhere in the output,
//     og:url / twitter:card / og:image missing or not absolute.
//   warnings (exit 0, or 1 with --strict): title longer than 60 or shorter than 20 visible characters,
//     description longer than 160 or shorter than 70, fewer than 200 words of body text.
// Titles and descriptions themselves are content; this script only flags them.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const args = process.argv.slice(2);
const STRICT = args.includes("--strict");
const DIST = args.find(a => !a.startsWith("--")) ?? "dist";
const SITE = "https://gocnghiencuu.com/";
const OLD = /growth547\.github\.io\/goc-nghien-cuu/i;
const TITLE_MAX = 60, TITLE_MIN = 20, DESC_MAX = 160, DESC_MIN = 70, MIN_WORDS = 200;

if (!existsSync(join(DIST, "index.html"))) {
  console.error(`check-seo: ${DIST}/index.html not found; run astro build first.`);
  process.exit(2);
}

const seg = new Intl.Segmenter("vi", { granularity: "grapheme" });
const glen = s => [...seg.segment(s.normalize("NFC"))].length;
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
const meta = (head, key) => {
  for (const m of tags(head, "meta")) if ((attr(m, "name") ?? attr(m, "property") ?? "").toLowerCase() === key) return attr(m, "content");
  return null;
};

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (f !== "_astro" && f !== "pagefind") walk(p, out); }
    else out.push(p);
  }
  return out;
}

const errors = [], warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

// sitemap URLs
const sitemapUrls = new Set();
for (const f of readdirSync(DIST).filter(f => /^sitemap-\d+\.xml$/.test(f))) {
  for (const m of readFileSync(join(DIST, f), "utf8").matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) sitemapUrls.add(decode(m[1]));
}
if (!sitemapUrls.size) err("sitemap", "no sitemap-N.xml with <loc> entries in dist");

const files = walk(DIST);
const titles = new Map(), descs = new Map();
const pageUrls = new Map(); // url -> {noindex}
let htmlPages = 0;

for (const file of files) {
  const rel = relative(DIST, file).split(sep).join("/");
  const text = /\.(html|xml|txt|json|js|css|csv|webmanifest)$/i.test(rel) ? readFileSync(file, "utf8") : null;
  if (text && OLD.test(text)) {
    const i = text.search(OLD);
    err(rel, `old address growth547.github.io/goc-nghien-cuu: …${text.slice(Math.max(0, i - 40), i + 50).replace(/\s+/g, " ")}…`);
  }
  if (!rel.endsWith(".html")) continue;
  const html = text;
  // Astro redirect stubs (<meta http-equiv="refresh">) are not pages
  if (/<meta\s+http-equiv=["']?refresh/i.test(html)) continue;
  htmlPages++;
  const path = rel === "index.html" ? "" : rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel;
  const url = SITE + path;
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const robots = meta(head, "robots") ?? "";
  const noindex = /noindex/i.test(robots) || rel === "404.html";
  pageUrls.set(url, { noindex });
  const page = "/" + path;

  // JSON-LD on every page
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try { data = JSON.parse(m[1]); } catch (e) { err(page, `JSON-LD does not parse: ${e.message.slice(0, 100)}`); continue; }
    const nodes = Array.isArray(data) ? data : data["@graph"] ?? [data];
    if (!Array.isArray(data) && !data["@context"]) err(page, "JSON-LD without @context");
    nodes.forEach((n, i) => { if (!n || typeof n !== "object" || !n["@type"]) err(page, `JSON-LD node ${i} without @type`); });
  }

  if (noindex) continue;

  const title = decode(head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/\s+/g, " ").trim();
  if (!title) err(page, "missing <title>");
  else {
    const L = glen(title);
    if (L > TITLE_MAX) warn(page, `title ${L} chars > ${TITLE_MAX}: "${title}"`);
    if (L < TITLE_MIN) warn(page, `title ${L} chars < ${TITLE_MIN}: "${title}"`);
    (titles.get(title) ?? titles.set(title, []).get(title)).push(page);
  }
  const desc = (meta(head, "description") ?? "").trim();
  if (!desc) err(page, "missing meta description");
  else {
    const L = glen(desc);
    if (L > DESC_MAX) warn(page, `description ${L} chars > ${DESC_MAX}`);
    if (L < DESC_MIN) warn(page, `description ${L} chars < ${DESC_MIN}: "${desc}"`);
    (descs.get(desc) ?? descs.set(desc, []).get(desc)).push(page);
  }

  let canonical = null;
  for (const l of tags(head, "link")) if ((attr(l, "rel") ?? "").toLowerCase().split(/\s+/).includes("canonical")) canonical = attr(l, "href");
  if (!canonical) err(page, "missing canonical");
  else if (canonical !== url) err(page, `canonical ${canonical} should be ${url}`);
  else if (!url.endsWith("/") && !/\.\w+$/.test(url)) err(page, "canonical without trailing slash");

  const ogUrl = meta(head, "og:url");
  if (ogUrl !== url) err(page, `og:url ${ogUrl} should be ${url}`);
  const ogImage = meta(head, "og:image");
  if (!ogImage || !ogImage.startsWith(SITE)) err(page, `og:image missing or not absolute on ${SITE}: ${ogImage}`);
  if (!meta(head, "twitter:card")) err(page, "missing twitter:card");

  const h1 = (html.match(/<h1\b/gi) ?? []).length;
  if (h1 !== 1) err(page, `${h1} <h1> elements (want 1)`);

  if (!sitemapUrls.has(url)) warn(page, "indexable page not in sitemap");

  const body = (html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? "")
    .replace(/<(script|style|noscript|template|svg|header|footer|nav)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  const words = decode(body).split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
  if (words < MIN_WORDS) warn(page, `thin page: ${words} words of body text`);
}

for (const [t, ps] of titles) if (ps.length > 1) err(ps[0], `duplicate title on ${ps.length} pages (${ps.slice(1, 5).join(", ")}): "${t}"`);
for (const [d, ps] of descs) if (ps.length > 1) err(ps[0], `duplicate description on ${ps.length} pages (${ps.slice(1, 5).join(", ")}): "${d.slice(0, 80)}"`);

for (const u of sitemapUrls) {
  if (!u.startsWith(SITE)) { err("sitemap", `URL outside ${SITE}: ${u}`); continue; }
  const p = pageUrls.get(u);
  if (!p) { if (!/\.\w+$/.test(u)) err("sitemap", `no page in dist for ${u}`); }
  else if (p.noindex) err("sitemap", `noindex page listed: ${u}`);
  if (!/\/$/.test(u) && !/\.\w+$/.test(u)) err("sitemap", `URL without trailing slash: ${u}`);
}

const print = (label, list) => { if (list.length) console.log(`\n${label} (${list.length}):\n` + list.map(s => "  " + s).join("\n")); };
print("Warnings", warnings);
print("Errors", errors);
console.log(`\ncheck-seo: ${htmlPages} HTML pages, ${sitemapUrls.size} sitemap URLs, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length || (STRICT && warnings.length) ? 1 : 0);
