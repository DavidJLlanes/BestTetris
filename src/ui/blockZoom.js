/**
 * Safari en iOS permite pellizcar para ampliar aunque la página lo prohíba.
 * Se cancela el gesto (y el doble toque fuera de botones) para que el juego no se mueva.
 * Además, fuera de las tarjetas que sí se desplazan, se cancela el arrastre: así Safari no
 * mueve la página ni encoge sus barras al deslizar sobre el tablero.
 */
export function blockZoom() {
  for (const ev of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(ev, (e) => e.preventDefault(), { passive: false });
  let lastTouch = 0;
  document.addEventListener('touchend', (e) => {
    const now = performance.now();
    if (now - lastTouch < 300 && !e.target.closest('input, select, textarea, button, label')) e.preventDefault();
    lastTouch = now;
  }, { passive: false });
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1 || !e.target.closest('.card, input, select, textarea')) e.preventDefault();
  }, { passive: false });
}
