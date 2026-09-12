/* Final SEO normalization for the single public CAVERO origin.
 * Keeps all crawlable URLs, social metadata and structured data aligned with
 * https://caverowatches.vercel.app, even if a build environment exposes a
 * different Vercel alias.
 */
const fs = require('node:fs');
const path = require('node:path');

const out = path.join(__dirname, '..', 'dist');
const OFFICIAL_ORIGIN = 'https://caverowatches.vercel.app';
const SUPPORT_EMAIL = 'caverowatches@sapo.pt';
const LEGACY_ORIGINS = [
  'https://cavero-three.vercel.app',
  'https://cavero-zetawebs-projects.vercel.app',
  'https://cavero-git-main-zetawebs-projects.vercel.app'
];
const TEXT_EXTENSIONS = new Set(['.html', '.xml', '.txt', '.js', '.json']);

const safeJson = value => JSON.stringify(value)
  .replace(/</g, '\\u003c')
  .replace(/>/g, '\\u003e')
  .replace(/&/g, '\\u0026');

function replaceOrigins(value) {
  let result = String(value);
  for (const origin of LEGACY_ORIGINS) result = result.split(origin).join(OFFICIAL_ORIGIN);
  return result;
}

function enhanceSchema(schema) {
  if (!schema || !Array.isArray(schema['@graph'])) return schema;
  for (const node of schema['@graph']) {
    if (!node || typeof node !== 'object') continue;
    if (node['@type'] === 'Organization' && node.name === 'CAVERO Watches') {
      node.alternateName = 'CAVERO';
      node.url = OFFICIAL_ORIGIN + '/';
      node.logo = OFFICIAL_ORIGIN + '/favicon.svg';
      node.email = SUPPORT_EMAIL;
      node.contactPoint = [{
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SUPPORT_EMAIL,
        availableLanguage: ['pt-PT']
      }];
      delete node.sameAs;
    }
    if (node['@type'] === 'WebSite' && node.name === 'CAVERO Watches') {
      node.alternateName = 'CAVERO';
      node.url = OFFICIAL_ORIGIN + '/';
    }
  }
  return schema;
}

function strengthenProductTitle(route) {
  if (!route || route.type !== 'product' || !route.schema) return;
  const group = route.schema['@graph']?.find(node => node?.['@type'] === 'ProductGroup');
  if (!group?.name || !route.title) return;
  const separator = ' — ';
  const suffixIndex = route.title.indexOf(separator);
  if (suffixIndex === -1) return;
  const suffix = route.title.slice(suffixIndex + separator.length);
  route.title = `${group.name}${separator}${suffix}`;
}

function normalizeRoute(route) {
  if (!route || typeof route !== 'object') return route;
  route.schema = enhanceSchema(route.schema);
  strengthenProductTitle(route);
  return route;
}

function replaceTagContent(html, tag, value) {
  const re = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'i');
  const encoded = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return re.test(html) ? html.replace(re, `<${tag}>${encoded}</${tag}>`) : html;
}

function replaceMeta(html, attribute, key, value) {
  const re = new RegExp(`<meta\\s+${attribute}="${key.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}"\\s+content="[^"]*"\\s*\\/?>(?![^<]*<meta\\s+${attribute}="${key}")`, 'i');
  const encoded = String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return re.test(html) ? html.replace(re, `<meta ${attribute}="${key}" content="${encoded}">`) : html.replace('</head>', `<meta ${attribute}="${key}" content="${encoded}">\n</head>`);
}

function replaceCanonical(html, href) {
  const encoded = String(href).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const re = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  return re.test(html) ? html.replace(re, `<link rel="canonical" href="${encoded}">`) : html.replace('</head>', `<link rel="canonical" href="${encoded}">\n</head>`);
}

function replaceStructuredData(html, schema) {
  if (!schema) return html;
  const script = `<script type="application/ld+json" id="cavero-structured-data">${safeJson(schema)}</script>`;
  const re = /<script\s+type="application\/ld\+json"\s+id="cavero-structured-data">[\s\S]*?<\/script>/i;
  return re.test(html) ? html.replace(re, script) : html.replace('</head>', script + '\n</head>');
}

function routeFile(pathname) {
  return pathname === '/' ? path.join(out, 'index.html') : path.join(out, pathname.slice(1) + '.html');
}

function normalizeGeneratedText() {
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const target = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        const original = fs.readFileSync(target, 'utf8');
        const updated = replaceOrigins(original);
        if (updated !== original) fs.writeFileSync(target, updated);
      }
    }
  };
  walk(out);
}

function normalizeSeoData() {
  const manifestPath = path.join(out, 'seo-manifest.json');
  const seoDataPath = path.join(out, 'seo-data.js');
  const routes = JSON.parse(fs.readFileSync(manifestPath, 'utf8')).map(normalizeRoute);
  fs.writeFileSync(manifestPath, safeJson(routes));

  const rawSeoData = fs.readFileSync(seoDataPath, 'utf8');
  const seoData = JSON.parse(rawSeoData.replace(/^window\.CAVERO_SEO=/, '').replace(/;\s*$/, ''));
  seoData.origin = OFFICIAL_ORIGIN;
  seoData.routes = (seoData.routes || []).map(normalizeRoute);
  fs.writeFileSync(seoDataPath, 'window.CAVERO_SEO=' + safeJson(seoData) + ';');

  for (const route of routes) {
    const file = routeFile(route.pathname);
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    html = replaceOrigins(html);
    html = replaceTagContent(html, 'title', route.title);
    html = replaceMeta(html, 'property', 'og:title', route.title);
    html = replaceMeta(html, 'name', 'twitter:title', route.title);
    if (!route.noCanonical) html = replaceCanonical(html, OFFICIAL_ORIGIN + route.pathname);
    html = replaceMeta(html, 'property', 'og:url', OFFICIAL_ORIGIN + route.pathname);
    html = replaceStructuredData(html, route.schema);
    fs.writeFileSync(file, html);
  }
}

function apply() {
  normalizeGeneratedText();
  normalizeSeoData();
  normalizeGeneratedText();
  console.log(`Official SEO origin normalized to ${OFFICIAL_ORIGIN}; product titles and CAVERO entity schema strengthened.`);
}

module.exports = { apply, OFFICIAL_ORIGIN };
if (require.main === module) apply();
