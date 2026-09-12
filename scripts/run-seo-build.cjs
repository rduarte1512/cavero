/* Compatibility entry point for the existing static SEO generator.
 * The generator extracts page definitions by executing the page modules in a VM.
 * Those modules also initialize a browser-only view. Supply that one inert view
 * during extraction so no DOM or checkout code needs to be executed.
 */
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const filename = path.join(__dirname, 'build-seo.cjs');
let source = fs.readFileSync(filename, 'utf8');

// remove-royale.js now also contains browser-only trust/contact enhancements.
// During SEO extraction we only need its catalogue mutation, not its DOM code.
const browserMarker = '\n\n(() => {';
const sanitizeRemoveRoyale = raw => raw.split(browserMarker)[0];
const catalogLoop = "for (const file of ['data.js', 'mariner-data.js', 'remove-royale.js', 'clean-images.js']) vm.runInContext(read(file), catalogContext, { filename: file });";
const safeCatalogLoop = `for (const file of ['data.js', 'mariner-data.js', 'remove-royale.js', 'clean-images.js']) {
  const raw = read(file);
  const safeSource = file === 'remove-royale.js' ? raw.split('\\n\\n(() => {')[0] : raw;
  vm.runInContext(safeSource, catalogContext, { filename: file });
}`;
if (!source.includes(catalogLoop)) {
  throw new Error('SEO catalogue extraction contract changed; review the generator before building.');
}
source = source.replace(catalogLoop, safeCatalogLoop);

const oldContext = 'const pagesContext = vm.createContext({ window: {}, document: { querySelector: () => null } });';
const safeContext = `const pagesContext = vm.createContext({
  window: {},
  document: {
    querySelector: () => null,
    getElementById: id => id === 'sitePageView' ? {} : null
  }
});`;
if (!source.includes(oldContext)) {
  throw new Error('SEO extraction contract changed; review the generator before building.');
}
source = source.replace(oldContext, safeContext);
const generator = new Module(filename, module);
generator.filename = filename;
generator.paths = Module._nodeModulePaths(path.dirname(filename));
generator._compile(source, filename);

// finalize-seo.cjs independently reads remove-royale.js from disk. Intercept only
// that read while finalization runs so the browser-only code never reaches its VM.
const nativeReadFileSync = fs.readFileSync;
fs.readFileSync = function(file, ...args) {
  const value = nativeReadFileSync.call(fs, file, ...args);
  if (path.resolve(String(file)) === path.join(path.resolve(__dirname, '..'), 'remove-royale.js')) {
    const asText = typeof value === 'string' ? value : value.toString('utf8');
    const safe = sanitizeRemoveRoyale(asText);
    return typeof value === 'string' ? safe : Buffer.from(safe, 'utf8');
  }
  return value;
};
try {
  require('./finalize-seo.cjs');
} finally {
  fs.readFileSync = nativeReadFileSync;
}

require('./expand-seo.cjs');
require('./refine-home-intro.cjs').apply();
require('./add-scroll-motion.cjs').apply();
require('./add-vercel-analytics.cjs').apply();
require('./add-google-analytics.cjs').apply();

// Ensure the runtime catalogue is rebound to the owner's full-quality Mariner originals
// before app-b renders product cards, galleries and checkout imagery.
const distDir = path.join(__dirname, '..', 'dist');
function injectMarinerHQ(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      injectMarinerHQ(target);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    let html = fs.readFileSync(target, 'utf8');
    if (html.includes('mariner-image-hq.js')) continue;
    const marker = /(<script\s+src=["']\/?catalog-featured\.js["']><\/script>)/i;
    if (!marker.test(html)) continue;
    html = html.replace(marker, '$1\n  <script src="/mariner-image-hq.js"></script>');
    fs.writeFileSync(target, html);
  }
}
injectMarinerHQ(distDir);

// Final pass: one canonical public origin and stronger CAVERO brand/entity signals.
require('./normalize-official-origin.cjs').apply();
