(() => {
  const TARGET = 'assets/reviews/apex-customer-01.jpg';
  const SOURCE = 'assets/reviews/apex-customer-01-v3.b64?v=20260905-2';
  let dataUrlPromise = null;

  function getDataUrl(){
    if(!dataUrlPromise){
      dataUrlPromise = fetch(SOURCE, {cache:'no-store'})
        .then(r => {
          if(!r.ok) throw new Error('review image data unavailable');
          return r.text();
        })
        .then(text => `data:image/jpeg;base64,${text.replace(/\s+/g,'')}`)
        .catch(err => {
          console.warn('CAVERO review image:', err);
          return '';
        });
    }
    return dataUrlPromise;
  }

  function fixImages(root=document){
    const images = [...root.querySelectorAll?.(`img.review-photo[src="${TARGET}"]`) || []];
    if(!images.length) return;
    images.forEach(img => {
      img.style.visibility = 'hidden';
      img.removeAttribute('src');
      img.alt = 'Foto do cliente com o CAVERO Apex Prateado e Azul';
    });
    getDataUrl().then(src => {
      if(!src) return;
      images.forEach(img => {
        img.src = src;
        img.onload = () => { img.style.visibility = 'visible'; };
      });
    });
  }

  function ensureMarinerReviewStyles(){
    if(document.querySelector('style[data-mariner-review-style]')) return;
    const style = document.createElement('style');
    style.dataset.marinerReviewStyle = 'true';
    style.textContent = `
      .mariner-claudio-review{grid-column:1/-1;min-height:0;padding:22px}
      .mariner-review-photo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 12px}
      .mariner-review-photo-grid .review-photo{width:100%;height:auto;min-height:0;aspect-ratio:3/4;object-fit:cover;object-position:center;border-radius:16px;margin:0;background:#f2ede5}
      .mariner-claudio-review .review-photo-label{margin:0 0 12px}
      .mariner-claudio-review .review-meta{margin-top:18px}
      @media(max-width:700px){
        .mariner-claudio-review{padding:16px}
        .mariner-review-photo-grid{gap:6px}
        .mariner-review-photo-grid .review-photo{border-radius:12px}
      }
    `;
    document.head.appendChild(style);
  }

  function isMarinerProduct(){
    if(typeof activeFamily !== 'undefined' && activeFamily?.key) return activeFamily.key === 'mariner';
    return location.pathname.replace(/\/+$/,'') === '/cavero-mariner';
  }

  function addMarinerReview(){
    if(!isMarinerProduct()) return;
    const section = document.querySelector('#productView .customer-reviews-section');
    if(!section || section.dataset.marinerClaudioReview === 'true') return;
    section.dataset.marinerClaudioReview = 'true';
    ensureMarinerReviewStyles();

    const intro = section.querySelector('.reviews-head > div > p');
    if(intro) intro.textContent = '1 opinião de cliente sobre este modelo. Aqui mostramos feedback e fotografias recebidas de clientes, identificando a variante sempre que possível.';
    const trust = section.querySelector('.reviews-trust-note div span');
    if(trust) trust.textContent = '1 avaliação está marcada como compra verificada.';

    const empty = section.querySelector('.reviews-empty');
    if(!empty) return;
    empty.outerHTML = `<div class="review-grid mariner-review-grid">
      <article class="review-card mariner-claudio-review">
        <div class="mariner-review-photo-grid" aria-label="3 fotos enviadas pelo cliente Cláudio">
          <img class="review-photo" src="assets/reviews/mariner-claudio-01.jpg" alt="CAVERO Mariner no pulso do cliente Cláudio" loading="lazy">
          <img class="review-photo" src="assets/reviews/mariner-claudio-02.jpg" alt="CAVERO Mariner na mão do cliente Cláudio" loading="lazy">
          <img class="review-photo" src="assets/reviews/mariner-claudio-03.jpg" alt="Parte traseira do CAVERO Mariner enviada pelo cliente Cláudio" loading="lazy">
        </div>
        <div class="review-photo-label">3 fotos do cliente</div>
        <div class="review-rating-pending">Classificação não indicada</div>
        <b class="review-title">Relógio maravilhoso!</b>
        <p class="review-text">Relógio maravilhoso! Tem um peso agradável, ajusta-se bem ao meu pulso após remover alguns elos e, no geral, parece ser uma peça sofisticada sem custar uma fortuna.</p>
        <div class="review-meta"><div><b>Cláudio</b><small>CAVERO Mariner · Prateado e Branco</small></div><span class="verified-badge">✓ Compra verificada</span></div>
      </article>
    </div>`;
  }

  function process(root=document){
    fixImages(root);
    addMarinerReview();
  }

  process();
  new MutationObserver(mutations => {
    let shouldProcess = false;
    for(const mutation of mutations){
      for(const node of mutation.addedNodes){
        if(node.nodeType === 1){
          if(node.matches?.(`img.review-photo[src="${TARGET}"]`) || node.querySelector?.(`img.review-photo[src="${TARGET}"]`)) fixImages(node.parentElement || node);
          if(node.matches?.('.customer-reviews-section') || node.querySelector?.('.customer-reviews-section')) shouldProcess = true;
        }
      }
    }
    if(shouldProcess) requestAnimationFrame(addMarinerReview);
  }).observe(document.body, {childList:true, subtree:true});
})();
