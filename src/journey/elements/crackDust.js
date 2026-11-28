/**
 * Polvo cósmico: aguanta dos líneas. La primera vez su fila se vacía salvo el polvo, que se agrieta;
 * la segunda se rompe con la fila. Devuelve las filas que se quedan en el tablero.
 */
export function crackDust(g, rows) {
  const kept = [];
  for (const y of rows) {
    const row = g.board[y];
    if (!row.includes('D')) { g.custom.j.dust += row.filter((c) => c === 'd').length; continue; }
    kept.push(y);
    row.forEach((c, x) => { row[x] = c === 'D' ? 'd' : null; });
    g.emit('dustCrack', { y });
  }
  return kept;
}
