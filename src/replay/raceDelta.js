import { ghostAt } from './ghostAt.js';

/** Momento en que el fantasma llegó a `lines` líneas, o null si nunca llegó. */
export function ghostTimeFor(replay, lines) {
  const hit = replay.track.find((s) => s[1] >= lines);
  return hit ? hit[0] : null;
}

/**
 * Diferencia con el fantasma. En modos de tiempo: segundos de ventaja (negativo = vas por delante)
 * al llegar a tus líneas actuales. En modos de puntos: puntos de diferencia ahora mismo.
 */
export function raceDelta(g, replay) {
  if (g.hooks.record === 'score') return { kind: 'score', value: g.score - ghostAt(replay, g.time).score };
  if (!g.lines) return null;
  const t = ghostTimeFor(replay, g.lines);
  return t === null ? { kind: 'time', value: -Infinity } : { kind: 'time', value: g.time - t };
}
