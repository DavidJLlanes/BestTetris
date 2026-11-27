import { QUALITY } from '../config/decor.js';
import { decor } from './state.js';

/**
 * Polvo de luz: motas que suben despacio y parpadean, y algún destello en cruz.
 * Se dibuja a la resolución justa (las motas son suaves) y al ritmo de la calidad elegida.
 */
let ctx = null, motes = [], W = 0, H = 0, dpr = 1;
const sprite = (() => {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = c.height = 32;
  const g = c.getContext('2d'), r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(220,210,255,.6)'); r.addColorStop(1, 'rgba(200,180,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 32, 32);
  return c;
})();

const mote = (anywhere) => ({
  x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10,
  r: 1 + Math.random() * 2.6, vy: 6 + Math.random() * 16, vx: (Math.random() - 0.5) * 6,
  tw: Math.random() * Math.PI * 2, ts: 0.6 + Math.random() * 1.8, star: Math.random() < 0.08,
});

export function resetDust() {
  if (!ctx) { const c = document.getElementById('decor-dust'); if (!c) return; ctx = c.getContext('2d'); }
  const q = QUALITY[decor.quality];
  dpr = Math.min(q.dpr, window.devicePixelRatio || 1);
  W = innerWidth + 80; H = innerHeight + 80;
  ctx.canvas.width = Math.round(W * dpr); ctx.canvas.height = Math.round(H * dpr);
  motes = Array.from({ length: q.dust }, () => mote(true));
}

export function drawDust(dt, boost) {
  if (!ctx || !motes.length) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < motes.length; i++) {
    const m = motes[i];
    m.y -= m.vy * dt * (1 + boost * 2); m.x += m.vx * dt; m.tw += m.ts * dt;
    if (m.y < -10) motes[i] = mote(false);
    const a = (0.25 + 0.45 * (0.5 + 0.5 * Math.sin(m.tw))) * (0.7 + boost * 0.6);
    const s = m.r * (m.star ? 5 : 3);
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sprite, m.x - s, m.y - s, s * 2, s * 2);
    if (m.star) { // destello en cruz
      ctx.fillStyle = 'rgba(255,255,255,.7)';
      ctx.fillRect(m.x - s * 1.6, m.y - 0.5, s * 3.2, 1); ctx.fillRect(m.x - 0.5, m.y - s * 1.6, 1, s * 3.2);
    }
  }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
