(() => {
  const paths = window.CAVERO_SITE_PATHS;
  const routeToKey = window.CAVERO_SITE_ROUTE_TO_KEY;
  const pages = window.CAVERO_SITE_PAGES;
  if (!paths || !routeToKey || !pages) return;

  const extraPaths = {
    about: '/sobre-nos',
    legacy: '/o-nosso-legado-a-nossa-visao',
    official: '/porque-a-loja-oficial-cavero-watches'
  };

  Object.assign(paths, extraPaths);
  Object.entries(extraPaths).forEach(([key, path]) => { routeToKey[path] = key; });

  pages.about = {
    title: 'Sobre nós',
    kicker: 'SOBRE NÓS · CAVERO WATCHES',
    intro: 'A CAVERO Watches foi pensada para quem vê o relógio como parte do estilo pessoal. Nesta página explicamos a forma como construímos a coleção, o que valorizamos e o tipo de experiência que queremos oferecer em cada visita à loja.',
    sections: [
      ['quem-somos','1. Quem somos',`<p>A <strong>CAVERO Watches</strong> é uma marca de relógios focada numa coleção curta e visualmente distinta, com modelos clássicos, desportivos e contemporâneos. O objetivo é tornar a escolha mais simples: menos referências sem direção e mais atenção aos modelos que realmente têm personalidade.</p><p>Queremos que cada relógio seja apresentado de forma clara, com fotografias, acabamentos, preço e informação essencial acessíveis antes da compra.</p>`],
      ['filosofia','2. A nossa filosofia',`<p>Para nós, um relógio não serve apenas para indicar as horas. É um detalhe que pode transformar um look, transmitir personalidade e acompanhar diferentes momentos do dia.</p><div class="policy-highlight"><strong>Presença sem complicação.</strong><p>Design com identidade, informação clara e uma experiência de compra simples do primeiro clique até à escolha final.</p></div>`],
      ['colecao','3. Como construímos a coleção',`<p>Selecionamos modelos com identidades diferentes para que a coleção tenha variedade sem perder coerência. Procuramos equilibrar cronógrafos de presença, linhas mais clássicas, opções desportivas e formatos contemporâneos.</p><p>Cada família de produto pode incluir vários acabamentos, permitindo escolher cor, mostrador ou combinação que melhor se adapta ao estilo de cada pessoa.</p>`],
      ['experiencia','4. A experiência CAVERO',`<p>A loja foi desenhada para reduzir dúvidas antes da compra. As páginas de produto apresentam o modelo, variantes, preço atual, fotografias e informação relevante num único local.</p><p>Também disponibilizamos pesquisa em toda a loja, catálogo completo, políticas de envio e devolução e páginas próprias para cada relógio.</p>`],
      ['entrega','5. Entrega e informação clara',`<p>O envio normal apresentado na loja é <strong>gratuito</strong> e o prazo estimado de entrega é de <strong>5 a 13 dias</strong>. As condições detalhadas podem ser consultadas na Política de Envio.</p><p>Em caso de devolução, produto incorreto ou falta de conformidade, aplicam-se as regras descritas na Política de Devoluções e os direitos legais do consumidor.</p>`],
      ['compromisso','6. O nosso compromisso',`<p>Queremos continuar a melhorar a coleção e a experiência da loja sem perder aquilo que define a CAVERO Watches: uma seleção objetiva, apresentação cuidada e comunicação clara.</p><p>À medida que a marca evolui, novos modelos, acabamentos e melhorias de serviço podem ser adicionados, mantendo sempre a identidade visual e a simplicidade de escolha como prioridade.</p>`]
    ]
  };

  pages.legacy = {
    title: 'O nosso legado. A nossa visão.',
    kicker: 'IDENTIDADE · CAVERO WATCHES',
    intro: 'O legado da CAVERO Watches não é contado apenas por datas. É construído pela forma como pensamos o produto, pela atenção ao detalhe e pela visão de criar uma marca de relógios reconhecida pela sua presença e simplicidade.',
    sections: [
      ['origem','1. O ponto de partida',`<p>A CAVERO Watches nasce de uma ideia simples: um bom relógio deve ser fácil de escolher e difícil de ignorar. Em vez de criar uma loja carregada de referências semelhantes, a marca aposta numa coleção mais concentrada, onde cada modelo tem uma identidade própria.</p>`],
      ['legado','2. O nosso legado',`<p>O legado que queremos construir assenta em três ideias: <strong>design com presença</strong>, <strong>escolha clara</strong> e <strong>experiência consistente</strong>.</p><p>Para a CAVERO, legado significa fazer com que cada coleção mantenha uma linha reconhecível mesmo quando os modelos evoluem. Não depende apenas de um produto específico, mas da forma como a marca se apresenta e da relação que cria com quem escolhe usá-la.</p>`],
      ['visao','3. A nossa visão',`<p>A nossa visão é desenvolver a CAVERO Watches como uma marca cada vez mais completa, com uma identidade visual forte e uma coleção capaz de acompanhar estilos e ocasiões diferentes.</p><div class="policy-highlight"><strong>Queremos que CAVERO seja uma escolha de estilo.</strong><p>Uma marca lembrada pelo desenho dos seus relógios, pela forma como os apresenta e por uma experiência de compra direta e sem ruído.</p></div>`],
      ['design','4. Design que marca presença',`<p>Há pessoas que preferem um relógio discreto e outras que procuram um modelo que se torne o centro do look. A coleção CAVERO procura dar espaço às duas escolhas, mantendo um fio comum de acabamento cuidado e presença visual.</p><p>É por isso que a coleção inclui linguagens diferentes: cronógrafos, formas geométricas, mostradores de cor e propostas mais clássicas.</p>`],
      ['evolucao','5. Evoluir sem perder identidade',`<p>Uma marca cresce quando consegue mudar sem deixar de ser reconhecida. Novos modelos e acabamentos podem surgir, mas a intenção é preservar uma linguagem visual coerente e uma experiência de loja simples.</p>`],
      ['futuro','6. O futuro da CAVERO Watches',`<p>O futuro da CAVERO passa por continuar a aperfeiçoar a seleção, elevar a apresentação dos produtos e tornar cada interação com a marca mais clara e consistente.</p><p>Mais do que aumentar o número de referências, a prioridade é manter uma coleção em que cada relógio tenha uma razão para existir.</p>`]
    ]
  };

  pages.official = {
    title: 'Porquê a loja oficial CAVERO Watches?',
    kicker: 'LOJA OFICIAL · CAVERO WATCHES',
    intro: 'Comprar na loja oficial CAVERO Watches significa ter a coleção da marca, informação de produto, políticas e experiência de compra concentradas no mesmo local.',
    sections: [
      ['colecao','1. A coleção CAVERO num único lugar',`<p>Na loja oficial encontras os modelos atualmente apresentados pela <strong>CAVERO Watches</strong>, as variantes disponíveis e páginas próprias para cada família de relógio.</p><p>O catálogo foi organizado para que possas comparar estilos, preços e acabamentos antes de decidir.</p>`],
      ['informacao','2. Informação de produto centralizada',`<p>Cada página mostra o nome do modelo, fotografias, acabamento selecionado, preço atual e informação relevante para a encomenda. Ao mudares de variante, a referência e a apresentação do produto são atualizadas para refletir a tua escolha.</p>`],
      ['precos','3. Preços e condições apresentados pela loja',`<p>Os preços aplicáveis são os apresentados pela CAVERO Watches no momento da compra, sem prejuízo de correção de erros manifestos nos termos da lei. Quando existe um preço anterior ou promoção, essa informação é mostrada junto ao preço atual.</p>`],
      ['envio','4. Envio gratuito e prazo indicado',`<p>O envio normal apresentado pela loja é <strong>gratuito</strong>. O prazo estimado de entrega é de <strong>5 a 13 dias</strong>, sujeito às condições descritas na Política de Envio.</p>`],
      ['politicas','5. Políticas acessíveis antes da compra',`<p>A loja oficial reúne a Política de Privacidade, Política de Devoluções, Política de Envio, Aviso Legal e Termos de Serviço num único local. Assim, podes consultar as regras aplicáveis antes de concluir a encomenda.</p>`],
      ['avaliacoes','6. Feedback de clientes',`<p>As avaliações apresentadas com o selo <strong>“Compra verificada”</strong> são identificadas na loja como feedback associado a encomendas confirmadas. As páginas de produto mostram avaliações específicas de cada modelo quando disponíveis.</p>`],
      ['seguranca','7. Confirma sempre que estás na CAVERO Watches',`<p>Antes de introduzires dados pessoais ou avançares com uma compra, confirma que estás a utilizar o endereço oficial da loja CAVERO Watches e evita links suspeitos recebidos por terceiros.</p><p>A CAVERO não deve pedir por mensagens externas números completos de cartão ou códigos de segurança.</p>`],
      ['apoio','8. Antes e depois da encomenda',`<p>A informação sobre envio, devoluções e condições de compra permanece disponível no website para consulta. Se surgir uma questão relacionada com uma encomenda, guarda sempre a confirmação e a referência da compra para facilitar qualquer contacto de apoio.</p>`]
    ]
  };
})();
