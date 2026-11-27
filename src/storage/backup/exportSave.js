import { buildSave } from './buildSave.js';

/** Descarga un archivo .json con todo el progreso. No sale nada del dispositivo. */
export function exportSave(playerName = 'jugador') {
  const blob = new Blob([JSON.stringify(buildSave(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safe = playerName.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/gi, '-').replace(/^-|-$/g, '') || 'jugador';
  a.href = url;
  a.download = `prisma-${safe}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
