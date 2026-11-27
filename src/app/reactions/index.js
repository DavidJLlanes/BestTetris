import { on } from '../bus.js';
import { soundReactions } from './soundReactions.js';
import { effectReactions } from './effectReactions.js';
import { hapticReactions } from './hapticReactions.js';
import { motionReactions } from './motionReactions.js';
import { showToast } from '../../ui/toast.js';
import { undoReactions } from './undoReactions.js';
import { swayReactions } from './swayReactions.js';
import { bombReactions } from './bombReactions.js';
import { powerReactions } from './powerReactions.js';
import { seasonReactions } from '../../modes/seasons/seasonReactions.js';

/** Conecta los sucesos de la partida con sonido, imagen, vibración y avisos. */
export function wireReactions() {
  motionReactions();
  soundReactions();
  effectReactions();
  hapticReactions();
  undoReactions();
  seasonReactions();
  swayReactions();
  bombReactions();
  powerReactions();
  on('achievement', showToast);
}
