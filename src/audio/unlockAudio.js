import { audio, initAudio } from './context.js';
import { usePlaybackSession } from './audioSession.js';
import { startSilentLoop } from './silentLoop.js';

/**
 * iPhone y otros navegadores solo dejan sonar el audio tras un gesto, lo callan con el
 * interruptor de silencio y lo cortan al volver de otra app o de una llamada ("interrupted").
 * Cada toque, clic o tecla lo reactiva; al volver a la página se intenta reanudar solo.
 */
export function unlockAudio() {
  usePlaybackSession();
  const resume = () => { const ctx = audio.ctx; if (ctx && ctx.state !== 'running' && !document.hidden) ctx.resume().catch(() => {}); };
  const wake = () => {
    usePlaybackSession();
    startSilentLoop();
    initAudio();
    const ctx = audio.ctx;
    if (!ctx) return;
    resume();
    if (!audio.unlocked) { // un silencio cortísimo: en iOS es lo que abre la salida de sonido
      const src = ctx.createBufferSource();
      src.buffer = ctx.createBuffer(1, 1, 22050);
      src.connect(ctx.destination); src.start(0);
      audio.unlocked = true;
      ctx.addEventListener('statechange', resume);
    }
  };
  for (const ev of ['pointerup', 'touchend', 'click', 'keydown']) addEventListener(ev, wake, { capture: true, passive: true });
  document.addEventListener('visibilitychange', resume);
  addEventListener('pageshow', resume);
  addEventListener('focus', resume);
}
