/**
 * En iPhone, Web Audio calla con el interruptor de silencio activado: la página se trata como
 * sonido de "ambiente". Con la sesión de audio en 'playback' (Safari 16.4+) el juego suena como
 * cualquier app de música o juego. Devuelve el tipo de sesión que quedó, o '' si no existe.
 */
export function usePlaybackSession() {
  const s = navigator.audioSession;
  if (!s) return '';
  try { if (s.type !== 'playback') s.type = 'playback'; } catch { /* sin control de sesión */ }
  return s.type || '';
}
