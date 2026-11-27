import { app } from '../../app/state.js';
import { pad } from './state.js';

/** Vibración del mando (0..1) durante `ms` milisegundos. */
export function rumble(strength, ms) {
  if (!app.settings.haptics || pad.index === null || !navigator.getGamepads) return;
  const gp = navigator.getGamepads()[pad.index];
  const act = gp && gp.vibrationActuator;
  if (!act || !act.playEffect) return;
  act.playEffect('dual-rumble', { duration: ms, strongMagnitude: strength, weakMagnitude: Math.min(1, strength * 0.7) }).catch(() => {});
}
