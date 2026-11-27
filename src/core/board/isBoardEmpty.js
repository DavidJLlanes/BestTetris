/** ¿No queda ningún bloque? */
export function isBoardEmpty(board) {
  return board.every((row) => row.every((c) => !c));
}
