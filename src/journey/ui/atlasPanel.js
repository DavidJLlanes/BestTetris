import { $ } from '../../util/dom.js';
import { onOpen } from '../../ui/overlays.js';
import { MAIN, HIDDEN, EVENTS, ALL_LEVELS, SKY_TOTAL, getLevel, tramoOf } from '../catalog.js';
import { getJourney } from '../progress/journeyStore.js';
import { starsOf, wonCount } from '../progress/stars.js';
import { constellationSvg } from '../art/constellationSvg.js';
import { openLevelCard } from './levelCard.js';
import { playSfx } from '../../audio/index.js';

const TABS = { main: MAIN, hidden: HIDDEN, events: EVENTS };
let tab = 'main';

function tile(l, p) {
  const stars = starsOf(p, l.id), got = stars > 0;
  const secret = l.kind === 'hidden' && !got;
  const name = secret ? '???' : l.sky.name;
  return `<button class="atlas-tile ${got ? 'got' : ''}" data-atlas="${l.id}">
    ${constellationSvg(l.sky, { lit: got, color: tramoOf(l).nebula[0] })}
    <b>${name}</b><small>${got ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : l.num ? `nº ${l.num}` : secret ? 'oculta' : 'lluvia'}</small></button>`;
}

function render() {
  const p = getJourney();
  const got = wonCount(p, ALL_LEVELS);
  $('ja-summary').innerHTML = `<b>${got}</b> de ${ALL_LEVELS.length} constelaciones · el cielo entero tiene ${SKY_TOTAL}<div class="bar"><i style="transform:scaleX(${got / SKY_TOTAL})"></i></div>`;
  document.querySelectorAll('#ja-tabs [data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
  $('ja-grid').innerHTML = TABS[tab].map((l) => tile(l, p)).join('');
}

/** Atlas del cielo: todas las constelaciones, las conseguidas encendidas; tocar una abre su ficha. */
export function bindAtlasPanel() {
  onOpen('ov-jatlas', render);
  $('ja-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; playSfx('focus'); render(); } });
  $('ja-grid').addEventListener('click', (e) => { const b = e.target.closest('[data-atlas]'); if (b) { playSfx('ui'); openLevelCard(getLevel(b.dataset.atlas)); } });
}
