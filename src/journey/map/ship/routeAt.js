/**
 * Punto y dirección a una distancia `d` del trayecto. Más allá del final (la inercia de la
 * llegada) sigue en línea recta por la última dirección.
 */
export function routeAt(route, d) {
  const { pts, acc, len } = route;
  if (len <= 0) return { x: pts[0].x, y: pts[0].y, dx: 0, dy: 1 };
  const dd = Math.max(0, d);
  let i = 1;
  while (i < acc.length - 1 && acc[i] < dd) i++;
  const a = pts[i - 1], b = pts[i], seg = acc[i] - acc[i - 1] || 1;
  const t = (dd - acc[i - 1]) / seg;
  const dx = (b.x - a.x) / seg, dy = (b.y - a.y) / seg;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, dx, dy };
}
