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

// Make the featured section sound customer-facing instead of like internal marketing copy.
function updateFeaturedSectionCopy(){
  const section = document.getElementById('destaques');
  if (!section) return;
  const title = section.querySelector('.section-head h2');
  const copy = section.querySelector('.section-head > p');
  if (title) title.textContent = 'Três formas de marcar presença.';
  if (copy) copy.textContent = 'Descobre três estilos distintos da CAVERO, escolhidos para diferentes momentos e personalidades. Encontra o relógio e o acabamento que mais combinam contigo.';
}
updateFeaturedSectionCopy();
document.addEventListener('DOMContentLoaded', updateFeaturedSectionCopy, { once:true });

// Premium magnifying-glass search beside the cart.
if (!document.querySelector('link[data-header-search-css]')) {
  const searchCss = document.createElement('link');
  searchCss.rel = 'stylesheet';
  searchCss.href = '/header-search.css?v=1';
  searchCss.dataset.headerSearchCss = 'true';
  document.head.appendChild(searchCss);
}
if (!document.querySelector('script[data-header-search-js]')) {
  const searchScript = document.createElement('script');
  searchScript.src = '/header-search.js?v=1';
  searchScript.async = false;
  searchScript.dataset.headerSearchJs = 'true';
  document.body.appendChild(searchScript);
}

// Load the CAVERO bracelet gift experience without changing the base page bundle order.
if (!document.querySelector('link[data-bracelet-gift-css]')) {
  const giftCss = document.createElement('link');
  giftCss.rel = 'stylesheet';
  giftCss.href = '/bracelet-gift.css?v=2';
  giftCss.dataset.braceletGiftCss = 'true';
  document.head.appendChild(giftCss);
}

function loadBraceletGiftUI(){
  if (document.querySelector('script[data-bracelet-gift-js]')) return;
  const giftScript = document.createElement('script');
  giftScript.src = '/bracelet-gift.js?v=2';
  giftScript.async = false;
  giftScript.dataset.braceletGiftJs = 'true';
  document.body.appendChild(giftScript);
}

if (window.CAVERO_BRACELET_IMAGE) {
  loadBraceletGiftUI();
} else if (!document.querySelector('script[data-bracelet-image-data]')) {
  const imageDataScript = document.createElement('script');
  imageDataScript.src = '/bracelet-gift-image-data.js?v=2';
  imageDataScript.async = false;
  imageDataScript.dataset.braceletImageData = 'true';
  imageDataScript.onload = loadBraceletGiftUI;
  document.body.appendChild(imageDataScript);
} else {
  window.addEventListener('load', loadBraceletGiftUI, { once:true });
}
