import { app } from '../app/state.js';
import { decor } from './state.js';

/** Profundidad: el ratón en PC o la inclinación del móvil mueven las capas un poco. */
export function bindParallax() {
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    decor.tx = (e.clientX / innerWidth) * 2 - 1;
    decor.ty = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
  addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    decor.tx = Math.max(-1, Math.min(1, e.gamma / 25));
    decor.ty = Math.max(-1, Math.min(1, (e.beta - 40) / 25));
  });
}

/** iPhone pide permiso para leer la inclinación: solo se pide al activar la opción en Ajustes. */
export function askTiltPermission() {
  const D = window.DeviceOrientationEvent;
  if (app.device.touch && D && typeof D.requestPermission === 'function') D.requestPermission().catch(() => {});
}
