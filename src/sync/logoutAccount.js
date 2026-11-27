import { requestLogout } from './api/requestLogout.js';
import { runSync } from './runSync.js';
import { saveMeta } from './syncMeta.js';

/** Sube lo pendiente y cierra la sesión. El progreso se queda también en este dispositivo. */
export async function logoutAccount() {
  try { await runSync({ pull: false }); } catch { /* sin red: lo pendiente se queda aquí */ }
  await requestLogout();
  saveMeta({ user: null, rev: 0, dirty: false, expired: false });
}
