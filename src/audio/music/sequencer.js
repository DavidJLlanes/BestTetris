import { audio } from '../context.js';
import { scheduleStep } from './scheduleStep.js';
import { tempoForLevel } from './tempo.js';
import { STEPS_PER_BAR, BARS } from './score.js';
import { MUSIC_STYLES } from './styles.js';

const LOOKAHEAD = 0.15;
const INTERVAL_MS = 25;
const seq = { playing: false, step: 0, next: 0, timer: null, tension: 0, target: 0, transpose: 0, style: MUSIC_STYLES.cascada, ...tempoForLevel(1) };

function pump() {
  if (!seq.playing) return;
  while (seq.next < audio.ctx.currentTime + LOOKAHEAD) {
    seq.tension += (seq.target - seq.tension) * 0.08; // las capas entran y salen sin saltos
    scheduleStep(seq.step, seq.next, seq.bpm * seq.style.tempo, seq.intensity, seq.tension, seq.transpose, seq.style);
    seq.next += 60 / (seq.bpm * seq.style.tempo) / 4;
    seq.step = (seq.step + 1) % (STEPS_PER_BAR * BARS);
  }
}

export function startMusic() {
  if (!audio.ctx || seq.playing) return;
  seq.playing = true;
  seq.next = audio.ctx.currentTime + 0.08;
  seq.timer = setInterval(pump, INTERVAL_MS);
}
export function stopMusic() { seq.playing = false; clearInterval(seq.timer); }
export function restartMusic() { seq.step = 0; }
export function setMusicLevel(level) { Object.assign(seq, tempoForLevel(level)); }
/** Tensión 0..1 (pila alta, combos): añade capas a la música. */
export function setMusicTension(t) { seq.target = t; }
/** Cambia la tonalidad (semitonos) a partir del siguiente compás que suene. */
export function setMusicTranspose(semitones) { seq.transpose = semitones; }
/** Arreglo de la música (tema desbloqueable). */
export function setMusicStyle(id) { seq.style = MUSIC_STYLES[id] || MUSIC_STYLES.cascada; }
