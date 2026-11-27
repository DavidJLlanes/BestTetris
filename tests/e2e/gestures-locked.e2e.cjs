/**
 * Prueba de navegador (no entra en `npm test`): en 440x733, en plena partida, se hacen gestos
 * bruscos con los dedos (pellizcos, deslizamientos rápidos en todas direcciones, varios dedos a
 * la vez, toques dobles y arrastres desde los bordes) y se comprueba que la página no se mueve
 * ni se amplía: desplazamiento 0, escala 1, y barra, tablero y los 7 botones dentro de la pantalla.
 * Ojo: es Chromium; Safari de iOS se comporta parecido pero no igual.
 * Uso: servir el juego en :8123 y `node tests/e2e/gestures-locked.e2e.cjs`. Necesita Playwright.
 */
const { chromium, devices } = require('playwright');
const W = 440, H = 733;
(async () => {
  const b = await chromium.launch(); let fail = 0;
  const ctx = await b.newContext({ viewport: { width: W, height: H }, screen: { width: W, height: 956 }, isMobile: true, hasTouch: true, userAgent: devices['iPhone 13'].userAgent });
  const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  await p.goto('http://localhost:8123/'); await p.waitForTimeout(800);
  await p.click('button[data-mode=marathon]'); await p.waitForTimeout(2600);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], id) => ({ x, y, id })) });
  const drag = async (pts, to, steps = 6) => {
    await touch('touchStart', pts);
    for (let i = 1; i <= steps; i++) await touch('touchMove', pts.map(([x, y], k) => [x + (to[k][0] - x) * i / steps, y + (to[k][1] - y) * i / steps]));
    await touch('touchEnd', []);
  };
  const check = async (label) => {
    const r = await p.evaluate(() => {
      const q = (s) => { const e = document.querySelector(s).getBoundingClientRect(); return [e.left, e.top, e.right, e.bottom]; };
      const els = { barra: q('.topbar'), tablero: q('#board') };
      document.querySelectorAll('#touch button').forEach((e) => { if (getComputedStyle(e).display !== 'none') { const r = e.getBoundingClientRect(); els[e.dataset.act] = [r.left, r.top, r.right, r.bottom]; } });
      const vv = visualViewport;
      return { els, sx: scrollX, sy: scrollY, scale: vv.scale, ox: vv.offsetLeft, oy: vv.offsetTop, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight };
    });
    const bad = [];
    if (r.sx || r.sy || Math.abs(r.scale - 1) > 0.01 || r.ox || r.oy) bad.push(`página movida: scroll ${r.sx},${r.sy} escala ${r.scale} desplazamiento ${r.ox},${r.oy}`);
    if (r.sw > W || r.sh > H) bad.push(`contenido mayor que la pantalla ${r.sw}x${r.sh}`);
    for (const [k, [l, t, rr, bb]] of Object.entries(r.els)) if (l < -1 || t < -1 || rr > W + 1 || bb > H + 1) bad.push(`${k} fuera: ${[l, t, rr, bb].map(Math.round)}`);
    if (bad.length) { fail++; console.log('FALLO tras', label, '→', bad.join('; ')); }
  };
  const C = [W / 2, H / 2];
  // Pellizcos para ampliar y reducir, en el tablero y sobre los botones
  await drag([[200, 360], [240, 380]], [[80, 200], [380, 560]]); await check('pellizco en el tablero');
  await drag([[60, 690], [380, 690]], [[180, 690], [260, 690]]); await check('pellizco sobre los botones');
  // Deslizamientos rápidos en las cuatro direcciones y desde los bordes
  for (const [from, to] of [[[220, 200], [220, 700]], [[220, 650], [220, 20]], [[10, 400], [430, 400]], [[430, 400], [5, 400]], [[220, 2], [220, 500]], [[220, 731], [220, 100]], [[100, 690], [100, 300]], [[400, 690], [0, 690]]]) {
    await drag([from], [to], 3); await check(`deslizar ${from} → ${to}`);
  }
  // Tres dedos a la vez y toques dobles
  await drag([[100, 300], [220, 300], [340, 300]], [[90, 600], [220, 650], [350, 600]]); await check('tres dedos');
  for (let i = 0; i < 3; i++) { await p.touchscreen.tap(220, 400); await p.waitForTimeout(80); }
  await p.waitForTimeout(300); await check('toques dobles');
  await b.close();
  console.log(fail ? `${fail} fallos` : 'Gestos bruscos: la página no se mueve ni se amplía y todo sigue a la vista');
  process.exit(fail ? 1 : 0);
})();
