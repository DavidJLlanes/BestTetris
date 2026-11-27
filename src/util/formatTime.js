/** 83.456 → "1:23" o, con centésimas, "1:23.46". */
export function formatTime(seconds, withHundredths = false) {
  const m = Math.floor(seconds / 60), s = seconds - m * 60;
  return withHundredths
    ? `${m}:${s.toFixed(2).padStart(5, '0')}`
    : `${m}:${String(Math.floor(s)).padStart(2, '0')}`;
}
