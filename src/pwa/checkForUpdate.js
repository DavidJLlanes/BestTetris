/**
 * Busca una versión nueva del juego bajo demanda, con una sola petición ligera:
 * el navegador vuelve a pedir sw.js (unos 2 KB, revalidado) y lo compara con el instalado.
 * Si ha cambiado, el service worker nuevo se instala, se activa, borra las cachés viejas
 * y la página se recarga. Nada se consulta en segundo plano.
 * Devuelve 'updated' (va a recargar), 'latest' o 'offline'.
 */
export async function checkForUpdate() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') { location.reload(); return 'updated'; }
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) { location.reload(); return 'updated'; }
  try { await reg.update(); } catch { return 'offline'; }
  const worker = reg.installing || reg.waiting;
  if (!worker) return 'latest';
  await new Promise((done) => {
    if (worker.state === 'activated') { done(); return; }
    worker.addEventListener('statechange', () => { if (worker.state === 'activated' || worker.state === 'redundant') done(); });
    setTimeout(done, 8000); // por si el navegador no avisa
  });
  location.reload();
  return 'updated';
}
