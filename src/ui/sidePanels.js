import { $ } from '../util/dom.js';
import { on } from '../app/bus.js';
import { loadDays } from '../storage/days.js';
import { streak } from '../progress/streak.js';
import { dateKey } from '../progress/dateKey.js';
import { formatNumber } from '../util/formatNumber.js';
import { progressCardHtml } from './progress/progressCard.js';

/** Paneles extra en PC (debajo de la reserva y de las siguientes): rango, temporada, racha y el día. */
function render() {
  const days = loadDays(), today = days[dateKey()] || { g: 0, l: 0, xp: 0 }, s = streak(days);
  $('side-rank').innerHTML = progressCardHtml();
  $('side-today').innerHTML = [
    ['Partidas', today.g], ['Líneas', formatNumber(today.l)], ['Experiencia', `+${formatNumber(today.xp)}`],
    ['Racha', `${s.current ? '🔥 ' : ''}${s.current} ${s.current === 1 ? 'día' : 'días'}`],
  ].map(([k, v]) => `<span>${k}</span><b>${v}</b>`).join('');
}

export function bindSidePanels() {
  render();
  on('xp', render);
  on('menu', render);
}
