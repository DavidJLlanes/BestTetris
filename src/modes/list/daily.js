import { seededRandom } from '../../util/seededRandom.js';
import { dailySeed } from '../../util/dailySeed.js';

/** Desafío diario: un Sprint 40 con la misma secuencia de piezas para todos durante el día. */
export default {
  id: 'daily',
  order: 9,
  name: 'Desafío diario',
  description: 'Las mismas piezas para todos hoy',
  icon: '☀',
  record: 'time',
  rules: { levelUp: false, goalLines: 40 },
  createRng: () => seededRandom(dailySeed()),
  recordKey: () => `daily-${dailySeed()}`,
};
