import { gemSprite } from '../render/sprites/gemSprite.js';
import { glowSprite } from '../render/sprites/glowSprite.js';
import { COLORS } from '../config/colors.js';
import { decor } from '../decor/state.js';
import { musicPulse } from '../audio/index.js';

/** Pinta la escena: de lejos a cerca, con parallax según la profundidad y halo al disolverse. */
export function drawScene(s, time) {
  const { ctx, w, h, dpr } = s;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const beat = 1 + musicPulse() * 0.08;
  for (const p of s.pieces) {
    const cell = Math.round(8 + p.z * 14);
    const px = Math.round(cell * dpr);
    const sprite = gemSprite(p.type, px);
    const tilt = Math.sin(time * 0.9 + p.sway) * 0.35;
    const ox = (decor.px || 0) * 18 * p.z, oy = (decor.py || 0) * 12 * p.z;
    const alpha = (0.07 + p.z * 0.22) * p.fade; // discretas: el protagonista es el logotipo
    ctx.save();
    ctx.translate(p.x + ox, p.y + oy);
    ctx.rotate(p.rot);
    ctx.transform(1 - Math.abs(tilt) * 0.25, tilt * 0.2, 0, 1, 0, 0); // giro en profundidad
    ctx.scale(beat, beat);
    const half = (p.size * cell) / 2;
    if (p.fade < 1) { // se disuelve en luz
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = (1 - p.fade) * p.fade * 1.6 * p.z;
      const g = glowSprite(COLORS[p.type][0]), gs = p.size * cell * 2.4;
      ctx.drawImage(g, -gs / 2, -gs / 2, gs, gs);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = alpha;
    for (const [x, y] of p.cells) ctx.drawImage(sprite, x * cell - half, y * cell - half, cell, cell);
    ctx.restore();
  }
}
