import { useEffect, useRef } from 'react';
import type { UIStrings } from '../content/ui';

interface Props {
  t: UIStrings;
  text: string;
  topic: string;
  onClose: () => void;
}

/** Full-screen card a student can hold up to a staff member. */
export function StarterDialog({ t, text, topic, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Only one focusable control inside, so keep Tab on it.
      if (e.key === 'Tab') {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [onClose]);

  return (
    <div className="overlay">
      <div className="starter" role="dialog" aria-modal="true" aria-labelledby="starter-title" aria-describedby="starter-text">
        <p className="starter__title" id="starter-title">
          <span aria-hidden="true">💬 </span>
          {t.starterTitle}
        </p>
        <p className="starter__text" id="starter-text">
          {text}
        </p>
        <p className="starter__topic">{topic}</p>
        <p className="starter__help">{t.starterHelp}</p>
        <button type="button" ref={closeRef} className="btn btn--secondary btn--block" onClick={onClose}>
          {t.starterClose}
        </button>
      </div>
    </div>
  );
}
