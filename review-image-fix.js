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
      .mariner-review-grid{grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}
      .mariner-review-card{min-width:0;min-height:0;padding:22px}
      .mariner-review-photo-grid,.mariner-review-photo-grid.four{display:grid;grid-template-columns:repeat(2,minmax(0,160px));justify-content:start;gap:10px;margin:0 0 14px}
      .mariner-review-photo-button{display:flex;align-items:center;justify-content:center;position:relative;min-width:0;width:100%;height:180px;padding:6px;border:1px solid #e8e2d9;border-radius:12px;background:#f7f4ee;cursor:zoom-in;overflow:hidden}
      .mariner-review-photo-button:focus-visible{outline:3px solid #9b7740;outline-offset:3px}
      .mariner-review-photo-grid .review-photo{display:block;width:auto;height:auto;max-width:100%;max-height:100%;min-height:0;aspect-ratio:auto;object-fit:contain;border-radius:6px;margin:0;background:transparent}
      .mariner-review-card .review-photo-label{margin:0 0 16px;font-size:11px;line-height:1.5;text-transform:none;letter-spacing:0}
      .mariner-review-card .review-text{font-size:14px}
      .mariner-review-card .review-meta{margin-top:18px;flex-wrap:wrap}
      .mariner-review-viewer{width:fit-content;max-width:calc(100vw - 32px);max-height:90vh;max-height:90dvh;padding:16px;border:1px solid #e8e2d9;border-radius:18px;background:#fffdf9;color:#191714;overflow:auto}
      .mariner-review-viewer::backdrop{background:rgba(10,12,14,.82)}
      .mariner-review-viewer img{display:block;width:auto;height:auto;max-width:100%;max-height:65vh;max-height:65dvh;object-fit:contain;margin:12px auto}
      .mariner-review-viewer-controls{display:flex;align-items:center;justify-content:space-between;gap:12px}
      .mariner-review-viewer button{min-width:44px;min-height:44px;border:1px solid #ded8ce;border-radius:10px;background:white;color:#191714;cursor:pointer;padding:8px 12px}
      .mariner-review-viewer button:focus-visible{outline:3px solid #9b7740;outline-offset:2px}
      .mariner-review-viewer p{font-size:13px;line-height:1.5;max-width:340px}
      @media(max-width:900px){.mariner-review-grid{grid-template-columns:1fr}}
      @media(max-width:700px){
        .mariner-review-card{padding:16px}
        .mariner-review-photo-grid,.mariner-review-photo-grid.four{gap:8px}
        .mariner-review-photo-button{height:160px}
      }
    `;
    document.head.appendChild(style);
  }

  function prepareMarinerGalleries(section){
    section.querySelectorAll('.mariner-review-photo-grid').forEach(grid => {
      const photos = [...grid.querySelectorAll('img')];
      photos.forEach((img, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mariner-review-photo-button';
        button.setAttribute('aria-label', `Abrir fotografia ${index + 1} de ${photos.length}: ${img.alt}`);
        button.setAttribute('aria-haspopup', 'dialog');
        img.decoding = 'async';
        img.replaceWith(button);
        button.appendChild(img);
        button.addEventListener('click', () => openMarinerPhoto(photos, index));
      });
      grid.nextElementSibling.textContent = `${photos.length} fotos do cliente · Toque numa foto para ver`;
    });
  }

  function openMarinerPhoto(photos, initialIndex){
    const dialog = document.createElement('dialog');
    dialog.className = 'mariner-review-viewer';
    dialog.setAttribute('aria-label', 'Fotografias do cliente');
    dialog.innerHTML = `<div class="mariner-review-viewer-controls"><span aria-live="polite"></span><button type="button" data-close aria-label="Fechar fotografias">Fechar ✕</button></div><img><p></p><div class="mariner-review-viewer-controls"><button type="button" data-prev aria-label="Fotografia anterior">← Anterior</button><button type="button" data-next aria-label="Fotografia seguinte">Seguinte →</button></div>`;
    let index = initialIndex;
    const show = step => {
      index = (index + step + photos.length) % photos.length;
      const image = dialog.querySelector('img');
      image.src = photos[index].currentSrc || photos[index].src;
      image.alt = photos[index].alt;
      dialog.querySelector('p').textContent = image.alt;
      dialog.querySelector('[aria-live]').textContent = `${index + 1} / ${photos.length}`;
    };
    dialog.querySelector('[data-close]').onclick = () => dialog.close();
    dialog.querySelector('[data-prev]').onclick = () => show(-1);
    dialog.querySelector('[data-next]').onclick = () => show(1);
    dialog.addEventListener('keydown', event => {
      if(event.key === 'ArrowLeft' || event.key === 'ArrowRight'){
        event.preventDefault();
        show(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    dialog.addEventListener('click', event => {
      if(event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if(event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    const previousOverflow = document.body.style.overflow;
    dialog.addEventListener('close', () => {
      document.body.style.overflow = previousOverflow;
      dialog.remove();
    }, {once:true});
    document.body.appendChild(dialog);
    show(0);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
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
    prepareMarinerGalleries(section);
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
