import { explode } from '../../core/board/explode.js';

const EVERY = 5; // una pieza especial de cada tantas
const SPECIALS = [['B', 0.4], ['M', 0.35], ['P', 0.25]]; // bomba, bloque suelto, estrella gigante

function pickSpecial(random) {
  let r = random();
  for (const [type, w] of SPECIALS) { if ((r -= w) < 0) return type; }
  return 'M';
}

/** Caos: entre las piezas de siempre se cuelan bombas, bloques sueltos y estrellas gigantes. */
export default {
  id: 'chaos',
  order: 7.7,
  name: 'Caos',
  description: 'Bombas, bloques sueltos y estrellas',
  icon: '✸',
  record: 'score',
  rules: {},
  setup(g) { g.custom.count = 0; },
  nextPiece(g) {
    g.custom.count = (g.custom.count || 0) + 1;
    return g.custom.count % EVERY === 0 ? pickSpecial(g.random) : undefined; // undefined = pieza normal
  },
  onLock(g, piece, cells) {
    if (piece.type !== 'B') return;
    const [x, y] = cells[0];
    const hit = explode(g.board, x, y, 1);
    g.stats.bombs = (g.stats.bombs || 0) + 1;
    g.emit('bomb', { x, y, hit });
  },
};
