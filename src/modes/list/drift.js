import { DRIFT_SECS } from '../../scenes/sceneList.js';

/**
 * Deriva: el Zen de las escenas. Sin prisa y sin final; las escenas pasan solas con el tiempo
 * (no con las líneas), así que basta con dejarse llevar.
 */
export default {
  id: 'drift',
  order: 10.5,
  name: 'Deriva',
  description: 'Zen que viaja por las escenas',
  icon: '☾',
  record: 'score',
  sceneDrive: 'drift',
  rules: { levelUp: false, fixedInterval: 1.1, endsOnTopOut: false, undo: Infinity, undoCost: 250, star: true },
  setup(g) { g.custom.driftStep = 0; },
  onTick(g) {
    const step = Math.floor(g.time / DRIFT_SECS);
    if (step !== g.custom.driftStep) { g.custom.driftStep = step; g.emit('sceneStep', {}); }
  },
};
