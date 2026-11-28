import { $ } from '../../util/dom.js';
import { loadMeta } from '../../sync/syncMeta.js';
import { timeAgo } from './timeAgo.js';

/** Pinta la sección Cuenta según el estado: sin sesión, sincronizando, al día, pendiente o con error (failed: el error, si se conoce). */
export function renderAccount(busy = false, failed = false) {
  const m = loadMeta(), box = $('account');
  const state = !m.user ? 'off' : busy ? 'busy' : failed ? 'error' : m.dirty ? 'pending' : 'ok';
  box.dataset.state = state;
  $('account-form').hidden = Boolean(m.user);
  $('account-actions').hidden = !m.user;
  if (!m.user) {
    $('account-title').textContent = m.expired ? 'La sesión ha caducado' : 'Tu progreso en todos tus dispositivos';
    $('account-sub').textContent = m.expired
      ? 'Vuelve a iniciar sesión para seguir sincronizando. Tu progreso sigue aquí.'
      : 'Inicia sesión para sincronizarlo. Sin sesión, todo sigue guardado en este navegador.';
    if (m.lastUser && !$('account-user').value) $('account-user').value = m.lastUser;
    return;
  }
  $('account-title').textContent = `Conectado como ${m.user}`;
  $('account-sub').textContent = {
    busy: 'Sincronizando…',
    error: failed && failed.message && failed.message.length > 20 ? failed.message : 'Sin conexión con el servidor. Se subirá en cuanto vuelva.',
    pending: 'Hay cambios esperando para subirse.',
    ok: m.lastSync ? `Todo sincronizado · ${timeAgo(m.lastSync)}` : 'Todo sincronizado',
  }[state];
}
