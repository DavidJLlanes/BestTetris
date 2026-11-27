/** Bus de eventos de la aplicación: el núcleo emite, los demás módulos escuchan. */
const listeners = new Map();

export function on(name, fn) {
  if (!listeners.has(name)) listeners.set(name, []);
  listeners.get(name).push(fn);
}

export function emit(name, data = {}) {
  const list = listeners.get(name);
  if (list) for (const fn of list) fn(data);
  const any = listeners.get('*');
  if (any) for (const fn of any) fn(name, data);
}
