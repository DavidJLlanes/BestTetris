import { CARD_W, FONT } from '../cardSize.js';

/** Lista de mejores marcas (hasta 4). */
export function drawCardRecords(ctx, records, y) {
  ctx.textAlign = 'left';
  ctx.fillStyle = '#9b97c9'; ctx.font = `700 26px ${FONT}`;
  ctx.fillText('MEJORES MARCAS', 80, y);
  records.slice(0, 4).forEach(([name, value], i) => {
    const ry = y + 60 + i * 62;
    ctx.fillStyle = '#ecebff'; ctx.font = `600 36px ${FONT}`; ctx.textAlign = 'left';
    ctx.fillText(name, 80, ry);
    ctx.fillStyle = '#ffffff'; ctx.font = `800 36px ${FONT}`; ctx.textAlign = 'right';
    ctx.fillText(value, CARD_W - 80, ry);
  });
  if (!records.length) {
    ctx.fillStyle = '#ecebff'; ctx.font = `italic 500 32px ${FONT}`;
    ctx.fillText('Todavía sin marcas: ¡a jugar!', 80, y + 60);
  }
}
