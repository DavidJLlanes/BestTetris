import { $ } from '../util/dom.js';
import { loadIdentity } from '../storage/identity.js';

/** Inicial del nombre para cuando no hay foto. */
const initial = (name) => (name.trim()[0] || '?').toUpperCase();

/** Pinta un avatar (foto o inicial) dentro de un elemento. */
export function paintAvatar(el, identity) {
  el.textContent = '';
  el.style.backgroundImage = identity.photo ? `url("${identity.photo}")` : '';
  if (!identity.photo) el.textContent = initial(identity.name);
}

/** Avatar y nombre en la barra superior. */
export function refreshIdentityBadge() {
  const id = loadIdentity();
  paintAvatar($('badge-avatar'), id);
  $('badge-name').textContent = id.name;
}
