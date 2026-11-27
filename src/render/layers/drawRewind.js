import { fx } from '../../effects/state.js';
import { view } from '../view.js';
import { easeOutCubic } from '../../util/easing.js';

/** Barrido de luz que sube por el tablero al deshacer, como una cinta que se rebobina. */
export function drawRewind(ctx) {
  if (fx.rewind <= 0) return;
  const k = 1 - fx.rewind;
  const y = view.height * (1 - easeOutCubic(k));
  const band = view.height * 0.22;
  const grad = ctx.createLinearGradient(0, y - band, 0, y + band * 0.4);
  grad.addColorStop(0, 'rgba(70,230,255,0)');
  grad.addColorStop(0.75, `rgba(70,230,255,${0.32 * fx.rewind})`);
  grad.addColorStop(1, 'rgba(70,230,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, y - band, view.width, band * 1.4);
  ctx.fillStyle = `rgba(70,230,255,${0.07 * fx.rewind})`;
  ctx.fillRect(0, 0, view.width, view.height);
}
