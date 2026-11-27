import { removeRows } from '../../core/board/removeRows.js';
import { createPiece } from '../../core/pieces/createPiece.js';
import { collides } from '../../core/pieces/collides.js';

export const FREEZE_SECS = 6;
const ZONE_ROWS = 2;

/**
 * Poderes del modo Poderes. use(g) devuelve true si se pudo usar.
 * Añadir un poder es añadir una entrada aquí.
 */
export const POWERS = {
  freeze: {
    name: 'Congelar', icon: '❄', color: '#8fd3ff', desc: `La pieza deja de caer ${FREEZE_SECS} s`,
    use(g) {
      if (g.custom.frozen <= 0) g.custom.savedInterval = g.rules.fixedInterval;
      g.custom.frozen = FREEZE_SECS;
      g.rules.fixedInterval = 1e9; // sin gravedad (bajar a mano sigue funcionando)
      return true;
    },
  },
  zone: {
    name: 'Bomba de zona', icon: '✸', color: '#ff5c7a', desc: `Borra las ${ZONE_ROWS} filas de abajo`,
    use(g) {
      const rows = Array.from({ length: ZONE_ROWS }, (_, i) => g.board.length - 1 - i);
      if (!rows.some((y) => g.board[y].some(Boolean))) return false;
      const { board, drops } = removeRows(g.board, rows);
      g.board = board;
      g.emit('rowsRemoved', { drops });
      return true;
    },
  },
  swap: {
    name: 'Cambio', icon: '⇄', color: '#ffd34f', desc: 'La pieza actual se convierte en una barra',
    use(g) {
      if (!g.cur || g.cur.type === 'I') return false;
      const p = createPiece('I');
      p.y = Math.max(p.y, g.cur.y);
      if (collides(g.board, p)) return false;
      g.cur = p;
      g.emit('spawn', { piece: p });
      return true;
    },
  },
};
export const POWER_ORDER = ['freeze', 'zone', 'swap'];
