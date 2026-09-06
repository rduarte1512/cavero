// Keep cart copy aligned with the five-model catalog after CAVERO Royale removal.
const baseUpdateCartForCatalog = updateCart;
updateCart = function(){
  baseUpdateCartForCatalog();
  const empty = document.querySelector('.empty-cart span');
  if (empty && empty.textContent.includes('seis modelos')) {
    empty.textContent = 'Escolhe um dos cinco modelos CAVERO.';
  }
};
updateCart();

// Load the CAVERO bracelet gift experience without changing the base page bundle order.
if (!document.querySelector('link[data-bracelet-gift-css]')) {
  const giftCss = document.createElement('link');
  giftCss.rel = 'stylesheet';
  giftCss.href = '/bracelet-gift.css?v=1';
  giftCss.dataset.braceletGiftCss = 'true';
  document.head.appendChild(giftCss);
}
if (!document.querySelector('script[data-bracelet-gift-js]')) {
  const giftScript = document.createElement('script');
  giftScript.src = '/bracelet-gift.js?v=1';
  giftScript.async = false;
  giftScript.dataset.braceletGiftJs = 'true';
  document.body.appendChild(giftScript);
}
