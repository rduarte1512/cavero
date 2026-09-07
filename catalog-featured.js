// Featured homepage selection focused on visually distinctive, conversion-friendly models.
renderFeatured = function(){
  const chosen=['velocity','apex','chronos'];
  const available=chosen.map(key=>familyMap.get(key)).filter(Boolean);
  const grid=document.getElementById('featuredGrid');
  if(!grid) return;
  grid.innerHTML=available.map(f=>{
    const v=cleanVariant(f,f.defaultVariant);
    return `<article class="featured" onclick="openProduct('${f.key}')">
      <div class="media"><span class="sale-badge">-${discountPct(v)}%</span><img src="${f.cleanImage||v.image}" alt="${f.name} ${v.name}" loading="lazy"></div>
      <div class="body"><p>${f.variants.length} acabamentos disponíveis</p><h3><a href="/${f.key==='chronos'?'cavero-chronos-ice':'cavero-'+f.key}" onclick="event.stopPropagation()">${f.name}</a></h3>${priceBlock(v,true)}<button class="mini">Explorar modelo →</button></div>
    </article>`;
  }).join('');
};

