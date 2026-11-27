import { apiFetch } from './apiFetch.js';

/**
 * Sube el progreso partiendo de la versión baseRev.
 * Devuelve { ok: true, rev } o, si otro dispositivo subió antes, { ok: false, remote: { rev, save } }.
 */
export async function pushRemote(baseRev, save, { keepalive = false } = {}) {
  const r = await apiFetch('progreso.php', { method: 'PUT', body: { baseRev, save }, keepalive, timeout: 15000 });
  if (r.status === 401) throw Object.assign(new Error('sesión'), { auth: true });
  if (r.status === 409 && r.body) return { ok: false, remote: { rev: r.body.rev || 0, save: r.body.save || null } };
  if (r.status !== 200 || !r.body) throw new Error((r.body && r.body.error) || 'servidor');
  return { ok: true, rev: r.body.rev };
}
