import { load, save, onReplace } from '../../storage/store.js';

/**
 * Progreso del Viaje (clave «journey» del guardado, se sincroniza con la cuenta):
 * levels: { id: { stars, best, plays, wins, time } } · earned/spent: polvo estelar ganado y gastado ·
 * bought/used: poderes comprados y usados por id · fuel: { n, at } combustible y cuándo se midió ·
 * calm: modo calma (sin combustible) · events: { semana: { id, stars } } · seen: constelaciones ya
 * celebradas en el mapa · at: última constelación visitada ·
 * totals: elementos recogidos en total · streak/bestStreak: victorias seguidas.
 */
const EMPTY = () => ({ levels: {}, earned: 0, spent: 0, bought: {}, used: {}, fuel: null, calm: false, events: {}, seen: {}, at: null, totals: {}, streak: 0, bestStreak: 0 });

let cache = null;
onReplace(() => { cache = null; });

export function getJourney() {
  if (!cache) cache = { ...EMPTY(), ...load('journey', {}) };
  return cache;
}

export function saveJourney() { if (cache) save('journey', cache); }

/** Entrada de una constelación (la crea vacía si hace falta). */
export function levelEntry(p, id) {
  if (!p.levels[id]) p.levels[id] = { stars: 0, best: 0, plays: 0, wins: 0, time: 0 };
  return p.levels[id];
}
