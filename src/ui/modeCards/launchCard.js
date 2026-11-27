import { vibrate } from '../../input/haptics.js';

const LAUNCH_MS = 230;
let busy = false;

/**
 * Pulsar una tarjeta: se hunde, destella con el color del modo, vibra y el resto del menú se
 * aparta; justo después empieza la partida (la pantalla se funde con su propia transición).
 */
export function launchCard(card, go) {
  if (busy) return;
  busy = true;
  vibrate(14);
  card.classList.add('launch');
  card.closest('.mode-grid').classList.add('launching');
  setTimeout(() => {
    busy = false;
    go();
    setTimeout(() => { card.classList.remove('launch'); card.closest('.mode-grid').classList.remove('launching'); }, 450);
  }, LAUNCH_MS);
}
