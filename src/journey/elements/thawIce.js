/** Una línea funde el hielo de las filas vecinas (justo encima y justo debajo): pasa a ser cristal normal. */
export function thawIce(g, rows) {
  const near = new Set();
  for (const y of rows) { near.add(y - 1); near.add(y + 1); }
  let melted = 0;
  for (const y of near) {
    const row = g.board[y];
    if (!row) continue;
    row.forEach((c, x) => { if (c === 'C') { row[x] = 'W'; melted++; } });
  }
  if (!melted) return;
  g.custom.j.ice += melted;
  g.emit('iceThaw', { count: melted });
}
