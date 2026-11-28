import { startGame } from '../app/startGame.js';
import { makeLevelMode } from './mode/makeLevelMode.js';
import { getJourney, saveJourney } from './progress/journeyStore.js';
import { fuelNow, addFuel } from './progress/fuel.js';
import { owned } from './progress/wallet.js';
import { isOpen } from './progress/unlocks.js';
import { noFuel } from './ui/noFuel.js';

/**
 * Despega hacia una constelación. Cuesta 1 de combustible (se devuelve si ganas; en modo calma
 * no cuesta nada) y se lleva los poderes elegidos (los que no se usen vuelven al terminar).
 * Devuelve false si no se puede (cerrada o sin combustible).
 */
export function launchLevel(level, bag = []) {
  const p = getJourney();
  if (!isOpen(level, p) || (!p.calm && fuelNow(p).n <= 0)) return false;
  const take = bag.filter((id, i) => owned(p, id) > bag.slice(0, i).filter((x) => x === id).length);
  take.forEach((id) => { p.used[id] = (p.used[id] || 0) + 1; });
  if (!p.calm) addFuel(p, -1);
  p.at = level.id;
  saveJourney();
  const mode = makeLevelMode(level, take);
  mode.fuelPaid = !p.calm;
  mode.relaunch = () => { if (!launchLevel(level, take)) noFuel(level); };
  startGame(mode);
  return true;
}
