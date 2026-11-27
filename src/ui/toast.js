import { $ } from '../util/dom.js';
import { TIERS } from '../achievements/tiers.js';
import { playSfx } from '../audio/index.js';
import { vibrate } from '../input/haptics.js';
import { rumble } from '../input/gamepad/rumble.js';

const SHOW_MS = 3200;
const queue = [];
let busy = false;

function next() {
  const a = queue.shift();
  if (!a) { busy = false; return; }
  busy = true;
  const tier = TIERS[a.tier];
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.setProperty('--tier', tier.color);
  el.innerHTML = `<span class="toast-icon">${a.icon}</span><span class="toast-text"><small>Logro desbloqueado · ${tier.name}</small><b>${a.name}</b><em>${a.desc}</em></span>`;
  $('toasts').appendChild(el);
  playSfx('achievement', { tier: a.tier });
  vibrate([10, 40, 10]);
  rumble(0.4, 120);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 600);
    next();
  }, SHOW_MS);
}

/** Aviso de logro desbloqueado. Si llegan varios, se muestran en fila. */
export function showToast(achievement) {
  queue.push(achievement);
  if (!busy) next();
}
