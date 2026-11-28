import { $ } from '../../util/dom.js';
import { CHALLENGES, challengeText } from '../challenges/list.js';
import { goalOf } from '../goals/list.js';
import { formatNumber } from '../../util/formatNumber.js';
import { formatTime } from '../../util/formatTime.js';
import { drawArt } from './drawArt.js';
import { onOpen } from '../../ui/overlays.js';
import { playSfx } from '../../audio/index.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
let last = null;
export const lastResult = () => last;

/** Rellena la pantalla de resultado: estrellas que caen una a una, retos, puntos y polvo ganado. */
export function renderResult(r, g) {
  last = r;
  const l = r.level;
  $('jr-title').textContent = r.won ? (l.kind === 'boss' ? `¡Has vencido a ${l.sky.name}!` : `¡${l.sky.name} completada!`) : `${l.sky.name} se resiste`;
  $('jr-stars').innerHTML = [0, 1, 2].map((i) => `<i class="${i < r.stars ? 'on' : ''}" style="--d:${0.35 + i * 0.28}s">★</i>`).join('');
  const goal = goalOf(l.spec.goal);
  $('jr-list').innerHTML = [[goal.text(l.spec.goal), g.won], ...l.challenges.map((c) => [challengeText(c), g.won && CHALLENGES[c.type].test(g, c)])]
    .map(([t, on]) => `<li class="${on ? 'on' : ''}"><i>${on ? '✓' : '✗'}</i>${esc(t)}</li>`).join('');
  $('jr-result').innerHTML = [['Puntos', formatNumber(g.score)], ['Tiempo', formatTime(g.time)], ['Líneas', g.lines]]
    .map(([k, v]) => `<span>${k}</span><b>${v}</b>`).join('');
  $('jr-reward').innerHTML = r.reward ? `+${formatNumber(r.reward)} <b>✦</b> polvo estelar${r.best ? ' · <em>¡nueva marca!</em>' : ''}` : r.best ? '<em>¡Nueva marca!</em>' : '';
  $('jr-reward').hidden = !r.reward && !r.best;
  $('jr-note').textContent = r.won ? (r.stars > r.prev && r.prev ? `Mejoras de ${r.prev} a ${r.stars} estrellas.` : '') : 'Has perdido 1 de combustible. Cada reto cumplido da una estrella más.';
  $('jr-continue').textContent = r.won ? 'Continuar el viaje' : 'Volver al mapa';
  $('ov-jresult').classList.toggle('won', r.won);
}

/** Al mostrarse: la ilustración se dibuja y suenan las estrellas conseguidas. */
export function bindResultPanel() {
  onOpen('ov-jresult', () => {
    if (!last) return;
    requestAnimationFrame(() => drawArt($('jr-art'), last.level, last.won));
    for (let i = 0; i < last.stars; i++) setTimeout(() => playSfx('jReward', { i }), 350 + i * 280);
  });
}
