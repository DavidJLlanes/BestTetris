/** Puntos de una curva suave (Catmull-Rom) que pasa por los dados; `steps` por tramo. */
export function spline(points, steps = 14) {
  const out = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] || p2;
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y), seg: i + t });
    }
  }
  const last = points[points.length - 1];
  out.push({ x: last.x, y: last.y, seg: points.length - 1 });
  return out;
}
