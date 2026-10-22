/**
 * Cloudflare Worker: serves the game (static files in ./dist) and keeps
 * anonymous play counts in a single Durable Object.
 *
 *   POST /api/event   { "event": "start" | "finish" }  or  { "event": "interest", "interest": "data" }
 *   GET  /api/stats   -> { totals, interests, days }
 *
 * Nothing personal is stored: no nickname, answers, IP address, cookies or device IDs.
 * Only whole-number totals, plus a per-day total (Hong Kong time).
 */
import { DurableObject } from 'cloudflare:workers';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  COUNTER: DurableObjectNamespace<PlayCounter>;
}

const INTERESTS = new Set(['trustworthy-info', 'data', 'digital-tools']);

export class PlayCounter extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS counts (key TEXT PRIMARY KEY, n INTEGER NOT NULL)');
  }

  bump(keys: string[]): void {
    for (const key of keys) {
      this.ctx.storage.sql.exec(
        'INSERT INTO counts (key, n) VALUES (?, 1) ON CONFLICT(key) DO UPDATE SET n = n + 1',
        key,
      );
    }
  }

  all(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const row of this.ctx.storage.sql.exec<{ key: string; n: number }>('SELECT key, n FROM counts')) {
      out[row.key] = row.n;
    }
    return out;
  }
}

function hongKongDate(): string {
  // en-CA formats as YYYY-MM-DD
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Hong_Kong' });
}

function keysFor(body: unknown): string[] | null {
  if (!body || typeof body !== 'object') return null;
  const { event, interest } = body as { event?: unknown; interest?: unknown };
  const day = hongKongDate();
  if (event === 'start') return ['started', `day:${day}:started`];
  if (event === 'finish') return ['finished', `day:${day}:finished`];
  if (event === 'interest' && typeof interest === 'string' && INTERESTS.has(interest)) return [`interest:${interest}`];
  return null;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const counter = () => env.COUNTER.get(env.COUNTER.idFromName('global'));

    if (url.pathname === '/api/event') {
      if (request.method !== 'POST') return json({ error: 'Use POST' }, 405);
      const keys = keysFor(await request.json().catch(() => null));
      if (!keys) return json({ error: 'Unknown event' }, 400);
      await counter().bump(keys);
      return new Response(null, { status: 204 });
    }

    if (url.pathname === '/api/stats') {
      const raw = await counter().all();
      const days: Record<string, { started: number; finished: number }> = {};
      const interests: Record<string, number> = { 'trustworthy-info': 0, data: 0, 'digital-tools': 0 };
      for (const [key, n] of Object.entries(raw)) {
        const day = /^day:(\d{4}-\d{2}-\d{2}):(started|finished)$/.exec(key);
        if (day) (days[day[1]] ??= { started: 0, finished: 0 })[day[2] as 'started' | 'finished'] = n;
        else if (key.startsWith('interest:')) interests[key.slice(9)] = n;
      }
      return json({ totals: { started: raw.started ?? 0, finished: raw.finished ?? 0 }, interests, days });
    }

    return env.ASSETS.fetch(request);
  },
};
