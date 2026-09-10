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
      .mariner-review-card{grid-column:1/-1;min-height:0;padding:22px}
      .mariner-review-photo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 12px}
      .mariner-review-photo-grid.four{grid-template-columns:repeat(4,minmax(0,1fr))}
      .mariner-review-photo-grid .review-photo{width:100%;height:auto;min-height:0;aspect-ratio:3/4;object-fit:cover;object-position:center;border-radius:16px;margin:0;background:#f2ede5}
      .mariner-review-card .review-photo-label{margin:0 0 12px}
      .mariner-review-card .review-meta{margin-top:18px}
      @media(max-width:900px){
        .mariner-review-photo-grid.four{grid-template-columns:repeat(2,minmax(0,1fr))}
      }
      @media(max-width:700px){
        .mariner-review-card{padding:16px}
        .mariner-review-photo-grid,.mariner-review-photo-grid.four{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
        .mariner-review-photo-grid .review-photo{border-radius:12px}
      }
    `;
    document.head.appendChild(style);
  }

  function isMarinerProduct(){
    if(typeof activeFamily !== 'undefined' && activeFamily?.key) return activeFamily.key === 'mariner';
    return location.pathname.replace(/\/+$/,'') === '/cavero-mariner';
  }

  function addMarinerReviews(){
    if(!isMarinerProduct()) return;
    const section = document.querySelector('#productView .customer-reviews-section');
    if(!section || section.dataset.marinerReviews === 'true') return;
    section.dataset.marinerReviews = 'true';
    ensureMarinerReviewStyles();

    const intro = section.querySelector('.reviews-head > div > p');
    if(intro) intro.textContent = '2 opiniões de clientes sobre este modelo. Aqui mostramos feedback e fotografias recebidas de clientes, identificando a variante sempre que possível.';
    const trust = section.querySelector('.reviews-trust-note div span');
    if(trust) trust.textContent = '2 avaliações estão marcadas como compra verificada.';

    const empty = section.querySelector('.reviews-empty');
    if(!empty) return;
    empty.outerHTML = `<div class="review-grid mariner-review-grid">
      <article class="review-card mariner-review-card mariner-claudio-review">
        <div class="mariner-review-photo-grid" aria-label="3 fotos enviadas pelo cliente Cláudio">
          <img class="review-photo" src="assets/reviews/mariner-claudio-01.jpg" alt="CAVERO Mariner no pulso do cliente Cláudio" loading="lazy">
          <img class="review-photo" src="assets/reviews/mariner-claudio-02.jpg" alt="CAVERO Mariner na mão do cliente Cláudio" loading="lazy">
          <img class="review-photo" src="assets/reviews/mariner-claudio-03.jpg" alt="Parte traseira do CAVERO Mariner enviada pelo cliente Cláudio" loading="lazy">
        </div>
        <div class="review-photo-label">3 fotos do cliente</div>
        <div class="review-stars" aria-label="5 em 5">★★★★★</div>
        <b class="review-title">Relógio maravilhoso!</b>
        <p class="review-text">Relógio maravilhoso! Tem um peso agradável, ajusta-se bem ao meu pulso após remover alguns elos e, no geral, parece ser uma peça sofisticada sem custar uma fortuna.</p>
        <div class="review-meta"><div><b>Cláudio</b><small>CAVERO Mariner · Prateado e Branco</small></div><span class="verified-badge">✓ Compra verificada</span></div>
      </article>

      <article class="review-card mariner-review-card mariner-private-review">
        <div class="mariner-review-photo-grid four" aria-label="4 fotos enviadas por cliente com nome privado">
          <img class="review-photo" src="assets/reviews/mariner-private-01.jpg" alt="Fecho e bracelete do CAVERO Mariner no pulso" loading="lazy">
          <img class="review-photo" src="assets/reviews/mariner-private-02.jpg" alt="Fecho do CAVERO Mariner fotografado pelo cliente" loading="lazy">
          <img class="review-photo" src="assets/reviews/mariner-private-03.jpg" alt="CAVERO Mariner e acessórios recebidos pelo cliente" loading="lazy">
          <img class="review-photo" src="assets/reviews/mariner-private-04.jpg" alt="CAVERO Mariner no pulso do cliente" loading="lazy">
        </div>
        <div class="review-photo-label">4 fotos do cliente</div>
        <div class="review-stars" aria-label="5 em 5">★★★★★</div>
        <b class="review-title">Material de qualidade e luxo</b>
        <p class="review-text">Muito top, material de qualidade e luxo.</p>
        <div class="review-meta"><div><b>Privado</b><small>CAVERO Mariner · Prateado e Branco</small></div><span class="verified-badge">✓ Compra verificada</span></div>
      </article>
    </div>`;
  }

  function process(root=document){
    fixImages(root);
    addMarinerReviews();
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
    if(shouldProcess) requestAnimationFrame(addMarinerReviews);
  }).observe(document.body, {childList:true, subtree:true});
})();
