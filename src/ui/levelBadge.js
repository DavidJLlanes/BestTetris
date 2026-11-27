import { $ } from '../util/dom.js';
import { on } from '../app/bus.js';
import { getProfile } from '../storage/profile.js';
import { levelFromXp } from '../progress/levels.js';
import { rankFor } from '../progress/ranks.js';
import { showToast } from './toast.js';

/** Nivel y rango junto al avatar; el anillo del avatar toma el color del rango. */
export function refreshLevelBadge() {
  const { level } = levelFromXp(getProfile().xp);
  const rank = rankFor(level);
  $('badge-level').textContent = `Nv ${level} · ${rank.name}`;
  document.documentElement.style.setProperty('--rank', rank.color);
}

export function bindLevelBadge() {
  refreshLevelBadge();
  on('xp', refreshLevelBadge);
  on('levelUp:player', ({ level, rank, rankUp }) => {
    showToast(rankUp
      ? { icon: '★', name: `Rango ${rank.name}`, desc: `Has llegado al nivel ${level}`, tier: 'prism', color: rank.color, kicker: 'Nuevo rango' }
      : { icon: level, name: `Nivel ${level}`, desc: 'Puede que hayas desbloqueado un tema nuevo', tier: 'gold', color: rank.color, kicker: 'Subes de nivel' });
  });
}
