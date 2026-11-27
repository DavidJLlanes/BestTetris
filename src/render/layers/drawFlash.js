import { fx } from '../../effects/state.js';
import { view } from '../view.js';

/** Destello verde al subir de nivel. */
export function drawFlash(ctx) {
  if (fx.levelFlash <= 0) return;
  ctx.fillStyle = `rgba(92,255,157,${fx.levelFlash * 0.15})`;
  ctx.fillRect(0, 0, view.width, view.height);
}
