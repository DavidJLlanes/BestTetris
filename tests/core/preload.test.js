import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { moduleGraph, preloadTags } from '../../tools/moduleGraph.js';

test('index.html precarga exactamente los módulos que usa el juego (si falla: npm run preload)', () => {
  const root = new URL('../..', import.meta.url).pathname;
  const html = readFileSync(`${root}index.html`, 'utf8');
  assert.ok(html.includes(preloadTags(moduleGraph(root))));
});
