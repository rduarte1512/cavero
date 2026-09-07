/* Finalize the static SEO build without changing checkout or product data. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
const read = p => fs.readFileSync(path.join(out, p), 'utf8');
const write = (p, value) => { const file = path.join(out, p); fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, value); };
const esc = v => String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const safeJSON = v => JSON.stringify(v).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
const routes = JSON.parse(read('seo-manifest.json'));
const origin = new URL(routes[0].schema['@graph'][0].url).origin;
const preview = process.env.VERCEL_ENV === 'preview' || process.env.CAVERO_NOINDEX === '1';
const context = vm.createContext({});
for (const file of ['data.js','remove-royale.js','clean-images.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const families = vm.runInContext('families',context);
const defaults = Object.fromEntries(families.map(f => [f.key, f.defaultVariant || 0]));
const url = p => origin + p;
const byPath = new Map(routes.map(r => [r.pathname,r]));
const products = routes.filter(r => r.type === 'product');
const guide = routes.find(r => r.pathname === '/guias/como-escolher-um-relogio');
const faq = [
  ['Qual é a diferença entre um relógio de quartzo e um automático?', 'Um relógio de quartzo utiliza normalmente uma pilha. Um automático é mecânico e recebe energia do movimento do pulso. Confirma o movimento exato na ficha técnica do modelo.'],
  ['Como escolher o tamanho de um relógio?', 'Compara o diâmetro, a espessura e a distância entre asas com um relógio que já uses. O formato da caixa e o ajuste da bracelete também influenciam o conforto.'],
  ['Um relógio com visual desportivo pode ser usado na água?', 'O visual não confirma a resistência à água. Consulta a classificação e as instruções do fabricante; sem essa informação, evita expor o relógio à água.'],
  ['Que informações devo confirmar antes de comprar?', 'Verifica as dimensões, movimento, materiais, vidro, peso, ajuste da bracelete, garantia, entrega e devoluções. Se faltarem especificações, pede confirmação ao vendedor.']
];
for (const r of routes) {
  r.noindex = preview;
  const graph = r.schema['@graph'];
  const website = graph.find(x => x['@type'] === 'WebSite');
  if (website) delete website.potentialAction; // Google retired the sitelinks search box.
  if (r.type === 'product') {
    const group = graph.find(x => x['@type'] === 'ProductGroup');
    if (!group) throw Error('Missing ProductGroup: ' + r.pathname);
    group.hasVariant.forEach(v => {
      const index = Number(v.sku.split(':').at(-1));
      const variantUrl = url(r.pathname) + '?variant=' + index;
      v['@id'] = variantUrl + '#product';
      v.url = variantUrl;
      v.offers.url = variantUrl;
      v.offers.shippingDetails = { '@type':'OfferShippingDetails', shippingRate:{'@type':'MonetaryAmount',value:0,currency:'EUR'}, shippingDestination:{'@type':'DefinedRegion',addressCountry:'PT'} };
      delete v.offers.availability;
      delete v.offers.itemCondition;
      delete v.aggregateRating;
      delete v.review;
    });
    delete group.aggregateRating;
    delete group.review;
    r.defaultVariant = defaults[group.productGroupID] || 0;
  }
  if (r.pathname === '/') {
    const page = graph.find(x => x['@type'] === 'WebPage');
    if (page) page.mainEntity = {'@type':'ItemList',itemListElement:products.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.title,url:url(p.pathname)}))};
  }
  if (r === guide) {
    graph.push({'@type':'FAQPage','@id':url(r.pathname)+'#faq',mainEntity:faq.map(([question,answer])=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}))});
  }
}
const privatePages = [
  ['/checkout','Checkout | CAVERO Watches'],
  ['/checkout/confirmacao','Confirmação de encomenda | CAVERO Watches'],
  ['/pesquisar','Pesquisar relógios | CAVERO Watches']
];
for (const [pathname,title] of privatePages) {
  const r = {...routes[0],pathname,title,description:title, noindex:true, schema:{'@context':'https://schema.org','@graph':[{'@type':'WebPage',url:url(pathname),name:title,inLanguage:'pt-PT'}]}};
  routes.push(r); byPath.set(pathname,r);
}
function tag(html, attr, key, value) {
  const re = new RegExp('<meta\\s+'+attr+'="'+key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"[^>]*>','i');
  const markup = '<meta '+attr+'="'+key+'" content="'+esc(value)+'">';
  return re.test(html) ? html.replace(re,markup) : html.replace('</head>',markup+'\n</head>');
}
function head(html,r) {
  html = html.replace(/<title>[\s\S]*?<\/title>/i,'<title>'+esc(r.title)+'</title>');
  html = tag(html,'name','description',r.description);
  html = tag(html,'name','robots',r.noindex?'noindex,follow':'index,follow,max-image-preview:large');
  html = tag(html,'property','og:title',r.title);
  html = tag(html,'property','og:description',r.description);
  html = tag(html,'property','og:url',url(r.pathname));
  html = tag(html,'property','og:type',r.type==='product'?'product':'website');
  html = tag(html,'property','og:image',r.image);
  html = tag(html,'name','twitter:title',r.title);
  html = tag(html,'name','twitter:description',r.description);
  html = tag(html,'name','twitter:image',r.image);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i,'<link rel="canonical" href="'+esc(url(r.pathname))+'">');
  html = html.replace(/<script\s+type="application\/ld\+json"\s+id="cavero-structured-data">[\s\S]*?<\/script>/i,'<script type="application/ld+json" id="cavero-structured-data">'+safeJSON(r.schema)+'</script>');
  return html;
}
const homeHeading = 'Relógios masculinos com presença. CAVERO Watches.';
const intro = isHome => '<section class="seo-home-intro"><'+(isHome?'h1':'h2')+' id="homeSeoHeading">'+homeHeading+'</'+(isHome?'h1':'h2')+'><p>Descobre relógios clássicos, cronógrafos e modelos desportivos. Explora a coleção CAVERO, compara acabamentos e encontra o relógio que combina contigo.</p></section>';
const editorial = '<div class="seo-editorial-links"><a href="/guias/como-escolher-um-relogio">Guia: como escolher um relógio</a><a href="/catalogo">Ver todos os relógios</a></div>';
function assets(html) {
  return html.replace(/\b(src|href)=(['"])([^'"]+)\2/g,(all,attr,quote,value)=>{
    if (/^(?:[a-z][a-z0-9+.-]*:|\/|#|\?|\/\/)/i.test(value)) return all;
    return attr+'='+quote+'/'+value.replace(/^\.\//,'')+quote;
  });
}
function common(html,r) {
  html = head(html,r);
  html = html.replace(/<h1\b([^>]*\bid="premiumHeroTitle"[^>]*)>([\s\S]*?)<\/h1>/i,'<h2$1>$2</h2>');
  html = html.replace('<main id="homeView">','<main id="homeView">\n'+intro(r.pathname==='/'));
  html = html.replace(/<a href="#destaques">Destaques<\/a>/,'<a href="/#destaques">Destaques</a>')
    .replace(/<a href="#sobre">Sobre nós<\/a>/,'<a href="/sobre-nos">Sobre nós</a>')
    .replace(/<a href="#faq">Perguntas frequentes<\/a>/,'<a href="/#faq">Perguntas frequentes</a>');
  html = html.replace(/(<\/footer>)/i,editorial+'\n$1');
  html = html.replace('<script src="/seo-client.js" defer></script>','<script src="/seo-data.js" defer></script>\n<script src="/seo-client.js" defer></script>');
  return assets(html);
}
function standalone(r, body) {
  const base = '<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title></title><link rel="canonical" href="'+url(r.pathname)+'"><link rel="stylesheet" href="/seo.css"></head><body><div id="seo-prerender">'+body+'</div></body></html>';
  return head(base,r);
}
function sourceFile(pathname) { return pathname==='/'?'index.html':pathname.slice(1)+'/index.html'; }
for (const r of routes) {
  const file = sourceFile(r.pathname);
  let html = read(file);
  if (r === guide) {
    const start = html.indexOf('<div id="seo-prerender">');
    const end = html.indexOf('<div class="top">',start);
    if (start<0 || end<0) throw Error('Guide prerender missing');
    let body = html.slice(start,end).trim().replace(/^<div id="seo-prerender">/,'').replace(/<\/div>\s*$/,'');
    const faqBody = '<section id="perguntas-frequentes"><h2>Perguntas frequentes sobre relógios</h2>'+faq.map(([q,a])=>'<details><summary>'+esc(q)+'</summary><p>'+esc(a)+'</p></details>').join('')+'</section>';
    body = body.replace('</main>',faqBody+'</main>');
    body = body.replace(/(<\/footer>)/i,editorial+'\n$1');
    html = standalone(r,body);
  } else {
    html = common(html,r);
    if (r.pathname === '/') {
      const cards = products.map(p=>'<a class="seo-home-card" href="'+p.pathname+'"><img src="'+esc(p.image)+'" alt="'+esc(p.title)+'" loading="lazy"><span>'+esc(p.title)+'</span></a>').join('');
      html = html.replace('<div class="featured-grid" id="featuredGrid"></div>','<div class="featured-grid" id="featuredGrid">'+cards+'</div>');
    }
  }
  write(file,html);
}
const errorRoute = {pathname:'/404',title:'Página não encontrada | CAVERO Watches',description:'Encontra o relógio que procuras na coleção CAVERO Watches.',image:routes[0].image,type:'website',noindex:true,schema:{'@context':'https://schema.org','@type':'WebPage',name:'Página não encontrada'}};
write('404.html',standalone(errorRoute,'<header class="seo-header"><a class="seo-brand" href="/">CAVERO <small>WATCHES</small></a><nav><a href="/catalogo">Catálogo</a><a href="/sobre-nos">Sobre nós</a></nav></header><main><p class="seo-kicker">ERRO 404</p><h1>Esta página não foi encontrada.</h1><p>O endereço pode ter sido alterado ou já não estar disponível. Pesquisa um modelo ou continua a explorar a coleção CAVERO.</p><form action="/pesquisar" method="get" class="seo-search-form"><label for="seo404search">Pesquisar na loja</label><div><input id="seo404search" name="q" type="search" placeholder="Modelo, cor ou acabamento" required><button type="submit">Pesquisar</button></div></form><p><a class="seo-action" href="/catalogo">Ver catálogo</a> <a href="/">Voltar à página inicial</a></p></main><footer class="seo-footer"><a href="/">CAVERO Watches</a><p>Relógios para diferentes estilos.</p></footer>'));
write('seo-manifest.json',safeJSON(routes));
write('seo-data.js','window.CAVERO_SEO='+safeJSON({origin,routes,defaults})+';');
const listed = routes.filter(r=>!r.noindex);
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+listed.map(r=>'  <url><loc>'+esc(url(r.pathname))+'</loc></url>').join('\n')+'\n</urlset>\n');
write('robots.txt',preview?'User-agent: *\nDisallow: /\n':'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /checkout\nDisallow: /pesquisar\nSitemap: '+url('/sitemap.xml')+'\n');
fs.appendFileSync(path.join(out,'seo.css'),'\n.seo-home-intro{max-width:1160px;margin:0 auto;padding:28px 24px 14px}.seo-home-intro h1,.seo-home-intro h2{font-size:clamp(25px,3vw,38px);line-height:1.2;margin:0 0 12px}.seo-home-intro p{max-width:70ch;line-height:1.6;margin:0}.seo-home-card{display:block;text-decoration:none;color:inherit}.seo-home-card img{width:100%;aspect-ratio:1;object-fit:cover}.seo-home-card span{display:block;padding:12px}.seo-editorial-links{display:flex;gap:20px;flex-wrap:wrap;padding:16px 24px;font-size:13px}.seo-search-form{max-width:600px;margin:30px 0}.seo-search-form label{display:block;margin-bottom:8px}.seo-search-form>div{display:flex;gap:8px;flex-wrap:wrap}.seo-search-form input{flex:1;min-width:180px;padding:13px;border:1px solid #aaa;border-radius:4px}.seo-search-form button{padding:13px 20px;background:#24231f;color:#fff;border:0;border-radius:4px;cursor:pointer}#seo-prerender details{padding:14px 0;border-bottom:1px solid #ddd}#seo-prerender summary{cursor:pointer;font-weight:600}\n');
console.log('SEO finalized: '+listed.length+' indexable routes, '+products.length+' product families, '+(preview?'preview blocked':'production crawl enabled')+'.');