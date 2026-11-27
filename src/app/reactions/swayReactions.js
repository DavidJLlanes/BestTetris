import { on } from '../bus.js';
import { floatText } from '../../effects/floatText.js';
import { impact } from '../../effects/impact.js';
import { playSfx } from '../../audio/index.js';
import { rumble } from '../../input/gamepad/rumble.js';
import { vibrate } from '../../input/haptics.js';
import { app } from '../state.js';

/** Vaivén: aviso antes de cada cambio de gravedad y golpe de efecto al llegar la ráfaga. */
export function swayReactions() {
  on('swayWarn', ({ next }) => { playSfx('count'); floatText(`${next.name.replace(/[¡!]/g, '')} en camino`, '', next.color, 0.7); });
  on('swayPhase', ({ phase }) => {
    floatText(phase.name.toUpperCase(), '', phase.color, 1);
    if (phase.id === 'gust') { playSfx('garbage'); impact(5, app.settings.shake); rumble(0.5, 200); vibrate([20, 30, 20]); }
    else playSfx('count', { high: true });
  });
}
