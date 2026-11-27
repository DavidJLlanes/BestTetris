/**
 * Avanza un muelle amortiguado hacia 0 (semiimplícito, en pasos cortos para ser estable a
 * cualquier tasa de fotogramas). stiffness = rigidez, ratio = amortiguación (1 = sin rebote).
 * Devuelve [valor, velocidad].
 */
export function dampedSpring(value, velocity, stiffness, ratio, dt) {
  const damping = 2 * ratio * Math.sqrt(stiffness);
  const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
  const h = dt / steps;
  for (let i = 0; i < steps; i++) {
    velocity += (-stiffness * value - damping * velocity) * h;
    value += velocity * h;
  }
  if (Math.abs(value) < 1e-4 && Math.abs(velocity) < 1e-3) return [0, 0];
  return [value, velocity];
}
