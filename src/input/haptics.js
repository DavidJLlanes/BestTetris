import { app } from '../app/state.js';

/** Vibración corta del móvil (Android; iOS no la permite desde la web). */
export function vibrate(ms) {
  if (!app.settings.haptics || !app.device.touch || !navigator.vibrate) return;
  try { navigator.vibrate(ms); } catch { /* sin vibración */ }
}
