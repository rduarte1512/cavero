const test = require('node:test');
const assert = require('node:assert/strict');
const { refineHome } = require('../scripts/refine-home-intro.cjs');

const fixture = '<!doctype html><html><head><title>CAVERO</title><meta name="description" content="Relógios CAVERO"></head><body><main id="homeView"><section class="seo-home-intro"><h1 id="homeSeoHeading">Relógios masculinos com presença. CAVERO Watches.</h1><p>Texto original</p></section><section id="premiumHero"><h2 id="premiumHeroTitle">CAVERO Velocity</h2></section><section id="avaliacoes-loja">100 000 clientes</section><section id="colecao"></section></main><script src="/seo-client.js"></script></body></html>';

test('renders one crawlable homepage H1 and preserves the rest of the page', () => {
  const html = refineHome(fixture);
  assert.match(html, /<h1 id="homeSeoHeading">Relógios masculinos com <span>presença\.<\/span><\/h1>/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /id="premiumHeroTitle"/);
  assert.match(html, /100 000 clientes/);
  assert.match(html, /<meta name="description" content="Relógios CAVERO">/);
  assert.match(html, /href="\/#colecao"/);
  assert.match(html, /href="\/home-intro\.css"/);
  assert.match(html, /src="\/seo-client\.js"/);
});

test('is idempotent and does not duplicate its stylesheet', () => {
  const once = refineHome(fixture);
  assert.equal(refineHome(once), once);
  assert.equal((once.match(/href="\/home-intro\.css"/g) || []).length, 1);
});

test('fails safely if the expected homepage introduction changes', () => {
  assert.throws(() => refineHome('<html><head></head><body></body></html>'), /introduction not found/);
});
