import { $ } from '../../util/dom.js';
import { pushOverlay } from '../../ui/overlays.js';
import { getJourney } from '../progress/journeyStore.js';
import { lockReason } from '../progress/unlocks.js';
import { fuelNow } from '../progress/fuel.js';
import { goalOf } from '../goals/list.js';
import { challengeText } from '../challenges/list.js';
import { ruleTags } from '../mode/ruleTags.js';
import { tramoOf } from '../catalog.js';
import { formatNumber } from '../../util/formatNumber.js';
import { formatTime } from '../../util/formatTime.js';
import { drawArt } from './drawArt.js';
import { renderBag } from './bagPicker.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
let current = null;
export const cardLevel = () => current;

const kicker = (l) => (l.kind === 'event' ? 'Lluvia de estrellas · solo esta semana'
  : l.kind === 'hidden' ? `Constelación oculta · ${tramoOf(l).name}`
    : `${l.kind === 'boss' ? 'Jefe' : 'Constelación'} ${l.num} de 48 · ${tramoOf(l).name}`);

/** Ficha de una constelación: dibujo, historia, objetivo, retos de estrella, reglas, marca y poderes. */
export function openLevelCard(level, { layer = true } = {}) {
  current = level;
  const p = getJourney(), e = p.levels[level.id] || { stars: 0, best: 0, plays: 0 };
  const lock = lockReason(level, p);
  const hiddenLocked = lock && level.kind === 'hidden';
  $('jc-kicker').textContent = kicker(level);
  $('jc-name').textContent = hiddenLocked ? 'Constelación oculta' : level.sky.name;
  $('jc-story').textContent = hiddenLocked ? 'Un desvío secreto lleva hasta ella.' : level.sky.story;
  $('jc-goal').textContent = goalOf(level.spec.goal).text(level.spec.goal);
  $('jc-stars').innerHTML = [['Objetivo cumplido', e.stars >= 1], ...level.challenges.map((c, i) => [challengeText(c), e.stars >= i + 2])]
    .map(([t, on]) => `<li class="${on ? 'on' : ''}"><i>★</i>${esc(t)}</li>`).join('');
  $('jc-tags').innerHTML = ruleTags(level).map(([i, t]) => `<span><b>${i}</b>${esc(t)}</span>`).join('');
  $('jc-best').innerHTML = e.plays ? `Tu mejor marca: <b>${formatNumber(e.best)}</b>${e.time ? ` · mejor tiempo <b>${formatTime(e.time)}</b>` : ''}` : '';
  $('jc-best').hidden = !e.plays;
  renderBag(p);
  $('jc-bag').hidden = !!lock;
  const fuel = fuelNow(p);
  $('jc-lock').hidden = !lock && (p.calm || fuel.n > 0);
  $('jc-lock').textContent = lock || 'Sin combustible: espera a que se recargue, cómpralo en un planeta tienda o activa el modo calma.';
  $('jc-play').disabled = !!lock || (!p.calm && fuel.n <= 0);
  $('jc-play').innerHTML = p.calm ? 'Despegar' : `Despegar <small>⛽ 1 · se devuelve si ganas</small>`;
  pushOverlay('ov-jlevel', { layer });
  requestAnimationFrame(() => drawArt($('jc-art'), level, e.stars > 0 && !hiddenLocked));
}
