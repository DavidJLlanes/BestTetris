import { getProfile } from '../../storage/profile.js';
import { levelFromXp } from '../../progress/levels.js';
import { rankFor, RANKS } from '../../progress/ranks.js';
import { seasonKey, seasonName, seasonStep, SEASON_STEPS } from '../../progress/seasonPass.js';
import { formatNumber } from '../../util/formatNumber.js';

/** Bloque de nivel, rango y temporada del perfil (HTML con datos propios, sin texto del jugador). */
export function progressCardHtml() {
  const p = getProfile();
  const l = levelFromXp(p.xp), rank = rankFor(l.level);
  const next = RANKS.find((r) => r.min > l.level);
  const key = seasonKey(), season = seasonStep(p.seasonXp[key] || 0);
  return `
    <div class="pc-row" style="--rank:${rank.color}">
      <span class="pc-level">${l.level}</span>
      <div class="pc-main">
        <b>${rank.name}</b><small>${formatNumber(l.into)} / ${formatNumber(l.need)} XP${next ? ` · ${next.name} en el nivel ${next.min}` : ''}</small>
        <div class="xp-bar"><i style="transform:scaleX(${l.frac})"></i></div>
      </div>
    </div>
    <div class="pc-season">
      <small>${seasonName(key)} · escalón ${season.step}/${SEASON_STEPS}</small>
      <div class="season-steps">${Array.from({ length: SEASON_STEPS }, (_, i) => `<i class="${i < season.step ? 'on' : i === season.step ? 'now' : ''}" style="--f:${i === season.step ? season.frac : 0}"></i>`).join('')}</div>
    </div>`;
}
