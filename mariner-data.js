(() => {
  const gallery = [
    '/assets/mariner/mariner-wrist-formal.webp',
    '/assets/mariner/mariner-detail.webp',
    '/assets/mariner/mariner-standing.webp',
    '/assets/mariner/mariner-water.webp',
    '/assets/mariner/mariner-lume.webp',
    '/assets/mariner/mariner-wrist-collection.webp'
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
