import type { Dispatch } from 'react';
import { rounds } from '../content/rounds';
import type { Lang } from '../content/types';
import { fill, type UIStrings } from '../content/ui';
import type { Action } from '../game/state';
import { Credits } from './Credits';
import { useFocusHeading } from './useFocusHeading';

interface Props {
  nickname: string;
  dispatch: Dispatch<Action>;
  lang: Lang;
  t: UIStrings;
}

const CONFETTI = Array.from({ length: 28 }, (_, i) => i);

/** Final, score-free celebration screen. */
export function Celebrate({ nickname, dispatch, lang, t }: Props) {
  const headingRef = useFocusHeading<HTMLHeadingElement>('celebrate');
  const title = nickname ? fill(t.celebrateTitleNamed, { name: nickname }) : t.celebrateTitle;

  return (
    <section className="screen celebrate" aria-labelledby="celebrate-title">
      <div className="confetti" aria-hidden="true">
        {CONFETTI.map((i) => (
          <span key={i} className="confetti__piece" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>

      <div className="celebrate__hero">
        <p className="celebrate__trophy" aria-hidden="true">
          🎉
        </p>
        <h2 id="celebrate-title" className="celebrate__title" tabIndex={-1} ref={headingRef}>
          {title}
        </h2>
        <p className="celebrate__lead">{t.celebrateLead}</p>
      </div>

      <div className="card">
        <h3 className="card__label">{t.celebrateTakeaways}</h3>
        <ol className="celebrate__list">
          {rounds.map((r) => (
            <li key={r.id}>{r.takeaway[lang]}</li>
          ))}
        </ol>
      </div>

      <p className="celebrate__thanks">{t.celebrateThanks}</p>

      <div className="actions">
        <button type="button" className="btn btn--primary btn--block" onClick={() => dispatch({ type: 'restart' })}>
          <span aria-hidden="true">↻ </span>
          {t.playAgain}
        </button>
        <button type="button" className="btn btn--secondary btn--block" onClick={() => dispatch({ type: 'backToRecap' })}>
          {t.backToRecap}
        </button>
      </div>

      <Credits t={t} lang={lang} />
    </section>
  );
}
