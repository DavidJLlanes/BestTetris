import { COLS } from '../config/board.js';

/**
 * Pasos del tutorial. Cada uno: texto según el control que se esté usando
 * (keys, pad, touch), el evento que cuenta como acierto y cuántas veces hace falta.
 * piece: pieza que se entrega al empezar el paso (para que siempre se pueda hacer).
 * setup(g): prepara el tablero para el paso si hace falta.
 */
export const STEPS = [
  { id: 'move', event: 'move', times: 3, text: {
    keys: 'Mueve la pieza con ← y →', pad: 'Mueve la pieza con la cruceta o el stick', touch: 'Desliza el dedo sobre el tablero, o usa ◀ ▶' } },
  { id: 'rotate', event: 'rotate', times: 2, piece: 'T', text: {
    keys: 'Gira con ↑ o X (derecha) y Z (izquierda)', pad: 'Gira con A (derecha) y B (izquierda)', touch: 'Toca el tablero para girar: lado izquierdo ↺, derecho ↻' } },
  { id: 'soft', event: 'softDrop', times: 4, text: {
    keys: 'Mantén ↓ para bajar más rápido', pad: 'Mantén abajo para bajar más rápido', touch: 'Mantén ▼ o arrastra hacia abajo despacio' } },
  { id: 'hard', event: 'hardDrop', times: 1, text: {
    keys: 'Pulsa Espacio para soltarla de golpe', pad: 'Pulsa arriba o RT para soltarla de golpe', touch: 'Desliza rápido hacia abajo (o arriba) o pulsa Soltar' } },
  { id: 'hold', event: 'hold', times: 1, text: {
    keys: 'Pulsa C para guardar la pieza en la reserva', pad: 'Pulsa LB o RB para guardar la pieza', touch: 'Toca el recuadro Reserva o el botón Reserva' } },
  { id: 'clear', event: 'clear', times: 1, piece: 'I', text: {
    keys: 'Encaja la barra en el hueco para completar la fila', pad: 'Encaja la barra en el hueco para completar la fila', touch: 'Encaja la barra en el hueco para completar la fila' },
    setup(g) {
      g.board.forEach((row) => row.fill(null));
      const last = g.board.length - 1;
      for (let x = 0; x < COLS; x++) g.board[last][x] = x >= 3 && x <= 6 ? null : 'G';
      for (const x of [0, 1, 8, 9]) g.board[last - 1][x] = 'G'; // queda algo tras limpiar: la limpieza total se gana jugando
    } },
];
