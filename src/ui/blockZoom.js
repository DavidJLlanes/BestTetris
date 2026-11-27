/**
 * Safari en iOS permite pellizcar para ampliar aunque la página lo prohíba.
 * Se cancela el gesto (y el doble toque fuera de botones) para que el juego no se mueva.
 */
export function blockZoom() {
  for (const ev of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(ev, (e) => e.preventDefault(), { passive: false });
  let lastTouch = 0;
  document.addEventListener('touchend', (e) => {
    const now = performance.now();
    if (now - lastTouch < 300 && !e.target.closest('input, select, textarea, button, label')) e.preventDefault();
    lastTouch = now;
  }, { passive: false });
}
