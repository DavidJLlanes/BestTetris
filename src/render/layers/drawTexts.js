import { fx } from '../../effects/state.js';
import { TEXT_LIFE } from '../../effects/updateEffects.js';
import { view } from '../view.js';
import { textSprite } from '../sprites/textSprite.js';

const easeOutBack = (k) => 1 + 2.7 * Math.pow(k - 1, 3) + 1.7 * Math.pow(k - 1, 2);

/** Rótulos de jugada: entran con un pequeño rebote, suben y se desvanecen. */
export function drawTexts(ctx) {
  const cell = view.cell;
  for (const t of fx.texts) {
    if (!t.sprite || t.spriteVersion !== view.version) {
      t.sprite = textSprite(t.title, t.sub, t.color, cell, view.dpr);
      t.spriteVersion = view.version;
    }
    const k = t.t / TEXT_LIFE;
    const alpha = k < 0.08 ? k / 0.08 : 1 - Math.max(0, (k - 0.6) / 0.4);
    const pop = k < 0.2 ? easeOutBack(k / 0.2) : 1;
    const s = t.scale * pop;
    const { canvas, w, h } = t.sprite;
    const cx = view.width / 2, cy = view.height * 0.4 + t.offset * cell - k * cell * 1.2;
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.drawImage(canvas, cx - (w * s) / 2, cy - (h * s) / 2, w * s, h * s);
  }
  ctx.globalAlpha = 1;
}
