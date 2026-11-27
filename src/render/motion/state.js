/**
 * Posición visual de la pieza activa: persigue a la posición lógica con suavidad.
 * angle/av: giro visual y su velocidad (muelle con un ligero rebote).
 * tilt/tv: balanceo en profundidad tras girar (da volumen 3D), con su velocidad.
 */
export const motion = { x: 0, y: 0, angle: 0, av: 0, tilt: 0, tv: 0, scale: 1, alpha: 1, piece: null };
