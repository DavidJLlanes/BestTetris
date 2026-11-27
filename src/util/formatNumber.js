const fmt = new Intl.NumberFormat('es-ES');
/** 12345 → "12.345" */
export function formatNumber(n) { return fmt.format(n); }
