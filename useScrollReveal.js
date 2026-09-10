export function useScrollReveal({ threshold = 0.15, once = true, onChange } = {}) {
  let observer = null;
  let element = null;
  let visible = false;
  let motionQuery = null;
  let motionHandler = null;

  const setVisible = nextVisible => {
    if (visible === nextVisible) return;
    visible = nextVisible;
    if (typeof onChange === 'function') onChange(visible);
  };

  const disconnect = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (motionQuery && motionHandler) {
      if (motionQuery.removeEventListener) motionQuery.removeEventListener('change', motionHandler);
      else if (motionQuery.removeListener) motionQuery.removeListener(motionHandler);
    }

    motionQuery = null;
    motionHandler = null;
  };

  const ref = node => {
    disconnect();
    element = node || null;

    if (!element) return;

    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (motionQuery.matches || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target !== element) return;

        if (entry.isIntersecting) {
          setVisible(true);

          if (once) {
            observer?.unobserve(element);
            observer?.disconnect();
            observer = null;
          }
        } else if (!once) {
          setVisible(false);
        }
      });
    }, {
      threshold,
      rootMargin: '0px 0px -50px 0px'
    });

    motionHandler = event => {
      if (!event.matches) return;
      setVisible(true);
      observer?.disconnect();
      observer = null;
    };

    if (motionQuery.addEventListener) motionQuery.addEventListener('change', motionHandler);
    else if (motionQuery.addListener) motionQuery.addListener(motionHandler);

    observer.observe(element);
  };

  return {
    ref,
    get isVisible() {
      return visible;
    }
  };
}
