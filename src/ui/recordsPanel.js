import { $ } from '../util/dom.js';
import { MODES } from '../modes/registry.js';
import { RECORD_KINDS } from '../modes/recordKinds.js';
import { loadRecords, recordKey } from '../storage/records.js';
import { onOpen } from './overlays.js';

/** Pantalla de récords: los 5 mejores de cada modo. */
export function bindRecordsPanel() {
  onOpen('ov-records', () => {
    const all = loadRecords();
    $('records').innerHTML = MODES.map((m) => {
      const list = all[recordKey(m)] || [];
      const fmt = RECORD_KINDS[m.record].format;
      const items = list.length
        ? `<ol>${list.map((e) => `<li><b>${fmt(e.value)}</b> <small>· ${e.date}</small></li>`).join('')}</ol>`
        : '<p class="empty">Aún no hay partidas</p>';
      return `<div class="record-mode"><h4>${m.icon} ${m.name}</h4>${items}</div>`;
    }).join('');
  });
}
