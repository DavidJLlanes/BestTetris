/**
 * Fusiona contadores: números → el mayor; objetos → clave a clave; lo demás → el de a.
 * Nunca se pierde lo jugado en ningún dispositivo.
 */
export function deepMax(a, b) {
  if (a === undefined) return b;
  if (b === undefined) return a;
  if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    const out = {};
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) out[k] = deepMax(a[k], b[k]);
    return out;
  }
  return a;
}
