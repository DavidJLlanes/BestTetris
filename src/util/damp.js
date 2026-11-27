/** Acerca value a target de forma exponencial e independiente de la tasa de fotogramas. */
export function damp(value, target, speed, dt) {
  return target + (value - target) * Math.exp(-speed * dt);
}
