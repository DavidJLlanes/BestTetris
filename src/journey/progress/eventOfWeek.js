import { EVENTS } from '../catalog.js';

const DAY = 86400000;

/** Lunes de la semana de `date` (hora local), como número de semana desde 1970. */
function weekIndex(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const monday = d.getTime() - ((d.getDay() + 6) % 7) * DAY;
  return Math.round((monday - new Date(1970, 0, 5).getTime()) / (7 * DAY));
}

/** La lluvia de estrellas de esta semana: qué constelación cae, su clave y cuántos días quedan. */
export function eventOfWeek(date = new Date()) {
  const i = weekIndex(date);
  const daysLeft = 7 - ((date.getDay() + 6) % 7);
  return { level: EVENTS[i % EVENTS.length], week: `w${i}`, daysLeft };
}
