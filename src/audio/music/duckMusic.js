import { audio } from '../context.js';

/** Baja la música (0..1 del volumen elegido) con un fundido; 1 la devuelve a su sitio. */
export function duckMusic(level = 1, secs = 0.6) {
  if (!audio.ctx || audio.muted) return;
  audio.music.gain.setTargetAtTime(audio.musicVol * 0.55 * level, audio.ctx.currentTime, secs / 3);
}
