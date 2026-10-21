export type Lang = 'en' | 'zh';

/** A piece of text in every supported language. */
export type Localized = Record<Lang, string>;

/** Stable IDs — scoring always compares IDs, never display position or translated text. */
export type Verdict = 'supported' | 'contradicted' | 'insufficient';
export type Impression = 'looks-right' | 'not-sure' | 'seems-off';
export type Interest = 'trustworthy-info' | 'data' | 'digital-tools';

export interface EvidenceCard {
  id: string;
  /** Short tab label, e.g. "A". */
  tab: string;
  title: Localized;
  facts: Localized[];
}

export interface ReasonOption {
  id: string;
  text: Localized;
}

export interface Round {
  id: string;
  title: Localized;
  /** Skill practised, shown at the top of the round. */
  skill: Localized;
  /** Short skill name used in the closing recap. */
  recapSkill: Localized;
  question: Localized;
  aiAnswer: Localized;
  evidence: EvidenceCard[];
  correctVerdict: Verdict;
  reasons: ReasonOption[];
  correctReasonId: string;
  explanation: Localized;
  takeaway: Localized;
  connection: Localized;
  /** Shown in the recap when the verdict or reason was not matched. */
  tip: Localized;
  /** Optional caution shown with the feedback (e.g. "not legal advice"). */
  caution?: Localized;
}

export interface InterestOption {
  id: Interest;
  label: Localized;
  heading: Localized;
  copy: Localized;
  starter: Localized;
}
