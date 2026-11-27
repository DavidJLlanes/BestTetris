import { on } from '../bus.js';
import { fx } from '../../effects/state.js';
import { floatText } from '../../effects/floatText.js';
import { snapMotion } from '../../render/motion/snapMotion.js';
import { playSfx } from '../../audio/index.js';
import { vibrate } from '../../input/haptics.js';
import { rumble } from '../../input/gamepad/rumble.js';
import { formatNumber } from '../../util/formatNumber.js';

/** Deshacer: barrido de rebobinado, sonido inverso, pieza de vuelta arriba y coste a la vista. */
export function undoReactions() {
  on('undo', ({ piece, cost, left }) => {
    fx.rewind = 1;
    fx.lockFlash = null;
    fx.rowOffsets = [];
    fx.trails = [];
    snapMotion(piece);
    playSfx('undo');
    vibrate([8, 30, 8]);
    rumble(0.3, 90);
    const rest = Number.isFinite(left) ? `quedan ${left}` : '';
    floatText(cost ? `−${formatNumber(cost)}` : 'DESHECHO', rest, '#46e6ff', 0.8);
  });
}
