import { checkPuzzle } from './checkPuzzle.js';

let worker = null;

/** Comprueba un puzle en segundo plano. Si el navegador no admite workers de módulo, lo hace aquí. */
export function checkInWorker(puzzle) {
  return new Promise((resolve) => {
    try {
      if (worker) worker.terminate();
      worker = new Worker(new URL('./solverWorker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e) => { resolve(e.data); worker.terminate(); worker = null; };
      worker.onerror = () => { worker = null; resolve(checkPuzzle(puzzle)); };
      worker.postMessage(puzzle);
    } catch { resolve(checkPuzzle(puzzle)); }
  });
}
