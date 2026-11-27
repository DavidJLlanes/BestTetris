import { paintBoard } from '../board/paintBoard.js';

/** Termina la partida (win = objetivo cumplido). */
export function finish(g, win) {
  g.over = true;
  g.won = win;
  g.cur = null;
  if (!win) paintBoard(g.board, 'X');
  g.emit('finish', { win });
}
