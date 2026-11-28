import { map } from '../mapState.js';
import { SPACING } from '../layout.js';
import { shipPos } from '../shipPos.js';

/** Mientras la nave vuela, la cámara la acompaña con su muelle (salvo que arrastres el mapa). */
export function followShip() {
  const s = map.ship;
  if (!s.from || s.t >= 1 || map.cam.drag) return;
  const p = shipPos();
  if (p) map.cam.target = p.y + SPACING * 0.12;
}
