/* Install the Google Analytics 4 tag on every generated HTML page. */
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(__dirname, '..', 'dist');
const measurementId = 'G-NK2J21D417';
const marker = 'data-cavero-ga4';
const bootstrap = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NK2J21D417" ${marker}></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-NK2J21D417');
</script>`;

function addGoogleAnalytics(html) {
  if (typeof html !== 'string' || !/<\/head\s*>/i.test(html)) {
    throw new Error('Storefront head not found.');
  }
  if (html.includes(marker)) {
    if (!html.includes(measurementId)) throw new Error('GA4 marker has an unexpected measurement ID.');
    return html;
  }
  // Never install a second Google tag beside an existing GA4 or GTM integration.
  if (/<script\b[^>]*\bsrc\s*=\s*["'][^"']*googletagmanager\.com\/(?:gtag\/js|gtm\.js)[^"']*["']/i.test(html) ||
      /googletagmanager\.com\/ns\.html/i.test(html) ||
      /gtag\s*\(\s*["']config["']\s*,\s*["']G-[A-Z0-9]+["']/i.test(html)) {
    throw new Error('An existing Google Analytics or Tag Manager installation must be reviewed before adding another.');
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
        const next = addGoogleAnalytics(original);
        if (next !== original) {
          fs.writeFileSync(file, next);
          count++;
        }
      }
    }
  }
  if (!fs.existsSync(out)) throw new Error('Generated storefront missing.');
  walk(out);
  const home = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
  if (!home.includes(marker) || !home.includes(measurementId)) {
    throw new Error('GA4 was not included in the generated homepage.');
  }
  console.log(`Google Analytics 4 included in ${count} generated pages.`);
}

module.exports = { addGoogleAnalytics, apply };
if (require.main === module) apply();
