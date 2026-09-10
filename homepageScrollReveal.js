import { Reveal } from './Reveal.js';

const registered = new WeakSet();
const cleanups = new Map();
let mutationObserver = null;
let scanFrame = 0;

function register(element, options = {}) {
  if (!element || registered.has(element)) return;

  registered.add(element);
  cleanups.set(element, Reveal(element, options));
}

function registerAll(selector, optionsForIndex) {
  document.querySelectorAll(selector).forEach((element, index) => {
    const options = typeof optionsForIndex === 'function'
      ? optionsForIndex(index, element)
      : optionsForIndex;

    register(element, options || {});
  });
}

function removeDetachedCleanups() {
  cleanups.forEach((cleanup, element) => {
    if (element.isConnected) return;
    cleanup();
    cleanups.delete(element);
  });
}

function scanHomepage() {
  scanFrame = 0;
  removeDetachedCleanups();

  // Introdução SEO que funciona como o verdadeiro título principal em produção.
  register(document.querySelector('#homeSeoHeading'), { direction: 'up' });
  register(document.querySelector('.cavero-intro-description'), { direction: 'up', delay: 140 });
  register(document.querySelector('.cavero-intro-actions'), { direction: 'up', delay: 240 });

  // Hero visual CAVERO.
  register(document.querySelector('#premiumHeroKicker'), { direction: 'up' });
  register(document.querySelector('#premiumHeroTitle'), { direction: 'up', delay: 80 });
  register(document.querySelector('#premiumHeroSub'), { direction: 'up', delay: 150 });
  register(document.querySelector('#premiumHeroPrice'), { direction: 'up', delay: 220 });
  register(document.querySelector('#premiumHeroCta'), { direction: 'up', delay: 300 });

  // Avaliações e prova social.
  register(document.querySelector('#avaliacoes-loja .store-proof-head'), { direction: 'fade' });
  register(document.querySelector('#avaliacoes-loja .store-review-shell'), { direction: 'fade', delay: 120 });
  registerAll('#storeReviewTrack > .store-review-card', index => ({
    direction: 'up',
    delay: index * 90
  }));

  // Destaques e coleção.
  register(document.querySelector('#destaques .section-head'), { direction: 'up' });
  registerAll('#featuredGrid > .featured', index => ({
    direction: 'up',
    delay: index * 120
  }));

  register(document.querySelector('#colecao .collection-intro h2'), { direction: 'up' });
  register(document.querySelector('#colecao .collection-intro .home-lead'), { direction: 'up', delay: 120 });
  registerAll('#grid > .family-card', index => ({
    direction: 'up',
    delay: index * 120
  }));

  // Conteúdo intermédio e CTA.
  register(document.querySelector('#sobre .about-copy'), { direction: 'up' });
  registerAll('#sobre .about-pillar', index => ({
    direction: 'up',
    delay: index * 90
  }));
  register(document.querySelector('#faq .faq-side'), { direction: 'up' });
  registerAll('#faq .faq-list > details', index => ({
    direction: 'up',
    delay: index * 70
  }));
  register(document.querySelector('.home-end-cta'), { direction: 'up' });

  // Bloco Instagram inserido durante o build.
  register(document.querySelector('.cavero-instagram-heading'), { direction: 'up' });
  register(document.querySelector('.cavero-instagram-profile'), { direction: 'fade', delay: 120 });
  registerAll('.cavero-instagram-tile', index => ({
    direction: 'up',
    delay: index * 90
  }));
}

function queueScan() {
  if (scanFrame) return;
  scanFrame = window.requestAnimationFrame(scanHomepage);
}

function initHomepageScrollReveal() {
  scanHomepage();

  if ('MutationObserver' in window) {
    mutationObserver = new MutationObserver(queueScan);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  window.addEventListener('pageshow', queueScan);
}

function cleanupHomepageScrollReveal() {
  mutationObserver?.disconnect();
  mutationObserver = null;
  window.cancelAnimationFrame(scanFrame);
  window.removeEventListener('pageshow', queueScan);

  cleanups.forEach(cleanup => cleanup());
  cleanups.clear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomepageScrollReveal, { once: true });
} else {
  initHomepageScrollReveal();
}

window.addEventListener('pagehide', cleanupHomepageScrollReveal, { once: true });
