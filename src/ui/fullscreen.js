/** Pantalla completa y, en móvil, intento de bloquear la orientación vertical. */
export async function toggleFullscreen() {
  const doc = document;
  try {
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      await (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
      return;
    }
    const el = doc.documentElement;
    await (el.requestFullscreen || el.webkitRequestFullscreen).call(el, { navigationUI: 'hide' });
    lockPortrait();
  } catch { /* el navegador no lo permite */ }
}

/** Solo funciona en pantalla completa o como app instalada; si no, lo resuelve el aviso de giro. */
export function lockPortrait() {
  try { screen.orientation && screen.orientation.lock && screen.orientation.lock('portrait').catch(() => {}); } catch { /* nada */ }
}
