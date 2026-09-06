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

// Surface genuine limited availability on the three featured models.
const CAVERO_LIMITED_STOCK_MODELS = ['cavero velocity','cavero apex','cavero chronos ice'];

function limitedStockMarkup(extraClass=''){
  return `<div class="cavero-stock-limited ${extraClass}"><span class="cavero-stock-dot"></span><strong>Stock limitado</strong><small>Disponibilidade reduzida</small></div>`;
}

function markFeaturedStockLimited(){
  document.querySelectorAll('#destaques .featured').forEach(card=>{
    if (card.querySelector('.cavero-stock-limited')) return;
    const body = card.querySelector('.body');
    const button = body?.querySelector('.mini');
    if (!body) return;
    if (button) button.insertAdjacentHTML('beforebegin', limitedStockMarkup('featured-stock-limited'));
    else body.insertAdjacentHTML('beforeend', limitedStockMarkup('featured-stock-limited'));
  });
}

function markProductStockLimited(){
  const detail = document.querySelector('#productView .detail');
  if (!detail) return;
  const productName = (detail.querySelector('h1')?.textContent || '').trim().toLowerCase();
  const existing = detail.querySelector('.product-stock-limited');
  const isLimited = CAVERO_LIMITED_STOCK_MODELS.includes(productName);
  if (!isLimited) {
    existing?.remove();
    return;
  }
  if (existing) return;
  const promo = detail.querySelector('#promoPanel, .promo-panel');
  if (promo) promo.insertAdjacentHTML('afterend', limitedStockMarkup('product-stock-limited'));
  else detail.querySelector('.buyrow')?.insertAdjacentHTML('beforebegin', limitedStockMarkup('product-stock-limited'));
}

function markCartStockLimited(){
  document.querySelectorAll('#cartItems .cartitem').forEach(item=>{
    const name = (item.querySelector('b')?.textContent || '').trim().toLowerCase();
    const existing = item.querySelector('.cart-stock-limited');
    const isLimited = CAVERO_LIMITED_STOCK_MODELS.includes(name);
    if (!isLimited) {
      existing?.remove();
      return;
    }
    if (existing) return;
    const info = item.children[1];
    if (info) info.insertAdjacentHTML('beforeend', limitedStockMarkup('cart-stock-limited'));
  });
}

function refreshLimitedStockUI(){
  markFeaturedStockLimited();
  markProductStockLimited();
  markCartStockLimited();
}

if (!document.getElementById('cavero-stock-limited-styles')) {
  const style = document.createElement('style');
  style.id = 'cavero-stock-limited-styles';
  style.textContent = `
    .cavero-stock-limited{display:flex;align-items:center;gap:7px;color:#9f3028;font-size:10px;letter-spacing:.055em;text-transform:uppercase;font-weight:800}
    .cavero-stock-dot{width:7px;height:7px;border-radius:50%;background:#a43028;box-shadow:0 0 0 4px rgba(164,48,40,.10);flex:0 0 auto}
    .cavero-stock-limited strong{font:inherit}
    .cavero-stock-limited small{color:#7d756d;font-size:9px;font-weight:650;letter-spacing:.035em;text-transform:none}
    .featured-stock-limited{margin:10px 0 12px}
    .product-stock-limited{width:max-content;max-width:100%;margin:10px 0 16px;padding:10px 13px;border:1px solid rgba(164,48,40,.18);background:#fff7f4;border-radius:999px}
    .cart-stock-limited{margin-top:8px;gap:6px;font-size:9px;letter-spacing:.04em}
    .cart-stock-limited .cavero-stock-dot{width:6px;height:6px;box-shadow:0 0 0 3px rgba(164,48,40,.09)}
    .cart-stock-limited small{display:none}
    @media(max-width:700px){.featured-stock-limited{flex-wrap:wrap}.featured-stock-limited small{width:100%;padding-left:14px}.product-stock-limited{border-radius:14px;flex-wrap:wrap}.product-stock-limited small{width:100%;padding-left:14px}}
  `;
  document.head.appendChild(style);
}

refreshLimitedStockUI();
document.addEventListener('DOMContentLoaded', refreshLimitedStockUI, { once:true });
let caveroStockRefreshQueued = false;
new MutationObserver(()=>{
  if (caveroStockRefreshQueued) return;
  caveroStockRefreshQueued = true;
  requestAnimationFrame(()=>{caveroStockRefreshQueued=false;refreshLimitedStockUI()});
}).observe(document.body,{childList:true,subtree:true});

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
