/** Estado del dibujo: tamaños actuales y contextos de los lienzos. */
export const view = {
  cell: 30,
  dpr: 1,
  width: 0,
  height: 0,
  board: null, // CanvasRenderingContext2D
  hold: null,
  next: null,
  version: 0, // sube en cada cambio de tamaño para invalidar cachés
};

export function attachCanvases({ board, hold, next }) {
  view.board = board.getContext('2d', { alpha: true, desynchronized: true });
  view.hold = hold.getContext('2d');
  view.next = next.getContext('2d');
}
