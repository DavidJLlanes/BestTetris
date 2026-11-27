/** Muelle amortiguado: { x, v } tiende a 0. Se usa para rebotes del tablero. */
export function stepSpring(s, dt, stiffness = 520, damping = 22) {
  s.v += (-stiffness * s.x - damping * s.v) * dt;
  s.x += s.v * dt;
  if (Math.abs(s.x) < 0.01 && Math.abs(s.v) < 0.05) { s.x = 0; s.v = 0; }
}
