import { toBase64url, fromBase64url } from '../../puzzles/code/base64url.js';

/**
 * Reto por enlace: modo, semilla de las piezas, marca a batir y nombre de quien reta.
 * Todo va dentro del enlace; no pasa por ningún servidor.
 */
export const encodeChallenge = ({ mode, seed, value, name }) =>
  toBase64url(JSON.stringify({ v: 1, m: mode, s: seed, r: value, n: name.slice(0, 24) }));

export function decodeChallenge(code) {
  try {
    const d = JSON.parse(fromBase64url(code));
    if (d.v !== 1 || typeof d.m !== 'string' || !Number.isInteger(d.s) || !(d.r > 0)) return null;
    return { mode: d.m, seed: d.s >>> 0, value: +d.r, name: String(d.n || 'Alguien').slice(0, 24) };
  } catch { return null; }
}
