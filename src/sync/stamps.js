import { load, save } from '../storage/store.js';

/** Cuándo cambió por última vez cada clave del guardado en este dispositivo (para fusionar ajustes y nombre). */
export const loadStamps = () => load('syncStamps', {});
export const saveStamps = (stamps) => save('syncStamps', stamps, { silent: true });
export function touchStamp(key) { saveStamps({ ...loadStamps(), [key]: Date.now() }); }
