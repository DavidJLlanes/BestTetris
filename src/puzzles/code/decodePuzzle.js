import { CODE_PREFIX } from './format.js';
import { fromBase64url } from './base64url.js';
import { validatePuzzle } from './validatePuzzle.js';

/**
 * Lee un código (o un enlace que lo lleve en ?puzzle=). Devuelve { puzzle } o { error }.
 * El contenido viene de fuera: se valida campo a campo y se reconstruye el objeto.
 */
export function decodePuzzle(input) {
  let code = String(input || '').trim();
  const m = code.match(/[?&]puzzle=([^&#\s]+)/);
  if (m) code = decodeURIComponent(m[1]);
  if (!code.startsWith(CODE_PREFIX)) return { error: 'Eso no parece un código de puzle de PRISMA.' };
  let d;
  try { d = JSON.parse(fromBase64url(code.slice(CODE_PREFIX.length))); } catch { return { error: 'El código está incompleto o dañado.' }; }
  if (!d || !Array.isArray(d.g)) return { error: 'El código está incompleto o dañado.' };
  const puzzle = { id: 'custom', custom: true, name: d.n, board: d.b, pieces: d.p, goal: { type: d.g[0], n: d.g[1] }, hold: d.h !== 0, hint: 'Puzle compartido' };
  if (puzzle.goal.type === 'perfect') delete puzzle.goal.n;
  const error = validatePuzzle(puzzle);
  return error ? { error } : { puzzle };
}
