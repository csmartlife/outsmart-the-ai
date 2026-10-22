import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Celebrate } from './components/Celebrate';
import { Ending } from './components/Ending';
import { Nickname } from './components/Nickname';
import { RoundScreen } from './components/RoundScreen';
import { Welcome } from './components/Welcome';
import { rounds } from './content/rounds';
import type { Lang } from './content/types';
import { ui } from './content/ui';
import { countPlay } from './game/playCounter';
import { initialState, makeReducer, totalScore } from './game/state';

const LANGS: Lang[] = ['en', 'zh'];

export default function App() {
  // Language lives outside the game state, so switching never touches answers or progress.
  const [lang, setLang] = useState<Lang>('en');
  const reducer = useMemo(() => makeReducer(rounds), []);
  const [state, dispatch] = useReducer(reducer, rounds.length, initialState);
  const hasPlayed = useRef(false);
  const t = ui[lang];

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant-HK' : 'en';
    document.title = t.title;
  }, [lang, t.title]);

  if (state.screen !== 'welcome') hasPlayed.current = true;

  // Anonymous counts: one 'start', one 'finish' and one topic choice per game at most.
  const counted = useRef(new Set<string>());
  useEffect(() => {
    const once = (key: string, send: () => void) => {
      if (!counted.current.has(key)) {
        counted.current.add(key);
        send();
      }
    };
    if (state.screen === 'welcome') counted.current.clear();
    if (state.screen === 'round') once('start', () => countPlay({ event: 'start' }));
    if (state.screen === 'ending') once('finish', () => countPlay({ event: 'finish' }));
    const interest = state.interest;
    if (interest) once('interest', () => countPlay({ event: 'interest', interest }));
  }, [state.screen, state.interest]);
  const score = totalScore(rounds, state.answers);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          {state.screen === 'welcome' || state.screen === 'nickname' ? (
            <span className="topbar__brand" aria-hidden="true">
              <span className="topbar__logo">?</span>
            </span>
          ) : (
            <p className="score-pill">
              <span className="visually-hidden">{t.scoreLabel}: </span>
              <strong>{score}</strong>
              <span aria-hidden="true">/9</span>
              <span className="visually-hidden"> </span>
              <span className="score-pill__label" aria-hidden="true">
                {t.scoreLabel}
              </span>
            </p>
          )}
          <div className="lang" role="group" aria-label={`${ui.en.langToggleLabel} / ${ui.zh.langToggleLabel}`}>
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                lang={l === 'zh' ? 'zh-Hant-HK' : 'en'}
                className="lang__btn"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
              >
                {ui[l].langName}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="main">
        {state.screen === 'welcome' && (
          <Welcome t={t} lang={lang} onStart={() => dispatch({ type: 'start' })} focusOnMount={hasPlayed.current} />
        )}
        {state.screen === 'nickname' && <Nickname nickname={state.nickname} dispatch={dispatch} t={t} />}
        {state.screen === 'round' && (
          <RoundScreen
            key={rounds[state.roundIndex].id}
            round={rounds[state.roundIndex]}
            index={state.roundIndex}
            total={rounds.length}
            answer={state.answers[state.roundIndex]}
            dispatch={dispatch}
            lang={lang}
            t={t}
          />
        )}
        {state.screen === 'ending' && <Ending state={state} dispatch={dispatch} lang={lang} t={t} />}
        {state.screen === 'celebrate' && <Celebrate nickname={state.nickname} dispatch={dispatch} lang={lang} t={t} />}
      </main>

      <footer className="footer">
        <p>
          <span aria-hidden="true">ⓘ </span>
          {t.disclosurePrepared}
        </p>
        <p>{t.disclosureFictional}</p>
        <p>{t.disclosurePrivacy}</p>
      </footer>
    </div>
  );
}
