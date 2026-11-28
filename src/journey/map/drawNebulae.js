import { map } from './mapState.js';
import { TRAMOS } from '../tramos.js';
import { tramoStart, SPACING } from './layout.js';
import { nebulaSprite } from './nebulaSprite.js';

const PAR = 0.55; // las nebulosas están lejos: se mueven más despacio que el camino
// Dos nubes por tramo, a los lados del camino, a distintas alturas
const SPOTS = [[-0.9, 1.2, 900], [0.85, 3.6, 760]];

/** Nebulosas de cada tramo, con su color, flotando detrás del camino. */
export function drawNebulae(ctx) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  TRAMOS.forEach((t, i) => {
    const sprite = nebulaSprite(t.nebula[0], t.nebula[1]);
    SPOTS.forEach(([sx, sy, size], k) => {
      const wy = tramoStart(i) + sy * SPACING;
      const y = map.anchorY - (wy - map.cam.y) * PAR * map.k * 0.8;
      const s = size * map.k;
      if (y + s / 2 < 0 || y - s / 2 > map.h) return;
      ctx.globalAlpha = 0.26 + 0.06 * Math.sin(map.time * 0.4 + i + k);
      ctx.drawImage(sprite, map.w / 2 + sx * map.w * 0.42 - s / 2, y - s / 2, s, s);
    });
  });
  ctx.restore();
}
