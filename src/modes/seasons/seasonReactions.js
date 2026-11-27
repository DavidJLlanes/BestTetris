import { on } from '../../app/bus.js';
import { fx } from '../../effects/state.js';
import { floatText } from '../../effects/floatText.js';
import { playSfx, setMusicTranspose } from '../../audio/index.js';
import { showHint, hideHint } from '../../tutorial/hint.js';
import { $ } from '../../util/dom.js';

const HINT_MS = 2600;

/** Llega una estación: luz de fondo, ambiente, tonalidad de la música y aviso de su regla. */
export function seasonReactions() {
  const clear = () => { delete document.body.dataset.season; fx.ambient = null; };
  on('gameStart', clear);
  on('menu', clear);
  on('season', ({ game, season, year, first }) => {
    document.body.dataset.season = season.id;
    fx.ambient = { kind: season.particle, color: season.tint, parts: null, fade: 0 };
    setMusicTranspose(season.transpose);
    if (!first) { playSfx('levelUp'); floatText(season.name.toUpperCase(), year > 1 ? `año ${year}` : '', season.tint, 1); }
    $('hint').classList.add('top');
    showHint(season.rule, season.name);
    setTimeout(() => { if (game.custom.season === season.id) hideHint(); }, HINT_MS);
  });
}
