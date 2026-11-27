import { COLS, ROWS } from '../config/board.js';
import { view } from './view.js';
import { computeLayout } from './layoutMetrics.js';

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
  // Se mide la caja real de la aplicación (ya sin márgenes seguros): el tablero y los botones
  // caben siempre en ella, diga lo que diga el navegador de sus barras.
  const app = document.getElementById('app'), cs = getComputedStyle(app);
  const px = (k) => parseFloat(cs[k]) || 0;
  const vw = Math.min(app.clientWidth, window.visualViewport ? Math.round(visualViewport.width) : innerWidth);
  const width = vw - px('paddingLeft') - px('paddingRight');
  const height = app.clientHeight - px('paddingTop') - px('paddingBottom');
  const stacked = device.stacked;
  const { cell, side, touchH = 0, strip = false, hud = 0 } = computeLayout({ width, height, stacked, touch: device.touch });

  view.cell = cell;
  view.width = COLS * cell;
  view.height = ROWS * cell;
  view.previewRow = strip;
  document.body.classList.toggle('hud-strip', strip);
  view.version++;

  const root = document.documentElement.style;
  root.setProperty('--cell', `${cell}px`);
  root.setProperty('--side', `${side}px`);
  root.setProperty('--board-w', `${view.width}px`);
  root.setProperty('--hud-h', `${hud}px`);
  root.setProperty('--touch-h', `${Math.max(44, touchH - 8)}px`);

  sizeCanvas(board, view.width, view.height);
  if (strip) {
    const k = hud / 62; // la franja crece en tablet
    sizeCanvas(hold, 50 * k, 36 * k);
    sizeCanvas(next, Math.min(140 * k, view.width * 0.42), 36 * k);
  } else if (stacked) {
    const inner = side - (width >= 600 ? 22 : 12); // menos el relleno de la caja
    sizeCanvas(hold, inner, inner * 0.6);
    sizeCanvas(next, inner, Math.min(inner * 3.2, view.height * 0.62));
  } else {
    const inner = Math.min(side, cell * 4.6) - 22;
    sizeCanvas(hold, inner, inner * 0.45);
    sizeCanvas(next, inner, inner * 2.6);
  }
}
