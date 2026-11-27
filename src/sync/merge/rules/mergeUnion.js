/** Logros: se juntan los dos lados; si los dos tienen el mismo, se queda la fecha de a. */
export function mergeUnion(a = {}, b = {}) {
  return { ...b, ...a };
}
