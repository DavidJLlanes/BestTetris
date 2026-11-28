import { loadIdentity, saveIdentity, DEFAULT_IDENTITY } from '../storage/identity.js';

/** Si el jugador aún se llama "Jugador", toma el nombre de la cuenta ("david" → "David"). */
export function nameFromAccount(user) {
  const id = loadIdentity();
  if (id.name !== DEFAULT_IDENTITY.name || !user) return false;
  saveIdentity({ ...id, name: user.charAt(0).toUpperCase() + user.slice(1) });
  return true;
}
