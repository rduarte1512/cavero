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
require('./expand-seo.cjs');
require('./refine-home-intro.cjs').apply();
require('./add-instagram-section.cjs').apply();
require('./add-scroll-motion.cjs').apply();
require('./add-vercel-analytics.cjs').apply();
require('./add-google-analytics.cjs').apply();
