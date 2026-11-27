import { audio } from '../context.js';
import { musicNow } from '../music/sequencer.js';
import { MUSICAL, QUANTIZE } from './musical.js';
import { playSfx } from './playSfx.js';

/**
 * Toca una jugada como nota de la canción: afinada con el acorde que suena y, si la siguiente
 * semicorchea está muy cerca, encajada en ella. Sin música, suena el efecto normal.
 */
export function playMusical(name, options = {}) {
  if (!audio.ctx || audio.muted) return;
  const h = musicNow();
  if (!h || !MUSICAL[name]) { playSfx(name, options); return; }
  const now = audio.ctx.currentTime + 0.005;
  const t = h.grid - now <= (QUANTIZE[name] || 0) ? Math.max(now, h.grid) : now;
  MUSICAL[name](audio.sfx, t, options, h);
}
