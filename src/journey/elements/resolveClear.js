import { crackDust } from './crackDust.js';
import { thawIce } from './thawIce.js';
import { swallowRows } from './swallowRows.js';
import { catchShooting, shiftShooting } from './shooting.js';
import { hitBoss } from '../boss/hitBoss.js';

/**
 * Qué pasa al limpiar filas en el Viaje, en orden: los astros se recogen, el polvo se agrieta
 * (su fila se queda), el hielo vecino se funde, los agujeros negros se tragan la fila de debajo,
 * la estrella fugaz se atrapa y el jefe recibe el golpe. Devuelve las filas que se quitan.
 */
export function resolveClear(g, rows) {
  const j = g.custom.j;
  for (const y of rows) j.astros += g.board[y].filter((c) => c === 'A').length;
  if (rows.length >= 2) j.multi++;
  const kept = crackDust(g, rows);
  thawIce(g, rows);
  const gone = swallowRows(g, rows.filter((y) => !kept.includes(y)));
  catchShooting(g, rows);
  hitBoss(g, rows.length);
  shiftShooting(g, gone);
  return gone;
}
