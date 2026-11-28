import { getJourney } from '../../journey/progress/journeyStore.js';
import { totalStars } from '../../journey/progress/stars.js';

/**
 * Viaje: un mapa del espacio con 48 constelaciones reales (más 8 ocultas y una lluvia de
 * estrellas cada semana). La tarjeta del menú abre el mapa (src/journey); cada constelación es
 * una partida propia creada con makeLevelMode.
 */
export default {
  id: 'journey',
  order: 1.5,
  name: 'Viaje',
  description: '48 constelaciones por el espacio',
  icon: '✧',
  record: 'score',
  opensMap: true,
  bestLabel: () => { const s = totalStars(getJourney()); return s ? `★ ${s}` : '—'; },
  rules: { goalLines: 50, undo: 3, undoCost: 1000, star: true },
};
