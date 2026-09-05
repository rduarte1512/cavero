(() => {
  const CAVERO_CUSTOMER_REVIEWS = {
    chronos: [],
    ocean: [],
    velocity: [],
    prestige: [],
    apex: [
      {
        name: 'Cliente CAVERO',
        variant: 'Prateado e Azul',
        rating: null,
        verified: false,
        title: 'Ao vivo ainda fica melhor',
        text: 'O Apex chamou-me logo a atenção pelo design diferente, mas ao vivo ainda fica melhor. O azul do mostrador combina mesmo bem com o acabamento prateado e no pulso tem uma presença brutal. Estou muito satisfeito com a compra.',
        photo: 'assets/reviews/apex-customer-01.jpg',
        date: ''
      }
    ]
  };

  function reviewCard(r){
    const hasRating = Number.isFinite(Number(r.rating)) && Number(r.rating) >= 1 && Number(r.rating) <= 5;
    const rating = hasRating ? Math.round(Number(r.rating)) : null;
    const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5-rating) : '';
    const badge = r.verified
      ? '<span class="verified-badge">✓ Compra verificada</span>'
      : '<span class="customer-badge">Cliente CAVERO</span>';

    return `<article class="review-card ${r.photo?'review-card-with-photo':''}">
      ${r.photo ? `<img class="review-photo" src="${r.photo}" alt="Foto do cliente com o relógio CAVERO"><div class="review-photo-label">Foto do cliente</div>` : ''}
      ${rating ? `<div class="review-stars" aria-label="${rating} em 5">${stars}</div>` : `<div class="review-rating-pending">Classificação não indicada</div>`}
      <b class="review-title">${r.title||'Avaliação de cliente'}</b>
      <p class="review-text">${r.text||''}</p>
      <div class="review-meta"><div><b>${r.name||'Cliente CAVERO'}</b><small>${r.variant ? r.variant : ''}${r.date ? ' · '+r.date : ''}</small></div>${badge}</div>
    </article>`;
  }

  function reviewsMarkup(f){
    const reviews = CAVERO_CUSTOMER_REVIEWS[f.key] || [];
    const count = reviews.length;
    const verifiedCount = reviews.filter(r=>r.verified).length;
    const intro = count
      ? `${count} ${count===1?'opinião de cliente':'opiniões de clientes'} sobre este modelo.`
      : 'Ainda não existem avaliações de clientes deste modelo.';

    return `<section class="customer-reviews-section">
      <div class="reviews-head">
        <div>
          <div class="eyebrow">AVALIAÇÕES DE CLIENTES</div>
          <h2>Vê o CAVERO no pulso de quem comprou.</h2>
          <p>${intro} Aqui mostramos feedback e fotografias recebidas de clientes, identificando a variante sempre que possível.</p>
        </div>
        <div class="reviews-trust-note"><span class="shield">✓</span><div><b>Feedback de clientes</b><span>${verifiedCount ? `${verifiedCount} ${verifiedCount===1?'avaliação está marcada':'avaliações estão marcadas'} como compra verificada.` : 'As avaliações só recebem o selo “Compra verificada” quando a encomenda estiver confirmada.'}</span></div></div>
      </div>
      ${count ? `<div class="review-grid">${reviews.map(reviewCard).join('')}</div>` : `<div class="reviews-empty">
        <div class="reviews-empty-card"><div class="empty-stars">☆☆☆☆☆</div><h3>Sê dos primeiros a avaliar o ${f.name}.</h3><p>Assim que existirem opiniões de compradores, esta área passa a mostrar comentário, acabamento escolhido e — quando enviado pelo cliente — fotografias do relógio em utilização.</p></div>
        <div class="reviews-empty-points">
          <article><span>01</span><div><b>Compra verificada</b><p>O selo só aparece quando a avaliação estiver associada a uma encomenda confirmada.</p></div></article>
          <article><span>02</span><div><b>Foto do cliente</b><p>Fotografias ajudam outros compradores a perceber melhor como o relógio fica no pulso.</p></div></article>
          <article><span>03</span><div><b>Variante identificada</b><p>Cor e acabamento ficam indicados sempre que essa informação estiver disponível.</p></div></article>
        </div>
      </div>`}
      <div class="reviews-policy"><span>✓ Feedback de clientes</span><span>✓ Fotos recebidas</span><span>✓ Variante identificada</span><span>✓ Verificação quando confirmada</span></div>
    </section>`;
  }

  function renderReviews(){
    const f = typeof activeFamily !== 'undefined' ? activeFamily : window.activeFamily;
    if(!f) return;
    const shell = document.querySelector('#productView .product-shell');
    if(!shell || shell.querySelector('.customer-reviews-section')) return;
    const related = shell.querySelector('.related-section');
    const wrap = document.createElement('div');
    wrap.innerHTML = reviewsMarkup(f);
    const section = wrap.firstElementChild;
    if(related) shell.insertBefore(section, related);
    else shell.appendChild(section);
  }

  const baseOpenProduct = window.openProduct;
  if(typeof baseOpenProduct === 'function'){
    window.openProduct = function(key){
      baseOpenProduct(key);
      requestAnimationFrame(renderReviews);
    };
  }
})();
