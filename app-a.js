document.getElementById('heroImage').src=window.CAVERO_IMAGES['royale'];

const money=n=>new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(n);
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const familyMap=new Map(families.map(f=>[f.key,f]));
let activeFamily=null;
let activeVariantIndex=0;

const colorDefs={
'azul gelo':['#a9e2ff',198,.58,1.05],'azul claro':['#7fc8ff',205,.72,1.03],'azul céu':['#73c9ff',198,.72,1.03],'azul':['#3b6eff',218,.85,.96],
'verde esmeralda':['#009b70',155,.9,.88],'verde':['#2eaf62',138,.85,.9],'preto':['#22252b',0,.05,.38],'branco':['#f5f7fa',0,.03,1.15],
'prateado':['#b9c2cd',210,.07,1.0],'dourado':['#c9a03b',45,.75,.92],'rose gold':['#d0917d',15,.55,.98],'vermelho':['#d34855',355,.85,.9],
'rosa':['#ed7bb5',330,.7,1.02],'amarelo claro':['#f3dc84',52,.55,1.08],'amarelo':['#ecc641',50,.75,1.0],'castanho':['#946541',27,.6,.75],
'café':['#815739',25,.55,.7],'cinza claro':['#d4d7dd',210,.04,1.05],'cinza escuro':['#62676e',210,.05,.62],'cinza':['#9fa5ad',210,.04,.85],
'meteorito':['#7b828c',210,.05,.72],'laranja':['#ec8434',25,.8,.96],'multicor':['#9a76da',280,.72,.95]
};

function getColors(v){
  const t=v.toLowerCase();
  const keys=['azul gelo','azul claro','azul céu','verde esmeralda','rose gold','amarelo claro','cinza claro','cinza escuro','dourado','prateado','preto','branco','verde','azul','rosa','vermelho','amarelo','castanho','café','cinza','meteorito','laranja','multicor'];
  let a=[];keys.forEach(k=>{if(t.includes(k)&&!a.includes(k))a.push(k)});
  if(t.includes('inox')||t.includes('aço'))a.push('prateado');
  if(t.includes('panda'))a.push('branco','preto');
  if(t.includes('bicolor'))a.push('dourado','prateado');
  return [...new Set(a)].slice(0,3).length?[...new Set(a)].slice(0,3):['prateado'];
}
function swatches(v){return getColors(v).map(k=>`<span class="swatch" style="background:${(colorDefs[k]||['#bbb'])[0]}"></span>`).join('')}
function rgb2hsv(r,g,b){r/=255;g/=255;b/=255;let mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360}return[h,mx?d/mx:0,mx]}
function hsv2rgb(h,s,v){let c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c,r=0,g=0,b=0;if(h<60)[r,g,b]=[c,x,0];else if(h<120)[r,g,b]=[x,c,0];else if(h<180)[r,g,b]=[0,c,x];else if(h<240)[r,g,b]=[0,x,c];else if(h<300)[r,g,b]=[x,0,c];else[r,g,b]=[c,0,x];return[(r+m)*255,(g+m)*255,(b+m)*255]}

function variantId(key,index){return key+':'+index}
function variantProduct(key,index){
  const f=familyMap.get(key);if(!f)return null;
  const safe=Math.max(0,Math.min(Number(index)||0,f.variants.length-1));
  return {id:variantId(key,safe),familyKey:key,familyName:f.name,variantIndex:safe,variant:f.variants[safe],price:f.price,base:f.base,desc:f.desc};
}
function productFromCartId(id){
  if(!id)return null;
  if(id.includes(':')){const [key,i]=id.split(':');return variantProduct(key,Number(i)||0)}
  const old=id.match(/^(.+)-(\d+)$/);if(old)return variantProduct(old[1],Math.max(0,(Number(old[2])||1)-1));
  return null;
}

const imgCache=new Map();
function makeVariantImage(family,index,thumbSize=0){
  const f=typeof family==='string'?familyMap.get(family):family;if(!f)return Promise.resolve('');
  const safe=Math.max(0,Math.min(Number(index)||0,f.variants.length-1));
  if(safe===f.defaultVariant)return Promise.resolve(f.base);
  const variant=f.variants[safe],cacheKey=`${f.key}:${safe}@${thumbSize||'full'}`;
  if(imgCache.has(cacheKey))return Promise.resolve(imgCache.get(cacheKey));
  return new Promise(resolve=>{
    const im=new Image();
    im.onload=()=>{
      const side=Math.min(im.naturalWidth||im.width,im.naturalHeight||im.height);
      const size=thumbSize?Math.min(thumbSize,side):side;
      const c=document.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});
      c.width=size;c.height=size;x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
      const scale=Math.max(size/im.width,size/im.height),dw=im.width*scale,dh=im.height*scale;
      x.drawImage(im,(size-dw)/2,(size-dh)/2,dw,dh);
      const d=x.getImageData(0,0,size,size),a=d.data,colors=getColors(variant),defs=colors.map(k=>colorDefs[k]||colorDefs.prateado),cx=size/2,cy=size*.47;
      for(let yy=0;yy<size;yy++)for(let xx=0;xx<size;xx++){
        const i=(yy*size+xx)*4;let [h,s,v]=rgb2hsv(a[i],a[i+1],a[i+2]);
        const dx=(xx-cx)/size,dy=(yy-cy)/size,rad=Math.sqrt(dx*dx+dy*dy);let di=defs.length>1&&rad<.23?1:0;if(defs.length>2&&rad>.36)di=2;
        const def=defs[Math.min(di,defs.length-1)],targetH=def[1],sat=def[2],valMul=def[3];
        if(s>.12&&v>.15){h=h*.12+targetH*.88;s=Math.min(1,s*.28+sat*.72);v=Math.min(1,v*valMul);const q=hsv2rgb(h,s,v);a[i]=q[0];a[i+1]=q[1];a[i+2]=q[2]}
        else if(colors.includes('preto')){a[i]*=.78;a[i+1]*=.78;a[i+2]*=.78}
        else if(colors.includes('branco')){const avg=(a[i]+a[i+1]+a[i+2])/3;a[i]=a[i]*.45+avg*.55;a[i+1]=a[i+1]*.45+avg*.55;a[i+2]=a[i+2]*.45+avg*.55}
      }
      x.putImageData(d,0,0);const url=thumbSize?c.toDataURL('image/jpeg',.95):c.toDataURL('image/png');imgCache.set(cacheKey,url);resolve(url);
    };
    im.onerror=()=>resolve(f.base);im.src=f.base;
  });
}
function setVariantImage(el,family,index,thumbSize=0){if(!el)return;makeVariantImage(family,index,thumbSize).then(src=>{if(src)el.src=src})}

function renderFeatured(){
  const chosen=['royale','velocity','prestige'];
  $('#featuredGrid').innerHTML=chosen.map(key=>{const f=familyMap.get(key);return `<article class="featured" onclick="openProduct('${f.key}')"><div class="media"><img src="${f.base}" alt="${f.name}"></div><div class="body"><p>${f.variants.length} variações disponíveis</p><h3>${f.name}</h3><div class="price">${money(f.price)}</div><button class="mini">Explorar modelo →</button></div></article>`}).join('');
}
function renderFilters(){const el=$('#filters');if(el)el.innerHTML=''}
function renderProducts(){
  $('#productCount').textContent=families.length+' modelos';
  $('#grid').innerHTML=families.map(f=>`<article class="product family-card" onclick="openProduct('${f.key}')"><div class="product-media"><span class="tag">${f.variants.length} VARIAÇÕES</span><img src="${f.base}" alt="${f.name}"></div><div class="info"><div class="variant">Escolhe a tua variante dentro deste modelo</div><h3>${f.name}</h3><div class="family-swatches">${f.variants.slice(0,5).map(v=>`<span class="variant-colors">${swatches(v)}</span>`).join('')}</div><div class="info-foot"><div class="price">${money(f.price)}</div><button class="mini">Ver modelo →</button></div></div></article>`).join('');
}
function showHome(){$('#homeView').classList.remove('hidden');$('#productView').classList.add('hidden');$('#checkoutView').classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'})}
$('#homeLogo').onclick=e=>{e.preventDefault();showHome()};

function renderVariantButtons(f){
  return f.variants.map((variant,i)=>`<button class="variant-option ${i===activeVariantIndex?'active':''}" data-variant-index="${i}" onclick="selectVariant(${i})"><span class="variant-thumb-wrap"><img class="variant-thumb" data-thumb-index="${i}" src="${f.base}" alt="${variant}"></span><span class="variant-option-copy"><b>${variant}</b><small>${swatches(variant)}</small></span></button>`).join('');
}
window.openProduct=key=>{
  const f=familyMap.get(key);if(!f)return;
  activeFamily=f;activeVariantIndex=f.defaultVariant||0;
  $('#homeView').classList.add('hidden');$('#checkoutView').classList.add('hidden');const v=$('#productView');v.classList.remove('hidden');
  v.innerHTML=`<div class="product-page"><div><button class="back" onclick="showHome()">← Voltar à coleção</button><div class="bigmedia"><img id="bigProductImage" src="${f.base}" alt="${f.name}"></div></div><div class="detail"><div class="eyebrow">${f.name}</div><h1>${f.name}</h1><h2 id="selectedVariantName">${f.variants[activeVariantIndex]}</h2><div class="bigprice">${money(f.price)}</div><p class="desc">${f.desc}</p><div class="variant-heading"><b>Escolhe a variante</b><span id="selectedVariantRef">Ref. ${variantId(f.key,activeVariantIndex).toUpperCase()}</span></div><div class="variant-list" id="variantList">${renderVariantButtons(f)}</div><div class="buyrow"><input class="qty" id="qty" type="number" min="1" value="1"><button class="btn dark" onclick="addSelectedVariant()">Adicionar ao saco</button></div><div class="micro"><span>✓ A imagem muda ao selecionar cada variante</span><span>✓ A variante escolhida é guardada no carrinho</span><span>✓ Checkout sem sair da CAVERO</span></div></div></div>`;
  setVariantImage($('#bigProductImage'),f,activeVariantIndex,0);
  f.variants.forEach((_,i)=>setVariantImage(document.querySelector(`[data-thumb-index="${i}"]`),f,i,140));
  window.scrollTo(0,0);
};
window.selectVariant=index=>{
  if(!activeFamily)return;activeVariantIndex=Math.max(0,Math.min(Number(index)||0,activeFamily.variants.length-1));
  $$('.variant-option').forEach((b,i)=>b.classList.toggle('active',i===activeVariantIndex));
  $('#selectedVariantName').textContent=activeFamily.variants[activeVariantIndex];
  $('#selectedVariantRef').textContent='Ref. '+variantId(activeFamily.key,activeVariantIndex).toUpperCase();
  setVariantImage($('#bigProductImage'),activeFamily,activeVariantIndex,0);
};
window.addSelectedVariant=()=>{if(!activeFamily)return;addCart(variantId(activeFamily.key,activeVariantIndex),Math.max(1,+$('#qty').value||1))};
