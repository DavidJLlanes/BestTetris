import { fx } from '../../effects/state.js';
import { view } from '../view.js';

/** Escarcha azulada en los bordes del tablero mientras dura Congelar. */
export function drawFrost(ctx, now) {
  if (!fx.freeze) return;
  const w = view.width, h = view.height, pulse = 0.75 + 0.25 * Math.sin(now / 300);
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, 'rgba(143,211,255,0)');
  g.addColorStop(1, `rgba(143,211,255,${0.35 * pulse})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}
