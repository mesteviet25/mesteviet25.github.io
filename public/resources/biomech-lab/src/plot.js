import { indexAt, eventTime } from "./model.js";
import { seriesColors, bandColor } from "./palette.js?v=20260916-20";
import { signalScale } from "./chart-scales.js?v=20260916-20";
const NS = "http://www.w3.org/2000/svg";
const node = (tag, attrs = {}, text = "") => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  n.textContent = text;
  return n;
};
const finite = Number.isFinite;
const time = (t) => `${Math.round(t)} ms`;
export function buildSignalPlot({ holder, data, view, range, bands, report = false, onTime }) {
  holder.replaceChildren();
  const names = view.components || [view.id],
    T = data.t_ms,
    [a, b] = range;
  const colors = names.length > 1 ? seriesColors : ["#ffa300"];
  const indices = T.map((t, i) => (t >= a && t <= b ? i : -1)).filter(
    (i) => i >= 0,
  );
  const scaled = names
    .flatMap((id) =>
      indices.flatMap((k) => [
        data.signals[id]?.[k],
        ...(bands ? [data.band[id]?.lo[k], data.band[id]?.hi[k]] : []),
      ]),
    )
    .filter((v) => v !== null && finite(v));
  if (!scaled.length) {
    holder.textContent = "No measured samples available in this time window.";
    return [];
  }
  const w = Math.max(260, holder.clientWidth),
    h = innerWidth <= 1000 ? Math.max(75, Math.min(280, holder.parentElement.clientHeight - (names.length > 1 ? 80 : 60))) : Math.max(
      innerHeight <= 800 ? 160 : 215,
      Math.min(260, innerHeight * (innerWidth < 1100 ? 0.19 : 0.23)) -
        (a > T[0] || b < T.at(-1) ? 32 : 0),
    ),
    L = 48,
    R = 12,
    U = 22,
    B = 32;
  const scale = signalScale(view.id, scaled, report);
  const lo = scale.min, hi = scale.max;
  const gx = (t) => L + ((t - a) / (b - a)) * (w - L - R),
    gy = (v) => U + ((hi - v) / (hi - lo)) * (h - U - B);
  const svg = node("svg", {
    viewBox: `0 0 ${w} ${h}`,
    class: "plot",
    role: "group",
    "aria-label": `${view.name}, ${time(a)} to ${time(b)}. Use swing time slider for keyboard control.`,
  });
  holder.append(svg);
  const defs = node("defs"), clip = node("clipPath", { id: "signal-plot-clip" });
  clip.append(node("rect", { x: L, y: U, width: w-L-R, height: h-U-B }));
  defs.append(clip);
  svg.append(defs);
  const plot = node("g", { "clip-path": "url(#signal-plot-clip)" });
  svg.append(node("text", { x: L, y: 12 }, view.unit));
  for (const v of scale.ticks)
    svg.append(
      node("line", { class: "axis", x1: L, x2: w - R, y1: gy(v), y2: gy(v) }),
      node(
        "text",
        { x: L - 6, y: gy(v) + 4, "text-anchor": "end" },
        String(v),
      ),
    );
  const timeTicks = report
    ? (a < -160 ? [a, a * 2 / 3, a / 3, 0] : [-150, -100, -50, 0])
    : Array.from({length: 4}, (_, j) => a + ((b-a)*j)/3);
  for (let j = 0; j < timeTicks.length; j++) {
    const t = timeTicks[j];
    svg.append(
      node(
        "text",
        {
          x: gx(t),
          y: h - 7,
          "text-anchor": j === 0 && t === a ? "start" : report ? "middle" : j === 3 ? "end" : "middle",
        },
        time(t),
      ),
    );
  }
  if (a <= 0 && b >= 0)
    svg.append(
      node("line", {
        class: "event-line",
        x1: gx(0),
        x2: gx(0),
        y1: U,
        y2: h - B,
      }),
      node(
        "text",
        { x: Math.min(w - 35, gx(0)), y: 12, "text-anchor": "middle" },
        "Contact",
      ),
    );
  const path = (values, inds = indices) => {
    let open = false;
    return inds
      .map((k) => {
        if (values?.[k] === null || !finite(values?.[k])) {
          open = false;
          return "";
        }
        const s = `${open ? "L" : "M"}${gx(T[k])},${gy(values[k])}`;
        open = true;
        return s;
      })
      .join(" ");
  };
  // Bands are segmented across missing samples, exactly like the mean curves.
  names.forEach((id, j) => {
    const band = data.band[id];
    if (!bands || !band) return;
    let segment = [];
    const flush = () => {
      if (segment.length > 1)
        plot.append(
          node("path", {
            d:
              path(band.hi, segment) +
              " " +
              [...segment]
                .reverse()
                .map((k) => `L${gx(T[k])},${gy(band.lo[k])}`)
                .join(" ") +
              "Z",
            fill: bandColor(colors[j]),
            opacity: 1,
            class: "reference-band",
            "data-series": id,
          }),
        );
      segment = [];
    };
    indices.forEach((k) => {
      if (
        band.lo[k] !== null &&
        band.hi[k] !== null &&
        finite(band.lo[k]) &&
        finite(band.hi[k])
      )
        segment.push(k);
      else flush();
    });
    flush();
  });
  const cursor = node("line", { class: "cursor", y1: U, y2: h - B });
  const live = document.createElement("div");
  live.className = "series-legend";
  holder.append(live);
  const charts = names.map((id, j) => {
    const values = data.signals[id] || [];
    plot.append(
      node("path", {
        d: path(values),
        fill: "none",
        stroke: colors[j],
        "stroke-width": 2,
      }),
    );
    const line = document.createElement("div");
    line.style.color = colors[j];
    const label = document.createElement("span");
    label.textContent = view.labels?.[j] || view.name;
    const readout = document.createElement("span"),
      count = document.createElement("span");
    count.className = "sr-only";
    line.append(label, readout, count);
    live.append(line);
    const point = node("circle", { r: 3, fill: colors[j] });
    plot.append(point);
    for (const e of view.events || []) {
      const t = eventTime(data, e.key),
        k = indexAt(T, t);
      if (t < a || t > b || values[k] === null || !finite(values[k])) continue;
      const x = gx(t),
        y = gy(values[k]);
      const star = node("path", {
        d:
          Array.from({ length: 10 }, (_, i) => {
            const angle = -Math.PI / 2 + (i * Math.PI) / 5,
              r = i % 2 ? 4 : 9;
            return `${i ? "L" : "M"}${x + Math.cos(angle) * r},${y + Math.sin(angle) * r}`;
          }).join(" ") + "Z",
        class: "sample",
        tabindex: 0,
        role: "button",
        "aria-label": `${e.label}, ${time(t)}, ${values[k].toFixed(1)} ${view.unit}`,
      });
      star.addEventListener("click", (e) => {
        e.stopPropagation();
        onTime(t);
      });
      star.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTime(t);
        }
      });
      plot.append(star);
    }
    return {
      s: { id, unit: view.unit },
      values,
      readout,
      count,
      cursor,
      point,
      gx,
      gy,
      a,
      b,
    };
  });
  svg.append(plot, cursor);
  if (report && !scale.fitted) {
    const note = document.createElement("p");
    note.className = "plot-scale-note";
    note.textContent = scale.page
      ? "Report-aligned axes · time shown in milliseconds."
      : "No matching chart in the report; exhibit scale shown.";
    if (scale.clipped) note.textContent += " Values extend beyond this scale; select Full swing to see all values.";
    holder.append(note);
  }
  const scrub = (e) => {
    const r = svg.getBoundingClientRect();
    onTime(
      a +
        Math.max(
          0,
          Math.min(1, (((e.clientX - r.left) / r.width) * w - L) / (w - L - R)),
        ) *
          (b - a),
    );
  };
  svg.addEventListener("pointerdown", (e) => {
    if (e.target.closest("[role=button]")) return;
    svg.setPointerCapture(e.pointerId);
    scrub(e);
  });
  svg.addEventListener("pointermove", (e) => {
    if (svg.hasPointerCapture(e.pointerId)) scrub(e);
  });
  svg.addEventListener("pointerup", (e) => {
    if (svg.hasPointerCapture(e.pointerId))
      svg.releasePointerCapture(e.pointerId);
  });
  return charts;
}
