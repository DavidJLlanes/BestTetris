/** Índices de las filas completas. */
export function findFullRows(board) {
  const rows = [];
  board.forEach((row, y) => { if (row.every(Boolean)) rows.push(y); });
  return rows;
}
