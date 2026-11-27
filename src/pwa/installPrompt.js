import { $ } from '../util/dom.js';

/**
 * Botón "Instalar" en el menú cuando el navegador lo ofrece (Chrome, Edge, Android).
 * En iPhone se instala desde Compartir → Añadir a pantalla de inicio.
 */
export function bindInstallPrompt() {
  let deferred = null;
  const btn = $('btn-install');
  addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; btn.hidden = false; });
  btn.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice.catch(() => {});
    deferred = null;
    btn.hidden = true;
  });
  addEventListener('appinstalled', () => { btn.hidden = true; });
}
