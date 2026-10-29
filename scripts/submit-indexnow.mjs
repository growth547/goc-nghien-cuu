// After a deploy, tell Bing/Yandex (IndexNow) about every page in the live sitemap: `node scripts/submit-indexnow.mjs`
const SITE = "https://growth547.github.io/goc-nghien-cuu";
const KEY = "2f2cbadc79d54eb53f597aaf9e947665"; // matches public/<KEY>.txt

const xml = await (await fetch(`${SITE}/sitemap-0.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`, await res.text());
