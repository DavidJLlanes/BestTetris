import { $ } from '../util/dom.js';
import { formatTime } from '../util/formatTime.js';
import { formatNumber } from '../util/formatNumber.js';
import { getMode } from '../modes/registry.js';

/** Marcador lateral. Solo toca el DOM cuando un valor cambia, para no forzar repintados. */
const els = {};
const last = {};

function set(key, value) {
  if (last[key] === value) return;
  last[key] = value;
  els[key].textContent = value;
}

export function bindHud() {
  for (const k of ['score', 'level', 'lines', 'time', 'best']) els[k] = $(`s-${k}`);
}

export function updateHud(g) {
  if (!g) return;
  const mode = getMode(g.mode);
  set('score', formatNumber(g.score));
  set('level', g.rules.levelUp ? String(g.level) : '—');
  set('lines', mode.progress ? mode.progress(g) : g.rules.goalLines ? `${g.lines}/${g.rules.goalLines}` : String(g.lines));
  const remaining = g.rules.timeLimit ? Math.max(0, g.rules.timeLimit - g.time) : g.time;
  set('time', formatTime(remaining, mode.record === 'time'));
}

export function setBest(text) { set('best', text); }
