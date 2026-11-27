import { $ } from '../util/dom.js';
import { setMuted, isMuted } from '../audio/index.js';
import { save } from '../storage/store.js';

export function toggleMute() {
  const m = !isMuted();
  setMuted(m);
  $('btn-mute').classList.toggle('off', m);
  save('muted', m);
}
