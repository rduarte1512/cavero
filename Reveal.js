import { useScrollReveal } from './useScrollReveal.js';

const transforms = {
  up: 'translate3d(0, 28px, 0)',
  down: 'translate3d(0, -28px, 0)',
  left: 'translate3d(28px, 0, 0)',
  right: 'translate3d(-28px, 0, 0)',
  fade: 'translate3d(0, 0, 0)'
};

export function Reveal(element, {
  direction = 'up',
  delay = 0,
  threshold = 0.15,
  once = true
} = {}) {
  if (!(element instanceof HTMLElement)) return () => {};

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hiddenTransform = transforms[direction] || transforms.up;
  const safeDelay = Math.max(0, Number(delay) || 0);
  let active = true;
  let firstFrame = 0;
  let secondFrame = 0;
  let willChangeTimer = 0;

  const showImmediately = () => {
    element.style.transition = 'none';
    element.style.transitionDelay = '0ms';
    element.style.opacity = '1';
    element.style.transform = 'translate3d(0, 0, 0)';
    element.style.willChange = 'auto';
  };

  if (reducedMotion) {
    showImmediately();
    return () => {};
  }

  element.style.opacity = '0';
  element.style.transform = hiddenTransform;
  element.style.transitionProperty = 'opacity, transform';
  element.style.transitionDuration = '0.8s';
  element.style.transitionTimingFunction = 'cubic-bezier(0.22, 1, 0.36, 1)';
  element.style.transitionDelay = `${safeDelay}ms`;
  element.style.willChange = 'auto';
  element.style.backfaceVisibility = 'hidden';

  const applyVisibility = isVisible => {
    if (!active) return;

    window.clearTimeout(willChangeTimer);
    element.style.willChange = 'opacity, transform';
    element.style.opacity = isVisible ? '1' : '0';
    element.style.transform = isVisible ? 'translate3d(0, 0, 0)' : hiddenTransform;

    willChangeTimer = window.setTimeout(() => {
      if (active) element.style.willChange = 'auto';
    }, 850 + safeDelay);
  };

  const reveal = useScrollReveal({
    threshold,
    once,
    onChange: applyVisibility
  });

  // Dois frames garantem que o estado inicial é pintado antes do reveal.
  firstFrame = window.requestAnimationFrame(() => {
    secondFrame = window.requestAnimationFrame(() => {
      if (!active) return;
      reveal.ref(element);
      if (reveal.isVisible) applyVisibility(true);
    });
  });

  return () => {
    active = false;
    window.cancelAnimationFrame(firstFrame);
    window.cancelAnimationFrame(secondFrame);
    window.clearTimeout(willChangeTimer);
    reveal.ref(null);
    element.style.willChange = 'auto';
  };
}
