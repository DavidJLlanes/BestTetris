/** Fechas de cambio fusionadas: la más reciente de cada clave. */
export function mergeStamps(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = Math.max(out[k] || 0, v || 0);
  return out;
}
