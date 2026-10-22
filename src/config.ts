/**
 * SITE SETTINGS
 *
 * Official programme link: left empty on purpose, so the button stays hidden.
 * Add a URL you have verified yourself, either here or at build time with
 *   VITE_PROGRAMME_URL="https://..." npm run build
 * Only https:// links are shown.
 */
const PROGRAMME_URL = '';

function verifiedUrl(raw: string | undefined): string | null {
  const value = (raw ?? '').trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

/**
 * Anonymous play counter (see worker/index.ts). On by default for the deployed site;
 * off for the offline single-file build, in tests, or with VITE_COUNT_PLAYS=false.
 */
const COUNT_PLAYS = true;

export const config = {
  programmeUrl: verifiedUrl(import.meta.env.VITE_PROGRAMME_URL || PROGRAMME_URL),
  countPlays:
    COUNT_PLAYS &&
    import.meta.env.MODE !== 'single' &&
    import.meta.env.MODE !== 'test' &&
    import.meta.env.VITE_COUNT_PLAYS !== 'false',
};
