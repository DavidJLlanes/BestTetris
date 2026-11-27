import { apiFetch } from './apiFetch.js';

/** Progreso de la cuenta: { rev, save }. Lanza { auth: true } si la sesión ya no vale. */
export async function fetchRemote(timeout) {
  const r = await apiFetch('progreso.php', { timeout });
  if (r.status === 401) throw Object.assign(new Error('sesión'), { auth: true });
  if (r.status !== 200 || !r.body) throw new Error('servidor');
  return { rev: r.body.rev || 0, save: r.body.save || null };
}
