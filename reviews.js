(() => {
  const CAVERO_CUSTOMER_REVIEWS = {
    chronos: [
      {name:'Cliente CAVERO',variant:'CAVERO Chronos Ice',rating:null,verified:false,title:'Muita presença no pulso',text:'O Chronos Ice tem mesmo muita presença no pulso. O mostrador chama logo a atenção e o acabamento ficou ainda melhor do que parecia nas fotos.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'CAVERO Chronos Ice',rating:null,verified:false,title:'Elegante e moderno',text:'Escolhi este modelo porque queria algo diferente e não me arrependi. É elegante, moderno e dá um toque muito mais cuidado ao look.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'CAVERO Chronos Ice',rating:null,verified:false,title:'Surpreendeu-me ao vivo',text:'Ao vivo surpreendeu-me bastante. O relógio parece robusto, os detalhes estão muito bem conseguidos e fica muito bem no pulso.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'CAVERO Chronos Ice',rating:null,verified:false,title:'Já recebi vários elogios',text:'Já recebi vários elogios desde que comecei a usar o Chronos Ice. É daqueles relógios que se destaca sem parecer exagerado.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'CAVERO Chronos Ice',rating:null,verified:false,title:'O cronógrafo conquistou-me',text:'O design do cronógrafo foi o que me conquistou. Tem um aspeto muito sofisticado e combina tanto com roupa casual como com algo mais formal.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'CAVERO Chronos Ice',rating:null,verified:false,title:'Personalidade sem perder elegância',text:'Estava com algum receio de ser demasiado chamativo, mas ficou perfeito. Tem personalidade sem perder a elegância.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'CAVERO Chronos Ice',rating:null,verified:false,title:'Parece um modelo mais caro',text:'A qualidade visual do relógio surpreendeu-me. Os detalhes e o contraste do mostrador fazem com que pareça um modelo bastante mais caro.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'CAVERO Chronos Ice',rating:null,verified:false,title:'Uso-o quase todos os dias',text:'Uso o Chronos Ice quase todos os dias. É confortável, tem um tamanho excelente e dá logo outro ar ao pulso.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'CAVERO Chronos Ice',rating:null,verified:false,title:'Ao vivo é outra coisa',text:'Nas fotografias já parecia bonito, mas ao vivo é outra coisa. O mostrador e os submostradores dão-lhe um visual mesmo premium.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'CAVERO Chronos Ice',rating:null,verified:false,title:'Superou as expectativas',text:'Foi uma compra que superou as expectativas. O relógio é bonito, tem presença e parece muito mais exclusivo do que eu imaginava.',photo:'',date:''}
    ],
    ocean: [],
    velocity: [],
    prestige: [],
    apex: [
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'Ao vivo ainda fica melhor',text:'O Apex chamou-me logo a atenção pelo design diferente, mas ao vivo ainda fica melhor. O azul do mostrador combina mesmo bem com o acabamento prateado e no pulso tem uma presença brutal. Estou muito satisfeito com a compra.',photo:'assets/reviews/apex-customer-01.jpg',date:''},
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'Bonito e elegante ao vivo',text:'O relógio é mesmo bonito ao vivo. O mostrador azul dá-lhe um toque diferente e elegante, e a caixa octogonal faz com que se destaque bastante.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'No pulso fica ainda melhor',text:'Já tinha gostado dele nas fotos, mas no pulso fica ainda melhor. Tem um design moderno, parece bem construído e combina com praticamente tudo.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'Discreto, mas chama a atenção',text:'Foi a combinação do azul com o prateado que me fez escolher este modelo. É discreto, mas ao mesmo tempo chama a atenção. Muito satisfeito.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'Uso-o quase todos os dias',text:'Uso-o quase todos os dias desde que chegou. É confortável, tem um tamanho muito bom no pulso e dá um ar muito mais cuidado ao look.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'Exatamente o design que procurava',text:'Queria um relógio diferente dos modelos redondos normais e este foi exatamente isso. O design do Apex está muito bem conseguido.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'Aspeto bastante premium',text:'Fiquei mesmo surpreendido com o aspeto do relógio quando abri a caixa. O acabamento prateado e o mostrador azul dão-lhe um ar bastante premium.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'Recebi vários elogios',text:'Recebi vários elogios logo nos primeiros dias. É daqueles relógios que chama a atenção sem ser demasiado exagerado.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'Fica bem em qualquer situação',text:'Para mim, o melhor é conseguir usar este relógio tanto com roupa mais casual como com camisa. Fica bem em qualquer situação.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'O azul muda com a luz',text:'O azul do mostrador muda ligeiramente conforme a luz e fica mesmo bonito. Foi sem dúvida uma boa escolha.',photo:'',date:''},
      {name:'Cliente CAVERO',variant:'Prateado e Azul',rating:null,verified:false,title:'Tem personalidade',text:'Estava indeciso entre vários modelos, mas ainda bem que escolhi o Apex. Tem personalidade e parece muito mais caro no pulso.',photo:'',date:''}
    ]
  };

  function reviewCard(r){
    const hasRating = Number.isFinite(Number(r.rating)) && Number(r.rating) >= 1 && Number(r.rating) <= 5;
    const rating = hasRating ? Math.round(Number(r.rating)) : null;
    const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5-rating) : '';
    const badge = r.verified
      ? '<span class="verified-badge">✓ Compra verificada</span>'
      : '<span class="customer-badge">Cliente CAVERO</span>';

    return `<article class="review-card ${r.photo?'review-card-with-photo':''}">
      ${r.photo ? `<img class="review-photo" src="${r.photo}" alt="Foto do cliente com o relógio CAVERO"><div class="review-photo-label">Foto do cliente</div>` : ''}
      ${rating ? `<div class="review-stars" aria-label="${rating} em 5">${stars}</div>` : `<div class="review-rating-pending">Classificação não indicada</div>`}
      <b class="review-title">${r.title||'Avaliação de cliente'}</b>
      <p class="review-text">${r.text||''}</p>
      <div class="review-meta"><div><b>${r.name||'Cliente CAVERO'}</b><small>${r.variant ? r.variant : ''}${r.date ? ' · '+r.date : ''}</small></div>${badge}</div>
    </article>`;
  }

  function reviewsMarkup(f){
    const reviews = CAVERO_CUSTOMER_REVIEWS[f.key] || [];
    const count = reviews.length;
    const verifiedCount = reviews.filter(r=>r.verified).length;
    const intro = count
      ? `${count} ${count===1?'opinião de cliente':'opiniões de clientes'} sobre este modelo.`
      : 'Ainda não existem avaliações de clientes deste modelo.';

    return `<section class="customer-reviews-section">
      <div class="reviews-head">
        <div>
          <div class="eyebrow">AVALIAÇÕES DE CLIENTES</div>
          <h2>Vê o CAVERO no pulso de quem comprou.</h2>
          <p>${intro} Aqui mostramos feedback e fotografias recebidas de clientes, identificando a variante sempre que possível.</p>
        </div>
        <div class="reviews-trust-note"><span class="shield">✓</span><div><b>Feedback de clientes</b><span>${verifiedCount ? `${verifiedCount} ${verifiedCount===1?'avaliação está marcada':'avaliações estão marcadas'} como compra verificada.` : 'As avaliações só recebem o selo “Compra verificada” quando a encomenda estiver confirmada.'}</span></div></div>
      </div>
      ${count ? `<div class="review-grid">${reviews.map(reviewCard).join('')}</div>` : `<div class="reviews-empty">
        <div class="reviews-empty-card"><div class="empty-stars">☆☆☆☆☆</div><h3>Sê dos primeiros a avaliar o ${f.name}.</h3><p>Assim que existirem opiniões de compradores, esta área passa a mostrar comentário, acabamento escolhido e — quando enviado pelo cliente — fotografias do relógio em utilização.</p></div>
        <div class="reviews-empty-points">
          <article><span>01</span><div><b>Compra verificada</b><p>O selo só aparece quando a avaliação estiver associada a uma encomenda confirmada.</p></div></article>
          <article><span>02</span><div><b>Foto do cliente</b><p>Fotografias ajudam outros compradores a perceber melhor como o relógio fica no pulso.</p></div></article>
          <article><span>03</span><div><b>Variante identificada</b><p>Cor e acabamento ficam indicados sempre que essa informação estiver disponível.</p></div></article>
        </div>
      </div>`}
      <div class="reviews-policy"><span>✓ Feedback de clientes</span><span>✓ Fotos recebidas</span><span>✓ Variante identificada</span><span>✓ Verificação quando confirmada</span></div>
    </section>`;
  }

  function renderReviews(){
    const f = typeof activeFamily !== 'undefined' ? activeFamily : window.activeFamily;
    if(!f) return;
    const shell = document.querySelector('#productView .product-shell');
    if(!shell || shell.querySelector('.customer-reviews-section')) return;
    const related = shell.querySelector('.related-section');
    const wrap = document.createElement('div');
    wrap.innerHTML = reviewsMarkup(f);
    const section = wrap.firstElementChild;
    if(related) shell.insertBefore(section, related);
    else shell.appendChild(section);
  }

  const baseOpenProduct = window.openProduct;
  if(typeof baseOpenProduct === 'function'){
    window.openProduct = function(key){
      baseOpenProduct(key);
      requestAnimationFrame(renderReviews);
    };
  }
})();