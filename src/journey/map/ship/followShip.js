import { map } from '../mapState.js';
import { SPACING } from '../layout.js';
import { shipPos } from '../shipPos.js';
import { COS } from '../project.js';
import { hoverRadius } from './hoverRadius.js';

const FOLLOW = 9; // rapidez con que la cámara alcanza a la nave

/**
 * Mientras la nave vuela, la cámara la acompaña con su muelle (salvo que arrastres el mapa).
 * Descuenta lo que la nave baja de su vuelo sobre la parada al camino: así en pantalla la nave
 * se queda a la misma altura y es el mapa el que se desliza, sin baches.
 */
export function followShip(dt) {
  const s = map.ship;
  if (!s.from || s.t >= 1 || map.cam.drag) return;
  const p = shipPos();
  if (!p) return;
  const hoverWorld = (hoverRadius(p.progress) + 26) / COS;
  let target = p.y + SPACING * 0.12 - hoverWorld * p.flying;
  // la cámara nunca retrocede en mitad del vuelo (el mapa no va y vuelve)
  const dir = Math.sign(map.byId[s.id].y - map.byId[s.from].y) || 1;
  if (s.camMark !== undefined && (target - s.camMark) * dir < 0) target = s.camMark;
  s.camMark = target;
  const c = map.cam;
  c.target = null; // durante el vuelo manda este seguimiento, no el muelle de las paradas
  c.v = 0;
  c.y += (target - c.y) * (1 - Math.exp(-FOLLOW * dt)); // filtro suave: va un pelín por detrás, sin rebotes
}
