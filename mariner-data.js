(() => {
  const gallery = [
    'https://static.wixstatic.com/media/eb5ec1_ed2b0fb70e6440d4aa411ff86f44d12d~mv2.png',
    'https://static.wixstatic.com/media/eb5ec1_014d040d137e4bb09e8ca45a4bb102e3~mv2.png',
    'https://static.wixstatic.com/media/eb5ec1_2401ef65adcc471a919a94d29473a06a~mv2.png',
    'https://static.wixstatic.com/media/eb5ec1_abee31e64eed47748f26e551c289f0a6~mv2.png',
    'https://static.wixstatic.com/media/eb5ec1_86ae367a3c01422381bfe7b5321fb657~mv2.png',
    'https://static.wixstatic.com/media/eb5ec1_7507484fbbe347f49c0f5a8c5ff98456~mv2.png'
  ];

  const mariner = {
    key: 'mariner',
    name: 'CAVERO Mariner',
    subtitle: 'Relógio Masculino em Aço Inoxidável · Mostrador Branco',
    desc: 'Aço inoxidável, mostrador branco, data e detalhes luminosos num relógio elegante e versátil, pensado para acompanhar o dia a dia e ocasiões especiais.',
    defaultVariant: 0,
    cleanImage: gallery[0],
    gallery,
    variants: [{
      name: 'Prateado e Branco',
      price: 69.99,
      compareAt: 109.99,
      image: gallery[0],
      index: 0
    }]
  };

  if (typeof families !== 'undefined' && !families.some(f => f.key === mariner.key)) {
    families.push(mariner);
  }
})();
