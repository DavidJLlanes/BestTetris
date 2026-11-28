import { scrollParent } from '../fields/scrollParent.js';
import { topOverlay } from '../overlays.js';

/**
 * Sin nada más que elegir hacia arriba o abajo (listas de trofeos, textos largos), el mando
 * desplaza el panel. Devuelve true si se ha podido mover.
 */
export function scrollPanel(dir, from = document.activeElement) {
  const top = topOverlay();
  const box = (from && top && top.contains(from) && scrollParent(from)) || (top && top.querySelector('.card'));
  if (!box || box.scrollHeight <= box.clientHeight + 2) return false;
  const before = box.scrollTop;
  box.scrollBy({ top: (dir === 'down' ? 1 : -1) * box.clientHeight * 0.45, behavior: 'smooth' });
  return box.scrollTop !== before || (dir === 'down' ? before + box.clientHeight < box.scrollHeight - 2 : before > 0);
}
