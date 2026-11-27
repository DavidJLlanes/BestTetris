import { RECORD_KINDS } from '../../modes/recordKinds.js';

/** Resultado del reto: ganado o no, y por cuánto, en texto para el jugador. */
export function challengeOutcome(g) {
  const ch = g.hooks.challenge, kind = RECORD_KINDS[g.hooks.record];
  const mine = kind.won && !g.won ? null : kind.value(g);
  if (mine == null || !mine) return { won: false, text: `${ch.name} sigue ganando con ${kind.format(ch.value)}. ¡Otra vez!` };
  const won = kind.better(mine, ch.value);
  const diff = kind.format(Math.abs(mine - ch.value));
  if (mine === ch.value) return { won: false, text: `¡Empate exacto con ${ch.name}!` };
  return won
    ? { won, text: `¡Reto superado! Ganas a ${ch.name} por ${diff}.` }
    : { won, text: `${ch.name} te gana por ${diff}. ¡Otra vez!` };
}
