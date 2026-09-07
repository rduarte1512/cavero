const test = require('node:test');
const assert = require('node:assert/strict');
const { addInstagram, renderSection, catalogueImages } = require('../scripts/add-instagram-section.cjs');
const profile = 'https://www.instagram.com/caverowatches/';
const fixture = '<!doctype html><html><head><title>CAVERO</title><meta name="description" content="Original"></head><body><main id="homeView"><h1>Loja</h1></main><section id="checkoutView" class="hidden"></section><footer class="site-footer">Rodapé original</footer><script src="/seo-client.js"></script></body></html>';

test('places one showcase before the footer and preserves existing content', () => {
  const html = addInstagram(fixture, [{name:'CAVERO Velocity',image:'https://example.com/velocity.jpg'}]);
  assert.ok(html.indexOf('id="instagram-cavero"') < html.indexOf('<footer'));
  assert.match(html, /Rodapé original/);
  assert.match(html, /<meta name="description" content="Original">/);
  assert.match(html, /id="checkoutView" class="hidden"/);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.equal((html.match(/href="\/instagram-section\.css"/g)||[]).length,1);
  assert.equal(addInstagram(html,[]),html);
});

test('uses only the requested profile and does not invent Instagram statistics or posts', () => {
  const html=renderSection([{name:'CAVERO Apex',image:'https://example.com/apex.jpg'}]);
  assert.match(html, /@caverowatches/);
  assert.equal((html.match(/https:\/\/www\.instagram\.com\/caverowatches\//g)||[]).length,5);
  assert.doesNotMatch(html,/pagani|followers|seguidores|verificado|54\.6K|287 Posts/i);
  assert.match(html,/fotografias do nosso catálogo/);
  assert.ok(html.indexOf('rel="noopener noreferrer"')>-1);
});

test('uses five active catalogue models and their original product images', () => {
  const items=catalogueImages();
  assert.equal(items.length,5);
  assert.deepEqual(items.map(x=>x.name),['CAVERO Velocity','CAVERO Apex','CAVERO Chronos Ice','CAVERO Ocean','CAVERO Prestige']);
  items.forEach(x=>assert.match(x.image,/^https:\/\/static\.wixstatic\.com\/media\//));
  assert.ok(items.every(x=>x.image));
});

test('fails safely without a footer or catalogue images', () => {
  assert.throws(()=>addInstagram('<html><head></head><body></body></html>',[{name:'CAVERO',image:'x'}]),/footer not found/);
  assert.throws(()=>renderSection([]),/requires catalogue images/);
});
