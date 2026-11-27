/** Gira una matriz cuadrada 90° en sentido horario. */
export function rotateMatrix(matrix) {
  const n = matrix.length;
  return matrix.map((row, r) => row.map((_, c) => matrix[n - 1 - c][r]));
}
