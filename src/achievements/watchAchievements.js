import { on, emit } from '../app/bus.js';
import { getUnlocked, markUnlocked } from '../storage/achievements.js';
import { getProfile } from '../storage/profile.js';
import { checkAchievements } from './checkAchievements.js';

const EVENTS = ['score', 'clear', 'perfectClear', 'levelUp', 'hold', 'finish'];

/** Escucha la partida y desbloquea logros; avisa con el evento 'achievement'. */
export function watchAchievements() {
  for (const event of EVENTS) {
    on(event, (data) => {
      if (!data.game) return;
      const found = checkAchievements(event, { g: data.game, data, profile: getProfile() }, getUnlocked());
      for (const a of found) { markUnlocked(a.id); emit('achievement', a); }
    });
  }
}
