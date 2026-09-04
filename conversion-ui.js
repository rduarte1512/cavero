(() => {
  const baseOpenProduct = window.openProduct;
  const baseSelectVariant = window.selectVariant;
  const baseShowHome = window.showHome;

  function ensureMobileBuyBar(){
    if(!window.activeFamily && typeof activeFamily === 'undefined') return;
    const f = typeof activeFamily !== 'undefined' ? activeFamily : window.activeFamily;
    if(!f) return;
    const v = typeof selectedVariant === 'function' ? selectedVariant() : null;
    if(!v) return;

    let bar = document.getElementById('mobileBuyBar');
    if(!bar){
      bar = document.createElement('div');
      bar.id = 'mobileBuyBar';
      bar.className = 'mobile-buy-bar';
      bar.innerHTML = `
        <div class="mobile-buy-copy">
          <small id="mobileBuyVariant"></small>
          <b id="mobileBuyPrice"></b>
        </div>
        <button type="button" onclick="addSelectedVariant()">Adicionar · envio grátis</button>`;
      document.body.appendChild(bar);
    }
    const variant = document.getElementById('mobileBuyVariant');
    const price = document.getElementById('mobileBuyPrice');
    if(variant) variant.textContent = `${f.name} · ${v.name}`;
    if(price) price.textContent = `${money(v.price)} · envio grátis`;
    bar.style.display = '';
  }

  function hideMobileBuyBar(){
    const bar = document.getElementById('mobileBuyBar');
    if(bar) bar.style.display = 'none';
  }

  if(typeof baseOpenProduct === 'function'){
    window.openProduct = function(key){
      baseOpenProduct(key);
      requestAnimationFrame(() => {
        ensureMobileBuyBar();
        const detail = document.querySelector('#productView .detail');
        if(detail && !detail.querySelector('.conversion-note')){
          const note = document.createElement('div');
          note.className = 'conversion-note';
          note.innerHTML = '<span>Envio grátis</span><span>Fotografias reais</span><span>Preço promocional visível</span>';
          const subtitle = detail.querySelector('.product-subtitle');
          if(subtitle) subtitle.insertAdjacentElement('afterend', note);
        }
      });
    };
  }

  if(typeof baseSelectVariant === 'function'){
    window.selectVariant = function(index){
      baseSelectVariant(index);
      requestAnimationFrame(ensureMobileBuyBar);
    };
  }

  if(typeof baseShowHome === 'function'){
    window.showHome = function(){
      hideMobileBuyBar();
      baseShowHome();
    };
  }

  const originalCheckout = window.goCheckout;
  if(typeof originalCheckout === 'function'){
    window.goCheckout = function(){
      hideMobileBuyBar();
      return originalCheckout();
    };
  }

  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if(header) header.classList.toggle('scrolled', window.scrollY > 16);
  }, {passive:true});
})();
