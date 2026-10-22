import { useEffect, useRef } from 'react';

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Moves keyboard/screen-reader focus to a heading whenever `key` changes,
 * so each new step is announced and the page starts at the right place.
 * `scroll: 'top'` (new screens) returns to the top of the page so nothing
 * sits under the sticky bar; `'into'` (a section further down) scrolls it into view.
 * Pass `null` as the key to do nothing.
 */
export function useFocusHeading<T extends HTMLElement>(key: string | null, scroll: 'top' | 'into' = 'top') {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (key === null || !el) return;
    el.focus({ preventScroll: true });
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
    if (scroll === 'top') {
      if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0, behavior: 'auto' });
    } else if (typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'start', behavior });
    }
  }, [key, scroll]);
  return ref;
}
