import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';
import { interests, rounds } from './content/rounds';
import { ui } from './content/ui';

afterEach(cleanup);

const en = ui.en;
const zh = ui.zh;
const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
const pick = (label: string) => fireEvent.click(screen.getByRole('radio', { name: label }));

describe('full play-through', () => {
  it('plays all rounds, keeps state across language switches, personalises and restarts', () => {
    render(<App />);
    expect(screen.getByText(en.disclosurePrepared)).toBeTruthy();
    expect(screen.getByText(en.disclosureFictional)).toBeTruthy();
    expect(screen.getByText(/A Very Short Introduction/)).toBeTruthy();
    expect(screen.getByText(/Dr\. Jeremy Ng, Ms\. Cindy Liang/)).toBeTruthy();
    click(new RegExp(en.start));

    rounds.forEach((round, i) => {
      pick(en.impressions['not-sure']);
      click(new RegExp(en.toEvidence));

      // Evidence opens in any order and stays available while deciding.
      for (const card of [...round.evidence].reverse()) {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(card.title.en) }));
        expect(screen.getByText(card.facts[0].en)).toBeTruthy();
      }

      pick(en.verdicts[round.correctVerdict]);
      const submit = screen.getByRole('button', { name: en.submit }) as HTMLButtonElement;
      expect(submit.disabled).toBe(true);

      if (i === 0) {
        // Switch language mid-round: selection, opened cards and round are preserved.
        click(zh.langName);
        expect((screen.getByRole('radio', { name: zh.verdicts[round.correctVerdict] }) as HTMLInputElement).checked).toBe(true);
        expect(screen.getByText(round.evidence[0].facts[0].zh)).toBeTruthy();
        expect(screen.getByText(round.title.zh)).toBeTruthy();
        click(en.langName);
      }

      pick(round.reasons.find((r) => r.id === round.correctReasonId)!.text.en);
      click(en.submit);
      expect(screen.getByText(round.takeaway.en)).toBeTruthy();
      expect(screen.getByText(en.goodUpdate)).toBeTruthy();
      expect(screen.queryByRole('button', { name: en.submit })).toBeNull();
      click(new RegExp(i === rounds.length - 1 ? en.seeRecap : en.nextRound));
    });

    expect(screen.getByRole('heading', { name: en.recapTitle })).toBeTruthy();
    expect(document.querySelector('.score-big__num')?.textContent).toBe('9');
    expect(screen.getAllByText(en.demonstrated)).toHaveLength(3);
    expect(screen.queryByRole('button', { name: new RegExp(en.showStarter) })).toBeNull();

    // Personalisation follows the chosen interest, not the score.
    const tools = interests.find((x) => x.id === 'digital-tools')!;
    pick(tools.label.en);
    expect(screen.getByText(tools.heading.en)).toBeTruthy();
    click(new RegExp(en.showStarter));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(tools.starter.en)).toBeTruthy();
    click(zh.langName);
    expect(within(screen.getByRole('dialog')).getByText(tools.starter.zh)).toBeTruthy();
    click(zh.starterClose);
    click(en.langName);

    expect(screen.getByText(/A Very Short Introduction/)).toBeTruthy();

    // No programme link unless a verified URL is configured.
    expect(screen.queryByRole('link', { name: new RegExp(en.programmeLink) })).toBeNull();

    click(new RegExp(en.playAgain));
    expect(screen.getByRole('heading', { name: en.title })).toBeTruthy();
    click(new RegExp(en.start));
    expect(screen.getByText(rounds[0].title.en)).toBeTruthy();
    expect(screen.getAllByRole('radio').every((r) => !(r as HTMLInputElement).checked)).toBe(true);
  });

  it('keeping a correct first impression is recognised too', () => {
    render(<App />);
    click(new RegExp(en.start));
    const r = rounds[0];
    pick(en.impressions['seems-off']);
    click(new RegExp(en.toEvidence));
    pick(en.verdicts[r.correctVerdict]);
    pick(r.reasons.find((x) => x.id === r.correctReasonId)!.text.en);
    click(en.submit);
    expect(screen.getByText(en.keptJudgement)).toBeTruthy();
  });
});
