import { syncNow } from './syncNow.js';
import { emitSync } from './syncEvents.js';

let chain = Promise.resolve();

/** Sincroniza de una en una (nunca dos a la vez) y avisa a la interfaz del resultado. */
export function runSync(opts) {
  const job = chain.then(() => { emitSync('busy'); return syncNow(opts); });
  chain = job.then(() => emitSync('done'), (e) => emitSync('error', e)).catch(() => {});
  return job;
}
