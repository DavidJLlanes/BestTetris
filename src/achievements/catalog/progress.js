import { levelFromXp } from '../../progress/levels.js';
import { streak } from '../../progress/streak.js';
import { seasonStep, seasonKey } from '../../progress/seasonPass.js';
import { loadDays } from '../../storage/days.js';

/** Logros de progreso del jugador: nivel, rachas y temporadas. Se comprueban al ganar experiencia. */
const level = (n) => ({ profile }) => levelFromXp(profile.xp).level >= n;
const days = (n) => () => streak(loadDays()).current >= n;

export default [
  { id: 'lvl-5', name: 'Primer brillo', desc: 'Llega al nivel 5 (rango Cristal)', tier: 'bronze', icon: '✧', on: 'xp', test: level(5) },
  { id: 'lvl-10', name: 'Tallado', desc: 'Llega al nivel 10 (rango Gema)', tier: 'silver', icon: '◈', on: 'xp', test: level(10) },
  { id: 'lvl-18', name: 'Refracción', desc: 'Llega al nivel 18 (rango Prisma)', tier: 'gold', icon: '◆', on: 'xp', test: level(18) },
  { id: 'lvl-40', name: 'Supernova', desc: 'Llega al nivel 40 (rango Nova)', tier: 'prism', icon: '✺', on: 'xp', test: level(40) },
  { id: 'streak-3', name: 'Constante', desc: 'Juega 3 días seguidos', tier: 'bronze', icon: '🔥', on: 'xp', test: days(3) },
  { id: 'streak-7', name: 'Una semana entera', desc: 'Juega 7 días seguidos', tier: 'silver', icon: '🔥', on: 'xp', test: days(7) },
  { id: 'streak-30', name: 'Hábito de luz', desc: 'Juega 30 días seguidos', tier: 'prism', icon: '🔥', on: 'xp', test: days(30) },
  { id: 'season-10', name: 'Campeón de temporada', desc: 'Completa los 10 escalones de una temporada', tier: 'gold', icon: '🏆', on: 'xp', test: ({ profile }) => seasonStep(profile.seasonXp[seasonKey()] || 0).step >= 10 },
  { id: 'secret-dawn', name: 'Madrugador', desc: 'Juega antes de las 7 de la mañana', tier: 'silver', icon: '☀', secret: true, on: 'xp', test: () => new Date().getHours() < 7 && new Date().getHours() >= 5 },
  { id: 'secret-marathon-day', name: 'Día de maratón', desc: 'Juega 20 partidas en un mismo día', tier: 'gold', icon: '⌛', secret: true, on: 'xp', test: () => Object.values(loadDays()).some((d) => d.g >= 20) },
];
