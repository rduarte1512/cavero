/* Injeta apenas o scroll reveal atual nos HTML gerados. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const moduleScript = '<script type="module" src="/homepageScrollReveal.js"></script>';

function addScrollMotion(html, pathname = '') {
  if (/^(?:checkout|api)(?:\/|$)/.test(pathname)) return html;
  if (!/<main\b[^>]*id="homeView"/i.test(html) && !/id="instagram-cavero"/.test(html)) return html;

  let result = html
    .replace(/\s*<link\s+rel=["']stylesheet["']\s+href=["']\/scroll-motion\.css["']\s*\/?>(?:\r?\n)?/gi, '\n')
    .replace(/\s*<script\s+src=["']\/scroll-motion\.js["']\s+defer><\/script>(?:\r?\n)?/gi, '\n')
    .replace(/\s*<script\s+defer\s+src=["']\/scroll-motion\.js["']><\/script>(?:\r?\n)?/gi, '\n');

  if (!/src=["']\/?homepageScrollReveal\.js["']/i.test(result)) {
    if (!result.includes('</body>')) throw new Error('Storefront body not found.');
    result = result.replace('</body>', `${moduleScript}\n</body>`);
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

        if (next !== original) {
          fs.writeFileSync(file, next);
          count++;
        }
      }
    }
  }

  walk(out);
  console.log(`CAVERO scroll reveal atualizado em ${count} páginas; checkout excluído.`);
}

module.exports = { addScrollMotion, apply };
if (require.main === module) apply();
