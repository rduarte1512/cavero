/* CAVERO scroll motion: progressive enhancement, no animation dependencies. */
(() => {
  'use strict';
  if (window.__caveroScrollMotion) return;
  window.__caveroScrollMotion = true;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 769px)');
  const selectors = [
    '#homeView .store-proof-head',
    '#homeView .proof-summary',
    '#homeView .store-review-card',
    '#homeView #destaques .section-head',
    '#homeView #featuredGrid > .featured',
    '#homeView .about-copy > .home-kicker',
    '#homeView .about-copy > .home-title',
    '#homeView .about-copy > .home-lead',
    '#homeView .about-copy > .about-note',
    '#homeView .about-stat',
    '#homeView .about-pillar',
    '#homeView #colecao .collection-intro',
    '#homeView #grid > .family-card',
    '#homeView .faq-side',
    '#homeView .faq-list > details',
    '#homeView .home-end-cta > *',
    '#productView .product-breadcrumb',
    '#productView .related-section > .eyebrow',
    '#productView .related-section > h2',
    '#productView .related-grid > article',
    '#productView .product-benefits',
    '#productView .product-accordions',
    '.cavero-instagram-heading',
    '.cavero-instagram-profile',
    '.cavero-instagram-tile',
    '.cavero-instagram-note'
  ].join(',');
  const seen = new WeakSet();
  const playing = new Set();
  let observer = null;
  let queued = false;
  let scrollFrame = 0;
  let initialized = false;

  function eligible(node) {
    if (!node.isConnected || node.closest('#seo-prerender, #checkoutView, .hidden, [hidden], [aria-hidden="true"]')) return false;
    const style = window.getComputedStyle(node);
    return style.display !== 'none' && style.visibility !== 'hidden' && node.getClientRects().length > 0;
  }

  function finish(node) {
    node.classList.remove('cavero-motion-play');
    node.style.removeProperty('--cavero-motion-delay');
    node.style.removeProperty('--cavero-motion-x');
    playing.delete(node);
  }

  function play(node) {
    if (seen.has(node)) return;
    seen.add(node);
    if (observer) observer.unobserve(node);
    if (reduce.matches || !eligible(node)) return;
    const staggered = node.matches('.featured, .family-card, .about-stat, .about-pillar, .store-review-card, .cavero-instagram-tile, .related-grid > article, .faq-list > details');
    const index = node.parentElement ? Array.prototype.indexOf.call(node.parentElement.children, node) : 0;
    node.style.setProperty('--cavero-motion-delay', `${staggered ? Math.min(index % 4, 3) * 65 : 0}ms`);
    if (node.matches('.about-copy > *, .faq-side')) node.style.setProperty('--cavero-motion-x', '-18px');
    if (node.matches('.about-pillar')) node.style.setProperty('--cavero-motion-x', '12px');
    node.classList.add('cavero-motion-play');
    playing.add(node);
    const complete = event => {
      if (event.target !== node) return;
      node.removeEventListener('animationend', complete);
      node.removeEventListener('animationcancel', complete);
      finish(node);
    };
    node.addEventListener('animationend', complete);
    node.addEventListener('animationcancel', complete);
  }

  function scan(initial = false) {
    if (reduce.matches) {
      if (observer) observer.disconnect();
      playing.forEach(finish);
      return;
    }
    if (!observer && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && eligible(entry.target)) play(entry.target);
        });
      }, { rootMargin: '0px 0px -24px 0px', threshold: 0.04 });
    }
    playing.forEach(node => { if (!eligible(node)) finish(node); });
    document.querySelectorAll(selectors).forEach(node => {
      if (seen.has(node) || !eligible(node)) return;
      const rect = node.getBoundingClientRect();
      // Keep the first viewport visible, including the LCP image and primary CTA.
      if (initial && rect.top < window.innerHeight && rect.bottom > 0) {
        seen.add(node);
      } else if (observer) {
        observer.observe(node);
      } else {
        seen.add(node); // No observer: content remains fully visible.
      }
    });
  }

  function queueScan() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; scan(); });
  }

  function parallax() {
    scrollFrame = 0;
    const hero = document.getElementById('premiumHero');
    if (!hero) return;
    const media = hero.querySelector('.premium-hero-media');
    if (!media) return;
    if (reduce.matches || !desktop.matches || !eligible(hero) || document.hidden) {
      media.style.removeProperty('--cavero-hero-shift');
      return;
    }
    const rect = hero.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
    const shift = Math.min(28, Math.max(0, -rect.top) * 0.10);
    media.style.setProperty('--cavero-hero-shift', `${shift.toFixed(2)}px`);
  }

  function queueParallax() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(parallax);
  }

  function settingsChanged() {
    if (reduce.matches) {
      if (observer) observer.disconnect();
      playing.forEach(finish);
    }
    queueScan();
    queueParallax();
  }

  function init() {
    if (initialized) return;
    initialized = true;
    scan(true);
    queueParallax();
    if ('MutationObserver' in window) {
      const changes = new MutationObserver(queueScan);
      changes.observe(document.body, { childList: true, subtree: true });
      ['homeView', 'productView'].forEach(id => {
        const view = document.getElementById(id);
        if (view) changes.observe(view, { attributes: true, attributeFilter: ['class'] });
      });
    }
    document.addEventListener('click', queueScan, true);
    document.addEventListener('change', queueScan, true);
    window.addEventListener('popstate', queueScan);
    window.addEventListener('pageshow', queueScan);
    window.addEventListener('scroll', queueParallax, { passive: true });
    window.addEventListener('resize', () => { queueScan(); queueParallax(); }, { passive: true });
    document.addEventListener('visibilitychange', queueParallax);
    [reduce, desktop].forEach(query => {
      if (query.addEventListener) query.addEventListener('change', settingsChanged);
      else if (query.addListener) query.addListener(settingsChanged);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
