import { view } from '../view.js';
import { backdropSprite } from '../sprites/backdropSprite.js';

export function drawBackdrop(ctx, settings) {
  ctx.drawImage(backdropSprite(view.cell, view.dpr, settings.grid), 0, 0, view.width, view.height);
}
