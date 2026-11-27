import { load, save } from './store.js';

/** Nombre y foto del jugador. Solo existen en este navegador. */
export const DEFAULT_IDENTITY = { name: 'Jugador', photo: null };

export function loadIdentity() { return { ...DEFAULT_IDENTITY, ...load('identity', {}) }; }

export function saveIdentity(identity) {
  const name = String(identity.name || '').trim().slice(0, 24) || DEFAULT_IDENTITY.name;
  save('identity', { name, photo: identity.photo || null });
}
