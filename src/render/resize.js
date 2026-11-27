import { COLS, ROWS } from '../config/board.js';
import { view } from './view.js';
import { computeLayout } from './layoutMetrics.js';
import { safeArea } from '../util/safeArea.js';

function sizeCanvas(canvas, w, h) {
  w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
  canvas.width = Math.round(w * view.dpr);
  canvas.height = Math.round(h * view.dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
}

/** Ajusta el tablero y los paneles al espacio disponible del dispositivo. */
export function resize({ board, hold, next }, device) {
  view.dpr = Math.min(window.devicePixelRatio || 1, 3);
  const vv = window.visualViewport;
  const sa = safeArea();
  const width = (vv ? vv.width : innerWidth) - sa.left - sa.right;
  const height = (vv ? vv.height : innerHeight) - sa.top - sa.bottom;
  const stacked = device.stacked;
  const { cell, side, hud = 0 } = computeLayout({ width, height, stacked, touch: device.touch });

  view.cell = cell;
  view.width = COLS * cell;
  view.height = ROWS * cell;
  view.previewRow = stacked;
  view.version++;

  const root = document.documentElement.style;
  root.setProperty('--cell', `${cell}px`);
  root.setProperty('--side', `${side}px`);
  root.setProperty('--board-w', `${view.width}px`);
  root.setProperty('--hud-h', `${hud}px`);

  sizeCanvas(board, view.width, view.height);
  if (stacked) {
    const k = hud / 70; // la franja crece en tablet
    sizeCanvas(hold, 52 * k, 40 * k);
    sizeCanvas(next, Math.min(150 * k, view.width * 0.4), 40 * k);
  } else {
    const inner = Math.min(side, cell * 4.6) - 22;
    sizeCanvas(hold, inner, inner * 0.45);
    sizeCanvas(next, inner, inner * 2.6);
  }
}
