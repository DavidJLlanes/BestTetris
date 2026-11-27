/** Fachada de audio: lo único que importa el resto de la aplicación. */
import { audio, initAudio, applyVolumes } from './context.js';
export { initAudio } from './context.js';
export { playSfx } from './sfx/playSfx.js';
export { startMusic, stopMusic, restartMusic, setMusicLevel, setMusicTension } from './music/sequencer.js';

export function setVolumes(music, sfx) { audio.musicVol = music; audio.sfxVol = sfx; applyVolumes(); }
export function setMuted(m) { audio.muted = m; applyVolumes(); }
export function isMuted() { return audio.muted; }
