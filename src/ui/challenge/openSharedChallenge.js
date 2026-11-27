import { $ } from '../../util/dom.js';
import { getMode } from '../../modes/registry.js';
import { RECORD_KINDS } from '../../modes/recordKinds.js';
import { pushOverlay } from '../overlays.js';
import { startGame } from '../../app/startGame.js';
import { decodeChallenge } from '../../social/challenge/challengeCode.js';
import { canChallengeMode } from '../../social/challenge/challengeable.js';
import { makeChallengeMode } from '../../social/challenge/makeChallengeMode.js';

const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Si la página se abrió con ?reto=..., enseña el reto y deja aceptarlo. */
export function openSharedChallenge() {
  const code = new URLSearchParams(location.search).get('reto');
  if (!code) return;
  history.replaceState(null, '', location.pathname);
  const ch = decodeChallenge(code), base = ch && getMode(ch.mode);
  if (!canChallengeMode(base)) return;
  const kind = RECORD_KINDS[base.record];
  $('challenge-text').innerHTML = `<b>${esc(ch.name)}</b> te reta en <b>${base.icon} ${base.name}</b>.<br>Marca a batir: <b class="challenge-target">${kind.format(ch.value)}</b>`;
  $('challenge-go').onclick = () => startGame(makeChallengeMode(base, ch));
  pushOverlay('ov-challenge');
}
