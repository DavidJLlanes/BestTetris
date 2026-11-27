import { COLS, ROWS } from '../../config/board.js';

const WIDTH_CELLS = 40;   // dos tableros de 10, sus columnas laterales y los huecos
const CHROME_PX = 120;    // cabecera y márgenes

/** Tamaño de celda que cabe en pantalla y tamaño de cada lienzo. */
export function layoutVersus(ui, dpr) {
  const cell = Math.max(10, Math.floor(Math.min((innerHeight - CHROME_PX) / ROWS, (innerWidth - 80) / WIDTH_CELLS)));
  const size = (ctx, w, h) => {
    const c = ctx.canvas;
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    c.style.width = `${w}px`; c.style.height = `${h}px`;
  };
  ui.forEach((u) => {
    size(u.board, COLS * cell, ROWS * cell);
    size(u.hold, cell * 4, cell * 2.6);
    size(u.next, cell * 4, cell * 10);
    u.last = {};
  });
  document.documentElement.style.setProperty('--vs-cell', `${cell}px`);
  return cell;
}
