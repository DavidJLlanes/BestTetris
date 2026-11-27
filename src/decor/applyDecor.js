import { DECOR_PARTS, AUTO_START } from '../config/decor.js';
import { decor } from './state.js';
import { resetDust } from './dustLayer.js';

/** Refleja los interruptores y la calidad como clases del body (el CSS hace el resto). */
export function applyDecor(s) {
  const b = document.body.classList;
  for (const { id } of DECOR_PARTS) b.toggle(`no-${id}`, !s.decor[id]);
  const start = document.body.classList.contains('is-phone') ? 'medium' : AUTO_START; // móviles: se empieza ligero
  decor.quality = s.quality === 'auto' ? (decor.autoQuality || start) : s.quality;
  for (const q of ['high', 'medium', 'low']) b.toggle(`q-${q}`, decor.quality === q);
  resetDust();
}
