export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export function eventTime(data, key) {
  return key === "contact"
    ? 0
    : key === "peak_hand_speed_ms"
      ? data.peak_hand_speed_ms
      : data.events_ms[key];
}
export function lessonRange(data, lesson) {
  const start = eventTime(data, lesson.event || lesson.from);
  return lesson.kind === "position"
    ? [start, start]
    : [start, eventTime(data, lesson.to)];
}
export function phaseAt(data, lessons, t) {
  const half = (data.t_ms[1] - data.t_ms[0]) / 2;
  const position = lessons.find(
    (l) =>
      l.kind === "position" && Math.abs(t - eventTime(data, l.event)) <= half,
  );
  return (
    position ||
    lessons.find(
      (l) =>
        l.kind === "phase" &&
        t >= eventTime(data, l.from) &&
        t < eventTime(data, l.to),
    ) ||
    (t < eventTime(data, "start_time") ? lessons[0] : lessons.at(-1))
  );
}
export function indexAt(times, t) {
  let lo = 0,
    hi = times.length - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (times[mid] < t) lo = mid + 1;
    else hi = mid;
  }
  return lo > 0 && Math.abs(times[lo - 1] - t) < Math.abs(times[lo] - t)
    ? lo - 1
    : lo;
}
export function chartRange(data, lesson, mode) {
  if (mode === "full") return [data.t_ms[0], data.t_ms.at(-1)];
  if (mode === "load") {
    const step = data.t_ms[1] - data.t_ms[0];
    return [Math.max(data.t_ms[0], Math.floor(data.events_ms.load_time / step) * step), Math.min(data.t_ms.at(-1), 30)];
  }
  if (mode === "report") return [Math.max(data.t_ms[0], -160), Math.min(data.t_ms.at(-1), 30)];
  const [a, b] = lessonRange(data, lesson);
  return a === b
    ? [Math.max(data.t_ms[0], a - 180), Math.min(data.t_ms.at(-1), a + 120)]
    : [a, b];
}
export function advanceTime(time, elapsed, speed, range, loop) {
  const next = time + Math.min(100, Math.max(0, elapsed)) * speed;
  if (next <= range[1]) return { time: next, ended: false };
  return loop
    ? {
        time: range[0] + ((next - range[0]) % (range[1] - range[0])),
        ended: false,
      }
    : { time: range[1], ended: true };
}
export function validateData(d) {
  if (d.schema_version !== 2)
    throw new Error("This exhibit needs the version 2 aggregate dataset.");
  const T = d.t_ms,
    n = T?.length;
  if (
    !n ||
    n < 2 ||
    T.some((t, i) => !Number.isFinite(t) || (i && t <= T[i - 1]))
  )
    throw new Error("The time axis is invalid.");
  if (T[d.contact_index] !== 0)
    throw new Error("The contact reference is invalid.");
  for (const key of ["start_time", "load_time", "fp_time", "finish_time"])
    if (!Number.isFinite(d.events_ms?.[key]))
      throw new Error("Required swing events are missing.");
  if (
    !(
      d.events_ms.start_time < d.events_ms.load_time &&
      d.events_ms.load_time < d.events_ms.fp_time &&
      d.events_ms.fp_time < 0 &&
      d.events_ms.finish_time > 0
    )
  )
    throw new Error("Swing events are out of order.");
  for (const points of [
    d.origin,
    d.distal,
    d.sweet,
    d.hand,
    ...Object.values(d.body || {}),
  ])
    if (
      points?.length !== n ||
      points.some((p) => p.length !== 3 || p.some((v) => !Number.isFinite(v)))
    )
      throw new Error("The motion tracks are invalid.");
  if (!d.body?.com || !d.links?.length)
    throw new Error("The body model is missing.");
  for (const [a, b] of d.links)
    if (!d.body[a] || !d.body[b]) throw new Error("A body link is invalid.");
  for (const [key, values] of Object.entries(d.signals || {})) {
    if (
      values.length !== n ||
      values.some((v) => v !== null && !Number.isFinite(v))
    )
      throw new Error(`Invalid samples for ${key}.`);
    const counts = d.signal_counts?.[key],
      band = d.band?.[key];
    if (
      counts?.length !== n ||
      counts.some(
        (c, i) =>
          !Number.isInteger(c) ||
          c < 0 ||
          c > d.meta.n_swings ||
          (values[i] === null) !== (c === 0),
      )
    )
      throw new Error(`Invalid contributing counts for ${key}.`);
    if (
      band &&
      ["lo", "hi"].some(
        (k) =>
          band[k]?.length !== n ||
          band[k].some((v) => v !== null && !Number.isFinite(v)),
      )
    )
      throw new Error(`Invalid variability band for ${key}.`);
  }
  return d;
}
