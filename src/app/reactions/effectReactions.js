import { on } from '../bus.js';
import { app } from '../state.js';
import { HIDDEN } from '../../config/board.js';
import { COLORS } from '../../config/colors.js';
import { pieceCells } from '../../core/pieces/pieceCells.js';
import { fx } from '../../effects/state.js';
import { spawnParticles } from '../../effects/spawnParticles.js';
import { floatText } from '../../effects/floatText.js';
import { impact } from '../../effects/impact.js';
import { LOCK_FLASH_TIME } from '../../render/layers/drawLockFlash.js';

const shakeOn = () => app.settings.shake;

/** Efectos visuales de cada suceso: estelas, chispas, rebotes y rótulos. */
export function effectReactions() {
  on('hardDrop', ({ piece, from, distance }) => {
    const color = COLORS[piece.type][0];
    const cols = new Map();
    for (const [x, y] of pieceCells(piece)) cols.set(x, Math.min(cols.get(x) ?? 99, y));
    for (const [x, top] of cols) {
      if (distance > 0) fx.trails.push({ x, y0: from - HIDDEN + (top - piece.y), y1: top - HIDDEN + 1, color, t: 0, life: 0.28 });
      spawnParticles(x + 0.5, top - HIDDEN + 1, color, 2, { speed: 3, life: 0.35, size: 2 });
    }
    impact(Math.min(9, 2 + distance * 0.35), shakeOn());
  });
  on('lock', ({ cells, hard }) => {
    fx.lockFlash = { cells, t: LOCK_FLASH_TIME };
    if (!hard) impact(1.2, shakeOn());
  });
  on('clear', ({ rows, types }) => {
    rows.forEach((y, i) => types[i].forEach((t, x) => spawnParticles(x + 0.5, y - HIDDEN + 0.5, COLORS[t][0], 3, { speed: 6 + rows.length * 2 })));
    if (rows.length >= 4) impact(10, shakeOn());
  });
  on('rowsRemoved', ({ drops }) => { fx.rowOffsets = drops.slice(); });
  on('score', ({ label, points, tspin, lines, combo }) => {
    if (!label) return;
    const color = tspin ? COLORS.T[0] : lines >= 4 ? COLORS.I[0] : '#ffffff';
    floatText(label, points ? `+${points}` : '', color, lines >= 4 ? 1.3 : 1);
    if (combo > 0) floatText(`COMBO ×${combo}`, '', '#ff4fd8', 0.8, 1.3);
  });
  on('levelUp', ({ level }) => { floatText(`NIVEL ${level}`, '', '#5cff9d', 1.1, -1.4); fx.levelFlash = 1; });
  on('perfectClear', ({ bonus }) => floatText('¡LIMPIEZA TOTAL!', `+${bonus}`, '#ffd34f', 1.3, -0.8));
  on('boardReset', ({ cells }) => {
    cells.forEach(({ x, y, type }) => { if (Math.random() < 0.5) spawnParticles(x + 0.5, y - HIDDEN + 0.5, COLORS[type][0], 1, { speed: 5 }); });
    floatText('RESPIRA', 'el tablero se renueva', '#46e6ff', 1);
  });
  on('garbage', () => impact(-3, shakeOn()));
}
