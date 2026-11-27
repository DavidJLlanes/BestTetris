import { safeArea } from '../util/safeArea.js';
import { isInstalled } from './install/isInstalled.js';

/**
 * Ajusta la aplicación exactamente a la zona que el jugador ve, en cualquier pantalla.
 * Safari de iOS 26 extiende la página bajo la isla dinámica y bajo su barra flotante:
 * visualViewport da el alto visible pero empezando en el borde de arriba (bajo la isla),
 * y lo que cae detrás de la barra de abajo no se dibuja. Por eso:
 *  - arriba siempre se deja el margen seguro (isla o notch);
 *  - el alto es el visible más ese margen, sin pasar del alto de la pantalla;
 *  - abajo solo se deja margen si la aplicación llega al borde inferior.
 * Instalada como app no hay barras del navegador: ocupa la pantalla entera, con los dos márgenes.
 */
export function pinViewport() {
  if (scrollX || scrollY) scrollTo(0, 0);
  const se = document.scrollingElement;
  if (se && se.scrollTop) se.scrollTop = 0;
  const vv = window.visualViewport;
  const sa = safeArea();
  const visible = vv && vv.scale <= 1.01 ? vv.height : innerHeight;
  const portrait = innerHeight >= innerWidth;
  const screenH = portrait ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
  const limit = Math.max(innerHeight, screenH || 0);
  const installed = isInstalled();
  const h = installed ? limit : Math.min(limit, visible + sa.top);
  const reachesBottom = h >= limit - 1;
  document.documentElement.classList.toggle('installed', installed);
  const root = document.documentElement.style;
  root.setProperty('--fill-h', `${Math.round(limit)}px`);
  root.setProperty('--app-h', `${Math.round(h)}px`);
  root.setProperty('--app-top', '0px');
  root.setProperty('--pad-t', `${sa.top}px`);
  root.setProperty('--pad-b', `${reachesBottom ? sa.bottom : 0}px`);
}
