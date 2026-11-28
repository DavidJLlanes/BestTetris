import { buildSave } from '../storage/backup/buildSave.js';
import { stableJson } from '../util/stableJson.js';
import { mergeData } from './merge/mergeData.js';
import { mergeStamps } from './merge/mergeStamps.js';
import { fetchRemote } from './api/fetchRemote.js';
import { pushRemote } from './api/pushRemote.js';
import { readRemote } from './readRemote.js';
import { applyData } from './applyData.js';
import { loadMeta, saveMeta } from './syncMeta.js';
import { loadStamps, saveStamps } from './stamps.js';

const same = (a, b) => stableJson(a) === stableJson(b);

/** Junta lo local con lo de la cuenta. Devuelve la copia a subir y si ha cambiado algo aquí. */
function combine(remote) {
  const local = buildSave(), stamps = loadStamps();
  const r = remote && readRemote(remote.save);
  if (!r) return { out: { ...local, stamps }, changed: false, upToDate: false };
  const data = mergeData(local.data, r.data, stamps, r.stamps), st = mergeStamps(stamps, r.stamps);
  const changed = !same(data, local.data);
  if (changed) applyData(data);
  saveStamps(st);
  return { out: { ...local, data, stamps: st }, changed, upToDate: same(data, r.data) };
}

/**
 * Sincroniza con la cuenta: baja (si pull), fusiona, guarda aquí y sube si hace falta.
 * Si otro dispositivo subió a la vez, vuelve a fusionar con lo suyo. Devuelve { state, changed }.
 */
export async function syncNow({ pull = true, timeout, keepalive = false } = {}) {
  const meta = loadMeta();
  if (!meta.user) return { state: 'off', changed: false };
  if (!pull && !meta.dirty) return { state: 'ok', changed: false };
  saveMeta({ dirty: false }); // lo que se guarde mientras tanto lo vuelve a marcar
  let remote = pull ? await fetchRemote(timeout).catch(fail) : null, changed = false;
  if (remote && remote.user && remote.user !== meta.user) saveMeta({ user: remote.user, lastUser: remote.user }); // cuenta renombrada
  for (let i = 0; i < 4; i++) {
    const c = combine(remote);
    changed = changed || c.changed;
    if (c.upToDate) { saveMeta({ rev: remote.rev, lastSync: Date.now() }); return { state: 'ok', changed }; }
    const res = await pushRemote(remote ? remote.rev : meta.rev, c.out, { keepalive }).catch(fail);
    if (res.ok) { saveMeta({ rev: res.rev, lastSync: Date.now() }); return { state: 'ok', changed }; }
    remote = res.remote;
  }
  return fail(new Error('conflicto'));
}

/** Si algo falla, lo pendiente sigue pendiente; si la sesión caducó, se avisa al jugador. */
function fail(e) {
  saveMeta(e && e.auth ? { dirty: true, user: null, expired: true } : { dirty: true });
  throw e;
}
