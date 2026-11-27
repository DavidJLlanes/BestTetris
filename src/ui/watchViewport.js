import { app } from '../app/state.js';
import { detectDevice } from './layout.js';
import { resize } from '../render/resize.js';
import { pause } from '../app/pause.js';
import { pinViewport } from './pinViewport.js';

/**
 * Reajusta todo cuando cambia el tamaño o la orientación (incluida la barra
 * dinámica del navegador móvil). En un móvil en horizontal, pausa la partida.
 */
export function watchViewport(canvases) {
  let pending = false;
  const apply = () => {
    pending = false;
    pinViewport();
    const d = detectDevice();
    resize(canvases, d);
    if (d.phone && d.landscape && (app.screen === 'play' || app.screen === 'countdown')) pause();
  };
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(apply); } };
  addEventListener('resize', schedule);
  addEventListener('orientationchange', schedule);
  if (window.visualViewport) {
    visualViewport.addEventListener('resize', schedule);
    visualViewport.addEventListener('scroll', pinViewport);
  }
  addEventListener('scroll', pinViewport, { passive: true });
  // Red de seguridad: si algo cambia el área visible sin avisar, se recoloca en menos de un segundo
  let lastKey = '';
  setInterval(() => {
    const vv = window.visualViewport;
    const key = `${innerWidth}x${innerHeight}|${vv ? `${vv.width}x${vv.height}+${vv.offsetTop}` : ''}|${scrollY}`;
    if (key !== lastKey) { lastKey = key; schedule(); }
  }, 700);
  apply();
}
