// Featured section without CAVERO Royale.
renderFeatured = function(){
  const chosen=['velocity','prestige','apex'];
  const available=chosen.map(key=>familyMap.get(key)).filter(Boolean);
  const grid=document.getElementById('featuredGrid');
  if(!grid) return;
  grid.innerHTML=available.map(f=>{
    const v=cleanVariant(f,f.defaultVariant);
    return `<article class="featured" onclick="openProduct('${f.key}')">
      <div class="media"><span class="sale-badge">-${discountPct(v)}%</span><img src="${v.image}" alt="${f.name} ${v.name}" loading="lazy"></div>
      <div class="body"><p>${f.variants.length} acabamentos disponíveis</p><h3>${f.name}</h3>${priceBlock(v,true)}<button class="mini">Explorar modelo →</button></div>
    </article>`;
  }).join('');
};
