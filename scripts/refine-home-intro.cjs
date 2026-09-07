/* Refine only the homepage introduction after the existing SEO pipeline.
 * The generated HTML remains crawlable; no client-side replacement or extra H1.
 */
const fs = require('node:fs');
const path = require('node:path');

const intro = `<section class="seo-home-intro cavero-home-intro" aria-labelledby="homeSeoHeading">
  <div class="cavero-intro-inner">
    <p class="cavero-intro-kicker">CAVERO WATCHES · PORTUGAL</p>
    <h1 id="homeSeoHeading">Relógios masculinos com <span>presença.</span></h1>
    <p class="cavero-intro-description">Descobre relógios clássicos, cronógrafos e modelos desportivos. Explora a coleção CAVERO, compara acabamentos e encontra o relógio que combina contigo.</p>
    <div class="cavero-intro-actions">
      <a class="cavero-intro-primary" href="/#colecao">Explorar a coleção <span aria-hidden="true">&nbsp;→</span></a>
      <a class="cavero-intro-secondary" href="/sobre-nos">Conhecer a CAVERO</a>
    </div>
    <p class="cavero-intro-meta">Clássicos · Cronógrafos · Desportivos</p>
  </div>
</section>`;

const introPattern = /<section\b[^>]*class="[^"]*\bseo-home-intro\b[^"]*"[^>]*>[\s\S]*?<\/section>/i;
const stylesheet = '<link rel="stylesheet" href="/home-intro.css">';

function refineHome(html) {
  if (!introPattern.test(html)) throw new Error('Homepage SEO introduction not found; review the build before changing the layout.');
  let result = html.replace(introPattern, intro);
  if (!result.includes('href="/home-intro.css"')) {
    if (!result.includes('</head>')) throw new Error('Homepage head not found.');
    result = result.replace('</head>', stylesheet + '\n</head>');
  }
  return result;
}

function apply() {
  const file = path.join(__dirname, '..', 'dist', 'index.html');
  fs.writeFileSync(file, refineHome(fs.readFileSync(file, 'utf8')));
  console.log('Homepage introduction refined; SEO metadata and other pages preserved.');
}

module.exports = { refineHome, apply };
if (require.main === module) apply();
