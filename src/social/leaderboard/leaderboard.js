import { RECORD_KINDS } from '../../modes/recordKinds.js';
import { dateKey } from '../../progress/dateKey.js';

const TOP = 5;
const DAY_MS = 864e5;

/** ¿Entra la partida (marca de tiempo) en el periodo? 'day' = hoy, 'week' = últimos 7 días. */
export function inPeriod(ts, period, now = Date.now()) {
  if (period === 'day') return dateKey(new Date(ts)) === dateKey(new Date(now));
  return now - ts < 7 * DAY_MS;
}

/**
 * Clasificación local de un modo en un periodo, a partir del historial de partidas.
 * Solo partidas limpias (sin deshacer) y, en modos contrarreloj, terminadas.
 */
export function leaderboard(history, mode, period, now = Date.now()) {
  const kind = RECORD_KINDS[mode.record];
  if (!kind) return [];
  return history
    .filter((r) => r[1] === mode.id && !r[6] && inPeriod(r[0], period, now) && (!kind.won || r[5]))
    .map((r) => ({ value: mode.record === 'time' ? r[4] : mode.record === 'lines' ? r[3] : r[2], ts: r[0], name: r[7] || '' }))
    .filter((e) => e.value)
    .sort((a, b) => (kind.better(a.value, b.value) ? -1 : kind.better(b.value, a.value) ? 1 : a.ts - b.ts))
    .slice(0, TOP);
}
