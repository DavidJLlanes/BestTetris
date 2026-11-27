/**
 * Saca la siguiente pieza de la cola y la repone. Un modo puede decidir la pieza
 * con nextPiece(g); si devuelve null, la cola se agota (puzles con piezas contadas).
 */
export function takeNext(g) {
  const type = g.queue.shift() ?? null;
  const refill = g.hooks.nextPiece ? g.hooks.nextPiece(g) : g.next();
  g.queue.push(refill === undefined ? g.next() : refill);
  return type;
}
