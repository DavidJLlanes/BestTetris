/**
 * Fija la interfaz al área visible de verdad. Safari en iPhone puede cambiar su barra
 * inferior o desplazar la página en plena partida; entonces el alto de la página y el
 * área visible dejan de coincidir y los botones quedan fuera de la pantalla.
 * Aquí se anula cualquier desplazamiento de la página; el alto lo pone el CSS (100svh).
 */
export function pinViewport() {
  if (scrollX || scrollY) scrollTo(0, 0);
  const se = document.scrollingElement;
  if (se && se.scrollTop) se.scrollTop = 0;
}
