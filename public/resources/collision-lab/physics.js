// Bat-ball collision + batted-ball flight. Pure functions, no DOM, so node can test them.
//
// Field frame (SI): origin = home plate, +x = toward first base (catcher's right), +y = toward
// center field, +z = up. A right-handed hitter stands on the -x side, so pull = -x for RHH.
//
// Collision model:
//  - Bat = rigid cylinder moving with the sweet-spot velocity (bat speed, attack angle, attack
//    direction). Its long axis lies in the swing plane (set by swing path tilt), perpendicular to
//    the bat's velocity, barrel pointing out over the plate and down.
//  - Normal direction: collision efficiency q, EV = q * v_pitch + (1 + q) * v_bat for a head-on
//    hit (Nathan's formulation). q is solved from the smash factor (EV / bat speed) the user picks.
//  - Tangential direction: friction impulse that drives the contact point toward rolling
//    (ball grips the bat), capped by mu * normal impulse. This is what creates batted spin.

export const MPH = 0.44704;
export const IN = 0.0254;
export const FT = 0.3048;
export const DEG = Math.PI / 180;
export const RPM = (2 * Math.PI) / 60;

const BALL_M = 0.145;
export const BALL_R = 1.45 * IN;
export const BAT_R = 1.3 * IN;       // 2.6 in barrel
const K_BALL = 0.4;           // I = k m R^2
const MU = 0.5;               // ball-bat friction
const RHO = 1.2;              // air density, kg/m^3 (sea level, ~70 F)
const CD = 0.38;            // tuned so 100 mph / 28 deg / 2300 rpm carries ~400 ft
const SPIN_TAU = 25;          // s, spin decay time constant
const G = 9.81;
const CONTACT_Z = 0.8;        // m, contact height above ground
export const MAX_OFFSET = (BAT_R + BALL_R) / IN;   // in, offset at which the ball just grazes

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => mul(a, 1 / norm(a));

// Inputs (degrees, mph, rpm, inches):
//  hand: 1 = RHH, -1 = LHH
//  pitchMph, vaa (negative = descending), haa (+ = moving toward the 1B side)
//  spinRpm, spinDir (deg, direction the spin moves the pitch: 0 = straight up / pure backspin,
//    + = toward the 1B side, - = toward the 3B side; pure transverse spin)
//  batMph, aa (+ = up), ad (+ = toward pull side), tilt (swing plane vs horizontal)
//  offset: inches the ball's center sits ABOVE the bat's center line (+ = bat under the ball)
//  smash: EV / bat speed for a dead-center hit
export function collide(p) {
  const s = p.hand;
  const vbHat = [-s * Math.sin(p.ad * DEG) * Math.cos(p.aa * DEG), Math.cos(p.ad * DEG) * Math.cos(p.aa * DEG), Math.sin(p.aa * DEG)];
  const vb = mul(vbHat, p.batMph * MPH);
  const vp = mul([Math.sin(p.haa * DEG) * Math.cos(p.vaa * DEG), -Math.cos(p.haa * DEG) * Math.cos(p.vaa * DEG), Math.sin(p.vaa * DEG)], p.pitchMph * MPH);

  // Pitch spin: axis = v_hat x movement_hat (pure transverse spin).
  const dir = p.spinDir * DEG;
  const omegaIn = mul(unit(cross(unit(vp), [Math.sin(dir), 0, Math.cos(dir)])), p.spinRpm * RPM);

  // Swing plane: contains vbHat, normal makes angle `tilt` with vertical. A plane through a line
  // rising at aa can't be flatter than aa, so tilt is floored at |aa|.
  const tilt = Math.max(p.tilt, Math.abs(p.aa) + 0.01);
  const ph = unit(cross([0, 0, 1], vbHat));
  const w = cross(vbHat, ph);
  const sinPhi = Math.cos(tilt * DEG) / w[2];
  const cosPhi = Math.sqrt(1 - sinPhi * sinPhi);
  let axis = null;
  for (const c of [cosPhi, -cosPhi]) {
    let a = cross(add(mul(ph, c), mul(w, sinPhi)), vbHat);
    if (a[0] * s < 0) a = mul(a, -1);              // barrel points out over the plate
    if (!axis || a[2] < axis[2]) axis = a;          // and below the hands
  }
  axis = unit(axis);

  // Bat frame: bat at rest, ball approaches with u.
  const u = sub(vp, vb);
  const uPerp = unit(sub(u, mul(axis, dot(u, axis))));
  let e = unit(cross(axis, uPerp));
  if (e[2] < 0) e = mul(e, -1);
  const R = (BAT_R + BALL_R) / IN;
  const d = Math.max(-R + 1e-6, Math.min(R - 1e-6, p.offset));
  const n = unit(add(mul(uPerp, -Math.sqrt(R * R - d * d)), mul(e, d)));   // bat center -> ball center

  const q = ((p.smash - 1) * p.batMph) / (p.pitchMph + p.batMph);
  const un = dot(u, n);
  const r = mul(n, -BALL_R);                                               // ball center -> contact point
  const wc = add(u, cross(omegaIn, r));
  const wt = sub(wc, mul(n, dot(wc, n)));
  let J = mul(wt, (-BALL_M * K_BALL) / (1 + K_BALL));
  const jMax = MU * BALL_M * (1 + q) * Math.abs(un);
  if (norm(J) > jMax) J = mul(J, jMax / norm(J));
  const uOut = add(sub(u, mul(n, (1 + q) * un)), mul(J, 1 / BALL_M));
  const omega = add(omegaIn, mul(cross(r, J), 1 / (K_BALL * BALL_M * BALL_R * BALL_R)));
  const v = add(vb, uOut);

  // Spin split relative to the outgoing direction.
  const vHat = unit(v);
  const back = unit(cross(vHat, [0, 0, 1]));     // + = backspin
  const up = cross(back, vHat);                  // + = ball curves toward -x
  const ev = norm(v) / MPH;
  return {
    v, omega, axis, n, q, ev, u, uPerp, e, vb,
    la: Math.asin(vHat[2]) / DEG,
    spray: (-s * Math.atan2(v[0], v[1])) / DEG,  // + = pull
    backspin: dot(omega, back) / RPM,
    sidespin: (s * dot(omega, up)) / RPM,        // + = curves toward pull (hook)
    gyro: dot(omega, vHat) / RPM,
    smashOut: ev / p.batMph,
    vba: Math.asin(axis[2]) / DEG,
  };
}

// RK4 flight with drag + Magnus, spin decaying exponentially. Returns points every dt until landing.
export function fly(v0, omega0, dt = 0.01) {
  const A = Math.PI * BALL_R * BALL_R;
  const kf = (0.5 * RHO * A) / BALL_M;
  const acc = (vel, t) => {
    const sp = norm(vel);
    const om = mul(omega0, Math.exp(-t / SPIN_TAU));
    const w = norm(om);
    const S = (BALL_R * w) / sp;
    const cl = S > 0 ? 1 / (2.32 + 0.4 / S) : 0;
    let a = add(mul(vel, -kf * CD * sp), [0, 0, -G]);
    if (w > 0) a = add(a, mul(unit(cross(om, vel)), kf * cl * sp * sp));
    return a;
  };
  let pos = [0, 0, CONTACT_Z];
  let vel = v0;
  let t = 0;
  const pts = [pos];
  while (pos[2] > 0 && t < 15) {
    const k1v = acc(vel, t), k1x = vel;
    const k2v = acc(add(vel, mul(k1v, dt / 2)), t + dt / 2), k2x = add(vel, mul(k1v, dt / 2));
    const k3v = acc(add(vel, mul(k2v, dt / 2)), t + dt / 2), k3x = add(vel, mul(k2v, dt / 2));
    const k4v = acc(add(vel, mul(k3v, dt)), t + dt), k4x = add(vel, mul(k3v, dt));
    const prev = pos;
    pos = add(pos, mul(add(add(k1x, mul(k2x, 2)), add(mul(k3x, 2), k4x)), dt / 6));
    vel = add(vel, mul(add(add(k1v, mul(k2v, 2)), add(mul(k3v, 2), k4v)), dt / 6));
    t += dt;
    if (pos[2] <= 0) {   // interpolate to the ground
      const f = prev[2] / (prev[2] - pos[2]);
      pos = add(prev, mul(sub(pos, prev), f));
      t -= dt * (1 - f);
    }
    pts.push(pos);
  }
  return { pts, time: t, dist: Math.hypot(pos[0], pos[1]) / FT, apex: Math.max(...pts.map((q) => q[2])) / FT };
}
