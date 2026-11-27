/** Teclado: código de tecla → acción. */
export const KEYMAP = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'soft', Space: 'hard',
  ArrowUp: 'cw', KeyX: 'cw', KeyZ: 'ccw', ControlLeft: 'ccw', ControlRight: 'ccw', KeyA: 'r180',
  KeyC: 'hold', ShiftLeft: 'hold', ShiftRight: 'hold',
  Backspace: 'undo', KeyU: 'undo',
  Escape: 'pause', KeyP: 'pause', KeyM: 'mute',
};

/** Mando con mapeo estándar (Xbox): índice de botón → acción. */
export const PAD_MAP = [
  [0, 'cw'], [1, 'ccw'], [2, 'ccw'], [3, 'r180'], [4, 'hold'], [5, 'hold'],
  [6, 'soft'], [7, 'hard'], [8, 'undo'], [9, 'pause'],
  [12, 'hard'], [13, 'soft'], [14, 'left'], [15, 'right'],
];

/** Mando en menús. */
export const PAD_MENU = { up: 12, down: 13, left: 14, right: 15, confirm: 0, back: 1, start: 9 };

export const STICK = { deadzone: 0.5, softDrop: 0.6, up: 0.75 };
export const MENU_REPEAT = { first: 0.35, next: 0.1 };
