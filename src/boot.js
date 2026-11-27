/**
 * BestTris · primer paso del arranque. Con sesión abierta, trae el progreso de la cuenta
 * antes de cargar el juego (main.js) para que todo salga ya sincronizado.
 */
import { bootSync } from './sync/bootSync.js';

bootSync().catch(() => {}).finally(() => import('./main.js'));
