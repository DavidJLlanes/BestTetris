import { applyPalette } from '../../render/applyPalette.js';
import { setMusicStyle } from '../../audio/index.js';
import { THEMES } from '../../progress/themes.js';

/** Aplica gemas, fondo y música elegidos. El modo daltónico manda sobre las gemas. */
export function applyTheme(s) {
  applyPalette(s.colorblind ? 'daltonico' : s.gems, s.colorblind);
  const bg = THEMES.bg.list.find((t) => t.id === s.bg) || THEMES.bg.list[0];
  bg.colors.forEach((c, i) => document.body.style.setProperty(`--au${i + 1}`, c));
  setMusicStyle(s.musicStyle);
}
