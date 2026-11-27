import { readFileSync } from 'node:fs';
import { dirname, join, relative, normalize } from 'node:path';

const IMPORT = /(?:^|\n)\s*(?:import|export)\s[^'"]*?from\s*['"](\.[^'"]+)['"]|(?:^|\n)\s*import\s*['"](\.[^'"]+)['"]/g;

/** Todos los módulos que carga la página desde boot.js y main.js (imports estáticos), en orden estable. */
export function moduleGraph(root, entries = ['src/boot.js', 'src/main.js']) {
  const seen = new Set();
  const walk = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    const src = readFileSync(join(root, file), 'utf8');
    for (const m of src.matchAll(IMPORT)) walk(normalize(join(dirname(file), m[1] || m[2])).replace(/\\/g, '/'));
  };
  for (const entry of [].concat(entries)) walk(entry);
  return [...seen].sort();
}

export const preloadTags = (files) => files.map((f) => `  <link rel="modulepreload" href="${f}">`).join('\n');
export const MARK = ['<!-- modulepreload:start (generado: npm run preload) -->', '<!-- modulepreload:end -->'];
export { relative };
