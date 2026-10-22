import { useRef, useState, type Dispatch } from 'react';
import { config } from '../config';
import { interests, rounds } from '../content/rounds';
import type { Interest, Lang } from '../content/types';
import { fill, type UIStrings } from '../content/ui';
import { scoreRound, totalScore, type Action, type GameState } from '../game/state';
import { StarterDialog } from './StarterDialog';
import { ChoiceGroup } from './ChoiceGroup';
import { useFocusHeading } from './useFocusHeading';

interface Props {
  state: GameState;
  dispatch: Dispatch<Action>;
  lang: Lang;
  t: UIStrings;
}

export function Ending({ state, dispatch, lang, t }: Props) {
  const headingRef = useFocusHeading<HTMLHeadingElement>('ending');
  const [starterOpen, setStarterOpen] = useState(false);
  const starterButton = useRef<HTMLButtonElement>(null);
  const score = totalScore(rounds, state.answers);
  const choice = interests.find((i) => i.id === state.interest) ?? null;

  return (
    <section className="screen ending" aria-labelledby="recap-title">
      <h2 id="recap-title" className="round__title" tabIndex={-1} ref={headingRef}>
        {state.nickname ? fill(t.recapTitleNamed, { name: state.nickname }) : t.recapTitle}
      </h2>

      <p className="score-big">
        <span className="score-big__num">{score}</span>
        <span className="score-big__label">{t.scoreUnit}</span>
      </p>
      <p className="muted small">{t.scoreNote}</p>

      <ul className="recap">
        {rounds.map((round, i) => {
          const s = scoreRound(round, state.answers[i]);
          const full = s.verdictCorrect && s.reasonCorrect;
          return (
            <li key={round.id} className={`recap__item${full ? ' is-full' : ''}`}>
              <span className="recap__icon" aria-hidden="true">
                {full ? '★' : '→'}
              </span>
              <div>
                <h3 className="recap__skill">{round.recapSkill[lang]}</h3>
                <p className="recap__marks">
                  {fill(t.verdictReason, { v: s.verdictCorrect ? t.yes : t.no, r: s.reasonCorrect ? t.yes : t.no })}
                  <span className="visually-hidden">
                    {' '}
                    ({s.verdictCorrect ? t.match : t.noMatch}, {s.reasonCorrect ? t.match : t.noMatch})
                  </span>
                </p>
                <p>{full ? t.demonstrated : round.tip[lang]}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <ChoiceGroup<Interest>
        name="interest"
        legend={t.interestPrompt}
        options={interests.map((o) => ({ value: o.id, label: o.label[lang] }))}
        value={state.interest}
        onChange={(interest) => dispatch({ type: 'setInterest', interest })}
      />

      <div aria-live="polite">
        {choice && (
          <div className="card suggestion" key={choice.id}>
            <p className="tag tag--accent">{t.suggestedTag}</p>
            <h3 className="suggestion__heading">{choice.heading[lang]}</h3>
            <p>{choice.copy[lang]}</p>
            <p className="muted small">{t.suggestedNote}</p>
          </div>
        )}
      </div>

      <p className="closing">{t.closing}</p>

      <div className="actions">
        {choice && (
          <button
            type="button"
            ref={starterButton}
            className="btn btn--primary btn--block"
            onClick={() => setStarterOpen(true)}
          >
            <span aria-hidden="true">💬 </span>
            {t.showStarter}
          </button>
        )}
        {config.programmeUrl && (
          <a className="btn btn--secondary btn--block" href={config.programmeUrl} target="_blank" rel="noopener noreferrer">
            {t.programmeLink} <span aria-hidden="true">↗</span>
          </a>
        )}
        <button
          type="button"
          className={`btn btn--block ${choice ? 'btn--secondary' : 'btn--primary'}`}
          onClick={() => dispatch({ type: 'finish' })}
        >
          {t.finish} <span aria-hidden="true">🎉</span>
        </button>
      </div>

      {starterOpen && choice && (
        <StarterDialog
          t={t}
          text={choice.starter[lang]}
          topic={choice.heading[lang]}
          onClose={() => {
            setStarterOpen(false);
            starterButton.current?.focus();
          }}
        />
      )}
    </section>
  );
}
