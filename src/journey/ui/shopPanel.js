import { $ } from '../../util/dom.js';
import { pushOverlay, onOpen } from '../../ui/overlays.js';
import { POWERS } from '../../modes/powers/powerList.js';
import { TRAMOS } from '../tramos.js';
import { getJourney, saveJourney } from '../progress/journeyStore.js';
import { balance, spend, owned } from '../progress/wallet.js';
import { fuelNow, addFuel, FUEL_MAX } from '../progress/fuel.js';
import { formatNumber } from '../../util/formatNumber.js';
import { playSfx } from '../../audio/index.js';
import { emit } from '../../app/bus.js';
import { SHOP_ITEMS, FUEL_PRICE } from './shopItems.js';

let tramo = 0;

function render() {
  const p = getJourney(), t = TRAMOS[tramo];
  $('js-name').textContent = t.planet.name;
  $('js-balance').innerHTML = `Tienes <b>✦ ${formatNumber(balance(p))}</b> de polvo estelar`;
  const items = SHOP_ITEMS.filter((it) => it.from <= tramo);
  const f = fuelNow(p);
  $('js-items').innerHTML = items.map((it) => {
    const w = POWERS[it.id];
    return `<li style="--pc:${w.color}"><b class="ico">${w.icon}</b><div><strong>${w.name}</strong><small>${w.desc}</small></div>
      <button class="btn small" data-buy="${it.id}" ${balance(p) < it.price ? 'disabled' : ''}>✦ ${it.price}</button><em>×${owned(p, it.id)}</em></li>`;
  }).join('') + `<li style="--pc:#5cff9d"><b class="ico">⛽</b><div><strong>Llenar el depósito</strong><small>Combustible al máximo (${f.n}/${FUEL_MAX})</small></div>
      <button class="btn small" data-buy="fuel" ${balance(p) < FUEL_PRICE || f.n >= FUEL_MAX || p.calm ? 'disabled' : ''}>✦ ${FUEL_PRICE}</button><em></em></li>`;
}

/** Planeta tienda: aquí se cambia el polvo estelar por poderes y combustible. */
export function openShop(t) { tramo = t; pushOverlay('ov-jshop'); }

export function bindShopPanel() {
  onOpen('ov-jshop', render);
  $('js-items').addEventListener('click', (e) => {
    const b = e.target.closest('[data-buy]');
    if (!b || b.disabled) return;
    const p = getJourney(), id = b.dataset.buy;
    const price = id === 'fuel' ? FUEL_PRICE : SHOP_ITEMS.find((it) => it.id === id).price;
    if (!spend(p, price)) { playSfx('denied'); return; }
    if (id === 'fuel') addFuel(p, FUEL_MAX);
    else p.bought[id] = (p.bought[id] || 0) + 1;
    saveJourney();
    playSfx('jBuy');
    emit('journeyBuy', { id });
    render();
  });
}
