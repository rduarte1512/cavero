/* Route metadata for the existing CAVERO storefront. No payment logic is changed. */
(() => {
  const data = window.CAVERO_SEO;
  if (!data || !Array.isArray(data.routes)) return;
  const routes = new Map(data.routes.map(r => [r.pathname, r]));
  const normalize = p => p.replace(/\/+$/, '') || '/';
  const safeJSON = v => JSON.stringify(v).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
  let syncing = false;
  let initialized = false;
  const defaults = data.defaults || {};
  function meta(attr, key, value) {
    let el = [...document.head.querySelectorAll('meta['+attr+']')].find(x => x.getAttribute(attr) === key);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr,key); document.head.appendChild(el); }
    el.content = String(value ?? '');
  }
  function canonical(value) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) { el=document.createElement('link'); el.rel='canonical'; document.head.appendChild(el); }
    el.href=value;
  }
  function heading(tag) {
    const old=document.getElementById('homeSeoHeading');
    if (!old || old.tagName.toLowerCase()===tag) return;
    const next=document.createElement(tag);
    for (const attr of old.attributes) next.setAttribute(attr.name,attr.value);
    next.textContent=old.textContent;
    old.replaceWith(next);
  }
  function selectedIndex(route) {
    const group=route.schema?.['@graph']?.find(x=>x['@type']==='ProductGroup');
    if (!group) return null;
    const raw=new URLSearchParams(location.search).get('variant');
    const index=raw===null ? route.defaultVariant ?? defaults[group.productGroupID] ?? 0 : Number(raw);
    return Number.isInteger(index) && index>=0 && index<group.hasVariant.length ? index : route.defaultVariant ?? 0;
  }
  function currentRoute() { return routes.get(normalize(location.pathname)); }
  function update(route,index) {
    const group=route.schema?.['@graph']?.find(x=>x['@type']==='ProductGroup');
    const variant=group && index!==null ? group.hasVariant[index] : null;
    const title=variant && new URLSearchParams(location.search).has('variant') ? variant.name+' | CAVERO Watches' : route.title;
    const image=variant?.image?.[0] || route.image;
    const description=route.description;
    document.title=title;
    meta('name','description',description);
    meta('name','robots',route.noindex?'noindex,follow':'index,follow,max-image-preview:large');
    canonical(data.origin+route.pathname);
    meta('property','og:title',title);
    meta('property','og:description',description);
    meta('property','og:url',data.origin+route.pathname);
    meta('property','og:type',group?'product':'website');
    meta('property','og:image',image);
    meta('property','og:image:alt',group?.name || 'CAVERO Watches');
    meta('name','twitter:card','summary_large_image');
    meta('name','twitter:title',title);
    meta('name','twitter:description',description);
    meta('name','twitter:image',image);
    const price=variant?.offers?.price;
    if (price!==undefined) {
      meta('property','product:price:amount',price);
      meta('property','product:price:currency','EUR');
    } else {
      document.head.querySelectorAll('meta[property="product:price:amount"],meta[property="product:price:currency"]').forEach(x=>x.remove());
    }
    let structured=document.getElementById('cavero-structured-data');
    if (!structured) { structured=document.createElement('script'); structured.type='application/ld+json'; structured.id='cavero-structured-data'; document.head.appendChild(structured); }
    structured.textContent=safeJSON(route.schema);
    heading(route.pathname==='/'?'h1':'h2');
  }
  function sync() {
    if (syncing) return;
    syncing=true;
    try {
      const route=currentRoute();
      if (!route) {
        meta('name','robots','noindex,follow');
        return;
      }
      const index=route.type==='product'?selectedIndex(route):null;
      if (route.type==='product' && typeof baseSelectVariant==='function') {
        const active=document.querySelector('#productView .variant-option.active');
        if (active && Number(active.dataset.variantIndex)!==index) baseSelectVariant(index);
      }
      update(route,index);
      if (route.pathname==='/pesquisar') {
        const input=document.getElementById('fullStoreSearch');
        const q=new URLSearchParams(location.search).get('q');
        if (input && q!==null && input.value!==q) { input.value=q; input.dispatchEvent(new Event('input',{bubbles:true})); }
      }
    } finally { syncing=false; }
  }
  const baseSelectVariant=typeof window.selectVariant==='function'?window.selectVariant:null;
  function wrap(name,after) {
    const original=window[name];
    if (typeof original!=='function') return;
    window[name]=function(...args) {
      const result=original.apply(this,args);
      if (after) after(args);
      sync();
      return result;
    };
  }
  wrap('openProduct',() => {
    if (location.search) history.replaceState(history.state,'',location.pathname);
  });
  wrap('showHome');
  wrap('openCatalog');
  wrap('openSitePage');
  wrap('goCheckout');
  if (baseSelectVariant) {
    window.selectVariant=function(index) {
      const result=baseSelectVariant.apply(this,arguments);
      const route=currentRoute();
      if (route?.type==='product') {
        const valid=Number(index);
        if (Number.isInteger(valid) && valid>=0) {
          const params=new URLSearchParams(location.search);
          params.set('variant',String(valid));
          history.replaceState(history.state,'',location.pathname+'?'+params.toString());
        }
      }
      sync();
      return result;
    };
  }
  window.addEventListener('popstate',sync);
  function boot() {
    if (initialized) return;
    initialized=true;
    if (typeof window.showHome!=='function' || typeof window.openProduct!=='function') return;
    sync();
    document.getElementById('seo-prerender')?.remove();
    document.body.removeAttribute('data-seo-boot');
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();