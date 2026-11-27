import { DEFAULT_SETTINGS } from '../config/defaults.js';
import { load, save } from './store.js';

/** Si el sistema pide menos movimiento, el temblor y la cámara lenta empiezan apagados. */
function systemDefaults() {
  const calm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  return calm ? { shake: false, slowmo: false } : {};
}

export function loadSettings() { return { ...DEFAULT_SETTINGS, ...systemDefaults(), ...load('settings', {}) }; }
export function saveSettings(settings) { save('settings', settings); }
