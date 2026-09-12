(() => {
  const baseOpenProduct = window.openProduct;
  const baseSelectVariant = window.selectVariant;
  const baseShowHome = window.showHome;
  const mobileQuery = window.matchMedia('(max-width: 700px)');
  const SUPPORT_EMAIL = 'caverowatches@sapo.pt';

  const PRODUCT_FAQ = {
    chronos: [
      ['Para quem foi pensado o CAVERO Chronos?', 'O Chronos é indicado para quem procura uma estética cronográfica mais expressiva, com presença forte no pulso e várias opções de acabamento para adaptar o relógio ao estilo pessoal.'],
      ['O Chronos tem resistência à água?', 'Sim. Para o CAVERO Chronos está indicada uma resistência à água de 3 ATM. Recomendamos respeitar os limites próprios desta classificação e evitar utilização em natação ou mergulho.']
    ],
    velocity: [
      ['Que tipo de estilo combina com o CAVERO Velocity?', 'O Velocity foi pensado para um visual sport chrono contemporâneo. Combina especialmente bem com looks urbanos, casuais e coordenados em que o relógio deve ter uma presença mais técnica.'],
      ['O Velocity tem resistência à água?', 'Sim. Para o CAVERO Velocity está indicada uma resistência à água de 3 ATM. Recomendamos respeitar os limites próprios desta classificação e evitar utilização em natação ou mergulho.']
    ],
    apex: [
      ['O que distingue o CAVERO Apex?', 'O Apex diferencia-se sobretudo pela caixa octogonal e pela linguagem visual mais geométrica. É uma opção para quem prefere um relógio moderno, limpo e diferente dos modelos redondos tradicionais.'],
      ['Qual é o tamanho aproximado do Apex?', 'A caixa do CAVERO Apex tem aproximadamente 42 mm. A bracelete metálica é ajustável, permitindo adaptar o relógio ao pulso através da remoção de elos.']
    ],
    prestige: [
      ['Para que ocasiões é indicado o CAVERO Prestige?', 'O Prestige tem uma leitura mais clássica e discreta. É uma escolha especialmente adequada para trabalho, jantares, eventos, camisa, blazer e looks smart casual.'],
      ['Posso escolher diferentes acabamentos no Prestige?', 'Sim. A página apresenta as variantes disponíveis e atualiza a fotografia, referência e preço quando escolhes um acabamento diferente.']
    ],
    ocean: [
      ['Que perfil tem o CAVERO Ocean?', 'O Ocean aposta numa estética mais desportiva e descontraída. É indicado para quem procura um relógio de utilização casual, com diferentes cores e versões dentro da mesma família.'],
      ['As características são iguais em todas as versões Ocean?', 'Não necessariamente. As dimensões, bracelete e outros detalhes podem variar entre versões. A informação apresentada na página deve ser lida de acordo com a variante escolhida.']
    ],
    mariner: [
      ['O que distingue o CAVERO Mariner?', 'O Mariner apresenta uma estética metálica mais clássica, com mostrador limpo e uma presença pensada para funcionar tanto no dia a dia como em ocasiões mais cuidadas.'],
      ['Como escolho o acabamento do Mariner?', 'Seleciona a variante diretamente na página. A fotografia principal, a referência e o preço acompanham a escolha para confirmares exatamente a versão que vais adicionar ao saco.']
    ]
  };

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
    if(!detail) return;
    const buyRow = detail.querySelector('.buyrow');
    if(!buyRow) return;

    let panel = detail.querySelector('.purchase-confidence');
    if(!panel){
      panel = document.createElement('div');
      panel.className = 'purchase-confidence';
      panel.setAttribute('aria-label', 'Garantia, devolução e entrega');
      const shippingNote = detail.querySelector('.buy-shipping-note');
      if(shippingNote) shippingNote.insertAdjacentElement('afterend', panel);
      else buyRow.insertAdjacentElement('afterend', panel);
    }
    if(panel.dataset.caveroWarrantyVersion === '2') return;
    panel.dataset.caveroWarrantyVersion = '2';
    panel.innerHTML = `
      <div class="purchase-confidence-item purchase-confidence-warranty"><span aria-hidden="true">✓</span><div><small>GARANTIA CAVERO</small><b>2 anos · mecanismo</b></div></div>
      <div class="purchase-confidence-item"><span aria-hidden="true">↩</span><div><small>DEVOLUÇÃO</small><b>até 14 dias</b></div></div>
      <div class="purchase-confidence-item"><span aria-hidden="true">→</span><div><small>ENTREGA ESTIMADA</small><b>5–13 dias</b></div></div>`;

    if(!detail.querySelector('.mechanism-warranty-note')){
      const note = document.createElement('div');
      note.className = 'mechanism-warranty-note';
      note.innerHTML = `<strong>2 anos de garantia CAVERO sobre o mecanismo.</strong> Cobre avarias e falhas relacionadas com o mecanismo do relógio. Guarda a fatura ou o comprovativo de compra e, se precisares de assistência, envia um email para <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>. A equipa CAVERO trata do processo de assistência e da troca do relógio ao abrigo desta garantia comercial. <small>Esta garantia comercial é adicional e não reduz os direitos legais do consumidor aplicáveis à compra.</small>`;
      panel.insertAdjacentElement('afterend', note);
    }
  }

  function ensureConversionNote(){
    const detail = document.querySelector('#productView .detail');
    if(!detail || detail.querySelector('.conversion-note')) return;
    const note = document.createElement('div');
    note.className = 'conversion-note';
    note.innerHTML = '<span>Envio grátis</span><span>Compra protegida</span><span>Apoio pós-venda</span>';
    const subtitle = detail.querySelector('.product-subtitle');
    if(subtitle) subtitle.insertAdjacentElement('afterend', note);
  }

  function ensureWhatYouReceive(){
    const f = currentFamily();
    const shell = document.querySelector('#productView .product-shell');
    const productPage = shell?.querySelector('.product-page');
    if(!f || !shell || !productPage || shell.querySelector('.what-you-receive-section')) return;

    const section = document.createElement('section');
    section.className = 'what-you-receive-section product-conversion-section';
    section.innerHTML = `
      <div class="product-conversion-heading">
        <div class="eyebrow">INCLUÍDO NA TUA ENCOMENDA</div>
        <h2>O que recebes</h2>
        <p>Uma compra simples, com a variante escolhida claramente identificada e apoio CAVERO depois da entrega.</p>
      </div>
      <div class="what-you-receive-grid">
        <article><span>01</span><div><h3>${f.name}</h3><p>1 relógio no acabamento que selecionaste antes de adicionar ao saco.</p></div></article>
        <article><span>02</span><div><h3>Pulseira CAVERO de oferta</h3><p>A pulseira de oferta apresentada no checkout é incluída na encomenda sem custo adicional.</p></div></article>
        <article><span>03</span><div><h3>Comprovativo de compra</h3><p>Guarda a fatura ou o comprovativo da encomenda: é o documento necessário para ativar o apoio de garantia.</p></div></article>
        <article><span>04</span><div><h3>Apoio pós-venda</h3><p>Para qualquer questão sobre a encomenda ou a garantia, contacta <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p></div></article>
      </div>`;
    productPage.insertAdjacentElement('afterend', section);
  }

  function faqItemsFor(f){
    const specific = PRODUCT_FAQ[f.key] || [
      [`O que devo saber antes de comprar o ${f.name}?`, `Confirma o acabamento selecionado, o preço, as fotografias e a informação técnica apresentada nesta página antes de adicionares o ${f.name} ao saco.`],
      [`Posso escolher a variante do ${f.name}?`, 'Sim. A imagem, referência e preço são atualizados de acordo com a variante que selecionares.']
    ];
    return [
      ...specific,
      ['Como funciona a garantia de 2 anos do mecanismo?', `A garantia comercial CAVERO cobre durante 2 anos avarias e falhas relacionadas com o mecanismo do relógio. Guarda a fatura ou o comprovativo de compra e contacta ${SUPPORT_EMAIL}; a equipa trata da assistência e da troca do relógio ao abrigo desta garantia. Esta cobertura comercial não reduz os direitos legais do consumidor.`],
      ['Posso devolver o relógio?', 'Nas compras online existe, em regra, um período de 14 dias para exercer o direito de livre resolução, sujeito às condições e exceções legais e à política de devoluções da loja.'],
      ['Quanto tempo demora a entrega?', 'A entrega estimada indicada pela CAVERO é de 5 a 13 dias. O envio normal apresentado na loja é gratuito e o estado da encomenda pode ser acompanhado através das atualizações enviadas ao cliente.']
    ];
  }

  function ensureProductFaq(){
    const f = currentFamily();
    const shell = document.querySelector('#productView .product-shell');
    const related = shell?.querySelector('.related-section');
    if(!f || !shell || shell.querySelector('.product-specific-faq')) return;

    const items = faqItemsFor(f);
    const section = document.createElement('section');
    section.className = 'product-specific-faq product-conversion-section';
    section.innerHTML = `
      <div class="product-conversion-heading">
        <div class="eyebrow">PERGUNTAS SOBRE ${f.name.replace(/^CAVERO\s+/i,'').toUpperCase()}</div>
        <h2>Antes de comprares</h2>
        <p>As respostas essenciais sobre este modelo, entrega, devolução e apoio pós-venda.</p>
      </div>
      <div class="product-faq-list">
        ${items.map(([question, answer], index) => `<details ${index === 0 ? 'open' : ''}><summary>${question}</summary><p>${answer}</p></details>`).join('')}
      </div>
      <div class="product-support-box"><div><strong>Precisas de ajuda antes ou depois da compra?</strong><span>Apoio CAVERO por email para produto, encomenda e garantia.</span></div><a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></div>`;
    if(related) related.insertAdjacentElement('beforebegin', section);
    else shell.appendChild(section);
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
    ensureWhatYouReceive();
    ensureProductFaq();
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
