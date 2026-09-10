import { Reveal } from './Reveal.js';

const cleanups = [];

function addReveal(element, options) {
  if (!element) return;
  cleanups.push(Reveal(element, options));
}

function initHomepageScrollReveal() {
  addReveal(document.querySelector('#premiumHeroTitle'), { direction: 'up' });
  addReveal(document.querySelector('#premiumHeroSub'), { direction: 'up', delay: 150 });
  addReveal(document.querySelector('#premiumHeroCta'), { direction: 'up', delay: 260 });

  addReveal(document.querySelector('#colecao .collection-intro h2'), { direction: 'up' });
  document.querySelectorAll('#grid > .family-card').forEach((card, index) => {
    addReveal(card, { direction: 'up', delay: index * 120 });
  });

  document.querySelectorAll('#featuredGrid > .featured').forEach((card, index) => {
    addReveal(card, { direction: 'up', delay: index * 120 });
  });

  addReveal(document.querySelector('#avaliacoes-loja'), { direction: 'fade' });
  addReveal(document.querySelector('#destaques .section-head'), { direction: 'up' });
  addReveal(document.querySelector('#sobre .about-note'), { direction: 'up' });
  addReveal(document.querySelector('.home-end-cta'), { direction: 'up' });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomepageScrollReveal, { once: true });
} else {
  initHomepageScrollReveal();
}

window.addEventListener('pagehide', () => {
  cleanups.forEach(cleanup => cleanup());
  cleanups.length = 0;
}, { once: true });
