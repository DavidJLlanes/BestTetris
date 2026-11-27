/** Tablero ⇄ filas de texto (como los puzles), para guardar repeticiones de forma compacta. */
export const boardToRows = (board) => board.map((r) => r.map((c) => c || '.').join(''));
