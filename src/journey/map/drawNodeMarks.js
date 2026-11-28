import { map } from './mapState.js';
import { roundRect } from '../../render/roundRect.js';
import { starPath } from '../../render/sprites/cosmic/base.js';

const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

function star(ctx, x, y, r, on) {
  starPath(ctx, x, y, r, r * 0.45);
  ctx.fillStyle = on ? '#ffd34f' : 'rgba(12,8,34,0.85)';
  ctx.fill();
  ctx.strokeStyle = on ? 'rgba(255,250,220,0.9)' : 'rgba(200,205,255,0.45)';
  ctx.lineWidth = Math.max(1, r * 0.18);
  ctx.stroke();
}

/** Lo que va encima del emblema: aro que late si es la elegida, estrellas, número o candado y nombre. */
export function drawNodeMarks(ctx, n, st, P, R) {
  const sel = map.sel === n.id;
  ctx.save();
  if (sel || (st.state === 'open' && n.kind !== 'shop')) {
    const beat = (map.time * (sel ? 1.4 : 0.9)) % 1;
    ctx.strokeStyle = sel ? `rgba(255,255,255,${0.85 * (1 - beat)})` : `rgba(255,236,190,${0.55 * (1 - beat)})`;
    ctx.lineWidth = Math.max(1.5, R * 0.07);
    ctx.beginPath(); ctx.arc(P.x, P.y, R * (1.08 + beat * 0.45), 0, Math.PI * 2); ctx.stroke();
  }
  const fs = Math.max(10, R * 0.36);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const badgeY = P.y + R * 0.98; // número (o candado) sobre el borde de abajo del disco
  if (n.level && st.state !== 'locked' && n.kind !== 'event') {
    const sr = Math.max(4.5, R * 0.2), gap = sr * 2.3;
    for (let i = 0; i < 3; i++) star(ctx, P.x + (i - 1) * gap, badgeY + fs * 0.55 + sr * 1.4 - (i === 1 ? sr * 0.45 : 0), sr, i < st.stars);
  }
  if (n.kind === 'boss') { ctx.font = `900 ${fs * 1.3}px ${FONT}`; ctx.fillStyle = st.state === 'locked' ? 'rgba(255,211,79,0.4)' : '#ffd34f'; ctx.fillText('♛', P.x, P.y - R - fs * 0.55); }
  const locked = st.state === 'locked';
  const label = n.kind === 'shop' ? (locked && !sel ? '' : n.planet.name) : locked ? '🔒︎' : n.level.num ? `${n.level.num}` : n.kind === 'hidden' ? '✧' : '';
  if (label) {
    const f = Math.max(10, fs * (n.kind === 'shop' ? 0.72 : 0.8));
    ctx.font = `800 ${f}px ${FONT}`;
    const w = Math.max(f * 1.7, ctx.measureText(label).width + f * 0.9), y = n.kind === 'shop' ? P.y + R * 1.25 : badgeY;
    ctx.fillStyle = locked ? 'rgba(20,16,44,0.92)' : 'rgba(12,8,34,0.92)';
    roundRect(ctx, P.x - w / 2, y - f * 0.62, w, f * 1.24, f * 0.62); ctx.fill();
    ctx.strokeStyle = locked ? 'rgba(170,175,230,0.35)' : 'rgba(255,236,190,0.6)';
    ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = locked ? 'rgba(220,225,255,0.7)' : '#fff';
    ctx.fillText(label, P.x, y + 0.5);
  }
  if (sel && n.level && map.zoom < 0.5) { // al acercarse a la ficha el nombre ya sale en ella
    ctx.font = `800 ${Math.max(12, fs * 0.95)}px ${FONT}`;
    const name = n.kind === 'hidden' && st.state === 'locked' ? 'Constelación oculta' : n.level.sky.name;
    const ny = badgeY + fs * 0.55 + Math.max(4.5, R * 0.2) * 3.6 + fs * 0.55;
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(3, fs * 0.32);
    ctx.strokeStyle = 'rgba(6,3,24,0.85)'; // contorno oscuro: se lee aunque pase el camino por detrás
    ctx.strokeText(name, P.x, ny);
    ctx.fillStyle = '#fff';
    ctx.fillText(name, P.x, ny);
  }
  ctx.restore();
}
