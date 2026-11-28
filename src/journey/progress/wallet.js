/** Polvo estelar: se gana al superar constelaciones y se gasta en los planetas tienda. */
export const balance = (p) => Math.max(0, (p.earned || 0) - (p.spent || 0));

/** Gasta polvo si llega. Devuelve true si se pudo. */
export function spend(p, amount) {
  if (balance(p) < amount) return false;
  p.spent = (p.spent || 0) + amount;
  return true;
}

/** Poderes que el jugador tiene guardados de un tipo (comprados menos usados). */
export const owned = (p, id) => Math.max(0, ((p.bought || {})[id] || 0) - ((p.used || {})[id] || 0));
