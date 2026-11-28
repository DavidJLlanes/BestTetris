import { $ } from '../../util/dom.js';
import { POWERS } from '../../modes/powers/powerList.js';
import { owned } from '../progress/wallet.js';
import { playSfx } from '../../audio/index.js';

export const BAG_MAX = 2;
let picked = [];

/** Poderes guardados que se pueden llevar a la partida (hasta 2). Devuelve la selección actual. */
export function renderBag(p) {
  picked = picked.filter((id) => owned(p, id) > 0);
  const ids = Object.keys(POWERS).filter((id) => owned(p, id) > 0);
  const box = $('jc-bag');
  box.innerHTML = ids.length
    ? `<h4>Llevar poderes <small>hasta ${BAG_MAX}</small></h4><div class="jc-chips">${ids.map((id) => {
      const w = POWERS[id];
      return `<button type="button" class="chip ${picked.includes(id) ? 'on' : ''}" data-bag="${id}" style="--pc:${w.color}" title="${w.desc}"><b>${w.icon}</b>${w.name}<small>×${owned(p, id)}</small></button>`;
    }).join('')}</div>`
    : '<p class="tip">Consigue poderes en los planetas tienda con tu polvo estelar.</p>';
  return picked;
}

export function bindBag(getProgress) {
  $('jc-bag').addEventListener('click', (e) => {
    const b = e.target.closest('[data-bag]');
    if (!b) return;
    const id = b.dataset.bag;
    picked = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id].slice(-BAG_MAX);
    playSfx('focus');
    const had = document.activeElement === b; // con mando el foco sigue en el mismo poder
    renderBag(getProgress());
    if (had) $('jc-bag').querySelector(`[data-bag="${id}"]`)?.focus({ preventScroll: true });
  });
}

export const pickedBag = () => picked.slice();
