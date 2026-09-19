// Rounded plotting limits and tick spacing from the reference report's
// downswing/contact charts (pp. 7, 10–13). No athlete data is included.
export const reportScales = {
  pelvis_3d: { min: -20, max: 100, step: 20, page: 7 },
  torso_3d: { min: -30, max: 120, step: 20, page: 7 },
  sequencing: { min: -125, max: 2500, step: 500, page: 10 },
  bat_speed: { min: -45, max: 85, step: 20, page: 11 },
  vaa: { min: -70, max: 45, step: 20, page: 11 },
  haa: { min: -60, max: 60, step: 20, page: 12 },
  vba: { min: -40, max: 70, step: 20, page: 13 },
  hand_speed: { min: 0, max: 30, step: 5 },
  connection: { min: 0, max: 180, step: 30 },
};

export function signalScale(id, values, report = false) {
  const fitted = ["pelvis_3d", "torso_3d", "sequencing", "separation"].includes(id);
  const preset = fitted ? undefined : reportScales[id];
  let min, max, step;
  if (report && preset) ({ min, max, step } = preset);
  else {
    const low = Math.min(...values), high = Math.max(...values);
    const span = high - low || 1;
    const raw = span / 5;
    const power = 10 ** Math.floor(Math.log10(raw));
    step = [1, 2, 5, 10].find((n) => n * power >= raw) * power;
    min = Math.floor((low - span * .04) / step) * step;
    max = Math.ceil((high + span * .04) / step) * step;
    if (fitted) { min = low - span * .06; max = high + span * .06; }
  }
  const ticks = [];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step)
    ticks.push(Number(v.toFixed(6)));
  return { min, max, ticks, fitted, clipped: values.some(v => v < min || v > max), page: report ? preset?.page : undefined };
}
