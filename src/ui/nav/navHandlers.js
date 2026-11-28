/**
 * Pantallas con navegación propia (como el mapa del Viaje): registran aquí una función
 * (dirección) → true si la han resuelto ellas.
 */
const handlers = new Map();

export const registerNav = (overlayId, fn) => handlers.set(overlayId, fn);
export const navHandler = (overlayId) => handlers.get(overlayId);
