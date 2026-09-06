(() => {
  const btn=document.getElementById('searchBtn');
  const box=document.getElementById('searchBox');
  const input=document.getElementById('searchInput');
  const results=document.getElementById('searchResults');
  const overlay=document.getElementById('overlay');
  if(!btn||!box||!input||!results)return;

  btn.classList.add('header-search-icon');
  btn.setAttribute('aria-label','Pesquisar na CAVERO');
  btn.setAttribute('title','Pesquisar');
  btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.6"></circle><path d="M16 16l4.2 4.2"></path></svg>';
  box.classList.add('cavero-header-search');
  input.placeholder='Pesquisar relógios, modelos ou acabamentos...';

  const moneySearch=n=>new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(Number(n)||0);

  function quickLinks(){
    results.innerHTML=`<div class="cavero-search-intro"><small>PESQUISA CAVERO</small><strong>O que procuras?</strong></div>
      <div class="cavero-quick-links">
        <a class="cavero-quick-link" href="/catalogo">Todos os produtos <span>→</span></a>
        <a class="cavero-quick-link" href="/sobre-nos">Sobre nós <span>→</span></a>
      </div>`;
  }

  function closePanel(){
    box.classList.remove('open');
    if(overlay&&!document.getElementById('drawer')?.classList.contains('open'))overlay.classList.remove('open');
  }

  function openPanel(event){
    if(event){event.preventDefault();event.stopImmediatePropagation();}
    box.classList.add('open');
    if(overlay)overlay.classList.add('open');
    input.value='';
    quickLinks();
    setTimeout(()=>input.focus(),50);
  }

  btn.addEventListener('click',openPanel,true);

  input.oninput=()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){quickLinks();return;}
    const matches=[];
    if(typeof families!=='undefined')families.forEach(f=>{
      f.variants.forEach((v,index)=>{
        const haystack=[f.name,f.subtitle,v.name,f.desc||''].join(' ').toLowerCase();
        if(haystack.includes(q))matches.push({f,v,index});
      });
    });
    if(!matches.length){results.innerHTML='<div class="cavero-search-empty">Não encontrámos nenhum produto com essa pesquisa.</div>';return;}
    results.innerHTML='<div class="cavero-search-section-label">PRODUTOS</div>'+matches.slice(0,8).map(({f,v,index})=>`<div class="cavero-search-result" data-family="${f.key}" data-index="${index}"><img src="${v.image}" alt="${f.name}"><div><b>${f.name}</b><small>${v.name}</small></div><div class="cavero-search-result-price">${moneySearch(v.price)}</div></div>`).join('');
  };

  results.addEventListener('click',e=>{
    const item=e.target.closest('.cavero-search-result');
    if(!item)return;
    const key=item.dataset.family;
    const index=Number(item.dataset.index)||0;
    closePanel();
    if(typeof window.openProduct==='function'){
      window.openProduct(key);
      setTimeout(()=>{if(typeof window.selectVariant==='function')window.selectVariant(index)},0);
    }
  });

  document.getElementById('closeSearch')?.addEventListener('click',()=>{input.value='';quickLinks()});
  quickLinks();
})();