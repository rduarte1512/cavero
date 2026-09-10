// Rebind every CAVERO Mariner visual to the high-quality originals uploaded by the owner.
(() => {
  const HQ = {
    '/assets/mariner/mariner-wrist-collection.webp': 'https://static.wixstatic.com/media/eb5ec1_7507484fbbe347f49c0f5a8c5ff98456~mv2.png',
    '/assets/mariner/mariner-wrist-formal.webp': 'https://static.wixstatic.com/media/eb5ec1_ed2b0fb70e6440d4aa411ff86f44d12d~mv2.png',
    '/assets/mariner/mariner-water.webp': 'https://static.wixstatic.com/media/eb5ec1_abee31e64eed47748f26e551c289f0a6~mv2.png',
    '/assets/mariner/mariner-lume.webp': 'https://static.wixstatic.com/media/eb5ec1_86ae367a3c01422381bfe7b5321fb657~mv2.png',
    '/assets/mariner/mariner-standing.webp': 'https://static.wixstatic.com/media/eb5ec1_2401ef65adcc471a919a94d29473a06a~mv2.png',
    '/assets/mariner/mariner-detail.webp': 'https://static.wixstatic.com/media/eb5ec1_014d040d137e4bb09e8ca45a4bb102e3~mv2.png'
  };

  const gallery = [
    HQ['/assets/mariner/mariner-wrist-formal.webp'],
    HQ['/assets/mariner/mariner-detail.webp'],
    HQ['/assets/mariner/mariner-standing.webp'],
    HQ['/assets/mariner/mariner-water.webp'],
    HQ['/assets/mariner/mariner-lume.webp'],
    HQ['/assets/mariner/mariner-wrist-collection.webp']
  ];

  function syncProductData() {
    if (typeof families === 'undefined') return;
    const mariner = families.find(f => f && f.key === 'mariner');
    if (!mariner) return;
    mariner.cleanImage = gallery[0];
    mariner.gallery = [...gallery];
    if (mariner.variants && mariner.variants[0]) mariner.variants[0].image = gallery[0];
    if (typeof familyMap !== 'undefined' && familyMap && typeof familyMap.set === 'function') {
      familyMap.set('mariner', mariner);
    }
  }

  function upgradeImage(img) {
    if (!(img instanceof HTMLImageElement)) return;
    const raw = img.getAttribute('src') || '';
    const pathname = (() => {
      try { return new URL(raw, location.href).pathname; } catch (_) { return raw; }
    })();
    const replacement = HQ[raw] || HQ[pathname];
    if (!replacement || img.src === replacement) return;
    img.removeAttribute('srcset');
    img.setAttribute('src', replacement);
    img.decoding = 'async';
  }

  function upgradeTree(root) {
    if (!root) return;
    if (root instanceof HTMLImageElement) upgradeImage(root);
    if (root.querySelectorAll) root.querySelectorAll('img').forEach(upgradeImage);
  }

  syncProductData();
  upgradeTree(document);

  const observer = new MutationObserver(records => {
    syncProductData();
    for (const record of records) {
      if (record.type === 'attributes') upgradeImage(record.target);
      record.addedNodes.forEach(node => upgradeTree(node));
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src']
  });

  window.CAVERO_MARINER_HQ = { gallery: [...gallery], map: { ...HQ } };
})();
