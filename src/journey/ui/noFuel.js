import { goMenu } from '../../app/goMenu.js';
import { openJourney } from './openJourney.js';
import { openLevelCard } from './levelCard.js';

/** Sin combustible para repetir: vuelve al mapa con la ficha abierta, que explica qué hacer. */
export function noFuel(level) {
  goMenu();
  openJourney();
  setTimeout(() => openLevelCard(level), 700);
}
