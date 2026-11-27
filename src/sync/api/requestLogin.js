import { apiFetch } from './apiFetch.js';

/** Inicia sesión. Devuelve { ok, user } o { ok: false, error }. */
export async function requestLogin(usuario, clave) {
  try {
    const r = await apiFetch('login.php', { method: 'POST', body: { usuario, clave } });
    if (r.status === 200 && r.body && r.body.usuario) return { ok: true, user: r.body.usuario };
    if (r.body && r.body.error) return { ok: false, error: r.body.error };
    return { ok: false, error: 'El servidor de cuentas no responde bien. ¿Está instalado?' };
  } catch { return { ok: false, error: 'Sin conexión con el servidor.' }; }
}
