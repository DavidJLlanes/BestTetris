import { map } from './mapState.js';
import { project } from './project.js';

const A = {}, B = {};

/** Un trozo del camino entre dos puntos ya proyectados, con el grosor de su profundidad. */
function seg(ctx, a, b, width) { ctx.lineWidth = width * (a.s + b.s) * 0.5; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }

/**
 * El camino de luz entre constelaciones. Lo recorrido brilla (halo ancho + hilo blanco con
 * energía que fluye hacia delante); lo que falta es una línea de puntos tenue.
 */
export function drawPath(ctx) {
  const pts = map.path, lit = map.lit;
  ctx.save();
  ctx.lineCap = 'round';
  for (let pass = 0; pass < 3; pass++) {
    if (pass === 0) { ctx.strokeStyle = 'rgba(160,190,255,0.22)'; ctx.setLineDash([]); }
    if (pass === 1) { ctx.strokeStyle = 'rgba(255,236,190,0.9)'; ctx.setLineDash([]); }
    if (pass === 2) { ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.setLineDash([3, 22]); ctx.lineDashOffset = -map.time * 60; }
    for (let i = 0; i < pts.length - 1; i++) {
      const p = pts[i], q = pts[i + 1];
      const on = q.seg <= lit + 1e-6;
      if (pass === 0 && on) continue; // el halo tenue solo va por lo que falta
      if (pass > 0 && !on) continue;
      project(p.x, p.y, A); project(q.x, q.y, B);
      if ((A.y < -60 && B.y < -60) || (A.y > map.h + 60 && B.y > map.h + 60)) continue;
      seg(ctx, A, B, pass === 0 ? 5 : pass === 1 ? 4.2 : 2.2);
    }
  }
  // Por encima del hilo dorado, un halo ancho y suave para que el camino recorrido brille
  ctx.globalCompositeOperation = 'lighter';
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(255,200,120,0.16)';
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i], q = pts[i + 1];
    if (q.seg > lit + 1e-6) break;
    project(p.x, p.y, A); project(q.x, q.y, B);
    if ((A.y < -60 && B.y < -60) || (A.y > map.h + 60 && B.y > map.h + 60)) continue;
    seg(ctx, A, B, 16);
  }
  ctx.restore();
}

/** Desvíos (constelaciones ocultas y planetas tienda): una línea de puntos que se enciende al abrirse. */
export function drawSpurs(ctx, isOpen) {
  ctx.save();
  ctx.lineCap = 'round';
  for (const n of map.nodes) {
    if (!n.from) continue;
    const f = map.byId[n.from];
    project(f.x, f.y, A); project(n.x, n.y, B);
    if ((A.y < -60 && B.y < -60) || (A.y > map.h + 60 && B.y > map.h + 60)) continue;
    const open = isOpen(n);
    ctx.strokeStyle = open ? 'rgba(255,236,190,0.8)' : 'rgba(170,180,255,0.28)';
    ctx.setLineDash(open ? [] : [2, 9]);
    const mx = (A.x + B.x) / 2 + (B.y - A.y) * 0.18, my = (A.y + B.y) / 2 - (B.x - A.x) * 0.18;
    ctx.lineWidth = 3 * (A.s + B.s) * 0.5;
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.quadraticCurveTo(mx, my, B.x, B.y); ctx.stroke();
  }
  ctx.restore();
}
