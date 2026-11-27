import { on, emit } from '../app/bus.js';
import { getProfile, saveProfile } from '../storage/profile.js';
import { addDay } from '../storage/days.js';
import { addHistory } from '../storage/history.js';
import { gameXp, TIER_XP } from './xp.js';
import { levelFromXp } from './levels.js';
import { rankFor } from './ranks.js';
import { seasonKey } from './seasonPass.js';

/** Suma experiencia (al total y a la temporada del mes) y avisa si sube de nivel o de rango. */
function grant(xp, reason) {
  if (!xp) return;
  const p = getProfile();
  const before = levelFromXp(p.xp).level;
  p.xp += xp;
  const key = seasonKey();
  p.seasonXp[key] = (p.seasonXp[key] || 0) + xp;
  const after = levelFromXp(p.xp).level;
  saveProfile();
  emit('xp', { gained: xp, reason, before, after, total: p.xp });
  if (after > before) emit('levelUp:player', { level: after, rank: rankFor(after), rankUp: rankFor(after) !== rankFor(before) });
}

/** Experiencia, días jugados e historial. Va después del perfil y de los logros. */
export function trackProgress() {
  on('finish', ({ game: g }) => {
    if (g.hooks.spectate) return;
    const xp = gameXp(g);
    g.stats.xp = xp;
    addDay(g.lines, xp);
    if (!g.hooks.puzzle) addHistory(g);
    grant(xp, 'game');
  });
  on('achievement', (a) => grant(TIER_XP[a.tier] || 0, 'achievement'));
}
