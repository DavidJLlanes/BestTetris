import { SEASONS, seasonFor, yearFor } from '../seasons/seasonList.js';
import { raiseGarbage } from '../../core/game/raiseGarbage.js';

/** Aplica la estación que toca según las líneas; avisa con el evento 'season' al cambiar. */
function applySeason(g) {
  const s = seasonFor(g.lines);
  if (g.custom.season === s.id) return;
  const first = !g.custom.season;
  g.custom.season = s.id;
  // Cada año todo va un poco más deprisa
  const speedUp = Math.pow(0.85, yearFor(g.lines) - 1);
  Object.assign(g.rules, s.rules, { fixedInterval: s.rules.fixedInterval * speedUp });
  if (!first && s.enter === 'garbage') raiseGarbage(g, 1, g.random);
  g.emit('season', { season: s, year: yearFor(g.lines), first });
}

/** Estaciones: cada 10 líneas llega una estación nueva, con su ambiente y su propia regla. */
export default {
  id: 'seasons',
  order: 7.5,
  name: 'Estaciones',
  description: 'Cada 10 líneas cambia el tiempo',
  icon: '🍂',
  record: 'score',
  rules: { levelUp: false, ...SEASONS[0].rules },
  setup(g) { g.custom.season = null; },
  onTick(g) { if (!g.clearing && g.custom.season !== seasonFor(g.lines).id) applySeason(g); },
};
