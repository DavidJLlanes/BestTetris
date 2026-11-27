import { newest } from './newest.js';

/** Ajustes: gana el último cambio, pero la calidad y la decoración son de cada dispositivo (el de a). */
export function mergeSettings(a, b, ctx) {
  const out = newest(a, b, ctx);
  if (!a || out === a) return out;
  const own = {};
  for (const k of ['quality', 'decor']) if (k in a) own[k] = a[k];
  return { ...out, ...own };
}
