import { $ } from '../../util/dom.js';
import { buildMapCard } from '../share/buildMapCard.js';
import { shareCard } from '../../share/shareCard.js';
import { mapToast } from './toast.js';
import { emit } from '../../app/bus.js';

/** Botón de compartir del mapa: dibuja la tarjeta del viaje y abre la hoja de compartir del sistema. */
export function bindShareMap() {
  $('jm-share').addEventListener('click', async () => {
    mapToast('Preparando tu tarjeta…');
    try {
      const how = await shareCard(await buildMapCard(), 'viaje');
      if (how === 'downloaded') mapToast('Tarjeta guardada en descargas');
      if (how !== 'cancelled') emit('journeyShare', {});
    } catch { mapToast('No se pudo crear la tarjeta'); }
  });
}
