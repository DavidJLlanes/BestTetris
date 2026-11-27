import { on } from '../bus.js';
import { app } from '../state.js';
import { fx } from '../../effects/state.js';
import { floatText } from '../../effects/floatText.js';
import { impact } from '../../effects/impact.js';
import { spawnParticles } from '../../effects/spawnParticles.js';
import { playSfx } from '../../audio/index.js';
import { rumble } from '../../input/gamepad/rumble.js';
import { vibrate } from '../../input/haptics.js';
import { POWERS } from '../../modes/powers/powerList.js';

/** Poderes: aviso al cargarse, efecto propio de cada uno y fin de la congelación. */
export function powerReactions() {
  on('powerReady', ({ id }) => { const p = POWERS[id]; playSfx('achievement', { tier: 'gold' }); floatText(`${p.icon} ${p.name.toUpperCase()}`, 'listo: pulsa V o ✦', p.color, 0.8); vibrate([10, 30, 10]); });
  on('powerFail', () => playSfx('denied'));
  on('power', ({ id, power }) => {
    floatText(power.name.toUpperCase(), '', power.color, 1);
    rumble(0.5, 160); vibrate(25);
    if (id === 'freeze') { playSfx('hold'); fx.freeze = 1; }
    if (id === 'zone') { playSfx('bomb'); impact(9, app.settings.shake); for (let x = 0; x < 10; x++) spawnParticles(x + 0.5, 19.5, power.color, 3, { speed: 7, life: 0.6, size: 3 }); }
    if (id === 'swap') { playSfx('rotate'); fx.levelFlash = 0.6; }
  });
  on('thaw', () => { fx.freeze = 0; playSfx('ui'); });
  on('gameStart', () => { fx.freeze = 0; });
}
