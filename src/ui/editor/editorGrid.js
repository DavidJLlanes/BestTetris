import { COLS } from '../../config/board.js';
import { COLORS } from '../../config/colors.js';
import { editor, ED_ROWS, saveDraft } from './editorState.js';

/** Color de fondo de una celda del editor. */
export const cellColor = (c) => (c === '.' ? '' : COLORS[c][0]);

function paintCell(el, c) {
  el.dataset.c = c;
  el.style.setProperty('--c', cellColor(c));
}

function setCell(grid, x, y, c) {
  const row = editor.rows[y];
  if (row[x] === c) return;
  editor.rows[y] = row.slice(0, x) + c + row.slice(x + 1);
  paintCell(grid.children[y * COLS + x], c);
}

export function renderGrid(grid) {
  editor.rows.forEach((row, y) => [...row].forEach((c, x) => paintCell(grid.children[y * COLS + x], c)));
}

/** Tablero del editor: toca o arrastra para pintar. Si empiezas sobre el mismo color, borra. */
export function bindGrid(grid, onChange) {
  grid.innerHTML = '<i></i>'.repeat(COLS * ED_ROWS);
  renderGrid(grid);
  let paint = null;
  const at = (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const i = el && el.parentNode === grid ? [...grid.children].indexOf(el) : -1;
    return i < 0 ? null : { x: i % COLS, y: Math.floor(i / COLS) };
  };
  grid.addEventListener('pointerdown', (e) => {
    const p = at(e);
    if (!p) return;
    e.preventDefault();
    grid.setPointerCapture(e.pointerId);
    paint = editor.rows[p.y][p.x] === editor.brush ? '.' : editor.brush;
    setCell(grid, p.x, p.y, paint);
  });
  grid.addEventListener('pointermove', (e) => { const p = paint && at(e); if (p) setCell(grid, p.x, p.y, paint); });
  const end = () => { if (paint) { paint = null; saveDraft(); onChange(); } };
  grid.addEventListener('pointerup', end);
  grid.addEventListener('pointercancel', end);
}
