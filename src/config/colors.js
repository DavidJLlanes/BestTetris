import { PALETTES } from './palettes.js';

/**
 * Colores activos de las gemas. Es un objeto vivo: render/applyPalette lo
 * rellena con la paleta elegida, y todo lo que lo lee ve el cambio al momento.
 */
export const COLORS = { ...PALETTES.prisma };
