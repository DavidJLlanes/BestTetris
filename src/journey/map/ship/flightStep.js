const OMEGA = 13, ZETA = 0.82; // muelle que persigue al guía: retraso natural y un leve pasarse
const SUB = 1 / 120;
const smoother = (x) => { const c = Math.min(1, Math.max(0, x)); return c * c * c * (c * (c * 6 - 15) + 10); };

/**
 * Avance físico del vuelo: un guía recorre el trayecto con arranque y frenada suaves y la nave
 * lo persigue con un muelle (inercia). Así no hay saltos de velocidad: acelera, frena, se pasa
 * un pelín y se asienta. Devuelve true cuando ya está quieta en su destino.
 */
export function flightStep(s, dt) {
  const len = s.route.len;
  let left = dt;
  while (left > 1e-6) {
    const h = Math.min(SUB, left);
    left -= h;
    s.time += h;
    const goal = len * smoother(s.time / (s.dur * 0.82));
    const acc = OMEGA * OMEGA * (goal - s.d) - 2 * ZETA * OMEGA * s.v;
    s.v += acc * h;
    s.d += s.v * h;
  }
  return s.time >= s.dur * 0.82 && Math.abs(len - s.d) < 0.4 && Math.abs(s.v) < 3;
}
