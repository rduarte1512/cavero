/* Vercel Web Analytics for the existing static storefront.
 * No React/Next.js runtime, custom purchase events or third-party dependencies.
 */
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(__dirname, '..', 'dist');
const marker = 'data-cavero-vercel-analytics';
const bootstrap = `<script ${marker}>
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
window.va('beforeSend', function (event) {
  if (!event || typeof event.url !== 'string') return null;
  try {
    var url = new URL(event.url, window.location.origin);
    // Keep the page path, but never transmit checkout tokens or search parameters.
    url.search = '';
    url.hash = '';
    return Object.assign({}, event, { url: url.href });
  } catch (error) {
    return null;
  }
});
</script>
<script defer src="/_vercel/insights/script.js"></script>`;

function addVercelAnalytics(html) {
  if (html.includes(marker)) return html;
  if (!/<\/head\s*>/i.test(html)) throw new Error('Storefront head not found.');
  if (/<script\b[^>]*src=["'][^"']*(?:\/_vercel\/insights\/script\.js|cdn\.vercel-insights\.com\/v1\/script(?:\.debug)?\.js)[^"']*["']/i.test(html)) {
    throw new Error('An existing Vercel Analytics loader must be reviewed before adding another.');
  }
  return html.replace(/<\/head\s*>/i, bootstrap + '\n</head>');
}

function apply() {
  let count = 0;
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && entry.name.endsWith('.html')) {
        const original = fs.readFileSync(file, 'utf8');
        const next = addVercelAnalytics(original);
        if (next !== original) {
          fs.writeFileSync(file, next);
          count++;
        }
      }
    }
  }
  walk(out);
  if (!fs.existsSync(path.join(out, 'index.html'))) throw new Error('Generated homepage missing.');
  const home = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
  if (!home.includes(marker) || !home.includes('/_vercel/insights/script.js')) {
    throw new Error('Vercel Analytics was not included in the generated homepage.');
  }
  console.log(`Vercel Web Analytics included in ${count} generated pages.`);
}

module.exports = { addVercelAnalytics, apply };
if (require.main === module) apply();
