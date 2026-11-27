/** Sustituye cada bloque por el tipo indicado (null lo borra). Devuelve las celdas cambiadas. */
export function paintBoard(board, type) {
  const changed = [];
  board.forEach((row, y) => row.forEach((c, x) => {
    if (!c) return;
    changed.push({ x, y, type: c });
    row[x] = type;
  }));
  return changed;
}
