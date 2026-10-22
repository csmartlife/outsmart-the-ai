import { describe, expect, it } from 'vitest';
import { interests, rounds } from '../content/rounds';
import { ui } from '../content/ui';
import type { Impression, Verdict } from '../content/types';
import { cleanNickname, initialState, makeReducer, totalScore, type Action, type GameState } from './state';

const reducer = makeReducer(rounds);
const run = (actions: Action[], from: GameState = initialState(rounds.length)) => actions.reduce(reducer, from);

function playRound(impression: Impression, verdict: Verdict, reasonId: string): Action[] {
  return [
    { type: 'setImpression', impression },
    { type: 'beginInvestigation' },
    { type: 'setVerdict', verdict },
    { type: 'setReason', reasonId },
    { type: 'submit' },
    { type: 'next' },
  ];
}

const correct = rounds.map((r) => playRound('not-sure', r.correctVerdict, r.correctReasonId)).flat();

describe('content', () => {
  it('every round has a valid correct reason and three evidence cards', () => {
    for (const r of rounds) {
      expect(r.reasons.map((x) => x.id)).toContain(r.correctReasonId);
      expect(r.evidence).toHaveLength(3);
      expect(new Set(r.reasons.map((x) => x.id)).size).toBe(r.reasons.length);
    }
  });

  it('every content string exists in both languages', () => {
    const walk = (v: unknown): void => {
      if (v && typeof v === 'object') {
        if ('en' in v && 'zh' in v) {
          expect((v as { en: string }).en.trim()).not.toBe('');
          expect((v as { zh: string }).zh.trim()).not.toBe('');
          return;
        }
        Object.values(v).forEach(walk);
      }
    };
    walk(rounds);
    walk(interests);
    expect(Object.keys(ui.zh).sort()).toEqual(Object.keys(ui.en).sort());
  });
});

describe('scoring', () => {
  it('all correct answers score 9/9 and reach the ending', () => {
    const s = run([{ type: 'start' }, { type: 'begin' }, ...correct]);
    expect(s.screen).toBe('ending');
    expect(totalScore(rounds, s.answers)).toBe(9);
  });

  it('all wrong answers score 0', () => {
    const wrong = rounds
      .map((r) => {
        const v: Verdict = r.correctVerdict === 'supported' ? 'contradicted' : 'supported';
        const reason = r.reasons.find((x) => x.id !== r.correctReasonId)!.id;
        return playRound('looks-right', v, reason);
      })
      .flat();
    expect(totalScore(rounds, run([{ type: 'start' }, { type: 'begin' }, ...wrong]).answers)).toBe(0);
  });

  it('verdict only = 2, reason only = 1, consistently', () => {
    const [r1, r2, r3] = rounds;
    const s = run([
      { type: 'start' }, { type: 'begin' },
      ...playRound('looks-right', r1.correctVerdict, r1.reasons.find((x) => x.id !== r1.correctReasonId)!.id),
      ...playRound('looks-right', 'contradicted', r2.correctReasonId),
      ...playRound('looks-right', r3.correctVerdict, r3.correctReasonId),
    ]);
    expect(totalScore(rounds, s.answers)).toBe(2 + 1 + 3);
  });

  it('first impression has no effect on points', () => {
    for (const imp of ['looks-right', 'not-sure', 'seems-off'] as Impression[]) {
      const actions = rounds.map((r) => playRound(imp, r.correctVerdict, r.correctReasonId)).flat();
      expect(totalScore(rounds, run([{ type: 'start' }, { type: 'begin' }, ...actions]).answers)).toBe(9);
    }
  });

  it('repeated submission does not add points, and answers lock after submit', () => {
    const r = rounds[0];
    let s = run([
      { type: 'start' }, { type: 'begin' },
      { type: 'setImpression', impression: 'looks-right' },
      { type: 'beginInvestigation' },
      { type: 'setVerdict', verdict: r.correctVerdict },
      { type: 'setReason', reasonId: r.correctReasonId },
      { type: 'submit' },
      { type: 'submit' },
      { type: 'submit' },
    ]);
    expect(totalScore(rounds, s.answers)).toBe(3);
    s = run([{ type: 'setVerdict', verdict: 'supported' }, { type: 'setReason', reasonId: 'needs-more-ram' }, { type: 'submit' }], s);
    expect(s.answers[0].verdict).toBe(r.correctVerdict);
    expect(totalScore(rounds, s.answers)).toBe(3);
  });

  it('player can revise verdict and reason before submitting', () => {
    const r = rounds[0];
    const s = run([
      { type: 'start' }, { type: 'begin' },
      { type: 'setImpression', impression: 'looks-right' },
      { type: 'beginInvestigation' },
      { type: 'setVerdict', verdict: 'supported' },
      { type: 'setReason', reasonId: 'ai-always-wrong' },
      { type: 'setVerdict', verdict: r.correctVerdict },
      { type: 'setReason', reasonId: r.correctReasonId },
      { type: 'submit' },
    ]);
    expect(totalScore(rounds, s.answers)).toBe(3);
  });

  it('cannot submit without both a verdict and a reason, or skip ahead', () => {
    const s = run([
      { type: 'start' }, { type: 'begin' },
      { type: 'setImpression', impression: 'looks-right' },
      { type: 'beginInvestigation' },
      { type: 'setVerdict', verdict: 'contradicted' },
      { type: 'submit' },
      { type: 'next' },
    ]);
    expect(s.answers[0].submitted).toBe(false);
    expect(s.roundIndex).toBe(0);
  });

  it('opening cards earns nothing and is counted once per card', () => {
    const s = run([
      { type: 'start' }, { type: 'begin' },
      { type: 'setImpression', impression: 'looks-right' },
      { type: 'beginInvestigation' },
      { type: 'openCard', cardId: 'listing' },
      { type: 'openCard', cardId: 'listing' },
      { type: 'openCard', cardId: 'delivery' },
    ]);
    expect(s.answers[0].openedCards).toEqual(['listing', 'delivery']);
    expect(totalScore(rounds, s.answers)).toBe(0);
  });

  it('restart clears answers, score and interest', () => {
    const done = run([{ type: 'start' }, { type: 'begin' }, ...correct, { type: 'setInterest', interest: 'data' }]);
    expect(done.interest).toBe('data');
    const s = reducer(done, { type: 'restart' });
    expect(s).toEqual(initialState(rounds.length));
    expect(totalScore(rounds, s.answers)).toBe(0);
  });

  it('nickname is cleaned, capped and cleared by restart, and finish/back move between end screens', () => {
    expect(cleanNickname('   Mei    Ling  ')).toBe('Mei Ling ');
    expect(Array.from(cleanNickname('偵'.repeat(40)))).toHaveLength(20);
    let s = run([{ type: 'start' }, { type: 'setNickname', nickname: '  Detective   Mei ' }, { type: 'begin' }]);
    expect(s.nickname).toBe('Detective Mei');
    expect(s.screen).toBe('round');
    s = run([{ type: 'setNickname', nickname: 'Changed' }], s);
    expect(s.nickname).toBe('Detective Mei');
    s = run([...correct, { type: 'finish' }], s);
    expect(s.screen).toBe('celebrate');
    s = run([{ type: 'backToRecap' }], s);
    expect(s.screen).toBe('ending');
    s = run([{ type: 'finish' }, { type: 'restart' }], s);
    expect(s).toEqual(initialState(rounds.length));
  });
});
