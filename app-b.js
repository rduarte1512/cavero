let cart=JSON.parse(localStorage.getItem('cavero_cart_v4')||localStorage.getItem('cavero_cart_v3')||localStorage.getItem('cavero_cart_v2')||'[]');
cart=cart.map(i=>{const p=productFromCartId(i.id);return p?{id:p.id,qty:Math.max(1,i.qty||1)}:null}).filter(Boolean);
localStorage.setItem('cavero_cart_v4',JSON.stringify(cart));

function saveCart(){localStorage.setItem('cavero_cart_v4',JSON.stringify(cart));updateCart()}
function cartQty(){return cart.reduce((s,i)=>s+i.qty,0)}
function cartTotal(){return cart.reduce((s,i)=>{const p=productFromCartId(i.id);return s+(p?p.price*i.qty:0)},0)}
function cartCompareTotal(){return cart.reduce((s,i)=>{const p=productFromCartId(i.id);return s+(p?(p.compareAt||p.price)*i.qty:0)},0)}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1800)}
window.addCart=(id,qty=1)=>{let i=cart.find(x=>x.id===id);if(i)i.qty+=Math.max(1,qty||1);else cart.push({id,qty:Math.max(1,qty||1)});saveCart();openCart();toast('Adicionado ao saco')};
window.changeQty=(id,d)=>{let i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart()};
window.removeCart=id=>{cart=cart.filter(x=>x.id!==id);saveCart()};

function updateCart(){
  $('#cartCount').textContent=cartQty();const box=$('#cartItems');
  if(!cart.length){box.innerHTML='<div class="empty-cart"><b>O teu saco está vazio.</b><span>Escolhe um dos seis modelos CAVERO.</span></div>';$('#cartFoot').innerHTML='';return}
  box.innerHTML=cart.map(i=>{const p=productFromCartId(i.id);if(!p)return'';return `<div class="cartitem"><img src="${p.image}" alt="${p.variant}"><div><b>${p.familyName}</b><small>${p.variant}</small><div class="cart-price"><strong>${money(p.price)}</strong>${p.compareAt>p.price?`<s>${money(p.compareAt)}</s>`:''}</div><div class="stepper"><button onclick="changeQty('${p.id}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${p.id}',1)">+</button></div></div><div style="text-align:right"><b>${money(p.price*i.qty)}</b><br><button class="remove" onclick="removeCart('${p.id}')">Remover</button></div></div>`}).join('');
  const saved=Math.max(0,cartCompareTotal()-cartTotal());
  $('#cartFoot').innerHTML=`${saved?`<div class="cart-saving">Estás a poupar <strong>${money(saved)}</strong></div>`:''}<div class="total"><span>Total</span><span>${money(cartTotal())}</span></div><button class="btn dark" style="width:100%" onclick="goCheckout()">Finalizar compra</button><p class="checkout-note">Preço promocional e variante ficam guardados no teu saco.</p>`;
}
function openCart(){$('#drawer').classList.add('open');$('#overlay').classList.add('open')}
function closeCart(){$('#drawer').classList.remove('open');$('#overlay').classList.remove('open')}
$('#cartBtn').onclick=openCart;$('#closeCart').onclick=closeCart;$('#overlay').onclick=()=>{closeCart();closeSearch()};

window.goCheckout=()=>{
  closeCart();if(!cart.length)return;
  $('#homeView').classList.add('hidden');$('#productView').classList.add('hidden');const v=$('#checkoutView');v.classList.remove('hidden');
  const saved=Math.max(0,cartCompareTotal()-cartTotal());
  v.innerHTML=`<div class="checkout"><button class="back" onclick="showHome()">← Continuar a comprar</button><div class="checkout-head"><div class="eyebrow">CHECKOUT CAVERO</div><h1>Finalizar encomenda</h1><p>Revê os teus relógios, variantes e preços promocionais antes de continuar.</p></div><div class="checkout-grid"><div class="panel"><h2>Dados de entrega</h2><form id="checkoutForm"><div class="fieldgrid"><div class="field"><label>Nome</label><input required placeholder="Nome"></div><div class="field"><label>Apelido</label><input required placeholder="Apelido"></div><div class="field full"><label>Email</label><input required type="email" placeholder="email@exemplo.pt"></div><div class="field full"><label>Morada</label><input required placeholder="Rua e número"></div><div class="field"><label>Código postal</label><input required placeholder="0000-000"></div><div class="field"><label>Localidade</label><input required placeholder="Lisboa"></div><div class="field full"><label>País</label><select><option>Portugal</option><option>Espanha</option></select></div></div><h2 class="payment-title">Pagamento</h2><div class="paymethods"><label class="pay"><span>💳 Cartão · Visa / Mastercard</span><input type="radio" name="pay" checked></label><label class="pay"><span>📱 MB WAY</span><input type="radio" name="pay"></label></div><button class="btn dark checkout-pay" style="width:100%">Pagar ${money(cartTotal())}</button><div class="notice">O checkout visual está preparado dentro da CAVERO. Para aceitar pagamentos reais, é necessário ligar o processador de pagamentos ao backend.</div></form></div><div class="panel order-panel"><h2>A tua encomenda</h2>${cart.map(i=>{const p=productFromCartId(i.id);return p?`<div class="checkout-item"><img src="${p.image}" alt="${p.variant}"><div><b>${p.familyName}</b><small>${p.variant} · Qtd. ${i.qty}</small>${p.compareAt>p.price?`<span class="checkout-discount">-${discountPct({price:p.price,compareAt:p.compareAt})}%</span>`:''}</div><div class="checkout-item-price"><b>${money(p.price*i.qty)}</b>${p.compareAt>p.price?`<s>${money(p.compareAt*i.qty)}</s>`:''}</div></div>`:''}).join('')}${saved?`<div class="checkout-saved"><span>Poupança</span><strong>${money(saved)}</strong></div>`:''}<div class="total"><span>Total</span><span>${money(cartTotal())}</span></div></div></div></div>`;
  $('#checkoutForm').onsubmit=e=>{e.preventDefault();toast('Checkout preparado — falta ligar o processador de pagamentos.')};window.scrollTo(0,0);
};

function openSearch(){$('#searchBox').classList.add('open');$('#overlay').classList.add('open');setTimeout(()=>$('#searchInput').focus(),60)}
function closeSearch(){$('#searchBox').classList.remove('open');if(!$('#drawer').classList.contains('open'))$('#overlay').classList.remove('open')}
$('#searchBtn').onclick=openSearch;$('#closeSearch').onclick=closeSearch;
$('#searchInput').oninput=e=>{
  const q=e.target.value.trim().toLowerCase();const matches=[];
  if(q)families.forEach(f=>{
    const fi=f.variants.findIndex(v=>v.name.toLowerCase().includes(q));
    if(f.name.toLowerCase().includes(q)||f.subtitle.toLowerCase().includes(q)||fi>=0)matches.push({f,index:fi>=0?fi:f.defaultVariant});
  });
  $('#searchResults').innerHTML=matches.slice(0,6).map(({f,index})=>{const v=f.variants[index];return `<div class="sresult" onclick="closeSearch();openProduct('${f.key}');setTimeout(()=>selectVariant(${index}),0)"><img src="${v.image}" alt="${v.name}"><div><b>${f.name}</b><small>${v.name}</small></div><div class="search-price"><b>${money(v.price)}</b>${v.compareAt>v.price?`<s>${money(v.compareAt)}</s>`:''}</div></div>`}).join('');
};

renderFeatured();renderFilters();renderProducts();updateCart();
