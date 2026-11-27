import { $ } from '../util/dom.js';
import { MODES } from '../modes/registry.js';
import { RECORD_KINDS } from '../modes/recordKinds.js';
import { loadRecords, recordKey } from '../storage/records.js';
import { loadHistory } from '../storage/history.js';
import { onOpen } from './overlays.js';
import { loadReplay } from '../storage/replays.js';
import { leaderboard } from '../social/leaderboard/leaderboard.js';
import { playSfx } from '../audio/index.js';

const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const hasReplay = (key) => !!loadReplay(key);
const time = (ts) => new Date(ts).toLocaleString('es-ES', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
let period = 'all';

const allTime = (m, all) => (all[recordKey(m)] || []).map((e) => ({ value: e.value, when: e.date }));
const periodList = (m, hist) => leaderboard(hist, m, period).map((e) => ({ value: e.value, when: time(e.ts), name: e.name }));

function render() {
  const all = loadRecords(), hist = loadHistory();
  document.querySelectorAll('#records-tabs button').forEach((b) => b.classList.toggle('on', b.dataset.period === period));
  const html = MODES.filter((m) => !m.noRecord).map((m) => {
    const list = period === 'all' ? allTime(m, all) : periodList(m, hist);
    if (!list.length) return '';
    const fmt = RECORD_KINDS[m.record].format;
    const items = `<ol>${list.map((e) => `<li><b>${fmt(e.value)}</b> <small>· ${e.name ? `${esc(e.name)} · ` : ''}${e.when}</small></li>`).join('')}</ol>`;
    const watch = period === 'all' && m.replay && hasReplay(recordKey(m)) ? `<button class="btn ghost small" data-replay="${recordKey(m)}">▶ Ver el mejor</button>` : '';
    return `<div class="record-mode"><h4>${m.icon} ${m.name} ${watch}</h4>${items}</div>`;
  }).join('');
  const when = { day: 'hoy', week: 'esta semana', all: 'todavía' }[period];
  $('records').innerHTML = html || `<p class="empty">No hay marcas ${when}. Juega una partida y aparecerá aquí.</p>`;
}

/** Récords y clasificación local: hoy, esta semana y de siempre, por modo. */
export function bindRecordsPanel() {
  onOpen('ov-records', render);
  $('records-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-period]');
    if (!b || b.dataset.period === period) return;
    period = b.dataset.period; playSfx('ui'); render();
  });
}
