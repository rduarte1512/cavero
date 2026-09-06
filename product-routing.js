(() => {
  const DEFAULT_TITLE = 'CAVERO Watches — Own Your Time';

  const PRODUCT_PATHS = {
    chronos: '/cavero-chronos-ice',
    ocean: '/cavero-ocean',
    velocity: '/cavero-velocity',
    prestige: '/cavero-prestige',
    apex: '/cavero-apex'
  };

  const PATH_TO_KEY = Object.fromEntries(
    Object.entries(PRODUCT_PATHS).map(([key, path]) => [path, key])
  );

  const normalizePath = path => {
    if (!path) return '/';
    const clean = path.replace(/\/+$/, '');
    return clean || '/';
  };

  const getFamily = key => {
    if (typeof families === 'undefined') return null;
    return families.find(f => f.key === key) || null;
  };

  const baseOpenProduct = window.openProduct;
  const baseShowHome = window.showHome;
  let handlingHistory = false;

  if (typeof baseOpenProduct !== 'function' || typeof baseShowHome !== 'function') return;

  function setProductMeta(key) {
    const family = getFamily(key);
    if (!family) return;
    document.title = `${family.name} | CAVERO Watches`;
  }

  function setHomeMeta() {
    document.title = DEFAULT_TITLE;
  }

  window.openProduct = function(key) {
    const path = PRODUCT_PATHS[key];
    if (!path) return baseOpenProduct(key);

    if (!handlingHistory && normalizePath(window.location.pathname) !== path) {
      history.pushState({ view: 'product', productKey: key }, '', path);
    }

    baseOpenProduct(key);
    setProductMeta(key);
  };

  window.showHome = function() {
    if (!handlingHistory && normalizePath(window.location.pathname) !== '/') {
      history.pushState({ view: 'home' }, '', '/');
    }

    baseShowHome();
    setHomeMeta();
  };

  function renderCurrentRoute() {
    const path = normalizePath(window.location.pathname);
    const key = PATH_TO_KEY[path];

    handlingHistory = true;
    try {
      if (key && getFamily(key)) {
        baseOpenProduct(key);
        setProductMeta(key);
        history.replaceState({ view: 'product', productKey: key }, '', path);
      } else {
        baseShowHome();
        setHomeMeta();
        if (path === '/') history.replaceState({ view: 'home' }, '', '/');
      }
    } finally {
      handlingHistory = false;
    }
  }

  window.addEventListener('popstate', renderCurrentRoute);
  renderCurrentRoute();
})();
