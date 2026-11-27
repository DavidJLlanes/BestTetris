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
  slow: null,           // cámara lenta en curso { t, total, scale }
  zoom: { x: 0, v: 0 }, // zoom extra del tablero (0 = normal), con muelle
  overT: 0,             // segundos desde el fin de la partida (onda gris)
};
