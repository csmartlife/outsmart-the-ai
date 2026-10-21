import { fill, type UIStrings } from '../content/ui';

export function Progress({ index, total, t }: { index: number; total: number; t: UIStrings }) {
  return (
    <div className="progress">
      <span className="progress__text">{fill(t.roundOf, { n: index + 1, total })}</span>
      <span className="progress__dots" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`dot${i < index ? ' is-done' : i === index ? ' is-current' : ''}`} />
        ))}
      </span>
    </div>
  );
}
