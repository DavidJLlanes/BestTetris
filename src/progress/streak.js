import { dateKey } from './dateKey.js';

/**
 * Racha de días seguidos jugando que termina hoy o ayer (si hoy aún no has jugado, no se pierde),
 * y la mejor racha de todas. days: { "AAAA-MM-DD": {...} }.
 */
export function streak(days, today = new Date()) {
  const has = (d) => !!days[dateKey(d)];
  const day = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  let cur = 0;
  let d = has(today) ? today : day(today, -1);
  while (has(d)) { cur++; d = day(d, -1); }
  const keys = Object.keys(days).sort();
  let best = 0, run = 0, prev = null;
  for (const k of keys) {
    const dt = new Date(`${k}T12:00:00`);
    run = prev && Math.round((dt - prev) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = dt;
  }
  return { current: cur, best: Math.max(best, cur), playedToday: has(today) };
}
