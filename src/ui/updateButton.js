import { $ } from '../util/dom.js';
import { playSfx } from '../audio/index.js';
import { showToast } from './toast.js';
import { checkForUpdate } from '../pwa/checkForUpdate.js';

const SPIN_MIN = 700; // el giro se ve completo aunque la respuesta llegue al instante

/** Botón de la pantalla principal: actualiza el juego a la última versión publicada. */
export function bindUpdateButton() {
  const btn = $('btn-update');
  btn.addEventListener('click', async () => {
    if (btn.classList.contains('spinning')) return;
    playSfx('ui');
    btn.classList.add('spinning');
    const t0 = performance.now();
    const result = await checkForUpdate().catch(() => 'offline');
    await new Promise((r) => setTimeout(r, Math.max(0, SPIN_MIN - (performance.now() - t0))));
    if (result === 'updated') return; // la página se recarga ya
    btn.classList.remove('spinning');
    const offline = result === 'offline';
    showToast({ icon: offline ? '⚠' : '✓', kicker: offline ? 'Sin conexión' : 'Actualizado', name: offline ? 'No se ha podido comprobar' : 'Ya tienes la última versión', desc: offline ? 'Prueba de nuevo cuando tengas conexión.' : 'No hay nada nuevo que descargar.', tier: 'bronze', color: offline ? '#ffb84f' : '#46e6ff' });
  });
}
