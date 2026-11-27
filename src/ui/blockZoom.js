import { resetZoom } from './resetZoom.js';

/**
 * Safari en iOS permite pellizcar para ampliar, hacer doble toque y desplazar la página aunque
 * la página lo prohíba en el meta viewport. Aquí se cierra cada puerta:
 *  - touchstart cancelado en el área de juego (tablero, paneles, botones y fondo): así iOS no
 *    empieza ningún gesto propio (pellizco, desplazamiento, doble toque) con dedos que caen ahí.
 *    El juego usa eventos pointer, que siguen llegando.
 *  - touchmove cancelado fuera de las tarjetas que sí se desplazan, y siempre con 2 o más dedos.
 *  - gesturestart/change/end (pellizco de Safari) cancelados.
 *  - doble toque cancelado fuera de botones y campos.
 *  - si aun así la página acaba ampliada, se devuelve a escala 1 (resetZoom).
 */
const FREE = '.overlay, .topbar, .card, input, select, textarea, a, label, button:not(#touch button)';

export function blockZoom() {
  const opts = { passive: false };
  for (const ev of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(ev, (e) => e.preventDefault(), opts);
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1 || !e.target.closest(FREE)) e.preventDefault();
  }, opts);
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1 || !e.target.closest('.card, input, select, textarea')) e.preventDefault();
  }, opts);
  let lastTouch = 0;
  document.addEventListener('touchend', (e) => {
    const now = performance.now();
    if (now - lastTouch < 300 && !e.target.closest('input, select, textarea, button, label')) e.preventDefault();
    lastTouch = now;
  }, opts);
  if (window.visualViewport) {
    const check = () => { if (visualViewport.scale > 1.01) resetZoom(); };
    visualViewport.addEventListener('resize', check);
    visualViewport.addEventListener('scroll', check);
  }
}
