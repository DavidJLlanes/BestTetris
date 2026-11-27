import { audio, initAudio } from './context.js';

/**
 * iPhone y otros navegadores solo dejan sonar el audio tras un gesto, y lo cortan al
 * volver de otra app ("interrupted"). Cualquier toque, clic o tecla lo reactiva.
 */
export function unlockAudio() {
  const wake = () => {
    initAudio();
    const ctx = audio.ctx;
    if (!ctx) return;
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    if (!audio.unlocked) { // un silencio cortísimo: en iOS antiguos es lo que desbloquea la salida
      const src = ctx.createBufferSource();
      src.buffer = ctx.createBuffer(1, 1, 22050);
      src.connect(ctx.destination); src.start(0);
      audio.unlocked = true;
    }
  };
  for (const ev of ['pointerup', 'touchend', 'keydown']) addEventListener(ev, wake, { capture: true, passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && audio.ctx && audio.ctx.state !== 'running') audio.ctx.resume().catch(() => {});
  });
}
