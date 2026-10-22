import { config } from '../config';
import type { Interest } from '../content/types';

export type PlayEvent = { event: 'start' } | { event: 'finish' } | { event: 'interest'; interest: Interest };

/**
 * Adds one to an anonymous total on the server. Sends no nickname, answers, IDs or cookies.
 * Fire-and-forget: if the network is down or the API is missing, the game carries on.
 */
export function countPlay(payload: PlayEvent): void {
  if (!config.countPlays || typeof fetch !== 'function') return;
  try {
    fetch('/api/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => {});
  } catch {
    // Counting is optional; never interrupt play.
  }
}
