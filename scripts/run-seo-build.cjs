/* Compatibility entry point for the existing static SEO generator.
 * The original generator extracts page definitions by executing the page modules
 * in a VM. Those modules also initialize a browser-only view. Supply that one
 * inert view during extraction so no DOM or checkout code needs to be executed.
 */
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const filename = path.join(__dirname, 'build-seo.cjs');
const source = fs.readFileSync(filename, 'utf8');
const oldContext = 'const pagesContext = vm.createContext({ window: {}, document: { querySelector: () => null } });';
const safeContext = `const pagesContext = vm.createContext({
  window: {},
  document: {
    querySelector: () => null,
    getElementById: id => id === 'sitePageView' ? {} : null
  }
});`;
if (!source.includes(oldContext)) {
  throw new Error('SEO page extraction contract changed; review the generator before building.');
}
const generator = new Module(filename, module);
generator.filename = filename;
generator.paths = Module._nodeModulePaths(path.dirname(filename));
generator._compile(source.replace(oldContext, safeContext), filename);
require('./finalize-seo.cjs');
require('./expand-seo.cjs');
require('./refine-home-intro.cjs').apply();
require('./add-instagram-section.cjs').apply();
require('./add-scroll-motion.cjs').apply();
require('./add-vercel-analytics.cjs').apply();
require('./add-google-analytics.cjs').apply();
