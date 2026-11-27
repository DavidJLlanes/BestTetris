const PREFIX = 'prisma.';
const listeners = [];
const replaced = [];

/** Lee un valor guardado; si no existe o el navegador no deja, devuelve el valor por defecto. */
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}

/**
 * Guarda un valor; si el navegador no deja (modo privado), no pasa nada.
 * Avisa a quien escuche (la sincronización) salvo con { silent: true }.
 */
export function save(key, value, { silent = false } = {}) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* sin almacenamiento */ }
  if (!silent) for (const fn of listeners) fn(key);
}

/** Borra un valor guardado sin avisar. */
export function remove(key) {
  try { localStorage.removeItem(PREFIX + key); } catch { /* sin almacenamiento */ }
}

/** Llama a fn(clave) cada vez que el juego guarda algo. */
export function onSave(fn) { listeners.push(fn); }

/** Llama a fn cuando el progreso se sustituye entero (al traerlo de la cuenta): las cachés en memoria se tiran. */
export function onReplace(fn) { replaced.push(fn); }
export function notifyReplace() { for (const fn of replaced) fn(); }
