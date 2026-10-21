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

export const config = {
  programmeUrl: verifiedUrl(import.meta.env.VITE_PROGRAMME_URL || PROGRAMME_URL),
};
