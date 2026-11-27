import { paintBoard } from '../board/paintBoard.js';
import { finish } from './finish.js';
import { spawn } from './spawn.js';

/** El tablero se ha llenado: fin de partida, o en zen se vacía y se sigue. */
export function topOut(g) {
  g.cur = null;
  if (g.rules.endsOnTopOut) { finish(g, false); return; }
  const cells = paintBoard(g.board, null);
  g.emit('boardReset', { cells });
  spawn(g);
}
