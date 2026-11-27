import { $ } from '../util/dom.js';
import { buildCard } from '../share/buildCard.js';
import { shareCard, downloadBlob } from '../share/shareCard.js';
import { loadIdentity } from '../storage/identity.js';
import { onOpen } from './overlays.js';

let current = null;

/** Vista previa de la tarjeta de progreso con botones de compartir y descargar. */
export function bindSharePanel() {
  const img = $('share-preview'), msg = $('share-status');
  onOpen('ov-share', async () => {
    msg.textContent = 'Preparando tarjeta…';
    img.removeAttribute('src');
    current = await buildCard();
    img.src = current.toDataURL('image/png');
    msg.textContent = '';
  });
  $('share-go').addEventListener('click', async () => {
    if (!current) return;
    const r = await shareCard(current, loadIdentity().name);
    msg.textContent = r === 'shared' ? '¡Compartida!' : r === 'downloaded' ? 'Tarjeta descargada' : '';
  });
  $('share-download').addEventListener('click', () => {
    if (!current) return;
    current.toBlob((b) => downloadBlob(b, 'prisma-progreso.png'), 'image/png');
    msg.textContent = 'Tarjeta descargada';
  });
}
