/** Llena la cola inicial (el modo puede dar la secuencia con nextPiece). */
export function fillQueue(g, size) {
  while (g.queue.length < size) {
    const t = g.hooks.nextPiece ? g.hooks.nextPiece(g) : g.next();
    g.queue.push(t === undefined ? g.next() : t);
  }
}
