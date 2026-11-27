import { recordKind } from './recordKind.js';

/**
 * Repeticiones: una por récord. Si los dos lados tienen la del mismo modo, gana la del lado con mejor marca.
 * Del desafío diario solo se guarda el día más reciente.
 */
export function mergeReplays(a = {}, b = {}, ctx = {}) {
  const ra = ctx.recordsA || {}, rb = ctx.recordsB || {};
  const out = { ...a };
  for (const [key, replay] of Object.entries(b)) {
    if (!(key in out)) { out[key] = replay; continue; }
    const ba = ra[key] && ra[key][0], bb = rb[key] && rb[key][0];
    if (bb && (!ba || recordKind(key).better(bb.value, ba.value))) out[key] = replay;
  }
  const daily = Object.keys(out).filter((k) => k.startsWith('daily-')).sort();
  for (const k of daily.slice(0, -1)) delete out[k];
  return out;
}
