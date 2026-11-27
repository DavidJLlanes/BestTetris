import { RULES } from './rulesByKey.js';

/**
 * Fusiona el progreso de este dispositivo (a) con el de la cuenta (b) sin perder nada:
 * contadores al máximo, récords y logros juntos, y en nombre, foto y ajustes gana el último cambio.
 * stampsA/stampsB: { clave: milisegundos del último cambio }.
 */
export function mergeData(a = {}, b = {}, stampsA = {}, stampsB = {}) {
  const out = {};
  for (const key of Object.keys(RULES)) {
    if (a[key] === undefined && b[key] === undefined) continue;
    const ctx = { stampA: stampsA[key], stampB: stampsB[key], recordsA: a.records, recordsB: b.records };
    const v = RULES[key](a[key], b[key], ctx);
    if (v !== undefined) out[key] = v;
  }
  return out;
}
