import { on } from '../bus.js';
import { playSfx, setMusicLevel } from '../../audio/index.js';
import { piecePan, cellsPan } from './piecePan.js';

const SOFT_DROP_GAP = 0.03;
let lastSoft = 0;

/** Cada suceso de la partida tiene su sonido, situado en estéreo según la pieza. */
export function soundReactions() {
  on('move', ({ piece }) => playSfx('move', { pan: piecePan(piece) }));
  on('rotate', ({ piece }) => playSfx('rotate', { pan: piecePan(piece) }));
  on('softDrop', ({ game }) => {
    const now = performance.now() / 1000;
    if (now - lastSoft > SOFT_DROP_GAP) { lastSoft = now; playSfx('softDrop', { pan: piecePan(game.cur) }); }
  });
  on('lock', ({ hard, cells }) => { if (!hard) playSfx('lock', { pan: cellsPan(cells) }); });
  on('hardDrop', ({ piece, distance }) => playSfx('hardDrop', { pan: piecePan(piece), distance }));
  on('hold', () => playSfx('hold'));
  on('clear', ({ rows }) => playSfx('clear', { lines: rows.length }));
  on('score', ({ tspin, combo }) => {
    if (tspin === 'full') playSfx('tspin');
    if (combo > 0) playSfx('combo', { combo });
  });
  on('levelUp', ({ level }) => { playSfx('levelUp'); setMusicLevel(level); });
  on('perfectClear', () => playSfx('win'));
  on('garbage', () => playSfx('garbage'));
  on('finish', ({ win }) => playSfx(win ? 'win' : 'gameOver'));
}
