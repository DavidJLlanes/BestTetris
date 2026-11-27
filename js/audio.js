'use strict';
/*
 * PRISMA · Audio
 * Toda la música y los efectos se sintetizan en tiempo real con Web Audio.
 * La composición ("Luz en cascada") es original: re menor, 8 compases en bucle.
 */
const Sound = (() => {
  let ctx = null, master, musicBus, sfxBus, comp, noiseBuf;
  let musicVol = 0.5, sfxVol = 0.7, muted = false;

  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    master = ctx.createGain();
    musicBus = ctx.createGain();
    sfxBus = ctx.createGain();
    musicBus.connect(master); sfxBus.connect(master);
    master.connect(comp); comp.connect(ctx.destination);
    // Buffer de ruido para percusión
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    applyVolumes();
  }

  function applyVolumes() {
    if (!ctx) return;
    const t = ctx.currentTime;
    master.gain.setTargetAtTime(muted ? 0 : 1, t, 0.02);
    musicBus.gain.setTargetAtTime(musicVol * 0.55, t, 0.05);
    sfxBus.gain.setTargetAtTime(sfxVol, t, 0.02);
  }

  // ---------- Bloques básicos ----------
  function tone(bus, { freq, type = 'sine', t, dur, vol = 0.2, a = 0.005, r = 0.08, detune = 0, cutoff = 0, glideTo = 0 }) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); o.detune.value = detune;
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + a);
    g.gain.setValueAtTime(vol, t + Math.max(a, dur - r));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (cutoff) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = cutoff; f.Q.value = 2;
      o.connect(f); node = f;
    }
    node.connect(g); g.connect(bus);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function noise(bus, { t, dur, vol = 0.2, type = 'highpass', freq = 6000, q = 1 }) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bus);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }

  // ---------- Música ----------
  const _ = null;
  // Melodía en corcheas (8 por compás). null = prolonga la nota anterior.
  const MELODY = [
    [69, _, 72, 74, 72, _, 69, 67],
    [65, _, 67, 69, 70, _, 69, 65],
    [67, _, 69, 72, 77, _, 76, 72],
    [74, _, 72, 69, 67, _, _, _],
    [70, _, 74, 77, 74, 72, 70, _],
    [69, _, 65, 69, 74, _, 72, 69],
    [70, _, 69, 67, 65, _, 67, 69],
    [73, _, 76, 73, 69, _, _, _],
  ];
  // Dm Bb F C | Gm Dm Bb A
  const CHORDS = [
    [50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55],
    [55, 58, 62], [50, 53, 57], [46, 50, 53], [45, 49, 52],
  ];
  const BASS_PATTERN = [0, _, 12, 0, _, 0, 12, _]; // relativo a la fundamental, en corcheas

  let playing = false, bpm = 112, step = 0, nextTime = 0, timer = null, intensity = 0;

  function scheduleStep(s, t) {
    const sixteenth = 60 / bpm / 4;
    const bar = Math.floor(s / 16) % 8;
    const inBar = s % 16;
    const chord = CHORDS[bar];
    const root = chord[0];

    // Arpegio (semicorcheas)
    const arpNotes = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 24];
    tone(musicBus, { freq: mtof(arpNotes[inBar % 4]), type: 'triangle', t, dur: sixteenth * 0.9, vol: 0.05 + intensity * 0.02, r: 0.05 });

    // Pad en el inicio del compás
    if (inBar === 0) {
      for (const n of chord) {
        tone(musicBus, { freq: mtof(n + 12), type: 'sawtooth', t, dur: sixteenth * 16, vol: 0.018, a: 0.3, r: 0.6, detune: -7, cutoff: 900 });
        tone(musicBus, { freq: mtof(n + 12), type: 'sawtooth', t, dur: sixteenth * 16, vol: 0.018, a: 0.3, r: 0.6, detune: 7, cutoff: 900 });
      }
    }

    // Bajo y melodía en corcheas
    if (inBar % 2 === 0) {
      const e = inBar / 2;
      const b = BASS_PATTERN[e];
      if (b !== null) tone(musicBus, { freq: mtof(root - 12 + b), type: 'square', t, dur: sixteenth * 1.8, vol: 0.07, cutoff: 500, r: 0.06 });

      const line = MELODY[bar];
      const m = line[e];
      if (m !== null && intensity > 0.15) {
        let len = 1;
        while (e + len < 8 && line[e + len] === null) len++;
        const dur = sixteenth * 2 * len * 0.95;
        tone(musicBus, { freq: mtof(m), type: 'sawtooth', t, dur, vol: 0.05, a: 0.01, r: 0.12, cutoff: 2400, detune: -5 });
        tone(musicBus, { freq: mtof(m + 12), type: 'sine', t, dur, vol: 0.025, a: 0.01, r: 0.12 });
      }
    }

    // Percusión
    if (inBar % 4 === 0) { // bombo en cada negra
      tone(musicBus, { freq: 140, glideTo: 40, type: 'sine', t, dur: 0.18, vol: 0.35, r: 0.1 });
    }
    if (inBar === 4 || inBar === 12) noise(musicBus, { t, dur: 0.14, vol: 0.12, type: 'bandpass', freq: 1800, q: 0.8 });
    if (inBar % 2 === 1 && intensity > 0.3) noise(musicBus, { t, dur: 0.04, vol: 0.05, freq: 8000 });
  }

  function tick() {
    if (!playing) return;
    const ahead = 0.15;
    while (nextTime < ctx.currentTime + ahead) {
      scheduleStep(step, nextTime);
      nextTime += 60 / bpm / 4;
      step = (step + 1) % (16 * 8);
    }
  }

  function startMusic() {
    if (!ctx || playing) return;
    playing = true; step = 0; nextTime = ctx.currentTime + 0.08;
    timer = setInterval(tick, 25);
  }
  function stopMusic() { playing = false; clearInterval(timer); }
  function setLevel(level) {
    bpm = Math.min(112 + (level - 1) * 4, 168);
    intensity = Math.min(1, 0.2 + (level - 1) * 0.12);
  }

  // ---------- Efectos ----------
  const SFX = {
    move(t) { tone(sfxBus, { freq: 520, type: 'triangle', t, dur: 0.03, vol: 0.06 }); },
    rotate(t) { tone(sfxBus, { freq: 760, glideTo: 980, type: 'triangle', t, dur: 0.05, vol: 0.07 }); },
    soft(t) { tone(sfxBus, { freq: 300, type: 'triangle', t, dur: 0.02, vol: 0.03 }); },
    lock(t) { tone(sfxBus, { freq: 220, glideTo: 120, type: 'sine', t, dur: 0.09, vol: 0.18 }); noise(sfxBus, { t, dur: 0.05, vol: 0.05, type: 'lowpass', freq: 1500 }); },
    hard(t) { tone(sfxBus, { freq: 180, glideTo: 50, type: 'sine', t, dur: 0.16, vol: 0.35 }); noise(sfxBus, { t, dur: 0.12, vol: 0.12, type: 'lowpass', freq: 2200 }); },
    hold(t) { tone(sfxBus, { freq: 440, glideTo: 660, type: 'sine', t, dur: 0.1, vol: 0.1 }); },
    clear(t, n) {
      const base = [0, 72, 76, 79, 84][n] || 72;
      const notes = n >= 4 ? [0, 4, 7, 12, 16] : [0, 4, 7].slice(0, n + 1);
      notes.forEach((iv, i) => tone(sfxBus, { freq: mtof(base + iv), type: 'triangle', t: t + i * 0.045, dur: 0.35, vol: 0.12, r: 0.25 }));
      noise(sfxBus, { t, dur: 0.3 + n * 0.08, vol: 0.06 + n * 0.02, type: 'highpass', freq: 3000 });
    },
    tspin(t) { [79, 83, 86, 91].forEach((m, i) => tone(sfxBus, { freq: mtof(m), type: 'sine', t: t + i * 0.035, dur: 0.25, vol: 0.09 })); },
    level(t) { [72, 76, 79, 84, 88].forEach((m, i) => tone(sfxBus, { freq: mtof(m), type: 'square', t: t + i * 0.07, dur: 0.18, vol: 0.06, cutoff: 3000 })); },
    over(t) { [69, 65, 62, 57, 50].forEach((m, i) => tone(sfxBus, { freq: mtof(m), type: 'sawtooth', t: t + i * 0.16, dur: 0.4, vol: 0.08, cutoff: 1200 })); },
    count(t, hi) { tone(sfxBus, { freq: hi ? 880 : 587, type: 'square', t, dur: 0.12, vol: 0.07, cutoff: 2500 }); },
    win(t) { [72, 76, 79, 84, 79, 84, 88].forEach((m, i) => tone(sfxBus, { freq: mtof(m), type: 'triangle', t: t + i * 0.09, dur: 0.3, vol: 0.1 })); },
    ui(t) { tone(sfxBus, { freq: 660, type: 'sine', t, dur: 0.05, vol: 0.06 }); },
  };

  function play(name, arg) {
    if (!ctx || muted || !SFX[name]) return;
    SFX[name](ctx.currentTime + 0.005, arg);
  }

  return {
    init, play, startMusic, stopMusic, setLevel,
    setMusicVolume(v) { musicVol = v; applyVolumes(); },
    setSfxVolume(v) { sfxVol = v; applyVolumes(); },
    toggleMute() { muted = !muted; applyVolumes(); return muted; },
    get muted() { return muted; },
  };
})();
