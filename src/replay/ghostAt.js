/** Avance del fantasma en el instante t: { lines, score } de la última marca anterior. */
export function ghostAt(replay, t) {
  const track = replay.track;
  let lo = 0, hi = track.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (track[mid][0] <= t) lo = mid; else hi = mid - 1; }
  return { lines: track[lo][1], score: track[lo][2], done: lo === track.length - 1 && t >= track[lo][0] };
}
