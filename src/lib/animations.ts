import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Refresh ScrollTrigger once layout can have changed (full load, fonts ready) — never mid-scroll. */
export function scheduleScrollTriggerRefresh(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Mobile URL-bar movement fires resize constantly; this stops it jumping the hero.
  ScrollTrigger.config({ ignoreMobileResize: true });

  let disposed = false;
  const safeRefresh = () => {
    if (!disposed && !ScrollTrigger.isScrolling?.()) ScrollTrigger.refresh();
  };

  window.addEventListener('load', safeRefresh, { once: true });

  if (typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.ready.then(safeRefresh).catch(() => {});
  }

  return () => {
    disposed = true;
    window.removeEventListener('load', safeRefresh);
  };
}

/**
 * Helper to create a clean staggered word or line reveal with GSAP ScrollTrigger.
 */
export function animateRevealElements(
  elements: Element[] | NodeListOf<Element>,
  trigger: Element,
  options?: {
    stagger?: number;
    duration?: number;
    y?: number;
    start?: string;
  }
) {
  const { stagger = 0.06, duration = 0.85, y = 28, start = 'top 84%' } = options || {};

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start,
        toggleActions: 'play none none none',
      },
    }
  );
}
