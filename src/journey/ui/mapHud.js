import { $ } from '../../util/dom.js';
import { getJourney } from '../progress/journeyStore.js';
import { totalStars, maxStars } from '../progress/stars.js';
import { balance } from '../progress/wallet.js';
import { fuelNow, FUEL_MAX } from '../progress/fuel.js';
import { eventOfWeek } from '../progress/eventOfWeek.js';
import { isOpen } from '../progress/unlocks.js';
import { formatNumber } from '../../util/formatNumber.js';
import { TRAMOS } from '../tramos.js';

const mmss = (ms) => { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
let shownTramo = -1;

/** Marcador del mapa: estrellas, polvo estelar, combustible (o calma) y la lluvia de la semana. */
export function renderMapHud() {
  const p = getJourney();
  $('jm-stars').textContent = `★ ${totalStars(p)} / ${maxStars()}`;
  $('jm-dust').textContent = `✦ ${formatNumber(balance(p))}`;
  renderFuel(p);
  $('jm-calm').classList.toggle('on', !!p.calm);
  $('jm-calm').setAttribute('aria-pressed', String(!!p.calm));
  const ev = eventOfWeek();
  const open = isOpen(ev.level, p);
  $('jm-event').hidden = !open;
  if (open) $('jm-event-name').textContent = `☔ ${ev.level.sky.name} · ${ev.daysLeft === 1 ? 'último día' : `${ev.daysLeft} días`}`;
}

/** Depósitos de combustible y el tiempo que falta para el siguiente (se llama cada segundo). */
export function renderFuel(p = getJourney()) {
  const el = $('jm-fuel');
  if (p.calm) { el.innerHTML = '<span class="calm">☾ Calma</span>'; return; }
  const f = fuelNow(p);
  el.innerHTML = `<span class="pips">${Array.from({ length: FUEL_MAX }, (_, i) => `<i class="${i < f.n ? 'on' : ''}"></i>`).join('')}</span>${f.next ? `<small>${mmss(f.next)}</small>` : ''}`;
}

/** Nombre del tramo que se ve: cambia con un fundido al cruzar de uno a otro. */
export function renderTramo(index) {
  if (index === shownTramo) return;
  shownTramo = index;
  const el = $('jm-tramo');
  el.classList.remove('swap');
  void el.offsetWidth;
  el.classList.add('swap');
  el.textContent = `Tramo ${index + 1} · ${TRAMOS[index].name}`;
}
