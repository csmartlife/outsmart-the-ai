# Can You Outsmart the AI?

A mobile-first, bilingual (English / 繁體中文) evidence-checking game for an HKU Information Day BSIM presentation. Three rounds, about 3–4 minutes. No live AI, no accounts, and only anonymous play counts.

> All scenarios and evidence are fictional teaching examples. AI responses are prepared examples. No live AI is running.

## How the game is put together

```
src/
  content/
    rounds.ts      ← THE SCENARIOS: questions, AI responses, evidence, answers, feedback, interests
    ui.ts          ← all interface text (buttons, labels, messages) in en + zh
    types.ts       ← shapes of the content (Localized = { en, zh })
  config.ts        ← official programme link (hidden while empty)
  game/state.ts    ← game rules: reducer, scoring, "did the first impression match?"
  components/      ← screens: Welcome, RoundScreen, Feedback, Ending, StarterDialog, …
  styles.css       ← all styling (colour tokens at the top, dark mode, reduced motion)
```

**Flow:** Welcome → optional nickname → for each round: first impression (unscored) → evidence cards + verdict + reason → submit → feedback → … → recap → pick an interest → suggested topic + conversation-starter card → Finish → celebration page.

**Rules that matter:**
- Scoring compares stable IDs (`correctVerdict`, `correctReasonId`), never text or position. Verdict = 2, reason = 1, max 9.
- The score is calculated from the submitted answers every time, never added up, so double taps can't add points. Answers lock once submitted.
- Language lives outside the game state, so switching keeps progress, selections and opened cards.
- Everything is in memory. Refreshing restarts. "Play again" resets everything.

## Run locally

Requires Node 18+.

```bash
npm install
npm run dev        # http://localhost:5173 (add --host to test from a phone on the same Wi-Fi)
npm test           # unit + play-through tests
npm run build      # static site in dist/
```

## Deploy

### Cloudflare
Either route works. Cloudflare's **Create** button now starts a *Worker* by default; that route uses `wrangler.jsonc` in this repo, which tells `npx wrangler deploy` to serve the built `dist/` folder.

**Workers (default Create flow):** Workers & Pages → Create → Import a repository → `outsmart-the-ai`. Build command `npm run build`, deploy command `npx wrangler deploy` (the default).

**Pages:** Workers & Pages → Create → Pages tab → Connect to Git, then use:

| Setting | Value |
|---|---|
| Framework preset | None (or Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | from `.node-version` (22) |

Every push to `main` redeploys automatically. To show the programme link button, add the environment variable `VITE_PROGRAMME_URL` in the Pages project settings, then redeploy.

### Other hosts

`npm run build` makes a plain static site in `dist/` (relative paths, so it works in any folder). Upload `dist/` to any static host, e.g. GitHub Pages, Netlify, Cloudflare Pages, Vercel, or a university web server. Then make a QR code that points to the URL.

For a USB stick or a kiosk laptop with no internet, use `npm run build:single`. It creates one self-contained file, `dist-single/index.html`, that opens directly in a browser.

The game uses no remote fonts or external assets. Apart from three tiny anonymous counts per game (below), it makes no network requests after loading, and it keeps working if those fail.

## Play counts (how many people played)

The Cloudflare Worker in `worker/index.ts` keeps anonymous totals in a Durable Object:

- **Games started**: counted when round 1 begins
- **Games finished**: counted when the recap appears
- **Topic chosen**: which of the three interests players picked
- The same totals for each day (Hong Kong time)

**To view them**, open `https://<your-site>/stats`. It refreshes every 30 seconds. Raw JSON is at `/api/stats`.

**What is not collected:** nicknames, answers, scores, IP addresses, cookies and device IDs. The nickname stays in the player's browser memory and is never sent.

**Caveats**
- Anyone could send fake counts to `/api/event`, so treat the numbers as a good estimate rather than an audit.
- The stats page is public to anyone who knows the address. To make it private, protect `/stats` and `/api/stats` with Cloudflare Access (Zero Trust).
- **To switch counting off,** set `COUNT_PLAYS = false` in `src/config.ts`, or build with `VITE_COUNT_PLAYS=false`. The offline single-file build never counts.
- **To reset the counts,** rename the counter in `worker/index.ts` (`idFromName('global')` → for example `'global-2027'`).

## Editing guide

### Change a scenario
Edit `src/content/rounds.ts`. Every visible string is `{ en: '…', zh: '…' }`.
- Reword anything freely. Keep `id` values stable, or update `correctReasonId` to match.
- `correctVerdict` must be `'supported'`, `'contradicted'` or `'insufficient'`.
- Reasons are shown in the order listed. Reordering them doesn't affect scoring.
- `tip` is shown in the recap when a round isn't fully matched. `caution` (optional) appears under the feedback.
- `npm test` checks that every string has both languages and that each `correctReasonId` exists.

### Change interface text or translations
Edit `src/content/ui.ts`. The `zh` object must have every key that `en` has, and TypeScript will flag any key that's missing.

### Add the official programme link
It's hidden until you add a URL. In `src/config.ts`, set:
```ts
const PROGRAMME_URL = 'https://…your verified URL…';
```
or build with `VITE_PROGRAMME_URL="https://…" npm run build`. Only `https://` links are accepted. The button text is `programmeLink` in `ui.ts`.

### Branding
There are no logos. The programme is named only in a text heading (`programmeContext` in `ui.ts`). To add official assets, put them in `public/` and reference them in `Welcome.tsx`. Colours are CSS variables at the top of `styles.css` (`--accent` is the single accent colour).

## Test checklist

### Already run
- [x] TypeScript strict build passes; production build succeeds.
- [x] Unit tests (vitest): all correct = 9/9; all wrong = 0; verdict-only = 2 and reason-only = 1 each time; first impression never changes points; repeated submit adds nothing; answers lock after submit; answers can be revised before submit; can't submit or advance without both choices; opening cards earns nothing; restart resets to initial state; every string exists in en + zh; each correct reason ID exists.
- [x] Play-through test (jsdom): full game; evidence opened in reverse order; language switched mid-round keeps the verdict, opened cards and round; "Good update" and "kept judgement" messages; personalisation follows the chosen interest; starter card opens and switches language; no programme link while unset; Play again clears answers.
- [x] Local Worker (`wrangler dev`): `/api/event` counts start/finish/topic and rejects unknown events (400) and GET (405); `/api/stats` totals match; `/stats` page loads; `wrangler deploy --dry-run` accepts the config. A full browser play-through sends exactly 3 counts per game.
- [x] Headless Chromium at 360 × 740, keyboard only (Tab / arrows / Space / Enter / Esc), English light mode and 繁中 dark mode, reduced motion: reached 9/9; no horizontal scroll on any screen; only the 3 anonymous count requests after first load; no console errors; focus returns to the trigger after closing the starter card; `<html lang>` switches to `zh-Hant-HK`.

### Still to check
- [ ] After Cloudflare redeploys: play one game on the live site, then open `/stats` and check that it shows 1 started and 1 finished.
- [ ] Real phones: iOS Safari and Android Chrome, scanning the actual QR code on venue Wi-Fi.
- [ ] Screen readers: VoiceOver (iOS) and TalkBack (Android). Check the step announcements, the radio groups and the feedback heading.
- [ ] A native Hong Kong Chinese speaker proofreads the 繁中 text, especially the title 「你能比 AI 更醒目嗎？」.
- [ ] Staff confirm the programme heading wording and the three conversation starters before the event.
- [ ] Add and test the official programme URL if you want the button.
- [ ] Play time with two or three real students (target: 3–4 minutes).
- [ ] Projector or large-screen readability, if you'll demo it live.

## Optional enhancements (not built)
QR code on the welcome screen for sharing; a print-friendly starter card; more scenario packs. Leaderboards, multiplayer and presenter dashboards were left out on purpose.
