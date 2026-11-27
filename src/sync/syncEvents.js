const listeners = new Set();

/** Avisos de la sincronización para la interfaz: 'busy', 'done', 'error'. */
export function onSync(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function emitSync(type, detail) { for (const fn of listeners) fn(type, detail); }
