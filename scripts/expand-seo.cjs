/* Search landing pages use the same catalogue and prices as checkout. */
const fs = require('node:fs');
const path = require('node:path');
const out = path.join(__dirname, '..', 'dist');
const read = p => fs.readFileSync(path.join(out, p), 'utf8');
const write = (p, value) => { fs.mkdirSync(path.dirname(path.join(out,p)),{recursive:true}); fs.writeFileSync(path.join(out,p),value); };
const routes = JSON.parse(read('seo-manifest.json'));
const origin = new URL(routes[0].schema['@graph'][0].url).origin;
const preview = process.env.VERCEL_ENV === 'preview' || process.env.CAVERO_NOINDEX === '1';
const esc = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const json = v => JSON.stringify(v).replace(/</g,'\\u003c');
const money = v => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(v);
const products = routes.filter(r=>r.type==='product');
const group = r => r.schema['@graph'].find(x=>x['@type']==='ProductGroup');
const copy = {
  chronos: ['Chronos Ice — Relógio Cronógrafo | CAVERO', 'Descobre o CAVERO Chronos Ice e os seus acabamentos, incluindo azul gelo. Compara preços e escolhe a tua versão com envio gratuito para Portugal.'],
  ocean: ['Ocean — Relógio de Estilo Desportivo | CAVERO', 'Conhece o CAVERO Ocean: estética desportiva em versões masculinas e femininas. Escolhe a cor, consulta o preço e compra com envio gratuito para Portugal.'],
  velocity: ['Velocity — Relógio Cronógrafo Desportivo | CAVERO', 'Explora o CAVERO Velocity, um relógio de visual desportivo e marcante. Consulta os acabamentos e preços disponíveis. Envio gratuito para Portugal.'],
  prestige: ['Prestige — Relógio Masculino Clássico | CAVERO', 'Descobre o CAVERO Prestige, um relógio masculino de estilo clássico. Compara cores e acabamentos e escolhe o teu. Envio gratuito para Portugal.'],
  apex: ['Apex — Relógio Masculino Octogonal | CAVERO', 'Conhece o CAVERO Apex e o seu design octogonal. Vê as fotografias, compara acabamentos e escolhe a tua versão. Envio gratuito para Portugal.']
};
for(const r of products){
  const g=group(r); [r.title,r.description]=copy[g.productGroupID];
  g.description=r.description;
  for(const v of g.hasVariant){v.brand=g.brand;v.description=`${v.name}. ${r.description}`;}
  const breadcrumb=r.schema['@graph'].find(x=>x['@type']==='BreadcrumbList');
  breadcrumb.itemListElement=[['Início','/'],['Catálogo','/catalogo'],[g.name,r.pathname]].map(([name,p],i)=>({'@type':'ListItem',position:i+1,name,item:origin+p}));
}
const pages=[
 {pathname:'/relogios-desportivos',title:'Relógios de Estilo Desportivo | CAVERO',heading:'Relógios de estilo desportivo',description:'Compara os relógios CAVERO Ocean, Velocity e Apex: três designs de inspiração desportiva, vários acabamentos e envio gratuito para Portugal.',keys:['ocean','velocity','apex'],sections:[['Três estilos para looks casuais','O Ocean apresenta uma estética inspirada no mar; o Velocity aposta num visual de cronógrafo; o Apex distingue-se pelo formato octogonal. Compara as fotografias e escolhe o desenho que combina com o teu vestuário habitual.'],['Estilo desportivo e utilização na água','Esta seleção refere-se ao design. Não pressupõe funções de monitorização de treino nem aptidão para natação. Antes de expor um relógio à água, confirma a classificação e as instruções específicas do modelo.']]},
 {pathname:'/relogios-ate-100-euros',title:'Relógios até 100 € — Compara Acabamentos | CAVERO',heading:'Relógios até 100 €',description:'Descobre os acabamentos CAVERO até 100 €. Compara modelos e preços reais do catálogo e escolhe o teu relógio com envio gratuito para Portugal.',budget:100,sections:[['Escolhe pelo preço do acabamento','O preço pode variar entre cores e versões do mesmo modelo. Nesta página mostramos apenas acabamentos que custam até 100 €, com ligação direta à versão apresentada. Confirma o valor do acabamento selecionado na página do produto antes de encomendar.'],['O que comparar além do preço','Observa o desenho do mostrador e a bracelete e confirma as dimensões e o movimento antes de comprar. Consulta também as condições de envio e devolução para perceberes se a compra corresponde ao que procuras.']]},
 {pathname:'/guias/relogio-para-oferecer',title:'Como Escolher um Relógio para Oferecer | CAVERO',heading:'Como escolher um relógio para oferecer',description:'Escolhe um relógio para oferecer com atenção ao estilo, tamanho, orçamento e entrega. Compara os modelos CAVERO e consulta as condições antes da compra.',article:true,sections:[['Começa pelo estilo de quem recebe','Repara nos acessórios que a pessoa já usa: tons prateados ou dourados, mostradores discretos ou peças mais expressivas. Um relógio de estilo clássico como o Prestige pode combinar com roupa formal; Ocean, Velocity e Apex oferecem alternativas de estética desportiva.'],['Confirma o tamanho e o ajuste','Se conseguires, compara as dimensões com um relógio que a pessoa já utilize. O diâmetro não diz tudo: espessura, distância entre asas e ajuste da bracelete também contam. Quando faltarem medidas na ficha, pede confirmação antes de encomendar.'],['Define um orçamento para a versão concreta','Seleciona o acabamento antes de comparar o preço final. Dentro da mesma família, as versões podem ter valores diferentes. Na seleção até 100 € podes consultar diretamente os acabamentos dentro desse orçamento.'],['Planeia a entrega e uma possível devolução','Consulta a estimativa de entrega na política de envio e deixa margem para a data da oferta. Verifica as condições e o prazo de devolução antes da compra e guarda a confirmação da encomenda. Não assumes que a entrega numa data específica está garantida.']]}
];
const linkNav='<nav class="seo-editorial-links" aria-label="Explorar relógios e guias">'+pages.map(r=>`<a href="${r.pathname}">${esc(r.heading)}</a>`).join('')+products.map(r=>`<a href="${r.pathname}">${esc(group(r).name)}</a>`).join('')+'</nav>';
const card=(r,v)=>`<a class="seo-card" href="${r.pathname}${v?'?variant='+v.sku.split(':').at(-1):''}"><img src="${esc(v?.image[0]||r.image)}" alt="${esc(v?.name||group(r).name)}" width="480" height="480" loading="lazy" decoding="async"><span><strong>${esc(v?.name||group(r).name)}</strong><span>${v?'':'Desde '}${money(v?.offers.price??group(r).offers.lowPrice)}</span><small>Ver acabamentos e detalhes →</small></span></a>`;
for(const r of pages){
 r.image=routes[0].image;r.noindex=preview;r.type=r.article?'article':'website';
 const selected=products.filter(p=>!r.keys||r.keys.includes(group(p).productGroupID));
 const items=r.budget?selected.flatMap(p=>group(p).hasVariant.filter(v=>v.offers.price<=r.budget).map(v=>({p,v}))):selected.map(p=>({p}));
 const graph=[{'@type':r.article?'Article':'CollectionPage','@id':origin+r.pathname+'#page',url:origin+r.pathname,name:r.heading,headline:r.heading,description:r.description,inLanguage:'pt-PT',...(r.article?{author:{'@type':'Organization',name:'CAVERO Watches',url:origin},publisher:{'@type':'Organization',name:'CAVERO Watches',url:origin}}:{mainEntity:{'@type':'ItemList',itemListElement:items.map(({p,v},i)=>({'@type':'ListItem',position:i+1,name:v?.name||group(p).name,url:origin+p.pathname+(v?'?variant='+v.sku.split(':').at(-1):'')}))}})}, {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Início',item:origin+'/'},{'@type':'ListItem',position:2,name:r.heading,item:origin+r.pathname}]}];
 r.schema={'@context':'https://schema.org','@graph':graph};
 const body=`<header class="seo-header"><a class="seo-brand" href="/">CAVERO <small>WATCHES</small></a><nav><a href="/catalogo">Catálogo completo</a><a href="/sobre-nos">Sobre nós</a></nav></header><main><nav aria-label="Percurso"><a href="/">Início</a><span> / ${esc(r.heading)}</span></nav><h1>${esc(r.heading)}</h1><p>${esc(r.description)}</p>${r.sections.map(([h,p])=>`<section><h2>${esc(h)}</h2><p>${esc(p)}</p></section>`).join('')}<section><h2>${r.budget?'Acabamentos até 100 €':'Compara os modelos'}</h2><div class="seo-grid">${items.map(({p,v})=>card(p,v)).join('')}</div></section><p><a href="/guias/como-escolher-um-relogio">Guia completo de escolha de relógios</a> · <a href="/politica-de-envio">Envio</a> · <a href="/politica-de-devolucoes">Devoluções</a></p></main><footer class="seo-footer"><a href="/">CAVERO Watches</a>${linkNav}</footer>`;
 write(r.pathname.slice(1)+'.html',`<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/seo.css"></head><body><div id="seo-prerender">${body}</div></body></html>`);
 routes.push(r);
}
for(const r of routes){
 const file=r.pathname==='/'?'index.html':r.pathname.slice(1)+'.html';
 let html=read(file);
 html=html.replace(/<title>[\s\S]*?<\/title>/gi,'').replace(/<meta\s+(?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)"[^>]*>/gi,'');
 html=html.replace(/<script type="application\/ld\+json" id="cavero-structured-data">[\s\S]*?<\/script>/g,'');
 const tags=`<title>${esc(r.title)}</title><meta name="description" content="${esc(r.description)}"><meta property="og:title" content="${esc(r.title)}"><meta property="og:description" content="${esc(r.description)}"><meta name="twitter:title" content="${esc(r.title)}"><meta name="twitter:description" content="${esc(r.description)}"><script type="application/ld+json" id="cavero-structured-data">${json(r.schema)}</script>`;
 html=html.replace('</head>',tags+'</head>');
 if(pages.includes(r))html=html.replace('</head>',`<link rel="canonical" href="${origin+r.pathname}"><meta name="robots" content="${preview?'noindex,follow':'index,follow,max-image-preview:large'}"><meta property="og:url" content="${origin+r.pathname}"><meta property="og:type" content="${r.article?'article':'website'}"><meta property="og:image" content="${esc(r.image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${esc(r.image)}"></head>`);
 else html=html.replace(/<\/footer>/g,linkNav+'</footer>');
 if(r.type==='product')html=html.replace('class="seo-main-image"','class="seo-main-image" fetchpriority="high"');
 html=html.replace('id="premiumHeroImage"','id="premiumHeroImage" fetchpriority="high"');
 write(file,html);
}
const existing=JSON.parse(read('seo-data.js').replace(/^window.CAVERO_SEO=/,'').replace(/;$/,''));
existing.routes=routes.map(({sections,keys,budget,article,heading,...r})=>r);
write('seo-data.js','window.CAVERO_SEO='+json(existing)+';');
write('seo-manifest.json',json(existing.routes));
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'+routes.filter(r=>!r.noindex).map(r=>`<url><loc>${esc(origin+r.pathname)}</loc>${r.type==='product'?`<image:image><image:loc>${esc(r.image)}</image:loc></image:image>`:''}</url>`).join('')+'</urlset>');
// Let crawlers read the noindex directive on utility pages; APIs remain disallowed.
write('robots.txt',preview?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`);
fs.appendFileSync(path.join(out,'seo.css'),'\n.featured h3 a,.family-card h3 a,.related-grid a{color:inherit;text-decoration:none}.catalog-card-action{display:inline-block;text-decoration:none}.seo-card img{object-fit:cover;height:auto}.seo-editorial-links a:focus-visible{outline:2px solid currentColor;outline-offset:4px}\n');
console.log(`SEO expanded: ${pages.length} useful landing pages; product metadata and crawlable discovery updated.`);
