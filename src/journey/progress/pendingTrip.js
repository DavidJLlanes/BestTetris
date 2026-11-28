import { getJourney, saveJourney } from './journeyStore.js';
import { getLevel } from '../catalog.js';

/**
 * Viaje pendiente: al ganar se apunta, y la próxima vez que se abra el mapa (por el botón
 * «Continuar el viaje» o por cualquier otro camino) se celebra y la nave vuela. Solo vive en este dispositivo.
 */
export function savePendingTrip(r) {
  const p = getJourney();
  p.pending = r.won ? { id: r.level.id, stars: r.stars, prev: r.prev, firstWin: r.firstWin, notes: r.notes || [] } : null;
  saveJourney();
}

/** Recoge el viaje pendiente (y lo borra). Devuelve un resultado como el de recordResult, o null. */
export function takePendingTrip() {
  const p = getJourney();
  const t = p.pending;
  if (!t) return null;
  p.pending = null;
  saveJourney();
  const level = getLevel(t.id);
  return level ? { ...t, level, won: true } : null;
}
