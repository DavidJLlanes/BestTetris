import { on } from '../../app/bus.js';
import { playSfx } from '../../audio/index.js';
import { floatText } from '../../effects/floatText.js';
import { formatNumber } from '../../util/formatNumber.js';
import { fx } from '../../effects/state.js';
import { vibrate } from '../../input/haptics.js';

/** Sonido y rótulos de los elementos del Viaje durante la partida. */
export function elementReactions() {
  on('dustCrack', () => playSfx('jCrack'));
  on('iceThaw', ({ count }) => { playSfx('jThaw'); floatText('DESHIELO', `${count} ${count === 1 ? 'bloque' : 'bloques'}`, '#bfefff', 0.7, 2); });
  on('holeSwallow', () => { playSfx('jHole'); floatText('¡TRAGADA!', 'el agujero se lleva otra fila', '#d68bff', 0.8, 1); fx.shake = Math.max(fx.shake, 6); });
  on('shootingStar', () => { playSfx('jStar', { i: 6 }); floatText('ESTRELLA FUGAZ', 'completa su fila a tiempo', '#ffe08a', 0.7, -3); });
  on('shootingCatch', ({ points }) => { playSfx('jCatch'); floatText('¡ATRAPADA!', `+${formatNumber(points)}`, '#ffd34f', 1, -2); vibrate(20); });
  on('bossWarn', ({ attack }) => { playSfx('jBossWarn'); floatText(`${attack.icon} ${attack.name.toUpperCase()}`, 'el jefe ataca', '#ff7a93', 0.8, -4); });
  on('bossAttack', () => { fx.shake = Math.max(fx.shake, 8); vibrate([10, 30, 10]); });
  on('bossHit', ({ dmg, hp }) => { playSfx('jBossHit'); floatText(`−${dmg}`, hp ? '' : '¡VENCIDO!', '#ff9d4f', 0.8, -5); });
}
