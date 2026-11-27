/**
 * Fija la interfaz al área visible de verdad. Safari en iPhone puede cambiar su barra
 * inferior o desplazar la página en plena partida; entonces el alto de la página y el
 * área visible dejan de coincidir y los botones quedan fuera de la pantalla.
 * Aquí se pega la aplicación a lo visible (alto y desplazamiento) y se anula cualquier scroll.
 */
export function pinViewport() {
  if (scrollX || scrollY) scrollTo(0, 0);
  const se = document.scrollingElement;
  if (se && se.scrollTop) se.scrollTop = 0;
  const vv = window.visualViewport;
  const root = document.documentElement.style;
  const h = vv ? vv.height : innerHeight;
  const top = vv && vv.scale <= 1.01 ? Math.max(0, vv.offsetTop) : 0;
  root.setProperty('--app-h', `${Math.round(h)}px`);
  root.setProperty('--app-top', `${Math.round(top)}px`);
}
