(() => {
  if (document.getElementById('caveroStripeLoader')) return;
  const load = () => {
    if (document.querySelector('script[data-cavero-stripe-ui]')) return;
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/checkout-stripe.css?v=1';
    document.head.appendChild(css);
    const script = document.createElement('script');
    script.src = '/checkout-stripe.js?v=1';
    script.async = false;
    script.dataset.caveroStripeUi = 'true';
    document.body.appendChild(script);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load, { once: true });
  else load();
})();
