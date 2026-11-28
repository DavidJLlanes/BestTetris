/** Combustible de la nave: 5 depósitos; perder una constelación gasta 1 y se recarga 1 cada 15 minutos. */
export const FUEL_MAX = 5;
export const FUEL_REGEN_MS = 15 * 60 * 1000;

/** Combustible ahora mismo y cuánto falta para el siguiente (sin modificar nada). */
export function fuelNow(p, now = Date.now()) {
  const f = p.fuel || { n: FUEL_MAX, at: now };
  if (f.n >= FUEL_MAX) return { n: FUEL_MAX, next: 0 };
  const gained = Math.floor((now - f.at) / FUEL_REGEN_MS);
  const n = Math.min(FUEL_MAX, f.n + gained);
  return { n, next: n >= FUEL_MAX ? 0 : FUEL_REGEN_MS - ((now - f.at) % FUEL_REGEN_MS) };
}

/** Cambia el combustible en `delta` (gasta con negativo), contando la recarga hasta ahora. */
export function addFuel(p, delta, now = Date.now()) {
  const cur = fuelNow(p, now);
  const keepPhase = p.fuel && cur.n < FUEL_MAX ? now - (FUEL_REGEN_MS - cur.next) : now;
  p.fuel = { n: Math.max(0, Math.min(FUEL_MAX, cur.n + delta)), at: keepPhase };
}

/** ¿Se puede despegar? En modo calma siempre. */
export const canLaunch = (p) => p.calm || fuelNow(p).n > 0;
