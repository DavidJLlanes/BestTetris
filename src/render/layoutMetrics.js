import { COLS, ROWS } from '../config/board.js';

/** Medidas fijas de la interfaz, en px CSS. Deben coincidir con styles/. */
export const UI = {
  topBar: 48,
  stackedHud: 70,      // franja de reserva, marcador y siguientes en el móvil
  stackedHudWide: 104, // la misma franja en una tablet en vertical
  wideFrom: 600,
  stackedTouch: 126,   // botones táctiles en el móvil
  gap: 10,
  sidePad: 16,
  sideRatio: 4.6,      // ancho de columna lateral, en celdas
  sideTouchMin: 200,   // ancho mínimo de columna si lleva botones táctiles
  minCell: 12,
  maxCell: 44,
};

/**
 * Tamaño de celda que hace caber el tablero en el espacio libre.
 * stacked: móvil vertical (todo apilado). Si no: columnas laterales (tablet y PC).
 */
export function computeLayout({ width, height, stacked, touch }) {
  if (stacked) {
    const hud = width >= UI.wideFrom ? UI.stackedHudWide : UI.stackedHud;
    const h = height - UI.topBar - hud - UI.stackedTouch - UI.gap * 3;
    const w = width - UI.sidePad;
    const cell = clampCell(Math.min(h / ROWS, w / COLS));
    return { cell, side: 0, hud };
  }
  const h = height - UI.topBar - UI.gap * 3;
  let cell = clampCell(h / ROWS);
  const sideFor = (c) => Math.max(Math.round(c * UI.sideRatio), touch ? UI.sideTouchMin : 0);
  while (cell > UI.minCell && cell * COLS + sideFor(cell) * 2 + UI.gap * 2 + UI.sidePad * 2 > width) cell--;
  return { cell, side: sideFor(cell) };
}

function clampCell(c) { return Math.max(UI.minCell, Math.min(UI.maxCell, Math.floor(c))); }
