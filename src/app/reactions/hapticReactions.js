import { on } from '../bus.js';
import { vibrate } from '../../input/haptics.js';
import { rumble } from '../../input/gamepad/rumble.js';

/** Respuesta háptica proporcional a la fuerza de cada suceso (móvil y mando). */
export function hapticReactions() {
  on('hardDrop', ({ distance }) => { rumble(Math.min(0.6, 0.2 + distance * 0.02), 60); });
  on('lock', ({ hard }) => { if (!hard) { rumble(0.1, 30); vibrate(5); } });
  on('clear', ({ rows }) => {
    if (rows.length >= 4) { rumble(0.9, 260); vibrate([20, 30, 40]); }
    else { rumble(0.25 + rows.length * 0.1, 90); vibrate(10 + rows.length * 5); }
  });
  on('levelUp', () => { rumble(0.5, 150); vibrate([15, 40, 15]); });
  on('finish', ({ win }) => { rumble(win ? 0.6 : 0.8, win ? 200 : 400); vibrate(win ? [20, 50, 20, 50, 40] : 120); });
}
