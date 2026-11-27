import { COLS, ROWS } from '../config/board.js';

/** Medidas fijas de la interfaz, en px CSS. Deben coincidir con styles/. */
export const UI = {
  topBar: 48,
  stackedTopBar: 44,
  stackedTouch: 64,    // fila de botones táctiles en vertical (56 + margen)
  stackedTouchWide: 88,
  stackedGap: 4,
  stackedPad: 6,
  stackedSideMin: 54,  // columnas laterales en vertical: estrechas, el tablero es el protagonista
  stackedSideRatio: 2,
  stackedHud: 62,      // franja de marcador (variante B)
  stackedHudWide: 96,
  stackedTouchGrow: 16,
  wideFrom: 600,
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
    const wide = width >= UI.wideFrom;
    const touchH = touch ? (wide ? UI.stackedTouchWide : UI.stackedTouch) : 0;
    const h = height - UI.stackedTopBar - touchH - UI.stackedGap * 2 - 4;
    const sideFor = (c) => Math.max(UI.stackedSideMin, Math.round(c * UI.stackedSideRatio));
    // A: columnas a los lados del tablero (gana en pantallas anchas o bajas)
    let side = clampCell(h / ROWS);
    while (side > UI.minCell && side * COLS + sideFor(side) * 2 + UI.stackedGap * 2 + UI.stackedPad * 2 > width) side--;
    // B: franja de marcador arriba y tablero a todo el ancho (gana en móviles altos y estrechos)
    const hud = wide ? UI.stackedHudWide : UI.stackedHud;
    const strip = clampCell(Math.min((h - hud - UI.stackedGap) / ROWS, (width - UI.stackedPad * 2) / COLS));
    const useStrip = strip > side;
    const cell = useStrip ? strip : side;
    // El alto que sobre agranda un poco los botones
    const spare = h - cell * ROWS - (useStrip ? hud + UI.stackedGap : 0);
    const extra = touch ? Math.max(0, Math.min(UI.stackedTouchGrow, spare)) : 0;
    return { cell, side: useStrip ? 0 : sideFor(cell), touchH: touchH + extra, strip: useStrip, hud: useStrip ? hud : 0 };
  }
  const h = height - UI.topBar - UI.gap * 3;
  let cell = clampCell(h / ROWS);
  const sideFor = (c) => Math.max(Math.round(c * UI.sideRatio), touch ? UI.sideTouchMin : 0);
  while (cell > UI.minCell && cell * COLS + sideFor(cell) * 2 + UI.gap * 2 + UI.sidePad * 2 > width) cell--;
  return { cell, side: sideFor(cell) };
}

function clampCell(c) { return Math.max(UI.minCell, Math.min(UI.maxCell, Math.floor(c))); }
