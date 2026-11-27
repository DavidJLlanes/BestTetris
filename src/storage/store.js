const PREFIX = 'prisma.';

/** Lee un valor guardado; si no existe o el navegador no deja, devuelve el valor por defecto. */
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch { return fallback; }
}

/** Guarda un valor; si el navegador no deja (modo privado), no pasa nada. */
export function save(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* sin almacenamiento */ }
}
