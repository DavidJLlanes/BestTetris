import { $ } from '../util/dom.js';
import { onOpen, topOverlay } from '../ui/overlays.js';
import { map } from './map/mapState.js';
import { initMap } from './map/initMap.js';
import { runMap } from './map/mapLoop.js';
import { resizeMap } from './map/resizeMap.js';
import { aimAt } from './map/camera.js';
import { tramoAt } from './map/skyColor.js';
import { tapNode } from './ui/tapNode.js';
import { buildNodeButtons, bindNodeKeys, refreshNodeButtons } from './ui/nodeButtons.js';
import { renderMapHud, renderFuel, renderTramo } from './ui/mapHud.js';
import { bindBag, pickedBag } from './ui/bagPicker.js';
import { cardLevel, openLevelCard } from './ui/levelCard.js';
import { bindResultPanel, lastResult } from './ui/resultPanel.js';
import { bindShopPanel } from './ui/shopPanel.js';
import { bindAtlasPanel } from './ui/atlasPanel.js';
import { bindShareMap } from './ui/shareMap.js';
import { mapToast } from './ui/toast.js';
import { openJourney } from './ui/openJourney.js';
import { replayFlight } from './map/ship/replayFlight.js';
import { launchLevel } from './launchLevel.js';
import { watchJourney } from './watchJourney.js';
import { getJourney, saveJourney } from './progress/journeyStore.js';
import { eventOfWeek } from './progress/eventOfWeek.js';
import { goMenu } from '../app/goMenu.js';
import { playAgain } from '../app/playAgain.js';
import { playSfx } from '../audio/index.js';

let fuelTick = 0;

/** Conecta el Viaje: mapa, fichas, resultado, tienda, Atlas, compartir y las partidas. */
export function initJourney() {
  const visible = () => !$('ov-journey').hidden;
  initMap($('jm-canvas'), { onTap: tapNode, isVisible: visible });
  buildNodeButtons(tapNode);
  bindNodeKeys();
  map.onFrame = (dt) => {
    renderTramo(Math.floor(tramoAt(map.cam.y)));
    fuelTick += dt;
    if (fuelTick > 1) { fuelTick = 0; renderFuel(); }
    // Al cerrar una ficha (volver al mapa), la cámara se aleja otra vez
    if (map.zoomTo === 1 && !map.zoomDone && topOverlay() === $('ov-journey')) { map.zoomTo = 0; aimAt(map.byId[map.sel]); }
  };
  onOpen('ov-journey', () => { refreshNodeButtons(map.sel); requestAnimationFrame(() => { resizeMap(); renderMapHud(); runMap(); }); });
  bindBag(getJourney);
  bindResultPanel();
  bindShopPanel();
  bindAtlasPanel();
  bindShareMap();
  watchJourney();
  $('jc-play').addEventListener('click', () => {
    const level = cardLevel();
    if (!level || !launchLevel(level, pickedBag())) { playSfx('denied'); return; }
    map.zoomTo = 0; map.zoom = 0;
  });
  $('jr-continue').addEventListener('click', () => { const r = lastResult(); goMenu(); openJourney({ result: r }); });
  $('jr-again').addEventListener('click', playAgain); // sin combustible, playAgain lleva a la ficha
  $('jm-calm').addEventListener('click', () => {
    const p = getJourney();
    p.calm = !p.calm;
    saveJourney();
    renderMapHud();
    mapToast(p.calm ? 'Modo calma: juega sin combustible, a tu ritmo' : 'Modo piloto: cada despegue usa combustible');
  });
  $('jm-replay').addEventListener('click', () => { playSfx('ui'); if (!replayFlight()) mapToast('La nave aún no ha volado'); });
  $('jm-event').addEventListener('click', () => { playSfx('ui'); openLevelCard(eventOfWeek().level); });
}
