import { on } from '../bus.js';
import { app } from '../state.js';
import { HIDDEN } from '../../config/board.js';
import { COLORS } from '../../config/colors.js';
import { spawnParticles } from '../../effects/spawnParticles.js';
import { floatText } from '../../effects/floatText.js';
import { impact } from '../../effects/impact.js';
import { fx } from '../../effects/state.js';
import { playSfx } from '../../audio/index.js';
import { rumble } from '../../input/gamepad/rumble.js';
import { vibrate } from '../../input/haptics.js';

/** Bomba: estallido de chispas con el color de cada bloque destruido, temblor y destello. */
export function bombReactions() {
  on('bomb', ({ x, y, hit }) => {
    spawnParticles(x + 0.5, y - HIDDEN + 0.5, '#ff3355', 26, { speed: 9, life: 0.7, size: 3 });
    for (const [hx, hy, type] of hit) spawnParticles(hx + 0.5, hy - HIDDEN + 0.5, (COLORS[type] || COLORS.X)[0], 5, { speed: 6, life: 0.6, size: 2.5 });
    fx.levelFlash = Math.max(fx.levelFlash, 0.5);
    impact(10, app.settings.shake);
    fx.shake = Math.max(fx.shake, app.settings.shake ? 8 : 0);
    playSfx('bomb');
    rumble(0.9, 250);
    vibrate([30, 20, 40]);
    floatText('¡BUM!', hit.length > 1 ? `${hit.length - 1} bloques` : '', '#ff3355', 1.1);
  });
}
