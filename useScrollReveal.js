export function useScrollReveal({ threshold = 0.15, once = true, onChange } = {}) {
  let observer = null;
  let element = null;
  let visible = false;

  const setVisible = nextVisible => {
    if (visible === nextVisible) return;
    visible = nextVisible;
    if (typeof onChange === 'function') onChange(visible);
  };

  const disconnect = () => {
    if (!observer) return;
    observer.disconnect();
    observer = null;
  };

  const ref = node => {
    disconnect();
    element = node || null;

    if (!element) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
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
            disconnect();
          }
        } else if (!once) {
          setVisible(false);
        }
      });
    }, {
      threshold,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(element);
  };

  return {
    ref,
    get isVisible() {
      return visible;
    }
  };
}
