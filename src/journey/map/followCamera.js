import { map } from './mapState.js';
import { project } from './project.js';

const A = {};

/**
 * Las chispas se dibujan en pantalla: cuando la cámara se mueve, se desplazan con el mundo
 * para que la estela quede donde la soltó la nave y no dé tirones.
 */
export function followCamera(prevY) {
  if (!map.parts.length || prevY === map.cam.y) return;
  const now = project(0, prevY, A).y; // dónde queda ahora lo que antes estaba en el centro
  const dy = now - map.anchorY;
  if (Math.abs(dy) > 200) return;
  for (const p of map.parts) p.y += dy;
}
