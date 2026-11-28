import { map } from './mapState.js';

/** Lanza n chispas desde (x, y) en pantalla. */
export function burst(x, y, n, colors, speed = 220, size = 2.6) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = speed * (0.3 + Math.random() * 0.9);
    const life = 0.6 + Math.random() * 0.8;
    map.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life, max: life, r: size * (0.5 + Math.random()), c: colors[i % colors.length] });
  }
}

/** Mueve y dibuja las chispas (se frenan y se apagan solas). */
export function drawParticles(ctx, dt) {
  if (!map.parts.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const drag = Math.exp(-2.4 * dt);
  map.parts = map.parts.filter((p) => {
    p.life -= dt;
    if (p.life <= 0) return false;
    p.vx *= drag; p.vy = p.vy * drag + 30 * dt;
    p.x += p.vx * dt; p.y += p.vy * dt;
    ctx.globalAlpha = Math.min(1, (p.life / p.max) * 1.4);
    ctx.fillStyle = p.c;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    return true;
  });
  if (map.parts.length > 400) map.parts.splice(0, map.parts.length - 400);
  ctx.restore();
}
