import { useState } from 'react';
import type { EvidenceCard as Card, Lang } from '../content/types';
import { fill, type UIStrings } from '../content/ui';

interface Props {
  card: Card;
  roundId: string;
  lang: Lang;
  t: UIStrings;
  checked: boolean;
  onOpen: () => void;
}

export function EvidenceCard({ card, roundId, lang, t, checked, onOpen }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = `ev-${roundId}-${card.id}`;

  const toggle = () => {
    if (!open) onOpen();
    setOpen(!open);
  };

  return (
    <div className={`evidence${open ? ' is-open' : ''}`}>
      <h4 className="evidence__heading">
        <button type="button" className="evidence__toggle" aria-expanded={open} aria-controls={panelId} onClick={toggle}>
          <span className="evidence__tab" aria-hidden="true">
            {card.tab}
          </span>
          <span className="evidence__titles">
            <span className="evidence__kicker">{fill(t.cardLabel, { tab: card.tab })}</span>
            <span className="evidence__title">{card.title[lang]}</span>
          </span>
          {checked && (
            <span className="evidence__checked">
              <span aria-hidden="true">✓</span>
              <span className="visually-hidden">{t.cardChecked}</span>
            </span>
          )}
          <span className="evidence__state">{open ? t.close : t.open}</span>
        </button>
      </h4>
      <div id={panelId} className="evidence__panel" hidden={!open}>
        <ul className="evidence__facts">
          {card.facts.map((fact, i) => (
            <li key={i}>{fact[lang]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
