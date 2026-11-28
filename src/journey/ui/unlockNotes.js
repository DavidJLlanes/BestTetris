import { MAIN, HIDDEN } from '../catalog.js';
import { TRAMOS } from '../tramos.js';
import { isOpen, shopOpen } from '../progress/unlocks.js';

/** Foto de lo que está abierto (desvíos, planetas y tramos), para saber qué se abrió al jugar. */
export function unlockSnapshot(p) {
  return {
    hidden: HIDDEN.filter((l) => isOpen(l, p)).map((l) => l.id),
    shops: TRAMOS.map((_, i) => shopOpen(i, p)),
    tramos: TRAMOS.map((_, i) => isOpen(MAIN[i * 6], p)),
  };
}

/** Avisos de lo que se acaba de abrir (para el mapa). */
export function unlockNotes(before, after) {
  const notes = [];
  after.hidden.filter((id) => !before.hidden.includes(id)).forEach(() => notes.push('¡Desvío abierto! Una constelación oculta te espera'));
  after.shops.forEach((on, i) => { if (on && !before.shops[i] && TRAMOS[i].planet) notes.push(`${TRAMOS[i].planet.name}: ya puedes aterrizar en la tienda`); });
  after.tramos.forEach((on, i) => { if (on && !before.tramos[i] && i) notes.push(`Nuevo tramo: ${TRAMOS[i].name}`); });
  return notes;
}
