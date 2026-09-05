(() => {
  // Add ONLY genuine customer reviews here. Keeping this empty avoids presenting
  // invented testimonials as if they were real buyers.
  const CAVERO_VERIFIED_REVIEWS = {
    chronos: [],
    ocean: [],
    velocity: [],
    prestige: [],
    apex: []
  };

  function reviewCard(r){
    const stars = '★'.repeat(Math.max(1,Math.min(5,Number(r.rating)||5))) + '☆'.repeat(Math.max(0,5-(Number(r.rating)||5)));
    return `<article class="review-card">
      ${r.photo ? `<img class="review-photo" src="${r.photo}" alt="Foto enviada pelo cliente"><div class="review-photo-label">Foto enviada pelo cliente · uso autorizado</div>` : ''}
      <div class="review-stars" aria-label="${r.rating||5} em 5">${stars}</div>
      <b class="review-title">${r.title||'Avaliação de cliente'}</b>
      <p class="review-text">${r.text||''}</p>
      <div class="review-meta"><div><b>${r.name||'Cliente CAVERO'}</b><small>${r.variant ? r.variant+' · ' : ''}${r.date||''}</small></div><span class="verified-badge">✓ Compra verificada</span></div>
    </article>`;
  }

  function reviewsMarkup(f){
    const reviews = CAVERO_VERIFIED_REVIEWS[f.key] || [];
    const count = reviews.length;
    const intro = count
      ? `${count} ${count===1?'opinião verificada':'opiniões verificadas'} sobre este modelo.`
      : 'Ainda não existem avaliações verificadas deste modelo.';

    return `<section class="customer-reviews-section">
      <div class="reviews-head">
        <div>
          <div class="eyebrow">AVALIAÇÕES DE CLIENTES</div>
          <h2>Opiniões reais, sem atalhos.</h2>
          <p>${intro} A CAVERO só deve publicar feedback de compradores reais, com a variante identificada quando possível.</p>
        </div>
        <div class="reviews-trust-note"><span class="shield">✓</span><div><b>Política de avaliações verificadas</b><span>Sem testemunhos inventados, sem compradores fictícios e sem fotos apresentadas como UGC quando não são de clientes reais.</span></div></div>
      </div>
      ${count ? `<div class="review-grid">${reviews.map(reviewCard).join('')}</div>` : `<div class="reviews-empty">
        <div class="reviews-empty-card"><div class="empty-stars">☆☆☆☆☆</div><h3>Sê dos primeiros a avaliar o ${f.name}.</h3><p>Assim que existirem opiniões de compradores reais, esta área passa a mostrar classificação, comentário, acabamento escolhido e — quando autorizado — fotografias enviadas pelo próprio cliente.</p></div>
        <div class="reviews-empty-points">
          <article><span>01</span><div><b>Compra verificada</b><p>A avaliação só deve aparecer como verificada quando estiver associada a uma encomenda real.</p></div></article>
          <article><span>02</span><div><b>Foto autorizada</b><p>Fotos no pulso podem ser usadas quando forem enviadas pelo cliente e houver autorização para publicação.</p></div></article>
          <article><span>03</span><div><b>Variante identificada</b><p>Cor e acabamento ajudam outros compradores a perceber melhor o produto que estão a ver.</p></div></article>
        </div>
      </div>`}
      <div class="reviews-policy"><span>✓ Só feedback real</span><span>✓ Fotos com autorização</span><span>✓ Variante identificada</span><span>✓ Sem avaliações falsas</span></div>
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
