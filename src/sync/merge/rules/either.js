/** Basta con que un dispositivo lo haya hecho (por ejemplo, terminar el tutorial). */
export const either = (a, b) => (a === undefined && b === undefined ? undefined : Boolean(a || b));
