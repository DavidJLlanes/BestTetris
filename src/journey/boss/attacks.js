import { collides } from '../../core/pieces/collides.js';
import { COLS } from '../../config/board.js';
import { SHAPES } from '../../config/shapes.js';
import { raiseGarbage } from '../../core/game/raiseGarbage.js';
import { randomCells, plain, surfaceCells } from './randomCells.js';

const turn = (g, cells, type) => { cells.forEach(([x, y]) => { g.board[y][x] = type; }); return cells.length > 0; };

/**
 * Ataques de los jefes. Cada uno devuelve true si ha hecho algo. Los efectos con duración
 * (oscuridad, prisa) se guardan en g.custom.boss y los aplica tickBoss.
 */
export const ATTACKS = {
  garbage: { name: 'Lluvia de roca', icon: '☄', run(g) { raiseGarbage(g, 2, g.random); if (g.custom.shoot && g.custom.shoot.y !== null) g.custom.shoot.y -= 2; return true; } },
  dark: { name: 'Eclipse', icon: '◐', run(g) { g.custom.boss.dark = 6; return true; } },
  rush: { name: 'Prisa', icon: '»', run(g) { g.custom.boss.rush = 6; return true; } },
  ice: { name: 'Escarcha', icon: '❄', run: (g) => turn(g, surfaceCells(g, 3), 'C') },
  dust: { name: 'Nube de polvo', icon: '◌', run: (g) => turn(g, surfaceCells(g, 3), 'D') },
  hole: { name: 'Agujero negro', icon: '●', run: (g) => turn(g, randomCells(g, 1, plain), 'H') },
  mirror: {
    name: 'Espejo', icon: '⇋',
    run(g) { g.board.forEach((row) => row.reverse()); if (g.cur) g.cur.x = COLS - g.cur.x - SHAPES[g.cur.type].length;
      for (let k = 0; k < 4 && g.cur && collides(g.board, g.cur); k++) g.cur.y--; // si no cabe, sube
      return true; },
  },
};
