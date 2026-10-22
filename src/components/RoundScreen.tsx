import { useState, type Dispatch } from 'react';
import type { Impression, Lang, Round, Verdict } from '../content/types';
import { fill, type UIStrings } from '../content/ui';
import type { Action, RoundAnswer } from '../game/state';
import { ChoiceGroup } from './ChoiceGroup';
import { EvidenceCard } from './EvidenceCard';
import { Feedback } from './Feedback';
import { Progress } from './Progress';
import { useFocusHeading } from './useFocusHeading';

interface Props {
  round: Round;
  index: number;
  total: number;
  answer: RoundAnswer;
  dispatch: Dispatch<Action>;
  lang: Lang;
  t: UIStrings;
}

const IMPRESSIONS: Impression[] = ['looks-right', 'not-sure', 'seems-off'];
const IMPRESSION_ICONS: Record<Impression, string> = { 'looks-right': '👍', 'not-sure': '🤔', 'seems-off': '🧐' };
const VERDICTS: Verdict[] = ['supported', 'contradicted', 'insufficient'];
const VERDICT_ICONS: Record<Verdict, string> = { supported: '✓', contradicted: '✗', insufficient: '?' };

export function RoundScreen({ round, index, total, answer, dispatch, lang, t }: Props) {
  const stage = answer.submitted ? 'feedback' : answer.investigating ? 'evidence' : 'impression';
  const headingRef = useFocusHeading<HTMLHeadingElement>(`${round.id}-${stage === 'feedback' ? 'fb' : 'q'}`);
  const evidenceRef = useFocusHeading<HTMLHeadingElement>(stage === 'evidence' ? `${round.id}-ev` : null, 'into');

  if (stage === 'feedback') {
    return <Feedback round={round} index={index} total={total} answer={answer} dispatch={dispatch} lang={lang} t={t} headingRef={headingRef} />;
  }

  return (
    <section className="screen round" aria-labelledby={`title-${round.id}`}>
      <Progress index={index} total={total} t={t} />
      <h2 id={`title-${round.id}`} className="round__title" tabIndex={-1} ref={headingRef}>
        {round.title[lang]}
      </h2>
      <p className="round__skill">
        <span className="tag">{t.skillLabel}</span> {round.skill[lang]}
      </p>

      <div className="card question">
        <p className="card__label">{t.questionLabel}</p>
        <p className="question__text">{round.question[lang]}</p>
      </div>

      <div className="card ai">
        <p className="card__label">
          <span className="ai__avatar" aria-hidden="true">
            AI
          </span>
          {t.aiLabel}
          <span className="badge">{t.aiBadge}</span>
        </p>
        <p className="ai__text">{round.aiAnswer[lang]}</p>
      </div>

      {stage === 'impression' ? (
        <div className="step">
          <ChoiceGroup
            name={`impression-${round.id}`}
            legend={t.impressionPrompt}
            hint={t.impressionHint}
            options={IMPRESSIONS.map((v) => ({ value: v, label: t.impressions[v], icon: IMPRESSION_ICONS[v] }))}
            value={answer.impression}
            onChange={(impression) => dispatch({ type: 'setImpression', impression })}
          />
          <button
            type="button"
            className="btn btn--primary btn--block"
            disabled={!answer.impression}
            onClick={() => dispatch({ type: 'beginInvestigation' })}
          >
            {t.toEvidence} <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <Investigation round={round} answer={answer} dispatch={dispatch} lang={lang} t={t} evidenceRef={evidenceRef} />
      )}
    </section>
  );
}

function Investigation({
  round,
  answer,
  dispatch,
  lang,
  t,
  evidenceRef,
}: Omit<Props, 'index' | 'total'> & { evidenceRef: React.Ref<HTMLHeadingElement> }) {
  const [showDefs, setShowDefs] = useState(false);
  const ready = Boolean(answer.verdict && answer.reasonId);

  return (
    <div className="step">
      {answer.impression && (
        <p className="impression-chip">
          {t.yourImpression}: <strong>{t.impressions[answer.impression]}</strong>
        </p>
      )}

      <section className="evidence-list" aria-labelledby={`ev-title-${round.id}`}>
        <div className="section-head">
          <h3 id={`ev-title-${round.id}`} tabIndex={-1} ref={evidenceRef}>
            {t.evidenceTitle}
          </h3>
          <span className="meter" aria-live="polite">
            {fill(t.checkedCount, { n: answer.openedCards.length, total: round.evidence.length })}
          </span>
        </div>
        <p className="muted">{t.evidenceHint}</p>
        {round.evidence.map((card) => (
          <EvidenceCard
            key={card.id}
            card={card}
            roundId={round.id}
            lang={lang}
            t={t}
            checked={answer.openedCards.includes(card.id)}
            onOpen={() => dispatch({ type: 'openCard', cardId: card.id })}
          />
        ))}
      </section>

      <ChoiceGroup
        name={`verdict-${round.id}`}
        legend={t.verdictPrompt}
        hint={t.verdictHint}
        options={VERDICTS.map((v) => ({ value: v, label: t.verdicts[v], icon: VERDICT_ICONS[v] }))}
        value={answer.verdict}
        onChange={(verdict) => dispatch({ type: 'setVerdict', verdict })}
        extra={
          <div className="defs">
            <button
              type="button"
              className="btn btn--link"
              aria-expanded={showDefs}
              aria-controls={`defs-${round.id}`}
              onClick={() => setShowDefs(!showDefs)}
            >
              <span aria-hidden="true">ⓘ</span> {showDefs ? t.hideDefs : t.showDefs}
            </button>
            <dl id={`defs-${round.id}`} className="defs__list" hidden={!showDefs}>
              {VERDICTS.map((v) => (
                <div key={v}>
                  <dt>{t.verdicts[v]}</dt>
                  <dd>{t.verdictDefs[v]}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <ChoiceGroup
        name={`reason-${round.id}`}
        legend={t.reasonPrompt}
        hint={t.reasonHint}
        options={round.reasons.map((r) => ({ value: r.id, label: r.text[lang] }))}
        value={answer.reasonId}
        onChange={(reasonId) => dispatch({ type: 'setReason', reasonId })}
      />

      <div className="submit-area">
        <p className="muted small" id={`submit-hint-${round.id}`}>
          {ready ? t.pointsNote : t.submitNeeds}
        </p>
        <button
          type="button"
          className="btn btn--primary btn--block"
          disabled={!ready}
          aria-describedby={`submit-hint-${round.id}`}
          onClick={() => dispatch({ type: 'submit' })}
        >
          {t.submit}
        </button>
      </div>
    </div>
  );
}
