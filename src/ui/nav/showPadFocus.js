import { topOverlay } from '../overlays.js';
import { navItems } from './navItems.js';
import { padFocus } from './padFocus.js';

/** Al conectar el mando en un menú: enciende el aro de foco donde esté el foco (o en lo primero). */
export function showPadFocus() {
  const top = topOverlay();
  if (!top) return;
  const list = navItems(top);
  const at = list.includes(document.activeElement) ? document.activeElement : list.find((el) => el.hasAttribute('autofocus')) || list[0];
  padFocus(at, false);
}
