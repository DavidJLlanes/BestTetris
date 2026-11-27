import { RECORD_KINDS } from '../../modes/recordKinds.js';

/** Modos que admiten reto: con marca, sin semilla propia (el diario ya es igual para todos). */
export const canChallengeMode = (m) => !!m && !m.noRecord && !m.createRng && !m.puzzle && !!RECORD_KINDS[m.record];

/** Valor de la partida como reto, o null si no vale (deshacer, objetivo sin cumplir...). */
export function challengeValue(g) {
  const kind = RECORD_KINDS[g.hooks.record];
  if (g.seed == null || g.stats.undos || !kind || (kind.won && !g.won)) return null;
  return kind.value(g) || null;
}
