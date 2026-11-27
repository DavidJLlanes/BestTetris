/**
 * Registro de modos. Para añadir un modo: crea un archivo en ./list/ y añádelo aquí.
 * Nada más del juego necesita cambiar: el menú, los récords y los logros lo recogen solos.
 */
import marathon from './list/marathon.js';
import sprint from './list/sprint.js';
import ultra from './list/ultra.js';
import dig from './list/dig.js';
import tide from './list/tide.js';
import master from './list/master.js';
import shadow from './list/shadow.js';
import purist from './list/purist.js';
import daily from './list/daily.js';
import zen from './list/zen.js';

export const MODES = [marathon, sprint, ultra, dig, tide, master, shadow, purist, daily, zen]
  .sort((a, b) => a.order - b.order);

export const getMode = (id) => MODES.find((m) => m.id === id);
