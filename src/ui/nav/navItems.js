import { topOverlay } from '../overlays.js';

/** Todo lo que se puede elegir con el mando o las flechas: botones, campos, desplegables y casillas del editor. */
const SELECTOR = [
  'button:not([disabled])', 'input:not([type=file]):not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])',
  'summary', 'a[href]', '[data-nav]', '.ed-grid > i',
].join(',');

const visible = (el) => {
  const r = el.getBoundingClientRect();
  return r.width > 2 && r.height > 2 && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
};

/** Elementos navegables de la pantalla de arriba (los invisibles del mapa los lleva el propio mapa). */
export function navItems(root = topOverlay()) {
  if (!root) return [];
  return [...root.querySelectorAll(SELECTOR)].filter((el) => !el.closest('#jm-nodes') && visible(el));
}
