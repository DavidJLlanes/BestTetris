import { $ } from '../../util/dom.js';
import { onOpen } from '../overlays.js';
import { loadDays } from '../../storage/days.js';
import { streak } from '../../progress/streak.js';
import { progressCardHtml } from './progressCard.js';
import { calendarHtml } from './calendarHtml.js';

/** Nivel, temporada, racha y calendario en el perfil. */
export function bindProfileProgress() {
  onOpen('ov-profile', () => {
    const days = loadDays(), s = streak(days);
    $('profile-progress').innerHTML = progressCardHtml();
    $('profile-streak').innerHTML = `<span class="flame ${s.current ? 'lit' : ''}">🔥</span><b>${s.current}</b> ${s.current === 1 ? 'día seguido' : 'días seguidos'}<small>Mejor racha: ${s.best}${s.current && !s.playedToday ? ' · ¡juega hoy para no perderla!' : ''}</small>`;
    $('profile-calendar').innerHTML = calendarHtml(days);
  });
}
