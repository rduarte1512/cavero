// Remove CAVERO Royale from the live storefront before the catalog is initialized.
// This keeps the product out of collection, search, recommendations and cart migration.
const royaleCatalogIndex = families.findIndex(f => f.key === 'royale');
if (royaleCatalogIndex >= 0) families.splice(royaleCatalogIndex, 1);

(() => {
  const SUPPORT_EMAIL = 'caverowatches@sapo.pt';
  const mailto = `mailto:${SUPPORT_EMAIL}`;

  function ensureTrustStyles(){
    if(document.getElementById('cavero-contact-origin-styles')) return;
    const style = document.createElement('style');
    style.id = 'cavero-contact-origin-styles';
    style.textContent = `
      .cavero-support-link{color:inherit;text-decoration:underline;text-underline-offset:3px;font-weight:700;overflow-wrap:anywhere}
      .cavero-footer-support{margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.14);font-size:13px;line-height:1.65}
      .cavero-footer-support b{display:block;margin-bottom:3px}
      .cavero-footer-support a{color:inherit}
      .cavero-support-card{margin:22px 0 0;padding:18px 20px;border:1px solid rgba(17,17,15,.11);border-radius:16px;background:#f7f6f1;color:#11110f}
      .cavero-support-card small{display:block;margin-bottom:5px;font-size:10px;font-weight:800;letter-spacing:.16em;color:#856d47}
      .cavero-support-card b{display:block;margin-bottom:5px;font-size:15px}
      .cavero-support-card p{margin:0;font-size:13px;line-height:1.65;color:#66645d}
      .cavero-support-card a{color:#11110f}
      .cavero-origin-note{margin-top:18px;padding:18px 20px;border-left:3px solid #856d47;background:#f7f6f1;font-size:13px;line-height:1.7;color:#55534d}
      .cavero-origin-note strong{color:#11110f}
      @media(max-width:600px){.cavero-support-card,.cavero-origin-note{padding:15px 16px}}
    `;
    document.head.appendChild(style);
  }

  function removeInstagramPrompts(){
    document.querySelectorAll('.cavero-instagram,[data-instagram-section],[id*="instagram" i]').forEach(el => el.remove());
    document.querySelectorAll('a[href*="instagram.com" i],a[href*="instagram" i],button').forEach(el => {
      const text=(el.textContent||'').trim().toLowerCase();
      const href=(el.getAttribute?.('href')||'').toLowerCase();
      if(href.includes('instagram') || text.includes('instagram')){
        const section=el.closest('.cavero-instagram');
        if(section) section.remove(); else el.remove();
      }
    });
  }

  function addFooterContact(){
    const footerBrand=document.querySelector('.footer-brand-block');
    if(footerBrand && !footerBrand.querySelector('.cavero-footer-support')){
      const block=document.createElement('div');
      block.className='cavero-footer-support';
      block.innerHTML=`<b>Apoio ao cliente</b><span>Dúvidas sobre produtos, encomendas, entrega ou devoluções?</span><br><a class="cavero-support-link" href="${mailto}">${SUPPORT_EMAIL}</a>`;
      footerBrand.appendChild(block);
    }

    const footer=document.querySelector('.site-footer');
    if(footer && !footer.querySelector('[data-cavero-contact-note]')){
      const note=document.createElement('div');
      note.dataset.caveroContactNote='true';
      note.style.cssText='max-width:1240px;margin:0 auto;padding:0 20px 22px;font-size:12px;line-height:1.6;opacity:.78';
      note.innerHTML=`Contacto CAVERO: <a class="cavero-support-link" href="${mailto}">${SUPPORT_EMAIL}</a> · Respondemos a questões sobre encomendas, assistência e acompanhamento de entrega.`;
      footer.appendChild(note);
    }
  }

  function updateOriginCopy(){
    const about=document.querySelector('#sobre .about-copy');
    if(about){
      const leads=about.querySelectorAll('.home-lead');
      if(leads[1]) leads[1].textContent='A CAVERO é uma marca operada a partir de Portugal e os nossos relógios são produzidos na China por uma fábrica parceira especializada, escolhida pela qualidade de acabamento e consistência dos modelos fornecidos. Preferimos explicar a origem com transparência em vez de esconder onde a produção é feita.';
      if(!about.querySelector('.cavero-origin-note')){
        const note=document.createElement('div');
        note.className='cavero-origin-note';
        note.innerHTML='<strong>Produção especializada na China.</strong> A origem chinesa não é usada para reduzir a exigência sobre o produto: trabalhamos com uma fábrica parceira selecionada pela qualidade visual, consistência de acabamento e capacidade de produzir os modelos e variantes escolhidos para a coleção CAVERO.';
        const aboutNote=about.querySelector('.about-note');
        if(aboutNote) aboutNote.insertAdjacentElement('afterend',note); else about.appendChild(note);
      }
    }

    const originPillar=[...document.querySelectorAll('#sobre .about-pillar')].find(el => /origem/i.test(el.textContent||''));
    if(originPillar){
      const title=originPillar.querySelector('h3');
      const text=originPillar.querySelector('p');
      if(title) title.textContent='Produção chinesa, seleção CAVERO';
      if(text) text.textContent='Os relógios são produzidos na China por uma fábrica parceira especializada. A CAVERO seleciona a coleção e os acabamentos procurando consistência, boa apresentação e uma relação qualidade/preço adequada a cada modelo.';
    }

    const faq=[...document.querySelectorAll('#faq details')];
    const originFaq=faq.find(el => /onde.*(desenhados|produzidos)|origem/i.test(el.querySelector('summary')?.textContent||''));
    if(originFaq){
      const summary=originFaq.querySelector('summary');
      const p=originFaq.querySelector('p');
      if(summary) summary.textContent='Onde são produzidos os relógios CAVERO?';
      if(p) p.innerHTML='Os relógios CAVERO são <strong>produzidos na China por uma fábrica parceira especializada</strong>, selecionada pela qualidade de acabamento e consistência dos modelos fornecidos. A marca é operada a partir de Portugal e comunica a origem de forma transparente: a qualidade depende da fábrica, dos materiais, da montagem e do controlo aplicado ao produto — não apenas do país de produção.';
    }
  }

  function addSupportEverywhere(){
    const proofItems=[...document.querySelectorAll('#caveroProofBar .cavero-proof-item')];
    if(proofItems.length){
      const item=proofItems[proofItems.length-1];
      item.innerHTML=`<b>Apoio direto CAVERO</b><span><a class="cavero-support-link" href="${mailto}">${SUPPORT_EMAIL}</a></span>`;
    }

    const faqList=document.querySelector('#faq .faq-list');
    if(faqList && !faqList.querySelector('[data-cavero-support-faq]')){
      const details=document.createElement('details');
      details.dataset.caveroSupportFaq='true';
      details.innerHTML=`<summary>Como posso contactar a CAVERO?</summary><p>Podes contactar diretamente o nosso apoio através de <a class="cavero-support-link" href="${mailto}">${SUPPORT_EMAIL}</a>. Usa este email para dúvidas sobre produtos, encomendas, entrega, tracking, devoluções ou assistência.</p>`;
      faqList.appendChild(details);
    }

    const productView=document.getElementById('productView');
    if(productView && !productView.classList.contains('hidden') && productView.children.length && !productView.querySelector('.cavero-product-support')){
      const card=document.createElement('div');
      card.className='cavero-support-card cavero-product-support';
      card.innerHTML=`<small>APOIO CAVERO</small><b>Precisas de ajuda antes de comprar?</b><p>Fala connosco em <a class="cavero-support-link" href="${mailto}">${SUPPORT_EMAIL}</a>. Podemos ajudar com variantes, características, encomenda e entrega.</p>`;
      productView.appendChild(card);
    }

    const checkoutView=document.getElementById('checkoutView');
    if(checkoutView && !checkoutView.classList.contains('hidden') && checkoutView.children.length && !checkoutView.querySelector('.cavero-checkout-support')){
      const card=document.createElement('div');
      card.className='cavero-support-card cavero-checkout-support';
      card.innerHTML=`<small>PRECISAS DE AJUDA?</small><b>Apoio durante a compra</b><p>Contacta <a class="cavero-support-link" href="${mailto}">${SUPPORT_EMAIL}</a>. Depois da compra, as atualizações de acompanhamento da encomenda podem ser enviadas para o email usado no checkout.</p>`;
      checkoutView.appendChild(card);
    }
  }

  function applyTrustContent(){
    ensureTrustStyles();
    removeInstagramPrompts();
    addFooterContact();
    updateOriginCopy();
    addSupportEverywhere();
  }

  window.addEventListener('load', () => {
    setTimeout(applyTrustContent, 0);
    const observer=new MutationObserver(() => requestAnimationFrame(applyTrustContent));
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  });
})();
