import { getJourney } from '../progress/journeyStore.js';
import { isOpen, shopOpen } from '../progress/unlocks.js';
import { starsOf } from '../progress/stars.js';

/** Estado de una parada para dibujarla: 'locked', 'open' o 'done' (y sus estrellas). */
export function nodeStatus(node) {
  const p = getJourney();
  if (node.kind === 'shop') return { state: shopOpen(node.tramo, p) ? 'open' : 'locked', stars: 0 };
  const stars = starsOf(p, node.id);
  if (stars > 0) return { state: 'done', stars };
  return { state: isOpen(node.level, p) ? 'open' : 'locked', stars: 0 };
}
