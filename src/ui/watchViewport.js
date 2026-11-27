import { app } from '../app/state.js';
import { detectDevice } from './layout.js';
import { resize } from '../render/resize.js';
import { pause } from '../app/pause.js';

/**
 * Reajusta todo cuando cambia el tamaño o la orientación (incluida la barra
 * dinámica del navegador móvil). En un móvil en horizontal, pausa la partida.
 */
export function watchViewport(canvases) {
  let pending = false;
  const apply = () => {
    pending = false;
    const d = detectDevice();
    resize(canvases, d);
    if (d.phone && d.landscape && (app.screen === 'play' || app.screen === 'countdown')) pause();
  };
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(apply); } };
  addEventListener('resize', schedule);
  addEventListener('orientationchange', schedule);
  if (window.visualViewport) visualViewport.addEventListener('resize', schedule);
  apply();
}
