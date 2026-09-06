(() => {
  if(!document.querySelector('link[href="hero-visibility-fix.css"]')){
    const heroStyles=document.createElement('link');
    heroStyles.rel='stylesheet';
    heroStyles.href='hero-visibility-fix.css';
    document.head.appendChild(heroStyles);
  }

  const heroKeys = ['velocity','apex','chronos'];
  const heroCopy = {
    velocity: { kicker:'SPORT CHRONO · CAVERO', line:'Cronógrafo moderno, presença forte e um visual pensado para todos os dias.' },
    apex: { kicker:'DESIGN OCTOGONAL · CAVERO', line:'Geometria marcante, mostrador de presença e um perfil contemporâneo.' },
    chronos: { kicker:'CRONÓGRAFO DE PRESENÇA · CAVERO', line:'Um dos modelos mais expressivos da coleção, com acabamentos que elevam qualquer look.' }
  };

  const storeReviews = [
    {rating:5,text:'Foi a minha primeira compra na CAVERO e correu tudo muito bem. O processo foi simples, a encomenda chegou em boas condições e o relógio correspondeu às expectativas.'},
    {rating:5,text:'Gostei bastante da experiência de compra. O site é fácil de usar, os modelos estão bem apresentados e fiquei muito satisfeito com o produto que recebi.'},
    {rating:4,text:'A CAVERO surpreendeu-me pela positiva. Desde a compra até à entrega, tudo correu sem problemas e o relógio veio muito bem apresentado.'},
    {rating:5,text:'Já comprei noutras lojas online de relógios e esta foi das experiências mais simples que tive. O produto chegou bem acondicionado e exatamente como esperava.'},
    {rating:5,text:'Gostei da variedade de modelos e acabamentos disponíveis. Foi fácil encontrar um relógio que combinasse com o meu estilo e estou muito satisfeito com a escolha.'},
    {rating:4,text:'Encomendei sem conhecer muito a marca e fiquei bastante surpreendido. A apresentação do relógio é muito boa e no pulso ficou ainda melhor do que nas fotografias.'},
    {rating:5,text:'Compra rápida, site simples e produto muito bonito. A experiência foi positiva do início ao fim e provavelmente voltarei a comprar.'},
    {rating:5,text:'O que mais gostei foi da atenção aos detalhes. Desde a apresentação da loja até ao produto final, tudo transmite um cuidado que não estava à espera.'},
    {rating:4,text:'Comprei um relógio para oferecer e a experiência correu muito bem. A pessoa adorou e eu fiquei satisfeito com todo o processo de compra.'},
    {rating:5,text:'A CAVERO ficou definitivamente no meu radar. Gostei bastante do relógio, da variedade disponível e da facilidade de fazer a encomenda.'}
  ];

  const shortTitles = [
    'Primeira compra, experiência excelente',
    'Compra simples e produto à altura',
    'Surpreendeu pela positiva',
    'Das experiências mais simples que tive',
    'Foi fácil encontrar o meu estilo',
    'Ao vivo ainda melhor',
    'Experiência positiva do início ao fim',
    'Atenção aos detalhes',
    'Uma boa escolha para oferecer',
    'A CAVERO ficou no meu radar'
  ];

  const avg = storeReviews.reduce((sum,r)=>sum+r.rating,0) / storeReviews.length;
  const moneyLocal = n => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(Number(n)||0);
  const familyFor = key => typeof families !== 'undefined' ? families.find(f=>f.key===key) : null;
  const heroSlides = heroKeys.map(key=>familyFor(key)).filter(Boolean);
  let heroIndex = 0;
  let heroTimer = null;

  function heroVariant(f){
    const index = Number.isFinite(Number(f.defaultVariant)) ? Number(f.defaultVariant) : 0;
    return f.variants[index] || f.variants[0];
  }

  function renderHero(index, animate=true){
    if(!heroSlides.length) return;
    heroIndex=(index+heroSlides.length)%heroSlides.length;
    const f=heroSlides[heroIndex];
    const v=heroVariant(f);
    const img=document.getElementById('premiumHeroImage');
    const hero=document.getElementById('premiumHero');
    const title=document.getElementById('premiumHeroTitle');
    const kicker=document.getElementById('premiumHeroKicker');
    const sub=document.getElementById('premiumHeroSub');
    const price=document.getElementById('premiumHeroPrice');
    const dots=[...document.querySelectorAll('.hero-dot')];
    if(!img||!title) return;

    if(animate) img.classList.add('is-changing');
    setTimeout(()=>{
      const src=f.cleanImage || v.image;
      img.src=src;
      img.alt=f.name;
      if(hero) hero.style.setProperty('--hero-backdrop', `url("${src}")`);
      title.textContent=f.name;
      kicker.textContent=(heroCopy[f.key]||{}).kicker || 'CAVERO WATCHES';
      sub.textContent=(heroCopy[f.key]||{}).line || f.subtitle;
      if(price) price.textContent=`Desde ${moneyLocal(Math.min(...f.variants.map(x=>x.price)))}`;
      img.classList.remove('is-changing');
    },animate?170:0);
    dots.forEach((d,i)=>d.classList.toggle('active',i===heroIndex));
  }

  function resetHeroTimer(){
    clearInterval(heroTimer);
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    heroTimer=setInterval(()=>renderHero(heroIndex+1),6500);
  }

  function initHero(){
    if(!document.getElementById('premiumHero')) return;
    const dots=document.getElementById('heroDots');
    if(dots) dots.innerHTML=heroSlides.map((_,i)=>`<button class="hero-dot ${i===0?'active':''}" aria-label="Mostrar destaque ${i+1}" data-hero-index="${i}"></button>`).join('');
    document.getElementById('heroPrev')?.addEventListener('click',()=>{renderHero(heroIndex-1);resetHeroTimer()});
    document.getElementById('heroNext')?.addEventListener('click',()=>{renderHero(heroIndex+1);resetHeroTimer()});
    dots?.addEventListener('click',e=>{
      const btn=e.target.closest('[data-hero-index]');if(!btn)return;
      renderHero(Number(btn.dataset.heroIndex));resetHeroTimer();
    });
    document.getElementById('premiumHeroCta')?.addEventListener('click',()=>{
      const f=heroSlides[heroIndex];if(f && typeof window.openProduct==='function') window.openProduct(f.key);
    });
    renderHero(0,false);resetHeroTimer();
  }

  function reviewStars(rating){return '★'.repeat(rating)+'☆'.repeat(5-rating)}
  function initStoreReviews(){
    const track=document.getElementById('storeReviewTrack');if(!track)return;
    track.innerHTML=storeReviews.map((r,i)=>`<article class="store-review-card">
      <div class="store-review-stars" aria-label="${r.rating} em 5">${reviewStars(r.rating)}</div>
      <h3>${shortTitles[i]}</h3>
      <p>${r.text}</p>
      <div class="store-review-meta"><b>Cliente CAVERO</b><span class="verified-store">✓ Compra verificada</span></div>
    </article>`).join('');
    const avgEl=document.getElementById('storeReviewAverage');if(avgEl)avgEl.textContent=avg.toFixed(1).replace('.',',')+'/5';
    document.getElementById('reviewsPrev')?.addEventListener('click',()=>track.scrollBy({left:-360,behavior:'smooth'}));
    document.getElementById('reviewsNext')?.addEventListener('click',()=>track.scrollBy({left:360,behavior:'smooth'}));
  }

  function initCollectionTabs(){
    const cards=[...document.querySelectorAll('#grid .family-card')];
    if(!cards.length || typeof families==='undefined') return;
    cards.forEach((card,i)=>{if(families[i])card.dataset.familyKey=families[i].key});
    const groups={
      all: families.map(f=>f.key),
      sport:['ocean','velocity','apex'],
      elegant:['chronos','prestige'],
      statement:['chronos','velocity','apex']
    };
    const buttons=[...document.querySelectorAll('.collection-tab')];
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      const filter=btn.dataset.collectionFilter||'all';
      const allowed=groups[filter]||groups.all;
      buttons.forEach(b=>b.classList.toggle('active',b===btn));
      let visible=0;
      cards.forEach(card=>{
        const show=allowed.includes(card.dataset.familyKey);
        card.style.display=show?'':'none';if(show)visible++;
      });
      const count=document.getElementById('productCount');if(count)count.textContent=`${visible} ${visible===1?'modelo':'modelos'}`;
    }));
  }

  function initHomeAnchors(){
    document.querySelectorAll('header nav a[href^="#"], .home-end-cta a[href^="#"]').forEach(link=>{
      link.addEventListener('click',event=>{
        const selector=link.getAttribute('href');
        const target=selector ? document.querySelector(selector) : null;
        const home=document.getElementById('homeView');
        if(!target||!home||!home.classList.contains('hidden')) return;
        event.preventDefault();
        if(typeof window.showHome==='function') window.showHome();
        setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'start'}),80);
      });
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{
    initHero();
    initStoreReviews();
    initCollectionTabs();
    initHomeAnchors();
  });
})();
