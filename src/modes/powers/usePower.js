import { POWERS } from './powerList.js';

/** Usa el poder cargado, si lo hay. Devuelve true si se usó. */
export function usePower(g) {
  const c = g.custom;
  if (!g.hooks.powers || g.over || g.clearing || !c.power) return false;
  const power = POWERS[c.power];
  if (!power.use(g)) { g.emit('powerFail', { power }); return false; }
  g.emit('power', { id: c.power, power });
  c.power = null;
  c.charge = 0;
  g.stats.powers = (g.stats.powers || 0) + 1;
  return true;
}
