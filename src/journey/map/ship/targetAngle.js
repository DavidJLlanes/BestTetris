import { project } from '../project.js';
import { shipPos } from '../shipPos.js';

const A = {}, B = {};

/** Hacia dónde debe mirar la nave en pantalla (0 = arriba): la tangente del trayecto mientras vuela. */
export function targetAngle() {
  const p = shipPos();
  if (!p || p.flying <= 0.001) return 0;
  project(p.x, p.y, A); project(p.x + p.dx * 6, p.y + p.dy * 6, B);
  const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
  const vx = ((B.x - A.x) / len) * p.flying, vy = ((B.y - A.y) / len) * p.flying - (1 - p.flying);
  return Math.atan2(vx, -vy);
}
