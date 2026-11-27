import { fx } from '../../effects/state.js';
import { view } from '../view.js';

const COUNT = 22;
let last = 0;

/** Cómo se mueve y se dibuja cada tipo de partícula de ambiente (en celdas por segundo). */
const KINDS = {
  petal: { vy: 0.9, sway: 0.8, size: 0.16, shape: 'oval' },
  firefly: { vy: -0.25, sway: 0.5, size: 0.09, shape: 'glow' },
  leaf: { vy: 1.4, sway: 1.2, size: 0.2, shape: 'oval' },
  snow: { vy: 0.7, sway: 0.4, size: 0.1, shape: 'dot' },
};

function seed(p, top) {
  p.x = Math.random() * 10; p.y = top ? -0.5 : Math.random() * 20;
  p.ph = Math.random() * 6.28; p.k = 0.6 + Math.random() * 0.8;
  return p;
}

/** Pétalos, luciérnagas, hojas o nieve flotando sobre el tablero, muy suaves para no molestar. */
export function drawAmbient(ctx, now) {
  const a = fx.ambient;
  const dt = Math.min(0.05, (now - last) / 1000 || 0);
  last = now;
  if (!a) return;
  if (!a.parts) a.parts = Array.from({ length: COUNT }, () => seed({}, false));
  const k = KINDS[a.kind], c = view.cell;
  a.fade = Math.min(1, (a.fade || 0) + dt * 0.7);
  ctx.save();
  ctx.fillStyle = a.color;
  for (const p of a.parts) {
    p.ph += dt * 1.6 * p.k;
    p.y += k.vy * p.k * dt;
    p.x += Math.sin(p.ph) * k.sway * dt;
    if (p.y > 20.5 || p.y < -1) seed(p, k.vy > 0);
    if (k.vy < 0 && p.y < -0.5) p.y = 20.5;
    const x = p.x * c, y = p.y * c, s = k.size * c * p.k;
    ctx.globalAlpha = a.fade * (k.shape === 'glow' ? 0.35 + 0.35 * Math.sin(p.ph * 2) : 0.4);
    ctx.beginPath();
    if (k.shape === 'oval') ctx.ellipse(x, y, s, s * 0.55, p.ph, 0, 6.283);
    else ctx.arc(x, y, s, 0, 6.283);
    ctx.fill();
  }
  ctx.restore();
}
