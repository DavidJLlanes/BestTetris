import { canControl } from './state.js';
import { undoMove, canUndo } from '../core/game/index.js';
import { playSfx } from '../audio/index.js';

/** Deshacer pedido por el jugador. Si no se puede, un aviso breve (solo en modos que lo permiten). */
export function requestUndo(g) {
  if (!g || !g.rules.undo) return;
  if (canControl() && canUndo(g)) undoMove(g);
  else playSfx('denied');
}
