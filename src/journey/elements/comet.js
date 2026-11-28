import { finish } from '../../core/game/finish.js';

/**
 * Cometa: una pieza de un bloque que, al fijarse, rompe todo lo que tiene debajo en su columna
 * (rocas, polvo y hielo incluidos; los astros que rompe se recogen).
 */
export function cometStrike(g, piece, cells) {
  if (piece.type !== 'K') return;
  const [x, y0] = cells[0];
  const hit = [];
  for (let y = y0; y < g.board.length; y++) {
    const c = g.board[y][x];
    if (!c) continue;
    if (c === 'A') g.custom.j.astros++;
    if (c === 'D' || c === 'd') g.custom.j.dust++;
    if (c === 'C') g.custom.j.ice++;
    if (c === 'H') g.custom.j.holes++;
    hit.push([x, y, c]);
    g.board[y][x] = null;
  }
  g.custom.j.comets++;
  g.emit('comet', { x, y: y0, hit });
  g.emit('bomb', { x, y: y0, hit }); // mismas chispas y sonido que una bomba
  if (g.hooks.isComplete && g.hooks.isComplete(g)) finish(g, true); // el cometa puede rematar el objetivo
}

/** Cada `every` piezas sale un cometa (si la constelación los tiene). */
export function cometNext(g) {
  const every = g.custom.cometEvery;
  if (!every) return undefined;
  g.custom.count = (g.custom.count || 0) + 1;
  if (g.custom.forceComet) { g.custom.forceComet = false; return 'K'; }
  return g.custom.count % every === 0 ? 'K' : undefined;
}
