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

  requestAnimationFrame(refreshHomeCovers);
})();
