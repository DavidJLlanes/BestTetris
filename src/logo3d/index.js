import { buildBlocks } from './buildBlocks.js';
import { ANIMATIONS } from './animations.js';
import { drawLogo } from './drawLogo.js';
import { dampedSpring } from '../util/dampedSpring.js';
import { damp } from '../util/damp.js';
import { decor } from '../decor/state.js';

const IDLE = [2.2, 4.2];        // segundos de calma entre movimientos
const PUSH_RADIUS = 3.2;        // en bloques
const L = { blocks: [], ctx: null, w: 0, h: 0, dpr: 1, k: 8, cam: 70, rx: 0, ry: 0, tx: 0, ty: 0, anim: null, wait: 1.2, last: 0, t: 0, raf: 0, running: false, prev: -1 };
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function size(canvas, model) {
  const r = canvas.getBoundingClientRect();
  L.dpr = Math.min(window.devicePixelRatio || 1, decor.quality === 'high' ? 3 : 2);
  L.w = r.width; L.h = r.height;
  canvas.width = Math.round(r.width * L.dpr); canvas.height = Math.round(r.height * L.dpr);
  L.k = Math.min((L.w * 0.9) / (model.cols + 2), (L.h * 0.62) / model.rows);
}

/** Elige uno de los 5 movimientos al azar, sin repetir el anterior (o el pedido, para pruebas). */
export function nextAnimation(forced = null) {
  let i = forced;
  if (i === null) do i = Math.floor(Math.random() * ANIMATIONS.length); while (i === L.prev && ANIMATIONS.length > 1);
  L.prev = i;
  for (const b of L.blocks) b.dir = null;
  L.anim = { def: ANIMATIONS[i], t: 0 };
}

function step(dt) {
  L.t += dt;
  let rx = 0, ry = 0;
  if (L.anim) {
    L.anim.t += dt;
    const p = Math.min(1, L.anim.t / L.anim.def.dur);
    const g = L.anim.def.global(p, L.t); rx = g.rx; ry = g.ry;
    for (const b of L.blocks) { const o = L.anim.def.block(b, p, L.t); [b.ax, b.ay, b.az] = o || [0, 0, 0]; }
    if (p >= 1) { L.anim = null; L.wait = IDLE[0] + Math.random() * (IDLE[1] - IDLE[0]); }
  } else {
    for (const b of L.blocks) { b.ax = 0; b.ay = 0; b.az = 0; }
    L.wait -= dt;
    if (L.wait <= 0 && !calm()) nextAnimation();
  }
  // Se inclina hacia el dedo o el cursor, con una respiración lenta de fondo
  L.rx = damp(L.rx, L.ty * 0.38 + rx + Math.sin(L.t * 0.6) * 0.05, 6, dt);
  L.ry = damp(L.ry, L.tx * 0.6 + ry + Math.sin(L.t * 0.45) * 0.12, 6, dt);
  if (L.anim && L.anim.def.name === 'giro') L.ry = L.tx * 0.6 + ry; // el giro completo no se suaviza
  for (const b of L.blocks) for (let a = 0; a < 3; a++) if (b.d[a] || b.v[a]) [b.d[a], b.v[a]] = dampedSpring(b.d[a], b.v[a], 90, 0.42, dt);
}

/** Aparta los bloques cercanos al punto tocado (en píxeles del lienzo); vuelven con un muelle. */
function push(sx, sy, strength) {
  const mx = (sx - L.w / 2) / L.k, my = (sy - L.h / 2) / L.k;
  for (const b of L.blocks) {
    const dx = b.hx - mx, dy = b.hy - my, dist = Math.hypot(dx, dy);
    if (dist > PUSH_RADIUS) continue;
    const f = (1 - dist / PUSH_RADIUS) * strength;
    b.v[0] += (dx / (dist || 1)) * f * 9; b.v[1] += (dy / (dist || 1)) * f * 9; b.v[2] += f * 26;
  }
}

/**
 * Logotipo 3D de la pantalla principal: «BestTris» hecho de cubos de gema que cada pocos segundos
 * hace uno de sus 5 movimientos al azar, se inclina hacia el dedo o el ratón y aparta los bloques
 * que tocas. Solo corre mientras se ve el menú y la pestaña está delante.
 */
export function startLogo3d() {
  const canvas = document.getElementById('logo3d');
  const menu = document.getElementById('ov-menu');
  if (!canvas || !canvas.getContext) return;
  const model = buildBlocks();
  L.blocks = model.blocks.map((b) => ({ ...b, ax: 0, ay: 0, az: 0 }));
  L.ctx = canvas.getContext('2d');
  const frame = (now) => {
    if (!L.running) return;
    L.raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - L.last) / 1000 || 0);
    L.last = now;
    step(dt);
    drawLogo(L);
  };
  const sync = () => {
    const want = !menu.hidden && !document.hidden;
    if (want && !L.running) { L.running = true; size(canvas, model); L.last = performance.now(); L.raf = requestAnimationFrame(frame); }
    if (!want && L.running) { L.running = false; cancelAnimationFrame(L.raf); }
  };
  // Inclinación: ratón en toda la ventana; dedo sobre el logotipo
  addEventListener('pointermove', (e) => {
    if (!L.running || (e.pointerType === 'touch' && e.target !== canvas)) return;
    L.tx = (e.clientX / innerWidth) * 2 - 1;
    const r = canvas.getBoundingClientRect();
    L.ty = -Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)));
    if (e.target === canvas && (e.buttons || e.pointerType === 'touch')) push(e.clientX - r.left, e.clientY - r.top, 0.5);
  }, { passive: true });
  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    push(e.clientX - r.left, e.clientY - r.top, 1);
    if (!L.anim && !calm()) L.wait = Math.min(L.wait, 0.6); // tocarlo adelanta el siguiente movimiento
  });
  canvas.addEventListener('pointerleave', () => { L.tx *= 0.5; L.ty = 0; });
  new MutationObserver(sync).observe(menu, { attributes: true, attributeFilter: ['hidden'] });
  document.addEventListener('visibilitychange', sync);
  addEventListener('resize', () => { if (L.running) size(canvas, model); });
  sync();
}
