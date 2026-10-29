// Static builder for Góc Nghiên Cứu. No dependencies: `node build.mjs` writes ./dist.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));
const out = join(root, 'dist');
const BASE = cfg.basePath.replace(/\/$/, '');
const SITE = cfg.siteUrl.replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const abs = (p) => SITE + p;
// Root-relative links in content ("/bai-viet/x/") are rewritten under the deploy base path.
const rebase = (html) => html.replace(/(href|src)="\/(?!\/)/g, `$1="${BASE}/`);

function parseDoc(file) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^\s*<!--([\s\S]*?)-->/);
  if (!m) throw new Error(`Missing JSON front matter: ${file}`);
  let meta;
  try { meta = JSON.parse(m[1]); } catch (e) { throw new Error(`Bad front matter JSON in ${file}: ${e.message}`); }
  return { meta, body: raw.slice(m[0].length).trim() };
}

// Every outbound link to the app carries a ref code (counted by the backend's
// affiliate click/conversion tables) plus UTM tags, so this channel can be
// compared against the official ones.
function appLink(kind, content, next) {
  const u = new URL('/signup', cfg.appUrl);
  u.searchParams.set('ref', cfg.refCodes[kind]);
  if (next) u.searchParams.set('next', next);
  u.searchParams.set('utm_source', 'goc-nghien-cuu');
  u.searchParams.set('utm_medium', kind);
  u.searchParams.set('utm_campaign', 'ai-lab');
  u.searchParams.set('utm_content', content);
  return u.toString();
}

function cta(audience, kind, content) {
  if (audience === 'respondent') {
    return `<aside class="cta"><strong>Rảnh 10 phút? Làm khảo sát, tích GTOKEN</strong>
<p>Trên Genius Data bạn tự chọn khảo sát hợp với mình, làm trên điện thoại lúc nào cũng được. Mỗi khảo sát hợp lệ được cộng GTOKEN để đổi quà và voucher.</p>
<a class="btn" href="${esc(appLink(kind, content))}" rel="noopener">Tham gia làm khảo sát</a></aside>`;
  }
  return `<aside class="cta"><strong>Cần thu mẫu nhanh và đúng đối tượng?</strong>
<p>Genius Data cho bạn chọn nhóm người trả lời, tự đặt mức thưởng mỗi câu, và <b>chỉ trả tiền cho phản hồi được duyệt</b>. Phiếu điền bừa hay do AI viết được hệ thống gắn cờ trước khi tới tay bạn.</p>
<a class="btn" href="${esc(appLink(kind, content, '/app/forms'))}" rel="noopener">Tạo khảo sát trên Genius Data</a></aside>`;
}

function layout({ path, title, description, h1, lede, body, jsonld = [], crumbs = [], type = 'website', meta = '' }) {
  const url = abs(path);
  const fullTitle = path === '/' ? `${cfg.siteName} · Công cụ và hướng dẫn cho người làm khảo sát` : `${title} | ${cfg.siteName}`;
  const crumbLd = crumbs.length ? [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [{ name: cfg.siteName, path: '/' }, ...crumbs].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  }] : [];
  const ld = [...jsonld, ...crumbLd].map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const crumbHtml = crumbs.length ? `<div class="crumbs"><a href="/">${cfg.siteName}</a>${crumbs.map((c) => ` / <a href="${c.path}">${esc(c.name)}</a>`).join('')}</div>` : '';
  return rebase(`<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${cfg.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleSiteVerification)}">` : ''}
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${esc(cfg.siteName)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="vi_VN">
<meta property="og:image" content="${cfg.appUrl}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%231f6f5c'/%3E%3Cpath d='M9 22V10h6a4 4 0 010 8h-6' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap">
<link rel="stylesheet" href="/style.css">
${ld}
</head>
<body>
<header class="site"><div class="container wide">
<a class="brand" href="/"><b>${cfg.siteName}</b><small>BY GENIUS DATA</small></a>
<nav class="main" aria-label="Chính"><a href="/bai-viet/">Bài viết</a><a href="/cong-cu/tinh-co-mau/">Tính cỡ mẫu</a><a href="/cong-cu/cronbach-alpha/">Cronbach's alpha</a></nav>
</div></header>
<main><div class="container${meta === 'wide' ? ' wide' : ''}">
${crumbHtml}
<h1>${esc(h1 || title)}</h1>
${lede ? `<p class="lede">${lede}</p>` : ''}
${body}
</div></main>
<footer class="site"><div class="container wide">
<span>${cfg.siteName} là kênh nội dung miễn phí do <a href="${esc(appLink('home', 'footer'))}">Genius Data</a> vận hành, dành cho sinh viên, học viên và người làm nghiên cứu.</span>
<span>Liên hệ: hi@geniusdata.io</span>
</div></footer>
</body>
</html>`);
}

function write(path, html) {
  const dir = join(out, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

// ---- build ----
if (existsSync(out)) rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'style.css'), readFileSync(join(root, 'src/style.css')));
writeFileSync(join(out, '.nojekyll'), '');

const urls = [];
const postsDir = join(root, 'content/posts');
const posts = readdirSync(postsDir).filter((f) => f.endsWith('.html')).map((f) => {
  const { meta, body } = parseDoc(join(postsDir, f));
  return { slug: f.replace(/\.html$/, ''), ...meta, body };
}).sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title, 'vi'));

const tools = ['tinh-co-mau', 'cronbach-alpha'].map((slug) => {
  const { meta, body } = parseDoc(join(root, 'src/tools', `${slug}.html`));
  return { slug, ...meta, body };
});

for (const t of tools) {
  const path = `/cong-cu/${t.slug}/`;
  const body = t.body.replace('{{CTA}}', cta('researcher', 'tool', t.slug));
  write(path, layout({
    path, title: t.title, description: t.description, h1: t.h1, lede: t.lede, body, meta: 'wide',
    crumbs: [{ name: 'Công cụ', path }],
    jsonld: [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: t.h1, url: abs(path), applicationCategory: 'EducationalApplication', operatingSystem: 'Any', inLanguage: 'vi', offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' }, description: t.description }],
  }));
  urls.push({ path, priority: '0.9' });
}

for (const p of posts) {
  const path = `/bai-viet/${p.slug}/`;
  const n = (p.body.match(/\{\{CTA\}\}/g) || []).length;
  if (n !== 1) console.warn(`! ${p.slug}: expected one {{CTA}}, found ${n}`);
  const body = p.body
    .replace('{{CTA}}', cta(p.audience, 'blog', p.slug))
    .replace(/\{\{CTA\}\}/g, '')
    .replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 3)
    .map((x) => `<a class="card" href="/bai-viet/${x.slug}/"><b>${esc(x.title)}</b><span>${esc(x.description)}</span></a>`).join('');
  write(path, layout({
    path, title: p.title, description: p.description, type: 'article',
    body: `<div class="meta">${p.date} · ${p.readingMinutes || 6} phút đọc</div>${body}<h2 class="section-title">Đọc tiếp</h2><div class="grid">${related}</div>`,
    crumbs: [{ name: 'Bài viết', path: '/bai-viet/' }],
    jsonld: [{ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, inLanguage: 'vi', mainEntityOfPage: abs(path), author: { '@type': 'Organization', name: 'Genius Data', url: cfg.appUrl }, publisher: { '@type': 'Organization', name: 'Genius Data', url: cfg.appUrl } }],
  }));
  urls.push({ path, priority: '0.8', lastmod: p.date });
}

const postCards = posts.map((p) => `<a class="card" href="/bai-viet/${p.slug}/"><span class="tag">${p.audience === 'respondent' ? 'Cho người làm khảo sát' : 'Nghiên cứu'}</span><b>${esc(p.title)}</b><span>${esc(p.description)}</span></a>`).join('');
const toolCards = tools.map((t) => `<a class="card" href="/cong-cu/${t.slug}/"><span class="tag">Công cụ miễn phí</span><b>${esc(t.h1)}</b><span>${esc(t.description)}</span></a>`).join('');

write('/bai-viet/', layout({
  path: '/bai-viet/', title: 'Bài viết về phương pháp nghiên cứu và khảo sát',
  description: 'Hướng dẫn thực hành: thu mẫu khoá luận, tính cỡ mẫu, thang đo Likert, Cronbach\'s alpha, lọc phiếu không hợp lệ, thiết kế bảng hỏi.',
  h1: 'Bài viết', body: `<div class="grid">${postCards}</div>`, meta: 'wide', crumbs: [{ name: 'Bài viết', path: '/bai-viet/' }],
}));
urls.push({ path: '/bai-viet/', priority: '0.7' });

write('/', layout({
  path: '/', title: cfg.siteName, meta: 'wide',
  description: 'Công cụ tính cỡ mẫu, Cronbach\'s alpha và hướng dẫn thu mẫu khảo sát miễn phí cho sinh viên làm khoá luận, học viên cao học và người làm nghiên cứu.',
  h1: 'Làm khảo sát cho khoá luận, đỡ vất vả hơn',
  lede: 'Công cụ tính toán miễn phí và hướng dẫn thực hành cho từng bước: tính cỡ mẫu, thiết kế bảng hỏi, thu mẫu, lọc phiếu và kiểm định độ tin cậy.',
  body: `<h2 class="section-title">Công cụ</h2><div class="grid">${toolCards}</div>
<h2 class="section-title">Hướng dẫn</h2><div class="grid">${postCards}</div>
${cta('researcher', 'home', 'home')}`,
  jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: cfg.siteName, url: abs('/'), inLanguage: 'vi', publisher: { '@type': 'Organization', name: 'Genius Data', url: cfg.appUrl } }],
}));
urls.unshift({ path: '/', priority: '1.0' });

writeFileSync(join(out, '404.html'), layout({ path: '/404', title: 'Không tìm thấy trang', description: 'Trang không tồn tại.', body: '<p>Trang bạn tìm không có ở đây. <a href="/">Về trang chủ</a>.</p>' }));
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${abs(u.path)}</loc><lastmod>${u.lastmod || TODAY}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);
if (cfg.indexNowKey) writeFileSync(join(out, `${cfg.indexNowKey}.txt`), cfg.indexNowKey);
writeFileSync(join(out, 'urls.json'), JSON.stringify(urls.map((u) => abs(u.path)), null, 2));

console.log(`Built ${urls.length} pages (${posts.length} posts, ${tools.length} tools) -> dist/`);
