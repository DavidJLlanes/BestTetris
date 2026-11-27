import { DECOR_PARTS, AUTO_START, QUALITY } from '../config/decor.js';
import { fx } from '../effects/state.js';
import { decor } from './state.js';
import { resetDust } from './dustLayer.js';

/**
 * Tablets con muchísimos píxeles físicos (p. ej. Android 1800×2880): las capas grandes del fondo
 * agotan la memoria de la GPU y el navegador deja trozos de la página sin pintar. Ahí se empieza
 * en calidad baja (fondo quieto, sin polvo ni facetas); en Ajustes se puede subir a mano.
 */
function bigTouchScreen() {
  const b = document.body.classList;
  if (!b.contains('is-touch') || b.contains('is-phone')) return false;
  const dpr = window.devicePixelRatio || 1;
  return screen.width * screen.height * dpr * dpr > 4e6;
}

/** Refleja los interruptores y la calidad como clases del body (el CSS hace el resto). */
export function applyDecor(s) {
  const b = document.body.classList;
  for (const { id } of DECOR_PARTS) b.toggle(`no-${id}`, !s.decor[id]);
  const start = bigTouchScreen() ? 'low' : document.body.classList.contains('is-phone') ? 'medium' : AUTO_START; // móviles: se empieza ligero
  decor.quality = s.quality === 'auto' ? (decor.autoQuality || start) : s.quality;
  for (const q of ['high', 'medium', 'low']) b.toggle(`q-${q}`, decor.quality === q);
  fx.budget = QUALITY[decor.quality].particles; // menos chispas si el móvil va justo
  resetDust();
}
