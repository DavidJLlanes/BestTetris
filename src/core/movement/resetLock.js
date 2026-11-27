import { MAX_LOCK_RESETS } from '../../config/timing.js';
import { onGround } from './onGround.js';

/** Mover o girar en el suelo reinicia el retardo de bloqueo, con un límite de veces. */
export function resetLock(g) {
  if (onGround(g) && g.resets < MAX_LOCK_RESETS) { g.lockTimer = 0; g.resets++; }
}
