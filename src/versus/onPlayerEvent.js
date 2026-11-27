import { playSfx } from '../audio/index.js';
import { raiseGarbage } from '../core/game/raiseGarbage.js';
import { vs } from './state.js';
import { attackFor, cancelPending } from './attackFor.js';
import { ATTACK } from '../config/versus.js';
import { endRound } from './endRound.js';
import { applyCharged } from './playerShift.js';

const SOUNDS = { move: 'move', rotate: 'rotate', hold: 'hold', hardDrop: 'hardDrop' };

function send(p, lines) {
  const out = cancelPending(p, lines);
  if (!out) return;
  const rival = vs.players[1 - p.index];
  rival.pending += out;
  p.sent += out;
}

/** Lo que pasa en el tablero de un jugador: sonido, ataques, basura y final de la ronda. */
export function onPlayerEvent(p, name, d) {
  const pan = p.index ? 0.45 : -0.45;
  if (SOUNDS[name]) playSfx(SOUNDS[name], { pan, distance: d.distance });
  if (name === 'lock') { p.cleared = false; if (!d.hard) playSfx('lock', { pan }); }
  if (name === 'clear') playSfx('clear', { lines: d.rows.length, pan });
  if (name === 'score' && d.lines) { p.cleared = true; send(p, attackFor(d)); }
  if (name === 'perfectClear') send(p, ATTACK.perfectClear);
  if (name === 'spawn') {
    if (!p.cleared && p.pending) {
      const n = p.pending, hole = Math.random();
      p.pending = 0; p.flash = 1;
      raiseGarbage(p.game, n, () => hole);
    }
    if (!p.game.over) applyCharged(p);
  }
  if (name === 'garbage') playSfx('garbage', { pan });
  if (name === 'finish') endRound(1 - p.index);
}
