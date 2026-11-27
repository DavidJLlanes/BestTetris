import { tryMove } from '../../core/movement/tryMove.js';
import { tryRotate } from '../../core/movement/tryRotate.js';
import { onGround } from '../../core/movement/onGround.js';

const noop = () => {};
const MOVES = [(g) => tryMove(g, -1, 0), (g) => tryMove(g, 1, 0), (g) => tryMove(g, 0, 1), (g) => tryRotate(g, 1), (g) => tryRotate(g, -1), (g) => tryRotate(g, 2)];

/** Todas las posiciones finales alcanzables por la pieza activa (búsqueda en anchura). */
export function placements(g) {
  // Copias ligeras: moverse no toca el tablero, así que se comparte
  const lite = (s) => ({ ...s, cur: { ...s.cur }, emit: noop });
  const seen = new Set(), finals = new Map(), queue = [lite(g)];
  const key = (s) => `${s.cur.x},${s.cur.y},${s.cur.rot},${s.lastRotate ? s.lastKick : '-'}`;
  seen.add(key(g));
  while (queue.length) {
    const s = queue.shift();
    if (onGround(s)) finals.set(key(s), s);
    for (const move of MOVES) {
      const n = lite(s);
      if (!move(n)) continue;
      const k = key(n);
      if (seen.has(k)) continue;
      seen.add(k);
      queue.push(n);
    }
  }
  return [...finals.values()];
}
