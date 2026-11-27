import { checkPuzzle } from './checkPuzzle.js';

/** Hilo aparte para comprobar puzles sin congelar la pantalla. */
self.onmessage = (e) => { self.postMessage(checkPuzzle(e.data)); };
