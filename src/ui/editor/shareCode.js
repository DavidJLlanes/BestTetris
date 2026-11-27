/** Copia texto o lo comparte con el menú del sistema. Devuelve un mensaje para el jugador. */
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return 'Copiado. Pégalo donde quieras.'; } catch { return null; }
}

export async function shareLink(url, title) {
  if (navigator.share) {
    try { await navigator.share({ title, text: `Resuelve mi puzle de PRISMA: ${title}`, url }); return 'Enlace compartido.'; } catch (e) { if (e.name === 'AbortError') return ''; }
  }
  return (await copyText(url)) && 'Enlace copiado. Pégalo donde quieras.';
}

/** Enlace a esta misma página con el puzle dentro (nada pasa por un servidor). */
export const puzzleUrl = (code) => `${location.origin}${location.pathname}?puzzle=${code}`;
