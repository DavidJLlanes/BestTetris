import { load, save } from '../storage/store.js';

/**
 * Estado de la sincronización en este dispositivo (no forma parte de la copia):
 * user = cuenta con sesión, lastUser = última cuenta usada aquí, rev = versión de la cuenta que ya tenemos,
 * dirty = hay cambios sin subir, lastSync = cuándo se sincronizó por última vez.
 */
export const loadMeta = () => ({ user: null, lastUser: null, rev: 0, dirty: false, lastSync: 0, ...load('sync', {}) });
export const saveMeta = (patch) => save('sync', { ...loadMeta(), ...patch }, { silent: true });
