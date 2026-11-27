import { apiFetch } from './apiFetch.js';

/** Cierra la sesión en el servidor (si no hay red, la cookie caduca sola). */
export async function requestLogout() {
  try { await apiFetch('logout.php', { method: 'POST', body: {} }); } catch { /* sin red */ }
}
