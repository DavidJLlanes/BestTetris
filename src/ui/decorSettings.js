import { $ } from '../util/dom.js';
import { app } from '../app/state.js';
import { saveSettings } from '../storage/settings.js';
import { DECOR_PARTS, QUALITY_NAMES } from '../config/decor.js';
import { applyDecor } from '../decor/applyDecor.js';
import { askTiltPermission } from '../decor/parallax.js';

/** Ajustes > Decoración: calidad (con automática) y un interruptor por cada adorno. */
export function bindDecorSettings() {
  const s = app.settings, sel = $('set-quality');
  sel.innerHTML = Object.entries(QUALITY_NAMES).map(([id, name]) => `<option value="${id}">${name}</option>`).join('');
  sel.value = s.quality;
  $('decor-parts').innerHTML = DECOR_PARTS.map((p) => `<label class="check"><input type="checkbox" data-decor="${p.id}" ${s.decor[p.id] ? 'checked' : ''}> ${p.name}</label>`).join('');
  sel.addEventListener('input', () => { s.quality = sel.value; applyDecor(s); saveSettings(s); });
  $('decor-parts').addEventListener('input', (e) => {
    const id = e.target.dataset.decor;
    if (!id) return;
    s.decor[id] = e.target.checked;
    if (id === 'tilt' && e.target.checked) askTiltPermission();
    applyDecor(s); saveSettings(s);
  });
  applyDecor(s);
}
