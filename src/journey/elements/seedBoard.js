import { seedGarbage } from '../../core/game/seedGarbage.js';
import { countType } from '../../core/board/countType.js';

const KINDS = [['astros', 'A'], ['dust', 'D'], ['ice', 'C'], ['holes', 'H']];

/**
 * Tablero inicial de una constelación: filas de roca con un hueco y, engastados en ellas,
 * astros, polvo, hielo y agujeros negros en celdas distintas. Usa el generador de la partida,
 * así el mismo reto sale igual y el fantasma corre sobre el mismo tablero.
 */
export function seedBoard(g, spec = {}) {
  const need = KINDS.reduce((s, [k]) => s + (spec[k] || 0), 0);
  const rows = Math.max(spec.rows || 0, Math.ceil(need / 5));
  seedGarbage(g, rows);
  const cells = [];
  for (let y = g.board.length - rows; y < g.board.length; y++) g.board[y].forEach((c, x) => { if (c) cells.push([x, y]); });
  for (const [key, type] of KINDS) {
    for (let i = 0; i < (spec[key] || 0) && cells.length; i++) {
      const [x, y] = cells.splice(Math.floor(g.random() * cells.length), 1)[0];
      g.board[y][x] = type;
    }
  }
  const s = g.custom.j.start;
  for (const [key, type] of KINDS) s[key] = countType(g.board, type);
  s.rock = countType(g.board, 'G');
}
