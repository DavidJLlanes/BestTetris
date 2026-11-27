import { CODE_PREFIX } from './format.js';
import { toBase64url } from './base64url.js';

/** Convierte un puzle en un código corto para compartir. Quita las filas vacías de arriba. */
export function encodePuzzle(p) {
  const first = p.board.findIndex((r) => /[^.]/.test(r));
  const board = first < 0 ? [] : p.board.slice(first);
  const data = { n: p.name.trim(), b: board, p: p.pieces, g: p.goal.type === 'perfect' ? ['perfect'] : [p.goal.type, p.goal.n], h: p.hold === false ? 0 : 1 };
  return CODE_PREFIX + toBase64url(JSON.stringify(data));
}
