/**
 * Comparte la imagen con la hoja de compartir del sistema; si no existe, la descarga.
 * Devuelve 'shared', 'downloaded' o 'cancelled'.
 */
export async function shareCard(canvas, name) {
  const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
  const file = new File([blob], `besttris-${name || 'progreso'}.png`.replace(/\s+/g, '-'), { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Mi progreso en BestTris', text: '¿Me superas en BestTris?' });
      return 'shared';
    } catch (e) {
      if (e && e.name === 'AbortError') return 'cancelled';
    }
  }
  downloadBlob(blob, file.name);
  return 'downloaded';
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
