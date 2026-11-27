/** Cuántas celdas del tablero son de un tipo. */
export function countType(board, type) {
  return board.reduce((n, row) => n + row.filter((c) => c === type).length, 0);
}
