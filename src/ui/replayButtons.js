import { $ } from '../util/dom.js';
import { on } from '../app/bus.js';
import { replayState } from '../replay/watchReplay.js';
import { playReplay } from '../replay/playReplay.js';
import { loadReplay } from '../storage/replays.js';

/** "Ver repetición" al terminar, y "▶" junto a cada récord que tenga grabación. */
export function bindReplayButtons() {
  const btn = $('btn-replay');
  on('finish', () => { btn.hidden = !replayState.last; });
  btn.addEventListener('click', () => { if (replayState.last) playReplay(replayState.last); });
  $('records').addEventListener('click', (e) => {
    const b = e.target.closest('[data-replay]');
    const rep = b && loadReplay(b.dataset.replay);
    if (rep) playReplay(rep);
  });
}
