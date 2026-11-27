import { test } from 'node:test';
import assert from 'node:assert/strict';
import { THEMES, isUnlocked } from '../../src/progress/themes.js';
import { PALETTES } from '../../src/config/palettes.js';
import { MUSIC_STYLES } from '../../src/audio/music/styles.js';
import { DEFAULT_SETTINGS } from '../../src/config/defaults.js';

test('cada tema tiene su paleta o estilo musical, y el de serie está libre desde el nivel 1', () => {
  THEMES.gems.list.forEach((t) => assert.ok(PALETTES[t.id], t.id));
  THEMES.musicStyle.list.forEach((t) => assert.ok(MUSIC_STYLES[t.id], t.id));
  THEMES.bg.list.forEach((t) => assert.equal(t.colors.length, 3));
  Object.values(THEMES).forEach((g) => {
    assert.equal(g.list[0].level, 1);
    assert.equal(DEFAULT_SETTINGS[g.setting], g.list[0].id);
  });
});

test('los temas se desbloquean al llegar a su nivel', () => {
  const neon = THEMES.gems.list.find((t) => t.id === 'neon');
  assert.equal(isUnlocked(neon, 2), false);
  assert.equal(isUnlocked(neon, 3), true);
});
