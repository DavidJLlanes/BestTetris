import { $ } from '../util/dom.js';
import { formatTime } from '../util/formatTime.js';
import { formatNumber } from '../util/formatNumber.js';

/** Marcador lateral. Solo toca el DOM cuando un valor cambia, para no forzar repintados. */
const els = {};
const last = {};

const BUMP = new Set(['score', 'level', 'lines']);
let gem = null;
let holdBtn = null;

/** Cambia una cifra; las que suben dan un pequeño salto (los números se sienten vivos). */
function set(key, value) {
  if (last[key] === value) return;
  const grew = last[key] !== undefined && BUMP.has(key);
  last[key] = value;
  const el = els[key];
  el.textContent = value;
  if (grew) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
}

export function bindHud() {
  for (const k of ['score', 'level', 'lines', 'time', 'best']) els[k] = $(`s-${k}`);
  gem = $('s-gem');
  holdBtn = document.querySelector('#touch .t-hold');
}

export function updateHud(g) {
  if (!g) return;
  const mode = g.hooks;
  set('score', formatNumber(g.score));
  set('level', g.rules.levelUp ? String(g.level) : '—');
  set('lines', mode.progress ? mode.progress(g) : g.rules.goalLines ? `${g.lines}/${g.rules.goalLines}` : String(g.lines));
  const per = g.rules.linesPerLevel || 10;
  const fill = g.rules.levelUp ? String(Math.round(((g.lines % per) / per) * 100) / 100) : '0';
  if (last.gem !== fill) { last.gem = fill; gem.style.setProperty('--p', fill); }
  const remaining = g.rules.timeLimit ? Math.max(0, g.rules.timeLimit - g.time) : g.time;
  set('time', formatTime(remaining, mode.record === 'time'));
  // Reserva solo se puede usar una vez por pieza (o nada, en modos sin reserva): el botón se apaga
  const holdOff = g.holdUsed || !g.rules.hold;
  if (holdBtn && last.holdOff !== holdOff) { last.holdOff = holdOff; holdBtn.classList.toggle('used', holdOff); }
}

export function setBest(text) { set('best', text); }
