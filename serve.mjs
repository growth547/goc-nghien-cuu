// Local preview that mimics the GitHub Pages base path: `node serve.mjs` -> http://localhost:4321/<basePath>/
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const base = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8')).basePath.replace(/\/$/, '');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.xml': 'application/xml', '.txt': 'text/plain' };

createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (!p.startsWith(base)) { res.writeHead(302, { location: base + '/' }); return res.end(); }
  let f = join(root, 'dist', p.slice(base.length));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404, { 'content-type': types['.html'] }); return res.end(readFileSync(join(root, 'dist/404.html'))); }
  res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(4321, () => console.log(`http://localhost:4321${base}/`));
