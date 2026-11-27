import { COLORS } from '../config/colors.js';
import { PALETTES } from '../config/palettes.js';
import { gemStyle } from './sprites/gemStyle.js';
import { clearSpriteCache } from './sprites/gemSprite.js';
import { view } from './view.js';

/** Cambia la paleta de gemas (y los símbolos) y fuerza a redibujar los sprites. */
export function applyPalette(name, symbols) {
  Object.assign(COLORS, PALETTES[name] || PALETTES.prisma);
  gemStyle.symbols = !!symbols;
  clearSpriteCache();
  view.version++;
}
