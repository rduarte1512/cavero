// CAVERO Mariner launch merchandising + featured homepage selection.
(() => {
  const DEADLINE = new Date('2026-10-10T23:59:59+01:00').getTime();
  const MARINER_PATH = '/cavero-mariner';
  const gallery = [
    '/assets/mariner/mariner-wrist-formal.webp',
    '/assets/mariner/mariner-detail.webp',
    '/assets/mariner/mariner-standing.webp',
    '/assets/mariner/mariner-water.webp',
    '/assets/mariner/mariner-lume.webp',
    '/assets/mariner/mariner-wrist-collection.webp'
  ];

  const mariner = {
    key: 'mariner',
    name: 'CAVERO Mariner',
    subtitle: 'Relógio Masculino em Aço Inoxidável · Mostrador Branco',
    desc: 'Aço inoxidável, mostrador branco, data e detalhes luminosos num relógio elegante e versátil, pensado para acompanhar o dia a dia e ocasiões especiais.',
    defaultVariant: 0,
    cleanImage: gallery[0],
    gallery,
    variants: [{ name: 'Prateado e Branco', price: 69.99, compareAt: 109.99, image: gallery[0], index: 0 }]
  };

  if (!families.some(f => f.key === 'mariner')) families.push(mariner);
  const family = families.find(f => f.key === 'mariner');
  if (family && typeof familyMap !== 'undefined') familyMap.set('mariner', family);

  if (!document.querySelector('link[data-mariner-premium]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/mariner-premium.css';
    css.dataset.marinerPremium = 'true';
    document.head.appendChild(css);
  }

  const moneyMariner = n => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(Number(n)||0);
  const campaignActive = () => Date.now() <= DEADLINE;

  function campaignPriceSync(){
    if (!family?.variants?.[0]) return;
    const active = campaignActive();
    family.variants[0].price = active ? 69.99 : 109.99;
    family.variants[0].compareAt = 109.99;
    document.querySelectorAll('[data-mariner-live-price]').forEach(el => el.textContent = moneyMariner(family.variants[0].price));
    document.querySelectorAll('[data-mariner-old-price]').forEach(el => {
      el.hidden = !active;
      el.textContent = active ? moneyMariner(109.99) : '';
    });
    document.querySelectorAll('[data-mariner-discount]').forEach(el => { el.hidden = !active; });
  }

  function countdownMarkup(){
    return `<div class="mariner-countdown" data-mariner-countdown>
      <div><b data-m-d>--</b><small>Dias</small></div>
      <div><b data-m-h>--</b><small>Horas</small></div>
      <div><b data-m-m>--</b><small>Min</small></div>
      <div><b data-m-s>--</b><small>Seg</small></div>
    </div>`;
  }

  function updateCountdowns(){
    campaignPriceSync();
    const left = Math.max(0, DEADLINE - Date.now());
    if (!left) {
      document.querySelectorAll('[data-mariner-countdown]').forEach(el => el.outerHTML = '<div class="mariner-campaign-ended">A campanha de lançamento terminou.</div>');
      document.querySelectorAll('[data-mariner-deadline-copy]').forEach(el => el.textContent = 'Campanha de lançamento terminada.');
      return;
    }
    const d = Math.floor(left / 86400000);
    const h = Math.floor((left % 86400000) / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);
    document.querySelectorAll('[data-mariner-countdown]').forEach(el => {
      const set=(sel,val)=>{const node=el.querySelector(sel);if(node)node.textContent=String(val).padStart(2,'0')};
      set('[data-m-d]',d);set('[data-m-h]',h);set('[data-m-m]',m);set('[data-m-s]',s);
    });
  }

  function addHomepageFeature(){
    const target = document.getElementById('destaques');
    if (!target || document.getElementById('marinerFeature')) return;
    const section = document.createElement('section');
    section.id = 'marinerFeature';
    section.className = 'mariner-feature';
    section.innerHTML = `<div class="mariner-feature-inner">
      <div class="mariner-feature-media">
        <img src="${gallery[0]}" alt="CAVERO Mariner prateado com mostrador branco no pulso" loading="eager">
        <span class="mariner-feature-badge">NOVIDADE · DESTAQUE CAVERO</span>
      </div>
      <div class="mariner-feature-copy">
        <div class="eyebrow">CAVERO MARINER · LANÇAMENTO</div>
        <h2>Elegância com presença.</h2>
        <p>Mostrador branco limpo, caixa e bracelete em aço inoxidável, data e leitura luminosa. Uma seleção CAVERO criada para passar do escritório ao fim de semana sem perder presença.</p>
        <div class="mariner-price-line"><strong data-mariner-live-price>69,99 €</strong><s data-mariner-old-price>109,99 €</s><span data-mariner-discount>-36%</span></div>
        <div class="mariner-deadline" data-mariner-deadline-copy>Preço de lançamento disponível até 10 de outubro.</div>
        ${countdownMarkup()}
        <div class="mariner-feature-points"><span>✓ Aço inoxidável</span><span>✓ Movimento de quartzo</span><span>✓ Vidro Hardlex</span><span>✓ Resistência à água 3ATM</span></div>
        <button class="mariner-feature-cta" type="button" data-open-mariner>Descobrir CAVERO Mariner →</button>
      </div>
    </div>`;
    target.insertAdjacentElement('beforebegin', section);
    section.querySelector('[data-open-mariner]')?.addEventListener('click',()=>window.openProduct?.('mariner'));
  }

  function premiumProductMarkup(){
    return `<section class="mariner-premium" aria-label="Detalhes CAVERO Mariner">
      <div class="mariner-offer-strip">
        <div><div class="eyebrow">OFERTA DE LANÇAMENTO · TEMPO LIMITADO</div><h2>Mariner a <span data-mariner-live-price>69,99 €</span> <s data-mariner-old-price>109,99 €</s></h2><p data-mariner-deadline-copy>Campanha válida até 10 de outubro de 2026 às 23:59 em Portugal.</p></div>
        ${countdownMarkup()}
      </div>

      <div class="mariner-story">
        <img src="${gallery[1]}" alt="Detalhe do mostrador branco e bisel do CAVERO Mariner" loading="lazy">
        <div class="mariner-story-copy"><div class="eyebrow">A HISTÓRIA DO MARINER</div><h2>Um clássico marítimo, reinterpretado para todos os dias.</h2><p>A seleção CAVERO Mariner foi escolhida para quem procura um relógio capaz de combinar um fato, uma camisa ou um look descontraído. O mostrador branco mantém a leitura limpa, o aço combina superfícies polidas e escovadas e o bisel numerado acrescenta carácter desportivo sem retirar elegância.</p><p>É uma peça com presença no pulso, mas com uma linguagem visual suficientemente discreta para ser usada todos os dias.</p></div>
      </div>

      <div class="eyebrow">PORQUE SE DESTACA</div><h2 class="mariner-section-title">Detalhes úteis. Aparência premium.</h2>
      <div class="mariner-benefits">
        <article class="mariner-benefit"><span>01</span><h3>Aço inoxidável</h3><p>Caixa e bracelete metálicas para um acabamento sólido, elegante e versátil.</p></article>
        <article class="mariner-benefit"><span>02</span><h3>Leitura luminosa</h3><p>Marcadores e ponteiros luminosos ajudam a consultar as horas em ambientes escuros.</p></article>
        <article class="mariner-benefit"><span>03</span><h3>Data automática</h3><p>Janela de data integrada no mostrador para maior utilidade no dia a dia.</p></article>
        <article class="mariner-benefit"><span>04</span><h3>Vidro Hardlex</h3><p>Proteção resistente para o mostrador, pensada para acompanhar uma utilização regular.</p></article>
        <article class="mariner-benefit"><span>05</span><h3>Movimento quartzo</h3><p>Funcionamento prático e preciso, com bateria incluída para utilização imediata.</p></article>
        <article class="mariner-benefit"><span>06</span><h3>3ATM</h3><p>Resistência adequada a salpicos, chuva e lavagem das mãos no uso diário.</p></article>
      </div>

      <div class="mariner-spec-layout">
        <img class="mariner-spec-image" src="${gallery[2]}" alt="CAVERO Mariner e bracelete em aço inoxidável" loading="lazy">
        <div><div class="eyebrow">ESPECIFICAÇÕES</div><h2 class="mariner-section-title">O que precisas de saber.</h2><div class="mariner-specs">
          <div class="mariner-spec"><span>Referência</span><b>680-WH</b></div>
          <div class="mariner-spec"><span>Movimento</span><b>Quartzo</b></div>
          <div class="mariner-spec"><span>Diâmetro da caixa</span><b>aprox. 43 mm</b></div>
          <div class="mariner-spec"><span>Espessura</span><b>aprox. 13 mm</b></div>
          <div class="mariner-spec"><span>Material da caixa</span><b>Aço inoxidável</b></div>
          <div class="mariner-spec"><span>Material da bracelete</span><b>Aço inoxidável</b></div>
          <div class="mariner-spec"><span>Comprimento da bracelete</span><b>aprox. 22 cm</b></div>
          <div class="mariner-spec"><span>Largura da bracelete</span><b>aprox. 20 mm</b></div>
          <div class="mariner-spec"><span>Vidro</span><b>Hardlex</b></div>
          <div class="mariner-spec"><span>Funções</span><b>Data · elementos luminosos</b></div>
          <div class="mariner-spec"><span>Resistência à água</span><b>3ATM / 3Bar</b></div>
          <div class="mariner-spec"><span>Fecho</span><b>Dobrável com segurança</b></div>
          <div class="mariner-spec"><span>Bateria</span><b>Incluída</b></div>
        </div><div class="mariner-water-note"><strong>Nota sobre 3ATM:</strong> adequado a salpicos, chuva e lavagem das mãos. Evita mergulho, duches e submersão prolongada.</div></div>
      </div>

      <div class="mariner-lume"><img src="${gallery[4]}" alt="Luminosidade noturna do CAVERO Mariner" loading="lazy"><div class="mariner-lume-copy"><h3>Visível quando a luz baixa.</h3><p>Os marcadores e ponteiros luminosos acrescentam funcionalidade sem alterar o visual clean do mostrador.</p></div></div>
    </section>`;
  }

  function positionMarinerPremium(shell){
    const premium = shell?.querySelector('.mariner-premium');
    const productPage = shell?.querySelector('.product-page');
    if (!premium || !productPage) return;
    if (premium.previousElementSibling !== productPage) productPage.insertAdjacentElement('afterend', premium);
  }

  function enhanceMarinerProduct(){
    if (typeof activeFamily === 'undefined' || activeFamily?.key !== 'mariner') return;
    const shell = document.querySelector('#productView .product-shell');
    if (!shell) return;

    let premium = shell.querySelector('.mariner-premium');
    if (!premium) {
      const holder = document.createElement('div');
      holder.innerHTML = premiumProductMarkup().trim();
      premium = holder.firstElementChild;
      const productPage = shell.querySelector('.product-page');
      if (productPage) productPage.insertAdjacentElement('afterend', premium);
      else shell.insertBefore(premium, shell.firstChild);
    }

    positionMarinerPremium(shell);
    requestAnimationFrame(()=>positionMarinerPremium(shell));
    setTimeout(()=>positionMarinerPremium(shell),0);

    const heading = shell.querySelector('.detail .eyebrow');
    if (heading) heading.textContent = 'DESTAQUE CAVERO · LANÇAMENTO LIMITADO';
    const accordions = shell.querySelector('.product-accordions');
    if (accordions && !accordions.querySelector('[data-mariner-materials]')) accordions.insertAdjacentHTML('afterbegin','<details data-mariner-materials><summary>Materiais e características</summary><p>Aço inoxidável, vidro Hardlex, movimento de quartzo, data, elementos luminosos e resistência à água 3ATM. Referência do modelo: 680-WH.</p></details>');
    updateCountdowns();
  }

  const baseOpenProduct = window.openProduct;
  if (typeof baseOpenProduct === 'function') {
    window.openProduct = function(key){
      if (key === 'mariner' && location.pathname.replace(/\/+$/,'') !== MARINER_PATH) history.pushState({view:'product',productKey:'mariner'},'',MARINER_PATH);
      const result = baseOpenProduct.apply(this, arguments);
      if (key === 'mariner') setTimeout(enhanceMarinerProduct,0);
      return result;
    };
  }

  renderFeatured = function(){
    const chosen=['mariner','velocity','chronos'];
    const available=chosen.map(key=>familyMap.get(key)).filter(Boolean);
    const grid=document.getElementById('featuredGrid');
    if(!grid) return;
    grid.innerHTML=available.map(f=>{
      const v=cleanVariant(f,f.defaultVariant);
      const href=f.key==='chronos'?'/cavero-chronos-ice':'/cavero-'+f.key;
      return `<article class="featured" onclick="openProduct('${f.key}')">
        <div class="media"><span class="sale-badge">-${discountPct(v)}%</span><img src="${f.cleanImage||v.image}" alt="${f.name} ${v.name}" loading="lazy"></div>
        <div class="body"><p>${f.key==='mariner'?'NOVIDADE · OFERTA LIMITADA':`${f.variants.length} acabamentos disponíveis`}</p><h3><a href="${href}" onclick="event.stopPropagation()">${f.name}</a></h3>${priceBlock(v,true)}<button class="mini">Explorar modelo →</button></div>
      </article>`;
    }).join('');
  };

  function patchStaticCounts(){
    const stats=[...document.querySelectorAll('.about-stat')];
    const modelStat=stats.find(x=>x.textContent.includes('modelos na coleção atual'));
    if(modelStat){const b=modelStat.querySelector('b');if(b)b.textContent='6'}
    document.querySelectorAll('#colecao .home-lead').forEach(p=>{if(p.textContent.trim().startsWith('Cinco modelos'))p.textContent=p.textContent.replace('Cinco modelos','Seis modelos')});
  }

  function syncHomeMarinerFilter(){
    const cards=[...document.querySelectorAll('#grid .family-card')];
    const card=cards.find(c=>c.dataset.familyKey==='mariner');
    if(!card)return;
    const active=document.querySelector('.collection-tab.active')?.dataset.collectionFilter||'all';
    const show=active!=='sport';
    card.style.display=show?'':'none';
    const visible=cards.filter(c=>c.style.display!=='none').length;
    const count=document.getElementById('productCount');if(count)count.textContent=`${visible} ${visible===1?'modelo':'modelos'}`;
  }

  function syncCatalogMariner(){
    const card=document.querySelector('#catalogGrid [data-catalog-key="mariner"]');
    if(!card)return;
    const link=card.querySelector('a.catalog-card-action');if(link&&link.getAttribute('href')!==MARINER_PATH)link.setAttribute('href',MARINER_PATH);
    const active=document.querySelector('#catalogView [data-catalog-filter].active')?.dataset.catalogFilter||'all';
    const query=(document.getElementById('catalogSearch')?.value||'').trim().toLowerCase();
    const haystack=[family.name,family.subtitle,family.desc,...family.variants.map(v=>v.name)].join(' ').toLowerCase();
    const groupAllows=active!=='sport';
    const show=groupAllows&&(!query||haystack.includes(query));
    card.style.display=show?'':'none';
    const cards=[...document.querySelectorAll('#catalogGrid [data-catalog-key]')];
    const visible=cards.filter(c=>c.style.display!=='none').length;
    const count=document.getElementById('catalogCount');if(count)count.textContent=`${visible} ${visible===1?'modelo encontrado':'modelos encontrados'}`;
  }

  addHomepageFeature();
  patchStaticCounts();
  campaignPriceSync();
  updateCountdowns();
  setInterval(updateCountdowns,1000);

  // These hooks run after the later storefront modules register their own handlers.
  setTimeout(()=>{
    document.querySelectorAll('.collection-tab').forEach(btn=>btn.addEventListener('click',()=>setTimeout(syncHomeMarinerFilter,0)));
    document.querySelectorAll('#catalogView [data-catalog-filter]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(syncCatalogMariner,0)));
    document.getElementById('catalogSearch')?.addEventListener('input',()=>setTimeout(syncCatalogMariner,0));
    const catalogGrid=document.getElementById('catalogGrid');
    if(catalogGrid)new MutationObserver(()=>setTimeout(syncCatalogMariner,0)).observe(catalogGrid,{childList:true});
    if(location.pathname.replace(/\/+$/,'')===MARINER_PATH)window.openProduct?.('mariner');
    window.addEventListener('popstate',()=>{if(location.pathname.replace(/\/+$/,'')===MARINER_PATH)setTimeout(()=>window.openProduct?.('mariner'),0)});
  },0);
})();
