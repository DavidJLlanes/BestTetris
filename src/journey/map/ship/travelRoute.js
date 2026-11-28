import { MAIN } from '../../catalog.js';
import { pathAt } from './pathAt.js';

const mainIndex = (id) => MAIN.findIndex((l) => l.id === id);
const SAMPLES = 48;

/** Puntos del trayecto entre dos paradas: por el camino si las dos están en él; si no, la misma curva del desvío. */
function routePoints(from, to) {
  const a = mainIndex(from.id), b = mainIndex(to.id);
  if (a >= 0 && b >= 0) return Array.from({ length: SAMPLES + 1 }, (_, i) => pathAt(a + (b - a) * (i / SAMPLES)));
  // Igual que drawSpurs (allí en pantalla, con y hacia abajo): control desplazado a un lado
  const mx = (from.x + to.x) / 2 - (to.y - from.y) * 0.18, my = (from.y + to.y) / 2 + (to.x - from.x) * 0.18;
  return Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const t = i / SAMPLES, k = 1 - t;
    return { x: k * k * from.x + 2 * k * t * mx + t * t * to.x, y: k * k * from.y + 2 * k * t * my + t * t * to.y };
  });
}

/** Trayecto con su longitud acumulada, para recorrerlo a velocidad real y no por tramos. */
export function travelRoute(from, to) {
  const pts = routePoints(from, to);
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return { pts, acc, len: acc[acc.length - 1] };
}
