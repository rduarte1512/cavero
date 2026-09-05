(() => {
  const TARGET = 'assets/reviews/apex-customer-01.jpg';
  const SOURCE = 'assets/reviews/apex-customer-01-v3.b64?v=20260905-2';
  let dataUrlPromise = null;

  function getDataUrl(){
    if(!dataUrlPromise){
      dataUrlPromise = fetch(SOURCE, {cache:'no-store'})
        .then(r => {
          if(!r.ok) throw new Error('review image data unavailable');
          return r.text();
        })
        .then(text => `data:image/jpeg;base64,${text.replace(/\s+/g,'')}`)
        .catch(err => {
          console.warn('CAVERO review image:', err);
          return '';
        });
    }
    return dataUrlPromise;
  }

  function fixImages(root=document){
    const images = [...root.querySelectorAll?.(`img.review-photo[src="${TARGET}"]`) || []];
    if(!images.length) return;
    images.forEach(img => {
      img.style.visibility = 'hidden';
      img.removeAttribute('src');
      img.alt = 'Foto do cliente com o CAVERO Apex Prateado e Azul';
    });
    getDataUrl().then(src => {
      if(!src) return;
      images.forEach(img => {
        img.src = src;
        img.onload = () => { img.style.visibility = 'visible'; };
      });
    });
  }

  fixImages();
  new MutationObserver(mutations => {
    for(const mutation of mutations){
      for(const node of mutation.addedNodes){
        if(node.nodeType === 1){
          if(node.matches?.(`img.review-photo[src="${TARGET}"]`)) fixImages(node.parentElement || document);
          else if(node.querySelector?.(`img.review-photo[src="${TARGET}"]`)) fixImages(node);
        }
      }
    }
  }).observe(document.body, {childList:true, subtree:true});
})();
