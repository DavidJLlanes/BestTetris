/** Termina la partida (win = objetivo cumplido). El tablero se apaga en el dibujo. */
export function finish(g, win) {
  g.over = true;
  g.won = win;
  g.cur = null;
  g.emit('finish', { win });
}
