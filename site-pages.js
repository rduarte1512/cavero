(() => {
  const UPDATED = '6 de setembro de 2026';
  const SITE_PATHS = {
    search: '/pesquisar',
    privacy: '/politica-de-privacidade',
    returns: '/politica-de-devolucoes',
    legal: '/aviso-legal',
    shipping: '/politica-de-envio',
    terms: '/termos-de-servico'
  };

  const SITE_ROUTE_TO_KEY = Object.fromEntries(Object.entries(SITE_PATHS).map(([key,path])=>[path,key]));

  const PAGES = {
    privacy: {
      title: 'Política de Privacidade',
      kicker: 'PRIVACIDADE · CAVERO WATCHES',
      intro: 'Explicamos de forma clara que dados podem ser tratados quando visitas a loja, pesquisas produtos, efetuas uma encomenda ou contactas a CAVERO, para que saibas como e porquê essa informação é utilizada.',
      sections: [
        ['responsavel','1. Quem trata os dados',`<p>A <strong>CAVERO Watches</strong> é a designação comercial utilizada nesta loja online e atua como responsável pelo tratamento dos dados recolhidos diretamente através da experiência CAVERO, sem prejuízo de determinados fornecedores tecnológicos poderem atuar como responsáveis independentes ou subcontratantes.</p><p>Quando recorremos a serviços externos para alojamento, pagamentos, comunicações, análise de desempenho ou entrega, apenas partilhamos a informação necessária à prestação desse serviço.</p>`],
        ['dados','2. Que dados podemos recolher',`<p>Dependendo da forma como utilizas a loja, podemos tratar:</p><ul><li>dados de identificação e contacto, como nome, apelido, email e telefone;</li><li>dados de entrega, como morada, código postal, localidade e país;</li><li>informação relacionada com a encomenda, incluindo produtos, variantes, quantidades, preço e estado da compra;</li><li>informação técnica, como tipo de dispositivo, navegador, endereço IP, páginas visitadas e dados essenciais de segurança;</li><li>mensagens ou informação que nos forneças voluntariamente quando pedes apoio.</li></ul><div class="policy-note"><strong>Dados de cartão:</strong> quando existir processamento de pagamentos reais, os dados sensíveis de cartão deverão ser tratados diretamente pelo prestador de pagamentos utilizado no checkout. A CAVERO não pretende armazenar números completos de cartão ou códigos de segurança.</div>`],
        ['finalidades','3. Para que utilizamos os dados',`<p>Os dados podem ser utilizados para processar e acompanhar encomendas, preparar a entrega, prestar apoio ao cliente, prevenir fraude e abuso, cumprir obrigações legais, melhorar a navegação da loja e manter a segurança dos nossos sistemas.</p><p>Quando a lei o permitir e exista a base adequada, também poderemos utilizar dados para comunicações comerciais. Sempre que for exigido consentimento, o utilizador poderá recusá-lo ou retirá-lo.</p>`],
        ['bases','4. Base para o tratamento',`<p>Tratamos informação quando isso é necessário para executar um contrato ou diligências pré-contratuais, cumprir obrigações legais, proteger interesses legítimos relacionados com segurança e melhoria do serviço ou, quando aplicável, com base no consentimento do utilizador.</p>`],
        ['partilha','5. Com quem os dados podem ser partilhados',`<p>A informação pode ser transmitida apenas quando necessário a fornecedores de alojamento e infraestrutura, empresas de transporte, prestadores de pagamento, ferramentas de prevenção de fraude, serviços de comunicação e autoridades legalmente competentes.</p><p>Não vendemos bases de dados de clientes a terceiros para que estes utilizem os dados de forma independente para fins publicitários próprios.</p>`],
        ['cookies','6. Cookies e armazenamento local',`<p>A loja pode utilizar cookies, armazenamento local do navegador e tecnologias semelhantes para manter o carrinho, guardar preferências, medir o funcionamento da página e proteger sessões. Alguns elementos essenciais podem funcionar sem consentimento adicional; tecnologias opcionais devem respeitar os requisitos legais aplicáveis.</p><p>Atualmente, o carrinho CAVERO pode permanecer guardado no próprio dispositivo para que a seleção não desapareça quando fechas ou atualizas a página.</p>`],
        ['conservacao','7. Durante quanto tempo conservamos os dados',`<p>Os dados são mantidos apenas pelo período necessário para cumprir a finalidade que justificou a recolha e os prazos legais aplicáveis. Informação de encomendas e faturação pode ter de ser conservada durante períodos superiores aos dados utilizados apenas para apoio ou análise técnica.</p>`],
        ['direitos','8. Os teus direitos',`<p>Nos termos da legislação aplicável, podes ter direito a solicitar acesso, retificação, apagamento, limitação, oposição, portabilidade e retirada de consentimento, sem comprometer a licitude do tratamento já realizado.</p><p>Também podes apresentar reclamação junto da autoridade de controlo competente em matéria de proteção de dados.</p>`],
        ['seguranca','9. Segurança e atualizações',`<p>Aplicamos medidas técnicas e organizativas proporcionais ao tipo de informação tratada. Nenhum sistema ligado à Internet oferece risco zero, mas procuramos reduzir acessos indevidos, perda, alteração ou divulgação não autorizada.</p><p>Esta política poderá ser atualizada sempre que a loja, os fornecedores ou a legislação relevante mudem. A versão publicada nesta página é a versão em vigor.</p>`]
      ]
    },
    returns: {
      title: 'Política de Devoluções',
      kicker: 'DEVOLUÇÕES · CAVERO WATCHES',
      intro: 'Queremos que o processo de devolução seja simples e previsível. Nesta página encontras as regras gerais para desistência, produto com defeito, produto incorreto e reembolso.',
      sections: [
        ['desistencia','1. Direito de livre resolução',`<p>Nas compras à distância efetuadas por consumidores, aplica-se o <strong>prazo legal de livre resolução aplicável</strong>. Em Portugal e na União Europeia, este prazo é normalmente de <strong>14 dias</strong> a contar da receção da encomenda, salvo exceção prevista na lei.</p><p>Para exercer este direito, o cliente deve comunicar de forma inequívoca que pretende devolver a encomenda dentro do prazo aplicável.</p>`],
        ['condicoes','2. Condições do produto devolvido',`<p>O relógio deve ser devolvido com cuidado, sem sinais de utilização que ultrapassem o necessário para verificar a natureza, características e funcionamento do produto. Sempre que possível, deve seguir acompanhado dos acessórios, proteção e embalagem recebidos.</p><p>Uma utilização que diminua de forma relevante o valor do artigo pode influenciar o valor reembolsado nos termos permitidos por lei.</p>`],
        ['como','3. Como iniciar uma devolução',`<p>Antes de enviar qualquer artigo, contacta o apoio CAVERO através do canal de suporte indicado na tua confirmação de encomenda. Indica o número da encomenda, o artigo a devolver e o motivo.</p><p>Depois da validação inicial, receberás as instruções de devolução e a morada ou procedimento aplicável. <strong>Não envies o artigo para uma morada diferente da indicada no processo de devolução.</strong></p>`],
        ['custos','4. Custos de devolução',`<p>Quando a devolução resulta apenas de mudança de opinião ou livre resolução, os custos diretos de devolução podem ficar a cargo do cliente, nos termos legalmente permitidos e de acordo com as instruções fornecidas no pedido.</p><p>Se o produto recebido estiver incorreto, danificado ou apresentar defeito confirmado imputável à encomenda, a CAVERO indicará a solução adequada sem transferir para o cliente custos que legalmente não lhe sejam devidos.</p>`],
        ['defeitos','5. Produto danificado, incorreto ou com defeito',`<p>Se receberes um produto danificado, diferente do encomendado ou com um problema de conformidade, comunica a situação assim que possível e envia fotografias claras do artigo, embalagem e etiqueta da encomenda quando solicitado.</p><p>Após análise, poderemos propor reparação, substituição, redução adequada do preço ou reembolso, conforme o caso e os direitos previstos na legislação aplicável.</p>`],
        ['reembolso','6. Reembolso',`<p>Depois de confirmada a devolução e verificadas as condições aplicáveis, o reembolso é efetuado pelo meio de pagamento adequado ou por outro método acordado quando necessário. Os prazos bancários podem variar consoante o prestador de pagamento.</p><p>Nos casos de livre resolução, o reembolso respeitará os prazos e condições definidos na legislação aplicável, podendo ser retido até receção do artigo devolvido ou apresentação de prova de envio quando legalmente permitido.</p>`],
        ['excecoes','7. Exceções',`<p>Determinados bens personalizados, modificados especificamente para o cliente ou abrangidos por outra exceção legal podem não beneficiar do direito de livre resolução. Quando uma exceção for relevante para um produto CAVERO, essa informação deverá ser apresentada antes da compra.</p>`],
        ['apoio','8. Apoio ao cliente',`<div class="policy-highlight"><strong>Guarda a confirmação da encomenda.</strong><p>É a forma mais rápida de localizarmos a compra e dar seguimento a um pedido de devolução, substituição ou reembolso.</p></div>`]
      ]
    },
    legal: {
      title: 'Aviso Legal',
      kicker: 'INFORMAÇÃO LEGAL · CAVERO WATCHES',
      intro: 'Este aviso estabelece as condições gerais de utilização do website CAVERO e clarifica a natureza da informação, propriedade intelectual e responsabilidades associadas à utilização da loja.',
      sections: [
        ['operador','1. Operador da loja',`<p><strong>CAVERO Watches</strong> é a designação comercial apresentada neste website. A identificação legal e fiscal do titular da atividade responsável pela venda deve constar dos documentos comerciais e fiscais aplicáveis à encomenda e das comunicações formais enviadas ao cliente.</p>`],
        ['website','2. Utilização do website',`<p>O utilizador compromete-se a navegar de forma legítima e a não tentar perturbar, explorar vulnerabilidades, copiar áreas protegidas, automatizar abusivamente pedidos ou utilizar o website para fins fraudulentos.</p><p>A CAVERO pode limitar temporariamente o acesso a funcionalidades quando isso seja necessário para manutenção, segurança ou correção de erros.</p>`],
        ['conteudos','3. Informação de produto',`<p>Procuramos apresentar fotografias, cores, acabamentos, preços e descrições com rigor. A perceção de cor pode variar conforme o ecrã utilizado e pequenas diferenças visuais podem resultar de iluminação, produção ou atualização de imagens.</p><p>Quando existir erro manifesto de preço, descrição ou disponibilidade, a situação será tratada de acordo com a legislação aplicável e o cliente será informado sempre que necessário.</p>`],
        ['marca','4. Marca e propriedade intelectual',`<p>O nome CAVERO, elementos gráficos, textos próprios, estrutura visual, código, fotografias pertencentes à marca e restantes conteúdos protegidos não podem ser reproduzidos, revendidos, alterados ou utilizados comercialmente sem autorização, salvo nos casos permitidos por lei.</p>`],
        ['links','5. Serviços e ligações externas',`<p>A loja pode integrar ou encaminhar para serviços de terceiros, como pagamentos, transportadoras ou plataformas técnicas. Esses serviços podem ter políticas e condições próprias, pelas quais são responsáveis nos termos aplicáveis.</p>`],
        ['responsabilidade','6. Disponibilidade e responsabilidade',`<p>Embora procuremos manter o website disponível e seguro, podem ocorrer interrupções, manutenção, falhas de rede ou eventos fora do nosso controlo. Nada neste aviso limita direitos imperativos dos consumidores nem exclui responsabilidades que não possam ser legalmente excluídas.</p>`],
        ['lei','7. Lei aplicável',`<p>A utilização da loja e as relações de consumo são reguladas pela legislação aplicável ao contrato e pelos direitos obrigatórios do consumidor. Quando exista um mecanismo legal de resolução alternativa de litígios aplicável, o consumidor mantém o direito de recorrer aos meios previstos na lei.</p>`]
      ]
    },
    shipping: {
      title: 'Política de Envio',
      kicker: 'ENTREGA · CAVERO WATCHES',
      intro: 'Consulta aqui o prazo estimado, custo de envio, preparação da encomenda, acompanhamento e o que acontece em caso de atraso ou morada incorreta.',
      sections: [
        ['prazo','1. Prazo estimado de entrega',`<div class="policy-highlight"><strong>Entrega estimada: 5 a 13 dias.</strong><p>O prazo é uma estimativa e pode variar ligeiramente consoante destino, processamento, transportadora, fins de semana, feriados ou situações excecionais fora do controlo da CAVERO.</p></div>`],
        ['gratuito','2. Envio gratuito',`<p>O envio normal apresentado na loja é <strong>gratuito</strong>. O valor dos portes é 0,00 € para as encomendas abrangidas por esta política.</p><p>Se no futuro existir um serviço opcional de entrega diferente ou expresso, o respetivo preço deverá ser mostrado antes de o cliente concluir a encomenda.</p>`],
        ['processamento','3. Preparação da encomenda',`<p>Após a confirmação da compra, a encomenda entra em processamento. Poderão ser efetuadas verificações de pagamento, morada e disponibilidade antes da expedição. A estimativa de entrega inclui o fluxo normal de preparação e transporte apresentado ao cliente.</p>`],
        ['tracking','4. Acompanhamento',`<p>Quando existir número de rastreio ou atualização fornecida pela transportadora, essa informação pode ser enviada ao cliente por email ou outro canal associado à encomenda. Algumas atualizações podem demorar algum tempo a aparecer após a expedição.</p>`],
        ['morada','5. Morada incorreta ou incompleta',`<p>É responsabilidade do cliente confirmar nome, morada, código postal, localidade e contacto antes de finalizar a compra. Se detetares um erro, contacta o apoio o mais rapidamente possível. Depois da expedição, pode não ser possível alterar o destino.</p>`],
        ['atrasos','6. Atrasos e encomendas não recebidas',`<p>Se a encomenda ultrapassar de forma significativa o prazo estimado, contacta o apoio CAVERO com o número da encomenda. Iremos verificar o estado disponível e, quando necessário, abrir averiguação junto do operador responsável pela entrega.</p>`],
        ['impostos','7. Impostos e valor cobrado',`<p>Para compras destinadas a Portugal, o <strong>total apresentado no checkout é o valor cobrado pela CAVERO</strong> pela encomenda e o envio normal é gratuito. A loja não adiciona uma taxa separada de envio ao preço apresentado.</p><p>Qualquer obrigação legal extraordinária imposta diretamente por uma autoridade e que não seja cobrada pela CAVERO depende do enquadramento aplicável ao envio. A informação apresentada no checkout prevalece quanto aos valores efetivamente cobrados pela loja.</p>`],
        ['rececao','8. Receção da encomenda',`<p>Ao receber o pacote, verifica se apresenta danos exteriores relevantes. Se houver um problema visível, fotografa a embalagem antes de a descartar e comunica a situação ao apoio para facilitar a análise.</p>`]
      ]
    },
    terms: {
      title: 'Termos de Serviço',
      kicker: 'TERMOS · CAVERO WATCHES',
      intro: 'Estes termos regulam a utilização da loja CAVERO e as condições gerais aplicáveis às encomendas efetuadas através do website.',
      sections: [
        ['aceitacao','1. Aceitação dos termos',`<p>Ao utilizar este website ou efetuar uma encomenda, concordas em respeitar estes termos e as políticas que fazem parte da experiência de compra, incluindo as regras de envio, devoluções e privacidade.</p><p>Os direitos imperativos do consumidor prevalecem sempre que uma disposição contratual não possa afastá-los.</p>`],
        ['produtos','2. Produtos e disponibilidade',`<p>A coleção, variantes, fotografias e preços podem ser atualizados. A apresentação de um artigo no website não garante disponibilidade ilimitada. Se uma encomenda não puder ser satisfeita, o cliente será informado e o pagamento será tratado conforme aplicável.</p>`],
        ['precos','3. Preços',`<p>Os preços visíveis no website são apresentados em euros para a experiência destinada a Portugal, salvo indicação diferente. Descontos, preços anteriores e campanhas podem ter duração limitada e ser alterados para compras futuras.</p><p>O preço confirmado no processo de compra é o preço aplicável àquela encomenda, sem prejuízo de correção de erros manifestos nos termos da lei.</p>`],
        ['encomenda','4. Formação da encomenda',`<p>O cliente é responsável por verificar produtos, variantes, quantidades, nome, contacto e morada antes de confirmar. A receção de um pedido pode ser seguida de validações técnicas, de pagamento ou disponibilidade necessárias à aceitação e processamento.</p>`],
        ['pagamento','5. Pagamento',`<p>Os métodos disponíveis são os apresentados no checkout no momento da compra. O pagamento pode ser processado por prestadores externos especializados, sujeitos aos seus mecanismos de autenticação e segurança.</p><p>A CAVERO não deve solicitar por mensagem dados completos de cartão ou códigos de segurança fora do fluxo oficial de pagamento.</p>`],
        ['entrega','6. Entrega',`<p>O envio normal é apresentado como gratuito e o prazo estimado é de <strong>5 a 13 dias</strong>. A estimativa não elimina direitos legais do consumidor em caso de incumprimento relevante.</p>`],
        ['devolucao','7. Devoluções e conformidade',`<p>Os pedidos de devolução, livre resolução, produto incorreto, dano ou falta de conformidade são tratados segundo a <strong>Política de Devoluções</strong> e a legislação aplicável. Nada nestes termos reduz direitos de garantia legal ou outros direitos obrigatórios.</p>`],
        ['conduta','8. Utilização proibida',`<p>Não é permitido utilizar a loja para fraude, abuso de promoções, interferência técnica, recolha automatizada não autorizada, tentativa de acesso a áreas protegidas ou qualquer atividade ilegal.</p>`],
        ['alteracoes','9. Alterações e interrupções',`<p>Podemos atualizar a estrutura, conteúdos, catálogo e estes termos para refletir mudanças no serviço ou na legislação. Alterações não devem retirar retroativamente direitos adquiridos numa encomenda já concluída.</p>`],
        ['litigios','10. Lei e resolução de litígios',`<p>Aplicam-se as regras legais relevantes à venda online e aos direitos do consumidor. O consumidor mantém acesso aos tribunais e aos mecanismos de resolução alternativa de litígios previstos na lei quando sejam aplicáveis.</p>`]
      ]
    }
  };

  function ensureView(){
    let view=document.getElementById('sitePageView');
    if(view) return view;
    view=document.createElement('section');
    view.id='sitePageView';
    view.className='site-page-view hidden';
    const checkout=document.getElementById('checkoutView');
    if(checkout) checkout.insertAdjacentElement('afterend',view); else document.body.appendChild(view);
    return view;
  }

  function buildPolicyPage(key){
    const page=PAGES[key];
    if(!page) return '';
    const toc=page.sections.map(([id,title])=>`<a href="#${id}" data-policy-anchor="${id}">${title}</a>`).join('');
    const content=page.sections.map(([id,title,html])=>`<section id="${id}"><h2>${title}</h2>${html}</section>`).join('');
    return `<div class="site-page-shell">
      <button class="site-page-back" type="button" data-site-home>← Voltar à loja</button>
      <div class="site-page-hero"><div class="site-page-kicker">${page.kicker}</div><h1>${page.title}</h1><p>${page.intro}</p><span class="site-page-updated">Última atualização: ${UPDATED}</span></div>
      <div class="site-page-content"><aside class="site-page-toc"><b>Nesta página</b>${toc}</aside><article class="site-copy">${content}</article></div>
    </div>`;
  }

  function productImage(f){
    if(!f) return '';
    const i=Number.isFinite(Number(f.defaultVariant))?Number(f.defaultVariant):0;
    return f.cleanImage || f.variants?.[i]?.image || f.variants?.[0]?.image || '';
  }

  function allSearchItems(){
    const items=[];
    if(typeof families!=='undefined') families.forEach(f=>{
      items.push({type:'product',key:f.key,label:f.name,sub:`${f.subtitle || 'Relógio CAVERO'} · ${f.variants.length} acabamentos`,keywords:[f.name,f.subtitle,f.desc,...f.variants.map(v=>v.name)].join(' ').toLowerCase(),image:productImage(f)});
    });
    items.push(
      {type:'catalog',label:'Catálogo completo',sub:'Ver todos os relógios CAVERO',keywords:'catalogo catálogo todos produtos relógios relogios coleção colecao'},
      {type:'page',key:'privacy',label:'Política de Privacidade',sub:'Dados pessoais, cookies, segurança e direitos',keywords:'privacidade dados cookies rgpd segurança direitos'},
      {type:'page',key:'returns',label:'Política de Devoluções',sub:'Devoluções, 14 dias, defeitos e reembolsos',keywords:'devolucao devolução devoluções reembolso troca defeito 14 dias'},
      {type:'page',key:'shipping',label:'Política de Envio',sub:'Envio gratuito e entrega estimada 5–13 dias',keywords:'envio entrega prazo portes gratuito tracking rastreio 5 13 dias'},
      {type:'page',key:'terms',label:'Termos de Serviço',sub:'Condições de compra e utilização da loja',keywords:'termos serviço compra condições pagamento'},
      {type:'page',key:'legal',label:'Aviso Legal',sub:'Informação legal e utilização do website',keywords:'aviso legal responsabilidade propriedade intelectual'},
      {type:'home',section:'sobre',label:'Sobre a CAVERO',sub:'Conhece a marca e a nossa forma de trabalhar',keywords:'sobre nós marca cavero empresa quem somos'},
      {type:'home',section:'faq',label:'Perguntas frequentes',sub:'Envio, entrega, impostos e compra na loja oficial',keywords:'faq perguntas frequentes impostos entrega loja oficial'},
      {type:'home',section:'destaques',label:'Destaques CAVERO',sub:'Modelos selecionados da coleção',keywords:'destaques mais vendidos melhores relógios'}
    );
    return items;
  }

  function searchResult(item){
    const visual=item.image?`<img src="${item.image}" alt="${item.label}">`:`<div class="search-result-icon">C</div>`;
    const kind=item.type==='product'?'RELÓGIO':item.type==='catalog'?'CATÁLOGO':'CAVERO';
    const attrs=item.type==='product'?`data-search-product="${item.key}"`:item.type==='catalog'?`data-search-catalog`:item.type==='page'?`data-search-page="${item.key}"`:`data-search-home="${item.section}"`;
    return `<button class="search-page-result" type="button" ${attrs}>${visual}<span class="search-result-copy"><small>${kind}</small><b>${item.label}</b><span>${item.sub}</span></span><span class="search-result-arrow">→</span></button>`;
  }

  function updateFullSearch(){
    const input=document.getElementById('fullStoreSearch');
    const out=document.getElementById('fullStoreSearchResults');
    const summary=document.getElementById('fullStoreSearchSummary');
    if(!input||!out) return;
    const q=input.value.trim().toLowerCase();
    const items=allSearchItems();
    const results=q?items.filter(item=>(item.label+' '+item.sub+' '+item.keywords).toLowerCase().includes(q)):items.filter(item=>item.type==='product'||item.type==='catalog').slice(0,6);
    out.innerHTML=results.length?results.slice(0,14).map(searchResult).join(''):`<div class="search-empty"><b>Não encontrámos resultados.</b><p>Tenta pesquisar pelo nome do relógio, cor, acabamento, envio, devolução ou outra área da loja.</p></div>`;
    if(summary) summary.textContent=q?`${results.length} ${results.length===1?'resultado encontrado':'resultados encontrados'}`:'Sugestões para começares';
  }

  function buildSearchPage(){
    return `<div class="site-page-shell store-search-page">
      <button class="site-page-back" type="button" data-site-home>← Voltar à loja</button>
      <div class="site-page-hero"><div class="site-page-kicker">PESQUISAR · CAVERO WATCHES</div><h1>O que procuras?</h1><p>Pesquisa por modelo, cor, acabamento ou por qualquer área da loja. Seleciona um resultado e abrimos diretamente a página certa.</p></div>
      <div class="full-search-wrap">
        <div class="full-search-box"><input id="fullStoreSearch" type="search" autocomplete="off" placeholder="Ex.: Velocity, azul, envio, devoluções..." aria-label="Pesquisar em toda a loja"></div>
        <div class="search-page-summary" id="fullStoreSearchSummary">Sugestões para começares</div>
        <div class="search-page-results" id="fullStoreSearchResults"></div>
        <div class="search-quick-links"><button type="button" data-quick-search="azul">Azul</button><button type="button" data-quick-search="cronógrafo">Cronógrafo</button><button type="button" data-quick-search="envio">Envio</button><button type="button" data-quick-search="devoluções">Devoluções</button></div>
      </div>
    </div>`;
  }

  function bindViewEvents(view){
    view.querySelector('[data-site-home]')?.addEventListener('click',()=>window.showHome?.());
    view.querySelectorAll('[data-policy-anchor]').forEach(a=>a.addEventListener('click',e=>{
      e.preventDefault();document.getElementById(a.dataset.policyAnchor)?.scrollIntoView({behavior:'smooth',block:'start'});
    }));
    const input=view.querySelector('#fullStoreSearch');
    if(input){
      input.addEventListener('input',updateFullSearch);
      view.querySelectorAll('[data-quick-search]').forEach(btn=>btn.addEventListener('click',()=>{input.value=btn.dataset.quickSearch||'';updateFullSearch();input.focus()}));
      view.querySelector('#fullStoreSearchResults')?.addEventListener('click',e=>{
        const product=e.target.closest('[data-search-product]');if(product){window.openProduct?.(product.dataset.searchProduct);return}
        const catalog=e.target.closest('[data-search-catalog]');if(catalog){window.openCatalog?.();return}
        const page=e.target.closest('[data-search-page]');if(page){window.openSitePage?.(page.dataset.searchPage);return}
        const home=e.target.closest('[data-search-home]');if(home){const section=home.dataset.searchHome;window.showHome?.();setTimeout(()=>document.getElementById(section)?.scrollIntoView({behavior:'smooth',block:'start'}),70)}
      });
      updateFullSearch();setTimeout(()=>input.focus(),80);
    }
  }

  function showSitePageBase(key){
    const view=ensureView();
    document.getElementById('homeView')?.classList.add('hidden');
    document.getElementById('productView')?.classList.add('hidden');
    document.getElementById('checkoutView')?.classList.add('hidden');
    document.getElementById('catalogView')?.classList.add('hidden');
    view.innerHTML=key==='search'?buildSearchPage():buildPolicyPage(key);
    view.classList.remove('hidden');
    bindViewEvents(view);
    window.scrollTo(0,0);
  }

  function hideSitePage(){ensureView().classList.add('hidden')}

  window.CAVERO_SITE_PATHS=SITE_PATHS;
  window.CAVERO_SITE_ROUTE_TO_KEY=SITE_ROUTE_TO_KEY;
  window.CAVERO_SITE_PAGES=PAGES;
  window.CAVERO_showSitePageBase=showSitePageBase;
  window.CAVERO_hideSitePage=hideSitePage;
  ensureView();
})();
