/** Fachada de audio: lo único que importa el resto de la aplicación. */
import { audio, initAudio, applyVolumes } from './context.js';
export { initAudio } from './context.js';
export { unlockAudio } from './unlockAudio.js';
export { playSfx } from './sfx/playSfx.js';
export { startMusic, stopMusic, restartMusic, setMusicLevel, setMusicTension, setMusicTranspose, setMusicStyle, musicPulse, musicNow, setMusicCombo } from './music/sequencer.js';
export { playMusical } from './sfx/playMusical.js';
export { duckMusic } from './music/duckMusic.js';

export function setVolumes(music, sfx) { audio.musicVol = music; audio.sfxVol = sfx; applyVolumes(); }
export function setMuted(m) { audio.muted = m; applyVolumes(); }
export function isMuted() { return audio.muted; }
