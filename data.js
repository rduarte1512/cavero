const families = [
  {
    key: 'chronos',
    wixId: 'f620e730-5174-4181-97db-63c7352e66de',
    name: 'CAVERO Chronos Ice',
    subtitle: 'Relógio Masculino Cronógrafo Azul Gelo',
    desc: 'Cronógrafo de presença marcante, criado para um visual arrojado e sofisticado. Uma peça de destaque para quem procura um relógio com personalidade forte.',
    defaultVariant: 1,
    gallery: [
      'https://static.wixstatic.com/media/eb5ec1_acdacd67602b48ffbd2c8ab7bad4a8a6~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_7a5b18c49dfc4103961a05b4ac6e3b97~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_bce7d201734d48b3b5190add33836f66~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_33a3d3e6c2c84a60848ffb2cfb973fbd~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_e022c05f346a4ea6a876394e1e38bf10~mv2.jpg'
    ],
    variants: [
      ['Azul Gelo Castanho',211.99,299.99,'https://static.wixstatic.com/media/eb5ec1_f3082aeb1da8492eac9199a781b23b3d~mv2.jpg'],
      ['Azul Gelo Prateado',211.99,299.99,'https://static.wixstatic.com/media/eb5ec1_10ff27ccd4c74259b555b8304654610a~mv2.jpg'],
      ['Azul Gelo Café',211.99,299.99,'https://static.wixstatic.com/media/eb5ec1_96c1c2d1a9c14954b46fd798ddcadd70~mv2.jpg'],
      ['Verde Dourado',227.99,299.99,'https://static.wixstatic.com/media/eb5ec1_75d0b53e91ee4b44bbc49decafec2ebe~mv2.jpg'],
      ['Verde Dourado · Bracelete 5 Elos',227.99,299.99,'https://static.wixstatic.com/media/eb5ec1_14851ce298d94eb1aada625987ea7915~mv2.jpg'],
      ['Dourado e Branco',227.99,299.99,'https://static.wixstatic.com/media/eb5ec1_21c1f5453a2d43e3a55561917311af62~mv2.jpg'],
      ['Dourado Integral',227.99,299.99,'https://static.wixstatic.com/media/eb5ec1_567c0e0a3fce4db2a440502057af1216~mv2.jpg'],
      ['Dourado e Preto',227.99,299.99,'https://static.wixstatic.com/media/eb5ec1_9beb7eb419ca44c7bb01fdd0acfe0210~mv2.jpg'],
      ['Preto Dourado',227.99,299.99,'https://static.wixstatic.com/media/eb5ec1_52fb9a67854640c2a78586ba195fbdc8~mv2.jpg'],
      ['Dourado/Preto · Cabeça Escura',227.99,299.99,'https://static.wixstatic.com/media/eb5ec1_f594ebe3395e44608a4732cf6e10161f~mv2.jpg'],
      ['Prateado e Castanho',350.99,499.99,'https://static.wixstatic.com/media/eb5ec1_95cdeb4577da487aa409e02a3e8da43d~mv2.jpg'],
      ['Prateado Preto-Verde',350.99,499.99,'https://static.wixstatic.com/media/eb5ec1_6d1be74fa0f04117a22d74db27f10e6e~mv2.jpg'],
      ['Prateado e Branco',350.99,499.99,'https://static.wixstatic.com/media/eb5ec1_2f27cc32dafb4ccaa93c40e7c81cca32~mv2.jpg'],
      ['Prateado Panda',221.99,299.99,'https://static.wixstatic.com/media/eb5ec1_dea8f24594bd40cb9c7fec9f0509b7d5~mv2.jpg'],
      ['Prateado Branco · 3 Pontos',350.99,499.99,'https://static.wixstatic.com/media/eb5ec1_9bf879cfb6f24f14aefb9d7ccb6f60eb~mv2.jpg'],
      ['Prateado Branco · 6 Pontos',350.99,499.99,'https://static.wixstatic.com/media/eb5ec1_cd867804d7654757a4be86861c3b35a0~mv2.jpg'],
      ['Prateado Branco · Sem Logótipo',333.99,499.99,'https://static.wixstatic.com/media/eb5ec1_1446ff5bc48a46a09041fc0e8ac1d5f5~mv2.jpg'],
      ['Branco · Bracelete Translúcida',180.99,299.99,'https://static.wixstatic.com/media/eb5ec1_5ea6a2cbffcb46b1ba35a957c9f049ca~mv2.jpg'],
      ['Cinzento · Bracelete Translúcida',180.99,299.99,'https://static.wixstatic.com/media/eb5ec1_bffb480414c646d28af3e7d5e5849f81~mv2.jpg'],
      ['Azul Gelo · Bracelete Translúcida',180.99,299.99,'https://static.wixstatic.com/media/eb5ec1_e95e98cbe7fd4072ba7d2ff5c0d2ef5d~mv2.jpg'],
      ['Meteorito · Bracelete Translúcida',180.99,299.99,'https://static.wixstatic.com/media/eb5ec1_a8b8e9bb70f44ee3b04e792f1ebd61fb~mv2.jpg'],
      ['Preto/Cinzento',180.99,299.99,'https://static.wixstatic.com/media/eb5ec1_18948c3c00414fac98f77fc9f15b4e41~mv2.jpg'],
      ['Cinza Claro',211.99,299.99,'https://static.wixstatic.com/media/eb5ec1_39b6b4241bc3416681e743e1e0802ff1~mv2.jpg'],
      ['Cinzento',211.99,299.99,'https://static.wixstatic.com/media/eb5ec1_98c4c08a92534a978930e51a91cb2950~mv2.jpg'],
      ['Preto',211.99,299.99,'https://static.wixstatic.com/media/eb5ec1_248e58503806434ead1feb375b8141f1~mv2.jpg'],
      ['Cinza Escuro',227.99,299.99,'https://static.wixstatic.com/media/eb5ec1_3b7b5d8fd09f4516a74177ed7e70e334~mv2.jpg'],
      ['Vermelho',252.99,299.99,'https://static.wixstatic.com/media/eb5ec1_16c9a5e5e9474140a43b007dcc0821f5~mv2.jpg'],
      ['Prateado',227.99,299.99,'https://static.wixstatic.com/media/eb5ec1_c42cc7ceb9964f13bb37b8b8a80656f8~mv2.jpeg'],
      ['Multicor',350.99,499.99,'https://static.wixstatic.com/media/eb5ec1_e7b59aa9bdc445d19eecc0344128ba80~mv2.jpeg'],
      ['Rosa',252.99,299.99,'https://static.wixstatic.com/media/eb5ec1_7f27de34bf0848b4af49f45ba8606861~mv2.jpeg'],
      ['Amarelo',321.99,499.99,'https://static.wixstatic.com/media/eb5ec1_a53756d89abc4adab94e96a873b56484~mv2.jpeg'],
      ['Dourado',350.99,499.99,'https://static.wixstatic.com/media/eb5ec1_b28b8a6b9f214b9aaf10b831674fce0b~mv2.jpeg'],
      ['Amarelo Claro',252.99,299.99,'https://static.wixstatic.com/media/eb5ec1_b09909e4035548c1b06ea817cfc82beb~mv2.jpeg'],
      ['Azul Claro',211.99,299.99,'https://static.wixstatic.com/media/eb5ec1_a77b951ba02a496783102ac60e0e9e30~mv2.jpg'],
      ['Branco',211.99,299.99,'https://static.wixstatic.com/media/eb5ec1_4a25818087ee459ea09db7479fb284b5~mv2.jpg'],
      ['Transparente',263.99,299.99,'https://static.wixstatic.com/media/eb5ec1_546469ca0de048e195c845d2d958590c~mv2.jpeg'],
      ['Azul Céu',237.99,299.99,'https://static.wixstatic.com/media/eb5ec1_fdb62756a5d3415a88a87826de140887~mv2.jpeg']
    ]
  },
  {
    key: 'royale',
    wixId: '3bad5cf9-68be-4246-b236-f4d5d6b972de',
    name: 'CAVERO Royale',
    subtitle: 'Relógio Masculino Clássico',
    desc: 'Elegância clássica com bracelete metálica e mostrador de forte impacto visual. Um dos modelos mais versáteis da coleção CAVERO.',
    defaultVariant: 0,
    gallery: [
      'https://static.wixstatic.com/media/eb5ec1_5308a86b1e7b4e929bf8eea3bb7d149d~mv2.jpeg',
      'https://static.wixstatic.com/media/eb5ec1_46941d98f0df4c3bb5aa614686d74adb~mv2.jpeg',
      'https://static.wixstatic.com/media/eb5ec1_76473b75a77c434d9d4b4b31b2102ad3~mv2.jpeg',
      'https://static.wixstatic.com/media/eb5ec1_f02091a937564f319874195e790c9a54~mv2.jpeg',
      'https://static.wixstatic.com/media/eb5ec1_dc5a737702c94aa9ac44cfbf3944b57c~mv2.jpg'
    ],
    variants: [
      ['Dourado e Azul',49.99,78.99,'https://static.wixstatic.com/media/eb5ec1_ab18757b50a64255b877cb613deda771~mv2.jpg'],
      ['Dourado e Branco',49.99,78.99,'https://static.wixstatic.com/media/eb5ec1_7e2c716e80ea421cb8a7559f6fe6a44e~mv2.jpg'],
      ['Dourado e Preto',49.99,78.99,'https://static.wixstatic.com/media/eb5ec1_02296d3752c34367941029e5a723014c~mv2.jpg'],
      ['Dourado e Verde',49.99,78.99,'https://static.wixstatic.com/media/eb5ec1_36275ed3eee2441a9351a9b2958d8c10~mv2.jpg'],
      ['Prateado e Azul',46.99,78.99,'https://static.wixstatic.com/media/eb5ec1_4dc3e290c17f46b7a7465217409b9116~mv2.jpg'],
      ['Prateado e Branco',46.99,78.99,'https://static.wixstatic.com/media/eb5ec1_4959e076887c4f44a5f9be9577347c0c~mv2.jpg'],
      ['Prateado e Preto',46.99,78.99,'https://static.wixstatic.com/media/eb5ec1_5963fcef235f4dd8b96194cc0adc2a4a~mv2.jpg'],
      ['Preto Integral',48.99,78.99,'https://static.wixstatic.com/media/eb5ec1_032f45fd733e4bb39c702d1ddacc47cd~mv2.jpg'],
      ['Dourado Integral',49.99,78.99,'https://static.wixstatic.com/media/eb5ec1_ed81175dcf8b44d9b6cfbbb84818abb5~mv2.jpg']
    ]
  },
  {
    key: 'ocean',
    wixId: '59c76ec8-4b7a-4ace-8db0-1bd013fc36b1',
    name: 'CAVERO Ocean',
    subtitle: 'Relógio Desportivo',
    desc: 'Estética desportiva inspirada no mar, pensada para looks casuais e urbanos. Disponível em versões masculinas e femininas.',
    defaultVariant: 3,
    gallery: [
      'https://static.wixstatic.com/media/eb5ec1_49c168a7bafb4216b2950fb5982cf34b~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_31c33bd5ae294f42a7280d1436391de9~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_c5d4867e660142578f32b96d69e33227~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_31c13dcc0ebf4337894f0293cf777902~mv2.jpeg'
    ],
    variants: [
      ['Masculino Preto',36.99,55.99,'https://static.wixstatic.com/media/eb5ec1_c7f05dcd4be84948ae1163ac73284d14~mv2.png'],
      ['Masculino Preto e Azul',36.99,55.99,'https://static.wixstatic.com/media/eb5ec1_eb1d7cd5e05542abbea3210cb35748b6~mv2.png'],
      ['Masculino Vermelho e Azul',36.99,55.99,'https://static.wixstatic.com/media/eb5ec1_458d0b3104064175b7ec282b0b9545aa~mv2.png'],
      ['Masculino Verde',36.99,55.99,'https://static.wixstatic.com/media/eb5ec1_d177559a9b7e4271b78ac265faad3334~mv2.png'],
      ['Masculino Azul',36.99,55.99,'https://static.wixstatic.com/media/eb5ec1_649f152c4cb848aeb40c0b24fc56c8be~mv2.png'],
      ['Feminino Verde',36.99,55.99,'https://static.wixstatic.com/media/eb5ec1_9a95116273314bdabe7dae003db6387b~mv2.png'],
      ['Feminino Azul',36.99,55.99,'https://static.wixstatic.com/media/eb5ec1_4621c2d77d5e46f39c80761183fecc59~mv2.png'],
      ['Feminino Preto',36.99,55.99,'https://static.wixstatic.com/media/eb5ec1_88540f5e68894f6e84661ee737aef5c5~mv2.png'],
      ['Feminino Azul Claro',36.99,55.99,'https://static.wixstatic.com/media/eb5ec1_886744d2e7da4d2095ce4fc21191493b~mv2.png'],
      ['Feminino Vermelho',36.99,55.99,'https://static.wixstatic.com/media/eb5ec1_e08c7ad9b4f041fe9e954c6502145f91~mv2.png']
    ]
  },
  {
    key: 'velocity',
    wixId: '8b217189-0578-45f7-a439-642d97bc84de',
    name: 'CAVERO Velocity',
    subtitle: 'Relógio Masculino Cronógrafo Desportivo',
    desc: 'Cronógrafo desportivo com três submostradores e presença contemporânea. Criado para um visual moderno, elegante e dinâmico.',
    defaultVariant: 1,
    gallery: [
      'https://static.wixstatic.com/media/eb5ec1_223fa9976a034dc08846ccdb47581ae3~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_bb6fff69b8144f998a818e1ed56f97ee~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_b5774128e21a4cba89924f2b95306b0d~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_d227926959e94667abf910512b87352c~mv2.jpeg',
      'https://static.wixstatic.com/media/eb5ec1_52869f0aaf9b42d6bee801abf25b8e3a~mv2.jpg'
    ],
    variants: [
      ['Preto com Submostradores Brancos',50.99,89.99,'https://static.wixstatic.com/media/eb5ec1_67ccd316b97f45a4a0d8d37c4998c465~mv2.jpg'],
      ['Panda Branco',50.99,89.99,'https://static.wixstatic.com/media/eb5ec1_3a9999537afb41a69dd8c212a8a10621~mv2.jpg'],
      ['Preto Integral',51.99,89.99,'https://static.wixstatic.com/media/eb5ec1_c893b99a9de9442da090cc143d831376~mv2.jpg'],
      ['Azul e Dourado',53.99,89.99,'https://static.wixstatic.com/media/eb5ec1_230b982336a74ea99b29e7557c9da93c~mv2.jpg'],
      ['Verde Rose Gold',53.99,89.99,'https://static.wixstatic.com/media/eb5ec1_1f7d4ecd15b54e8fb45e106018c837d1~mv2.jpg']
    ]
  },
  {
    key: 'prestige',
    wixId: 'c9124412-d259-436a-8c00-40c963149d8a',
    name: 'CAVERO Prestige',
    subtitle: 'Relógio Masculino Clássico',
    desc: 'Interpretação contemporânea do relógio clássico, com acabamento metálico elegante e várias combinações de mostrador e bracelete.',
    defaultVariant: 8,
    gallery: [
      'https://static.wixstatic.com/media/eb5ec1_13053eb7f79648039d0841aa4e78b059~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_621a9c5e9c45479c9a019543409f1ba4~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_9a97299f392146a592a1aa8335c2272b~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_8a40fc35e5e84f5099b5b231c4bc405a~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_a115b17649e84588bb2f0c4e9298baa0~mv2.jpg'
    ],
    variants: [
      ['Branco · Bracelete Aço',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_ed7807387f8e48aa9bb368049974745a~mv2.jpeg'],
      ['Dourado · Bracelete Aço',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_81fce798886b444bbee8ccb43e85ea87~mv2.jpeg'],
      ['Preto · Bracelete Aço',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_996f8f375e4149ba8f239efc5513c8cf~mv2.jpeg'],
      ['Vermelho · Bracelete Aço',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_c374da1c491947f0a0ce7d7458fcb929~mv2.jpeg'],
      ['Verde Esmeralda · Aço',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_df17474a3d5a414ea90081e23cd49f9d~mv2.jpeg'],
      ['Branco Esmeralda · Aço',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_6cd6b8ab6399499d85512369f4a3331a~mv2.jpeg'],
      ['Castanho Esmeralda · Aço',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_7c7b37ff4fb943c49f64dc37944fc49e~mv2.jpeg'],
      ['Branco Inox',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_3263798400774049bba1208e223ead31~mv2.jpeg'],
      ['Verde Inox',72.99,89.99,'https://static.wixstatic.com/media/eb5ec1_d6d2400d359b412d8f5cee4034b69780~mv2.jpeg'],
      ['Azul Inox',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_6642a4eff36f4825888ffff860cca742~mv2.jpeg'],
      ['Preto Inox',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_3aa8f033031647a983f954d56570c7c5~mv2.jpeg'],
      ['Vermelho Inox',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_e881c69d7ce740f78cd381c75870df88~mv2.jpeg'],
      ['Azul Claro Inox',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_5aa42a1c33494caeba9f252ac6d8e24f~mv2.jpeg'],
      ['Rosa Inox',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_c482b1cd8ac34bf2b8d959b820ca457e~mv2.jpeg'],
      ['Laranja Inox',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_9827f83045b44f6db4abc270cfcdc4cd~mv2.jpeg'],
      ['Castanho',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_4c0630d2398346ab8fc22f9e5ebbed25~mv2.jpeg'],
      ['Castanho Inox',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_8008ad3369e34a86be267feab37847ce~mv2.jpeg'],
      ['Bicolor Branco',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_ac1d8cfd770f455eb108bef58c91998c~mv2.jpeg'],
      ['Verde',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_c44070b858c24156864d3541649215b7~mv2.jpeg'],
      ['Bicolor Verde',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_022fce32400745ca8c70ecb716b57e68~mv2.jpeg'],
      ['Azul',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_e755f2b05c634b3d9c21790bf8551739~mv2.jpeg'],
      ['Bicolor Azul',59.99,79.99,'https://static.wixstatic.com/media/eb5ec1_bbbeca19994f414a9ec0c2661d677950~mv2.jpeg']
    ]
  },
  {
    key: 'apex',
    wixId: 'c4144246-2506-4066-938b-f6c790709b08',
    name: 'CAVERO Apex',
    subtitle: 'Relógio Masculino de Design Octogonal',
    desc: 'Caixa octogonal e estética moderna para quem procura um relógio que se destaca. Um design forte com três acabamentos fáceis de combinar.',
    defaultVariant: 0,
    gallery: [
      'https://static.wixstatic.com/media/eb5ec1_121e2c103951455bb0b505eba590c0d7~mv2.jpeg',
      'https://static.wixstatic.com/media/eb5ec1_2a136c252a604142bb45ba42d76b5afd~mv2.jpg',
      'https://static.wixstatic.com/media/eb5ec1_e5e2256884b643de85113087ab90071b~mv2.jpeg',
      'https://static.wixstatic.com/media/eb5ec1_90c1398546494537b8d3dab160bd5251~mv2.jpeg',
      'https://static.wixstatic.com/media/eb5ec1_15f663a4da074f8987a5e6bd1db6e9bc~mv2.jpeg',
      'https://static.wixstatic.com/media/eb5ec1_41dc500da4aa419d87e9501f77ff293b~mv2.png'
    ],
    variants: [
      ['Prateado e Preto',37.99,59.99,'https://static.wixstatic.com/media/eb5ec1_1b7a0a7818b846cebed683b3f17d1bbb~mv2.jpg'],
      ['Prateado e Azul',37.99,59.99,'https://static.wixstatic.com/media/eb5ec1_66ad0d40f52d4b24ac39e93f674743ba~mv2.jpg'],
      ['Prateado e Branco',37.99,59.99,'https://static.wixstatic.com/media/eb5ec1_555c4859f66546f494ddefd57e21adc6~mv2.jpg']
    ]
  }
].map(f => ({
  ...f,
  variants: f.variants.map(([name,price,compareAt,image],index)=>({name,price,compareAt,image,index}))
}));
