import { requestLogin } from './api/requestLogin.js';
import { loadMeta, saveMeta } from './syncMeta.js';
import { stashLocal } from './stashLocal.js';
import { runSync } from './runSync.js';
import { nameFromAccount } from './nameFromAccount.js';

/**
 * Inicia sesión y fusiona el progreso de este dispositivo con el de la cuenta, sin perder nada.
 * Devuelve { ok, user, changed } o { ok: false, error }.
 */
export async function loginAccount(usuario, clave) {
  const r = await requestLogin(usuario, clave);
  if (!r.ok) return r;
  const meta = loadMeta();
  const stashed = Boolean(meta.lastUser && meta.lastUser !== r.user);
  if (stashed) stashLocal(meta.lastUser);
  saveMeta({ user: r.user, lastUser: r.user, rev: 0, dirty: true, expired: false });
  try {
    const s = await runSync({ pull: true });
    const named = nameFromAccount(r.user); // se sube solo unos segundos después
    return { ok: true, user: r.user, changed: s.changed || stashed || named };
  } catch (e) {
    return { ok: true, user: r.user, changed: stashed, warning: e.message && !e.auth ? e.message : 'Sesión iniciada; se sincronizará en cuanto haya conexión.' };
  }
}
