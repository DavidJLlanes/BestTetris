/** ¿Deja el navegador poner la página a pantalla completa? (Safari de iPhone no: solo vídeos). */
export function canFullscreen() {
  const d = document, el = d.documentElement;
  return !!(d.fullscreenEnabled || d.webkitFullscreenEnabled) && !!(el.requestFullscreen || el.webkitRequestFullscreen);
}
