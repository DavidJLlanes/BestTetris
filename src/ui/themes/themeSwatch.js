import { PALETTES } from '../../config/palettes.js';

const GEMS = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

/** Muestra de color de un tema: gemas, fondo o un icono para la música. */
export function themeSwatch(kind, t) {
  if (kind === 'gems') {
    const p = PALETTES[t.id] || PALETTES.prisma;
    return `<span class="sw-gems">${GEMS.map((k) => `<i style="background:linear-gradient(135deg,${p[k][0]},${p[k][1]})"></i>`).join('')}</span>`;
  }
  if (kind === 'bg') return `<span class="sw-bg" style="background:radial-gradient(circle at 20% 20%,${t.colors[0]},transparent 60%),radial-gradient(circle at 80% 30%,${t.colors[1]},transparent 60%),radial-gradient(circle at 40% 90%,${t.colors[2]},transparent 60%),#0b0820"></span>`;
  return '<span class="sw-music">♪</span>';
}
