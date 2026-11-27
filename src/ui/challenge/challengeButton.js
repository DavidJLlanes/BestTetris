import { $ } from '../../util/dom.js';
import { on } from '../../app/bus.js';
import { loadIdentity } from '../../storage/identity.js';
import { RECORD_KINDS } from '../../modes/recordKinds.js';
import { getMode } from '../../modes/registry.js';
import { shareLink } from '../editor/shareCode.js';
import { canChallengeMode, challengeValue } from '../../social/challenge/challengeable.js';
import { challengeOutcome } from '../../social/challenge/challengeOutcome.js';
import { challengeUrl } from '../../social/challenge/challengeUrl.js';

/** Fin de partida: resultado del reto aceptado y botón para retar a otra persona con tu marca. */
export function bindChallengeButton() {
  let pending = null;
  const btn = $('btn-challenge'), status = $('over-share-status'), res = $('over-challenge');
  on('finish', ({ game: g }) => {
    const value = canChallengeMode(g.hooks) ? challengeValue(g) : null;
    pending = value ? { mode: g.hooks.id, seed: g.seed, value, name: loadIdentity().name } : null;
    btn.hidden = !pending;
    status.textContent = '';
    res.hidden = !g.hooks.challenge;
    if (g.hooks.challenge) { const o = challengeOutcome(g); res.textContent = o.text; res.classList.toggle('won', o.won); }
  });
  btn.addEventListener('click', async () => {
    if (!pending) return;
    const label = RECORD_KINDS[getMode(pending.mode).record].format(pending.value);
    const msg = await shareLink(challengeUrl(pending), 'Reto de BestTris', `Te reto en BestTris: supera mi ${label} con las mismas piezas.`);
    status.textContent = msg || 'No se pudo copiar el enlace.';
  });
}
