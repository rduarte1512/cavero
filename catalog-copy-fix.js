// Keep cart copy aligned with the five-model catalogue.
const baseUpdateCartForCatalog = updateCart;
updateCart = function(){
  baseUpdateCartForCatalog();
  const empty = document.querySelector('.empty-cart span');
  if (empty && empty.textContent.includes('seis modelos')) empty.textContent = 'Escolhe um dos cinco modelos CAVERO.';
};
updateCart();

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

// Scarcity claims must come from actual inventory, never a hard-coded marketing flag.
// A future inventory integration may populate window.CAVERO_INVENTORY with verified quantities.
const CAVERO_LIMITED_STOCK_MODELS = ['cavero velocity','cavero apex','cavero chronos ice'];
function limitedStockMarkup(extraClass=''){
  return `<div class="cavero-stock-limited ${extraClass}"><span class="cavero-stock-dot"></span><strong>Stock limitado</strong><small>Disponibilidade reduzida</small></div>`;
}
function hasVerifiedLimitedStock(name){
  const key = name.trim().toLowerCase();
  const inventory = window.CAVERO_INVENTORY;
  const entry = inventory && inventory[key];
  return CAVERO_LIMITED_STOCK_MODELS.includes(key) && entry && Number.isSafeInteger(entry.available) && entry.available > 0 && entry.available <= 5 && entry.verified === true;
}
function markFeaturedStockLimited(){
  document.querySelectorAll('#destaques .featured').forEach(card=>{
    const body = card.querySelector('.body');
    if (!body) return;
    const existing = body.querySelector('.featured-stock-limited');
    if (!hasVerifiedLimitedStock(body.querySelector('h3')?.textContent || '')) { existing?.remove(); return; }
    if (existing) return;
    const button = body.querySelector('.mini');
    if (button) button.insertAdjacentHTML('beforebegin', limitedStockMarkup('featured-stock-limited'));
    else body.insertAdjacentHTML('beforeend', limitedStockMarkup('featured-stock-limited'));
  });
}
function markProductStockLimited(){
  const detail = document.querySelector('#productView .detail');
  if (!detail) return;
  const existing = detail.querySelector('.product-stock-limited');
  if (!hasVerifiedLimitedStock(detail.querySelector('h1')?.textContent || '')) { existing?.remove(); return; }
  if (existing) return;
  const promo = detail.querySelector('#promoPanel, .promo-panel');
  if (promo) promo.insertAdjacentHTML('afterend', limitedStockMarkup('product-stock-limited'));
  else detail.querySelector('.buyrow')?.insertAdjacentHTML('beforebegin', limitedStockMarkup('product-stock-limited'));
}
function markCartStockLimited(){
  document.querySelectorAll('#cartItems .cartitem').forEach(item=>{
    const existing = item.querySelector('.cart-stock-limited');
    if (!hasVerifiedLimitedStock(item.querySelector('b')?.textContent || '')) { existing?.remove(); return; }
    if (existing) return;
    if (item.children[1]) item.children[1].insertAdjacentHTML('beforeend', limitedStockMarkup('cart-stock-limited'));
  });
}
function refreshLimitedStockUI(){ markFeaturedStockLimited(); markProductStockLimited(); markCartStockLimited(); }
if (!document.getElementById('cavero-stock-limited-styles')) {
  const style = document.createElement('style');
  style.id = 'cavero-stock-limited-styles';
  style.textContent = `
    .cavero-stock-limited{display:flex;align-items:center;gap:7px;color:#9f3028;font-size:10px;letter-spacing:.055em;text-transform:uppercase;font-weight:800}
    .cavero-stock-dot{width:7px;height:7px;border-radius:50%;background:#a43028;box-shadow:0 0 0 4px rgba(164,48,40,.10);flex:0 0 auto}
    .cavero-stock-limited strong{font:inherit}.cavero-stock-limited small{color:#7d756d;font-size:9px;font-weight:650;letter-spacing:.035em;text-transform:none}
    .featured-stock-limited{margin:10px 0 12px}.product-stock-limited{width:max-content;max-width:100%;margin:10px 0 16px;padding:10px 13px;border:1px solid rgba(164,48,40,.18);background:#fff7f4;border-radius:999px}
    .cart-stock-limited{margin-top:8px;gap:6px;font-size:9px;letter-spacing:.04em}.cart-stock-limited .cavero-stock-dot{width:6px;height:6px;box-shadow:0 0 0 3px rgba(164,48,40,.09)}.cart-stock-limited small{display:none}
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

function loadCaveroAsset(type, url, marker){
  if (document.querySelector(`${type}[data-${marker}]`)) return null;
  const element = document.createElement(type);
  if (type === 'script') { element.src = url; element.async = false; }
  else { element.rel = 'stylesheet'; element.href = url; }
  element.dataset[marker] = 'true';
  (type === 'script' ? document.body : document.head).appendChild(element);
  return element;
}
loadCaveroAsset('link','/header-search.css?v=1','headerSearchCss');
loadCaveroAsset('script','/header-search.js?v=1','headerSearchJs');
loadCaveroAsset('link','/bracelet-gift.css?v=2','braceletGiftCss');
function loadBraceletGiftUI(){ loadCaveroAsset('script','/bracelet-gift.js?v=2','braceletGiftJs'); }
if (window.CAVERO_BRACELET_IMAGE) loadBraceletGiftUI();
else if (!document.querySelector('script[data-bracelet-image-data]')) {
  const script = document.createElement('script');
  script.src = '/bracelet-gift-image-data.js?v=2'; script.async = false;
  script.dataset.braceletImageData = 'true'; script.onload = loadBraceletGiftUI;
  document.body.appendChild(script);
} else window.addEventListener('load', loadBraceletGiftUI, {once:true});

// Install the payment UI only after all existing route and product wrappers have initialized.
function loadCaveroCheckout(){ loadCaveroAsset('script','/checkout-loader.js?v=2','caveroCheckoutLoader'); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadCaveroCheckout, {once:true});
else loadCaveroCheckout();
