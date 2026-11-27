import { app } from '../app/state.js';
import { detectDevice } from './layout.js';
import { resize } from '../render/resize.js';
import { pause } from '../app/pause.js';
import { pinViewport } from './pinViewport.js';
import { isTyping } from './isTyping.js';

/**
 * Reajusta todo cuando cambia el tamaño o la orientación (incluida la barra
 * dinámica del navegador móvil). En un móvil en horizontal, pausa la partida.
 */
export function watchViewport(canvases) {
  let pending = false;
  // Con el teclado abierto no se recoloca nada: lo visible encoge solo mientras se escribe
  // y el navegador debe poder mostrar el campo. Al cerrar el teclado se ajusta de nuevo.
  const pin = () => { if (!isTyping()) pinViewport(); };
  const apply = () => {
    pending = false;
    if (isTyping()) return;
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
    visualViewport.addEventListener('scroll', pin);
  }
  addEventListener('scroll', pin, { passive: true });
  // Al cerrar el teclado (sale el foco de un campo de texto) se recoloca todo
  document.addEventListener('focusout', (e) => { if (e.target.matches && e.target.matches('input:not([type=checkbox]):not([type=radio]):not([type=range]), textarea')) setTimeout(schedule, 50); });
  // Red de seguridad: si algo cambia el área visible sin avisar, se recoloca en menos de un segundo
  let lastKey = '';
  setInterval(() => {
    const vv = window.visualViewport;
    const key = `${innerWidth}x${innerHeight}|${vv ? `${vv.width}x${vv.height}+${vv.offsetTop}` : ''}|${scrollY}`;
    if (key !== lastKey) { lastKey = key; schedule(); }
  }, 700);
  apply();
}
