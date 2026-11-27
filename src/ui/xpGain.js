import { $ } from '../util/dom.js';
import { getProfile } from '../storage/profile.js';
import { levelFromXp } from '../progress/levels.js';
import { rankFor } from '../progress/ranks.js';
import { formatNumber } from '../util/formatNumber.js';

const FILL_DELAY_MS = 450;

/** Barra de experiencia al terminar: parte de donde estabas y se llena con lo ganado. */
export function renderXpGain(g) {
  const box = $('over-xp'), bar = $('over-xp-bar');
  const gained = g.stats.xp || 0;
  box.hidden = !gained;
  if (!gained) return;
  const now = levelFromXp(getProfile().xp);
  const before = levelFromXp(getProfile().xp - gained);
  const rank = rankFor(now.level);
  $('over-xp-level').textContent = `Nivel ${now.level} · ${rank.name}`;
  $('over-xp-text').textContent = `+${formatNumber(gained)} XP`;
  box.style.setProperty('--rank', rank.color);
  bar.style.transition = 'none';
  bar.style.transform = `scaleX(${before.level < now.level ? 0 : before.frac})`;
  void bar.offsetWidth;
  bar.style.transition = '';
  setTimeout(() => { bar.style.transform = `scaleX(${now.frac})`; }, FILL_DELAY_MS);
}
