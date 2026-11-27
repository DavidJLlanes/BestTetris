import { $ } from '../util/dom.js';
import { app } from '../app/state.js';
import { saveSettings } from '../storage/settings.js';
import { setVolumes, playSfx } from '../audio/index.js';
import { applyTheme } from './themes/applyTheme.js';

const SLIDERS = ['music', 'sfx', 'das', 'arr'];
const CHECKS = ['ghost', 'shake', 'grid', 'haptics', 'colorblind', 'focus', 'slowmo'];

/** Ajustes: se aplican y se guardan al momento. */
export function bindSettingsPanel() {
  const s = app.settings;
  SLIDERS.forEach((k) => { $(`set-${k}`).value = s[k]; });
  CHECKS.forEach((k) => { $(`set-${k}`).checked = s[k]; });
  const apply = () => {
    SLIDERS.forEach((k) => { s[k] = +$(`set-${k}`).value; });
    CHECKS.forEach((k) => { s[k] = $(`set-${k}`).checked; });
    $('val-das').textContent = `${s.das} ms`;
    $('val-arr').textContent = s.arr === 0 ? 'instantáneo' : `${s.arr} ms`;
    setVolumes(s.music / 100, s.sfx / 100);
    applyTheme(s);
    document.body.classList.toggle('focus-mode', s.focus);
    saveSettings(s);
  };
  [...SLIDERS, ...CHECKS].forEach((k) => $(`set-${k}`).addEventListener('input', apply));
  $('set-sfx').addEventListener('change', () => playSfx('rotate'));
  apply();
}
