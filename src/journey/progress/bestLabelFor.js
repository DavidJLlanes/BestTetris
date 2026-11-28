import { formatNumber } from '../../util/formatNumber.js';
import { getJourney } from './journeyStore.js';

/** Mejor marca de una constelación para el marcador ("—" si nunca se jugó). */
export function bestLabelFor(level) {
  const e = getJourney().levels[level.id];
  return e && e.best ? formatNumber(e.best) : '—';
}
