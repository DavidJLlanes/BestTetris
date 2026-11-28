/** Un agujero negro en una fila que se limpia se traga también la fila de debajo (y desaparece). */
export function swallowRows(g, rows) {
  const out = new Set(rows);
  const bottom = g.board.length - 1;
  for (const y of rows) {
    const holes = g.board[y].filter((c) => c === 'H').length;
    if (!holes) continue;
    g.custom.j.holes += holes;
    if (y < bottom && g.board[y + 1].some(Boolean)) out.add(y + 1);
    g.emit('holeSwallow', { y });
  }
  return [...out].sort((a, b) => a - b);
}
