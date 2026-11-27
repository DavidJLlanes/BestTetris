import { view } from '../../render/view.js';
import { buildVersusDom } from './buildVersusDom.js';
import { layoutVersus } from './layoutVersus.js';

const ui = { parts: null, cell: 0, key: '' };

/** Lienzos del modo a dos, recalculados si cambia el tamaño de la ventana. */
export function screenUi() {
  if (!ui.parts) ui.parts = buildVersusDom();
  const key = `${innerWidth}x${innerHeight}@${view.dpr}`;
  if (key !== ui.key) { ui.key = key; ui.cell = layoutVersus(ui.parts, view.dpr); }
  return ui;
}
