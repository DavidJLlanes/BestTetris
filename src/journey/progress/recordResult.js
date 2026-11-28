import { getJourney, saveJourney, levelEntry } from './journeyStore.js';
import { starsFor } from '../challenges/starsFor.js';
import { rewardFor } from './rewardFor.js';
import { addFuel } from './fuel.js';
import { eventOfWeek } from './eventOfWeek.js';

/**
 * Apunta el resultado de una constelación: estrellas (se queda la mejor), marca, polvo ganado
 * combustible devuelto si se gana y poderes sin usar devueltos. Devuelve el resumen para la pantalla.
 */
export function recordResult(level, g) {
  const p = getJourney();
  const e = levelEntry(p, level.id);
  const stars = starsFor(g, level), prev = e.stars;
  const reward = rewardFor(level, stars, prev, g.score);
  e.plays++;
  if (stars) { e.wins++; e.time = e.time ? Math.min(e.time, g.time) : g.time; }
  e.stars = Math.max(prev, stars);
  const best = g.score > e.best;
  e.best = Math.max(e.best, g.score);
  p.earned += reward;
  if (stars && g.hooks.fuelPaid) addFuel(p, 1); // ganar devuelve el combustible del despegue
  const left = [...(g.custom.bag || []), ...(g.custom.power ? [g.custom.power] : [])];
  left.forEach((id) => { p.used[id] = Math.max(0, (p.used[id] || 0) - 1); }); // poderes sin usar: vuelven
  if (level.kind === 'event') {
    const week = eventOfWeek().week;
    const ev = p.events[week] || { id: level.id, stars: 0 };
    ev.stars = Math.max(ev.stars, stars);
    p.events[week] = ev;
  }
  const j = g.custom.j || {};
  p.totals = p.totals || {};
  for (const k of ['astros', 'dust', 'ice', 'shooting', 'holes', 'comets']) p.totals[k] = (p.totals[k] || 0) + (j[k] || 0);
  p.streak = stars ? (p.streak || 0) + 1 : 0;
  p.bestStreak = Math.max(p.bestStreak || 0, p.streak);
  p.at = level.id;
  saveJourney();
  return { level, stars, prev, reward, best, won: stars > 0, firstWin: stars > 0 && prev === 0 };
}
