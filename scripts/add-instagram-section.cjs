/* Build-time Instagram invitation using the real CAVERO catalogue.
 * No Instagram scraping, invented statistics, third-party posts or API tokens.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const profile = 'https://www.instagram.com/caverowatches/';
const esc = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function catalogueImages() {
  const context = vm.createContext({});
  for (const file of ['data.js', 'remove-royale.js', 'clean-images.js']) {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  }
  const families = vm.runInContext('families', context);
  return ['velocity', 'apex', 'chronos', 'ocean', 'prestige'].map(key => {
    const family = families.find(f => f.key === key);
    if (!family) throw new Error('Instagram catalogue family missing: ' + key);
    const image = family.cleanImage || family.variants[family.defaultVariant || 0]?.image || family.gallery?.[0];
    if (!image) throw new Error('Instagram catalogue image missing: ' + key);
    return { name: family.name, image };
  });
}

function renderSection(items) {
  if (!Array.isArray(items) || !items.length) throw new Error('Instagram showcase requires catalogue images.');
  return `<section class="cavero-instagram" id="instagram-cavero" aria-labelledby="caveroInstagramTitle">
  <div class="cavero-instagram-inner">
    <div class="cavero-instagram-heading">
      <div>
        <p class="cavero-instagram-kicker">MANTENHA-SE LIGADO · CAVERO WATCHES</p>
        <h2 id="caveroInstagramTitle">O teu próximo relógio. A nossa próxima publicação.</h2>
        <p class="cavero-instagram-description">Segue a CAVERO no Instagram e acompanha novidades, inspiração e os detalhes dos modelos que fazem parte da nossa coleção.</p>
      </div>
      <a class="cavero-instagram-open" href="${profile}" target="_blank" rel="noopener noreferrer" aria-label="Seguir CAVERO Watches no Instagram">Seguir no Instagram <span aria-hidden="true">↗</span></a>
    </div>
    <div class="cavero-instagram-profile">
      <div class="cavero-instagram-identity">
        <div class="cavero-instagram-avatar"><img src="/favicon.svg" width="64" height="64" alt="" loading="lazy"></div>
        <div><a class="cavero-instagram-name" href="${profile}" target="_blank" rel="noopener noreferrer">CAVERO Watches</a><span class="cavero-instagram-handle">@caverowatches</span></div>
      </div>
      <a class="cavero-instagram-open" href="${profile}" target="_blank" rel="noopener noreferrer">Ver perfil <span aria-hidden="true">↗</span></a>
    </div>
    <div class="cavero-instagram-gallery" aria-label="Seleção de relógios CAVERO">
      ${items.map(item => `<a class="cavero-instagram-tile" href="${profile}" target="_blank" rel="noopener noreferrer" aria-label="Conhecer ${esc(item.name)} e seguir CAVERO no Instagram"><img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy" decoding="async"><span>${esc(item.name)}</span></a>`).join('\n      ')}
    </div>
    <div class="cavero-instagram-note"><span>Uma seleção de fotografias do nosso catálogo. Descobre as publicações atuais no perfil oficial.</span><a href="${profile}" target="_blank" rel="noopener noreferrer">@caverowatches ↗</a></div>
  </div>
</section>`;
}

function addInstagram(html, items) {
  if (html.includes('id="instagram-cavero"')) return html;
  if (!/<footer\b/i.test(html)) throw new Error('Storefront footer not found.');
  const section = renderSection(items);
  let result = html.replace(/<footer\b/i, section + '\n<footer');
  if (!result.includes('href="/instagram-section.css"')) {
    result = result.replace('</head>', '<link rel="stylesheet" href="/instagram-section.css">\n</head>');
  }
  return result;
}

function apply() {
  const items = catalogueImages();
  const pages = ['index.html', 'catalogo.html', 'cavero-chronos-ice.html', 'cavero-ocean.html', 'cavero-velocity.html', 'cavero-prestige.html', 'cavero-apex.html'];
  for (const page of pages) {
    const file = path.join(out, page);
    fs.writeFileSync(file, addInstagram(fs.readFileSync(file, 'utf8'), items));
  }
  console.log('CAVERO Instagram section added to 7 storefront pages; source catalogue and SEO metadata preserved.');
}

module.exports = { addInstagram, renderSection, catalogueImages, apply };
if (require.main === module) apply();
