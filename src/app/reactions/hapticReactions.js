import { on } from '../bus.js';
import { app } from '../state.js';
import { vibrate } from '../../input/haptics.js';
import { vibrateOnBeat } from '../../input/vibrateOnBeat.js';
import { rumble } from '../../input/gamepad/rumble.js';

/**
 * Respuesta háptica distinta para cada jugada (móvil y mando), proporcional a su fuerza.
 * Con efectos musicales, los golpes de líneas y combos caen a ritmo con la canción.
 */
export function hapticReactions() {
  const beat = (pulses) => (app.settings.musical ? vibrateOnBeat(pulses) : vibrate(pulses.length === 1 ? pulses[0] : pulses));
  on('rotate', () => vibrate(3));
  on('hold', () => vibrate(6));
  on('hardDrop', ({ distance }) => { rumble(Math.min(0.6, 0.2 + distance * 0.02), 60); vibrate(Math.min(22, 8 + distance)); });
  on('lock', ({ hard }) => { if (!hard) { rumble(0.1, 30); vibrate(5); } });
  on('clear', ({ rows }) => {
    if (rows.length >= 4) { rumble(0.9, 260); beat([20, 20, 30, 45]); }
    else { rumble(0.25 + rows.length * 0.1, 90); beat(Array.from({ length: rows.length }, (_, i) => 10 + i * 6)); }
  });
  on('score', ({ combo }) => { if (combo > 1) beat(Array.from({ length: Math.min(combo, 5) }, () => 8)); });
  on('levelUp', () => { rumble(0.5, 150); vibrate([15, 40, 15]); });
  on('finish', ({ win }) => { rumble(win ? 0.6 : 0.8, win ? 200 : 400); vibrate(win ? [20, 50, 20, 50, 40] : 120); });
}
