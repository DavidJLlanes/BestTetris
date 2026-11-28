const center = (r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

/**
 * El vecino más natural en una dirección (como en una consola): el que queda en esa dirección,
 * cerca en ese eje y bien alineado en el otro. null si no hay ninguno.
 */
export function spatialNext(from, list, dir) {
  const [dx, dy] = DIRS[dir];
  const a = from.getBoundingClientRect(), ca = center(a);
  let best = null, bestScore = Infinity;
  for (const el of list) {
    if (el === from) continue;
    const b = el.getBoundingClientRect(), cb = center(b);
    // distancia en la dirección (de borde a borde) y desalineación en el eje contrario
    const along = dx ? (dx > 0 ? b.left - a.right : a.left - b.right) : (dy > 0 ? b.top - a.bottom : a.top - b.bottom);
    const ahead = dx ? (cb.x - ca.x) * dx : (cb.y - ca.y) * dy;
    const minAhead = Math.max(4, Math.min(dx ? a.width : a.height, dx ? b.width : b.height) * 0.25);
    if (ahead <= minAhead || along < -Math.min(a.width, a.height, b.width, b.height) * 0.5) continue;
    const overlap = dx ? Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) : Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const cross = overlap > 0 ? 0 : Math.abs(dx ? cb.y - ca.y : cb.x - ca.x);
    const score = Math.max(0, along) + cross * 2.2 + (overlap > 0 ? 0 : 40);
    if (score < bestScore) { bestScore = score; best = el; }
  }
  return best;
}
