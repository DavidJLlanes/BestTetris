/** Estado visual compartido por los efectos (no afecta a las reglas). */
export const fx = {
  particles: [],
  texts: [],
  lockFlash: null,      // { cells, t }
  levelFlash: 0,        // 0..1
  bounce: { x: 0, v: 0 }, // rebote vertical del tablero, en píxeles
  shake: 0,             // temblor lateral residual
  rowOffsets: [],       // filas que aún están bajando tras una limpieza (en celdas)
  trails: [],           // estelas de caída rápida
};
