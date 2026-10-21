import type { Lang } from '../content/types';
import { Credits } from './Credits';
import type { UIStrings } from '../content/ui';
import { useFocusHeading } from './useFocusHeading';

interface Props {
  t: UIStrings;
  lang: Lang;
  onStart: () => void;
  /** False on first page load so focus isn't moved before the player does anything. */
  focusOnMount: boolean;
}

export function Welcome({ t, lang, onStart, focusOnMount }: Props) {
  const headingRef = useFocusHeading<HTMLHeadingElement>(focusOnMount ? 'welcome' : null);

  return (
    <section className="screen welcome" aria-labelledby="welcome-title">
      <p className="eyebrow">{t.programmeContext}</p>
      <div className="hero">
        <Magnifier />
        <h1 id="welcome-title" className="hero__title" tabIndex={-1} ref={headingRef}>
          {t.title}
        </h1>
      </div>
      <p className="hero__subtitle">{t.subtitle}</p>
      <p className="hero__support">{t.supporting}</p>

      <ul className="chips" aria-label={t.howTitle}>
        <li className="chip">
          <span aria-hidden="true">⏱</span> {t.chipTime}
        </li>
        <li className="chip">
          <span aria-hidden="true">🔓</span> {t.chipSignup}
        </li>
        <li className="chip">
          <span aria-hidden="true">🐢</span> {t.chipTimer}
        </li>
      </ul>

      <button type="button" className="btn btn--primary btn--block btn--big" onClick={onStart}>
        {t.start} <span aria-hidden="true">→</span>
      </button>

      <div className="how">
        <div className="how__block">
          <h2 className="how__title">{t.howTitle}</h2>
          <ol className="how__steps">
            {t.howSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
        <div className="how__block">
          <h2 className="how__title">{t.scoringTitle}</h2>
          <ul className="how__points">
            {t.scoringLines.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="how__max">{t.scoringMax}</p>
        </div>
      </div>
      <Credits t={t} lang={lang} />
    </section>
  );
}

function Magnifier() {
  return (
    <svg className="hero__icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="26" cy="26" r="16" fill="var(--accent)" stroke="var(--ink)" strokeWidth="5" />
      <path d="M38 38l16 16" stroke="var(--ink)" strokeWidth="7" strokeLinecap="round" />
      <path d="M18 24a9 9 0 0 1 8-8" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
