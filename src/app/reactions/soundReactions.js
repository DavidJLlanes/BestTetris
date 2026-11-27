import { on } from '../bus.js';
import { app } from '../state.js';
import { playSfx, playMusical, setMusicLevel, setMusicCombo } from '../../audio/index.js';
import { piecePan, cellsPan } from './piecePan.js';

const SOFT_DROP_GAP = 0.03;
let lastSoft = 0;

/**
 * Cada suceso de la partida tiene su sonido, situado en estéreo según la pieza.
 * Con «Efectos musicales» las jugadas tocan notas de la canción (afinadas y a tiempo)
 * y los combos suman capas a la música.
 */
export function soundReactions() {
  const play = (name, opts) => (app.settings.musical ? playMusical : playSfx)(name, opts);
  on('move', ({ piece }) => play('move', { pan: piecePan(piece), x: piece.x }));
  on('rotate', ({ piece }) => play('rotate', { pan: piecePan(piece), x: piece.x, rot: piece.rot }));
  on('softDrop', ({ game }) => {
    const now = performance.now() / 1000;
    if (now - lastSoft > SOFT_DROP_GAP * (app.settings.musical ? 3 : 1)) { lastSoft = now; play('softDrop', { pan: piecePan(game.cur) }); }
  });
  on('lock', ({ hard, cells }) => { if (!hard) play('lock', { pan: cellsPan(cells) }); });
  on('hardDrop', ({ piece, distance }) => play('hardDrop', { pan: piecePan(piece), distance }));
  on('hold', () => play('hold'));
  on('clear', ({ rows }) => play('clear', { lines: rows.length }));
  on('score', ({ tspin, combo }) => {
    if (tspin === 'full') playSfx('tspin');
    if (combo > 0) { play('combo', { combo }); if (app.settings.musical) setMusicCombo(combo); }
  });
  on('levelUp', ({ level }) => { playSfx('levelUp'); setMusicLevel(level); });
  on('perfectClear', () => playSfx('win'));
  on('garbage', () => playSfx('garbage'));
  on('finish', ({ win }) => playSfx(win ? 'win' : 'gameOver'));
}
