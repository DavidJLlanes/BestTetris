/** ¿Está ahora mismo la página a pantalla completa? */
export function isFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}
