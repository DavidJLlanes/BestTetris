import { map } from './mapState.js';
import { project } from './project.js';
import { TRAMOS } from '../tramos.js';
import { tramoStart, TRAMO_GAP, SPACING } from './layout.js';
import { getJourney } from '../progress/journeyStore.js';
import { totalStars } from '../progress/stars.js';

const P = {}, L = {}, R = {};
const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Al pasar de un tramo a otro: un arco de luz con el nombre del tramo y, si falta, las estrellas que pide. */
export function drawPortals(ctx) {
  const have = totalStars(getJourney());
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  TRAMOS.forEach((t, i) => {
    if (!i) return;
    const y = tramoStart(i) - TRAMO_GAP * 0.5 - SPACING * 0.35;
    project(0, y, P);
    if (P.y < 60 || P.y > map.h + 80) return;
    project(-230, y, L); project(230, y, R);
    const open = have >= t.gate;
    const fade = Math.min(1, Math.max(0, (P.y - 110) / 70)); // se apaga al pasar bajo el marcador de arriba
    const g = ctx.createLinearGradient(L.x, 0, R.x, 0);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.5, open ? t.nebula[0] : 'rgba(170,180,255,0.5)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 2.2 * P.s;
    ctx.globalAlpha = 0.8 * fade;
    ctx.beginPath(); ctx.ellipse(P.x, P.y, (R.x - L.x) / 2, 16 * P.s, 0, Math.PI, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 0.9 * fade;
    ctx.font = `800 ${Math.round(13 * P.s)}px ${FONT}`;
    ctx.fillStyle = open ? '#fff' : 'rgba(220,225,255,0.75)';
    ctx.fillText(t.name.toUpperCase().split('').join(' '), P.x, P.y + 14 * P.s);
    if (!open) {
      ctx.font = `800 ${Math.round(12 * P.s)}px ${FONT}`;
      ctx.fillStyle = '#ffd34f';
      ctx.fillText(`★ ${have} / ${t.gate} para cruzar`, P.x, P.y + 33 * P.s);
    }
  });
  ctx.restore();
}
