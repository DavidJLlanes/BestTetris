import { on } from '../app/bus.js';
import { getProfile, saveProfile } from '../storage/profile.js';

/**
 * Lleva las estadísticas de por vida. Se actualizan en memoria durante la partida
 * y se guardan al terminar (escribir en disco en cada jugada podría dar tirones).
 */
export function trackProfile() {
  on('score', ({ game, lines = 0, tspin }) => {
    if (game.hooks.spectate) return;
    const p = getProfile();
    p.lines += lines;
    if (lines >= 4) p.quads++;
    if (tspin === 'full') p.tspins++;
  });
  on('lock', ({ game }) => { if (!game.hooks.spectate) getProfile().pieces++; });
  on('perfectClear', ({ game }) => { if (!game.hooks.spectate) getProfile().perfectClears++; });
  // 'finish' llega antes a este oyente que a los logros (se registra primero)
  on('finish', ({ game: g }) => {
    if (g.hooks.spectate) return; // ver una repetición no es jugar
    const p = getProfile();
    p.games++;
    p.playTime += g.time;
    p.maxLevel = Math.max(p.maxLevel, g.level);
    p.bestCombo = Math.max(p.bestCombo, g.stats.maxCombo);
    p.modesPlayed[g.mode] = (p.modesPlayed[g.mode] || 0) + 1;
    if (g.won) p.modesWon[g.mode] = (p.modesWon[g.mode] || 0) + 1;
    const puzzle = g.hooks.puzzle;
    if (g.won && puzzle && puzzle.set) p.puzzles[puzzle.id] = Math.min(p.puzzles[puzzle.id] ?? Infinity, g.time);
    if (g.won && puzzle && puzzle.custom) p.customSolved++;
    saveProfile();
  });
}
