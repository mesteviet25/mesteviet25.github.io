import { buildSignalPlot } from "./plot.js?v=20260916-20";
import {
  catalog,
  views,
  viewForMetric,
  lessons,
  regions,
  metricAliases,
  summaries,
} from "./catalog.js?v=20260916-20";
import {
  clamp,
  eventTime,
  lessonRange,
  phaseAt,
  indexAt,
  chartRange,
  advanceTime,
  validateData,
} from "./model.js?v=20260916-20";
const $ = (id) => document.getElementById(id);
const NS = "http://www.w3.org/2000/svg";
const svgNode = (tag, attrs = {}, text = "") => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text) n.textContent = text;
  return n;
};
const textNode = (tag, text, className) => {
  const n = document.createElement(tag);
  n.textContent = text;
  if (className) n.className = className;
  return n;
};
const fmtTime = (t) => `${t > 0 ? "+" : ""}${Math.round(t)} ms`;
const finite = (v) => typeof v === "number" && Number.isFinite(v);
let noticeTimer;
function notify(message) {
  $("notice").textContent = message;
  $("notice").hidden = false;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => ($("notice").hidden = true), 4000);
}

const workspace = document.querySelector(".workspace");
workspace.prepend($("signals-section"));
const transport = document.createElement("div");
transport.className = "exhibit-controls";
transport.append(
  document.querySelector(".transport"),
  document.querySelector(".view-controls"),
);
$("exhibit").append(transport);
const about = document.createElement("dialog");
const close = textNode("button", "Close");
close.addEventListener("click", () => about.close());
about.append(close, document.querySelector(".method-section"));
document.body.append(about);
$("about").addEventListener("click", () => about.showModal());
async function init() {
  const response = await fetch("./data/averageSwing.json?v=20260916-20");
  if (!response.ok)
    throw new Error(
      "The aggregate dataset could not be loaded. Reload the page to try again.",
    );
  const data = validateData(await response.json()),
    T = data.t_ms;
  const params = new URLSearchParams(location.search);
  const initialLesson =
    lessons.find((l) => l.id === params.get("stop")) ||
    lessons.find((l) => l.id === "impact");
  const requested = params.get("metric") || params.get("open");
  const initialMetric = viewForMetric(
    metricAliases[requested] || requested,
  )?.id;
  const state = {
    time: params.has("stop") ? lessonRange(data, initialLesson)[0] : 0,
    playing: false,
    mode: params.get("mode") === "explore" ? "explore" : "guided",
    lesson: initialLesson.id,
    metric:
      views.some((s) => s.id === initialMetric) ||
      summaries.some((s) => s.id === initialMetric)
        ? initialMetric
        : "bat_speed",
    signals: [...initialLesson.signals],
    range: ["full", "phase", "report", "load"].includes(params.get("range")) ? params.get("range") : "load",
    camera: ["catcher", "side", "top"].includes(params.get("view"))
      ? params.get("view")
      : "catcher",
    layers: { body: true, path: true, ground: true, plane: false, zone: false },
    speed: 0.5,
    loop: false,
    bands: false,
    group: "Bat",
    region: initialLesson.region,
    annotations: false,
  };
  if (
    !params.has("t") &&
    !params.has("stop") &&
    requested === "early-connection"
  )
    state.time = eventTime(data, "fp_time");
  if (
    !params.has("t") &&
    !params.has("stop") &&
    requested === "peak-hand-speed"
  )
    state.time = eventTime(data, "peak_hand_speed_ms");
  if (params.has("t") && finite(Number(params.get("t"))))
    state.time = clamp(Number(params.get("t")), T[0], T.at(-1));
  let scene = null,
    dirty = true,
    lastTs = null,
    chartNodes = [],
    lastIndex = -1;
  const lesson = () => lessons.find((l) => l.id === state.lesson);
  const metric = () =>
    views.find((s) => s.id === state.metric) ||
    catalog.find((s) => s.id === state.metric) ||
    summaries.find((s) => s.id === state.metric);
  const idx = () => indexAt(T, state.time);
  state.context =
    params.get("context") === "lesson"
      ? "lesson"
      : requested
        ? "metric"
        : "lesson";
  state.regionFocus = false;
  const highlight = () =>
    state.regionFocus
      ? { kind: "seg", seg: regions.find((r) => r.id === state.region).seg }
      : metric().anchor;
  const available = (s) =>
    (s.components || [s.id]).some((id) => data.signals[id]?.some(finite));
  $("status").hidden = true;
  $("exhibit").hidden = false;
  $("signals-section").hidden = false;
  try {
    const { SwingScene } = await import("./scene.js?v=20260916-20");
    scene = new SwingScene($("canvas"), $("overlay")).load(data);
    scene.setView(state.camera);
    scene.resize();
    $("canvas").addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      state.playing = false;
      scene = null;
      $("scene-error").hidden = false;
      $("scene-error").textContent =
        "The 3D display was interrupted. Reload to restore it. The signal charts and teaching notes remain available.";
      renderPlayback();
    });
  } catch (error) {
    $("scene-error").hidden = false;
    $("scene-error").textContent =
      "The 3D display is unavailable in this browser. You can still explore the synchronized charts and teaching notes. Try a browser with WebGL enabled.";
    console.warn("3D display unavailable:", error.message);
  }
  $("cohort-short").textContent =
    "Contact aligned";
  $("cohort-note").textContent =
    `This average combines ${data.meta.n_swings.toLocaleString()} swings, including ${data.meta.n_left.toLocaleString()} left-handed swings mirrored to face the same way as the right-handed swings. Each swing qualified with a peak barrel-tip speed of at least ${data.meta.fast_swing_threshold_mph} mph. That threshold uses a different bat location and moment from sweet-spot speed at contact. The motion and curves use the same swings. Missing samples can change the count at a given frame. Contact is time zero. Use this average to study movement; it is not a target for every hitter.`;
  $("scrub").max = String(T.length - 1);
  const timeline = document.createElement("div");
  timeline.className = "swing-timeline";
  $("scrub").before(timeline);
  timeline.append($("scrub"));
  const marks = document.createElement("div");
  marks.className = "timeline-positions";
  marks.setAttribute("role", "group");
  marks.setAttribute("aria-label", "Timeline swing positions");
  timeline.append(marks);
  timeline.prepend($("phases"));
  transport.prepend(timeline);
  const phaseProgress = [];
  const positionMarkers = lessons.filter(l => l.kind === "position").map(l => {
    const t = eventTime(data, l.event);
    const button = textNode("button", "", "timeline-position");
    button.style.left = `${100 * (indexAt(T, t) / (T.length - 1))}%`;
    button.setAttribute("aria-label", `Jump to ${l.name.toLowerCase()}, ${fmtTime(t)}`);
    button.title = `${l.name} · ${fmtTime(t)}`;
    button.append(textNode("span", l.name));
    button.addEventListener("click", () => selectLesson(l.id));
    marks.append(button);
    return { button, index: indexAt(T, t) };
  });
  $("range").value = state.range;
  for (const l of lessons) {
    const b = textNode("button", l.name);
    b.dataset.kind = l.kind;
    b.dataset.phase = l.id;
    b.addEventListener("click", () => selectLesson(l.id));
    $("phases").append(b);
    const [start, end] = lessonRange(data, l);
    phaseProgress.push({button: b, start, end});
  }
  const landmarkButtons = regions.map((r, i) => {
    const b = textNode("button", String(i + 1), "landmark");
    b.setAttribute("aria-label", `Inspect ${r.name}`);
    b.addEventListener("click", () => selectRegion(r));
    $("landmarks").append(b);
    return { r, b };
  });
  for (const group of ["Body", "Bat"]) {
    const opt = document.createElement("optgroup");
    opt.label = group;
    for (const s of group === "Summary metrics"
      ? summaries
      : views.filter((s) => s.group === group)) {
      const o = textNode(
        "option",
        s.name + (s.group && !available(s) ? " · unavailable" : ""),
      );
      o.value = s.id;
      opt.append(o);
    }
    $("metric-select").append(opt);
  }
  function ensureChart(id) {
    state.signals = catalog.some((s) => s.id === id) ? [id] : [];
  }
  ensureChart(state.metric);
  function selectMetric(id) {
    state.range = "load";
    $("range").value = state.range;
    state.regionFocus = false;
    state.metric = viewForMetric(id)?.id || id;
    state.context = "metric";
    ensureChart(id);
    const s = metric();
    if (s.group) state.group = s.group;
    const region = regions.find((r) => r.seg === s.anchor?.seg);
    if (region) state.region = region.id;
    else if (s.anchor) state.region = "hands";
    renderContext();
    buildCharts();
    $("metric-select").focus({ preventScroll: true });
    dirty = true;
  }
  function selectRegion(r) {
    state.range = "load";
    $("range").value = state.range;
    state.regionFocus = true;
    state.context = "metric";
    state.region = r.id;
    state.signals = [r.signals[0]];
    state.metric = viewForMetric(r.signals[0])?.id || "bat_speed";
    state.group = metric().group;
    renderContext();
    buildCharts();
    dirty = true;
  }
  function selectLesson(id) {
    state.regionFocus = false;
    state.context = "lesson";
    state.lesson = id;
    state.playing = false;
    const l = lesson(),
      [a, b] = lessonRange(data, l);
    state.time = (a + b) / 2;

    renderAll();
  }
  function setTime(t, { follow = true } = {}) {
    state.time = clamp(t, T[0], T.at(-1));
    if (follow && !state.loop) {
      const next = phaseAt(data, lessons, state.time);
      if (next.id !== state.lesson) {
        state.lesson = next.id;
        renderContext();
        if (state.range === "phase") buildCharts();
      }
    }
    dirty = true;
  }
  function renderPlayback() {
    $("play").textContent = state.playing ? "Pause" : "Play";
    $("play").setAttribute(
      "aria-label",
      state.playing ? "Pause swing" : "Play swing",
    );
  }
  function renderContext() {
    const l = lesson(),
      s = metric(),
      step = lessons.indexOf(l);
    document.querySelector(".measurement").hidden = false;
    document.querySelectorAll("[data-phase]").forEach((b) => {
      if (b.dataset.phase === l.id) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
    });
    $("metric-select").value = s.id;
    const detail = $("metric-detail");
    detail.replaceChildren();
    detail.append(textNode("p", s.source || "Summary metric", "metric-source"));
    if (s.group && !s.components) {
      const value = textNode("div", "", "metric-value");
      value.append(textNode("strong", "—"), textNode("small", s.unit));
      value.id = "detail-value";
      detail.append(value);
      detail.append(textNode("p", "", "detail-time"));
    }
    if (s.components)
      detail.append(
        textNode(
          "p",
          "Current values appear beside the graph.",
          "detail-time",
        ),
      );
    detail.append(textNode("p", s.definition, "metric-definition"));
    if (s.notes) {
      const more = textNode(
        "button",
        "Learn more",
        "coaching-notes-button",
      );
      more.addEventListener("click", () => {
        state.playing = false;
        renderPlayback();
        const dialog = document.createElement("dialog");
        dialog.className = "coaching-dialog";
        dialog.setAttribute("aria-labelledby", "coaching-title");
        const close = textNode("button", "Close");
        close.addEventListener("click", () => dialog.close());
        const title = textNode("h2", s.name);
        title.id = "coaching-title";
        dialog.append(
          close,
          title,
          textNode("p", s.definition),
          textNode("h3", s.readLabel || "What to watch"),
          textNode("p", s.read),
          textNode("h3", "Coaching notes"),
        );
        for (const paragraph of s.notes)
          dialog.append(textNode("p", paragraph));
        dialog.append(
          textNode("h3", "How this exhibit measures it"),
          textNode("p", s.method),
          textNode(
            "p",
            "The shaded band shows the cohort mean ± one standard deviation. It describes variation among these swings. The animated ball illustrates contact; its flight was not measured.",
          ),
        );
        dialog.append(textNode("h3", "References"), textNode("p", s.book));
        for (const [label, url] of s.sources) {
          const a = textNode("a", label);
          a.href = url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          dialog.append(a);
        }
        dialog.addEventListener("close", () => {
          dialog.remove();
          more.focus({ preventScroll: true });
        });
        document.body.append(dialog);
        dialog.showModal();
      });
      detail.append(more);
    } else if (s.method) detail.append(textNode("p", s.method, "method"));
    if (s.group && !available(s))
      detail.append(
        textNode(
          "p",
          "This dataset has no samples for this measurement.",
          "method",
        ),
      );
    const moments = $("measurement-moments");
    moments.replaceChildren();
    for (const event of s.events || []) {
      const button = textNode(
        "button",
        `★ ${event.label} · ${fmtTime(eventTime(data, event.key))}`,
      );
      button.addEventListener("click", () => {
        state.playing = false;
        setTime(eventTime(data, event.key));
        renderPlayback();
      });
      moments.append(button);
    }
    scene?.setHighlight(highlight());
    scene?.setMetric(s.id);
    $("path-key").hidden = ![
      "bat_speed",
      "hand_speed",
      "haa",
      "vaa",
      "vba",
      "connection",
    ].includes(s.id);
    $("path-key").textContent = scene?.metricRange
      ? `${s.name} · blue ${scene.metricRange[0].toFixed(1)} → green → red ${scene.metricRange[1].toFixed(1)} ${s.unit}`
      : "";
    dirty = true;
  }
  function buildCharts() {
    chartNodes = buildSignalPlot({
      holder: $("charts"),
      data,
      view: metric(),
      range: chartRange(data, lesson(), state.range),
      report: state.range === "report" || state.range === "load",
      bands: state.bands,
      onTime: (t) => {
        state.playing = false;
        setTime(t, { follow: state.range === "full" });
        renderPlayback();
      },
    });
    buildOverview();
    dirty = true;
  }
  function buildOverview() {
    $("overview-wrap").hidden = state.range === "full";
    const svg = $("overview");
    svg.replaceChildren();
    const fullA = T[0],
      fullB = T.at(-1),
      x = (t) => 20 + ((t - fullA) / (fullB - fullA)) * 960;
    svg.append(
      svgNode("line", { x1: 20, x2: 980, y1: 20, y2: 20, stroke: "#6b7280" }),
    );
    const [a, b] = chartRange(data, lesson(), state.range);
    svg.append(
      svgNode("rect", {
        x: x(a),
        y: 10,
        width: x(b) - x(a),
        height: 20,
        fill: "#ffa300",
        opacity: 0.3,
      }),
    );
    for (const t of [fullA, 0, fullB])
      svg.append(
        svgNode(
          "text",
          {
            x: x(t),
            y: 50,
            "text-anchor":
              t === fullA ? "start" : t === fullB ? "end" : "middle",
          },
          fmtTime(t),
        ),
      );
    svg.append(
      svgNode("line", {
        id: "overview-cursor",
        y1: 5,
        y2: 35,
        stroke: "#ffa300",
      }),
    );
  }
  function renderAll() {
    renderContext();
    buildCharts();
    renderPlayback();
  }
  function togglePlay() {
    if (!state.playing) {
      const [a, b] = playRange();
      if (state.time >= b || state.time < a) state.time = a;
    }
    state.playing = !state.playing;
    lastTs = null;
    renderPlayback();
  }
  function playRange() {
    if (state.loop) {
      const l = lesson();
      return chartRange(data, l, "phase");
    }
    return [T[0], T.at(-1)];
  }
  $("play").addEventListener("click", togglePlay);
  $("metric-select").addEventListener("change", (e) =>
    selectMetric(e.target.value),
  );
  function step(delta) {
    state.playing = false;
    setTime(T[clamp(idx() + delta, 0, T.length - 1)]);
    renderPlayback();
  }
  $("back-frame").addEventListener("click", () => step(-1));
  $("next-frame").addEventListener("click", () => step(1));
  $("scrub").addEventListener("input", (e) => {
    state.playing = false;
    setTime(T[Number(e.target.value)]);
    renderPlayback();
  });
  $("speed").addEventListener(
    "change",
    (e) => (state.speed = Number(e.target.value)),
  );
  $("loop").addEventListener("change", (e) => (state.loop = e.target.checked));
  $("bands").addEventListener("change", (e) => {
    state.bands = e.target.checked;
    buildCharts();
  });
  $("range").addEventListener("change", (e) => {
    state.range = e.target.value;
    buildCharts();
  });
  document.querySelectorAll("[data-view]").forEach((b) =>
    b.addEventListener("click", () => {
      state.camera = b.dataset.view;
      scene?.setView(state.camera);
      renderCamera();
    }),
  );
  function renderCamera() {
    document
      .querySelectorAll("[data-view]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.view === state.camera)),
      );
  }
  $("reset").addEventListener("click", () => {
    state.camera = "catcher";
    scene?.resetView();
    renderCamera();
  });
  document.querySelectorAll("[data-layer]").forEach((b) =>
    b.addEventListener("change", () => {
      state.layers[b.dataset.layer] = b.checked;
      scene?.setLayer(b.dataset.layer, b.checked);
    }),
  );
  $("annotations").addEventListener(
    "change",
    (e) => (state.annotations = e.target.checked),
  );
  $("overview").addEventListener("click", (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    state.playing = false;
    setTime(
      T[0] +
        clamp((((e.clientX - r.left) / r.width) * 1000 - 20) / 960, 0, 1) *
          (T.at(-1) - T[0]),
    );
    renderPlayback();
  });
  $("share").addEventListener("click", async () => {
    const url = new URL(location.href);
    url.search = "";
    for (const [key, value] of Object.entries({
      v: "20260916-20",
      stop: state.lesson,
      metric: state.metric,
      t: T[idx()],
      view: state.camera,
      mode: state.mode,
      range: state.range,
      signals: state.signals.join(","),
      context: state.context,
      layers: Object.entries(state.layers)
        .filter(([, on]) => on)
        .map(([name]) => name)
        .join(","),
      bands: state.bands ? "1" : "0",
      annotations: state.annotations ? "1" : "0",
    }))
      url.searchParams.set(key, value);
    if (state.regionFocus) url.searchParams.set("region", state.region);
    if (scene) {
      url.searchParams.set(
        "camera",
        scene.camera.position
          .toArray()
          .map((v) => v.toFixed(4))
          .join(","),
      );
    }
    try {
      await navigator.clipboard.writeText(url.href);
      notify("Link copied. It opens this time, measurement, and camera view.");
    } catch {
      notify("Copy the view link from the address bar.");
    }
    history.replaceState(null, "", url);
  });
  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented) return;
    if (e.target.closest("input,select,textarea,button,summary,a")) return;
    if (e.key === " ") {
      e.preventDefault();
      togglePlay();
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      step(e.key === "ArrowRight" ? 1 : -1);
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      state.playing = false;
      lastTs = null;
      renderPlayback();
    }
  });
  let resizeTimer;
  new ResizeObserver(() => {
    scene?.resize();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildCharts, 100);
  }).observe($("stage"));
  const incoming = params
    .get("signals")
    ?.split(",")
    .filter((id) => catalog.some((s) => s.id === id));
  if (incoming?.length) state.signals = [...new Set(incoming)].slice(0, 3);
  if (params.has("layers")) {
    const on = params.get("layers").split(",");
    for (const name of Object.keys(state.layers)) {
      state.layers[name] = on.includes(name);
      scene?.setLayer(name, state.layers[name]);
    }
    document
      .querySelectorAll("[data-layer]")
      .forEach((b) => (b.checked = state.layers[b.dataset.layer]));
  }
  state.bands = params.get("bands") !== "0";
  $("bands").checked = state.bands;
  state.annotations = params.get("annotations") === "1";
  $("annotations").checked = state.annotations;
  if (regions.some((r) => r.id === params.get("region"))) {
    state.region = params.get("region");
    state.regionFocus = true;
  }
  ensureChart(state.metric);
  const anatomy = params.get("anatomy");
  if (anatomy) {
    const r = regions.find(
      (r) => r.id === (anatomy === "feet" ? "lead-leg" : anatomy),
    );
    if (r) {
      state.region = r.id;
      state.signals = [r.signals[0]];
      state.metric = viewForMetric(r.signals[0])?.id || "bat_speed";
    }
  }
  if (scene && params.has("camera")) {
    const coords = params.get("camera").split(",").map(Number);
    if (coords.length === 3 && coords.every(finite)) {
      const distance = Math.hypot(...coords.map((v, i) => v - scene.target[i]));
      if (
        distance >= scene.controls.minDistance &&
        distance <= scene.controls.maxDistance
      ) {
        scene.camera.position.set(...coords);
        scene.controls.update();
      }
    }
  }
  state.lesson = phaseAt(data, lessons, state.time).id;
  state.group = metric().group || "Bat";
  renderCamera();
  renderAll();

  function frame(ts) {
    requestAnimationFrame(frame);
    if (state.playing && lastTs !== null) {
      const next = advanceTime(
        state.time,
        ts - lastTs,
        state.speed,
        playRange(),
        state.loop,
      );
      setTime(next.time);
      if (next.ended) {
        state.playing = false;
        renderPlayback();
      }
    }
    lastTs = ts;
    const k = idx(),
      s = metric();
    if (dirty || k !== lastIndex) {
      scene?.setIndex(k);
      for (const p of phaseProgress) {
        const t = T[k];
        const progress = p.start === p.end
          ? Number(k >= indexAt(T, p.start))
          : clamp((t - p.start) / (p.end - p.start), 0, 1);
        p.button.style.setProperty("--phase-progress", `${progress * 100}%`);
      }
      $("scrub").value = String(k);
      for (const mark of positionMarkers)
        mark.button.setAttribute("aria-pressed", String(mark.index <= k));
      $("scrub").setAttribute(
        "aria-valuetext",
        `${fmtTime(T[k])} relative to contact`,
      );
      $("clock").textContent = fmtTime(T[k]);
      $("scene-phase").textContent = phaseAt(data, lessons, T[k]).name;
      $("scene-time").textContent = fmtTime(T[k]);
      const value = data.signals[s.id]?.[k];
      if ($("detail-value")) {
        $("detail-value").querySelector("strong").textContent = finite(value)
          ? value.toFixed(1)
          : "—";
        $("metric-detail").querySelector(".detail-time").textContent = finite(
          value,
        )
          ? fmtTime(T[k])
          : "No measured sample at this time";
      }
      for (const g of chartNodes) {
        const v = g.values[k];
        g.readout.replaceChildren(
          document.createTextNode(finite(v) ? v.toFixed(1) : "—"),
          textNode("small", g.s.unit),
        );
        g.count.textContent = finite(v)
          ? fmtTime(T[k])
          : "No sample at this time";
        const visible = T[k] >= g.a && T[k] <= g.b;
        g.cursor.style.display = visible ? "" : "none";
        g.point.style.display = visible && finite(v) ? "" : "none";
        g.cursor.setAttribute("x1", g.gx(T[k]));
        g.cursor.setAttribute("x2", g.gx(T[k]));
        if (finite(v)) {
          g.point.setAttribute("cx", g.gx(T[k]));
          g.point.setAttribute("cy", g.gy(v));
        }
      }
      const oc = $("overview-cursor");
      if (oc) {
        const x = 20 + ((T[k] - T[0]) / (T.at(-1) - T[0])) * 960;
        oc.setAttribute("x1", x);
        oc.setAttribute("x2", x);
      }
      lastIndex = k;
      dirty = false;
    }
    if (scene) {
      scene.render();
      const ctx = $("overlay").getContext("2d");
      ctx.clearRect(0, 0, scene.width, scene.height);
      for (const { r, b } of landmarkButtons) {
        b.hidden = !state.annotations || !state.layers.body;
        const p = scene.project(scene.anchor({ kind: "seg", seg: r.seg }, k));
        if (p.behind) b.hidden = true;
        b.style.left = `${p.x}px`;
        b.style.top = `${p.y}px`;
        b.setAttribute("aria-pressed", String(r.id === state.region));
      }
    } else for (const { b } of landmarkButtons) b.hidden = true;
  }
  requestAnimationFrame(frame);
}
init().catch((error) => {
  $("status").hidden = false;
  $("status").textContent = `The exhibit could not start. ${error.message}`;
  console.error(error);
});
