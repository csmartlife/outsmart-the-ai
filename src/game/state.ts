import type { Impression, Interest, Round, Verdict } from '../content/types';

export interface RoundAnswer {
  impression: Impression | null;
  /** True once the player has moved from first impression to the evidence. */
  investigating: boolean;
  openedCards: string[];
  verdict: Verdict | null;
  reasonId: string | null;
  submitted: boolean;
}

export type Screen = 'welcome' | 'nickname' | 'round' | 'ending' | 'celebrate';

export interface GameState {
  screen: Screen;
  roundIndex: number;
  answers: RoundAnswer[];
  interest: Interest | null;
  /** Optional, shown only on this screen. Never sent or stored. */
  nickname: string;
}

export const NICKNAME_MAX = 20;

/** Trim, collapse spaces and cap the length (by characters, so Chinese and emoji count once). */
export function cleanNickname(raw: string): string {
  return Array.from(raw.replace(/\s+/g, ' ').trimStart()).slice(0, NICKNAME_MAX).join('');
}

export type Action =
  | { type: 'start' }
  | { type: 'setNickname'; nickname: string }
  | { type: 'begin' }
  | { type: 'setImpression'; impression: Impression }
  | { type: 'beginInvestigation' }
  | { type: 'openCard'; cardId: string }
  | { type: 'setVerdict'; verdict: Verdict }
  | { type: 'setReason'; reasonId: string }
  | { type: 'submit' }
  | { type: 'next' }
  | { type: 'setInterest'; interest: Interest }
  | { type: 'finish' }
  | { type: 'backToRecap' }
  | { type: 'restart' };

const emptyAnswer = (): RoundAnswer => ({
  impression: null,
  investigating: false,
  openedCards: [],
  verdict: null,
  reasonId: null,
  submitted: false,
});

export const initialState = (roundCount: number): GameState => ({
  screen: 'welcome',
  roundIndex: 0,
  answers: Array.from({ length: roundCount }, emptyAnswer),
  interest: null,
  nickname: '',
});

export function makeReducer(rounds: Round[]) {
  return function reducer(state: GameState, action: Action): GameState {
    const current = state.answers[state.roundIndex];
    const update = (patch: Partial<RoundAnswer>): GameState => ({
      ...state,
      answers: state.answers.map((a, i) => (i === state.roundIndex ? { ...a, ...patch } : a)),
    });
    const inRound = state.screen === 'round';

    switch (action.type) {
      case 'start':
        return state.screen === 'welcome' ? { ...state, screen: 'nickname' } : state;

      case 'setNickname':
        return state.screen === 'nickname' ? { ...state, nickname: cleanNickname(action.nickname) } : state;

      case 'begin':
        return state.screen === 'nickname'
          ? { ...state, screen: 'round', roundIndex: 0, nickname: state.nickname.trim() }
          : state;

      case 'setImpression':
        // The impression is locked once the player moves on to the evidence.
        return inRound && !current.investigating ? update({ impression: action.impression }) : state;

      case 'beginInvestigation':
        return inRound && current.impression && !current.investigating ? update({ investigating: true }) : state;

      case 'openCard':
        return inRound && !current.openedCards.includes(action.cardId)
          ? update({ openedCards: [...current.openedCards, action.cardId] })
          : state;

      case 'setVerdict':
        return inRound && current.investigating && !current.submitted ? update({ verdict: action.verdict }) : state;

      case 'setReason': {
        const valid = rounds[state.roundIndex].reasons.some((r) => r.id === action.reasonId);
        return inRound && valid && current.investigating && !current.submitted
          ? update({ reasonId: action.reasonId })
          : state;
      }

      case 'submit':
        // Submitting twice (double tap, Enter key repeat) changes nothing.
        return inRound && !current.submitted && current.verdict && current.reasonId
          ? update({ submitted: true })
          : state;

      case 'next':
        if (!inRound || !current.submitted) return state;
        return state.roundIndex < rounds.length - 1
          ? { ...state, roundIndex: state.roundIndex + 1 }
          : { ...state, screen: 'ending' };

      case 'setInterest':
        return state.screen === 'ending' ? { ...state, interest: action.interest } : state;

      case 'finish':
        return state.screen === 'ending' ? { ...state, screen: 'celebrate' } : state;

      case 'backToRecap':
        return state.screen === 'celebrate' ? { ...state, screen: 'ending' } : state;

      case 'restart':
        return initialState(rounds.length);
    }
  };
}

export interface RoundScore {
  verdictCorrect: boolean;
  reasonCorrect: boolean;
  points: number;
}

/** Points for one round. Only submitted answers earn points; impressions never do. */
export function scoreRound(round: Round, answer: RoundAnswer): RoundScore {
  if (!answer.submitted) return { verdictCorrect: false, reasonCorrect: false, points: 0 };
  const verdictCorrect = answer.verdict === round.correctVerdict;
  const reasonCorrect = answer.reasonId === round.correctReasonId;
  return { verdictCorrect, reasonCorrect, points: (verdictCorrect ? 2 : 0) + (reasonCorrect ? 1 : 0) };
}

/** The score is derived from the answers, never accumulated, so it cannot be double-counted. */
export function totalScore(rounds: Round[], answers: RoundAnswer[]): number {
  return rounds.reduce((sum, r, i) => sum + scoreRound(r, answers[i]).points, 0);
}

/** Did the first impression already point the same way as the evidence? */
export function impressionMatched(round: Round, impression: Impression | null): boolean {
  if (round.correctVerdict === 'supported') return impression === 'looks-right';
  return impression === 'seems-off';
}
