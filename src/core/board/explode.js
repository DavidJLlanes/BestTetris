/** Vacía un cuadrado de (2r+1)×(2r+1) alrededor de (cx, cy). Devuelve las celdas que tenían algo. */
export function explode(board, cx, cy, r = 1) {
  const hit = [];
  for (let y = cy - r; y <= cy + r; y++) {
    if (y < 0 || y >= board.length) continue;
    for (let x = cx - r; x <= cx + r; x++) {
      if (x < 0 || x >= board[y].length || !board[y][x]) continue;
      hit.push([x, y, board[y][x]]);
      board[y][x] = null;
    }
  }
  return hit;
}
