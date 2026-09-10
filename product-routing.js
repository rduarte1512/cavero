(() => {
  const DEFAULT_TITLE = 'CAVERO Watches — Own Your Time';
  const CATALOG_PATH = '/catalogo';
  const SITE_PATHS = window.CAVERO_SITE_PATHS || {};
  const SITE_ROUTE_TO_KEY = window.CAVERO_SITE_ROUTE_TO_KEY || {};

  const PRODUCT_PATHS = {
    chronos: '/cavero-chronos-ice',
    ocean: '/cavero-ocean',
    velocity: '/cavero-velocity',
    prestige: '/cavero-prestige',
    apex: '/cavero-apex',
    mariner: '/cavero-mariner'
  };

  const PATH_TO_KEY = Object.fromEntries(
    Object.entries(PRODUCT_PATHS).map(([key, path]) => [path, key])
  );

  const CATALOG_GROUPS = {
    all: ['chronos','ocean','velocity','prestige','apex','mariner'],
    sport: ['ocean','velocity','apex'],
    elegant: ['chronos','prestige','mariner'],
    statement: ['chronos','velocity','apex','mariner']
  };

  const normalizePath = path => {
    if (!path) return '/';
    const clean = path.replace(/\/+$/, '');
    return clean || '/';
  };

  const getFamily = key => {
    if (typeof families === 'undefined') return null;
    return families.find(f => f.key === key) || null;
  };

  const minPriceVariant = family => family.variants.reduce((best, current) => current.price < best.price ? current : best, family.variants[0]);
  const moneyCatalog = value => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(Number(value)||0);

  function ensureCatalogStyles(){
    if (document.querySelector('link[data-catalog-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'catalog-page.css';
    link.dataset.catalogCss = 'true';
    document.head.appendChild(link);
  }

  function ensureCatalogView(){
    let view = document.getElementById('catalogView');
    if (view) return view;

    view = document.createElement('section');
    view.id = 'catalogView';
    view.className = 'catalog-view hidden';
    view.innerHTML = `
      <div class="catalog-shell">
        <button class="catalog-back" type="button" data-catalog-home>← Voltar à página inicial</button>
        <section class="catalog-hero">
          <div class="catalog-hero-copy">
            <div class="catalog-kicker">CATÁLOGO OFICIAL · CAVERO WATCHES</div>
            <h1>Todos os relógios CAVERO.</h1>
            <p>Explora a coleção completa num só lugar. Seis modelos, vários acabamentos e estilos para diferentes ocasiões — com envio gratuito em todas as encomendas.</p>
            <div class="catalog-hero-trust"><span>✓ Envio gratuito</span><span>✓ Entrega estimada 5–13 dias</span><span>✓ 6 modelos CAVERO</span></div>
          </div>
          <div class="catalog-hero-visual"><img src="https://static.wixstatic.com/media/eb5ec1_ad79dbda21cf4672b8c6211f6757e693~mv2.jpg" alt="Coleção CAVERO Watches"></div>
        </section>

        <div class="catalog-toolbar">
          <div class="catalog-toolbar-copy">
            <div class="catalog-kicker">ENCONTRA O TEU CAVERO</div>
            <h2>Catálogo completo</h2>
            <p>Filtra por estilo ou pesquisa pelo nome e acabamento.</p>
            <div class="catalog-count" id="catalogCount"></div>
          </div>
          <div class="catalog-controls">
            <input class="catalog-search" id="catalogSearch" type="search" placeholder="Pesquisar relógio ou acabamento..." aria-label="Pesquisar catálogo">
            <div class="catalog-tabs" role="tablist" aria-label="Filtrar catálogo">
              <button class="catalog-tab active" data-catalog-filter="all">Todos</button>
              <button class="catalog-tab" data-catalog-filter="sport">Desportivo</button>
              <button class="catalog-tab" data-catalog-filter="elegant">Elegante</button>
              <button class="catalog-tab" data-catalog-filter="statement">Com presença</button>
            </div>
          </div>
        </div>

        <div class="catalog-grid" id="catalogGrid"></div>
        <div class="catalog-footer-note"><b>Envio gratuito em toda a coleção.</b><span>Prazo estimado de entrega: 5–13 dias.</span></div>
      </div>`;

    const productView = document.getElementById('productView');
    if (productView) productView.insertAdjacentElement('afterend', view);
    else document.body.appendChild(view);

    view.querySelector('[data-catalog-home]')?.addEventListener('click',()=>window.showHome?.());
    view.querySelector('#catalogSearch')?.addEventListener('input',applyCatalogFilters);
    view.querySelectorAll('[data-catalog-filter]').forEach(btn=>btn.addEventListener('click',()=>{
      view.querySelectorAll('[data-catalog-filter]').forEach(b=>b.classList.toggle('active',b===btn));
      applyCatalogFilters();
    }));
    view.querySelector('#catalogGrid')?.addEventListener('click',event=>{
      const card = event.target.closest('[data-catalog-product]');
      if (!card || event.target.closest('a[href]')) return;
      window.openProduct?.(card.dataset.catalogProduct);
    });

    return view;
  }

  function catalogCard(family){
    const min = minPriceVariant(family);
    const defaultIndex = Number.isFinite(Number(family.defaultVariant)) ? Number(family.defaultVariant) : 0;
    const defaultVariant = family.variants[defaultIndex] || family.variants[0];
    const image = family.cleanImage || defaultVariant.image;
    const bestCompare = min.compareAt > min.price ? min.compareAt : null;
    return `<article class="catalog-card" data-catalog-product="${family.key}" data-catalog-key="${family.key}">
      <div class="catalog-card-media">
        <span class="catalog-card-badge">${family.variants.length} ${family.variants.length===1?'ACABAMENTO':'ACABAMENTOS'}</span>
        <img src="${image}" alt="${family.name}" loading="lazy">
      </div>
      <div class="catalog-card-body">
        <div class="catalog-card-sub">${family.subtitle || 'CAVERO WATCHES'}</div>
        <h3>${family.name}</h3>
        <p class="catalog-card-desc">${family.desc || 'Descobre este modelo CAVERO e escolhe o acabamento que mais combina contigo.'}</p>
        <div class="catalog-card-foot">
          <div class="catalog-price"><small>Desde</small><strong>${moneyCatalog(min.price)}</strong>${bestCompare?`<s>${moneyCatalog(bestCompare)}</s>`:''}</div>
          <a class="catalog-card-action" href="${PRODUCT_PATHS[family.key]}">Ver modelo →</a>
        </div>
      </div>
    </article>`;
  }

  function renderCatalog(){
    const grid = document.getElementById('catalogGrid');
    if (!grid || typeof families === 'undefined') return;
    grid.innerHTML = families.map(catalogCard).join('');
    applyCatalogFilters();
  }

  function applyCatalogFilters(){
    const view = document.getElementById('catalogView');
    if (!view || typeof families === 'undefined') return;
    const active = view.querySelector('[data-catalog-filter].active')?.dataset.catalogFilter || 'all';
    const allowed = CATALOG_GROUPS[active] || CATALOG_GROUPS.all;
    const query = (view.querySelector('#catalogSearch')?.value || '').trim().toLowerCase();
    let visible = 0;

    view.querySelectorAll('[data-catalog-key]').forEach(card=>{
      const key = card.dataset.catalogKey;
      const family = getFamily(key);
      const haystack = family ? [family.name,family.subtitle,family.desc,...family.variants.map(v=>v.name)].join(' ').toLowerCase() : '';
      const show = allowed.includes(key) && (!query || haystack.includes(query));
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const count = view.querySelector('#catalogCount');
    if (count) count.textContent = `${visible} ${visible===1?'modelo encontrado':'modelos encontrados'}`;

    const grid = view.querySelector('#catalogGrid');
    let empty = view.querySelector('.catalog-empty');
    if (!visible) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'catalog-empty';
        empty.textContent = 'Não encontrámos nenhum relógio com esses filtros.';
        grid?.appendChild(empty);
      }
    } else if (empty) empty.remove();
  }

  function hideCatalog(){
    document.getElementById('catalogView')?.classList.add('hidden');
  }

  function hideSitePage(){
    if (typeof window.CAVERO_hideSitePage === 'function') window.CAVERO_hideSitePage();
  }

  function showCatalogBase(){
    const view = ensureCatalogView();
    document.getElementById('homeView')?.classList.add('hidden');
    document.getElementById('productView')?.classList.add('hidden');
    document.getElementById('checkoutView')?.classList.add('hidden');
    hideSitePage();
    view.classList.remove('hidden');
    renderCatalog();
    window.scrollTo(0,0);
  }

  ensureCatalogStyles();
  ensureCatalogView();

  const baseOpenProduct = window.openProduct;
  const baseShowHome = window.showHome;
  const baseGoCheckout = window.goCheckout;
  let handlingHistory = false;

  if (typeof baseOpenProduct !== 'function' || typeof baseShowHome !== 'function') return;

  function setProductMeta(key) {
    const family = getFamily(key);
    if (!family) return;
    document.title = `${family.name} | CAVERO Watches`;
  }

  function setHomeMeta() {
    document.title = DEFAULT_TITLE;
  }

  function setCatalogMeta(){
    document.title = 'Catálogo | CAVERO Watches';
  }

  function setSiteMeta(key){
    if(key==='search'){document.title='Pesquisar | CAVERO Watches';return}
    const page=window.CAVERO_SITE_PAGES?.[key];
    document.title=page?.title?`${page.title} | CAVERO Watches`:DEFAULT_TITLE;
  }

  window.openProduct = function(key) {
    const path = PRODUCT_PATHS[key];
    if (!path) return baseOpenProduct(key);

    if (!handlingHistory && normalizePath(window.location.pathname) !== path) {
      history.pushState({ view: 'product', productKey: key }, '', path);
    }

    hideCatalog();
    hideSitePage();
    baseOpenProduct(key);
    setProductMeta(key);
  };

  window.showHome = function() {
    if (!handlingHistory && normalizePath(window.location.pathname) !== '/') {
      history.pushState({ view: 'home' }, '', '/');
    }

    hideCatalog();
    hideSitePage();
    baseShowHome();
    setHomeMeta();
  };

  window.openCatalog = function(){
    if (!handlingHistory && normalizePath(window.location.pathname) !== CATALOG_PATH) {
      history.pushState({view:'catalog'},'',CATALOG_PATH);
    }
    showCatalogBase();
    setCatalogMeta();
  };

  window.openSitePage = function(key){
    const path=SITE_PATHS[key];
    if(!path || typeof window.CAVERO_showSitePageBase!=='function') return;
    if(!handlingHistory && normalizePath(window.location.pathname)!==path){
      history.pushState({view:'site-page',siteKey:key},'',path);
    }
    hideCatalog();
    window.CAVERO_showSitePageBase(key);
    setSiteMeta(key);
  };

  if (typeof baseGoCheckout === 'function') {
    window.goCheckout = function(){
      hideCatalog();
      hideSitePage();
      return baseGoCheckout();
    };
  }

  document.querySelectorAll('a[href="#colecao"]').forEach(link=>link.setAttribute('href',CATALOG_PATH));

  const headerSearch=document.getElementById('searchBtn');
  if(headerSearch) headerSearch.onclick=()=>window.openSitePage('search');

  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link || event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target==='_blank') return;
    const href=normalizePath(link.getAttribute('href')||'');
    if(href===CATALOG_PATH){event.preventDefault();window.openCatalog();return}
    const siteKey=SITE_ROUTE_TO_KEY[href];
    if(siteKey){event.preventDefault();window.openSitePage(siteKey)}
  });

  function renderCurrentRoute() {
    const path = normalizePath(window.location.pathname);
    const key = PATH_TO_KEY[path];
    const siteKey = SITE_ROUTE_TO_KEY[path];

    handlingHistory = true;
    try {
      if (siteKey && typeof window.CAVERO_showSitePageBase==='function') {
        hideCatalog();
        window.CAVERO_showSitePageBase(siteKey);
        setSiteMeta(siteKey);
        history.replaceState({view:'site-page',siteKey},'',path + window.location.search);
      } else if (path === CATALOG_PATH) {
        showCatalogBase();
        setCatalogMeta();
        history.replaceState({view:'catalog'},'',CATALOG_PATH);
      } else if (key && getFamily(key)) {
        hideCatalog();
        hideSitePage();
        baseOpenProduct(key);
        setProductMeta(key);
        history.replaceState({ view: 'product', productKey: key }, '', path);
      } else {
        hideCatalog();
        hideSitePage();
        baseShowHome();
        setHomeMeta();
        if (path === '/') history.replaceState({ view: 'home' }, '', '/');
      }
    } finally {
      handlingHistory = false;
    }
  }

  window.addEventListener('popstate', renderCurrentRoute);
  renderCurrentRoute();
})();

