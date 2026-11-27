/** Curvas de animación (k de 0 a 1). */
export const easeOutCubic = (k) => 1 - Math.pow(1 - k, 3);
