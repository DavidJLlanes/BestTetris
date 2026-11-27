/** Códigos de puzle: "P1." + JSON en base64 apto para enlaces. Cambia el prefijo si cambia el formato. */
export const CODE_PREFIX = 'P1.';
export const MAX_ROWS = 16;
export const MAX_PIECES = 12;
export const MAX_NAME = 28;
export const ROW_RE = /^[.GIJLOSTZ]{10}$/;
export const PIECES_RE = /^[IJLOSTZ]+$/;
export const CODE_GOALS = ['lines', 'perfect', 'tspin'];
