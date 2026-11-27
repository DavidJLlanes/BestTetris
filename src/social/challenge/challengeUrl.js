import { encodeChallenge } from './challengeCode.js';

/** Enlace a esta misma página con el reto dentro. */
export const challengeUrl = (ch) => `${location.origin}${location.pathname}?reto=${encodeChallenge(ch)}`;
