import { app } from '../app/state.js';
import { iosHaptic } from './iosHaptic.js';

/** Vibración corta del móvil (Android con vibrate; en iPhone, el toque háptico del interruptor). */
export function vibrate(ms) {
  if (!app.settings.haptics || !app.device.touch) return;
  if (!navigator.vibrate) { if (navigator.maxTouchPoints > 0 && /iP(hone|ad|od)|Macintosh/.test(navigator.userAgent)) iosHaptic(); return; }
  try { navigator.vibrate(ms); } catch { /* sin vibración */ }
}
