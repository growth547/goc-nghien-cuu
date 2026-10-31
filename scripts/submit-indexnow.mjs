// Tell Bing/Yandex (IndexNow) about pages in the sitemap.
//   node scripts/submit-indexnow.mjs                    every page in the live sitemap
//   node scripts/submit-indexnow.mjs --changed old.xml  only pages that are new, or whose <lastmod> differs, in
//                                                       dist/sitemap-0.xml compared with old.xml (the sitemap live before this deploy; CI)
import { readFileSync, existsSync } from "node:fs";

const SITE = "https://gocnghiencuu.com";
const KEY = "2f2cbadc79d54eb53f597aaf9e947665"; // matches public/<KEY>.txt

// <loc> → <lastmod> ("" when the entry has none).
const entries = xml =>
  new Map(
    [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
      .map(([, u]) => [u.match(/<loc>([^<]+)<\/loc>/)?.[1], u.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? ""])
      .filter(([loc]) => loc)
  );

let urlList;
const at = process.argv.indexOf("--changed");
if (at > 0) {
  const oldFile = process.argv[at + 1];
  const now = entries(readFileSync("dist/sitemap-0.xml", "utf8"));
  // No usable old sitemap (first deploy, fetch failed): send every page.
  const before = oldFile && existsSync(oldFile) ? entries(readFileSync(oldFile, "utf8")) : new Map();
  urlList = before.size ? [...now].filter(([loc, mod]) => before.get(loc) !== mod).map(([loc]) => loc) : [...now.keys()];
  if (!urlList.length) {
    console.log("IndexNow: no new or changed pages since the last deploy");
    process.exit(0);
  }
} else {
  urlList = [...entries(await (await fetch(`${SITE}/sitemap-0.xml`)).text()).keys()];
}

// The API accepts up to 10,000 URLs per request.
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urlList.slice(0, 10000) }),
});
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`, await res.text());
if (at > 0) console.log(urlList.slice(0, 50).join("\n"));
