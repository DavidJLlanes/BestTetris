import { tryMove } from './tryMove.js';

/** Desliza la pieza hasta el tope en una dirección. Devuelve cuántas casillas se movió. */
export function shiftToWall(g, dir) {
  let n = 0;
  while (tryMove(g, dir, 0)) n++;
  return n;
}
