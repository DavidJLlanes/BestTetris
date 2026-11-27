import { seededRandom } from '../../util/seededRandom.js';
import { RECORD_KINDS } from '../../modes/recordKinds.js';

/** El modo del reto: el mismo modo con las mismas piezas y la marca rival en el marcador. */
export function makeChallengeMode(base, ch) {
  const kind = RECORD_KINDS[base.record];
  return {
    ...base,
    createRng: () => seededRandom(ch.seed),
    challenge: ch,
    bestLabel: () => `🎯 ${kind.format(ch.value)}`,
  };
}
