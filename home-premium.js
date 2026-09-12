(() => {
  if(!document.querySelector('link[href="hero-visibility-fix.css"]')){
    const heroStyles=document.createElement('link');
    heroStyles.rel='stylesheet';
    heroStyles.href='hero-visibility-fix.css';
    document.head.appendChild(heroStyles);
  }

  const heroKeys = ['velocity','apex','chronos'];
  const heroCopy = {
    velocity: { kicker:'SPORT CHRONO · CAVERO', line:'≈42 mm, bracelete metálica ajustável, 3 ATM e vários acabamentos para um perfil sport chrono.' },
    apex: { kicker:'DESIGN OCTOGONAL · CAVERO', line:'Caixa octogonal ≈42 mm, bracelete metálica ajustável e três acabamentos para uma escolha direta.' },
    chronos: { kicker:'CRONÓGRAFO · CAVERO', line:'≈40 mm, bracelete metálica ajustável, 3 ATM e a maior variedade de acabamentos da coleção.' }
  };

  const heroFacts = {
    velocity: ['≈ 42 mm','3 ATM','Bracelete ajustável'],
    apex: ['≈ 42 mm','3 acabamentos','Bracelete ajustável'],
    chronos: ['≈ 40 mm','3 ATM','Vários acabamentos']
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

  const customerNames = [
    'Miguel Ferreira',
    'João Martins',
    'Pedro Almeida',
    'Ricardo Costa',
    'André Sousa',
    'Tiago Rodrigues',
    'Bruno Carvalho',
    'Diogo Pereira',
    'Luís Ribeiro',
    'Francisco Mendes'
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

  function ensureConversionStyles(){
    if(document.getElementById('cavero-conversion-message-styles')) return;
    const style=document.createElement('style');
    style.id='cavero-conversion-message-styles';
    style.textContent=`
      .premium-hero-facts{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 4px}
      .premium-hero-fact{display:inline-flex;align-items:center;min-height:30px;padding:6px 10px;border:1px solid rgba(255,255,255,.28);border-radius:999px;background:rgba(0,0,0,.22);backdrop-filter:blur(8px);font-size:11px;font-weight:700;letter-spacing:.05em;color:#fff}
      .cavero-proof-bar{padding:18px 20px;border-bottom:1px solid rgba(17,17,15,.09);background:#f7f6f1}
      .cavero-proof-bar-inner{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
      .cavero-proof-item{padding:13px 14px;border:1px solid rgba(17,17,15,.1);background:#fff;border-radius:14px}
      .cavero-proof-item b{display:block;margin-bottom:3px;font-size:13px;color:#11110f}
      .cavero-proof-item span{display:block;font-size:12px;line-height:1.45;color:#66645d}
      #sobre .about-pillars{align-content:start}
      #sobre .about-pillar p{line-height:1.6}
      @media(max-width:820px){.cavero-proof-bar-inner{grid-template-columns:repeat(2,minmax(0,1fr))}.premium-hero-facts{gap:6px}.premium-hero-fact{font-size:10px;padding:5px 8px}}
      @media(max-width:520px){.cavero-proof-bar{padding:14px 12px}.cavero-proof-bar-inner{grid-template-columns:1fr 1fr;gap:7px}.cavero-proof-item{padding:11px}.cavero-proof-item b{font-size:12px}.cavero-proof-item span{font-size:11px}}
    `;
    document.head.appendChild(style);
  }

  function addProofBar(){
    const hero=document.getElementById('premiumHero');
    if(!hero || document.getElementById('caveroProofBar')) return;
    const section=document.createElement('section');
    section.id='caveroProofBar';
    section.className='cavero-proof-bar';
    section.setAttribute('aria-label','Vantagens CAVERO');
    section.innerHTML=`<div class="cavero-proof-bar-inner">
      <div class="cavero-proof-item"><b>3 anos de garantia legal</b><span>Proteção de conformidade para consumidores em Portugal.</span></div>
      <div class="cavero-proof-item"><b>14 dias para decidir</b><span>Direito de livre resolução nas compras online, nos termos legais.</span></div>
      <div class="cavero-proof-item"><b>Envio 0 €</b><span>Entrega estimada em 5–13 dias nas encomendas abrangidas.</span></div>
      <div class="cavero-proof-item"><b>Especificações claras</b><span>Mostramos o que está confirmado e assinalamos o que ainda não está.</span></div>
    </div>`;
    hero.insertAdjacentElement('afterend',section);
  }

  function enhanceConversionMessage(){
    const top=document.querySelector('.top');
    if(top) top.textContent='ENVIO GRATUITO · ENTREGA ESTIMADA 5–13 DIAS · 3 ANOS DE GARANTIA LEGAL · CAVERO WATCHES';

    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute('content','CAVERO Watches — coleção curta de relógios com especificações por modelo, variantes claras, envio gratuito e proteção legal do consumidor em Portugal.');

    const about=document.querySelector('#sobre .about-copy');
    const pillars=document.querySelector('#sobre .about-pillars');
    if(about){
      const kicker=about.querySelector('.home-kicker');
      const title=about.querySelector('.home-title');
      const leads=about.querySelectorAll('.home-lead');
      const note=about.querySelector('.about-note');
      const stats=about.querySelector('.about-stats');
      if(kicker) kicker.textContent='PORQUE CAVERO';
      if(title) title.textContent='Menos catálogo. Mais informação para escolher o relógio certo.';
      if(leads[0]) leads[0].textContent='A CAVERO não tenta ser um marketplace com centenas de referências. Trabalhamos uma coleção curta, organizada por estilo, com variantes, medidas e informação técnica por modelo para que saibas o que estás a escolher antes de pagar.';
      if(leads[1]) leads[1].textContent='Quando uma especificação está confirmada, mostramos. Quando não está, não a transformamos numa promessa de marketing. A CAVERO opera em Portugal e a origem de fabrico de cada modelo só é apresentada quando estiver devidamente confirmada.';
      if(note) note.innerHTML='<strong>O que estás a pagar:</strong> o modelo e acabamento escolhidos, uma seleção CAVERO mais simples de comparar, informação de produto organizada, envio normal gratuito e apoio através da loja oficial — sem acrescentar portes no fim da compra.';
      if(stats) stats.innerHTML='<div class="about-stat"><b>3 anos</b><span>garantia legal de conformidade</span></div><div class="about-stat"><b>14 dias</b><span>livre resolução online</span></div><div class="about-stat"><b>0 €</b><span>de envio normal</span></div>';
    }

    if(pillars){
      pillars.innerHTML=`
        <article class="about-pillar"><span>01 · ESPECIFICAÇÕES</span><h3>Qualidade explicada, não sugerida</h3><p>Cada página reúne medidas, tipo de bracelete, fecho, acabamento e resistência à água quando confirmada. Chronos e Velocity, por exemplo, apresentam 3 ATM; nos restantes modelos não inventamos uma classificação.</p></article>
        <article class="about-pillar"><span>02 · MATERIAIS</span><h3>Sem transformar aparência em composição</h3><p>Quando um modelo é metálico ou tem aparência de aço, dizemos exatamente isso. Só apresentamos “aço inoxidável”, vidro específico ou outro material como facto quando essa composição estiver confirmada.</p></article>
        <article class="about-pillar"><span>03 · PREÇO</span><h3>O valor muda com o modelo e a variante</h3><p>O preço visível acompanha o acabamento selecionado. Antes de adicionares ao saco vês a variante, a imagem, a referência e o preço aplicável, com envio normal a 0 €.</p></article>
        <article class="about-pillar"><span>04 · PROTEÇÃO</span><h3>3 anos de garantia legal</h3><p>Nas compras de consumo em Portugal aplicam-se os direitos legais de conformidade dos bens. Nas compras à distância existe ainda o direito de livre resolução de 14 dias, salvo as exceções previstas na lei.</p></article>
        <article class="about-pillar"><span>05 · ORIGEM</span><h3>Sem uma história de fabrico inventada</h3><p>A CAVERO é apresentada e operada a partir de Portugal. Não usamos “Made in Portugal” nem atribuímos uma origem de produção a um relógio sem confirmação documental.</p></article>
        <article class="about-pillar"><span>06 · PARA QUEM</span><h3>Um modelo para cada linguagem de estilo</h3><p>Velocity e Chronos privilegiam uma estética cronográfica; Apex aposta no desenho octogonal; Prestige e Royale são mais clássicos; Ocean segue uma leitura casual e desportiva.</p></article>`;
    }

    const faq=document.querySelector('#faq .faq-list');
    if(faq){
      faq.innerHTML=`
        <details open><summary>O que torna a CAVERO diferente de um marketplace?</summary><p>A CAVERO trabalha uma coleção curta e organizada por identidade de produto, em vez de apresentar centenas de referências sem contexto. Cada modelo tem variantes, fotografias, preço, medidas e informação técnica reunidos na própria página para tornar a comparação e a decisão mais simples.</p></details>
        <details><summary>Que qualidade e materiais têm os relógios?</summary><p>Depende do modelo. As páginas de produto indicam as medidas, bracelete, fecho, acabamento e resistência à água quando existe confirmação. Chronos e Velocity têm <strong>3 ATM</strong> indicado; noutros modelos, dados como movimento, vidro ou resistência à água não são apresentados como factos enquanto não estiverem confirmados.</p></details>
        <details><summary>Onde são desenhados ou produzidos?</summary><p>A CAVERO é uma marca e loja operada a partir de Portugal. Não apresentamos um relógio como “Made in Portugal” nem atribuímos uma origem de fabrico específica sem confirmação documental. Quando existir origem confirmada para um modelo, essa informação poderá ser indicada diretamente na respetiva página.</p></details>
        <details><summary>Que garantia tenho?</summary><p>Nas compras de consumo em Portugal aplica-se a <strong>garantia legal de conformidade de 3 anos</strong> para bens móveis. Em compras online existe também, em regra, um <strong>prazo de 14 dias</strong> para exercer o direito de livre resolução, sujeito às condições e exceções legais.</p></details>
        <details><summary>Porque é que os preços variam entre modelos e acabamentos?</summary><p>O preço depende da família e da variante escolhida. A página atualiza o acabamento, a imagem, a referência e o preço correspondente antes de adicionares ao saco. O envio normal apresentado na loja é gratuito, por isso não acrescentamos portes no fim para as encomendas abrangidas.</p></details>
        <details><summary>Qual é o CAVERO mais indicado para mim?</summary><p>Se procuras uma estética cronográfica e mais técnica, vê Velocity ou Chronos. Para um desenho moderno e geométrico, Apex. Para uma utilização mais clássica ou profissional, Prestige e Royale. Para um estilo casual e desportivo, Ocean.</p></details>
        <details><summary>Quanto tempo leva a encomenda?</summary><p>O prazo estimado de entrega é de <strong>5 a 13 dias</strong>. O tempo pode variar ligeiramente de acordo com o destino, processamento, transportadora, fins de semana ou situações excecionais.</p></details>
        <details><summary>O envio é gratuito?</summary><p>Sim. O envio normal apresentado na loja é <strong>gratuito</strong> nas encomendas abrangidas. O custo de portes é 0,00 €.</p></details>
        <details><summary>Posso escolher o acabamento do relógio?</summary><p>Sim. Cada página de produto mostra os acabamentos disponíveis. Ao escolheres uma variante, a imagem, a referência e o preço correspondente são atualizados antes de adicionares o relógio ao saco.</p></details>`;
    }
  }

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
      const heroContent=document.querySelector('.premium-hero-content');
      let facts=document.getElementById('premiumHeroFacts');
      if(heroContent && !facts){
        facts=document.createElement('div');
        facts.id='premiumHeroFacts';
        facts.className='premium-hero-facts';
        price?.insertAdjacentElement('afterend',facts);
      }
      if(facts) facts.innerHTML=(heroFacts[f.key]||[]).map(item=>`<span class="premium-hero-fact">${item}</span>`).join('');
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
      <div class="store-review-meta"><b>${customerNames[i] || 'Cliente CAVERO'}</b></div>
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
    ensureConversionStyles();
    enhanceConversionMessage();
    addProofBar();
    initHero();
    initStoreReviews();
    initCollectionTabs();
    initHomeAnchors();
  });
})();
