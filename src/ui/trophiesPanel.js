import { $ } from '../util/dom.js';
import { CATEGORIES, ACHIEVEMENTS } from '../achievements/registry.js';
import { TIERS } from '../achievements/tiers.js';
import { getUnlocked } from '../storage/achievements.js';
import { onOpen } from './overlays.js';

function card(a, date) {
  const tier = TIERS[a.tier];
  const hidden = a.secret && !date;
  return `<div class="trophy ${date ? 'got' : 'locked'}" style="--tier:${tier.color}">
    <span class="trophy-icon">${hidden ? '?' : a.icon}</span>
    <span class="trophy-text"><b>${hidden ? 'Logro secreto' : a.name}</b><small>${hidden ? 'Sigue jugando para descubrirlo' : a.desc}</small></span>
    <span class="trophy-tier">${date ? date : tier.name}</span>
  </div>`;
}

/** Vitrina de trofeos con progreso total y por categoría. */
export function bindTrophiesPanel() {
  onOpen('ov-trophies', () => {
    const got = getUnlocked();
    const count = ACHIEVEMENTS.filter((a) => got[a.id]).length;
    const points = ACHIEVEMENTS.filter((a) => got[a.id]).reduce((n, a) => n + TIERS[a.tier].points, 0);
    const total = ACHIEVEMENTS.reduce((n, a) => n + TIERS[a.tier].points, 0);
    $('trophy-summary').innerHTML = `<b>${count}</b> de ${ACHIEVEMENTS.length} logros · <b>${points}</b>/${total} puntos
      <div class="bar"><i style="transform:scaleX(${count / ACHIEVEMENTS.length})"></i></div>`;
    $('trophy-list').innerHTML = CATEGORIES.map((c) => {
      const n = c.list.filter((a) => got[a.id]).length;
      return `<h4>${c.name} <small>${n}/${c.list.length}</small></h4>${c.list.map((a) => card(a, got[a.id])).join('')}`;
    }).join('');
  });
}
