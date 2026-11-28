import { $ } from '../../util/dom.js';
import { onOpen } from '../overlays.js';
import { onSync } from '../../sync/syncEvents.js';
import { runSync } from '../../sync/runSync.js';
import { loginAccount } from '../../sync/loginAccount.js';
import { logoutAccount } from '../../sync/logoutAccount.js';
import { reloadOnMenu } from '../../sync/reloadOnMenu.js';
import { renderAccount } from './renderAccount.js';

function status(text, ok = true) {
  const el = $('account-status');
  el.textContent = text;
  el.className = `status ${ok ? 'ok' : 'error'}`;
}

/** Recarga suave para enseñar el progreso fusionado (el menú vuelve a salir con todo). */
const showMerged = (text) => { status(text); setTimeout(reloadOnMenu, 900); };

/** Sección Cuenta del perfil: iniciar y cerrar sesión, y sincronizar a mano. */
export function bindAccountPanel() {
  const form = $('account-form'), user = $('account-user'), pass = $('account-pass'), btn = $('account-login');
  onOpen('ov-profile', () => { renderAccount(); status(''); });
  onSync((type, e) => renderAccount(type === 'busy', type === 'error' && (e || true)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!user.value.trim() || !pass.value) { status('Escribe tu usuario y tu contraseña', false); return; }
    btn.disabled = true; btn.textContent = 'Entrando…';
    const r = await loginAccount(user.value.trim(), pass.value);
    btn.disabled = false; btn.textContent = 'Iniciar sesión';
    if (!r.ok) { status(r.error, false); pass.select(); return; }
    pass.value = '';
    pass.blur(); user.blur();
    renderAccount();
    if (r.warning) status(r.warning, false);
    else if (r.changed) showMerged('Progreso fusionado con tu cuenta. Recargando…');
    else status('Sesión iniciada. Tu progreso ya está en tu cuenta.');
  });

  $('account-sync').addEventListener('click', async () => {
    try {
      const r = await runSync({ pull: true });
      if (r.changed) showMerged('Ha llegado progreso de otro dispositivo. Recargando…');
      else status('Todo sincronizado');
    } catch (e) { status(e.auth ? 'La sesión ha caducado. Vuelve a entrar.' : 'No se ha podido sincronizar. ¿Hay conexión?', false); renderAccount(); }
  });

  $('account-logout').addEventListener('click', async () => {
    await logoutAccount();
    renderAccount();
    status('Sesión cerrada. Tu progreso sigue en este dispositivo.');
  });
}
