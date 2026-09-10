(() => {
  const baseOpenProduct = window.openProduct;
  const baseSelectVariant = window.selectVariant;
  const baseShowHome = window.showHome;
  const mobileQuery = window.matchMedia('(max-width: 700px)');

  function currentFamily(){
    return typeof activeFamily !== 'undefined' ? activeFamily : window.activeFamily;
  }

  function currentVariant(){
    return typeof selectedVariant === 'function' ? selectedVariant() : null;
  }

  function ensureMobileBuyBar(){
    const f = currentFamily();
    const v = currentVariant();
    if(!f || !v) return;

    let bar = document.getElementById('mobileBuyBar');
    if(!bar){
      bar = document.createElement('div');
      bar.id = 'mobileBuyBar';
      bar.className = 'mobile-buy-bar';
      bar.setAttribute('aria-hidden', 'true');
      bar.innerHTML = `
        <div class="mobile-buy-copy">
          <small id="mobileBuyProduct"></small>
          <div><b id="mobileBuyPrice" aria-live="polite"></b><span id="mobileBuyVariant"></span></div>
        </div>
        <button type="button" id="mobileBuyButton">Adicionar ao saco</button>`;
      bar.querySelector('#mobileBuyButton')?.addEventListener('click', () => window.addSelectedVariant?.());
      document.body.appendChild(bar);
    }

    const product = document.getElementById('mobileBuyProduct');
    const variant = document.getElementById('mobileBuyVariant');
    const price = document.getElementById('mobileBuyPrice');
    if(product) product.textContent = f.name;
    if(variant) variant.textContent = v.name;
    if(price) price.textContent = money(v.price);
    refreshMobileBuyBarVisibility();
  }

  function refreshMobileBuyBarVisibility(){
    const bar = document.getElementById('mobileBuyBar');
    if(!bar) return;
    const productView = document.getElementById('productView');
    const buyRow = productView?.querySelector('.buyrow');
    const productVisible = productView && !productView.classList.contains('hidden');
    const shouldShow = Boolean(mobileQuery.matches && productVisible && buyRow && buyRow.getBoundingClientRect().bottom < 0);
    bar.classList.toggle('is-visible', shouldShow);
    bar.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    document.body.classList.toggle('has-mobile-buy-bar', shouldShow);
  }

  function hideMobileBuyBar(){
    const bar = document.getElementById('mobileBuyBar');
    if(bar){
      bar.classList.remove('is-visible');
      bar.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('has-mobile-buy-bar');
  }

  function ensurePurchaseConfidence(){
    const detail = document.querySelector('#productView .detail');
    if(!detail || detail.querySelector('.purchase-confidence')) return;
    const buyRow = detail.querySelector('.buyrow');
    if(!buyRow) return;

    const panel = document.createElement('div');
    panel.className = 'purchase-confidence';
    panel.setAttribute('aria-label', 'Informação importante antes da compra');
    panel.innerHTML = `
      <div class="purchase-confidence-item"><span aria-hidden="true">✓</span><div><small>ENTREGA ESTIMADA</small><b>5–13 dias</b></div></div>
      <div class="purchase-confidence-item"><span aria-hidden="true">↩</span><div><small>DEVOLUÇÃO</small><b>até 14 dias</b></div></div>
      <div class="purchase-confidence-item"><span aria-hidden="true">🔒</span><div><small>PAGAMENTO SEGURO</small><b>pela Stripe</b></div></div>`;

    const shippingNote = detail.querySelector('.buy-shipping-note');
    if(shippingNote) shippingNote.insertAdjacentElement('afterend', panel);
    else buyRow.insertAdjacentElement('afterend', panel);
  }

  function ensureConversionNote(){
    const detail = document.querySelector('#productView .detail');
    if(!detail || detail.querySelector('.conversion-note')) return;
    const note = document.createElement('div');
    note.className = 'conversion-note';
    note.innerHTML = '<span>Envio grátis</span><span>Compra protegida</span><span>Preço transparente</span>';
    const subtitle = detail.querySelector('.product-subtitle');
    if(subtitle) subtitle.insertAdjacentElement('afterend', note);
  }

  function enhanceMarinerReviews(){
    const f = currentFamily();
    if(!f || f.key !== 'mariner') return;
    const section = document.querySelector('#productView .customer-reviews-section');
    const grid = section?.querySelector('.mariner-review-grid');
    if(!section || !grid || section.dataset.reviewSummaryReady === 'true') return;

    const cards = [...grid.querySelectorAll('.mariner-review-card')];
    if(!cards.length) return;

    const photoCards = cards.filter(card => card.querySelector('.mariner-review-photo-grid'));
    const verifiedCount = cards.filter(card => card.querySelector('.verified-badge')).length;
    const ratings = cards.map(card => (card.querySelector('.review-stars')?.textContent.match(/★/g) || []).length).filter(Boolean);
    const average = ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : 0;

    [...cards]
      .sort((a,b) => Number(Boolean(b.querySelector('.mariner-review-photo-grid'))) - Number(Boolean(a.querySelector('.mariner-review-photo-grid'))))
      .forEach(card => grid.appendChild(card));

    const summary = document.createElement('div');
    summary.className = 'mariner-review-summary';
    summary.innerHTML = `
      <div class="mariner-review-score">
        <div class="mariner-review-score-stars" aria-label="${average.toFixed(1)} em 5">★★★★★</div>
        <div><strong>${average.toFixed(1).replace('.', ',')}</strong><span>${verifiedCount} avaliações verificadas</span><small>${photoCards.length} com fotografias de clientes</small></div>
      </div>
      <div class="mariner-review-filters" role="group" aria-label="Filtrar avaliações">
        <button type="button" class="active" data-review-filter="all" aria-pressed="true">Todas (${cards.length})</button>
        <button type="button" data-review-filter="photos" aria-pressed="false">Com fotos (${photoCards.length})</button>
      </div>`;

    const head = section.querySelector('.reviews-head');
    if(head) head.insertAdjacentElement('afterend', summary);
    else section.prepend(summary);

    const buttons = [...summary.querySelectorAll('[data-review-filter]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      const filter = button.dataset.reviewFilter;
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      cards.forEach(card => {
        const hasPhotos = Boolean(card.querySelector('.mariner-review-photo-grid'));
        card.hidden = filter === 'photos' && !hasPhotos;
      });
    }));

    section.dataset.reviewSummaryReady = 'true';
  }

  function enhanceProduct(){
    ensureMobileBuyBar();
    ensurePurchaseConfidence();
    ensureConversionNote();
    enhanceMarinerReviews();
    refreshMobileBuyBarVisibility();
  }

  if(typeof baseOpenProduct === 'function'){
    window.openProduct = function(key){
      const result = baseOpenProduct.apply(this, arguments);
      requestAnimationFrame(enhanceProduct);
      return result;
    };
  }

  if(typeof baseSelectVariant === 'function'){
    window.selectVariant = function(index){
      const result = baseSelectVariant.apply(this, arguments);
      requestAnimationFrame(() => {
        ensureMobileBuyBar();
        refreshMobileBuyBarVisibility();
      });
      return result;
    };
  }

  if(typeof baseShowHome === 'function'){
    window.showHome = function(){
      hideMobileBuyBar();
      return baseShowHome.apply(this, arguments);
    };
  }

  const originalCheckout = window.goCheckout;
  if(typeof originalCheckout === 'function'){
    window.goCheckout = function(){
      hideMobileBuyBar();
      return originalCheckout.apply(this, arguments);
    };
  }

  const productView = document.getElementById('productView');
  if(productView){
    new MutationObserver(() => requestAnimationFrame(enhanceProduct)).observe(productView, {childList:true, subtree:true, attributes:true, attributeFilter:['class']});
  }

  const onViewportChange = () => {
    const header = document.querySelector('header');
    if(header) header.classList.toggle('scrolled', window.scrollY > 16);
    refreshMobileBuyBarVisibility();
  };

  window.addEventListener('scroll', onViewportChange, {passive:true});
  window.addEventListener('resize', onViewportChange, {passive:true});
  window.addEventListener('popstate', () => requestAnimationFrame(onViewportChange));
  requestAnimationFrame(enhanceProduct);
})();
