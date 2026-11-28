/** El hielo sujeta su fila: una fila completa con hielo no se limpia hasta que se funda. */
export const filterRows = (g, rows) => rows.filter((y) => !g.board[y].includes('C'));
