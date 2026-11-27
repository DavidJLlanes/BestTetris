import { dateKey } from '../../progress/dateKey.js';

const WEEKS = 15;

/** Calendario de los últimos meses (columnas = semanas, de lunes a domingo); más brillo = más partidas. */
export function calendarHtml(days, today = new Date()) {
  const start = new Date(today);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - (WEEKS - 1) * 7);
  const cells = [];
  for (let i = 0; i < WEEKS * 7; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const k = dateKey(d), info = days[k];
    const lvl = !info ? 0 : info.g >= 10 ? 4 : info.g >= 5 ? 3 : info.g >= 2 ? 2 : 1;
    const future = d > today;
    cells.push(`<i class="d${lvl}${future ? ' future' : ''}${k === dateKey(today) ? ' today' : ''}" title="${d.toLocaleDateString('es-ES')}${info ? ` · ${info.g} partidas` : ''}"></i>`);
  }
  return cells.join('');
}
