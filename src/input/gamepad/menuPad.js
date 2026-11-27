import { PAD_MENU, MENU_REPEAT } from '../../config/controls.js';
import { pad } from './state.js';
import { button, stickDirs } from './readPad.js';
import { menuNavigate, menuConfirm, menuAdjust, menuBack, menuStart } from '../../ui/menuNav.js';

/** Mando en menús: cruceta para moverse, A para aceptar, B para volver. */
export function menuPad(gp, dt, entering) {
  const stick = stickDirs(gp);
  const st = {
    up: button(gp, PAD_MENU.up) || stick.up, down: button(gp, PAD_MENU.down) || stick.down,
    left: button(gp, PAD_MENU.left) || stick.left, right: button(gp, PAD_MENU.right) || stick.right,
    confirm: button(gp, PAD_MENU.confirm), back: button(gp, PAD_MENU.back), start: button(gp, PAD_MENU.start),
  };
  if (entering) { pad.menuHeld = st; return; }
  const edge = (k) => st[k] && !pad.menuHeld[k];

  let repeat = false;
  if (st.up || st.down || st.left || st.right) {
    pad.menuRepeat += dt;
    if (pad.menuRepeat > MENU_REPEAT.first) { pad.menuRepeat -= MENU_REPEAT.next; repeat = true; }
  } else pad.menuRepeat = 0;

  if (edge('down') || (repeat && st.down)) menuNavigate(1);
  if (edge('up') || (repeat && st.up)) menuNavigate(-1);
  if (edge('left') || (repeat && st.left)) menuAdjust(-1);
  if (edge('right') || (repeat && st.right)) menuAdjust(1);
  if (edge('confirm')) menuConfirm();
  if (edge('back')) menuBack();
  if (edge('start')) menuStart();
  pad.menuHeld = st;
}
