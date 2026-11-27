/** Puntos que cuesta el siguiente deshacer: crece con cada uso (1×, 2×, 3×...). */
export const undoCost = (g) => g.rules.undoCost * (g.stats.undos + 1);

/** Deshaceres que quedan en la partida (Infinity si no hay límite). */
export const undoLeft = (g) => Math.max(0, g.rules.undo - g.stats.undos);

/** ¿Se puede deshacer ahora mismo? Hace falta una jugada anterior y que quede algún uso. */
export const canUndo = (g) => !!g && !!g.rules.undo && !g.over && !g.clearing && !!g.cur && g.history.length > 1 && undoLeft(g) > 0;
