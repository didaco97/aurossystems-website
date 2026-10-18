// build.mjs - static site build, no dependencies. Reads src/pages, wraps with layout, writes docs/.
// Usage: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, cpSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';

const SRC = 'src', OUT = 'docs';
const BRAND = {
  name: 'AurosSystems',
  tagline: 'Management software, made simple.',
  email: 'dhirajdahale96@gmail.com',
  phone: '+91 95183 80879',
  location: 'Maharashtra, India',
};
const NAV = [
  ['/', 'Home'], ['/products/', 'Products'], ['/ai/', 'AI'], ['/industries/', 'Industries'],
  ['/about/', 'About'], ['/faq/', 'FAQ'],
];

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (e.endsWith('.html')) yield p;
  }
}

function layout({ title, desc, path, body }) {
  const depth = relative(dirname(path), '.') || '.';
  const root = depth === '' ? '.' : depth;
  const isHome = path === 'index.html';
  const nav = NAV.map(([href, label]) => {
    const active = (href === '/' && isHome) || (href !== '/' && path.startsWith(href.slice(1, -1)));
    return `<a href="${root}${href === '/' ? '/' : href}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
  }).join('\n        ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} - ${BRAND.name}</title>
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="${root}/assets/img/logo-mark.png?v=4">
<link rel="stylesheet" href="${root}/assets/css/site.css?v=4">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header" id="site-header">
  <div class="wrap nav-wrap">
    <a class="brand" href="${root}/" aria-label="${BRAND.name} home">
      <img class="brand-mark" src="${root}/assets/img/logo-mark.png?v=4" alt="" width="30" height="30"><span class="brand-name">${BRAND.name}</span>
    </a>
    <nav class="site-nav" id="site-nav" aria-label="Main">
        ${nav}
    </nav>
    <div class="nav-actions">
      <a class="btn btn-primary btn-sm" href="${root}/contact/">Get in touch</a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="site-nav"><span></span><span></span></button>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="${root}/"><img class="brand-mark" src="${root}/assets/img/logo-mark.png?v=4" alt="" width="30" height="30"><span class="brand-name">${BRAND.name}</span></a>
        <p class="footer-tag">${BRAND.tagline}</p>
      </div>
      <div>
        <p class="footer-head">Explore</p>
        <p class="footer-links">${NAV.map(([h, l]) => `<a href="${root}${h === '/' ? '/' : h}">${l}</a>`).join('')}</p>
      </div>
      <div>
        <p class="footer-head">Contact</p>
        <p class="footer-line">${BRAND.email}<br>${BRAND.phone}<br>${BRAND.location}</p>
      </div>
    </div>
    <div class="footer-base">
      <p>&copy; ${new Date().getFullYear()} ${BRAND.name}</p>
    </div>
  </div>
</footer>
<script src="${root}/assets/js/site.js?v=4" defer></script>
</body>
</html>
`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(SRC, 'assets'), join(OUT, 'assets'), { recursive: true });

for (const page of walk(join(SRC, 'pages'))) {
  const raw = readFileSync(page, 'utf8');
  const meta = raw.match(/^<!--\s*title:\s*(.+?)\s*\|\s*desc:\s*(.+?)\s*-->/);
  if (!meta) throw new Error('missing meta comment in ' + page);
  const rel = relative(join(SRC, 'pages'), page);
  const out = join(OUT, rel);
  mkdirSync(dirname(out), { recursive: true });
  let body = raw.slice(meta[0].length).trim();
  const depthRoot = relative(dirname(rel), '.') || '.';
  body = body.replace(/(src|href|poster)="\/(?!\/)/g, (m, a) => a + '="' + (depthRoot === '' ? '.' : depthRoot) + '/');
  writeFileSync(out, layout({ title: meta[1], desc: meta[2], path: rel, body }));
  console.log('built', rel);
}
