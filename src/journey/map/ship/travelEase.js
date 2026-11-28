const smoother = (x) => x * x * x * (x * (x * 6 - 15) + 10);

/**
 * Avance del viaje (0..1 del tiempo) a fracción del recorrido: arranca despacio, coge velocidad,
 * frena y, por inercia, se pasa un poco de la parada antes de asentarse en ella.
 */
export function travelEase(u, overshoot = 0.05) {
  if (u >= 1) return 1;
  const base = smoother(Math.min(1, u / 0.85));
  const w = Math.max(0, (u - 0.6) / 0.4);
  return base + overshoot * Math.sin(Math.PI * w) ** 2;
}
