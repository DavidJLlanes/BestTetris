import { loadIdentity } from '../storage/identity.js';
import { getProfile } from '../storage/profile.js';
import { getUnlocked } from '../storage/achievements.js';
import { loadRecords, recordKey } from '../storage/records.js';
import { ACHIEVEMENTS } from '../achievements/registry.js';
import { MODES } from '../modes/registry.js';
import { RECORD_KINDS } from '../modes/recordKinds.js';
import { formatNumber } from '../util/formatNumber.js';
import { levelFromXp } from '../progress/levels.js';
import { rankFor } from '../progress/ranks.js';
import { streak } from '../progress/streak.js';
import { loadDays } from '../storage/days.js';

/** Reúne lo que se muestra en la tarjeta a partir del progreso guardado. */
export function cardData() {
  const identity = loadIdentity();
  const p = getProfile();
  const got = getUnlocked();
  const unlocked = ACHIEVEMENTS.filter((a) => got[a.id]);
  const tierCounts = unlocked.reduce((acc, a) => ({ ...acc, [a.tier]: (acc[a.tier] || 0) + 1 }), {});
  const all = loadRecords();
  const records = MODES.filter((m) => !m.noRecord).map((m) => {
    const best = (all[recordKey(m)] || [])[0];
    return best ? [`${m.icon}  ${m.name}`, RECORD_KINDS[m.record].format(best.value)] : null;
  }).filter(Boolean);
  return {
    identity,
    progress: (({ level }) => ({ level, rank: rankFor(level), streak: streak(loadDays()).current }))(levelFromXp(p.xp)),
    stats: [['Logros', `${unlocked.length}/${ACHIEVEMENTS.length}`], ['Líneas', formatNumber(p.lines)], ['Partidas', formatNumber(p.games)]],
    tierCounts,
    records,
    seed: p.lines + unlocked.length * 7919 + 1,
  };
}
