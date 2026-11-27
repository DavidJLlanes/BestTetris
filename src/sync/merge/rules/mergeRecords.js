import { recordKind } from './recordKind.js';

const KEEP = 5;
const id = (e) => `${e.value}|${e.score}|${e.lines}|${e.time}|${e.date}`;

/** Récords: se juntan las marcas de los dos lados, sin repetir, y se quedan las 5 mejores de cada modo. */
export function mergeRecords(a = {}, b = {}) {
  const out = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const kind = recordKind(key), seen = new Set();
    const all = [...(a[key] || []), ...(b[key] || [])].filter((e) => e && !seen.has(id(e)) && seen.add(id(e)));
    out[key] = all.sort((x, y) => (kind.better(x.value, y.value) ? -1 : kind.better(y.value, x.value) ? 1 : 0)).slice(0, KEEP);
  }
  return out;
}
