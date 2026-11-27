'use strict';
/*
 * PRISMA · lógica del juego
 * Tablero de 10×20 (+2 filas ocultas), bolsa de 7 piezas, rotación con
 * compensación de paredes, reserva, 5 piezas siguientes, pieza fantasma,
 * retardo de bloqueo, giros-T, combos, back-to-back y limpieza total.
 */
(() => {
  // ---------------------------------------------------------------- Constantes
  const COLS = 10, ROWS = 20, HIDDEN = 2, TOTAL = ROWS + HIDDEN;
  const LOCK_DELAY = 0.5, MAX_RESETS = 15, CLEAR_TIME = 0.32;
  const SPRINT_LINES = 40;

  // Paleta propia "prisma": cada pieza es una gema
  const COLORS = {
    I: ['#46e6ff', '#0a8fb8'],
    O: ['#ffd34f', '#c98a00'],
    T: ['#c07bff', '#6c2bd9'],
    S: ['#5cff9d', '#11a85a'],
    Z: ['#ff5c7a', '#c01e45'],
    J: ['#5c8bff', '#2440c9'],
    L: ['#ff9d4f', '#cc5a0b'],
    X: ['#8a86b8', '#4a4675'], // bloques de basura / fin de partida
  };

  const SHAPES = {
    I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    O: [[1,1],[1,1]],
    T: [[0,1,0],[1,1,1],[0,0,0]],
    S: [[0,1,1],[1,1,0],[0,0,0]],
    Z: [[1,1,0],[0,1,1],[0,0,0]],
    J: [[1,0,0],[1,1,1],[0,0,0]],
    L: [[0,0,1],[1,1,1],[0,0,0]],
  };
  const TYPES = Object.keys(SHAPES);

  function rotateCW(m) {
    const n = m.length;
    return m.map((row, r) => row.map((_, c) => m[n - 1 - c][r]));
  }
  // ROT[type][state] = lista de [x,y] ocupadas
  const ROT = {};
  for (const t of TYPES) {
    ROT[t] = [];
    let m = SHAPES[t];
    for (let s = 0; s < 4; s++) {
      const cells = [];
      m.forEach((row, y) => row.forEach((v, x) => { if (v) cells.push([x, y]); }));
      ROT[t].push(cells);
      m = rotateCW(m);
    }
  }

  // Tablas de compensación (coordenadas con y hacia abajo)
  const K = (arr) => arr.map(([x, y]) => [x, -y]);
  const KICKS = {
    '0>1': K([[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]]),
    '1>0': K([[0,0],[1,0],[1,-1],[0,2],[1,2]]),
    '1>2': K([[0,0],[1,0],[1,-1],[0,2],[1,2]]),
    '2>1': K([[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]]),
    '2>3': K([[0,0],[1,0],[1,1],[0,-2],[1,-2]]),
    '3>2': K([[0,0],[-1,0],[-1,-1],[0,2],[-1,2]]),
    '3>0': K([[0,0],[-1,0],[-1,-1],[0,2],[-1,2]]),
    '0>3': K([[0,0],[1,0],[1,1],[0,-2],[1,-2]]),
  };
  const KICKS_I = {
    '0>1': K([[0,0],[-2,0],[1,0],[-2,-1],[1,2]]),
    '1>0': K([[0,0],[2,0],[-1,0],[2,1],[-1,-2]]),
    '1>2': K([[0,0],[-1,0],[2,0],[-1,2],[2,-1]]),
    '2>1': K([[0,0],[1,0],[-2,0],[1,-2],[-2,1]]),
    '2>3': K([[0,0],[2,0],[-1,0],[2,1],[-1,-2]]),
    '3>2': K([[0,0],[-2,0],[1,0],[-2,-1],[1,2]]),
    '3>0': K([[0,0],[1,0],[-2,0],[1,-2],[-2,1]]),
    '0>3': K([[0,0],[-1,0],[2,0],[-1,2],[2,-1]]),
  };
  const KICKS_180 = [[0,0],[0,-1],[1,0],[-1,0],[0,1],[1,-1],[-1,-1]];

  // --------------------------------------------------------------- Ajustes
  const DEFAULTS = { music: 50, sfx: 70, das: 150, arr: 30, ghost: true, shake: true, grid: true };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('prisma.' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('prisma.' + k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
  };
  const settings = Object.assign({}, DEFAULTS, store.get('settings', {}));

  // --------------------------------------------------------------- DOM
  const $ = (id) => document.getElementById(id);
  const boardCv = $('board'), holdCv = $('hold'), nextCv = $('next');
  const bctx = boardCv.getContext('2d'), hctx = holdCv.getContext('2d'), nctx = nextCv.getContext('2d');
  const ui = {
    score: $('s-score'), level: $('s-level'), lines: $('s-lines'), time: $('s-time'), best: $('s-best'),
    countdown: $('countdown'),
  };
  const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  if (isTouch) document.body.classList.add('is-touch');

  let cell = 30, dpr = 1;

  // --------------------------------------------------------------- Estado
  let G = null; // partida actual
  let screen = 'menu'; // menu | countdown | play | pause | over
  let overlayStack = [];

  function newGame(mode) {
    G = {
      mode,
      board: Array.from({ length: TOTAL }, () => Array(COLS).fill(null)),
      bag: [], queue: [],
      cur: null, hold: null, holdUsed: false,
      score: 0, lines: 0, level: 1, combo: -1, b2b: false,
      time: 0, gravAcc: 0, lockTimer: 0, resets: 0, lowestY: 0,
      lastRotate: false, lastKick: 0,
      clearing: null, // {rows, t}
      stats: { pieces: 0, quads: 0, tspins: 0, maxCombo: 0, pc: 0 },
      over: false,
    };
    while (G.queue.length < 6) G.queue.push(fromBag());
    Sound.setLevel(1);
  }

  function fromBag() {
    if (!G.bag.length) {
      G.bag = TYPES.slice();
      for (let i = G.bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [G.bag[i], G.bag[j]] = [G.bag[j], G.bag[i]];
      }
    }
    return G.bag.pop();
  }

  function makePiece(type) {
    const size = SHAPES[type].length;
    return { type, rot: 0, x: Math.floor((COLS - size) / 2), y: HIDDEN - 1 };
  }

  function cellsOf(p, rot = p.rot, x = p.x, y = p.y) {
    return ROT[p.type][rot].map(([cx, cy]) => [x + cx, y + cy]);
  }

  function collides(p, rot = p.rot, x = p.x, y = p.y) {
    for (const [cx, cy] of cellsOf(p, rot, x, y)) {
      if (cx < 0 || cx >= COLS || cy >= TOTAL) return true;
      if (cy >= 0 && G.board[cy][cx]) return true;
    }
    return false;
  }

  function spawn(type) {
    const p = makePiece(type || G.queue.shift());
    if (!type) G.queue.push(fromBag());
    G.cur = p;
    G.lockTimer = 0; G.resets = 0; G.lowestY = p.y; G.gravAcc = 0;
    G.lastRotate = false;
    if (collides(p)) { topOut(); return; }
    // Como en la mayoría de juegos del género, la pieza baja una fila al aparecer si puede
    if (!collides(p, p.rot, p.x, p.y + 1)) p.y++;
    // Si se mantiene una dirección pulsada, aplica el desplazamiento cargado
    if (input.dir && input.dasT >= settings.das / 1000) shiftMax(input.dir, settings.arr === 0);
  }

  function gravityInterval(level) {
    if (G.mode === 'zen') return 1.0;
    return Math.pow(0.8 - (level - 1) * 0.007, level - 1);
  }

  function onGround() { return collides(G.cur, G.cur.rot, G.cur.x, G.cur.y + 1); }

  function resetLock() {
    if (onGround() && G.resets < MAX_RESETS) { G.lockTimer = 0; G.resets++; }
  }

  function tryMove(dx, dy) {
    const p = G.cur;
    if (!p || collides(p, p.rot, p.x + dx, p.y + dy)) return false;
    p.x += dx; p.y += dy;
    if (dy > 0 && p.y > G.lowestY) { G.lowestY = p.y; G.resets = 0; }
    if (dx) { G.lastRotate = false; resetLock(); }
    return true;
  }

  function shiftMax(dir, instant) {
    if (instant) { let moved = false; while (tryMove(dir, 0)) moved = true; return moved; }
    return tryMove(dir, 0);
  }

  function tryRotate(dirSteps) {
    const p = G.cur;
    if (!p || p.type === 'O') return false;
    const from = p.rot, to = (p.rot + dirSteps + 4) % 4;
    const tests = dirSteps === 2 ? KICKS_180 : (p.type === 'I' ? KICKS_I : KICKS)[`${from}>${to}`];
    for (let i = 0; i < tests.length; i++) {
      const [kx, ky] = tests[i];
      if (!collides(p, to, p.x + kx, p.y + ky)) {
        p.x += kx; p.y += ky; p.rot = to;
        G.lastRotate = true; G.lastKick = i;
        if (p.y > G.lowestY) { G.lowestY = p.y; G.resets = 0; }
        resetLock();
        return true;
      }
    }
    return false;
  }

  function ghostY() {
    const p = G.cur; let y = p.y;
    while (!collides(p, p.rot, p.x, y + 1)) y++;
    return y;
  }

  function hardDrop() {
    const p = G.cur; if (!p) return;
    const gy = ghostY();
    const dist = gy - p.y;
    // estela
    for (const [cx, cy] of cellsOf(p)) {
      for (let k = 0; k < 3; k++) particles.push(makeParticle(cx + Math.random(), cy - HIDDEN + Math.random() * (dist + 1), COLORS[p.type][0], { vy: -2 - Math.random() * 3, life: 0.35, size: 2 }));
    }
    if (dist > 0) G.lastRotate = false;
    p.y = gy;
    G.score += dist * 2;
    Sound.play('hard');
    shake(Math.min(6, 2 + dist * 0.25));
    lockPiece(true);
  }

  // Detección de giro-T por 3 esquinas
  function tSpinType() {
    const p = G.cur;
    if (p.type !== 'T' || !G.lastRotate) return null;
    const corners = [[0,0],[2,0],[2,2],[0,2]].map(([cx, cy]) => {
      const x = p.x + cx, y = p.y + cy;
      return x < 0 || x >= COLS || y >= TOTAL || (y >= 0 && !!G.board[y][x]);
    });
    const filled = corners.filter(Boolean).length;
    if (filled < 3) return null;
    // Esquinas frontales según la orientación
    const front = [[0,1],[1,2],[2,3],[3,0]][p.rot];
    if ((corners[front[0]] && corners[front[1]]) || G.lastKick === 4) return 'full';
    return 'mini';
  }

  function lockPiece(fromHard) {
    const p = G.cur;
    const ts = tSpinType();
    let above = true;
    for (const [cx, cy] of cellsOf(p)) {
      if (cy >= 0) G.board[cy][cx] = p.type;
      if (cy >= HIDDEN) above = false;
    }
    G.cur = null;
    G.stats.pieces++;
    if (!fromHard) Sound.play('lock');
    lockFlash = { cells: cellsOf(p), t: 0.15, color: COLORS[p.type][0] };
    if (above) { topOut(); return; }

    const full = [];
    for (let y = 0; y < TOTAL; y++) if (G.board[y].every(Boolean)) full.push(y);
    score(full.length, ts);
    G.holdUsed = false;
    if (full.length) {
      G.clearing = { rows: full, t: 0 };
      for (const y of full) for (let x = 0; x < COLS; x++) {
        const c = COLORS[G.board[y][x]][0];
        for (let k = 0; k < 3; k++) particles.push(makeParticle(x + 0.5, y - HIDDEN + 0.5, c, { speed: 6 + full.length * 2 }));
      }
      Sound.play('clear', full.length);
      if (full.length >= 4) { shake(10); rumble(0.9, 260); } else rumble(0.25 + full.length * 0.1, 90);
    } else {
      spawn();
    }
  }

  function finishClear() {
    const rows = G.clearing.rows;
    G.board = G.board.filter((_, y) => !rows.includes(y));
    while (G.board.length < TOTAL) G.board.unshift(Array(COLS).fill(null));
    G.clearing = null;
    if (G.board.every((r) => r.every((c) => !c))) {
      G.stats.pc++;
      const bonus = [0, 800, 1200, 1800, 2000][Math.min(rows.length, 4)] * G.level;
      G.score += bonus;
      floatText('¡LIMPIEZA TOTAL!', `+${bonus}`, '#ffd34f', 1.4);
      Sound.play('win');
    }
    if (G.mode === 'sprint' && G.lines >= SPRINT_LINES) { finish(true); return; }
    spawn();
  }

  const NAMES = ['', 'SENCILLA', 'DOBLE', 'TRIPLE', '¡PRISMA!'];
  function score(n, ts) {
    let base = 0, label = '', color = '#ffffff';
    if (ts === 'full') {
      base = [400, 800, 1200, 1600][n];
      label = 'GIRO-T' + (n ? ' ' + NAMES[n] : '');
      color = COLORS.T[0];
      G.stats.tspins++;
      Sound.play('tspin');
    } else if (ts === 'mini') {
      base = [100, 200, 400][n] || 400;
      label = 'MINI GIRO-T' + (n ? ' ' + NAMES[n] : '');
      color = COLORS.T[0];
    } else if (n) {
      base = [0, 100, 300, 500, 800][n];
      label = NAMES[n];
      color = n >= 4 ? COLORS.I[0] : '#ffffff';
    }

    if (n) {
      const difficult = n >= 4 || (ts && n > 0);
      let mult = 1;
      if (difficult) { if (G.b2b) { mult = 1.5; label = 'B2B ' + label; } G.b2b = true; }
      else G.b2b = false;
      G.combo++;
      const comboPts = G.combo > 0 ? 50 * G.combo * G.level : 0;
      const pts = Math.round(base * mult * G.level) + comboPts;
      G.score += pts;
      if (n >= 4) G.stats.quads++;
      G.stats.maxCombo = Math.max(G.stats.maxCombo, G.combo);
      floatText(label, `+${pts}`, color, n >= 4 ? 1.3 : 1);
      if (G.combo > 0) floatText(`COMBO ×${G.combo}`, '', '#ff4fd8', 0.8, 1.3);

      const prevLevel = G.level;
      G.lines += n;
      if (G.mode === 'marathon') G.level = Math.floor(G.lines / 10) + 1;
      if (G.level > prevLevel) {
        Sound.play('level'); Sound.setLevel(G.level);
        floatText(`NIVEL ${G.level}`, '', '#5cff9d', 1.1, -1.4);
        levelFlash = 1;
      }
    } else {
      G.combo = -1;
      if (ts) {
        G.score += base * G.level;
        floatText(label, `+${base * G.level}`, color, 0.9);
      }
    }
  }

  function doHold() {
    if (!G.cur || G.holdUsed) return;
    const t = G.cur.type;
    G.holdUsed = true;
    Sound.play('hold');
    if (G.hold) { const h = G.hold; G.hold = t; spawn(h); }
    else { G.hold = t; spawn(); }
  }

  function topOut() {
    if (G.mode === 'zen') {
      // En zen no se pierde: el tablero se disuelve y se sigue jugando
      for (let y = 0; y < TOTAL; y++) for (let x = 0; x < COLS; x++) if (G.board[y][x]) {
        if (Math.random() < 0.5) particles.push(makeParticle(x + 0.5, y - HIDDEN + 0.5, COLORS[G.board[y][x]][0], { speed: 5 }));
        G.board[y][x] = null;
      }
      floatText('RESPIRA', 'el tablero se renueva', '#46e6ff', 1);
      G.cur = null;
      spawn();
      return;
    }
    finish(false);
  }

  function finish(win) {
    G.over = true; G.cur = null;
    screen = 'over';
    Sound.stopMusic();
    Sound.play(win ? 'win' : 'over');
    // Teñir el tablero de gris en derrota
    if (!win) for (let y = 0; y < TOTAL; y++) for (let x = 0; x < COLS; x++) if (G.board[y][x]) G.board[y][x] = 'X';
    const isBest = saveRecord(win);
    $('over-title').textContent = G.mode === 'sprint' ? (win ? '¡Sprint completado!' : 'Sprint fallido') : 'Fin de la partida';
    const rows = [];
    if (G.mode === 'sprint') rows.push(['Tiempo', win ? fmtTime(G.time, true) : '—'], ['Líneas', `${G.lines}/${SPRINT_LINES}`]);
    else rows.push(['Puntos', G.score.toLocaleString('es-ES')], ['Nivel', G.level], ['Líneas', G.lines], ['Tiempo', fmtTime(G.time)]);
    rows.push(['Piezas', G.stats.pieces], ['Prismas (4 líneas)', G.stats.quads], ['Giros-T', G.stats.tspins], ['Mejor combo', Math.max(0, G.stats.maxCombo)]);
    $('over-result').innerHTML = rows.map(([k, v]) => `<span>${k}</span><b>${v}</b>`).join('');
    $('over-best').classList.toggle('hidden', !isBest);
    setTimeout(() => showOverlay('ov-over'), 700);
  }

  // --------------------------------------------------------------- Récords
  function records() { return store.get('records', { marathon: [], sprint: [], zen: [] }); }
  function saveRecord(win) {
    const r = records();
    const list = r[G.mode] || (r[G.mode] = []);
    let entry, isBest = false;
    const date = new Date().toLocaleDateString('es-ES');
    if (G.mode === 'sprint') {
      if (!win) return false;
      entry = { time: G.time, date };
      isBest = !list.length || G.time < list[0].time;
      list.push(entry); list.sort((a, b) => a.time - b.time);
    } else {
      if (G.score <= 0) return false;
      entry = { score: G.score, lines: G.lines, level: G.level, date };
      isBest = !list.length || G.score > list[0].score;
      list.push(entry); list.sort((a, b) => b.score - a.score);
    }
    r[G.mode] = list.slice(0, 5);
    store.set('records', r);
    return isBest;
  }
  function bestLabel(mode) {
    const list = records()[mode] || [];
    if (!list.length) return '—';
    return mode === 'sprint' ? fmtTime(list[0].time, true) : list[0].score.toLocaleString('es-ES');
  }
  function renderRecords() {
    const r = records();
    const sec = (title, list, fmt) => `<div><h4>${title}</h4>${list.length ? `<ol>${list.map((e) => `<li>${fmt(e)} <small>· ${e.date}</small></li>`).join('')}</ol>` : '<p class="empty">Aún no hay partidas</p>'}</div>`;
    $('records').innerHTML =
      sec('Maratón', r.marathon || [], (e) => `<b>${e.score.toLocaleString('es-ES')}</b> · nivel ${e.level}`) +
      sec('Sprint 40', r.sprint || [], (e) => `<b>${fmtTime(e.time, true)}</b>`) +
      sec('Zen', r.zen || [], (e) => `<b>${e.score.toLocaleString('es-ES')}</b> · ${e.lines} líneas`);
  }

  function fmtTime(s, ms) {
    const m = Math.floor(s / 60), sec = s - m * 60;
    return ms ? `${m}:${sec.toFixed(2).padStart(5, '0')}` : `${m}:${String(Math.floor(sec)).padStart(2, '0')}`;
  }

  // --------------------------------------------------------------- Efectos
  let particles = [], texts = [], shakeAmt = 0, lockFlash = null, levelFlash = 0;
  function makeParticle(x, y, color, o = {}) {
    const a = Math.random() * Math.PI * 2, sp = (o.speed || 4) * (0.4 + Math.random());
    return { x, y, vx: o.vx ?? Math.cos(a) * sp, vy: o.vy ?? Math.sin(a) * sp - 2, life: o.life ?? (0.6 + Math.random() * 0.5), max: 0, color, size: o.size ?? (2 + Math.random() * 3) };
  }
  function floatText(title, sub, color, scale = 1, offset = 0) {
    texts.push({ title, sub, color, scale, t: 0, offset });
  }
  function shake(a) { if (settings.shake) shakeAmt = Math.max(shakeAmt, a); }

  // --------------------------------------------------------------- Entrada
  const input = { dir: 0, left: false, right: false, soft: false, dasT: 0, arrT: 0 };
  const KEYMAP = {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'soft', Space: 'hard',
    ArrowUp: 'cw', KeyX: 'cw', KeyZ: 'ccw', ControlLeft: 'ccw', ControlRight: 'ccw', KeyA: 'r180',
    KeyC: 'hold', ShiftLeft: 'hold', ShiftRight: 'hold',
    Escape: 'pause', KeyP: 'pause', KeyM: 'mute',
  };

  function press(act) {
    Sound.init();
    if (act === 'mute') { toggleMute(); return; }
    if (act === 'pause') { if (screen === 'play') pause(); else if (screen === 'pause' && overlayStack.length <= 1) resume(); return; }
    if (act === 'left' || act === 'right') {
      input[act] = true;
      input.dir = act === 'left' ? -1 : 1;
      input.dasT = 0; input.arrT = 0;
      if (canAct() && tryMove(input.dir, 0)) Sound.play('move');
      return;
    }
    if (act === 'soft') { input.soft = true; return; }
    if (!canAct()) return;
    if (act === 'hard') hardDrop();
    else if (act === 'cw') { if (tryRotate(1)) Sound.play('rotate'); }
    else if (act === 'ccw') { if (tryRotate(-1)) Sound.play('rotate'); }
    else if (act === 'r180') { if (tryRotate(2)) Sound.play('rotate'); }
    else if (act === 'hold') doHold();
  }
  function release(act) {
    if (act === 'left' || act === 'right') {
      input[act] = false;
      if (input.left) input.dir = -1; else if (input.right) input.dir = 1; else input.dir = 0;
      if (input.dir) { input.dasT = 0; input.arrT = 0; }
    }
    if (act === 'soft') input.soft = false;
  }
  function canAct() { return screen === 'play' && G && G.cur && !G.clearing; }

  addEventListener('keydown', (e) => {
    const act = KEYMAP[e.code];
    if (!act) {
      if ((e.code === 'Enter') && screen === 'menu' && overlayStack.length === 1) { startMode('marathon'); }
      return;
    }
    if (document.activeElement && document.activeElement.tagName === 'INPUT' && !['pause'].includes(act)) return;
    e.preventDefault();
    if (e.repeat) return;
    if (act === 'pause' && overlayStack.length > 1) { back(); return; }
    press(act);
  });
  addEventListener('keyup', (e) => { const act = KEYMAP[e.code]; if (act) release(act); });
  addEventListener('blur', () => { input.left = input.right = input.soft = false; input.dir = 0; if (screen === 'play') pause(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && screen === 'play') pause(); });

  // Botones táctiles
  document.querySelectorAll('#touch button').forEach((b) => {
    const act = b.dataset.act;
    let repeat = null;
    const down = (e) => {
      e.preventDefault();
      b.classList.add('down');
      if (b.setPointerCapture && e.pointerId !== undefined) try { b.setPointerCapture(e.pointerId); } catch { /* nada */ }
      press(act);
      if (navigator.vibrate && (act === 'hard')) navigator.vibrate(12);
    };
    const up = (e) => { e.preventDefault(); b.classList.remove('down'); release(act); clearInterval(repeat); };
    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  // Gestos sobre el tablero (móvil): deslizar para mover, tocar para girar,
  // deslizar rápido hacia abajo para soltar, hacia arriba para reservar.
  (() => {
    let sx = 0, sy = 0, lx = 0, ly = 0, st = 0, moved = false, active = false;
    const wrap = $('board-wrap');
    wrap.addEventListener('pointerdown', (e) => {
      if (screen !== 'play' || e.pointerType === 'mouse') return;
      active = true; moved = false; sx = lx = e.clientX; sy = ly = e.clientY; st = performance.now();
    });
    wrap.addEventListener('pointermove', (e) => {
      if (!active || !canAct()) return;
      const dy = e.clientY - ly;
      const step = cell * 0.9;
      while (Math.abs(e.clientX - lx) >= step) {
        const d = Math.sign(e.clientX - lx);
        if (tryMove(d, 0)) Sound.play('move');
        lx += d * step; moved = true;
      }
      if (dy > step) {
        while (e.clientY - ly >= step) { if (tryMove(0, 1)) G.score++; ly += step; }
        moved = true;
      }
    });
    const end = (e) => {
      if (!active) return; active = false;
      if (!canAct()) return;
      const dt = performance.now() - st, dx = e.clientX - sx, dy = e.clientY - sy;
      if (dt < 250 && dy > cell * 2.5 && Math.abs(dy) > Math.abs(dx) * 1.5) { hardDrop(); return; }
      if (dt < 300 && dy < -cell * 2 && Math.abs(dy) > Math.abs(dx) * 1.5) { doHold(); return; }
      if (!moved && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        const r = wrap.getBoundingClientRect();
        if (tryRotate(e.clientX < r.left + r.width / 2 ? -1 : 1)) Sound.play('rotate');
      }
    };
    wrap.addEventListener('pointerup', end);
    wrap.addEventListener('pointercancel', () => { active = false; });
  })();

  // --------------------------------------------------------------- Mando (Gamepad API, mapeo estándar Xbox)
  // A ↻ · B ↺ · X ↺ · Y 180° · LB/RB reserva · ↑/RT soltar · ↓/LT bajar · Menú pausa
  const PAD_MAP = [
    [0, 'cw'], [1, 'ccw'], [2, 'ccw'], [3, 'r180'], [4, 'hold'], [5, 'hold'],
    [7, 'hard'], [6, 'soft'], [12, 'hard'], [13, 'soft'], [14, 'left'], [15, 'right'], [9, 'pause'], [8, 'pause'],
  ];
  const pad = { held: {}, menuHeld: {}, menuRepeat: 0, index: null, mode: null };
  let padToastShown = false;

  addEventListener('gamepadconnected', (e) => {
    pad.index = e.gamepad.index;
    if (!padToastShown) { floatText('MANDO CONECTADO', '', '#46e6ff', 0.7); padToastShown = true; }
  });
  addEventListener('gamepaddisconnected', (e) => {
    if (pad.index === e.gamepad.index) pad.index = null;
    if (screen === 'play') pause();
  });

  function rumble(strong, dur) {
    const gp = pad.index !== null && navigator.getGamepads ? navigator.getGamepads()[pad.index] : null;
    const act = gp && gp.vibrationActuator;
    if (act && act.playEffect) act.playEffect('dual-rumble', { duration: dur, strongMagnitude: strong, weakMagnitude: strong * 0.6 }).catch(() => {});
  }

  function pollPad(dt) {
    if (!navigator.getGamepads) return;
    const pads = navigator.getGamepads();
    let gp = pad.index !== null ? pads[pad.index] : null;
    if (!gp) gp = Array.from(pads).find((p) => p && p.connected) || null;
    if (!gp) return;
    pad.index = gp.index;
    const btn = (i) => !!(gp.buttons[i] && (gp.buttons[i].pressed || gp.buttons[i].value > 0.5));
    const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
    const stick = { left: ax < -0.5, right: ax > 0.5, soft: ay > 0.6, up: ay < -0.75 };

    const inMenu = !!(screen !== 'play' && screen !== 'countdown' && overlayStack.length);
    const changed = pad.mode !== inMenu;
    pad.mode = inMenu;
    if (inMenu) { padMenu(btn, stick, dt, changed); pad.held = {}; return; }

    // Estado actual de cada acción
    const now = {};
    for (const [i, act] of PAD_MAP) if (btn(i)) now[act] = true;
    if (stick.left) now.left = true;
    if (stick.right) now.right = true;
    if (stick.soft) now.soft = true;
    if (changed) { pad.held = now; return; } // no disparar el botón que se usó en el menú
    for (const act of new Set([...Object.keys(now), ...Object.keys(pad.held)])) {
      if (now[act] && !pad.held[act]) {
        Sound.init();
        press(act);
        if (act === 'hard') rumble(0.35, 70);
      } else if (!now[act] && pad.held[act]) release(act);
    }
    pad.held = now;
  }

  function padMenu(btn, stick, dt, changed) {
    const ov = $(overlayStack[overlayStack.length - 1]);
    const items = Array.from(ov.querySelectorAll('button, input')).filter((el) => el.offsetParent !== null);
    const st = {
      up: btn(12) || stick.up, down: btn(13) || stick.soft, left: btn(14) || stick.left, right: btn(15) || stick.right,
      a: btn(0), b: btn(1), start: btn(9),
    };
    if (changed) { pad.menuHeld = st; return; }
    const edge = (k) => st[k] && !pad.menuHeld[k];
    // repetición al mantener la cruceta
    const dirHeld = st.up || st.down || st.left || st.right;
    let rep = false;
    if (dirHeld) { pad.menuRepeat += dt; if (pad.menuRepeat > 0.35) { pad.menuRepeat = 0.25; rep = true; } }
    else pad.menuRepeat = 0;

    let idx = items.indexOf(document.activeElement);
    const focus = (i) => { if (!items.length) return; idx = (i + items.length) % items.length; items[idx].focus({ preventScroll: false }); Sound.play('move'); };
    if (edge('down') || (rep && st.down)) focus(idx + 1);
    if (edge('up') || (rep && st.up)) focus(idx < 0 ? 0 : idx - 1);
    const el = document.activeElement;
    if (el && el.type === 'range' && (edge('left') || edge('right') || (rep && (st.left || st.right)))) {
      const s = +el.step || 1, d = st.right ? 1 : -1;
      el.value = Math.min(+el.max, Math.max(+el.min, +el.value + d * s * (el.max - el.min > 100 ? 2 : 5)));
      el.dispatchEvent(new Event('input'));
    }
    if (edge('a')) {
      Sound.init();
      if (idx < 0) focus(0);
      else if (el.type === 'checkbox') { el.checked = !el.checked; el.dispatchEvent(new Event('input')); }
      else if (el.tagName === 'BUTTON') el.click();
    }
    if (edge('b')) {
      if (overlayStack.length > 1) { Sound.play('ui'); back(); }
      else if (screen === 'pause') resume();
    }
    if (edge('start') && screen === 'pause' && overlayStack.length <= 1) resume();
    pad.menuHeld = st;
  }

  // --------------------------------------------------------------- Pantallas
  function showOverlay(id) {
    document.querySelectorAll('.overlay').forEach((o) => o.classList.add('hidden'));
    $(id).classList.remove('hidden');
    overlayStack = [id];
    focusFirst(id);
  }
  function pushOverlay(id) {
    if (overlayStack.length) $(overlayStack[overlayStack.length - 1]).classList.add('hidden');
    $(id).classList.remove('hidden');
    overlayStack.push(id);
    if (id === 'ov-records') renderRecords();
    focusFirst(id);
  }
  function back() {
    const id = overlayStack.pop();
    if (id) $(id).classList.add('hidden');
    const prev = overlayStack[overlayStack.length - 1];
    if (prev) { $(prev).classList.remove('hidden'); focusFirst(prev); }
  }
  function hideOverlays() { document.querySelectorAll('.overlay').forEach((o) => o.classList.add('hidden')); overlayStack = []; }
  function focusFirst(id) { if (isTouch) return; const b = $(id).querySelector('button'); if (b) b.focus({ preventScroll: true }); }

  function startMode(mode) {
    Sound.init();
    Sound.play('ui');
    newGame(mode);
    ui.best.textContent = bestLabel(mode);
    hideOverlays();
    countdown(() => { screen = 'play'; spawn(); Sound.startMusic(); });
  }

  function countdown(done) {
    screen = 'countdown';
    const el = ui.countdown;
    el.classList.remove('hidden');
    let n = 3;
    const step = () => {
      if (screen !== 'countdown') { el.classList.add('hidden'); return; }
      if (n === 0) { el.classList.add('hidden'); Sound.play('count', true); done(); return; }
      el.textContent = n;
      el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
      Sound.play('count', false);
      n--; setTimeout(step, 600);
    };
    step();
  }

  function pause() {
    if (screen !== 'play') return;
    screen = 'pause';
    Sound.stopMusic();
    input.left = input.right = input.soft = false; input.dir = 0;
    showOverlay('ov-pause');
  }
  function resume() {
    hideOverlays();
    countdown(() => { screen = 'play'; Sound.startMusic(); });
  }

  function goMenu() {
    Sound.stopMusic();
    screen = 'menu';
    G = null;
    showOverlay('ov-menu');
  }

  document.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => startMode(b.dataset.mode)));
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => { Sound.init(); Sound.play('ui'); pushOverlay(b.dataset.open); }));
  document.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => { Sound.play('ui'); back(); }));
  $('btn-resume').addEventListener('click', resume);
  $('btn-restart').addEventListener('click', () => startMode(G.mode));
  $('btn-quit').addEventListener('click', goMenu);
  $('btn-again').addEventListener('click', () => startMode(G.mode));
  $('btn-menu').addEventListener('click', goMenu);
  $('btn-pause').addEventListener('click', () => { if (screen === 'play') pause(); else if (screen === 'pause') resume(); });
  $('btn-mute').addEventListener('click', () => { Sound.init(); toggleMute(); });

  function toggleMute() {
    const m = Sound.toggleMute();
    $('btn-mute').classList.toggle('off', m);
    store.set('muted', m);
  }

  // Ajustes
  function bindSettings() {
    const music = $('set-music'), sfx = $('set-sfx'), das = $('set-das'), arr = $('set-arr');
    const ghost = $('set-ghost'), sh = $('set-shake'), grid = $('set-grid');
    music.value = settings.music; sfx.value = settings.sfx; das.value = settings.das; arr.value = settings.arr;
    ghost.checked = settings.ghost; sh.checked = settings.shake; grid.checked = settings.grid;
    const apply = () => {
      settings.music = +music.value; settings.sfx = +sfx.value; settings.das = +das.value; settings.arr = +arr.value;
      settings.ghost = ghost.checked; settings.shake = sh.checked; settings.grid = grid.checked;
      $('val-das').textContent = `${settings.das} ms`;
      $('val-arr').textContent = settings.arr === 0 ? 'instantáneo' : `${settings.arr} ms`;
      Sound.setMusicVolume(settings.music / 100);
      Sound.setSfxVolume(settings.sfx / 100);
      store.set('settings', settings);
    };
    [music, sfx, das, arr, ghost, sh, grid].forEach((el) => el.addEventListener('input', apply));
    sfx.addEventListener('change', () => Sound.play('rotate'));
    apply();
    if (store.get('muted', false)) { Sound.toggleMute(); $('btn-mute').classList.add('off'); }
  }

  // --------------------------------------------------------------- Bucle
  function update(dt) {
    // efectos siempre
    for (const p of particles) { p.life -= dt; p.vy += 14 * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
    particles = particles.filter((p) => p.life > 0);
    for (const t of texts) t.t += dt;
    texts = texts.filter((t) => t.t < 1.4);
    shakeAmt *= Math.pow(0.0005, dt);
    if (lockFlash) { lockFlash.t -= dt; if (lockFlash.t <= 0) lockFlash = null; }
    levelFlash = Math.max(0, levelFlash - dt * 1.5);

    if (screen !== 'play' || !G) return;
    G.time += dt;

    // DAS / ARR (se carga incluso durante la animación de limpieza)
    if (input.dir) {
      input.dasT += dt;
      const das = settings.das / 1000, arr = settings.arr / 1000;
      if (input.dasT >= das && canAct()) {
        if (arr === 0) shiftMax(input.dir, true);
        else {
          input.arrT += dt;
          while (input.arrT >= arr) { input.arrT -= arr; if (!tryMove(input.dir, 0)) { input.arrT = 0; break; } }
        }
      }
    }

    if (G.clearing) {
      G.clearing.t += dt;
      if (G.clearing.t >= CLEAR_TIME) finishClear();
      return;
    }
    if (!G.cur) return;

    // Gravedad
    let interval = gravityInterval(G.level);
    const softing = input.soft;
    if (softing) interval = Math.min(interval / 20, 0.05);
    G.gravAcc += dt / interval;
    while (G.gravAcc >= 1) {
      G.gravAcc -= 1;
      if (tryMove(0, 1)) { if (softing) { G.score += 1; } G.lastRotate = false; }
      else { G.gravAcc = 0; break; }
    }

    // Retardo de bloqueo
    if (onGround()) {
      G.lockTimer += dt;
      if (G.lockTimer >= LOCK_DELAY) lockPiece(false);
    } else {
      G.lockTimer = 0;
    }
  }

  // --------------------------------------------------------------- Dibujo
  function gem(ctx, x, y, s, type, alpha = 1) {
    const [c1, c2] = COLORS[type];
    const pad = Math.max(1, s * 0.06), r = s * 0.18;
    const x0 = x + pad, y0 = y + pad, w = s - pad * 2;
    ctx.globalAlpha = alpha;
    const g = ctx.createLinearGradient(x0, y0, x0 + w, y0 + w);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g;
    roundRect(ctx, x0, y0, w, w, r); ctx.fill();
    // faceta central (forma de prisma)
    const inset = w * 0.26;
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.moveTo(x0 + inset, y0 + inset);
    ctx.lineTo(x0 + w - inset, y0 + inset);
    ctx.lineTo(x0 + w - inset * 1.4, y0 + w - inset);
    ctx.lineTo(x0 + inset * 1.4, y0 + w - inset);
    ctx.closePath(); ctx.fill();
    // brillo superior
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.moveTo(x0 + r, y0 + pad * 0.5);
    ctx.lineTo(x0 + w - r, y0 + pad * 0.5);
    ctx.lineTo(x0 + w - inset, y0 + inset);
    ctx.lineTo(x0 + inset, y0 + inset);
    ctx.closePath(); ctx.fill();
    // sombra inferior
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.moveTo(x0 + inset * 1.4, y0 + w - inset);
    ctx.lineTo(x0 + w - inset * 1.4, y0 + w - inset);
    ctx.lineTo(x0 + w - r, y0 + w);
    ctx.lineTo(x0 + r, y0 + w);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function drawBoard(now) {
    const W = COLS * cell, H = ROWS * cell;
    const ctx = bctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // fondo
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, 'rgba(20,14,52,0.92)'); bg.addColorStop(1, 'rgba(10,7,30,0.96)');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // peligro: si la pila está alta, el fondo se tiñe
    let danger = 0;
    if (G) {
      for (let y = 0; y < TOTAL; y++) if (G.board[y].some(Boolean)) { danger = Math.max(0, (HIDDEN + 6 - y) / 6); break; }
    }
    if (danger > 0 && screen === 'play') {
      ctx.fillStyle = `rgba(255,40,90,${0.08 * danger * (0.6 + 0.4 * Math.sin(now / 160))})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (levelFlash > 0) { ctx.fillStyle = `rgba(92,255,157,${levelFlash * 0.15})`; ctx.fillRect(0, 0, W, H); }

    ctx.save();
    if (shakeAmt > 0.2) ctx.translate((Math.random() - 0.5) * shakeAmt, (Math.random() - 0.5) * shakeAmt);

    // cuadrícula
    if (settings.grid) {
      ctx.strokeStyle = 'rgba(190,180,255,0.06)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 1; x < COLS; x++) { ctx.moveTo(x * cell + 0.5, 0); ctx.lineTo(x * cell + 0.5, H); }
      for (let y = 1; y < ROWS; y++) { ctx.moveTo(0, y * cell + 0.5); ctx.lineTo(W, y * cell + 0.5); }
      ctx.stroke();
    }

    if (G) {
      const clearing = G.clearing;
      const prog = clearing ? clearing.t / CLEAR_TIME : 0;
      for (let y = HIDDEN; y < TOTAL; y++) {
        const isClr = clearing && clearing.rows.includes(y);
        for (let x = 0; x < COLS; x++) {
          const t = G.board[y][x];
          if (!t) continue;
          const px = x * cell, py = (y - HIDDEN) * cell;
          if (isClr) {
            // Las celdas se encogen desde el centro hacia fuera
            const order = Math.abs(x - 4.5) / 5;
            const k = Math.max(0, Math.min(1, prog * 1.6 - order * 0.6));
            const s = cell * (1 - k);
            gem(ctx, px + (cell - s) / 2, py + (cell - s) / 2, s, t, 1 - k * 0.5);
            ctx.fillStyle = `rgba(255,255,255,${0.7 * (1 - prog)})`;
            ctx.fillRect(px, py, cell, cell);
          } else gem(ctx, px, py, cell, t);
        }
      }

      if (G.cur && screen !== 'over') {
        const p = G.cur;
        // fantasma
        if (settings.ghost) {
          const gy = ghostY();
          const c = COLORS[p.type][0];
          for (const [cx, cy] of cellsOf(p, p.rot, p.x, gy)) {
            if (cy < HIDDEN) continue;
            const px = cx * cell, py = (cy - HIDDEN) * cell;
            ctx.globalAlpha = 0.16; ctx.fillStyle = c;
            roundRect(ctx, px + 2, py + 2, cell - 4, cell - 4, cell * 0.18); ctx.fill();
            ctx.globalAlpha = 0.55; ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
        // pieza activa (con un leve parpadeo mientras se bloquea)
        const lockA = onGround() ? 1 - 0.35 * (G.lockTimer / LOCK_DELAY) : 1;
        ctx.shadowColor = COLORS[p.type][0]; ctx.shadowBlur = cell * 0.5;
        for (const [cx, cy] of cellsOf(p)) {
          if (cy < HIDDEN - 1) continue;
          gem(ctx, cx * cell, (cy - HIDDEN) * cell, cell, p.type, lockA);
        }
        ctx.shadowBlur = 0;
      }

      if (lockFlash) {
        ctx.fillStyle = `rgba(255,255,255,${lockFlash.t / 0.15 * 0.45})`;
        for (const [cx, cy] of lockFlash.cells) if (cy >= HIDDEN) {
          roundRect(ctx, cx * cell + 1, (cy - HIDDEN) * cell + 1, cell - 2, cell - 2, cell * 0.18); ctx.fill();
        }
      }
    }

    // partículas
    ctx.globalCompositeOperation = 'lighter';
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
      ctx.fillStyle = p.color;
      const s = p.size * (cell / 30);
      ctx.fillRect(p.x * cell - s / 2, p.y * cell - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();

    // textos flotantes
    let stackY = 0;
    for (const t of texts) {
      const k = t.t / 1.4;
      const a = k < 0.1 ? k / 0.1 : 1 - Math.max(0, (k - 0.6) / 0.4);
      const sc = t.scale * (1 + (k < 0.12 ? (0.12 - k) * 3 : 0));
      const y = H * 0.4 + (t.offset + stackY) * cell - k * cell * 1.2;
      ctx.globalAlpha = Math.max(0, a);
      ctx.textAlign = 'center';
      ctx.font = `900 ${Math.round(cell * 0.85 * sc)}px "Segoe UI", system-ui, sans-serif`;
      ctx.shadowColor = t.color; ctx.shadowBlur = 18;
      ctx.fillStyle = t.color;
      ctx.fillText(t.title, W / 2, y);
      if (t.sub) {
        ctx.font = `700 ${Math.round(cell * 0.5)}px "Segoe UI", system-ui, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(t.sub, W / 2, y + cell * 0.7);
      }
      ctx.shadowBlur = 0;
      if (!t.offset) stackY += 0; // los textos con offset fijo no apilan
    }
    ctx.globalAlpha = 1;
  }

  function drawMini(ctx, cv, types, perSlot, dim) {
    const w = cv.width / dpr, h = cv.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const slotH = h / perSlot;
    types.forEach((t, i) => {
      if (!t) return;
      const cells = ROT[t][0];
      const xs = cells.map((c) => c[0]), ys = cells.map((c) => c[1]);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      const bw = maxX - minX + 1, bh = maxY - minY + 1;
      const s = Math.min((w * 0.9) / 4, (slotH * 0.85) / 2) * (i === 0 || perSlot === 1 ? 1 : 0.85);
      const ox = (w - bw * s) / 2, oy = i * slotH + (slotH - bh * s) / 2;
      for (const [cx, cy] of cells) gem(ctx, ox + (cx - minX) * s, oy + (cy - minY) * s, s, dim ? 'X' : t);
    });
  }

  function drawSide() {
    drawMini(hctx, holdCv, [G ? G.hold : null], 1, G && G.holdUsed);
    drawMini(nctx, nextCv, G ? G.queue.slice(0, 5) : [], 5, false);
    if (G) {
      ui.score.textContent = G.score.toLocaleString('es-ES');
      ui.level.textContent = G.mode === 'marathon' ? G.level : '—';
      ui.lines.textContent = G.mode === 'sprint' ? `${G.lines}/${SPRINT_LINES}` : G.lines;
      ui.time.textContent = fmtTime(G.time, G.mode === 'sprint');
    }
  }

  // --------------------------------------------------------------- Tamaño
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vw = window.innerWidth, vh = window.innerHeight;
    const touchH = isTouch ? 180 : 0;
    const topH = 52;
    const small = vw <= 640;
    const sideRatio = small ? 2.3 : 4.6;
    const gaps = small ? 16 + 16 : 28 + 32;
    const availH = vh - topH - touchH - 24;
    const availW = vw - gaps;
    cell = Math.floor(Math.min(availH / ROWS, availW / (COLS + sideRatio * 2)));
    cell = Math.max(12, Math.min(cell, 40));
    const side = Math.round(cell * sideRatio);
    document.documentElement.style.setProperty('--cell', cell + 'px');
    document.documentElement.style.setProperty('--side', side + 'px');

    const W = COLS * cell, H = ROWS * cell;
    boardCv.width = W * dpr; boardCv.height = H * dpr;
    boardCv.style.width = W + 'px'; boardCv.style.height = H + 'px';
    const inner = side - (small ? 14 : 22);
    const holdH = Math.round(inner * (small ? 0.8 : 0.6));
    holdCv.width = inner * dpr; holdCv.height = holdH * dpr;
    holdCv.style.height = holdH + 'px';
    const nextH = Math.round(inner * (small ? 3.6 : 2.6));
    nextCv.width = inner * dpr; nextCv.height = nextH * dpr;
    nextCv.style.height = nextH + 'px';
  }
  addEventListener('resize', resize);

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    pollPad(dt);
    update(dt);
    drawBoard(now);
    drawSide();
    requestAnimationFrame(frame);
  }

  // --------------------------------------------------------------- Inicio
  resize();
  bindSettings();
  showOverlay('ov-menu');
  requestAnimationFrame(frame);

  // Para pruebas automatizadas
  window.__prisma = { get state() { return { screen, G }; }, press, release };
})();
