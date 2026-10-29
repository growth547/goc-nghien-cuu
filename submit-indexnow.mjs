// After deploying, tell Bing/Yandex/Seznam (IndexNow) about every page: `node submit-indexnow.mjs`
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));
const urlList = JSON.parse(readFileSync(join(root, 'dist/urls.json'), 'utf8'));
const site = new URL(cfg.siteUrl);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: site.host,
    key: cfg.indexNowKey,
    keyLocation: `${cfg.siteUrl.replace(/\/$/, '')}/${cfg.indexNowKey}.txt`,
    urlList,
  }),
});
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`, await res.text());
