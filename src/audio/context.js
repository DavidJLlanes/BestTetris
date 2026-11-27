/** Contexto de Web Audio compartido, con buses separados para música y efectos. */
export const audio = { ctx: null, master: null, music: null, sfx: null, noise: null, muted: false, musicVol: 0.5, sfxVol: 0.7 };

function makeNoise(ctx) {
  const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/** Crea el contexto en el primer gesto del jugador (los navegadores lo exigen). */
export function initAudio() {
  if (audio.ctx) { if (audio.ctx.state === 'suspended') audio.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ctx = new AC({ latencyHint: 'interactive' });
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 4;
  audio.ctx = ctx;
  audio.master = ctx.createGain();
  audio.music = ctx.createGain();
  audio.sfx = ctx.createGain();
  audio.music.connect(audio.master);
  audio.sfx.connect(audio.master);
  audio.master.connect(comp);
  comp.connect(ctx.destination);
  audio.noise = makeNoise(ctx);
  applyVolumes();
}

export function applyVolumes() {
  if (!audio.ctx) return;
  const t = audio.ctx.currentTime;
  audio.master.gain.setTargetAtTime(audio.muted ? 0 : 1, t, 0.02);
  audio.music.gain.setTargetAtTime(audio.musicVol * 0.55, t, 0.05);
  audio.sfx.gain.setTargetAtTime(audio.sfxVol, t, 0.02);
}
