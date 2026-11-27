import { on } from '../bus.js';
import { app } from '../state.js';
import { fx } from '../../effects/state.js';
import { floatText } from '../../effects/floatText.js';
import { spawnParticles } from '../../effects/spawnParticles.js';
import { impact } from '../../effects/impact.js';
import { slowMotion } from '../../effects/slowMotion.js';
import { playSfx, duckMusic } from '../../audio/index.js';
import { vibrate } from '../../input/haptics.js';
import { rumble } from '../../input/gamepad/rumble.js';

const GOLD = '#ffd34f';
const body = () => document.body.classList;

/** Imagen, sonido y vibración del momento estelar. */
export function starReactions() {
  const stop = () => { body().remove('star-active', 'star-ending'); duckMusic(1); };
  on('starCharge', ({ ready, full }) => {
    if (full) floatText('MOMENTO ESTELAR LISTO', 'pulsa ★ o V', GOLD, 0.8, -1.6);
    else if (ready) floatText('★ DISPONIBLE', '', GOLD, 0.7, -1.6);
  });
  on('starStart', () => {
    body().add('star-active');
    playSfx('starStart'); duckMusic(0.45);
    floatText('MOMENTO ESTELAR', 'el tiempo se detiene', GOLD, 1.1, -0.6);
    vibrate([12, 40, 24]); rumble(0.5, 200);
  });
  on('starStack', ({ rows, total }) => {
    playSfx('starStack', { total });
    for (let i = 0; i < rows; i++) for (let x = 0; x < 10; x++) spawnParticles(x + 0.5, 20 - total + i + 0.5, GOLD, 1, { speed: 3, life: 0.6, size: 2, gravity: 0.2 });
    vibrate(8);
  });
  on('starTimeUp', () => { body().add('star-ending'); floatText('¡SUELTA!', 'fija la pieza', '#ffffff', 0.9, -1.2); });
  on('starEnd', ({ lines }) => {
    stop();
    if (!lines) return;
    playSfx('starEnd', { lines });
    impact(Math.min(14, 6 + lines), app.settings.shake);
    if (app.settings.slowmo) slowMotion(0.8, 0.3, 0.08);
    for (let i = 0; i < Math.min(lines, 20) * 10; i++) spawnParticles(Math.random() * 10, 20 - Math.random() * lines, Math.random() < 0.6 ? GOLD : '#ffffff', 1, { speed: 9 + lines, life: 1.1, size: 2.6, gravity: 0.4 });
    vibrate([30, 30, 40, 30, 60]); rumble(1, 500);
    fx.levelFlash = 1;
  });
  on('gameStart', stop);
  on('menu', stop);
  on('finish', stop);
}
