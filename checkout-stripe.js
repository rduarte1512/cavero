(() => {
  const money = n => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format((Number(n) || 0) / 100);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
  const path = () => location.pathname.replace(/\/+$/, '') || '/';
  let view, stripe, embedded, requestId, currentSession, busy = false, lastCart = '';
  const original = {
    checkout: window.goCheckout, home: window.showHome, product: window.openProduct,
    catalog: window.openCatalog, site: window.openSitePage
  };
  const $ = selector => view?.querySelector(selector);

  function ensureView() {
    if (view) return view;
    view = document.createElement('section');
    view.id = 'caveroStripeView';
    view.className = 'cavero-checkout-view hidden';
    view.setAttribute('aria-label', 'Checkout CAVERO');
    document.getElementById('checkoutView')?.insertAdjacentElement('afterend', view);
    view.addEventListener('click', async event => {
      const action = event.target.closest('[data-cavero-action]')?.dataset.caveroAction;
      if (!action) return;
      if (action === 'home') window.showHome();
      if (action === 'cart') { window.showHome(); window.openCart?.(); }
      if (action === 'retry') await renderConfirmation();
      if (action === 'reward') await claimReward();
      if (action === 'copy') {
        const code = $('#caveroRewardCode')?.value;
        if (code) { try { await navigator.clipboard.writeText(code); event.target.textContent = 'Copiado ✓'; } catch { $('#caveroRewardCode')?.select(); } }
      }
    });
    view.addEventListener('submit', event => {
      if (event.target.id !== 'caveroCheckoutForm') return;
      event.preventDefault();
      startPayment();
    });
    return view;
  }
  function hideOtherViews() {
    ['homeView','productView','checkoutView','catalogView','sitePageView','aboutView'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
    if (typeof window.CAVERO_hideSitePage === 'function') window.CAVERO_hideSitePage();
  }
  function destroyEmbedded() {
    if (embedded) { try { embedded.destroy(); } catch {} embedded = null; }
  }
  function hide() { destroyEmbedded(); view?.classList.add('hidden'); busy = false; }
  function navigate(url) { if (location.pathname + location.search !== url) history.pushState({ view:'cavero-checkout' }, '', url); }
  function shell(content, title = 'Finalizar encomenda', intro = 'Revê a tua seleção e confirma todos os detalhes antes de pagar.') {
    ensureView(); hideOtherViews(); view.classList.remove('hidden');
    document.title = `${title} | CAVERO Watches`;
    view.innerHTML = `<div class="cavero-checkout-shell"><div class="cavero-checkout-top"><button type="button" class="cavero-checkout-back" data-cavero-action="home">← Continuar a comprar</button><span class="cavero-checkout-brand">CAVERO WATCHES</span></div><div class="cavero-checkout-step">CHECKOUT SEGURO · CAVERO</div><h1 class="cavero-checkout-heading">${esc(title)}</h1><p class="cavero-checkout-intro">${esc(intro)}</p>${content}</div>`;
    window.scrollTo(0, 0);
  }
  function itemMarkup(item) {
    return `<div class="cavero-checkout-item"><img src="${esc(item.image)}" alt="${esc(item.name)}" loading="lazy"><div><b>${esc(item.name)}</b><small>${esc(item.variant)} · Qtd. ${item.qty}</small></div><div class="cavero-checkout-item-price"><strong>${money(item.unitAmount * item.qty)}</strong>${item.compareAt > item.unitAmount ? `<s>${money(item.compareAt * item.qty)}</s>` : ''}</div></div>`;
  }
  function giftMarkup() {
    const image = window.CAVERO_BRACELET_IMAGE || '/assets/bracelet-gift.webp';
    return `<div class="cavero-checkout-item cavero-checkout-gift"><img src="${esc(image)}" alt="Pulseira de oferta CAVERO"><div><b>Pulseira CAVERO</b><small>Oferta incluída · Qtd. 1</small></div><div class="cavero-checkout-item-price">GRÁTIS</div></div>`;
  }
  function cartSnapshot() {
    const entries = typeof cart !== 'undefined' ? cart : [];
    return entries.map(row => {
      const product = productFromCartId(row.id);
      if (!product) return null;
      return { id: row.id, qty: row.qty, name: product.familyName, variant: product.variant, image: product.image, unitAmount: Math.round(product.price * 100), compareAt: Math.round(product.compareAt * 100) };
    }).filter(Boolean);
  }
  function orderPanel(items, totals = {}) {
    const subtotal = items.reduce((s,i) => s + i.unitAmount * i.qty, 0);
    const compare = items.reduce((s,i) => s + Math.max(i.compareAt,i.unitAmount) * i.qty, 0);
    const savings = Math.max(0, compare - subtotal);
    const discount = totals.discountTotal || 0;
    const final = typeof totals.amountTotal === 'number' ? totals.amountTotal : subtotal;
    return `<aside class="cavero-checkout-panel cavero-checkout-order-panel"><h2>A tua encomenda</h2><div class="cavero-checkout-order">${items.map(itemMarkup).join('')}${giftMarkup()}<hr class="cavero-checkout-rule"><div class="cavero-checkout-totals"><div class="cavero-checkout-total-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>${savings ? `<div class="cavero-checkout-total-row savings"><span>Poupança nos relógios</span><strong>−${money(savings)}</strong></div>` : ''}${discount ? `<div class="cavero-checkout-total-row savings"><span>Desconto adicional</span><strong>−${money(discount)}</strong></div>` : ''}<div class="cavero-checkout-total-row"><span>Pulseira de oferta</span><strong>0,00 €</strong></div><div class="cavero-checkout-total-row"><span>Envio</span><strong>GRÁTIS</strong></div><hr class="cavero-checkout-rule"><div class="cavero-checkout-total-row grand"><span>Total</span><strong>${money(final)}</strong></div></div><p class="cavero-checkout-note">Entrega estimada de 5 a 13 dias. Os preços apresentados incluem impostos aplicáveis. O valor final é confirmado no formulário de pagamento da Stripe.</p></div><div class="cavero-checkout-reward"><small>UM BENEFÍCIO PARA A PRÓXIMA COMPRA</small><strong>20% de desconto na próxima encomenda.</strong><p>Depois de um pagamento confirmado, podes obter um código pessoal de utilização única para a tua próxima compra CAVERO.</p></div></aside>`;
  }
  function alert(message) {
    const target = $('#caveroCheckoutAlert');
    if (target) { target.hidden = false; target.textContent = message; }
  }
  async function api(url, options = {}) {
    const response = await fetch(url, { credentials:'same-origin', cache:'no-store', ...options });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Não foi possível comunicar com o servidor.');
    return data;
  }
  async function loadStripe() {
    if (typeof window.Stripe === 'function') return;
    await new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = 'https://js.stripe.com/v3/'; script.async = true;
      script.onload = resolve; script.onerror = () => reject(new Error('Não foi possível carregar o formulário de pagamento.'));
      document.head.appendChild(script);
    });
  }
  function open() {
    const items = cartSnapshot();
    if (!items.length) { window.openCart?.(); return; }
    destroyEmbedded(); busy = false; currentSession = null;
    const serialized = JSON.stringify(items.map(i => [i.id,i.qty]));
    if (serialized !== lastCart) { requestId = crypto.randomUUID(); lastCart = serialized; }
    const cancelled = new URLSearchParams(location.search).has('cancelled');
    navigate('/checkout');
    shell('<div class="cavero-checkout-panel"><form id="caveroCheckoutForm"><p>A tua encomenda inclui envio gratuito e uma pulseira de oferta.</p><div id="caveroCheckoutAlert" class="cavero-checkout-alert" role="alert" hidden></div><button class="cavero-checkout-primary" id="caveroStartPayment" type="submit">Continuar para a Stripe →</button></form></div>');
    if (!cancelled) startPayment();
  }
  async function startPayment() {
    if (busy) return;
    busy = true;
    const button = $('#caveroStartPayment');
    button.disabled = true; button.textContent = 'A abrir o pagamento seguro…';
    $('#caveroCheckoutAlert').hidden = true;
    try {
      const items = cartSnapshot();
      const session = await api('/api/create-checkout-session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(i => ({ id: i.id, qty: i.qty })), requestId })
      });
      const destination = new URL(session.url);
      if (destination.protocol !== 'https:' || destination.hostname !== 'checkout.stripe.com') throw new Error('Não foi possível abrir o pagamento Stripe.');
      location.assign(destination.href);
    } catch (error) {
      button.disabled = false; button.textContent = 'Tentar novamente →';
      alert(error.message);
    } finally { busy = false; }
  }
  async function renderConfirmation() {
    ensureView(); destroyEmbedded();
    const id = new URLSearchParams(location.search).get('session_id') || currentSession;
    shell('<div class="cavero-checkout-panel" style="max-width:720px"><div class="cavero-checkout-loading">A confirmar o pagamento com a Stripe…</div></div>','A tua encomenda','Estamos a verificar o estado do pagamento.');
    if (!id) { alert('Não foi encontrada uma referência de pagamento.'); return; }
    try {
      const order = await api(`/api/checkout-status?session_id=${encodeURIComponent(id)}`);
      if (!order.paid) {
        shell(`<div class="cavero-checkout-panel" style="max-width:720px"><h2>Pagamento ainda não confirmado</h2><p class="cavero-checkout-status">${order.status==='expired'?'A sessão de pagamento expirou.':'A Stripe ainda está a processar o pagamento. Não efetues uma nova compra enquanto o estado estiver pendente.'}</p><div class="cavero-checkout-actions"><button class="cavero-checkout-secondary" data-cavero-action="retry">Verificar novamente</button><button class="cavero-checkout-secondary" data-cavero-action="home">Voltar à loja</button></div></div>`,'Estado da encomenda','A confirmação será apresentada apenas depois de a Stripe confirmar o pagamento.');
        return;
      }
      try { localStorage.removeItem('cavero_cart_v4'); if (typeof cart !== 'undefined') { cart.length = 0; updateCart(); } } catch {}
      shell(`<div class="cavero-checkout-success"><div class="cavero-checkout-panel"><div class="cavero-checkout-success-icon">✓</div><h2>Pagamento confirmado!</h2><p class="cavero-checkout-status">Obrigado pela tua compra. A encomenda será preparada para envio e a informação de acompanhamento será comunicada quando estiver disponível.</p><p><strong>Referência:</strong> ${esc(order.orderReference)}</p><div class="cavero-checkout-order">${order.items.map(i=>`<div class="cavero-checkout-total-row"><span>${esc(i.name)} · Qtd. ${i.quantity}</span><strong>${money(i.amount)}</strong></div>`).join('')}<hr class="cavero-checkout-rule"><div class="cavero-checkout-total-row grand"><span>Total pago</span><strong>${money(order.amountTotal)}</strong></div></div><div class="cavero-checkout-reward"><small>OBRIGADO POR ESCOLHERES CAVERO</small><strong>Os teus 20% para a próxima compra.</strong><p>Gera o teu código pessoal de utilização única, associado ao cliente desta encomenda.</p><div id="caveroRewardArea"><button class="cavero-checkout-secondary" style="margin-top:14px" data-cavero-action="reward">Obter o meu código de 20%</button></div></div><div class="cavero-checkout-actions"><button class="cavero-checkout-primary" data-cavero-action="home">Continuar a explorar CAVERO</button></div></div></div>`,'A tua compra está confirmada','O pagamento foi confirmado diretamente pela Stripe.');
      currentSession = id;
    } catch (error) {
      shell(`<div class="cavero-checkout-panel" style="max-width:720px"><div class="cavero-checkout-alert">${esc(error.message)}</div><button class="cavero-checkout-secondary" data-cavero-action="retry">Tentar novamente</button></div>`,'A confirmar a encomenda','Não é necessário efetuar outro pagamento.');
    }
  }
  async function claimReward() {
    const area = $('#caveroRewardArea');
    if (!area || !currentSession) return;
    area.textContent = 'A preparar o teu benefício…';
    try {
      const reward = await api('/api/claim-reward', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({sessionId:currentSession}) });
      area.innerHTML = `<div class="cavero-checkout-code"><input id="caveroRewardCode" readonly value="${esc(reward.code)}" aria-label="Código de desconto"><button data-cavero-action="copy" type="button">Copiar</button></div><p style="margin-top:10px">Guarda este código para a próxima encomenda. É pessoal, de utilização única e não pode ser acumulado com outros códigos.</p>`;
    } catch(error) { area.innerHTML = `<p>${esc(error.message)}</p><button class="cavero-checkout-secondary" style="margin-top:12px" data-cavero-action="reward">Tentar novamente</button>`; }
  }
  window.goCheckout = open;
  for (const [name,key] of [['showHome','home'],['openProduct','product'],['openCatalog','catalog'],['openSitePage','site']]) {
    if (typeof original[key] !== 'function') continue;
    window[name] = function(...args) { hide(); return original[key].apply(this,args); };
  }
  window.addEventListener('popstate', () => { if (path()==='/checkout') openRoute(); else if (path()==='/checkout/confirmacao') renderConfirmation(); else hide(); });
  function openRoute() { ensureView(); if (path()==='/checkout/confirmacao') renderConfirmation(); else if (path()==='/checkout') open(); }
  if (path()==='/checkout' || path()==='/checkout/confirmacao') openRoute();
})();
