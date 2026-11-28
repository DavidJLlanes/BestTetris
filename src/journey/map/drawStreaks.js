import { map } from './mapState.js';

/** De vez en cuando una estrella fugaz cruza el fondo en diagonal. */
export function drawStreaks(ctx, dt) {
  if (Math.random() < dt * 0.25) {
    const fromLeft = Math.random() < 0.5;
    map.streaks.push({ x: fromLeft ? -40 : map.w + 40, y: Math.random() * map.h * 0.6, vx: (fromLeft ? 1 : -1) * (500 + Math.random() * 300), vy: 160 + Math.random() * 120, life: 1.2 });
  }
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  map.streaks = map.streaks.filter((s) => {
    s.life -= dt; s.x += s.vx * dt; s.y += s.vy * dt;
    if (s.life <= 0) return false;
    const tail = 0.12, a = Math.min(1, s.life * 2);
    const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * tail, s.y - s.vy * tail);
    g.addColorStop(0, `rgba(255,255,255,${0.9 * a})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * tail, s.y - s.vy * tail); ctx.stroke();
    return true;
  });
  ctx.restore();
}
