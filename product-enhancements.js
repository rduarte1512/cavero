(() => {
  const PRODUCT_EDITORIAL = {
    chronos: {
      kicker: 'CRONÓGRAFO DE PRESENÇA',
      headline: 'Chronos Ice — feito para ser o ponto forte do look.',
      intro: 'O Chronos Ice é a proposta mais expressiva da CAVERO: um relógio de inspiração cronográfica, com mostrador de forte presença e uma coleção de acabamentos pensada para quem quer que o relógio seja visto.',
      body: 'A combinação entre o mostrador azul gelo, a leitura desportiva e as diferentes interpretações de bracelete dá ao Chronos Ice uma personalidade visual muito própria. É o modelo indicado para coordenados urbanos, ocasiões especiais e looks em que o acessório deve assumir protagonismo sem perder uma apresentação cuidada.',
      signature: 'Cronógrafo contemporâneo',
      dial: 'Azul gelo e outras interpretações, conforme o acabamento',
      silhouette: 'Caixa redonda de leitura desportiva',
      styling: 'Statement · urbano · sofisticado',
      highlight1: ['Presença imediata', 'Mostrador e submostradores criam uma composição visual forte.'],
      highlight2: ['Muitas interpretações', 'A família Chronos reúne o maior leque de acabamentos da coleção.'],
      highlight3: ['Para ocasiões marcantes', 'Funciona especialmente bem quando o relógio é uma peça central do visual.'],
      compareLead: 'Para quem procura impacto visual e variedade de acabamentos.'
    },
    royale: {
      kicker: 'CLÁSSICO CONTEMPORÂNEO',
      headline: 'Royale — elegância que funciona todos os dias.',
      intro: 'O Royale foi desenhado para ocupar o espaço entre o clássico e o moderno. A bracelete metálica, o mostrador de leitura elegante e as combinações bicolor tornam-no num dos modelos mais versáteis da CAVERO.',
      body: 'É uma escolha pensada para quem quer um relógio fácil de combinar com camisa, polo, blazer ou um look casual mais cuidado. As variantes exploram diferentes relações entre dourado, prateado, azul, verde, preto e branco, mantendo a mesma linguagem visual refinada em toda a família.',
      signature: 'Elegância clássica reinterpretada',
      dial: 'Azul, branco, preto ou verde, conforme a variante',
      silhouette: 'Caixa redonda com bisel de presença marcada',
      styling: 'Clássico · smart casual · versátil',
      highlight1: ['Versatilidade', 'Um desenho pensado para passar facilmente do dia para a noite.'],
      highlight2: ['Acabamentos bicolor', 'Combinações metálicas que dão mais profundidade ao conjunto.'],
      highlight3: ['Visual intemporal', 'Uma estética fácil de integrar num guarda-roupa elegante.'],
      compareLead: 'Para quem valoriza um relógio elegante, fácil de combinar e com várias opções de cor.'
    },
    ocean: {
      kicker: 'DESPORTIVO E URBANO',
      headline: 'Ocean — energia desportiva com presença urbana.',
      intro: 'O Ocean traz para a coleção CAVERO uma linguagem mais descontraída e dinâmica. O desenho inspirado nos códigos visuais dos relógios desportivos dá-lhe uma presença forte sem o tornar difícil de usar no dia a dia.',
      body: 'As versões masculinas e femininas permitem explorar cores mais intensas e combinações mais casuais. É uma escolha pensada para t-shirts, denim, polos, looks de fim de semana e coordenados em que se procura um acessório com mais energia visual.',
      signature: 'Desportivo de inspiração marítima',
      dial: 'Verde, azul, preto e outras cores conforme a variante',
      silhouette: 'Caixa redonda com leitura desportiva',
      styling: 'Casual · dinâmico · urbano',
      highlight1: ['Identidade desportiva', 'Marcadores fortes e uma leitura visual imediatamente reconhecível.'],
      highlight2: ['Opções para diferentes estilos', 'A família inclui interpretações masculinas e femininas.'],
      highlight3: ['Cor com personalidade', 'Uma das linhas mais indicadas para quem quer fugir ao relógio neutro.'],
      compareLead: 'Para quem quer uma estética desportiva com variedade de cor e uma compra simples.'
    },
    velocity: {
      kicker: 'SPORT CHRONO',
      headline: 'Velocity — desenho técnico, atitude moderna.',
      intro: 'O Velocity junta uma leitura de cronógrafo desportivo a uma estética limpa e contemporânea. Os três submostradores criam profundidade no mostrador e dão ao modelo uma presença mais técnica.',
      body: 'É um relógio pensado para quem gosta de acessórios com inspiração automóvel e desportiva, mas quer manter uma apresentação elegante. As variantes Panda, preto, azul dourado e verde rose gold permitem mudar bastante a personalidade do modelo sem alterar a sua assinatura visual.',
      signature: 'Cronógrafo desportivo moderno',
      dial: 'Panda, preto, azul ou verde, conforme o acabamento',
      silhouette: 'Caixa redonda com três submostradores',
      styling: 'Sport · moderno · assertivo',
      highlight1: ['Profundidade visual', 'Os submostradores acrescentam detalhe sem tornar o conjunto pesado.'],
      highlight2: ['Contrastes fortes', 'As variantes exploram combinações claras, escuras e metálicas.'],
      highlight3: ['Caráter contemporâneo', 'Ideal para quem prefere um relógio com linguagem mais técnica.'],
      compareLead: 'Para quem procura uma estética cronográfica com mais detalhe e personalidade.'
    },
    prestige: {
      kicker: 'ELEGÂNCIA REFINADA',
      headline: 'Prestige — um clássico pensado para uma presença discreta.',
      intro: 'O Prestige é a linha mais orientada para uma elegância sóbria. O mostrador limpo, a bracelete metálica e a variedade de cores criam um relógio que transmite cuidado sem precisar de exagerar no desenho.',
      body: 'É especialmente indicado para ambientes profissionais, jantares, eventos e looks smart casual. A ampla escolha de acabamentos permite optar por uma presença mais clássica, mais colorida ou bicolor, mantendo sempre uma leitura visual coerente.',
      signature: 'Dress watch contemporâneo',
      dial: 'Verde, azul, branco, preto, vermelho e outras opções',
      silhouette: 'Caixa redonda de perfil clássico',
      styling: 'Elegante · profissional · discreto',
      highlight1: ['Elegância sem excesso', 'Linhas equilibradas para um visual mais maduro e cuidado.'],
      highlight2: ['Grande variedade cromática', 'Permite escolher entre tons sóbrios, vivos e bicolor.'],
      highlight3: ['Fácil de vestir', 'Uma escolha natural para camisa, blazer e smart casual.'],
      compareLead: 'Para quem procura uma estética elegante com muitas possibilidades de acabamento.'
    },
    apex: {
      kicker: 'DESIGN OCTOGONAL',
      headline: 'Apex — geometria forte, visual contemporâneo.',
      intro: 'O Apex é a proposta mais arquitetónica da CAVERO. A caixa octogonal e a integração visual com a bracelete criam uma silhueta imediatamente distinta dentro da coleção.',
      body: 'É um modelo pensado para quem prefere linhas modernas, superfícies metálicas e uma presença mais minimalista. As três variantes mantêm o desenho como protagonista e permitem escolher entre mostradores preto, azul ou branco.',
      signature: 'Geometria octogonal contemporânea',
      dial: 'Preto, azul ou branco',
      silhouette: 'Caixa octogonal integrada visualmente com a bracelete',
      styling: 'Moderno · minimalista · arquitetónico',
      highlight1: ['Silhueta distinta', 'A caixa octogonal diferencia o Apex imediatamente dos modelos redondos.'],
      highlight2: ['Coleção focada', 'Três acabamentos simples tornam a escolha rápida e clara.'],
      highlight3: ['Visual moderno', 'Ideal para quem procura um relógio com linhas mais geométricas.'],
      compareLead: 'Para quem quer um design octogonal forte e uma escolha de variantes mais simples.'
    }
  };

  const PRODUCT_SPECS = {
    chronos: [
      ['Diâmetro da caixa', '≈ 40 mm'],
      ['Espessura da caixa', '≈ 12–13 mm'],
      ['Largura da bracelete', '≈ 20 mm'],
      ['Tamanho de pulso', '≈ 16–21 cm'],
      ['Peso', '≈ 140–160 g'],
      ['Material da caixa', 'Aspeto de aço inoxidável'],
      ['Material da bracelete', 'Metálica, com aspeto de aço inoxidável'],
      ['Resistência à água', '3 ATM'],
      ['Funções', '3 submostradores · visual de cronógrafo'],
      ['Tipo de fecho', 'Dobrável / deployant'],
      ['Cor do mostrador', 'Azul-gelo / azul-claro, conforme o acabamento'],
      ['Caixa / acabamento', 'Prateado · polido / escovado'],
      ['Bracelete ajustável', 'Sim · por remoção de elos']
    ],
    velocity: [
      ['Diâmetro da caixa', '≈ 42 mm'],
      ['Espessura da caixa', '≈ 12–13 mm'],
      ['Largura da bracelete', '≈ 22 mm'],
      ['Tamanho de pulso', '≈ 16–21 cm'],
      ['Peso', '≈ 130–150 g'],
      ['Material da caixa', 'Aspeto de aço inoxidável'],
      ['Material da bracelete', 'Metálica, com aspeto de aço inoxidável'],
      ['Resistência à água', '3 ATM'],
      ['Funções', '3 submostradores + janela de data · visual de cronógrafo'],
      ['Tipo de fecho', 'Dobrável / deployant'],
      ['Cor do mostrador', 'Prateado / branco na variante apresentada; varia conforme o acabamento'],
      ['Caixa / acabamento', 'Prateado · polido / escovado'],
      ['Bracelete ajustável', 'Sim · por remoção de elos']
    ],
    royale: [
      ['Diâmetro da caixa', '≈ 40 mm'],
      ['Espessura da caixa', '≈ 10–11 mm'],
      ['Largura da bracelete', '≈ 20 mm'],
      ['Tamanho de pulso', '≈ 16–21 cm'],
      ['Peso', '≈ 120–140 g'],
      ['Material da caixa', 'Metal · aparência de aço inoxidável'],
      ['Material da bracelete', 'Metálica'],
      ['Funções', 'Analógico · complicações por confirmar'],
      ['Tipo de fecho', 'Dobrável / deployant'],
      ['Cor do mostrador', 'Azul, branco, preto ou verde, conforme a variante'],
      ['Caixa / acabamento', 'Prateado, dourado ou preto, conforme a variante'],
      ['Bracelete ajustável', 'Sim · por remoção de elos']
    ],
    ocean: [
      ['Diâmetro da caixa', 'Masculino ≈ 42 mm · Feminino ≈ 36–38 mm'],
      ['Espessura da caixa', '≈ 11–12 mm'],
      ['Largura da bracelete', '≈ 20–22 mm'],
      ['Tamanho de pulso', '≈ 15,5–21,5 cm'],
      ['Peso', '≈ 70–120 g · depende da versão'],
      ['Material da caixa', 'Metal'],
      ['Material da bracelete', 'Desportiva · aparência de silicone / PU em algumas versões'],
      ['Funções', 'Analógico · funções dependem da versão'],
      ['Tipo de fecho', 'Fivela nas versões com bracelete flexível'],
      ['Cor do mostrador', 'Preto, azul, verde, vermelho e outras cores, conforme a variante'],
      ['Caixa / acabamento', 'Depende da variante'],
      ['Bracelete ajustável', 'Sim · conforme a versão']
    ],
    prestige: [
      ['Diâmetro da caixa', '≈ 40 mm'],
      ['Espessura da caixa', '≈ 10–11 mm'],
      ['Largura da bracelete', '≈ 20 mm'],
      ['Tamanho de pulso', '≈ 16–21 cm'],
      ['Peso', '≈ 120–140 g'],
      ['Material da caixa', 'Metal · aparência de aço inoxidável'],
      ['Material da bracelete', 'Metálica'],
      ['Funções', 'Analógico · função de data por confirmar'],
      ['Tipo de fecho', 'Dobrável / deployant'],
      ['Cor do mostrador', 'Várias combinações, conforme a variante'],
      ['Caixa / acabamento', 'Prateado, dourado ou bicolor, conforme a variante'],
      ['Bracelete ajustável', 'Sim · por remoção de elos']
    ],
    apex: [
      ['Diâmetro da caixa', '≈ 42 mm'],
      ['Espessura da caixa', '≈ 11–12 mm'],
      ['Largura da bracelete', '≈ 22 mm'],
      ['Tamanho de pulso', '≈ 16–21 cm'],
      ['Peso', '≈ 140–160 g'],
      ['Material da caixa', 'Metal · aparência de aço inoxidável'],
      ['Material da bracelete', 'Metálica'],
      ['Funções', 'Analógico · funções por confirmar'],
      ['Tipo de fecho', 'Dobrável / deployant'],
      ['Cor do mostrador', 'Depende da variante'],
      ['Caixa / acabamento', 'Metálico · design octogonal'],
      ['Bracelete ajustável', 'Sim · por remoção de elos']
    ]
  };

  const PRODUCT_SPEC_NOTES = {
    chronos: 'Medidas, peso e compatibilidade de pulso são valores aproximados. A resistência à água indicada para este modelo é de 3 ATM.',
    velocity: 'Medidas, peso e compatibilidade de pulso são valores aproximados. A resistência à água indicada para este modelo é de 3 ATM.',
    royale: 'Medidas, peso e compatibilidade de pulso são valores aproximados. Vidro, movimento e resistência à água não são apresentados enquanto não estiverem confirmados.',
    ocean: 'Medidas, peso e compatibilidade de pulso são valores aproximados e podem variar entre versões. Vidro, movimento e resistência à água não são apresentados enquanto não estiverem confirmados.',
    prestige: 'Medidas, peso e compatibilidade de pulso são valores aproximados. Vidro, movimento e resistência à água não são apresentados enquanto não estiverem confirmados.',
    apex: 'Medidas, peso e compatibilidade de pulso são valores aproximados. Vidro, movimento e resistência à água não são apresentados enquanto não estiverem confirmados.'
  };

  function editorialFor(f){ return PRODUCT_EDITORIAL[f.key] || PRODUCT_EDITORIAL.royale; }

  function productStoryMarkup(f){
    const c = editorialFor(f);
    return `<section class="product-editorial-section">
      <div class="product-editorial-heading">
        <div class="eyebrow">${c.kicker}</div>
        <h2>${c.headline}</h2>
        <p>${c.intro}</p>
      </div>
      <div class="product-editorial-layout">
        <div class="product-editorial-copy">
          <p>${c.body}</p>
          <div class="editorial-highlights">
            <article><span>01</span><div><b>${c.highlight1[0]}</b><p>${c.highlight1[1]}</p></div></article>
            <article><span>02</span><div><b>${c.highlight2[0]}</b><p>${c.highlight2[1]}</p></div></article>
            <article><span>03</span><div><b>${c.highlight3[0]}</b><p>${c.highlight3[1]}</p></div></article>
          </div>
        </div>
        <aside class="model-profile-card">
          <div class="model-profile-top"><small>PERFIL DO MODELO</small><b>${f.name}</b></div>
          <dl>
            <div><dt>Assinatura</dt><dd>${c.signature}</dd></div>
            <div><dt>Mostrador</dt><dd>${c.dial}</dd></div>
            <div><dt>Silhueta</dt><dd>${c.silhouette}</dd></div>
            <div><dt>Estilo</dt><dd>${c.styling}</dd></div>
            <div><dt>Acabamentos</dt><dd>${f.variants.length} opções na coleção</dd></div>
            <div><dt>Envio</dt><dd class="profile-free">Grátis · 0,00 €</dd></div>
          </dl>
          <p class="profile-note">Ficha de design baseada na apresentação visual do modelo. Consulta a ficha técnica abaixo quando disponível.</p>
        </aside>
      </div>
    </section>`;
  }

  function technicalSpecsMarkup(f){
    const specs = PRODUCT_SPECS[f.key];
    if (!specs) return '';
    const note = PRODUCT_SPEC_NOTES[f.key] || 'Medidas e peso são valores aproximados.';
    return `<section class="technical-specs-section" aria-labelledby="technicalSpecsTitle-${f.key}">
      <div class="technical-specs-heading">
        <div>
          <div class="eyebrow">FICHA TÉCNICA</div>
          <h2 id="technicalSpecsTitle-${f.key}">${f.name} em detalhe.</h2>
        </div>
        <p>As principais medidas e características para comparares o tamanho, construção e utilização do relógio antes de comprar.</p>
      </div>
      <div class="technical-specs-grid">
        ${specs.map(([label,value])=>`<div class="technical-spec-row"><span>${label}</span><strong>${value}</strong></div>`).join('')}
      </div>
      <p class="technical-specs-note"><strong>Nota:</strong> ${note}</p>
    </section>`;
  }

  function comparisonMarkup(f){
    const c = editorialFor(f);
    return `<section class="brand-comparison-section">
      <div class="comparison-heading">
        <div><div class="eyebrow">PORQUÊ CAVERO</div><h2>Uma experiência pensada para escolher sem dúvidas.</h2></div>
        <p>${c.compareLead}</p>
      </div>
      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead><tr><th>O que comparas</th><th class="cavero-col">${f.name}</th><th>Outras marcas / lojas</th></tr></thead>
          <tbody>
            <tr><td>Identidade do modelo</td><td class="cavero-col"><b>✓</b> ${c.signature}</td><td>Coleções e posicionamento variam</td></tr>
            <tr><td>Escolha de acabamentos</td><td class="cavero-col"><b>✓</b> ${f.variants.length} variantes disponíveis</td><td>Depende da coleção</td></tr>
            <tr><td>Variante selecionada</td><td class="cavero-col"><b>✓</b> Nome, referência e preço atualizam em conjunto</td><td>Pode variar de loja para loja</td></tr>
            <tr><td>Preço promocional</td><td class="cavero-col"><b>✓</b> Preço anterior, desconto e poupança visíveis</td><td>Apresentação depende da marca</td></tr>
            <tr><td>Envio</td><td class="cavero-col"><b>✓</b> Grátis · 0,00 €</td><td>Pode ter custos adicionais</td></tr>
            <tr><td>Carrinho</td><td class="cavero-col"><b>✓</b> Escolha guardada neste dispositivo</td><td>Funcionalidade pode variar</td></tr>
          </tbody>
        </table>
      </div>
      <p class="comparison-disclaimer">Comparação da experiência de compra e apresentação da oferta. As condições, funcionalidades e políticas de outras marcas ou lojas podem variar.</p>
    </section>`;
  }

  function renderEnhancements(){
    if (!window.activeFamily && typeof activeFamily === 'undefined') return;
    const f = typeof activeFamily !== 'undefined' ? activeFamily : window.activeFamily;
    if (!f) return;
    const shell = document.querySelector('#productView .product-shell');
    if (!shell || shell.querySelector('.product-editorial-section')) return;
    const related = shell.querySelector('.related-section');
    const wrapper = document.createElement('div');
    wrapper.className = 'product-content-enhancements';
    wrapper.innerHTML = productStoryMarkup(f) + technicalSpecsMarkup(f) + comparisonMarkup(f);
    if (related) shell.insertBefore(wrapper, related);
    else shell.appendChild(wrapper);
  }

  const baseOpenProduct = window.openProduct;
  if (typeof baseOpenProduct === 'function') {
    window.openProduct = function(key){
      baseOpenProduct(key);
      requestAnimationFrame(renderEnhancements);
    };
  }
})();