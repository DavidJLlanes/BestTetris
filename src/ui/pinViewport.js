import { safeArea } from '../util/safeArea.js';

/**
 * Ajusta la aplicación exactamente a la zona que el jugador ve.
 * En Safari de iPhone (iOS 26) 100vh, 100svh y 100dvh pueden incluir la franja que queda
 * detrás de la barra flotante, y lo que cae ahí ni siquiera se dibuja. La única medida fiable
 * de lo visible es visualViewport: se usa su alto y su posición.
 * Los márgenes seguros (isla dinámica, barra de inicio) solo se suman si lo visible llega
 * hasta los bordes de la pantalla (app instalada o pantalla completa); si Safari ya deja
 * sus barras fuera de lo visible, sumarlos restaría el mismo hueco dos veces.
 */
export function pinViewport() {
  if (scrollX || scrollY) scrollTo(0, 0);
  const se = document.scrollingElement;
  if (se && se.scrollTop) se.scrollTop = 0;
  const vv = window.visualViewport;
  const h = vv ? vv.height : innerHeight;
  const top = vv && vv.scale <= 1.01 ? Math.max(0, vv.offsetTop) : 0;
  const sa = safeArea();
  const portrait = innerHeight >= innerWidth;
  const screenH = portrait ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
  const barsOutside = sa.top + sa.bottom > 0 && screenH - h >= sa.top + sa.bottom - 1;
  const root = document.documentElement.style;
  root.setProperty('--app-h', `${Math.round(h)}px`);
  root.setProperty('--app-top', `${Math.round(top)}px`);
  root.setProperty('--pad-t', `${barsOutside ? 0 : sa.top}px`);
  root.setProperty('--pad-b', `${barsOutside ? 0 : sa.bottom}px`);
}
