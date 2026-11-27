import { countType } from '../../core/board/countType.js';

/** Excavación: limpia las 10 filas de basura del fondo lo antes posible. */
export default {
  id: 'dig',
  order: 4,
  name: 'Excavación',
  description: 'Rompe 10 filas de roca',
  icon: '⛏',
  record: 'time',
  replay: true, // se graba y el mejor intento corre como fantasma
  rules: { levelUp: false, garbageRows: 10 },
  isComplete: (g) => countType(g.board, 'G') === 0,
  progress: (g) => `${Math.ceil(countType(g.board, 'G') / 9)} filas`,
};
