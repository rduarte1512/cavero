let cart=JSON.parse(localStorage.getItem('cavero_cart_v3')||localStorage.getItem('cavero_cart_v2')||'[]');
cart=cart.map(i=>{const p=productFromCartId(i.id);return p?{id:p.id,qty:Math.max(1,i.qty||1)}:null}).filter(Boolean);
localStorage.setItem('cavero_cart_v3',JSON.stringify(cart));

function saveCart(){localStorage.setItem('cavero_cart_v3',JSON.stringify(cart));updateCart()}
function cartQty(){return cart.reduce((s,i)=>s+i.qty,0)}
function cartTotal(){return cart.reduce((s,i)=>{const p=productFromCartId(i.id);return s+(p?p.price*i.qty:0)},0)}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1700)}
window.addCart=(id,qty=1)=>{let i=cart.find(x=>x.id===id);if(i)i.qty+=Math.max(1,qty||1);else cart.push({id,qty:Math.max(1,qty||1)});saveCart();openCart();toast('Variante adicionada ao saco')};
window.changeQty=(id,d)=>{let i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart()};
window.removeCart=id=>{cart=cart.filter(x=>x.id!==id);saveCart()};

function updateCart(){
  $('#cartCount').textContent=cartQty();const box=$('#cartItems');
  if(!cart.length){box.innerHTML='<p style="color:#777;padding:24px 0">O teu saco está vazio.</p>';$('#cartFoot').innerHTML='';return}
  box.innerHTML=cart.map(i=>{const p=productFromCartId(i.id);if(!p)return'';return `<div class="cartitem"><img data-cartimg="${p.id}" src="${p.base}" alt="${p.variant}"><div><b>${p.familyName}</b><small>${p.variant}</small><div class="stepper"><button onclick="changeQty('${p.id}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${p.id}',1)">+</button></div></div><div style="text-align:right"><b>${money(p.price*i.qty)}</b><br><button class="remove" onclick="removeCart('${p.id}')">Remover</button></div></div>`}).join('');
  cart.forEach(i=>{const p=productFromCartId(i.id);if(p)setVariantImage(document.querySelector(`[data-cartimg="${CSS.escape(p.id)}"]`),familyMap.get(p.familyKey),p.variantIndex,180)});
  $('#cartFoot').innerHTML=`<div class="total"><span>Total</span><span>${money(cartTotal())}</span></div><button class="btn dark" style="width:100%" onclick="goCheckout()">Finalizar compra</button><p style="font-size:11px;color:#777;text-align:center">Envio calculado antes da confirmação final.</p>`;
}
function openCart(){$('#drawer').classList.add('open');$('#overlay').classList.add('open')}
function closeCart(){$('#drawer').classList.remove('open');$('#overlay').classList.remove('open')}
$('#cartBtn').onclick=openCart;$('#closeCart').onclick=closeCart;$('#overlay').onclick=()=>{closeCart();closeSearch()};

window.goCheckout=()=>{
  closeCart();if(!cart.length)return;
  $('#homeView').classList.add('hidden');$('#productView').classList.add('hidden');const v=$('#checkoutView');v.classList.remove('hidden');
  v.innerHTML=`<div class="checkout"><button class="back" onclick="showHome()">← Continuar a comprar</button><div class="checkout-head"><div class="eyebrow">CHECKOUT CAVERO</div><h1>Finalizar encomenda</h1></div><div class="checkout-grid"><div class="panel"><h2 style="margin-bottom:20px">Dados de entrega</h2><form id="checkoutForm"><div class="fieldgrid"><div class="field"><label>Nome</label><input required placeholder="Nome"></div><div class="field"><label>Apelido</label><input required placeholder="Apelido"></div><div class="field full"><label>Email</label><input required type="email" placeholder="email@exemplo.pt"></div><div class="field full"><label>Morada</label><input required placeholder="Rua e número"></div><div class="field"><label>Código postal</label><input required placeholder="0000-000"></div><div class="field"><label>Localidade</label><input required placeholder="Lisboa"></div><div class="field full"><label>País</label><select><option>Portugal</option><option>Espanha</option></select></div></div><h2 style="margin:24px 0 12px">Pagamento</h2><div class="paymethods"><label class="pay"><span>💳 Cartão · Visa / Mastercard</span><input type="radio" name="pay" checked></label><label class="pay"><span>📱 MB WAY</span><input type="radio" name="pay"></label></div><button class="btn dark" style="width:100%">Pagar ${money(cartTotal())}</button><div class="notice">O checkout visual está dentro da CAVERO. Para pagamentos reais, é necessário ligar o processador de pagamentos ao backend.</div></form></div><div class="panel"><h2 style="margin-bottom:14px">A tua encomenda</h2>${cart.map(i=>{const p=productFromCartId(i.id);return p?`<div class="orderline"><span>${p.familyName}<small style="display:block;color:#777;margin-top:3px">${p.variant} × ${i.qty}</small></span><b>${money(p.price*i.qty)}</b></div>`:''}).join('')}<div class="total" style="margin-top:20px"><span>Total</span><span>${money(cartTotal())}</span></div></div></div></div>`;
  $('#checkoutForm').onsubmit=e=>{e.preventDefault();toast('Checkout preparado — falta ligar o processador de pagamentos.')};window.scrollTo(0,0);
};

function openSearch(){$('#searchBox').classList.add('open');$('#overlay').classList.add('open');setTimeout(()=>$('#searchInput').focus(),60)}
function closeSearch(){$('#searchBox').classList.remove('open');if(!$('#drawer').classList.contains('open'))$('#overlay').classList.remove('open')}
$('#searchBtn').onclick=openSearch;$('#closeSearch').onclick=closeSearch;
$('#searchInput').oninput=e=>{
  const q=e.target.value.trim().toLowerCase();
  const matches=[];
  if(q)families.forEach(f=>{
    const familyMatch=f.name.toLowerCase().includes(q);
    const variantIndex=f.variants.findIndex(v=>v.toLowerCase().includes(q));
    if(familyMatch||variantIndex>=0)matches.push({f,index:variantIndex>=0?variantIndex:f.defaultVariant});
  });
  $('#searchResults').innerHTML=matches.slice(0,6).map(({f,index})=>`<div class="sresult" onclick="closeSearch();openProduct('${f.key}');setTimeout(()=>selectVariant(${index}),0)"><img data-search-family="${f.key}" src="${f.base}"><div><b>${f.name}</b><small style="display:block;color:#777">${f.variants[index]}</small></div><b>${money(f.price)}</b></div>`).join('');
  matches.slice(0,6).forEach(({f,index})=>setVariantImage(document.querySelector(`[data-search-family="${f.key}"]`),f,index,140));
};

renderFeatured();renderFilters();renderProducts();updateCart();
