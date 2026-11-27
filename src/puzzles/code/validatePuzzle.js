import { MAX_ROWS, MAX_PIECES, MAX_NAME, ROW_RE, PIECES_RE, CODE_GOALS } from './format.js';

/** Comprueba un puzle creado por un jugador. Devuelve un mensaje de error o null. */
export function validatePuzzle(p) {
  if (!p || typeof p !== 'object') return 'El código no es un puzle.';
  if (typeof p.name !== 'string' || !p.name.trim() || p.name.length > MAX_NAME) return 'El nombre del puzle no es válido.';
  if (!Array.isArray(p.board) || p.board.length > MAX_ROWS || !p.board.every((r) => typeof r === 'string' && ROW_RE.test(r))) return 'El tablero del puzle no es válido.';
  if (p.board.some((r) => !r.includes('.'))) return 'Hay filas completas en el tablero: deja al menos un hueco en cada una.';
  if (typeof p.pieces !== 'string' || !PIECES_RE.test(p.pieces) || p.pieces.length > MAX_PIECES) return 'Las piezas del puzle no son válidas.';
  const g = p.goal;
  if (!g || !CODE_GOALS.includes(g.type)) return 'El objetivo del puzle no es válido.';
  if (g.type !== 'perfect' && !(Number.isInteger(g.n) && g.n >= 1 && g.n <= 4 * MAX_PIECES)) return 'El objetivo del puzle no es válido.';
  if (g.type === 'perfect' && !p.board.some((r) => /[^.]/.test(r))) return 'Para dejar el tablero vacío, primero tiene que haber bloques.';
  return null;
}
