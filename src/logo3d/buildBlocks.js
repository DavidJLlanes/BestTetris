import { GLYPHS, WORD, ROWS } from './font.js';

// Colores de la marca a lo largo del nombre: cian → violeta → rosa → oro
const STOPS = [[70, 230, 255], [169, 139, 255], [255, 79, 216], [255, 211, 79]];

function brand(k) {
  const f = k * (STOPS.length - 1), i = Math.min(STOPS.length - 2, Math.floor(f)), u = f - i;
  return STOPS[i].map((c, j) => Math.round(c + (STOPS[i + 1][j] - c) * u));
}

/**
 * Bloques del logotipo, centrados en el origen (unidades = un bloque).
 * Cada uno guarda su letra, su color y un desplazamiento con muelle (para apartarlo al tocar).
 */
export function buildBlocks() {
  const blocks = [];
  let col = 0;
  const cols = [...WORD].reduce((n, ch) => n + GLYPHS[ch][0].length + 1, -1);
  [...WORD].forEach((ch, letter) => {
    const g = GLYPHS[ch];
    g.forEach((row, y) => [...row].forEach((v, x) => {
      if (v !== '1') return;
      const hx = col + x - (cols - 1) / 2, hy = y - (ROWS - 1) / 2;
      blocks.push({ hx, hy, hz: 0, letter, rgb: brand((col + x) / (cols - 1)), d: [0, 0, 0], v: [0, 0, 0], dir: null });
    }));
    col += g[0].length + 1;
  });
  return { blocks, cols, rows: ROWS, letters: WORD.length };
}
