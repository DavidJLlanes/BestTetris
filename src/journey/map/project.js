import { map } from './mapState.js';

const TILT = 0.5; // inclinación del plano del mapa (radianes): lo lejano se ve más pequeño
const FOCAL = 1100;
const SIN = Math.sin(TILT);
export const COS = Math.cos(TILT);

/**
 * Del mundo a la pantalla con perspectiva: el camino es un plano inclinado que se aleja hacia
 * arriba. Devuelve { x, y, s } (s = escala en ese punto). Reutiliza `out` para no crear objetos.
 */
export function project(x, y, out = {}) {
  const d = y - map.cam.y;
  const z = Math.max(d * SIN, -FOCAL * 0.5);
  const zoom = 1 + map.zoom * 1.8;
  const s = (FOCAL / (FOCAL + z)) * map.k * zoom;
  out.s = s;
  out.x = map.w / 2 + (x - map.focusX * map.zoom) * s;
  out.y = map.anchorY - d * COS * s;
  return out;
}

/** Píxeles de pantalla por unidad de mundo en vertical, a la altura de la cámara. */
export const dragScale = () => COS * map.k * (1 + map.zoom * 1.8);
