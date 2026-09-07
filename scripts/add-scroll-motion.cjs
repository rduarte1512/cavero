/* Inject the progressive enhancement into generated storefronts, not checkout. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const stylesheet = '<link rel="stylesheet" href="/scroll-motion.css">';
const script = '<script src="/scroll-motion.js" defer></script>';

function addScrollMotion(html, pathname = '') {
  if (/^(?:checkout|api)(?:\/|$)/.test(pathname)) return html;
  if (!/<main\b[^>]*id="homeView"/i.test(html) && !/id="instagram-cavero"/.test(html)) return html;
  let result = html;
  if (!result.includes('href="/scroll-motion.css"')) {
    if (!result.includes('</head>')) throw new Error('Storefront head not found.');
    result = result.replace('</head>', stylesheet + '\n</head>');
  }
  if (!result.includes('src="/scroll-motion.js"')) {
    if (!result.includes('</body>')) throw new Error('Storefront body not found.');
    result = result.replace('</body>', script + '\n</body>');
  }
  return result;
}

function apply() {
  let count = 0;
  function walk(dir, relative = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = path.join(relative, entry.name);
      if (entry.isDirectory()) walk(path.join(dir, entry.name), rel);
      else if (entry.isFile() && entry.name.endsWith('.html')) {
        const file = path.join(dir, entry.name);
        const original = fs.readFileSync(file, 'utf8');
        const next = addScrollMotion(original, rel.replace(/\\/g, '/'));
        if (next !== original) { fs.writeFileSync(file, next); count++; }
      }
    }
  }
  walk(out);
  console.log(`CAVERO scroll motion added to ${count} storefront pages; checkout excluded.`);
}
module.exports = { addScrollMotion, apply };
if (require.main === module) apply();
