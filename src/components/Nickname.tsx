import type { Dispatch, FormEvent } from 'react';
import type { UIStrings } from '../content/ui';
import { NICKNAME_MAX, type Action } from '../game/state';
import { useFocusHeading } from './useFocusHeading';

interface Props {
  nickname: string;
  dispatch: Dispatch<Action>;
  t: UIStrings;
}

/** Optional nickname. Kept in memory only, never sent anywhere. */
export function Nickname({ nickname, dispatch, t }: Props) {
  const headingRef = useFocusHeading<HTMLHeadingElement>('nickname');

  const begin = (e?: FormEvent) => {
    e?.preventDefault();
    dispatch({ type: 'begin' });
  };

  return (
    <section className="screen nickname" aria-labelledby="nick-title">
      <div className="nickname__badge" aria-hidden="true">
        🕵️
      </div>
      <h2 id="nick-title" className="round__title" tabIndex={-1} ref={headingRef}>
        {t.nickTitle}
      </h2>
      <p className="muted" id="nick-intro">
        {t.nickIntro}
      </p>

      <form className="nickname__form" onSubmit={begin}>
        <label className="nickname__label" htmlFor="nickname-input">
          {t.nickLabel}
        </label>
        <input
          id="nickname-input"
          className="nickname__input"
          type="text"
          value={nickname}
          maxLength={NICKNAME_MAX * 2}
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="go"
          placeholder={t.nickPlaceholder}
          aria-describedby="nick-intro"
          onChange={(e) => dispatch({ type: 'setNickname', nickname: e.target.value })}
        />

        <p className="nickname__suggest">{t.nickSuggest}</p>
        <div className="nickname__chips">
          {t.nickSuggestions.map((name) => (
            <button
              key={name}
              type="button"
              className={`chip-btn${nickname === name ? ' is-selected' : ''}`}
              aria-pressed={nickname === name}
              onClick={() => dispatch({ type: 'setNickname', nickname: name })}
            >
              {name}
            </button>
          ))}
        </div>

        <button type="submit" className="btn btn--primary btn--block btn--big">
          {t.nickStart} <span aria-hidden="true">→</span>
        </button>
      </form>

      <button
        type="button"
        className="btn btn--link nickname__skip"
        onClick={() => {
          dispatch({ type: 'setNickname', nickname: '' });
          dispatch({ type: 'begin' });
        }}
      >
        {t.nickSkip}
      </button>
    </section>
  );
}
