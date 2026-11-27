/**
 * Prueba de navegador (no entra en `npm test`): en un iPhone en vertical, al escribir el nombre
 * el teclado encoge lo visible (visualViewport) hasta quedar más ancho que alto. No debe salir
 * el aviso de girar el móvil ni recolocarse la aplicación, y el campo debe seguir a la vista.
 * Uso: servir el juego en :8123 y `node tests/e2e/keyboard-portrait.e2e.cjs`. Necesita Playwright.
 */
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch(); let fail = 0;
  const ctx = await b.newContext({ viewport: { width: 440, height: 733 }, screen: { width: 440, height: 956 }, isMobile: true, hasTouch: true, userAgent: devices['iPhone 13'].userAgent });
  const p = await ctx.newPage();
  // visualViewport controlable: el "teclado" lo baja a 300 px de alto
  await p.addInitScript(() => {
    const vv = Object.assign(new EventTarget(), { width: innerWidth, height: innerHeight, offsetTop: 0, offsetLeft: 0, scale: 1 });
    Object.defineProperty(window, 'visualViewport', { value: vv });
    window.__keyboard = (h) => { vv.height = h; vv.dispatchEvent(new Event('resize')); dispatchEvent(new Event('resize')); };
  });
  await p.goto('http://localhost:8123/'); await p.waitForTimeout(800);
  const before = await p.evaluate(() => document.getElementById('app').getBoundingClientRect().height);
  await p.click('#badge'); await p.waitForTimeout(600);
  await p.focus('#profile-name');
  await p.evaluate(() => window.__keyboard(300)); await p.waitForTimeout(1600);
  await p.keyboard.type('David');
  const during = await p.evaluate(() => ({ rotate: document.body.classList.contains('rotate-needed'), app: document.getElementById('app').getBoundingClientRect().height, field: document.getElementById('profile-name').getBoundingClientRect().top }));
  if (during.rotate) { fail++; console.log('FALLO: sale el aviso de girar con el teclado abierto'); }
  if (Math.abs(during.app - before) > 1) { fail++; console.log('FALLO: la aplicación cambia de alto al escribir', before, during.app); }
  if (during.field < 0 || during.field > 300) { fail++; console.log('FALLO: el campo queda fuera de la vista', during.field); }
  await p.evaluate(() => { document.activeElement.blur(); window.__keyboard(733); }); await p.waitForTimeout(800);
  const after = await p.evaluate(() => ({ rotate: document.body.classList.contains('rotate-needed'), name: document.getElementById('profile-name').value }));
  if (after.rotate) { fail++; console.log('FALLO: aviso de girar tras cerrar el teclado'); }
  await b.close();
  console.log(fail ? `${fail} fallos` : 'Teclado abierto en vertical: sin aviso de girar, sin saltos y con el campo a la vista');
  process.exit(fail ? 1 : 0);
})();
