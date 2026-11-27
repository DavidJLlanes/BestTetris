/**
 * Respaldo para iPhone sin navigator.audioSession: un <audio> en bucle con silencio pasa la
 * página a sesión de reproducción, y así Web Audio suena aunque el interruptor esté en silencio.
 * Se crea una sola vez, en el primer gesto, y no descarga nada (el silencio se genera aquí).
 */
let el = null;

function silentWav(secs = 0.5, rate = 8000) {
  const n = Math.round(secs * rate), buf = new ArrayBuffer(44 + n), v = new DataView(buf);
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
  str(36, 'data'); v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}

export function startSilentLoop() {
  if (navigator.audioSession) return;
  if (!el) {
    el = document.createElement('audio');
    el.src = silentWav(); el.loop = true; el.preload = 'auto';
    el.setAttribute('playsinline', ''); el.setAttribute('x-webkit-airplay', 'deny');
  }
  if (el.paused) el.play().catch(() => {});
}
