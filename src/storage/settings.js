import { DEFAULT_SETTINGS } from '../config/defaults.js';
import { load, save } from './store.js';

/** Si el sistema pide menos movimiento, el temblor y la cámara lenta empiezan apagados. */
function systemDefaults() {
  const calm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  return calm ? { shake: false, slowmo: false } : {};
}

export function loadSettings() {
  const saved = load('settings', {});
  return { ...DEFAULT_SETTINGS, ...systemDefaults(), ...saved, decor: { ...DEFAULT_SETTINGS.decor, ...(saved.decor || {}) } };
}
export function saveSettings(settings) { save('settings', settings); }
