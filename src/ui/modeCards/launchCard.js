import { vibrate } from '../../input/haptics.js';

const LAUNCH_MS = 170;
let busy = false;

/**
 * Pulsar una tarjeta: se hunde con un aro de luz de su color y vibra; justo después empieza la
 * partida (el menú se funde con su propia transición, sin destellos).
 */
export function launchCard(card, go) {
  if (busy) return;
  busy = true;
  vibrate(14);
  card.classList.add('launch');
  setTimeout(() => {
    busy = false;
    go();
    setTimeout(() => card.classList.remove('launch'), 450);
  }, LAUNCH_MS);
}
