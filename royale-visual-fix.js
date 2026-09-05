(() => {
  const royale = familyMap?.get?.('royale');
  if (!royale) return;

  function refreshHomeCovers(){
    const clean = royale.cleanImage;
    if (!clean) return;
    document.querySelectorAll('#featuredGrid img[alt^="CAVERO Royale"], #grid img[alt^="CAVERO Royale"]').forEach(img => {
      img.src = clean;
    });
    const hero = document.getElementById('heroImage');
    if (hero) hero.src = clean;
  }

  const baseOpenProduct = window.openProduct;
  if (typeof baseOpenProduct === 'function') {
    window.openProduct = function(key){
      document.body.classList.toggle('royale-product', key === 'royale');
      baseOpenProduct(key);
    };
  }

  const baseShowHome = window.showHome;
  if (typeof baseShowHome === 'function') {
    window.showHome = function(){
      document.body.classList.remove('royale-product');
      baseShowHome();
      requestAnimationFrame(refreshHomeCovers);
    };
  }

  /* The lightbox is created dynamically by app-a.js. Mark it whenever a
     Royale photo is enlarged so the same supplier-tag cleanup is applied. */
  const baseOpenLightbox = window.openLightbox;
  if (typeof baseOpenLightbox === 'function') {
    window.openLightbox = function(src){
      baseOpenLightbox(src);
      requestAnimationFrame(() => {
        const lb = document.getElementById('imageLightbox');
        if (!lb) return;
        lb.classList.toggle('royale-image-lightbox', document.body.classList.contains('royale-product'));
      });
    };
  }

  requestAnimationFrame(refreshHomeCovers);
})();
