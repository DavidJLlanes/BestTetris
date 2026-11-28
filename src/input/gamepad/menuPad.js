import { PAD_MENU, MENU_REPEAT } from '../../config/controls.js';
import { pad } from './state.js';
import { button } from './readPad.js';
import { STICK } from '../../config/controls.js';

// En menús el stick responde igual en las cuatro direcciones (en partida, arriba pide más recorrido)
const menuStick = (gp) => { const x = gp.axes[0] || 0, y = gp.axes[1] || 0, d = STICK.deadzone; return { left: x < -d, right: x > d, up: y < -d, down: y > d }; };
import { menuMove, menuConfirm, menuAdjust, menuBack, menuStart } from '../../ui/menuNav.js';

/** Mando en menús: cruceta o stick para moverse por la pantalla, A para aceptar, B para volver. */
export function menuPad(gp, dt, entering) {
  const stick = menuStick(gp);
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

  if (edge('down') || (repeat && st.down)) menuMove('down');
  if (edge('up') || (repeat && st.up)) menuMove('up');
  if (edge('left') || (repeat && st.left)) menuAdjust(-1);
  if (edge('right') || (repeat && st.right)) menuAdjust(1);
  if (edge('confirm')) menuConfirm();
  if (edge('back')) menuBack();
  if (edge('start')) menuStart();
  pad.menuHeld = st;
}
