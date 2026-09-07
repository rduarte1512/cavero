/* Build real, crawlable HTML for the existing static storefront. No new runtime dependencies. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const ORIGIN = (process.env.CAVERO_SITE_URL || 'https://cavero-three.vercel.app').replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(ORIGIN)) throw Error('CAVERO_SITE_URL must be an HTTPS origin');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const escape = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const json = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
const url = p => ORIGIN + p;
const catalogContext = vm.createContext({});
for (const file of ['data.js', 'remove-royale.js', 'clean-images.js']) vm.runInContext(read(file), catalogContext, { filename: file });
const families = vm.runInContext('families', catalogContext);
const pagesContext = vm.createContext({ window: {}, document: { querySelector: () => null } });
for (const file of ['site-pages.js', 'about-pages.js']) vm.runInContext(read(file), pagesContext, { filename: file });
const sitePages = pagesContext.window.CAVERO_SITE_PAGES;
const sitePaths = pagesContext.window.CAVERO_SITE_PATHS;
const productPaths = { chronos: '/cavero-chronos-ice', ocean: '/cavero-ocean', velocity: '/cavero-velocity', prestige: '/cavero-prestige', apex: '/cavero-apex' };
const activeFamilies = families.filter(f => productPaths[f.key]);
const image = f => f.cleanImage || f.variants[f.defaultVariant || 0]?.image || f.gallery[0];
const description = f => `${f.subtitle}. ${f.desc} Explora os acabamentos disponíveis na CAVERO Watches, com envio gratuito para Portugal.`;
const money = n => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(n);
const brand = { '@type': 'Brand', name: 'CAVERO Watches' };
const route = (pathname, title, desc, imageUrl, type = 'website', extras = {}) => ({ pathname, title, description: desc, image: imageUrl, type, ...extras });
const homeImage = image(activeFamilies.find(f => f.key === 'velocity') || activeFamilies[0]);
const routes = [route('/', 'Relógios Masculinos e Cronógrafos | CAVERO Watches', 'Descobre relógios masculinos, cronógrafos e modelos clássicos CAVERO. Explora a coleção, escolhe o acabamento e compra online com envio gratuito para Portugal.', homeImage), route('/catalogo', 'Relógios Masculinos e Femininos | Catálogo CAVERO', 'Explora o catálogo CAVERO: relógios clássicos, desportivos e cronógrafos em vários acabamentos. Encontra o modelo que combina contigo e compra com envio gratuito.', homeImage)];
for (const f of activeFamilies) routes.push(route(productPaths[f.key], `${f.name} — ${f.subtitle} | CAVERO`, description(f), image(f), 'product', { family: f }));
for (const [key, pathname] of Object.entries(sitePaths)) {
  if (key === 'search') continue;
  const p = sitePages[key];
  if (p) routes.push(route(pathname, `${p.title} | CAVERO Watches`, p.intro, homeImage, 'article', { page: p }));
}
const guidePath = '/guias/como-escolher-um-relogio';
const guide = {
  title: 'Como escolher um relógio: estilo, tamanho e movimento',
  description: 'Um guia prático para escolher um relógio masculino: tamanho da caixa, quartzo ou automático, materiais, bracelete e estilo para cada ocasião.',
  sections: [
    ['Começa pelo uso que lhe vais dar', 'Um relógio para o dia a dia deve combinar conforto, legibilidade e versatilidade. Para ocasiões formais, um mostrador simples e uma caixa discreta podem ser mais fáceis de combinar. Se preferes um visual desportivo, procura uma estética mais expressiva e verifica se as funções anunciadas são realmente funcionais.'],
    ['Escolhe o tamanho de acordo com o pulso', 'O diâmetro da caixa é apenas uma parte do tamanho. A distância entre asas, a espessura e o formato da caixa também influenciam a forma como o relógio assenta. Compara as dimensões com um relógio que já uses e, quando possível, experimenta o modelo no pulso.'],
    ['Quartzo ou automático?', 'Um movimento de quartzo utiliza normalmente uma pilha e oferece boa precisão com manutenção simples. Um movimento automático é mecânico e recebe energia do movimento do pulso, podendo necessitar de acerto e de manutenção periódica. Confirma sempre o movimento exato do modelo antes de comprar.'],
    ['Materiais, vidro e bracelete', 'O material da caixa, o tipo de vidro e a construção da bracelete influenciam a durabilidade, o peso e o conforto. Aço inoxidável, couro e silicone apresentam características diferentes, mas a aparência não é suficiente para confirmar a composição. Procura também informação sobre o ajuste e a largura da bracelete.'],
    ['Resistência à água não é o mesmo que impermeabilidade', 'Verifica a classificação de resistência à água e as instruções do fabricante. Não assumas que um relógio pode ser usado para nadar ou mergulhar apenas por ter um visual inspirado no mar. Sem uma classificação confirmada, evita expô-lo à água.'],
    ['Compara as especificações e as condições de compra', 'Antes de decidir, confirma movimento, dimensões, materiais, vidro, peso, garantia, prazo de entrega e política de devolução. Quando uma especificação não estiver publicada, pede confirmação ao vendedor em vez de a presumires pelas fotografias.']
  ]
};
routes.push(route(guidePath, `${guide.title} | Guia CAVERO`, guide.description, homeImage, 'article', { guide }));
const navigable = routes.filter(r => r.pathname === '/' || r.pathname === '/catalogo' || r.family || r.guide || ['/sobre-nos', '/o-nosso-legado-a-nossa-visao', '/porque-a-loja-oficial-cavero-watches'].includes(r.pathname));
const schema = r => {
  const graph = [{ '@type': 'WebSite', '@id': url('/#website'), url: url('/'), name: 'CAVERO Watches', inLanguage: 'pt-PT', potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: url('/pesquisar') + '?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } }, { '@type': 'Organization', '@id': url('/#organization'), name: 'CAVERO Watches', url: url('/') }];
  if (r.family) {
    const f = r.family;
    const min = Math.min(...f.variants.map(v => v.price));
    const max = Math.max(...f.variants.map(v => v.price));
    graph.push({ '@type': 'ProductGroup', '@id': url(r.pathname) + '#product', name: f.name, description: description(f), brand, productGroupID: f.key, image: [image(f)], url: url(r.pathname), variesBy: ['https://schema.org/color'], hasVariant: f.variants.map(v => ({ '@type': 'Product', name: `${f.name} — ${v.name}`, image: [v.image], color: v.name, sku: `${f.key}:${v.index}`, inProductGroupWithID: f.key, offers: { '@type': 'Offer', url: url(r.pathname), priceCurrency: 'EUR', price: v.price, seller: { '@id': url('/#organization') } } })), offers: { '@type': 'AggregateOffer', priceCurrency: 'EUR', lowPrice: min, highPrice: max, offerCount: f.variants.length, url: url(r.pathname) } });
  } else if (r.pathname === '/catalogo') {
    graph.push({ '@type': 'CollectionPage', name: r.title, url: url(r.pathname), mainEntity: { '@type': 'ItemList', itemListElement: activeFamilies.map((f, i) => ({ '@type': 'ListItem', position: i + 1, url: url(productPaths[f.key]), name: f.name })) } });
  } else if (r.guide || r.page) {
    graph.push({ '@type': 'WebPage', '@id': url(r.pathname) + '#webpage', url: url(r.pathname), name: r.title, description: r.description, inLanguage: 'pt-PT', isPartOf: { '@id': url('/#website') } });
    if (r.guide) graph.push({ '@type': 'Article', headline: guide.title, description: guide.description, author: { '@id': url('/#organization') }, publisher: { '@id': url('/#organization') }, mainEntityOfPage: url(r.pathname), inLanguage: 'pt-PT' });
  } else graph.push({ '@type': 'WebPage', '@id': url('/#webpage'), url: url('/'), name: r.title, description: r.description, inLanguage: 'pt-PT', isPartOf: { '@id': url('/#website') } });
  if (r.pathname !== '/') graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: url('/') }, { '@type': 'ListItem', position: 2, name: r.family ? r.family.name : r.page ? r.page.title : r.guide ? guide.title : 'Catálogo', item: url(r.pathname) }] });
  return { '@context': 'https://schema.org', '@graph': graph };
};
const head = r => `<title>${escape(r.title)}</title>\n<meta name="description" content="${escape(r.description)}">\n<link rel="canonical" href="${escape(url(r.pathname))}">\n<meta name="robots" content="${r.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">\n<meta property="og:locale" content="pt_PT">\n<meta property="og:site_name" content="CAVERO Watches">\n<meta property="og:type" content="${r.type === 'product' ? 'product' : 'website'}">\n<meta property="og:title" content="${escape(r.title)}">\n<meta property="og:description" content="${escape(r.description)}">\n<meta property="og:url" content="${escape(url(r.pathname))}">\n<meta property="og:image" content="${escape(r.image)}">\n<meta property="og:image:alt" content="${escape(r.family?.name || 'Coleção CAVERO Watches')}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${escape(r.title)}">\n<meta name="twitter:description" content="${escape(r.description)}">\n<meta name="twitter:image" content="${escape(r.image)}">\n${r.family ? `<meta property="product:price:amount" content="${Math.min(...r.family.variants.map(v => v.price))}">\n<meta property="product:price:currency" content="EUR">` : ''}\n<script type="application/ld+json" id="cavero-structured-data">${json(schema(r))}</script>`;
const header = `<header class="seo-header"><a class="seo-brand" href="/">CAVERO <small>WATCHES</small></a><nav aria-label="Navegação principal"><a href="/catalogo">Catálogo</a><a href="/sobre-nos">Sobre nós</a><a href="${guidePath}">Guia de escolha</a></nav></header>`;
const footer = `<footer class="seo-footer"><a href="/">CAVERO Watches</a><p>Relógios para diferentes estilos. Envio gratuito para Portugal.</p><nav aria-label="Informações da loja"><a href="/politica-de-envio">Envio</a><a href="/politica-de-devolucoes">Devoluções</a><a href="/politica-de-privacidade">Privacidade</a><a href="/termos-de-servico">Termos</a></nav></footer>`;
const card = f => `<a class="seo-card" href="${productPaths[f.key]}"><img src="${escape(image(f))}" alt="${escape(f.name)}" loading="lazy"><span><strong>${escape(f.name)}</strong><small>${escape(f.subtitle)}</small><span>Desde ${money(Math.min(...f.variants.map(v => v.price)))}</span></span></a>`;
const productBody = f => `<nav class="seo-breadcrumb" aria-label="Percurso"><a href="/">Início</a> / <a href="/catalogo">Catálogo</a> / ${escape(f.name)}</nav><div class="seo-product"><div><img class="seo-main-image" src="${escape(image(f))}" alt="${escape(f.name)}"><div class="seo-gallery">${f.gallery.slice(0, 4).map(src => `<img src="${escape(src)}" alt="${escape(f.name)} — fotografia do modelo" loading="lazy">`).join('')}</div></div><div><p class="seo-kicker">CAVERO WATCHES · PORTUGAL</p><h1>${escape(f.name)}</h1><p>${escape(f.subtitle)}</p><p class="seo-price">Desde ${money(Math.min(...f.variants.map(v => v.price)))}</p><p>${escape(f.desc)}</p><p>Envio gratuito · Entrega estimada de 5 a 13 dias.</p><a class="seo-action" href="${productPaths[f.key]}#escolher-acabamento">Escolher acabamento</a><h2>Acabamentos disponíveis</h2><div class="seo-variants">${f.variants.map(v => `<div><img src="${escape(v.image)}" alt="${escape(f.name + ' ' + v.name)}" loading="lazy"><span>${escape(v.name)}<small>${money(v.price)}</small></span></div>`).join('')}</div><h2>Informação antes da compra</h2><p>Consulta os acabamentos e os preços acima. As especificações técnicas devem ser confirmadas na informação do produto ou junto do apoio CAVERO; não são presumidas a partir das fotografias.</p><p><a href="/politica-de-envio">Política de envio</a> · <a href="/politica-de-devolucoes">Política de devoluções</a></p></div></div><section><h2>Explora outros modelos</h2><div class="seo-grid">${activeFamilies.filter(x => x.key !== f.key).slice(0, 3).map(card).join('')}</div></section>`;
const catalogBody = () => `<h1>Relógios masculinos e femininos CAVERO</h1><p>Explora a coleção de relógios clássicos, desportivos e cronógrafos. Compara os modelos e escolhe o acabamento que mais combina contigo.</p><div class="seo-grid">${activeFamilies.map(card).join('')}</div><section><h2>Escolher o relógio certo</h2><p>Descobre o que deves ter em conta antes de comprar, desde o tamanho e o movimento até aos materiais e ao ajuste da bracelete.</p><a href="${guidePath}">Ler o guia de escolha de relógios →</a></section>`;
const pageBody = p => `<p class="seo-kicker">${escape(p.kicker || 'CAVERO WATCHES')}</p><h1>${escape(p.title)}</h1><p>${escape(p.intro)}</p>${p.sections.map(([, title, body]) => `<section><h2>${escape(title)}</h2>${body}</section>`).join('')}`;
const guideBody = () => `<p class="seo-kicker">GUIA CAVERO</p><h1>${escape(guide.title)}</h1><p>${escape(guide.description)}</p>${guide.sections.map(([title, body]) => `<section><h2>${escape(title)}</h2><p>${escape(body)}</p></section>`).join('')}<section><h2>Explora a coleção CAVERO</h2><div class="seo-grid">${activeFamilies.map(card).join('')}</div></section>`;
const seoCss = `body[data-seo-boot] > :not(#seo-prerender):not(script){display:none!important}#seo-prerender{font-family:Arial,Helvetica,sans-serif;color:#22221f;background:#faf9f6;line-height:1.65;min-height:100vh}#seo-prerender *{box-sizing:border-box}#seo-prerender a{color:inherit}#seo-prerender .seo-header,#seo-prerender .seo-footer{padding:24px max(20px,calc((100% - 1160px)/2));display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}#seo-prerender .seo-brand{font-size:24px;font-weight:700;letter-spacing:.15em;text-decoration:none}#seo-prerender .seo-brand small{display:block;font-size:9px;letter-spacing:.3em}#seo-prerender nav{display:flex;gap:20px;flex-wrap:wrap}#seo-prerender main{max-width:1160px;margin:auto;padding:40px 20px 80px}#seo-prerender h1{font-size:clamp(30px,4vw,48px);line-height:1.2;letter-spacing:-.03em}#seo-prerender h2{font-size:25px;line-height:1.3;margin-top:40px}#seo-prerender p{max-width:75ch}#seo-prerender section{margin-top:32px}#seo-prerender .seo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:20px;margin-top:24px}#seo-prerender .seo-card{display:block;text-decoration:none;border:1px solid #e5e2dc;border-radius:12px;overflow:hidden;background:white}#seo-prerender .seo-card img{width:100%;aspect-ratio:1;object-fit:cover}#seo-prerender .seo-card>span{display:grid;gap:5px;padding:16px}#seo-prerender .seo-card small{font-size:13px;color:#777}#seo-prerender .seo-product{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;margin-top:28px}#seo-prerender .seo-main-image{width:100%;border-radius:12px}#seo-prerender .seo-gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px}#seo-prerender .seo-gallery img{width:100%;aspect-ratio:1;object-fit:cover}#seo-prerender .seo-price{font-size:26px;font-weight:700}#seo-prerender .seo-kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase}#seo-prerender .seo-action{display:inline-block;padding:14px 24px;background:#24231f;color:white;text-decoration:none;border-radius:4px}#seo-prerender .seo-variants{display:grid;gap:12px}#seo-prerender .seo-variants>div{display:flex;gap:12px;align-items:center;border-bottom:1px solid #e5e2dc;padding:8px 0}#seo-prerender .seo-variants img{width:64px;height:64px;object-fit:cover}#seo-prerender .seo-variants span{display:grid}#seo-prerender .seo-variants small{font-weight:700}#seo-prerender .seo-footer{border-top:1px solid #e5e2dc}#seo-prerender .seo-footer p{margin:0}@media(max-width:700px){#seo-prerender .seo-product{grid-template-columns:1fr;gap:24px}#seo-prerender main{padding-top:24px}#seo-prerender .seo-header,#seo-prerender .seo-footer{padding:20px}}`;
const source = read('index.html');
const replaceHead = (html, r) => html.replace(/<title>[\s\S]*?<\/title>/i, '').replace(/<meta\s+name="description"[^>]*>/i, '').replace('</head>', `${head(r)}\n<link rel="stylesheet" href="/seo.css">\n<script src="/seo-client.js" defer></script>\n</head>`);
const makeHtml = r => {
  let html = replaceHead(source, r);
  if (r.pathname === '/') {
    html = html.replace('<h1 id="premiumHeroTitle">CAVERO Velocity</h1>', '<h1 id="premiumHeroTitle">Relógios masculinos com presença. CAVERO Watches.</h1>');
    return html;
  }
  const content = r.family ? productBody(r.family) : r.page ? pageBody(r.page) : r.guide ? guideBody() : catalogBody();
  const prerender = `<div id="seo-prerender">${header}<main>${content}</main>${footer}</div>`;
  html = html.replace('<body>', '<body data-seo-boot>\n' + prerender);
  if (r.guide) html = html.replace('</body>', '<script>document.addEventListener("DOMContentLoaded",function(){document.body.removeAttribute("data-seo-boot");document.getElementById("seo-prerender")?.remove();});</script>\n</body>');
  return html;
};
function write(p, content) { const target = path.join(out, p); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content); }
fs.rmSync(out, { recursive: true, force: true });
function copyTree(relative = '') {
  for (const entry of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    const rel = path.join(relative, entry.name);
    if (relative === '' && ['dist', 'node_modules', '.git', '.vercel', 'scripts', 'api', 'tests'].includes(entry.name)) continue;
    if (entry.isDirectory()) copyTree(rel);
    else if (entry.isFile() && !entry.name.startsWith('.') && !/\.(?:b64|map)$/i.test(entry.name) && !['package.json', 'package-lock.json', 'vercel.json'].includes(entry.name)) {
      const target = path.join(out, rel); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(root, rel), target);
    }
  }
}
copyTree();
for (const r of routes) write(r.pathname === '/' ? 'index.html' : r.pathname.slice(1) + '/index.html', makeHtml(r));
write('seo.css', seoCss);
write('seo-manifest.json', json(routes.map(({ family, page, guide, ...r }) => ({ ...r, schema: schema({ family, page, guide, ...r }) }))));
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /checkout\nDisallow: /pesquisar\nSitemap: ${url('/sitemap.xml')}\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${navigable.map(r => `  <url><loc>${escape(url(r.pathname))}</loc></url>`).join('\n')}\n</urlset>\n`);
write('404.html', `<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Página não encontrada | CAVERO Watches</title><link rel="stylesheet" href="/seo.css"></head><body><div id="seo-prerender">${header}<main><p class="seo-kicker">ERRO 404</p><h1>Esta página não foi encontrada.</h1><p>O endereço pode ter sido alterado ou já não estar disponível. Continua a explorar a coleção CAVERO.</p><a class="seo-action" href="/catalogo">Ver catálogo</a><p><a href="/pesquisar">Pesquisar relógios</a> · <a href="/">Voltar ao início</a></p></main>${footer}</div></body></html>`);
write('checkout/index.html', replaceHead(source, route('/checkout', 'Checkout | CAVERO Watches', 'Pagamento seguro CAVERO.', homeImage, 'website', { noindex: true })));
write('checkout/confirmacao/index.html', replaceHead(source, route('/checkout/confirmacao', 'Confirmação de encomenda | CAVERO Watches', 'Confirmação de encomenda CAVERO.', homeImage, 'website', { noindex: true })));
write('pesquisar/index.html', replaceHead(source, route('/pesquisar', 'Pesquisar relógios | CAVERO Watches', 'Pesquisa de produtos CAVERO.', homeImage, 'website', { noindex: true })));
console.log(`SEO build: ${routes.length} indexable pages, ${activeFamilies.length} product families, sitemap and robots generated.`);
