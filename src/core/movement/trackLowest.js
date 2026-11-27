/** Al alcanzar una fila más baja se recupera el límite de reinicios del bloqueo. */
export function trackLowest(g) {
  if (g.cur.y > g.lowestY) { g.lowestY = g.cur.y; g.resets = 0; }
}
