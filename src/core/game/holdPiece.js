import { spawn } from './spawn.js';

/** Guarda la pieza activa (una vez por pieza) y saca la reservada o la siguiente. */
export function holdPiece(g) {
  if (!g.cur || g.holdUsed || !g.rules.hold) return false;
  if (g.rules.holdLimit != null && g.stats.holds >= g.rules.holdLimit) return false; // reservas contadas
  const type = g.cur.type;
  const swap = g.hold;
  g.hold = type;
  g.holdUsed = true;
  g.stats.holds++;
  g.emit('hold', { type });
  spawn(g, swap);
  return true;
}
