import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene frame: origin = contact, +x = opposite field (spray is handedness-normalized, pull = -x),
// +y = up, -z = toward center field.
// A bin (ev, la, sp) sits at radius ev + 0.5 along launch angle la + 0.5 and spray sp + 0.5 (bin centres).

const BG = '#0f1114';
const ACCENT = '#ffa300';
// ColorBrewer RdYlGn: low = red, mid = yellow, high = green.
const STOPS = ['#d73027', '#f46d43', '#fee08b', '#a6d96a', '#1a9850'];
const METRICS = {
  hit: { title: 'Probability of hit', max: 1, ticks: ['0%', '25%', '50%', '75%', '100%'],
    fmt: (v) => `${Math.round(v * 100)}%` },
  woba: { title: 'wOBAcon', max: 2, ticks: ['0', '.500', '1.000', '1.500', '2.000'],
    fmt: (v) => v.toFixed(3).replace(/^0/, '') },
};
const DEG = Math.PI / 180;
const key = (ev, la, sp) => (ev * 181 + la + 90) * 361 + sp + 180;
// Fade: a bin's color blends toward the background until it holds FADE_N balls (log scale).
const FADE_N = 25;
// 2D slice: EV band half-width and plotted window.
const SLICE_HALF = 2;
const SLICE_SP = [-50, 50];
const SLICE_LA = [-50, 80];
// Share of a band's balls that must sit in cells clearing Min BIP before the slice stops coarsening.
const SLICE_COVERAGE = 0.6;
const DEG_SIGN = String.fromCharCode(176);

const state = { metric: 'hit', pool: 1 };
let base = null;   // all.json: {ev, la, sp, n, hits, woba} + index: Map key -> row
let pooled = null; // {n, hits, woba} after neighbor pooling
let shownIdx = null;
let slice = null;  // {n, hits, woba} Float64Array grids over SLICE_SP x SLICE_LA

const $ = (id) => document.getElementById(id);
const stage = $('stage');

// ---------- three.js setup ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
stage.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);
scene.fog = new THREE.Fog(BG, 280, 900);
const camera = new THREE.PerspectiveCamera(45, 1, 0.5, 2000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;
controls.addEventListener('start', () => { controls.autoRotate = false; });

const VIEWS = {
  catcher: [0, 80, 250],
  side: [280, 40, -45],
  top: [0, 330, -30],
};
function setView(v) {
  camera.position.set(...VIEWS[v]);
  controls.target.set(0, 0, -45);
  controls.update();
}
setView(location.hash.slice(1) in VIEWS ? location.hash.slice(1) : 'catcher');

const bgColor = new THREE.Color(BG);
const lut = [];
{
  const c = STOPS.map((h) => new THREE.Color(h));
  for (let i = 0; i < 256; i++) {
    const t = i / 255 * (c.length - 1);
    const j = Math.min(Math.floor(t), c.length - 2);
    lut.push(new THREE.Color().lerpColors(c[j], c[j + 1], t - j));
  }
}
const lutCss = lut.map((c) => c.getStyle());

// ---------- guides ----------
const dir = (r, la, sp) => new THREE.Vector3(
  r * Math.cos(la * DEG) * Math.sin(sp * DEG), r * Math.sin(la * DEG), -r * Math.cos(la * DEG) * Math.cos(sp * DEG));

function label(text, pos, color = '#aab2bd') {
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 64;
  const ctx = cv.getContext('2d');
  ctx.font = '600 34px system-ui, sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false, fog: false }));
  s.scale.set(26, 6.5, 1);
  s.position.copy(pos);
  return s;
}
{
  const guides = new THREE.Group();
  const lineMat = new THREE.LineBasicMaterial({ color: '#3a414b', fog: false });
  const foulMat = new THREE.LineBasicMaterial({ color: '#6b7380', fog: false });
  for (const sp of [-45, 45]) {
    guides.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([dir(0, 0, 0), dir(128, 0, sp)]), foulMat));
  }
  for (const r of [60, 80, 100, 120]) {
    const ground = [], vert = [];
    for (let a = -45; a <= 45; a++) ground.push(dir(r, 0, a));
    for (let a = -90; a <= 90; a++) vert.push(dir(r, a, 0));
    guides.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(ground), lineMat));
    guides.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vert), lineMat));
    guides.add(label(`${r} mph`, dir(r, 0, 49)));
  }
  guides.add(label('Pull', dir(134, 0, -45)));
  guides.add(label('CF', dir(132, 0, 0)));
  guides.add(label('Oppo', dir(134, 0, 45)));
  guides.add(label('+45\u00b0 LA', dir(122, 45, 0)));
  guides.add(label('-45\u00b0 LA', dir(122, -45, 0)));
  scene.add(guides);
}

// The EV shell the 2D slice is showing, drawn in accent on the 3D view.
const sliceMarker = new THREE.Group();
scene.add(sliceMarker);
const sliceMat = new THREE.LineBasicMaterial({ color: ACCENT, fog: false, transparent: true, opacity: 0.45 });
function drawSliceMarker(ev) {
  for (const c of sliceMarker.children) c.geometry.dispose();
  sliceMarker.clear();
  // Outline of the slice window on the EV shell: bottom edge, right edge, top edge, left edge.
  const r = ev + 0.5, edge = [];
  for (let a = SLICE_SP[0]; a <= SLICE_SP[1]; a++) edge.push(dir(r, SLICE_LA[0], a));
  for (let a = SLICE_LA[0]; a <= SLICE_LA[1]; a++) edge.push(dir(r, a, SLICE_SP[1]));
  for (let a = SLICE_SP[1]; a >= SLICE_SP[0]; a--) edge.push(dir(r, SLICE_LA[1], a));
  for (let a = SLICE_LA[1]; a >= SLICE_LA[0]; a--) edge.push(dir(r, a, SLICE_SP[0]));
  sliceMarker.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(edge), sliceMat));
}

const material = new THREE.PointsMaterial({ size: 1.4, vertexColors: true, sizeAttenuation: true });
const points = new THREE.Points(new THREE.BufferGeometry(), material);
scene.add(points);
const ghostMat = new THREE.PointsMaterial({ size: 1, color: '#8b939e', transparent: true, opacity: 0.05,
  depthWrite: false, sizeAttenuation: true });
const ghost = new THREE.Points(new THREE.BufferGeometry(), ghostMat);
scene.add(ghost);

// ---------- data: all seasons pooled ----------
async function loadAll() {
  base = await (await fetch('data/all.json')).json();
  base.index = new Map();
  for (let i = 0; i < base.n.length; i++) base.index.set(key(base.ev[i], base.la[i], base.sp[i]), i);
  pool();
  $('loading').style.display = 'none';
}

function pool() {
  const k = state.pool;
  if (k === 0) { pooled = base; render(); return; }
  const m = base.n.length;
  const n = new Float64Array(m), hits = new Float64Array(m), woba = new Float64Array(m);
  for (let i = 0; i < m; i++) {
    for (let a = -k; a <= k; a++) for (let b = -k; b <= k; b++) for (let c = -k; c <= k; c++) {
      const j = base.index.get(key(base.ev[i] + a, base.la[i] + b, base.sp[i] + c));
      if (j === undefined) continue;
      n[i] += base.n[j]; hits[i] += base.hits[j]; woba[i] += base.woba[j];
    }
  }
  pooled = { n, hits, woba };
  render();
}

// ---------- render ----------
const val = (id) => Number($(id).value);

function render() {
  const [evMin, evMax, laMin, laMax, spMin, spMax, minN, thresh] =
    ['evMin', 'evMax', 'laMin', 'laMax', 'spMin', 'spMax', 'minN', 'thresh'].map(val);
  const mt = METRICS[state.metric];
  $('thresh').nextElementSibling.textContent = mt.fmt(thresh / 100 * mt.max);
  const num = state.metric === 'hit' ? pooled.hits : pooled.woba;
  const m = base.n.length;
  const pos = new Float32Array(m * 3), col = new Float32Array(m * 3), idx = new Int32Array(m);
  const gpos = new Float32Array(m * 3);
  const color = new THREE.Color();
  let c = 0, g = 0;
  for (let i = 0; i < m; i++) {
    const ev = base.ev[i], la = base.la[i], sp = base.sp[i];
    if (ev < evMin || ev > evMax || la < laMin || la > laMax || sp < spMin || sp > spMax) continue;
    const n = pooled.n[i];
    if (n < minN) continue;
    const r = ev + 0.5, a = (la + 0.5) * DEG, s = (sp + 0.5) * DEG;
    const x = r * Math.cos(a) * Math.sin(s), y = r * Math.sin(a), z = -r * Math.cos(a) * Math.cos(s);
    const frac = num[i] / n / mt.max;
    if (frac * 100 < thresh) {
      gpos[g * 3] = x; gpos[g * 3 + 1] = y; gpos[g * 3 + 2] = z; g++;
      continue;
    }
    pos[c * 3] = x; pos[c * 3 + 1] = y; pos[c * 3 + 2] = z;
    color.copy(lut[Math.min(255, Math.round(frac * 255))]);
    color.lerpColors(bgColor, color, 0.2 + 0.8 * Math.min(1, Math.log1p(n) / Math.log1p(FADE_N)));
    col[c * 3] = color.r; col[c * 3 + 1] = color.g; col[c * 3 + 2] = color.b;
    idx[c] = i;
    c++;
  }
  points.geometry.dispose();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0, c * 3), 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col.subarray(0, c * 3), 3));
  points.geometry = geo;
  ghost.geometry.dispose();
  const ggeo = new THREE.BufferGeometry();
  ggeo.setAttribute('position', new THREE.BufferAttribute(gpos.subarray(0, g * 3), 3));
  ghost.geometry = ggeo;
  shownIdx = idx;
  drawLegend();
  drawSlice();
}

function drawLegend() {
  const mt = METRICS[state.metric];
  $('legTitle').textContent = mt.title;
  $('legBar').style.background = `linear-gradient(90deg, ${STOPS.join(',')})`;
  $('legTicks').innerHTML = mt.ticks.map((t) => `<span>${t}</span>`).join('');
}

// ---------- 2D slice: LA x spray heatmap of one EV band ----------
const sliceCv = $('sliceCv');
const PAD = { l: 34, r: 8, t: 8, b: 30 };
const SW = SLICE_SP[1] - SLICE_SP[0], SH = SLICE_LA[1] - SLICE_LA[0];

function drawSlice() {
  const ev = val('sliceEv');
  const lo = ev - SLICE_HALF, hi = ev + SLICE_HALF;
  $('sliceTitle').textContent = `${lo}-${hi + 1} mph`;
  drawSliceMarker(ev);

  const n = new Float64Array(SW * SH), hits = new Float64Array(SW * SH), woba = new Float64Array(SW * SH);
  for (let i = 0; i < base.n.length; i++) {
    if (base.ev[i] < lo || base.ev[i] > hi) continue;
    const x = base.sp[i] - SLICE_SP[0], y = base.la[i] - SLICE_LA[0];
    if (x < 0 || x >= SW || y < 0 || y >= SH) continue;
    const j = y * SW + x;
    n[j] += base.n[i]; hits[j] += base.hits[i]; woba[j] += base.woba[i];
  }
  // Adaptive cells: use the smallest square cell (1-10 deg) at which most of the band's balls sit in cells that
  // clear Min BIP. Dense bands stay at 1 deg; the sparse top end (116+ mph) coarsens instead of going blank.
  const minN = val('minN');
  let total = 0;
  for (let j = 0; j < n.length; j++) total += n[j];
  for (const c of [1, 2, 3, 4, 5, 6, 8, 10]) {
    const BW = Math.ceil(SW / c), BH = Math.ceil(SH / c);
    const bn = new Float64Array(BW * BH), bh = new Float64Array(BW * BH), bw = new Float64Array(BW * BH);
    for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
      const j = y * SW + x, b = Math.floor(y / c) * BW + Math.floor(x / c);
      bn[b] += n[j]; bh[b] += hits[j]; bw[b] += woba[j];
    }
    let covered = 0;
    for (let b = 0; b < bn.length; b++) if (bn[b] >= minN) covered += bn[b];
    slice = { n: bn, hits: bh, woba: bw, c, BW, BH };
    if (covered >= SLICE_COVERAGE * total) break;
  }
  $('sliceCell').textContent = slice.c > 1 ? ` (${slice.c}${DEG_SIGN} cells)` : '';

  const dpr = window.devicePixelRatio;
  const w = sliceCv.clientWidth, h = sliceCv.clientHeight;
  sliceCv.width = w * dpr; sliceCv.height = h * dpr;
  const ctx = sliceCv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const pw = w - PAD.l - PAD.r, ph = h - PAD.t - PAD.b;
  const cw = pw / SW, ch = ph / SH;
  const mt = METRICS[state.metric];
  const { c, BW, BH } = slice;
  const num = state.metric === 'hit' ? slice.hits : slice.woba;
  for (let by = 0; by < BH; by++) for (let bx = 0; bx < BW; bx++) {
    const b = by * BW + bx;
    if (slice.n[b] < minN || slice.n[b] === 0) continue;
    const x0 = bx * c, x1 = Math.min(SW, x0 + c), y0 = by * c, y1 = Math.min(SH, y0 + c);
    ctx.fillStyle = lutCss[Math.min(255, Math.round(num[b] / slice.n[b] / mt.max * 255))];
    ctx.fillRect(PAD.l + x0 * cw, PAD.t + (SH - y1) * ch, Math.ceil((x1 - x0) * cw), Math.ceil((y1 - y0) * ch));
  }
  // Axes: LA gridlines every 20 deg, foul lines at +/-45, CF at 0.
  ctx.strokeStyle = 'rgba(230,232,235,0.18)';
  ctx.fillStyle = '#8b939e';
  ctx.font = '11px system-ui, sans-serif';
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let la = -40; la <= 80; la += 20) {
    const py = PAD.t + (SLICE_LA[1] - la) * ch;
    ctx.beginPath(); ctx.moveTo(PAD.l, py); ctx.lineTo(PAD.l + pw, py); ctx.stroke();
    ctx.fillText(`${la}\u00b0`, PAD.l - 4, py);
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (const [sp, name] of [[-45, 'Pull'], [0, 'CF'], [45, 'Oppo']]) {
    const px = PAD.l + (sp - SLICE_SP[0]) * cw;
    ctx.beginPath(); ctx.moveTo(px, PAD.t); ctx.lineTo(px, PAD.t + ph); ctx.stroke();
    ctx.fillText(name, px, PAD.t + ph + 4);
  }
  ctx.save();
  ctx.translate(10, PAD.t + ph / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Launch angle', 0, -6);
  ctx.restore();
}

sliceCv.addEventListener('pointermove', (e) => {
  const rect = sliceCv.getBoundingClientRect();
  const pw = rect.width - PAD.l - PAD.r, ph = rect.height - PAD.t - PAD.b;
  const x = Math.floor((e.clientX - rect.left - PAD.l) / pw * SW);
  const y = SH - 1 - Math.floor((e.clientY - rect.top - PAD.t) / ph * SH);
  const tip = $('tip');
  if (x < 0 || x >= SW || y < 0 || y >= SH) { tip.style.display = 'none'; return; }
  const { c, BW } = slice;
  const j = Math.floor(y / c) * BW + Math.floor(x / c), n = slice.n[j];
  if (n < val('minN') || n === 0) { tip.style.display = 'none'; return; }
  // Cell range in degrees; a 1-deg cell shows a single value.
  const range = (v0, lim) => (c === 1 ? `${v0}` : `${v0} to ${Math.min(v0 + c, lim) - 1}`);
  const sp0 = Math.floor(x / c) * c + SLICE_SP[0], la0 = Math.floor(y / c) * c + SLICE_LA[0];
  tip.innerHTML =
    `${$('sliceTitle').textContent} &middot; LA <b>${range(la0, SLICE_LA[1])}${DEG_SIGN}</b> &middot; ` +
    `spray <b>${range(sp0, SLICE_SP[1])}${DEG_SIGN}</b> (${sp0 + c / 2 >= 0 ? 'oppo' : 'pull'})<br>BIP ${n}<br>` +
    `Hit prob <b>${(slice.hits[j] / n * 100).toFixed(1)}%</b> &middot; ` +
    `wOBAcon <b>${(slice.woba[j] / n).toFixed(3).replace(/^0/, '')}</b>`;
  tip.style.display = 'block';
  tip.style.left = `${Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8)}px`;
  tip.style.top = `${e.clientY - tip.offsetHeight - 12}px`;
});
sliceCv.addEventListener('pointerleave', () => { $('tip').style.display = 'none'; });

// ---------- hover (3D) ----------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoverEvent = null;
renderer.domElement.addEventListener('pointermove', (e) => { hoverEvent = e; });
renderer.domElement.addEventListener('pointerleave', () => { hoverEvent = null; $('tip').style.display = 'none'; });

function hover() {
  const e = hoverEvent;
  hoverEvent = null;
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  raycaster.params.Points.threshold = material.size * 0.5;
  const hit = raycaster.intersectObject(points)[0];
  const tip = $('tip');
  if (!hit) { tip.style.display = 'none'; return; }
  const i = shownIdx[hit.index];
  const n = pooled.n[i];
  const side = base.sp[i] >= 0 ? 'oppo' : 'pull';
  tip.innerHTML =
    `EV <b>${base.ev[i]}-${base.ev[i] + 1}</b> mph &middot; LA <b>${base.la[i]}\u00b0</b> &middot; ` +
    `spray <b>${base.sp[i]}\u00b0</b> (${side})<br>` +
    `BIP in bin ${base.n[i]}${state.pool ? `, pooled ${n}` : ''}<br>` +
    `Hit prob <b>${(pooled.hits[i] / n * 100).toFixed(1)}%</b> &middot; ` +
    `wOBAcon <b>${(pooled.woba[i] / n).toFixed(3).replace(/^0/, '')}</b>`;
  tip.style.display = 'block';
  tip.style.left = `${Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 8)}px`;
  tip.style.top = `${e.clientY + 14}px`;
}

// ---------- controls ----------
function segment(id, onPick) {
  $(id).addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) onPick(b.dataset.v, b);
  });
}
function press(id, v) {
  for (const b of $(id).querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.v === v));
}

segment('metric', (v) => { state.metric = v; press('metric', v); render(); });

let pending = false;
for (const inp of document.querySelectorAll('input[type=range]')) {
  const out = inp.nextElementSibling;
  out.textContent = inp.value;
  inp.addEventListener('input', () => {
    out.textContent = inp.value;
    if (inp.id === 'sliceEv') { drawSlice(); return; }
    if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; render(); }); }
  });
}

// ---------- loop ----------
function resize() {
  const { clientWidth: w, clientHeight: h } = stage;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  // Below aspect 0.95 (phones, narrow windows) widen the vertical FOV so the horizontal FOV holds and the
  // cloud's sides stay in frame.
  const minAspect = 0.95;
  camera.fov = camera.aspect >= minAspect ? 45
    : 2 * Math.atan(Math.tan(22.5 * DEG) * minAspect / camera.aspect) / DEG;
  camera.updateProjectionMatrix();
  // Small screens pack more ghost points per pixel; thin them so they stay a faint haze.
  ghostMat.opacity = 0.05 * Math.min(1, Math.max(0.35, w / 1100));
  if (base) drawSlice();
}
window.addEventListener('resize', resize);
resize();

renderer.setAnimationLoop(() => {
  controls.update();
  if (hoverEvent) hover();
  renderer.render(scene, camera);
});

await loadAll();
