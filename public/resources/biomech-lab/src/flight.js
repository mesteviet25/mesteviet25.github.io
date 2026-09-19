// An illustrative pitch/contact animation, not measured ball-tracking data.
export function ballPosition(timeMs) {
  if (timeMs === 0) return [0, 0, 0];
  const t = timeMs / 1000;
  return t <= 0
    ? [-36 * t, 0, -3 * t]
    : [39 * t, 7 * t, 12 * t - 4.905 * t * t];
}
