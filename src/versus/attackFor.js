import { ATTACK } from '../config/versus.js';

/** Líneas de basura que manda una jugada (datos del evento 'score' del núcleo). */
export function attackFor({ lines, tspin, backToBack, comboCount = 0 }) {
  if (!lines) return 0;
  let n = tspin === 'full' ? ATTACK.tspin[lines] ?? ATTACK.tspin.at(-1) : ATTACK.lines[lines] ?? ATTACK.lines.at(-1);
  if (backToBack) n += ATTACK.backToBack;
  n += ATTACK.combo[Math.min(comboCount, ATTACK.combo.length - 1)] || 0;
  return n;
}

/** La basura que te iban a mandar se cancela con la que tú mandas; devuelve lo que sale. */
export function cancelPending(player, attack) {
  const cancel = Math.min(player.pending, attack);
  player.pending -= cancel;
  return attack - cancel;
}
