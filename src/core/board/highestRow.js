/** Índice de la fila ocupada más alta, o board.length si está vacío. */
export function highestRow(board) {
  const y = board.findIndex((row) => row.some(Boolean));
  return y === -1 ? board.length : y;
}
