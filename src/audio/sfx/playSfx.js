import { audio } from '../context.js';
import { SFX } from './library.js';

/** Reproduce un efecto ya mismo (con 5 ms de margen para no cortar el ataque). */
export function playSfx(name, options = {}) {
  if (!audio.ctx || audio.muted || !SFX[name]) return;
  SFX[name](audio.sfx, audio.ctx.currentTime + 0.005, options);
}
