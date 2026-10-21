import { useEffect, useRef } from 'react';

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Moves keyboard/screen-reader focus to a heading whenever `key` changes,
 * so each new step is announced and the page starts at the right place.
 * Pass `null` to do nothing.
 */
export function useFocusHeading<T extends HTMLElement>(key: string | null) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (key === null || !el) return;
    el.focus({ preventScroll: true });
    if (typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  }, [key]);
  return ref;
}
