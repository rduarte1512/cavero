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
