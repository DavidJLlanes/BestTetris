/**
 * Llama a la API de cuentas del propio servidor (carpeta api/ junto al juego).
 * Devuelve { status, body }. Si no hay red o tarda demasiado, lanza un error.
 * keepalive (para subir al cerrar la app) solo vale con cuerpos pequeños: el navegador limita a 64 KB.
 */
export async function apiFetch(path, { method = 'GET', body, timeout = 8000, keepalive = false } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  const text = body ? JSON.stringify(body) : undefined;
  try {
    const res = await fetch(new URL(`api/${path}`, document.baseURI), {
      method, credentials: 'same-origin', cache: 'no-store', signal: ctrl.signal,
      keepalive: keepalive && text !== undefined && text.length < 60000,
      headers: { 'X-BestTris': '1', ...(text ? { 'Content-Type': 'application/json' } : {}) },
      body: text,
    });
    let data = null;
    try { data = await res.json(); } catch { /* respuesta sin JSON: servidor sin PHP */ }
    return { status: res.status, body: data };
  } finally { clearTimeout(timer); }
}
