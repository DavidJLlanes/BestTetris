/** Saca la siguiente pieza de la cola y la repone. */
export function takeNext(g) {
  const type = g.queue.shift();
  g.queue.push(g.next());
  return type;
}
