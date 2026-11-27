import { readFileSync, writeFileSync } from 'node:fs';
import { moduleGraph, preloadTags, MARK } from './moduleGraph.js';

/** Escribe en index.html la lista de módulos a precargar: el navegador los pide todos a la vez. */
const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(`${root}index.html`, 'utf8');
const block = `${MARK[0]}\n${preloadTags(moduleGraph(root))}\n  ${MARK[1]}`;
const next = html.includes(MARK[0])
  ? html.replace(new RegExp(`${MARK[0].replace(/[()]/g, '\\$&')}[\\s\\S]*?${MARK[1]}`), block)
  : html.replace('</head>', `  ${block}\n</head>`);
writeFileSync(`${root}index.html`, next);
console.log('Precarga actualizada');
