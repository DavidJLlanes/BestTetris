import { COLS, ROWS } from '../config/board.js';

/** Medidas fijas de la interfaz, en px CSS. Deben coincidir con styles/. */
export const UI = {
  topBar: 48,
  stackedTopBar: 44,
  touchBtnMin: 44,     // diámetro de los botones redondos: nunca por debajo del mínimo táctil
  touchBtnMax: 56,
  touchBtnMaxWide: 68,
  touchPad: 8,         // aire bajo la fila de botones
  stackedGap: 4,
  stackedPad: 6,
  stackedSideMin: 46,  // columnas laterales en vertical: estrechas, el tablero es el protagonista
  stackedSideRatio: 1.8,
  stackedHud: 62,      // franja de marcador (variante B)
  stackedHudWide: 96,
  wideFrom: 600,
  gap: 10,
  sidePad: 16,
  sideRatio: 4.6,      // ancho de columna lateral, en celdas
  sideTouchMin: 200,   // ancho mínimo de columna si lleva botones táctiles
  minCell: 12,
  maxCell: 44,
  stackedMaxCell: 64,  // en vertical (tablet) el tablero puede crecer hasta llenar el alto
};

/**
 * Tamaño de celda que hace caber el tablero en el espacio libre.
 * stacked: móvil vertical (todo apilado). Si no: columnas laterales (tablet y PC).
 */
export function computeLayout({ width, height, stacked, touch }) {
  if (stacked) {
    const wide = width >= UI.wideFrom;
    const btn = touchButton(width, wide);
    const touchH = touch ? Math.round(btn * 1.16) + UI.touchPad : 0; // el de soltar es algo mayor
    const h = height - UI.stackedTopBar - touchH - UI.stackedGap * 2 - 4;
    const sideFor = (c) => Math.max(UI.stackedSideMin, Math.round(c * UI.stackedSideRatio));
    // A: columnas a los lados del tablero (gana en pantallas anchas o bajas)
    let side = clampCell(h / ROWS, UI.stackedMaxCell);
    while (side > UI.minCell && side * COLS + sideFor(side) * 2 + UI.stackedGap * 2 + UI.stackedPad * 2 > width) side--;
    // B: franja de marcador arriba y tablero a todo el ancho (gana en móviles altos y estrechos)
    const hud = wide ? UI.stackedHudWide : UI.stackedHud;
    const strip = clampCell(Math.min((h - hud - UI.stackedGap) / ROWS, (width - UI.stackedPad * 2) / COLS), UI.stackedMaxCell);
    const useStrip = strip > side;
    const cell = useStrip ? strip : side;
    return { cell, side: useStrip ? 0 : sideFor(cell), touchH, btn, strip: useStrip, hud: useStrip ? hud : 0 };
  }
  const h = height - UI.topBar - UI.gap * 3;
  let cell = clampCell(h / ROWS);
  const sideFor = (c) => Math.max(Math.round(c * UI.sideRatio), touch ? UI.sideTouchMin : 0);
  while (cell > UI.minCell && cell * COLS + sideFor(cell) * 2 + UI.gap * 2 + UI.sidePad * 2 > width) cell--;
  return { cell, side: sideFor(cell) };
}

/** Diámetro de los botones redondos: siete por fila (el de soltar algo mayor) con su aire. */
export function touchButton(width, wide) {
  return Math.max(UI.touchBtnMin, Math.min(wide ? UI.touchBtnMaxWide : UI.touchBtnMax, Math.floor((width - 60) / 7.4)));
}

function clampCell(c, max = UI.maxCell) { return Math.max(UI.minCell, Math.min(max, Math.floor(c))); }
