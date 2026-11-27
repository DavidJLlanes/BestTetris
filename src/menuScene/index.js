import { scene } from './state.js';
import { stepScene } from './stepScene.js';
import { drawScene } from './drawScene.js';
import { decor } from '../decor/state.js';
import { QUALITY } from '../config/decor.js';

/** Piezas en pantalla según la calidad (en baja, la escena queda quieta y casi vacía). */
const COUNT = { high: 22, medium: 14, low: 6 };

function size() {
  const c = scene.canvas, r = c.getBoundingClientRect();
  scene.dpr = Math.min(window.devicePixelRatio || 1, QUALITY[decor.quality].dpr + 0.5);
  scene.w = Math.max(1, r.width); scene.h = Math.max(1, r.height);
  const W = Math.round(scene.w * scene.dpr), H = Math.round(scene.h * scene.dpr);
  if (c.width !== W) c.width = W;
  if (c.height !== H) c.height = H;
}

function frame(now) {
  if (!scene.running) return;
  scene.raf = requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - scene.last) / 1000 || 0);
  scene.last = now;
  const still = decor.quality === 'low' || matchMedia('(prefers-reduced-motion: reduce)').matches;
  stepScene(scene, still ? 0 : dt, COUNT[decor.quality] || 14);
  drawScene(scene, now / 1000);
}

/**
 * Fondo animado de la pantalla principal: solo corre mientras el menú se ve y la pestaña está
 * delante; si no, se detiene del todo (cero trabajo en segundo plano).
 */
export function startMenuScene() {
  const menu = document.getElementById('ov-menu');
  scene.canvas = document.getElementById('menu-scene');
  scene.ctx = scene.canvas.getContext('2d');
  const sync = () => {
    const want = !menu.hidden && !document.hidden;
    if (want && !scene.running) { scene.running = true; size(); scene.last = performance.now(); scene.raf = requestAnimationFrame(frame); }
    if (!want && scene.running) { scene.running = false; cancelAnimationFrame(scene.raf); }
  };
  new MutationObserver(sync).observe(menu, { attributes: true, attributeFilter: ['hidden'] });
  document.addEventListener('visibilitychange', sync);
  addEventListener('resize', () => { if (scene.running) size(); });
  sync();
}
