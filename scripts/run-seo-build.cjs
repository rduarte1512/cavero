/* Compatibility entry point for the existing static SEO generator.
 * The original generator extracts page definitions by executing the page modules
 * in a VM. Those modules also initialize a browser-only view. Supply that one
 * inert view during extraction so no DOM or checkout code needs to be executed.
 */
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const filename = path.join(__dirname, 'build-seo.cjs');
let source = fs.readFileSync(filename, 'utf8');
const oldContext = 'const pagesContext = vm.createContext({ window: {}, document: { querySelector: () => null } });';
const safeContext = `const pagesContext = vm.createContext({
  window: {},
  document: {
    querySelector: () => null,
    getElementById: id => id === 'sitePageView' ? {} : null
  }
});`;
const oldCatalogLoad = "for (const file of ['data.js', 'remove-royale.js', 'clean-images.js']) vm.runInContext(read(file), catalogContext, { filename: file });";
const newCatalogLoad = "for (const file of ['data.js', 'mariner-data.js', 'remove-royale.js', 'clean-images.js']) vm.runInContext(read(file), catalogContext, { filename: file });";
const oldProductPaths = "const productPaths = { chronos: '/cavero-chronos-ice', ocean: '/cavero-ocean', velocity: '/cavero-velocity', prestige: '/cavero-prestige', apex: '/cavero-apex' };";
const newProductPaths = "const productPaths = { chronos: '/cavero-chronos-ice', ocean: '/cavero-ocean', velocity: '/cavero-velocity', prestige: '/cavero-prestige', apex: '/cavero-apex', mariner: '/cavero-mariner' };";
if (!source.includes(oldContext) || !source.includes(oldCatalogLoad) || !source.includes(oldProductPaths)) {
  throw new Error('SEO extraction contract changed; review the generator before building.');
}
source = source.replace(oldContext, safeContext).replace(oldCatalogLoad, newCatalogLoad).replace(oldProductPaths, newProductPaths);
const generator = new Module(filename, module);
generator.filename = filename;
generator.paths = Module._nodeModulePaths(path.dirname(filename));
generator._compile(source, filename);
require('./finalize-seo.cjs');

// Keep the existing SEO expander intact while supplying metadata for the new product family.
const expandFilename = path.join(__dirname, 'expand-seo.cjs');
let expandSource = fs.readFileSync(expandFilename, 'utf8');
const apexCopy = "  apex: ['Apex — Relógio Masculino Octogonal | CAVERO', 'Conhece o CAVERO Apex e o seu design octogonal. Vê as fotografias, compara acabamentos e escolhe a tua versão. Envio gratuito para Portugal.']";
const marinerCopy = `${apexCopy},\n  mariner: ['Mariner — Relógio Masculino em Aço Inoxidável | CAVERO', 'Descobre o CAVERO Mariner: mostrador branco, aço inoxidável, movimento de quartzo, data e detalhes luminosos. Preço de lançamento por tempo limitado e envio gratuito para Portugal.']`;
if (!expandSource.includes(apexCopy)) throw new Error('SEO expanded-copy contract changed; review before building.');
expandSource = expandSource.replace(apexCopy, marinerCopy);
const expander = new Module(expandFilename, module);
expander.filename = expandFilename;
expander.paths = Module._nodeModulePaths(path.dirname(expandFilename));
expander._compile(expandSource, expandFilename);

require('./refine-home-intro.cjs').apply();
require('./add-instagram-section.cjs').apply();
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
