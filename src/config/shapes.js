/** Forma inicial de cada pieza, como matriz cuadrada. */
export const SHAPES = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
};
/** Piezas especiales (solo aparecen en los modos que las piden). */
export const SPECIAL_SHAPES = {
  M: [[1]],                          // mónada: un solo bloque
  B: [[1]],                          // bomba: un bloque que estalla al fijarse
  P: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], // estrella: pieza gigante de 5 bloques
};
Object.assign(SHAPES, SPECIAL_SHAPES);

/** Las 7 piezas normales, las que salen en la bolsa. */
export const TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
