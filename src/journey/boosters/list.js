import { COLS } from '../../config/board.js';
import { SHAPES } from '../../config/shapes.js';
import { createPiece } from '../../core/pieces/createPiece.js';
import { collides } from '../../core/pieces/collides.js';

/**
 * Poderes que solo se consiguen en los planetas tienda del Viaje (se suman a los del modo Poderes).
 * use(g) devuelve true si se pudo usar.
 */
export const JOURNEY_POWERS = {
  mirror: {
    name: 'Espejo', icon: '⇋', color: '#ff9bea', desc: 'Da la vuelta al tablero de izquierda a derecha',
    use(g) {
      if (!g.board.some((r) => r.some(Boolean))) return false;
      g.board.forEach((row) => row.reverse());
      if (g.cur) g.cur.x = COLS - g.cur.x - SHAPES[g.cur.type].length;
      for (let k = 0; k < 4 && g.cur && collides(g.board, g.cur); k++) g.cur.y--;
      return true;
    },
  },
  peek: {
    name: 'Catalejo', icon: '◎', color: '#9fe8ff', desc: 'Ves 5 piezas siguientes (en vez de 2) el resto de la partida',
    use(g) { if (g.rules.previews >= 5) return false; g.rules.previews = 5; return true; },
  },
  comet: {
    name: 'Cometa', icon: '☄', color: '#ffb36b', desc: 'La pieza que cae se convierte en un cometa',
    use(g) {
      if (!g.cur || g.cur.type === 'K') return false;
      const p = createPiece('K');
      p.y = Math.max(p.y, g.cur.y);
      if (collides(g.board, p)) return false;
      g.cur = p;
      g.emit('spawn', { piece: p });
      return true;
    },
  },
};
