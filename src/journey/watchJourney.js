import { on, emit } from '../app/bus.js';
import { getJourney } from './progress/journeyStore.js';
import { recordResult } from './progress/recordResult.js';
import { unlockSnapshot, unlockNotes } from './ui/unlockNotes.js';
import { renderResult } from './ui/resultPanel.js';
import { levelHint } from './ui/levelHint.js';
import { elementReactions } from './ui/elementReactions.js';
import { totalStars } from './progress/stars.js';

/**
 * Partidas del Viaje: al empezar anuncia el objetivo; al terminar apunta estrellas y polvo,
 * prepara la pantalla de resultado y avisa a los logros con el evento 'journey'.
 */
export function watchJourney() {
  elementReactions();
  on('gameStart', ({ game }) => levelHint(game));
  on('finish', ({ game }) => {
    const level = game.hooks.level;
    if (!level) return;
    const before = unlockSnapshot(getJourney());
    const r = recordResult(level, game);
    r.notes = unlockNotes(before, unlockSnapshot(getJourney()));
    renderResult(r, game);
    emit('journey', { game, result: r, progress: getJourney(), stars: totalStars(getJourney()) });
  });
}
