import { getMode } from '../modes/registry.js';
import { RECORD_KINDS } from '../modes/recordKinds.js';
import { load, save } from './store.js';

const KEEP = 5;

export function loadRecords() { return load('records', {}); }

/** Clave del récord: normalmente el id del modo; el desafío diario usa una por día. */
export function recordKey(mode) { return mode.recordKey ? mode.recordKey() : mode.id; }

/** Guarda el resultado si cuenta como marca. Devuelve true si es el nuevo récord del modo. */
export function saveRecord(g) {
  const mode = getMode(g.mode);
  const key = recordKey(mode);
  if (mode.noRecord) return false;
  const kind = RECORD_KINDS[mode.record];
  const value = kind.value(g);
  if ((kind.won && !g.won) || !value) return false;
  const all = loadRecords();
  const entry = { value, score: g.score, lines: g.lines, level: g.level, time: g.time, date: new Date().toLocaleDateString('es-ES') };
  const list = [...(all[key] || []), entry].sort((a, b) => (kind.better(a.value, b.value) ? -1 : 1));
  all[key] = list.slice(0, KEEP);
  save('records', all);
  return list[0] === entry;
}

/** Mejor marca de un modo, ya formateada, o "—". */
export function bestLabel(modeId) {
  const mode = getMode(modeId);
  const list = loadRecords()[recordKey(mode)] || [];
  return list.length ? RECORD_KINDS[mode.record].format(list[0].value) : '—';
}
