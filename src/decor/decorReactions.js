import { on } from '../app/bus.js';
import { COLORS } from '../config/colors.js';
import { decor } from './state.js';
import { getProfile } from '../storage/profile.js';
import { levelFromXp } from '../progress/levels.js';
import { rankFor } from '../progress/ranks.js';

/** El latido toma el color del rango del jugador (las estaciones lo cambian por el suyo). */
const tintRank = () => document.getElementById('decor').style.setProperty('--rank-glow', rankFor(levelFromXp(getProfile().xp).level).color);

const replay = (el) => { if (!el) return; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); };

/** La decoración responde a la partida: color de la pieza, destellos, ondas y brillo del marco. */
export function decorReactions() {
  const wrap = document.getElementById('board-wrap');
  tintRank();
  on('levelUp:player', tintRank);
  on('spawn', ({ game }) => { if (game.cur) wrap.style.setProperty('--piece', COLORS[game.cur.type][0]); });
  on('clear', ({ rows }) => { decor.flash = Math.min(1, decor.flash + 0.18 * rows.length); });
  on('perfectClear', () => { decor.flash = 1; replay(document.getElementById('decor-ring')); });
  on('levelUp', () => { replay(document.getElementById('decor-ring')); replay(document.getElementById('board-sheen')); });
  on('newBest', () => replay(document.getElementById('board-sheen')));
}
