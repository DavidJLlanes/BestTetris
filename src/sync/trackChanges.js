import { onSave } from '../storage/store.js';
import { SAVE_KEYS } from '../storage/keys.js';
import { touchStamp } from './stamps.js';
import { loadMeta, saveMeta } from './syncMeta.js';
import { schedulePush } from './schedulePush.js';

/** Cada vez que el juego guarda progreso: apunta cuándo cambió y, con sesión, lo sube en unos segundos. */
export function trackChanges() {
  onSave((key) => {
    if (!SAVE_KEYS.includes(key)) return;
    touchStamp(key);
    if (!loadMeta().user) return;
    saveMeta({ dirty: true });
    schedulePush();
  });
}
