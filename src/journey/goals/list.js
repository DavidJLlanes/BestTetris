import { countType } from '../../core/board/countType.js';
import { formatTime } from '../../util/formatTime.js';
import { formatNumber } from '../../util/formatNumber.js';
import { got } from './counters.js';

const n = (v, one, many) => `${v} ${v === 1 ? one : many}`;
const frac = (a, b) => `${Math.min(a, b)}/${b}`;
const rock = (g) => countType(g.board, 'G');

/**
 * Objetivos de las constelaciones. label: el nombre de la casilla del marcador; text: la frase de
 * la ficha; done: si se ha cumplido; progress: lo que se ve durante la partida.
 */
export const GOALS = {
  lines: { label: 'Líneas', text: (o) => `Limpia ${n(o.n, 'línea', 'líneas')}`, done: (g, o) => g.lines >= o.n, progress: (g, o) => frac(g.lines, o.n) },
  score: { label: 'Meta', text: (o) => `Consigue ${formatNumber(o.n)} puntos`, done: (g, o) => g.score >= o.n, progress: (g, o) => `${Math.min(99, Math.floor((g.score / o.n) * 100))}%` },
  survive: { label: 'Aguanta', text: (o) => `Aguanta ${formatTime(o.n)} sin llenar el tablero`, done: (g, o) => g.time >= o.n, progress: (g, o) => formatTime(Math.max(0, o.n - g.time)) },
  astros: { label: 'Astros', text: (o) => `Recoge ${n(o.n, 'astro', 'astros')} completando su fila`, done: (g, o) => got(g, 'astros') >= o.n, progress: (g, o) => frac(got(g, 'astros'), o.n) },
  dust: { label: 'Polvo', text: (o) => `Rompe ${n(o.n, 'bloque', 'bloques')} de polvo cósmico (dos líneas cada uno)`, done: (g, o) => got(g, 'dust') >= o.n, progress: (g, o) => frac(got(g, 'dust'), o.n) },
  ice: { label: 'Hielo', text: (o) => `Funde ${n(o.n, 'bloque', 'bloques')} de hielo con líneas a su lado`, done: (g, o) => got(g, 'ice') >= o.n, progress: (g, o) => frac(got(g, 'ice'), o.n) },
  rock: { label: 'Roca', text: () => 'Limpia toda la roca del fondo', done: (g) => rock(g) === 0, progress: (g) => `${Math.ceil(rock(g) / 9)} filas` },
  quads: { label: 'Prismas', text: (o) => `Haz ${n(o.n, 'prisma', 'prismas')} (4 líneas de golpe)`, done: (g, o) => g.stats.quads >= o.n, progress: (g, o) => frac(g.stats.quads, o.n) },
  multi: { label: 'Dobles+', text: (o) => `Limpia ${o.n} veces 2 líneas o más de golpe`, done: (g, o) => got(g, 'multi') >= o.n, progress: (g, o) => frac(got(g, 'multi'), o.n) },
  combo: { label: 'Combo', text: (o) => `Encadena un combo de ${o.n}`, done: (g, o) => g.stats.maxCombo >= o.n, progress: (g, o) => frac(Math.max(0, g.stats.maxCombo), o.n) },
  tspin: { label: 'Giros-T', text: (o) => `Haz ${n(o.n, 'giro-T', 'giros-T')} que limpien`, done: (g, o) => g.stats.tspins >= o.n, progress: (g, o) => frac(g.stats.tspins, o.n) },
  shooting: { label: 'Fugaces', text: (o) => `Atrapa ${n(o.n, 'estrella fugaz', 'estrellas fugaces')} completando su fila a tiempo`, done: (g, o) => got(g, 'shooting') >= o.n, progress: (g, o) => frac(got(g, 'shooting'), o.n) },
  holes: { label: 'Agujeros', text: (o) => `Cierra ${n(o.n, 'agujero negro', 'agujeros negros')} limpiando su fila`, done: (g, o) => got(g, 'holes') >= o.n, progress: (g, o) => frac(got(g, 'holes'), o.n) },
  boss: { label: 'Jefe', text: (o) => `Vence a la constelación: cada línea le quita vida (${o.n} puntos de vida)`, done: (g) => !!g.custom.boss && g.custom.boss.hp <= 0, progress: (g) => `${Math.max(0, g.custom.boss ? g.custom.boss.hp : 0)} ♥` },
};

export const goalOf = (o) => GOALS[o.type];
