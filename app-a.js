const money = n => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(Number(n)||0);
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const familyMap = new Map(families.map(f => [f.key,f]));
let activeFamily = null;
let activeVariantIndex = 0;
let activeGalleryIndex = 0;

const colorMap = {
  'azul gelo':'#a9e2ff','azul claro':'#7fc8ff','azul céu':'#73c9ff','azul':'#316ec9',
  'verde esmeralda':'#008f68','verde':'#228b55','preto':'#252525','branco':'#f4f4f1',
  'prateado':'#bac1c8','dourado':'#c7a34b','rose gold':'#c88c78','vermelho':'#c94048',
  'rosa':'#e989b7','amarelo claro':'#ead889','amarelo':'#e1bd3e','castanho':'#8d6548',
  'café':'#76523b','cinza claro':'#d3d6da','cinza escuro':'#61656b','cinzento':'#989da4',
  'cinza':'#989da4','meteorito':'#747a83','laranja':'#df7b36','multicor':'linear-gradient(135deg,#7d68db,#52b9d7,#e5878e)'
};

function getColors(label=''){
  const t=label.toLowerCase();
  const keys=['azul gelo','azul claro','azul céu','verde esmeralda','rose gold','amarelo claro','cinza claro','cinza escuro','dourado','prateado','preto','branco','verde','azul','rosa','vermelho','amarelo','castanho','café','cinzento','cinza','meteorito','laranja','multicor'];
  const found=[]; keys.forEach(k=>{if(t.includes(k)&&!found.includes(k))found.push(k)});
  if(t.includes('inox')||t.includes('aço'))found.push('prateado');
  if(t.includes('panda'))found.push('branco','preto');
  if(t.includes('bicolor'))found.push('dourado','prateado');
  if(t.includes('transpar'))found.push('branco');
  return [...new Set(found)].slice(0,3).length ? [...new Set(found)].slice(0,3) : ['prateado'];
}
function swatches(label){return getColors(label).map(k=>`<span class="swatch" style="background:${colorMap[k]||'#bbb'}"></span>`).join('')}
function discountPct(v){return v.compareAt>v.price ? Math.round((1-v.price/v.compareAt)*100) : 0}
function savings(v){return Math.max(0,(v.compareAt||v.price)-v.price)}
function variantId(key,index){return `${key}:${index}`}
function cleanVariant(f,index){return f.variants[Math.max(0,Math.min(Number(index)||0,f.variants.length-1))]}
function variantProduct(key,index){
  const f=familyMap.get(key); if(!f)return null;
  const safe=Math.max(0,Math.min(Number(index)||0,f.variants.length-1));
  const v=f.variants[safe];
  return {id:variantId(key,safe),familyKey:key,familyName:f.name,subtitle:f.subtitle,variantIndex:safe,variant:v.name,price:v.price,compareAt:v.compareAt,image:v.image,desc:f.desc};
}
function productFromCartId(id){
  if(!id)return null;
  if(id.includes(':')){const [key,i]=id.split(':');return variantProduct(key,Number(i)||0)}
  const old=id.match(/^(.+)-(\d+)$/); if(old)return variantProduct(old[1],Math.max(0,(Number(old[2])||1)-1));
  return null;
}
function minVariant(f){return f.variants.reduce((a,b)=>b.price<a.price?b:a,f.variants[0])}
function galleryFor(f,index){
  const v=cleanVariant(f,index);
  return [v.image,...f.gallery].filter((url,i,a)=>url&&a.indexOf(url)===i);
}
function selectedVariant(){return activeFamily?cleanVariant(activeFamily,activeVariantIndex):null}

const royale=familyMap.get('royale');
if(royale){
  const rv=cleanVariant(royale,royale.defaultVariant);
  const hero=$('#heroImage'); if(hero)hero.src=rv.image;
  const heroBadge=document.querySelector('.hero-badge');
  if(heroBadge)heroBadge.innerHTML=`<small>DESTAQUE · -${discountPct(rv)}%</small><b>${royale.name}</b><span><s>${money(rv.compareAt)}</s> <strong>${money(rv.price)}</strong></span>`;
}

function priceBlock(v,compact=false){
  const pct=discountPct(v);
  return `<div class="price-stack ${compact?'compact':''}">
    <div><span class="current-price">${money(v.price)}</span>${v.compareAt>v.price?` <span class="compare-price">${money(v.compareAt)}</span>`:''}</div>
    ${pct?`<div class="saving-line">Poupa ${money(savings(v))} · <b>-${pct}%</b></div>`:''}
  </div>`;
}

function renderFeatured(){
  const chosen=['royale','velocity','prestige'];
  $('#featuredGrid').innerHTML=chosen.map(key=>{
    const f=familyMap.get(key),v=cleanVariant(f,f.defaultVariant);
    return `<article class="featured" onclick="openProduct('${f.key}')">
      <div class="media"><span class="sale-badge">-${discountPct(v)}%</span><img src="${v.image}" alt="${f.name} ${v.name}" loading="lazy"></div>
      <div class="body"><p>${f.variants.length} acabamentos disponíveis</p><h3>${f.name}</h3>${priceBlock(v,true)}<button class="mini">Explorar modelo →</button></div>
    </article>`;
  }).join('');
}
function renderFilters(){const el=$('#filters');if(el)el.innerHTML=''}
function renderProducts(){
  $('#productCount').textContent=families.length+' modelos';
  $('#grid').innerHTML=families.map(f=>{
    const v=cleanVariant(f,f.defaultVariant),min=minVariant(f);
    return `<article class="product family-card" onclick="openProduct('${f.key}')">
      <div class="product-media"><span class="tag">${f.variants.length} VARIANTES</span><span class="sale-badge">-${discountPct(v)}%</span><img src="${v.image}" alt="${f.name} ${v.name}" loading="lazy"></div>
      <div class="info"><div class="variant">${f.subtitle}</div><h3>${f.name}</h3>
      <div class="family-swatches">${f.variants.slice(0,7).map(x=>`<span class="variant-colors">${swatches(x.name)}</span>`).join('')}${f.variants.length>7?`<span class="more-variants">+${f.variants.length-7}</span>`:''}</div>
      <div class="info-foot"><div><small class="from-label">Desde</small>${priceBlock(min,true)}</div><button class="mini">Ver modelo →</button></div></div>
    </article>`;
  }).join('');
}
function showHome(){
  $('#homeView').classList.remove('hidden');$('#productView').classList.add('hidden');$('#checkoutView').classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'});
}
$('#homeLogo').onclick=e=>{e.preventDefault();showHome()};

function galleryMarkup(f,index){
  const imgs=galleryFor(f,index);
  return `<div class="gallery-wrap">
    <div class="thumb-rail" id="thumbRail">${imgs.map((src,i)=>`<button class="gallery-thumb ${i===0?'active':''}" onclick="selectGalleryImage(${i})"><img src="${src}" alt="${f.name} imagem ${i+1}" loading="lazy"></button>`).join('')}</div>
    <div class="main-photo"><button class="zoom-button" onclick="openLightbox(document.getElementById('bigProductImage').src)" aria-label="Ampliar imagem">⌕ Ampliar</button><img id="bigProductImage" src="${imgs[0]}" alt="${f.name}"></div>
  </div>`;
}
function variantButtons(f){
  return f.variants.map((v,i)=>`<button class="variant-option ${i===activeVariantIndex?'active':''}" data-variant-index="${i}" onclick="selectVariant(${i})">
    <span class="variant-thumb-wrap"><img class="variant-thumb" src="${v.image}" alt="${v.name}" loading="lazy"></span>
    <span class="variant-option-copy"><b>${v.name}</b><small class="variant-price-mini">${money(v.price)} ${v.compareAt>v.price?`<s>${money(v.compareAt)}</s>`:''}</small></span>
  </button>`).join('');
}
function promoPanel(v){
  const pct=discountPct(v);
  return `<div class="promo-panel">
    <div class="promo-kicker">PREÇO ESPECIAL CAVERO</div>
    <div class="product-price-row"><span class="product-current">${money(v.price)}</span>${v.compareAt>v.price?`<span class="product-old">${money(v.compareAt)}</span>`:''}${pct?`<span class="discount-pill">-${pct}%</span>`:''}</div>
    ${pct?`<div class="promo-saving">Poupa <strong>${money(savings(v))}</strong> nesta variante.</div>`:''}
  </div>`;
}
function freeShippingBanner(){return `<div class="free-shipping-banner"><div class="free-shipping-icon">✓</div><div><strong>ENVIO GRÁTIS</strong><span>Portes a <b>0,00 €</b> na tua encomenda.</span></div></div>`}
function productBenefits(){return `<div class="product-benefits"><div><b>Pagamento simples</b><span>Cartão e MB WAY no checkout.</span></div><div><b>Escolha guardada</b><span>O teu carrinho permanece neste dispositivo.</span></div><div class="free-benefit"><b>Envio grátis</b><span>Sem custos de envio na encomenda.</span></div></div>`}
function relatedMarkup(currentKey){
  const items=families.filter(f=>f.key!==currentKey).slice(0,3);
  return `<section class="related-section"><div class="eyebrow">OUTROS CAVERO</div><h2>Também podes gostar</h2><div class="related-grid">${items.map(f=>{const v=cleanVariant(f,f.defaultVariant);return `<article onclick="openProduct('${f.key}')"><img src="${v.image}" alt="${f.name}" loading="lazy"><div><b>${f.name}</b><span>${money(v.price)}</span></div></article>`}).join('')}</div></section>`;
}
window.openProduct=key=>{
  const f=familyMap.get(key);if(!f)return;
  activeFamily=f;activeVariantIndex=f.defaultVariant||0;activeGalleryIndex=0;
  const v=selectedVariant();
  $('#homeView').classList.add('hidden');$('#checkoutView').classList.add('hidden');const view=$('#productView');view.classList.remove('hidden');
  view.innerHTML=`<div class="product-shell">
    <div class="product-breadcrumb"><button onclick="showHome()">Coleção</button><span>›</span><b>${f.name}</b></div>
    <div class="product-page">
      <div class="gallery-column">${galleryMarkup(f,activeVariantIndex)}</div>
      <div class="detail">
        <div class="eyebrow">CAVERO WATCHES · PORTUGAL</div><h1>${f.name}</h1><p class="product-subtitle">${f.subtitle}</p>
        <div id="promoPanel">${promoPanel(v)}</div>
        ${freeShippingBanner()}
        <p class="desc">${f.desc}</p>
        <div class="variant-heading"><b>Escolhe o acabamento</b><span id="selectedVariantRef">Ref. ${variantId(f.key,activeVariantIndex).toUpperCase()}</span></div>
        <div class="selected-variant-line">Selecionado: <strong id="selectedVariantName">${v.name}</strong></div>
        <div class="variant-list" id="variantList">${variantButtons(f)}</div>
        <div class="buyrow"><input class="qty" id="qty" type="number" min="1" value="1"><button class="btn dark add-main" onclick="addSelectedVariant()">Adicionar ao saco · <span id="addPrice">${money(v.price)}</span></button></div>
        <div class="buy-shipping-note">✓ Envio grátis incluído — não pagas portes.</div>
        ${productBenefits()}
        <div class="product-accordions"><details open><summary>Sobre este modelo</summary><p>${f.desc}</p></details><details><summary>Imagens e variantes</summary><p>Cada acabamento tem uma fotografia própria. Seleciona uma variante acima para veres a imagem correspondente em grande.</p></details><details><summary>Pagamento e entrega</summary><p><strong>Envio grátis.</strong> Os portes são 0,00 € na encomenda. O checkout está preparado para cartão e MB WAY.</p></details></div>
      </div>
    </div>
    ${relatedMarkup(f.key)}
  </div>`;
  window.scrollTo(0,0);
};
window.selectVariant=index=>{
  if(!activeFamily)return;
  activeVariantIndex=Math.max(0,Math.min(Number(index)||0,activeFamily.variants.length-1));activeGalleryIndex=0;
  const v=selectedVariant();
  $$('.variant-option').forEach((b,i)=>b.classList.toggle('active',i===activeVariantIndex));
  $('#selectedVariantName').textContent=v.name;
  $('#selectedVariantRef').textContent='Ref. '+variantId(activeFamily.key,activeVariantIndex).toUpperCase();
  $('#promoPanel').innerHTML=promoPanel(v);$('#addPrice').textContent=money(v.price);
  const col=document.querySelector('.gallery-column');if(col)col.innerHTML=galleryMarkup(activeFamily,activeVariantIndex);
};
window.selectGalleryImage=index=>{
  if(!activeFamily)return;const imgs=galleryFor(activeFamily,activeVariantIndex);activeGalleryIndex=Math.max(0,Math.min(Number(index)||0,imgs.length-1));
  const img=$('#bigProductImage');if(img){img.classList.add('changing');setTimeout(()=>{img.src=imgs[activeGalleryIndex];img.classList.remove('changing')},90)}
  $$('.gallery-thumb').forEach((b,i)=>b.classList.toggle('active',i===activeGalleryIndex));
};
window.addSelectedVariant=()=>{if(!activeFamily)return;addCart(variantId(activeFamily.key,activeVariantIndex),Math.max(1,+$('#qty').value||1))};
window.openLightbox=src=>{
  let lb=$('#imageLightbox');
  if(!lb){lb=document.createElement('div');lb.id='imageLightbox';lb.className='image-lightbox';lb.innerHTML='<button class="lightbox-close" aria-label="Fechar">×</button><img alt="Imagem ampliada">';document.body.appendChild(lb);lb.onclick=e=>{if(e.target===lb||e.target.classList.contains('lightbox-close'))lb.classList.remove('open')}}
  lb.querySelector('img').src=src;lb.classList.add('open');
};
