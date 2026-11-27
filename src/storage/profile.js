import { load, save } from './store.js';

/** Estadísticas acumuladas de todas las partidas del jugador. */
const EMPTY = {
  games: 0, lines: 0, pieces: 0, quads: 0, tspins: 0, perfectClears: 0,
  playTime: 0, maxLevel: 1, bestCombo: 0, modesPlayed: {}, modesWon: {},
  puzzles: {}, // id del puzle resuelto → mejor tiempo
  xp: 0, // experiencia total (nivel y rango del jugador)
  seasonXp: {}, // experiencia por temporada: { 'AAAA-MM': xp }
  customSolved: 0,
};

let profile = null;

export function getProfile() {
  if (!profile) profile = { ...EMPTY, ...load('profile', {}) };
  return profile;
}
export function saveProfile() { if (profile) save('profile', profile); }
