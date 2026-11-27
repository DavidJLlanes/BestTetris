/** ¿Se está jugando como app instalada (desde la pantalla de inicio)? */
export function isInstalled() {
  const mm = (q) => window.matchMedia && matchMedia(q).matches;
  return navigator.standalone === true || mm('(display-mode: standalone)') || mm('(display-mode: fullscreen)');
}
