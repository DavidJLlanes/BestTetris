/**
 * Desplazamientos que se prueban al girar junto a paredes u otras piezas.
 * Escritos con y hacia arriba y convertidos a y hacia abajo (la del tablero).
 */
const flipY = (list) => list.map(([x, y]) => [x, -y]);

export const KICKS = {
  '0>1': flipY([[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]),
  '1>0': flipY([[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]),
  '1>2': flipY([[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]),
  '2>1': flipY([[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]),
  '2>3': flipY([[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]),
  '3>2': flipY([[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]),
  '3>0': flipY([[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]),
  '0>3': flipY([[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]),
};

export const KICKS_I = {
  '0>1': flipY([[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]]),
  '1>0': flipY([[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]]),
  '1>2': flipY([[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]),
  '2>1': flipY([[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]),
  '2>3': flipY([[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]]),
  '3>2': flipY([[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]]),
  '3>0': flipY([[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]),
  '0>3': flipY([[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]),
};

/** Giro de 180°: ya en coordenadas del tablero. */
export const KICKS_180 = [[0, 0], [0, -1], [1, 0], [-1, 0], [0, 1], [1, -1], [-1, -1]];

/** Índice de la última prueba: un giro-T que la usa cuenta siempre como completo. */
export const LAST_KICK_INDEX = 4;
