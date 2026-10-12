import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { collide, fly, FT, IN, BAT_R, BALL_R, MAX_OFFSET } from './physics.js?v=ff0e131edc';

// Scene frame is feet with three.js y up: field (x, y, z) -> scene (x, z, -y), so center field is -z.
const BG = '#0f1114';
const ACCENT = '#ffa300';
const BAT_COLOR = '#7bd389';
const GHOST_SMASH = [1.0, 1.1, 1.2, 1.3, 1.4];
const GHOST_COLORS = ['#2c5d8a', '#3f7fb8', '#5aa9e6', '#8cc8f2', '#c2e3fa'];
// Generic park: fence distance by spray angle (deg, - = 3B side), linear between knots.
const FENCE = [[-45, 330], [-22.5, 375], [0, 400], [22.5, 375], [45, 330]];
const SLIDERS = ['pitchMph', 'vaa', 'haa', 'spinRpm', 'spinDir', 'batMph', 'aa', 'ad', 'tilt', 'smash', 'offset'];
const FMT = {
  pitchMph: (v) => `${v}`, vaa: (v) => `${v.toFixed(1)}&deg;`, haa: (v) => `${v.toFixed(1)}&deg;`,
  spinRpm: (v) => `${v}`, spinDir: (v) => `${v}&deg;`, batMph: (v) => `${v}`, aa: (v) => `${v}&deg;`,
  ad: (v) => `${v}&deg;`, tilt: (v) => `${v}&deg;`, smash: (v) => v.toFixed(2), offset: (v) => `${v.toFixed(2)}"`,
};

const $ = (id) => document.getElementById(id);
const state = { hand: 1 };
const toScene = (p) => new THREE.Vector3(p[0] / FT, p[2] / FT, -p[1] / FT);

// ---------- three.js setup ----------
const stage = $('view');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
stage.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);
scene.fog = new THREE.Fog(BG, 500, 1100);
const camera = new THREE.PerspectiveCamera(45, 1, 0.5, 3000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const VIEWS = {
  behind: [[0, 70, 130], [0, 20, -200]],
  side: [[340, 90, -180], [0, 40, -180]],
  top: [[0, 560, -190], [0, 0, -191]],
};
function setView(v) {
  camera.position.set(...VIEWS[v][0]);
  controls.target.set(...VIEWS[v][1]);
  controls.update();
  for (const b of $('views').children) b.setAttribute('aria-pressed', b.dataset.v === v);
}

// Field: grass disc out to the fence, dirt-free line drawing for the diamond, foul lines, fence.
const lineMat = (color, opacity = 1) => new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
const fenceR = (a) => {
  for (let i = 1; i < FENCE.length; i++) {
    if (a <= FENCE[i][0]) {
      const [a0, r0] = FENCE[i - 1], [a1, r1] = FENCE[i];
      return r0 + ((r1 - r0) * (a - a0)) / (a1 - a0);
    }
  }
  return FENCE.at(-1)[1];
};
const sprayPt = (a, r, h = 0) => new THREE.Vector3(r * Math.sin(a * Math.PI / 180), h, -r * Math.cos(a * Math.PI / 180));
{
  const fair = new THREE.Shape([new THREE.Vector2(0, 0)]);
  for (let a = -45; a <= 45; a += 1) { const p = sprayPt(a, fenceR(a)); fair.lineTo(p.x, -p.z); }
  const grass = new THREE.Mesh(new THREE.ShapeGeometry(fair), new THREE.MeshBasicMaterial({ color: '#16241a' }));
  grass.rotation.x = -Math.PI / 2;
  scene.add(grass);
  const fence = [], fenceTop = [];
  for (let a = -45; a <= 45; a += 1) { fence.push(sprayPt(a, fenceR(a))); fenceTop.push(sprayPt(a, fenceR(a), 10)); }
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(fence), lineMat('#4a5562')));
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(fenceTop), lineMat('#4a5562')));
  const diamond = [sprayPt(0, 0), sprayPt(45, 90), sprayPt(0, 127.3), sprayPt(-45, 90), sprayPt(0, 0)];
  scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(diamond), lineMat('#4a5562')));
  for (const a of [-45, 45]) scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([sprayPt(a, 0), sprayPt(a, 330)]), lineMat('#8b939e')));
  for (const r of [100, 200, 300]) {
    const arc = [];
    for (let a = -45; a <= 45; a += 1) arc.push(sprayPt(a, r, 0.1));
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(arc), lineMat('#2a2f37')));
  }
}

const ghosts = GHOST_SMASH.map((_, i) => {
  const l = new THREE.Line(new THREE.BufferGeometry(), lineMat(GHOST_COLORS[i], 0.85));
  scene.add(l);
  return l;
});
const path = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: ACCENT }));
scene.add(path);
const ball = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 12), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
scene.add(ball);
const landing = new THREE.Mesh(new THREE.RingGeometry(4, 6, 32), new THREE.MeshBasicMaterial({ color: ACCENT, side: THREE.DoubleSide }));
landing.rotation.x = -Math.PI / 2;
scene.add(landing);

let flight = null;   // current {pts: Vector3[], time}
let t0 = performance.now();

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function animate(now) {
  requestAnimationFrame(animate);
  controls.update();
  if (flight) {
    // Real-time playback with a one-second hold at the landing spot.
    const f = Math.max(0, Math.min(1, ((now - t0) / 1000) / flight.time));
    ball.position.copy(flight.pts[Math.round(f * (flight.pts.length - 1))]);
    if ((now - t0) / 1000 > flight.time + 1) t0 = now;
  }
  renderer.render(scene, camera);
}

// ---------- contact diagram ----------
const cv = $('contactCv');
function drawContact(r, p) {
  const dpr = window.devicePixelRatio;
  const W = cv.clientWidth, H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  const g = cv.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  // Plane perpendicular to the bat axis: right = toward the pitcher (-uPerp), up = r.e.
  const e1 = r.uPerp.map((x) => -x), e2 = r.e;
  const pr = (v) => [v[0] * e1[0] + v[1] * e1[1] + v[2] * e1[2], v[0] * e2[0] + v[1] * e2[1] + v[2] * e2[2]];
  const S = (W / 2 - 14) / (MAX_OFFSET + BALL_R / IN + 0.6);   // px per inch
  const cx = W / 2 - 18, cy = H / 2;
  const X = (x) => cx + x * S, Y = (y) => cy - y * S;
  const bc = pr(r.n).map((x) => x * MAX_OFFSET);

  g.strokeStyle = '#2a2f37'; g.setLineDash([3, 3]);
  g.beginPath(); g.moveTo(X(-3), Y(0)); g.lineTo(X(5), Y(0)); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#5b4a36'; g.beginPath(); g.arc(X(0), Y(0), (BAT_R / IN) * S, 0, 2 * Math.PI); g.fill();
  g.fillStyle = '#e6e8eb'; g.beginPath(); g.arc(X(bc[0]), Y(bc[1]), (BALL_R / IN) * S, 0, 2 * Math.PI); g.fill();
  g.strokeStyle = '#c0392b'; g.lineWidth = 1;
  g.beginPath(); g.arc(X(bc[0]), Y(bc[1]), (BALL_R / IN) * S * 0.7, -0.6, 0.6); g.stroke();

  const arrow = (from, dir, color, len) => {
    const d = pr(dir), m = Math.hypot(d[0], d[1]) || 1;
    const x0 = X(from[0]), y0 = Y(from[1]), x1 = x0 + (d[0] / m) * len, y1 = y0 - (d[1] / m) * len;
    const a = Math.atan2(y1 - y0, x1 - x0);
    g.strokeStyle = g.fillStyle = color; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    g.beginPath(); g.moveTo(x1, y1);
    g.lineTo(x1 - 8 * Math.cos(a - 0.4), y1 - 8 * Math.sin(a - 0.4));
    g.lineTo(x1 - 8 * Math.cos(a + 0.4), y1 - 8 * Math.sin(a + 0.4)); g.fill();
  };
  const rb = (BALL_R / IN) * S;
  arrow([0, 0], r.vb, BAT_COLOR, 46);
  const vpDir = r.u.map((x, i) => x + r.vb[i]);   // pitch velocity (lab) = u + vb
  const back = pr(vpDir), bm = Math.hypot(back[0], back[1]) || 1;
  arrow([bc[0] - (back[0] / bm) * (rb + 40) / S, bc[1] - (back[1] / bm) * (rb + 40) / S], vpDir, '#8b939e', 34);
  const out = pr(r.v), om = Math.hypot(out[0], out[1]) || 1;
  arrow([bc[0] + (out[0] / om) * (rb + 4) / S, bc[1] + (out[1] / om) * (rb + 4) / S], r.v, ACCENT, 48);

  // Spin about the out-of-page axis (e1 x e2): positive is counter-clockwise on screen.
  const outN = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const w = r.omega[0] * outN[0] + r.omega[1] * outN[1] + r.omega[2] * outN[2];
  const rpm = Math.abs(w) * 60 / (2 * Math.PI);
  if (rpm > 50) {
    const ccw = w > 0, rad = rb + 9, a0 = Math.PI * 0.15, a1 = Math.PI * 0.85;
    g.strokeStyle = g.fillStyle = ACCENT; g.lineWidth = 1.5;
    g.beginPath(); g.arc(X(bc[0]), Y(bc[1]), rad, -a1, -a0); g.stroke();
    const end = ccw ? -a1 : -a0, tip = [X(bc[0]) + rad * Math.cos(end), Y(bc[1]) + rad * Math.sin(end)];
    const tan = end + (ccw ? -Math.PI / 2 : Math.PI / 2);
    g.beginPath(); g.moveTo(tip[0] + 6 * Math.cos(tan), tip[1] + 6 * Math.sin(tan));
    g.lineTo(tip[0] - 4 * Math.cos(tan) + 4 * Math.cos(end), tip[1] - 4 * Math.sin(tan) + 4 * Math.sin(end));
    g.lineTo(tip[0] - 4 * Math.cos(tan) - 4 * Math.cos(end), tip[1] - 4 * Math.sin(tan) - 4 * Math.sin(end)); g.fill();
  }
  g.fillStyle = '#8b939e'; g.font = '11px system-ui, sans-serif';
  g.fillText(`${p.offset >= 0 ? '+' : ''}${p.offset.toFixed(2)}" offset`, 6, H - 8);
  g.fillText('to pitcher →', W - 76, 14);
}

// ---------- update ----------
const fmtInt = (v) => Math.round(v).toLocaleString('en-US');
function update() {
  const p = { hand: state.hand };
  for (const id of SLIDERS) {
    const el = $(id);
    p[id] = parseFloat(el.value);
    el.nextElementSibling.innerHTML = FMT[id](p[id]);
  }
  const r = collide(p);
  const fl = fly(r.v, r.omega);
  flight = { pts: fl.pts.map(toScene), time: fl.time };
  path.geometry.dispose();
  path.geometry = new THREE.BufferGeometry().setFromPoints(flight.pts);
  landing.position.copy(flight.pts.at(-1)).setY(0.2);

  const rows = GHOST_SMASH.map((s, i) => {
    const g = collide({ ...p, smash: s });
    const gf = fly(g.v, g.omega, 0.02);
    ghosts[i].geometry.dispose();
    ghosts[i].geometry = new THREE.BufferGeometry().setFromPoints(gf.pts.map(toScene));
    ghosts[i].visible = Math.abs(s - p.smash) > 0.004;
    return `<tr><td><i style="background:${GHOST_COLORS[i]}"></i>${s.toFixed(2)}</td><td>${g.ev.toFixed(1)}</td><td>${g.la.toFixed(1)}&deg;</td><td>${fmtInt(gf.dist)}</td></tr>`;
  });
  rows.push(`<tr class="cur"><td><i style="background:${ACCENT}"></i>${p.smash.toFixed(2)}</td><td>${r.ev.toFixed(1)}</td><td>${r.la.toFixed(1)}&deg;</td><td>${fmtInt(fl.dist)}</td></tr>`);
  $('smashTable').innerHTML = '<tr><th>Smash</th><th>EV</th><th>LA</th><th>Carry</th></tr>' + rows.join('');

  const side = Math.abs(r.sidespin) < 50 ? '' : r.sidespin > 0 ? ' hook' : ' slice';
  const spray = Math.abs(r.spray) < 0.5 ? 'center' : `${Math.abs(r.spray).toFixed(1)}&deg; ${r.spray > 0 ? 'pull' : 'oppo'}`;
  const fair = Math.abs(r.spray) <= 45 ? '' : ' (foul)';
  $('out').innerHTML = `
    <dt>Exit velo</dt><dd class="big">${r.ev.toFixed(1)} mph</dd>
    <dt>Launch angle</dt><dd class="big">${r.la.toFixed(1)}&deg;</dd>
    <dt>Spray</dt><dd>${spray}${fair}</dd>
    <dt>Carry</dt><dd class="big">${fmtInt(fl.dist)} ft</dd>
    <dt>Hang time / apex</dt><dd>${fl.time.toFixed(1)} s / ${fmtInt(fl.apex)} ft</dd>
    <dt>Backspin</dt><dd>${fmtInt(r.backspin)} rpm</dd>
    <dt>Sidespin</dt><dd>${fmtInt(Math.abs(r.sidespin))} rpm${side}</dd>
    <dt>Gyro spin</dt><dd>${fmtInt(r.gyro)} rpm</dd>
    <dt>Smash (actual)</dt><dd>${r.smashOut.toFixed(2)}</dd>
    <dt>Collision eff. q</dt><dd>${r.q.toFixed(3)}</dd>`;
  $('vbaHint').innerHTML = `Barrel ${Math.abs(r.vba).toFixed(0)}&deg; ${r.vba <= 0 ? 'below' : 'above'} the hands at contact (set by tilt and attack angle; tilt can't be flatter than the attack angle).`;
  drawContact(r, p);
}

for (const id of SLIDERS) $(id).addEventListener('input', update);
for (const b of $('hand').children) b.addEventListener('click', () => {
  state.hand = Number(b.dataset.v);
  for (const c of $('hand').children) c.setAttribute('aria-pressed', c === b);
  update();
});
for (const b of $('views').children) b.addEventListener('click', () => setView(b.dataset.v));
window.addEventListener('resize', () => { resize(); update(); });

resize();
setView('behind');
update();
requestAnimationFrame(animate);
