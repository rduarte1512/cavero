(() => {
  const GIFT_IMAGE = '/assets/bracelet-gift.webp';

  function homeGiftStrip(){
    const hero=document.getElementById('premiumHero');
    if(!hero || document.querySelector('.cavero-gift-strip')) return;
    hero.insertAdjacentHTML('afterend',`<section class="cavero-gift-strip" aria-label="Oferta pulseira CAVERO">
      <div class="cavero-gift-strip-inner">
        <img class="cavero-gift-strip-image" src="${GIFT_IMAGE}" alt="Pulseira de oferta CAVERO">
        <div class="cavero-gift-strip-copy"><small>OFERTA CAVERO</small><h2>Compra um relógio e recebe esta pulseira grátis.</h2><p>A pulseira é incluída na tua encomenda sem custo adicional. Manténs também o envio gratuito em toda a compra.</p></div>
        <a class="cavero-gift-strip-cta" href="/catalogo">Escolher relógio →</a>
      </div>
    </section>`);
  }

  function productGiftPanel(){
    const detail=document.querySelector('#productView .detail');
    if(!detail || detail.querySelector('.product-gift-panel')) return;
    const buyrow=detail.querySelector('.buyrow');
    if(!buyrow) return;
    buyrow.insertAdjacentHTML('beforebegin',`<div class="product-gift-panel">
      <img src="${GIFT_IMAGE}" alt="Pulseira CAVERO incluída como oferta">
      <div><small>🎁 OFERTA INCLUÍDA</small><h3>Pulseira CAVERO grátis com este relógio.</h3><p>Ao comprares este modelo, a pulseira é incluída na encomenda por <strong>0,00 €</strong>. Não altera o total e o envio continua gratuito.</p></div>
    </div>`);
  }

  function cartGift(){
    const items=document.getElementById('cartItems');
    if(!items || !items.querySelector('.cartitem') || items.querySelector('.cart-gift-item')) return;
    const firstItem=items.querySelector('.cartitem');
    firstItem.insertAdjacentHTML('beforebegin',`<div class="cart-gift-item">
      <img src="${GIFT_IMAGE}" alt="Pulseira CAVERO grátis">
      <div><span class="cart-gift-label">🎁 Oferta incluída</span><b>Pulseira CAVERO</b><small>Incluída com a compra do relógio · Qtd. 1</small></div>
      <div class="cart-gift-price"><b>GRÁTIS</b><s>0,00 €</s></div>
    </div>`);
    const note=document.querySelector('#cartFoot .checkout-note');
    if(note && !note.dataset.giftCopy){note.innerHTML='<strong>🎁 Pulseira grátis incluída.</strong> 0,00 € de portes e nenhum custo adicional pelo brinde.';note.dataset.giftCopy='1'}
  }

  function checkoutGift(){
    const panel=document.querySelector('#checkoutView .order-panel');
    if(!panel || panel.querySelector('.checkout-gift-item')) return;
    const anchor=panel.querySelector('.checkout-saved,.checkout-shipping-row,.total');
    const html=`<div class="checkout-gift-item"><img src="${GIFT_IMAGE}" alt="Pulseira CAVERO grátis"><div><b>Pulseira CAVERO</b><small>Oferta incluída · Qtd. 1</small></div><div class="gift-free">GRÁTIS</div></div>`;
    if(anchor) anchor.insertAdjacentHTML('beforebegin',html); else panel.insertAdjacentHTML('beforeend',html);
  }

  function catalogGiftBadges(){
    document.querySelectorAll('.catalog-card').forEach(card=>card.setAttribute('data-gift','true'));
  }

  homeGiftStrip();

  if(typeof window.openProduct==='function'){
    const baseOpenProduct=window.openProduct;
    window.openProduct=function(...args){const result=baseOpenProduct.apply(this,args);productGiftPanel();return result};
    if(!document.getElementById('productView')?.classList.contains('hidden')) productGiftPanel();
  }

  if(typeof updateCart==='function'){
    const baseUpdateCart=updateCart;
    updateCart=function(...args){const result=baseUpdateCart.apply(this,args);cartGift();return result};
    updateCart();
  }

  if(typeof window.goCheckout==='function'){
    const baseGoCheckout=window.goCheckout;
    window.goCheckout=function(...args){const result=baseGoCheckout.apply(this,args);checkoutGift();return result};
  }

  const observer=new MutationObserver(()=>{catalogGiftBadges();productGiftPanel();cartGift();checkoutGift()});
  observer.observe(document.body,{childList:true,subtree:true});
})();
