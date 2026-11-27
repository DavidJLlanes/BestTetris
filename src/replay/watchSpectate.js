import { $ } from '../util/dom.js';
import { on } from '../app/bus.js';
import { showHint, hideHint } from '../tutorial/hint.js';

/** Al ver una repetición: rótulo fijo arriba y controles apagados. Va después del tutorial y los puzles. */
export function watchSpectate() {
  on('gameStart', ({ game }) => {
    const watching = !!game.hooks.spectate;
    document.body.classList.toggle('spectating', watching);
    if (!watching) return;
    $('hint').classList.add('top');
    showHint(game.hooks.name.replace(/^Repetición · /, ''), '▶ Repetición');
  });
  on('finish', ({ game }) => { if (game.hooks.spectate) hideHint(); });
  on('menu', () => { document.body.classList.remove('spectating'); });
}
