import type { ReactNode } from 'react';

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface Props<T extends string> {
  name: string;
  legend: string;
  hint?: string;
  options: ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  extra?: ReactNode;
}

/** Native radio group styled as large tiles: arrow keys, Tab and screen readers work out of the box. */
export function ChoiceGroup<T extends string>({ name, legend, hint, options, value, onChange, extra }: Props<T>) {
  const hintId = hint ? `${name}-hint` : undefined;
  return (
    <fieldset className="choices" aria-describedby={hintId}>
      <legend className="choices__legend">{legend}</legend>
      {hint && (
        <p className="choices__hint" id={hintId}>
          {hint}
        </p>
      )}
      {extra}
      <div className="choices__list">
        {options.map((opt) => (
          <label key={opt.value} className={`choice${value === opt.value ? ' is-selected' : ''}`}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span className="choice__mark" aria-hidden="true" />
            {opt.icon && (
              <span className="choice__icon" aria-hidden="true">
                {opt.icon}
              </span>
            )}
            <span className="choice__label">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
