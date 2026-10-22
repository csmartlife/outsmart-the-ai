import type { Dispatch, Ref } from 'react';
import type { Lang, Round } from '../content/types';
import { fill, type UIStrings } from '../content/ui';
import { impressionMatched, scoreRound, type Action, type RoundAnswer } from '../game/state';
import { Progress } from './Progress';

interface Props {
  round: Round;
  index: number;
  total: number;
  answer: RoundAnswer;
  dispatch: Dispatch<Action>;
  lang: Lang;
  t: UIStrings;
  headingRef: Ref<HTMLHeadingElement>;
}

export function Feedback({ round, index, total, answer, dispatch, lang, t, headingRef }: Props) {
  const score = scoreRound(round, answer);
  const reasonText = (id: string | null) => round.reasons.find((r) => r.id === id)?.text[lang] ?? '';
  const isLast = index === total - 1;

  let message: string;
  if (!score.verdictCorrect) message = t.differentVerdict;
  else if (impressionMatched(round, answer.impression)) message = t.keptJudgement;
  else message = t.goodUpdate;

  return (
    <section className="screen feedback" aria-labelledby={`fb-${round.id}`}>
      <Progress index={index} total={total} t={t} />
      <h2 id={`fb-${round.id}`} className="round__title" tabIndex={-1} ref={headingRef}>
        {fill(t.feedbackTitle, { n: index + 1 })}
        <span className="visually-hidden">. {fill(t.pointsEarnedSr, { n: score.points })}</span>
      </h2>

      <div className="stamp-row">
        <p className={`stamp stamp--${score.points}`} aria-hidden="true">
          {fill(t.pointsEarned, { n: score.points })}
        </p>
        <p className="feedback__message">{message}</p>
      </div>

      <ul className="results">
        <ResultRow
          label={t.resultVerdict}
          ok={score.verdictCorrect}
          points={score.verdictCorrect ? 2 : 0}
          chosen={answer.verdict ? t.verdicts[answer.verdict] : ''}
          answerLabel={t.evidenceShows}
          answer={t.verdicts[round.correctVerdict]}
          t={t}
        />
        <ResultRow
          label={t.resultReason}
          ok={score.reasonCorrect}
          points={score.reasonCorrect ? 1 : 0}
          chosen={reasonText(answer.reasonId)}
          answerLabel={t.strongestReason}
          answer={reasonText(round.correctReasonId)}
          t={t}
        />
      </ul>

      <div className="card explain">
        <h3 className="card__label">{t.whyLabel}</h3>
        <p>{round.explanation[lang]}</p>
      </div>

      <div className="card takeaway">
        <h3 className="card__label">
          <span aria-hidden="true">💡 </span>
          {t.takeawayLabel}
        </h3>
        <p className="takeaway__text">{round.takeaway[lang]}</p>
      </div>

      <div className="card connection">
        <h3 className="card__label">{t.connectionLabel}</h3>
        <p>{round.connection[lang]}</p>
      </div>

      {round.caution && (
        <p className="caution">
          <strong>{t.cautionLabel}:</strong> {round.caution[lang]}
        </p>
      )}

      <button type="button" className="btn btn--primary btn--block" onClick={() => dispatch({ type: 'next' })}>
        {isLast ? t.seeRecap : t.nextRound} <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

interface ResultRowProps {
  label: string;
  ok: boolean;
  points: number;
  chosen: string;
  answerLabel: string;
  answer: string;
  t: UIStrings;
}

/** One line per scored choice: what you picked, whether it was right, and the points. */
function ResultRow({ label, ok, points, chosen, answerLabel, answer, t }: ResultRowProps) {
  return (
    <li className={`result${ok ? ' is-correct' : ' is-diff'}`}>
      <span className="result__icon" aria-hidden="true">
        {ok ? '✓' : '✗'}
      </span>
      <div className="result__body">
        <p className="result__head">
          <strong>{label}</strong>
          <span className="result__status">{ok ? t.correct : t.notQuite}</span>
        </p>
        <p className="result__line">
          <span className="muted">{t.youChose}:</span> {chosen}
        </p>
        {!ok && (
          <p className="result__line result__answer">
            <span className="muted">{answerLabel}:</span> <strong>{answer}</strong>
          </p>
        )}
      </div>
      <span className="result__points">+{points}</span>
    </li>
  );
}
