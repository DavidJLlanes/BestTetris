import { parseBoard } from './parseBoard.js';
import { goalDone, goalProgress } from './goals.js';
import { targetCells, sameCells } from './targetCells.js';

/**
 * Convierte la definición de un puzle en un modo de juego.
 * puzzle: { id, name, hint, board: [filas], pieces: 'TIO', goal: { type, n }, hold, targets }
 */
export function makePuzzleMode(puzzle) {
  return {
    id: 'puzzle',
    puzzle,
    name: puzzle.name,
    icon: '🧩',
    record: 'time',
    noRecord: true,
    achievementCategory: 'puzzles',
    countdown: 1,
    rules: { levelUp: false, fixedInterval: puzzle.targets ? 3 : 1.5, hold: puzzle.hold !== false, previews: 5 },
    setup(g) {
      parseBoard(g.board, puzzle.board);
      g.custom.sequence = puzzle.pieces.split('');
      g.custom.targets = puzzle.targets || [];
      g.custom.placed = 0;
    },
    nextPiece: (g) => g.custom.sequence.shift() || null,
    isComplete: (g) => goalDone(g, puzzle.goal),
    progress: (g) => goalProgress(g, puzzle.goal),
    target(g) {
      const t = g.custom.targets[g.custom.placed];
      return t && g.cur ? targetCells(g.board, g.cur.type, t) : null;
    },
    onLock(g, piece, cells) {
      if (!puzzle.targets) return;
      const t = g.custom.targets[g.custom.placed];
      // Para comparar, se quita la pieza recién fijada del tablero
      cells.forEach(([x, y]) => { if (y >= 0) g.board[y][x] = null; });
      const ok = t && sameCells(cells, targetCells(g.board, piece.type, t));
      cells.forEach(([x, y]) => { if (y >= 0) g.board[y][x] = piece.type; });
      if (ok) { g.custom.placed++; g.emit('targetHit', { index: g.custom.placed }); }
      else { g.over = true; g.emit('targetMiss', {}); } // se reintenta sin contar como partida
    },
  };
}
