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
  ambientOut: null,     // ambiente de la escena anterior, desvaneciéndose
  ambient: null,         // partículas de ambiente de una estación { kind, color, parts }
  freeze: 0,            // 1 mientras dura el poder Congelar (escarcha en los bordes)
  rewind: 0,            // 1 → 0: barrido de "rebobinar" al deshacer
  overT: 0,             // segundos desde el fin de la partida (onda gris)
  afterimages: [],      // estelas de luz al mover o girar { cells, color, t, life }
  rings: [],            // ondas de la salpicadura al soltar { x, y, w, color, t, life }
  sweeps: [],           // barridos de luz por las filas hechas { y, color, t, life }
  budget: 1,            // cuántas partículas permite la calidad (1 alta, 0.6 media, 0.3 baja)
};
